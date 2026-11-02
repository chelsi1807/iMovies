import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

export const AdminPortal = () => {
  const [stats, setStats] = useState(null);
  const [movies, setMovies] = useState([]);
  const [theaters, setTheaters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subTab, setSubTab] = useState('overview'); // 'overview' | 'movies' | 'scheduler'
  const [feedback, setFeedback] = useState('');

  // New Movie Form State
  const [newMovie, setNewMovie] = useState({
    title: '',
    description: '',
    poster: '',
    backdrop: '',
    duration: '2h 10m',
    genre: 'Action, Sci-Fi',
    rating: 8.5,
    price: 15,
    language: 'English',
    certificate: 'PG-13',
    featured: true
  });

  // New Showtime Form State
  const [newShowtime, setNewShowtime] = useState({
    movieId: '',
    theaterId: '',
    date: new Date().toISOString().split('T')[0],
    time: '07:30 PM'
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const [statsRes, moviesRes, theatersRes] = await Promise.all([
        api.getAdminStats(),
        api.getMovies(),
        api.getTheaters()
      ]);

      if (statsRes.success) setStats(statsRes.stats);
      if (moviesRes.success) {
        setMovies(moviesRes.movies);
        if (moviesRes.movies.length > 0) {
          setNewShowtime(prev => ({ ...prev, movieId: moviesRes.movies[0]._id }));
        }
      }
      if (theatersRes.success) {
        setTheaters(theatersRes.theaters);
        if (theatersRes.theaters.length > 0) {
          setNewShowtime(prev => ({ ...prev, theaterId: theatersRes.theaters[0]._id }));
        }
      }
    } catch (err) {
      console.error('Admin data load failed:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateMovie = async (e) => {
    e.preventDefault();
    try {
      const res = await api.createMovie(newMovie);
      if (res.success) {
        setFeedback(`Movie "${res.movie.title}" added to catalog!`);
        loadData();
        setNewMovie({
          title: '',
          description: '',
          poster: '',
          backdrop: '',
          duration: '2h 10m',
          genre: 'Action, Sci-Fi',
          rating: 8.5,
          price: 15,
          language: 'English',
          certificate: 'PG-13',
          featured: true
        });
        setTimeout(() => setFeedback(''), 4000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteMovie = async (id, title) => {
    if (!window.confirm(`Delete movie "${title}" from the catalog?`)) return;
    try {
      const res = await api.deleteMovie(id);
      if (res.success) {
        setFeedback(`Movie "${title}" removed.`);
        loadData();
        setTimeout(() => setFeedback(''), 4000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateShowtime = async (e) => {
    e.preventDefault();
    try {
      const res = await api.createShowtime(newShowtime);
      if (res.success) {
        setFeedback('Showtime successfully scheduled!');
        loadData();
        setTimeout(() => setFeedback(''), 4000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-warning" role="status"></div>
        <p className="text-white-50 mt-3">Loading admin statistics...</p>
      </div>
    );
  }

  return (
    <div className="container py-4">
      {/* Header */}
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
        <div>
          <h2 className="fw-bold text-white mb-1 d-flex align-items-center gap-2">
            <i className="bi bi-shield-lock-fill text-warning"></i> Executive Cinema Portal
          </h2>
          <p className="text-white-50 small mb-0">
            Real-time analytics, movie distribution, showtime schedules, and ticket sales.
          </p>
        </div>

        <div className="d-flex gap-2">
          <button
            className={`btn btn-sm ${subTab === 'overview' ? 'btn-warning text-dark fw-bold' : 'btn-dark'}`}
            onClick={() => setSubTab('overview')}
          >
            <i className="bi bi-graph-up me-1"></i> Overview
          </button>
          <button
            className={`btn btn-sm ${subTab === 'movies' ? 'btn-warning text-dark fw-bold' : 'btn-dark'}`}
            onClick={() => setSubTab('movies')}
          >
            <i className="bi bi-film me-1"></i> Movies ({movies.length})
          </button>
          <button
            className={`btn btn-sm ${subTab === 'scheduler' ? 'btn-warning text-dark fw-bold' : 'btn-dark'}`}
            onClick={() => setSubTab('scheduler')}
          >
            <i className="bi bi-calendar-plus me-1"></i> Schedule Shows
          </button>
        </div>
      </div>

      {feedback && (
        <div className="alert alert-success py-2 px-3 small rounded-3 d-flex align-items-center gap-2 mb-4">
          <i className="bi bi-check-circle-fill fs-5"></i>
          <span>{feedback}</span>
        </div>
      )}

      {/* METRIC CARDS */}
      <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-4 g-3 mb-4">
        <div className="col">
          <div className="glass-panel p-3 border-start border-4 border-warning">
            <span className="text-white-50 small text-uppercase fw-bold">Total Gross Revenue</span>
            <h3 className="fw-bold text-warning mb-0 mt-1">
              ${stats?.totalRevenue?.toLocaleString() || '0'}
            </h3>
            <span className="text-white-50 small" style={{ fontSize: '0.75rem' }}>+18% from last cycle</span>
          </div>
        </div>

        <div className="col">
          <div className="col">
            <div className="glass-panel p-3 border-start border-4 border-danger">
              <span className="text-white-50 small text-uppercase fw-bold">Tickets Sold</span>
              <h3 className="fw-bold text-white mb-0 mt-1">
                {stats?.totalTicketsSold || 0}
              </h3>
              <span className="text-white-50 small" style={{ fontSize: '0.75rem' }}>Across all screen formats</span>
            </div>
          </div>
        </div>

        <div className="col">
          <div className="col">
            <div className="glass-panel p-3 border-start border-4 border-info">
              <span className="text-white-50 small text-uppercase fw-bold">Active Movies</span>
              <h3 className="fw-bold text-info mb-0 mt-1">
                {stats?.activeMoviesCount || movies.length}
              </h3>
              <span className="text-white-50 small" style={{ fontSize: '0.75rem' }}>Premieres & standard</span>
            </div>
          </div>
        </div>

        <div className="col">
          <div className="col">
            <div className="glass-panel p-3 border-start border-4 border-success">
              <span className="text-white-50 small text-uppercase fw-bold">Total Showtimes</span>
              <h3 className="fw-bold text-success mb-0 mt-1">
                {stats?.totalShowtimes || 0}
              </h3>
              <span className="text-white-50 small" style={{ fontSize: '0.75rem' }}>Scheduled screenings</span>
            </div>
          </div>
        </div>
      </div>

      {/* SUBTAB: OVERVIEW */}
      {subTab === 'overview' && (
        <div className="row g-4">
          {/* Top Grossing Movies */}
          <div className="col-lg-7">
            <div className="glass-panel p-4 h-100">
              <h5 className="fw-bold text-white mb-3 d-flex align-items-center gap-2">
                <i className="bi bi-bar-chart-line text-warning"></i> Box Office Performance
              </h5>

              <div className="table-responsive">
                <table className="table table-dark table-hover table-borderless align-middle mb-0">
                  <thead className="text-white-50 border-bottom border-secondary border-opacity-25 small">
                    <tr>
                      <th>Movie</th>
                      <th>Rating</th>
                      <th>Tickets</th>
                      <th className="text-end">Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(stats?.movieStats || []).map((ms, idx) => (
                      <tr key={ms.id || idx}>
                        <td className="d-flex align-items-center gap-2">
                          {ms.poster && (
                            <img src={ms.poster} alt={ms.title} className="rounded" style={{ width: 28, height: 38, objectFit: 'cover' }} />
                          )}
                          <span className="fw-semibold text-white">{ms.title}</span>
                        </td>
                        <td>
                          <span className="badge bg-warning bg-opacity-25 text-warning">
                            <i className="bi bi-star-fill me-1"></i>{ms.rating}
                          </span>
                        </td>
                        <td className="text-white">{ms.tickets}</td>
                        <td className="text-end fw-bold text-success">
                          ${ms.revenue.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Recent Live Bookings */}
          <div className="col-lg-5">
            <div className="glass-panel p-4 h-100">
              <h5 className="fw-bold text-white mb-3 d-flex align-items-center gap-2">
                <i className="bi bi-activity text-danger"></i> Recent Transactions
              </h5>

              <div className="d-flex flex-column gap-3">
                {(stats?.recentBookings || []).slice(0, 5).map(rb => (
                  <div key={rb._id} className="p-3 bg-dark bg-opacity-50 rounded-3 border border-secondary border-opacity-25 d-flex justify-content-between align-items-center">
                    <div>
                      <div className="fw-semibold text-white small">{rb.movieTitle}</div>
                      <div className="text-white-50" style={{ fontSize: '0.75rem' }}>
                        Seats: {rb.seats ? rb.seats.join(', ') : 'N/A'} • {rb.paymentMethod}
                      </div>
                      <div className="text-secondary font-monospace" style={{ fontSize: '0.68rem' }}>
                        {rb.bookingCode}
                      </div>
                    </div>
                    <div className="text-end">
                      <div className="fw-bold text-warning small">${Number(rb.totalAmount).toFixed(2)}</div>
                      <span className={`badge ${rb.paymentStatus === 'PAID' ? 'bg-success' : 'bg-danger'} p-1`} style={{ fontSize: '0.62rem' }}>
                        {rb.paymentStatus}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB: MOVIES */}
      {subTab === 'movies' && (
        <div className="row g-4">
          <div className="col-lg-5">
            <div className="glass-panel p-4">
              <h5 className="fw-bold text-white mb-3 d-flex align-items-center gap-2">
                <i className="bi bi-plus-circle text-warning"></i> Add New Premiere
              </h5>

              <form onSubmit={handleCreateMovie} className="d-flex flex-column gap-3">
                <div>
                  <label className="text-secondary small fw-semibold">Movie Title</label>
                  <input
                    type="text"
                    required
                    className="form-control form-control-sm bg-dark text-white border-secondary border-opacity-50"
                    value={newMovie.title}
                    onChange={e => setNewMovie({ ...newMovie, title: e.target.value })}
                    placeholder="e.g. Avatar: Fire and Ash"
                  />
                </div>

                <div>
                  <label className="text-secondary small fw-semibold">Synopsis / Description</label>
                  <textarea
                    required
                    rows="3"
                    className="form-control form-control-sm bg-dark text-white border-secondary border-opacity-50"
                    value={newMovie.description}
                    onChange={e => setNewMovie({ ...newMovie, description: e.target.value })}
                    placeholder="Brief storyline..."
                  />
                </div>

                <div className="row g-2">
                  <div className="col-6">
                    <label className="text-secondary small fw-semibold">Duration</label>
                    <input
                      type="text"
                      className="form-control form-control-sm bg-dark text-white border-secondary border-opacity-50"
                      value={newMovie.duration}
                      onChange={e => setNewMovie({ ...newMovie, duration: e.target.value })}
                    />
                  </div>
                  <div className="col-6">
                    <label className="text-secondary small fw-semibold">Base Price ($)</label>
                    <input
                      type="number"
                      className="form-control form-control-sm bg-dark text-white border-secondary border-opacity-50"
                      value={newMovie.price}
                      onChange={e => setNewMovie({ ...newMovie, price: Number(e.target.value) })}
                    />
                  </div>
                </div>

                <div className="row g-2">
                  <div className="col-6">
                    <label className="text-secondary small fw-semibold">Rating (1-10)</label>
                    <input
                      type="number"
                      step="0.1"
                      className="form-control form-control-sm bg-dark text-white border-secondary border-opacity-50"
                      value={newMovie.rating}
                      onChange={e => setNewMovie({ ...newMovie, rating: Number(e.target.value) })}
                    />
                  </div>
                  <div className="col-6">
                    <label className="text-secondary small fw-semibold">Certificate</label>
                    <input
                      type="text"
                      className="form-control form-control-sm bg-dark text-white border-secondary border-opacity-50"
                      value={newMovie.certificate}
                      onChange={e => setNewMovie({ ...newMovie, certificate: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-secondary small fw-semibold">Poster URL</label>
                  <input
                    type="url"
                    required
                    className="form-control form-control-sm bg-dark text-white border-secondary border-opacity-50"
                    value={newMovie.poster}
                    onChange={e => setNewMovie({ ...newMovie, poster: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                  />
                </div>

                <div className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="featuredCheck"
                    checked={newMovie.featured}
                    onChange={e => setNewMovie({ ...newMovie, featured: e.target.checked })}
                  />
                  <label className="form-check-label text-white small" htmlFor="featuredCheck">
                    Display in Hero Premiere Carousel
                  </label>
                </div>

                <button type="submit" className="btn btn-warning text-dark fw-bold btn-sm mt-2">
                  <i className="bi bi-cloud-arrow-up me-1"></i> Save Movie to Catalog
                </button>
              </form>
            </div>
          </div>

          <div className="col-lg-7">
            <div className="glass-panel p-4">
              <h5 className="fw-bold text-white mb-3">Active Catalog ({movies.length})</h5>
              <div className="d-flex flex-column gap-3">
                {movies.map(m => (
                  <div key={m._id} className="p-3 bg-dark bg-opacity-50 rounded-3 border border-secondary border-opacity-25 d-flex align-items-center justify-content-between gap-3">
                    <div className="d-flex align-items-center gap-3">
                      <img src={m.poster} alt={m.title} className="rounded" style={{ width: 42, height: 56, objectFit: 'cover' }} />
                      <div>
                        <h6 className="fw-bold text-white mb-0">{m.title}</h6>
                        <div className="text-white-50 small">
                          {m.duration} • ${m.price} • {m.language}
                        </div>
                      </div>
                    </div>
                    <button
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => handleDeleteMovie(m._id, m.title)}
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB: SCHEDULER */}
      {subTab === 'scheduler' && (
        <div className="glass-panel p-4" style={{ maxWidth: 650, margin: '0 auto' }}>
          <h5 className="fw-bold text-white mb-3 d-flex align-items-center gap-2">
            <i className="bi bi-clock-history text-warning"></i> Schedule a New Showtime
          </h5>

          <form onSubmit={handleCreateShowtime} className="d-flex flex-column gap-3">
            <div>
              <label className="text-secondary small fw-semibold">Select Movie</label>
              <select
                className="form-select bg-dark text-white border-secondary border-opacity-50"
                value={newShowtime.movieId}
                onChange={e => setNewShowtime({ ...newShowtime, movieId: e.target.value })}
              >
                {movies.map(m => (
                  <option key={m._id} value={m._id}>{m.title}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-secondary small fw-semibold">Select Cinema & Hall</label>
              <select
                className="form-select bg-dark text-white border-secondary border-opacity-50"
                value={newShowtime.theaterId}
                onChange={e => setNewShowtime({ ...newShowtime, theaterId: e.target.value })}
              >
                {theaters.map(t => (
                  <option key={t._id} value={t._id}>{t.name} ({t.city})</option>
                ))}
              </select>
            </div>

            <div className="row g-2">
              <div className="col-6">
                <label className="text-secondary small fw-semibold">Date</label>
                <input
                  type="date"
                  required
                  className="form-control bg-dark text-white border-secondary border-opacity-50"
                  value={newShowtime.date}
                  onChange={e => setNewShowtime({ ...newShowtime, date: e.target.value })}
                />
              </div>

              <div className="col-6">
                <label className="text-secondary small fw-semibold">Time Slot</label>
                <select
                  className="form-select bg-dark text-white border-secondary border-opacity-50"
                  value={newShowtime.time}
                  onChange={e => setNewShowtime({ ...newShowtime, time: e.target.value })}
                >
                  {['10:30 AM', '01:45 PM', '04:30 PM', '07:15 PM', '09:45 PM', '11:15 PM'].map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>

            <button type="submit" className="btn btn-warning text-dark fw-bold mt-2">
              <i className="bi bi-calendar-check me-1"></i> Add Showtime to Schedule
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
export default AdminPortal;
