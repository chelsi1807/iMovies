import React from 'react';

export const MovieCard = ({ movie, onSelectMovie, onWatchTrailer }) => {
  return (
    <div className="col">
      <div className="movie-card" onClick={() => onSelectMovie(movie)}>
        <div className="movie-poster-wrap">
          <img 
            src={movie.poster} 
            alt={movie.title} 
            loading="lazy"
          />

          {/* Top Floating Badges */}
          <div className="position-absolute top-0 start-0 p-3 d-flex gap-2">
            <span className="badge-rating small rounded-pill shadow-sm">
              <i className="bi bi-star-fill text-warning"></i> {movie.rating}
            </span>
          </div>

          <div className="position-absolute top-0 end-0 p-3">
            <span className="badge-format shadow-sm">
              {movie.certificate || 'PG-13'}
            </span>
          </div>

          {/* Bottom Overlay Info */}
          <div className="movie-card-overlay">
            <div className="d-flex align-items-center justify-content-between text-white-50 small mb-1">
              <span><i className="bi bi-clock-history me-1 text-warning"></i>{movie.duration}</span>
              <span className="badge bg-dark bg-opacity-75 border border-secondary border-opacity-25 text-info" style={{ fontSize: '0.68rem' }}>
                {movie.language}
              </span>
            </div>
            <h5 className="text-white fw-bold mb-2 text-truncate brand-font" title={movie.title}>
              {movie.title}
            </h5>
            <div className="d-flex flex-wrap gap-1 mb-1">
              {(movie.genre || []).slice(0, 2).map((g, i) => (
                <span key={i} className="badge bg-black bg-opacity-60 border border-secondary border-opacity-25 text-white-50 px-2 py-1 rounded-pill" style={{ fontSize: '0.66rem' }}>
                  {g}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Card Footer Actions */}
        <div className="p-3 bg-dark bg-opacity-70 d-flex align-items-center justify-content-between gap-2 border-top border-secondary border-opacity-15 mt-auto">
          <button
            className="btn btn-sm btn-glass d-flex align-items-center gap-1 rounded-pill px-3"
            onClick={(e) => {
              e.stopPropagation();
              onWatchTrailer(movie);
            }}
            title="Watch Trailer"
          >
            <i className="bi bi-play-circle text-warning fs-6"></i>
            <span className="d-none d-sm-inline">Trailer</span>
          </button>

          <button
            className="btn btn-cinema btn-sm flex-grow-1 justify-content-center rounded-pill py-2"
            onClick={(e) => {
              e.stopPropagation();
              onSelectMovie(movie);
            }}
          >
            <i className="bi bi-ticket-perforated"></i> Reserve
          </button>
        </div>
      </div>
    </div>
  );
};
export default MovieCard;
