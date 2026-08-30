import { Router } from 'express'
import { supabaseAdmin } from '../lib/supabase.js'

const router = Router()

/**
 * GET /health
 * Returns service status and a lightweight Supabase connectivity check.
 */
router.get('/', async (_req, res) => {
  let dbStatus = 'ok'

  try {
    // Lightweight ping — select nothing, just test connectivity
    const { error } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .limit(1)
      .maybeSingle()

    if (error) dbStatus = 'degraded'
  } catch {
    dbStatus = 'unreachable'
  }

  const status = dbStatus === 'ok' ? 200 : 503

  res.status(status).json({
    status:      dbStatus === 'ok' ? 'healthy' : 'degraded',
    service:     'ProResume API',
    version:     '1.0.0',
    environment: process.env.NODE_ENV ?? 'development',
    database:    dbStatus,
    timestamp:   new Date().toISOString(),
    uptime:      `${Math.floor(process.uptime())}s`,
  })
})

export default router
