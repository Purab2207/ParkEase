import React, { useState } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import AuthModal from './components/AuthModal';
import SearchOverlay from './components/SearchOverlay';
import ProfileModal from './components/ProfileModal';
import VenueLandingScreen from './screens/S1_VenueLanding';
import BookingFlowScreen from './screens/S2_BookingFlow';
import BookingConfirmationScreen from './screens/S3_BookingConfirmation';
import RedirectScreen from './screens/S4_RedirectScreen';
import OperatorDashboardScreen from './screens/S5_OperatorDashboard';
import RetentionScreen from './screens/S6_RetentionScreen';
import RCBBookingScreen from './screens/S7_RCBBooking';
import RCBConfirmationScreen from './screens/S8_RCBConfirmation';
import AttendantScannerScreen from './screens/S9_AttendantScanner';
import EventsListingScreen from './screens/S0_EventsListing';

// Paths that show the global navbar
const NAVBAR_PATHS = ['/redirect', '/retain'];

// Pages where demo chip shows — excludes mid-transaction flows
const DEMO_CHIP_SHOW = ['/events', '/redirect', '/dashboard', '/attendant', '/retain'];
const DEMO_CHIP_HIDE = ['/events/', '/confirmation']; // S2 /book and S3

function DemoChip({ pathname }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const show = DEMO_CHIP_SHOW.some(p => pathname.startsWith(p))
    && !DEMO_CHIP_HIDE.some(p => pathname.includes(p));

  const roles = [
    { label: 'Consumer', icon: '🎪', path: '/events' },
    { label: 'Operator', icon: '📊', path: '/dashboard' },
    { label: 'Staff',    icon: '🔍', path: '/attendant' },
    { label: 'Sports',   icon: '🏏', path: '/retain' },
  ];

  if (!show) return null;

  return (
    <div className="fixed bottom-5 right-4 z-50 flex flex-col items-end gap-2">
      {/* Expanded role menu */}
      {open && (
        <div className="flex flex-col gap-1 bg-[#1C1D2B]/95 backdrop-blur-sm rounded-2xl px-2 py-2 shadow-2xl border border-white/10">
          {roles.map(r => {
            const active = pathname.startsWith(r.path);
            return (
              <button
                key={r.path}
                onClick={() => { navigate(r.path); setOpen(false); }}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all text-xs font-semibold w-full text-left ${
                  active ? 'bg-white text-[#1C1D2B]' : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                <span className="text-base leading-none w-5 text-center">{r.icon}</span>
                <span>{r.label}</span>
                {active && <span className="ml-auto text-[10px] text-[#1C1D2B]/50 font-normal">here</span>}
              </button>
            );
          })}
        </div>
      )}

      {/* Trigger chip */}
      <button
        onClick={() => setOpen(v => !v)}
        className="flex items-center gap-1.5 bg-[#1C1D2B] text-white text-[11px] font-bold px-3 py-2 rounded-full shadow-lg border border-white/10 active:scale-95 transition-all"
      >
        <span className="text-xs">{open ? '✕' : '⚡'}</span>
        <span>Demo</span>
      </button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// App
// ---------------------------------------------------------------------------
export default function App() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const [rcbBookingData, setRcbBookingData] = useState(null);

  // Live booking state — drives S5 metrics in real-time
  const [bookingState, setBookingState] = useState({ bookedSpots: 150, totalSpots: 500, redirectCTATaps: 0 });
  const liveMetrics = {
    bookedSpots:    bookingState.bookedSpots,
    totalSpots:     bookingState.totalSpots,
    spotsRemaining: bookingState.totalSpots - bookingState.bookedSpots,
    fillPercent:    Math.round((bookingState.bookedSpots / bookingState.totalSpots) * 100),
    redirectCTATaps: bookingState.redirectCTATaps,
    redirectActive: Math.round((bookingState.bookedSpots / bookingState.totalSpots) * 100) >= 90,
  };
  const handleBookingComplete = () => setBookingState(s => ({ ...s, bookedSpots: s.bookedSpots + 1 }));
  const handleRedirectTap    = () => setBookingState(s => ({ ...s, redirectCTATaps: s.redirectCTATaps + 1 }));

  // Auth state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userPhone, setUserPhone] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [showAuth, setShowAuth] = useState(false);

  // Search
  const [showSearch, setShowSearch] = useState(false);

  // Profile
  const [showProfile, setShowProfile] = useState(false);

  // Navbar
  const [activeNav, setActiveNav] = useState('For You');
  const [selectedCity] = useState('Delhi');

  const showNavbar = pathname.startsWith('/events') || NAVBAR_PATHS.includes(pathname) ||
    pathname.startsWith('/confirmation') || pathname === '/redirect';

  const handleLoginSuccess = (phone, email) => {
    setIsLoggedIn(true);
    setUserPhone(phone);
    setUserEmail(email);
    setShowAuth(false);
  };

  return (
    <div className="min-h-screen bg-neutral-500 flex justify-center">
    <div className="w-full max-w-[390px] min-h-screen bg-gray-50 relative shadow-2xl overflow-x-hidden">
      {showNavbar && (
        <Navbar
          activeNav={activeNav}
          onNavChange={setActiveNav}
          onSearchOpen={() => setShowSearch(true)}
          onAuthOpen={() => isLoggedIn ? setShowProfile(true) : setShowAuth(true)}
          isLoggedIn={isLoggedIn}
          userPhone={userPhone}
          selectedCity={selectedCity}
          onCityChange={() => {}}
        />
      )}

      <div className={showNavbar ? 'pt-16' : ''}>
        <Routes>
          {/* Default → events listing */}
          <Route path="/" element={<Navigate to="/events" replace />} />
          <Route path="/events" element={<EventsListingScreen />} />

          {/* S1 — Venue landing: any event by ID */}
          <Route
            path="/events/:eventId"
            element={
              <VenueLandingScreen
                isLoggedIn={isLoggedIn}
                userPhone={userPhone}
              />
            }
          />

          {/* S2 — Booking flow: same template, any event */}
          <Route
            path="/events/:eventId/book"
            element={
              <BookingFlowScreen
                userPhone={userPhone}
                userEmail={userEmail}
                isLoggedIn={isLoggedIn}
                onAuthRequired={() => setShowAuth(true)}
                onBookingComplete={handleBookingComplete}
              />
            }
          />

          {/* S3 — Confirmation */}
          <Route
            path="/confirmation/:bookingId"
            element={<BookingConfirmationScreen />}
          />

          {/* S4 — Redirect to cab */}
          <Route path="/redirect" element={<RedirectScreen onRedirectTap={handleRedirectTap} />} />

          {/* S5 — Operator dashboard */}
          <Route path="/dashboard" element={<OperatorDashboardScreen {...liveMetrics} />} />

          {/* S6 — Retention */}
          <Route
            path="/retain"
            element={<RetentionScreen onBookParking={() => navigate('/retain/book')} />}
          />

          {/* S7 — RCB booking (retention flow) */}
          <Route
            path="/retain/book"
            element={
              <RCBBookingScreen
                onConfirm={(data) => { setRcbBookingData(data); navigate('/retain/confirm'); }}
                onNavigateBack={() => navigate('/retain')}
              />
            }
          />

          {/* S8 — RCB confirmation */}
          <Route
            path="/retain/confirm"
            element={
              <RCBConfirmationScreen
                bookingData={rcbBookingData}
                onDone={() => navigate('/events')}
              />
            }
          />

          {/* S9 — Attendant scanner (ground staff) */}
          <Route path="/attendant" element={<AttendantScannerScreen />} />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/events" replace />} />
        </Routes>
      </div>

      <DemoChip pathname={pathname} />

      <AuthModal
        isOpen={showAuth}
        onClose={() => setShowAuth(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      <SearchOverlay isOpen={showSearch} onClose={() => setShowSearch(false)} />

      {showProfile && (
        <ProfileModal
          userPhone={userPhone}
          onClose={() => setShowProfile(false)}
          onLogout={() => { setIsLoggedIn(false); setUserPhone(''); setUserEmail(''); }}
        />
      )}
    </div>
    </div>
  );
}
