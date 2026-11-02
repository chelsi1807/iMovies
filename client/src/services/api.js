const API_BASE = import.meta.env.VITE_API_URL || (window.location.port === '5173' ? 'http://localhost:5000/api' : '/api');

const getHeaders = () => {
  const token = localStorage.getItem('imovies_token');
  const headers = { 'Content-Type': 'application/json' };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

export const api = {
  // Auth
  async login(email, password) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    return res.json();
  },

  async register(data) {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async getMe() {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: getHeaders()
    });
    return res.json();
  },

  // Movies
  async getMovies(params = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/movies?${query}`);
    return res.json();
  },

  async getFeaturedMovies() {
    const res = await fetch(`${API_BASE}/movies/featured`);
    return res.json();
  },

  async getMovieById(id) {
    const res = await fetch(`${API_BASE}/movies/${id}`);
    return res.json();
  },

  async createMovie(data) {
    const res = await fetch(`${API_BASE}/movies`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async updateMovie(id, data) {
    const res = await fetch(`${API_BASE}/movies/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async deleteMovie(id) {
    const res = await fetch(`${API_BASE}/movies/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    return res.json();
  },

  // Theaters & Showtimes
  async getTheaters() {
    const res = await fetch(`${API_BASE}/showtimes/theaters`);
    return res.json();
  },

  async getShowtimes(params = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/showtimes?${query}`);
    return res.json();
  },

  async getShowtimeById(id) {
    const res = await fetch(`${API_BASE}/showtimes/${id}`);
    return res.json();
  },

  async createShowtime(data) {
    const res = await fetch(`${API_BASE}/showtimes`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async deleteShowtime(id) {
    const res = await fetch(`${API_BASE}/showtimes/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    return res.json();
  },

  // Bookings
  async createBooking(data) {
    const res = await fetch(`${API_BASE}/bookings`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async getMyBookings() {
    const res = await fetch(`${API_BASE}/bookings/my-bookings`, {
      headers: getHeaders()
    });
    return res.json();
  },

  async getBookingById(id) {
    const res = await fetch(`${API_BASE}/bookings/${id}`, {
      headers: getHeaders()
    });
    return res.json();
  },

  async cancelBooking(id) {
    const res = await fetch(`${API_BASE}/bookings/${id}/cancel`, {
      method: 'PUT',
      headers: getHeaders()
    });
    return res.json();
  },

  // Admin
  async getAdminStats() {
    const res = await fetch(`${API_BASE}/admin/stats`, {
      headers: getHeaders()
    });
    return res.json();
  },

  // Health
  async getHealth() {
    const res = await fetch(`${API_BASE}/system/health`);
    return res.json();
  }
};
