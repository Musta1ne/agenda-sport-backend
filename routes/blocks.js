import express from 'express';
import { createBlock } from '../controllers/blocksController.js';
const router = express.Router();

// POST /api/blocks - Crear bloqueo
router.post('/', createBlock);

export default router; 