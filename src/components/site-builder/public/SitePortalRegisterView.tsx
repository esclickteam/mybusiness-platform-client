import React, { useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { sitePortalRegister } from "../../../api/sitePortalApi";
import { getTextDirection } from "../../../i18n/localeUtils";

type Props = {
  siteName?: string;
  siteId?: string;
  returnPath?: string;
  onSuccess?: (siteId: string) => void;
};

export default function SitePortalRegisterView({
  siteName = "",
  siteId = "",
  returnPath = "/portal/account",
  onSuccess,
}: Props) {
  const { t, i18n } = useTranslation();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
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
      const result = await sitePortalRegister({
        email,
        password,
        fullName,
        phone,
        siteId: siteId || undefined,
        host: typeof window !== "undefined" ? window.location.host : undefined,
      });

      const nextSiteId = result.site?.id || siteId;
      onSuccess?.(nextSiteId);

      const target =
        returnPath && returnPath.startsWith("/") && returnPath !== "/portal/register"
          ? returnPath
          : "/portal/account";
      window.history.replaceState({}, "", target);
      window.dispatchEvent(new PopStateEvent("popstate"));
    } catch (err: any) {
      setError(err?.message || t("publicWidgets.portal.registerFailed"));
    } finally {
      inFlightRef.current = false;
      setLoading(false);
    }
  }

  return (
    <div
      dir={getTextDirection(i18n.language)}
      data-bizuply-portal-auth="register"
      className="relative z-[2147483000] flex min-h-screen items-center justify-center bg-gradient-to-b from-slate-50 via-white to-sky-50 px-4 py-10"
    >
      <div className="w-full max-w-md rounded-[28px] border border-slate-200 bg-white p-8 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
        <p className="text-xs font-bold tracking-wide text-sky-700">
          {t("publicWidgets.portal.area")}
        </p>
        <h1 className="mt-2 text-2xl font-black text-slate-900">
          {siteName
            ? t("publicWidgets.portal.registerTo", { name: siteName })
            : t("publicWidgets.portal.registerTitle")}
        </h1>
        <p className="mt-2 text-sm font-medium leading-6 text-slate-500">
          {t("publicWidgets.portal.registerSubtitle")}
        </p>

        <form
          onSubmit={handleSubmit}
          data-bizuply-portal-auth-form="register"
          className="mt-6 space-y-4"
        >
          <label className="block">
            <span className="mb-1.5 block text-xs font-bold text-slate-600">
              {t("publicWidgets.common.fullName")}
            </span>
            <input
              type="text"
              name="fullName"
              required
              autoComplete="name"
              data-bizuply-portal-auth-field="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800 outline-none ring-sky-200 transition focus:bg-white focus:ring-2"
              placeholder={t("publicWidgets.common.fullName")}
            />
          </label>

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
              {t("publicWidgets.portal.phoneOptional")}
            </span>
            <input
              type="tel"
              name="phone"
              autoComplete="tel"
              data-bizuply-portal-auth-field="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800 outline-none ring-sky-200 transition focus:bg-white focus:ring-2"
              placeholder="050-0000000"
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
              autoComplete="new-password"
              data-bizuply-portal-auth-field="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800 outline-none ring-sky-200 transition focus:bg-white focus:ring-2"
              placeholder="••••••••"
            />
          </label>

          {error ? (
            <p className="rounded-2xl bg-rose-50 px-3 py-2 text-xs font-bold text-rose-600">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            aria-busy={loading}
            data-bizuply-portal-auth-submit="register"
            className="w-full rounded-2xl bg-slate-900 px-4 py-3 text-sm font-black text-white transition hover:bg-slate-800 disabled:opacity-60"
          >
            {loading
              ? t("publicWidgets.portal.creatingAccount")
              : t("publicWidgets.portal.createAccount")}
          </button>
        </form>

        <p className="mt-5 text-center text-sm font-medium text-slate-500">
          {t("publicWidgets.portal.alreadyHaveAccount")}{" "}
          <a href="/portal/login" className="font-bold text-sky-700 hover:underline">
            {t("publicWidgets.portal.login")}
          </a>
        </p>
      </div>
    </div>
  );
}
