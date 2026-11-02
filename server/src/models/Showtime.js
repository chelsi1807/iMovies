import mongoose from 'mongoose';

const showtimeSchema = new mongoose.Schema(
  {
    movieId: { type: String, required: true },
    theaterId: { type: String, required: true },
    theaterName: { type: String, required: true },
    movieTitle: { type: String, required: true },
    screenName: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    priceTiers: {
      Silver: { type: Number, default: 15 },
      Gold: { type: Number, default: 20 },
      VIP: { type: Number, default: 27 }
    },
    bookedSeats: [
      {
        seatNumber: { type: String, required: true },
        tier: { type: String, default: 'Silver' },
        user: { type: String },
        bookingId: { type: String }
      }
    ],
    totalSeats: { type: Number, default: 64 }
  },
  { timestamps: true }
);

export const ShowtimeModel = mongoose.models.Showtime || mongoose.model('Showtime', showtimeSchema);
export default ShowtimeModel;
