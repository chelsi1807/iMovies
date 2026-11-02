import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export const AuthModal = ({ onClose }) => {
  const { login, register, quickLoginUser, quickLoginAdmin } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isRegister) {
        const res = await register(formData.name, formData.email, formData.password, formData.phone);
        if (res.success) {
          onClose();
        } else {
          setError(res.message);
        }
      } else {
        const res = await login(formData.email, formData.password);
        if (res.success) {
          onClose();
        } else {
          setError(res.message);
        }
      }
    } catch (err) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickUser = async () => {
    setLoading(true);
    await quickLoginUser();
    setLoading(false);
    onClose();
  };

  const handleQuickAdmin = async () => {
    setLoading(true);
    await quickLoginAdmin();
    setLoading(false);
    onClose();
  };

  return (
    <div 
      className="modal fade show d-block" 
      tabIndex="-1" 
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.85)', backdropFilter: 'blur(8px)', zIndex: 1070 }}
    >
      <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: 440 }}>
        <div className="modal-content bg-dark text-white border border-secondary border-opacity-25 rounded-4 shadow-2xl overflow-hidden">
          <div className="modal-header border-secondary border-opacity-25 py-3 px-4 bg-black bg-opacity-40">
            <h5 className="modal-title fw-bold d-flex align-items-center gap-2">
              <i className="bi bi-person-lock text-danger"></i>
              {isRegister ? 'Create IMovies Account' : 'Sign In to IMovies'}
            </h5>
            <button 
              type="button" 
              className="btn-close btn-close-white" 
              onClick={onClose}
              aria-label="Close"
            />
          </div>

          <div className="modal-body p-4">
            {/* Quick Demo Logins Banner */}
            <div className="p-3 bg-black bg-opacity-40 rounded-3 border border-secondary border-opacity-25 mb-4 text-center">
              <div className="small text-white-50 fw-semibold mb-2">⚡ 1-CLICK DEMO ACCESS (FOR MENTOR / EVALUATOR)</div>
              <div className="d-flex gap-2 justify-content-center">
                <button
                  type="button"
                  className="btn btn-sm btn-outline-info flex-grow-1"
                  onClick={handleQuickUser}
                >
                  <i className="bi bi-person-fill me-1"></i> Demo User
                </button>
                <button
                  type="button"
                  className="btn btn-sm btn-outline-warning flex-grow-1"
                  onClick={handleQuickAdmin}
                >
                  <i className="bi bi-shield-lock-fill me-1"></i> Demo Admin
                </button>
              </div>
            </div>

            {error && (
              <div className="alert alert-danger py-2 px-3 small rounded-3 mb-3">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
              {isRegister && (
                <div>
                  <label className="text-secondary small fw-semibold">Full Name</label>
                  <input
                    type="text"
                    required
                    className="form-control bg-black text-white border-secondary border-opacity-50"
                    placeholder="Jane Doe"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
              )}

              <div>
                <label className="text-secondary small fw-semibold">Email Address</label>
                <input
                  type="email"
                  required
                  className="form-control bg-black text-white border-secondary border-opacity-50"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div>
                <label className="text-secondary small fw-semibold">Password</label>
                <input
                  type="password"
                  required
                  className="form-control bg-black text-white border-secondary border-opacity-50"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={e => setFormData({ ...formData, password: e.target.value })}
                />
              </div>

              {isRegister && (
                <div>
                  <label className="text-secondary small fw-semibold">Phone (Optional)</label>
                  <input
                    type="tel"
                    className="form-control bg-black text-white border-secondary border-opacity-50"
                    placeholder="+1 555-0100"
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
              )}

              <button
                type="submit"
                className="btn btn-cinema w-100 py-2 mt-2"
                disabled={loading}
              >
                {loading ? (
                  <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                ) : null}
                {isRegister ? 'Create Account' : 'Sign In'}
              </button>
            </form>

            <div className="text-center mt-3 small text-white-50">
              {isRegister ? (
                <span>
                  Already have an account?{' '}
                  <button 
                    type="button" 
                    className="btn btn-link text-danger p-0 small text-decoration-none"
                    onClick={() => setIsRegister(false)}
                  >
                    Sign In
                  </button>
                </span>
              ) : (
                <span>
                  Don't have an account?{' '}
                  <button 
                    type="button" 
                    className="btn btn-link text-danger p-0 small text-decoration-none"
                    onClick={() => setIsRegister(true)}
                  >
                    Register
                  </button>
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default AuthModal;
