import React from 'react';

export const TicketModal = ({ booking, onClose, onViewBookings }) => {
  if (!booking) return null;

  return (
    <div 
      className="modal fade show d-block" 
      tabIndex="-1" 
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.88)', backdropFilter: 'blur(10px)', zIndex: 1060 }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content bg-transparent border-0 text-white">
          {/* Digital Ticket Container */}
          <div className="digital-ticket p-4 position-relative">
            <div className="ticket-notch-left" />
            <div className="ticket-notch-right" />

            {/* Header */}
            <div className="d-flex align-items-center justify-content-between border-bottom border-secondary border-opacity-25 pb-3 mb-3">
              <div className="d-flex align-items-center gap-2">
                <div className="bg-danger text-white rounded p-1 d-flex align-items-center justify-content-center" style={{ width: 28, height: 28 }}>
                  <i className="bi bi-film"></i>
                </div>
                <span className="fw-bold tracking-tight">I<span className="text-danger">Movies</span> Cinema Pass</span>
              </div>
              <span className="badge bg-success bg-opacity-25 text-success border border-success border-opacity-50">
                <i className="bi bi-check-circle me-1"></i> CONFIRMED
              </span>
            </div>

            {/* Movie Info */}
            <div className="d-flex gap-3 mb-3">
              {booking.moviePoster && (
                <img 
                  src={booking.moviePoster} 
                  alt={booking.movieTitle} 
                  className="rounded-3 shadow"
                  style={{ width: 85, height: 115, objectFit: 'cover' }}
                />
              )}
              <div className="flex-grow-1">
                <h4 className="fw-bold text-white mb-1">{booking.movieTitle}</h4>
                <div className="text-warning small fw-semibold mb-1">
                  <i className="bi bi-geo-alt-fill me-1"></i> {booking.theaterName}
                </div>
                <div className="text-white-50 small mb-2">
                  <i className="bi bi-display me-1"></i> {booking.screenName}
                </div>
                <span className="badge bg-secondary border border-secondary border-opacity-50">
                  {booking.tier} Tier
                </span>
              </div>
            </div>

            {/* Date, Time & Seats Grid */}
            <div className="row g-2 p-3 bg-black bg-opacity-40 rounded-3 mb-3 border border-secondary border-opacity-10 text-center">
              <div className="col-4 border-end border-secondary border-opacity-25">
                <span className="text-white-50 small d-block">DATE</span>
                <strong className="text-white small">{booking.date}</strong>
              </div>
              <div className="col-4 border-end border-secondary border-opacity-25">
                <span className="text-white-50 small d-block">TIME</span>
                <strong className="text-danger small">{booking.time}</strong>
              </div>
              <div className="col-4">
                <span className="text-white-50 small d-block">SEATS</span>
                <strong className="text-warning small">{booking.seats ? booking.seats.join(', ') : 'N/A'}</strong>
              </div>
            </div>

            {/* Snacks if any */}
            {booking.snacks && booking.snacks.length > 0 && (
              <div className="p-2 mb-3 bg-dark bg-opacity-50 rounded-2 small text-white-50">
                <span className="fw-semibold text-white">Add-ons: </span>
                {booking.snacks.map(s => `${s.item} x${s.qty}`).join(', ')}
              </div>
            )}

            {/* Amount */}
            <div className="d-flex justify-content-between align-items-center mb-3">
              <span className="text-white-50 small">Amount Paid</span>
              <span className="fs-5 fw-bold text-white">${Number(booking.totalAmount).toFixed(2)}</span>
            </div>

            {/* Barcode & Booking Code */}
            <div className="text-center pt-3 border-top border-secondary border-dashed border-opacity-50">
              <div className="barcode-strip text-white mb-1 fs-5">
                |||| | ||| || |||||| | ||| || ||||
              </div>
              <span className="small text-secondary font-monospace">
                Booking ID: <strong className="text-white">{booking.bookingCode}</strong>
              </span>
              <p className="text-white-50 mb-0 mt-2" style={{ fontSize: '0.72rem' }}>
                Show this digital e-ticket or QR barcode at the cinema turnstile for instant admission.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="d-flex gap-2 justify-content-center mt-3">
            <button 
              className="btn btn-outline-light btn-sm"
              onClick={() => window.print()}
            >
              <i className="bi bi-printer me-1"></i> Print / Save
            </button>

            <button 
              className="btn btn-cinema btn-sm"
              onClick={() => {
                onClose();
                onViewBookings();
              }}
            >
              <i className="bi bi-ticket-perforated me-1"></i> View in My Bookings
            </button>

            <button 
              className="btn btn-secondary btn-sm"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default TicketModal;
