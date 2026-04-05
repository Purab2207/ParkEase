import React, { useState, useEffect } from 'react';

// S9 — Attendant Scanner (Ground Staff View)
// Used by parking attendants at each gate/zone during events.
// Flow: Shift login → Zone select → Scan QR → Match/Mismatch/Bay Unavailable → Mark Arrived
// All scans append to audit log → feeds S5 compliance report.

// ----------------------------------------------------------------------------
// ICONS
// ----------------------------------------------------------------------------
const ScanIcon = () => (
  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
      d="M3 7V5a2 2 0 012-2h2M17 3h2a2 2 0 012 2v2M21 17v2a2 2 0 01-2 2h-2M7 21H5a2 2 0 01-2-2v-2" />
    <rect x="7" y="7" width="4" height="4" rx="0.5" strokeWidth={2} />
    <rect x="13" y="7" width="4" height="4" rx="0.5" strokeWidth={2} />
    <rect x="7" y="13" width="4" height="4" rx="0.5" strokeWidth={2} />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h4M15 13v4" />
  </svg>
);

const CheckIcon = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
  </svg>
);

const XIcon = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const AlertIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>
);

const CarIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10l2 2h8l2-2zM13 16l2-2h3l1-5H13v7z" />
  </svg>
);

const UserIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const MapPinIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const SwapIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
  </svg>
);

// ----------------------------------------------------------------------------
// DEMO DATA — 3 scan scenarios to cycle through in demo mode
// ----------------------------------------------------------------------------
const DEMO_ZONES = [
  { id: 'gate-a', label: 'Gate A — North Lot  (A01–A60)' },
  { id: 'gate-b', label: 'Gate B — North Lot  (B01–B60)' },
  { id: 'gate-c', label: 'Gate C — South Lot  (C01–C40)' },
];

const DEMO_SCANS = [
  {
    scenario: 'match',
    bookingId: 'PE-2026-DEMO1234',
    driverName: 'Rahul Mehta',
    vehicleNo: 'DL 3C AB 1234',
    scannedVehicleNo: 'DL 3C AB 1234',   // matches — green path
    assignedBay: 'B-18',
    lotName: 'JLN North Lot',
    gate: 'Gate 2',
    entryWindow: '5:30–7:00 PM',
    eventName: 'Karan Aujla',
    bayAvailable: true,
  },
  {
    scenario: 'mismatch',
    bookingId: 'PE-2026-DEMO5678',
    driverName: 'Priya Sharma',
    vehicleNo: 'MH 02 BK 9090',
    scannedVehicleNo: 'MH 02 BK 3311',  // different plate — mismatch
    assignedBay: 'A-07',
    lotName: 'JLN North Lot',
    gate: 'Gate 1',
    entryWindow: '5:30–7:00 PM',
    eventName: 'Karan Aujla',
    bayAvailable: true,
  },
  {
    scenario: 'unavailable',
    bookingId: 'PE-2026-DEMO9012',
    driverName: 'Arjun Nair',
    vehicleNo: 'KA 05 MN 7766',
    scannedVehicleNo: 'KA 05 MN 7766',  // matches — but bay blocked
    assignedBay: 'C-22',
    lotName: 'JLN South Lot',
    gate: 'Gate 4',
    entryWindow: '5:30–7:00 PM',
    eventName: 'Karan Aujla',
    bayAvailable: false,
    alternateBays: ['C-23', 'C-25', 'C-31'],
  },
];

// ----------------------------------------------------------------------------
// SHIFT LOGIN SCREEN
// ----------------------------------------------------------------------------
const ShiftLogin = ({ onLoginSuccess }) => {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [zone, setZone] = useState('');
  const [step, setStep] = useState('phone'); // phone | otp | zone

  const handleSendOtp = () => {
    if (phone.length >= 10) setStep('otp');
  };

  const handleVerifyOtp = () => {
    if (otp === '1234' || otp.length === 4) setStep('zone');
  };

  const handleStartShift = () => {
    if (zone) onLoginSuccess({ phone, zone });
  };

  return (
    <div className="min-h-[100dvh] bg-gray-950 flex flex-col items-center justify-center px-6 gap-6">
      {/* Logo */}
      <div className="flex flex-col items-center gap-2 mb-2">
        <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-lg">
          <ScanIcon />
        </div>
        <h1 className="text-white text-xl font-bold tracking-tight">ParkEase Staff</h1>
        <p className="text-gray-400 text-sm">Attendant login · Shift start</p>
      </div>

      {step === 'phone' && (
        <div className="w-full flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-gray-400 text-xs font-semibold uppercase tracking-widest">Mobile number</label>
            <div className="flex items-center bg-gray-900 border border-gray-700 rounded-2xl px-4 gap-2">
              <span className="text-gray-400 text-sm font-semibold">+91</span>
              <div className="w-px h-5 bg-gray-700" />
              <input
                type="tel"
                maxLength={10}
                value={phone}
                onChange={e => setPhone(e.target.value.replace(/\D/g, ''))}
                placeholder="Enter your number"
                className="flex-1 bg-transparent py-4 text-white text-base outline-none placeholder:text-gray-600"
              />
            </div>
          </div>
          <button
            onClick={handleSendOtp}
            disabled={phone.length < 10}
            className="w-full bg-white text-gray-900 font-bold text-base rounded-2xl py-4 disabled:opacity-40 active:scale-95 transition-all"
          >
            Send OTP
          </button>
          <p className="text-center text-gray-600 text-xs">Demo: enter any 10-digit number</p>
        </div>
      )}

      {step === 'otp' && (
        <div className="w-full flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-gray-400 text-xs font-semibold uppercase tracking-widest">Enter OTP</label>
            <p className="text-gray-500 text-xs">Sent to +91 {phone}</p>
            <input
              type="tel"
              maxLength={4}
              value={otp}
              onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
              placeholder="4-digit OTP"
              className="w-full bg-gray-900 border border-gray-700 rounded-2xl px-4 py-4 text-white text-xl font-bold text-center tracking-[0.4em] outline-none placeholder:text-gray-600 placeholder:tracking-normal placeholder:text-base placeholder:font-normal"
            />
            <p className="text-center text-gray-600 text-xs">Demo OTP: 1234</p>
          </div>
          <button
            onClick={handleVerifyOtp}
            disabled={otp.length < 4}
            className="w-full bg-white text-gray-900 font-bold text-base rounded-2xl py-4 disabled:opacity-40 active:scale-95 transition-all"
          >
            Verify
          </button>
        </div>
      )}

      {step === 'zone' && (
        <div className="w-full flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-gray-400 text-xs font-semibold uppercase tracking-widest">Your zone for this shift</label>
            <div className="flex flex-col gap-2">
              {DEMO_ZONES.map(z => (
                <button
                  key={z.id}
                  onClick={() => setZone(z.label)}
                  className={`w-full text-left px-4 py-3.5 rounded-2xl border text-sm font-semibold transition-all active:scale-95 ${
                    zone === z.label
                      ? 'bg-white text-gray-900 border-white'
                      : 'bg-gray-900 border-gray-700 text-gray-300 hover:border-gray-500'
                  }`}
                >
                  {z.label}
                </button>
              ))}
            </div>
          </div>
          <button
            onClick={handleStartShift}
            disabled={!zone}
            className="w-full bg-white text-gray-900 font-bold text-base rounded-2xl py-4 disabled:opacity-40 active:scale-95 transition-all"
          >
            Start Shift
          </button>
        </div>
      )}
    </div>
  );
};

// ----------------------------------------------------------------------------
// SCAN RESULT — MATCH (green path)
// ----------------------------------------------------------------------------
const MatchResult = ({ scan, onMarkArrived, onCancel }) => (
  <div className="flex flex-col gap-4">
    {/* Match badge */}
    <div className="flex flex-col items-center gap-2 py-2">
      <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center shadow-lg shadow-green-500/30">
        <CheckIcon />
      </div>
      <h2 className="text-white text-lg font-bold">Booking Verified</h2>
      <p className="text-gray-400 text-sm">Vehicle plate matches · approve entry</p>
    </div>

    {/* Driver card */}
    <div className="bg-gray-900 border border-gray-700 rounded-2xl px-4 py-4 flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 bg-gray-800 rounded-full flex items-center justify-center shrink-0">
          <UserIcon />
        </div>
        <div>
          <p className="text-white font-bold text-base">{scan.driverName}</p>
          <p className="text-gray-400 text-xs">Booking #{scan.bookingId.slice(-8)}</p>
        </div>
      </div>

      <div className="h-px bg-gray-800" />

      <div className="flex items-center gap-3">
        <div className="w-9 h-9 bg-gray-800 rounded-full flex items-center justify-center shrink-0">
          <CarIcon />
        </div>
        <div>
          <p className="text-white font-semibold text-sm">{scan.vehicleNo}</p>
          <p className="text-green-400 text-xs font-semibold">Plate confirmed</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="w-9 h-9 bg-gray-800 rounded-full flex items-center justify-center shrink-0">
          <MapPinIcon />
        </div>
        <div>
          <p className="text-white font-semibold text-sm">Bay {scan.assignedBay}</p>
          <p className="text-gray-400 text-xs">{scan.lotName} · {scan.gate}</p>
        </div>
      </div>

      <div className="bg-gray-800 rounded-xl px-3 py-2">
        <p className="text-gray-400 text-xs">Entry window: <span className="text-white font-semibold">{scan.entryWindow}</span></p>
      </div>
    </div>

    {/* Actions */}
    <button
      onClick={onMarkArrived}
      className="w-full bg-green-500 hover:bg-green-400 text-white font-bold text-base rounded-2xl py-4 active:scale-95 transition-all shadow-lg shadow-green-500/30"
    >
      Mark Bay {scan.assignedBay} Occupied
    </button>
    <button
      onClick={onCancel}
      className="w-full text-gray-500 text-sm py-2 active:scale-95 transition-all"
    >
      Cancel
    </button>
  </div>
);

// ----------------------------------------------------------------------------
// SCAN RESULT — MISMATCH (red path)
// ----------------------------------------------------------------------------
const MismatchResult = ({ scan, onFlagAndScan, onCancel }) => (
  <div className="flex flex-col gap-4">
    {/* Mismatch badge */}
    <div className="flex flex-col items-center gap-2 py-2">
      <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center shadow-lg shadow-red-500/30">
        <XIcon />
      </div>
      <h2 className="text-white text-lg font-bold">Vehicle Mismatch</h2>
      <p className="text-red-400 text-sm text-center">Plate on QR does not match the vehicle present</p>
    </div>

    {/* Mismatch detail card */}
    <div className="bg-gray-900 border border-red-900/60 rounded-2xl px-4 py-4 flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 bg-gray-800 rounded-full flex items-center justify-center shrink-0">
          <UserIcon />
        </div>
        <div>
          <p className="text-white font-bold">{scan.driverName}</p>
          <p className="text-gray-400 text-xs">Booking #{scan.bookingId.slice(-8)}</p>
        </div>
      </div>

      <div className="h-px bg-gray-800" />

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between bg-gray-800 rounded-xl px-3 py-2.5">
          <span className="text-gray-400 text-xs">QR says</span>
          <span className="text-green-400 font-mono font-bold text-sm">{scan.vehicleNo}</span>
        </div>
        <div className="flex items-center justify-between bg-red-950/60 border border-red-900/40 rounded-xl px-3 py-2.5">
          <span className="text-gray-400 text-xs">Vehicle present</span>
          <span className="text-red-400 font-mono font-bold text-sm">{scan.scannedVehicleNo}</span>
        </div>
      </div>

      <p className="text-xs text-gray-500 leading-relaxed">
        Do not allow entry. Ask driver to show booking confirmation. If they insist, escalate to supervisor.
      </p>
    </div>

    <button
      onClick={onFlagAndScan}
      className="w-full bg-red-600 hover:bg-red-500 text-white font-bold text-base rounded-2xl py-4 active:scale-95 transition-all"
    >
      Log Mismatch + Scan Next
    </button>
    <button
      onClick={onCancel}
      className="w-full text-gray-500 text-sm py-2 active:scale-95 transition-all"
    >
      Cancel
    </button>
  </div>
);

// ----------------------------------------------------------------------------
// SCAN RESULT — BAY UNAVAILABLE (reassign path)
// ----------------------------------------------------------------------------
const UnavailableResult = ({ scan, onReassign, onCancel }) => {
  const [selected, setSelected] = useState(null);

  return (
    <div className="flex flex-col gap-4">
      {/* Unavailable badge */}
      <div className="flex flex-col items-center gap-2 py-2">
        <div className="w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center shadow-lg shadow-amber-500/30">
          <AlertIcon />
        </div>
        <h2 className="text-white text-lg font-bold">Bay Blocked</h2>
        <p className="text-amber-400 text-sm text-center">Bay {scan.assignedBay} is unavailable · assign alternate</p>
      </div>

      {/* Context */}
      <div className="bg-gray-900 border border-amber-900/40 rounded-2xl px-4 py-4 flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gray-800 rounded-full flex items-center justify-center shrink-0">
            <UserIcon />
          </div>
          <div>
            <p className="text-white font-bold">{scan.driverName}</p>
            <p className="text-gray-400 text-xs">{scan.vehicleNo}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-amber-950/60 border border-amber-900/40 rounded-xl px-3 py-2">
          <span className="text-amber-400 text-xs font-semibold">Bay {scan.assignedBay} is blocked</span>
        </div>

        {/* Alternate bays */}
        <div className="flex flex-col gap-1.5">
          <p className="text-gray-400 text-xs font-semibold uppercase tracking-widest">Available nearby</p>
          <div className="flex flex-col gap-2">
            {scan.alternateBays.map(bay => (
              <button
                key={bay}
                onClick={() => setSelected(bay)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border text-sm font-bold transition-all active:scale-95 ${
                  selected === bay
                    ? 'bg-white text-gray-900 border-white'
                    : 'bg-gray-800 border-gray-700 text-gray-200 hover:border-gray-500'
                }`}
              >
                <div className="flex items-center gap-2">
                  <SwapIcon />
                  Bay {bay}
                </div>
                <span className={`text-xs font-semibold ${selected === bay ? 'text-gray-500' : 'text-green-400'}`}>
                  Available
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <button
        onClick={() => selected && onReassign(selected)}
        disabled={!selected}
        className="w-full bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-gray-900 font-bold text-base rounded-2xl py-4 active:scale-95 transition-all"
      >
        {selected ? `Reassign to Bay ${selected}` : 'Select a bay above'}
      </button>
      <button
        onClick={onCancel}
        className="w-full text-gray-500 text-sm py-2 active:scale-95 transition-all"
      >
        Cancel
      </button>
    </div>
  );
};

// ----------------------------------------------------------------------------
// SUCCESS STATE (after mark arrived / reassign)
// ----------------------------------------------------------------------------
const SuccessState = ({ message, subtext, onScanNext }) => {
  useEffect(() => {
    const t = setTimeout(onScanNext, 2200);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-12">
      <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center shadow-2xl shadow-green-500/40 animate-[scale-in_0.2s_ease-out]">
        <CheckIcon />
      </div>
      <div className="flex flex-col items-center gap-1">
        <p className="text-white text-lg font-bold">{message}</p>
        <p className="text-gray-400 text-sm text-center">{subtext}</p>
      </div>
      <div className="flex items-center gap-2 mt-2">
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
        <p className="text-gray-500 text-xs">Logged to dashboard · returning to scan…</p>
      </div>
    </div>
  );
};

// ----------------------------------------------------------------------------
// SCAN LOG ENTRY
// ----------------------------------------------------------------------------
const ScanLogEntry = ({ entry }) => {
  const colors = {
    arrived: 'text-green-400',
    mismatch: 'text-red-400',
    reassigned: 'text-amber-400',
  };
  const labels = {
    arrived: 'Arrived',
    mismatch: 'Flagged',
    reassigned: 'Reassigned',
  };

  return (
    <div className="flex items-center justify-between py-2.5 border-b border-gray-800 last:border-0">
      <div className="flex flex-col gap-0.5">
        <p className="text-gray-200 text-sm font-semibold">{entry.driverName}</p>
        <p className="text-gray-500 text-xs">{entry.vehicleNo} · Bay {entry.bay}</p>
      </div>
      <div className="flex flex-col items-end gap-0.5">
        <span className={`text-xs font-bold ${colors[entry.status]}`}>{labels[entry.status]}</span>
        <span className="text-gray-600 text-xs">{entry.time}</span>
      </div>
    </div>
  );
};

// ----------------------------------------------------------------------------
// SCANNING ANIMATION
// ----------------------------------------------------------------------------
const ScanningAnimation = () => (
  <div className="flex flex-col items-center gap-6 py-8">
    <div className="relative w-48 h-48 flex items-center justify-center">
      {/* Corner brackets */}
      <div className="absolute top-0 left-0 w-10 h-10 border-t-2 border-l-2 border-white rounded-tl-lg" />
      <div className="absolute top-0 right-0 w-10 h-10 border-t-2 border-r-2 border-white rounded-tr-lg" />
      <div className="absolute bottom-0 left-0 w-10 h-10 border-b-2 border-l-2 border-white rounded-bl-lg" />
      <div className="absolute bottom-0 right-0 w-10 h-10 border-b-2 border-r-2 border-white rounded-br-lg" />
      {/* Scan line */}
      <div
        className="absolute left-2 right-2 h-0.5 bg-gradient-to-r from-transparent via-green-400 to-transparent"
        style={{ animation: 'scan-line 1.2s ease-in-out infinite alternate', top: '20%' }}
      />
      <p className="text-gray-400 text-sm font-semibold">Scanning…</p>
    </div>
    <p className="text-gray-500 text-xs">Point camera at driver's QR code</p>
    <style>{`
      @keyframes scan-line {
        from { top: 20%; }
        to   { top: 75%; }
      }
    `}</style>
  </div>
);

// ----------------------------------------------------------------------------
// MAIN SCREEN
// ----------------------------------------------------------------------------
export default function AttendantScannerScreen() {
  const [attendant, setAttendant] = useState(null); // null = not logged in
  const [scanState, setScanState] = useState('ready'); // ready | scanning | result | success
  const [currentScan, setCurrentScan] = useState(null);
  const [demoIndex, setDemoIndex] = useState(0);
  const [scanLog, setScanLog] = useState([]);
  const [successMsg, setSuccessMsg] = useState({ message: '', subtext: '' });

  const now = () => {
    const d = new Date();
    return `${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`;
  };

  const handleSimulateScan = () => {
    setScanState('scanning');
    setTimeout(() => {
      const scan = DEMO_SCANS[demoIndex % DEMO_SCANS.length];
      setCurrentScan(scan);
      setScanState('result');
    }, 1500);
  };

  const handleMarkArrived = () => {
    setScanLog(prev => [{
      driverName: currentScan.driverName,
      vehicleNo: currentScan.vehicleNo,
      bay: currentScan.assignedBay,
      status: 'arrived',
      time: now(),
    }, ...prev]);
    setSuccessMsg({
      message: `Bay ${currentScan.assignedBay} — Occupied`,
      subtext: `${currentScan.driverName} · ${currentScan.vehicleNo}`,
    });
    setDemoIndex(i => i + 1);
    setScanState('success');
  };

  const handleFlagMismatch = () => {
    setScanLog(prev => [{
      driverName: currentScan.driverName,
      vehicleNo: currentScan.scannedVehicleNo,
      bay: currentScan.assignedBay,
      status: 'mismatch',
      time: now(),
    }, ...prev]);
    setSuccessMsg({
      message: 'Mismatch Logged',
      subtext: 'Entry denied · alert sent to supervisor',
    });
    setDemoIndex(i => i + 1);
    setScanState('success');
  };

  const handleReassign = (newBay) => {
    setScanLog(prev => [{
      driverName: currentScan.driverName,
      vehicleNo: currentScan.vehicleNo,
      bay: newBay,
      status: 'reassigned',
      time: now(),
    }, ...prev]);
    setSuccessMsg({
      message: `Reassigned to Bay ${newBay}`,
      subtext: `${currentScan.driverName} · system updated`,
    });
    setDemoIndex(i => i + 1);
    setScanState('success');
  };

  const handleCancel = () => {
    setCurrentScan(null);
    setScanState('ready');
  };

  const handleScanNext = () => {
    setCurrentScan(null);
    setScanState('ready');
  };

  // Not logged in
  if (!attendant) {
    return <ShiftLogin onLoginSuccess={setAttendant} />;
  }

  return (
    <div className="min-h-[100dvh] bg-gray-950 font-sans">
      <div className="max-w-md mx-auto min-h-[100dvh] flex flex-col pb-28">

        {/* Header */}
        <div className="flex items-center justify-between px-4 pt-5 pb-3 border-b border-gray-800">
          <div className="flex flex-col gap-0.5">
            <p className="text-white font-bold text-base">Attendant Scanner</p>
            <p className="text-gray-500 text-xs truncate max-w-[220px]">{attendant.zone}</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-green-400 text-xs font-semibold">Live</span>
          </div>
        </div>

        {/* Scan count strip */}
        <div className="flex px-4 pt-3 pb-1 gap-3">
          {[
            { label: 'Arrived', count: scanLog.filter(s => s.status === 'arrived').length, color: 'text-green-400' },
            { label: 'Flagged', count: scanLog.filter(s => s.status === 'mismatch').length, color: 'text-red-400' },
            { label: 'Reassigned', count: scanLog.filter(s => s.status === 'reassigned').length, color: 'text-amber-400' },
          ].map(({ label, count, color }) => (
            <div key={label} className="flex-1 bg-gray-900 rounded-xl px-3 py-2 flex flex-col items-center gap-0.5">
              <span className={`text-xl font-black ${color}`}>{count}</span>
              <span className="text-gray-500 text-[10px] font-semibold uppercase tracking-wide">{label}</span>
            </div>
          ))}
        </div>

        {/* Main content area */}
        <div className="flex-1 px-4 pt-4 flex flex-col gap-4">

          {scanState === 'ready' && (
            <>
              {/* Scan prompt */}
              <div className="bg-gray-900 border border-gray-700 border-dashed rounded-2xl flex flex-col items-center gap-4 py-10">
                <div className="w-16 h-16 bg-gray-800 rounded-2xl flex items-center justify-center">
                  <ScanIcon />
                </div>
                <div className="flex flex-col items-center gap-1">
                  <p className="text-white font-bold text-base">Ready to scan</p>
                  <p className="text-gray-500 text-sm text-center px-6">
                    Point camera at driver's entry QR code (from their S3 confirmation)
                  </p>
                </div>
                <button
                  onClick={handleSimulateScan}
                  className="bg-white text-gray-900 font-bold text-sm px-6 py-3 rounded-xl active:scale-95 transition-all"
                >
                  Simulate Scan · Demo {(demoIndex % 3) + 1}/3
                </button>
                <p className="text-gray-600 text-xs">
                  Next: {['Normal arrival', 'Plate mismatch', 'Bay blocked'][demoIndex % 3]}
                </p>
              </div>

              {/* Scan log */}
              {scanLog.length > 0 && (
                <div className="flex flex-col gap-2">
                  <p className="text-gray-500 text-xs font-semibold uppercase tracking-widest">Scan log · this session</p>
                  <div className="bg-gray-900 border border-gray-800 rounded-2xl px-4 py-1">
                    {scanLog.slice(0, 6).map((entry, i) => (
                      <ScanLogEntry key={i} entry={entry} />
                    ))}
                  </div>
                  <p className="text-gray-600 text-xs text-center">
                    All scans synced to operator dashboard in real-time
                  </p>
                </div>
              )}
            </>
          )}

          {scanState === 'scanning' && <ScanningAnimation />}

          {scanState === 'result' && currentScan && (
            <>
              {currentScan.scenario === 'match' && (
                <MatchResult
                  scan={currentScan}
                  onMarkArrived={handleMarkArrived}
                  onCancel={handleCancel}
                />
              )}
              {currentScan.scenario === 'mismatch' && (
                <MismatchResult
                  scan={currentScan}
                  onFlagAndScan={handleFlagMismatch}
                  onCancel={handleCancel}
                />
              )}
              {currentScan.scenario === 'unavailable' && (
                <UnavailableResult
                  scan={currentScan}
                  onReassign={handleReassign}
                  onCancel={handleCancel}
                />
              )}
            </>
          )}

          {scanState === 'success' && (
            <SuccessState
              message={successMsg.message}
              subtext={successMsg.subtext}
              onScanNext={handleScanNext}
            />
          )}

        </div>

        {/* Footer — shift info */}
        <div className="px-4 py-3 border-t border-gray-800 flex items-center justify-between">
          <p className="text-gray-600 text-xs">Karan Aujla · JLN Stadium · 12 Apr</p>
          <button
            onClick={() => setAttendant(null)}
            className="text-gray-600 text-xs hover:text-gray-400 active:scale-95 transition-all"
          >
            End shift
          </button>
        </div>

      </div>
    </div>
  );
}
