import React from 'react';
import { useAuth } from '../context/AuthContext';

export const Navbar = ({
  activeTab,
  setActiveTab,
  searchQuery,
  setSearchQuery,
  onOpenAuth,
  onOpenTrailer
}) => {
  const { user, logout, quickLoginUser, quickLoginAdmin, isAdmin } = useAuth();

  return (
    <nav className="glass-nav py-3 px-3 px-md-4">
      <div className="container-fluid d-flex flex-wrap align-items-center justify-content-between gap-3">
        {/* Brand */}
        <div 
          className="d-flex align-items-center gap-3 cursor-pointer"
          style={{ cursor: 'pointer' }}
          onClick={() => setActiveTab('explore')}
        >
          <div 
            className="d-flex align-items-center justify-content-center text-dark rounded-3 shadow-sm"
            style={{ 
              width: 44, 
              height: 44, 
              background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
              boxShadow: '0 4px 18px rgba(245, 158, 11, 0.45)'
            }}
          >
            <i className="bi bi-film fs-4 text-dark fw-bold"></i>
          </div>
          <div>
            <div className="d-flex align-items-center gap-2">
              <span className="fs-4 fw-bold tracking-tight text-white brand-font">
                iMovies
              </span>
              <span 
                className="badge rounded-pill fw-bold"
                style={{ 
                  background: 'rgba(245, 158, 11, 0.18)', 
                  color: '#fbbf24', 
                  border: '1px solid rgba(245, 158, 11, 0.4)',
                  fontSize: '0.65rem',
                  letterSpacing: '0.12em'
                }}
              >
                LUXE
              </span>
            </div>
            <span className="d-none d-sm-block text-secondary small" style={{ fontSize: '0.7rem', letterSpacing: '0.08em' }}>
              NEXT-GEN CINEMA CLUB
            </span>
          </div>
        </div>

        {/* Search Bar */}
        <div className="d-flex align-items-center flex-grow-1 flex-md-grow-0" style={{ maxWidth: 390, minWidth: 260 }}>
          <div className="input-group">
            <span className="input-group-text bg-dark bg-opacity-75 border-secondary border-opacity-25 text-warning">
              <i className="bi bi-search"></i>
            </span>
            <input
              type="text"
              className="form-control bg-dark bg-opacity-75 border-secondary border-opacity-25 text-white"
              placeholder="Search movies, actors, genres..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (activeTab !== 'explore') setActiveTab('explore');
              }}
              style={{ fontSize: '0.88rem' }}
            />
            {searchQuery ? (
              <button 
                className="btn btn-dark border-secondary border-opacity-25 text-secondary"
                onClick={() => setSearchQuery('')}
                title="Clear Search"
              >
                <i className="bi bi-x-lg"></i>
              </button>
            ) : (
              <span className="input-group-text bg-dark bg-opacity-75 border-secondary border-opacity-25 text-secondary small d-none d-sm-inline">
                <kbd className="bg-transparent text-secondary border border-secondary border-opacity-25 px-1 py-0" style={{ fontSize: '0.65rem' }}>Ctrl+K</kbd>
              </span>
            )}
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="d-flex align-items-center gap-2">
          <button
            className={`btn btn-sm rounded-pill px-3 py-2 fw-semibold transition-all ${activeTab === 'explore' ? 'btn-cinema' : 'btn-glass'}`}
            onClick={() => setActiveTab('explore')}
          >
            <i className="bi bi-compass me-1"></i> Explore
          </button>

          <button
            className={`btn btn-sm rounded-pill px-3 py-2 fw-semibold transition-all ${activeTab === 'theaters' ? 'btn-cinema' : 'btn-glass'}`}
            onClick={() => setActiveTab('theaters')}
          >
            <i className="bi bi-buildings me-1"></i> Theaters
          </button>

          <button
            className={`btn btn-sm rounded-pill px-3 py-2 fw-semibold transition-all ${activeTab === 'my-bookings' ? 'btn-cinema' : 'btn-glass'}`}
            onClick={() => {
              if (!user) {
                onOpenAuth();
              } else {
                setActiveTab('my-bookings');
              }
            }}
          >
            <i className="bi bi-ticket-perforated me-1"></i> My Passes
          </button>

          {isAdmin && (
            <button
              className={`btn btn-sm rounded-pill px-3 py-2 fw-semibold ${activeTab === 'admin' ? 'btn-warning text-dark' : 'btn-outline-warning'}`}
              onClick={() => setActiveTab('admin')}
            >
              <i className="bi bi-speedometer2 me-1"></i> Admin Portal
            </button>
          )}
        </div>

        {/* User / Quick Demo Actions */}
        <div className="d-flex align-items-center gap-2">
          {!user ? (
            <div className="d-flex align-items-center gap-2">
              <button 
                className="btn btn-sm btn-glass d-none d-lg-inline-flex align-items-center gap-1 rounded-pill"
                title="Quick 1-Click Demo Login as Standard User"
                onClick={quickLoginUser}
              >
                <i className="bi bi-person-fill text-warning"></i> Demo User
              </button>

              <button 
                className="btn btn-sm btn-outline-warning d-none d-lg-inline-flex align-items-center gap-1 rounded-pill"
                title="Quick 1-Click Demo Login as Cinema Admin"
                onClick={quickLoginAdmin}
              >
                <i className="bi bi-shield-lock-fill"></i> Demo Admin
              </button>

              <button 
                className="btn btn-cinema btn-sm rounded-pill px-3"
                onClick={onOpenAuth}
              >
                <i className="bi bi-box-arrow-in-right"></i> Sign In
              </button>
            </div>
          ) : (
            <div className="d-flex align-items-center gap-2">
              <div 
                className="d-flex align-items-center gap-2 px-3 py-1 rounded-pill"
                style={{ 
                  background: 'rgba(21, 31, 54, 0.85)',
                  border: '1px solid rgba(245, 158, 11, 0.35)',
                  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)'
                }}
              >
                <img 
                  src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'} 
                  alt={user.name} 
                  className="rounded-circle border border-warning border-opacity-50"
                  style={{ width: 28, height: 28, objectFit: 'cover' }}
                />
                <div className="d-flex flex-column text-start">
                  <span className="fw-bold text-white small" style={{ lineHeight: 1.2 }}>
                    {user.name.split(' ')[0]}
                  </span>
                  <span className={`badge ${user.role === 'admin' ? 'bg-warning text-dark' : 'bg-secondary bg-opacity-50 text-white-50'} p-0 text-uppercase`} style={{ fontSize: '0.6rem' }}>
                    {user.role}
                  </span>
                </div>
              </div>

              <button 
                className="btn btn-outline-danger btn-sm rounded-circle p-2 d-flex align-items-center justify-content-center"
                style={{ width: 34, height: 34 }}
                title="Log Out"
                onClick={logout}
              >
                <i className="bi bi-box-arrow-right"></i>
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
export default Navbar;
