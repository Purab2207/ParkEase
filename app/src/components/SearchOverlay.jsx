import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FALLBACK_EVENTS_LIST } from '../api';

const EVENTS = FALLBACK_EVENTS_LIST.map(e => ({
  id: e.event_id,
  name: e.event_name,
  subTitle: e.sub_title,
  location: `${e.venue}, ${e.city}`,
  date: e.date,
  price: e.consumer_price,
  spotsRemaining: e.spots_remaining,
  totalSpots: e.total_spots,
}));

const EventCard = ({ event, onSelect }) => {
  const fillPercent = Math.round(((event.totalSpots - event.spotsRemaining) / event.totalSpots) * 100);
  const isCritical = event.spotsRemaining <= 20;
  const isAlmostFull = event.spotsRemaining <= 100;

  return (
    <button
      onClick={onSelect}
      className="text-left bg-gray-900 rounded-xl border border-gray-800 overflow-hidden hover:border-gray-600 transition-all active:scale-95"
    >
      {/* Image placeholder */}
      <div className="h-24 bg-gradient-to-br from-gray-800 to-gray-900 relative flex items-center justify-center">
        <span className="text-4xl font-black text-white/10">{event.name.charAt(0)}</span>
        <div className="absolute inset-0 flex flex-col justify-between p-2">
          <span className="self-start bg-red-600 text-white text-[10px] px-2 py-0.5 rounded-full font-semibold">
            Events
          </span>
          <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${isCritical ? 'bg-red-500' : isAlmostFull ? 'bg-amber-400' : 'bg-green-400'}`}
              style={{ width: `${fillPercent}%` }}
            />
          </div>
        </div>
      </div>
      <div className="p-2">
        <p className="text-xs font-bold text-white truncate">{event.name}</p>
        <p className="text-[10px] text-gray-400 truncate">{event.location}</p>
        <div className="flex items-center justify-between mt-1">
          <p className="text-xs font-bold text-white">
            ₹{event.price}
            <span className="font-normal text-gray-500">/car</span>
          </p>
          <span className={`text-[10px] font-semibold ${isCritical ? 'text-red-400' : isAlmostFull ? 'text-amber-400' : 'text-green-400'}`}>
            {event.spotsRemaining} left
          </span>
        </div>
      </div>
    </button>
  );
};

export default function SearchOverlay({ isOpen, onClose }) {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const filtered = EVENTS.filter(e =>
    e.name.toLowerCase().includes(query.toLowerCase()) ||
    e.location.toLowerCase().includes(query.toLowerCase()) ||
    e.date.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (event) => {
    onClose();
    navigate(`/events/${event.id}`);
  };

  return (
    <div className="fixed inset-0 bg-gray-950 z-50 flex flex-col overflow-hidden">
      {/* Top bar */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-800 bg-gray-950">
        <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-800 text-gray-400 hover:text-white transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5" /><path d="M12 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="flex-1 flex items-center gap-2 bg-gray-800 rounded-full px-4 py-2.5">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500">
            <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
          </svg>
          <input
            type="text"
            autoFocus
            placeholder="Search events, cities, artists..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent outline-none text-sm text-white placeholder-gray-500"
          />
        </div>
        {query && (
          <button onClick={() => setQuery('')} className="text-gray-500 hover:text-gray-300">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6L6 18" /><path d="M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Results */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <h3 className="text-xs font-bold text-red-400 uppercase tracking-widest mb-3">
          {query ? `${filtered.length} result${filtered.length !== 1 ? 's' : ''}` : 'Upcoming events'}
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {(query ? filtered : EVENTS).map(event => (
            <EventCard key={event.id} event={event} onSelect={() => handleSelect(event)} />
          ))}
          {query && filtered.length === 0 && (
            <div className="col-span-2 text-center py-12 text-gray-500 text-sm">
              No events found for &ldquo;{query}&rdquo;
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
