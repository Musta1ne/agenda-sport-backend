import express from 'express';
import { getSports } from '../controllers/sportsController.js';
const router = express.Router();

// GET /api/sports - Lista los deportes
router.get('/', getSports);

export default router; 