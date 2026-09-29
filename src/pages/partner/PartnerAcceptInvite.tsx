import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import API, { setAuthToken } from "../api";
import { useAuth } from "../context/AuthContext";
import AuthShell, { AuthCard } from "../components/auth/AuthShell";
import {
  clearManagedBusinessContext,
} from "../lib/partnerManagedContext";
import { clearAdminActiveBusinessId } from "../utils/adminTenant";
import {
  clearRefreshDead,
  resetSessionInvalidationGuard,
} from "../utils/sessionInvalidation";
import { syncLanguageOnLogin } from "../i18n/persistLanguage";

export default function PartnerAcceptInvite() {
  const navigate = useNavigate();
  const { refreshUser } = useAuth();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";
  const email = searchParams.get("email") || "";
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token || !email) {
      setError("This invitation link is missing required details.");
    }
  }, [token, email]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setLoading(true);
    try {
      const { data } = await API.post(
        "/auth/partner/accept-invite",
        { token, email, password },
        { withCredentials: true }
      );
      if (data?.accessToken) {
        resetSessionInvalidationGuard();
        clearRefreshDead();
        clearManagedBusinessContext();
        clearAdminActiveBusinessId();
        localStorage.setItem("token", data.accessToken);
        setAuthToken(data.accessToken);
        if (data.user) {
          localStorage.setItem("businessDetails", JSON.stringify(data.user));
          syncLanguageOnLogin(data.user);
        }
        refreshUser?.(true)?.catch?.(() => {});
        navigate(data.redirectUrl || "/partner/dashboard", { replace: true });
        return;
      }
      navigate("/login", { replace: true });
    } catch (err: any) {
      setError(err?.response?.data?.error || "This invitation is invalid or has expired.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell>
      <AuthCard
        title="Set up your Partner account"
        subtitle="Choose a password to open Partner Center. This invitation can be used once."
      >
        {error ? (
          <p className="mb-4 rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm font-bold text-rose-600" role="alert">
            {error}
          </p>
        ) : null}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            value={email}
            readOnly
            className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold text-slate-700"
          />
          <input
            type="password"
            placeholder="New password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-900 outline-none focus:border-violet-300 focus:ring-4 focus:ring-violet-100"
          />
          <input
            type="password"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-900 outline-none focus:border-violet-300 focus:ring-4 focus:ring-violet-100"
          />
          <button
            className="inline-flex h-12 w-full items-center justify-center rounded-2xl bg-gradient-to-l from-sky-500 via-indigo-500 to-violet-600 text-base font-black text-white disabled:opacity-70"
            type="submit"
            disabled={loading || !token || !email}
          >
            {loading ? "Saving..." : "Set password and continue"}
          </button>
        </form>
      </AuthCard>
    </AuthShell>
  );
}
