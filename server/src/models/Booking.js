import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    showtimeId: { type: String, required: true },
    movieTitle: { type: String, required: true },
    moviePoster: { type: String },
    theaterName: { type: String, required: true },
    screenName: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    seats: [{ type: String, required: true }],
    tier: { type: String, default: 'Silver' },
    ticketPrice: { type: Number, required: true },
    subtotal: { type: Number, required: true },
    tax: { type: Number, default: 0 },
    snacks: [
      {
        item: { type: String },
        qty: { type: Number },
        price: { type: Number }
      }
    ],
    totalAmount: { type: Number, required: true },
    paymentMethod: { type: String, default: 'Card' },
    paymentStatus: { type: String, enum: ['PAID', 'CANCELLED', 'REFUNDED'], default: 'PAID' },
    bookingCode: { type: String, required: true, unique: true }
  },
  { timestamps: true }
);

export const BookingModel = mongoose.models.Booking || mongoose.model('Booking', bookingSchema);
export default BookingModel;
