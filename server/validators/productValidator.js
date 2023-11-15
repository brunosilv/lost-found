const { body, validationResult } = require('express-validator');

// Validate input for creating a product
const createProductValidation = [
  body('type').isString(),
  body('lostTime').isISO8601(),
  body('description').isString(),
  body('color').isString(),
  body('brand').isString(),
];

function handleValidationErrors(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
}

module.exports = { createProductValidation, handleValidationErrors };
