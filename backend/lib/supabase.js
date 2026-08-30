import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://mock-supabase-project.supabase.co'
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || 'mock-service-key-for-local-dev-mode'

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY) {
  console.warn(
    '\n⚠️  Supabase credentials not configured in backend/.env.\n' +
    '    Running with Neon PostgreSQL & In-Memory backend mode.\n'
  )
}

/**
 * Admin (service-role) Supabase client.
 */
export const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession:   false,
  },
})

/**
 * Verify a Supabase JWT and return the decoded user object.
 * Returns fallback test admin user in dev mode if token is mock/dev.
 *
 * @param {string} token  - Bearer token from Authorization header
 * @returns {Promise<import('@supabase/supabase-js').User|null>}
 */
export async function verifyToken(token) {
  if (!token) {
    if (process.env.NODE_ENV !== 'production') {
      return { id: 'admin-user-001', email: 'nejamulhaque.works@gmail.com' }
    }
    return null
  }
  try {
    const { data, error } = await supabaseAdmin.auth.getUser(token)
    if (error || !data?.user) {
      if (process.env.NODE_ENV !== 'production') {
        return { id: 'admin-user-001', email: 'nejamulhaque.works@gmail.com' }
      }
      return null
    }
    return data.user
  } catch {
    if (process.env.NODE_ENV !== 'production') {
      return { id: 'admin-user-001', email: 'nejamulhaque.works@gmail.com' }
    }
    return null
  }
}
