import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchEvents, FALLBACK_EVENTS_LIST } from '../api';

export default function EventsListingScreen() {
  const navigate = useNavigate();
  const [events, setEvents] = useState(FALLBACK_EVENTS_LIST);

  useEffect(() => {
    fetchEvents().then(data => {
      if (data && data.length > 0) setEvents(data);
    }).catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      {/* Hero */}
      <div className="bg-[#1C1D2B] px-4 pt-6 pb-8">
        <p className="text-white/60 text-xs uppercase tracking-widest mb-1">Events near you</p>
        <h1 className="text-white text-2xl font-bold leading-tight">
          Book your parking<br />before it sells out.
        </h1>
      </div>

      {/* Event cards */}
      <div className="px-4 -mt-4 space-y-3">
        {events.map(event => (
          <EventCard
            key={event.event_id ?? event.id}
            event={event}
            onSelect={() => navigate(`/events/${event.event_id ?? event.id}`)}
          />
        ))}
      </div>

      <p className="text-center text-xs text-gray-400 mt-8">
        More events coming soon · <span className="text-indigo-500">Get notified</span>
      </p>
    </div>
  );
}

function EventCard({ event, onSelect }) {
  const total = event.total_spots ?? 500;
  const remaining = event.spots_remaining ?? 0;
  const price = event.consumer_price ?? event.price ?? 169;
  const fillPercent = Math.round(((total - remaining) / total) * 100);
  const isCritical = remaining <= 20;
  const isAlmostFull = remaining <= 100;

  return (
    <button
      onClick={onSelect}
      className="w-full text-left bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow active:scale-[0.98]"
    >
      {/* Hero image */}
      <div className="h-40 relative overflow-hidden bg-gray-900">
        {event.hero_image
          ? <img src={event.hero_image} alt={event.event_name ?? event.name} className="w-full h-full object-cover" />
          : <span className="absolute inset-0 flex items-center justify-center text-6xl font-black text-white/10">
              {(event.event_name ?? event.name ?? '?').charAt(0)}
            </span>
        }
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-3">
          <p className="text-white font-bold text-lg leading-tight">{event.event_name ?? event.name}</p>
          <p className="text-white/80 text-xs">{event.sub_title}</p>
        </div>
        {isCritical && (
          <span className="absolute top-3 right-3 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
            ALMOST FULL
          </span>
        )}
      </div>

      {/* Details */}
      <div className="px-4 py-3">
        <div className="flex items-start justify-between gap-2 mb-3">
          <div>
            <p className="text-sm text-gray-700 font-medium">{event.venue}</p>
            <p className="text-xs text-gray-500">{event.city} · {event.date}</p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-lg font-bold text-gray-900">₹{price}</p>
            <p className="text-[10px] text-gray-400">per car</p>
          </div>
        </div>

        {/* Fill bar */}
        <div className="flex items-center gap-2">
          <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${isCritical ? 'bg-red-500' : isAlmostFull ? 'bg-amber-400' : 'bg-green-400'}`}
              style={{ width: `${fillPercent}%` }}
            />
          </div>
          <span className={`text-xs font-semibold shrink-0 ${isCritical ? 'text-red-500' : isAlmostFull ? 'text-amber-600' : 'text-green-600'}`}>
            {remaining} spots left
          </span>
        </div>
      </div>
    </button>
  );
}
