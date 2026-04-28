import React, { useState, useEffect, useCallback } from 'react';
import { fetchEvent, createBooking } from '../api';
import useLiveSpots from '../hooks/useLiveSpots';
import UPIPaymentModal from '../components/UPIPaymentModal';

const ArrowLeftIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
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
const LockIcon = () => (
  <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);

const EVENT_ID = 'karan-aujla-jln-2026';

const FALLBACK_EVENT = {
  event_name: 'Karan Aujla Live',
  venue: 'JLN Stadium',
  city: 'Delhi',
  date: '12 Apr 2026',
  consumer_price: 169,
  venue_base_rate: 120,
  park_ease_fee: 49,
  entry_windows: ['5:30–7:00 PM', '7:00–8:30 PM'],
  event_tier: 'Premium',
};

export default function BookingFlowScreen({
  onPaymentSuccess, onNavigateBack, onParkingFull,
  userPhone, isLoggedIn,
  lots = [], totalSpots = 180, spotsRemaining = 0,
  lotsLocked = false, onBayBooked,
}) {
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  const live = useLiveSpots(EVENT_ID);

  const [selectedLotId, setSelectedLotId] = useState('lot-a');
  const [selectedBay, setSelectedBay] = useState(null);
  const [selectedLot, setSelectedLot] = useState(lots[0] || null);
  const [selectedWindow, setSelectedWindow] = useState(null);
  const [groupSize, setGroupSize] = useState(1);
  const [contactPhone, setContactPhone] = useState(userPhone || '');
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentError, setPaymentError] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [pendingBookingId, setPendingBookingId] = useState(null);
  const [showBayGrid, setShowBayGrid] = useState(false);

  useEffect(() => {
    fetchEvent(EVENT_ID)
      .then(eventData => {
        setEvent(eventData);
        setLoading(false);
      })
      .catch(() => {
        setEvent(FALLBACK_EVENT);
        setLoading(false);
      });
  }, []);

  const activeLotMeta = lots.find(l => l.id === selectedLotId) || lots[0];
  const currentLotBays = activeLotMeta?.bays || [];

  // Fill percent derived from shared lots state passed as props
  const fillPercent = totalSpots > 0 ? Math.round(((totalSpots - spotsRemaining) / totalSpots) * 100) : 0;

  const handleSelectBay = (bay) => {
    if (bay.status === 'taken') return;
    setSelectedBay(bay);
    setSelectedLot(activeLotMeta);
    setShowBayGrid(false);
  };

  const handlePay = () => {
    if (!selectedBay || !selectedWindow || contactPhone.length !== 10) return;
    setPaymentError(null);
    setShowPaymentModal(true);
  };

  const handleCreateBooking = useCallback(async () => {
    try {
      const result = await createBooking({
        event_id: EVENT_ID,
        bay_id: selectedBay.pillar_code,
        lot_id: selectedLotId,
        phone: contactPhone,
        entry_window: selectedWindow,
        group_size: groupSize,
      });
      setPendingBookingId(result.booking_id);
    } catch {
      // Backend unavailable — generate a demo booking ID locally
      setPendingBookingId(`PE-2026-DEMO${Date.now()}`);
    }
    // Update shared lot state so S5 dashboard and scarcity banner reflect the booking
    onBayBooked?.(selectedLotId, selectedBay.pillar_code);
  }, [selectedBay, selectedLotId, contactPhone, selectedWindow, groupSize, onBayBooked]);

  const handlePaymentSuccess = useCallback(() => {
    setShowPaymentModal(false);
    onPaymentSuccess?.(pendingBookingId);
  }, [pendingBookingId, onPaymentSuccess]);

  if (loading) {
    return (
      <div className="min-h-[100dvh] bg-gray-50 flex items-center justify-center">
        <div className="animate-pulse text-gray-400">Loading booking...</div>
      </div>
    );
  }

  const consumerPrice = event?.consumer_price || 169;

  return (
    <div className="min-h-[100dvh] bg-gray-50 font-sans" data-testid="booking-flow">
      <div className="max-w-md mx-auto min-h-[100dvh] bg-gray-50 flex flex-col px-4 py-5 gap-4 pb-20 sm:shadow-2xl">

        {/* Header */}
        <div className="w-full flex items-center justify-between py-2">
          <button onClick={() => onNavigateBack?.()} className="p-1.5 rounded-full hover:bg-gray-50 text-gray-500" data-testid="booking-back-btn">
            <ArrowLeftIcon />
          </button>
          <span className="text-base font-semibold text-gray-900">Book Parking</span>
          <span className={`text-xs px-2.5 py-1 rounded-full border flex items-center gap-1.5 ${
            live.connected ? 'bg-green-50 border-green-200 text-green-600' : 'bg-gray-100 border-gray-200 text-gray-400'
          }`} data-testid="booking-live-badge">
            <span className={`w-1.5 h-1.5 rounded-full ${live.connected ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`} />
            {live.connected ? 'Live' : 'Updating'}
          </span>
        </div>

        {/* Locked banner — shown when operator activates emergency override */}
        {lotsLocked && (
          <div className="w-full bg-red-950 border border-red-700 rounded-2xl px-5 py-4 flex items-start gap-3" data-testid="lots-locked-banner">
            <LockIcon />
            <div className="flex flex-col gap-0.5">
              <span className="text-red-300 font-black text-sm tracking-wide">LOCKED — No new entries</span>
              <span className="text-red-400 text-xs">An emergency override is active. Contact the venue operator.</span>
            </div>
          </div>
        )}

        {/* Event bar */}
        <div className="w-full bg-white border border-gray-200 shadow-sm rounded-2xl px-4 py-3 flex flex-col gap-0.5">
          <div className="text-base font-bold text-gray-900">{event?.event_name || FALLBACK_EVENT.event_name}</div>
          <div className="text-xs text-gray-500">{event?.venue || FALLBACK_EVENT.venue}, {event?.city || FALLBACK_EVENT.city} · {event?.date || FALLBACK_EVENT.date}</div>
        </div>

        {/* Scarcity banner — all numbers computed from shared lots state */}
        <div className={`w-full rounded-2xl px-5 py-4 flex flex-col gap-2 border ${
          spotsRemaining <= 20 ? 'bg-red-50 border-red-200' :
          spotsRemaining <= 50 ? 'bg-amber-50 border-amber-200' :
          'bg-white border-gray-200 shadow-sm'
        }`} data-testid="scarcity-banner">
          <div className="flex items-end justify-between">
            <div className="flex items-baseline gap-1.5">
              {spotsRemaining <= 20 && (
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse shrink-0" />
              )}
              <span className={`text-2xl font-bold ${spotsRemaining <= 20 ? 'text-red-600' : spotsRemaining <= 50 ? 'text-amber-600' : 'text-gray-900'}`}>
                {spotsRemaining}
              </span>
              <span className="text-sm text-gray-500">spots left · of {totalSpots} total · live</span>
            </div>
          </div>
          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-green-500 via-amber-500 to-red-500 transition-all duration-700"
              style={{ width: `${fillPercent}%` }}
            />
          </div>
        </div>

        {/* Bay Selection */}
        <div className="w-full flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500 uppercase tracking-widest font-semibold">Select your bay</span>
            <div className="flex items-center gap-1 text-xs text-gray-400">
              <MapPinIcon />
              <span>{activeLotMeta?.distanceToGateMetres ?? 0}m to gate</span>
            </div>
          </div>

          {(showBayGrid || selectedBay) && (
            <>
              {/* Lot tabs */}
              <div className="flex gap-2">
                {lots.map(lot => (
                  <button key={lot.id} onClick={() => { setSelectedLotId(lot.id); setSelectedBay(null); }}
                    data-testid={`lot-tab-${lot.id}`}
                    className={`text-sm px-4 py-2 rounded-full font-medium transition-all ${
                      selectedLotId === lot.id ? 'bg-[#1C1D2B] text-white font-semibold' : 'bg-gray-100 text-gray-500 hover:text-gray-900'
                    }`}>
                    {lot.label}
                  </button>
                ))}
              </div>

              {/* Bay grid — fixed height scroll container prevents page from stretching */}
              <div className="w-full max-h-[280px] overflow-y-auto rounded-xl" data-testid="bay-grid-scroll">
                <div className="grid grid-cols-5 gap-2 p-1" data-testid="bay-grid">
                  {currentLotBays.map(bay => {
                    const isSelected = bay.pillar_code === selectedBay?.pillar_code;
                    const isTaken = bay.status === 'taken';
                    return (
                      <button key={bay.pillar_code} disabled={isTaken || lotsLocked} onClick={() => handleSelectBay(bay)}
                        data-testid={`bay-${bay.pillar_code}`}
                        className={`rounded-lg p-2 text-center text-xs font-medium transition-all
                          ${isTaken ? 'bg-white border border-gray-200 text-gray-400 line-through cursor-not-allowed'
                            : isSelected ? 'bg-green-700 border border-green-500 text-white font-bold scale-105'
                            : lotsLocked ? 'bg-gray-100 border border-gray-200 text-gray-300 cursor-not-allowed'
                            : 'bg-gray-100 border border-gray-200 text-gray-700 hover:bg-green-50 hover:border-green-200 cursor-pointer active:scale-95'}`}>
                        {bay.pillar_code}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs text-gray-400 px-1">
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-gray-100 border border-gray-200 inline-block" />Available</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-white border border-gray-200 inline-block" style={{ textDecoration: 'line-through' }} />Taken</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-green-700 inline-block" />Your pick</span>
              </div>
            </>
          )}

          {selectedBay && (
            <div className="w-full bg-green-50 border border-green-200 rounded-xl px-4 py-3 flex items-center gap-3" data-testid="selected-bay-card">
              <CheckIcon />
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-base font-bold text-gray-900">Bay {selectedBay.pillar_code}</span>
                  <span className="text-xs text-green-600 bg-green-100 px-2 py-0.5 rounded-full border border-green-200">Reserved</span>
                </div>
                <div className="text-xs text-green-600 mt-0.5">
                  {selectedLot?.label} · {selectedLot?.distanceToGateMetres}m to gate
                </div>
              </div>
              <button onClick={() => { setSelectedBay(null); setShowBayGrid(true); }} className="ml-auto text-xs text-gray-500 underline shrink-0">Change</button>
            </div>
          )}
        </div>

        {/* Time Window */}
        {selectedBay && (
          <div className="w-full flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <ClockIcon />
              <span className="text-xs text-gray-500 uppercase tracking-widest font-semibold">Choose arrival window</span>
            </div>
            {(event?.entry_windows || FALLBACK_EVENT.entry_windows).map(window => (
              <button key={window} onClick={() => setSelectedWindow(window)}
                data-testid={`window-${window}`}
                className={`w-full rounded-xl px-4 py-3 flex items-center justify-between transition-all
                  ${selectedWindow === window ? 'bg-gray-100 border border-gray-900' : 'bg-white border border-gray-200 shadow-sm hover:border-gray-400'}`}>
                <div className="flex flex-col items-start gap-0.5">
                  <span className="text-sm font-semibold text-gray-900">{window}</span>
                  <span className="text-xs text-gray-400">Your spot is held until the window ends</span>
                </div>
                <div className={`w-4 h-4 rounded-full border-2 transition-all shrink-0 ${selectedWindow === window ? 'border-gray-900 bg-gray-900' : 'border-gray-200'}`} />
              </button>
            ))}
          </div>
        )}

        {/* Pricing */}
        {selectedWindow && (
          <div className="w-full flex flex-col gap-3">
            <span className="text-xs text-gray-500 uppercase tracking-widest font-semibold">Review & pricing</span>
            <div className="w-full bg-white border border-gray-200 shadow-sm rounded-2xl px-5 py-4 flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <span className="text-xs text-gray-400 uppercase tracking-widest">{event?.event_tier || FALLBACK_EVENT.event_tier}</span>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Venue parking base</span>
                  <span className="text-sm text-gray-500">₹{event?.venue_base_rate || FALLBACK_EVENT.venue_base_rate}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">ParkEase service fee</span>
                  <span className="text-sm text-gray-500">₹{event?.park_ease_fee || FALLBACK_EVENT.park_ease_fee}</span>
                </div>
                <div className="w-full h-px bg-gray-200 my-1" />
                <div className="flex items-center justify-between">
                  <span className="text-base font-bold text-gray-900">Total</span>
                  <span className="text-lg font-bold text-gray-900">₹{consumerPrice}</span>
                </div>
              </div>
              <div className="w-full h-px bg-gray-200" />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <UsersIcon />
                  <span className="text-xs text-gray-500">Splitting with a group?</span>
                </div>
                <div className="flex items-center gap-3">
                  <button onClick={() => groupSize > 1 && setGroupSize(groupSize - 1)} disabled={groupSize <= 1}
                    className="w-7 h-7 bg-gray-200 rounded-full flex items-center justify-center text-gray-900 font-bold disabled:opacity-30">-</button>
                  <span className="text-sm text-gray-900 font-semibold w-4 text-center">{groupSize}</span>
                  <button onClick={() => groupSize < 6 && setGroupSize(groupSize + 1)} disabled={groupSize >= 6}
                    className="w-7 h-7 bg-gray-200 rounded-full flex items-center justify-center text-gray-900 font-bold disabled:opacity-30">+</button>
                </div>
              </div>
              {groupSize > 1 && (
                <div className="w-full bg-green-50 border border-green-200 rounded-xl px-4 py-3">
                  <span className="text-xl font-bold text-green-600">₹{Math.ceil(consumerPrice / groupSize)} per person</span>
                  <p className="text-xs text-gray-400 mt-0.5">UPI collect request sent to {groupSize} people after booking</p>
                </div>
              )}
              <div className="w-full flex items-start gap-2 pt-1">
                <ShieldIcon />
                <p className="text-xs text-gray-400 leading-relaxed">Full refund if cancelled more than 24 hours before the event.</p>
              </div>
            </div>
          </div>
        )}

        {/* Contact */}
        {selectedWindow && (
          <div className="w-full flex flex-col gap-2">
            <span className="text-xs text-gray-500 uppercase tracking-widest font-semibold">Contact number for QR delivery</span>
            <div className="w-full bg-white border border-gray-200 shadow-sm rounded-2xl px-4 py-3 flex flex-col gap-2">
              <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden focus-within:border-gray-400">
                <div className="px-3 py-3 bg-gray-50 border-r border-gray-200 text-sm text-gray-500 shrink-0">+91</div>
                <input type="tel" maxLength={10} value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value.replace(/\D/g, ''))}
                  placeholder="10-digit mobile number"
                  data-testid="contact-phone-input"
                  className="flex-1 px-3 py-3 outline-none text-sm text-gray-900 bg-white" />
                {isLoggedIn && userPhone && contactPhone === userPhone && (
                  <div className="px-3 py-1 text-xs text-green-600 font-medium shrink-0">Verified</div>
                )}
              </div>
              <p className="text-xs text-gray-400">Booking QR and departure reminder sent here</p>
            </div>
          </div>
        )}

        {paymentError && (
          <div className="w-full bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600" data-testid="payment-error">
            {paymentError}
          </div>
        )}

        {/* Pay button */}
        <div className="w-full sticky bottom-4 mt-2">
          <button
            data-testid="pay-btn"
            onClick={() => {
              if (lotsLocked) return;
              if (!selectedBay) { setShowBayGrid(true); return; }
              handlePay();
            }}
            disabled={paymentLoading || lotsLocked || (selectedBay && (!selectedWindow || contactPhone.length !== 10))}
            className={`w-full font-bold text-base rounded-2xl py-4 transition-all shadow-lg shadow-black/40
              ${(paymentLoading || lotsLocked || (selectedBay && (!selectedWindow || contactPhone.length !== 10)))
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-[#1C1D2B] text-white hover:bg-gray-800 tracking-wide uppercase active:scale-95 cursor-pointer'}`}>
            {paymentLoading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-gray-400 border-t-gray-900 rounded-full animate-spin" />
                Processing...
              </span>
            ) : lotsLocked ? 'Bookings locked — contact operator'
              : !selectedBay ? 'Select a bay to continue'
              : !selectedWindow ? 'Select arrival time to continue'
              : contactPhone.length !== 10 ? 'Enter contact number to continue'
              : `Pay ₹${consumerPrice} via UPI`}
          </button>
        </div>

        <div className="w-full flex flex-col items-center gap-2 pb-8 pt-2">
          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            <ShieldIcon />
            <span>Payments secured by UPI · Booking confirmed instantly</span>
          </div>
        </div>
      </div>

      <UPIPaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onSuccess={handlePaymentSuccess}
        onCreateBooking={handleCreateBooking}
        amount={consumerPrice}
        bayCode={selectedBay?.pillar_code || ''}
        lotName={selectedLot?.label || ''}
      />
    </div>
  );
}
