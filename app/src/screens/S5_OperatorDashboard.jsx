import React, { useState, useEffect } from 'react';

// S5 — Operator Dashboard (Siddharth's screen)
// React / Tailwind Implementation
// PRD: B2B product — this screen sells the pilot to the event organiser.
// Without the dashboard, ParkEase has no B2B product (PRD §4.3)
// Shows: fill rate, redirect taps, vehicles diverted, alert feed, PDF compliance report

// ----------------------------------------------------------------------------
// ICONS
// ----------------------------------------------------------------------------
const DownloadIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
  </svg>
);

const AlertIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>
);

const CheckIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
  </svg>
);

const CarIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10l2 2h8l2-2zM13 16l2-2h3l1-5H13v7z" />
  </svg>
);

const RedirectIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
  </svg>
);

const RefreshIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
);

const ClockIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const BlockIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
  </svg>
);

const BellIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
  </svg>
);

const XIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

// ----------------------------------------------------------------------------
// MOCK DATA — seeded from PRD operator dashboard example (§5.x)
// PRD values: 87% fill, 65 spots remaining, 118 redirect taps, ~65 diverted
// Redirect threshold: 90% fill = 450 spots
// ----------------------------------------------------------------------------
const MOCK_DASHBOARD = {
  eventName: 'Karan Aujla',
  venue: 'Jawaharlal Nehru Stadium, Delhi',
  date: 'Sat, 12 Apr 2026',
  eventStatus: 'live',           // 'upcoming' | 'live' | 'ended'
  lastUpdated: '21:03',

  // Primary metrics — Row 1 from PRD dashboard spec
  totalSpots: 500,
  bookedSpots: 435,              // 87% fill — PRD exact value
  spotsRemaining: 65,            // PRD exact value
  fillPercent: 87,               // PRD exact value
  redirectCTATaps: 118,          // PRD exact value
  complianceRate: 0.55,          // 55% compliance — PRD: taps × 55%
  redirectThresholdSpots: 450,   // PRD: redirect triggers at 90% (450/500)
  redirectActive: true,          // parking > 90% full

  // Lot breakdown
  lots: [
    { name: 'North Lot', total: 300, booked: 265, percent: 88 },
    { name: 'South Lot', total: 200, booked: 170, percent: 85 },
  ],

  // Colour-coded alert feed — PRD §5.x
  alerts: [
    { time: '21:03', type: 'critical', message: 'PARKING FULL — Redirect active for all new visitors' },
    { time: '20:47', type: 'warning',  message: 'Fill rate crossed 90% — redirect CTA now live' },
    { time: '20:31', type: 'success',  message: 'No booking conflicts reported' },
    { time: '20:15', type: 'success',  message: 'Attendant check-ins: 435/500 confirmed arrivals' },
    { time: '19:58', type: 'warning',  message: 'Redirect CTA live — parking full screen active for new visitors' },
    { time: '19:30', type: 'info',     message: 'Fill rate 80% — on track for full house' },
    { time: '18:45', type: 'success',  message: 'First 100 QR scans completed — zero conflicts' },
    { time: '17:00', type: 'info',     message: 'Gates open — attendant check-in started' },
  ],
};

const MOCK_PRE_EVENT = {
  ...MOCK_DASHBOARD,
  eventStatus: 'upcoming',
  lastUpdated: '10:30',
  bookedSpots: 312,
  spotsRemaining: 188,
  fillPercent: 62,
  redirectCTATaps: 0,
  redirectActive: false,
  lots: [
    { name: 'North Lot', total: 300, booked: 195, percent: 65 },
    { name: 'South Lot', total: 200, booked: 117, percent: 59 },
  ],
  alerts: [
    { time: '10:30', type: 'info',    message: 'Pre-event mode — gates open at 17:00' },
    { time: '09:15', type: 'success', message: '312 bookings confirmed — 62% fill rate' },
    { time: '08:00', type: 'info',    message: 'Attendant briefing scheduled for 16:00' },
  ],
};

const MOCK_POST_EVENT = {
  ...MOCK_DASHBOARD,
  eventStatus: 'ended',
  lastUpdated: '23:45',
  bookedSpots: 492,
  spotsRemaining: 8,
  fillPercent: 98,
  redirectCTATaps: 156,
  redirectActive: false,
  lots: [
    { name: 'North Lot', total: 300, booked: 296, percent: 99 },
    { name: 'South Lot', total: 200, booked: 196, percent: 98 },
  ],
  alerts: [
    { time: '23:45', type: 'success', message: 'Event ended — all lots cleared' },
    { time: '23:10', type: 'success', message: 'Exit clearance complete — avg 20 mins' },
    { time: '22:30', type: 'info',    message: 'Post-event PDF report ready for download' },
  ],
};

const MODE_OPTIONS = [
  { id: 'pre',  label: 'Pre-event', data: MOCK_PRE_EVENT },
  { id: 'live', label: 'Live',      data: MOCK_DASHBOARD  },
  { id: 'post', label: 'Post-event', data: MOCK_POST_EVENT },
];

const ModeToggle = ({ activeMode, onModeChange }) => (
  <div className="w-full bg-white border border-gray-200 shadow-sm rounded-2xl p-1.5 flex gap-1">
    {MODE_OPTIONS.map(({ id, label }) => (
      <button
        key={id}
        onClick={() => onModeChange(id)}
        className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all ${
          activeMode === id
            ? 'bg-[#1C1D2B] text-white shadow'
            : 'text-gray-500 hover:text-gray-800'
        }`}
      >
        {label}
      </button>
    ))}
  </div>
);

// ----------------------------------------------------------------------------
// SUB-COMPONENTS
// ----------------------------------------------------------------------------

const DashboardHeader = ({ event, status, lastUpdated, onRefresh }) => {
  const statusConfig = {
    live:     { label: 'LIVE', classes: 'bg-red-600 text-white animate-pulse' },
    upcoming: { label: 'UPCOMING', classes: 'bg-amber-700 text-white' },
    ended:    { label: 'ENDED', classes: 'bg-gray-200 text-gray-700' },
  }[status];

  return (
    <div className="w-full flex flex-col gap-1 pt-1">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-gray-900 tracking-tight">ParkEase</span>
          <span className="text-gray-400">·</span>
          <span className="text-xs text-gray-500">Operator View</span>
        </div>
        <button onClick={onRefresh} className="p-1.5 text-gray-400 hover:text-gray-900 transition-colors">
          <RefreshIcon />
        </button>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-base font-bold text-gray-900">{event.eventName}</span>
          <span className="text-xs text-gray-400">{event.venue} · {event.date}</span>
        </div>
        <div className={`text-xs font-bold px-2.5 py-1 rounded-full ${statusConfig.classes}`}>
          {statusConfig.label}
        </div>
      </div>
      <span className="text-xs text-gray-400">Last updated {lastUpdated}</span>
    </div>
  );
};

// PRD Row 1 — four primary metric cards
const MetricCard = ({ label, value, sub, highlight, icon: Icon }) => (
  <div className={`flex flex-col gap-1.5 rounded-2xl px-4 py-3 border ${
    highlight
      ? 'bg-red-50 border-red-200'
      : 'bg-white border-gray-200 shadow-sm'
  }`}>
    <div className="flex items-center gap-1.5 text-gray-500">
      {Icon && <Icon />}
      <span className="text-xs">{label}</span>
    </div>
    <span className={`text-2xl font-black ${highlight ? 'text-red-600' : 'text-gray-900'}`}>
      {value}
    </span>
    {sub && <span className="text-xs text-gray-400">{sub}</span>}
  </div>
);

const PrimaryMetricsGrid = ({ data }) => {
  const vehiclesDiverted = Math.round(data.redirectCTATaps * data.complianceRate);
  return (
    <div className="w-full grid grid-cols-2 gap-3">
      <MetricCard
        label="Parking Fill Rate"
        value={`${data.fillPercent}%`}
        sub={`${data.bookedSpots} of ${data.totalSpots} spots`}
        highlight={data.fillPercent >= 90}
        icon={CarIcon}
      />
      <MetricCard
        label="Spots Remaining"
        value={data.spotsRemaining}
        sub="Live count"
        highlight={data.spotsRemaining <= 50}
      />
      <MetricCard
        label="Redirect CTA Taps"
        value={data.redirectCTATaps}
        sub="Since redirect triggered"
        icon={RedirectIcon}
      />
      <MetricCard
        label="Est. Vehicles Diverted"
        value={`~${vehiclesDiverted}`}
        sub={`Taps × ${Math.round(data.complianceRate * 100)}% compliance`}
      />
    </div>
  );
};

// Redirect status block — PRD: triggers at 90% (450/500)
const RedirectStatusBlock = ({ active, taps, threshold, total }) => (
  <div className={`w-full rounded-2xl px-4 py-3 border flex items-center justify-between ${
    active
      ? 'bg-red-50 border-red-200'
      : 'bg-white border-gray-200 shadow-sm'
  }`}>
    <div className="flex flex-col gap-0.5">
      <div className="flex items-center gap-2">
        <RedirectIcon />
        <span className={`text-sm font-bold ${active ? 'text-red-600' : 'text-gray-500'}`}>
          {active ? 'Redirect Active' : 'Redirect Standby'}
        </span>
      </div>
      <span className="text-xs text-gray-400 pl-6">
        Triggers at {threshold} spots booked ({Math.round(threshold / total * 100)}% fill) · Currently {active ? 'ON' : 'OFF'}
      </span>
    </div>
    <div className={`w-3 h-3 rounded-full ${active ? 'bg-red-500 animate-pulse' : 'bg-gray-300'}`} />
  </div>
);

// Per-lot capacity bars
const LotCapacityBars = ({ lots }) => (
  <div className="w-full flex flex-col gap-3">
    <span className="text-xs text-gray-400 uppercase tracking-widest font-semibold">
      Per-lot status
    </span>
    {lots.map((lot, i) => {
      const isCritical = lot.percent >= 90;
      return (
        <div key={i} className="w-full bg-white border border-gray-200 shadow-sm rounded-xl px-4 py-3 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-gray-900">{lot.name}</span>
            <div className="flex items-center gap-2">
              <span className={`text-sm font-bold ${isCritical ? 'text-red-600' : 'text-gray-900'}`}>
                {lot.percent}%
              </span>
              <span className="text-xs text-gray-400">
                {lot.booked}/{lot.total}
              </span>
            </div>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ${
                isCritical ? 'bg-red-500' : lot.percent > 70 ? 'bg-amber-500' : 'bg-green-500'
              }`}
              style={{ width: `${lot.percent}%` }}
            />
          </div>
        </div>
      );
    })}
  </div>
);

// Colour-coded alert feed — PRD §5.x
const AlertFeed = ({ alerts }) => {
  const config = {
    critical: { dot: 'bg-red-500',    text: 'text-red-600',    bg: 'bg-red-50 border-red-200' },
    warning:  { dot: 'bg-amber-500',  text: 'text-amber-600',  bg: 'bg-amber-50 border-amber-200' },
    success:  { dot: 'bg-green-500',  text: 'text-green-600',  bg: 'bg-white border-gray-200' },
    info:     { dot: 'bg-blue-500',   text: 'text-blue-600',   bg: 'bg-white border-gray-200' },
  };

  return (
    <div className="w-full flex flex-col gap-2">
      <span className="text-xs text-gray-400 uppercase tracking-widest font-semibold">
        Live event feed
      </span>
      {alerts.map((alert, i) => {
        const c = config[alert.type];
        return (
          <div key={i} className={`w-full rounded-xl px-4 py-2.5 border flex items-start gap-3 ${c.bg}`}>
            <div className="flex items-center gap-2 shrink-0 mt-0.5">
              <span className={`text-xs font-mono ${c.text}`}>{alert.time}</span>
              <div className={`w-2 h-2 rounded-full ${c.dot} shrink-0`} />
            </div>
            <span className={`text-xs leading-relaxed ${
              alert.type === 'critical' ? 'text-red-500 font-semibold' :
              alert.type === 'warning'  ? 'text-amber-600' :
              'text-gray-700'
            }`}>
              {alert.message}
            </span>
          </div>
        );
      })}
    </div>
  );
};

// Demand-shifting performance summary — PRD Row 2
const DemandShiftingPanel = ({ taps, compliance, totalSpots }) => {
  const diverted = Math.round(taps * compliance);
  const industryBaseline = 35; // PRD: 35% lot exit clearance reduction target at MVP

  return (
    <div className="w-full bg-white border border-gray-200 shadow-sm rounded-2xl px-5 py-4 flex flex-col gap-3">
      <span className="text-xs text-gray-400 uppercase tracking-widest font-semibold">
        Demand shifting performance
      </span>
      <div className="grid grid-cols-3 gap-3 text-center">
        <div className="flex flex-col gap-0.5">
          <span className="text-xl font-black text-gray-900">{taps}</span>
          <span className="text-xs text-gray-400">CTA taps</span>
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-xl font-black text-green-600">~{diverted}</span>
          <span className="text-xs text-gray-400">diverted</span>
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-xl font-black text-blue-600">{Math.round(compliance * 100)}%</span>
          <span className="text-xs text-gray-400">compliance</span>
        </div>
      </div>
      <div className="w-full h-px bg-gray-200" />
      <div className="flex items-center justify-between text-xs text-gray-400">
        <span>Lot exit clearance reduction target</span>
        <span className="text-gray-900 font-semibold">{industryBaseline}% MVP</span>
      </div>
      <p className="text-xs text-gray-400 leading-relaxed">
        Compliance rate (55%) is a PRD proxy — hard conversion confirmation requires V2 Ola/Uber API callback.
      </p>
    </div>
  );
};

// PDF compliance report — PRD feature #26
const PDFReportButton = ({ data }) => {
  const [generating, setGenerating] = useState(false);
  const [done, setDone] = useState(false);

  const handleDownload = () => {
    setGenerating(true);
    setTimeout(() => {
      const diverted = Math.round(data.redirectCTATaps * data.complianceRate);
      const tapRate  = Math.round((data.redirectCTATaps / 312) * 100);

      const reportText = [
        '================================================================',
        '         PARKEASE POST-EVENT COMPLIANCE REPORT',
        '================================================================',
        '',
        `Event:   ${data.eventName}`,
        `Venue:   ${data.venue}`,
        `Date:    ${data.date}`,
        `Generated: ${new Date().toLocaleString('en-IN')}`,
        '',
        '----------------------------------------------------------------',
        'PARKING PERFORMANCE',
        '----------------------------------------------------------------',
        `Total pre-booked spots:     ${data.totalSpots}`,
        `Confirmed arrivals:         ${data.bookedSpots}`,
        `Utilisation rate:           ${data.fillPercent}%`,
        `Spots remaining at close:   ${data.spotsRemaining}`,
        `Booking conflicts:          0`,
        '',
        'Per-lot breakdown:',
        ...data.lots.map(l =>
          `  ${l.name.padEnd(20)} ${l.booked}/${l.total}  (${l.percent}%)`
        ),
        '',
        '----------------------------------------------------------------',
        'DEMAND SHIFTING PERFORMANCE',
        '----------------------------------------------------------------',
        `Redirect threshold:         ${data.redirectThresholdSpots} spots (90% fill)`,
        `Users shown parking full:   312`,
        `Tapped cab/shuttle CTA:     ${data.redirectCTATaps}  (${tapRate}% tap rate)`,
        `Est. vehicles diverted:     ~${diverted}`,
        `Compliance discount:        55% applied to CTA tap count`,
        `Avg cab booking time:       24 seconds`,
        '',
        'Note: Diversion estimate uses a 55% compliance discount on CTA taps,',
        'based on validated behavioural redirection benchmarks (Waze/Google Maps).',
        'Direct measurement requires V2 sensor integration.',
        '',
        '----------------------------------------------------------------',
        'EXIT CLEARANCE PERFORMANCE',
        '----------------------------------------------------------------',
        'ParkEase-managed lots:       avg 20-minute clearance post-event',
        'Industry baseline:           60-90 minutes (unmanaged large events)',
        'Sources:',
        '  - Business Standard: Diljit Dosanjh Delhi concert, Jan 2025',
        '  - Free Press Journal: Coldplay Mumbai concert, Jan 2025',
        'ParkEase vs baseline:        65-77% faster clearance',
        '',
        '----------------------------------------------------------------',
        'COMPLIANCE NOTES',
        '----------------------------------------------------------------',
        'Zero post-event parking complaints via event ops channel.',
        'No municipal notices triggered.',
        'Full booking log available for authority review upon request.',
        '',
        '================================================================',
        'Report generated by ParkEase Operator Dashboard',
        'For queries: ops@parksease.in',
        '================================================================',
      ].join('\n');

      const blob = new Blob([reportText], { type: 'text/plain' });
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement('a');
      a.href     = url;
      a.download = `ParkEase_Compliance_${data.eventName.replace(/\s+/g, '_')}_${data.date.replace(/,?\s+/g, '_')}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setGenerating(false);
      setDone(true);
      setTimeout(() => setDone(false), 3000);
    }, 1800);
  };

  return (
    <div className="w-full flex flex-col gap-2">
      <span className="text-xs text-gray-400 uppercase tracking-widest font-semibold">
        Compliance report
      </span>
      <div className="w-full bg-white border border-gray-200 shadow-sm rounded-xl px-4 py-3 flex flex-col gap-3">
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-semibold text-gray-900">Post-event PDF report</span>
          <span className="text-xs text-gray-400">
            Fill rate · redirect count · vehicles diverted · exit clearance vs baseline
          </span>
        </div>
        <button
          onClick={handleDownload}
          disabled={generating}
          className={`w-full flex items-center justify-center gap-2 font-semibold text-sm rounded-xl py-2.5 transition-all active:scale-95 ${
            done
              ? 'bg-green-50 border border-green-200 text-green-600'
              : 'bg-[#1C1D2B] text-white hover:bg-gray-800 disabled:opacity-50'
          }`}
        >
          {generating ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-gray-400 border-t-white rounded-full animate-spin" />
              Generating PDF...
            </span>
          ) : done ? (
            <span className="flex items-center gap-2"><CheckIcon /> Report ready — tap to save</span>
          ) : (
            <span className="flex items-center gap-2"><DownloadIcon /> Download Compliance Report</span>
          )}
        </button>
        <p className="text-xs text-gray-400 text-center">
          Available after event ends · {data.eventName} · {data.date}
        </p>
      </div>
    </div>
  );
};

// Event configuration summary — what was set before the event
const EventConfigSummary = ({ data }) => (
  <div className="w-full bg-white border border-gray-200 shadow-sm rounded-xl px-4 py-3 flex flex-col gap-2">
    <span className="text-xs text-gray-400 uppercase tracking-widest font-semibold mb-1">
      Event configuration
    </span>
    {[
      ['Total inventory', `${data.totalSpots} spots across 2 lots`],
      ['Redirect threshold', `${data.redirectThresholdSpots} spots (90% fill)`],
      ['Cab drop zone', 'Drop Zone A, near Gate 4'],
      ['Cab providers', 'Ola · Uber · Rapido'],
    ].map(([label, value], i) => (
      <div key={i} className="flex items-center justify-between">
        <span className="text-xs text-gray-400">{label}</span>
        <span className="text-xs text-gray-700 font-medium text-right max-w-[55%]">{value}</span>
      </div>
    ))}
  </div>
);

const ExitClearanceComparison = () => (
  <div className="w-full bg-white border border-gray-200 shadow-sm rounded-2xl px-5 py-4 flex flex-col gap-3">
    <div className="flex items-center justify-between">
      <span className="text-sm font-bold text-gray-900">Exit Clearance vs Industry</span>
      <span className="text-xs text-green-600 font-semibold bg-green-50 px-2 py-0.5 rounded-full">
        65–77% faster
      </span>
    </div>

    <div className="flex flex-col gap-2">
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">ParkEase lots</span>
          <span className="text-xs font-bold text-green-600">avg 20 mins</span>
        </div>
        <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full bg-green-500 rounded-full" style={{ width: '22%' }} />
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">Industry baseline</span>
          <span className="text-xs font-bold text-red-500">60–90 mins</span>
        </div>
        <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full bg-red-400 rounded-full" style={{ width: '85%' }} />
        </div>
      </div>
    </div>

    <p className="text-xs text-gray-400">
      Sources: Business Standard & Free Press Journal — Diljit / Coldplay concerts, Jan 2025
    </p>
  </div>
);

const ManualFallbackNotice = () => (
  <div className="w-full bg-blue-50 border border-blue-200 rounded-2xl px-5 py-4 flex items-start gap-3">
    <div className="shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mt-0.5">
      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    </div>
    <div className="flex flex-col gap-0.5">
      <span className="text-sm font-bold text-blue-900">Manual fallback active</span>
      <span className="text-xs text-blue-700">
        Printed booking list at each gate entry. App downtime does not cascade to physical failure.
      </span>
    </div>
  </div>
);

// ----------------------------------------------------------------------------
// TOAST NOTIFICATION — simulates push sent to users
// ----------------------------------------------------------------------------
const Toast = ({ message, onDismiss }) => (
  <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[300] w-[92%] max-w-md
                  bg-gray-900 text-white rounded-2xl px-4 py-3 shadow-2xl
                  flex items-start gap-3 animate-[fadeInDown_0.3s_ease]">
    <span className="text-lg shrink-0">📲</span>
    <div className="flex-1 flex flex-col gap-0.5">
      <span className="text-xs font-bold text-gray-300 uppercase tracking-wide">Push sent to users</span>
      <span className="text-sm leading-snug">{message}</span>
    </div>
    <button onClick={onDismiss} className="shrink-0 p-1 text-gray-400 hover:text-white">
      <XIcon />
    </button>
  </div>
);

// ----------------------------------------------------------------------------
// EMERGENCY OVERLAY — full-screen, one-tap, all gates open
// ----------------------------------------------------------------------------
const EmergencyOverlay = ({ onDismiss }) => (
  <div className="fixed inset-0 z-[400] bg-red-600 flex flex-col items-center justify-center gap-6 px-8 text-white">
    <div className="flex flex-col items-center gap-3 text-center">
      <div className="w-20 h-20 rounded-full bg-white/20 border-4 border-white flex items-center justify-center animate-pulse">
        <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <h1 className="text-3xl font-black tracking-tight">EMERGENCY EXIT</h1>
      <p className="text-xl font-bold">IN EFFECT</p>
    </div>
    <div className="w-full bg-white/20 rounded-2xl px-5 py-4 flex flex-col gap-2 text-center">
      <p className="text-base font-semibold">All gates open</p>
      <p className="text-sm text-red-100">QR enforcement suspended — proceed directly to your vehicle</p>
      <p className="text-xs text-red-200 mt-1">Push notification sent to all 435 confirmed users</p>
    </div>
    <div className="w-full flex flex-col gap-2">
      <p className="text-xs text-center text-red-200">
        This override is logged in the compliance report with timestamp
      </p>
      <button
        onClick={onDismiss}
        className="w-full bg-white text-red-600 font-black text-base rounded-2xl py-4 active:scale-95 transition-all"
      >
        Dismiss — Situation Under Control
      </button>
    </div>
  </div>
);

// ----------------------------------------------------------------------------
// MANUAL OVERRIDE PANEL — live mode only
// Answers Siddharth's 3 liability questions from PRD sales call
// ----------------------------------------------------------------------------
const ManualOverridePanel = ({ data, onToast, onEmergency, onAddAlert }) => {
  // Show ends early
  const [showEndTime, setShowEndTime] = useState(false);
  const [newEndTime, setNewEndTime] = useState('21:30');
  const [endTimeSent, setEndTimeSent] = useState(false);

  // Lot blocked
  const [showLotBlock, setShowLotBlock] = useState(false);
  const [selectedLot, setSelectedLot] = useState('North Lot');
  const [lotBlockSent, setLotBlockSent] = useState(false);

  // Emergency confirm
  const [showEmergencyConfirm, setShowEmergencyConfirm] = useState(false);

  const handleEndTime = () => {
    setEndTimeSent(true);
    setShowEndTime(false);
    onToast(`Event ending at ${newEndTime} — head to your bay now. Exit via Gate C, est. 9 mins to clear.`);
    onAddAlert({ time: newEndTime, type: 'warning', message: `Show end time updated to ${newEndTime} — exit notifications pushed to all users` });
  };

  const handleLotBlock = () => {
    const other = selectedLot === 'North Lot' ? 'South Lot' : 'North Lot';
    setLotBlockSent(true);
    setShowLotBlock(false);
    onToast(`${selectedLot} temporarily closed. You've been reassigned to ${other} — new bay confirmed.`);
    onAddAlert({ time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }), type: 'critical', message: `${selectedLot} marked as blocked — users reassigned to ${other}` });
  };

  const handleEmergency = () => {
    setShowEmergencyConfirm(false);
    onAddAlert({ time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }), type: 'critical', message: 'EMERGENCY OVERRIDE ACTIVE — all gates open, QR enforcement suspended' });
    onEmergency();
  };

  return (
    <div className="w-full flex flex-col gap-3">
      <span className="text-xs text-gray-400 uppercase tracking-widest font-semibold">
        Operator controls
      </span>

      {/* Show ends early */}
      <div className="w-full bg-white border border-amber-200 rounded-2xl overflow-hidden">
        <button
          onClick={() => { setShowEndTime(v => !v); setShowLotBlock(false); }}
          className="w-full px-4 py-3.5 flex items-center justify-between text-left hover:bg-amber-50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
              <ClockIcon />
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-sm font-bold text-gray-900">Show ends early</span>
              <span className="text-xs text-gray-400">Update end time · push departure notification</span>
            </div>
          </div>
          {endTimeSent
            ? <span className="text-xs text-green-600 font-semibold bg-green-50 px-2 py-1 rounded-full shrink-0">Sent ✓</span>
            : <span className="text-xs text-amber-600 font-semibold bg-amber-50 px-2 py-1 rounded-full shrink-0">Tap to use</span>
          }
        </button>
        {showEndTime && (
          <div className="px-4 pb-4 flex flex-col gap-3 border-t border-amber-100 pt-3">
            <div className="flex items-center gap-3">
              <label className="text-xs text-gray-500 shrink-0">New end time</label>
              <input
                type="time"
                value={newEndTime}
                onChange={e => setNewEndTime(e.target.value)}
                className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>
            <p className="text-xs text-gray-400">
              Notification preview: "Event ending at {newEndTime} — head to Bay B-18 now. Exit via Gate C, est. 9 mins."
            </p>
            <button
              onClick={handleEndTime}
              className="w-full bg-amber-500 hover:bg-amber-400 text-white font-bold text-sm rounded-xl py-2.5 flex items-center justify-center gap-2 active:scale-95 transition-all"
            >
              <BellIcon /> Send notification to 435 users
            </button>
          </div>
        )}
      </div>

      {/* Lot blocked */}
      <div className="w-full bg-white border border-orange-200 rounded-2xl overflow-hidden">
        <button
          onClick={() => { setShowLotBlock(v => !v); setShowEndTime(false); }}
          className="w-full px-4 py-3.5 flex items-center justify-between text-left hover:bg-orange-50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center shrink-0">
              <BlockIcon />
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-sm font-bold text-gray-900">Lot blocked / closed</span>
              <span className="text-xs text-gray-400">Close a lot · auto-reassign affected users</span>
            </div>
          </div>
          {lotBlockSent
            ? <span className="text-xs text-green-600 font-semibold bg-green-50 px-2 py-1 rounded-full shrink-0">Done ✓</span>
            : <span className="text-xs text-orange-600 font-semibold bg-orange-50 px-2 py-1 rounded-full shrink-0">Tap to use</span>
          }
        </button>
        {showLotBlock && (
          <div className="px-4 pb-4 flex flex-col gap-3 border-t border-orange-100 pt-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-gray-500">Select lot to close</label>
              <div className="flex gap-2">
                {data.lots.map(lot => (
                  <button
                    key={lot.name}
                    onClick={() => setSelectedLot(lot.name)}
                    className={`flex-1 py-2 rounded-xl text-sm font-semibold border transition-all ${
                      selectedLot === lot.name
                        ? 'bg-orange-500 text-white border-orange-500'
                        : 'bg-white text-gray-700 border-gray-200 hover:border-orange-300'
                    }`}
                  >
                    {lot.name}
                  </button>
                ))}
              </div>
            </div>
            <p className="text-xs text-gray-400">
              Notification preview: "{selectedLot} temporarily closed. Reassigned to {selectedLot === 'North Lot' ? 'South Lot' : 'North Lot'} — new bay confirmed."
            </p>
            <button
              onClick={handleLotBlock}
              className="w-full bg-orange-500 hover:bg-orange-400 text-white font-bold text-sm rounded-xl py-2.5 flex items-center justify-center gap-2 active:scale-95 transition-all"
            >
              <BellIcon /> Block lot · notify affected users
            </button>
          </div>
        )}
      </div>

      {/* Emergency override */}
      {!showEmergencyConfirm ? (
        <button
          onClick={() => setShowEmergencyConfirm(true)}
          className="w-full bg-red-600 hover:bg-red-500 text-white font-black text-sm rounded-2xl py-4 flex items-center justify-center gap-2 active:scale-95 transition-all shadow-lg shadow-red-900/30"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          Emergency Override — Open All Gates
        </button>
      ) : (
        <div className="w-full bg-red-50 border-2 border-red-400 rounded-2xl px-4 py-4 flex flex-col gap-3">
          <p className="text-sm font-bold text-red-700 text-center">
            This will open all gates and push an emergency exit notification to all 435 users. Confirm?
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setShowEmergencyConfirm(false)}
              className="flex-1 bg-white border border-gray-300 text-gray-700 font-semibold text-sm rounded-xl py-2.5 active:scale-95 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleEmergency}
              className="flex-1 bg-red-600 text-white font-black text-sm rounded-xl py-2.5 active:scale-95 transition-all"
            >
              Confirm Emergency
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// ----------------------------------------------------------------------------
// PRE-EVENT OPS CHECKLIST — pre-event mode only
// Directly addresses RCB/JLN failure: "event conducted without any SOP"
// Karnataka Crowd Control Bill 2025 — documented SOPs now a legal requirement
// ----------------------------------------------------------------------------
const CHECKLIST_ITEMS = [
  { id: 'bay_mapping',   label: 'Bay pillar mapping completed',         sub: 'Photos logged for all bays in both lots' },
  { id: 'fallback',      label: 'Printed fallback lists at each gate',  sub: 'Backup if app goes down on event night' },
  { id: 'attendants',    label: 'Attendants briefed',                   sub: 'QR scan protocol + reassignment authority' },
  { id: 'drop_zone',     label: 'Cab drop zone marked + signed',        sub: 'Physical "ParkEase Drop Zone" sign at Gate 4' },
  { id: 'prohibited',    label: 'Prohibited items banners placed',       sub: 'Printed sign at each lot entry gate' },
  { id: 'sla_signed',    label: 'Venue SLA signed',                     sub: 'Exclusivity clause + liability transfer confirmed' },
];

const PreEventChecklist = () => {
  const [checked, setChecked] = useState({});
  const allDone = CHECKLIST_ITEMS.every(item => checked[item.id]);

  const toggle = (id) => setChecked(prev => ({ ...prev, [id]: !prev[id] }));

  return (
    <div className="w-full flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-400 uppercase tracking-widest font-semibold">
          Pre-event ops checklist
        </span>
        <span className="text-xs text-gray-400">
          {Object.values(checked).filter(Boolean).length}/{CHECKLIST_ITEMS.length} complete
        </span>
      </div>
      <div className="w-full bg-white border border-gray-200 shadow-sm rounded-2xl overflow-hidden">
        {CHECKLIST_ITEMS.map((item, i) => (
          <button
            key={item.id}
            onClick={() => toggle(item.id)}
            className={`w-full px-4 py-3.5 flex items-start gap-3 text-left transition-colors
              ${i > 0 ? 'border-t border-gray-100' : ''}
              ${checked[item.id] ? 'bg-green-50' : 'hover:bg-gray-50'}`}
          >
            <div className={`w-5 h-5 rounded-full border-2 shrink-0 mt-0.5 flex items-center justify-center transition-all ${
              checked[item.id] ? 'bg-green-500 border-green-500' : 'border-gray-300'
            }`}>
              {checked[item.id] && (
                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
            <div className="flex flex-col gap-0.5">
              <span className={`text-sm font-semibold ${checked[item.id] ? 'text-green-700 line-through decoration-green-400' : 'text-gray-900'}`}>
                {item.label}
              </span>
              <span className="text-xs text-gray-400">{item.sub}</span>
            </div>
          </button>
        ))}
      </div>
      <button
        disabled={!allDone}
        className={`w-full font-black text-sm rounded-2xl py-4 transition-all active:scale-95 ${
          allDone
            ? 'bg-green-600 text-white shadow-lg shadow-green-900/20'
            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
        }`}
      >
        {allDone ? '✓ All checks complete — event is ready to go live' : 'Complete all checks to go live'}
      </button>
      <p className="text-xs text-gray-400 text-center px-2">
        Checklist completion is logged in the compliance report — required under Karnataka Crowd Control Bill 2025
      </p>
    </div>
  );
};

// ----------------------------------------------------------------------------
// MAIN SCREEN
// ----------------------------------------------------------------------------
export default function OperatorDashboardScreen() {
  const [mode, setMode] = useState('live');
  const [lastRefreshed, setLastRefreshed] = useState(MOCK_DASHBOARD.lastUpdated);
  const [toast, setToast] = useState(null);
  const [showEmergency, setShowEmergency] = useState(false);
  const [liveAlerts, setLiveAlerts] = useState(null); // null = use mode default

  const baseData = MODE_OPTIONS.find(m => m.id === mode)?.data ?? MOCK_DASHBOARD;
  const data = liveAlerts ? { ...baseData, alerts: liveAlerts } : baseData;

  const handleRefresh = () => {
    setLastRefreshed(new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }));
  };

  const handleModeChange = (newMode) => {
    setMode(newMode);
    setLiveAlerts(null); // reset any added alerts when switching mode
  };

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 5000);
  };

  const addAlert = (alert) => {
    const current = liveAlerts ?? baseData.alerts;
    setLiveAlerts([alert, ...current]);
  };

  return (
    <div className="min-h-[100dvh] bg-gray-50 font-sans sm:bg-gray-50">

      {/* Toast — simulates push notification to users */}
      {toast && <Toast message={toast} onDismiss={() => setToast(null)} />}

      {/* Emergency overlay */}
      {showEmergency && <EmergencyOverlay onDismiss={() => setShowEmergency(false)} />}

      <div className="max-w-md mx-auto min-h-[100dvh] bg-gray-50 flex flex-col px-4 py-5 gap-5 sm:shadow-2xl">

        {/* Mode toggle */}
        <ModeToggle activeMode={mode} onModeChange={handleModeChange} />

        {/* Header */}
        <DashboardHeader
          event={data}
          status={data.eventStatus}
          lastUpdated={lastRefreshed}
          onRefresh={handleRefresh}
        />

        {/* PRE-EVENT: ops checklist */}
        {mode === 'pre' && <PreEventChecklist />}

        {/* LIVE: redirect status + metrics */}
        {mode === 'live' && (
          <>
            <RedirectStatusBlock
              active={data.redirectActive}
              taps={data.redirectCTATaps}
              threshold={data.redirectThresholdSpots}
              total={data.totalSpots}
            />
            <PrimaryMetricsGrid data={data} />
            <LotCapacityBars lots={data.lots} />
            <DemandShiftingPanel
              taps={data.redirectCTATaps}
              compliance={data.complianceRate}
              totalSpots={data.totalSpots}
            />
            <ManualFallbackNotice />

            {/* Manual override controls */}
            <ManualOverridePanel
              data={data}
              onToast={showToast}
              onEmergency={() => setShowEmergency(true)}
              onAddAlert={addAlert}
            />
          </>
        )}

        {/* POST-EVENT: exit clearance + compliance report */}
        {mode === 'post' && (
          <>
            <PrimaryMetricsGrid data={data} />
            <LotCapacityBars lots={data.lots} />
            <DemandShiftingPanel
              taps={data.redirectCTATaps}
              compliance={data.complianceRate}
              totalSpots={data.totalSpots}
            />
            <ExitClearanceComparison />
            <PDFReportButton data={data} />
          </>
        )}

        {/* Alert feed — all modes */}
        <AlertFeed alerts={data.alerts} />

        {/* Event config — pre + live */}
        {mode !== 'post' && <EventConfigSummary data={data} />}

        <div className="pb-6" />

      </div>
    </div>
  );
}
