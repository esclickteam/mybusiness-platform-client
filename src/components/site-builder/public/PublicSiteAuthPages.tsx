import React, { useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

import {
  readSiteAuthSettings,
  siteMemberForgotPassword,
  siteMemberResetPassword,
  type SiteAuthSettings,
} from "../../../api/siteMemberAuthApi";
import { useSiteMemberAuth } from "../../../context/SiteMemberAuthContext";

type PublicSiteAuthShellProps = {
  site: Record<string, any>;
  title: string;
  children: React.ReactNode;
};

function PublicSiteAuthShell({ site, title, children }: PublicSiteAuthShellProps) {
  const siteName = String(site?.name || "האתר");
  const brandColor = String(site?.brand?.primaryColor || "#6366F1");

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10" dir="rtl">
      <div className="mx-auto w-full max-w-md">
        <div className="mb-6 text-center">
          <p className="text-xs font-bold text-slate-500">{siteName}</p>
          <h1 className="mt-2 text-2xl font-black text-slate-800">{title}</h1>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          {children}
        </div>

        <div className="mt-4 text-center">
          <Link
            to="/"
            className="text-sm font-bold text-slate-500 hover:text-slate-700"
            style={{ color: brandColor }}
          >
            חזרה לאתר
          </Link>
        </div>
      </div>
    </div>
  );
}

function AuthField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-bold text-slate-700">{label}</span>
      {children}
    </label>
  );
}

const inputClass =
  "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-800 outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-100";

function AuthButton({
  children,
  disabled,
  onClick,
  type = "submit",
}: {
  children: React.ReactNode;
  disabled?: boolean;
  onClick?: () => void;
  type?: "button" | "submit";
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className="w-full rounded-2xl bg-violet-600 px-4 py-3 text-sm font-black text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {children}
    </button>
  );
}

export function PublicSiteLoginPage({ site }: { site: Record<string, any> }) {
  const settings = useMemo(() => readSiteAuthSettings(site), [site]);
  const { login, register, isAuthenticated } = useSiteMemberAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [loginValue, setLoginValue] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate(settings.memberAreaPath || "/", { replace: true });
    }
  }, [isAuthenticated, navigate, settings.memberAreaPath]);

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
      navigate(settings.memberAreaPath || "/", { replace: true });
    } catch (err: any) {
      setError(err?.message || "שגיאה");
    } finally {
      setLoading(false);
    }
  }

  return (
    <PublicSiteAuthShell site={site} title={settings.loginPageTitle}>
      <form className="space-y-4" onSubmit={handleSubmit}>
        {mode === "login" ? (
          <AuthField label="אימייל או שם משתמש">
            <input
              className={inputClass}
              value={loginValue}
              onChange={(e) => setLoginValue(e.target.value)}
              autoComplete="username"
              required
            />
          </AuthField>
        ) : (
          <>
            <AuthField label="אימייל">
              <input
                className={inputClass}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </AuthField>
            <AuthField label="שם משתמש">
              <input
                className={inputClass}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
              />
            </AuthField>
            <AuthField label="שם תצוגה">
              <input
                className={inputClass}
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
              />
            </AuthField>
          </>
        )}

        <AuthField label="סיסמה">
          <input
            className={inputClass}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete={
              mode === "login" ? "current-password" : "new-password"
            }
            minLength={6}
            required
          />
        </AuthField>

        {error ? (
          <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm font-bold text-rose-600">
            {error}
          </p>
        ) : null}

        <AuthButton disabled={loading}>
          {loading
            ? "מעבד..."
            : mode === "login"
              ? settings.loginButtonLabel
              : "הרשמה"}
        </AuthButton>

        {mode === "login" && settings.forgotPasswordEnabled ? (
          <Link
            to="/forgot-password"
            className="block text-center text-sm font-bold text-violet-600"
          >
            שכחתי סיסמה
          </Link>
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
    </PublicSiteAuthShell>
  );
}

export function PublicSiteForgotPasswordPage({
  site,
}: {
  site: Record<string, any>;
}) {
  const slug = String(site?.slug || "");
  const settings = useMemo(() => readSiteAuthSettings(site), [site]);
  const [loginValue, setLoginValue] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const data = await siteMemberForgotPassword(slug, loginValue);
      setMessage(data.message);
    } catch (err: any) {
      setError(err?.message || "שגיאה");
    } finally {
      setLoading(false);
    }
  }

  if (!settings.forgotPasswordEnabled) {
    return (
      <PublicSiteAuthShell site={site} title="איפוס סיסמה">
        <p className="text-sm font-bold text-slate-600">
          איפוס סיסמה אינו פעיל באתר זה.
        </p>
      </PublicSiteAuthShell>
    );
  }

  return (
    <PublicSiteAuthShell site={site} title="שכחתי סיסמה">
      <form className="space-y-4" onSubmit={handleSubmit}>
        <AuthField label="אימייל או שם משתמש">
          <input
            className={inputClass}
            value={loginValue}
            onChange={(e) => setLoginValue(e.target.value)}
            required
          />
        </AuthField>

        {message ? (
          <p className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700">
            {message}
          </p>
        ) : null}

        {error ? (
          <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm font-bold text-rose-600">
            {error}
          </p>
        ) : null}

        <AuthButton disabled={loading}>
          {loading ? "שולח..." : "שליחת קישור לאיפוס"}
        </AuthButton>
      </form>
    </PublicSiteAuthShell>
  );
}

export function PublicSiteResetPasswordPage({
  site,
}: {
  site: Record<string, any>;
}) {
  const slug = String(site?.slug || "");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";
  const email = searchParams.get("email") || "";
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setMessage("");

    if (password !== confirmPassword) {
      setError("הסיסמאות אינן תואמות");
      return;
    }

    setLoading(true);
    try {
      const data = await siteMemberResetPassword(slug, {
        token,
        email,
        password,
      });
      setMessage(data.message);
      setTimeout(() => navigate("/login", { replace: true }), 1200);
    } catch (err: any) {
      setError(err?.message || "שגיאה");
    } finally {
      setLoading(false);
    }
  }

  return (
    <PublicSiteAuthShell site={site} title="איפוס סיסמה">
      <form className="space-y-4" onSubmit={handleSubmit}>
        <AuthField label="סיסמה חדשה">
          <input
            className={inputClass}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={6}
            required
          />
        </AuthField>

        <AuthField label="אימות סיסמה">
          <input
            className={inputClass}
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            minLength={6}
            required
          />
        </AuthField>

        {message ? (
          <p className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700">
            {message}
          </p>
        ) : null}

        {error ? (
          <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm font-bold text-rose-600">
            {error}
          </p>
        ) : null}

        <AuthButton disabled={loading || !token || !email}>
          {loading ? "שומר..." : "עדכון סיסמה"}
        </AuthButton>
      </form>
    </PublicSiteAuthShell>
  );
}

export function resolvePublicSiteAuthPage(
  pathname: string,
  site: Record<string, any>,
  settings: SiteAuthSettings
) {
  const path = String(pathname || "/").toLowerCase();

  if (path === "/login") {
    return <PublicSiteLoginPage site={site} />;
  }

  if (path === "/forgot-password" && settings.forgotPasswordEnabled) {
    return <PublicSiteForgotPasswordPage site={site} />;
  }

  if (path === "/reset-password") {
    return <PublicSiteResetPasswordPage site={site} />;
  }

  return null;
}
