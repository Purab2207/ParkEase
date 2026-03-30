# S4 — Parking Full → Cab Redirect Screen
## React / Tailwind Component Tree Blueprint

---

### Overview

**Screen purpose:** Shown when parking reaches 100% fill (triggered at 90% threshold per operator config). Shifts demand from driving to cab bookings via Ola/Uber/Rapido deep-links. The redirect must complete in under 30 seconds to outperform the driving alternative — this is the peer comparison mechanism.

**Route:** `/parking-full` or presented as a modal overlay on top of the venue/booking screen.

---

### Component Hierarchy

```
<RedirectScreen>                          // Page root
│
├── <RedirectHeader />                    // Top bar — status signal
│
├── <ParkingFullBanner />                 // Hero — confirms parking is sold out
│
├── <SurgePricingWarning />               // Conditional — shown when surge detected
│
├── <EstimatedFareDisplay />              // Fare range before user taps deep-link
│
├── <CabOptionsGrid>                      // Three-column provider buttons
│   ├── <CabProviderCard provider="ola" />
│   ├── <CabProviderCard provider="uber" />
│   └── <CabProviderCard provider="rapido" />
│
├── <DropZoneInfo />                      // Destination pre-fill notice
│
├── <AvailabilityFallbackNotice />        // Shown if all platforms low-supply
│
└── <RedirectFooter />                    // Secondary actions
```

---

### Component Details

---

#### `<RedirectScreen>`

**Role:** Page-level container. Manages availability checks, surge state, and deep-link construction.

**State variables:**
```
isSurgeActive: boolean          // true when any platform reports surge
surgeMultiplier: number | null  // e.g. 1.8x — from cab availability signal
fareRangeLow: number            // ₹ lower bound of estimated fare
fareRangeHigh: number           // ₹ upper bound of estimated fare
cabAvailability: {
  ola: 'available' | 'low' | 'unavailable'
  uber: 'available' | 'low' | 'unavailable'
  rapido: 'available' | 'low' | 'unavailable'
}
allPlatformsLow: boolean        // derived — true when all three are 'low'/'unavailable'
dropZoneName: string            // e.g. "Drop Zone A, near Gate 4"
dropZoneLat: number
dropZoneLng: number
venueDisplayName: string
```

**Tailwind layout:**
```
min-h-screen bg-gray-950 flex flex-col items-center px-4 py-6 gap-6
```

---

#### `<RedirectHeader />`

**Role:** Top status bar — communicates "parking is full" system state to orient users immediately.

**Props:** none (reads from global event context)

**Tailwind layout:**
```
w-full flex items-center justify-between px-4 py-3
bg-red-600 rounded-xl text-white
```

**Elements:**
- Left: ParkEase logo (small)
- Center: Status pill — `"🔴 PARKING FULL"` text, `text-sm font-semibold tracking-wide`
- Right: Close / Back icon button

---

#### `<ParkingFullBanner />`

**Role:** Hero block confirming the sold-out state and framing the redirect as the faster choice.

**Props:**
```
venueDisplayName: string
```

**Tailwind layout:**
```
w-full bg-red-950 border border-red-700 rounded-2xl p-6 text-center flex flex-col gap-3
```

**Elements:**
- Headline: `"Parking at {venueDisplayName} is full"`
  `text-2xl font-bold text-white`
- Subtext: `"Book a cab — it's faster than finding street parking"`
  `text-sm text-red-300`
- Scarcity note (secondary copy): `"Redirected users arrived before drivers at the last 3 events"`
  `text-xs text-gray-400 italic`

---

#### `<SurgePricingWarning />`

**Role:** Conditional block — honest expectation-setting before the user taps any deep-link. Satisfies PRD constraint: redirect CTA must acknowledge surge rather than hide it.

**Rendered when:** `isSurgeActive === true`

**Props:**
```
surgeMultiplier: number   // e.g. 1.8
```

**Tailwind layout:**
```
w-full bg-amber-950 border border-amber-600 rounded-xl px-4 py-3 flex items-start gap-3
```

**Elements:**
- Warning icon: `⚠️` or SVG, `text-amber-400`
- Copy: `"Cab prices may be higher than usual right now ({surgeMultiplier}x surge) — this is still faster than finding parking"`
  `text-sm text-amber-200`

**[PLACEHOLDER — Surge Detection]:**
At MVP, `isSurgeActive` and `surgeMultiplier` are populated from a cab availability signal API call fired on screen mount. In V2 this connects to Ola/Uber pricing APIs directly.

---

#### `<EstimatedFareDisplay />`

**Role:** Shows fare range *before* the user commits to a deep-link redirect. Prevents post-redirect sticker shock that causes drop-off (PRD 3.1 failure mode).

**Props:**
```
fareRangeLow: number    // ₹ lower bound
fareRangeHigh: number   // ₹ upper bound
isSurgeActive: boolean
```

**Tailwind layout:**
```
w-full bg-gray-900 rounded-xl px-5 py-4 flex flex-col gap-1
```

**Elements:**
- Label: `"Estimated fare to venue"`
  `text-xs text-gray-400 uppercase tracking-widest`
- Fare range: `"₹{fareRangeLow} – ₹{fareRangeHigh}"`
  `text-3xl font-bold text-white`
- Surge note (conditional): `"Includes surge pricing"`
  `text-xs text-amber-400` — rendered only when `isSurgeActive`
- Disclaimer: `"Actual fare set by the cab app at time of booking"`
  `text-xs text-gray-500`

**[PLACEHOLDER — Fare Calculation]:**
`fareRangeLow` / `fareRangeHigh` computed from: distance (user location → `dropZoneLat/Lng`) × per-km base rates for Ola/Uber/Rapido × surge multiplier. At MVP, use static lookup table keyed on venue. Dynamic calculation in V2.

---

#### `<CabOptionsGrid>`

**Role:** Container for the three provider cards. Ensures all three deep-links are visible simultaneously — the PRD fallback requirement (PRD 3.2) mandates that if one platform has no driver, the user has instant fallback without leaving the screen.

**Props:**
```
cabAvailability: { ola, uber, rapido }
dropZoneLat: number
dropZoneLng: number
dropZoneName: string
```

**Tailwind layout:**
```
w-full grid grid-cols-3 gap-3
```

---

#### `<CabProviderCard />`

**Role:** Single provider button — logo, availability badge, and deep-link CTA.

**Props:**
```
provider: 'ola' | 'uber' | 'rapido'
availability: 'available' | 'low' | 'unavailable'
deepLink: string      // constructed deep-link URI
dropZoneName: string
```

**State variables:**
```
isLoading: boolean    // brief state while app handoff initiates
```

**Tailwind layout (card):**
```
flex flex-col items-center justify-between
bg-gray-800 hover:bg-gray-700 active:scale-95
rounded-2xl p-4 gap-3 transition-all
border border-gray-700
```

**Availability badge colours:**
- `available` → `bg-green-900 text-green-400 text-xs rounded-full px-2 py-0.5`
- `low` → `bg-amber-900 text-amber-400 text-xs rounded-full px-2 py-0.5` + copy: "Few drivers"
- `unavailable` → `bg-red-900 text-red-400 text-xs rounded-full px-2 py-0.5` + card opacity-50 + disabled

**CTA button:**
`"Book {Provider}"` — `w-full bg-white text-gray-900 text-sm font-semibold rounded-xl py-2`

**[PLACEHOLDER — Deep-Links]:**

| Provider | Deep-Link Pattern |
|----------|-------------------|
| Ola | `olacabs://book?lat={dropZoneLat}&lng={dropZoneLng}&drop_name={dropZoneName}` |
| Uber | `uber://?action=setPickup&dropoff[latitude]={dropZoneLat}&dropoff[longitude]={dropZoneLng}&dropoff[nickname]={dropZoneName}` |
| Rapido | `rapido://book?dest_lat={dropZoneLat}&dest_lng={dropZoneLng}&dest_name={dropZoneName}` |

Web fallbacks (for users without the app installed):

| Provider | Web Fallback |
|----------|--------------|
| Ola | `[OLA_WEB_BOOKING_URL]?drop_lat={dropZoneLat}&drop_lng={dropZoneLng}` |
| Uber | `[UBER_WEB_BOOKING_URL]?drop[lat]={dropZoneLat}&drop[lng]={dropZoneLng}` |
| Rapido | `[RAPIDO_WEB_BOOKING_URL]?dest_lat={dropZoneLat}&dest_lng={dropZoneLng}` |

> **Note:** Deep-link schemas must be validated against current Ola/Uber/Rapido SDK docs before implementation. Schemas above are structural placeholders. Web fallback URLs require API key registration with each provider.

**[PLACEHOLDER — App Detection]:**
Before firing deep-link, check if the target app is installed via `navigator.getInstalledRelatedApps()` (PWA) or platform-specific URI scheme probing. On failure, fall through to web fallback URL.

---

#### `<DropZoneInfo />`

**Role:** Shows the pre-filled destination so users understand exactly where the cab will drop them before tapping.

**Props:**
```
dropZoneName: string     // e.g. "Drop Zone A, near Gate 4"
```

**Tailwind layout:**
```
w-full bg-gray-900 rounded-xl px-4 py-3 flex items-center gap-3
```

**Elements:**
- Pin icon: `📍` or SVG, `text-blue-400`
- Label: `"Drop-off point"` — `text-xs text-gray-400`
- Location name: `{dropZoneName}` — `text-sm font-semibold text-white`
- Sub-note: `"Pre-filled in all three cab apps"` — `text-xs text-gray-500`

---

#### `<AvailabilityFallbackNotice />`

**Role:** Shown when `allPlatformsLow === true`. Provides alternative rather than leaving user stranded (PRD 3.2 failure mode).

**Rendered when:** `allPlatformsLow === true`

**Tailwind layout:**
```
w-full bg-gray-800 border border-gray-600 rounded-xl px-4 py-4 flex flex-col gap-2
```

**Elements:**
- Heading: `"Cabs are busy right now"` — `text-sm font-semibold text-white`
- Body: `"Try again in 5 minutes or book from a nearby pickup point"` — `text-xs text-gray-400`
- Secondary CTA: `"View nearby pickup points"` — `text-sm text-blue-400 underline`
- Retry timer: countdown `"Refresh in 0:45"` — `text-xs text-gray-500`

**[PLACEHOLDER — Shuttle Option]:**
When event operator has configured a shuttle service, replace `<AvailabilityFallbackNotice>` with `<ShuttleRedirectCard>` (V2 component). Config flag: `event.hasShuttleService: boolean`.

---

#### `<RedirectFooter />`

**Role:** Secondary actions and trust signals below the fold.

**Tailwind layout:**
```
w-full flex flex-col items-center gap-4 pb-8
```

**Elements:**
- Redirect event counter: `"156 people redirected to cabs tonight"` — `text-xs text-gray-500`
- "How is this faster?" expandable FAQ — `<details>` / `<Accordion>` — `text-xs text-gray-400`
- Back link: `"← Back to event page"` — `text-sm text-gray-500 underline`

---

### State Flow

```
Screen mounts
    │
    ├── Fire: fetchCabAvailability(venue, dropZone)
    │       → sets cabAvailability, isSurgeActive, surgeMultiplier
    │
    ├── Compute: fareRangeLow, fareRangeHigh
    │       → from distance + base rates + surgeMultiplier
    │
    ├── Derive: allPlatformsLow
    │       → true if ola/uber/rapido all 'low' or 'unavailable'
    │
    └── Render conditionals:
            <SurgePricingWarning>        if isSurgeActive
            <AvailabilityFallbackNotice> if allPlatformsLow
```

---

### Key Tailwind Layout Classes Summary

| Region | Classes |
|--------|---------|
| Page root | `min-h-screen bg-gray-950 flex flex-col items-center px-4 py-6 gap-6` |
| Header bar | `w-full flex items-center justify-between bg-red-600 rounded-xl px-4 py-3` |
| Hero banner | `w-full bg-red-950 border border-red-700 rounded-2xl p-6 text-center` |
| Surge warning | `w-full bg-amber-950 border border-amber-600 rounded-xl px-4 py-3` |
| Fare display | `w-full bg-gray-900 rounded-xl px-5 py-4` |
| Cab grid | `w-full grid grid-cols-3 gap-3` |
| Provider card | `flex flex-col items-center bg-gray-800 hover:bg-gray-700 rounded-2xl p-4 border border-gray-700` |
| Drop zone info | `w-full bg-gray-900 rounded-xl px-4 py-3 flex items-center gap-3` |
| Fallback notice | `w-full bg-gray-800 border border-gray-600 rounded-xl px-4 py-4` |

---

### PRD Traceability

| PRD Requirement | Component |
|-----------------|-----------|
| Deep-link pre-fills venue drop zone, booking under 30 seconds | `<CabProviderCard>` deep-link placeholders |
| Estimated fare range shown before user taps | `<EstimatedFareDisplay>` |
| Surge acknowledged in CTA copy | `<SurgePricingWarning>` |
| Three platforms simultaneously — Ola, Uber, Rapido | `<CabOptionsGrid>` |
| Fallback when all platforms show low supply | `<AvailabilityFallbackNotice>` |
| Cab availability signal checked before showing CTA | `RedirectScreen` mount effect |
| Drop zone name + location pre-filled and displayed | `<DropZoneInfo>` |
| V2: Ola/Uber API callback for hard conversion confirmation | Not in scope — placeholder note in `<CabProviderCard>` |
