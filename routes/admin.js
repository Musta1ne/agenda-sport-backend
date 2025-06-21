import { Router } from 'express';
import { dumpDatabase } from '../controllers/adminController.js';

const router = Router();

// @desc    Devuelve un volcado completo de la base de datos
// @route   GET /api/admin/dump-database?secret=<tu_clave_secreta>
router.get('/dump-database', dumpDatabase);

export default router; 