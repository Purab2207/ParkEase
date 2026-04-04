import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FALLBACK_EVENTS_LIST } from '../api';

// Maps fallback event data into search card format
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
      className="text-left bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow active:scale-95"
    >
      {/* Image placeholder */}
      <div className="h-24 bg-gradient-to-br from-gray-800 to-gray-900 relative flex items-center justify-center">
        <span className="text-4xl font-black text-white/20">{event.name.charAt(0)}</span>
        <div className="absolute inset-0 flex flex-col justify-between p-2">
          <span className="self-start bg-[#1C1D2B] text-white text-[10px] px-2 py-0.5 rounded-full font-semibold">
            Events
          </span>
          <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${isCritical ? 'bg-red-500' : isAlmostFull ? 'bg-amber-400' : 'bg-green-400'}`}
              style={{ width: `${fillPercent}%` }}
            />
          </div>
        </div>
      </div>
      <div className="p-2">
        <p className="text-xs font-bold text-gray-900 truncate">{event.name}</p>
        <p className="text-[10px] text-gray-500 truncate">{event.location}</p>
        <div className="flex items-center justify-between mt-1">
          <p className="text-xs font-bold text-gray-900">
            ₹{event.price}
            <span className="font-normal text-gray-500">/car</span>
          </p>
          <span className={`text-[10px] font-semibold ${isCritical ? 'text-red-500' : isAlmostFull ? 'text-amber-600' : 'text-green-600'}`}>
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
    <div className="fixed inset-0 bg-white z-50 flex flex-col overflow-hidden">
      {/* Top bar */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200 bg-white">
        <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100 text-gray-600">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5" /><path d="M12 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="flex-1 flex items-center gap-2 bg-gray-100 rounded-full px-4 py-2.5">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
            <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
          </svg>
          <input
            type="text"
            autoFocus
            placeholder="Search events, cities, artists..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent outline-none text-sm text-gray-900 placeholder-gray-400"
          />
        </div>
        {query && (
          <button onClick={() => setQuery('')} className="text-gray-400 hover:text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6L6 18" /><path d="M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Results */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
          {query ? `${filtered.length} result${filtered.length !== 1 ? 's' : ''}` : 'Upcoming events'}
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {(query ? filtered : EVENTS).map(event => (
            <EventCard key={event.id} event={event} onSelect={() => handleSelect(event)} />
          ))}
          {query && filtered.length === 0 && (
            <div className="col-span-2 text-center py-12 text-gray-400 text-sm">
              No events found for &ldquo;{query}&rdquo;
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
