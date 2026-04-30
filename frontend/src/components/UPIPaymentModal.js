import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';

const UPI_APPS = [
  { id: 'gpay', name: 'Google Pay', short: 'GPay', color: 'bg-white border-gray-200', icon: (
    <svg viewBox="0 0 48 48" className="w-8 h-8" fill="none">
      <circle cx="24" cy="24" r="22" fill="#fff" stroke="#E5E7EB" strokeWidth="2"/>
      <path d="M31.2 20.4l-3.6 6.24c-.36.6-.96.96-1.68.96h-4.08L25.44 20.4h5.76z" fill="#4285F4"/>
      <path d="M25.44 20.4l-3.6 7.2h-4.08c-.72 0-1.2-.6-.96-1.32l3.12-5.88h5.52z" fill="#EA4335"/>
      <path d="M21.84 27.6l-3.6-7.2h4.08c.72 0 1.32.36 1.68.96l3.6 6.24h-5.76z" fill="#FBBC04"/>
      <path d="M17.76 20.4h4.08l3.6 7.2h-4.08c-.72 0-1.32-.36-1.68-.96L17.76 20.4z" fill="#34A853"/>
    </svg>
  )},
  { id: 'phonepe', name: 'PhonePe', short: 'PhonePe', color: 'bg-[#5F259F]/5 border-[#5F259F]/20', icon: (
    <div className="w-8 h-8 rounded-lg bg-[#5F259F] flex items-center justify-center">
      <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="currentColor">
        <path d="M7.5 4h5.25a4.5 4.5 0 010 9H10.5v7h-3V4zm3 6.75h2.25a1.5 1.5 0 000-3H10.5v3z"/>
      </svg>
    </div>
  )},
  { id: 'paytm', name: 'Paytm', short: 'Paytm', color: 'bg-[#00BAF2]/5 border-[#00BAF2]/20', icon: (
    <div className="w-8 h-8 rounded-lg bg-[#00BAF2] flex items-center justify-center">
      <span className="text-white text-[10px] font-black">Pay</span>
    </div>
  )},
];

const CheckCircleAnimated = () => (
  <div className="relative">
    <svg className="w-20 h-20 animate-[scale-in_0.4s_ease-out]" viewBox="0 0 80 80" fill="none">
      <circle cx="40" cy="40" r="38" stroke="#22c55e" strokeWidth="3" fill="#f0fdf4" className="animate-[draw-circle_0.6s_ease-out]" />
      <path d="M24 40l10 10 22-22" stroke="#22c55e" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="animate-[draw-check_0.3s_ease-out_0.4s_both]" />
    </svg>
  </div>
);

const LockIcon = () => (
  <svg className="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);

export default function UPIPaymentModal({ isOpen, onClose, onSuccess, amount, bayCode, lotName, onCreateBooking }) {
  const [stage, setStage] = useState('select'); // select | processing | success
  const [selectedApp, setSelectedApp] = useState(null);
  const [countdown, setCountdown] = useState(5);
  const [dots, setDots] = useState('');
  const [paymentQrUrl, setPaymentQrUrl] = useState('');
  const [upiId, setUpiId] = useState('');

  // UPI ID format: localpart@provider (e.g. name@okicici, user@ybl)
  const UPI_ID_RE = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+$/;
  const upiIdValid = UPI_ID_RE.test(upiId.trim());

  useEffect(() => {
    const upiUrl = `upi://pay?pa=parksease@okaxis&pn=ParkEase&am=${amount}&cu=INR&tn=ParkEase+Parking`;
    QRCode.toDataURL(upiUrl, { width: 160, margin: 1 })
      .then(url => setPaymentQrUrl(url))
      .catch(() => {});
  }, [amount]);

  // Reset on open
  useEffect(() => {
    if (isOpen) {
      setStage('select');
      setSelectedApp(null);
      setCountdown(5);
      setDots('');
      setUpiId('');
      // [DEMO] Payment is simulated — no real funds move. Intentional for demo.
      console.warn('[DEMO] UPI payment is simulated. No real funds will be transferred.');
    }
  }, [isOpen]);

  // Processing countdown
  useEffect(() => {
    if (stage !== 'processing') return;
    const dotInterval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.');
    }, 500);

    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          clearInterval(dotInterval);
          setStage('success');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => { clearInterval(timer); clearInterval(dotInterval); };
  }, [stage]);

  // Auto-navigate after success
  useEffect(() => {
    if (stage !== 'success') return;
    const timer = setTimeout(() => {
      onSuccess?.();
    }, 1800);
    return () => clearTimeout(timer);
  }, [stage, onSuccess]);

  const handleAppSelect = async (app) => {
    setSelectedApp(app);
    setStage('processing');
    setCountdown(5);
    try {
      await onCreateBooking?.();
    } catch (err) {
      // Booking failed — surface the error so user knows payment did not complete
      setStage('select');
      alert('Booking failed: ' + (err?.response?.data?.detail || err?.message || 'Please try again.'));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-[60] flex items-end sm:items-center justify-center" data-testid="upi-payment-modal">
      <div className="bg-white rounded-t-3xl sm:rounded-2xl w-full sm:max-w-sm overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="bg-[#1C1D2B] px-6 pt-6 pb-5 text-center relative">
          {stage === 'select' && (
            <button onClick={onClose} className="absolute top-4 right-4 text-white/50 hover:text-white" data-testid="upi-close-btn">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
          <p className="text-gray-400 text-[10px] uppercase tracking-widest mb-1">Amount to pay</p>
          <p className="text-white text-3xl font-black">{'\u20B9'}{amount}</p>
          <div className="flex items-center justify-center gap-2 mt-2">
            <span className="text-gray-400 text-xs">Bay {bayCode}</span>
            <span className="text-gray-600">-</span>
            <span className="text-gray-400 text-xs">{lotName}</span>
          </div>
        </div>

        {/* Body */}
        <div className="bg-white px-6 pt-6 pb-8">
          {stage === 'select' && (
            <>
              {/* UPI Payment QR */}
              <div className="flex flex-col items-center gap-2 mb-5">
                <div className="bg-white border border-gray-100 rounded-2xl p-3 shadow-sm">
                  {paymentQrUrl
                    ? <img src={paymentQrUrl} alt="UPI payment QR" width={140} height={140} />
                    : <div className="w-[140px] h-[140px] bg-gray-100 rounded-xl animate-pulse" />
                  }
                </div>
                <p className="text-xs text-gray-400 text-center">Scan with any UPI app to pay ₹{amount}</p>
              </div>

              <div className="flex items-center gap-3 mb-4">
                <div className="flex-1 h-px bg-gray-100" />
                <span className="text-xs text-gray-400 font-medium">or choose an app</span>
                <div className="flex-1 h-px bg-gray-100" />
              </div>

              <div className="flex flex-col gap-2.5">
                {UPI_APPS.map(app => (
                  <button
                    key={app.id}
                    onClick={() => handleAppSelect(app)}
                    data-testid={`upi-app-${app.id}`}
                    className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl border transition-all hover:shadow-md active:scale-[0.98] ${app.color}`}
                  >
                    {app.icon}
                    <span className="text-sm font-semibold text-gray-900 flex-1 text-left">{app.name}</span>
                    <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                ))}
              </div>

              {/* UPI ID option */}
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center gap-2 px-1 mb-2">
                  <span className="text-xs text-gray-400">Or pay with UPI ID</span>
                </div>
                <div className={`flex items-center border rounded-xl overflow-hidden ${upiId && !upiIdValid ? 'border-red-300' : 'border-gray-200'}`}>
                  <input
                    type="text"
                    placeholder="username@upi"
                    value={upiId}
                    onChange={e => setUpiId(e.target.value)}
                    aria-label="UPI ID"
                    className="flex-1 px-4 py-3 text-sm outline-none text-gray-900"
                    data-testid="upi-id-input"
                  />
                  <button
                    onClick={() => upiIdValid && handleAppSelect({ id: 'upi', name: 'UPI' })}
                    disabled={!upiIdValid}
                    data-testid="upi-id-pay-btn"
                    className="px-4 py-3 bg-[#1C1D2B] text-white text-xs font-bold uppercase tracking-wide disabled:opacity-40 disabled:cursor-not-allowed">
                    Pay
                  </button>
                </div>
                {upiId && !upiIdValid && (
                  <p className="text-xs text-red-500 mt-1 px-1">Enter a valid UPI ID (e.g. name@okicici)</p>
                )}
              </div>

              <div className="flex items-center justify-center gap-1.5 mt-5">
                <LockIcon />
                <span className="text-[10px] text-gray-400">Secured by UPI - Payments processed instantly</span>
              </div>
            </>
          )}

          {stage === 'processing' && (
            <div className="flex flex-col items-center gap-4 py-6" data-testid="upi-processing">
              {/* Animated pulse ring */}
              <div className="relative">
                <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center">
                  {selectedApp?.icon || <div className="w-8 h-8 rounded-lg bg-gray-200" />}
                </div>
                <div className="absolute inset-0 rounded-full border-2 border-blue-400 animate-ping opacity-30" />
              </div>

              <div className="text-center">
                <p className="text-base font-bold text-gray-900">Waiting for payment{dots}</p>
                <p className="text-sm text-gray-500 mt-1">
                  Complete the payment in {selectedApp?.name || 'your UPI app'}
                </p>
              </div>

              {/* Progress bar */}
              <div className="w-full max-w-[200px]">
                <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full transition-all duration-1000 ease-linear"
                    style={{ width: `${((5 - countdown) / 5) * 100}%` }} />
                </div>
                <p className="text-[10px] text-gray-400 text-center mt-1.5">Auto-verifying in {countdown}s</p>
              </div>

              <p className="text-xs text-gray-400 mt-2">Do not close this screen</p>
            </div>
          )}

          {stage === 'success' && (
            <div className="flex flex-col items-center gap-4 py-6" data-testid="upi-success">
              <CheckCircleAnimated />
              <div className="text-center">
                <p className="text-lg font-bold text-gray-900">Payment Successful</p>
                <p className="text-sm text-green-600 font-semibold mt-0.5">{'\u20B9'}{amount} paid via {selectedApp?.name || 'UPI'}</p>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-2.5 flex items-center gap-2">
                <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-xs text-green-700 font-medium">Bay {bayCode} confirmed</span>
              </div>
              <p className="text-xs text-gray-400 animate-pulse">Redirecting to your booking...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}