import mongoose from 'mongoose';

const theaterSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    location: { type: String, required: true },
    city: { type: String, required: true },
    screens: [{ type: String }],
    facilities: [{ type: String }]
  },
  { timestamps: true }
);

export const TheaterModel = mongoose.models.Theater || mongoose.model('Theater', theaterSchema);
export default TheaterModel;
