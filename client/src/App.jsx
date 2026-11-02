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

const GENRES = ['All', 'Action', 'Sci-Fi', 'Adventure', 'Drama', 'Animation', 'Comedy', 'Cyberpunk', 'Thriller', 'Fantasy', 'Romance'];

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
      {/* Top Navbar */}
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
                <span className="text-secondary small fw-bold me-1">
                  <i className="bi bi-funnel-fill text-danger me-1"></i> GENRE:
                </span>
                {GENRES.map(g => (
                  <button
                    key={g}
                    className={`btn btn-sm rounded-pill px-3 ${selectedGenre === g ? 'btn-danger shadow-sm' : 'btn-outline-secondary border-0 text-white-50'}`}
                    onClick={() => setSelectedGenre(g)}
                  >
                    {g}
                  </button>
                ))}
              </div>

              {/* Sort Dropdown */}
              <div className="d-flex align-items-center gap-2">
                <span className="text-secondary small fw-bold">SORT:</span>
                <select
                  className="form-select form-select-sm bg-dark text-white border-secondary border-opacity-50"
                  style={{ width: 140 }}
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
            <div className="mb-3 d-flex flex-wrap align-items-center justify-content-between gap-2">
              <div className="d-flex align-items-center gap-2 flex-wrap">
                <h3 className="fw-bold text-white mb-0 d-flex align-items-center gap-2">
                  <i className="bi bi-film text-danger"></i>
                  {searchQuery ? `Search Results for "${searchQuery}"` : selectedGenre !== 'All' ? `${selectedGenre} Movies` : 'Now Showing in Theaters'}
                </h3>
                {selectedGenre !== 'All' && searchQuery && (
                  <span 
                    className="badge bg-secondary bg-opacity-50 text-white d-flex align-items-center gap-1"
                    style={{ cursor: 'pointer' }}
                    onClick={() => setSelectedGenre('All')}
                    title="Clear genre filter"
                  >
                    Genre: {selectedGenre} <i className="bi bi-x-circle-fill ms-1"></i>
                  </span>
                )}
              </div>
              <span className="text-white-50 small">
                Showing {movies.length} title{movies.length !== 1 ? 's' : ''}
              </span>
            </div>

            {loadingMovies ? (
              <div className="text-center py-5">
                <div className="spinner-border text-danger" role="status"></div>
                <p className="text-white-50 mt-3">Fetching cinema listings...</p>
              </div>
            ) : movies.length === 0 ? (
              <div className="glass-panel text-center py-5 my-4">
                <i className="bi bi-search display-3 text-secondary mb-3 d-block"></i>
                <h4 className="fw-bold text-white mb-2">No Movies Found</h4>
                <p className="text-white-50 small mb-3">
                  {searchQuery ? `No titles or actors matched "${searchQuery}".` : 'No movies found for the selected category.'}
                </p>
                <div className="d-flex flex-wrap justify-content-center gap-2 mb-3">
                  <span className="text-secondary small align-self-center">Popular:</span>
                  {['Dune', 'Batman', 'Oppenheimer', 'Inception', 'Spider-Man', 'Interstellar'].map(s => (
                    <button
                      key={s}
                      className="btn btn-sm btn-outline-secondary rounded-pill px-3"
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
                  className="btn btn-outline-danger btn-sm rounded-pill px-3"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedGenre('All');
                  }}
                >
                  <i className="bi bi-arrow-counterclockwise me-1"></i> Reset All Filters
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

      {/* Footer with Demo & Mentor Evaluation Links */}
      <footer className="border-top border-secondary border-opacity-25 py-4 bg-black bg-opacity-70 mt-auto">
        <div className="container">
          <div className="row g-4 align-items-center">
            <div className="col-md-5">
              <div className="d-flex align-items-center gap-2 mb-2">
                <div className="bg-danger text-white rounded p-1 d-flex align-items-center justify-content-center" style={{ width: 28, height: 28 }}>
                  <i className="bi bi-film"></i>
                </div>
                <span className="fw-bold fs-5 text-white">I<span className="text-danger">Movies</span></span>
              </div>
              <p className="text-white-50 small mb-0">
                Movie ticket booking made simple. Next-generation cinema reservations with real-time visual seat availability tracking.
              </p>
            </div>

            <div className="col-md-7">
              <div className="d-flex flex-wrap align-items-center justify-content-md-end gap-3">
                {/* Tech Badges */}
                <span className="badge bg-dark border border-secondary border-opacity-50 text-white-50">
                  <i className="bi bi-code-slash text-info me-1"></i> React.js
                </span>
                <span className="badge bg-dark border border-secondary border-opacity-50 text-white-50">
                  <i className="bi bi-server text-success me-1"></i> Express & Node
                </span>
                <span className="badge bg-dark border border-secondary border-opacity-50 text-white-50">
                  <i className="bi bi-database text-warning me-1"></i> MongoDB / Mongoose
                </span>
                <span className="badge bg-dark border border-secondary border-opacity-50 text-white-50">
                  <i className="bi bi-shield-lock text-danger me-1"></i> JWT Auth
                </span>
                <span className="badge bg-dark border border-secondary border-opacity-50 text-white-50">
                  <i className="bi bi-bootstrap text-primary me-1"></i> Bootstrap 5
                </span>
              </div>

              {/* Mentor Demo Links */}
              <div className="d-flex flex-wrap align-items-center justify-content-md-end gap-3 mt-3 pt-2 border-top border-secondary border-opacity-10 small">
                <span className="text-secondary">Demo Links:</span>
                <a 
                  href="http://localhost:5173" 
                  className="text-info text-decoration-none"
                  target="_blank" 
                  rel="noreferrer"
                >
                  <i className="bi bi-link-45deg"></i> Web App: localhost:5173
                </a>
                <a 
                  href="http://localhost:5000/api/system/health" 
                  className="text-info text-decoration-none"
                  target="_blank" 
                  rel="noreferrer"
                >
                  <i className="bi bi-activity"></i> API Health: localhost:5000
                </a>
                <a 
                  href="https://github.com/imovies-cinemas/imovies-ticket-booking" 
                  className="text-light text-decoration-none"
                  target="_blank" 
                  rel="noreferrer"
                >
                  <i className="bi bi-github"></i> GitHub Repository
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
