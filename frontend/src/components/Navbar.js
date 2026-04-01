import React from 'react';

const navPills = ['For You', 'Parking', 'Monthly', 'Events', 'EV Charging'];

export default function Navbar({ activeNav = 'For You', onNavChange, onSearchOpen, onAuthOpen, isLoggedIn = false, userPhone = '', selectedCity = 'Delhi', onCityChange }) {
  return (
    <nav className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50 shadow-sm" data-testid="navbar">
      <div className="max-w-screen-xl mx-auto px-4 h-16 flex items-center gap-4">
        <a href="/" className="flex items-center gap-1.5 shrink-0" data-testid="navbar-logo">
          <span className="inline-flex items-center justify-center w-7 h-7 rounded-md bg-[#1C1D2B] text-white text-sm font-bold">P</span>
          <span className="text-[#1C1D2B] text-lg font-bold tracking-tight">ParkEase</span>
        </a>
        <button onClick={onCityChange} data-testid="city-selector"
          className="hidden sm:inline-flex items-center gap-1 border border-gray-300 rounded-full px-3 py-1 text-sm text-gray-700 hover:bg-gray-50 shrink-0">
          {selectedCity}
          <svg className="w-3.5 h-3.5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        <div className="flex-1" />
        <div className="hidden md:flex items-center gap-1">
          {navPills.map(pill => (
            <button key={pill} onClick={() => onNavChange?.(pill)} data-testid={`nav-pill-${pill.replace(/\s/g, '-').toLowerCase()}`}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                activeNav === pill ? 'bg-[#E85D04] text-white' : 'text-gray-600 hover:bg-gray-100'
              }`}>
              {pill}
            </button>
          ))}
        </div>
        <button onClick={onSearchOpen} data-testid="search-btn"
          className="p-2 rounded-full text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors" aria-label="Search">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
          </svg>
        </button>
        <button onClick={onAuthOpen} data-testid="auth-btn"
          className={isLoggedIn
            ? 'w-9 h-9 rounded-full bg-[#1C1D2B] text-white text-sm font-bold flex items-center justify-center shrink-0'
            : 'p-2 rounded-full text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors'}
          aria-label={isLoggedIn ? 'Profile' : 'Log in'}>
          {isLoggedIn ? (
            <span>{(userPhone || 'U')[0].toUpperCase()}</span>
          ) : (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 7.5a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 20.25a8.25 8.25 0 0115 0" />
            </svg>
          )}
        </button>
      </div>
    </nav>
  );
}