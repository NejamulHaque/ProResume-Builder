/**
 * asyncHandler
 * Wraps an async route handler so that any rejected promise is forwarded
 * to Express's next(err) instead of causing an unhandled rejection.
 *
 * Usage:
 *   router.get('/path', asyncHandler(async (req, res) => { ... }))
 */
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next)
}

/**
 * Global error handler middleware.
 * Must be registered LAST in the Express app (after all routes).
 */
export function errorHandler(err, req, res, _next) {
  const status  = err.status ?? err.statusCode ?? 500
  const isProd  = process.env.NODE_ENV === 'production'
  const message = isProd && status >= 500 ? 'Internal server error' : (err.message ?? 'Unknown error')

  // Log server errors
  if (status >= 500) {
    console.error(`[${new Date().toISOString()}] ${req.method} ${req.path} → ${status}`, err)
  }

  res.status(status).json({
    error: message,
    ...(isProd ? {} : { stack: err.stack }),
  })
}

/**
 * createHttpError — convenience factory for shaped HTTP errors.
 * Usage:  throw createHttpError(404, 'Resume not found')
 */
export function createHttpError(status, message) {
  const err = new Error(message)
  err.status = status
  return err
}
