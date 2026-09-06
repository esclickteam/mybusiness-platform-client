import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import API from "../api";
import AuthShell, { AuthCard } from "../components/auth/AuthShell";

export default function ResetPassword() {
  const { t } = useTranslation();
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
      setError(t("login.resetInvalidLink"));
    }
  }, [token, email, t]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!password || !confirmPassword) {
      setError(t("login.resetFillAll"));
      return;
    }
    if (password !== confirmPassword) {
      setError(t("login.resetMismatch"));
      return;
    }

    setLoading(true);
    try {
      await API.post("/auth/reset-password", {
        email,
        token,
        newPassword: password,
      });
      setMessage(t("login.resetSuccess"));
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      console.error("Password reset error:", err);
      setError(err.response?.data?.message || t("login.forgotError"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell>
      <AuthCard title={t("login.resetTitle")} subtitle={t("login.resetSubtitle")}>
        {error ? (
          <p className="mb-4 rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm font-bold text-rose-600" role="alert">
            {error}
          </p>
        ) : null}
        {message ? (
          <p className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700" role="status">
            {message}
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="password"
              placeholder={t("login.newPassword")}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-900 outline-none focus:border-violet-300 focus:ring-4 focus:ring-violet-100"
            />
            <input
              type="password"
              placeholder={t("login.confirmPassword")}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-900 outline-none focus:border-violet-300 focus:ring-4 focus:ring-violet-100"
            />
            <button
              className="inline-flex h-12 w-full items-center justify-center rounded-2xl bg-gradient-to-l from-sky-500 via-indigo-500 to-violet-600 text-base font-black text-white disabled:opacity-70"
              type="submit"
              disabled={loading || Boolean(error && !password)}
            >
              {loading ? t("common.loading") : t("login.resetSubmit")}
            </button>
          </form>
        )}
      </AuthCard>
    </AuthShell>
  );
}
