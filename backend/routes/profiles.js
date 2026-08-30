import { Router } from 'express'
import { requireAuth }       from '../middleware/auth.js'
import { asyncHandler }      from '../middleware/errorHandler.js'
import { validate, schemas } from '../middleware/validate.js'
import {
  getMyProfile,
  updateMyProfile,
  getMyStats,
} from '../controllers/profileController.js'

const router = Router()

// ── GET /api/profiles/me ───────────────────────────────────────────────
// Returns the authenticated user's profile row.
router.get(
  '/me',
  requireAuth,
  asyncHandler(getMyProfile),
)

// ── PATCH /api/profiles/me ─────────────────────────────────────────────
// Update full_name and/or avatar_url.
router.patch(
  '/me',
  requireAuth,
  validate(schemas.updateProfile, 'body'),
  asyncHandler(updateMyProfile),
)

// ── GET /api/profiles/stats ────────────────────────────────────────────
// Aggregated stats: total resumes, public count, view count, template usage.
router.get(
  '/stats',
  requireAuth,
  asyncHandler(getMyStats),
)

export default router
