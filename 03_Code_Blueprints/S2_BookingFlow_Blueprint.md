# S2 — Parking Pre-Booking Flow
## React / Tailwind Component Tree Blueprint

---

### Overview

**Screen purpose:** The consumer books a named parking bay for a specific event. This is the transaction core of ParkEase. Three personas land here (Arjun, Priya, Rahul) via different entry points — BookMyShow checkout embed, venue landing page (S1), or WhatsApp group link. The screen must complete a booking in under 90 seconds to stay within Indian mobile attention windows.

**Route:** `/book/:eventId` or `/book/:venueId/:eventId`

**Entry points:**
- S1 (Venue Landing Page) → taps "Book Parking"
- BookMyShow checkout embed → taps "Add Parking" add-on CTA
- WhatsApp shared link → deep-link direct to this screen

**Exit points:**
- Payment success → S3 (Booking Confirmation)
- Spots reach 0 during flow → S4 (Parking Full / Redirect Screen)
- User abandons → back to S1

**PRD checkout drop-off target:** <45% MVP, <28% Year 1

---

### Flow Steps (5 sub-steps, single screen — no page navigations)

```
Step 1 — Event context + scarcity signal     (user lands here)
Step 2 — Bay selection                        (chooses specific bay)
Step 3 — Entry time window                    (selects arrival window)
Step 4 — Pricing breakdown + group split      (reviews cost, sets group size)
Step 5 — UPI payment                          (pays, exits to S3)
```

A `currentStep: 1–5` state variable controls which panel is expanded. Completed steps collapse to a summary chip. No separate pages — single scroll with progressive disclosure.

---

### Component Hierarchy

```
<BookingFlowScreen>
│
├── <BookingHeader />
│
├── <EventSummaryBar />
│
├── <InventoryScarcityBanner />            // STEP 1 — key trust signal
│
├── <ProhibitedItemsBanner />              // collapsible — regulatory req.
│
├── <BaySelectionPanel>                    // STEP 2
│   ├── <LotSectionTabs />
│   ├── <BayGrid />
│   └── <SelectedBayCard />
│
├── <EntryTimeWindowPicker />              // STEP 3
│
├── <PricingBreakdown>                     // STEP 4
│   ├── <PriceTierDisplay />
│   ├── <GroupSplitCalculator />
│   └── <CancellationPolicyNotice />
│
├── <UPIPaymentButton />                   // STEP 5
│
└── <BookingFooter />
```

---

### Component Details

---

#### `<BookingFlowScreen>`

**Role:** Page root. Owns all booking state, manages step progression, fires inventory check on mount.

**State variables:**
```
currentStep: number (1–5)

// Event & venue
eventDetails: {
  id: string
  name: string                  // e.g. "Karan Aujla · JLN Stadium, Delhi"
  venue: string                 // e.g. "Jawaharlal Nehru Stadium, Delhi"
  date: string                  // e.g. "Sat, 12 Apr 2026"
  eventTier: 'small' | 'ipl' | 'large' | 'marquee'
  consumerPrice: number         // ₹149 / ₹169 / ₹199 / ₹450
  venueBaseRate: number         // ₹100 / ₹120 / ₹150 / ₹300
  parkEaseFee: number           // ₹49 / ₹49 / ₹49 / ₹150
  entryWindows: string[]        // e.g. ["5:30–7:00 PM", "7:00–8:30 PM"]
  lots: Lot[]
}

// Inventory
spotsRemaining: number          // live — triggers S4 if reaches 0
totalSpots: number              // e.g. 500 for Chinnaswamy

// Selection
selectedBay: Bay | null         // { id, pillarCode, section, lotId, distanceToGateMetres }
selectedLotId: string | null
selectedTimeWindow: string | null

// Group split
groupSize: number               // default 1, max 6
splitAmountPerPerson: number    // derived: consumerPrice / groupSize (rounded up)

// Payment
paymentLoading: boolean
paymentError: string | null
paymentSuccess: boolean         // triggers navigate to S3
```

**Derived values:**
```
fillPercent = ((totalSpots - spotsRemaining) / totalSpots) * 100
isAlmostFull = spotsRemaining <= 50      // triggers scarcity warning colour change
isParkingFull = spotsRemaining === 0     // redirect to S4
```

**Tailwind layout:**
```
min-h-[100dvh] bg-gray-950 flex flex-col font-sans
max-w-md mx-auto px-4 py-5 gap-4
```

---

#### `<BookingHeader />`

**Role:** Navigation bar — back button and step progress indicator.

**Props:** `currentStep: number`

**Tailwind layout:**
```
w-full flex items-center justify-between py-2
```

**Elements:**
- Back arrow button — `text-gray-400 hover:text-white`
- Title: `"Book Parking"` — `text-base font-semibold text-white`
- Step pill: `"Step {currentStep} of 5"` — `text-xs text-gray-500 bg-gray-800 px-2 py-1 rounded-full`

---

#### `<EventSummaryBar />`

**Role:** Anchors context at the top of every step. User always knows which event/venue they are booking for. PRD requirement: booking confirmation must be clean and shareable — this bar sets that standard from step 1.

**Props:**
```
eventName: string
venueName: string
eventDate: string
```

**Tailwind layout:**
```
w-full bg-gray-900 rounded-2xl px-4 py-3 flex flex-col gap-0.5
border border-gray-800
```

**Elements:**
- Event name: `text-base font-bold text-white`
- Venue + date: `text-xs text-gray-400` — single line, `·` separator

---

#### `<InventoryScarcityBanner />`  ← STEP 1 critical signal

**Role:** The real-time scarcity counter. PRD is explicit: "must be live inventory, not a manufactured urgency signal. Gen Z concert-goers are highly attuned to fake scarcity." This component must visually communicate urgency without feeling manufactured.

**Props:**
```
spotsRemaining: number
totalSpots: number
fillPercent: number
isAlmostFull: boolean
```

**State variables:**
```
prevSpotsRemaining: number    // for animating count-down when a spot is taken
```

**Tailwind layout:**
```
w-full rounded-2xl px-5 py-4 flex flex-col gap-2
```

**Colour logic:**
- `spotsRemaining > 100` → `bg-gray-900 border border-gray-700`
- `50 < spotsRemaining <= 100` → `bg-amber-950 border border-amber-700`
- `spotsRemaining <= 50` → `bg-red-950 border border-red-700`

**Elements:**
- Spots counter: `"{spotsRemaining} spots left"` — `text-2xl font-bold text-white`
  - Sub-copy: `"of {totalSpots} total · updates live"` — `text-xs text-gray-400`
- Fill progress bar:
  ```
  w-full h-2 bg-gray-800 rounded-full overflow-hidden
    → inner: h-full bg-gradient-to-r from-green-500 to-red-500 rounded-full
    → width: {fillPercent}%  transition-all duration-700
  ```
- Scarcity copy (conditional, when `isAlmostFull`):
  `"Filling fast — {spotsRemaining} spots at last check"` — `text-xs text-amber-300`

**[PLACEHOLDER — Live counter]:**
At prototype stage, `spotsRemaining` is seeded from mock state (`47` for demo). In MVP, a polling interval (every 30s) or WebSocket pushes updates from ParkEase inventory API. Counter animates down when a spot is taken mid-session.

---

#### `<ProhibitedItemsBanner />`

**Role:** PRD feature #28. Regulatory requirement — venue-specific prohibited items listed before booking. Collapsible so it doesn't block the flow but is always present.

**Props:**
```
items: string[]    // e.g. ["Professional cameras", "Outside food/drinks", "Laser pointers"]
venueName: string
```

**Tailwind layout (collapsed):**
```
w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-2.5
flex items-center justify-between cursor-pointer
```

**Elements:**
- Collapsed: `"⚠️ Venue entry rules"` — `text-xs text-gray-400` + chevron
- Expanded: bulleted list `text-xs text-gray-400`, max 6 items

---

#### `<BaySelectionPanel>`  ← STEP 2

**Role:** User selects a specific named bay. PRD: "named spot (Pillar B, Bay 14)" — not a zone, a bay. This is the concrete/verifiable promise that converts Arjun from sceptic to booker.

**Props:**
```
lots: Lot[]
selectedLotId: string | null
selectedBay: Bay | null
onSelectBay: (bay: Bay) => void
onSelectLot: (lotId: string) => void
```

**Tailwind layout:**
```
w-full flex flex-col gap-3
```

---

##### `<LotSectionTabs />`

**Role:** Switches between lots (e.g., North Lot / South Lot at JLN).

**Props:** `lots: Lot[], selectedLotId: string, onSelect: fn`

**Tailwind layout:**
```
w-full flex gap-2
```

**Tab style (active):** `bg-white text-gray-900 font-semibold text-sm px-4 py-2 rounded-full`
**Tab style (inactive):** `bg-gray-800 text-gray-400 text-sm px-4 py-2 rounded-full`

---

##### `<BayGrid />`

**Role:** Visual grid of all bays in the selected lot. Available = tappable. Taken = greyed out. Selected = highlighted.

**Props:**
```
bays: Bay[]         // { id, pillarCode, status: 'available'|'taken'|'selected', section }
selectedBayId: string | null
onSelectBay: fn
```

**Tailwind layout:**
```
w-full grid grid-cols-5 gap-2
```

**Bay cell styles:**
- `available` → `bg-gray-800 hover:bg-green-900 border border-gray-700 rounded-lg p-2 text-center cursor-pointer`
- `taken` → `bg-gray-900 border border-gray-800 rounded-lg p-2 text-center opacity-40 cursor-not-allowed line-through`
- `selected` → `bg-green-700 border border-green-500 rounded-lg p-2 text-center font-bold text-white`

**Cell content:** `text-xs text-white` — pillar code e.g. `"B-14"`

**[PLACEHOLDER — Bay Map Data]:**
Bay grid is seeded from the venue's bay pillar mapping catalogue (ops exercise). At prototype, mock with 25–30 bays per lot, ~35% marked as `taken` to match MVP fill rate target. In MVP, bay data served from ParkEase operator config API.

---

##### `<SelectedBayCard />`

**Role:** Confirmation of the chosen bay — shown once a bay is tapped. Displays the concrete details that make the booking feel real: pillar code, section, distance to gate.

**Props:**
```
bay: Bay    // { pillarCode, section, lotName, distanceToGateMetres }
```

**Rendered when:** `selectedBay !== null`

**Tailwind layout:**
```
w-full bg-green-950 border border-green-700 rounded-xl px-4 py-3 flex items-center gap-3
```

**Elements:**
- Checkmark icon — `text-green-400`
- Primary: `"Bay {pillarCode}"` — `text-base font-bold text-white`
- Secondary: `"{section} · {lotName} · {distanceToGateMetres}m to Gate"` — `text-xs text-green-300`
- CTA: `"Change bay"` — `text-xs text-gray-400 underline ml-auto`

---

#### `<EntryTimeWindowPicker />`  ← STEP 3

**Role:** User selects which arrival window their spot is reserved for. PRD: "entry window (5:30–7:00 PM)" — time-windowed access manages lot entry load distribution.

**Props:**
```
windows: string[]                 // e.g. ["5:30–7:00 PM", "7:00–8:00 PM"]
selectedWindow: string | null
onSelect: (window: string) => void
```

**Tailwind layout:**
```
w-full flex flex-col gap-2
```

**Section label:** `"Choose your arrival window"` — `text-xs text-gray-400 uppercase tracking-widest font-semibold`

**Window option card (unselected):**
```
w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3
flex items-center justify-between cursor-pointer hover:border-gray-500
```

**Window option card (selected):**
```
w-full bg-gray-800 border border-white rounded-xl px-4 py-3
flex items-center justify-between
```

**Elements per card:**
- Time range: `text-sm font-semibold text-white`
- Sub-note: `"Spot held until {window end time}"` — `text-xs text-gray-500`
- Radio indicator: filled/empty circle — `w-4 h-4 rounded-full border-2`

---

#### `<PricingBreakdown>`  ← STEP 4

**Role:** Transparent cost display before payment. Shows the venue base rate and ParkEase fee separately — PRD revenue model: "consumer sees one total price" but breakdown builds trust. Group split calculator reduces Rahul's social friction.

**Tailwind layout:**
```
w-full bg-gray-900 rounded-2xl px-5 py-4 flex flex-col gap-4 border border-gray-800
```

---

##### `<PriceTierDisplay />`

**Props:**
```
venueBaseRate: number    // e.g. ₹120
parkEaseFee: number      // e.g. ₹49
consumerPrice: number    // e.g. ₹169
eventTier: string        // e.g. "Standard IPL"
```

**Elements:**
- Tier label: `"{eventTier}"` — `text-xs text-gray-500 uppercase tracking-widest`
- Line items:
  ```
  Venue parking base    ₹{venueBaseRate}     text-sm text-gray-400
  ParkEase service fee  ₹{parkEaseFee}       text-sm text-gray-400
  ─────────────────────────────────────────
  Total                 ₹{consumerPrice}     text-lg font-bold text-white
  ```
- Footnote: `"One-time payment · secured via UPI"` — `text-xs text-gray-500`

**Pricing reference (from Business Valuation — do not deviate):**

| Tier | Venue base | PE fee | Consumer pays |
|------|-----------|--------|---------------|
| Small/mid concert | ₹100 | ₹49 | ₹149 |
| Standard IPL | ₹120 | ₹49 | ₹169 |
| Large concert | ₹150 | ₹49 | ₹199 |
| Marquee event | ₹300 | ₹150 | ₹450 |

---

##### `<GroupSplitCalculator />`

**Role:** Rahul's friction-removal feature. "₹299 split 4 ways = ₹75. Nobody thinks twice about ₹75." Shows per-person cost as group size changes. One tap after booking initiates UPI collect requests.

**Props:**
```
consumerPrice: number
groupSize: number
onGroupSizeChange: (n: number) => void
splitAmountPerPerson: number    // derived: Math.ceil(consumerPrice / groupSize)
```

**Tailwind layout:**
```
w-full flex flex-col gap-2
```

**Elements:**
- Label: `"Splitting with a group?"` — `text-xs text-gray-400`
- Stepper: `[–]  {groupSize} people  [+]`
  - Stepper buttons: `w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center text-white`
  - Range: min 1, max 6
- Split result (shown when `groupSize > 1`):
  `"₹{splitAmountPerPerson} per person"` — `text-xl font-bold text-green-400`
  `"UPI collect request sent to group after booking"` — `text-xs text-gray-500`

---

##### `<CancellationPolicyNotice />`

**Role:** PRD confirmation requirement: "cancellation policy (full refund 24hrs before)". Converts Arjun from sceptic — removes the fear of locking money into something uncertain.

**Tailwind layout:**
```
w-full flex items-start gap-2 pt-1
```

**Elements:**
- Shield icon — `text-gray-500 w-4 h-4 shrink-0 mt-0.5`
- Copy: `"Full refund if cancelled more than 24 hours before the event. No refund after that."` — `text-xs text-gray-500`

---

#### `<UPIPaymentButton />`  ← STEP 5

**Role:** Final CTA. Disabled until steps 1–4 are complete (bay selected + time window selected). Fires UPI payment flow. On success navigates to S3.

**Props:**
```
consumerPrice: number
isDisabled: boolean       // true if bay or time window not yet selected
isLoading: boolean
onPay: () => void
```

**Tailwind layout:**
```
w-full sticky bottom-4 mt-4
```

**Button (active):**
```
w-full bg-white text-gray-900 font-bold text-base rounded-2xl py-4
shadow-lg shadow-black/40 active:scale-95 transition-all
```

**Button (disabled):**
```
w-full bg-gray-800 text-gray-500 font-bold text-base rounded-2xl py-4 cursor-not-allowed
```

**Button copy:**
- Disabled (no bay): `"Select a bay to continue"`
- Disabled (no window): `"Select arrival time to continue"`
- Active: `"Pay ₹{consumerPrice} via UPI"`
- Loading: spinner + `"Processing..."`

**[PLACEHOLDER — UPI Integration]:**
At prototype, `onPay` triggers a simulated 1.5s loading state then sets `paymentSuccess = true` → navigates to S3. In MVP, integrates with Razorpay or PayU UPI intent API. `paymentSuccess` callback receives a `bookingId` passed to S3 as route param.

---

#### `<BookingFooter />`

**Role:** Trust signal at the bottom. Addresses the "Is it actually guaranteed?" anxiety that PRD identifies as Arjun's primary friction.

**Tailwind layout:**
```
w-full flex flex-col items-center gap-2 pb-8 pt-2
```

**Elements:**
- Lock icon + copy: `"Payments secured by UPI · Booking confirmed instantly"` — `text-xs text-gray-500`
- Secondary: `"Used by {N} people at this venue"` — `text-xs text-gray-600`

---

### Full State Flow

```
Screen mounts
    │
    ├── fetchEventDetails(eventId) → sets eventDetails, spotsRemaining, totalSpots
    │
    ├── if spotsRemaining === 0 → redirect to S4 immediately
    │
    ├── Start polling spotsRemaining every 30s
    │       → if drops to 0 mid-session → show "Just sold out" modal → redirect S4
    │
    └── User progresses through steps 1–5:
            Step 1 — reads scarcity banner (auto)
            Step 2 — taps bay in <BayGrid /> → selectedBay set → <SelectedBayCard /> appears
            Step 3 — taps time window → selectedTimeWindow set
            Step 4 — optionally adjusts groupSize → reviews pricing
            Step 5 — taps <UPIPaymentButton /> → payment → navigate to S3 with bookingId
```

---

### Key Tailwind Layout Classes Summary

| Region | Classes |
|--------|---------|
| Page root | `min-h-[100dvh] bg-gray-950 flex flex-col max-w-md mx-auto px-4 py-5 gap-4` |
| Event summary bar | `w-full bg-gray-900 border border-gray-800 rounded-2xl px-4 py-3` |
| Scarcity banner (normal) | `w-full bg-gray-900 border border-gray-700 rounded-2xl px-5 py-4` |
| Scarcity banner (almost full) | `w-full bg-red-950 border border-red-700 rounded-2xl px-5 py-4` |
| Bay grid | `w-full grid grid-cols-5 gap-2` |
| Selected bay card | `w-full bg-green-950 border border-green-700 rounded-xl px-4 py-3` |
| Pricing block | `w-full bg-gray-900 border border-gray-800 rounded-2xl px-5 py-4` |
| UPI button (sticky) | `w-full sticky bottom-4 bg-white text-gray-900 font-bold rounded-2xl py-4` |

---

### PRD Traceability

| PRD Requirement | Component |
|-----------------|-----------|
| Real-time inventory counter — must be live, not static | `<InventoryScarcityBanner>` + polling |
| Named pillar bay, not a zone | `<BayGrid>` + `<SelectedBayCard>` pillar code |
| Entry time window display | `<EntryTimeWindowPicker>` |
| Cancellation policy — full refund 24hrs before | `<CancellationPolicyNotice>` |
| Post-booking UPI split request | `<GroupSplitCalculator>` → triggers after S3 confirms |
| Pricing: venue base + ParkEase fee = consumer total | `<PriceTierDisplay>` line items |
| Prohibited items banner | `<ProhibitedItemsBanner>` |
| Checkout drop-off <45% MVP | Sticky `<UPIPaymentButton>` + progressive disclosure reduces abandonment |
| Bay pillar mapping exercise (ops) | `<BayGrid>` seeded from ops catalogue — placeholder noted |
| Redirect if parking full mid-session | `isParkingFull` derived state → navigate S4 |
| Navigation routing to parking entry gate | `<SelectedBayCard>` distanceToGateMetres display (directions CTA in S3) |
| Scarcity counter tied to real inventory API | `[PLACEHOLDER]` polling hook in `<BookingFlowScreen>` |
