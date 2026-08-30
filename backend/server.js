import express      from 'express'
import cors         from 'cors'
import helmet       from 'helmet'
import rateLimit    from 'express-rate-limit'
import dotenv       from 'dotenv'

import healthRoutes    from './routes/health.js'
import resumeRoutes    from './routes/resumes.js'
import profileRoutes   from './routes/profiles.js'
import analyticsRoutes from './routes/analytics.js'
import adminRoutes     from './routes/admin.js'
import { errorHandler } from './middleware/errorHandler.js'
import { initDatabaseSchema, startAutoDeleteWorker } from './lib/db.js'

dotenv.config()

// ─── App setup ────────────────────────────────────────────────────────────
const app  = express()
const PORT = process.env.PORT ?? 3001
const FRONTEND_URL = process.env.FRONTEND_URL ?? 'http://localhost:5173'

// ─── Security headers ─────────────────────────────────────────────────────
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}))

// ─── CORS ─────────────────────────────────────────────────────────────────
app.use(cors({
  origin:      true, // allow frontend dev & production
  credentials: true,
  methods:     ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-admin-email', 'x-dev-admin'],
}))

// ─── Body parsing ──────────────────────────────────────────────────────────
app.use(express.json({ limit: '2mb' }))
app.use(express.urlencoded({ extended: true, limit: '2mb' }))

// ─── Global rate limits ────────────────────────────────────────────────────
const generalLimiter = rateLimit({
  windowMs:        15 * 60 * 1000,  // 15 min
  max:             300,
  standardHeaders: true,
  legacyHeaders:   false,
  message:         { error: 'Too many requests — please slow down.' },
})

const writeLimiter = rateLimit({
  windowMs:        15 * 60 * 1000,
  max:             60,              // tighter for write operations
  standardHeaders: true,
  legacyHeaders:   false,
  message:         { error: 'Write rate limit exceeded — try again shortly.' },
})

app.use(generalLimiter)

// ─── Request logger (dev only) ─────────────────────────────────────────────
if (process.env.NODE_ENV !== 'production') {
  app.use((req, _res, next) => {
    console.log(`  ${req.method.padEnd(6)} ${req.path}`)
    next()
  })
}

// ─── Routes ───────────────────────────────────────────────────────────────
app.use('/health',          healthRoutes)
app.use('/api/resumes',     writeLimiter, resumeRoutes)
app.use('/api/profiles',    profileRoutes)
app.use('/api/analytics',   analyticsRoutes)
app.use('/api/admin',       adminRoutes)

// ─── 404 catcher ──────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ error: 'Route not found' })
})

// ─── Global error handler (must be last) ──────────────────────────────────
app.use(errorHandler)

const server = app.listen(PORT, async () => {
  console.log('\n  ╔════════════════════════════════════════════════════╗')
  console.log(`  ║   ProResume API    →  http://localhost:${PORT}        ║`)
  console.log(`  ║   Environment     →  ${(process.env.NODE_ENV ?? 'development').padEnd(14)}        ║`)
  console.log(`  ║   Admin Access    →  nejamulhaque.works@gmail.com  ║`)
  console.log(`  ║   10-Day Retention →  Active (Auto-Purge Enabled)  ║`)
  console.log('  ╚════════════════════════════════════════════════════╝\n')

  await initDatabaseSchema().catch(console.error)
  startAutoDeleteWorker(30)
})

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.log(`ℹ️ Port ${PORT} is already in use by an active instance.`)
  } else {
    console.error('Server error:', err)
  }
})

export default app
