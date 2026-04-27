import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchEvents, FALLBACK_EVENTS_LIST, FALLBACK_EVENTS } from '../api';

const SLIDE_INTERVAL = 4000;

const RCB_EVENT = {
  event_id: 'rcb-mi-ipl-2026',
  event_name: 'RCB vs MI',
  sub_title: 'IPL 2026 Playoffs · M. Chinnaswamy Stadium',
  venue: 'M. Chinnaswamy Stadium',
  city: 'Bangalore',
  date: 'May 2026',
  total_spots: 300,
  spots_remaining: 87,
  consumer_price: 149,
  hero_image: null,
  _gradient: { from: '#991B1B', to: '#3B0000', label: 'RCB' },
  _retain: true,
};

// IPL events pinned with team-colour gradients (not seeded in Supabase)
const STATIC_IPL = [
  { ...FALLBACK_EVENTS['csk-kkr-ipl-2026'], hero_image: null, _gradient: { from: '#CA8A04', to: '#78350F', label: 'CSK' } },
  { ...FALLBACK_EVENTS['mi-srh-ipl-2026'],  hero_image: null, _gradient: { from: '#1D4ED8', to: '#0F172A', label: 'MI'  } },
  RCB_EVENT,
];

const CONCERT_IDS = ['karan-aujla-jln-2026', 'arijit-singh-dy-patil-2026', 'coldplay-nms-2026', 'diljit-dosanjh-pca-2026'];
const IPL_IDS = ['rcb-mi-ipl-2026', 'csk-kkr-ipl-2026', 'mi-srh-ipl-2026'];

export default function EventsListingScreen() {
  const navigate = useNavigate();
  const [allEvents, setAllEvents] = useState([]);
  const [current, setCurrent] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    fetchEvents().then(data => {
      const concerts = data && data.length > 0 ? data : FALLBACK_EVENTS_LIST;
      setAllEvents([...concerts, ...STATIC_IPL]);
    }).catch(() => setAllEvents([...FALLBACK_EVENTS_LIST, ...STATIC_IPL]));
  }, []);

  const concerts = allEvents.filter(e => CONCERT_IDS.includes(e.event_id ?? e.id));
  const iplEvents = allEvents.filter(e => IPL_IDS.includes(e.event_id ?? e.id));
  const heroEvents = [...concerts, ...iplEvents];

  const startInterval = useCallback(() => {
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setCurrent(prev => (prev + 1) % Math.max(heroEvents.length, 1));
    }, SLIDE_INTERVAL);
  }, [heroEvents.length]);

  useEffect(() => {
    startInterval();
    return () => clearInterval(intervalRef.current);
  }, [startInterval]);

  function goTo(index) { setCurrent(index); startInterval(); }
  function goNext() { goTo((current + 1) % heroEvents.length); }
  function goPrev() { goTo((current - 1 + heroEvents.length) % heroEvents.length); }

  const touchStartX = useRef(null);
  function handleTouchStart(e) { touchStartX.current = e.touches[0].clientX; }
  function handleTouchEnd(e) {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) diff > 0 ? goNext() : goPrev();
    touchStartX.current = null;
  }

  const active = heroEvents[current];

  if (!active) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-[#1C1D2B] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const activeId = active.event_id ?? active.id;
  const activeName = active.event_name ?? active.name;
  const activePrice = active.consumer_price ?? active.price ?? 149;
  const activeRemaining = active.spots_remaining ?? 0;
  const activeTotal = active.total_spots ?? 500;
  const fillPercent = Math.round(((activeTotal - activeRemaining) / activeTotal) * 100);
  const isCritical = activeRemaining <= 20;

  function handleEventTap(event) {
    if (event._retain) navigate('/retain');
    else navigate(`/events/${event.event_id ?? event.id}`);
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-8">

      {/* ── Hero Carousel ── */}
      <div
        className="relative w-full overflow-hidden select-none"
        style={{ height: '58vw', maxHeight: 226 }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {heroEvents.map((event, i) => {
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
                : event._gradient
                  ? <div className="w-full h-full flex items-center justify-center"
                      style={{ background: `linear-gradient(135deg, ${event._gradient.from}, ${event._gradient.to})` }}>
                      <span className="text-8xl font-black text-white/10">{event._gradient.label}</span>
                    </div>
                  : <div className="w-full h-full bg-gray-900 flex items-center justify-center">
                      <span className="text-7xl font-black text-white/10">{name?.charAt(0)}</span>
                    </div>
              }
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            </div>
          );
        })}

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
                <span className="bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">ALMOST FULL</span>
              )}
            </div>
            <button
              onClick={() => handleEventTap(active)}
              className="bg-white text-[#1C1D2B] text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-gray-100 active:scale-95 transition-transform"
            >
              Book Parking
            </button>
          </div>
        </div>

        <button onClick={goPrev} className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-7 h-7 bg-black/40 hover:bg-black/60 backdrop-blur-sm rounded-full flex items-center justify-center transition-colors" aria-label="Previous">
          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
        </button>
        <button onClick={goNext} className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-7 h-7 bg-black/40 hover:bg-black/60 backdrop-blur-sm rounded-full flex items-center justify-center transition-colors" aria-label="Next">
          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
        </button>

        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-10 flex gap-1.5 mb-0.5">
          {heroEvents.map((_, i) => (
            <button key={i} onClick={() => goTo(i)}
              className={`rounded-full transition-all duration-300 ${i === current ? 'w-4 h-1.5 bg-white' : 'w-1.5 h-1.5 bg-white/40'}`}
            />
          ))}
        </div>
      </div>

      {/* Fill bar */}
      <div className="h-1 bg-gray-200">
        <div className={`h-full transition-all duration-500 ${isCritical ? 'bg-red-500' : 'bg-[#1C1D2B]'}`} style={{ width: `${fillPercent}%` }} />
      </div>

      {/* ── Concerts Row ── */}
      <HorizontalRow
        title="Concerts"
        count={concerts.length}
        events={concerts}
        onTap={handleEventTap}
      />

      {/* ── IPL 2026 Row ── */}
      <HorizontalRow
        title="IPL 2026"
        count={iplEvents.length}
        events={iplEvents}
        onTap={handleEventTap}
        badge="LIVE SOON"
      />

      <p className="text-center text-xs text-gray-400 mt-6 mb-2 px-4">
        More events added weekly · Tap the search icon above to explore
      </p>
    </div>
  );
}

function HorizontalRow({ title, count, events, onTap, badge }) {
  return (
    <div className="mt-5">
      <div className="px-4 flex items-center gap-2 mb-3">
        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest">{title}</h3>
        {badge && (
          <span className="text-[9px] text-amber-700 bg-amber-100 border border-amber-200 px-2 py-0.5 rounded-full font-semibold">{badge}</span>
        )}
        <span className="ml-auto text-xs text-gray-400">{count} events</span>
      </div>
      <div className="flex gap-3 overflow-x-auto px-4 pb-2 scrollbar-hide snap-x snap-mandatory">
        {events.map(event => (
          <EventCard key={event.event_id ?? event.id} event={event} onTap={onTap} />
        ))}
      </div>
    </div>
  );
}

function EventCard({ event, onTap }) {
  const name = event.event_name ?? event.name;
  const price = event.consumer_price ?? event.price ?? 149;
  const remaining = event.spots_remaining ?? 0;
  const total = event.total_spots ?? 500;
  const fillPercent = Math.round(((total - remaining) / total) * 100);
  const isCritical = remaining <= 20;
  const isAlmost = remaining <= 100;
  const spotsColor = isCritical ? 'bg-red-500' : isAlmost ? 'bg-amber-400' : 'bg-green-400';
  const urgencyLabel = isCritical ? 'ALMOST FULL' : `${remaining} left`;
  const urgencyText = isCritical ? 'text-red-500' : isAlmost ? 'text-amber-500' : 'text-green-500';

  return (
    <button
      onClick={() => onTap(event)}
      className="shrink-0 snap-start w-40 rounded-2xl overflow-hidden shadow-sm active:scale-95 transition-transform relative"
      style={{ height: 200 }}
    >
      {/* Background image or team gradient */}
      {event.hero_image
        ? <img src={event.hero_image} alt={name} className="absolute inset-0 w-full h-full object-cover" />
        : <div className="absolute inset-0"
            style={event._gradient
              ? { background: `linear-gradient(160deg, ${event._gradient.from}, ${event._gradient.to})` }
              : { background: '#111827' }
            }
          />
      }

      {/* Team badge watermark for IPL cards */}
      {event._gradient && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="text-5xl font-black text-white/10">{event._gradient.label}</span>
        </div>
      )}

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

      {/* Price badge top-left */}
      <div className="absolute top-2 left-2 bg-black/50 backdrop-blur-sm px-2 py-0.5 rounded-full">
        <span className="text-white text-[10px] font-bold">₹{price}</span>
      </div>

      {/* Urgency badge top-right */}
      {isCritical && (
        <div className="absolute top-2 right-2 bg-red-500 px-2 py-0.5 rounded-full">
          <span className="text-white text-[8px] font-bold">FULL SOON</span>
        </div>
      )}

      {/* Bottom info */}
      <div className="absolute bottom-0 left-0 right-0 px-2.5 pb-2.5">
        <p className="text-white font-bold text-xs leading-tight truncate">{name}</p>
        <p className="text-white/60 text-[10px] truncate">{event.city}</p>
        <p className="text-white/50 text-[9px] mb-1.5">{event.date}</p>

        {/* Fill bar */}
        <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
          <div className={`h-full rounded-full ${spotsColor}`} style={{ width: `${fillPercent}%` }} />
        </div>
        <p className={`text-[9px] font-semibold mt-0.5 ${urgencyText}`}>{urgencyLabel}</p>
      </div>
    </button>
  );
}
