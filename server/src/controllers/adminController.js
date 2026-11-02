import { MovieModel } from '../models/Movie.js';
import { ShowtimeModel } from '../models/Showtime.js';
import { BookingModel } from '../models/Booking.js';
import { UserModel } from '../models/User.js';
import { getDbStatus } from '../config/db.js';
import { dbStore } from '../data/dbStore.js';

const useMongo = () => getDbStatus().isMongoConnected;

export const getDashboardStats = async (req, res) => {
  try {
    let movies, showtimes, bookings, users;

    if (useMongo()) {
      [movies, showtimes, bookings, users] = await Promise.all([
        MovieModel.find({}).lean(),
        ShowtimeModel.find({}).lean(),
        BookingModel.find({}).lean(),
        UserModel.find({}).lean()
      ]);
    } else {
      movies    = dbStore.find('movies');
      showtimes = dbStore.find('showtimes');
      bookings  = dbStore.find('bookings');
      users     = dbStore.find('users');
    }

    const validBookings     = bookings.filter(b => b.paymentStatus === 'PAID');
    const totalRevenue      = validBookings.reduce((sum, b) => sum + (Number(b.totalAmount) || 0), 0);
    const totalTicketsSold  = validBookings.reduce((sum, b) => sum + (b.seats ? b.seats.length : 0), 0);

    const movieStats = movies.map(m => {
      const movieBookings = validBookings.filter(b => b.movieTitle === m.title);
      const tickets  = movieBookings.reduce((sum, b) => sum + (b.seats ? b.seats.length : 0), 0);
      const revenue  = movieBookings.reduce((sum, b) => sum + (Number(b.totalAmount) || 0), 0);
      return {
        id:      m._id,
        title:   m.title,
        poster:  m.poster,
        rating:  m.rating,
        tickets,
        revenue: Math.round(revenue * 100) / 100
      };
    }).sort((a, b) => b.revenue - a.revenue);

    const recentBookings = [...bookings]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 10);

    res.status(200).json({
      success: true,
      stats: {
        totalRevenue:      Math.round(totalRevenue * 100) / 100,
        totalTicketsSold,
        totalBookings:     bookings.length,
        activeMoviesCount: movies.length,
        totalUsers:        users.length,
        totalShowtimes:    showtimes.length,
        movieStats,
        recentBookings
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
