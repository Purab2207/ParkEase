import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { fetchBooking } from '../api';
import Toast from '../components/Toast';

// ---------------------------------------------------------------------------
// UPI APP DEEP-LINKS
// Standard UPI scheme — Android shows app chooser or opens direct app.
// VPA parksease@okaxis is a placeholder — replace with real merchant VPA in MVP.
// ---------------------------------------------------------------------------
const UPI_APPS = [
  {
    id: 'gpay', name: 'GPay', scheme: 'gpay://upi/pay',
    icon: (
      <svg viewBox="0 0 48 48" className="w-6 h-6" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M24 4C12.95 4 4 12.95 4 24s8.95 20 20 20 20-8.95 20-20S35.05 4 24 4z" fill="#4285F4"/>
        <path d="M24 4C12.95 4 4 12.95 4 24h20V4z" fill="#EA4335"/>
        <path d="M4 24c0 11.05 8.95 20 20 20V24H4z" fill="#FBBC04"/>
        <path d="M44 24c0-11.05-8.95-20-20-20v20h20z" fill="#34A853"/>
      </svg>
    ),
  },
  {
    id: 'phonepe', name: 'PhonePe', scheme: 'phonepe://pay',
    icon: (
      <svg viewBox="0 0 48 48" className="w-6 h-6" xmlns="http://www.w3.org/2000/svg">
        <rect width="48" height="48" rx="10" fill="#5f259f"/>
        <text x="50%" y="58%" dominantBaseline="middle" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold">PhPe</text>
      </svg>
    ),
  },
  {
    id: 'paytm', name: 'Paytm', scheme: 'paytmmp://pay',
    icon: (
      <svg viewBox="0 0 48 48" className="w-6 h-6" xmlns="http://www.w3.org/2000/svg">
        <rect width="48" height="48" rx="10" fill="#00BAF2"/>
        <text x="50%" y="58%" dominantBaseline="middle" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold">Paytm</text>
      </svg>
    ),
  },
  {
    id: 'bhim', name: 'BHIM', scheme: 'upi://pay',
    icon: (
      <svg viewBox="0 0 48 48" className="w-6 h-6" xmlns="http://www.w3.org/2000/svg">
        <rect width="48" height="48" rx="10" fill="#1a237e"/>
        <text x="50%" y="58%" dominantBaseline="middle" textAnchor="middle" fill="white" fontSize="13" fontWeight="bold">BHIM</text>
      </svg>
    ),
  },
];

const UPIAppsBlock = ({ amount, bookingId }) => {
  const [paymentQrUrl, setPaymentQrUrl] = useState('');

  const upiPaymentUrl = (() => {
    const params = new URLSearchParams({
      pa: 'parksease@okaxis',
      pn: 'ParkEase',
      am: String(amount),
      cu: 'INR',
      tn: `Parking booking ${bookingId}`,
    });
    return `upi://pay?${params.toString()}`;
  })();

  useEffect(() => {
    QRCode.toDataURL(upiPaymentUrl, { width: 160, margin: 1 })
      .then(url => setPaymentQrUrl(url))
      .catch(() => {});
  }, [upiPaymentUrl]);

  const buildUPIUrl = (scheme) => {
    const params = new URLSearchParams({
      pa: 'parksease@okaxis',
      pn: 'ParkEase',
      am: String(amount),
      cu: 'INR',
      tn: `Parking booking ${bookingId}`,
    });
    return `${scheme}?${params.toString()}`;
  };

  return (
    <div className="w-full flex flex-col gap-3">
      <span className="text-xs text-gray-400 uppercase tracking-widest font-semibold">Pay via UPI</span>
      <div className="w-full bg-white border border-gray-200 shadow-sm rounded-2xl px-4 py-4 flex flex-col gap-4">
        {/* UPI payment QR */}
        <div className="flex flex-col items-center gap-2">
          <div className="bg-white p-2 rounded-xl border border-gray-100 shadow-sm">
            {paymentQrUrl
              ? <img src={paymentQrUrl} alt="UPI payment QR" width={120} height={120} />
              : <div className="w-[120px] h-[120px] bg-gray-100 rounded-lg animate-pulse" />
            }
          </div>
          <p className="text-xs text-gray-400 text-center">Scan with any UPI app to pay ₹{amount}</p>
        </div>
        <div className="w-full h-px bg-gray-100" />
        {/* UPI app buttons */}
        <div className="grid grid-cols-4 gap-2">
          {UPI_APPS.map(({ id, name, scheme, icon }) => (
            <a
              key={id}
              href={buildUPIUrl(scheme)}
              className="flex flex-col items-center gap-1.5 py-3 rounded-xl border border-gray-100 bg-gray-50 hover:bg-gray-100 active:scale-95 transition-all"
            >
              {icon}
              <span className="text-[11px] font-semibold text-gray-700">{name}</span>
            </a>
          ))}
        </div>
        <p className="text-xs text-gray-400 text-center">
          Or open your UPI app directly · ₹{amount} · Booking {(bookingId || '').slice(-8).toUpperCase()}
        </p>
      </div>
    </div>
  );
};

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
const BellIcon = () => (
  <svg className="w-4 h-4 text-amber-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
  </svg>
);
const ShieldIcon = () => (
  <svg className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);
const WhatsAppIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

const RealQRCode = ({ bookingId }) => {
  const [qrDataUrl, setQrDataUrl] = useState('');

  useEffect(() => {
    QRCode.toDataURL(bookingId || 'PE-2026-DEMO1234', { width: 160, margin: 1 })
      .then(url => setQrDataUrl(url))
      .catch(() => {});
  }, [bookingId]);

  return (
    <div className="flex flex-col items-center gap-3" data-testid="qr-code">
      <div className="bg-white p-3 rounded-2xl shadow-lg shadow-black/30">
        {qrDataUrl
          ? <img src={qrDataUrl} alt="Booking QR code" width={132} height={132} />
          : <div className="w-[132px] h-[132px] bg-gray-100 rounded-lg animate-pulse" />
        }
      </div>
      <div className="text-xs text-gray-400 font-mono tracking-widest">#{(bookingId || '').slice(-8).toUpperCase()}</div>
      <p className="text-xs text-gray-400 text-center max-w-[200px]">Show this to the attendant at the parking gate</p>
    </div>
  );
};

const FALLBACK_BOOKING = {
  booking_id: 'PE-2026-DEMO1234',
  event_name: 'Karan Aujla',
  venue: 'Jawaharlal Nehru Stadium, Delhi',
  date: 'Sat, 12 Apr 2026',
  bay_pillar_code: 'B-18',
  lot_name: 'JLN North Lot',
  distance_to_gate_metres: 180,
  gate_name: 'Gate 2',
  entry_window: '5:30-7:00 PM',
  consumer_price: 169,
};

export default function BookingConfirmationScreen({ bookingId, onNavigateToRetention }) {
  const [booking, setBooking] = useState(FALLBACK_BOOKING);
  const [groupSize, setGroupSize] = useState(5);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    if (bookingId && bookingId !== 'PE-2026-DEMO1234') {
      fetchBooking(bookingId)
        .then(data => setBooking(data))
        .catch(() => {});
    }
  }, [bookingId]);

  useEffect(() => {
    setShowToast(true);
  }, []);

  const splitAmount = Math.ceil((booking.consumer_price || 169) / groupSize);
  const departureNudgeTime = '6:00 PM';

  const waText = [
    'ParkEase -- Parking Confirmed',
    '',
    `Event: ${booking.event_name}`,
    `Date: ${booking.date}`,
    `Parking: Bay ${booking.bay_pillar_code}, ${booking.lot_name}`,
    `Departure: Leave by ${departureNudgeTime}`,
    groupSize > 1 ? `Split: ${'\u20B9'}${splitAmount} per person (${groupSize} people)` : null,
    '',
    `Book your spot: https://parksease.in`,
  ].filter(Boolean).join('\n');

  return (
    <div className="min-h-[100dvh] bg-gray-50 font-sans" data-testid="booking-confirmation">
      {showToast && (
        <Toast message="We'll remind you to leave by 6:00 PM — push notification sent 90 mins before event" />
      )}
      <div className="max-w-md mx-auto min-h-[100dvh] bg-gray-50 flex flex-col px-4 py-6 gap-5 pb-20 sm:shadow-2xl">
        {/* Header */}
        <div className="w-full flex flex-col items-center gap-2 pt-2 pb-1">
          <div className="w-16 h-16 bg-green-50 border border-green-200 rounded-full flex items-center justify-center">
            <CheckCircleIcon />
          </div>
          <h1 className="text-xl font-bold text-gray-900">Booking Confirmed</h1>
          <p className="text-xs text-gray-400 font-mono">Booking ID - #{(booking.booking_id || bookingId || '').slice(-8).toUpperCase()}</p>
        </div>

        <UPIAppsBlock amount={booking.consumer_price || 169} bookingId={booking.booking_id || bookingId} />

        {/* Entry pass */}
        <div className="w-full flex flex-col gap-3">
          <span className="text-xs text-gray-400 uppercase tracking-widest font-semibold">Your entry pass</span>
          <div className="w-full bg-white border border-gray-200 shadow-sm rounded-2xl px-4 py-4 flex flex-col items-center gap-1">
            <RealQRCode bookingId={booking.booking_id || bookingId} />
          </div>
        </div>

        {/* Summary card */}
        <div className="w-full bg-white border border-gray-200 shadow-md rounded-2xl px-5 py-4 flex flex-col gap-3" data-testid="booking-summary">
          <div className="flex flex-col gap-0.5 pb-3 border-b border-gray-200">
            <span className="text-base font-bold text-gray-900">{booking.event_name}</span>
            <span className="text-xs text-gray-500">{booking.venue} - {booking.date}</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center shrink-0"><MapPinIcon /></div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-gray-900">Bay {booking.bay_pillar_code}</span>
              <span className="text-xs text-gray-500">{booking.lot_name} - {booking.distance_to_gate_metres}m to {booking.gate_name}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center shrink-0"><ClockIcon /></div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-gray-900">Arrive {booking.entry_window}</span>
              <span className="text-xs text-gray-500">Your bay is held within this window</span>
            </div>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-gray-200">
            <span className="text-xs text-gray-400">Amount paid</span>
            <span className="text-sm font-bold text-gray-900">{'\u20B9'}{booking.consumer_price || booking.amount_paid} via UPI</span>
          </div>
        </div>

        {/* Departure nudge */}
        <div className="w-full bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 flex items-start gap-3">
          <div className="mt-0.5"><BellIcon /></div>
          <div className="flex flex-col gap-0.5">
            <span className="text-sm font-semibold text-gray-900">We'll remind you to leave by {departureNudgeTime}</span>
            <span className="text-xs text-gray-400 mt-1">Push notification -- sent 90 mins before event</span>
          </div>
        </div>

        {/* WhatsApp share */}
        <div className="w-full flex flex-col gap-3">
          <span className="text-xs text-gray-500 uppercase tracking-widest font-semibold">Share with your group</span>
          <div className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3">
            <pre className="text-xs text-gray-700 whitespace-pre-wrap font-sans leading-relaxed">{waText}</pre>
          </div>
          <a href={`https://wa.me/?text=${encodeURIComponent(waText)}`} target="_blank" rel="noopener noreferrer"
            data-testid="whatsapp-share-btn"
            className="w-full bg-green-600 hover:bg-green-500 active:scale-95 text-white font-bold text-sm rounded-2xl py-3.5 flex items-center justify-center gap-2 transition-all">
            <WhatsAppIcon /> Forward to Group
          </a>
        </div>

        {/* Cancellation */}
        <div className="w-full flex items-start gap-2 px-1">
          <ShieldIcon />
          <p className="text-xs text-gray-400 leading-relaxed">Full refund available if cancelled 24hrs prior. No refund after that.</p>
        </div>

        {onNavigateToRetention && (
          <button onClick={onNavigateToRetention} data-testid="next-event-link"
            className="w-full text-center text-sm text-gray-500 hover:text-gray-800 py-3 transition-colors">
            See you at the next event
          </button>
        )}
        <div className="pb-6" />
      </div>
    </div>
  );
}