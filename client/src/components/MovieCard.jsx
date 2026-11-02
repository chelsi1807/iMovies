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

          {/* Top Overlays */}
          <div className="position-absolute top-0 start-0 p-2 d-flex gap-1">
            <span className="badge-rating small">
              <i className="bi bi-star-fill"></i> {movie.rating}
            </span>
          </div>

          <div className="position-absolute top-0 end-0 p-2">
            <span className="badge bg-dark bg-opacity-75 border border-secondary border-opacity-50 text-light small">
              {movie.certificate || 'PG-13'}
            </span>
          </div>

          {/* Bottom Overlay Info */}
          <div className="movie-card-overlay">
            <div className="d-flex align-items-center justify-content-between text-white-50 small mb-1">
              <span><i className="bi bi-clock me-1"></i>{movie.duration}</span>
              <span>{movie.language}</span>
            </div>
            <h5 className="text-white fw-bold mb-1 text-truncate">
              {movie.title}
            </h5>
            <div className="d-flex flex-wrap gap-1 mb-2">
              {(movie.genre || []).slice(0, 2).map((g, i) => (
                <span key={i} className="badge bg-dark bg-opacity-75 border border-secondary border-opacity-25 text-white-50 p-1" style={{ fontSize: '0.65rem' }}>
                  {g}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Card Footer Actions */}
        <div className="p-3 bg-dark bg-opacity-50 d-flex align-items-center justify-content-between gap-2 border-top border-secondary border-opacity-10 mt-auto">
          <button
            className="btn btn-sm btn-outline-light d-flex align-items-center gap-1"
            onClick={(e) => {
              e.stopPropagation();
              onWatchTrailer(movie);
            }}
            title="Watch Trailer"
          >
            <i className="bi bi-play-circle text-danger"></i> Trailer
          </button>

          <button
            className="btn btn-cinema btn-sm flex-grow-1 justify-content-center"
            onClick={(e) => {
              e.stopPropagation();
              onSelectMovie(movie);
            }}
          >
            <i className="bi bi-ticket-perforated"></i> Book
          </button>
        </div>
      </div>
    </div>
  );
};
export default MovieCard;
