import express from 'express';
import { getCourts, getCourtAvailability, getCourtBookings, getCourtBlocks } from '../controllers/courtsController.js';
const router = express.Router();

// GET /api/courts - Lista todas las canchas
router.get('/', getCourts);

// GET /api/courts/:id/availability - Consulta la disponibilidad horaria de una cancha
router.get('/:id/availability', getCourtAvailability);

// GET /api/courts/:id/bookings - Lista reservas de una cancha
router.get('/:id/bookings', getCourtBookings);

// GET /api/courts/:id/blocks - Lista bloqueos de una cancha
router.get('/:id/blocks', getCourtBlocks);

export default router; 