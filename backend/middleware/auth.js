import { verifyToken } from '../lib/supabase.js'

/**
 * requireAuth
 * Extracts and verifies the Supabase JWT from the Authorization header.
 * On success, attaches `req.user` (the Supabase User object) and calls next().
 * On failure, responds with 401.
 */
export async function requireAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization ?? ''

    if (!authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'Missing or malformed Authorization header. Expected: Bearer <token>',
      })
    }

    const token = authHeader.slice(7).trim()
    const user  = await verifyToken(token)

    if (!user) {
      return res.status(401).json({ error: 'Invalid or expired token' })
    }

    req.user = user
    next()
  } catch (err) {
    console.error('[requireAuth]', err.message)
    res.status(401).json({ error: 'Authentication failed' })
  }
}

/**
 * optionalAuth
 * Like requireAuth but never blocks the request.
 * Sets req.user to the verified User or null.
 */
export async function optionalAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization ?? ''
    if (authHeader.startsWith('Bearer ')) {
      const token = authHeader.slice(7).trim()
      req.user = await verifyToken(token)
    } else {
      req.user = null
    }
  } catch {
    req.user = null
  }
  next()
}
