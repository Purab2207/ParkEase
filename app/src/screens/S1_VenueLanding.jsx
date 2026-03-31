import React, { useState, useEffect } from 'react';

// S1 — Venue / Event Landing Page
// React / Tailwind Implementation
// PRD: Entry point for all three personas. Distance to gate is the headline feature.
// Must survive a WhatsApp screenshot — clean, credible, shareable (Priya's decision artefact)

// ----------------------------------------------------------------------------
// ICONS
// ----------------------------------------------------------------------------
const MapPinIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const CalendarIcon = () => (
  <svg className="w-4 h-4 text-gray-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const CarIcon = () => (
  <svg className="w-4 h-4 text-gray-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10l2 2h8l2-2zM13 16l2-2h3l1-5H13v7z" />
  </svg>
);

const WalkIcon = () => (
  <svg className="w-4 h-4 text-green-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const ChevronDownIcon = ({ open }) => (
  <svg className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);

const CheckIcon = () => (
  <svg className="w-4 h-4 text-green-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
  </svg>
);

const ShieldIcon = () => (
  <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

// ----------------------------------------------------------------------------
// MOCK DATA
// ----------------------------------------------------------------------------
const MOCK_VENUE = {
  eventId: 'karan-aujla-jln-2026',
  eventName: 'Karan Aujla',
  subTitle: 'The Bombairiya Tour',
  venue: 'Jawaharlal Nehru Stadium',
  city: 'Delhi',
  date: 'Sat, 12 Apr 2026',
  doorsOpen: '6:00 PM',
  showTime: '8:00 PM',
  totalSpots: 500,
  spotsRemaining: 47,           // PRD demo value — the number that does the work
  consumerPrice: 169,
  distanceToGateMetres: 180,    // PRD: distance to gate is headline — Priya's decision signal
  gateName: 'Gate 2',
  coveredParking: true,
  lots: [
    { name: 'JLN North Lot', spots: 300, distanceM: 180 },
    { name: 'JLN South Lot', spots: 200, distanceM: 280 },
  ],
  prohibitedItems: [
    'Professional cameras / DSLR',
    'Outside food & beverages',
    'Laser pointers',
    'Selfie sticks / tripods',
    'Power banks above 20,000 mAh',
  ],
  amenities: [
    'Covered parking',
    'Pillar-mapped bays',
    'QR entry enforcement',
    'Pre-assigned bay number',
  ],
  bookingCount: 453,   // social proof counter
};

// ----------------------------------------------------------------------------
// SUB-COMPONENTS
// ----------------------------------------------------------------------------

// Hero image placeholder — in MVP replaced with actual venue photo
const VenueHero = ({ eventName, subTitle, venueName, city }) => (
  <div className="w-full relative">
    {/* Image placeholder */}
    <div className="w-full h-52 bg-gradient-to-br from-gray-800 via-gray-900 to-gray-950 rounded-2xl flex flex-col items-center justify-center border border-gray-800 overflow-hidden relative">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
          backgroundSize: '32px 32px'
        }}
      />
      {/* ParkEase brand mark */}
      <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/10">
        <span className="text-xs font-bold text-white tracking-wide">ParkEase</span>
      </div>
      <div className="flex flex-col items-center gap-1 z-10 px-4 text-center">
        <span className="text-3xl font-black text-white tracking-tight">{eventName}</span>
        <span className="text-sm text-gray-400">{subTitle}</span>
      </div>
    </div>
    {/* Venue badge — overlaps hero bottom */}
    <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/10 flex items-center gap-1.5">
      <MapPinIcon />
      <span className="text-xs text-white font-medium">{venueName}, {city}</span>
    </div>
  </div>
);

// PRD: distance to gate IS the headline — Priya reads this and sends screenshot to husband
const DistanceHeadline = ({ distanceM, gateName, covered }) => (
  <div className="w-full bg-white border border-gray-200 shadow-sm rounded-2xl px-5 py-4 flex items-center justify-between">
    <div className="flex flex-col gap-0.5">
      <div className="flex items-center gap-2">
        <WalkIcon />
        <span className="text-2xl font-black text-gray-900">{distanceM}m</span>
        <span className="text-sm text-gray-500">to {gateName}</span>
      </div>
      <span className="text-xs text-gray-400 pl-6">
        {covered ? 'Covered path · ' : ''}Pillar-mapped bays · QR entry
      </span>
    </div>
    <div className="flex flex-col items-end gap-1">
      <span className="text-xs text-gray-400">from</span>
      <span className="text-xl font-bold text-gray-900">₹169</span>
      <span className="text-xs text-gray-400">per vehicle</span>
    </div>
  </div>
);

// PRD: real-time scarcity counter — must be live, not static
// "The number 47 does the work" — exact PRD quote
const ScarcityCounter = ({ spotsRemaining, totalSpots, bookingCount }) => {
  const fillPercent = ((totalSpots - spotsRemaining) / totalSpots) * 100;
  const isAlmostFull = spotsRemaining <= 50;
  const isCritical = spotsRemaining <= 20;

  return (
    <div className={`w-full rounded-2xl px-5 py-4 flex flex-col gap-2 border ${
      isCritical ? 'bg-red-50 border-red-200' :
      isAlmostFull ? 'bg-amber-50 border-amber-200' :
      'bg-white border border-gray-200 shadow-sm'
    }`}>
      <div className="flex items-center justify-between">
        <div className="flex items-baseline gap-1.5">
          <span className={`text-3xl font-black ${
            isCritical ? 'text-red-600' : isAlmostFull ? 'text-amber-600' : 'text-gray-900'
          }`}>{spotsRemaining}</span>
          <span className="text-sm text-gray-500">spots left</span>
        </div>
        <span className="text-xs text-gray-400">{bookingCount} already booked</span>
      </div>
      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-green-500 via-amber-500 to-red-500 transition-all duration-700"
          style={{ width: `${fillPercent}%` }}
        />
      </div>
      {isAlmostFull && (
        <p className={`text-xs font-medium ${isCritical ? 'text-red-500' : 'text-amber-600'}`}>
          {isCritical
            ? 'Almost sold out — book now or take a cab'
            : 'Filling fast — only a few spots left for this event'}
        </p>
      )}
    </div>
  );
};

// Event meta — date, doors open, show time
const EventMetaRow = ({ date, doorsOpen, showTime }) => (
  <div className="w-full flex items-center gap-2 px-1">
    <CalendarIcon />
    <span className="text-sm text-gray-700">{date}</span>
    <span className="text-gray-300">·</span>
    <span className="text-sm text-gray-500">Doors {doorsOpen}</span>
    <span className="text-gray-300">·</span>
    <span className="text-sm text-gray-500">Show {showTime}</span>
  </div>
);

// Lot breakdown — which lot, how far, how many spots
const LotBreakdownList = ({ lots }) => (
  <div className="w-full flex flex-col gap-2">
    <span className="text-xs text-gray-400 uppercase tracking-widest font-semibold px-1">
      Available lots
    </span>
    {lots.map((lot, i) => (
      <div key={i} className="w-full bg-white border border-gray-200 shadow-sm rounded-xl px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CarIcon />
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-gray-900">{lot.name}</span>
            <span className="text-xs text-gray-400">{lot.distanceM}m to gate</span>
          </div>
        </div>
        <span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-full">
          {lot.spots} spots
        </span>
      </div>
    ))}
  </div>
);

// Amenities checklist
const AmenitiesList = ({ amenities }) => (
  <div className="w-full flex flex-col gap-2">
    <span className="text-xs text-gray-400 uppercase tracking-widest font-semibold px-1">
      What's included
    </span>
    <div className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 grid grid-cols-2 gap-2">
      {amenities.map((item, i) => (
        <div key={i} className="flex items-center gap-2">
          <CheckIcon />
          <span className="text-xs text-gray-700">{item}</span>
        </div>
      ))}
    </div>
  </div>
);

// PRD feature #28 — prohibited items banner
const ProhibitedItemsBanner = ({ items }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="w-full bg-white border border-gray-200 shadow-sm rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-gray-50"
      >
        <span className="text-xs text-gray-500">⚠️ Venue prohibited items</span>
        <ChevronDownIcon open={open} />
      </button>
      {open && (
        <ul className="px-4 pb-3 flex flex-col gap-1.5 border-t border-gray-200">
          {items.map((item, i) => (
            <li key={i} className="text-xs text-gray-400 flex items-start gap-1.5">
              <span className="text-gray-400 mt-0.5">•</span>{item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

// Trust footer — addresses "Is this guaranteed?" anxiety
const TrustFooter = () => (
  <div className="w-full flex items-center justify-center gap-2 pb-2">
    <ShieldIcon />
    <span className="text-xs text-gray-400">
      Named bay guaranteed · Full refund 24hrs before event
    </span>
  </div>
);

// Primary CTA — sticky at bottom
const BookCTA = ({ spotsRemaining, consumerPrice, onBook }) => {
  const isFull = spotsRemaining === 0;
  return (
    <div className="w-full sticky bottom-4">
      <button
        onClick={onBook}
        disabled={isFull}
        className={`w-full font-bold text-base rounded-2xl py-4 transition-all shadow-lg shadow-black/50 active:scale-95
          ${isFull
            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
            : 'bg-[#1C1D2B] text-white hover:bg-gray-800 tracking-wide uppercase'
          }`}
      >
        {isFull
          ? 'Parking Full — Book a Cab Instead'
          : `Book Parking · ₹${consumerPrice}`
        }
      </button>
      {!isFull && (
        <p className="text-center text-xs text-gray-400 mt-2">
          Secured instantly · No queue at the gate
        </p>
      )}
    </div>
  );
};

// ----------------------------------------------------------------------------
// MAIN SCREEN
// ----------------------------------------------------------------------------
export default function VenueLandingScreen({ onNavigateToBooking, onNavigateToRedirect, selectedVenue }) {
  const [venue] = useState(() => {
    if (!selectedVenue) return MOCK_VENUE;
    return {
      ...MOCK_VENUE,
      eventName: selectedVenue.name,
      venue: selectedVenue.location,
      consumerPrice: selectedVenue.price,
    };
  });
  const [spotsRemaining, setSpotsRemaining] = useState(MOCK_VENUE.spotsRemaining);

  // Simulate live counter decay for demo realism
  useEffect(() => {
    const interval = setInterval(() => {
      setSpotsRemaining(prev => Math.max(prev - 1, 0));
    }, 45000);
    return () => clearInterval(interval);
  }, []);

  const handleBook = () => {
    if (spotsRemaining === 0) {
      // Navigate to S4 — redirect screen
      onNavigateToRedirect?.();
      console.log('navigate → S4 (parking full)');
    } else {
      // Navigate to S2 — booking flow
      onNavigateToBooking?.();
      console.log('navigate → S2 (booking flow)');
    }
  };

  return (
    <div className="min-h-[100dvh] bg-gray-50 font-sans sm:bg-gray-50">
      <div className="max-w-md mx-auto min-h-[100dvh] bg-gray-50 flex flex-col px-4 py-5 gap-4 sm:shadow-2xl">

        {/* Hero */}
        <VenueHero
          eventName={venue.eventName}
          subTitle={venue.subTitle}
          venueName={venue.venue}
          city={venue.city}
        />

        {/* Event date / time */}
        <EventMetaRow
          date={venue.date}
          doorsOpen={venue.doorsOpen}
          showTime={venue.showTime}
        />

        {/* PRD headline — distance to gate */}
        <DistanceHeadline
          distanceM={venue.distanceToGateMetres}
          gateName={venue.gateName}
          covered={venue.coveredParking}
        />

        {/* Real-time scarcity counter — "47 does the work" */}
        <ScarcityCounter
          spotsRemaining={spotsRemaining}
          totalSpots={venue.totalSpots}
          bookingCount={venue.bookingCount}
        />

        {/* Lot breakdown */}
        <LotBreakdownList lots={venue.lots} />

        {/* Amenities */}
        <AmenitiesList amenities={venue.amenities} />

        {/* Prohibited items — PRD feature #28 */}
        <ProhibitedItemsBanner items={venue.prohibitedItems} />

        {/* Trust signal */}
        <TrustFooter />

        {/* Sticky book CTA */}
        <BookCTA
          spotsRemaining={spotsRemaining}
          consumerPrice={venue.consumerPrice}
          onBook={handleBook}
        />

        <div className="pb-4" />

      </div>
    </div>
  );
}
