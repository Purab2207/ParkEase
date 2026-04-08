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

const DEFAULT_EVENT = 'karan-aujla-jln-2026';

// Paths that show the global navbar
const NAVBAR_PATHS = ['/redirect', '/retain'];

// ---------------------------------------------------------------------------
// Demo Nav — quick jump bar for presentations
// ---------------------------------------------------------------------------
const DemoNav = ({ onStartDemo, demoRunning, parkingFull, onToggleParkingFull }) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const SCREENS = [
    { label: 'S1 Landing',  path: `/events/${DEFAULT_EVENT}` },
    { label: 'S2 Booking',  path: `/events/${DEFAULT_EVENT}/book` },
    { label: 'S3 Confirm',  path: `/confirmation/PE-2026-DEMO1234` },
    { label: 'S4 Redirect', path: '/redirect' },
    { label: 'S6 Retain',   path: '/retain' },
    { label: 'S7 RCB',      path: '/retain/book' },
    { label: 'S8 RCB✓',     path: '/retain/confirm' },
    { label: 'S9 Staff',    path: '/attendant' },
    { label: 'S5 Ops',      path: '/dashboard' },
  ];

  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[390px] z-[100] flex flex-col items-center pb-2 px-4 pointer-events-none">
      <div className="bg-gray-950/95 border border-gray-700 rounded-2xl px-2 py-2 flex items-center gap-0.5 shadow-2xl pointer-events-auto w-full overflow-x-auto">
        {SCREENS.map(({ label, path }) => (
          <button
            key={path}
            onClick={() => navigate(path)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              pathname === path || pathname.startsWith(path + '/')
                ? 'bg-white text-gray-900'
                : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
          >
            {label}
          </button>
        ))}
        <div className="w-px h-5 bg-gray-700 mx-1 shrink-0" />
        <button
          onClick={onToggleParkingFull}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap shrink-0 ${
            parkingFull ? 'bg-red-600 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'
          }`}
        >
          {parkingFull ? '🔴 Full' : 'Avail'}
        </button>
      </div>
      <button
        onClick={onStartDemo}
        disabled={demoRunning}
        className={`w-full max-w-md py-1.5 rounded-lg text-[11px] font-bold tracking-wide transition-all pointer-events-auto ${
          demoRunning ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-[#1C1D2B] text-white active:scale-95'
        }`}
      >
        {demoRunning ? 'Demo running…' : '▶ Start Demo'}
      </button>
      <span className="text-[10px] text-gray-600 mt-1 pointer-events-none">Demo mode · ParkEase v0.6</span>
    </div>
  );
};

// ---------------------------------------------------------------------------
// App
// ---------------------------------------------------------------------------
export default function App() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const [parkingFull, setParkingFull] = useState(false);
  const [demoRunning, setDemoRunning] = useState(false);
  const [rcbBookingData, setRcbBookingData] = useState(null);

  // Auth state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userPhone, setUserPhone] = useState('');
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

  const handleLoginSuccess = (phone) => {
    setIsLoggedIn(true);
    setUserPhone(phone);
    setShowAuth(false);
  };

  const handleToggleParkingFull = () => {
    setParkingFull(prev => {
      const next = !prev;
      navigate(next ? '/redirect' : `/events/${DEFAULT_EVENT}`);
      return next;
    });
  };

  const startDemo = () => {
    const flow = [
      `/events/${DEFAULT_EVENT}`,
      `/events/${DEFAULT_EVENT}/book`,
      `/confirmation/PE-2026-DEMO1234`,
      '/redirect',
      '/retain',
      '/dashboard',
    ];
    setDemoRunning(true);
    let i = 0;
    navigate(flow[i]);
    const interval = setInterval(() => {
      i++;
      if (i >= flow.length) { clearInterval(interval); setDemoRunning(false); return; }
      navigate(flow[i]);
    }, 4000);
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
          {/* Default → Karan Aujla landing */}
          <Route path="/" element={<Navigate to={`/events/${DEFAULT_EVENT}`} replace />} />

          {/* S1 — Venue landing: any event by ID */}
          <Route
            path="/events/:eventId"
            element={
              <VenueLandingScreen
                parkingFull={parkingFull}
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
                isLoggedIn={isLoggedIn}
              />
            }
          />

          {/* S3 — Confirmation */}
          <Route
            path="/confirmation/:bookingId"
            element={<BookingConfirmationScreen />}
          />

          {/* S4 — Redirect to cab */}
          <Route path="/redirect" element={<RedirectScreen />} />

          {/* S5 — Operator dashboard */}
          <Route path="/dashboard" element={<OperatorDashboardScreen />} />

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
                onDone={() => navigate(`/events/${DEFAULT_EVENT}`)}
              />
            }
          />

          {/* S9 — Attendant scanner (ground staff) */}
          <Route path="/attendant" element={<AttendantScannerScreen />} />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to={`/events/${DEFAULT_EVENT}`} replace />} />
        </Routes>
      </div>

      <DemoNav
        onStartDemo={startDemo}
        demoRunning={demoRunning}
        parkingFull={parkingFull}
        onToggleParkingFull={handleToggleParkingFull}
      />

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
          onLogout={() => { setIsLoggedIn(false); setUserPhone(''); }}
        />
      )}
    </div>
    </div>
  );
}
