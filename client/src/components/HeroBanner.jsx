import React, { useState, useEffect } from 'react';

export const HeroBanner = ({ movies, onSelectMovie, onWatchTrailer }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const featuredList = movies.filter(m => m.featured).length > 0 
    ? movies.filter(m => m.featured) 
    : movies.slice(0, 3);

  useEffect(() => {
    if (featuredList.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % featuredList.length);
    }, 7000);
    return () => clearInterval(interval);
  }, [featuredList.length]);

  if (featuredList.length === 0) return null;

  const currentMovie = featuredList[currentIndex];

  return (
    <div className="position-relative mb-5">
      <div 
        className="hero-backdrop"
        style={{ backgroundImage: `url(${currentMovie.backdrop || currentMovie.poster})` }}
      >
        <div className="hero-content">
          {/* Badges Row */}
          <div className="d-flex flex-wrap align-items-center gap-2 mb-3">
            <span 
              className="badge text-dark text-uppercase px-3 py-2 fw-bold tracking-wider rounded-pill"
              style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)', boxShadow: '0 4px 15px rgba(245, 158, 11, 0.4)' }}
            >
              <i className="bi bi-stars me-1"></i> Featured Premiere
            </span>
            <span className="badge-rating px-3 py-1 rounded-pill">
              <i className="bi bi-star-fill text-warning"></i> {currentMovie.rating} / 10
            </span>
            <span className="badge bg-dark bg-opacity-80 border border-secondary border-opacity-50 text-light px-3 py-1 rounded-pill">
              <i className="bi bi-clock-history me-1 text-warning"></i> {currentMovie.duration}
            </span>
            <span className="badge-format">
              IMAX 4K
            </span>
            <span className="badge bg-dark bg-opacity-80 border border-secondary border-opacity-50 text-info px-3 py-1 rounded-pill">
              {currentMovie.certificate || 'PG-13'}
            </span>
          </div>

          {/* Title */}
          <h1 className="display-4 fw-bold text-white mb-2 brand-font" style={{ textShadow: '0 4px 25px rgba(0,0,0,0.8)' }}>
            {currentMovie.title}
          </h1>

          {/* Tagline */}
          {currentMovie.tagline && (
            <p className="fst-italic mb-3 fs-5" style={{ color: '#fbbf24', textShadow: '0 2px 10px rgba(0,0,0,0.8)' }}>
              "{currentMovie.tagline}"
            </p>
          )}

          <p className="text-light text-opacity-85 mb-4 line-clamp-3" style={{ maxWidth: 620, fontSize: '0.96rem', lineHeight: '1.6' }}>
            {currentMovie.description}
          </p>

          {/* Genre Tags */}
          <div className="d-flex flex-wrap gap-2 mb-4">
            {currentMovie.genre && currentMovie.genre.map((g, idx) => (
              <span key={idx} className="badge bg-dark bg-opacity-75 border border-secondary border-opacity-30 text-white-50 px-3 py-1 rounded-pill">
                {g}
              </span>
            ))}
          </div>

          {/* Action CTAs */}
          <div className="d-flex flex-wrap gap-3">
            <button 
              className="btn btn-cinema btn-lg px-4 py-3 rounded-pill"
              onClick={() => onSelectMovie(currentMovie)}
            >
              <i className="bi bi-ticket-perforated-fill fs-5"></i> Reserve Luxury Seats
            </button>

            <button 
              className="btn btn-glass btn-lg px-4 py-3 rounded-pill"
              onClick={() => onWatchTrailer(currentMovie)}
            >
              <i className="bi bi-play-circle-fill fs-5 text-warning"></i> Watch Trailer
            </button>
          </div>
        </div>
      </div>

      {/* Modern Slide Dots */}
      {featuredList.length > 1 && (
        <div className="d-flex justify-content-center gap-2 mt-3">
          {featuredList.map((m, idx) => (
            <button
              key={idx}
              className={`rounded-pill border-0 transition-all ${idx === currentIndex ? 'bg-warning' : 'bg-secondary bg-opacity-40'}`}
              style={{ 
                width: idx === currentIndex ? 32 : 10, 
                height: 8, 
                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                boxShadow: idx === currentIndex ? '0 0 12px rgba(245, 158, 11, 0.8)' : 'none'
              }}
              onClick={() => setCurrentIndex(idx)}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};
export default HeroBanner;
