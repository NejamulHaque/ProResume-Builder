import Joi from 'joi'

/**
 * validate(schema, property)
 * Returns an Express middleware that validates req[property] against a Joi schema.
 * Responds with 400 if validation fails; calls next() on success.
 *
 * @param {Joi.Schema} schema
 * @param {'body'|'query'|'params'} property - which part of the request to validate
 *
 * Usage:
 *   router.post('/', validate(createResumeSchema, 'body'), handler)
 */
export function validate(schema, property = 'body') {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[property], {
      abortEarly:      false,
      stripUnknown:    true,
      allowUnknown:    false,
    })

    if (error) {
      const messages = error.details.map((d) => d.message).join('; ')
      return res.status(400).json({ error: `Validation failed: ${messages}` })
    }

    // Replace with the sanitised / coerced value
    req[property] = value
    next()
  }
}

// ─── Shared schemas ────────────────────────────────────────────────────────

const VALID_TEMPLATES = ['modern', 'minimal', 'executive', 'creative', 'technical']

export const schemas = {
  createResume: Joi.object({
    title:    Joi.string().trim().min(1).max(120).required(),
    template: Joi.string().valid(...VALID_TEMPLATES).default('modern'),
    data:     Joi.object().default({}),
  }),

  updateResume: Joi.object({
    title:     Joi.string().trim().min(1).max(120),
    template:  Joi.string().valid(...VALID_TEMPLATES),
    data:      Joi.object(),
    is_public: Joi.boolean(),
  }).min(1),   // at least one field required

  updateProfile: Joi.object({
    full_name:  Joi.string().trim().min(1).max(100),
    avatar_url: Joi.string().uri().allow('', null),
  }).min(1),

  uuidParam: Joi.object({
    id: Joi.string().uuid({ version: 'uuidv4' }).required(),
  }),
}
