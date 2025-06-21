import { body, validationResult } from 'express-validator';
import { db } from '../models/index.js';

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

const validateSport = [
  body('nombre')
    .trim()
    .notEmpty().withMessage('El nombre del deporte es obligatorio.')
    .isLength({ min: 3 }).withMessage('El nombre debe tener al menos 3 caracteres.'),
  handleValidationErrors,
];

const validateCourt = [
  body('nombre')
    .trim()
    .notEmpty().withMessage('El nombre de la cancha es obligatorio.'),
  body('tipo')
    .trim()
    .notEmpty().withMessage('El tipo de cancha es obligatorio.'),
  body('tipo_superficie')
    .trim()
    .notEmpty().withMessage('El tipo de superficie es obligatorio.'),
  body('estado')
    .trim()
    .notEmpty().withMessage('El estado es obligatorio.'),
  body('precio')
    .isFloat({ gt: 0 }).withMessage('El precio debe ser un número positivo.'),
  body('imagen')
    .optional({ checkFalsy: true })
    .isURL().withMessage('La imagen debe ser una URL válida.'),
  body('id_deporte')
    .notEmpty().withMessage('El id_deporte es obligatorio.')
    .isInt().withMessage('El ID del deporte debe ser un número entero.')
    .custom(async (value) => {
      const sport = await db.Sport.findByPk(value);
      if (!sport) {
        throw new Error('El deporte especificado no existe.');
      }
      return true;
    }),
  handleValidationErrors,
];

const validateSchedule = [
  body('id_cancha')
    .notEmpty().withMessage('El ID de la cancha es obligatorio.')
    .isInt().withMessage('El ID de la cancha debe ser un número entero.')
    .custom(async (value) => {
      const court = await db.Court.findByPk(value);
      if (!court) throw new Error('La cancha especificada no existe.');
    }),
  body('dia_semana')
    .notEmpty().withMessage('El día de la semana es obligatorio.')
    .isIn(['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo', 'todos'])
    .withMessage('Día de la semana no válido.'),
  body('hora_inicio')
    .notEmpty().withMessage('La hora de inicio es obligatoria.')
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/).withMessage('El formato de hora debe ser HH:MM.'),
  body('hora_fin')
    .notEmpty().withMessage('La hora de fin es obligatoria.')
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/).withMessage('El formato de hora debe ser HH:MM.')
    .custom((value, { req }) => {
      if (value <= req.body.hora_inicio) {
        throw new Error('La hora de fin debe ser posterior a la hora de inicio.');
      }
      return true;
    }),
  body('activo')
    .optional()
    .isBoolean().withMessage('El estado activo debe ser un valor booleano.'),
  handleValidationErrors,
];

const validateBooking = [
  body('id_cancha')
    .notEmpty().withMessage('El ID de la cancha es obligatorio.')
    .isInt().withMessage('El ID de la cancha debe ser un número entero.')
    .custom(async (value) => {
      const court = await db.Court.findByPk(value);
      if (!court) throw new Error('La cancha especificada no existe.');
      return true;
    }),
  body('fecha')
    .notEmpty().withMessage('La fecha es obligatoria.')
    .isDate({ format: 'YYYY-MM-DD' }).withMessage('El formato de fecha debe ser YYYY-MM-DD.'),
  body('hora_inicio')
    .notEmpty().withMessage('La hora de inicio es obligatoria.')
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/).withMessage('El formato de hora debe ser HH:MM.'),
  body('hora_fin')
    .notEmpty().withMessage('La hora de fin es obligatoria.')
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/).withMessage('El formato de hora debe ser HH:MM.'),
  body('nombre_usuario')
    .trim()
    .notEmpty().withMessage('El nombre de usuario es obligatorio.'),
  body('telefono')
    .trim()
    .notEmpty().withMessage('El teléfono es obligatorio.'),
  handleValidationErrors
];

export { validateSport, validateCourt, validateSchedule, validateBooking }; 