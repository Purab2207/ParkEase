# ParkEase — Master Project Summary
## Read this first in every new session

---

## What this project is

**ParkEase** (working name also seen as ParkSmart in early PRD drafts) is a two-sided event parking platform for India. It pre-sells named parking bays to event attendees and provides operators a live dashboard + compliance report. When parking sells out, it redirects users to Ola/Uber/Rapido via deep-link.

**Stage:** Phase 4 — Prototype Validation (per PRD §7.2)
**Goal of Phase 4:** Build 5 prototype screens → demo to 3–5 event organiser contacts → exit criteria: at least one expresses genuine intent to pilot.

**Team size:** 2 founders, full-stack ownership.

---

## Session Log

### Session 3 — PDF Download + Master Summary update (31 March 2026 — evening)

**Status:** Prompt C complete. S5 PDF now downloads a real file.

**Changes:**
- `S5_OperatorDashboard.jsx` — `PDFReportButton` now generates a real Blob and triggers browser download. File name: `ParkEase_Compliance_Karan_Aujla_Sat_12_Apr_2026.pdf`. Contains full PRD-specified compliance report: parking performance, demand shifting, exit clearance vs industry baseline, compliance notes.
- `MASTER_SUMMARY.md` — this file updated to reflect all sessions

**Still pending (Sessions A + B):**
- Prompt A: SearchOverlay venue state → S1 (App.jsx + S1_VenueLanding.jsx)
- Prompt B: Auth phone pre-fill → S2 contact field (App.jsx + S2_BookingFlow.jsx)

---

### Session 2 — PRD update + S6 retention screen (31 March 2026 — afternoon)

**Status:** Complete and pushed.

**Changes:**
- `01_Product/ParkEase_PRD.md` — 5 surgical edits: BMS checkout embed moved to V2; group split promoted to MVP; WhatsApp forward marked shipped; new §3.5 canonical booking flow spec added; UPI-only MVP rationale added to guardrails
- `app/src/screens/S6_RetentionScreen.jsx` — NEW 316-line screen: Arjun's retention arc (RCB Playoffs re-engagement). Components: NotificationBanner, EventCard, FillRateUrgencyBar, LastTimeMemoryChip, TrustSignalRow, RepeatBookerBadge, OneClickRebookCTA
- `app/src/App.jsx` — S6 wired into SCREENS enum, DemoNav ("S6 Retain"), showNavbar array, renderScreen switch
- `04_Handover/ParkEase_Handover_2026-03-31.md` — NEW: full handover doc with 6-session ordered roadmap, 4-phase product roadmap (prototype → MVP backend → operator backend → B2B integrations), 3 copy-paste Emergent/manual build prompts
- `0_5 subagents/` — 6 agent definition files now tracked in git

---

### Session 1 — UI Design Refresh (31 March 2026 — morning)

**Status:** Complete and pushed.

**Changes:**
- **Dark theme → Light theme** (`bg-gray-950` → `bg-gray-50`, cards now white with subtle borders)
- **CTA buttons**: Navy dark (#1C1D2B) with white UPPERCASE text, matching District by Zomato design
- **Navbar** component added: logo + city selector + nav pills (For You/Parking/Monthly/Events/EV Charging) + search + auth
- **AuthModal** component added: two-step (phone +91 input → 6-box OTP with 30s countdown + auto-advance)
- **SearchOverlay** component added: category pill filters + trending grid + live search
- **All integrated** into App.jsx with global state (auth, search visibility)
- **App runs** on http://172.20.10.2:5174 (network accessible from mobile)

---

## Folder structure

```
C:/Users/91982/OneDrive/Desktop/parksease/

├── Parksease/                          ← Obsidian vault / main project folder
│   ├── MASTER_SUMMARY.md               ← THIS FILE — read first
│   ├── 01_Product/
│   │   └── ParkEase_PRD.md             ← Full PRD (large file, use offset/limit)
│   ├── 02_Financials/
│   │   └── Business Valuation.md       ← Corrected revenue model (v2)
│   ├── 03_Code_Blueprints/             ← Original dark theme blueprints (archived)
│   │   ├── S1_VenueLanding.jsx
│   │   ├── S2_BookingFlow.jsx
│   │   ├── S3_BookingConfirmation.jsx
│   │   ├── S4_RedirectScreen.jsx
│   │   ├── S5_OperatorDashboard.jsx
│   │   └── SETUP.md
│   └── 0_4_reference_phtots/           ← District by Zomato UI reference images

└── app/                                ← **LIVE Vite + React app** (light theme)
    ├── package.json                    ← React 19, Tailwind v4, react-router-dom
    ├── vite.config.js
    ├── index.html                      ← "ParkEase — Smart Parking, Simplified"
    ├── src/
    │   ├── main.jsx
    │   ├── App.jsx                     ← Demo router + Navbar/AuthModal/SearchOverlay wired
    │   ├── index.css                   ← Tailwind v4 import
    │   ├── screens/
    │   │   ├── S1_VenueLanding.jsx     ← Light theme, live scarcity counter
    │   │   ├── S2_BookingFlow.jsx      ← Light theme, 5-step flow
    │   │   ├── S3_BookingConfirmation.jsx ← Light theme, QR + WhatsApp
    │   │   ├── S4_RedirectScreen.jsx   ← Light theme, cab redirect
    │   │   └── S5_OperatorDashboard.jsx ← Light theme, B2B dashboard
    │   └── components/
    │       ├── Navbar.jsx              ← ✨ NEW: fixed top nav
    │       ├── AuthModal.jsx           ← ✨ NEW: phone → OTP overlay
    │       └── SearchOverlay.jsx       ← ✨ NEW: category filters + trending
    └── dist/                           ← Built output (run `npm run build`)
```

---

## How to run the prototype

**Local (desktop):**
```bash
cd C:/Users/91982/OneDrive/Desktop/parksease/Parksease/app
npm run dev
```

Opens at **http://localhost:5174** (or 5173, depending on port availability).

**Mobile (same Wi-Fi):**
```
http://172.20.10.2:5174
```
(Make sure phone is on the same network as your computer.)

**Demo features:**
- Demo nav bar at bottom: switch between S1–S5 screens instantly
- `🔴 Full` toggle: flips parking state (available ↔ full) and auto-navigates to S4 (redirect)
- **Navbar** (top): search icon 🔍 opens SearchOverlay, profile icon opens AuthModal
- **SearchOverlay**: category pills (All/Parking/Monthly/Events/EV) + trending grid + live search
- **AuthModal**: +91 phone input → 6-digit OTP → auto-login

**Theme:** Light (white cards, grey page bg, navy CTAs with white text) — inspired by District by Zomato UI.

---

## The 3 core personas (from PRD)

| Persona | Who | Key need |
|---------|-----|----------|
| **Arjun** | 35, IPL fan, past parking trauma | Named bay guarantee — "Pillar B, Bay 14" |
| **Priya** | 38, mother, family concerts | Distance to gate as headline — "280m, covered path" |
| **Rahul** | 22, group organiser, Gen Z | Scarcity FOMO + group UPI split — "₹60 each, GPay karo" |
| **Siddharth** | Venue operations manager (B2B) | Dashboard + PDF compliance report = management proof |

---

## Revenue model (corrected v2 — use Business Valuation.md as source of truth)

ParkEase charges a **platform fee on top of the venue's base rate**. Consumer sees one total price.

| Event tier | Venue base | ParkEase fee | Consumer pays | PE net (post gateway) |
|-----------|-----------|-------------|--------------|----------------------|
| Small/mid concert | ₹100 | ₹49 | ₹149 | ~₹48 |
| Standard IPL | ₹120 | ₹49 | **₹169** | ~₹48 |
| Large concert | ₹150 | ₹49 | ₹199 | ~₹48 |
| Marquee event | ₹300 | ₹150 | ₹450 | ~₹146 |

**Demo event uses Standard IPL tier: ₹169 (₹120 + ₹49)**

No cab/shuttle referral revenue at MVP. Deep-links to Ola/Uber/Rapido are not monetised.

B2B platform fee: ₹0 pilot event 1, ₹15k–25k/event from event 2 onwards.

---

## Demo data (seeded across all screens)

| Field | Value | Source |
|-------|-------|--------|
| Event | Karan Aujla | PRD Rahul journey |
| Venue | Jawaharlal Nehru Stadium, Delhi | PRD |
| Date | Sat, 12 Apr 2026 | prototype |
| Total spots | 500 | PRD model event |
| Spots remaining | **47** | PRD: "the number 47 does the work" |
| Fill rate | 87% | PRD dashboard example |
| Redirect taps | 118 | PRD dashboard exact value |
| Est. diverted | ~65 | 118 × 55% compliance |
| Consumer price | ₹169 | Business Valuation |
| Bay (Rahul) | B-18, JLN North Lot | PRD narrative |
| Bay (Arjun) | B-14, JLN North Lot | PRD narrative |
| Entry window | 5:30–7:00 PM | PRD |
| Departure nudge | Leave by 6:00 PM | PRD |
| Drop zone (S4) | Drop Zone A, near Gate 4 | PRD |
| Venue coords (S4) | 12.9793, 77.5996 | Chinnaswamy, Bangalore |
| Exit gate | Gate C | PRD Arjun journey |
| Redirect threshold | 450 spots (90% fill) | PRD operator config |

---

## Design System (Light Theme, 31 March 2026)

**Inspiration:** District by Zomato reference images (see `0_4_reference_phtots/`)

**Color Palette:**
| Element | Color | Tailwind | Use |
|---------|-------|----------|-----|
| Primary CTA | Navy | `bg-[#1C1D2B] text-white` | Book, Continue, Pay, Verify buttons |
| Active pill | Orange | `bg-[#E85D04]` | Selected category/nav pill |
| Page bg | Light grey | `bg-gray-50` | Main page background |
| Card bg | White | `bg-white border border-gray-200 shadow-sm` | All cards |
| Text primary | Charcoal | `text-gray-900` | Headings, labels |
| Text secondary | Medium grey | `text-gray-500` | Descriptions, hints |
| Border | Light grey | `border-gray-200` | Card borders, dividers |
| Success | Green | `bg-green-50`, `text-green-600` | Completed steps, success states |
| Alert | Red/Amber | `bg-red-50`, `bg-amber-50` | Warnings, scarcity signals |
| Accent (link) | Indigo | `text-indigo-600` | Links, focus states |
| Purple gradient | Purple | `bg-gradient-to-br from-[#7B2FBE] to-[#9B59B6]` | AuthModal header |

**Typography:**
- Font: Inter (Google Fonts)
- Headings: `font-bold` `text-gray-900`
- Body: `text-sm` `text-gray-600`
- Labels: `text-xs` `uppercase tracking-widest` `text-gray-400`

**Components:**
- **Navbar**: Fixed top, white, shadow-sm, logo + city + pills + search + auth
- **Buttons**: 44px height, `rounded-lg`, all uppercase, full-width on mobile
- **Cards**: `rounded-xl`, `shadow-sm`, `border border-gray-200`
- **Input fields**: `rounded-lg`, `border border-gray-300`, `focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100`
- **Pills/badges**: `rounded-full`, `px-3 py-1.5`, small text

---

## Screen-by-screen summary

### Navbar (NEW — `components/Navbar.jsx`)
Fixed top navigation bar (white, shadow-sm, `z-50`). Contains:
- **Logo**: ParkEase + navy "P" icon (clickable, no routing for now)
- **City selector**: "Delhi ▾" pill button (desktop only, no routing)
- **Nav pills** (md+): "For You" | "Parking" | "Monthly" | "Events" | "EV Charging" — active pill is orange (#E85D04)
- **Search icon**: Opens SearchOverlay
- **Profile icon**: When logged in, shows avatar circle with first letter of phone; when logged out, shows person outline icon, opens AuthModal

### AuthModal (NEW — `components/AuthModal.jsx`)
Full-screen overlay (`fixed inset-0`) with purple gradient header and two-step form:
1. **Phone step**: +91 country code + 10-digit mobile input. Continue button (disabled until 10 digits).
2. **OTP step**: Six individual digit boxes with auto-advance on entry. 30-second countdown timer. Resend OTP button after expiry. Verify & Continue button (disabled until all 6 digits filled).
On success, calls `onLoginSuccess(phone)` → sets global `isLoggedIn = true, userPhone = phone`.

### SearchOverlay (NEW — `components/SearchOverlay.jsx`)
Full-screen search overlay with:
- **Search input**: Magnifying glass icon + auto-focus input + clear (X) button
- **Category pills** (horizontal scroll): "All" | "Parking" | "Monthly Pass" | "Events" | "EV Charging" — active pill is orange
- **Results**: Shows "Trending in Delhi" when query is empty, or filtered venue cards (2-col grid) when typing. Venues have image placeholder (first letter), category tag, name, location, price/hour.
Mock data: 6 trending venues across all categories.

### S1 — Venue Landing (`S1_VenueLanding.jsx`)
Entry point for all personas. **Distance to gate is the headline** (Priya's WhatsApp screenshot decision artefact). Live scarcity counter (`47 spots left`). Prohibited items banner. CTA navigates to S2 or S4 depending on `spotsRemaining`. **Light theme** (white cards, grey bg, navy CTAs).

### S2 — Booking Flow (`S2_BookingFlow.jsx`)
5-step progressive flow: scarcity → bay selection → time window → pricing → UPI payment. All on one screen — steps collapse to chips. Bay grid seeded with pillar codes (B-01 to B-20). Group split calculator `Math.ceil(169 / groupSize)`. Payment stub calls `onPaymentSuccess?.()` → S3. **Light theme** (white cards, navy CTAs with white text).

### S3 — Booking Confirmation (`S3_BookingConfirmation.jsx`)
Mock QR code (pixel grid seeded from bookingId). WhatsApp forward via `wa.me/?text=` with pre-formatted bullet-point message (exact PRD format). UPI collect request stub. Departure nudge card. Static exit guidance (Gate C, ~12 mins — MVP, not live routing). **Light theme** (white cards, green WhatsApp button).

### S4 — Cab Redirect (`S4_RedirectScreen.jsx`)
Three provider cards: Ola / Uber / Rapido. Deep-links constructed with Chinnaswamy coords + Drop Zone A. On desktop: shows constructed URI in alert (demo mode). On mobile: fires `window.location.href`. Surge warning shown when `isSurgeActive`. Fare range ₹180–260. `AvailabilityFallbackNotice` shown when all platforms low. **Light theme** (white cards, red alert for parking full, navy CTA buttons).

### S5 — Operator Dashboard (`S5_OperatorDashboard.jsx`)
Fill rate 87%, 65 spots remaining, 118 redirect taps, ~65 diverted. Per-lot capacity bars (North 88%, South 85%). Colour-coded alert feed (red/amber/green/blue). Demand shifting performance panel. PDF compliance report button (stub). Refresh button. `LIVE` status pill with pulse animation. **Light theme** (white cards, red/amber/green alerts, navy PDF button).

### App.jsx — Demo Router + Global State
No React Router — plain `useState` for current screen routing. Global state:
- `currentScreen`: VENUE | BOOKING | CONFIRMATION | REDIRECT | DASHBOARD
- `isLoggedIn`, `userPhone`: auth state (set by AuthModal)
- `showAuth`, `showSearch`: overlay visibility (toggled by Navbar + internal CTAs)
- `activeNav`, `selectedCity`: navbar state
- `parkingFull`: demo toggle that auto-navigates to S4/S1

**Component tree:**
```
<App>
  ├─ <Navbar> (fixed, z-50, showing on S1/S2/S3/S4)
  ├─ <div> (current screen — S1 to S5, with pt-16 offset)
  ├─ <AuthModal> (global overlay, z-50)
  ├─ <SearchOverlay> (global overlay, z-50)
  └─ <DemoNav> (bottom bar — prototype only, z-[100] to stay above others)
```

Demo nav bar at bottom (`S1`–`S5` + `🔴 Full` toggle) is prototype-only, not part of real product.

---

## Key PRD decisions to never contradict

1. **Named pillar bay, never a zone** — "Bay B-14" not "Lot A". Bay pillar mapping exercise is a non-negotiable ops prerequisite.
2. **Scarcity counter must be live** — static counter destroys trust with Gen Z users.
3. **Redirect must outperform driving** — if Varun doesn't arrive before Rahul, the peer comparison reverses and word of mouth turns negative.
4. **Surge must be acknowledged, not hidden** — PRD §3.1: "this is still faster than finding parking in the area".
5. **Three cab providers simultaneously** — Ola + Uber + Rapido all visible so user has instant fallback.
6. **Operator dashboard is MVP despite low RICE** — RICE = 1 (reach is only Siddharth) but Kano = Basic. Without dashboard, no B2B product.
7. **Cab referral revenue = V2** — do not model it at MVP.
8. **UPI split = post-booking collect request at MVP** — V2 is true group escrow.

---

## Build workflow used in this project

**Architect (Claude):** Reads PRD → writes component tree blueprint → builds JSX directly.
**Gemini CLI (antigravity at `~/.gemini/antigravity`):** Used to build JSX from blueprints when available. Currently capacity-limited on `gemini-3.1-pro-high` — fallback to Claude building directly.
**Relay:** User copies outputs between Claude Code and Gemini CLI sessions manually.

---

## Known stubs (intentional — do not ship to production)

| Stub | File | MVP replacement |
|------|------|----------------|
| Auth token persistence | AuthModal | Real session/JWT, secure http-only cookies |
| UPI payment | S2 | Razorpay / PayU UPI intent API |
| Cab availability + surge | S4 | Ola/Uber/Rapido availability signal API |
| QR code | S3 | `qrcode` npm library, server-generated |
| Deep-link app detection | S4 | `navigator.getInstalledRelatedApps()` |
| UPI collect request | S3 | PhonePe / Razorpay collect API |
| PDF report | S5 | Server-side Puppeteer / pdfkit |
| Live inventory counter | S1, S2 | WebSocket from ParkEase inventory API |
| Bay grid data | S2 | ParkEase operator config API post bay-mapping |
| City selector | Navbar | Cities API, user geolocation fallback |
| Venue selection | SearchOverlay | Real venue database + search API |

---

## Vibe-coding risks identified in this codebase

Audited against industry findings (Escape.tech, The Register, Towards Data Science — March 2026):

| Risk | Status in our code |
|------|-------------------|
| Hardcoded secrets | ✅ None — all mock data |
| Input validation | ✅ No free-text inputs — all controlled selections |
| Auth / IDOR | ⚠️ None — prototype only, must add before MVP |
| Error handling | ❌ `paymentError` state exists but never set on failure |
| `setTimeout` without cleanup | ❌ S3, S5 — acceptable for prototype |
| `setInterval` without cleanup | ✅ S1, S2 return `clearInterval` correctly |
| `console.log` navigation stubs | ✅ Fixed — replaced with `onPaymentSuccess?.()` etc. |
| Deep-link desktop blank | ✅ Fixed — shows URI + alert in demo mode |

---

## Phase 4 exit criteria

> At least one event organiser expresses genuine intent to pilot.

Target contacts: venue operations managers at JLN Stadium (Delhi) and Chinnaswamy Stadium (Bangalore). Once a yes is obtained — stop building features, start the venue partnership agreement and bay pillar mapping exercise.

---

## What was NOT built yet (V2 scope)

- Ola/Uber API callback for hard conversion confirmation (RICE 6.0, V2)
- Dynamic exit routing via Google Maps API (V2)
- True group booking with escrow (RICE 0.8, V2)
- IoT sensor occupancy tracking (V2)
- BookMyShow checkout embed (requires partnership)
- Push notification system (backend required)
- SEO-indexed venue discovery pages (V2)

---

## Files to read for full context

| Need | Read this |
|------|-----------|
| Full product spec | `01_Product/ParkEase_PRD.md` (large — use offset/limit, search with Grep) |
| Revenue / pricing | `02_Financials/Business Valuation.md` |
| Component specs | `03_Code_Blueprints/S2_BookingFlow_Blueprint.md`, `S4_Redirect_Blueprint.md` |
| Running the app | `03_Code_Blueprints/SETUP.md` |
| Any screen code | `03_Code_Blueprints/S1–S5 *.jsx` |

---

*Last updated: 31 March 2026 — UI redesign complete (light theme + Navbar + AuthModal + SearchOverlay, all wired and running)*
