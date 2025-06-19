import express from 'express';
import { createBooking, getBooking, updateBooking, deleteBooking, getAllBookings, getBookingStats, downloadBookingsJson } from '../controllers/bookingsController.js';
const router = express.Router();

// POST /api/bookings - Crear reserva
router.post('/', createBooking);

// GET /api/bookings/stats - Obtener estadísticas de reservas
router.get('/stats', getBookingStats);

// GET /api/bookings/:id - Obtener detalles de una reserva
router.get('/:id', getBooking);

// PUT /api/bookings/:id - Modificar reserva
router.put('/:id', updateBooking);

// DELETE /api/bookings/:id - Cancelar reserva
router.delete('/:id', deleteBooking);

// GET /api/bookings - Listar todas las reservas
router.get('/', getAllBookings);

// GET /api/bookings/download-json - Descargar el archivo JSON de reservas (solo producción)
router.get('/download-json', downloadBookingsJson);

export default router; 