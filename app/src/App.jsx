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

// ---------------------------------------------------------------------------
// App
// ---------------------------------------------------------------------------
export default function App() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const [rcbBookingData, setRcbBookingData] = useState(null);

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
