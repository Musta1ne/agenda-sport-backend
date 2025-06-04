const { body, param, validationResult } = require('express-validator');

// Middleware para manejar errores de validación
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Validaciones para usuario
const validateUser = {
  create: [
    body('name')
      .trim()
      .notEmpty()
      .withMessage('El nombre es requerido')
      .isLength({ min: 2 })
      .withMessage('El nombre debe tener al menos 2 caracteres'),
    body('email')
      .trim()
      .notEmpty()
      .withMessage('El email es requerido')
      .isEmail()
      .withMessage('El email debe tener un formato válido')
      .normalizeEmail(),
    body('password')
      .trim()
      .notEmpty()
      .withMessage('La contraseña es requerida')
      .isLength({ min: 6 })
      .withMessage('La contraseña debe tener al menos 6 caracteres'),
    handleValidationErrors
  ]
};

// Validaciones para venue (establecimiento)
const validateVenue = {
  create: [
    body('name')
      .trim()
      .notEmpty()
      .withMessage('El nombre es requerido')
      .isLength({ min: 2 })
      .withMessage('El nombre debe tener al menos 2 caracteres'),
    body('location')
      .trim()
      .notEmpty()
      .withMessage('La ubicación es requerida'),
    handleValidationErrors
  ],
  update: [
    param('id').isInt().withMessage('ID inválido'),
    body('name')
      .optional()
      .trim()
      .notEmpty()
      .isLength({ min: 2 })
      .withMessage('El nombre debe tener al menos 2 caracteres'),
    body('location')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('La ubicación no puede estar vacía'),
    handleValidationErrors
  ]
};

// Validaciones para court (cancha)
const validateCourt = {
  create: [
    body('name')
      .trim()
      .notEmpty()
      .withMessage('El nombre es requerido'),
    body('venueId')
      .isInt()
      .withMessage('ID de venue inválido'),
    body('sportId')
      .isInt()
      .withMessage('ID de deporte inválido'),
    handleValidationErrors
  ],
  update: [
    param('id').isInt().withMessage('ID inválido'),
    body('name')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('El nombre no puede estar vacío'),
    body(['venueId', 'sportId'])
      .optional()
      .isInt()
      .withMessage('ID inválido'),
    handleValidationErrors
  ]
};

// Validaciones para sport (deporte)
const validateSport = {
  create: [
    body('name')
      .trim()
      .notEmpty()
      .withMessage('El nombre es requerido')
      .isLength({ min: 2 })
      .withMessage('El nombre debe tener al menos 2 caracteres'),
    handleValidationErrors
  ],
  update: [
    param('id').isInt().withMessage('ID inválido'),
    body('name')
      .trim()
      .notEmpty()
      .withMessage('El nombre es requerido')
      .isLength({ min: 2 })
      .withMessage('El nombre debe tener al menos 2 caracteres'),
    handleValidationErrors
  ]
};

// Validaciones para booking (reserva)
const validateBooking = {
  create: [
    body('courtId')
      .isInt()
      .withMessage('ID de cancha inválido'),
    body('date')
      .trim()
      .notEmpty()
      .withMessage('La fecha es requerida')
      .matches(/^\d{4}-\d{2}-\d{2}$/)
      .withMessage('La fecha debe tener formato YYYY-MM-DD')
      .custom(value => {
        const date = new Date(value);
        return !isNaN(date.getTime());
      })
      .withMessage('Fecha inválida'),
    body('hour')
      .trim()
      .notEmpty()
      .withMessage('La hora es requerida')
      .matches(/^([01]\d|2[0-3]):[0-5]\d$/)
      .withMessage('La hora debe tener formato HH:mm (24h)'),
    handleValidationErrors
  ],
  update: [
    param('id').isInt().withMessage('ID inválido'),
    body('date')
      .optional()
      .trim()
      .matches(/^\d{4}-\d{2}-\d{2}$/)
      .withMessage('La fecha debe tener formato YYYY-MM-DD')
      .custom(value => {
        const date = new Date(value);
        return !isNaN(date.getTime());
      })
      .withMessage('Fecha inválida'),
    body('hour')
      .optional()
      .trim()
      .matches(/^([01]\d|2[0-3]):[0-5]\d$/)
      .withMessage('La hora debe tener formato HH:mm (24h)'),
    handleValidationErrors
  ]
};

module.exports = {
  validateUser,
  validateVenue,
  validateCourt,
  validateSport,
  validateBooking
};