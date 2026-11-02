import express from 'express';
import {
  getTheaters,
  getShowtimes,
  getShowtimeById,
  createShowtime,
  deleteShowtime
} from '../controllers/showtimeController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

router.get('/theaters', getTheaters);
router.get('/', getShowtimes);
router.get('/:id', getShowtimeById);
router.post('/', protect, adminOnly, createShowtime);
router.delete('/:id', protect, adminOnly, deleteShowtime);

export default router;
