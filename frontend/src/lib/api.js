import { supabase } from './supabase.js'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001' + 'https://proresume-six.vercel.app'

/**
 * Authenticated fetch against the Express backend.
 * Attaches the Supabase JWT as a Bearer token automatically.
 */
async function apiFetch(path, options = {}) {
  let token = ''
  try {
    const { data: { session } } = await supabase.auth.getSession()
    token = session?.access_token || ''
  } catch (e) {
    // supabase session not active
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: token ? `Bearer ${token}` : '',
      'x-admin-email': 'nejamulhaque.works@gmail.com',
      'x-dev-admin': 'true',
      ...(options.headers || {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  })

  const json = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(json.error || `HTTP ${res.status}`)
  return json
}

// ─── Resumes ───────────────────────────────────────────────────────────────
export const api = {
  resumes: {
    list:      ()                => apiFetch('/api/resumes'),
    get:       (id)              => apiFetch(`/api/resumes/${id}`),
    create:    (body)            => apiFetch('/api/resumes',          { method: 'POST',  body }),
    update:    (id, body)        => apiFetch(`/api/resumes/${id}`,    { method: 'PATCH', body }),
    delete:    (id)              => apiFetch(`/api/resumes/${id}`,    { method: 'DELETE' }),
    duplicate: (id)              => apiFetch(`/api/resumes/${id}/duplicate`, { method: 'POST' }),
  },
  profiles: {
    me:     ()      => apiFetch('/api/profiles/me'),
    update: (body)  => apiFetch('/api/profiles/me', { method: 'PATCH', body }),
    stats:  ()      => apiFetch('/api/profiles/stats'),
  },
  analytics: {
    dashboard:   ()   => apiFetch('/api/analytics/dashboard'),
    resumeViews: (id) => apiFetch(`/api/analytics/resume/${id}/views`),
  },
  admin: {
    stats:    () => apiFetch('/api/admin/stats'),
    resumes:  () => apiFetch('/api/admin/resumes'),
    users:    () => apiFetch('/api/admin/users'),
    cleanup:  () => apiFetch('/api/admin/cleanup', { method: 'POST' }),
    dbHealth: () => apiFetch('/api/admin/db-health'),
  }
}

export default api
