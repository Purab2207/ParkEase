# ParkEase

**Pre-sell named parking bays for India's live events. Redirect overflow to Ola/Uber/Rapido when the lot fills. Give operators a compliance report the morning after.**

Live prototype → **[park-ease-rho.vercel.app](https://park-ease-rho.vercel.app)**

---

## The problem

Post-event exit surge at India's large-scale live events is a predictable, recurring coordination failure — not a parking shortage. RCB Chinnaswamy (June 2025) ended in a fatal stampede. Diljit Delhi (January 2025) ended in a compliance notice. Coldplay Mumbai (January 2025) left attendees in 30-minute highway gridlock. All three happened because zero parking was pre-sold, zero demand was shaped, and no structured alternative existed when the lot filled.

ParkEase is the software layer that fixes this. It does not own or operate parking — it adds a pre-booking and demand-shifting layer on top of venue infrastructure that already exists but is entirely unmanaged.

---

## What it does

| Who | What they get |
|-----|--------------|
| **Attendee (Arjun)** | Books a named parking bay (pillar code, not zone) before the event. QR confirmation cached offline — works with zero signal on event night. |
| **Overflow user (Rahul)** | When lot is full, sees a redirect screen with Ola/Uber/Rapido deep-links, pre-filled venue drop zone, and honest surge pricing copy. |
| **Event operator (Siddharth)** | Live dashboard — fill rate, spots remaining, redirect count. Auto-generated PDF compliance report ready for municipal authorities the morning after. |

---

## Prototype — 9 screens

| Screen | Route | Description |
|--------|-------|-------------|
| S1 — Event Page | `/events/:eventId` | Live scarcity counter, bay availability, CTA |
| S2 — Booking Flow | `/events/:eventId/book` | 5-step progressive disclosure: bay → window → price → UPI |
| S3 — Confirmation | `/confirmation/:bookingId` | QR code (offline-cached), WhatsApp share, UPI split |
| S4 — Redirect | `/redirect` | Parking full → Ola/Uber/Rapido deep-links |
| S5 — Operator Dashboard | `/dashboard` | Live fill rate, per-lot status, alert feed, PDF export |
| S6 — Profile | `/profile` | Booking history, upcoming events |
| S7 — Retention Event | `/retain` | Re-engagement for repeat booking |
| S8 — Retention Confirm | `/retain/confirm` | Confirmation for retained booking |
| S9 — Attendant Scanner | `/attendant` | QR scan, plate verification, bay reassignment |

---

## Stack

**Frontend** — React 19 · Tailwind CSS v4 · React Router v7 · Vite (`app/`)

**Backend** — FastAPI · MongoDB · WebSockets for live inventory counter (`backend/`)

**Deployed** — Vercel (auto-deploys on push to `main`)

> `frontend/` (Create React App) is frozen and deprecated. All active development is in `app/`.

---

## Run locally

**Frontend**
```bash
cd app
npm install
npm run dev          # http://localhost:5173
```

**Backend**
```bash
cd backend
pip install -r requirements.txt
cp .env.example .env   # set MONGO_URL, DB_NAME, DASHBOARD_API_KEY
uvicorn server:app --reload --port 8001
```

The frontend proxies `/api/*` to `localhost:8001` via `vite.config.js`.

---

## Key design decisions

- **Named bay, not zone** — "Bay B-18" is the trust signal that converts. Zone allocation is a suggestion, not a booking.
- **Offline QR** — network congestion inside a 35,000-person venue is the highest-probability failure. QR is cached on device at confirmation.
- **Manual fallback always** — printed booking list at every gate. App down is a planned state, not an emergency.
- **80% inventory cap** — 20% buffer held for VIP commandeering and authority vehicle overrides (documented at Indian stadium events).
- **Honest redirect copy** — surge pricing is acknowledged, not hidden. Three platforms shown simultaneously so one cancellation doesn't strand the user.
- **Operator dashboard is Must Have** — without the B2B operator saying yes, there is no consumer product. RICE Reach = 1, strategic value = everything.

---

## Project status

**Stage:** Prototype complete (9 screens, Vercel). Backend hardened — atomic booking, CORS restricted, dashboard API key auth, simulate-booking gated behind `DEMO_MODE`. Frontend hardened — booking ID as URL param (`/confirmation/:bookingId`), fake redirect counter removed. First live event not yet secured.

**Next milestone:** Demo to 3–5 event organiser contacts in Bangalore.

Full product context: [`01_Product/ParkEase_PRD_Condensed.md`](01_Product/ParkEase_PRD_Condensed.md)
