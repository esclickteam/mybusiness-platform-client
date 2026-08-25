import React, { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import API from "../api";
import AuthShell, { AuthCard } from "../components/auth/AuthShell";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token || !email) {
      setError("קישור איפוס הסיסמה אינו תקין");
    }
  }, [token, email]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!token || !email) {
      setError("קישור איפוס הסיסמה אינו תקין");
      return;
    }
    if (!password || !confirmPassword) {
      setError("יש למלא את כל השדות");
      return;
    }
    if (password !== confirmPassword) {
      setError("הסיסמאות אינן תואמות");
      return;
    }

    setLoading(true);
    try {
      const res = await API.post("/auth/reset-password", {
        email,
        token,
        newPassword: password,
      });
      setMessage(res.data.message);
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      console.error("Password reset error:", err);
      setError(err.response?.data?.message || "שגיאת שרת");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      headline={
        <>
          בחירת סיסמה{" "}
          <span className="bg-gradient-to-l from-sky-500 via-indigo-500 to-violet-600 bg-clip-text text-transparent">
            חדשה
          </span>
        </>
      }
    >
      <AuthCard title="איפוס סיסמה" subtitle="בחרו סיסמה חדשה לחשבון">
        {error ? (
          <p className="mb-4 rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm font-bold text-rose-600">
            {error}
          </p>
        ) : null}
        {message ? (
          <p className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700">
            {message}
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4" dir="rtl">
            <input
              type="password"
              placeholder="סיסמה חדשה"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              className="h-12 w-full rounded-2xl border border-slate-200 px-4 text-sm font-semibold text-slate-900 outline-none transition focus:border-violet-300 focus:ring-4 focus:ring-violet-100"
            />
            <input
              type="password"
              placeholder="אישור סיסמה"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
              className="h-12 w-full rounded-2xl border border-slate-200 px-4 text-sm font-semibold text-slate-900 outline-none transition focus:border-violet-300 focus:ring-4 focus:ring-violet-100"
            />
            <button
              className="inline-flex h-12 w-full items-center justify-center rounded-2xl bg-gradient-to-l from-sky-500 via-indigo-500 to-violet-600 text-base font-black text-white shadow-[0_14px_30px_rgba(99,102,241,0.35)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70"
              type="submit"
              disabled={loading || !token || !email}
            >
              {loading ? "שומר..." : "שמירת סיסמה"}
            </button>
            <p className="pt-1 text-center text-sm font-semibold text-slate-600">
              <Link
                to="/login"
                className="font-black text-violet-700 transition hover:text-indigo-700"
              >
                חזרה להתחברות
              </Link>
            </p>
          </form>
        )}
      </AuthCard>
    </AuthShell>
  );
};

export default ResetPassword;
