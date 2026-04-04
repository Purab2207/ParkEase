import React, { useState, useEffect } from 'react';

// S7 — RCB vs MI Parking Booking (no payment — retention flow from S6)
// Same bay-selection UX as S2 but pre-loaded with Chinnaswamy event data.
// Skips payment entirely; confirm → S8 RCB Confirmation.

// ----------------------------------------------------------------------------
// ICONS
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

const MapPinIcon = () => (
  <svg className="w-4 h-4 text-red-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const ClockIcon = () => (
  <svg className="w-4 h-4 text-gray-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const BadgeCheckIcon = () => (
  <svg className="w-4 h-4 text-blue-500 shrink-0" fill="currentColor" viewBox="0 0 24 24">
    <path fillRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.307 4.491 4.491 0 01-1.307-3.497A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
  </svg>
);

// ----------------------------------------------------------------------------
// MOCK DATA
// ----------------------------------------------------------------------------
const MOCK_EVENT = {
  id: 'rcb-mi-chinnaswamy-2026',
  name: 'RCB vs MI — IPL 2026 Playoffs',
  venue: 'M. Chinnaswamy Stadium, Bangalore',
  date: 'Sun, 4 May 2026 · 7:30 PM',
  price: 199,
  entryWindows: ['5:30–7:00 PM', '7:00–8:00 PM'],
  prohibitedItems: [
    'Professional cameras / DSLR',
    'Outside food & beverages',
    'Laser pointers',
    'Flags larger than 1×1m',
    'Power banks above 20,000 mAh',
  ],
};

// East Stand — E-series (20 bays)
const EAST_BAYS = [
  { id: 'E-01', pillarCode: 'E-01', status: 'taken' },
  { id: 'E-02', pillarCode: 'E-02', status: 'available' },
  { id: 'E-03', pillarCode: 'E-03', status: 'available' },
  { id: 'E-04', pillarCode: 'E-04', status: 'taken' },
  { id: 'E-05', pillarCode: 'E-05', status: 'available' },
  { id: 'E-06', pillarCode: 'E-06', status: 'taken' },
  { id: 'E-07', pillarCode: 'E-07', status: 'available' },
  { id: 'E-08', pillarCode: 'E-08', status: 'available' },
  { id: 'E-09', pillarCode: 'E-09', status: 'taken' },
  { id: 'E-10', pillarCode: 'E-10', status: 'available' },
  { id: 'E-11', pillarCode: 'E-11', status: 'available' },
  { id: 'E-12', pillarCode: 'E-12', status: 'taken' },
  { id: 'E-13', pillarCode: 'E-13', status: 'available' },
  { id: 'E-14', pillarCode: 'E-14', status: 'available' },
  { id: 'E-15', pillarCode: 'E-15', status: 'taken' },
  { id: 'E-16', pillarCode: 'E-16', status: 'available' },
  { id: 'E-17', pillarCode: 'E-17', status: 'taken' },
  { id: 'E-18', pillarCode: 'E-18', status: 'available' },
  { id: 'E-19', pillarCode: 'E-19', status: 'available' },
  { id: 'E-20', pillarCode: 'E-20', status: 'taken' },
];

// West Stand — W-series (15 bays)
const WEST_BAYS = [
  { id: 'W-01', pillarCode: 'W-01', status: 'taken' },
  { id: 'W-02', pillarCode: 'W-02', status: 'available' },
  { id: 'W-03', pillarCode: 'W-03', status: 'available' },
  { id: 'W-04', pillarCode: 'W-04', status: 'taken' },
  { id: 'W-05', pillarCode: 'W-05', status: 'available' },
  { id: 'W-06', pillarCode: 'W-06', status: 'available' },
  { id: 'W-07', pillarCode: 'W-07', status: 'taken' },
  { id: 'W-08', pillarCode: 'W-08', status: 'available' },
  { id: 'W-09', pillarCode: 'W-09', status: 'available' },
  { id: 'W-10', pillarCode: 'W-10', status: 'taken' },
  { id: 'W-11', pillarCode: 'W-11', status: 'available' },
  { id: 'W-12', pillarCode: 'W-12', status: 'available' },
  { id: 'W-13', pillarCode: 'W-13', status: 'taken' },
  { id: 'W-14', pillarCode: 'W-14', status: 'available' },
  { id: 'W-15', pillarCode: 'W-15', status: 'available' },
];

const LOTS = [
  { id: 'east',  label: 'East Stand', distanceToGateMetres: 120, gateName: 'Gate A', bays: EAST_BAYS },
  { id: 'west',  label: 'West Stand', distanceToGateMetres: 200, gateName: 'Gate C', bays: WEST_BAYS },
];

// ----------------------------------------------------------------------------
// SUB-COMPONENTS
// ----------------------------------------------------------------------------
const Header = ({ onBack }) => (
  <div className="w-full flex items-center justify-between py-2">
    <button onClick={onBack} className="p-1.5 rounded-full hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-900">
      <ArrowLeftIcon />
    </button>
    <span className="text-base font-semibold text-gray-900">Book Parking</span>
    <div className="flex items-center gap-1.5 bg-blue-50 border border-blue-200 rounded-full px-2.5 py-1">
      <BadgeCheckIcon />
      <span className="text-xs text-blue-700 font-semibold">Details saved</span>
    </div>
  </div>
);

const EventBanner = ({ event }) => (
  <div className="w-full bg-gradient-to-r from-gray-900 to-red-950 border border-red-800/40 rounded-2xl px-4 py-3">
    <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-red-700 to-red-500 rounded-t-2xl" />
    <p className="text-[10px] text-red-400 uppercase tracking-widest font-semibold mb-0.5">IPL 2026 · Playoffs</p>
    <p className="text-base font-black text-white">{event.name}</p>
    <div className="flex items-center gap-1.5 mt-1">
      <MapPinIcon />
      <span className="text-xs text-gray-300">{event.venue} · {event.date}</span>
    </div>
  </div>
);

const ScarcityBanner = ({ spotsRemaining, totalSpots }) => {
  const fillPercent = ((totalSpots - spotsRemaining) / totalSpots) * 100;
  const isAlmostFull = spotsRemaining <= 100;

  return (
    <div className={`w-full rounded-2xl px-5 py-4 flex flex-col gap-2 border ${isAlmostFull ? 'bg-amber-50 border-amber-200' : 'bg-white border-gray-200 shadow-sm'}`}>
      <div className="flex items-end justify-between">
        <div>
          <span className={`text-2xl font-bold ${isAlmostFull ? 'text-amber-600' : 'text-gray-900'}`}>{spotsRemaining}</span>
          <span className="text-sm text-gray-500 ml-1.5">spots left</span>
        </div>
        <span className="text-xs text-gray-400">of {totalSpots} total · live</span>
      </div>
      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${fillPercent}%`, background: 'linear-gradient(to right, #22c55e, #f59e0b, #ef4444)' }}
        />
      </div>
      {isAlmostFull && <p className="text-xs text-amber-600">Filling fast — book now to secure your bay</p>}
    </div>
  );
};

const ProhibitedBanner = ({ items, venueName }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="w-full bg-white border border-gray-200 shadow-sm rounded-xl overflow-hidden">
      <button onClick={() => setOpen(v => !v)} className="w-full px-4 py-2.5 flex items-center justify-between text-left">
        <span className="text-xs text-gray-500">⚠️ Venue entry rules — {venueName}</span>
        <ChevronDownIcon open={open} />
      </button>
      {open && (
        <ul className="px-4 pb-3 flex flex-col gap-1.5 border-t border-gray-200">
          {items.map((item, i) => (
            <li key={i} className="text-xs text-gray-400 flex items-start gap-1.5">
              <span className="mt-0.5">•</span>{item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const LotTabs = ({ lots, selectedLotId, onSelect }) => (
  <div className="flex gap-2">
    {lots.map(lot => (
      <button
        key={lot.id}
        onClick={() => onSelect(lot.id)}
        className={`text-sm px-4 py-2 rounded-full font-medium transition-all ${
          selectedLotId === lot.id ? 'bg-[#1C1D2B] text-white font-semibold' : 'bg-gray-100 text-gray-500 hover:text-gray-900'
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
              ? 'bg-red-700 border border-red-500 text-white font-bold scale-105'
              : 'bg-gray-100 border border-gray-200 text-gray-700 hover:bg-red-50 hover:border-red-200 hover:text-gray-900 cursor-pointer active:scale-95'
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
        <span className="text-xs text-green-600 bg-green-900/10 px-2 py-0.5 rounded-full border border-green-200">Reserved</span>
      </div>
      <div className="text-xs text-green-600 mt-0.5">{lot.label} · {lot.distanceToGateMetres}m to {lot.gateName}</div>
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
      <LotTabs lots={lots} selectedLotId={activeLot.id} onSelect={onSelectLot} />
      <BayGrid bays={activeLot.bays} selectedBayId={selectedBay?.id} onSelectBay={(bay) => onSelectBay(bay, activeLot)} />
      <div className="flex items-center gap-4 text-xs text-gray-400 px-1">
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-red-700 inline-block" />Available</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-white border border-gray-200 shadow-sm inline-block" />Taken</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-red-600 inline-block" />Your pick</span>
      </div>
      {selectedBay && (
        <SelectedBayCard bay={selectedBay} lot={activeLot} onChangeBay={() => onSelectBay(null, activeLot)} />
      )}
    </div>
  );
};

const EntryTimePicker = ({ windows, selectedWindow, onSelect }) => (
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
            ${isSelected ? 'bg-gray-100 border border-gray-900' : 'bg-white border border-gray-200 shadow-sm hover:border-gray-400'}`}
        >
          <div className="flex flex-col items-start gap-0.5">
            <span className="text-sm font-semibold text-gray-900">{window}</span>
            <span className="text-xs text-gray-400">Your spot is held until the window ends</span>
          </div>
          <div className={`w-4 h-4 rounded-full border-2 transition-all shrink-0 ${isSelected ? 'border-gray-900 bg-gray-900' : 'border-gray-200'}`} />
        </button>
      );
    })}
  </div>
);

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

const ConfirmCTA = ({ price, selectedBay, selectedWindow, onConfirm, onOpenBaySelection }) => {
  const ready = selectedBay && selectedWindow;

  const getLabel = () => {
    if (!selectedBay) return 'Select a bay to continue';
    if (!selectedWindow) return 'Select arrival time to continue';
    return `Confirm Booking · ₹${price}`;
  };

  const handleClick = () => {
    if (!selectedBay) { onOpenBaySelection?.(); return; }
    if (ready) onConfirm();
  };

  return (
    <div className="w-full sticky bottom-4 mt-2">
      <button
        onClick={handleClick}
        className={`w-full font-bold text-base rounded-2xl py-4 transition-all shadow-lg shadow-black/40
          ${ready
            ? 'bg-red-700 text-white hover:bg-red-800 tracking-wide uppercase active:scale-95 cursor-pointer'
            : 'bg-[#1C1D2B] text-white hover:bg-gray-800 tracking-wide uppercase active:scale-95 cursor-pointer'
          }`}
      >
        {getLabel()}
      </button>
    </div>
  );
};

// ----------------------------------------------------------------------------
// MAIN SCREEN
// ----------------------------------------------------------------------------
export default function RCBBookingScreen({ onConfirm, onNavigateBack }) {
  const [event] = useState(MOCK_EVENT);
  const [spotsRemaining, setSpotsRemaining] = useState(200);
  const totalSpots = 500;

  const [selectedLotId, setSelectedLotId] = useState('east');
  const [selectedBay, setSelectedBay] = useState(null);
  const [selectedLot, setSelectedLot] = useState(LOTS[0]);
  const [selectedWindow, setSelectedWindow] = useState(null);
  const [currentStep, setCurrentStep] = useState(2);

  useEffect(() => {
    const interval = setInterval(() => {
      setSpotsRemaining(prev => Math.max(prev - 1, 0));
    }, 45000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (selectedBay && currentStep === 2) setCurrentStep(3);
  }, [selectedBay]);

  const handleSelectBay = (bay, lot) => {
    setSelectedBay(bay);
    if (lot) setSelectedLot(lot);
  };

  const handleSelectLot = (lotId) => {
    setSelectedLotId(lotId);
    setSelectedBay(null);
  };

  const handleConfirm = () => {
    onConfirm?.({ bay: selectedBay, lot: selectedLot, window: selectedWindow, event });
  };

  return (
    <div className="min-h-[100dvh] bg-gray-50 font-sans">
      <div className="max-w-md mx-auto min-h-[100dvh] bg-gray-50 flex flex-col px-4 py-5 gap-4 pb-20 sm:shadow-2xl">

        <Header onBack={onNavigateBack} />

        {/* Event context — RCB themed */}
        <div className="relative">
          <EventBanner event={event} />
        </div>

        {/* Scarcity */}
        <ScarcityBanner spotsRemaining={spotsRemaining} totalSpots={totalSpots} />

        {/* Prohibited items */}
        <ProhibitedBanner items={event.prohibitedItems} venueName="Chinnaswamy Stadium" />

        {/* Step 2 — Bay selection */}
        <div className="w-full flex flex-col gap-3">
          <span className="text-xs text-gray-500 uppercase tracking-widest font-semibold">2 · Select your bay</span>
          {currentStep === 2 ? (
            <BaySelectionPanel
              lots={LOTS}
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

        {/* Step 3 — Arrival window (visible once bay selected) */}
        {selectedBay && (
          <div className="w-full flex flex-col gap-3">
            <button
              onClick={() => setCurrentStep(3)}
              className="text-xs text-gray-500 uppercase tracking-widest font-semibold text-left"
            >
              3 · Choose arrival window
            </button>
            {currentStep === 3 ? (
              <EntryTimePicker
                windows={event.entryWindows}
                selectedWindow={selectedWindow}
                onSelect={(w) => setSelectedWindow(w)}
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

        {/* Repeat booker note */}
        <div className="w-full bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 flex items-center gap-2">
          <BadgeCheckIcon />
          <p className="text-xs text-blue-700">Your details are saved from your last booking — no re-entry needed.</p>
        </div>

        {/* CTA */}
        <ConfirmCTA
          price={event.price}
          selectedBay={selectedBay}
          selectedWindow={selectedWindow}
          onConfirm={handleConfirm}
          onOpenBaySelection={() => setCurrentStep(2)}
        />

        <p className="text-xs text-center text-gray-400 pb-4">Full refund if cancelled 24hrs before the match</p>

      </div>
    </div>
  );
}
