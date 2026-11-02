/**
 * seedAtlas.js
 * One-time script to populate MongoDB Atlas with all seed data.
 * Run: node src/scripts/seedAtlas.js
 */
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../../.env') });

// Import models
import { MovieModel } from '../models/Movie.js';
import { TheaterModel } from '../models/Theater.js';
import { ShowtimeModel } from '../models/Showtime.js';

// Import seed data
import { getSeedData } from '../data/seedData.js';

const seed = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri || uri.includes('127.0.0.1')) {
      throw new Error('MONGODB_URI is not set to Atlas in .env file!');
    }

    console.log('🔗 Connecting to MongoDB Atlas...');
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 });
    console.log('✅ Connected to MongoDB Atlas!\n');

    const data = getSeedData();

    // ── Clear old data ──
    console.log('🗑️  Clearing existing collections...');
    await Promise.all([
      MovieModel.deleteMany({}),
      TheaterModel.deleteMany({}),
      ShowtimeModel.deleteMany({})
    ]);
    console.log('   Cleared: movies, theaters, showtimes\n');

    // ── Seed theaters ──
    console.log('🏟️  Seeding Theaters...');
    const theaterDocs = await TheaterModel.insertMany(
      data.theaters.map(t => ({ ...t, _id: undefined }))
    );
    console.log(`   ✅ ${theaterDocs.length} theaters inserted`);

    // Build theater ID mapping (old _id → new Mongoose _id)
    const theaterIdMap = {};
    data.theaters.forEach((t, i) => {
      theaterIdMap[t._id] = theaterDocs[i]._id.toString();
    });

    // ── Seed movies ──
    console.log('🎬  Seeding Movies...');
    const movieDocs = await MovieModel.insertMany(
      data.movies.map(m => ({ ...m, _id: undefined }))
    );
    console.log(`   ✅ ${movieDocs.length} movies inserted`);

    // Build movie ID mapping
    const movieIdMap = {};
    data.movies.forEach((m, i) => {
      movieIdMap[m._id] = movieDocs[i]._id.toString();
    });

    // ── Seed showtimes ──
    console.log('🕐  Seeding Showtimes...');
    const mappedShowtimes = data.showtimes.map(s => ({
      ...s,
      _id: undefined,
      movieId: movieIdMap[s.movieId] || s.movieId,
      theaterId: theaterIdMap[s.theaterId] || s.theaterId
    }));
    const showtimeDocs = await ShowtimeModel.insertMany(mappedShowtimes);
    console.log(`   ✅ ${showtimeDocs.length} showtimes inserted\n`);

    console.log('🎉 MongoDB Atlas seeded successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`   Movies    : ${movieDocs.length}`);
    console.log(`   Theaters  : ${theaterDocs.length}`);
    console.log(`   Showtimes : ${showtimeDocs.length}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  } catch (err) {
    console.error('❌ Seeding failed:', err.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

seed();
