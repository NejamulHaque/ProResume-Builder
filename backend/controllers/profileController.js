import { supabaseAdmin } from '../lib/supabase.js'
import { createHttpError } from '../middleware/errorHandler.js'

/**
 * GET /api/profiles/me
 * Return the authenticated user's profile row.
 */
export async function getMyProfile(req, res) {
  const { data, error } = await supabaseAdmin
    .from('profiles')
    .select('*')
    .eq('id', req.user.id)
    .single()

  if (error || !data) {
    // Profile row might not exist yet (race condition at signup) — create it
    const { data: created, error: createErr } = await supabaseAdmin
      .from('profiles')
      .upsert({
        id:         req.user.id,
        email:      req.user.email,
        full_name:  req.user.user_metadata?.full_name ?? req.user.user_metadata?.name ?? null,
        avatar_url: req.user.user_metadata?.avatar_url ?? null,
      })
      .select()
      .single()

    if (createErr) throw createHttpError(500, createErr.message)
    return res.json({ profile: created })
  }

  res.json({ profile: data })
}

/**
 * PATCH /api/profiles/me
 * Update name and/or avatar_url of the authenticated user's profile.
 */
export async function updateMyProfile(req, res) {
  const { data, error } = await supabaseAdmin
    .from('profiles')
    .update(req.body)           // sanitised by validate middleware
    .eq('id', req.user.id)
    .select()
    .single()

  if (error) throw createHttpError(400, error.message)
  res.json({ profile: data, message: 'Profile updated' })
}

/**
 * GET /api/profiles/stats
 * Return aggregated stats for the authenticated user.
 */
export async function getMyStats(req, res) {
  const userId = req.user.id

  // Fetch resumes
  const { data: resumes = [], error: resumeErr } = await supabaseAdmin
    .from('resumes')
    .select('id, template, is_public, created_at, updated_at')
    .eq('user_id', userId)

  if (resumeErr) throw createHttpError(500, resumeErr.message)

  // Fetch view counts for this user's public resumes
  const resumeIds = resumes.map((r) => r.id)
  let totalViews  = 0

  if (resumeIds.length > 0) {
    const { count, error: viewErr } = await supabaseAdmin
      .from('resume_views')
      .select('*', { count: 'exact', head: true })
      .in('resume_id', resumeIds)

    if (!viewErr) totalViews = count ?? 0
  }

  // Template usage breakdown
  const templateUsage = resumes.reduce((acc, r) => {
    acc[r.template] = (acc[r.template] ?? 0) + 1
    return acc
  }, {})

  res.json({
    stats: {
      totalResumes:  resumes.length,
      publicResumes: resumes.filter((r) => r.is_public).length,
      totalViews,
      lastEdited:    resumes[0]?.updated_at ?? null,
      templateUsage,
    },
  })
}
