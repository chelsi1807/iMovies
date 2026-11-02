import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { MovieCard } from './components/MovieCard';
import { TrailerModal } from './components/TrailerModal';
import { SeatMapModal } from './components/SeatMapModal';
import { TicketModal } from './components/TicketModal';
import { MyBookingsView } from './components/MyBookingsView';
import { AdminPortal } from './components/AdminPortal';
import { TheatersView } from './components/TheatersView';
import { AuthModal } from './components/AuthModal';
import { api } from './services/api';
import { useAuth } from './context/AuthContext';

const GENRES = [
  { name: 'All', icon: '🎬' },
  { name: 'Action', icon: '💥' },
  { name: 'Sci-Fi', icon: '🚀' },
  { name: 'Adventure', icon: '🗺️' },
  { name: 'Drama', icon: '🎭' },
  { name: 'Animation', icon: '✨' },
  { name: 'Comedy', icon: '🍿' },
  { name: 'Cyberpunk', icon: '⚡' },
  { name: 'Thriller', icon: '🔍' },
  { name: 'Fantasy', icon: '🔮' },
  { name: 'Romance', icon: '💫' }
];

export const App = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('explore');
  const [movies, setMovies] = useState([]);
  const [loadingMovies, setLoadingMovies] = useState(true);
  
  // Filter States
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [sortBy, setSortBy] = useState('rating');

  // Modal States
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [trailerMovie, setTrailerMovie] = useState(null);
  const [activeBooking, setActiveBooking] = useState(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // Debounce search query to prevent race conditions on fast typing
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 180);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Fetch movies with race condition cancellation
  useEffect(() => {
    let isCurrent = true;

    const fetchMovies = async () => {
      setLoadingMovies(true);
      try {
        const params = {};
        if (selectedGenre !== 'All') params.genre = selectedGenre;
        if (debouncedSearch && debouncedSearch.trim()) params.search = debouncedSearch.trim();
        if (sortBy) params.sort = sortBy;

        const res = await api.getMovies(params);
        if (isCurrent && res && res.success) {
          setMovies(res.movies);
        }
      } catch (err) {
        if (isCurrent) {
          console.error('Error fetching movies:', err);
        }
      } finally {
        if (isCurrent) {
          setLoadingMovies(false);
        }
      }
    };

    fetchMovies();

    return () => {
      isCurrent = false;
    };
  }, [selectedGenre, debouncedSearch, sortBy]);

  const handleBookingSuccess = (booking) => {
    setSelectedMovie(null);
    setActiveBooking(booking);
  };

  return (
    <div className="min-vh-100 d-flex flex-column">
      {/* Top Floating Glass Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onOpenAuth={() => setIsAuthOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-grow-1">
        {/* EXPLORE TAB */}
        {activeTab === 'explore' && (
          <div className="container py-4">
            {/* Featured Hero Premiere Carousel */}
            {!searchQuery && selectedGenre === 'All' && (
              <HeroBanner
                movies={movies}
                onSelectMovie={(movie) => setSelectedMovie(movie)}
                onWatchTrailer={(movie) => setTrailerMovie(movie)}
              />
            )}

            {/* Filter and Category Controls */}
            <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4 p-3 glass-panel">
              {/* Genre Pills */}
              <div className="d-flex flex-wrap gap-2 align-items-center">
                <span className="text-secondary small fw-bold me-1 brand-font">
                  <i className="bi bi-sliders text-warning me-1"></i> CATEGORY:
                </span>
                {GENRES.map(g => (
                  <button
                    key={g.name}
                    className={`btn btn-sm rounded-pill px-3 py-1 fw-semibold transition-all ${
                      selectedGenre === g.name 
                        ? 'btn-cinema shadow-sm' 
                        : 'btn-glass text-white-50 border-0'
                    }`}
                    onClick={() => setSelectedGenre(g.name)}
                  >
                    <span className="me-1">{g.icon}</span> {g.name}
                  </button>
                ))}
              </div>

              {/* Sort Dropdown */}
              <div className="d-flex align-items-center gap-2">
                <span className="text-secondary small fw-bold brand-font">SORT:</span>
                <select
                  className="form-select form-select-sm bg-dark text-white border-secondary border-opacity-35 rounded-pill px-3"
                  style={{ width: 150 }}
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="rating">Top Rated ⭐</option>
                  <option value="latest">Release Date 📅</option>
                  <option value="title">Title (A-Z) 🔤</option>
                </select>
              </div>
            </div>

            {/* Movie Catalog Grid */}
            <div className="mb-4 d-flex flex-wrap align-items-center justify-content-between gap-2">
              <div className="d-flex align-items-center gap-2 flex-wrap">
                <h3 className="fw-bold text-white mb-0 d-flex align-items-center gap-2 brand-font">
                  <span className="p-1 rounded-2 bg-warning bg-opacity-20 text-warning d-inline-flex">
                    <i className="bi bi-film"></i>
                  </span>
                  {searchQuery ? `Search Results for "${searchQuery}"` : selectedGenre !== 'All' ? `${selectedGenre} Titles` : 'Now Showing in Theaters'}
                </h3>
                {selectedGenre !== 'All' && searchQuery && (
                  <span 
                    className="badge bg-dark bg-opacity-75 border border-warning border-opacity-40 text-warning d-flex align-items-center gap-1 rounded-pill px-3 py-2"
                    style={{ cursor: 'pointer' }}
                    onClick={() => setSelectedGenre('All')}
                    title="Clear category filter"
                  >
                    Category: {selectedGenre} <i className="bi bi-x-circle-fill ms-1"></i>
                  </span>
                )}
              </div>
              <span className="badge bg-dark bg-opacity-60 border border-secondary border-opacity-25 text-white-50 rounded-pill px-3 py-2">
                {movies.length} title{movies.length !== 1 ? 's' : ''} available
              </span>
            </div>

            {loadingMovies ? (
              <div className="text-center py-5">
                <div className="spinner-border text-warning" role="status" style={{ width: '3rem', height: '3rem' }}></div>
                <p className="text-white-50 mt-3 brand-font">Loading cinema schedule...</p>
              </div>
            ) : movies.length === 0 ? (
              <div className="glass-panel text-center py-5 my-4">
                <i className="bi bi-search display-3 text-warning mb-3 d-block opacity-75"></i>
                <h4 className="fw-bold text-white mb-2 brand-font">No Movies Found</h4>
                <p className="text-white-50 small mb-3">
                  {searchQuery ? `No titles or actors matched "${searchQuery}".` : 'No movies found for the selected category.'}
                </p>
                <div className="d-flex flex-wrap justify-content-center gap-2 mb-3">
                  <span className="text-secondary small align-self-center">Suggested:</span>
                  {['Dune', 'Batman', 'Oppenheimer', 'Inception', 'Spider-Man', 'Interstellar'].map(s => (
                    <button
                      key={s}
                      className="btn btn-sm btn-glass rounded-pill px-3"
                      onClick={() => {
                        setSearchQuery(s);
                        setSelectedGenre('All');
                      }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
                <button 
                  className="btn btn-cinema btn-sm rounded-pill px-4"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedGenre('All');
                  }}
                >
                  <i className="bi bi-arrow-counterclockwise me-1"></i> Reset Filters
                </button>
              </div>
            ) : (
              <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-3 row-cols-xl-4 g-4 mb-5">
                {movies.map(movie => (
                  <MovieCard
                    key={movie._id}
                    movie={movie}
                    onSelectMovie={(m) => setSelectedMovie(m)}
                    onWatchTrailer={(m) => setTrailerMovie(m)}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* THEATERS TAB */}
        {activeTab === 'theaters' && (
          <TheatersView
            onSelectMovie={(movie) => setSelectedMovie(movie)}
          />
        )}

        {/* MY BOOKINGS TAB */}
        {activeTab === 'my-bookings' && (
          <MyBookingsView
            onSelectBooking={(b) => setActiveBooking(b)}
            onBrowseMovies={() => setActiveTab('explore')}
          />
        )}

        {/* ADMIN PORTAL TAB */}
        {activeTab === 'admin' && (
          <AdminPortal />
        )}
      </main>

      {/* MODALS */}
      {/* 1. Trailer Modal */}
      {trailerMovie && (
        <TrailerModal
          movie={trailerMovie}
          onClose={() => setTrailerMovie(null)}
          onBookNow={(m) => {
            setTrailerMovie(null);
            setSelectedMovie(m);
          }}
        />
      )}

      {/* 2. Interactive Visual Seat Selection & Reservation Modal */}
      {selectedMovie && (
        <SeatMapModal
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
          onBookingSuccess={handleBookingSuccess}
          onOpenAuth={() => setIsAuthOpen(true)}
        />
      )}

      {/* 3. Digital E-Ticket Pass Modal */}
      {activeBooking && (
        <TicketModal
          booking={activeBooking}
          onClose={() => setActiveBooking(null)}
          onViewBookings={() => {
            setActiveBooking(null);
            setActiveTab('my-bookings');
          }}
        />
      )}

      {/* 4. Authentication Modal */}
      {isAuthOpen && (
        <AuthModal
          onClose={() => setIsAuthOpen(false)}
        />
      )}

      {/* Modern Luxury Footer */}
      <footer className="border-top border-secondary border-opacity-15 py-4 bg-dark bg-opacity-60 mt-auto">
        <div className="container">
          <div className="row g-4 align-items-center">
            <div className="col-md-5">
              <div className="d-flex align-items-center gap-2 mb-2">
                <div 
                  className="rounded-2 p-1 d-flex align-items-center justify-content-center text-dark fw-bold" 
                  style={{ width: 28, height: 28, background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' }}
                >
                  <i className="bi bi-film"></i>
                </div>
                <span className="fw-bold fs-5 text-white brand-font">iMovies <span className="text-warning">LUXE</span></span>
              </div>
              <p className="text-white-50 small mb-0">
                Premium cinema reservation platform engineered with real-time seat locks, 3D curved screen visuals, gourmet snacks, and digital barcode passes.
              </p>
            </div>

            <div className="col-md-7">
              <div className="d-flex flex-wrap align-items-center justify-content-md-end gap-2">
                {/* Tech Badges */}
                <span className="badge bg-dark border border-secondary border-opacity-35 text-white-50 rounded-pill px-3 py-2">
                  <i className="bi bi-code-slash text-info me-1"></i> React 19
                </span>
                <span className="badge bg-dark border border-secondary border-opacity-35 text-white-50 rounded-pill px-3 py-2">
                  <i className="bi bi-server text-success me-1"></i> Node / Express
                </span>
                <span className="badge bg-dark border border-secondary border-opacity-35 text-white-50 rounded-pill px-3 py-2">
                  <i className="bi bi-database text-warning me-1"></i> MongoDB Atlas
                </span>
                <span className="badge bg-dark border border-secondary border-opacity-35 text-white-50 rounded-pill px-3 py-2">
                  <i className="bi bi-shield-check text-warning me-1"></i> JWT Protected
                </span>
              </div>

              {/* Status & Repository Link */}
              <div className="d-flex flex-wrap align-items-center justify-content-md-end gap-3 mt-3 pt-2 border-top border-secondary border-opacity-10 small">
                <span className="text-success d-inline-flex align-items-center gap-1">
                  <span className="spinner-grow spinner-grow-sm text-success" style={{ width: '0.5rem', height: '0.5rem' }}></span>
                  Systems Operational
                </span>
                <a 
                  href="https://github.com/chelsi1807/iMovies" 
                  className="text-white-50 text-decoration-none hover-white"
                  target="_blank" 
                  rel="noreferrer"
                >
                  <i className="bi bi-github text-warning me-1"></i> github.com/chelsi1807/iMovies
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
export default App;
