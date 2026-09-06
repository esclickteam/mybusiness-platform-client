import React, { useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { sitePortalLogin } from "../../../api/sitePortalApi";
import { getTextDirection } from "../../../i18n/localeUtils";

type Props = {
  siteName?: string;
  siteId?: string;
  returnPath?: string;
  onSuccess?: (siteId: string) => void;
};

export default function SitePortalLoginView({
  siteName = "",
  siteId = "",
  returnPath = "/",
  onSuccess,
}: Props) {
  const { t, i18n } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const inFlightRef = useRef(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (loading || inFlightRef.current) return;
    inFlightRef.current = true;
    setLoading(true);
    setError("");

    try {
      const result = await sitePortalLogin({
        email,
        password,
        siteId: siteId || undefined,
        host: typeof window !== "undefined" ? window.location.host : undefined,
      });

      const nextSiteId = result.site?.id || siteId;
      onSuccess?.(nextSiteId);

      // Default landing after login: personal account hub with portal page links.
      const target =
        returnPath && returnPath.startsWith("/") && returnPath !== "/portal/login"
          ? returnPath
          : "/portal/account";
      window.history.replaceState({}, "", target);
      window.dispatchEvent(new PopStateEvent("popstate"));
    } catch (err: any) {
      setError(err?.message || t("publicWidgets.portal.loginFailed"));
    } finally {
      inFlightRef.current = false;
      setLoading(false);
    }
  }

  return (
    <div
      dir={getTextDirection(i18n.language)}
      data-bizuply-portal-auth="login"
      className="relative z-[2147483000] flex min-h-screen items-center justify-center bg-gradient-to-b from-slate-50 via-white to-sky-50 px-4 py-10"
    >
      <div className="w-full max-w-md rounded-[28px] border border-slate-200 bg-white p-8 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
        <p className="text-xs font-bold tracking-wide text-sky-700">
          {t("publicWidgets.portal.area")}
        </p>
        <h1 className="mt-2 text-2xl font-black text-slate-900">
          {siteName
            ? t("publicWidgets.portal.loginTo", { name: siteName })
            : t("publicWidgets.portal.loginTitle")}
        </h1>
        <p className="mt-2 text-sm font-medium leading-6 text-slate-500">
          {t("publicWidgets.portal.loginSubtitle")}
        </p>

        <form
          onSubmit={handleSubmit}
          data-bizuply-portal-auth-form="login"
          className="mt-6 space-y-4"
        >
          <label className="block">
            <span className="mb-1.5 block text-xs font-bold text-slate-600">
              {t("publicWidgets.common.email")}
            </span>
            <input
              type="email"
              name="email"
              required
              autoComplete="username"
              data-bizuply-portal-auth-field="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800 outline-none ring-sky-200 transition focus:bg-white focus:ring-2"
              placeholder="name@email.com"
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-xs font-bold text-slate-600">
              {t("publicWidgets.common.password")}
            </span>
            <input
              type="password"
              name="password"
              required
              autoComplete="current-password"
              data-bizuply-portal-auth-field="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800 outline-none ring-sky-200 transition focus:bg-white focus:ring-2"
              placeholder="••••••••"
            />
          </label>

          {error ? (
            <p
              data-bizuply-portal-auth-error="login"
              className="rounded-2xl bg-rose-50 px-3 py-2 text-xs font-bold text-rose-600"
            >
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            aria-busy={loading}
            data-bizuply-portal-login-submit=""
            data-bizuply-portal-auth-submit="login"
            className="w-full rounded-2xl bg-slate-900 px-4 py-3 text-sm font-black text-white transition hover:bg-slate-800 disabled:opacity-60"
          >
            {loading ? t("publicWidgets.portal.signingIn") : t("publicWidgets.portal.login")}
          </button>
        </form>

        <p className="mt-5 text-center text-sm font-medium text-slate-500">
          {t("publicWidgets.portal.noAccount")}{" "}
          <a href="/portal/register" className="font-bold text-sky-700 hover:underline">
            {t("publicWidgets.portal.register")}
          </a>
        </p>
      </div>
    </div>
  );
}
