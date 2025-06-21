import express from 'express';
import {
  getAllSports,
  getSportById,
  createSport,
  updateSport,
  deleteSport,
} from '../controllers/sportsController.js';
import { validateSport } from '../middleware/validation.js';

const router = express.Router();

// Rutas para Deportes
router.route('/')
  .get(getAllSports)
  .post(validateSport, createSport);

router.route('/:id')
  .get(getSportById)
  .put(validateSport, updateSport)
  .delete(deleteSport);

export default router; 