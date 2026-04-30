import React, { useState, useEffect } from 'react';

const DEMO_OTP = '0000';

export default function AuthModal({ isOpen, onClose, onLoginSuccess }) {
  const [step, setStep] = useState('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(Array(6).fill(''));
  const [countdown, setCountdown] = useState(30);

  useEffect(() => {
    if (step !== 'otp') return;
    setCountdown(30);
    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) { clearInterval(interval); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [step]);

  if (!isOpen) return null;

  const handlePhoneContinue = () => {
    if (phone.length < 10) return;
    setStep('otp');
    setOtp(Array(6).fill(''));
    setCountdown(30);
  };

  const handleOtpChange = (index, value) => {
    if (value && !/^\d$/.test(value)) return;
    const next = [...otp];
    next[index] = value;
    setOtp(next);
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleOtpContinue = () => {
    const code = otp.join('');
    if (code !== DEMO_OTP && otp.filter(Boolean).length < 6) return;
    onLoginSuccess?.(phone);
    onClose?.();
    setStep('phone');
    setPhone('');
    setOtp(Array(6).fill(''));
  };

  const handleResend = () => {
    setOtp(Array(6).fill(''));
    setCountdown(30);
  };

  const handleBackdropClick = () => {
    onClose?.();
    setStep('phone');
    setPhone('');
    setOtp(Array(6).fill(''));
  };

  // Focus trap: keep Tab key inside the modal
  const handleModalKeyDown = (e) => {
    if (e.key !== 'Tab') return;
    const modal = e.currentTarget;
    const focusable = modal.querySelectorAll(
      'button, input, a, [tabindex]:not([tabindex="-1"])'
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey ? document.activeElement === first : document.activeElement === last) {
      e.preventDefault();
      (e.shiftKey ? last : first).focus();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center" onClick={handleBackdropClick} data-testid="auth-modal">
      <div className="bg-white rounded-t-3xl sm:rounded-2xl w-full sm:max-w-sm overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()} onKeyDown={handleModalKeyDown} role="dialog" aria-modal="true" aria-label="Sign in to ParkEase">
        <div className="bg-gradient-to-br from-[#7B2FBE] to-[#9B59B6] px-6 pt-8 pb-12 text-center relative">
          <button onClick={handleBackdropClick} className="absolute top-4 right-4 text-white/70 hover:text-white" aria-label="Close" data-testid="auth-close-btn">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div className="inline-flex items-center gap-2 mb-2">
            <div className="bg-white/20 rounded-lg p-2">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4" />
              </svg>
            </div>
            <span className="text-white text-xl font-bold">ParkEase</span>
          </div>
          <p className="text-white/80 text-sm">Smart Parking, Simplified.</p>
        </div>

        <div className="bg-white rounded-t-3xl -mt-6 relative px-6 pt-6 pb-8">
          {step === 'phone' ? (
            <>
              <h2 className="text-gray-900 text-xl font-bold mb-1">Enter your mobile number</h2>
              <p className="text-gray-500 text-sm mb-6">New to ParkEase? We'll create your account.</p>
              <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden mb-4 focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100">
                <div className="flex items-center gap-1 px-3 py-3 border-r border-gray-300 bg-gray-50 text-sm text-gray-700">
                  <span>+91</span>
                </div>
                <input type="tel" maxLength={10} value={phone}
                  onChange={e => setPhone(e.target.value.replace(/\D/g, ''))}
                  placeholder="Enter mobile number"
                  data-testid="phone-input"
                  className="flex-1 px-3 py-3 outline-none text-gray-900 text-sm bg-white" />
              </div>
              <button onClick={handlePhoneContinue} disabled={phone.length < 10}
                data-testid="phone-continue-btn"
                className="w-full bg-[#1C1D2B] text-white font-bold py-3.5 rounded-xl uppercase tracking-wide text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-800 mb-4">
                Continue
              </button>
              <p className="text-center text-xs text-gray-400">By continuing, you agree to our Terms of Service & Privacy Policy</p>
            </>
          ) : (
            <>
              <h2 className="text-gray-900 text-xl font-bold mb-1">Enter OTP</h2>
              <p className="text-gray-500 text-sm mb-6">
                Sent to +91 {phone}{' '}
                <button onClick={() => setStep('phone')} className="text-indigo-600 font-medium hover:underline">(Change)</button>
              </p>
              <div className="flex gap-2 mb-4 justify-center">
                {[0, 1, 2, 3, 4, 5].map(i => (
                  <input key={i} id={`otp-${i}`} type="tel" maxLength={1} value={otp[i] || ''}
                    onChange={e => handleOtpChange(i, e.target.value)}
                    onKeyDown={e => handleOtpKeyDown(i, e)}
                    aria-label={`OTP digit ${i + 1} of 6`}
                    data-testid={`otp-input-${i}`}
                    className="w-11 h-12 text-center text-lg font-bold border-2 rounded-xl outline-none border-gray-300 text-gray-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" />
                ))}
              </div>
              <p className="text-center text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg py-2 px-3 mb-3">
                Demo mode · Use OTP: 0000
              </p>
              <button onClick={handleOtpContinue} disabled={otp.join('') !== DEMO_OTP && otp.filter(Boolean).length < 6}
                data-testid="otp-verify-btn"
                className="w-full bg-[#1C1D2B] text-white font-bold py-3.5 rounded-xl uppercase tracking-wide text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-800 mb-4">
                Verify & Continue
              </button>
              <p className="text-center text-sm text-gray-500">
                {countdown > 0 ? (
                  <>Didn't get OTP? Resend in 00:{String(countdown).padStart(2, '0')}s</>
                ) : (
                  <button onClick={handleResend} className="text-indigo-600 font-medium" data-testid="resend-otp-btn">Resend OTP</button>
                )}
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}