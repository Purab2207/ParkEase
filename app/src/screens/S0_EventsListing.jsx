import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchEvents, FALLBACK_EVENTS_LIST } from '../api';

const SLIDE_INTERVAL = 4000;

// RCB static entry — bookable via the retention flow, appended to All Events
const RCB_EVENT = {
  event_id: 'rcb-mi-ipl-2026',
  event_name: 'RCB vs MI — IPL 2026',
  sub_title: 'Playoffs · M. Chinnaswamy Stadium',
  venue: 'M. Chinnaswamy Stadium',
  city: 'Bangalore',
  date: 'May 2026',
  total_spots: 300,
  spots_remaining: 87,
  consumer_price: 149,
  hero_image: null,
  _retain: true,
};

const IPL_COMING_SOON = [
  { id: 'csk-kkr', teams: 'CSK vs KKR', label: 'League Stage', venue: 'MA Chidambaram Stadium', city: 'Chennai', date: 'Apr 2026', color: 'from-yellow-500 to-yellow-600', badge: 'CSK' },
  { id: 'mi-srh', teams: 'MI vs SRH', label: 'League Stage', venue: 'Wankhede Stadium', city: 'Mumbai', date: 'Apr 2026', color: 'from-blue-600 to-blue-800', badge: 'MI' },
];

function IPLComingSoonCard({ match }) {
  return (
    <div className={`w-full rounded-2xl bg-gradient-to-r ${match.color} px-4 py-3 flex items-center gap-3 opacity-80`}>
      <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
        <span className="text-xs font-black text-white">{match.badge}</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-white font-bold text-sm truncate">{match.teams} · {match.label}</p>
        <p className="text-white/70 text-xs truncate">{match.venue} · {match.city}</p>
        <p className="text-white/60 text-xs">{match.date}</p>
      </div>
      <div className="shrink-0">
        <span className="text-[10px] text-white/80 bg-white/10 border border-white/20 px-2 py-1 rounded-full font-semibold">
          Notify me
        </span>
      </div>
    </div>
  );
}

export default function EventsListingScreen() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([...FALLBACK_EVENTS_LIST, RCB_EVENT]);
  const [current, setCurrent] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    fetchEvents().then(data => {
      if (data && data.length > 0) setEvents([...data, RCB_EVENT]);
    }).catch(() => {});
  }, []);

  const startInterval = useCallback(() => {
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setCurrent(prev => (prev + 1) % events.length);
    }, SLIDE_INTERVAL);
  }, [events.length]);

  useEffect(() => {
    startInterval();
    return () => clearInterval(intervalRef.current);
  }, [startInterval]);

  function goTo(index) {
    setCurrent(index);
    startInterval();
  }

  function goNext() {
    goTo((current + 1) % events.length);
  }

  function goPrev() {
    goTo((current - 1 + events.length) % events.length);
  }

  // Touch swipe support
  const touchStartX = useRef(null);
  function handleTouchStart(e) { touchStartX.current = e.touches[0].clientX; }
  function handleTouchEnd(e) {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) diff > 0 ? goNext() : goPrev();
    touchStartX.current = null;
  }

  const active = events[current];
  if (!active) return null;

  const activeId = active.event_id ?? active.id;
  const activeName = active.event_name ?? active.name;
  const activePrice = active.consumer_price ?? active.price ?? 169;
  const activeRemaining = active.spots_remaining ?? 0;
  const activeTotal = active.total_spots ?? 500;
  const fillPercent = Math.round(((activeTotal - activeRemaining) / activeTotal) * 100);
  const isCritical = activeRemaining <= 20;

  return (
    <div className="min-h-screen bg-gray-50 pb-8">

      {/* ── Rotating Hero Carousel ── */}
      <div
        className="relative w-full overflow-hidden select-none"
        style={{ height: '58vw', maxHeight: 226 }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Slides — absolute-stacked, fade transition */}
        {events.map((event, i) => {
          const img = event.hero_image;
          const name = event.event_name ?? event.name;
          return (
            <div
              key={event.event_id ?? event.id}
              className="absolute inset-0 transition-opacity duration-700"
              style={{ opacity: i === current ? 1 : 0, zIndex: i === current ? 1 : 0 }}
            >
              {img
                ? <img src={img} alt={name} className="w-full h-full object-cover" />
                : <div className="w-full h-full bg-gray-900 flex items-center justify-center">
                    <span className="text-7xl font-black text-white/10">{name?.charAt(0)}</span>
                  </div>
              }
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            </div>
          );
        })}

        {/* Text overlay — always shows active event */}
        <div className="absolute bottom-0 left-0 right-0 z-10 px-4 pb-3">
          <p className="text-white/70 text-[10px] uppercase tracking-widest mb-0.5">
            {active.date} · {active.city}
          </p>
          <h2 className="text-white text-xl font-bold leading-tight truncate">{activeName}</h2>
          <p className="text-white/70 text-xs truncate">{active.sub_title}</p>

          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-2">
              <span className="text-white font-bold text-sm">₹{activePrice}</span>
              <span className="text-white/60 text-xs">per car</span>
              {isCritical && (
                <span className="bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                  ALMOST FULL
                </span>
              )}
            </div>
            <button
              onClick={() => navigate(`/events/${activeId}`)}
              className="bg-white text-[#1C1D2B] text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-gray-100 active:scale-95 transition-transform"
            >
              Book Parking
            </button>
          </div>
        </div>

        {/* Prev / Next arrows */}
        <button
          onClick={goPrev}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-7 h-7 bg-black/40 hover:bg-black/60 backdrop-blur-sm rounded-full flex items-center justify-center transition-colors"
          aria-label="Previous"
        >
          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={goNext}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-7 h-7 bg-black/40 hover:bg-black/60 backdrop-blur-sm rounded-full flex items-center justify-center transition-colors"
          aria-label="Next"
        >
          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Dot indicators */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-10 flex gap-1.5 mb-0.5">
          {events.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`rounded-full transition-all duration-300 ${
                i === current ? 'w-4 h-1.5 bg-white' : 'w-1.5 h-1.5 bg-white/40'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Fill bar for active event */}
      <div className="h-1 bg-gray-200">
        <div
          className={`h-full transition-all duration-500 ${isCritical ? 'bg-red-500' : 'bg-[#1C1D2B]'}`}
          style={{ width: `${fillPercent}%` }}
        />
      </div>

      {/* ── Section header ── */}
      <div className="px-4 pt-4 pb-2 flex items-center justify-between">
        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest">All Events</h3>
        <span className="text-xs text-gray-400">{events.length} upcoming</span>
      </div>

      {/* ── Event cards ── */}
      <div className="px-4 space-y-3">
        {events.map((event, i) => (
          <EventCard
            key={event.event_id ?? event.id}
            event={event}
            isActive={i === current}
            onSelect={() => event._retain ? navigate('/retain') : navigate(`/events/${event.event_id ?? event.id}`)}
            onHover={() => goTo(i)}
          />
        ))}
      </div>

      {/* ── IPL Coming Soon ── */}
      <div className="px-4 mt-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest">IPL 2026</h3>
          <span className="text-[10px] text-amber-700 bg-amber-100 border border-amber-200 px-2 py-0.5 rounded-full font-semibold">Coming Soon</span>
        </div>
        <div className="space-y-2">
          {IPL_COMING_SOON.map(match => (
            <IPLComingSoonCard key={match.id} match={match} />
          ))}
        </div>
      </div>

      <p className="text-center text-xs text-gray-400 mt-6 mb-2 px-4">
        More events added weekly · Tap the search icon above to explore
      </p>
    </div>
  );
}

function EventCard({ event, isActive, onSelect, onHover }) {
  const total = event.total_spots ?? 500;
  const remaining = event.spots_remaining ?? 0;
  const price = event.consumer_price ?? event.price ?? 169;
  const name = event.event_name ?? event.name;
  const fillPercent = Math.round(((total - remaining) / total) * 100);
  const isCritical = remaining <= 20;
  const isAlmostFull = remaining <= 100;

  return (
    <button
      onClick={onSelect}
      onMouseEnter={onHover}
      className={`w-full text-left bg-white rounded-2xl border overflow-hidden shadow-sm transition-all active:scale-[0.98] ${
        isActive ? 'border-[#1C1D2B] shadow-md' : 'border-gray-200 hover:shadow-md'
      }`}
    >
      <div className="flex gap-3 p-3">
        {/* Thumbnail */}
        <div className={`w-16 h-16 rounded-xl overflow-hidden shrink-0 ${event._retain ? 'bg-gradient-to-br from-red-600 to-red-900' : 'bg-gray-900'}`}>
          {event.hero_image
            ? <img src={event.hero_image} alt={name} className="w-full h-full object-cover" />
            : event._retain
              ? <span className="w-full h-full flex items-center justify-center text-xs font-black text-white">RCB</span>
              : <span className="w-full h-full flex items-center justify-center text-2xl font-black text-white/20">
                  {name?.charAt(0)}
                </span>
          }
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-1">
            <div className="min-w-0">
              <p className="text-sm font-bold text-gray-900 truncate">{name}</p>
              <p className="text-xs text-gray-500 truncate">{event.venue}, {event.city}</p>
              <p className="text-xs text-gray-400">{event.date}</p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-sm font-bold text-gray-900">₹{price}</p>
              <p className="text-[10px] text-gray-400">per car</p>
            </div>
          </div>

          {/* Fill bar */}
          <div className="flex items-center gap-2 mt-2">
            <div className="flex-1 h-1 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${isCritical ? 'bg-red-500' : isAlmostFull ? 'bg-amber-400' : 'bg-green-400'}`}
                style={{ width: `${fillPercent}%` }}
              />
            </div>
            <span className={`text-[10px] font-semibold shrink-0 ${isCritical ? 'text-red-500' : isAlmostFull ? 'text-amber-600' : 'text-green-600'}`}>
              {remaining} left
            </span>
          </div>
        </div>
      </div>
    </button>
  );
}
