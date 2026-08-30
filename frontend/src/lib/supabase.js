import { createClient } from '@supabase/supabase-js'

const defaultUrl = 'https://placeholder-project.supabase.co'
const defaultKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYWNlaG9sZGVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2MDAwMDAwMDAsImV4cCI6MjAwMDAwMDAwMH0.signature'

// Validate that env URL starts with http:// or https://
const rawEnvUrl = (import.meta.env.VITE_SUPABASE_URL || '').trim()
const isValidHttpUrl = /^https?:\/\//i.test(rawEnvUrl)

const supabaseUrl     = isValidHttpUrl ? rawEnvUrl : defaultUrl
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || defaultKey

export const isLiveSupabase = Boolean(isValidHttpUrl && import.meta.env.VITE_SUPABASE_ANON_KEY)

if (!isLiveSupabase) {
  console.info(
    'ℹ️ [Supabase] Running in local/offline client mode with local database storage & Neon backend. ' +
    'To connect live cloud Supabase, add a valid https:// VITE_SUPABASE_URL to frontend/.env.local.'
  )
}

let clientInstance = null
try {
  clientInstance = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession:    true,
      autoRefreshToken:  true,
      detectSessionInUrl: true,
    },
  })
} catch (e) {
  console.warn('[Supabase] Initializing fallback client:', e)
  clientInstance = createClient(defaultUrl, defaultKey)
}

export const supabase = clientInstance

// ── Local Storage DB Helper for Zero-Setup Offline Dev Mode ────────────────
const STORAGE_KEY_RESUMES = 'proresume_local_resumes'
const STORAGE_KEY_USER    = 'proresume_local_user'

function getLocalResumes() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_RESUMES)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function setLocalResumes(items) {
  try {
    localStorage.setItem(STORAGE_KEY_RESUMES, JSON.stringify(items))
  } catch (e) {
    console.warn('localStorage save failed', e)
  }
}

// ─── Auth ──────────────────────────────────────────────────────────────────

/** Sign in with Google OAuth */
export async function signInWithGoogle() {
  if (!isLiveSupabase) {
    // Mock instant sign in for demo
    const mockUser = {
      id: 'admin-user-001',
      email: 'nejamulhaque.works@gmail.com',
      user_metadata: { full_name: 'Nejamul Haque', avatar_url: '' }
    }
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(mockUser))
    window.location.href = '/dashboard'
    return { data: { user: mockUser }, error: null }
  }

  return supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/dashboard`,
      queryParams: { access_type: 'offline', prompt: 'consent' },
    },
  })
}

/** Sign in with email + password */
export async function signInWithEmail(email, password) {
  if (!isLiveSupabase) {
    const mockUser = {
      id: email === 'nejamulhaque.works@gmail.com' ? 'admin-user-001' : `user-${Date.now()}`,
      email,
      user_metadata: { full_name: email.split('@')[0] }
    }
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(mockUser))
    return { data: { user: mockUser, session: { access_token: 'local-dev-token', user: mockUser } }, error: null }
  }

  return supabase.auth.signInWithPassword({ email, password })
}

/** Register new user with email + password */
export async function signUpWithEmail(email, password, fullName) {
  if (!isLiveSupabase) {
    const mockUser = {
      id: email === 'nejamulhaque.works@gmail.com' ? 'admin-user-001' : `user-${Date.now()}`,
      email,
      user_metadata: { full_name: fullName || email.split('@')[0] }
    }
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(mockUser))
    return { data: { user: mockUser, session: { access_token: 'local-dev-token', user: mockUser } }, error: null }
  }

  return supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName } },
  })
}

/** Sign out current user */
export async function signOut() {
  localStorage.removeItem(STORAGE_KEY_USER)
  if (isLiveSupabase) {
    return supabase.auth.signOut()
  }
  return { error: null }
}

/** Get current session */
export async function getSession() {
  if (!isLiveSupabase) {
    const raw = localStorage.getItem(STORAGE_KEY_USER)
    if (raw) {
      const user = JSON.parse(raw)
      return { access_token: 'local-dev-token', user }
    }
    return null
  }
  const { data } = await supabase.auth.getSession()
  return data.session
}

// ─── Profiles ──────────────────────────────────────────────────────────────

export async function getProfile(userId) {
  if (!isLiveSupabase) {
    const raw = localStorage.getItem(STORAGE_KEY_USER)
    const user = raw ? JSON.parse(raw) : null
    return {
      data: {
        id: userId,
        full_name: user?.user_metadata?.full_name || 'Nejamul Haque',
        avatar_url: user?.user_metadata?.avatar_url || null,
        email: user?.email || 'nejamulhaque.works@gmail.com'
      },
      error: null
    }
  }

  return supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()
}

export async function updateProfile(userId, updates) {
  if (!isLiveSupabase) {
    const raw = localStorage.getItem(STORAGE_KEY_USER)
    if (raw) {
      const user = JSON.parse(raw)
      user.user_metadata = { ...user.user_metadata, ...updates }
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user))
    }
    return { data: updates, error: null }
  }

  return supabase
    .from('profiles')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', userId)
}

// ─── Resumes ───────────────────────────────────────────────────────────────

export async function listResumes(userId) {
  if (!isLiveSupabase) {
    const items = getLocalResumes()
    return { data: items, error: null }
  }

  return supabase
    .from('resumes')
    .select('id, user_id, title, template, is_public, created_at, updated_at')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false })
}

export const getResumes = listResumes

export async function getResume(id) {
  if (!isLiveSupabase) {
    const items = getLocalResumes()
    const found = items.find(r => r.id === id)
    return { data: found || null, error: found ? null : { message: 'Resume not found' } }
  }

  return supabase
    .from('resumes')
    .select('*')
    .eq('id', id)
    .single()
}

export async function getPublicResume(id) {
  if (!isLiveSupabase) {
    const items = getLocalResumes()
    const found = items.find(r => r.id === id)
    return { data: found || null, error: found ? null : { message: 'Public resume not found' } }
  }

  return supabase
    .from('resumes')
    .select('*')
    .eq('id', id)
    .eq('is_public', true)
    .single()
}

export async function createResume(userId, title, template, data) {
  if (!isLiveSupabase) {
    const newResume = {
      id: 'res-' + Math.random().toString(36).slice(2, 10),
      user_id: userId,
      title: title || 'Untitled Resume',
      template: template || 'modern',
      data: data || {},
      is_public: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    const items = getLocalResumes()
    items.unshift(newResume)
    setLocalResumes(items)
    return { data: newResume, error: null }
  }

  return supabase
    .from('resumes')
    .insert([{
      user_id:   userId,
      title:     title    || 'Untitled Resume',
      template:  template || 'modern',
      data:      data     || {},
      is_public: false,
    }])
    .select()
    .single()
}

export async function updateResume(id, updates) {
  if (!isLiveSupabase) {
    const items = getLocalResumes()
    const idx = items.findIndex(r => r.id === id)
    if (idx !== -1) {
      items[idx] = { ...items[idx], ...updates, updated_at: new Date().toISOString() }
      setLocalResumes(items)
      return { data: items[idx], error: null }
    }
    return { data: null, error: { message: 'Resume not found' } }
  }

  return supabase
    .from('resumes')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()
}

export async function deleteResume(id) {
  if (!isLiveSupabase) {
    const items = getLocalResumes().filter(r => r.id !== id)
    setLocalResumes(items)
    return { error: null }
  }

  return supabase
    .from('resumes')
    .delete()
    .eq('id', id)
}

export async function duplicateResume(id, userId) {
  if (!isLiveSupabase) {
    const items = getLocalResumes()
    const orig = items.find(r => r.id === id)
    if (!orig) return { data: null, error: { message: 'Original not found' } }
    const dup = {
      ...orig,
      id: 'res-' + Math.random().toString(36).slice(2, 10),
      title: `${orig.title} (Copy)`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    items.unshift(dup)
    setLocalResumes(items)
    return { data: dup, error: null }
  }

  const { data: orig, error } = await getResume(id)
  if (error || !orig) return { data: null, error }
  return createResume(userId, `${orig.title} (Copy)`, orig.template, orig.data)
}
