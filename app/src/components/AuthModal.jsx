import { useState, useEffect } from "react";

export default function AuthModal({ isOpen, onClose, onLoginSuccess }) {
  const [step, setStep] = useState("phone"); // 'phone' | 'otp'
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [countdown, setCountdown] = useState(30);

  // Countdown timer when on OTP step
  useEffect(() => {
    if (step !== "otp") return;

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [step, countdown === 30]); // re-run when countdown resets to 30

  if (!isOpen) return null;

  const DEMO_OTP = "123456";

  function handlePhoneContinue() {
    if (phone.length < 10) return;
    setStep("otp");
    setOtp(Array(6).fill(""));
    setCountdown(30);
    // Simulate SMS delivery — auto-fill demo OTP after 1s
    setTimeout(() => {
      setOtp(DEMO_OTP.split(""));
    }, 1000);
  }

  function handleOtpChange(index, value) {
    // Accept only single digit
    if (value && !/^\d$/.test(value)) return;

    const next = [...otp];
    next[index] = value;
    setOtp(next);

    // Auto-advance to next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  }

  function handleOtpKeyDown(index, e) {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  }

  function handleOtpContinue() {
    if (otp.filter(Boolean).length < 6) return;
    onLoginSuccess?.(phone);
    onClose?.();
    // Reset state for next open
    setStep("phone");
    setPhone("");
    setOtp(Array(6).fill(""));
  }

  function handleResend() {
    setOtp(Array(6).fill(""));
    setCountdown(30);
  }

  function handleBackdropClick() {
    onClose?.();
    // Reset state on close
    setStep("phone");
    setPhone("");
    setOtp(Array(6).fill(""));
  }

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center"
      onClick={handleBackdropClick}
    >
      {/* Modal card */}
      <div
        className="bg-white rounded-t-3xl sm:rounded-2xl w-full sm:max-w-sm overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Gradient header */}
        <div className="bg-gradient-to-br from-[#7B2FBE] to-[#9B59B6] px-6 pt-8 pb-12 text-center relative">
          {/* Close button */}
          <button
            onClick={handleBackdropClick}
            className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors"
            aria-label="Close"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          {/* Logo */}
          <div className="inline-flex items-center gap-2 mb-2">
            <div className="bg-white/20 rounded-lg p-2">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4"
                />
              </svg>
            </div>
            <span className="text-white text-xl font-bold">ParkEase</span>
          </div>

          {/* Tagline */}
          <p className="text-white/80 text-sm">Smart Parking, Simplified.</p>
        </div>

        {/* White body (pulls up over gradient) */}
        <div className="bg-white rounded-t-3xl -mt-6 relative px-6 pt-6 pb-8">
          {step === "phone" ? (
            <>
              <h2 className="text-gray-900 text-xl font-bold mb-1">
                Enter your mobile number
              </h2>
              <p className="text-gray-500 text-sm mb-6">
                New to ParkEase? We'll create your account.
              </p>

              {/* Phone input row */}
              <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden mb-4 focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100">
                <div className="flex items-center gap-1 px-3 py-3 border-r border-gray-300 bg-gray-50 text-sm text-gray-700">
                  <span>🇮🇳</span>
                  <span>+91</span>
                </div>
                <input
                  type="tel"
                  maxLength={10}
                  value={phone}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, "");
                    setPhone(val);
                  }}
                  placeholder="Enter mobile number"
                  className="flex-1 px-3 py-3 outline-none text-gray-900 text-sm bg-white"
                />
              </div>

              {/* Continue button */}
              <button
                onClick={handlePhoneContinue}
                disabled={phone.length < 10}
                className="w-full bg-[#1C1D2B] text-white font-bold py-3.5 rounded-xl uppercase tracking-wide text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-800 transition-colors mb-4"
              >
                Continue
              </button>

              {/* T&C */}
              <p className="text-center text-xs text-gray-400">
                By continuing, you agree to our{" "}
                <a
                  href="#"
                  className="text-indigo-600 hover:underline"
                >
                  Terms of Service
                </a>{" "}
                &amp;{" "}
                <a
                  href="#"
                  className="text-indigo-600 hover:underline"
                >
                  Privacy Policy
                </a>
              </p>
            </>
          ) : (
            <>
              <h2 className="text-gray-900 text-xl font-bold mb-1">
                Enter OTP
              </h2>
              <p className="text-gray-500 text-sm mb-6">
                Sent to +91 {phone}{" "}
                <button
                  onClick={() => setStep("phone")}
                  className="text-indigo-600 font-medium hover:underline"
                >
                  (Change)
                </button>
              </p>

              {/* Demo OTP hint */}
              <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2 mb-4">
                <span className="text-amber-500 text-sm">📱</span>
                <p className="text-xs text-amber-700">Demo OTP <span className="font-mono font-bold tracking-widest">123456</span> — auto-filled via SMS</p>
              </div>

              {/* 6 OTP boxes */}
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

              {/* Verify button */}
              <button
                onClick={handleOtpContinue}
                disabled={otp.filter(Boolean).length < 6}
                className="w-full bg-[#1C1D2B] text-white font-bold py-3.5 rounded-xl uppercase tracking-wide text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-800 transition-colors mb-4"
              >
                Verify &amp; Continue
              </button>

              {/* Resend countdown */}
              <p className="text-center text-sm text-gray-500">
                {countdown > 0 ? (
                  <>
                    Didn't get OTP? Resend in 00:
                    {String(countdown).padStart(2, "0")}s
                  </>
                ) : (
                  <button
                    onClick={handleResend}
                    className="text-indigo-600 font-medium"
                  >
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
