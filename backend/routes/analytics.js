import { Router } from 'express'
import { requireAuth }       from '../middleware/auth.js'
import { asyncHandler }      from '../middleware/errorHandler.js'
import { validate, schemas } from '../middleware/validate.js'
import {
  getDashboardAnalytics,
  getResumeViews,
} from '../controllers/analyticsController.js'

const router = Router()

// ── GET /api/analytics/dashboard ──────────────────────────────────────
// High-level stats for the authenticated user's dashboard.
router.get(
  '/dashboard',
  requireAuth,
  asyncHandler(getDashboardAnalytics),
)

// ── GET /api/analytics/resume/:id/views ───────────────────────────────
// View count + daily breakdown for a specific resume (owner only).
router.get(
  '/resume/:id/views',
  requireAuth,
  validate(schemas.uuidParam, 'params'),
  asyncHandler(getResumeViews),
)

export default router
