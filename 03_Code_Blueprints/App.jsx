import React, { useState } from 'react';
import VenueLandingScreen from './S1_VenueLanding';
import BookingFlowScreen from './S2_BookingFlow';
import BookingConfirmationScreen from './S3_BookingConfirmation';
import RedirectScreen from './S4_RedirectScreen';
import OperatorDashboardScreen from './S5_OperatorDashboard';

// ----------------------------------------------------------------------------
// ParkEase Prototype — Demo Router
// Phase 4: Prototype Validation
// 5 screens wired for demo to event organiser contacts
//
// Consumer journey (Rahul / Arjun / Priya):
//   venue → booking → confirmation
//   venue → redirect  (when parking full)
//
// Operator journey (Siddharth):
//   /dashboard → operator view
// ----------------------------------------------------------------------------

const SCREENS = {
  VENUE:        'venue',
  BOOKING:      'booking',
  CONFIRMATION: 'confirmation',
  REDIRECT:     'redirect',
  DASHBOARD:    'dashboard',
};

// Demo nav bar — visible during demo to switch screens instantly
// Not part of the real product — prototype only
const DemoNav = ({ current, onNavigate, parkingFull, onToggleParkingFull }) => (
  <div className="fixed bottom-0 left-0 right-0 z-50 flex flex-col items-center pb-2 pointer-events-none">
    <div className="bg-gray-950/95 border border-gray-700 rounded-2xl px-3 py-2 flex items-center gap-1 shadow-2xl pointer-events-auto max-w-[420px] w-full mx-4 overflow-x-auto">
      {[
        { id: SCREENS.VENUE,        label: 'S1' },
        { id: SCREENS.BOOKING,      label: 'S2' },
        { id: SCREENS.CONFIRMATION, label: 'S3' },
        { id: SCREENS.REDIRECT,     label: 'S4' },
        { id: SCREENS.DASHBOARD,    label: 'S5' },
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
      {/* Demo toggle — flips parking full state for live demo */}
      <button
        onClick={onToggleParkingFull}
        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap shrink-0 ${
          parkingFull
            ? 'bg-red-600 text-white'
            : 'text-gray-400 hover:text-white hover:bg-gray-800'
        }`}
      >
        {parkingFull ? '🔴 Full' : 'Avail'}
      </button>
    </div>
    <span className="text-xs text-gray-600 mt-1 pointer-events-none">
      Demo nav — prototype only
    </span>
  </div>
);

export default function App() {
  const [currentScreen, setCurrentScreen] = useState(SCREENS.VENUE);
  const [parkingFull, setParkingFull] = useState(false);

  const navigate = (screen) => setCurrentScreen(screen);

  const handleToggleParkingFull = () => {
    setParkingFull(prev => {
      const next = !prev;
      // Auto-navigate to redirect screen when parking flipped to full
      if (next) setCurrentScreen(SCREENS.REDIRECT);
      else setCurrentScreen(SCREENS.VENUE);
      return next;
    });
  };

  // Navigation handlers passed as props to screens
  const consumerNav = {
    onNavigateToBooking:      () => navigate(SCREENS.BOOKING),
    onNavigateToConfirmation: () => navigate(SCREENS.CONFIRMATION),
    onNavigateToRedirect:     () => navigate(SCREENS.REDIRECT),
    onNavigateToVenue:        () => navigate(SCREENS.VENUE),
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case SCREENS.VENUE:
        return (
          <VenueLandingScreen
            parkingFull={parkingFull}
            onNavigateToBooking={consumerNav.onNavigateToBooking}
            onNavigateToRedirect={consumerNav.onNavigateToRedirect}
          />
        );
      case SCREENS.BOOKING:
        return (
          <BookingFlowScreen
            onPaymentSuccess={consumerNav.onNavigateToConfirmation}
            onNavigateBack={consumerNav.onNavigateToVenue}
            onParkingFull={consumerNav.onNavigateToRedirect}
          />
        );
      case SCREENS.CONFIRMATION:
        return <BookingConfirmationScreen bookingId="pe-2026-karan-aujla-b18" />;
      case SCREENS.REDIRECT:
        return <RedirectScreen />;
      case SCREENS.DASHBOARD:
        return <OperatorDashboardScreen />;
      default:
        return <VenueLandingScreen {...consumerNav} />;
    }
  };

  return (
    <div className="relative">
      {/* Active screen */}
      {renderScreen()}

      {/* Demo navigation overlay */}
      <DemoNav
        current={currentScreen}
        onNavigate={navigate}
        parkingFull={parkingFull}
        onToggleParkingFull={handleToggleParkingFull}
      />
    </div>
  );
}
