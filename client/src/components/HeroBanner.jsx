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
    }, 6500);
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
          {/* Badges */}
          <div className="d-flex flex-wrap align-items-center gap-2 mb-3">
            <span className="badge bg-danger text-uppercase px-2 py-1 fw-bold tracking-wider">
              <i className="bi bi-fire me-1"></i> Featured Premiere
            </span>
            <span className="badge-rating">
              <i className="bi bi-star-fill"></i> {currentMovie.rating} / 10
            </span>
            <span className="badge bg-dark bg-opacity-75 border border-secondary border-opacity-50 text-light px-2 py-1">
              <i className="bi bi-clock me-1"></i> {currentMovie.duration}
            </span>
            <span className="badge bg-dark bg-opacity-75 border border-secondary border-opacity-50 text-info px-2 py-1">
              {currentMovie.certificate || 'PG-13'}
            </span>
          </div>

          {/* Title */}
          <h1 className="display-4 fw-extrabold text-white mb-2">
            {currentMovie.title}
          </h1>

          {/* Tagline or description */}
          {currentMovie.tagline && (
            <p className="text-warning fst-italic mb-2 fs-5">
              "{currentMovie.tagline}"
            </p>
          )}

          <p className="text-light text-opacity-75 mb-4 line-clamp-3" style={{ maxWidth: 580, fontSize: '0.95rem' }}>
            {currentMovie.description}
          </p>

          {/* Genre Tags */}
          <div className="d-flex flex-wrap gap-2 mb-4">
            {currentMovie.genre && currentMovie.genre.map((g, idx) => (
              <span key={idx} className="badge bg-dark bg-opacity-75 border border-secondary border-opacity-25 text-white-50 px-2 py-1">
                {g}
              </span>
            ))}
          </div>

          {/* Action CTAs */}
          <div className="d-flex flex-wrap gap-3">
            <button 
              className="btn btn-cinema btn-lg"
              onClick={() => onSelectMovie(currentMovie)}
            >
              <i className="bi bi-ticket-perforated-fill fs-5"></i> Book Tickets Now
            </button>

            <button 
              className="btn btn-glass btn-lg"
              onClick={() => onWatchTrailer(currentMovie)}
            >
              <i className="bi bi-play-circle-fill fs-5 text-danger"></i> Watch Trailer
            </button>
          </div>
        </div>
      </div>

      {/* Carousel Dots */}
      {featuredList.length > 1 && (
        <div className="d-flex justify-content-center gap-2 mt-3">
          {featuredList.map((m, idx) => (
            <button
              key={idx}
              className={`rounded-pill border-0 transition-all ${idx === currentIndex ? 'bg-danger' : 'bg-secondary bg-opacity-50'}`}
              style={{ width: idx === currentIndex ? 28 : 10, height: 8, transition: 'all 0.3s ease' }}
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
