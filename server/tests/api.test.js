import test from 'node:test';
import assert from 'node:assert/strict';
import app from '../src/app.js';

let server;
let baseUrl;
let userToken = '';
let adminToken = '';
let testShowtimeId = '';
let testBookingId = '';

test.before(async () => {
  return new Promise((resolve) => {
    server = app.listen(0, () => {
      const port = server.address().port;
      baseUrl = `http://localhost:${port}`;
      resolve();
    });
  });
});

test.after(async () => {
  return new Promise((resolve) => {
    server.close(resolve);
  });
});

test('1. GET /api/system/health - Health check and collection counts', async () => {
  const res = await fetch(`${baseUrl}/api/system/health`);
  const data = await res.json();
  assert.equal(res.status, 200);
  assert.equal(data.status, 'online');
  assert.ok(data.counts.movies > 0, 'Should have seeded movies');
  assert.ok(data.counts.theaters > 0, 'Should have seeded theaters');
  assert.ok(data.counts.showtimes > 0, 'Should have seeded showtimes');
});

test('2. GET /api/movies - Retrieves movie catalog with filtering', async () => {
  const res = await fetch(`${baseUrl}/api/movies?genre=Sci-Fi`);
  const data = await res.json();
  assert.equal(res.status, 200);
  assert.ok(Array.isArray(data.movies));
  assert.ok(data.movies.length > 0);
  data.movies.forEach(m => {
    assert.ok(m.genre.includes('Sci-Fi'));
  });
});

test('3. POST /api/auth/login - User and Admin authentication', async () => {
  // Test user login
  const userRes = await fetch(`${baseUrl}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'user@imovies.com', password: 'Password123!' })
  });
  const userData = await userRes.json();
  assert.equal(userRes.status, 200);
  assert.ok(userData.token);
  assert.equal(userData.user.role, 'user');
  userToken = userData.token;

  // Test admin login
  const adminRes = await fetch(`${baseUrl}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@imovies.com', password: 'Admin123!' })
  });
  const adminData = await adminRes.json();
  assert.equal(adminRes.status, 200);
  assert.ok(adminData.token);
  assert.equal(adminData.user.role, 'admin');
  adminToken = adminData.token;

  // Test invalid password
  const failRes = await fetch(`${baseUrl}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'user@imovies.com', password: 'WrongPassword' })
  });
  assert.equal(failRes.status, 401);
});

test('4. GET /api/showtimes - Retrieve showtimes for date/movie', async () => {
  const res = await fetch(`${baseUrl}/api/showtimes`);
  const data = await res.json();
  assert.equal(res.status, 200);
  assert.ok(data.showtimes.length > 0);
  testShowtimeId = data.showtimes[0]._id;
});

test('5. POST /api/bookings - Book tickets and verify seat locking', async () => {
  const bookingPayload = {
    showtimeId: testShowtimeId,
    seats: ['A1', 'A2'],
    tier: 'Gold',
    snacks: [{ item: 'Caramel Popcorn (L)', qty: 1, price: 8 }],
    paymentMethod: 'Test Card'
  };

  // Successful booking
  const res = await fetch(`${baseUrl}/api/bookings`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${userToken}`
    },
    body: JSON.stringify(bookingPayload)
  });
  const data = await res.json();
  assert.equal(res.status, 201);
  assert.ok(data.booking._id);
  assert.equal(data.booking.seats.length, 2);
  assert.ok(data.booking.bookingCode.startsWith('IMV-'));
  testBookingId = data.booking._id;

  // Concurrency check: duplicate seat booking must fail with 409 Conflict
  const conflictRes = await fetch(`${baseUrl}/api/bookings`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${userToken}`
    },
    body: JSON.stringify(bookingPayload)
  });
  const conflictData = await conflictRes.json();
  assert.equal(conflictRes.status, 409);
  assert.ok(conflictData.conflictSeats.includes('A1'));
});

test('6. GET /api/bookings/my-bookings - Fetch user booking history', async () => {
  const res = await fetch(`${baseUrl}/api/bookings/my-bookings`, {
    headers: { 'Authorization': `Bearer ${userToken}` }
  });
  const data = await res.json();
  assert.equal(res.status, 200);
  assert.ok(data.bookings.length >= 1);
});

test('7. PUT /api/bookings/:id/cancel - Cancellation releases reserved seats', async () => {
  const res = await fetch(`${baseUrl}/api/bookings/${testBookingId}/cancel`, {
    method: 'PUT',
    headers: { 'Authorization': `Bearer ${userToken}` }
  });
  const data = await res.json();
  assert.equal(res.status, 200);
  assert.equal(data.booking.paymentStatus, 'CANCELLED');

  // Verify seats A1 & A2 are now available again!
  const showtimeRes = await fetch(`${baseUrl}/api/showtimes/${testShowtimeId}`);
  const showtimeData = await showtimeRes.json();
  const isA1Booked = (showtimeData.showtime.bookedSeats || []).some(s => s.seatNumber === 'A1');
  assert.equal(isA1Booked, false, 'Seat A1 should be released after cancellation');
});

test('8. GET /api/admin/stats - Admin security and stats', async () => {
  // Regular user must get 403 Forbidden
  const userAccess = await fetch(`${baseUrl}/api/admin/stats`, {
    headers: { 'Authorization': `Bearer ${userToken}` }
  });
  assert.equal(userAccess.status, 403);

  // Admin user gets 200 with stats
  const adminAccess = await fetch(`${baseUrl}/api/admin/stats`, {
    headers: { 'Authorization': `Bearer ${adminToken}` }
  });
  const statsData = await adminAccess.json();
  assert.equal(adminAccess.status, 200);
  assert.ok(statsData.stats.totalRevenue >= 0);
  assert.ok(statsData.stats.movieStats.length > 0);
});
