import { TheaterModel } from '../models/Theater.js';
import { ShowtimeModel } from '../models/Showtime.js';
import { MovieModel } from '../models/Movie.js';
import { getDbStatus } from '../config/db.js';
import { dbStore } from '../data/dbStore.js';

const useMongo = () => getDbStatus().isMongoConnected;

// ─── GET /api/theaters ───────────────────────────────────────────────────────
export const getTheaters = async (req, res) => {
  try {
    let theaters;
    if (useMongo()) {
      theaters = await TheaterModel.find({}).lean();
    } else {
      theaters = dbStore.find('theaters');
    }
    res.status(200).json({ success: true, count: theaters.length, theaters });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── GET /api/showtimes ──────────────────────────────────────────────────────
export const getShowtimes = async (req, res) => {
  try {
    const { movieId, date, theaterId } = req.query;
    let showtimes;

    if (useMongo()) {
      const query = {};
      if (movieId)   query.movieId   = movieId;
      if (date)      query.date      = date;
      if (theaterId) query.theaterId = theaterId;
      showtimes = await ShowtimeModel.find(query).lean();
    } else {
      showtimes = dbStore.find('showtimes');
      if (movieId)   showtimes = showtimes.filter(s => s.movieId === movieId);
      if (date)      showtimes = showtimes.filter(s => s.date === date);
      if (theaterId) showtimes = showtimes.filter(s => s.theaterId === theaterId);
    }

    res.status(200).json({ success: true, count: showtimes.length, showtimes });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── GET /api/showtimes/:id ──────────────────────────────────────────────────
export const getShowtimeById = async (req, res) => {
  try {
    let showtime, movie, theater;

    if (useMongo()) {
      showtime = await ShowtimeModel.findById(req.params.id).lean();
      if (!showtime) return res.status(404).json({ success: false, message: 'Showtime not found.' });
      movie   = await MovieModel.findById(showtime.movieId).lean();
      theater = await TheaterModel.findById(showtime.theaterId).lean();
    } else {
      showtime = dbStore.findById('showtimes', req.params.id);
      if (!showtime) return res.status(404).json({ success: false, message: 'Showtime not found.' });
      movie   = dbStore.findById('movies',   showtime.movieId);
      theater = dbStore.findById('theaters', showtime.theaterId);
    }

    res.status(200).json({ success: true, showtime: { ...showtime, movie, theater } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── POST /api/showtimes ─────────────────────────────────────────────────────
export const createShowtime = async (req, res) => {
  try {
    const { movieId, theaterId, screenName, date, time, priceTiers } = req.body;
    if (!movieId || !theaterId || !date || !time) {
      return res.status(400).json({ success: false, message: 'Movie, theater, date, and time are required.' });
    }

    let movie, theater;
    if (useMongo()) {
      movie   = await MovieModel.findById(movieId).lean();
      theater = await TheaterModel.findById(theaterId).lean();
    } else {
      movie   = dbStore.findById('movies',   movieId);
      theater = dbStore.findById('theaters', theaterId);
    }

    if (!movie || !theater) {
      return res.status(404).json({ success: false, message: 'Movie or theater not found.' });
    }

    const payload = {
      movieId,
      theaterId,
      theaterName: theater.name,
      movieTitle:  movie.title,
      screenName:  screenName || theater.screens[0] || 'Screen 1',
      date,
      time,
      priceTiers: priceTiers || {
        Silver: movie.price,
        Gold:   Math.round(movie.price * 1.35),
        VIP:    Math.round(movie.price * 1.8)
      },
      bookedSeats: [],
      totalSeats:  64
    };

    let newShowtime;
    if (useMongo()) {
      newShowtime = await ShowtimeModel.create(payload);
    } else {
      newShowtime = dbStore.create('showtimes', payload);
    }

    res.status(201).json({ success: true, message: 'Showtime scheduled successfully!', showtime: newShowtime });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── DELETE /api/showtimes/:id ───────────────────────────────────────────────
export const deleteShowtime = async (req, res) => {
  try {
    let deleted;
    if (useMongo()) {
      deleted = await ShowtimeModel.findByIdAndDelete(req.params.id);
    } else {
      const existing = dbStore.findById('showtimes', req.params.id);
      if (existing) deleted = dbStore.findByIdAndDelete('showtimes', req.params.id);
    }
    if (!deleted) return res.status(404).json({ success: false, message: 'Showtime not found.' });
    res.status(200).json({ success: true, message: 'Showtime deleted successfully!' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
