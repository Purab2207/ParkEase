import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Seed past bookings for demo — makes the account feel lived-in
const DEMO_PAST_BOOKINGS = [
  {
    bookingId: 'pe-2025-arijit-b22',
    eventId: 'arijit-singh-dy-patil-2026',
    eventName: 'Arijit Singh',
    venue: 'DY Patil Stadium, Navi Mumbai',
    date: 'Fri, 18 Apr 2026',
    bayPillarCode: 'C-22',
    lotName: 'North Lot',
    consumerPrice: 149,
    status: 'past',
    bookedAt: '2026-03-10T14:00:00Z',
  },
  {
    bookingId: 'pe-2025-coldplay-b07',
    eventId: 'coldplay-nms-2026',
    eventName: 'Coldplay',
    venue: 'Narendra Modi Stadium, Ahmedabad',
    date: 'Sun, 26 Jan 2026',
    bayPillarCode: 'A-07',
    lotName: 'North Lot',
    consumerPrice: 199,
    status: 'past',
    bookedAt: '2025-12-20T10:30:00Z',
  },
];

const CloseIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const CalendarIcon = () => (
  <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const MapPinIcon = () => (
  <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const BookingCard = ({ booking, onViewEvent }) => {
  const isUpcoming = booking.status === 'upcoming';
  return (
    <div
      className={`w-full rounded-2xl border px-4 py-4 flex flex-col gap-3 ${
        isUpcoming
          ? 'bg-gray-800 border-gray-700'
          : 'bg-gray-900 border-gray-800'
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-bold text-white">{booking.eventName}</span>
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <MapPinIcon />
            <span>{booking.venue}</span>
          </div>
        </div>
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full shrink-0 ${
          isUpcoming
            ? 'bg-green-100 text-green-700'
            : 'bg-gray-100 text-gray-500'
        }`}>
          {isUpcoming ? 'Upcoming' : 'Past'}
        </span>
      </div>

      <div className="flex items-center gap-4 border-t border-gray-700 pt-3">
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <CalendarIcon />
          <span>{booking.date}</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <span className="w-1.5 h-1.5 rounded-full bg-gray-300" />
          <span>Bay {booking.bayPillarCode} · {booking.lotName}</span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-400">₹{booking.consumerPrice} paid</span>
        {isUpcoming && (
          <button
            onClick={() => onViewEvent(booking.eventId)}
            className="text-xs font-semibold text-blue-600 hover:text-blue-500 transition-colors"
          >
            View event →
          </button>
        )}
      </div>
    </div>
  );
};

const CarIcon = () => (
  <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10l2 2h8l2-2zM13 16l2-2h3l1-5H13v7z" />
  </svg>
);

const EditIcon = () => (
  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
  </svg>
);

export default function ProfileModal({ userPhone, onClose, onLogout }) {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);

  // Vehicle number — shared with S2 via localStorage
  const [vehicleNo, setVehicleNo] = useState(() => {
    try { return localStorage.getItem('parkease_vehicle_no') || ''; } catch { return ''; }
  });
  const [editingVehicle, setEditingVehicle] = useState(false);
  const [vehicleDraft, setVehicleDraft] = useState('');

  const handleEditVehicle = () => {
    setVehicleDraft(vehicleNo);
    setEditingVehicle(true);
  };

  const handleSaveVehicle = () => {
    const formatted = vehicleDraft.toUpperCase().replace(/[^A-Z0-9 ]/g, '');
    setVehicleNo(formatted);
    try { localStorage.setItem('parkease_vehicle_no', formatted); } catch {}
    setEditingVehicle(false);
  };

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('parkease_bookings') || '[]');
      // Merge saved (real) bookings with demo past bookings, avoid duplicates
      const savedIds = new Set(saved.map(b => b.bookingId));
      const pastToShow = DEMO_PAST_BOOKINGS.filter(b => !savedIds.has(b.bookingId));
      setBookings([...saved, ...pastToShow]);
    } catch {
      setBookings(DEMO_PAST_BOOKINGS);
    }
  }, []);

  const upcoming = bookings.filter(b => b.status === 'upcoming');
  const past = bookings.filter(b => b.status === 'past');

  const handleViewEvent = (eventId) => {
    onClose();
    navigate(`/events/${eventId}`);
  };

  const handleLogout = () => {
    onLogout();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Sheet */}
      <div className="relative w-full max-w-md bg-gray-900 border border-gray-800 rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-gray-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#1C1D2B] text-white flex items-center justify-center font-bold text-base">
              {(userPhone || 'U')[0].toUpperCase()}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-white">
                +91 {userPhone || '—'}
              </span>
              <span className="text-xs text-gray-400">ParkEase member</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-800 text-gray-400 transition-colors"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Content — scrollable */}
        <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-5">

          {/* My vehicle */}
          <div className="flex flex-col gap-2">
            <span className="text-xs text-red-400 uppercase tracking-widest font-semibold">My vehicle</span>
            <div className="w-full bg-gray-800 border border-gray-700 rounded-2xl px-4 py-3 flex flex-col gap-2">
              {editingVehicle ? (
                <div className="flex flex-col gap-2">
                  <input
                    type="text"
                    maxLength={13}
                    value={vehicleDraft}
                    onChange={e => setVehicleDraft(e.target.value.toUpperCase().replace(/[^A-Z0-9 ]/g, ''))}
                    placeholder="e.g. DL 3C AB 1234"
                    autoFocus
                    className="w-full border border-gray-700 rounded-xl px-3 py-2.5 text-sm font-mono tracking-wider text-white bg-gray-900 outline-none focus:border-red-500"
                  />
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleSaveVehicle}
                      disabled={vehicleDraft.length < 6}
                      className="flex-1 bg-red-600 hover:bg-red-500 disabled:opacity-40 text-white text-xs font-bold py-2 rounded-xl active:scale-95 transition-all"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingVehicle(false)}
                      className="flex-1 bg-gray-700 text-gray-300 text-xs font-semibold py-2 rounded-xl active:scale-95 transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <CarIcon />
                    {vehicleNo ? (
                      <span className="text-sm font-mono font-bold text-gray-900 tracking-wider">{vehicleNo}</span>
                    ) : (
                      <span className="text-sm text-gray-400">No vehicle saved</span>
                    )}
                  </div>
                  <button
                    onClick={handleEditVehicle}
                    className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-700 transition-colors px-2 py-1 rounded-lg hover:bg-gray-50"
                  >
                    <EditIcon />
                    {vehicleNo ? 'Edit' : 'Add'}
                  </button>
                </div>
              )}
              {vehicleNo && !editingVehicle && (
                <p className="text-xs text-gray-400">Auto-fills at booking · shown to attendant at gate</p>
              )}
            </div>
          </div>

          {/* Upcoming bookings */}
          {upcoming.length > 0 && (
            <div className="flex flex-col gap-3">
              <span className="text-xs text-red-400 uppercase tracking-widest font-semibold">
                Upcoming
              </span>
              {upcoming.map(b => (
                <BookingCard key={b.bookingId} booking={b} onViewEvent={handleViewEvent} />
              ))}
            </div>
          )}

          {upcoming.length === 0 && (
            <div className="w-full bg-gray-900 border border-gray-700 border-dashed rounded-2xl px-4 py-6 flex flex-col items-center gap-2 text-center">
              <span className="text-2xl">🎫</span>
              <span className="text-sm font-semibold text-gray-700">No upcoming bookings</span>
              <span className="text-xs text-gray-400">Book parking for your next event to see it here</span>
            </div>
          )}

          {/* Past bookings */}
          {past.length > 0 && (
            <div className="flex flex-col gap-3">
              <span className="text-xs text-red-400 uppercase tracking-widest font-semibold">
                Past bookings
              </span>
              {past.map(b => (
                <BookingCard key={b.bookingId} booking={b} onViewEvent={handleViewEvent} />
              ))}
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-gray-800 shrink-0">
          <button
            onClick={handleLogout}
            className="w-full text-sm text-gray-500 hover:text-red-400 py-2 transition-colors font-medium"
          >
            Log out
          </button>
        </div>

      </div>
    </div>
  );
}
