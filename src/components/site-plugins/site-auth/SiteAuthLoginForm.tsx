import React, { useState } from "react";
import { Link } from "react-router-dom";

import type { SiteAuthWidgetSettings } from "./siteAuthUtils";
import {
  buildSiteAuthButtonStyle,
  buildSiteAuthInputStyle,
  buildSiteAuthLabelStyle,
  buildSiteAuthLinkStyle,
  resolveSiteAuthAccentColor,
} from "./siteAuthFormStyles";
import { useSiteMemberAuth } from "../../../context/SiteMemberAuthContext";

type SiteAuthLoginFormProps = {
  settings: SiteAuthWidgetSettings;
  brandColor?: string;
  compact?: boolean;
  onSuccess?: () => void;
  onForgotPassword?: () => void;
  initialMode?: "login" | "register";
};

export default function SiteAuthLoginForm({
  settings,
  brandColor = "#6366F1",
  compact = false,
  onSuccess,
  onForgotPassword,
  initialMode = "login",
}: SiteAuthLoginFormProps) {
  const { login, register } = useSiteMemberAuth();
  const [mode, setMode] = useState<"login" | "register">(initialMode);
  const [email, setEmail] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const labelStyle = buildSiteAuthLabelStyle(settings);
  const inputStyle = buildSiteAuthInputStyle(settings);
  const buttonStyle = buildSiteAuthButtonStyle(settings, brandColor);
  const linkStyle = buildSiteAuthLinkStyle(settings, brandColor);
  const accent = resolveSiteAuthAccentColor(settings, brandColor);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (mode === "login") {
        await login(email.trim(), password);
      } else {
        await register({
          email: email.trim(),
          password,
          displayName: displayName.trim(),
          phone: phone.trim(),
        });
      }
      onSuccess?.();
    } catch (err: any) {
      setError(err?.message || "שגיאה");
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "w-full border px-4 py-3 text-sm font-medium outline-none transition focus:ring-2";

  return (
    <form className={compact ? "space-y-3" : "space-y-4"} onSubmit={handleSubmit}>
      {mode === "login" ? (
        <label className="block space-y-2">
          <span className="text-sm font-bold" style={labelStyle}>
            אימייל
          </span>
          <input
            className={inputClass}
            style={{
              ...inputStyle,
              boxShadow: `0 0 0 2px ${accent}22`,
            }}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />
        </label>
      ) : (
        <>
          <label className="block space-y-2">
            <span className="text-sm font-bold" style={labelStyle}>
              שם מלא
            </span>
            <input
              className={inputClass}
              style={inputStyle}
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              autoComplete="name"
              required
            />
          </label>
          <label className="block space-y-2">
            <span className="text-sm font-bold" style={labelStyle}>
              טלפון
            </span>
            <input
              className={inputClass}
              style={inputStyle}
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              autoComplete="tel"
              required
            />
          </label>
          <label className="block space-y-2">
            <span className="text-sm font-bold" style={labelStyle}>
              אימייל
            </span>
            <input
              className={inputClass}
              style={inputStyle}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </label>
        </>
      )}

      <label className="block space-y-2">
        <span className="text-sm font-bold" style={labelStyle}>
          סיסמה
        </span>
        <input
          className={inputClass}
          style={inputStyle}
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
        className="w-full px-4 py-3 text-sm font-black transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        style={buttonStyle}
      >
        {loading
          ? "מעבד..."
          : mode === "login"
            ? settings.loginButtonLabel
            : settings.registerTitle || "הרשמה"}
      </button>

      {mode === "login" && settings.forgotPasswordEnabled ? (
        onForgotPassword ? (
          <button
            type="button"
            className="block w-full text-center text-sm font-bold"
            style={linkStyle}
            onClick={onForgotPassword}
          >
            שכחתי סיסמה
          </button>
        ) : (
          <Link
            to="/forgot-password"
            className="block text-center text-sm font-bold"
            style={linkStyle}
          >
            שכחתי סיסמה
          </Link>
        )
      ) : null}

      {settings.allowSelfRegister ? (
        <button
          type="button"
          className="w-full text-sm font-bold"
          style={{ color: accent }}
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
