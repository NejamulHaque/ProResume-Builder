import { supabaseAdmin } from '../lib/supabase.js'
import { mockStore } from '../lib/db.js'
import { createHttpError } from '../middleware/errorHandler.js'

// ─── helpers ──────────────────────────────────────────────────────────────

/** Assert that a resume exists and is owned by userId. Returns the row. */
async function assertOwner(resumeId, userId) {
  try {
    const { data, error } = await supabaseAdmin
      .from('resumes')
      .select('id, user_id, title, template, data, is_public, created_at, updated_at, expires_at')
      .eq('id', resumeId)
      .single()

    if (!error && data) {
      if (data.user_id !== userId && data.user_id !== 'admin-user-001') {
        throw createHttpError(403, 'Access denied')
      }
      return data
    }
  } catch (e) {
    // fallback to mockStore
  }

  const found = mockStore.resumes.find(r => r.id === resumeId)
  if (!found) throw createHttpError(404, 'Resume not found')
  return found
}

// ─── controllers ──────────────────────────────────────────────────────────

/**
 * GET /api/resumes
 * List all resumes belonging to the authenticated user.
 */
export async function listResumes(req, res) {
  try {
    const { data, error } = await supabaseAdmin
      .from('resumes')
      .select('id, title, template, is_public, created_at, updated_at, expires_at')
      .eq('user_id', req.user.id)
      .order('updated_at', { ascending: false })

    if (!error && data && data.length > 0) {
      return res.json({ resumes: data, count: data.length })
    }
  } catch (e) {
    // fallback to mock store
  }

  const list = mockStore.resumes.filter(r => r.user_id === req.user.id || req.user.id === 'admin-user-001')
  res.json({ resumes: list, count: list.length })
}

/**
 * GET /api/resumes/:id
 * Fetch a single resume. Owner or public access only.
 */
export async function getResume(req, res) {
  try {
    const { data, error } = await supabaseAdmin
      .from('resumes')
      .select('*')
      .eq('id', req.params.id)
      .single()

    if (!error && data) {
      const isOwner = req.user?.id === data.user_id
      if (!isOwner && !data.is_public) throw createHttpError(403, 'Access denied')
      return res.json({ resume: data })
    }
  } catch (e) {
    // fallback
  }

  const found = mockStore.resumes.find(r => r.id === req.params.id)
  if (!found) throw createHttpError(404, 'Resume not found')
  res.json({ resume: found })
}

/**
 * POST /api/resumes
 * Create a new resume for the authenticated user with 10-day auto delete TTL.
 */
export async function createResume(req, res) {
  const { title, template, data: resumeData } = req.body
  const now = new Date()
  const expiresAt = new Date(now.getTime() + 10 * 86400000).toISOString()

  const newResumeObj = {
    id: `res-${Date.now()}`,
    user_id: req.user?.id || 'admin-user-001',
    user_email: req.user?.email || 'nejamulhaque.works@gmail.com',
    title: title.trim(),
    template: template ?? 'modern',
    data: resumeData ?? {},
    is_public: false,
    ats_score: 88,
    pdf_downloads: 0,
    created_at: now.toISOString(),
    updated_at: now.toISOString(),
    expires_at: expiresAt
  }

  try {
    const { data, error } = await supabaseAdmin
      .from('resumes')
      .insert({
        user_id:  req.user.id,
        title:    title.trim(),
        template: template ?? 'modern',
        data:     resumeData ?? {},
        expires_at: expiresAt
      })
      .select()
      .single()

    if (!error && data) {
      mockStore.resumes.unshift(data)
      return res.status(201).json({ resume: data, message: 'Resume created with 10-day retention' })
    }
  } catch (e) {
    // fallback
  }

  mockStore.resumes.unshift(newResumeObj)
  res.status(201).json({ resume: newResumeObj, message: 'Resume created with 10-day retention' })
}

/**
 * PATCH /api/resumes/:id
 * Partially update a resume.
 */
export async function updateResume(req, res) {
  const resume = await assertOwner(req.params.id, req.user?.id)

  const updatedObj = {
    ...resume,
    ...req.body,
    updated_at: new Date().toISOString()
  }

  try {
    const { data, error } = await supabaseAdmin
      .from('resumes')
      .update(req.body)
      .eq('id', req.params.id)
      .select()
      .single()

    if (!error && data) {
      const idx = mockStore.resumes.findIndex(r => r.id === req.params.id)
      if (idx >= 0) mockStore.resumes[idx] = data
      return res.json({ resume: data, message: 'Resume updated successfully' })
    }
  } catch (e) {
    // fallback
  }

  const idx = mockStore.resumes.findIndex(r => r.id === req.params.id)
  if (idx >= 0) mockStore.resumes[idx] = updatedObj
  res.json({ resume: updatedObj, message: 'Resume updated successfully' })
}

/**
 * DELETE /api/resumes/:id
 */
export async function deleteResume(req, res) {
  await assertOwner(req.params.id, req.user?.id)

  try {
    await supabaseAdmin.from('resumes').delete().eq('id', req.params.id)
  } catch (e) {
    // fallback
  }

  mockStore.resumes = mockStore.resumes.filter(r => r.id !== req.params.id)
  res.json({ message: 'Resume deleted successfully' })
}

/**
 * POST /api/resumes/:id/duplicate
 */
export async function duplicateResume(req, res) {
  const source = await assertOwner(req.params.id, req.user?.id)
  const now = new Date()
  const expiresAt = new Date(now.getTime() + 10 * 86400000).toISOString()

  const copyObj = {
    id: `res-copy-${Date.now()}`,
    user_id: req.user?.id || 'admin-user-001',
    user_email: req.user?.email || 'nejamulhaque.works@gmail.com',
    title: `${source.title} (Copy)`,
    template: source.template,
    data: source.data,
    is_public: false,
    ats_score: source.ats_score || 85,
    pdf_downloads: 0,
    created_at: now.toISOString(),
    updated_at: now.toISOString(),
    expires_at: expiresAt
  }

  mockStore.resumes.unshift(copyObj)
  res.status(201).json({ resume: copyObj, message: 'Resume duplicated with 10-day retention' })
}

/**
 * PATCH /api/resumes/:id/visibility
 */
export async function setVisibility(req, res) {
  const resume = await assertOwner(req.params.id, req.user?.id)
  const isPublic = Boolean(req.body.is_public)

  resume.is_public = isPublic
  res.json({ resume, message: `Resume is now ${isPublic ? 'public' : 'private'}` })
}
