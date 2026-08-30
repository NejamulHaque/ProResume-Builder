import { Router } from 'express'
import { requireAuth, optionalAuth } from '../middleware/auth.js'
import { asyncHandler }              from '../middleware/errorHandler.js'
import { validate, schemas }         from '../middleware/validate.js'
import {
  listResumes,
  getResume,
  createResume,
  updateResume,
  deleteResume,
  duplicateResume,
  setVisibility,
} from '../controllers/resumeController.js'

const router = Router()

// ── List all resumes for the authenticated user ─────────────────────────
router.get(
  '/',
  requireAuth,
  asyncHandler(listResumes),
)

// ── Get a single resume (owner or public) ──────────────────────────────
router.get(
  '/:id',
  validate(schemas.uuidParam, 'params'),
  optionalAuth,
  asyncHandler(getResume),
)

// ── Create a new resume ────────────────────────────────────────────────
router.post(
  '/',
  requireAuth,
  validate(schemas.createResume, 'body'),
  asyncHandler(createResume),
)

// ── Partially update a resume ──────────────────────────────────────────
router.patch(
  '/:id',
  requireAuth,
  validate(schemas.uuidParam, 'params'),
  validate(schemas.updateResume, 'body'),
  asyncHandler(updateResume),
)

// ── Delete a resume ────────────────────────────────────────────────────
router.delete(
  '/:id',
  requireAuth,
  validate(schemas.uuidParam, 'params'),
  asyncHandler(deleteResume),
)

// ── Duplicate a resume ─────────────────────────────────────────────────
router.post(
  '/:id/duplicate',
  requireAuth,
  validate(schemas.uuidParam, 'params'),
  asyncHandler(duplicateResume),
)

// ── Toggle public / private visibility ────────────────────────────────
router.patch(
  '/:id/visibility',
  requireAuth,
  validate(schemas.uuidParam, 'params'),
  asyncHandler(setVisibility),
)

export default router
