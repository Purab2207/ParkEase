import React, { useState } from 'react';

const TRENDING_VENUES = [
  { id: 'karan-aujla-jln-2026', name: 'Jawaharlal Nehru Stadium', location: 'Lodhi Road, Delhi', category: 'Events', price: 169 },
  { id: '2', name: 'DLF Cyber Hub', location: 'Gurugram, Haryana', category: 'Parking', price: 80 },
  { id: '3', name: 'Select Citywalk', location: 'Saket, Delhi', category: 'Parking', price: 60 },
  { id: '4', name: 'Arun Jaitley Stadium', location: 'Feroz Shah Kotla, Delhi', category: 'Events', price: 150 },
  { id: '5', name: 'T3 Airport Parking', location: 'Indira Gandhi Airport', category: 'Monthly Pass', price: 2500 },
  { id: '6', name: 'Nexus Select', location: 'Navi Mumbai', category: 'EV Charging', price: 40 },
];

const VenueCard = ({ venue, onSelect }) => (
  <button onClick={onSelect} data-testid={`venue-card-${venue.id}`}
    className="text-left bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
    <div className="h-24 bg-gray-200 relative flex items-center justify-center">
      <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-gray-300">{venue.name.charAt(0)}</div>
      <span className="absolute top-2 left-2 bg-[#1C1D2B] text-white text-xs px-2 py-0.5 rounded-full">{venue.category}</span>
    </div>
    <div className="p-2">
      <p className="text-xs font-semibold text-gray-900 truncate">{venue.name}</p>
      <p className="text-xs text-gray-500 truncate">{venue.location}</p>
      <p className="text-xs font-bold text-gray-900 mt-1">{'\u20B9'}{venue.price}<span className="font-normal text-gray-500">/hr</span></p>
    </div>
  </button>
);

export default function SearchOverlay({ isOpen, onClose, onVenueSelect }) {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  if (!isOpen) return null;

  const filtered = TRENDING_VENUES.filter(v =>
    (v.name.toLowerCase().includes(query.toLowerCase()) || v.location.toLowerCase().includes(query.toLowerCase())) &&
    (activeCategory === 'All' || v.category === activeCategory)
  );

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col overflow-hidden" data-testid="search-overlay">
      <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200 bg-white">
        <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100 text-gray-600" data-testid="search-close-btn">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5" /><path d="M12 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="flex-1 flex items-center gap-2 bg-gray-100 rounded-full px-4 py-2.5">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
            <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
          </svg>
          <input type="text" autoFocus placeholder="Search parking venues..." value={query}
            onChange={e => setQuery(e.target.value)}
            data-testid="search-input"
            className="flex-1 bg-transparent outline-none text-sm text-gray-900 placeholder-gray-400" />
        </div>
        {query && (
          <button onClick={() => setQuery('')} className="text-gray-400 hover:text-gray-600" data-testid="search-clear-btn">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6L6 18" /><path d="M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
      <div className="overflow-x-auto px-4 py-3 border-b border-gray-100">
        <div className="flex gap-2 w-max">
          {['All', 'Parking', 'Monthly Pass', 'Events', 'EV Charging'].map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)}
              data-testid={`category-${cat.replace(/\s/g, '-').toLowerCase()}`}
              className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                activeCategory === cat ? 'bg-[#E85D04] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}>
              {cat}
            </button>
          ))}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        <div className="px-4 py-4">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
            {query.length === 0 ? 'Trending in Delhi' : `${filtered.length} Results`}
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {filtered.map(venue => (
              <VenueCard key={venue.id} venue={venue} onSelect={() => onVenueSelect(venue)} />
            ))}
            {filtered.length === 0 && (
              <div className="col-span-2 text-center py-12 text-gray-400 text-sm">No venues found</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}