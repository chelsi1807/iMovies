# 🎬 IMovies - Movie Ticket Booking Made Simple

> **A seamless, full-stack cinema reservation platform that elevates the moviegoing experience with real-time seat availability tracking, interactive curved theater mapping, concession add-ons, digital barcode ticketing, and an executive administration dashboard.**

---

## 🌟 Demo & GitHub Links

- **Live Deployed Application**: [https://imovies-app-vd75.onrender.com](https://imovies-app-vd75.onrender.com)
- **RESTful API Backend & Health**: [https://imovies-app-vd75.onrender.com/api/system/health](https://imovies-app-vd75.onrender.com/api/system/health)
- **GitHub Repository**: [https://github.com/chelsi1807/iMovies](https://github.com/chelsi1807/iMovies)

---

## 📋 Project Epics & Feature Breakdown

### 🎯 Epic 1: User Authentication & Role-Based Access Control
- **Secure Authentication**: JWT token authentication with bcrypt password hashing.
- **Roles**: Standard `User` and `Admin` permissions.
- **1-Click Quick Demo Switchers**:
  - `👤 Demo User` (`user@imovies.com` / `Password123!`)
  - `⚡ Demo Admin` (`admin@imovies.com` / `Admin123!`)
- **Profile Management**: User profile view, avatar display, and details update.

### 🎭 Epic 2: Movie Catalog & Exploration Engine
- **Rich Movie Catalog**: High-resolution posters, backdrops, cast directories, duration, certifications (`PG-13`, `R`, `PG`), and IMDb ratings.
- **Live Search & Filter**: Real-time search across titles, actors, and genres.
- **Genre Filtering**: Sci-Fi, Action, Drama, Cyberpunk, Fantasy, Romance.
- **Embedded Trailers**: 16:9 embedded player modals for instant viewing.

### 🏢 Epic 3: Partner Theaters, Auditoriums & Showtimes
- **Cinemas**: Multi-screen auditoriums (IMAX Laser, Dolby Cinema 4K, VIP Lounge).
- **Date Strip**: Interactive horizontal calendar selector (Today, Tomorrow, and upcoming dates).
- **Format Tagging**: Real-time screening slots with screen format indicators.

### 🎟️ Epic 4: Interactive Curved Cinema Screen & Visual Seat Matrix
- **3D Curved Screen Graphic**: Perspective glowing screen with `ALL EYES THIS WAY (SCREEN)`.
- **Seating Rows (A to H)**:
  - **Silver Tier** ($15): Rows A-B (Standard comfort)
  - **Gold Tier** ($20): Rows C-E (Optimal viewing angle)
  - **VIP Luxury Recliners** ($27): Rows F-H (Motorized plush recliners)
- **Real-Time Seat Locking**: Concurrency check prevents double-booking (returns `409 Conflict` if contested).

### 🍿 Epic 5: Concessions, Checkout & Digital Cinema Pass
- **Food & Beverage Stand**: Add Caramel Popcorn, Cheesy Nachos, Fountain Sodas, and Cinema Combos.
- **Dynamic Price Breakdown**: Real-time ticket calculation, taxes, snack total, and grand total.
- **Confetti Celebration**: Canvas confetti blast on successful reservation.
- **Digital Cinema Pass**: Complete with movie poster, theater hall, seat numbers, screening time, and generated barcode / QR code ready for printing or mobile scanning.

### 📊 Epic 6: Booking Management & Executive Admin Dashboard
- **User Reservations View**: Check past and active bookings with live status.
- **One-Click Ticket Cancellation**: Cancels reservation and immediately releases reserved seats back to the hall inventory.
- **Executive Admin Portal**:
  - Total Gross Box Office Revenue card
  - Total Tickets Sold across formats
  - Active Movies & Screening count
  - Box Office Performance ranking table
  - Add New Movie Premiere form
  - Showtime Scheduler tool
  - Recent Transactions live feed

---

## 🛠️ Technology Stack & Skills Required

| Component | Technology | Description |
| :--- | :--- | :--- |
| **Frontend Framework** | **React.js (v19 + Vite)** | Dynamic and responsive component architecture |
| **Styling & Icons** | **Bootstrap 5 + Icons + Vanilla CSS** | Cyberpunk/Cinema dark luxury design system |
| **Backend Runtime** | **Node.js (v24)** | High-throughput asynchronous runtime |
| **Web Server** | **Express.js (v4.21)** | RESTful routing, middleware, and CORS handling |
| **Database** | **MongoDB / Mongoose / Resilient DBStore** | Full NoSQL schema modeling with zero-downtime persistence |
| **Authentication** | **JSON Web Token (JWT) & bcryptjs** | Stateless Bearer token security and password salting |
| **Testing** | **Node Test Runner (`node:test`)** | Automated integration tests for auth, seats, and bookings |

---

## 🚀 Quick Start & Installation

### 1. Prerequisites
- **Node.js** v18+ (tested on Node v24)
- **npm** v8+

### 2. Clone / Open Directory
```bash
cd imovies-app
```

### 3. Install Dependencies
```bash
# Server dependencies
cd server
npm install

# Client dependencies
cd ../client
npm install
```

### 4. Run the Test Suite
```bash
cd server
npm test
```
*Output: 8/8 integration tests passing (100% pass rate).*

### 5. Start Development Servers
In terminal 1 (Backend):
```bash
cd server
npm start
# Server listens at http://localhost:5000
```

In terminal 2 (Frontend):
```bash
cd client
npm run dev
# Frontend live at http://localhost:5173
```

---

## 📡 RESTful API Reference

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/system/health` | Public | System status and document counts |
| `POST` | `/api/auth/register` | Public | Register new user account |
| `POST` | `/api/auth/login` | Public | Authenticate and obtain JWT token |
| `GET` | `/api/auth/me` | Protected | Get current user profile |
| `GET` | `/api/movies` | Public | Browse movies with genre/search filter |
| `GET` | `/api/movies/:id` | Public | Movie details and cast list |
| `POST` | `/api/movies` | Admin | Add new movie premiere |
| `DELETE` | `/api/movies/:id` | Admin | Remove movie from catalog |
| `GET` | `/api/showtimes` | Public | Fetch showtimes by date and movie |
| `POST` | `/api/showtimes` | Admin | Schedule a new screening time |
| `POST` | `/api/bookings` | Protected | Reserve seats and generate ticket |
| `GET` | `/api/bookings/my-bookings` | Protected | Fetch logged-in user reservations |
| `PUT` | `/api/bookings/:id/cancel` | Protected | Cancel booking and release seats |
| `GET` | `/api/admin/stats` | Admin | Executive analytics and revenue metrics |

---

## 🧪 Evaluation Credentials

- **Standard Guest / User**:
  - Email: `user@imovies.com`
  - Password: `Password123!`
  - *(Or click the `Demo User` button in the top navbar)*
- **Cinema Admin**:
  - Email: `admin@imovies.com`
  - Password: `Admin123!`
  - *(Or click the `Demo Admin` button in the top navbar)*

---

*IMovies - Crafted for cinematic excellence.*
