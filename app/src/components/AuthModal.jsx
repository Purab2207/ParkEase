import { useState, useEffect } from "react";
import { requestOtp, verifyOtp } from "../api";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function AuthModal({ isOpen, onClose, onLoginSuccess }) {
  const [step, setStep] = useState("details"); // 'details' | 'otp'
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [countdown, setCountdown] = useState(30);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (step !== "otp") return;
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) { clearInterval(interval); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [step, countdown === 30]);

  if (!isOpen) return null;

  const canContinue = phone.length === 10 && EMAIL_RE.test(email);

  async function sendOtp() {
    setSending(true);
    setError("");
    try {
      await requestOtp(phone, email);
      setStep("otp");
      setOtp(Array(6).fill(""));
      setCountdown(30);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setSending(false);
    }
  }

  async function handleResend() {
    setOtp(Array(6).fill(""));
    setCountdown(30);
    await sendOtp();
  }

  function handleOtpChange(index, value) {
    if (value && !/^\d$/.test(value)) return;
    const next = [...otp];
    next[index] = value;
    setOtp(next);
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  }

  function handleOtpKeyDown(index, e) {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  }

  async function handleOtpContinue() {
    const code = otp.join("");
    if (code.length < 6) return;
    setError("");
    try {
      await verifyOtp(email, code, phone);
      onLoginSuccess?.(phone, email);
      handleClose();
    } catch {
      setError('Something went wrong. Please try again.');
      setOtp(Array(6).fill(""));
    }
  }

  function handleClose() {
    onClose?.();
    setStep("details");
    setPhone("");
    setEmail("");
    setOtp(Array(6).fill(""));
    setError("");
  }

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center"
      onClick={handleClose}
    >
      <div
        className="bg-white rounded-t-3xl sm:rounded-2xl w-full sm:max-w-sm overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Gradient header */}
        <div className="bg-gradient-to-br from-[#7B2FBE] to-[#9B59B6] px-6 pt-8 pb-12 text-center relative">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors"
            aria-label="Close"
          >
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

        {/* Body */}
        <div className="bg-white rounded-t-3xl -mt-6 relative px-6 pt-6 pb-8">
          {step === "details" ? (
            <>
              <h2 className="text-gray-900 text-xl font-bold mb-1">Sign in to ParkEase</h2>
              <p className="text-gray-500 text-sm mb-5">New here? We'll create your account automatically.</p>

              {/* Phone */}
              <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden mb-3 focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100">
                <div className="flex items-center gap-1 px-3 py-3 border-r border-gray-300 bg-gray-50 text-sm text-gray-700 shrink-0">
                  <span>🇮🇳</span>
                  <span>+91</span>
                </div>
                <input
                  type="tel"
                  maxLength={10}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                  placeholder="Mobile number"
                  className="flex-1 px-3 py-3 outline-none text-gray-900 text-sm bg-white"
                />
              </div>

              {/* Email */}
              <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden mb-5 focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100">
                <div className="flex items-center px-3 py-3 border-r border-gray-300 bg-gray-50 shrink-0">
                  <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value.trim())}
                  placeholder="Email address (OTP will be sent here)"
                  className="flex-1 px-3 py-3 outline-none text-gray-900 text-sm bg-white"
                />
              </div>

              {error && <p className="text-red-500 text-xs mb-3">{error}</p>}

              <button
                onClick={sendOtp}
                disabled={!canContinue || sending}
                className="w-full bg-[#1C1D2B] text-white font-bold py-3.5 rounded-xl uppercase tracking-wide text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-800 transition-colors mb-4"
              >
                {sending ? "Sending OTP…" : "Continue"}
              </button>

              <p className="text-center text-xs text-gray-400">
                By continuing, you agree to our{" "}
                <a href="#" className="text-indigo-600 hover:underline">Terms of Service</a>{" "}
                &amp;{" "}
                <a href="#" className="text-indigo-600 hover:underline">Privacy Policy</a>
              </p>
            </>
          ) : (
            <>
              <h2 className="text-gray-900 text-xl font-bold mb-1">Enter OTP</h2>
              <p className="text-gray-500 text-sm mb-6">
                Sent to <span className="font-medium text-gray-700">{email}</span>{" "}
                <button onClick={() => setStep("details")} className="text-indigo-600 font-medium hover:underline">
                  (Change)
                </button>
              </p>

              <div className="flex gap-2 mb-4 justify-center">
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <input
                    key={i}
                    id={`otp-${i}`}
                    type="tel"
                    maxLength={1}
                    value={otp[i] || ""}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(i, e)}
                    className="w-11 h-12 text-center text-lg font-bold border-2 rounded-xl outline-none transition-colors border-gray-300 text-gray-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  />
                ))}
              </div>

              {/* Demo hint */}
              <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 mb-3">
                <span className="text-amber-500 text-xs">⚡</span>
                <p className="text-amber-700 text-xs">Demo mode: use <span className="font-bold tracking-widest">000000</span> to skip OTP</p>
              </div>

              {error && <p className="text-red-500 text-xs mb-3 text-center">{error}</p>}

              <button
                onClick={handleOtpContinue}
                disabled={otp.filter(Boolean).length < 6}
                className="w-full bg-[#1C1D2B] text-white font-bold py-3.5 rounded-xl uppercase tracking-wide text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-800 transition-colors mb-4"
              >
                Verify &amp; Continue
              </button>

              <p className="text-center text-sm text-gray-500">
                {countdown > 0 ? (
                  <>Didn't get it? Resend in 00:{String(countdown).padStart(2, "0")}s</>
                ) : (
                  <button onClick={handleResend} className="text-indigo-600 font-medium">
                    Resend OTP
                  </button>
                )}
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
