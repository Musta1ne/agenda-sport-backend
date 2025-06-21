import express from 'express';
import {
  getCourts,
  getCourtById,
  createCourt,
  updateCourt,
  deleteCourt,
  getCourtAvailability,
  getCourtBookings,
} from '../controllers/courtsController.js';
import { validateCourt } from '../middleware/validation.js';

const router = express.Router();

router.route('/')
  .get(getCourts)
  .post(validateCourt, createCourt);

router.route('/:id')
  .get(getCourtById)
  .put(validateCourt, updateCourt)
  .delete(deleteCourt);

router.get('/:id/availability', getCourtAvailability);
router.get('/:id/bookings', getCourtBookings);

export default router; 