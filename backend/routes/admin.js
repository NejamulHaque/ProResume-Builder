import { Router } from 'express'
import {
  requireAdmin,
  getAdminStats,
  triggerManualPurge,
  getAdminUsers,
  getAdminResumes,
  getDbHealth
} from '../controllers/adminController.js'
import { asyncHandler } from '../middleware/errorHandler.js'

const router = Router()

// All admin routes pass through requireAdmin check
router.use(requireAdmin)

// Analytics KPI metrics & interactive charts data
router.get('/stats', asyncHandler(getAdminStats))

// Resumes list with 10-day expiration countdown
router.get('/resumes', asyncHandler(getAdminResumes))

// Users directory
router.get('/users', asyncHandler(getAdminUsers))

// Manual 10-day auto-delete purge trigger
router.post('/cleanup', asyncHandler(triggerManualPurge))

// Neon DB diagnostics
router.get('/db-health', asyncHandler(getDbHealth))

export default router
