import { BookingModel } from '../models/Booking.js';
import { ShowtimeModel } from '../models/Showtime.js';
import { MovieModel } from '../models/Movie.js';
import { getDbStatus } from '../config/db.js';
import { dbStore } from '../data/dbStore.js';

const useMongo = () => getDbStatus().isMongoConnected;

// ─── POST /api/bookings ──────────────────────────────────────────────────────
export const createBooking = async (req, res) => {
  try {
    const { showtimeId, seats, tier, snacks, paymentMethod } = req.body;
    const userId = req.user._id.toString();

    if (!showtimeId || !seats || !Array.isArray(seats) || seats.length === 0) {
      return res.status(400).json({ success: false, message: 'Please select showtime and at least one seat.' });
    }

    let showtime, movie;

    if (useMongo()) {
      showtime = await ShowtimeModel.findById(showtimeId);
      if (!showtime) return res.status(404).json({ success: false, message: 'Selected showtime does not exist.' });
      movie = await MovieModel.findById(showtime.movieId).lean();
    } else {
      showtime = dbStore.findById('showtimes', showtimeId);
      if (!showtime) return res.status(404).json({ success: false, message: 'Selected showtime does not exist.' });
      movie = dbStore.findById('movies', showtime.movieId);
    }

    // Concurrency check
    const alreadyBooked = showtime.bookedSeats || [];
    const conflictSeats = seats.filter(seat =>
      alreadyBooked.some(b => b.seatNumber.toUpperCase() === seat.toUpperCase())
    );
    if (conflictSeats.length > 0) {
      return res.status(409).json({
        success: false,
        message: `Seat(s) ${conflictSeats.join(', ')} were just reserved by another guest. Please pick other seats.`,
        conflictSeats
      });
    }

    // Pricing
    const seatTier = tier || 'Silver';
    const singleTicketPrice = (showtime.priceTiers && showtime.priceTiers[seatTier]) || 15;
    const subtotal = singleTicketPrice * seats.length;

    let snacksTotal = 0;
    const validatedSnacks = Array.isArray(snacks) ? snacks.map(s => {
      const lineTotal = (Number(s.price) || 0) * (Number(s.qty) || 1);
      snacksTotal += lineTotal;
      return { item: s.item, qty: Number(s.qty) || 1, price: Number(s.price) || 0 };
    }) : [];

    const tax         = Math.round((subtotal + snacksTotal) * 0.1 * 100) / 100;
    const totalAmount = Math.round((subtotal + snacksTotal + tax) * 100) / 100;

    const randomHex   = Math.random().toString(36).substring(2, 6).toUpperCase();
    const moviePrefix = (showtime.movieTitle || 'IMV').substring(0, 4).toUpperCase().replace(/[^A-Z]/g, '');
    const bookingCode = `IMV-${moviePrefix}-${randomHex}-${Date.now().toString().slice(-4)}`;

    const bookingPayload = {
      userId,
      showtimeId,
      movieTitle:  showtime.movieTitle,
      moviePoster: movie ? movie.poster : '',
      theaterName: showtime.theaterName,
      screenName:  showtime.screenName,
      date:        showtime.date,
      time:        showtime.time,
      seats,
      tier:          seatTier,
      ticketPrice:   singleTicketPrice,
      subtotal,
      tax,
      snacks:        validatedSnacks,
      totalAmount,
      paymentMethod: paymentMethod || 'Mock Card / Apple Pay',
      paymentStatus: 'PAID',
      bookingCode
    };

    let newBooking;
    if (useMongo()) {
      newBooking = await BookingModel.create(bookingPayload);
      newBooking = newBooking.toObject();

      // Mark seats in showtime
      const updatedSeats = [...alreadyBooked];
      seats.forEach(s => updatedSeats.push({ seatNumber: s.toUpperCase(), tier: seatTier, user: userId, bookingId: newBooking._id.toString() }));
      await ShowtimeModel.findByIdAndUpdate(showtimeId, { bookedSeats: updatedSeats });
    } else {
      newBooking = dbStore.create('bookings', { ...bookingPayload, createdAt: new Date().toISOString() });
      const updatedSeats = [...alreadyBooked];
      seats.forEach(s => updatedSeats.push({ seatNumber: s.toUpperCase(), tier: seatTier, user: userId, bookingId: newBooking._id }));
      dbStore.findByIdAndUpdate('showtimes', showtimeId, { bookedSeats: updatedSeats });
    }

    res.status(201).json({ success: true, message: 'Tickets booked successfully! Enjoy your movie!', booking: newBooking });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── GET /api/bookings/my ────────────────────────────────────────────────────
export const getMyBookings = async (req, res) => {
  try {
    const userId = req.user._id.toString();
    let bookings;

    if (useMongo()) {
      bookings = await BookingModel.find({ userId }).sort({ createdAt: -1 }).lean();
    } else {
      bookings = dbStore.find('bookings').filter(b => b.userId === userId);
      bookings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    res.status(200).json({ success: true, count: bookings.length, bookings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── GET /api/bookings/:id ───────────────────────────────────────────────────
export const getBookingById = async (req, res) => {
  try {
    let booking;
    if (useMongo()) {
      booking = await BookingModel.findById(req.params.id).lean();
    } else {
      booking = dbStore.findById('bookings', req.params.id);
    }
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found.' });

    const bUserId = booking.userId?.toString();
    const rUserId = req.user._id?.toString();
    if (bUserId !== rUserId && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Unauthorized to view this booking.' });
    }

    res.status(200).json({ success: true, booking });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── DELETE /api/bookings/:id/cancel ────────────────────────────────────────
export const cancelBooking = async (req, res) => {
  try {
    let booking;
    if (useMongo()) {
      booking = await BookingModel.findById(req.params.id).lean();
    } else {
      booking = dbStore.findById('bookings', req.params.id);
    }
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found.' });

    const bUserId = booking.userId?.toString();
    const rUserId = req.user._id?.toString();
    if (bUserId !== rUserId && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Unauthorized to cancel this booking.' });
    }
    if (booking.paymentStatus === 'CANCELLED') {
      return res.status(400).json({ success: false, message: 'This booking is already cancelled.' });
    }

    const bookingId = booking._id?.toString();

    if (useMongo()) {
      // Release seats
      const showtime = await ShowtimeModel.findById(booking.showtimeId);
      if (showtime) {
        const remaining = showtime.bookedSeats.filter(b => b.bookingId?.toString() !== bookingId);
        await ShowtimeModel.findByIdAndUpdate(booking.showtimeId, { bookedSeats: remaining });
      }
      await BookingModel.findByIdAndUpdate(req.params.id, { paymentStatus: 'CANCELLED' });
      booking = await BookingModel.findById(req.params.id).lean();
    } else {
      const showtime = dbStore.findById('showtimes', booking.showtimeId);
      if (showtime && showtime.bookedSeats) {
        const remaining = showtime.bookedSeats.filter(b => b.bookingId !== bookingId);
        dbStore.findByIdAndUpdate('showtimes', showtime._id, { bookedSeats: remaining });
      }
      booking = dbStore.findByIdAndUpdate('bookings', booking._id, { paymentStatus: 'CANCELLED' });
    }

    res.status(200).json({ success: true, message: 'Booking cancelled and seats have been released.', booking });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
