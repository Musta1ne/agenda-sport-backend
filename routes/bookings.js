import express from 'express';
import {
  getAllBookings,
  getBookingById,
  createBooking,
  updateBooking,
  deleteBooking,
} from '../controllers/bookingsController.js';
import { validateBooking } from '../middleware/validation.js';

const router = express.Router();

router.route('/')
  .get(getAllBookings)
  .post(validateBooking, createBooking);

router.route('/:id')
  .get(getBookingById)
  .put(updateBooking)
  .delete(deleteBooking);

export default router;