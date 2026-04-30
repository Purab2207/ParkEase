import React, { useState } from 'react';
import { Routes, Route, useNavigate, useLocation, useParams } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import AuthModal from './components/AuthModal';
import SearchOverlay from './components/SearchOverlay';
import VenueLandingScreen from './screens/S1_VenueLanding';
import BookingFlowScreen from './screens/S2_BookingFlow';
import BookingConfirmationScreen from './screens/S3_BookingConfirmation';
import RedirectScreen from './screens/S4_RedirectScreen';
import OperatorDashboardScreen from './screens/S5_OperatorDashboard';
import RetentionScreen from './screens/S6_RetentionScreen';

const PATHS = {
  VENUE:        '/',
  BOOKING:      '/booking',
  CONFIRMATION: '/confirmation/:bookingId',
  REDIRECT:     '/redirect',
  DASHBOARD:    '/dashboard',
  RETENTION:    '/retain',
};

// Operator dashboard gate — checks localStorage for a previously-entered key,
// or prompts once. Key compared against REACT_APP_DASHBOARD_KEY (set in .env).
const OPERATOR_KEY = process.env.REACT_APP_DASHBOARD_KEY || 'operator';
const LS_KEY = 'pe_dashboard_key';

function DashboardGate({ children }) {
  const [authed, setAuthed] = React.useState(
    () => localStorage.getItem(LS_KEY) === OPERATOR_KEY
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    const val = e.target.elements.key.value.trim();
    if (val === OPERATOR_KEY) {
      localStorage.setItem(LS_KEY, val);
      setAuthed(true);
    } else {
      e.target.elements.key.value = '';
      e.target.elements.key.placeholder = 'Wrong key — try again';
    }
  };

  if (authed) return children;

  return (
    <div className="min-h-[100dvh] bg-gray-950 flex items-center justify-center px-6">
      <form onSubmit={handleSubmit} className="bg-gray-900 border border-gray-700 rounded-2xl px-8 py-8 flex flex-col gap-4 w-full max-w-xs">
        <div className="flex flex-col gap-1">
          <span className="text-white font-bold text-base">Operator Access</span>
          <span className="text-gray-400 text-xs">Enter the dashboard key to continue</span>
        </div>
        <input
          name="key"
          type="password"
          placeholder="Dashboard key"
          autoFocus
          className="w-full bg-gray-800 border border-gray-600 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-gray-400"
        />
        <button type="submit"
          className="w-full bg-white text-gray-900 font-bold py-3 rounded-xl text-sm hover:bg-gray-100 active:scale-95 transition-all">
          Enter
        </button>
        <button type="button" onClick={() => localStorage.removeItem(LS_KEY)}
          className="text-xs text-gray-600 hover:text-gray-400 text-center">
          Clear saved session
        </button>
      </form>
    </div>
  );
}

const NAVBAR_PATHS = new Set([PATHS.VENUE, PATHS.BOOKING, PATHS.CONFIRMATION, PATHS.REDIRECT, PATHS.RETENTION]);

// 3 lots × 60 bays = 180 total capacity, 30% taken (18 per lot), spread evenly
const LOTS_CONFIG = [
  { id: 'lot-a', label: 'Lot A', prefix: 'A', distanceToGateMetres: 150 },
  { id: 'lot-b', label: 'Lot B', prefix: 'B', distanceToGateMetres: 280 },
  { id: 'lot-c', label: 'Lot C', prefix: 'C', distanceToGateMetres: 420 },
];

function buildInitialLots() {
  return LOTS_CONFIG.map((meta, lotIndex) => {
    // Spread 18 taken bays evenly: step ≈ 3.33, phase-shifted per lot so patterns differ
    const takenSet = new Set();
    const step = 60 / 18;
    const offset = lotIndex * 11;
    for (let i = 0; i < 18; i++) {
      takenSet.add((Math.round(i * step) + offset) % 60);
    }
    const bays = Array.from({ length: 60 }, (_, i) => ({
      pillar_code: `${meta.prefix}-${String(i + 1).padStart(2, '0')}`,
      lot_id: meta.id,
      status: takenSet.has(i) ? 'taken' : 'available',
    }));
    return { ...meta, bays };
  });
}

const ConfirmationRoute = () => {
  const navigate = useNavigate();
  const { bookingId } = useParams();
  return (
    <BookingConfirmationScreen
      bookingId={bookingId || 'PE-2026-DEMO1234'}
      onNavigateToRetention={() => navigate(PATHS.RETENTION)}
    />
  );
};

const DemoNav = ({ parkingFull, onToggleParkingFull, onStartDemo, demoRunning }) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] flex flex-col items-center pb-2 px-4 pointer-events-none">
      <div className="bg-gray-950/95 border border-gray-700 rounded-2xl px-2 py-2 flex items-center gap-0.5 shadow-2xl pointer-events-auto w-full overflow-x-auto max-w-md">
        {[
          { path: PATHS.VENUE,        label: 'S1 Landing', id: 'venue' },
          { path: PATHS.BOOKING,      label: 'S2 Booking', id: 'booking' },
          { path: '/confirmation/PE-2026-DEMO1234', label: 'S3 Confirm', id: 'confirmation' },
          { path: PATHS.REDIRECT,     label: 'S4 Redirect', id: 'redirect' },
          { path: PATHS.DASHBOARD,    label: 'S5 Ops',     id: 'dashboard' },
          { path: PATHS.RETENTION,    label: 'S6 Retain',  id: 'retention' },
        ].map(({ path, label, id }) => (
          <button
            key={path}
            data-testid={`demo-nav-${id}`}
            onClick={() => navigate(path)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              pathname === path || pathname.startsWith(path.split('/').slice(0, 2).join('/') + '/')
                ? 'bg-white text-gray-900'
                : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
          >
            {label}
          </button>
        ))}
        <div className="w-px h-5 bg-gray-700 mx-1 shrink-0" />
        <button
          data-testid="demo-toggle-full"
          onClick={onToggleParkingFull}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap shrink-0 ${
            parkingFull ? 'bg-red-600 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'
          }`}
        >
          {parkingFull ? 'Full' : 'Avail'}
        </button>
      </div>
      <button
        data-testid="demo-start-btn"
        onClick={onStartDemo}
        disabled={demoRunning}
        className={`w-full max-w-md py-1.5 rounded-lg text-[11px] font-bold tracking-wide transition-all pointer-events-auto ${
          demoRunning
            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
            : 'bg-[#1C1D2B] text-white active:scale-95'
        }`}
      >
        {demoRunning ? 'Demo running...' : 'Start Demo'}
      </button>
      <span className="text-[10px] text-gray-600 mt-1 pointer-events-none">Demo mode - ParkEase v0.5</span>
    </div>
  );
};

export default function App() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const [parkingFull, setParkingFull] = useState(false);
  const [selectedVenue, setSelectedVenue] = useState(null);
  const [demoRunning, setDemoRunning] = useState(false);

  const [lots, setLots] = useState(() => buildInitialLots());
  const [lotsLocked, setLotsLocked] = useState(false);
  const [redirectCTATaps, setRedirectCTATaps] = useState(0);

  // All spot counts derive from the single lots state — no hardcoding
  const totalSpots = lots.reduce((sum, l) => sum + l.bays.length, 0);
  const bookedSpots = lots.reduce((sum, l) => sum + l.bays.filter(b => b.status === 'taken').length, 0);
  const spotsRemaining = totalSpots - bookedSpots;
  const fillPercent = Math.round((bookedSpots / totalSpots) * 100);
  const redirectActive = fillPercent >= 90;

  const [isLoggedIn, setIsLoggedIn] = useState(
    () => localStorage.getItem('pe_logged_in') === 'true'
  );
  const [userPhone, setUserPhone] = useState(
    () => localStorage.getItem('pe_phone') || ''
  );
  const [showAuth, setShowAuth] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [activeNav, setActiveNav] = useState('For You');
  const [selectedCity] = useState('Delhi');

  const handleToggleParkingFull = () => {
    setParkingFull(prev => {
      const next = !prev;
      navigate(next ? PATHS.REDIRECT : PATHS.VENUE);
      if (next) {
        setLots(current => current.map(l => ({ ...l, bays: l.bays.map(b => ({ ...b, status: 'taken' })) })));
      } else {
        setLots(buildInitialLots());
      }
      return next;
    });
  };

  const handleBayBooked = (lotId, pillarCode) => {
    setLots(prev => prev.map(l =>
      l.id !== lotId ? l : {
        ...l,
        bays: l.bays.map(b => b.pillar_code === pillarCode ? { ...b, status: 'taken' } : b),
      }
    ));
  };

  const handleRedirectTap = () => setRedirectCTATaps(s => s + 1);
  const handleEmergencyLock = () => setLotsLocked(true);
  const handleEmergencyUnlock = () => setLotsLocked(false);

  const handleLoginSuccess = (phone) => {
    setIsLoggedIn(true);
    setUserPhone(phone);
    setShowAuth(false);
    localStorage.setItem('pe_logged_in', 'true');
    localStorage.setItem('pe_phone', phone);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserPhone('');
    localStorage.removeItem('pe_logged_in');
    localStorage.removeItem('pe_phone');
  };

  const startDemo = () => {
    const flow = [PATHS.VENUE, PATHS.BOOKING, '/confirmation/PE-2026-DEMO1234', PATHS.REDIRECT, PATHS.DASHBOARD, PATHS.RETENTION];
    setDemoRunning(true);
    let i = 0;
    navigate(flow[i]);
    const interval = setInterval(() => {
      i++;
      if (i >= flow.length) {
        clearInterval(interval);
        setDemoRunning(false);
        return;
      }
      navigate(flow[i]);
    }, 4000);
  };

  const showNavbar = NAVBAR_PATHS.has(pathname);

  return (
    <div className="min-h-screen bg-gray-50" data-testid="app-root">
      {showNavbar && (
        <Navbar
          activeNav={activeNav}
          onNavChange={setActiveNav}
          onSearchOpen={() => setShowSearch(true)}
          onAuthOpen={() => (isLoggedIn ? handleLogout() : setShowAuth(true))}
          isLoggedIn={isLoggedIn}
          userPhone={userPhone}
          selectedCity={selectedCity}
          onCityChange={() => {}}
        />
      )}

      <div className={showNavbar ? 'pt-16' : ''}>
        <Routes>
          <Route path={PATHS.VENUE} element={
            <VenueLandingScreen
              parkingFull={parkingFull}
              selectedVenue={selectedVenue}
              onNavigateToBooking={() => navigate(PATHS.BOOKING)}
              onNavigateToRedirect={() => navigate(PATHS.REDIRECT)}
              totalSpots={totalSpots}
              spotsRemaining={spotsRemaining}
            />
          } />
          <Route path={PATHS.BOOKING} element={
            <BookingFlowScreen
              onPaymentSuccess={(bookingId) => navigate(`/confirmation/${bookingId}`)}
              onNavigateBack={() => navigate(PATHS.VENUE)}
              onParkingFull={() => navigate(PATHS.REDIRECT)}
              userPhone={userPhone}
              isLoggedIn={isLoggedIn}
              lots={lots}
              totalSpots={totalSpots}
              spotsRemaining={spotsRemaining}
              lotsLocked={lotsLocked}
              onBayBooked={handleBayBooked}
            />
          } />
          <Route path={PATHS.CONFIRMATION} element={<ConfirmationRoute />} />
          <Route path={PATHS.REDIRECT} element={<RedirectScreen onRedirectTap={handleRedirectTap} />} />
          <Route path={PATHS.DASHBOARD} element={
            <DashboardGate>
            <OperatorDashboardScreen
              lots={lots}
              totalSpots={totalSpots}
              bookedSpots={bookedSpots}
              spotsRemaining={spotsRemaining}
              fillPercent={fillPercent}
              redirectCTATaps={redirectCTATaps}
              redirectActive={redirectActive}
              lotsLocked={lotsLocked}
              onEmergencyLock={handleEmergencyLock}
              onEmergencyUnlock={handleEmergencyUnlock}
            />
            </DashboardGate>
          } />
          <Route path={PATHS.RETENTION} element={<RetentionScreen />} />
          <Route path="*" element={
            <VenueLandingScreen
              onNavigateToBooking={() => navigate(PATHS.BOOKING)}
              onNavigateToRedirect={() => navigate(PATHS.REDIRECT)}
              totalSpots={totalSpots}
              spotsRemaining={spotsRemaining}
            />
          } />
        </Routes>
      </div>

      <DemoNav
        parkingFull={parkingFull}
        onToggleParkingFull={handleToggleParkingFull}
        onStartDemo={startDemo}
        demoRunning={demoRunning}
      />

      <AuthModal
        isOpen={showAuth}
        onClose={() => setShowAuth(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      <SearchOverlay
        isOpen={showSearch}
        onClose={() => setShowSearch(false)}
        onVenueSelect={(venue) => {
          setSelectedVenue(venue);
          setShowSearch(false);
          navigate(PATHS.VENUE);
        }}
      />
    </div>
  );
}
