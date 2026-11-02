# 🎬 iMovies LUXE — Next-Generation Cinema Experience

> **A cutting-edge, full-stack cinema reservation platform featuring an exclusive Cyber-Luxe design system, real-time seat availability tracking, 3D curved IMAX screen mapping with spotlight projection, gourmet concessions, digital barcode boarding passes, and an executive administration dashboard.**

**Author & Developer:** Chelsi Ratnawat  
**Repository:** [https://github.com/chelsi1807/iMovies](https://github.com/chelsi1807/iMovies)

---

## ✨ Distinctive UI & UX Features

- **Cyber-Luxe Aesthetics**: Custom glassmorphism surfaces (`backdrop-filter: blur(24px)`), deep obsidian backdrop with radiant ambient mesh lighting, and glowing Amber Gold (`#F59E0B`) and Cyber Cyan (`#06B6D4`) accents.
- **Cinematic Typography**: Harmonious pairing of **Space Grotesk** (for film titles and executive headlines) and **Plus Jakarta Sans** (for interface readability).
- **Interactive 3D Curved IMAX Screen**: Curved panoramic screen with realistic downward ambient projector beam illumination.
- **Tiered Seating Grid**:
  - **Silver Comfort Tier** ($15): Standard cinema seating (Rows A–B).
  - **Gold Prime Tier** ($20): Optimal viewing angle and sound center (Rows C–E).
  - **VIP Luxury Recliners** ($27): Extra-wide plush motorized recliners with armrests (Rows F–H).
- **Gourmet Cinema Concessions**: Caramel & truffle popcorn, artisan aged-queso nachos, and VIP platters with real-time checkout calculation.
- **Digital Boarding Pass**: High-density barcode graphic, holographic status ribbon, reservation ID, and instant print/PDF formatting.
- **1-Click Evaluator Switchers**: Instant guest and administrator demo switching for frictionless evaluation.

---

## 📋 Epics & Core Functionality

### 🎯 1. User Authentication & Role-Based Access Control
- Secure stateless JWT authentication with bcrypt password salting.
- Dual-role permissions (`User` and `Admin`).
- Instant 1-click evaluation accounts (`Demo User` & `Demo Admin`).

### 🎭 2. Movie Catalog & Exploration Engine
- Filter catalog by 10+ genres (Action, Sci-Fi, Adventure, Drama, Cyberpunk, etc.).
- Debounced live search across movie titles, actors, and directors.
- Embedded 4K trailers with source switching between YouTube Studio and direct HTML5 streams.

### 🏢 3. Theaters & Auditoriums Directory
- Multi-screen cinema halls with format badges (IMAX with Laser, Dolby Atmos, 4DX, VIP Lounge).
- Date strip selector with 6-day rolling screening schedule.

### 🎟️ 4. Real-Time Seat Locking & Reservation
- Dynamic seat collision prevention (returns `409 Conflict` on contested seats).
- Dynamic subtotal, service processing, and optional concession add-ons.
- Celebratory canvas confetti on reservation confirmation.

### 📊 5. Executive Administration Portal
- Real-time gross box office revenue KPIs and ticket sales counters.
- Top-grossing box office performance table.
- New movie catalog creator and screening scheduler.

---

## 🛠️ Technology Stack

| Layer | Technologies | Details |
| :--- | :--- | :--- |
| **Frontend** | **React 19, Vite 5, Bootstrap 5** | Cyber-Luxe design system, CSS modules, Canvas Confetti |
| **Typography & Icons** | **Space Grotesk, Plus Jakarta Sans, Bootstrap Icons** | Modern cinematic typography and icons |
| **Backend API** | **Node.js, Express.js** | RESTful routing, CORS handling, JWT security |
| **Data & Persistence** | **MongoDB Atlas / Mongoose / Resilient DBStore** | Scalable NoSQL schema with automatic local fallback |
| **Authentication** | **JWT & bcryptjs** | Stateless Bearer authentication |
| **Testing** | **Node.js Test Runner (`node:test`)** | 8/8 automated integration test suites passing |

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js** v18+ (tested on v20 & v24)
- **npm** v8+

### 2. Setup & Installation
```bash
# Clone the repository
git clone https://github.com/chelsi1807/iMovies.git
cd iMovies

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 3. Run Automated Tests
```bash
cd ../server
npm test
```
*Expected Result: 8 passed, 0 failed (100% test pass rate).*

### 4. Start the Application
Run both frontend and backend concurrently:

**Terminal 1 (Backend API):**
```bash
cd server
npm start
# Server active at http://localhost:5000
```

**Terminal 2 (Frontend Client):**
```bash
cd client
npm run dev
# Application live at http://localhost:5173
```

---

## 🧪 Evaluator Credentials

Use the **1-Click Demo Buttons** in the top navigation bar, or enter these credentials manually:

| Role | Email | Password |
| :--- | :--- | :--- |
| **Standard User** | `user@imovies.com` | `Password123!` |
| **Cinema Admin** | `admin@imovies.com` | `Admin123!` |

---

## 📡 RESTful API Endpoints

| Method | Endpoint | Access | Purpose |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/system/health` | Public | System status and collections count |
| `POST` | `/api/auth/register` | Public | Register new user account |
| `POST` | `/api/auth/login` | Public | Login and obtain JWT access token |
| `GET` | `/api/auth/me` | Protected | Fetch current user profile |
| `GET` | `/api/movies` | Public | List movies with genre and search query filters |
| `GET` | `/api/movies/:id` | Public | Single movie specifications and trailer URL |
| `POST` | `/api/movies` | Admin | Add new movie premiere to catalog |
| `DELETE` | `/api/movies/:id` | Admin | Remove movie from catalog |
| `GET` | `/api/showtimes` | Public | Fetch showtimes by date and movie ID |
| `POST` | `/api/showtimes` | Admin | Schedule a new screening slot |
| `POST` | `/api/bookings` | Protected | Reserve seats and generate booking pass |
| `GET` | `/api/bookings/my-bookings` | Protected | Retrieve user's active & past bookings |
| `PUT` | `/api/bookings/:id/cancel` | Protected | Cancel booking and release seats |
| `GET` | `/api/admin/stats` | Admin | Box office revenue, ticket sales, and analytics |

---

*iMovies LUXE — Designed & Developed by Chelsi Ratnawat.*
