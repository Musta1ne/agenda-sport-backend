import express from 'express';
import { getSchedules, createSchedule, updateSchedule, deleteSchedule } from '../controllers/schedulesController.js';
const router = express.Router();

// GET /api/schedules - Listar todos los horarios fijos
router.get('/', getSchedules);

// POST /api/schedules - Crear horario fijo
router.post('/', createSchedule);

// PUT /api/schedules/:id - Editar horario fijo
router.put('/:id', updateSchedule);

// DELETE /api/schedules/:id - Eliminar horario fijo
router.delete('/:id', deleteSchedule);

export default router; 