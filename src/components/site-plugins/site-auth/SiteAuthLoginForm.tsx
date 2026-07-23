import React, { useState } from "react";
import { Link } from "react-router-dom";

import type { SiteAuthWidgetSettings } from "./siteAuthUtils";
import { useSiteMemberAuth } from "../../../context/SiteMemberAuthContext";

const inputClass =
  "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-800 outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-100";

type SiteAuthLoginFormProps = {
  settings: SiteAuthWidgetSettings;
  brandColor?: string;
  compact?: boolean;
  onSuccess?: () => void;
  onForgotPassword?: () => void;
};

export default function SiteAuthLoginForm({
  settings,
  brandColor = "#6366F1",
  compact = false,
  onSuccess,
  onForgotPassword,
}: SiteAuthLoginFormProps) {
  const { login, register } = useSiteMemberAuth();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [loginValue, setLoginValue] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (mode === "login") {
        await login(loginValue, password);
      } else {
        await register({
          email: email || undefined,
          username: username || undefined,
          password,
          displayName: displayName || undefined,
        });
      }
      onSuccess?.();
    } catch (err: any) {
      setError(err?.message || "שגיאה");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className={compact ? "space-y-3" : "space-y-4"} onSubmit={handleSubmit}>
      {mode === "login" ? (
        <label className="block space-y-2">
          <span className="text-sm font-bold text-slate-700">אימייל או שם משתמש</span>
          <input
            className={inputClass}
            value={loginValue}
            onChange={(e) => setLoginValue(e.target.value)}
            autoComplete="username"
            required
          />
        </label>
      ) : (
        <>
          <label className="block space-y-2">
            <span className="text-sm font-bold text-slate-700">אימייל</span>
            <input
              className={inputClass}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </label>
          <label className="block space-y-2">
            <span className="text-sm font-bold text-slate-700">שם משתמש</span>
            <input
              className={inputClass}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
            />
          </label>
          <label className="block space-y-2">
            <span className="text-sm font-bold text-slate-700">שם תצוגה</span>
            <input
              className={inputClass}
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
            />
          </label>
        </>
      )}

      <label className="block space-y-2">
        <span className="text-sm font-bold text-slate-700">סיסמה</span>
        <input
          className={inputClass}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete={mode === "login" ? "current-password" : "new-password"}
          minLength={6}
          required
        />
      </label>

      {error ? (
        <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm font-bold text-rose-600">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-2xl px-4 py-3 text-sm font-black text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        style={{ backgroundColor: brandColor }}
      >
        {loading
          ? "מעבד..."
          : mode === "login"
            ? settings.loginButtonLabel
            : "הרשמה"}
      </button>

      {mode === "login" && settings.forgotPasswordEnabled ? (
        onForgotPassword ? (
          <button
            type="button"
            className="block w-full text-center text-sm font-bold text-violet-600"
            onClick={onForgotPassword}
          >
            שכחתי סיסמה
          </button>
        ) : (
          <Link
            to="/forgot-password"
            className="block text-center text-sm font-bold text-violet-600"
          >
            שכחתי סיסמה
          </Link>
        )
      ) : null}

      {settings.allowSelfRegister ? (
        <button
          type="button"
          className="w-full text-sm font-bold text-slate-500"
          onClick={() => {
            setMode(mode === "login" ? "register" : "login");
            setError("");
          }}
        >
          {mode === "login" ? "אין לך חשבון? הרשמה" : "יש לך חשבון? התחברות"}
        </button>
      ) : null}
    </form>
  );
}
