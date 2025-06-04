const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { verifyToken } = require('../middlewares/authMiddleware');

// Todas las rutas requieren autenticación
router.use(verifyToken);

// Rutas de reservas
router.post('/', bookingController.create);
router.get('/:id', bookingController.getById);
router.put('/:id', bookingController.update);
router.delete('/:id', bookingController.delete);

// Ruta para obtener reservas de un usuario específico
router.get('/users/:id/bookings', bookingController.getUserBookings);

module.exports = router;