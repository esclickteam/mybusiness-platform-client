import React, { useState } from "react";
import API from "../api";

type ForgotPasswordProps = {
  closePopup: () => void;
};

type ApiError = {
  response?: {
    data?: {
      error?: string;
    };
  };
  message?: string;
};

export default function ForgotPassword({ closePopup }: ForgotPasswordProps) {
  const [email, setEmail] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleSendReset = async () => {
    if (!email.trim()) {
      setMessage("Please enter your email address");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      await API.post("/auth/forgot-password", {
        email: email.trim().toLowerCase(),
      });

      setMessage("A reset link has been sent to your email.");
    } catch (error) {
      const apiError = error as ApiError;

      console.error("❌ Error sending reset link:", apiError);

      setMessage(
        apiError.response?.data?.error ||
          "Unexpected error. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const isSuccess = message.toLowerCase().includes("reset link");

  return (
    <div
      className="fixed inset-0 z-[99999] grid place-items-center border border-violet-200/80 bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 text-slate-800/40 p-4 backdrop-blur-xl"
      role="dialog"
      aria-modal="true"
      aria-labelledby="forgot-password-title"
    >
      {/* Overlay */}
      <button
        type="button"
        aria-label="Close reset password modal"
        onClick={closePopup}
        className="absolute inset-0 h-full w-full cursor-default"
      />

      <div className="relative w-full max-w-[440px] overflow-hidden rounded-[2rem] border border-white/80 bg-white/80 p-2 shadow-[0_30px_100px_rgba(15,23,42,0.28)] backdrop-blur-2xl sm:rounded-[2.5rem] sm:p-3">
        <div className="overflow-hidden rounded-[1.6rem] border border-slate-100 bg-white sm:rounded-[2rem]">
          {/* Header */}
          <div className="relative overflow-hidden border border-violet-200/80 bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 text-slate-800">
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-indigo-500/35 blur-3xl" />
              <div className="absolute -bottom-24 left-10 h-56 w-56 rounded-full bg-cyan-400/25 blur-3xl" />
            </div>

            <div className="relative">
              <div className="mb-6 grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-indigo-500 to-cyan-400 text-xl font-black shadow-xl shadow-indigo-950/30">
                ✦
              </div>

              <h2
                id="forgot-password-title"
                className="text-3xl font-black tracking-[-0.04em]"
              >
                Reset Password
              </h2>

              <p className="mt-2 text-sm font-semibold leading-6 text-slate-300">
                Enter your email address and we’ll send you a secure reset link.
              </p>
            </div>
          </div>

          {/* Body */}
          <div className="bg-gradient-to-br from-white to-indigo-50/60 px-7 py-7">
            <label
              htmlFor="reset-email"
              className="mb-2 block text-sm font-black text-slate-700"
            >
              Email address
            </label>

            <input
              id="reset-email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setEmail(e.target.value)
              }
              disabled={loading}
              autoComplete="email"
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-4 text-sm font-semibold text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 disabled:cursor-not-allowed disabled:opacity-70"
            />

            {message && (
              <div
                className={`mt-5 rounded-2xl border px-4 py-3 text-sm font-bold leading-6 ${
                  isSuccess
                    ? "border-emerald-100 bg-emerald-50 text-emerald-700"
                    : "border-rose-100 bg-rose-50 text-rose-600"
                }`}
                role="alert"
              >
                {isSuccess ? "✅ " : "⚠️ "}
                {message}
              </div>
            )}

            <button
              type="button"
              onClick={handleSendReset}
              disabled={loading}
              className="group mt-6 inline-flex w-full items-center justify-center rounded-full bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 border border-violet-200/80 px-8 py-4 text-base font-black text-black shadow-[0_18px_40px_rgba(99,102,241,0.28)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? "Sending..." : "Send Reset Link"}

              {!loading && (
                <span className="ml-2 transition group-hover:translate-x-1">
                  →
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={closePopup}
              className="mt-4 inline-flex w-full items-center justify-center rounded-full border border-slate-200 bg-white px-8 py-4 text-base font-black text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}