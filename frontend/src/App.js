import React, { useState } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
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
  CONFIRMATION: '/confirmation',
  REDIRECT:     '/redirect',
  DASHBOARD:    '/dashboard',
  RETENTION:    '/retain',
};

const NAVBAR_PATHS = new Set([PATHS.VENUE, PATHS.BOOKING, PATHS.CONFIRMATION, PATHS.REDIRECT, PATHS.RETENTION]);

// Reads bookingId from navigation state so App doesn't need to hold it.
const ConfirmationRoute = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  return (
    <BookingConfirmationScreen
      bookingId={state?.bookingId || 'PE-2026-DEMO1234'}
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
          { path: PATHS.CONFIRMATION, label: 'S3 Confirm', id: 'confirmation' },
          { path: PATHS.REDIRECT,     label: 'S4 Redirect', id: 'redirect' },
          { path: PATHS.DASHBOARD,    label: 'S5 Ops',     id: 'dashboard' },
          { path: PATHS.RETENTION,    label: 'S6 Retain',  id: 'retention' },
        ].map(({ path, label, id }) => (
          <button
            key={path}
            data-testid={`demo-nav-${id}`}
            onClick={() => navigate(path)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              pathname === path
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

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userPhone, setUserPhone] = useState('');
  const [showAuth, setShowAuth] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  const [activeNav, setActiveNav] = useState('For You');
  const [selectedCity] = useState('Delhi');

  const handleToggleParkingFull = () => {
    setParkingFull(prev => {
      const next = !prev;
      navigate(next ? PATHS.REDIRECT : PATHS.VENUE);
      return next;
    });
  };

  const handleLoginSuccess = (phone) => {
    setIsLoggedIn(true);
    setUserPhone(phone);
    setShowAuth(false);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserPhone('');
  };

  const startDemo = () => {
    const flow = [PATHS.VENUE, PATHS.BOOKING, PATHS.CONFIRMATION, PATHS.REDIRECT, PATHS.DASHBOARD, PATHS.RETENTION];
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
            />
          } />
          <Route path={PATHS.BOOKING} element={
            <BookingFlowScreen
              onPaymentSuccess={(bookingId) => navigate(PATHS.CONFIRMATION, { state: { bookingId } })}
              onNavigateBack={() => navigate(PATHS.VENUE)}
              onParkingFull={() => navigate(PATHS.REDIRECT)}
              userPhone={userPhone}
              isLoggedIn={isLoggedIn}
            />
          } />
          <Route path={PATHS.CONFIRMATION} element={<ConfirmationRoute />} />
          <Route path={PATHS.REDIRECT} element={<RedirectScreen />} />
          <Route path={PATHS.DASHBOARD} element={<OperatorDashboardScreen />} />
          <Route path={PATHS.RETENTION} element={<RetentionScreen />} />
          <Route path="*" element={
            <VenueLandingScreen
              onNavigateToBooking={() => navigate(PATHS.BOOKING)}
              onNavigateToRedirect={() => navigate(PATHS.REDIRECT)}
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
