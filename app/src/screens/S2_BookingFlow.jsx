import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchEvent, fetchBays, createBooking, FALLBACK_EVENTS } from '../api';

// S2 — Parking Pre-Booking Flow
// React / Tailwind Implementation
// Pricing locked to Business Valuation: Standard IPL ₹169 (₹120 venue + ₹49 ParkEase fee)

// ----------------------------------------------------------------------------
// ICON PLACEHOLDERS
// ----------------------------------------------------------------------------
const ArrowLeftIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
  </svg>
);

const ChevronDownIcon = ({ open }) => (
  <svg className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);

const CheckIcon = () => (
  <svg className="w-5 h-5 text-green-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
  </svg>
);

const ShieldIcon = () => (
  <svg className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

const MapPinIcon = () => (
  <svg className="w-4 h-4 text-green-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const ClockIcon = () => (
  <svg className="w-4 h-4 text-gray-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const UsersIcon = () => (
  <svg className="w-4 h-4 text-gray-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

// Normalise API event → S2 shape
function normaliseEvent(e) {
  return {
    id: e.event_id,
    name: e.event_name,
    venue: `${e.venue}, ${e.city}`,
    date: e.date,
    eventTier: e.event_tier || 'Standard',
    consumerPrice: e.consumer_price,
    venueBaseRate: e.venue_base_rate || e.consumer_price - 49,
    parkEaseFee: e.park_ease_fee || 49,
    entryWindows: e.entry_windows || ['5:30–7:00 PM', '7:00–8:30 PM'],
    prohibitedItems: e.prohibited_items || [],
  };
}

const DEFAULT_EVENT = normaliseEvent(FALLBACK_EVENTS['karan-aujla-jln-2026']);

// JLN North Lot — 20 bays, pillar-based (B-series)
// ~35% taken to match MVP 35% fill rate target
const NORTH_LOT_BAYS = [
  { id: 'B-01', pillarCode: 'B-01', status: 'taken' },
  { id: 'B-02', pillarCode: 'B-02', status: 'available' },
  { id: 'B-03', pillarCode: 'B-03', status: 'available' },
  { id: 'B-04', pillarCode: 'B-04', status: 'taken' },
  { id: 'B-05', pillarCode: 'B-05', status: 'available' },
  { id: 'B-06', pillarCode: 'B-06', status: 'available' },
  { id: 'B-07', pillarCode: 'B-07', status: 'taken' },
  { id: 'B-08', pillarCode: 'B-08', status: 'available' },
  { id: 'B-09', pillarCode: 'B-09', status: 'available' },
  { id: 'B-10', pillarCode: 'B-10', status: 'taken' },
  { id: 'B-11', pillarCode: 'B-11', status: 'available' },
  { id: 'B-12', pillarCode: 'B-12', status: 'available' },
  { id: 'B-13', pillarCode: 'B-13', status: 'taken' },
  { id: 'B-14', pillarCode: 'B-14', status: 'available' },  // Arjun's bay from PRD
  { id: 'B-15', pillarCode: 'B-15', status: 'available' },
  { id: 'B-16', pillarCode: 'B-16', status: 'taken' },
  { id: 'B-17', pillarCode: 'B-17', status: 'available' },
  { id: 'B-18', pillarCode: 'B-18', status: 'available' },  // Rahul's bay from PRD
  { id: 'B-19', pillarCode: 'B-19', status: 'taken' },
  { id: 'B-20', pillarCode: 'B-20', status: 'available' },
];

// JLN South Lot — C-series
const SOUTH_LOT_BAYS = [
  { id: 'C-01', pillarCode: 'C-01', status: 'taken' },
  { id: 'C-02', pillarCode: 'C-02', status: 'available' },
  { id: 'C-03', pillarCode: 'C-03', status: 'taken' },
  { id: 'C-04', pillarCode: 'C-04', status: 'available' },
  { id: 'C-05', pillarCode: 'C-05', status: 'available' },
  { id: 'C-06', pillarCode: 'C-06', status: 'available' },
  { id: 'C-07', pillarCode: 'C-07', status: 'taken' },
  { id: 'C-08', pillarCode: 'C-08', status: 'available' },
  { id: 'C-09', pillarCode: 'C-09', status: 'available' },
  { id: 'C-10', pillarCode: 'C-10', status: 'taken' },
  { id: 'C-11', pillarCode: 'C-11', status: 'available' },
  { id: 'C-12', pillarCode: 'C-12', status: 'taken' },
  { id: 'C-13', pillarCode: 'C-13', status: 'available' },
  { id: 'C-14', pillarCode: 'C-14', status: 'available' },
  { id: 'C-15', pillarCode: 'C-15', status: 'available' },
];

const LOTS = [
  {
    id: 'north',
    label: 'North Lot',
    distanceToGateMetres: 180,
    gateName: 'Gate 2',
    bays: NORTH_LOT_BAYS,
  },
  {
    id: 'south',
    label: 'South Lot',
    distanceToGateMetres: 280,
    gateName: 'Gate 4',
    bays: SOUTH_LOT_BAYS,
  },
];

// ----------------------------------------------------------------------------
// SUB-COMPONENTS
// ----------------------------------------------------------------------------

const BookingHeader = ({ currentStep, onBack }) => (
  <div className="w-full flex items-center justify-between py-2">
    <button onClick={onBack} className="p-1.5 rounded-full hover:bg-gray-50 transition-colors text-gray-500 hover:text-gray-900">
      <ArrowLeftIcon />
    </button>
    <span className="text-base font-semibold text-gray-900">Book Parking</span>
    <span className="text-xs text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full border border-gray-200">
      Step {currentStep} of 5
    </span>
  </div>
);

const EventSummaryBar = ({ event }) => (
  <div className="w-full bg-white border border-gray-200 shadow-sm rounded-2xl px-4 py-3 flex flex-col gap-0.5">
    <div className="text-base font-bold text-gray-900">{event.name}</div>
    <div className="text-xs text-gray-500">{event.venue} · {event.date}</div>
  </div>
);

const InventoryScarcityBanner = ({ spotsRemaining, totalSpots }) => {
  const fillPercent = ((totalSpots - spotsRemaining) / totalSpots) * 100;
  const isAlmostFull = spotsRemaining <= 50;
  const isCritical = spotsRemaining <= 20;

  const containerClass = isCritical
    ? 'bg-red-50 border-red-200'
    : isAlmostFull
    ? 'bg-amber-50 border-amber-200'
    : 'bg-white border border-gray-200 shadow-sm';

  const countClass = isCritical
    ? 'text-red-600'
    : isAlmostFull
    ? 'text-amber-600'
    : 'text-gray-900';

  return (
    <div className={`w-full rounded-2xl px-5 py-4 flex flex-col gap-2 border ${containerClass}`}>
      <div className="flex items-end justify-between">
        <div>
          <span className={`text-2xl font-bold ${countClass}`}>{spotsRemaining}</span>
          <span className="text-sm text-gray-500 ml-1.5">spots left</span>
        </div>
        <span className="text-xs text-gray-400">of {totalSpots} total · live</span>
      </div>
      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-green-500 via-amber-500 to-red-500 transition-all duration-700"
          style={{ width: `${fillPercent}%` }}
        />
      </div>
      {isAlmostFull && (
        <p className="text-xs text-amber-600">
          Filling fast — book now to secure your bay
        </p>
      )}
    </div>
  );
};

const ProhibitedItemsBanner = ({ items, venueName }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="w-full bg-white border border-gray-200 shadow-sm rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full px-4 py-2.5 flex items-center justify-between text-left"
      >
        <span className="text-xs text-gray-500">⚠️ Venue entry rules — {venueName}</span>
        <ChevronDownIcon open={open} />
      </button>
      {open && (
        <ul className="px-4 pb-3 flex flex-col gap-1.5 border-t border-gray-200">
          {items.map((item, i) => (
            <li key={i} className="text-xs text-gray-400 flex items-start gap-1.5">
              <span className="mt-0.5 text-gray-400">•</span>{item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

// Step 2 — Bay Selection
const LotSectionTabs = ({ lots, selectedLotId, onSelect }) => (
  <div className="flex gap-2">
    {lots.map(lot => (
      <button
        key={lot.id}
        onClick={() => onSelect(lot.id)}
        className={`text-sm px-4 py-2 rounded-full font-medium transition-all ${
          selectedLotId === lot.id
            ? 'bg-[#1C1D2B] text-white font-semibold'
            : 'bg-gray-100 text-gray-500 hover:text-gray-900'
        }`}
      >
        {lot.label}
      </button>
    ))}
  </div>
);

const BayGrid = ({ bays, selectedBayId, onSelectBay }) => (
  <div className="w-full grid grid-cols-5 gap-2">
    {bays.map(bay => {
      const isSelected = bay.id === selectedBayId;
      const isTaken = bay.status === 'taken';
      return (
        <button
          key={bay.id}
          disabled={isTaken}
          onClick={() => !isTaken && onSelectBay(bay)}
          className={`rounded-lg p-2 text-center text-xs font-medium transition-all
            ${isTaken
              ? 'bg-white border border-gray-200 shadow-sm text-gray-400 line-through cursor-not-allowed'
              : isSelected
              ? 'bg-green-700 border border-green-500 text-white font-bold scale-105'
              : 'bg-gray-100 border border-gray-200 text-gray-700 hover:bg-green-50 hover:border-green-200 hover:text-gray-900 cursor-pointer active:scale-95'
            }`}
        >
          {bay.pillarCode}
        </button>
      );
    })}
  </div>
);

const SelectedBayCard = ({ bay, lot, onChangeBay }) => (
  <div className="w-full bg-green-50 border border-green-200 rounded-xl px-4 py-3 flex items-center gap-3">
    <CheckIcon />
    <div className="flex flex-col min-w-0">
      <div className="flex items-center gap-2">
        <span className="text-base font-bold text-gray-900">Bay {bay.pillarCode}</span>
        <span className="text-xs text-green-600 bg-green-900/50 px-2 py-0.5 rounded-full border border-green-200">
          Reserved
        </span>
      </div>
      <div className="text-xs text-green-600 mt-0.5">
        {lot.label} · {lot.distanceToGateMetres}m to {lot.gateName}
      </div>
    </div>
    <button onClick={onChangeBay} className="ml-auto text-xs text-gray-500 underline underline-offset-2 shrink-0 hover:text-gray-900 transition-colors">
      Change
    </button>
  </div>
);

const BaySelectionPanel = ({ lots, selectedLotId, selectedBay, onSelectLot, onSelectBay }) => {
  const activeLot = lots.find(l => l.id === selectedLotId) || lots[0];

  return (
    <div className="w-full flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-500 uppercase tracking-widest font-semibold">Select your bay</span>
        <div className="flex items-center gap-1 text-xs text-gray-400">
          <MapPinIcon />
          <span>{activeLot.distanceToGateMetres}m to gate</span>
        </div>
      </div>
      <LotSectionTabs lots={lots} selectedLotId={activeLot.id} onSelect={onSelectLot} />
      <BayGrid
        bays={activeLot.bays}
        selectedBayId={selectedBay?.id}
        onSelectBay={(bay) => onSelectBay(bay, activeLot)}
      />
      <div className="flex items-center gap-4 text-xs text-gray-400 px-1">
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-green-700 inline-block" />Available</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-white border border-gray-200 shadow-sm inline-block" />Taken</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-green-600 inline-block" />Your pick</span>
      </div>
      {selectedBay && (
        <SelectedBayCard
          bay={selectedBay}
          lot={activeLot}
          onChangeBay={() => onSelectBay(null, activeLot)}
        />
      )}
    </div>
  );
};

// Step 3 — Entry Time Window
const EntryTimeWindowPicker = ({ windows, selectedWindow, onSelect }) => (
  <div className="w-full flex flex-col gap-2">
    <div className="flex items-center gap-2">
      <ClockIcon />
      <span className="text-xs text-gray-500 uppercase tracking-widest font-semibold">Choose arrival window</span>
    </div>
    {windows.map(window => {
      const isSelected = selectedWindow === window;
      return (
        <button
          key={window}
          onClick={() => onSelect(window)}
          className={`w-full rounded-xl px-4 py-3 flex items-center justify-between transition-all
            ${isSelected
              ? 'bg-gray-100 border border-gray-900'
              : 'bg-white border border-gray-200 shadow-sm hover:border-gray-400'
            }`}
        >
          <div className="flex flex-col items-start gap-0.5">
            <span className="text-sm font-semibold text-gray-900">{window}</span>
            <span className="text-xs text-gray-400">Your spot is held until the window ends</span>
          </div>
          <div className={`w-4 h-4 rounded-full border-2 transition-all shrink-0 ${
            isSelected ? 'border-gray-900 bg-gray-900' : 'border-gray-200'
          }`} />
        </button>
      );
    })}
  </div>
);

// Step 4 — Pricing
const PriceTierDisplay = ({ venueBaseRate, parkEaseFee, consumerPrice, eventTier }) => (
  <div className="w-full flex flex-col gap-2">
    <span className="text-xs text-gray-400 uppercase tracking-widest">{eventTier}</span>
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-500">Venue parking base</span>
        <span className="text-sm text-gray-500">₹{venueBaseRate}</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-500">ParkEase service fee</span>
        <span className="text-sm text-gray-500">₹{parkEaseFee}</span>
      </div>
      <div className="w-full h-px bg-gray-200 my-1" />
      <div className="flex items-center justify-between">
        <span className="text-base font-bold text-gray-900">Total</span>
        <span className="text-lg font-bold text-gray-900">₹{consumerPrice}</span>
      </div>
    </div>
    <p className="text-xs text-gray-400">One-time payment · secured via UPI</p>
  </div>
);

const GroupSplitCalculator = ({ consumerPrice, groupSize, onGroupSizeChange }) => {
  const splitAmount = Math.ceil(consumerPrice / groupSize);
  return (
    <div className="w-full flex flex-col gap-2 pt-1">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <UsersIcon />
          <span className="text-xs text-gray-500">Splitting with a group?</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => groupSize > 1 && onGroupSizeChange(groupSize - 1)}
            disabled={groupSize <= 1}
            className="w-7 h-7 bg-gray-200 rounded-full flex items-center justify-center text-gray-900 font-bold disabled:opacity-30 hover:bg-gray-300 transition-colors"
          >
            −
          </button>
          <span className="text-sm text-gray-900 font-semibold w-4 text-center">{groupSize}</span>
          <button
            onClick={() => groupSize < 6 && onGroupSizeChange(groupSize + 1)}
            disabled={groupSize >= 6}
            className="w-7 h-7 bg-gray-200 rounded-full flex items-center justify-center text-gray-900 font-bold disabled:opacity-30 hover:bg-gray-300 transition-colors"
          >
            +
          </button>
        </div>
      </div>
      {groupSize > 1 && (
        <div className="w-full bg-green-50 border border-green-200 rounded-xl px-4 py-3 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xl font-bold text-green-600">₹{splitAmount} per person</span>
            <span className="text-xs text-gray-400 mt-0.5">
              UPI collect request sent to {groupSize} people after booking
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

const CancellationPolicyNotice = () => (
  <div className="w-full flex items-start gap-2 pt-1">
    <ShieldIcon />
    <p className="text-xs text-gray-400 leading-relaxed">
      Full refund if cancelled more than 24 hours before the event. No refund after that.
    </p>
  </div>
);

const PricingBreakdown = ({ event, groupSize, onGroupSizeChange }) => (
  <div className="w-full bg-white border border-gray-200 shadow-sm rounded-2xl px-5 py-4 flex flex-col gap-4">
    <PriceTierDisplay
      venueBaseRate={event.venueBaseRate}
      parkEaseFee={event.parkEaseFee}
      consumerPrice={event.consumerPrice}
      eventTier={event.eventTier}
    />
    <div className="w-full h-px bg-gray-200" />
    <GroupSplitCalculator
      consumerPrice={event.consumerPrice}
      groupSize={groupSize}
      onGroupSizeChange={onGroupSizeChange}
    />
    <CancellationPolicyNotice />
  </div>
);

// Step 5 — UPI Payment
const UPIPaymentButton = ({ consumerPrice, selectedBay, selectedWindow, contactPhoneValid, vehicleNoValid, isLoggedIn, isLoading, onPay, onOpenBaySelection }) => {
  const isDisabled = isLoading || (selectedBay && (!selectedWindow || !contactPhoneValid || !vehicleNoValid));

  const getLabel = () => {
    if (isLoading) return 'Processing...';
    if (!selectedBay) return 'Select a bay to continue';
    if (!selectedWindow) return 'Select arrival time to continue';
    if (!contactPhoneValid) return 'Enter contact number to continue';
    if (!vehicleNoValid) return 'Enter vehicle number to continue';
    if (!isLoggedIn) return 'Sign in to confirm booking';
    return `Pay ₹${consumerPrice} via UPI`;
  };

  const handleClick = () => {
    if (!selectedBay) { onOpenBaySelection?.(); return; }
    onPay();
  };

  return (
    <div className="w-full sticky bottom-4 mt-2">
      <button
        onClick={handleClick}
        disabled={isDisabled}
        className={`w-full font-bold text-base rounded-2xl py-4 transition-all shadow-lg shadow-black/40
          ${isDisabled
            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
            : 'bg-[#1C1D2B] text-white hover:bg-gray-800 tracking-wide uppercase active:scale-95 cursor-pointer'
          }`}
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="w-4 h-4 border-2 border-gray-400 border-t-gray-900 rounded-full animate-spin" />
            Processing...
          </span>
        ) : (
          getLabel()
        )}
      </button>
    </div>
  );
};

const BookingFooter = () => (
  <div className="w-full flex flex-col items-center gap-2 pb-8 pt-2">
    <div className="flex items-center gap-1.5 text-xs text-gray-400">
      <ShieldIcon />
      <span>Payments secured by UPI · Booking confirmed instantly</span>
    </div>
    <span className="text-xs text-gray-400">Used by 1,200+ people at JLN Stadium</span>
  </div>
);

// Step progress chip — collapsed summary of a completed step
const StepCompletedChip = ({ label, value, onClick }) => (
  <button
    onClick={onClick}
    className="w-full bg-white border border-gray-200 shadow-sm rounded-xl px-4 py-2.5 flex items-center justify-between hover:border-gray-400 transition-colors"
  >
    <span className="text-xs text-gray-400">{label}</span>
    <div className="flex items-center gap-2">
      <span className="text-sm font-semibold text-gray-900">{value}</span>
      <CheckIcon />
    </div>
  </button>
);

// ----------------------------------------------------------------------------
// MAIN SCREEN COMPONENT
// ----------------------------------------------------------------------------

export default function BookingFlowScreen({ userPhone, userEmail, isLoggedIn, onAuthRequired, onBookingComplete }) {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(2);

  // Event data — fetched from API, falls back to local data
  const [event, setEvent] = useState(DEFAULT_EVENT);
  const [spotsRemaining, setSpotsRemaining] = useState(47);
  const [totalSpots, setTotalSpots] = useState(500);

  // Bay grid — starts with hardcoded mock, overwritten with live Supabase statuses
  const [lots, setLots] = useState(LOTS);

  useEffect(() => {
    Promise.all([fetchEvent(eventId), fetchBays(eventId)]).then(([eventData, liveBays]) => {
      if (!eventData) return;
      setEvent(normaliseEvent(eventData));
      setSpotsRemaining(eventData.spots_remaining ?? 47);
      setTotalSpots(eventData.total_spots ?? 500);

      const eventLots = eventData.lots || [];
      if (liveBays && liveBays.length > 0 && eventLots.length > 0) {
        const built = eventLots.map(lot => ({
          id: lot.id,
          label: lot.name,
          distanceToGateMetres: lot.distance_m,
          gateName: lot.gate_name,
          bays: liveBays
            .filter(b => b.lot_id === lot.id)
            .map(b => ({ id: b.pillar_code, pillarCode: b.pillar_code, status: b.status === 'booked' ? 'taken' : 'available' })),
        }));
        if (built.length > 0) setLots(built);
      } else if (liveBays && liveBays.length > 0) {
        setLots(prev => prev.map(lot => ({
          ...lot,
          bays: lot.bays.map(bay => {
            const live = liveBays.find(b => b.pillar_code === bay.pillarCode && b.lot_id === lot.id);
            return live ? { ...bay, status: live.status === 'booked' ? 'taken' : 'available' } : bay;
          }),
        })));
      }
    }).catch(() => {});
  }, [eventId]);

  useEffect(() => {
    if (lots.length > 0 && !lots.find(l => l.id === selectedLotId)) {
      setSelectedLotId(lots[0].id);
    }
  }, [lots]);

  // Selections
  const [selectedLotId, setSelectedLotId] = useState('north');
  const [selectedBay, setSelectedBay] = useState(null);
  const [selectedLot, setSelectedLot] = useState(LOTS[0]);
  const [selectedWindow, setSelectedWindow] = useState(null);

  // Group split
  const [groupSize, setGroupSize] = useState(1);
  const [contactPhone, setContactPhone] = useState(userPhone || '');

  // Vehicle number — autofilled from profile if previously saved
  const [vehicleNo, setVehicleNo] = useState(() => {
    try { return localStorage.getItem('parkease_vehicle_no') || ''; } catch { return ''; }
  });
  const [vehicleAutofilled] = useState(() => {
    try { return !!localStorage.getItem('parkease_vehicle_no'); } catch { return false; }
  });

  const handleVehicleNoChange = (val) => {
    const formatted = val.toUpperCase().replace(/[^A-Z0-9 ]/g, '');
    setVehicleNo(formatted);
    try { localStorage.setItem('parkease_vehicle_no', formatted); } catch {}
  };

  // Payment
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentError, setPaymentError] = useState('');

  // Prohibited items banner
  const [prohibitedOpen, setProhibitedOpen] = useState(false);

  // Simulate one spot being taken every 45s (live counter feel for demo)
  useEffect(() => {
    const interval = setInterval(() => {
      setSpotsRemaining(prev => Math.max(prev - 1, 0));
    }, 45000);
    return () => clearInterval(interval);
  }, []);

  // Advance step when selections are made
  useEffect(() => {
    if (selectedBay && currentStep === 2) setCurrentStep(3);
  }, [selectedBay]);

  useEffect(() => {
    if (selectedWindow && currentStep === 3) setCurrentStep(4);
  }, [selectedWindow]);

  const handleSelectBay = (bay, lot) => {
    setSelectedBay(bay);
    setSelectedLot(lot);
  };

  const handleSelectLot = (lotId) => {
    setSelectedLotId(lotId);
    setSelectedBay(null); // clear selection on lot change
  };

  const handlePay = async () => {
    if (!selectedBay || !selectedWindow) return;
    if (!isLoggedIn) { onAuthRequired?.(); return; }
    setPaymentLoading(true);
    setPaymentError('');
    try {
      const booking = await createBooking({
        event_id: eventId,
        bay_id: selectedBay.pillarCode,
        lot_id: selectedLotId,
        phone: contactPhone,
        email: userEmail || '',
        entry_window: selectedWindow,
        vehicle_number: vehicleNo || null,
        group_size: groupSize,
      });
      setPaymentSuccess(true);
      onBookingComplete?.();
      navigate(`/confirmation/${booking.booking_id}`);
    } catch (err) {
      setPaymentError(err.message || 'Booking failed. Please try again.');
      setPaymentLoading(false);
    }
  };

  if (paymentSuccess) {
    return (
      <div className="min-h-[100dvh] bg-gray-50 flex flex-col items-center justify-center px-4 gap-4">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
          <CheckIcon />
        </div>
        <div className="text-xl font-bold text-gray-900">Booking confirmed!</div>
        <div className="text-sm text-gray-500 text-center">
          Bay {selectedBay?.pillarCode} · {selectedLot?.label}
        </div>
        <div className="text-xs text-gray-400 text-center max-w-xs">
          {/* In MVP this navigates to S3 automatically */}
          Loading your confirmation screen...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] bg-gray-50 font-sans sm:bg-gray-50">
      <div className="max-w-md mx-auto min-h-[100dvh] bg-gray-50 flex flex-col px-4 py-5 gap-4 pb-20 sm:shadow-2xl">

        {/* Header */}
        <BookingHeader currentStep={currentStep} onBack={() => navigate(`/events/${eventId}`)} />

        {/* Always visible — event context */}
        <EventSummaryBar event={event} />

        {/* Step 1 — Scarcity signal (always visible) */}
        <InventoryScarcityBanner
          spotsRemaining={spotsRemaining}
          totalSpots={totalSpots}
        />

        {/* Prohibited items — collapsible */}
        <ProhibitedItemsBanner
          items={event.prohibitedItems}
          venueName="JLN Stadium"
        />

        {/* Step 2 — Bay selection */}
        {currentStep >= 2 ? (
          <div className="w-full flex flex-col gap-3">
            <span className="text-xs text-gray-500 uppercase tracking-widest font-semibold">
              2 · Select your bay
            </span>
            {currentStep === 2 ? (
              <BaySelectionPanel
                lots={lots}
                selectedLotId={selectedLotId}
                selectedBay={selectedBay}
                onSelectLot={handleSelectLot}
                onSelectBay={handleSelectBay}
              />
            ) : selectedBay ? (
              <StepCompletedChip
                label="Bay selected"
                value={`${selectedBay.pillarCode} · ${selectedLot?.label}`}
                onClick={() => setCurrentStep(2)}
              />
            ) : null}
          </div>
        ) : null}

        {/* Step 3 — Time window (visible once bay selected) */}
        {selectedBay && (
          <div className="w-full flex flex-col gap-3">
            <button
              onClick={() => setCurrentStep(3)}
              className="text-xs text-gray-500 uppercase tracking-widest font-semibold text-left"
            >
              3 · Choose arrival window
            </button>
            {currentStep === 3 ? (
              <EntryTimeWindowPicker
                windows={event.entryWindows}
                selectedWindow={selectedWindow}
                onSelect={(w) => { setSelectedWindow(w); }}
              />
            ) : selectedWindow ? (
              <StepCompletedChip
                label="Arrival window"
                value={selectedWindow}
                onClick={() => setCurrentStep(3)}
              />
            ) : null}
          </div>
        )}

        {/* Step 4 — Pricing (visible once window selected) */}
        {selectedWindow && (
          <div className="w-full flex flex-col gap-3">
            <span className="text-xs text-gray-500 uppercase tracking-widest font-semibold">
              4 · Review & pricing
            </span>
            <PricingBreakdown
              event={event}
              groupSize={groupSize}
              onGroupSizeChange={setGroupSize}
            />
          </div>
        )}

        {/* Step 4b — Contact number for QR delivery */}
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

        {/* Step 4c — Vehicle number */}
        {selectedWindow && (
          <div className="w-full flex flex-col gap-2">
            <span className="text-xs text-gray-500 uppercase tracking-widest font-semibold">
              4c · Vehicle number
            </span>
            <div className="w-full bg-white border border-gray-200 shadow-sm rounded-2xl px-4 py-3 flex flex-col gap-2">
              <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden focus-within:border-gray-400">
                <input
                  type="text"
                  maxLength={13}
                  value={vehicleNo}
                  onChange={(e) => handleVehicleNoChange(e.target.value)}
                  placeholder="e.g. DL 3C AB 1234"
                  className="flex-1 px-3 py-3 outline-none text-sm text-gray-900 bg-white font-mono tracking-wider uppercase"
                />
                {vehicleNo.length >= 6 && (
                  <div className="px-3 text-xs text-green-600 font-semibold shrink-0">✓</div>
                )}
              </div>
              {vehicleAutofilled && vehicleNo.length >= 6 ? (
                <p className="text-xs text-blue-600 font-medium flex items-center gap-1">
                  <span>⚡</span> Autofilled from your profile
                </p>
              ) : (
                <p className="text-xs text-gray-400">
                  Used by the attendant to verify your car at the gate · saved to your profile
                </p>
              )}
            </div>
          </div>
        )}

        {/* Step 5 — UPI Payment (sticky) */}
        {paymentError && (
          <p className="text-red-600 text-sm text-center px-2">{paymentError}</p>
        )}
        <UPIPaymentButton
          consumerPrice={event.consumerPrice}
          selectedBay={selectedBay}
          selectedWindow={selectedWindow}
          contactPhoneValid={contactPhone.length === 10}
          vehicleNoValid={vehicleNo.length >= 6}
          isLoggedIn={isLoggedIn}
          isLoading={paymentLoading}
          onPay={handlePay}
          onOpenBaySelection={() => setCurrentStep(2)}
        />

        <BookingFooter />

      </div>
    </div>
  );
}
