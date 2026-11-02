import React from 'react';

export const TicketModal = ({ booking, onClose, onViewBookings }) => {
  if (!booking) return null;

  return (
    <div 
      className="modal fade show d-block" 
      tabIndex="-1" 
      style={{ backgroundColor: 'rgba(4, 7, 13, 0.94)', backdropFilter: 'blur(16px)', zIndex: 1060 }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content bg-transparent border-0 text-white">
          {/* Digital Luxury Boarding Pass Ticket */}
          <div className="digital-ticket p-4 position-relative">
            <div className="ticket-notch-left" />
            <div className="ticket-notch-right" />

            {/* Header */}
            <div className="d-flex align-items-center justify-content-between border-bottom border-secondary border-opacity-25 pb-3 mb-3">
              <div className="d-flex align-items-center gap-2">
                <div 
                  className="rounded-2 p-1 d-flex align-items-center justify-content-center text-dark fw-bold" 
                  style={{ width: 30, height: 30, background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' }}
                >
                  <i className="bi bi-film"></i>
                </div>
                <span className="fw-bold tracking-tight brand-font">iMovies <span className="text-warning">LUXE</span> Pass</span>
              </div>
              <span 
                className="badge rounded-pill fw-bold"
                style={{ background: 'rgba(16, 185, 129, 0.18)', color: '#34d399', border: '1px solid rgba(16, 185, 129, 0.4)' }}
              >
                <i className="bi bi-check-circle-fill me-1"></i> RESERVED
              </span>
            </div>

            {/* Movie Info */}
            <div className="d-flex gap-3 mb-3">
              {booking.moviePoster && (
                <img 
                  src={booking.moviePoster} 
                  alt={booking.movieTitle} 
                  className="rounded-3 shadow-lg border border-warning border-opacity-30"
                  style={{ width: 85, height: 115, objectFit: 'cover' }}
                />
              )}
              <div className="flex-grow-1">
                <h4 className="fw-bold text-white mb-1 brand-font">{booking.movieTitle}</h4>
                <div className="text-warning small fw-semibold mb-1">
                  <i className="bi bi-geo-alt-fill me-1"></i> {booking.theaterName}
                </div>
                <div className="text-white-50 small mb-2">
                  <i className="bi bi-display me-1 text-info"></i> {booking.screenName}
                </div>
                <span 
                  className="badge rounded-pill fw-bold"
                  style={{ background: 'rgba(245, 158, 11, 0.18)', color: '#fbbf24', border: '1px solid rgba(245, 158, 11, 0.4)' }}
                >
                  {booking.tier} Tier Recliners
                </span>
              </div>
            </div>

            {/* Date, Time & Seats Grid */}
            <div className="row g-2 p-3 bg-black bg-opacity-50 rounded-4 mb-3 border border-secondary border-opacity-15 text-center">
              <div className="col-4 border-end border-secondary border-opacity-25">
                <span className="text-white-50 small d-block" style={{ fontSize: '0.68rem', letterSpacing: '0.05em' }}>DATE</span>
                <strong className="text-white small">{booking.date}</strong>
              </div>
              <div className="col-4 border-end border-secondary border-opacity-25">
                <span className="text-white-50 small d-block" style={{ fontSize: '0.68rem', letterSpacing: '0.05em' }}>TIME</span>
                <strong className="text-warning small">{booking.time}</strong>
              </div>
              <div className="col-4">
                <span className="text-white-50 small d-block" style={{ fontSize: '0.68rem', letterSpacing: '0.05em' }}>SEATS</span>
                <strong className="text-info small">{booking.seats ? booking.seats.join(', ') : 'N/A'}</strong>
              </div>
            </div>

            {/* Concessions / Add-ons */}
            {booking.snacks && booking.snacks.length > 0 && (
              <div className="p-2 mb-3 bg-black bg-opacity-40 rounded-3 small text-white-50 border border-secondary border-opacity-10">
                <span className="fw-semibold text-warning">Gourmet Add-ons: </span>
                {booking.snacks.map(s => `${s.item} x${s.qty}`).join(', ')}
              </div>
            )}

            {/* Amount */}
            <div className="d-flex justify-content-between align-items-center mb-3 px-1">
              <span className="text-white-50 small">Total Paid (Inc. Taxes)</span>
              <span className="fs-5 fw-bold text-warning brand-font">${Number(booking.totalAmount).toFixed(2)}</span>
            </div>

            {/* Barcode & Booking Code */}
            <div className="text-center pt-3 border-top border-secondary border-dashed border-opacity-40">
              <div className="barcode-strip text-white mb-2 fs-4" style={{ letterSpacing: '0.45em' }}>
                |||| | ||| || |||||| | ||| || ||||
              </div>
              <span className="small text-secondary font-monospace d-block">
                PASS ID: <strong className="text-warning">{booking.bookingCode}</strong>
              </span>
              <p className="text-white-50 mb-0 mt-2" style={{ fontSize: '0.72rem' }}>
                Scan this electronic digital pass at the cinema turnstile for express priority admission.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="d-flex gap-2 justify-content-center mt-3">
            <button 
              className="btn btn-glass btn-sm rounded-pill px-3"
              onClick={() => window.print()}
            >
              <i className="bi bi-printer me-1"></i> Print / PDF
            </button>

            <button 
              className="btn btn-cinema btn-sm rounded-pill px-4"
              onClick={() => {
                onClose();
                onViewBookings();
              }}
            >
              <i className="bi bi-ticket-perforated me-1"></i> View in Passes
            </button>

            <button 
              className="btn btn-dark btn-sm rounded-pill px-3 border border-secondary border-opacity-25"
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
