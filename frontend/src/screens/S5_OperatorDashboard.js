import React, { useState, useEffect } from 'react';
import { fetchEventStats } from '../api';

const DownloadIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
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

const EVENT_ID = 'karan-aujla-jln-2026';

const MODES = [
  { id: 'pre', label: 'Pre-event' },
  { id: 'live', label: 'Live' },
  { id: 'post', label: 'Post-event' },
];

const MetricCard = ({ label, value, sub, highlight, icon: Icon }) => (
  <div className={`flex flex-col gap-1.5 rounded-2xl px-4 py-3 border ${highlight ? 'bg-red-50 border-red-200' : 'bg-white border-gray-200 shadow-sm'}`}>
    <div className="flex items-center gap-1.5 text-gray-500">
      {Icon && <Icon />}
      <span className="text-xs">{label}</span>
    </div>
    <span className={`text-2xl font-black ${highlight ? 'text-red-600' : 'text-gray-900'}`}>{value}</span>
    {sub && <span className="text-xs text-gray-400">{sub}</span>}
  </div>
);

export default function OperatorDashboardScreen() {
  const [mode, setMode] = useState('live');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastRefreshed, setLastRefreshed] = useState('');
  const [generating, setGenerating] = useState(false);
  const [pdfDone, setPdfDone] = useState(false);

  const loadStats = () => {
    fetchEventStats(EVENT_ID)
      .then(stats => {
        setData(stats);
        setLastRefreshed(stats.last_updated);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => { loadStats(); }, []);

  const handleRefresh = () => {
    setLastRefreshed(new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }));
    loadStats();
  };

  const handleDownloadPDF = () => {
    if (!data) return;
    setGenerating(true);
    setTimeout(() => {
      const diverted = Math.round(data.redirect_cta_taps * data.compliance_rate);
      const reportText = [
        '================================================================',
        '         PARKEASE POST-EVENT COMPLIANCE REPORT',
        '================================================================', '',
        `Event:   ${data.event_name}`, `Venue:   ${data.venue}`, `Date:    ${data.date}`,
        `Generated: ${new Date().toLocaleString('en-IN')}`, '',
        '----------------------------------------------------------------', 'PARKING PERFORMANCE', '----------------------------------------------------------------',
        `Total pre-booked spots:     ${data.total_spots}`, `Confirmed arrivals:         ${data.booked_spots}`,
        `Utilisation rate:           ${data.fill_percent}%`, `Spots remaining at close:   ${data.spots_remaining}`, '',
        'Per-lot breakdown:',
        ...(data.lots || []).map(l => `  ${l.name.padEnd(20)} ${l.booked}/${l.total}  (${l.percent}%)`), '',
        '----------------------------------------------------------------', 'DEMAND SHIFTING', '----------------------------------------------------------------',
        `Redirect CTA taps:     ${data.redirect_cta_taps}`, `Est. vehicles diverted: ~${diverted}`, '',
        '================================================================',
      ].join('\n');

      const blob = new Blob([reportText], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ParkEase_Report_${data.event_name.replace(/\s+/g, '_')}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setGenerating(false);
      setPdfDone(true);
      setTimeout(() => setPdfDone(false), 3000);
    }, 1500);
  };

  if (loading || !data) {
    return (
      <div className="min-h-[100dvh] bg-gray-50 flex items-center justify-center">
        <div className="animate-pulse text-gray-400">Loading dashboard...</div>
      </div>
    );
  }

  const vehiclesDiverted = Math.round(data.redirect_cta_taps * data.compliance_rate);

  return (
    <div className="min-h-[100dvh] bg-gray-50 font-sans" data-testid="operator-dashboard">
      <div className="max-w-md mx-auto min-h-[100dvh] bg-gray-50 flex flex-col px-4 py-5 gap-5 sm:shadow-2xl">
        {/* Mode toggle */}
        <div className="w-full bg-white border border-gray-200 shadow-sm rounded-2xl p-1.5 flex gap-1">
          {MODES.map(m => (
            <button key={m.id} onClick={() => setMode(m.id)} data-testid={`mode-${m.id}`}
              className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all ${mode === m.id ? 'bg-[#1C1D2B] text-white shadow' : 'text-gray-500 hover:text-gray-800'}`}>
              {m.label}
            </button>
          ))}
        </div>

        {/* Header */}
        <div className="w-full flex flex-col gap-1 pt-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-gray-900">ParkEase</span>
              <span className="text-gray-400">-</span>
              <span className="text-xs text-gray-500">Operator View</span>
            </div>
            <button onClick={handleRefresh} className="p-1.5 text-gray-400 hover:text-gray-900" data-testid="refresh-btn"><RefreshIcon /></button>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-base font-bold text-gray-900">{data.event_name}</span>
              <span className="text-xs text-gray-400">{data.venue} - {data.date}</span>
            </div>
            <div className={`text-xs font-bold px-2.5 py-1 rounded-full ${data.event_status === 'live' ? 'bg-red-600 text-white animate-pulse' : 'bg-gray-200 text-gray-700'}`}>
              {(data.event_status || 'LIVE').toUpperCase()}
            </div>
          </div>
          <span className="text-xs text-gray-400">Last updated {lastRefreshed}</span>
        </div>

        {/* Redirect status */}
        <div className={`w-full rounded-2xl px-4 py-3 border flex items-center justify-between ${data.redirect_active ? 'bg-red-50 border-red-200' : 'bg-white border-gray-200 shadow-sm'}`}>
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-2">
              <RedirectIcon />
              <span className={`text-sm font-bold ${data.redirect_active ? 'text-red-600' : 'text-gray-500'}`}>
                {data.redirect_active ? 'Redirect Active' : 'Redirect Standby'}
              </span>
            </div>
            <span className="text-xs text-gray-400 pl-6">Triggers at {data.redirect_threshold_spots} spots (90% fill)</span>
          </div>
          <div className={`w-3 h-3 rounded-full ${data.redirect_active ? 'bg-red-500 animate-pulse' : 'bg-gray-300'}`} />
        </div>

        {/* Metrics */}
        <div className="w-full grid grid-cols-2 gap-3" data-testid="metrics-grid">
          <MetricCard label="Fill Rate" value={`${data.fill_percent}%`} sub={`${data.booked_spots} of ${data.total_spots}`} highlight={data.fill_percent >= 90} icon={CarIcon} />
          <MetricCard label="Spots Remaining" value={data.spots_remaining} sub="Live count" highlight={data.spots_remaining <= 50} />
          <MetricCard label="Redirect Taps" value={data.redirect_cta_taps} sub="Since redirect triggered" icon={RedirectIcon} />
          <MetricCard label="Est. Diverted" value={`~${vehiclesDiverted}`} sub={`Taps x ${Math.round(data.compliance_rate * 100)}% compliance`} />
        </div>

        {/* Per-lot bars */}
        <div className="w-full flex flex-col gap-3">
          <span className="text-xs text-gray-400 uppercase tracking-widest font-semibold">Per-lot status</span>
          {(data.lots || []).map((lot, i) => (
            <div key={i} className="w-full bg-white border border-gray-200 shadow-sm rounded-xl px-4 py-3 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-900">{lot.name}</span>
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-bold ${lot.percent >= 90 ? 'text-red-600' : 'text-gray-900'}`}>{lot.percent}%</span>
                  <span className="text-xs text-gray-400">{lot.booked}/{lot.total}</span>
                </div>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className={`h-full rounded-full transition-all duration-700 ${lot.percent >= 90 ? 'bg-red-500' : lot.percent > 70 ? 'bg-amber-500' : 'bg-green-500'}`}
                  style={{ width: `${lot.percent}%` }} />
              </div>
            </div>
          ))}
        </div>

        {/* Exit clearance comparison */}
        <div className="w-full bg-white border border-gray-200 shadow-sm rounded-2xl px-5 py-4 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-gray-900">Exit Clearance vs Industry</span>
            <span className="text-xs text-green-600 font-semibold bg-green-50 px-2 py-0.5 rounded-full">65-77% faster</span>
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
                <span className="text-xs font-bold text-red-500">60-90 mins</span>
              </div>
              <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-red-400 rounded-full" style={{ width: '85%' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Manual fallback */}
        <div className="w-full bg-blue-50 border border-blue-200 rounded-2xl px-5 py-4 flex items-start gap-3">
          <div className="shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mt-0.5">
            <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-sm font-bold text-blue-900">Manual fallback active</span>
            <span className="text-xs text-blue-700">Printed booking list at each gate. App downtime does not cascade to physical failure.</span>
          </div>
        </div>

        {/* PDF Report */}
        <div className="w-full flex flex-col gap-2">
          <span className="text-xs text-gray-400 uppercase tracking-widest font-semibold">Compliance report</span>
          <div className="w-full bg-white border border-gray-200 shadow-sm rounded-xl px-4 py-3 flex flex-col gap-3">
            <button onClick={handleDownloadPDF} disabled={generating} data-testid="download-report-btn"
              className={`w-full flex items-center justify-center gap-2 font-semibold text-sm rounded-xl py-2.5 transition-all active:scale-95 ${
                pdfDone ? 'bg-green-50 border border-green-200 text-green-600' : 'bg-[#1C1D2B] text-white hover:bg-gray-800 disabled:opacity-50'}`}>
              {generating ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-gray-400 border-t-white rounded-full animate-spin" /> Generating...
                </span>
              ) : pdfDone ? (
                <span className="flex items-center gap-2"><CheckIcon /> Report ready</span>
              ) : (
                <span className="flex items-center gap-2"><DownloadIcon /> Download Compliance Report</span>
              )}
            </button>
          </div>
        </div>

        <div className="pb-6" />
      </div>
    </div>
  );
}