import React from 'react';

// S6 — Retention / Re-engagement Screen
// React / Tailwind Implementation
// PRD Stage 6: Arjun's trust arc — retention loop closes the product story.
// From first booking → trust built → frictionless repeat booking.
//
// [PLACEHOLDER — Push notification delivery]
// In production this screen is triggered by a push notification deep-link,
// not manual navigation. The notification payload carries eventId + userId
// and the app resolves the pre-filled booking context on load.

// ----------------------------------------------------------------------------
// HARDCODED DATA
// ----------------------------------------------------------------------------
const PERSONA = {
  name: 'Arjun',
  previousEvents: 1,
  lastEvent: {
    name: 'Karan Aujla',
    bay: 'Bay B-18',
    month: 'Apr 2026',
    exitTime: '12 mins',
  },
};

const EVENT = {
  title: 'RCB vs MI — IPL 2026 Playoffs',
  shortTitle: 'RCB vs MI · Playoffs',
  venue: 'M. Chinnaswamy Stadium, Bangalore',
  date: 'Sun, 4 May 2026 · 7:30 PM',
  price: 199,
  totalSpots: 500,
  bookedSpots: 300,
};

const FILL_RATE = Math.round((EVENT.bookedSpots / EVENT.totalSpots) * 100); // 60
const SPOTS_REMAINING = EVENT.totalSpots - EVENT.bookedSpots; // 200

// ----------------------------------------------------------------------------
// ICONS (all inline SVG — no external library)
// ----------------------------------------------------------------------------
const BellIcon = () => (
  <svg className="w-5 h-5 text-[#1C1D2B]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
  </svg>
);

const CheckCircleIcon = ({ className = 'w-4 h-4 text-green-600' }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const ShieldCheckIcon = () => (
  <svg className="w-4 h-4 text-blue-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

const QrIcon = () => (
  <svg className="w-4 h-4 text-purple-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12v.01M12 4h.01M4 4h4v4H4V4zm12 0h4v4h-4V4zM4 16h4v4H4v-4z" />
  </svg>
);

const BadgeCheckIcon = () => (
  <svg className="w-4 h-4 text-blue-500 shrink-0" fill="currentColor" viewBox="0 0 24 24">
    <path fillRule="evenodd"
      d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.307 4.491 4.491 0 01-1.307-3.497A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
      clipRule="evenodd" />
  </svg>
);

const ClockIcon = () => (
  <svg className="w-3 h-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const MapPinIcon = () => (
  <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const CalendarIcon = () => (
  <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const FlameIcon = () => (
  <svg className="w-3.5 h-3.5 text-red-500" fill="currentColor" viewBox="0 0 24 24">
    <path d="M17.66 11.2c-.23-.3-.51-.56-.77-.82-.67-.6-1.43-1.03-2.07-1.66C13.33 7.26 13 4.85 13.95 3c-.95.23-1.78.75-2.49 1.32-2.59 2.08-3.61 5.75-2.39 8.9.04.1.08.2.08.33 0 .22-.15.42-.35.5-.23.1-.47.04-.66-.12a.58.58 0 01-.14-.17c-1.13-1.43-1.31-3.48-.55-5.12C5.78 10 4.87 12.3 5 14.47c.06.5.12 1 .29 1.5.14.6.41 1.2.71 1.73 1.08 1.73 2.95 2.97 4.96 3.22 2.14.27 4.43-.17 6.08-1.61 1.83-1.6 2.45-4.1 1.6-6.4l-.08-.17c-.22-.5-.41-1.01-.9-1.54z" />
  </svg>
);

// ----------------------------------------------------------------------------
// SUB-COMPONENTS
// ----------------------------------------------------------------------------

const NotificationBanner = () => (
  <div className="bg-white border border-gray-200 shadow-md rounded-2xl px-4 py-3 flex items-start gap-3">
    {/* App icon */}
    <div className="shrink-0 mt-0.5 w-10 h-10 bg-[#1C1D2B] rounded-xl flex items-center justify-center">
      <span className="text-white text-[10px] font-black tracking-tight leading-none">PE</span>
    </div>
    {/* Content */}
    <div className="flex-1 min-w-0">
      <div className="flex items-center justify-between gap-2 mb-0.5">
        <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-widest">ParkEase</span>
        <span className="flex items-center gap-1 text-[10px] text-gray-400">
          <ClockIcon />
          Just now
        </span>
      </div>
      <p className="text-sm font-bold text-gray-900 leading-tight">{EVENT.shortTitle}</p>
      <p className="text-xs text-gray-500 mt-0.5 leading-snug">
        Parking spots near Chinnaswamy already 60% booked. Secure yours before they&apos;re gone.
      </p>
    </div>
  </div>
);

const EventCard = () => (
  <div className="bg-gradient-to-br from-gray-800 via-gray-900 to-gray-950 rounded-2xl overflow-hidden border border-red-800/30 shadow-lg">
    {/* Hero area */}
    <div className="relative px-5 pt-5 pb-4">
      {/* RCB red stripe accent */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-700 via-red-500 to-red-700 opacity-70 rounded-t-2xl" />

      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-[10px] text-red-400/80 uppercase tracking-widest font-semibold mb-1">IPL 2026 · Playoffs</p>
          <h2 className="text-xl font-black text-white leading-tight">RCB vs MI</h2>
          <p className="text-sm text-gray-300 font-medium mt-0.5">IPL 2026 Playoffs</p>
        </div>
        {/* VS badge */}
        <div className="shrink-0 w-12 h-12 rounded-xl border border-red-700/40 bg-red-950/40 flex items-center justify-center">
          <span className="text-xs font-black text-red-400 tracking-tight">VS</span>
        </div>
      </div>

      {/* Venue + Date */}
      <div className="mt-4 flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <MapPinIcon />
          <span className="text-xs text-gray-300 truncate">{EVENT.venue}</span>
        </div>
        <div className="flex items-center gap-2">
          <CalendarIcon />
          <span className="text-xs text-gray-300">{EVENT.date}</span>
        </div>
      </div>
    </div>

    {/* Price strip */}
    <div className="bg-gray-950/60 border-t border-white/5 px-5 py-3 flex items-center justify-between">
      <div>
        <p className="text-[10px] text-gray-500 uppercase tracking-widest">Parking from</p>
        <p className="text-lg font-black text-white">₹{EVENT.price}</p>
      </div>
      <div className="flex items-center gap-1.5 bg-red-900/30 border border-red-700/30 rounded-full px-3 py-1">
        <FlameIcon />
        <span className="text-xs text-red-400 font-semibold">Filling fast</span>
      </div>
    </div>
  </div>
);

const FillRateUrgencyBar = () => {
  // Gradient fill: green → amber → red based on fill %
  const barColor =
    FILL_RATE < 40 ? 'bg-green-500' :
    FILL_RATE < 70 ? 'bg-amber-500' :
    'bg-red-500';

  return (
    <div className="bg-white border border-gray-200 shadow-sm rounded-2xl px-4 py-4">
      <div className="flex items-center justify-between mb-1.5">
        <p className="text-xs font-semibold text-gray-700">
          {EVENT.bookedSpots} of {EVENT.totalSpots} spots booked
        </p>
        <p className="text-xs font-black text-amber-600">{FILL_RATE}% full</p>
      </div>

      {/* Progress bar */}
      <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${barColor}`}
          style={{ width: `${FILL_RATE}%`,
            background: 'linear-gradient(to right, #22c55e, #f59e0b, #ef4444)',
          }}
        />
      </div>

      <div className="flex items-center justify-between mt-2">
        <p className="text-xs font-bold text-red-500">{SPOTS_REMAINING} spots remaining</p>
        <p className="text-[10px] text-gray-400 italic">Filling faster than your last event</p>
      </div>
    </div>
  );
};

const TrustSignalRow = () => (
  <div className="flex items-center gap-2 flex-wrap">
    {/* Chip 1 */}
    <div className="flex items-center gap-1.5 bg-green-50 border border-green-200 rounded-full px-3 py-1.5">
      <CheckCircleIcon className="w-3.5 h-3.5 text-green-600 shrink-0" />
      <span className="text-[11px] text-green-700 font-semibold whitespace-nowrap">Named bay guaranteed</span>
    </div>
    {/* Chip 2 */}
    <div className="flex items-center gap-1.5 bg-blue-50 border border-blue-200 rounded-full px-3 py-1.5">
      <ShieldCheckIcon />
      <span className="text-[11px] text-blue-700 font-semibold whitespace-nowrap">Full refund 24hrs before</span>
    </div>
    {/* Chip 3 */}
    <div className="flex items-center gap-1.5 bg-purple-50 border border-purple-200 rounded-full px-3 py-1.5">
      <QrIcon />
      <span className="text-[11px] text-purple-700 font-semibold whitespace-nowrap">QR entry — no queue</span>
    </div>
  </div>
);

const LastTimeMemoryChip = () => (
  <div className="bg-gray-100 border border-gray-200 rounded-xl px-4 py-3">
    <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-1.5">Last time you were here</p>
    <div className="flex items-center gap-2 flex-wrap">
      <span className="inline-flex items-center gap-1.5 bg-white border border-gray-200 shadow-sm rounded-lg px-3 py-1.5 text-xs font-semibold text-gray-700">
        <CheckCircleIcon className="w-3.5 h-3.5 text-green-500 shrink-0" />
        {PERSONA.lastEvent.name}
        <span className="text-gray-300 mx-0.5">·</span>
        {PERSONA.lastEvent.bay}
        <span className="text-gray-300 mx-0.5">·</span>
        {PERSONA.lastEvent.month}
        <span className="text-gray-300 mx-0.5">·</span>
        <span className="text-green-600">Got out in {PERSONA.lastEvent.exitTime}</span>
      </span>
    </div>
  </div>
);

const RepeatBookerBadge = () => (
  <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3">
    <div className="flex items-center gap-2 mb-1">
      <BadgeCheckIcon />
      <p className="text-sm font-bold text-gray-900">Welcome back, {PERSONA.name}</p>
    </div>
    <p className="text-xs text-blue-600 mb-1">
      {PERSONA.previousEvents} previous event · {PERSONA.lastEvent.name}, {PERSONA.lastEvent.month}
    </p>
    <p className="text-xs text-gray-500">Your details are saved — book in one tap</p>
  </div>
);

const OneClickRebookCTA = () => (
  <div className="sticky bottom-4 px-0">
    <button className="w-full bg-[#1C1D2B] text-white rounded-2xl px-6 py-4 shadow-xl active:scale-[0.98] transition-transform">
      <p className="text-base font-black tracking-tight">Book Parking · ₹{EVENT.price}</p>
      <p className="text-[11px] text-gray-400 mt-0.5 font-normal">Your details are saved · UPI checkout in 10 seconds</p>
    </button>
  </div>
);

const SkipLink = () => (
  <p className="text-xs text-gray-400 underline text-center cursor-pointer py-1">
    Remind me later
  </p>
);

// ----------------------------------------------------------------------------
// ROOT SCREEN
// ----------------------------------------------------------------------------
export default function RetentionScreen() {
  return (
    <div className="min-h-screen bg-gray-50 pb-32">
      <div className="max-w-md mx-auto px-4 pt-5 flex flex-col gap-4">

        {/* Section label */}
        <p className="text-xs text-gray-400 uppercase tracking-widest text-center">
          ParkEase · Re-engagement
        </p>

        {/* Push notification card */}
        <NotificationBanner />

        {/* Event card */}
        <EventCard />

        {/* Fill rate urgency */}
        <FillRateUrgencyBar />

        {/* Memory recall: last event */}
        <LastTimeMemoryChip />

        {/* Trust signals */}
        <TrustSignalRow />

        {/* Repeat booker identity badge */}
        <RepeatBookerBadge />

        {/* Primary CTA — sticky */}
        <OneClickRebookCTA />

        {/* Secondary escape */}
        <SkipLink />

      </div>
    </div>
  );
}
