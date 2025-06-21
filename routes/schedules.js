import express from 'express';
import {
  getSchedules,
  getScheduleById,
  createSchedule,
  updateSchedule,
  deleteSchedule
} from '../controllers/schedulesController.js';
import { validateSchedule } from '../middleware/validation.js';

const router = express.Router();

// GET /api/schedules - Listar todos los horarios fijos
router.route('/')
  .get(getSchedules)
  .post(validateSchedule, createSchedule);

// PUT /api/schedules/:id - Editar horario fijo
router.route('/:id')
  .get(getScheduleById)
  .put(validateSchedule, updateSchedule)
  .delete(deleteSchedule);

export default router; 