import { MovieModel } from '../models/Movie.js';
import { getDbStatus } from '../config/db.js';
import { dbStore } from '../data/dbStore.js';

// Helper: decide which backend to use
const useMongo = () => getDbStatus().isMongoConnected;

// ─── Normalization helper ───────────────────────────────────────────────────
const normalizeText = (txt) =>
  (txt || '')
    .toLowerCase()
    .replace(/[:\-–—.,!?]/g, ' ')
    .replace(/\b2\b/g, 'two')
    .replace(/\b3\b/g, 'three')
    .replace(/\b4\b/g, 'four')
    .replace(/\s+/g, ' ')
    .trim();

// ─── In-memory filter used by BOTH backends ─────────────────────────────────
const applyFilters = (movies, { search, genre, language, sort }) => {
  if (search && search.trim()) {
    const rawQ = search.trim().toLowerCase();
    const terms = rawQ.split(/\s+/).filter(Boolean);
    const normQ = normalizeText(rawQ);

    movies = movies.filter(m => {
      const castNames  = (m.cast || []).map(c => c.name).join(' ');
      const castRoles  = (m.cast || []).map(c => c.role).join(' ');
      const genres     = Array.isArray(m.genre) ? m.genre.join(' ') : (m.genre || '');
      const fullContent = `${m.title} ${m.tagline || ''} ${m.description || ''} ${genres} ${castNames} ${castRoles} ${m.language || ''} ${m.certificate || ''}`;

      const rawContent  = fullContent.toLowerCase();
      const normContent = normalizeText(fullContent);

      if (rawContent.includes(rawQ) || normContent.includes(normQ)) return true;

      const allTermsMatch = terms.every(term => {
        const normTerm = normalizeText(term);
        return rawContent.includes(term) || normContent.includes(normTerm);
      });
      if (allTermsMatch) return true;

      if (rawQ.length >= 3) {
        const words = normContent.split(' ').filter(w => w.length >= 3);
        if (words.some(w => w.startsWith(normQ) || w.startsWith(rawQ))) return true;
      }
      return false;
    });
  }

  if (genre && genre !== 'All') {
    const genreMatches = movies.filter(m =>
      m.genre && m.genre.some(g => g.toLowerCase() === genre.toLowerCase())
    );
    if (!search || genreMatches.length > 0) movies = genreMatches;
  }

  if (language && language !== 'All') {
    movies = movies.filter(m => m.language && m.language.toLowerCase().includes(language.toLowerCase()));
  }

  if (sort === 'rating')       movies.sort((a, b) => b.rating - a.rating);
  else if (sort === 'latest')  movies.sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate));
  else if (sort === 'title')   movies.sort((a, b) => a.title.localeCompare(b.title));

  return movies;
};

// ─── GET /api/movies ─────────────────────────────────────────────────────────
export const getMovies = async (req, res) => {
  try {
    const { search, genre, language, sort } = req.query;
    let movies;

    if (useMongo()) {
      movies = await MovieModel.find({}).lean();
    } else {
      movies = dbStore.find('movies');
    }

    movies = applyFilters(movies, { search, genre, language, sort });

    res.status(200).json({ success: true, count: movies.length, movies });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── GET /api/movies/featured ────────────────────────────────────────────────
export const getFeaturedMovies = async (req, res) => {
  try {
    let movies;
    if (useMongo()) {
      movies = await MovieModel.find({ featured: true }).lean();
      if (movies.length === 0) movies = await MovieModel.find({}).limit(3).lean();
    } else {
      movies = dbStore.find('movies').filter(m => m.featured);
      if (movies.length === 0) movies = dbStore.find('movies').slice(0, 3);
    }
    res.status(200).json({ success: true, movies });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── GET /api/movies/:id ─────────────────────────────────────────────────────
export const getMovieById = async (req, res) => {
  try {
    let movie;
    if (useMongo()) {
      movie = await MovieModel.findById(req.params.id).lean();
    } else {
      movie = dbStore.findById('movies', req.params.id);
    }
    if (!movie) return res.status(404).json({ success: false, message: 'Movie not found.' });
    res.status(200).json({ success: true, movie });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── POST /api/movies ────────────────────────────────────────────────────────
export const createMovie = async (req, res) => {
  try {
    const { title, description, poster, backdrop, trailerUrl, genre, duration, releaseDate, rating, price, cast, language, certificate, featured } = req.body;
    if (!title || !description || !poster || !duration) {
      return res.status(400).json({ success: false, message: 'Title, description, poster, and duration are required.' });
    }

    const payload = {
      title,
      tagline: req.body.tagline || '',
      description,
      poster,
      backdrop: backdrop || poster,
      trailerUrl: trailerUrl || 'https://www.youtube.com/embed/Way9Dexny3w',
      genre: Array.isArray(genre) ? genre : (genre ? genre.split(',').map(s => s.trim()) : ['Action']),
      duration,
      releaseDate: releaseDate || new Date().toISOString().split('T')[0],
      rating: Number(rating) || 8.0,
      votes: '1K',
      price: Number(price) || 15,
      language: language || 'English',
      certificate: certificate || 'PG-13',
      featured: Boolean(featured),
      cast: cast || []
    };

    let newMovie;
    if (useMongo()) {
      newMovie = await MovieModel.create(payload);
    } else {
      newMovie = dbStore.create('movies', payload);
    }

    res.status(201).json({ success: true, message: 'Movie added successfully!', movie: newMovie });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── PUT /api/movies/:id ─────────────────────────────────────────────────────
export const updateMovie = async (req, res) => {
  try {
    let movie;
    if (useMongo()) {
      movie = await MovieModel.findByIdAndUpdate(req.params.id, req.body, { new: true }).lean();
    } else {
      const existing = dbStore.findById('movies', req.params.id);
      if (!existing) movie = null;
      else movie = dbStore.findByIdAndUpdate('movies', req.params.id, req.body);
    }
    if (!movie) return res.status(404).json({ success: false, message: 'Movie not found.' });
    res.status(200).json({ success: true, message: 'Movie updated successfully!', movie });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── DELETE /api/movies/:id ──────────────────────────────────────────────────
export const deleteMovie = async (req, res) => {
  try {
    let deleted;
    if (useMongo()) {
      deleted = await MovieModel.findByIdAndDelete(req.params.id);
    } else {
      const existing = dbStore.findById('movies', req.params.id);
      if (existing) deleted = dbStore.findByIdAndDelete('movies', req.params.id);
    }
    if (!deleted) return res.status(404).json({ success: false, message: 'Movie not found.' });
    res.status(200).json({ success: true, message: 'Movie removed successfully!' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
