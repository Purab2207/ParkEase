import React, { useState } from 'react';

const MapPin = () => (
  <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);
const AlertTriangle = () => (
  <svg className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>
);

const getFareRange = (lat, lng, surgeMultiplier = 1) => {
  const venueLat = 28.6139; const venueLng = 77.2090;
  const R = 6371;
  const dLat = (lat - venueLat) * Math.PI / 180;
  const dLng = (lng - venueLng) * Math.PI / 180;
  const a = Math.sin(dLat/2) ** 2 + Math.cos(venueLat * Math.PI / 180) * Math.cos(lat * Math.PI / 180) * Math.sin(dLng/2) ** 2;
  const km = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  let low, high;
  if (km <= 5) { low = 80; high = 140; }
  else if (km <= 15) { low = 150; high = 280; }
  else { low = 290; high = 450; }
  return { low: Math.round(low * surgeMultiplier), high: Math.round(high * surgeMultiplier) };
};

const VENUE_DATA = {
  venueDisplayName: "Chinnaswamy Stadium, Bangalore",
  dropZoneName: "Drop Zone A, near Gate 4",
  dropZoneLat: 12.9793, dropZoneLng: 77.5996,
  isSurgeActive: true, surgeMultiplier: 1.8,
  cabAvailability: { ola: 'available', uber: 'low', rapido: 'available' }
};

const CabProviderCard = ({ provider, availability, dropZoneLat, dropZoneLng, dropZoneName }) => {
  const [showWebFallback, setShowWebFallback] = useState(false);
  const brands = { ola: { name: 'Ola', color: 'bg-lime-500' }, uber: { name: 'Uber', color: 'bg-black text-white border-gray-600' }, rapido: { name: 'Rapido', color: 'bg-yellow-400 text-black' } };
  const brand = brands[provider] || { name: provider, color: 'bg-white' };
  const isUnavailable = availability === 'unavailable';

  const handleBooking = () => {
    if (isUnavailable) return;
    const encodedName = encodeURIComponent(dropZoneName);
    const links = { ola: `olacabs://book?lat=${dropZoneLat}&lng=${dropZoneLng}&drop_name=${encodedName}`, uber: `uber://?action=setPickup&dropoff[latitude]=${dropZoneLat}&dropoff[longitude]=${dropZoneLng}`, rapido: `rapido://book?dest_lat=${dropZoneLat}&dest_lng=${dropZoneLng}` };
    window.location.href = links[provider] || '#';
    setTimeout(() => setShowWebFallback(true), 1500);
  };

  const webUrls = { ola: 'https://book.olacabs.com', uber: 'https://m.uber.com/ul/', rapido: 'https://rapido.bike' };

  return (
    <div data-testid={`cab-${provider}`}
      className={`flex flex-col items-center justify-between bg-white hover:bg-gray-50 active:scale-95 rounded-2xl p-4 gap-4 transition-all border border-gray-200 shadow-sm ${isUnavailable ? 'opacity-50 pointer-events-none' : 'cursor-pointer'}`}
      onClick={!showWebFallback ? handleBooking : undefined}>
      <div className="flex flex-col items-center gap-2">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg shadow-sm border ${brand.color}`}>{brand.name.charAt(0)}</div>
        <div className={`text-xs rounded-full px-2 py-0.5 border ${availability === 'available' ? 'bg-green-50 text-green-600 border-green-200' : availability === 'low' ? 'bg-amber-50 text-amber-600 border-amber-200' : 'bg-red-50 text-red-600 border-red-200'}`}>
          {availability === 'available' ? 'Available' : availability === 'low' ? 'Few drivers' : 'Unavailable'}
        </div>
      </div>
      {showWebFallback ? (
        <button onClick={() => window.open(webUrls[provider], '_blank')} className="w-full bg-blue-600 text-white text-xs font-semibold rounded-xl py-2.5">Open Web</button>
      ) : (
        <button disabled={isUnavailable} className="w-full bg-[#1C1D2B] text-white text-sm font-bold rounded-xl py-2.5 disabled:opacity-50">Book {brand.name}</button>
      )}
    </div>
  );
};

export default function RedirectScreen() {
  const fareRange = getFareRange(VENUE_VENUE_DATA.dropZoneLat, VENUE_VENUE_DATA.dropZoneLng, VENUE_VENUE_DATA.surgeMultiplier);
  const allLow = Object.values(VENUE_VENUE_DATA.cabAvailability).every(s => s === 'low' || s === 'unavailable');

  return (
    <div className="min-h-[100dvh] bg-gray-50 font-sans" data-testid="redirect-screen">
      <div className="max-w-md mx-auto min-h-[100dvh] bg-gray-50 flex flex-col items-center px-4 py-6 gap-5 sm:shadow-2xl">
        <div className="w-full flex items-center justify-between px-4 py-3 bg-red-600 rounded-xl text-white">
          <div className="text-sm font-bold">ParkEase</div>
          <div className="text-sm font-semibold bg-red-700/50 px-3 py-1 rounded-full border border-red-500/30">PARKING FULL</div>
        </div>
        <div className="w-full bg-red-50 border border-red-200 rounded-2xl p-6 text-center flex flex-col gap-3">
          <h1 className="text-2xl font-bold text-gray-900">Parking at {VENUE_DATA.venueDisplayName} is full</h1>
          <p className="text-sm text-red-500">Book a cab -- it's faster than finding street parking</p>
        </div>
        {VENUE_DATA.isSurgeActive ? (
          <div className="w-full bg-amber-50 border border-amber-300 rounded-xl px-4 py-3 flex items-start gap-3">
            <div className="mt-0.5 shrink-0"><AlertTriangle /></div>
            <p className="text-sm text-amber-700">Cab prices may be higher than usual ({VENUE_DATA.surgeMultiplier}x surge) -- still faster than finding parking</p>
          </div>
        ) : null}
        <div className="w-full bg-white border border-gray-200 shadow-sm rounded-xl px-5 py-4">
          <div className="text-xs text-gray-500 uppercase tracking-widest font-semibold mb-1">Estimated fare to venue</div>
          <div className="text-3xl font-bold text-gray-900">{'\u20B9'}{fareRange.low} - {'\u20B9'}{fareRange.high}</div>
          <div className="text-xs text-gray-400 mt-2">Actual fare set by the cab app at time of booking</div>
        </div>
        <div className="w-full grid grid-cols-3 gap-3">
          {['ola', 'uber', 'rapido'].map(p => (
            <CabProviderCard key={p} provider={p} availability={VENUE_DATA.cabAvailability[p]} dropZoneLat={VENUE_DATA.dropZoneLat} dropZoneLng={VENUE_DATA.dropZoneLng} dropZoneName={VENUE_DATA.dropZoneName} />
          ))}
        </div>
        <div className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 flex items-center gap-3">
          <div className="shrink-0 bg-gray-100 p-2 rounded-full"><MapPin /></div>
          <div className="flex flex-col min-w-0">
            <div className="text-xs text-gray-500 font-medium">Drop-off point</div>
            <div className="text-sm font-semibold text-gray-900 truncate">{VENUE_DATA.dropZoneName}</div>
          </div>
        </div>
        {allLow ? (
          <div className="w-full bg-white border border-gray-200 rounded-xl px-4 py-4 flex flex-col gap-2">
            <h3 className="text-sm font-semibold text-gray-900">Cabs are busy right now</h3>
            <p className="text-xs text-gray-500">Try again in 5 minutes or book from a nearby pickup point.</p>
          </div>
        ) : null}
        <div className="flex-1" />
        <div className="text-xs text-gray-400 bg-white border border-gray-200 px-3 py-1.5 rounded-full">
          Redirect tracking live in Phase 2
        </div>
      </div>
    </div>
  );
}