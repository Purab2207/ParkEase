# ParkEase Prototype — Setup Guide
## Phase 4: Prototype Validation

Get the full 5-screen demo running in under 5 minutes.

---

## Prerequisites

- Node.js 18+ installed (`node --version` to check)
- npm 9+ installed (`npm --version` to check)
- A terminal (Windows Terminal, Git Bash, or VS Code terminal)

---

## Step 1 — Create the Vite + React project

Open your terminal and run:

```bash
npm create vite@latest parksease-proto -- --template react
cd parksease-proto
npm install
```

---

## Step 2 — Install and configure Tailwind CSS

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

Open `tailwind.config.js` and replace its contents with:

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

Open `src/index.css` and replace its entire contents with:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

---

## Step 3 — Copy the prototype files

Copy all 6 files from `03_Code_Blueprints/` into `parksease-proto/src/`:

```
03_Code_Blueprints/
  App.jsx                    → src/App.jsx          (replaces the default)
  S1_VenueLanding.jsx        → src/S1_VenueLanding.jsx
  S2_BookingFlow.jsx         → src/S2_BookingFlow.jsx
  S3_BookingConfirmation.jsx → src/S3_BookingConfirmation.jsx
  S4_RedirectScreen.jsx      → src/S4_RedirectScreen.jsx
  S5_OperatorDashboard.jsx   → src/S5_OperatorDashboard.jsx
```

**Windows quick copy (run from the Parksease project root):**
```bash
cp 03_Code_Blueprints/*.jsx parksease-proto/src/
```

---

## Step 4 — Fix the entry point

Open `src/main.jsx` — it should already look like this (Vite default). If not, replace with:

```jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

---

## Step 5 — Run it

```bash
npm run dev
```

Open your browser at **http://localhost:5173**

---

## What you'll see

A dark-themed mobile UI (max-width 448px, centred on desktop).

### Demo navigation bar
A floating bar at the bottom of the screen with 6 buttons:

| Button | Screen |
|--------|--------|
| `S1` | Venue Landing Page |
| `S2` | Parking Booking Flow |
| `S3` | Booking Confirmation |
| `S4` | Cab Redirect Screen |
| `S5` | Operator Dashboard |
| `Avail` / `🔴 Full` | Toggle parking full/available state |

The nav bar is **prototype only** — not part of the real product.

---

## Demo script (3-minute organiser walkthrough)

Use this sequence when demoing to an event organiser contact (Siddharth):

**1. Open S1 — Venue Landing**
> "This is what your attendees see when they search parking for the match. 47 spots left — that counter is live from your inventory."

**2. Tap S2 — Booking Flow**
> "They pick a specific bay — not a zone, a named pillar bay. B-18, JLN North Lot. Entry window, price breakdown, UPI payment. Done in under 90 seconds."

**3. Tap S3 — Confirmation**
> "QR code, bay number, WhatsApp forward button. Rahul sends this to his group — the split request goes out automatically. One tap."

**4. Toggle 🔴 Full → S4 activates**
> "Now parking is full. Any new visitor who opens the app sees this instead. Three cab options — Ola, Uber, Rapido — pre-filled with your drop zone coordinates. Booking under 30 seconds."

**5. Tap S5 — Operator Dashboard**
> "This is your view. Fill rate 87%, 118 redirect taps, ~65 vehicles diverted. Alert feed, per-lot capacity bars, PDF compliance report at end of night. This is the data that proves the gridlock reduction to your management."

**Exit ask:** *"Would you run one event with us?"*

---

## Demo tips

- **Best viewed at mobile width** — open Chrome DevTools (`F12`), toggle device toolbar (`Ctrl+Shift+M`), set to iPhone 14 Pro or similar
- **The parking full toggle** flips between the two demo journeys instantly — no reload needed
- **S2 booking flow** requires selecting a bay first, then a time window, before the Pay button activates — walk through this slowly
- **S4 deep-links on desktop** show a popup with the constructed URI — on a real phone they open Ola/Uber/Rapido directly

---

## File structure after setup

```
parksease-proto/
├── src/
│   ├── App.jsx                    ← Demo router + nav
│   ├── S1_VenueLanding.jsx        ← Venue page (Priya / Arjun / Rahul entry)
│   ├── S2_BookingFlow.jsx         ← Booking flow (5-step)
│   ├── S3_BookingConfirmation.jsx ← QR + WhatsApp + UPI split
│   ├── S4_RedirectScreen.jsx      ← Cab redirect (Ola/Uber/Rapido)
│   ├── S5_OperatorDashboard.jsx   ← Operator view (Siddharth)
│   ├── main.jsx
│   └── index.css
├── tailwind.config.js
├── vite.config.js
└── package.json
```

---

## Prototype limitations — known and intentional

These are stubs. They are documented. Do not ship to production without addressing:

| Stub | Location | MVP replacement |
|------|----------|-----------------|
| UPI payment | S2 — `setTimeout` mock | Razorpay / PayU UPI intent API |
| Cab availability check | S4 — hardcoded state | Ola/Uber/Rapido availability signal API |
| QR code | S3 — pixel grid mock | `qrcode` npm library, server-generated from bookingId |
| Deep-link app detection | S4 — desktop alert | `navigator.getInstalledRelatedApps()` or URI scheme probe |
| UPI collect request | S3 — `setTimeout` mock | PhonePe / Razorpay collect API |
| PDF compliance report | S5 — `setTimeout` mock | Server-side PDF generation (Puppeteer / pdfkit) |
| Live inventory counter | S1, S2 — interval decay | WebSocket push from ParkEase inventory API |
| Real bay data | S2 — hardcoded grid | ParkEase operator config API (post bay mapping exercise) |
| Authentication | All screens — none | Session-based auth before any real user data |

---

## Phase 4 exit criteria (from PRD)

> At least one event organiser expresses genuine intent to pilot.

This prototype exists to get that conversation. Once you have a yes — stop building features, start the venue partnership agreement.

---

*Built: March 2026 · ParkEase Phase 4 Prototype*
