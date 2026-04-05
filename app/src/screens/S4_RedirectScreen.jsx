import React, { useState, useEffect } from 'react';

// S4 — Parking Full → Cab Redirect Screen
// React / Tailwind Component Tree Implementation

// ----------------------------------------------------------------------------
// ICON PLACEHOLDERS (Replace with lucide-react or your preferred icon library)
// ----------------------------------------------------------------------------
const AlertTriangle = () => (
  <svg className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>
);

const MapPin = () => (
  <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const XIcon = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const ArrowLeftIcon = () => (
  <svg className="w-4 h-4 inline-block mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
  </svg>
);


// ----------------------------------------------------------------------------
// SUB-COMPONENTS
// ----------------------------------------------------------------------------

const RedirectHeader = () => (
  <div className="w-full flex items-center justify-between px-4 py-3 bg-red-600 rounded-xl text-white">
    <div className="text-sm font-bold tracking-tight">ParkEase</div>
    <div className="text-sm font-semibold tracking-wide bg-red-700/50 px-3 py-1 rounded-full border border-red-500/30">
      🔴 PARKING FULL
    </div>
    <button aria-label="Close" className="p-1 hover:bg-red-700 rounded-full transition-colors">
      <XIcon />
    </button>
  </div>
);

const ParkingFullBanner = ({ venueDisplayName }) => (
  <div className="w-full bg-red-50 border border-red-200 rounded-2xl p-6 text-center flex flex-col gap-3">
    <h1 className="text-2xl font-bold text-gray-900">
      Parking at {venueDisplayName} is full
    </h1>
    <p className="text-sm text-red-500">
      Book a cab — it's faster than finding street parking
    </p>
    <p className="text-xs text-gray-500 italic">
      Redirected users arrived before drivers at the last 3 events
    </p>
  </div>
);

const SurgePricingWarning = ({ surgeMultiplier }) => (
  <div className="w-full bg-amber-50 border border-amber-300 rounded-xl px-4 py-3 flex items-start gap-3">
    <div className="mt-0.5 shrink-0"><AlertTriangle /></div>
    <p className="text-sm text-amber-700 leading-snug">
      Cab prices may be higher than usual right now ({surgeMultiplier}x surge) — this is still faster than finding parking in the area
    </p>
  </div>
);

const EstimatedFareDisplay = ({ fareRangeLow, fareRangeHigh, isSurgeActive }) => (
  <div className="w-full bg-gray-900 border border-gray-800 rounded-xl px-5 py-4 flex flex-col gap-1">
    <div className="text-xs text-red-400 uppercase tracking-widest font-semibold mb-1">
      Estimated fare to venue
    </div>
    <div className="text-3xl font-bold text-white">
      ₹{fareRangeLow} – ₹{fareRangeHigh}
    </div>
    {isSurgeActive && (
      <div className="text-xs text-amber-600 font-medium mt-1">
        Includes surge pricing
      </div>
    )}
    <div className="text-xs text-gray-400 mt-2">
      Actual fare set by the cab app at time of booking
    </div>
  </div>
);

const CabProviderCard = ({ provider, availability, dropZoneLat, dropZoneLng, dropZoneName }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showWebFallback, setShowWebFallback] = useState(false);

  const getProviderBrandInfo = () => {
    switch(provider) {
      case 'ola': return { name: 'Ola', color: 'bg-lime-500' };
      case 'uber': return { name: 'Uber', color: 'bg-black text-white border-gray-600' };
      case 'rapido': return { name: 'Rapido', color: 'bg-yellow-400 text-black' };
      default: return { name: provider, color: 'bg-white' };
    }
  };

  const brandInfo = getProviderBrandInfo();

  const getBadgeStyle = () => {
    if (availability === 'available') return "bg-green-50 text-green-600 text-xs rounded-full px-2 py-0.5 border border-green-200";
    if (availability === 'low') return "bg-amber-50 text-amber-600 text-xs rounded-full px-2 py-0.5 border border-amber-200";
    return "bg-red-50 text-red-600 text-xs rounded-full px-2 py-0.5 border border-red-200";
  };

  const getBadgeText = () => {
    if (availability === 'available') return "Available";
    if (availability === 'low') return "Few drivers";
    return "Unavailable";
  };

  const isUnavailable = availability === 'unavailable';

  const buildDeepLink = () => {
    const encodedName = encodeURIComponent(dropZoneName);
    switch (provider) {
      case 'ola':
        return `olacabs://book?lat=${dropZoneLat}&lng=${dropZoneLng}&drop_name=${encodedName}`;
      case 'uber':
        return `uber://?action=setPickup&dropoff[latitude]=${dropZoneLat}&dropoff[longitude]=${dropZoneLng}&dropoff[nickname]=${encodedName}`;
      case 'rapido':
        return `rapido://book?dest_lat=${dropZoneLat}&dest_lng=${dropZoneLng}&dest_name=${encodedName}`;
      default:
        return null;
    }
  };

  const getWebFallbackUrl = () => {
    switch (provider) {
      case 'ola':
        return 'https://book.olacabs.com';
      case 'uber':
        return 'https://m.uber.com/ul/';
      case 'rapido':
        return 'https://rapido.bike';
      default:
        return null;
    }
  };

  const tryDeepLink = (uri, webFallbackUrl) => {
    // Fire deep link directly — mobile OS intercepts and opens the app
    // If app not installed, browser stays on current page (no redirect)
    window.location.href = uri;

    // After 1500ms, if we are still here, app likely not installed — show web fallback
    setTimeout(() => {
      setShowWebFallback(true);
      setIsLoading(false);
    }, 1500);
  };

  const handleBooking = () => {
    if (isUnavailable) return;
    setIsLoading(true);
    const deepLink = buildDeepLink();
    const webFallbackUrl = getWebFallbackUrl();

    if (deepLink) {
      tryDeepLink(deepLink, webFallbackUrl);
    } else {
      setShowWebFallback(true);
      setIsLoading(false);
    }
  };

  const handleWebFallback = () => {
    const webFallbackUrl = getWebFallbackUrl();
    if (webFallbackUrl) {
      window.open(webFallbackUrl, '_blank');
    }
  };

  return (
    <div className={`flex flex-col items-center justify-between bg-gray-900 hover:bg-gray-800 active:scale-95 rounded-2xl p-4 gap-4 transition-all border border-gray-800 ${isUnavailable ? 'opacity-50 pointer-events-none' : 'cursor-pointer'}`} onClick={!showWebFallback ? handleBooking : undefined}>
      <div className="flex flex-col items-center gap-2">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg shadow-sm border ${brandInfo.color}`}>
          {brandInfo.name.charAt(0)}
        </div>
        <div className={getBadgeStyle()}>
          {getBadgeText()}
        </div>
      </div>

      {showWebFallback ? (
        <button
          onClick={handleWebFallback}
          className="w-full bg-blue-600 text-white text-xs font-semibold rounded-xl py-2.5 transition-colors hover:bg-blue-700"
        >
          Open Web
        </button>
      ) : (
        <button
          disabled={isUnavailable || isLoading}
          className="w-full bg-red-600 hover:bg-red-500 text-white text-sm font-bold rounded-xl py-2.5 transition-opacity disabled:opacity-50"
        >
          {isLoading ? '...' : `Book ${brandInfo.name}`}
        </button>
      )}
    </div>
  );
};

const CabOptionsGrid = ({ cabAvailability, dropZoneLat, dropZoneLng, dropZoneName }) => (
  <div className="w-full grid grid-cols-3 gap-3">
    {['ola', 'uber', 'rapido'].map((provider) => (
      <CabProviderCard
        key={provider}
        provider={provider}
        availability={cabAvailability[provider] || 'unavailable'}
        dropZoneLat={dropZoneLat}
        dropZoneLng={dropZoneLng}
        dropZoneName={dropZoneName}
      />
    ))}
  </div>
);

const DropZoneInfo = ({ dropZoneName }) => (
  <div className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 flex items-center gap-3">
    <div className="shrink-0 bg-gray-100 p-2 rounded-full">
      <MapPin />
    </div>
    <div className="flex flex-col min-w-0">
      <div className="text-xs text-gray-500 font-medium">Drop-off point</div>
      <div className="text-sm font-semibold text-gray-900 truncate">{dropZoneName}</div>
      <div className="text-xs text-gray-400 mt-0.5">Pre-filled in all three cab apps</div>
    </div>
  </div>
);

const AvailabilityFallbackNotice = () => (
  <div className="w-full bg-white border border-gray-200 rounded-xl px-4 py-4 flex flex-col gap-2 relative overflow-hidden">
    <div className="absolute top-0 right-0 w-2 h-full bg-red-500 rounded-r-xl"></div>
    <h3 className="text-sm font-semibold text-gray-900">Cabs are busy right now</h3>
    <p className="text-xs text-gray-500 leading-relaxed max-w-[90%]">
      Try again in 5 minutes or book from a nearby pickup point.
    </p>
    <div className="mt-2 flex items-center justify-between">
      <button className="text-sm text-blue-600 font-medium underline underline-offset-2">
        View nearby pickup points
      </button>
      <span className="text-xs text-gray-400 font-mono">Refresh in 0:45</span>
    </div>
  </div>
);

const RedirectFooter = () => {
  return (
    <div className="w-full flex flex-col items-center gap-4 py-4 pb-8">
      <div className="text-xs text-gray-400 bg-gray-900 border border-gray-800 px-3 py-1.5 rounded-full">
        Redirect tracking live from Event 1 onwards
      </div>

      <details className="group [&_summary::-webkit-details-marker]:hidden w-full max-w-sm">
        <summary className="flex items-center justify-center cursor-pointer text-xs text-gray-500 hover:text-gray-700 transition-colors">
          How is this faster?
        </summary>
        <div className="mt-3 text-xs text-gray-400 text-center bg-gray-900 p-3 rounded-lg border border-gray-800">
          Street parking near the venue is completely full. Factoring in gridlock and walking time, a cab drop-off right at the gate saves you roughly 25-40 minutes based on real-time data.
        </div>
      </details>

      <button className="text-sm text-gray-400 hover:text-gray-900 transition-colors flex items-center mt-2 group">
        <ArrowLeftIcon />
        <span className="underline underline-offset-4 decoration-gray-300 group-hover:decoration-gray-500 transition-colors">Back to event page</span>
      </button>
    </div>
  );
};


// ----------------------------------------------------------------------------
// MAIN SCREEN COMPONENT
// ----------------------------------------------------------------------------

// Helper function for distance-based fare calculation
const getFareRange = (lat, lng, surgeMultiplier = 1) => {
  const venueLat = 28.6139;
  const venueLng = 77.2090;
  const R = 6371;
  const dLat = (lat - venueLat) * Math.PI / 180;
  const dLng = (lng - venueLng) * Math.PI / 180;
  const a = Math.sin(dLat/2) ** 2 +
    Math.cos(venueLat * Math.PI / 180) *
    Math.cos(lat * Math.PI / 180) *
    Math.sin(dLng/2) ** 2;
  const km = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  let low, high;
  if (km <= 5)       { low = 80;  high = 140; }
  else if (km <= 15) { low = 150; high = 280; }
  else               { low = 290; high = 450; }

  return {
    low:  Math.round(low  * surgeMultiplier),
    high: Math.round(high * surgeMultiplier),
  };
};

export default function RedirectScreen() {
  // Simulated initial state fetching
  const MOCK_REDIRECT_DATA = {
    venueDisplayName: "Chinnaswamy Stadium, Bangalore",
    dropZoneName: "Drop Zone A, near Gate 4",
    dropZoneLat: 12.9793,
    dropZoneLng: 77.5996,
    isSurgeActive: true,
    surgeMultiplier: 1.8,
    cabAvailability: {
      ola: 'available',
      uber: 'low',
      rapido: 'available'
    }
  };

  // Calculate fare based on distance
  const fareRange = getFareRange(
    MOCK_REDIRECT_DATA.dropZoneLat,
    MOCK_REDIRECT_DATA.dropZoneLng,
    MOCK_REDIRECT_DATA.surgeMultiplier
  );

  const [data, setData] = useState({
    ...MOCK_REDIRECT_DATA,
    fareRangeLow: fareRange.low,
    fareRangeHigh: fareRange.high,
    loading: true
  });

  // Derived state
  const allPlatformsLow = Object.values(data.cabAvailability).every(
    status => status === 'low' || status === 'unavailable'
  );

  // Simulate API fetch on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setData(prev => ({ ...prev, loading: false }));
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  if (data.loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center text-gray-400">
        <div className="animate-pulse flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-t-red-500 animate-spin"></div>
          Checking availability...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] bg-gray-950 font-sans">
      {/* Container to restrict max width on desktop, full width on mobile */}
      <div className="max-w-md mx-auto min-h-[100dvh] bg-gray-950 flex flex-col items-center px-4 py-6 sm:py-8 gap-5 relative sm:shadow-2xl">

        <RedirectHeader />

        <ParkingFullBanner venueDisplayName={data.venueDisplayName} />

        {data.isSurgeActive && (
          <SurgePricingWarning surgeMultiplier={data.surgeMultiplier} />
        )}

        <EstimatedFareDisplay
          fareRangeLow={data.fareRangeLow}
          fareRangeHigh={data.fareRangeHigh}
          isSurgeActive={data.isSurgeActive}
        />

        <CabOptionsGrid
          cabAvailability={data.cabAvailability}
          dropZoneLat={data.dropZoneLat}
          dropZoneLng={data.dropZoneLng}
          dropZoneName={data.dropZoneName}
        />

        <DropZoneInfo dropZoneName={data.dropZoneName} />

        {allPlatformsLow && (
          <AvailabilityFallbackNotice />
        )}

        {/* Spacer before footer */}
        <div className="flex-1" />

        <RedirectFooter />

      </div>
    </div>
  );
}
