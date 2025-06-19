import express from 'express';
import { createBlock, getBlocks, updateBlock, deleteBlock } from '../controllers/blocksController.js';
import { getSchedules, createSchedule, updateSchedule, deleteSchedule } from '../controllers/schedulesController.js';
const router = express.Router();

// POST /api/blocks - Crear bloqueo
router.post('/', createBlock);

// GET /api/blocks - Listar todos los bloques/horarios
router.get('/', getBlocks);

// PUT /api/blocks/:id - Editar bloque/horario
router.put('/:id', updateBlock);

// DELETE /api/blocks/:id - Eliminar bloque/horario
router.delete('/:id', deleteBlock);

// GET /api/schedules - Listar todos los horarios fijos
router.get('/schedules', getSchedules);

// POST /api/schedules - Crear horario fijo
router.post('/schedules', createSchedule);

// PUT /api/schedules/:id - Editar horario fijo
router.put('/schedules/:id', updateSchedule);

// DELETE /api/schedules/:id - Eliminar horario fijo
router.delete('/schedules/:id', deleteSchedule);

export default router; 