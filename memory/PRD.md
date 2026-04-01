# ParkEase — PRD & Progress Tracker

## Original Problem Statement
ParkEase is a two-sided event parking platform for India. Phase 0 prototype (6 screens, React+Vite+Tailwind) was complete. User requested Phase 1 MVP Backend implementation, task by task, all in demo mode (no third-party charges).

## Architecture
- **Backend**: FastAPI + MongoDB (port 8001)
- **Frontend**: React (CRA) + Tailwind CSS v3 (port 3000)
- **Database**: MongoDB (local, `parkease` DB)
- **Collections**: `events`, `bays`, `bookings`

## User Personas (from PRD)
| Persona | Who | Key need |
|---------|-----|----------|
| Arjun | 35, IPL fan | Named bay guarantee — "Pillar B, Bay 14" |
| Priya | 38, mother | Distance to gate as headline — "280m, covered path" |
| Rahul | 22, Gen Z | Scarcity FOMO + group UPI split |
| Siddharth | Venue ops (B2B) | Dashboard + PDF compliance report |

## Core Requirements
- Named pillar bay (never a zone)
- Live scarcity counter
- Redirect to Ola/Uber/Rapido when full
- Operator dashboard with PDF report
- All payments/OTP/push MOCKED for demo

## What's Been Implemented

### Phase 1, Task 1: Inventory Database + APIs (2026-04-01)
**Backend:**
- MongoDB collections: events, bays, bookings
- Seed data: Karan Aujla event, 35 bays (20 North + 15 South), 435 mock bookings (87% fill)
- API endpoints:
  - `GET /api/events` — list events
  - `GET /api/events/{id}` — event detail with live spots
  - `GET /api/events/{id}/bays` — bay grid with availability
  - `GET /api/events/{id}/stats` — operator dashboard stats
  - `POST /api/bookings` — create booking (mock payment, auto-confirm)
  - `GET /api/bookings/{id}` — booking detail with enriched data

**Frontend (ported from Vite prototype):**
- 6 screens: S1 Venue Landing, S2 Booking Flow, S3 Confirmation, S4 Redirect, S5 Dashboard, S6 Retention
- 3 components: Navbar, AuthModal, SearchOverlay
- S1, S2, S3, S5 fetch live data from backend APIs
- Full demo mode with DemoNav for screen switching

**Testing:** 100% pass rate (backend, frontend, integration)

### Phase 1, Task 2: Real-time Scarcity Counter (2026-04-01)
**Backend:**
- WebSocket endpoint: `/api/ws/events/{event_id}/live`
  - Sends initial count on connect
  - Broadcasts updates to all clients when bookings happen
  - Ping/pong for keep-alive
- Simulation endpoint: `POST /api/events/{event_id}/simulate-booking` for demo
- `create_booking` now broadcasts live counts to all connected WebSocket clients

**Frontend:**
- `useLiveSpots` hook: WebSocket connection with auto-reconnect + polling fallback
- S1 Venue Landing: Green pulsing "LIVE" indicator, real-time spot count from WebSocket
- S2 Booking Flow: "Live" badge in header, real-time scarcity banner

**Testing:** 100% pass rate (14/14 backend, all frontend, all integration)

## Prioritized Backlog

### P0 (Phase 1 remaining)
- [x] Task 1: Inventory Database + APIs
- [x] Task 2: Real-time Scarcity Counter (WebSocket)
- [ ] Task 3: UPI Payment mock flow improvement
- [ ] Task 4: QR Code generation (qrcode library)
- [ ] Task 5: OTP verification mock
- [ ] Task 6: URL routing (React Router)
- [ ] Task 7: Push notifications mock

### P1 (Phase 2)
- [ ] Operator auth + login
- [ ] Live dashboard with real-time data
- [ ] PDF report generation (server-side)
- [ ] Event config UI

### P2 (Phase 3+)
- [ ] BookMyShow checkout embed
- [ ] Ola/Uber API callback
- [ ] WhatsApp Business API
- [ ] Google Maps routing
- [ ] IoT sensor integration

## Next Tasks
1. Task 2: Real-time Scarcity Counter
2. Task 3: Mock UPI Payment Flow
3. Task 4: QR Code Generation