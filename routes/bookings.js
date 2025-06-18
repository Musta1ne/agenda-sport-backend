import express from 'express';
import { createBooking, getBooking, updateBooking, deleteBooking, getAllBookings } from '../controllers/bookingsController.js';
const router = express.Router();

// POST /api/bookings - Crear reserva
router.post('/', createBooking);

// GET /api/bookings/:id - Obtener detalles de una reserva
router.get('/:id', getBooking);

// PUT /api/bookings/:id - Modificar reserva
router.put('/:id', updateBooking);

// DELETE /api/bookings/:id - Cancelar reserva
router.delete('/:id', deleteBooking);

// GET /api/bookings - Listar todas las reservas
router.get('/', getAllBookings);

export default router; 