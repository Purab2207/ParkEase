import React from 'react';

// S8 — RCB Booking Confirmation
// Shown after S7 bay selection. No payment section — this is the retention flow.
// Mirrors S3 structure but with RCB dark/red branding.

// ----------------------------------------------------------------------------
// ICONS
// ----------------------------------------------------------------------------
const CheckCircleIcon = () => (
  <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const MapPinIcon = () => (
  <svg className="w-4 h-4 text-red-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const ClockIcon = () => (
  <svg className="w-4 h-4 text-amber-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const BellIcon = () => (
  <svg className="w-4 h-4 text-amber-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
  </svg>
);

const ExitIcon = () => (
  <svg className="w-4 h-4 text-purple-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
  </svg>
);

// ----------------------------------------------------------------------------
// COMPONENTS
// ----------------------------------------------------------------------------

const ConfirmationHeader = () => (
  <div className="flex flex-col items-center gap-2 pt-4 pb-2">
    <div className="w-16 h-16 bg-green-900/30 border border-green-700/40 rounded-full flex items-center justify-center">
      <CheckCircleIcon />
    </div>
    <h1 className="text-xl font-black text-white">You're in!</h1>
    <p className="text-sm text-gray-400 text-center">Parking secured for RCB vs MI · Chinnaswamy</p>
  </div>
);

const BookingCard = ({ bay, lot, window: arrivalWindow, bookingId }) => (
  <div className="w-full bg-gray-800 border border-red-800/30 rounded-2xl overflow-hidden">
    {/* RCB red accent */}
    <div className="h-1 bg-gradient-to-r from-red-700 via-red-500 to-red-700" />
    <div className="px-5 py-4 flex flex-col gap-3">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[10px] text-red-400 uppercase tracking-widest font-semibold mb-1">Booking confirmed</p>
          <p className="text-2xl font-black text-white">Bay {bay?.pillarCode}</p>
          <p className="text-sm text-gray-400">{lot?.label} · {lot?.distanceToGateMetres}m to {lot?.gateName}</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-gray-500 uppercase tracking-widest">Booking ID</p>
          <p className="text-xs font-mono text-gray-300 mt-0.5">{bookingId}</p>
        </div>
      </div>

      {/* Event details row */}
      <div className="flex flex-col gap-1.5 pt-1 border-t border-gray-700">
        <div className="flex items-center gap-2">
          <MapPinIcon />
          <span className="text-xs text-gray-300">M. Chinnaswamy Stadium, Bangalore</span>
        </div>
        <div className="flex items-center gap-2">
          <ClockIcon />
          <span className="text-xs text-gray-300">Sun, 4 May 2026 · 7:30 PM · Arrive {arrivalWindow}</span>
        </div>
      </div>
    </div>
  </div>
);

const QREntryPass = ({ bookingId }) => {
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(`PARKSEASE:${bookingId}`)}`;
  return (
    <div className="w-full bg-gray-800 border border-gray-700 rounded-2xl px-5 py-5 flex flex-col items-center gap-3">
      <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold">Your entry pass</p>
      <div className="bg-white rounded-xl p-3">
        <img src={qrUrl} alt="Entry QR" className="w-40 h-40" />
      </div>
      <p className="text-xs text-gray-500 text-center">Show this QR at the parking gate — no printout needed</p>
    </div>
  );
};

const InfoCards = ({ arrivalWindow }) => (
  <div className="w-full flex flex-col gap-2">
    <div className="flex items-start gap-3 bg-gray-800 border border-gray-700 rounded-xl px-4 py-3">
      <BellIcon />
      <div>
        <p className="text-xs font-semibold text-white">Departure reminder set</p>
        <p className="text-xs text-gray-400 mt-0.5">We'll notify you 90 mins before the match ends to beat the crowd</p>
      </div>
    </div>
    <div className="flex items-start gap-3 bg-gray-800 border border-gray-700 rounded-xl px-4 py-3">
      <ExitIcon />
      <div>
        <p className="text-xs font-semibold text-white">Arrive during your window</p>
        <p className="text-xs text-gray-400 mt-0.5">Your bay is held until {arrivalWindow?.split('–')[1] || 'end of window'} — arrive anytime within it</p>
      </div>
    </div>
  </div>
);

// ----------------------------------------------------------------------------
// MAIN SCREEN
// ----------------------------------------------------------------------------
export default function RCBConfirmationScreen({ bookingData, onDone }) {
  const { bay, lot, window: arrivalWindow } = bookingData || {};
  const bookingId = `PE-RCB-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

  return (
    <div className="min-h-[100dvh] bg-gray-950 font-sans pb-32">
      <div className="max-w-md mx-auto px-4 flex flex-col gap-4">

        {/* Header */}
        <ConfirmationHeader />

        {/* Booking card */}
        <BookingCard bay={bay} lot={lot} window={arrivalWindow} bookingId={bookingId} />

        {/* QR entry pass */}
        <QREntryPass bookingId={bookingId} />

        {/* Info cards */}
        <InfoCards arrivalWindow={arrivalWindow} />

        {/* Done CTA */}
        <button
          onClick={onDone}
          className="w-full mt-2 bg-white text-gray-900 font-bold text-base rounded-2xl py-4 active:scale-95 transition-transform shadow-lg"
        >
          Done
        </button>

        <p className="text-xs text-center text-gray-600 pb-4">Booking confirmed · ParkEase</p>

      </div>
    </div>
  );
}
