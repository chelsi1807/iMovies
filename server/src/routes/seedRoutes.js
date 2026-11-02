import express from 'express';
import { dbStore } from '../data/dbStore.js';
import { getDbStatus } from '../config/db.js';

const router = express.Router();

router.post('/reset', (req, res) => {
  dbStore.seed();
  res.status(200).json({
    success: true,
    message: 'Database reseeded successfully with full demo movies, showtimes, and users!'
  });
});

router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    timestamp: new Date().toISOString(),
    database: getDbStatus(),
    counts: {
      movies: dbStore.find('movies').length,
      theaters: dbStore.find('theaters').length,
      showtimes: dbStore.find('showtimes').length,
      bookings: dbStore.find('bookings').length,
      users: dbStore.find('users').length
    }
  });
});

export default router;
