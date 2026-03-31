import React, { useState } from 'react';

// S3 — Booking Confirmation Screen
// React / Tailwind Implementation
// PRD sources: Arjun Stage 2, Rahul Stage 4, Priya Stage 2
// Confirmation must be clean enough to serve as social proof in WhatsApp group chat

// ----------------------------------------------------------------------------
// ICONS
// ----------------------------------------------------------------------------
const CheckCircleIcon = () => (
  <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const MapPinIcon = () => (
  <svg className="w-4 h-4 text-blue-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const ClockIcon = () => (
  <svg className="w-4 h-4 text-amber-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
  </svg>
);

const ShieldIcon = () => (
  <svg className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

const BellIcon = () => (
  <svg className="w-4 h-4 text-amber-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
  </svg>
);

const ExitIcon = () => (
  <svg className="w-4 h-4 text-purple-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
  </svg>
);

const WhatsAppIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

// ----------------------------------------------------------------------------
// MOCK QR CODE — visual placeholder for demo
// Represents the unique booking QR scanned by attendant at gate
// In MVP: generated server-side from bookingId using qrcode library
// ----------------------------------------------------------------------------
const MockQRCode = ({ bookingId }) => {
  // Deterministic pixel grid seeded from bookingId for visual variety
  const seed = bookingId.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const grid = Array.from({ length: 11 }, (_, r) =>
    Array.from({ length: 11 }, (_, c) => {
      // Always fill corners (finder patterns)
      if ((r < 3 && c < 3) || (r < 3 && c > 7) || (r > 7 && c < 3)) return true;
      return ((seed * (r + 1) * (c + 1) * 31) % 7) > 3;
    })
  );

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="bg-white p-3 rounded-2xl shadow-lg shadow-black/30">
        <div className="grid gap-0.5" style={{ gridTemplateColumns: 'repeat(11, 1fr)', width: 132 }}>
          {grid.map((row, r) =>
            row.map((filled, c) => (
              <div
                key={`${r}-${c}`}
                className={`w-3 h-3 rounded-sm ${filled ? 'bg-gray-900' : 'bg-white'}`}
              />
            ))
          )}
        </div>
      </div>
      <div className="text-xs text-gray-400 font-mono tracking-widest">
        #{bookingId.slice(-8).toUpperCase()}
      </div>
      <p className="text-xs text-gray-400 text-center max-w-[200px]">
        Show this to the attendant at the parking gate
      </p>
    </div>
  );
};

// ----------------------------------------------------------------------------
// SUB-COMPONENTS
// ----------------------------------------------------------------------------

const ConfirmationHeader = ({ bookingId }) => (
  <div className="w-full flex flex-col items-center gap-2 pt-2 pb-1">
    <div className="w-16 h-16 bg-green-50 border border-green-200 rounded-full flex items-center justify-center">
      <CheckCircleIcon />
    </div>
    <h1 className="text-xl font-bold text-gray-900">Booking Confirmed</h1>
    <p className="text-xs text-gray-400 font-mono">
      Booking ID · #{bookingId.slice(-8).toUpperCase()}
    </p>
  </div>
);

// Clean summary card — must survive a WhatsApp screenshot (PRD: shareability requirement)
const BookingSummaryCard = ({ booking }) => (
  <div className="w-full bg-white border border-gray-200 shadow-md rounded-2xl px-5 py-4 flex flex-col gap-3">
    {/* Event */}
    <div className="flex flex-col gap-0.5 pb-3 border-b border-gray-200">
      <span className="text-base font-bold text-gray-900">{booking.eventName}</span>
      <span className="text-xs text-gray-500">{booking.venue} · {booking.date}</span>
    </div>

    {/* Bay */}
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center shrink-0">
        <MapPinIcon />
      </div>
      <div className="flex flex-col">
        <span className="text-sm font-bold text-gray-900">Bay {booking.bayPillarCode}</span>
        <span className="text-xs text-gray-500">{booking.lotName} · {booking.distanceToGateMetres}m to {booking.gateName}</span>
      </div>
    </div>

    {/* Entry window */}
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center shrink-0">
        <ClockIcon />
      </div>
      <div className="flex flex-col">
        <span className="text-sm font-semibold text-gray-900">Arrive {booking.entryWindow}</span>
        <span className="text-xs text-gray-500">Your bay is held within this window</span>
      </div>
    </div>

    {/* Price paid */}
    <div className="flex items-center justify-between pt-2 border-t border-gray-200">
      <span className="text-xs text-gray-400">Amount paid</span>
      <span className="text-sm font-bold text-gray-900">₹{booking.consumerPrice} via UPI</span>
    </div>
  </div>
);

// PRD: "booking confirmation must be clean enough to serve as social proof in group chat"
const WhatsAppShareBlock = ({ booking, groupSize, splitAmount }) => {
  const waText = [
    `📍 ParkEase — Parking Confirmed`,
    ``,
    `• Event: ${booking.eventName}`,
    `• Date: ${booking.date}`,
    `• Parking: Bay ${booking.bayPillarCode}, ${booking.lotName}`,
    `• Departure: Leave by ${booking.departureNudgeTime}`,
    groupSize > 1 ? `• Split: ₹${splitAmount} per person (${groupSize} people)` : null,
    ``,
    `Book your spot: https://parksease.in/book/${booking.eventId}`,
  ]
    .filter(line => line !== null)
    .join('\n');

  const waUrl = `https://wa.me/?text=${encodeURIComponent(waText)}`;

  return (
    <div className="w-full flex flex-col gap-3">
      <span className="text-xs text-gray-500 uppercase tracking-widest font-semibold">
        Share with your group
      </span>
      {/* Preview of the message — matches PRD's exact format */}
      <div className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3">
        <pre className="text-xs text-gray-700 whitespace-pre-wrap font-sans leading-relaxed">
          {waText}
        </pre>
      </div>
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full bg-green-600 hover:bg-green-500 active:scale-95 text-white font-bold text-sm rounded-2xl py-3.5 flex items-center justify-center gap-2 transition-all"
      >
        <WhatsAppIcon />
        Forward to Group
      </a>
    </div>
  );
};

// PRD Stage 4 — UPI collect requests after booking confirmation
// MVP = single payer + post-booking UPI split request (V2 = escrow)
const UPISplitBlock = ({ consumerPrice, groupSize, onGroupSizeChange }) => {
  const [splitSent, setSplitSent] = useState(false);
  const splitAmount = Math.ceil(consumerPrice / groupSize);

  const handleSendSplit = () => {
    // PLACEHOLDER — UPI collect request (Razorpay / PhonePe collect API in MVP)
    // Generates individual ₹{splitAmount} UPI collect requests to selected contacts
    setTimeout(() => setSplitSent(true), 800);
  };

  if (splitSent) {
    return (
      <div className="w-full bg-green-50 border border-green-200 rounded-xl px-4 py-3 flex items-center gap-3">
        <span className="text-green-600 text-lg">✓</span>
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-gray-900">UPI requests sent</span>
          <span className="text-xs text-gray-500">
            ₹{splitAmount} collect request sent to {groupSize - 1} people
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-3">
      <span className="text-xs text-gray-500 uppercase tracking-widest font-semibold">
        Collect your share
      </span>
      <div className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-700">Split ₹{consumerPrice} with</span>
          <div className="flex items-center gap-3">
            <button
              onClick={() => groupSize > 1 && onGroupSizeChange(groupSize - 1)}
              disabled={groupSize <= 1}
              className="w-7 h-7 bg-gray-200 rounded-full flex items-center justify-center text-gray-900 font-bold disabled:opacity-30 hover:bg-gray-300 transition-colors"
            >−</button>
            <span className="text-sm font-semibold text-gray-900 w-5 text-center">{groupSize}</span>
            <button
              onClick={() => groupSize < 6 && onGroupSizeChange(groupSize + 1)}
              disabled={groupSize >= 6}
              className="w-7 h-7 bg-gray-200 rounded-full flex items-center justify-center text-gray-900 font-bold disabled:opacity-30 hover:bg-gray-300 transition-colors"
            >+</button>
          </div>
        </div>
        {groupSize > 1 && (
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400">Per person</span>
            <span className="text-lg font-bold text-green-600">₹{splitAmount}</span>
          </div>
        )}
      </div>
      {groupSize > 1 && (
        <button
          onClick={handleSendSplit}
          className="w-full bg-gray-100 hover:bg-gray-200 border border-gray-300 text-gray-900 font-semibold text-sm rounded-2xl py-3 flex items-center justify-center gap-2 active:scale-95 transition-all"
        >
          Send UPI Collect Request · ₹{splitAmount} × {groupSize - 1} people
        </button>
      )}
    </div>
  );
};

// PRD: pre-event push notification nudge
// In prototype shown as an in-screen card — actual push notification in MVP
const DepartureNudgeCard = ({ departureTime, bayPillarCode }) => (
  <div className="w-full bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 flex items-start gap-3">
    <div className="mt-0.5">
      <BellIcon />
    </div>
    <div className="flex flex-col gap-0.5">
      <span className="text-sm font-semibold text-gray-900">We'll remind you to leave by {departureTime}</span>
      <span className="text-xs text-amber-600/70">
        "Bay {bayPillarCode} confirmed. Leave by {departureTime} for smooth arrival. Tap for directions."
      </span>
      <span className="text-xs text-gray-400 mt-1">Push notification — sent 90 mins before event</span>
    </div>
  </div>
);

// PRD: static section-based exit guidance — MVP
// V2 = dynamic Google Maps routing once venue traffic patterns established
const ExitGuidanceCard = ({ exitGate, exitSection, estimatedMinutes }) => (
  <div className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 flex items-start gap-3">
    <div className="mt-0.5">
      <ExitIcon />
    </div>
    <div className="flex flex-col gap-0.5">
      <span className="text-sm font-semibold text-gray-900">Post-event exit · {exitGate}</span>
      <span className="text-xs text-gray-500">
        From {exitSection} → follow signs to {exitGate} · est. {estimatedMinutes} mins to clear
      </span>
      <span className="text-xs text-gray-400 mt-1">
        Static exit guidance · pre-configured for this venue (MVP)
      </span>
    </div>
  </div>
);

// PRD: cancellation policy visible on confirmation screen
const CancellationPolicyBar = ({ eventDate }) => (
  <div className="w-full flex items-start gap-2 px-1">
    <ShieldIcon />
    <p className="text-xs text-gray-400 leading-relaxed">
      Full refund available if cancelled before {eventDate} (24hrs prior). No refund after that.
    </p>
  </div>
);

const DirectionsButton = ({ gateName, venueName }) => (
  <button className="w-full bg-blue-50 border border-blue-200 hover:bg-blue-100 text-blue-600 font-semibold text-sm rounded-2xl py-3 flex items-center justify-center gap-2 active:scale-95 transition-all">
    <MapPinIcon />
    Get directions to {gateName} — {venueName}
    <ArrowRightIcon />
    {/* PLACEHOLDER — in MVP deep-links to Google Maps with parking gate coordinates */}
  </button>
);

// ----------------------------------------------------------------------------
// MAIN SCREEN COMPONENT
// ----------------------------------------------------------------------------

export default function BookingConfirmationScreen({ bookingId = 'pe-2026-karan-aujla-b18' }) {

  // In MVP these values arrive as route params from S2 (navigate('/confirmation/:bookingId'))
  const booking = {
    bookingId,
    eventId: 'karan-aujla-jln-2026',
    eventName: 'Karan Aujla',
    venue: 'Jawaharlal Nehru Stadium, Delhi',
    date: 'Sat, 12 Apr 2026',
    bayPillarCode: 'B-18',         // Rahul's bay — exact value from PRD narrative
    lotName: 'JLN North Lot',
    distanceToGateMetres: 180,
    gateName: 'Gate 2',
    entryWindow: '5:30–7:00 PM',
    departureNudgeTime: '6:00 PM',  // PRD: "Leave by 6:00 PM" from Rahul's journey
    consumerPrice: 169,             // Business Valuation: Standard IPL tier
    exitGate: 'Gate C',             // PRD: "Exit via Gate C" from Arjun's journey
    exitSection: 'Section B',
    exitEstimatedMins: 12,
    cancellationDeadline: 'Fri, 11 Apr 2026',
  };

  const [groupSize, setGroupSize] = useState(5); // PRD demo: Rahul's group of 5
  const splitAmount = Math.ceil(booking.consumerPrice / groupSize);

  return (
    <div className="min-h-[100dvh] bg-gray-50 font-sans sm:bg-gray-50">
      <div className="max-w-md mx-auto min-h-[100dvh] bg-gray-50 flex flex-col px-4 py-6 gap-5 sm:shadow-2xl">

        {/* Confirmation header */}
        <ConfirmationHeader bookingId={booking.bookingId} />

        {/* QR Code — shown to attendant at gate */}
        <MockQRCode bookingId={booking.bookingId} />

        {/* Clean booking summary — PRD: must survive WhatsApp screenshot */}
        <BookingSummaryCard booking={booking} />

        {/* Directions CTA */}
        <DirectionsButton gateName={booking.gateName} venueName="JLN Stadium" />

        {/* Departure nudge card — PRD: congestion management feature */}
        <DepartureNudgeCard
          departureTime={booking.departureNudgeTime}
          bayPillarCode={booking.bayPillarCode}
        />

        {/* WhatsApp forward — PRD: wa.me/?text= with bullet-point pre-fill */}
        <WhatsAppShareBlock
          booking={booking}
          groupSize={groupSize}
          splitAmount={splitAmount}
        />

        {/* UPI split — PRD: post-booking UPI collect request, MVP single-payer */}
        <UPISplitBlock
          consumerPrice={booking.consumerPrice}
          groupSize={groupSize}
          onGroupSizeChange={setGroupSize}
        />

        {/* Exit guidance — PRD: static section-based, V2 = dynamic Google Maps */}
        <ExitGuidanceCard
          exitGate={booking.exitGate}
          exitSection={booking.exitSection}
          estimatedMinutes={booking.exitEstimatedMins}
        />

        {/* Cancellation policy */}
        <CancellationPolicyBar eventDate={booking.cancellationDeadline} />

        {/* Footer spacer */}
        <div className="pb-6" />

      </div>
    </div>
  );
}
