import React, { useState } from 'react';

// Open cinematic trailers and fallback HD streams for instant, unblocked playback
const CINEMA_FALLBACK_STREAMS = [
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
];

export const TrailerModal = ({ movie, onClose, onBookNow }) => {
  if (!movie) return null;

  // Extract YouTube ID from various URL formats
  const extractYouTubeId = (url, fallbackId) => {
    if (fallbackId) return fallbackId;
    if (!url) return 'Way9Dexny3w';
    const match = url.match(/(?:embed\/|v=|vi\/|youtu\.be\/|\/v\/|watch\?v=|\&v=)([^#\&\?]*).*/);
    return (match && match[1].length === 11) ? match[1] : 'Way9Dexny3w';
  };

  const videoId = extractYouTubeId(movie.trailerUrl, movie.youtubeId);
  const youtubeWatchUrl = `https://www.youtube.com/watch?v=${videoId}`;
  const embedUrl = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&playsinline=1`;

  // Allow switching between YouTube embed and Direct HTML5 Cinema Stream
  const [playerMode, setPlayerMode] = useState('youtube'); // 'youtube' | 'direct'
  const [streamIndex, setStreamIndex] = useState(0);

  return (
    <div 
      className="modal fade show d-block" 
      tabIndex="-1" 
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.88)', backdropFilter: 'blur(10px)', zIndex: 1060 }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal-dialog modal-dialog-centered modal-xl">
        <div className="modal-content bg-dark text-white border border-secondary border-opacity-25 rounded-4 overflow-hidden shadow-2xl">
          {/* Modal Header */}
          <div className="modal-header border-secondary border-opacity-25 py-3 px-4 d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center gap-2 overflow-hidden me-2">
              <div className="bg-danger bg-opacity-25 text-danger rounded-circle p-2 d-flex align-items-center justify-content-center" style={{ width: 36, height: 36 }}>
                <i className="bi bi-play-circle-fill fs-5"></i>
              </div>
              <div>
                <h5 className="modal-title fw-bold text-white text-truncate mb-0" style={{ maxWidth: '50vw' }}>
                  {movie.title} <span className="text-white-50 fw-normal small">Official Trailer</span>
                </h5>
                <div className="d-flex align-items-center gap-2 mt-1">
                  <span className="badge bg-secondary bg-opacity-50 text-white-50" style={{ fontSize: '0.7rem' }}>
                    {movie.certificate || 'PG-13'}
                  </span>
                  <span className="text-warning small" style={{ fontSize: '0.75rem' }}>
                    <i className="bi bi-star-fill me-1"></i>{movie.rating}
                  </span>
                  <span className="text-white-50 small" style={{ fontSize: '0.75rem' }}>
                    • {movie.duration}
                  </span>
                </div>
              </div>
            </div>

            <div className="d-flex align-items-center gap-2">
              {/* Direct YouTube Link Button */}
              <a
                href={youtubeWatchUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-sm btn-outline-danger d-flex align-items-center gap-1 px-3 rounded-pill"
                title="Open trailer directly on YouTube in a new tab"
              >
                <i className="bi bi-youtube"></i>
                <span className="d-none d-sm-inline">Watch on YouTube</span>
                <i className="bi bi-box-arrow-up-right small"></i>
              </a>

              {/* Close Button */}
              <button 
                type="button" 
                className="btn btn-sm btn-outline-secondary rounded-circle d-flex align-items-center justify-content-center" 
                style={{ width: 32, height: 32 }}
                onClick={onClose}
                aria-label="Close"
              >
                <i className="bi bi-x-lg"></i>
              </button>
            </div>
          </div>

          {/* Mode Switcher Bar */}
          <div className="bg-black bg-opacity-60 px-4 py-2 border-bottom border-secondary border-opacity-10 d-flex flex-wrap align-items-center justify-content-between gap-2">
            <div className="d-flex align-items-center gap-2">
              <span className="text-secondary small fw-semibold">STREAM SOURCE:</span>
              <button
                className={`btn btn-xs rounded-pill px-3 py-1 ${playerMode === 'youtube' ? 'btn-danger shadow-sm' : 'btn-outline-secondary text-white-50 border-0'}`}
                style={{ fontSize: '0.78rem' }}
                onClick={() => setPlayerMode('youtube')}
              >
                <i className="bi bi-youtube me-1"></i> YouTube Studio Trailer
              </button>
              <button
                className={`btn btn-xs rounded-pill px-3 py-1 ${playerMode === 'direct' ? 'btn-danger shadow-sm' : 'btn-outline-secondary text-white-50 border-0'}`}
                style={{ fontSize: '0.78rem' }}
                onClick={() => setPlayerMode('direct')}
              >
                <i className="bi bi-film me-1"></i> Cinema HD Stream (Direct)
              </button>
            </div>

            <div className="text-white-50 small d-none d-md-block" style={{ fontSize: '0.75rem' }}>
              <i className="bi bi-shield-check text-success me-1"></i>
              {playerMode === 'youtube' ? 'Enhanced No-Cookie Privacy Mode' : 'Direct HTML5 High-Def Stream'}
            </div>
          </div>

          {/* Video Player Body */}
          <div className="modal-body p-0 bg-black">
            <div className="ratio ratio-16x9 bg-black position-relative">
              {playerMode === 'youtube' ? (
                <iframe
                  src={embedUrl}
                  title={`${movie.title} Official Trailer`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                  className="w-100 h-100 border-0"
                />
              ) : (
                <video
                  controls
                  autoPlay
                  className="w-100 h-100"
                  src={CINEMA_FALLBACK_STREAMS[streamIndex % CINEMA_FALLBACK_STREAMS.length]}
                  poster={movie.backdrop || movie.poster}
                >
                  Your browser does not support HTML5 video streaming.
                </video>
              )}
            </div>

            {/* Helper notice if YouTube restricts external embedding in user's region */}
            <div className="p-3 bg-dark bg-opacity-90 border-top border-secondary border-opacity-15">
              <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
                <div style={{ maxWidth: 650 }}>
                  <div className="d-flex align-items-center gap-2 mb-1">
                    <span className="badge bg-danger bg-opacity-20 text-danger border border-danger border-opacity-25">
                      {Array.isArray(movie.genre) ? movie.genre.join(', ') : movie.genre}
                    </span>
                    {movie.tagline && (
                      <span className="text-white-50 small fst-italic">"{movie.tagline}"</span>
                    )}
                  </div>
                  <p className="small text-white-50 mb-0 line-clamp-2" style={{ fontSize: '0.82rem' }}>
                    {movie.description}
                  </p>
                </div>

                <div className="d-flex align-items-center gap-2">
                  <a
                    href={youtubeWatchUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline-light btn-sm rounded-pill px-3 d-flex align-items-center gap-1"
                  >
                    <i className="bi bi-youtube text-danger"></i> Open Full Video ↗
                  </a>
                  <button
                    className="btn btn-cinema btn-sm rounded-pill px-4 shadow"
                    onClick={() => {
                      onClose();
                      onBookNow(movie);
                    }}
                  >
                    <i className="bi bi-ticket-perforated-fill me-1"></i> Book Tickets Now
                  </button>
                </div>
              </div>

              {/* Fallback tip for playback errors */}
              <div className="mt-2 pt-2 border-top border-secondary border-opacity-10 d-flex flex-wrap align-items-center justify-content-between text-white-50" style={{ fontSize: '0.74rem' }}>
                <div>
                  <i className="bi bi-info-circle text-info me-1"></i>
                  <span>If YouTube shows <em>"Video unavailable"</em> or restricts embedding in your region: click <strong>Watch on YouTube</strong> or switch to <strong>Cinema HD Stream</strong>.</span>
                </div>
                {movie.cast && movie.cast.length > 0 && (
                  <div className="d-none d-lg-block">
                    <span className="text-secondary me-1">Starring:</span>
                    {movie.cast.slice(0, 3).map(c => c.name).join(', ')}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrailerModal;
