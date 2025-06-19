import express from 'express';
import { createBooking, getBooking, updateBooking, deleteBooking, getAllBookings, getBookingStats, downloadBookingsJson } from '../controllers/bookingsController.js';
import path from 'path';
import fs from 'fs';
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

import path from 'path';
import fs from 'fs';

// ... otras rutas ...

// Endpoint temporal para descargar la base de datos SQLite real en producción
router.get('/download-db', (req, res) => {
  if (process.env.NODE_ENV !== 'production') {
    return res.status(403).json({ error: 'Solo disponible en producción' });
  }
  const dbPath = '/tmp/database.sqlite';
  if (!fs.existsSync(dbPath)) {
    return res.status(404).json({ error: 'Archivo de base de datos no encontrado' });
  }
  res.download(dbPath, 'database.sqlite');
});

export default router; 