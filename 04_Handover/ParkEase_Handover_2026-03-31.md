# ParkEase — Dev Handover & Roadmap
**Paused:** 2026-03-31  
**Repo:** `github.com/Purab2207/ParkEase` · branch `main`  
**Stack:** React + Vite + Tailwind CSS · `app/src/`  
**Primary colour:** `bg-[#1C1D2B]` · Background: `bg-gray-50` · Cards: `bg-white border border-gray-200 shadow-sm rounded-2xl`

---

## Ordered Work Plan — Pick Up From Here

Work through these sessions in order. Each session is scoped to fit within one usage limit window. Do not skip ahead — later sessions assume earlier ones are complete.

---

### Session 1 — Complete the 3 remaining core tasks ✅ Ready to build

These three prompts are fully specified below in Section 3. Copy-paste each into Emergent in order.

| Order | Task | File(s) touched | Est. complexity |
|-------|------|-----------------|-----------------|
| 1 | **Prompt A** — SearchOverlay venue state flows to S1 | `App.jsx`, `S1_VenueLanding.jsx` | Low |
| 2 | **Prompt B** — Auth phone pre-fills S2 contact field | `App.jsx`, `S2_BookingFlow.jsx` | Low–Medium |
| 3 | **Prompt C** — S5 PDF Blob download | `S5_OperatorDashboard.jsx` | Low |

After Session 1: all 5 core screens are functionally complete. The demo flow works end-to-end.

---

### Session 2 — S4 Redirect screen hardening 🔧 Needs spec

The S4 redirect screen has three placeholders that undermine credibility in a live demo:

| # | Gap | What to build | File |
|---|-----|---------------|------|
| 1 | **Deep-link app detection** | Before firing `olacabs://` URI, probe with a 300ms iframe timeout. If app not installed, show web fallback URL button instead of disabling the card. | `S4_RedirectScreen.jsx` |
| 2 | **Live redirect counter** | "156 people redirected tonight" in `<RedirectFooter>` is static. Replace with a `useEffect` counter that increments by 1–3 every 8–15 seconds (randomised interval) starting from 156. Resets on screen unmount. | `S4_RedirectScreen.jsx` |
| 3 | **Fare calculation** | `fareRangeLow` / `fareRangeHigh` are hardcoded. Replace with a simple distance-based lookup: if `dropZoneLat/Lng` within 5km → ₹80–₹140, 5–15km → ₹150–₹280, 15km+ → ₹290–₹450. Multiply by `surgeMultiplier` if surge active. | `S4_RedirectScreen.jsx` |

After Session 2: S4 redirect screen is demo-safe — no obviously static numbers visible during a pitch.

---

### Session 3 — S1 hero image + venue page polish 🎨 Visual

Currently the S1 venue hero is a dark gradient placeholder with no event imagery. This is the first thing a demo audience sees.

| # | Task | Detail |
|---|------|--------|
| 1 | **Real hero image** | Replace `VenueHero` gradient div with an `<img>` tag. Source: use a real Karan Aujla / JLN Stadium photo from Unsplash or a local asset in `app/src/assets/`. Add `object-cover` + `rounded-2xl` + a dark gradient overlay on top so text remains readable. |
| 2 | **Scarcity pulse animation** | Add a pulsing red dot next to the spots-remaining number in `ScarcityCounter` when `isCritical === true`. Tailwind class: `animate-pulse`. Add micro-copy: "3 booked in the last 2 mins" below the bar — static copy, purely visual. |
| 3 | **One-tap share CTA** | Add a share button to the `BookCTA` row in S1 (next to the Book button, not replacing it). On tap: call `navigator.share({ title: 'ParkEase', text: '180m from Gate 2 · ₹169', url: 'https://parksease.in' })` with a clipboard fallback. This is Priya's screenshot-and-share moment for the venue page (PRD §3.2 Stage 3). |

After Session 3: S1 is visually complete and demo-ready for investor/pitch presentations.

---

### Session 4 — S6 retention screen + S3 confirmation polish ✨ Story completion

S6 (`RetentionScreen`) was built in the previous session but hasn't been seen live yet. This session verifies it and adds the final missing trust signal to S3.

| # | Task | Detail |
|---|------|--------|
| 1 | **Verify S6 renders correctly** | Run `npm run dev`, navigate to S6 Retain in DemoNav. Check all 7 components display as intended. Fix any Tailwind class errors or layout issues. |
| 2 | **S3 confirmation — "Add to Apple/Google Wallet" placeholder** | Below the QR code in `S3_BookingConfirmation.jsx`, add a disabled button: `bg-gray-900 text-white rounded-2xl py-3 "Add to Apple Wallet"` with an Apple Wallet icon SVG. Mark it `disabled` with `opacity-50 cursor-not-allowed` and a tooltip "Coming soon". This signals premium intent in the demo without requiring any integration. |
| 3 | **S3 → S6 navigation link** | At the bottom of `S3_BookingConfirmation.jsx`, add a link: "See you at the next event →" that navigates to `SCREENS.RETENTION`. This lets a demo walk the full Arjun trust arc in one flow: S1 → S2 → S3 → S6. Pass `onNavigateToRetention` prop from `App.jsx`. |

After Session 4: the full Arjun trust arc (S1 → S2 → S3 → S6) is demoable in a single uninterrupted flow.

---

### Session 5 — Operator dashboard completeness 📊 B2B story

S5 is the B2B product. It needs to tell Siddharth's story convincingly. After Session 1 (PDF download), these gaps remain:

| # | Task | Detail |
|---|------|--------|
| 1 | **Pre-event vs live mode toggle** | Add a toggle at the top of S5: "Pre-event" / "Live" / "Post-event". In Pre-event mode, show fill rate at 62% (312/500 — "Siddharth's first login 2 weeks before the event"). In Post-event mode, show exit clearance data and PDF button as active. Currently only Live mode is shown. Hardcode all three states as MOCK data objects. |
| 2 | **Exit clearance comparison block** | Add a new component below `DemandShiftingPanel`: shows "ParkEase lots: avg 20 mins" vs "Industry baseline: 60–90 mins" as two side-by-side bars. This is the PRD's B2B proof point metric — the visual that Siddharth screenshots and sends to his MD. |
| 3 | **Manual fallback notice** | Add a small card at the bottom of S5: "Manual fallback active — printed booking list at each gate entry. App downtime does not cascade to physical failure." Styled as a `bg-blue-50 border-blue-200` info card. This is the line that closed Siddharth's sale in PRD §3.4 Stage 2. |

After Session 5: S5 tells the full B2B story — pre-event confidence, live monitoring, post-event compliance, and the manual fallback that closes enterprise deals.

---

### Session 6 — Demo mode & final polish 🎯 Pre-pitch

Before any investor or client demo, the prototype needs a clean demo mode.

| # | Task | Detail |
|---|------|--------|
| 1 | **Rename DemoNav label** | Change "Demo nav — remove before ship" to "Demo mode · ParkEase v0.5". It will always be there for demos — stop pretending it won't be. |
| 2 | **Guided demo flow button** | Add a "Start Demo" button to the DemoNav that auto-navigates through screens on a 4-second timer: S1 → S2 → S3 → S4 → S5 → S6. Pause on each screen. This lets a presenter hand a phone to an investor and say "just watch". |
| 3 | **Remove all console.log statements** | `S1_VenueLanding.jsx` has `console.log('navigate → S2 (booking flow)')` etc. Remove all of them. |
| 4 | **Fix mobile viewport** | Test on 390px viewport (iPhone 14). Verify DemoNav doesn't overlap sticky CTA buttons on S2 and S3. Add `pb-20` to the bottom of S2 and S3 scroll containers if overlap exists. |

After Session 6: prototype is pitch-ready. Hand to any non-technical person and the story sells itself.

---

## Phase Assessment — Beyond the Prototype

### Phase 0 — Prototype (current) · Sessions 1–6
*Goal: A convincing demo to show investors and first B2B pilots.*

All work above. Estimated total time: 5–8 focused hours across 6 sessions.

**Exit criteria:**
- [ ] All 5 screens functionally complete (Sessions 1–2)
- [ ] Full Arjun trust arc demoable in one flow (Session 4)
- [ ] B2B story told end-to-end on S5 (Session 5)
- [ ] Can hand a phone to anyone and have them understand the product in 60 seconds (Session 6)

---

### Phase 1 — MVP Backend · ~4–6 weeks
*Goal: A working product that can run at one real event.*

| # | Component | Tech decision | Notes |
|---|-----------|---------------|-------|
| 1 | **Inventory database** | Supabase (PostgreSQL) | One table: `bookings(id, event_id, bay_id, phone, status, created_at)`. Bay availability = total bays minus confirmed bookings. |
| 2 | **Real-time scarcity counter** | Supabase Realtime subscription | Subscribe to `bookings` table changes on S1 and S2. Replaces the `setInterval` decay simulation. |
| 3 | **UPI payment** | Razorpay Payment Links | Razorpay generates a payment link per booking. On payment success webhook → mark booking confirmed in Supabase → send confirmation. No custom UPI integration needed at MVP. |
| 4 | **QR code generation** | `qrcode` npm package, server-side | Generate QR from `bookingId` on confirmation. Store as base64 in Supabase or generate client-side. Replace the `MockQRCode` component in S3. |
| 5 | **Push notifications** | OneSignal free tier | Send departure nudge 90 mins before event. Send exit guidance 10 mins before event ends. Triggered by a scheduled Supabase Edge Function. |
| 6 | **OTP verification** | Twilio Verify or MSG91 | Replace the mock OTP flow in `AuthModal.jsx`. MSG91 is cheaper for Indian numbers (~₹0.15/OTP). |
| 7 | **Routing** | React Router v6 | Replace the manual `currentScreen` state in `App.jsx` with proper URL-based routing. Required for deep-linking from WhatsApp/BookMyShow embeds. |

**Exit criteria:**
- [ ] One venue, one event, real bookings accepted via UPI
- [ ] QR code scanned at gate by a real attendant
- [ ] Departure push notification delivered to a real phone

---

### Phase 2 — Operator Dashboard Backend · ~2–3 weeks after Phase 1
*Goal: Siddharth can log in and see his event live.*

| # | Component | Tech decision |
|---|-----------|---------------|
| 1 | **Operator auth** | Separate login flow — email + password (no OTP). Role: `operator`. Supabase Row Level Security filters data by `operator_id`. |
| 2 | **Live dashboard data** | Supabase Realtime on `bookings` table scoped to operator's events. Replaces `MOCK_DASHBOARD` constant. |
| 3 | **PDF report generation** | Supabase Edge Function triggered post-event. Uses `pdfmake` or `pdf-lib` to generate a real PDF. Stored in Supabase Storage, download URL returned to dashboard. Replaces the Blob `.txt` hack from Session 1 / Prompt C. |
| 4 | **Event configuration UI** | Form to create a new event: venue, total spots, lot breakdown, redirect threshold, drop zone coordinates. Saves to `events` table. Currently hardcoded in `MOCK_DASHBOARD`. |

---

### Phase 3 — B2B Integrations · ~4–8 weeks, partner-dependent
*Goal: Arjun finds parking at BookMyShow checkout without knowing ParkEase exists.*

| # | Integration | Dependency | Risk |
|---|-------------|------------|------|
| 1 | **BookMyShow checkout embed** | BMS partnership agreement | High — requires formal API access. BMS has reviewed third-party embeds before (insurance, F&B). Lead time: 4–12 weeks. |
| 2 | **Ola/Uber API callback** | Developer API registration | Medium — Ola Rides API is semi-open. Uber has a Partner API. Required for hard conversion confirmation (V2 of redirect tracking). |
| 3 | **WhatsApp Business API** | Meta Business verification | Low-Medium — currently using `wa.me` deep-link which requires no API. Business API needed only if two-way messaging is required (confirmations via WhatsApp instead of push). |
| 4 | **Google Maps routing** | Maps Platform API key | Low — straightforward. Required for V2 dynamic exit routing to replace static section-based guidance. ~₹7 per 1,000 directions requests. |

---

### Phase 4 — Scale & Trust · Post-pilot
*Goal: Enough events and data to pitch an annual contract to 3+ organisers.*

- True group booking (escrow — each person pays before spot is confirmed)
- Repeat booking pre-fill (saved bay preference, saved contact)
- Multi-city venue catalogue (SEO-indexed pages for Priya's Google search)
- IoT sensor integration for real occupancy data (replaces manual attendant check-ins)
- Municipal compliance report white-labelling (Siddharth submits ParkEase PDF to MCGM / BBMP)

---

## Current State Context

### Global state — `app/src/App.jsx`

All shared state lives in the root `App` component. No Context, Redux, or Zustand — plain `useState`.

```js
// Auth state (lines 67–69)
const [isLoggedIn, setIsLoggedIn]   = useState(false);
const [userPhone, setUserPhone]     = useState('');   // e.g. "9829487268", no +91 prefix
const [showAuth, setShowAuth]       = useState(false);

// Screen routing (lines 63–64)
const [currentScreen, setCurrentScreen] = useState(SCREENS.VENUE);

// SCREENS enum (lines 11–18)
const SCREENS = {
  VENUE:        'venue',
  BOOKING:      'booking',
  CONFIRMATION: 'confirmation',
  REDIRECT:     'redirect',
  DASHBOARD:    'dashboard',
  RETENTION:    'retention',
};
```

`onLoginSuccess(phone)` is called by `AuthModal` on OTP verify → sets `isLoggedIn = true`, `userPhone = phone`.  
`userPhone` is passed to `<Navbar>` for display but **not passed to any screen component**. It stops at the Navbar.

### SearchOverlay — `app/src/components/SearchOverlay.jsx`

- `onVenueSelect(venue)` passes the venue object up to App.jsx
- App.jsx receives it but **drops it** — just calls `navigate(SCREENS.VENUE)` without storing the venue
- S1 does not accept a venue prop — uses hardcoded `MOCK_VENUE` constant internally

### S2 BookingFlow — `app/src/screens/S2_BookingFlow.jsx`

- No contact/phone field exists anywhere in the 5-step flow
- `userPhone` is not passed in as a prop
- `handlePay()` at line 562 fires a 1500ms mock → calls `onPaymentSuccess`

### S5 PDF button — `app/src/screens/S5_OperatorDashboard.jsx`

- `PDFReportButton` component at lines 307–360
- Visual states work (`generating`, `done`) but `handleDownload` only does a `setTimeout`
- **No Blob is created. No file downloads.** Pure visual mock.
- All data needed is in `MOCK_DASHBOARD` (lines 54–88)

---

## Emergent Prompts — Session 1

Copy-paste these into Emergent in order A → B → C.

---

### Prompt A — SearchOverlay: Pass venue state through to S1

```
You are working on a React + Vite + Tailwind CSS app at app/src/.

TASK: Wire the selected venue from SearchOverlay through App.jsx into S1_VenueLanding.jsx so that tapping a venue card in the search overlay updates the venue landing page with real data.

CURRENT PROBLEM:

In App.jsx, the SearchOverlay's onVenueSelect handler receives the venue object but drops it:

  onVenueSelect={(venue) => {
    setShowSearch(false);
    navigate(SCREENS.VENUE);  // venue is ignored
  }}

S1_VenueLanding.jsx uses a hardcoded MOCK_VENUE constant internally and does not accept any venue prop from its parent.

EXACT CHANGES REQUIRED:

FILE 1: app/src/App.jsx

1. Add a new state variable after the parkingFull state:
   const [selectedVenue, setSelectedVenue] = useState(null);

2. Update the onVenueSelect handler to store the venue:
   onVenueSelect={(venue) => {
     setSelectedVenue(venue);
     setShowSearch(false);
     navigate(SCREENS.VENUE);
   }}

3. In the renderScreen() switch, update the VENUE case to pass selectedVenue as a prop:
   case SCREENS.VENUE:
     return (
       <VenueLandingScreen
         parkingFull={parkingFull}
         selectedVenue={selectedVenue}
         onNavigateToBooking={() => navigate(SCREENS.BOOKING)}
         onNavigateToRedirect={() => navigate(SCREENS.REDIRECT)}
       />
     );

FILE 2: app/src/screens/S1_VenueLanding.jsx

The MOCK_VENUE constant has this shape:
{ eventId, eventName, subTitle, venue, city, date, doorsOpen, showTime,
  totalSpots, spotsRemaining, consumerPrice, distanceToGateMetres, gateName,
  coveredParking, lots, prohibitedItems, amenities, bookingCount }

The selectedVenue object from SearchOverlay has this shape:
{ id, name, location, category, price }

These shapes are different. Do NOT replace MOCK_VENUE. Instead:

1. Update the VenueLandingScreen function signature:
   export default function VenueLandingScreen({ onNavigateToBooking, onNavigateToRedirect, selectedVenue })

2. Inside VenueLandingScreen, change the useState initialiser:
   const [venue] = useState(() => {
     if (!selectedVenue) return MOCK_VENUE;
     return {
       ...MOCK_VENUE,
       eventName: selectedVenue.name,
       venue: selectedVenue.location,
       consumerPrice: selectedVenue.price,
     };
   });

This keeps all operational fields from MOCK_VENUE while reflecting the user's actual selection for name, location, and price.

DO NOT change any other files. Do not add routing libraries. Do not change the DemoNav.
```

---

### Prompt B — S2 → S3: Flow auth phone number into booking contact field

```
You are working on a React + Vite + Tailwind CSS app at app/src/.

TASK: Add a contact confirmation step to S2_BookingFlow.jsx that pre-fills the logged-in user's phone number. The phone comes from App.jsx's userPhone state (10-digit string, no +91 prefix), set when OTP login completes via AuthModal.

CURRENT STATE:
- App.jsx: userPhone and isLoggedIn are in state but not passed to BookingFlowScreen
- S2_BookingFlow.jsx: has 5 steps — no contact/billing field exists anywhere. No phone prop.
- handlePay() is at line 562

EXACT CHANGES REQUIRED:

FILE 1: app/src/App.jsx

Update the BookingFlowScreen case in renderScreen() to pass userPhone and isLoggedIn:
  case SCREENS.BOOKING:
    return (
      <BookingFlowScreen
        onPaymentSuccess={() => navigate(SCREENS.CONFIRMATION)}
        onNavigateBack={() => navigate(SCREENS.VENUE)}
        onParkingFull={() => navigate(SCREENS.REDIRECT)}
        userPhone={userPhone}
        isLoggedIn={isLoggedIn}
      />
    );

FILE 2: app/src/screens/S2_BookingFlow.jsx

1. Update function signature:
   export default function BookingFlowScreen({ onPaymentSuccess, onNavigateBack, onParkingFull, userPhone, isLoggedIn })

2. Add state variable after the groupSize state:
   const [contactPhone, setContactPhone] = useState(userPhone || '');

3. Add a contact field block rendered only when selectedWindow is truthy (after the PricingBreakdown block, before UPIPaymentButton):

   {selectedWindow && (
     <div className="w-full flex flex-col gap-2">
       <span className="text-xs text-gray-500 uppercase tracking-widest font-semibold">
         4b · Contact number for QR delivery
       </span>
       <div className="w-full bg-white border border-gray-200 shadow-sm rounded-2xl px-4 py-3 flex flex-col gap-2">
         <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden focus-within:border-gray-400">
           <div className="px-3 py-3 bg-gray-50 border-r border-gray-200 text-sm text-gray-500 shrink-0">
             🇮🇳 +91
           </div>
           <input
             type="tel"
             maxLength={10}
             value={contactPhone}
             onChange={(e) => setContactPhone(e.target.value.replace(/\D/g, ''))}
             placeholder="10-digit mobile number"
             className="flex-1 px-3 py-3 outline-none text-sm text-gray-900 bg-white"
           />
           {isLoggedIn && userPhone && contactPhone === userPhone && (
             <div className="px-3 py-1 text-xs text-green-600 font-medium shrink-0">
               ✓ Verified
             </div>
           )}
         </div>
         <p className="text-xs text-gray-400">
           Booking QR and departure reminder sent here
         </p>
       </div>
     </div>
   )}

4. Add contactPhoneValid as a prop to the UPIPaymentButton component:
   const UPIPaymentButton = ({ consumerPrice, selectedBay, selectedWindow, contactPhoneValid, isLoading, onPay })

5. Update isDisabled inside UPIPaymentButton:
   const isDisabled = isDisabledBay || isDisabledWindow || !contactPhoneValid || isLoading;

6. Add a label case in getLabel() inside UPIPaymentButton, after the isDisabledWindow check:
   if (!contactPhoneValid) return 'Enter contact number to continue';

7. Pass contactPhoneValid where UPIPaymentButton is rendered:
   <UPIPaymentButton
     consumerPrice={event.consumerPrice}
     selectedBay={selectedBay}
     selectedWindow={selectedWindow}
     contactPhoneValid={contactPhone.length === 10}
     isLoading={paymentLoading}
     onPay={handlePay}
   />

BEHAVIOUR: If logged in, field is pre-filled and shows "✓ Verified". If not logged in, field is empty and must be filled manually. Pay button disabled until 10 digits present.

DO NOT add billing name, nationality, or email. Phone-only is correct for this product.
```

---

### Prompt C — S5 PDF: Build the mock Blob download

```
You are working on a React + Vite + Tailwind CSS app at app/src/.

TASK: The PDFReportButton component in S5_OperatorDashboard.jsx (lines 307–360) already has visual loading/done states but handleDownload() only runs a setTimeout — no file is ever created. Replace the mock with a real Blob that generates a plain-text compliance report and triggers a browser download.

CURRENT STATE:
const PDFReportButton = ({ eventName, date }) => {
  const [generating, setGenerating] = useState(false);
  const [done, setDone] = useState(false);
  const handleDownload = () => {
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      setDone(true);
      setTimeout(() => setDone(false), 3000);
    }, 1800);
  };

MOCK_DASHBOARD (lines 54–88) has all needed data:
{ eventName, venue, date, totalSpots, bookedSpots, spotsRemaining, fillPercent,
  redirectCTATaps, complianceRate (0.55), redirectThresholdSpots,
  lots: [{ name, total, booked, percent }] }

EXACT CHANGES REQUIRED:

FILE: app/src/screens/S5_OperatorDashboard.jsx

CHANGE 1 — Update PDFReportButton signature:
  From: const PDFReportButton = ({ eventName, date }) =>
  To:   const PDFReportButton = ({ data }) =>

CHANGE 2 — Replace handleDownload with:

  const handleDownload = () => {
    setGenerating(true);
    setTimeout(() => {
      const diverted = Math.round(data.redirectCTATaps * data.complianceRate);
      const tapRate  = Math.round((data.redirectCTATaps / 312) * 100);

      const reportText = [
        '================================================================',
        '         PARKEASE POST-EVENT COMPLIANCE REPORT',
        '================================================================',
        '',
        `Event:   ${data.eventName}`,
        `Venue:   ${data.venue}`,
        `Date:    ${data.date}`,
        `Generated: ${new Date().toLocaleString('en-IN')}`,
        '',
        '----------------------------------------------------------------',
        'PARKING PERFORMANCE',
        '----------------------------------------------------------------',
        `Total pre-booked spots:     ${data.totalSpots}`,
        `Confirmed arrivals:         ${data.bookedSpots}`,
        `Utilisation rate:           ${data.fillPercent}%`,
        `Spots remaining at close:   ${data.spotsRemaining}`,
        `Booking conflicts:          0`,
        '',
        'Per-lot breakdown:',
        ...data.lots.map(l =>
          `  ${l.name.padEnd(20)} ${l.booked}/${l.total}  (${l.percent}%)`
        ),
        '',
        '----------------------------------------------------------------',
        'DEMAND SHIFTING PERFORMANCE',
        '----------------------------------------------------------------',
        `Redirect threshold:         ${data.redirectThresholdSpots} spots (90% fill)`,
        `Users shown parking full:   312`,
        `Tapped cab/shuttle CTA:     ${data.redirectCTATaps}  (${tapRate}% tap rate)`,
        `Est. vehicles diverted:     ~${diverted}`,
        `Compliance discount:        55% applied to CTA tap count`,
        `Avg cab booking time:       24 seconds`,
        '',
        'Note: Diversion estimate uses a 55% compliance discount on CTA taps,',
        'based on validated behavioural redirection benchmarks (Waze/Google Maps).',
        'Direct measurement requires V2 sensor integration.',
        '',
        '----------------------------------------------------------------',
        'EXIT CLEARANCE PERFORMANCE',
        '----------------------------------------------------------------',
        'ParkEase-managed lots:       avg 20-minute clearance post-event',
        'Industry baseline:           60-90 minutes (unmanaged large events)',
        'Sources:',
        '  - Business Standard: Diljit Dosanjh Delhi concert, Jan 2025',
        '  - Free Press Journal: Coldplay Mumbai concert, Jan 2025',
        'ParkEase vs baseline:        65-77% faster clearance',
        '',
        '----------------------------------------------------------------',
        'COMPLIANCE NOTES',
        '----------------------------------------------------------------',
        'Zero post-event parking complaints via event ops channel.',
        'No municipal notices triggered.',
        'Full booking log available for authority review upon request.',
        '',
        '================================================================',
        'Report generated by ParkEase Operator Dashboard',
        'For queries: ops@parksease.in',
        '================================================================',
      ].join('\n');

      const blob = new Blob([reportText], { type: 'text/plain' });
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement('a');
      a.href     = url;
      a.download = `ParkEase_Compliance_${data.eventName.replace(/\s+/g, '_')}_${data.date.replace(/,?\s+/g, '_')}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setGenerating(false);
      setDone(true);
      setTimeout(() => setDone(false), 3000);
    }, 1800);
  };

CHANGE 3 — Update the JSX text reference inside PDFReportButton:
  Change: Available after event ends · {eventName} · {date}
  To:     Available after event ends · {data.eventName} · {data.date}

CHANGE 4 — Update where PDFReportButton is rendered in OperatorDashboardScreen:
  Change: <PDFReportButton eventName={data.eventName} date={data.date} />
  To:     <PDFReportButton data={data} />

DO NOT install jsPDF, pdfmake, or any PDF library. Plain text Blob is correct for the prototype. DO NOT change any other component in this file.
```

---

## File Map — Quick Reference

| File | Purpose | Key state / exports |
|------|---------|---------------------|
| `app/src/App.jsx` | Root. All global state. | `isLoggedIn`, `userPhone`, `selectedVenue` (to add), `currentScreen` |
| `app/src/components/AuthModal.jsx` | Phone + OTP modal. Purple gradient header. 6 OTP boxes. | Calls `onLoginSuccess(phone)` |
| `app/src/components/SearchOverlay.jsx` | Search + trending grid. | Calls `onVenueSelect(venue)` |
| `app/src/components/Navbar.jsx` | Top nav. Receives `isLoggedIn`, `userPhone`. | — |
| `app/src/screens/S1_VenueLanding.jsx` | Event landing. `MOCK_VENUE` hardcoded. | `VenueLandingScreen` |
| `app/src/screens/S2_BookingFlow.jsx` | 5-step booking. No phone prop today. | `BookingFlowScreen` |
| `app/src/screens/S3_BookingConfirmation.jsx` | Confirmation. QR, WhatsApp share, UPI split all built. | `BookingConfirmationScreen` |
| `app/src/screens/S4_RedirectScreen.jsx` | Parking full → Ola/Uber/Rapido deep-links. | `RedirectScreen` |
| `app/src/screens/S5_OperatorDashboard.jsx` | Ops B2B. PDF button is visual-only. | `OperatorDashboardScreen` |
| `app/src/screens/S6_RetentionScreen.jsx` | Re-engagement (Arjun Stage 6). RCB Playoffs. | `RetentionScreen` |

---

*Paused: 2026-03-31 · Resume at Session 1, Prompt A.*
