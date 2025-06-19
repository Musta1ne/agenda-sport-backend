import express from 'express';
import { createBlock, getBlocks, updateBlock, deleteBlock } from '../controllers/blocksController.js';
const router = express.Router();

// POST /api/blocks - Crear bloqueo
router.post('/', createBlock);

// GET /api/blocks - Listar todos los bloques/horarios
router.get('/', getBlocks);

// PUT /api/blocks/:id - Editar bloque/horario
router.put('/:id', updateBlock);

// DELETE /api/blocks/:id - Eliminar bloque/horario
router.delete('/:id', deleteBlock);

export default router; 