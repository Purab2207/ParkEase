import React, { useState } from 'react';
import Navbar from './components/Navbar';
import AuthModal from './components/AuthModal';
import SearchOverlay from './components/SearchOverlay';
import VenueLandingScreen from './screens/S1_VenueLanding';
import BookingFlowScreen from './screens/S2_BookingFlow';
import BookingConfirmationScreen from './screens/S3_BookingConfirmation';
import RedirectScreen from './screens/S4_RedirectScreen';
import OperatorDashboardScreen from './screens/S5_OperatorDashboard';
import RetentionScreen from './screens/S6_RetentionScreen';

const SCREENS = {
  VENUE:        'venue',
  BOOKING:      'booking',
  CONFIRMATION: 'confirmation',
  REDIRECT:     'redirect',
  DASHBOARD:    'dashboard',
  RETENTION:    'retention',
};

// ---------------------------------------------------------------------------
// Demo switcher bar (visible at bottom, not part of final product)
// ---------------------------------------------------------------------------
const DemoNav = ({ current, onNavigate, parkingFull, onToggleParkingFull, onStartDemo, demoRunning }) => (
  <div className="fixed bottom-0 left-0 right-0 z-[100] flex flex-col items-center pb-2 px-4 pointer-events-none">
    <div className="bg-gray-950/95 border border-gray-700 rounded-2xl px-2 py-2 flex items-center gap-0.5 shadow-2xl pointer-events-auto w-full overflow-x-auto max-w-md">
      {[
        { id: SCREENS.VENUE,        label: 'S1 Landing' },
        { id: SCREENS.BOOKING,      label: 'S2 Booking' },
        { id: SCREENS.CONFIRMATION, label: 'S3 Confirm' },
        { id: SCREENS.REDIRECT,     label: 'S4 Redirect' },
        { id: SCREENS.DASHBOARD,    label: 'S5 Ops' },
        { id: SCREENS.RETENTION,    label: 'S6 Retain' },
      ].map(({ id, label }) => (
        <button
          key={id}
          onClick={() => onNavigate(id)}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            current === id
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
        demoRunning
          ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
          : 'bg-[#1C1D2B] text-white active:scale-95'
      }`}
    >
      {demoRunning ? 'Demo running…' : '▶ Start Demo'}
    </button>
    <span className="text-[10px] text-gray-600 mt-1 pointer-events-none">Demo mode · ParkEase v0.5</span>
  </div>
);

// ---------------------------------------------------------------------------
// App
// ---------------------------------------------------------------------------
export default function App() {
  // Screen routing
  const [currentScreen, setCurrentScreen] = useState(SCREENS.VENUE);
  const [parkingFull, setParkingFull]     = useState(false);
  const [selectedVenue, setSelectedVenue] = useState(null);
  const [demoRunning, setDemoRunning] = useState(false);

  // Auth state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userPhone, setUserPhone]   = useState('');
  const [showAuth, setShowAuth]     = useState(false);

  // Search
  const [showSearch, setShowSearch] = useState(false);

  // Navbar
  const [activeNav, setActiveNav]       = useState('For You');
  const [selectedCity, setSelectedCity] = useState('Delhi');

  const navigate = (screen) => setCurrentScreen(screen);

  const handleToggleParkingFull = () => {
    setParkingFull(prev => {
      const next = !prev;
      setCurrentScreen(next ? SCREENS.REDIRECT : SCREENS.VENUE);
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
    const flow = [
      SCREENS.VENUE,
      SCREENS.BOOKING,
      SCREENS.CONFIRMATION,
      SCREENS.REDIRECT,
      SCREENS.DASHBOARD,
      SCREENS.RETENTION,
    ];
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

  // Screens that show the Navbar
  const showNavbar = [SCREENS.VENUE, SCREENS.BOOKING, SCREENS.CONFIRMATION, SCREENS.REDIRECT, SCREENS.RETENTION].includes(currentScreen);
  // Dashboard has its own header
  const navbarOffset = showNavbar ? 'pt-16' : '';

  const renderScreen = () => {
    switch (currentScreen) {
      case SCREENS.VENUE:
        return (
          <VenueLandingScreen
            parkingFull={parkingFull}
            selectedVenue={selectedVenue}
            onNavigateToBooking={() => navigate(SCREENS.BOOKING)}
            onNavigateToRedirect={() => navigate(SCREENS.REDIRECT)}
          />
        );
      case SCREENS.BOOKING:
        return (
          <BookingFlowScreen
            onPaymentSuccess={() => navigate(SCREENS.CONFIRMATION)}
            onNavigateBack={() => navigate(SCREENS.VENUE)}
            onParkingFull={() => navigate(SCREENS.REDIRECT)}
            userPhone={userPhone}
            isLoggedIn={isLoggedIn}
          />
        );
      case SCREENS.CONFIRMATION:
        return (
          <BookingConfirmationScreen
            bookingId="PE-2026-12A9KD"
            onNavigateToRetention={() => navigate(SCREENS.RETENTION)}
          />
        );
      case SCREENS.REDIRECT:
        return <RedirectScreen />;
      case SCREENS.DASHBOARD:
        return <OperatorDashboardScreen />;
      case SCREENS.RETENTION:
        return <RetentionScreen />;
      default:
        return <VenueLandingScreen onNavigateToBooking={() => navigate(SCREENS.BOOKING)} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Global Navbar */}
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

      {/* Page content — offset below fixed navbar */}
      <div className={navbarOffset}>
        {renderScreen()}
      </div>

      {/* Demo switcher */}
      <DemoNav
        current={currentScreen}
        onNavigate={navigate}
        parkingFull={parkingFull}
        onToggleParkingFull={handleToggleParkingFull}
        onStartDemo={startDemo}
        demoRunning={demoRunning}
      />

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuth}
        onClose={() => setShowAuth(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* Search Overlay */}
      <SearchOverlay
        isOpen={showSearch}
        onClose={() => setShowSearch(false)}
        onVenueSelect={(venue) => {
          setSelectedVenue(venue);
          setShowSearch(false);
          navigate(SCREENS.VENUE);
        }}
      />
    </div>
  );
}
