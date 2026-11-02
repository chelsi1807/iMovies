import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

export const MyBookingsView = ({ onSelectBooking, onBrowseMovies }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState('');

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await api.getMyBookings();
      if (res.success) {
        setBookings(res.bookings);
      }
    } catch (err) {
      console.error('Failed to load user bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this ticket? The seats will be released.')) {
      return;
    }

    try {
      const res = await api.cancelBooking(bookingId);
      if (res.success) {
        setActionMessage('Ticket cancelled successfully and refund simulation initiated.');
        fetchBookings();
        setTimeout(() => setActionMessage(''), 4000);
      }
    } catch (err) {
      console.error('Cancellation error:', err);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-warning" role="status" style={{ width: '3rem', height: '3rem' }}></div>
        <p className="text-white-50 mt-3 brand-font">Loading your cinema passes...</p>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
        <div>
          <h2 className="fw-bold text-white mb-1 d-flex align-items-center gap-2 brand-font">
            <span className="p-1 rounded-2 bg-warning bg-opacity-20 text-warning d-inline-flex">
              <i className="bi bi-ticket-perforated"></i>
            </span>
            My Digital Passes & Reservations
          </h2>
          <p className="text-white-50 small mb-0">
            View your upcoming premiere passes, digital barcodes, and reservation receipts.
          </p>
        </div>

        <button className="btn btn-glass btn-sm rounded-pill px-3" onClick={onBrowseMovies}>
          <i className="bi bi-plus-circle me-1 text-warning"></i> Explore More Movies
        </button>
      </div>

      {actionMessage && (
        <div className="alert alert-success py-2 px-3 small rounded-3 d-flex align-items-center gap-2 mb-4 bg-success bg-opacity-20 border-success border-opacity-40 text-success">
          <i className="bi bi-check-circle-fill fs-5"></i>
          <span>{actionMessage}</span>
        </div>
      )}

      {bookings.length === 0 ? (
        <div className="glass-panel text-center py-5 px-4 my-4">
          <i className="bi bi-film text-warning opacity-50 display-3 mb-3 d-block"></i>
          <h4 className="fw-bold text-white mb-2 brand-font">No Active Passes Found</h4>
          <p className="text-white-50 small mb-4" style={{ maxWidth: 450, margin: '0 auto' }}>
            You haven't reserved any cinema tickets yet. Explore current blockbuster premieres and secure your seats today!
          </p>
          <button className="btn btn-cinema rounded-pill px-4" onClick={onBrowseMovies}>
            Browse Blockbusters Now
          </button>
        </div>
      ) : (
        <div className="row row-cols-1 row-cols-lg-2 g-4">
          {bookings.map(b => {
            const isCancelled = b.paymentStatus === 'CANCELLED';

            return (
              <div key={b._id} className="col">
                <div className={`glass-panel p-4 h-100 position-relative ${isCancelled ? 'opacity-75' : ''}`}>
                  <div className="d-flex gap-3">
                    {b.moviePoster && (
                      <img 
                        src={b.moviePoster} 
                        alt={b.movieTitle} 
                        className="rounded-3 shadow-sm border border-secondary border-opacity-25"
                        style={{ width: 84, height: 114, objectFit: 'cover' }}
                      />
                    )}
                    <div className="flex-grow-1">
                      <div className="d-flex align-items-center justify-content-between gap-2 mb-1">
                        <h5 className="fw-bold text-white mb-0 brand-font">{b.movieTitle}</h5>
                        <span className={`badge rounded-pill ${
                          isCancelled 
                            ? 'bg-danger bg-opacity-25 text-danger border border-danger border-opacity-40' 
                            : 'bg-success bg-opacity-25 text-success border border-success border-opacity-40'
                        } small px-3 py-1`}>
                          {b.paymentStatus}
                        </span>
                      </div>

                      <div className="text-warning small fw-semibold mb-1">
                        <i className="bi bi-geo-alt me-1"></i>{b.theaterName}
                      </div>

                      <div className="text-white-50 small mb-2">
                        <span><i className="bi bi-calendar-event me-1 text-warning"></i>{b.date}</span>
                        <span className="mx-2">•</span>
                        <span><i className="bi bi-clock me-1 text-info"></i>{b.time}</span>
                      </div>

                      <div className="d-flex flex-wrap gap-2 align-items-center text-white small">
                        <span>Seats: <strong className="text-warning">{b.seats ? b.seats.join(', ') : 'N/A'}</strong></span>
                        <span className="badge bg-dark border border-secondary border-opacity-35 rounded-pill">{b.tier}</span>
                      </div>
                    </div>
                  </div>

                  <div className="d-flex align-items-center justify-content-between pt-3 mt-3 border-top border-secondary border-opacity-15">
                    <div>
                      <span className="text-white-50 small d-block" style={{ fontSize: '0.68rem', letterSpacing: '0.05em' }}>PASS CODE</span>
                      <span className="text-warning font-monospace small fw-bold">{b.bookingCode}</span>
                    </div>

                    <div className="d-flex gap-2">
                      {!isCancelled && (
                        <button
                          className="btn btn-outline-danger btn-sm rounded-pill px-3"
                          onClick={() => handleCancelBooking(b._id)}
                          title="Cancel ticket and release seats"
                        >
                          Cancel
                        </button>
                      )}

                      <button
                        className="btn btn-cinema btn-sm rounded-pill px-3"
                        onClick={() => onSelectBooking(b)}
                      >
                        <i className="bi bi-qr-code-scan me-1"></i> View Pass
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
export default MyBookingsView;
