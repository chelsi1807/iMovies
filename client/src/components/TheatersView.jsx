import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

export const TheatersView = ({ onSelectMovie }) => {
  const [theaters, setTheaters] = useState([]);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [thRes, mvRes] = await Promise.all([
          api.getTheaters(),
          api.getMovies()
        ]);
        if (thRes.success) setTheaters(thRes.theaters);
        if (mvRes.success) setMovies(mvRes.movies);
      } catch (err) {
        console.error('Failed to load theaters:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-danger" role="status"></div>
        <p className="text-white-50 mt-3">Loading cinema halls and theaters...</p>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="mb-4">
        <h2 className="fw-bold text-white mb-1 d-flex align-items-center gap-2">
          <i className="bi bi-buildings-fill text-danger"></i> Partner Cinemas & Auditoriums
        </h2>
        <p className="text-white-50 small mb-0">
          Equipped with IMAX Laser 4K, Dolby Atmos 128-channel surround sound, and luxury motorized recliners.
        </p>
      </div>

      <div className="row row-cols-1 row-cols-md-3 g-4 mb-5">
        {theaters.map((th, idx) => (
          <div key={th._id || idx} className="col">
            <div className="glass-panel p-4 h-100 d-flex flex-direction-column">
              <div className="d-flex align-items-center justify-content-between mb-3">
                <span className="badge bg-danger bg-opacity-25 text-danger border border-danger border-opacity-50">
                  {th.city}
                </span>
                <span className="small text-white-50">
                  <i className="bi bi-display me-1"></i> {th.screens.length} Screens
                </span>
              </div>

              <h4 className="fw-bold text-white mb-2">{th.name}</h4>
              <p className="text-white-50 small mb-3">
                <i className="bi bi-geo-alt-fill text-danger me-1"></i> {th.location}
              </p>

              <div className="mb-4">
                <label className="text-secondary small fw-bold text-uppercase d-block mb-2" style={{ fontSize: '0.68rem' }}>
                  Auditoriums & Formats
                </label>
                <div className="d-flex flex-wrap gap-1">
                  {th.screens.map((scr, sIdx) => (
                    <span key={sIdx} className="badge bg-dark border border-secondary border-opacity-50 text-light small">
                      {scr}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-auto">
                <label className="text-secondary small fw-bold text-uppercase d-block mb-2" style={{ fontSize: '0.68rem' }}>
                  Venue Amenities
                </label>
                <div className="d-flex flex-wrap gap-1 mb-4">
                  {th.facilities.map((fac, fIdx) => (
                    <span key={fIdx} className="badge bg-black bg-opacity-50 text-white-50" style={{ fontSize: '0.72rem' }}>
                      <i className="bi bi-check2 text-success me-1"></i>{fac}
                    </span>
                  ))}
                </div>

                <button 
                  className="btn btn-cinema btn-sm w-100 justify-content-center"
                  onClick={() => movies[0] && onSelectMovie(movies[0])}
                >
                  <i className="bi bi-ticket-perforated"></i> View Showtimes & Book
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default TheatersView;
