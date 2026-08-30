import { supabaseAdmin } from '../lib/supabase.js'
import { createHttpError } from '../middleware/errorHandler.js'

/**
 * GET /api/analytics/dashboard
 * High-level analytics for the authenticated user's dashboard.
 */
export async function getDashboardAnalytics(req, res) {
  const userId = req.user.id

  const { data: resumes = [], error } = await supabaseAdmin
    .from('resumes')
    .select('id, template, is_public, created_at')
    .eq('user_id', userId)

  if (error) throw createHttpError(500, error.message)

  // Templates used
  const templateUsage = resumes.reduce((acc, r) => {
    acc[r.template] = (acc[r.template] ?? 0) + 1
    return acc
  }, {})

  // Resumes created per day (last 30 days)
  const creationByDay = resumes.reduce((acc, r) => {
    const day = r.created_at.slice(0, 10)   // 'YYYY-MM-DD'
    acc[day]  = (acc[day] ?? 0) + 1
    return acc
  }, {})

  res.json({
    userId,
    totalResumes:   resumes.length,
    publicResumes:  resumes.filter((r) => r.is_public).length,
    templateUsage,
    creationByDay,
  })
}

/**
 * GET /api/analytics/resume/:id/views
 * View count and breakdown for a specific resume.
 * Only the owner may access this endpoint.
 */
export async function getResumeViews(req, res) {
  const resumeId = req.params.id

  // Verify ownership
  const { data: resume, error: resumeErr } = await supabaseAdmin
    .from('resumes')
    .select('user_id, title, is_public')
    .eq('id', resumeId)
    .single()

  if (resumeErr || !resume) throw createHttpError(404, 'Resume not found')
  if (resume.user_id !== req.user.id) throw createHttpError(403, 'Access denied')

  // Fetch view records
  const { data: views = [], error: viewErr } = await supabaseAdmin
    .from('resume_views')
    .select('viewed_at')
    .eq('resume_id', resumeId)
    .order('viewed_at', { ascending: false })
    .limit(500)

  if (viewErr) throw createHttpError(500, viewErr.message)

  // Group by day
  const viewsByDay = views.reduce((acc, v) => {
    const day = v.viewed_at.slice(0, 10)
    acc[day]  = (acc[day] ?? 0) + 1
    return acc
  }, {})

  res.json({
    resumeId,
    resumeTitle:  resume.title,
    isPublic:     resume.is_public,
    totalViews:   views.length,
    viewsByDay,
    recentViews:  views.slice(0, 20).map((v) => v.viewed_at),
  })
}
