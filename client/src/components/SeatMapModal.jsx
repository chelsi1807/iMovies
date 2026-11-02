import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

const ROWS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
const COLS = [1, 2, 3, 4, 5, 6, 7, 8];

const SNACK_OPTIONS = [
  { id: 'popcorn', name: 'Caramel Popcorn (L)', price: 8, icon: '🍿' },
  { id: 'nachos', name: 'Crispy Nachos & Cheese', price: 9, icon: '🧀' },
  { id: 'soda', name: 'Fountain Soda (M)', price: 5, icon: '🥤' },
  { id: 'combo', name: 'Deluxe Cinema Combo', price: 16, icon: '🎟️' }
];

export const SeatMapModal = ({ movie, onClose, onBookingSuccess, onOpenAuth }) => {
  const { user } = useAuth();
  const [showtimes, setShowtimes] = useState([]);
  const [selectedShowtime, setSelectedShowtime] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [snacks, setSnacks] = useState({});
  const [paymentMethod, setPaymentMethod] = useState('Credit Card');
  const [loadingShowtimes, setLoadingShowtimes] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [step, setStep] = useState('seats'); // 'seats' | 'snacks' | 'checkout'

  // Generate next 6 dates
  const dates = [];
  const today = new Date();
  for (let i = 0; i < 6; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    dates.push({
      dateStr: d.toISOString().split('T')[0],
      dayName: i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : d.toLocaleDateString('en-US', { weekday: 'short' }),
      dateFormatted: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    });
  }

  // Set initial selected date to today
  useEffect(() => {
    setSelectedDate(dates[0].dateStr);
  }, []);

  // Fetch showtimes for movie and selected date
  useEffect(() => {
    const fetchShowtimes = async () => {
      if (!movie || !selectedDate) return;
      setLoadingShowtimes(true);
      setErrorMessage('');
      try {
        const res = await api.getShowtimes({ movieId: movie._id, date: selectedDate });
        if (res.success && res.showtimes.length > 0) {
          setShowtimes(res.showtimes);
          setSelectedShowtime(res.showtimes[0]);
        } else {
          // If no showtimes found for exact date, load any showtimes for this movie
          const allRes = await api.getShowtimes({ movieId: movie._id });
          if (allRes.success && allRes.showtimes.length > 0) {
            setShowtimes(allRes.showtimes);
            setSelectedShowtime(allRes.showtimes[0]);
          } else {
            setShowtimes([]);
            setSelectedShowtime(null);
          }
        }
      } catch (err) {
        console.error('Failed to load showtimes:', err);
      } finally {
        setLoadingShowtimes(false);
      }
    };
    fetchShowtimes();
    setSelectedSeats([]);
  }, [movie, selectedDate]);

  if (!movie) return null;

  // Determine Tier for row
  const getSeatTier = (row) => {
    if (['A', 'B'].includes(row)) return 'Silver';
    if (['C', 'D', 'E'].includes(row)) return 'Gold';
    return 'VIP';
  };

  const isSeatBooked = (seatId) => {
    if (!selectedShowtime || !selectedShowtime.bookedSeats) return false;
    return selectedShowtime.bookedSeats.some(s => s.seatNumber.toUpperCase() === seatId.toUpperCase());
  };

  const handleSeatClick = (seatId) => {
    if (isSeatBooked(seatId)) return;
    setErrorMessage('');
    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(prev => prev.filter(s => s !== seatId));
    } else {
      if (selectedSeats.length >= 8) {
        setErrorMessage('Maximum 8 seats allowed per booking.');
        return;
      }
      setSelectedSeats(prev => [...prev, seatId]);
    }
  };

  const handleSnackChange = (snackId, change) => {
    setSnacks(prev => {
      const current = prev[snackId] || 0;
      const updated = Math.max(0, current + change);
      if (updated === 0) {
        const copy = { ...prev };
        delete copy[snackId];
        return copy;
      }
      return { ...prev, [snackId]: updated };
    });
  };

  // Pricing calculations
  const calculatePricing = () => {
    if (!selectedShowtime) return { subtotal: 0, snacksTotal: 0, tax: 0, total: 0 };
    
    let subtotal = 0;
    selectedSeats.forEach(s => {
      const row = s[0];
      const tier = getSeatTier(row);
      const price = selectedShowtime.priceTiers[tier] || 15;
      subtotal += price;
    });

    let snacksTotal = 0;
    Object.keys(snacks).forEach(id => {
      const item = SNACK_OPTIONS.find(s => s.id === id);
      if (item) {
        snacksTotal += item.price * snacks[id];
      }
    });

    const tax = Math.round((subtotal + snacksTotal) * 0.1 * 100) / 100;
    const total = Math.round((subtotal + snacksTotal + tax) * 100) / 100;

    return { subtotal, snacksTotal, tax, total };
  };

  const { subtotal, snacksTotal, tax, total } = calculatePricing();

  const handleConfirmBooking = async () => {
    if (!user) {
      onOpenAuth();
      return;
    }

    if (selectedSeats.length === 0) {
      setErrorMessage('Please pick at least one seat on the screen.');
      return;
    }

    setBookingLoading(true);
    setErrorMessage('');

    try {
      // Build snacks array
      const snackPayload = Object.keys(snacks).map(id => {
        const item = SNACK_OPTIONS.find(s => s.id === id);
        return { item: item.name, qty: snacks[id], price: item.price };
      });

      // Primary tier based on selected seats
      const primaryTier = getSeatTier(selectedSeats[0][0]);

      const res = await api.createBooking({
        showtimeId: selectedShowtime._id,
        seats: selectedSeats,
        tier: primaryTier,
        snacks: snackPayload,
        paymentMethod
      });

      if (res.success && res.booking) {
        // Trigger celebratory confetti
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 }
        });
        onBookingSuccess(res.booking);
      } else {
        setErrorMessage(res.message || 'Seat reservation failed. Please try again.');
      }
    } catch (err) {
      setErrorMessage(err.message || 'Network error while booking tickets.');
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <div 
      className="modal fade show d-block" 
      tabIndex="-1" 
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.88)', backdropFilter: 'blur(10px)', zIndex: 1050 }}
    >
      <div className="modal-dialog modal-dialog-centered modal-xl modal-dialog-scrollable">
        <div className="modal-content bg-dark text-white border border-secondary border-opacity-25 rounded-4 shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="modal-header border-secondary border-opacity-25 px-4 py-3 bg-black bg-opacity-40">
            <div className="d-flex align-items-center gap-3">
              <img 
                src={movie.poster} 
                alt={movie.title} 
                className="rounded-2 shadow-sm d-none d-sm-block"
                style={{ width: 42, height: 56, objectFit: 'cover' }}
              />
              <div>
                <h4 className="modal-title fw-bold text-white mb-0 d-flex align-items-center gap-2">
                  {movie.title}
                  <span className="badge bg-secondary border border-secondary border-opacity-50 fs-6 fw-normal">
                    {movie.certificate || 'PG-13'}
                  </span>
                </h4>
                <div className="text-secondary small d-flex flex-wrap gap-2 mt-1">
                  <span><i className="bi bi-clock me-1"></i>{movie.duration}</span>
                  <span>•</span>
                  <span>{movie.language}</span>
                  <span>•</span>
                  <span className="text-warning"><i className="bi bi-star-fill me-1"></i>{movie.rating}/10</span>
                </div>
              </div>
            </div>

            <button 
              type="button" 
              className="btn-close btn-close-white" 
              onClick={onClose}
              aria-label="Close"
            />
          </div>

          {/* Modal Body */}
          <div className="modal-body px-4 py-3">
            {/* Step Navigation Pill */}
            <div className="d-flex justify-content-center gap-2 mb-4">
              <button 
                className={`btn btn-sm rounded-pill px-3 ${step === 'seats' ? 'btn-danger' : 'btn-dark'}`}
                onClick={() => setStep('seats')}
              >
                1. Select Seats
              </button>
              <button 
                className={`btn btn-sm rounded-pill px-3 ${step === 'snacks' ? 'btn-danger' : 'btn-dark'}`}
                disabled={selectedSeats.length === 0}
                onClick={() => setStep('snacks')}
              >
                2. F&B Snacks ({Object.values(snacks).reduce((a, b) => a + b, 0)})
              </button>
              <button 
                className={`btn btn-sm rounded-pill px-3 ${step === 'checkout' ? 'btn-danger' : 'btn-dark'}`}
                disabled={selectedSeats.length === 0}
                onClick={() => setStep('checkout')}
              >
                3. Checkout & Pay
              </button>
            </div>

            {errorMessage && (
              <div className="alert alert-danger py-2 px-3 small rounded-3 d-flex align-items-center gap-2 mb-3">
                <i className="bi bi-exclamation-triangle-fill fs-5"></i>
                <span>{errorMessage}</span>
              </div>
            )}

            {/* STEP 1: SEATS */}
            {step === 'seats' && (
              <div>
                {/* Date Strip */}
                <div className="mb-3">
                  <label className="text-secondary small fw-bold text-uppercase tracking-wider mb-2 d-block">
                    Select Screening Date
                  </label>
                  <div className="d-flex gap-2 overflow-x-auto pb-2">
                    {dates.map((d, i) => (
                      <div
                        key={i}
                        className={`date-pill ${selectedDate === d.dateStr ? 'active' : ''}`}
                        onClick={() => setSelectedDate(d.dateStr)}
                      >
                        <div className="fw-bold small">{d.dayName}</div>
                        <div className="text-white-50" style={{ fontSize: '0.75rem' }}>{d.dateFormatted}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Showtimes & Theater Selection */}
                <div className="mb-4">
                  <label className="text-secondary small fw-bold text-uppercase tracking-wider mb-2 d-block">
                    Select Hall & Showtime
                  </label>
                  {loadingShowtimes ? (
                    <div className="text-center py-3 text-secondary">
                      <div className="spinner-border spinner-border-sm text-danger me-2" role="status"></div>
                      Loading showtimes...
                    </div>
                  ) : showtimes.length === 0 ? (
                    <div className="alert alert-dark text-white-50 small">
                      No showtimes scheduled for this date. Please pick another date.
                    </div>
                  ) : (
                    <div className="d-flex flex-wrap gap-2">
                      {showtimes.map(st => (
                        <button
                          key={st._id}
                          className={`btn btn-sm d-flex flex-column text-start p-2 rounded-3 transition-all ${selectedShowtime?._id === st._id ? 'btn-danger shadow-sm' : 'btn-outline-secondary'}`}
                          onClick={() => {
                            setSelectedShowtime(st);
                            setSelectedSeats([]);
                          }}
                        >
                          <span className="fw-bold fs-6">{st.time}</span>
                          <span className="small opacity-75" style={{ fontSize: '0.7rem' }}>
                            {st.screenName} • {st.theaterName.split(' ')[1] || 'Hall'}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Cinema Curved Screen */}
                <div className="cinema-screen-container">
                  <div className="cinema-screen-curve" />
                  <div className="cinema-screen-label">
                    <i className="bi bi-display me-1"></i> ALL EYES THIS WAY (SCREEN)
                  </div>
                </div>

                {/* Interactive Seat Matrix */}
                <div className="seat-grid my-4">
                  {ROWS.map(row => {
                    const tier = getSeatTier(row);
                    return (
                      <div key={row} className="seat-row">
                        <span className="seat-row-label">{row}</span>
                        {COLS.map(col => {
                          const seatId = `${row}${col}`;
                          const booked = isSeatBooked(seatId);
                          const selected = selectedSeats.includes(seatId);

                          return (
                            <div
                              key={seatId}
                              className={`seat-unit ${tier.toLowerCase()} ${selected ? 'selected' : ''} ${booked ? 'booked' : ''}`}
                              onClick={() => handleSeatClick(seatId)}
                              title={booked ? `${seatId} - Booked` : `${seatId} (${tier}) - $${selectedShowtime?.priceTiers?.[tier] || 15}`}
                            >
                              {booked ? <i className="bi bi-x small"></i> : col}
                            </div>
                          );
                        })}
                        <span className="seat-row-label">{row}</span>
                      </div>
                    );
                  })}
                </div>

                {/* Legend & Tier Pricing */}
                <div className="d-flex flex-wrap justify-content-center align-items-center gap-4 py-3 bg-black bg-opacity-40 rounded-3 border border-secondary border-opacity-10 my-3 small">
                  <div className="d-flex align-items-center gap-2">
                    <div className="seat-unit silver" style={{ width: 22, height: 22, fontSize: 10 }}>A</div>
                    <span>Silver (${selectedShowtime?.priceTiers?.Silver || 15})</span>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <div className="seat-unit gold" style={{ width: 22, height: 22, fontSize: 10 }}>C</div>
                    <span>Gold (${selectedShowtime?.priceTiers?.Gold || 20})</span>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <div className="seat-unit vip" style={{ width: 22, height: 22, fontSize: 10 }}>F</div>
                    <span>VIP Recliner (${selectedShowtime?.priceTiers?.VIP || 27})</span>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <div className="seat-unit selected" style={{ width: 22, height: 22, fontSize: 10 }}>✓</div>
                    <span className="text-danger fw-bold">Selected</span>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <div className="seat-unit booked" style={{ width: 22, height: 22, fontSize: 10 }}>✕</div>
                    <span className="text-secondary">Booked</span>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: SNACKS & CONCESSIONS */}
            {step === 'snacks' && (
              <div className="py-2">
                <div className="text-center mb-4">
                  <h4 className="fw-bold text-white mb-1">Popcorn & Cinema Concessions</h4>
                  <p className="text-white-50 small">Treat yourself! Delivered fresh to your cinema seat.</p>
                </div>

                <div className="row row-cols-1 row-cols-md-2 g-3">
                  {SNACK_OPTIONS.map(snack => {
                    const count = snacks[snack.id] || 0;
                    return (
                      <div key={snack.id} className="col">
                        <div className="glass-panel p-3 d-flex align-items-center justify-content-between">
                          <div className="d-flex align-items-center gap-3">
                            <span className="fs-1">{snack.icon}</span>
                            <div>
                              <h6 className="fw-bold text-white mb-0">{snack.name}</h6>
                              <span className="text-warning fw-semibold">${snack.price.toFixed(2)}</span>
                            </div>
                          </div>
                          <div className="d-flex align-items-center gap-2">
                            <button
                              className="btn btn-sm btn-dark border border-secondary border-opacity-50"
                              onClick={() => handleSnackChange(snack.id, -1)}
                              disabled={count === 0}
                            >
                              <i className="bi bi-dash"></i>
                            </button>
                            <span className="fw-bold px-2 fs-6">{count}</span>
                            <button
                              className="btn btn-sm btn-danger"
                              onClick={() => handleSnackChange(snack.id, 1)}
                            >
                              <i className="bi bi-plus"></i>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* STEP 3: CHECKOUT */}
            {step === 'checkout' && (
              <div className="py-2">
                <div className="row g-4">
                  {/* Order Summary */}
                  <div className="col-md-7">
                    <div className="glass-panel p-4 h-100">
                      <h5 className="fw-bold text-white mb-3 d-flex align-items-center gap-2">
                        <i className="bi bi-receipt text-danger"></i> Reservation Summary
                      </h5>
                      <div className="border-bottom border-secondary border-opacity-25 pb-3 mb-3">
                        <h6 className="text-warning fw-bold mb-1">{movie.title}</h6>
                        <div className="text-white-50 small">
                          <div><i className="bi bi-geo-alt me-1"></i>{selectedShowtime?.theaterName}</div>
                          <div><i className="bi bi-display me-1"></i>{selectedShowtime?.screenName}</div>
                          <div><i className="bi bi-calendar3 me-1"></i>{selectedShowtime?.date} at {selectedShowtime?.time}</div>
                        </div>
                      </div>

                      <div className="d-flex justify-content-between mb-2 small">
                        <span>Selected Seats ({selectedSeats.join(', ')})</span>
                        <span className="fw-bold text-white">${subtotal.toFixed(2)}</span>
                      </div>

                      {snacksTotal > 0 && (
                        <div className="d-flex justify-content-between mb-2 small">
                          <span>Concessions & Snacks</span>
                          <span className="fw-bold text-white">${snacksTotal.toFixed(2)}</span>
                        </div>
                      )}

                      <div className="d-flex justify-content-between mb-2 small text-white-50">
                        <span>Service Tax & Fees (10%)</span>
                        <span>${tax.toFixed(2)}</span>
                      </div>

                      <div className="d-flex justify-content-between pt-3 border-top border-secondary border-opacity-25 fs-5 fw-bold">
                        <span>Total Due</span>
                        <span className="text-danger">${total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Payment Simulator */}
                  <div className="col-md-5">
                    <div className="glass-panel p-4 h-100">
                      <h5 className="fw-bold text-white mb-3 d-flex align-items-center gap-2">
                        <i className="bi bi-credit-card text-danger"></i> Simulated Payment
                      </h5>

                      <div className="mb-3">
                        <label className="text-secondary small fw-bold mb-2 d-block">Select Payment Option</label>
                        <div className="d-flex flex-column gap-2">
                          {['Credit / Debit Card', 'Apple Pay / Google Pay', 'Instant Movie Pass'].map((method) => (
                            <label 
                              key={method}
                              className={`p-2 rounded-3 border d-flex align-items-center gap-2 cursor-pointer ${paymentMethod === method ? 'border-danger bg-danger bg-opacity-10' : 'border-secondary border-opacity-25 bg-dark'}`}
                              style={{ cursor: 'pointer' }}
                            >
                              <input 
                                type="radio" 
                                name="payment" 
                                value={method} 
                                checked={paymentMethod === method}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                              />
                              <span className="small text-white">{method}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      <div className="alert alert-dark border-secondary border-opacity-25 py-2 px-3 small text-white-50 mb-4">
                        <i className="bi bi-shield-check text-success me-1"></i> Sandbox Payment Mode. No real money charged.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="modal-footer border-secondary border-opacity-25 px-4 py-3 bg-black bg-opacity-40 d-flex justify-content-between align-items-center">
            <div>
              <div className="small text-white-50">
                {selectedSeats.length > 0 ? (
                  <span>
                    Seats: <strong className="text-white">{selectedSeats.join(', ')}</strong> ({selectedSeats.length} {selectedSeats.length === 1 ? 'ticket' : 'tickets'})
                  </span>
                ) : (
                  <span>No seats selected</span>
                )}
              </div>
              <div className="fs-5 fw-bold text-danger">
                Total: ${total.toFixed(2)}
              </div>
            </div>

            <div className="d-flex gap-2">
              {step === 'seats' && (
                <button
                  className="btn btn-cinema"
                  disabled={selectedSeats.length === 0}
                  onClick={() => setStep('snacks')}
                >
                  Continue to Snacks <i className="bi bi-arrow-right"></i>
                </button>
              )}

              {step === 'snacks' && (
                <>
                  <button className="btn btn-outline-secondary" onClick={() => setStep('seats')}>
                    <i className="bi bi-arrow-left"></i> Back to Seats
                  </button>
                  <button className="btn btn-cinema" onClick={() => setStep('checkout')}>
                    Proceed to Payment <i className="bi bi-arrow-right"></i>
                  </button>
                </>
              )}

              {step === 'checkout' && (
                <>
                  <button className="btn btn-outline-secondary" onClick={() => setStep('snacks')}>
                    <i className="bi bi-arrow-left"></i> Back
                  </button>
                  <button
                    className="btn btn-cinema btn-lg"
                    disabled={bookingLoading}
                    onClick={handleConfirmBooking}
                  >
                    {bookingLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Reserving Seats...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-check2-circle fs-5"></i> Confirm & Pay ${total.toFixed(2)}
                      </>
                    )}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default SeatMapModal;
