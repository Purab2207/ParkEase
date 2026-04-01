import React, { useState, useEffect } from 'react';
import { fetchEvent } from '../api';
import useLiveSpots from '../hooks/useLiveSpots';

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

const FALLBACK_VENUE = {
  event_id: 'karan-aujla-jln-2026',
  event_name: 'Karan Aujla',
  sub_title: 'The Bombairiya Tour',
  venue: 'Jawaharlal Nehru Stadium',
  city: 'Delhi',
  date: 'Sat, 12 Apr 2026',
  doors_open: '6:00 PM',
  show_time: '8:00 PM',
  total_spots: 500,
  spots_remaining: 47,
  consumer_price: 169,
  distance_to_gate_metres: 180,
  gate_name: 'Gate 2',
  covered_parking: true,
  lots: [
    { name: 'JLN North Lot', total: 300, distance_m: 180 },
    { name: 'JLN South Lot', total: 200, distance_m: 280 },
  ],
  prohibited_items: [
    'Professional cameras / DSLR',
    'Outside food & beverages',
    'Laser pointers',
    'Selfie sticks / tripods',
    'Power banks above 20,000 mAh',
  ],
  amenities: ['Covered parking', 'Pillar-mapped bays', 'QR entry enforcement', 'Pre-assigned bay number'],
  booking_count: 453,
};

const VenueHero = ({ eventName, subTitle, venueName, city }) => (
  <div className="w-full relative">
    <div className="w-full h-52 rounded-2xl overflow-hidden relative">
      <img
        src="https://images.unsplash.com/photo-1501386761578-eaa54b4165e5?w=800&auto=format&fit=crop&q=80"
        alt={eventName}
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent rounded-2xl" />
      <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/10">
        <span className="text-xs font-bold text-white tracking-wide">ParkEase</span>
      </div>
      <div className="absolute bottom-4 left-4 right-4 z-10">
        <span className="text-2xl font-black text-white tracking-tight">{eventName}</span>
        <p className="text-sm text-gray-300 mt-0.5">{subTitle}</p>
      </div>
    </div>
    <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/10 flex items-center gap-1.5">
      <MapPinIcon />
      <span className="text-xs text-white font-medium">{venueName}, {city}</span>
    </div>
  </div>
);

const DistanceHeadline = ({ distanceM, gateName, covered, price }) => (
  <div className="w-full bg-white border border-gray-200 shadow-sm rounded-2xl px-5 py-4 flex items-center justify-between" data-testid="distance-headline">
    <div className="flex flex-col gap-0.5">
      <div className="flex items-center gap-2">
        <WalkIcon />
        <span className="text-2xl font-black text-gray-900">{distanceM}m</span>
        <span className="text-sm text-gray-500">to {gateName}</span>
      </div>
      <span className="text-xs text-gray-400 pl-6">
        {covered ? 'Covered path - ' : ''}Pillar-mapped bays - QR entry
      </span>
    </div>
    <div className="flex flex-col items-end gap-1">
      <span className="text-xs text-gray-400">from</span>
      <span className="text-xl font-bold text-gray-900">{price}</span>
      <span className="text-xs text-gray-400">per vehicle</span>
    </div>
  </div>
);

const ScarcityCounter = ({ spotsRemaining, totalSpots, bookingCount }) => {
  const fillPercent = ((totalSpots - spotsRemaining) / totalSpots) * 100;
  const isAlmostFull = spotsRemaining <= 50;
  const isCritical = spotsRemaining <= 20;

  return (
    <div data-testid="scarcity-counter" className={`w-full rounded-2xl px-5 py-4 flex flex-col gap-2 border ${
      isCritical ? 'bg-red-50 border-red-200' :
      isAlmostFull ? 'bg-amber-50 border-amber-200' :
      'bg-white border border-gray-200 shadow-sm'
    }`}>
      <div className="flex items-center justify-between">
        <div className="flex items-baseline gap-1.5">
          {isCritical && (
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse shrink-0" />
          )}
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
            ? 'Almost sold out -- book now or take a cab'
            : 'Filling fast -- only a few spots left for this event'}
        </p>
      )}
      {isCritical && (
        <p className="text-xs text-red-400 font-medium">3 booked in the last 2 mins</p>
      )}
    </div>
  );
};

const EventMetaRow = ({ date, doorsOpen, showTime }) => (
  <div className="w-full flex items-center gap-2 px-1">
    <CalendarIcon />
    <span className="text-sm text-gray-700">{date}</span>
    <span className="text-gray-300">-</span>
    <span className="text-sm text-gray-500">Doors {doorsOpen}</span>
    <span className="text-gray-300">-</span>
    <span className="text-sm text-gray-500">Show {showTime}</span>
  </div>
);

const LotBreakdownList = ({ lots }) => (
  <div className="w-full flex flex-col gap-2">
    <span className="text-xs text-gray-400 uppercase tracking-widest font-semibold px-1">Available lots</span>
    {lots.map((lot, i) => (
      <div key={i} className="w-full bg-white border border-gray-200 shadow-sm rounded-xl px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CarIcon />
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-gray-900">{lot.name}</span>
            <span className="text-xs text-gray-400">{lot.distance_m}m to gate</span>
          </div>
        </div>
        <span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-full">{lot.total} spots</span>
      </div>
    ))}
  </div>
);

const AmenitiesList = ({ amenities }) => (
  <div className="w-full flex flex-col gap-2">
    <span className="text-xs text-gray-400 uppercase tracking-widest font-semibold px-1">What's included</span>
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

const ProhibitedItemsBanner = ({ items }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="w-full bg-white border border-gray-200 shadow-sm rounded-xl overflow-hidden">
      <button onClick={() => setOpen(v => !v)} className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-gray-50">
        <span className="text-xs text-gray-500">Venue prohibited items</span>
        <ChevronDownIcon open={open} />
      </button>
      {open && (
        <ul className="px-4 pb-3 flex flex-col gap-1.5 border-t border-gray-200">
          {items.map((item, i) => (
            <li key={i} className="text-xs text-gray-400 flex items-start gap-1.5">
              <span className="text-gray-400 mt-0.5">*</span>{item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const TrustFooter = () => (
  <div className="w-full flex items-center justify-center gap-2 pb-2">
    <ShieldIcon />
    <span className="text-xs text-gray-400">Named bay guaranteed - Full refund 24hrs before event</span>
  </div>
);

const BookCTA = ({ spotsRemaining, consumerPrice, onBook }) => {
  const isFull = spotsRemaining === 0;
  const handleShare = async () => {
    const shareData = { title: 'ParkEase', text: `180m from Gate 2 - ${consumerPrice} - Pre-booked parking`, url: 'https://parksease.in' };
    try {
      if (navigator.share) await navigator.share(shareData);
      else { await navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`); alert('Link copied!'); }
    } catch (err) { /* ignore */ }
  };

  return (
    <div className="w-full sticky bottom-4">
      <div className="w-full flex items-center gap-3">
        <button data-testid="book-parking-btn" onClick={onBook} disabled={isFull}
          className={`flex-1 font-bold text-base rounded-2xl py-4 transition-all shadow-lg shadow-black/50 active:scale-95
            ${isFull ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-[#1C1D2B] text-white hover:bg-gray-800 tracking-wide uppercase'}`}>
          {isFull ? 'Parking Full -- Book a Cab Instead' : `Book Parking - ${consumerPrice}`}
        </button>
        {!isFull && (
          <button onClick={handleShare} data-testid="share-btn"
            className="shrink-0 w-14 h-14 rounded-2xl bg-white border border-gray-200 shadow-lg flex items-center justify-center active:scale-95 transition-all" aria-label="Share">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
          </button>
        )}
      </div>
      {!isFull && <p className="text-center text-xs text-gray-400 mt-2">Secured instantly - No queue at the gate</p>}
    </div>
  );
};

export default function VenueLandingScreen({ onNavigateToBooking, onNavigateToRedirect, selectedVenue }) {
  const [venue, setVenue] = useState(FALLBACK_VENUE);
  const [loading, setLoading] = useState(true);

  const eventId = selectedVenue?.id || 'karan-aujla-jln-2026';
  const live = useLiveSpots(eventId);

  useEffect(() => {
    fetchEvent(eventId)
      .then(data => {
        setVenue(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [eventId]);

  // Use live WebSocket data when available, otherwise fall back to venue data
  const spotsRemaining = live.spotsRemaining ?? venue.spots_remaining ?? 0;
  const bookingCount = live.bookedSpots ?? venue.booking_count ?? (venue.total_spots - spotsRemaining);

  const handleBook = () => {
    if (spotsRemaining === 0) onNavigateToRedirect?.();
    else onNavigateToBooking?.();
  };

  if (loading) {
    return (
      <div className="min-h-[100dvh] bg-gray-50 flex items-center justify-center">
        <div className="animate-pulse text-gray-400">Loading event...</div>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] bg-gray-50 font-sans" data-testid="venue-landing">
      <div className="max-w-md mx-auto min-h-[100dvh] bg-gray-50 flex flex-col px-4 py-5 gap-4 sm:shadow-2xl">
        <VenueHero eventName={venue.event_name} subTitle={venue.sub_title} venueName={venue.venue} city={venue.city} />
        {/* Live connection indicator */}
        <div className="flex items-center justify-center gap-1.5" data-testid="live-indicator">
          <span className={`w-2 h-2 rounded-full ${live.connected ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`} />
          <span className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold">
            {live.connected ? 'Live' : 'Updating...'}
          </span>
        </div>
        <EventMetaRow date={venue.date} doorsOpen={venue.doors_open} showTime={venue.show_time} />
        <DistanceHeadline distanceM={venue.distance_to_gate_metres} gateName={venue.gate_name} covered={venue.covered_parking} price={`\u20B9${venue.consumer_price}`} />
        <ScarcityCounter spotsRemaining={spotsRemaining} totalSpots={venue.total_spots} bookingCount={bookingCount} />
        <LotBreakdownList lots={venue.lots || []} />
        <AmenitiesList amenities={venue.amenities || []} />
        <ProhibitedItemsBanner items={venue.prohibited_items || []} />
        <TrustFooter />
        <BookCTA spotsRemaining={spotsRemaining} consumerPrice={`\u20B9${venue.consumer_price}`} onBook={handleBook} />
        <div className="pb-4" />
      </div>
    </div>
  );
}