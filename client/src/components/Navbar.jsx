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
          className="d-flex align-items-center gap-2 cursor-pointer"
          style={{ cursor: 'pointer' }}
          onClick={() => setActiveTab('explore')}
        >
          <div className="d-flex align-items-center justify-content-center bg-danger text-white rounded-3 p-2 shadow-sm" style={{ width: 42, height: 42 }}>
            <i className="bi bi-film fs-4"></i>
          </div>
          <div>
            <span className="fs-4 fw-bold tracking-tight text-white">
              I<span className="text-danger">Movies</span>
            </span>
            <span className="d-none d-sm-block text-secondary small" style={{ fontSize: '0.72rem', letterSpacing: '0.05em' }}>
              CINEMA RESERVATIONS
            </span>
          </div>
        </div>

        {/* Search Bar */}
        <div className="d-flex align-items-center flex-grow-1 flex-md-grow-0" style={{ maxWidth: 380, minWidth: 260 }}>
          <div className="input-group">
            <span className="input-group-text bg-dark border-secondary border-opacity-25 text-secondary">
              <i className="bi bi-search"></i>
            </span>
            <input
              type="text"
              className="form-control bg-dark border-secondary border-opacity-25 text-white"
              placeholder="Search movies, actors, genres..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (activeTab !== 'explore') setActiveTab('explore');
              }}
              style={{ fontSize: '0.9rem' }}
            />
            {searchQuery && (
              <button 
                className="btn btn-dark border-secondary border-opacity-25 text-secondary"
                onClick={() => setSearchQuery('')}
                title="Clear Search"
              >
                <i className="bi bi-x-lg"></i>
              </button>
            )}
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="d-flex align-items-center gap-2">
          <button
            className={`btn btn-sm ${activeTab === 'explore' ? 'btn-danger' : 'btn-outline-light border-0'}`}
            onClick={() => setActiveTab('explore')}
          >
            <i className="bi bi-compass me-1"></i> Explore
          </button>

          <button
            className={`btn btn-sm ${activeTab === 'theaters' ? 'btn-danger' : 'btn-outline-light border-0'}`}
            onClick={() => setActiveTab('theaters')}
          >
            <i className="bi bi-building me-1"></i> Theaters
          </button>

          <button
            className={`btn btn-sm ${activeTab === 'my-bookings' ? 'btn-danger' : 'btn-outline-light border-0'}`}
            onClick={() => {
              if (!user) {
                onOpenAuth();
              } else {
                setActiveTab('my-bookings');
              }
            }}
          >
            <i className="bi bi-ticket-perforated me-1"></i> My Tickets
          </button>

          {isAdmin && (
            <button
              className={`btn btn-sm ${activeTab === 'admin' ? 'btn-warning text-dark fw-bold' : 'btn-outline-warning'}`}
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
                className="btn btn-sm btn-outline-secondary d-none d-lg-inline-flex align-items-center gap-1"
                title="Quick 1-Click Demo Login as Standard User"
                onClick={quickLoginUser}
              >
                <i className="bi bi-person-fill text-info"></i> Demo User
              </button>

              <button 
                className="btn btn-sm btn-outline-warning d-none d-lg-inline-flex align-items-center gap-1"
                title="Quick 1-Click Demo Login as Cinema Admin"
                onClick={quickLoginAdmin}
              >
                <i className="bi bi-shield-lock-fill"></i> Demo Admin
              </button>

              <button 
                className="btn btn-cinema btn-sm"
                onClick={onOpenAuth}
              >
                <i className="bi bi-box-arrow-in-right"></i> Sign In
              </button>
            </div>
          ) : (
            <div className="d-flex align-items-center gap-2">
              <div className="d-flex align-items-center gap-2 bg-dark bg-opacity-75 px-3 py-1 rounded-pill border border-secondary border-opacity-25">
                <img 
                  src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'} 
                  alt={user.name} 
                  className="rounded-circle"
                  style={{ width: 28, height: 28, objectFit: 'cover' }}
                />
                <div className="d-flex flex-column text-start">
                  <span className="fw-semibold text-white small" style={{ lineHeight: 1.2 }}>
                    {user.name.split(' ')[0]}
                  </span>
                  <span className={`badge ${user.role === 'admin' ? 'bg-warning text-dark' : 'bg-secondary'} p-0 text-uppercase`} style={{ fontSize: '0.6rem' }}>
                    {user.role}
                  </span>
                </div>
              </div>

              <button 
                className="btn btn-outline-danger btn-sm"
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
