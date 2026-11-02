import mongoose from 'mongoose';

const movieSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    tagline: { type: String, default: '' },
    description: { type: String, required: true },
    poster: { type: String, required: true },
    backdrop: { type: String, required: true },
    trailerUrl: { type: String, default: '' },
    genre: [{ type: String }],
    duration: { type: String, required: true },
    releaseDate: { type: String, required: true },
    rating: { type: Number, default: 8.0 },
    votes: { type: String, default: '10K' },
    language: { type: String, default: 'English' },
    certificate: { type: String, default: 'PG-13' },
    featured: { type: Boolean, default: false },
    price: { type: Number, required: true, default: 15 },
    cast: [
      {
        name: { type: String },
        role: { type: String },
        photo: { type: String }
      }
    ]
  },
  { timestamps: true }
);

export const MovieModel = mongoose.models.Movie || mongoose.model('Movie', movieSchema);
export default MovieModel;
