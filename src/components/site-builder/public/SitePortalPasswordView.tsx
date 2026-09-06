import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import {
  sitePortalForgotPassword,
  sitePortalResetPassword,
} from "../../../api/sitePortalApi";
import { getTextDirection } from "../../../i18n/localeUtils";

type Props = {
  mode: "forgot" | "reset";
  siteName?: string;
  siteId?: string;
  loginPath?: string;
  accountPath?: string;
  resetPath?: string;
};

/**
 * Fallback password-recovery screens for a published site that has not added
 * designed "forgot password" / "new password" pages yet. Site members only —
 * this never touches the BizUply platform account.
 */
export default function SitePortalPasswordView({
  mode,
  siteName = "",
  siteId = "",
  loginPath = "/portal/login",
  accountPath = "/portal/account",
  resetPath = "/portal/reset-password",
}: Props) {
  const { t, i18n } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const token = useMemo(() => {
    if (typeof window === "undefined") return "";
    return new URLSearchParams(window.location.search).get("token") || "";
  }, []);

  const handleForgot = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setNotice("");
    setBusy(true);

    try {
      const result = await sitePortalForgotPassword({
        email,
        siteId: siteId || undefined,
        resetPath,
      });

      setNotice(result?.message || t("publicWidgets.portal.resetSent"));
    } catch (err) {
      setError(
        err instanceof Error ? err.message : t("publicWidgets.portal.resetSendFailed"),
      );
    } finally {
      setBusy(false);
    }
  };

  const handleReset = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setNotice("");

    if (password.length < 6) {
      setError(t("publicWidgets.portal.passwordMinError"));
      return;
    }

    if (password !== confirmPassword) {
      setError(t("publicWidgets.portal.passwordsMismatch"));
      return;
    }

    setBusy(true);

    try {
      await sitePortalResetPassword({ token, password });
      window.location.replace(accountPath);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : t("publicWidgets.portal.resetFailed"),
      );
    } finally {
      setBusy(false);
    }
  };

  const inputClass =
    "mt-1 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-800 outline-none transition focus:border-slate-400";

  return (
    <div
      dir={getTextDirection(i18n.language)}
      className="flex min-h-screen items-center justify-center bg-slate-50 px-4"
    >
      <div className="w-full max-w-md rounded-[28px] border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-xs font-black tracking-wide text-slate-400">
          {t("publicWidgets.portal.area")}
        </p>
        <h1 className="mt-1 text-2xl font-black text-slate-900">
          {mode === "forgot"
            ? t("publicWidgets.portal.forgotPassword")
            : t("publicWidgets.portal.newPasswordTitle")}
        </h1>
        <p className="mt-2 text-sm font-medium leading-6 text-slate-500">
          {mode === "forgot"
            ? siteName
              ? t("publicWidgets.portal.forgotSubtitleNamed", { name: siteName })
              : t("publicWidgets.portal.forgotSubtitle")
            : t("publicWidgets.portal.newPasswordSubtitle")}
        </p>

        {error ? (
          <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-bold text-rose-700">
            {error}
          </div>
        ) : null}

        {notice ? (
          <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700">
            {notice}
          </div>
        ) : null}

        {mode === "forgot" ? (
          <form className="mt-5 space-y-4" onSubmit={handleForgot}>
            <label className="block text-xs font-black text-slate-500">
              {t("publicWidgets.common.email")}
              <input
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className={inputClass}
                dir="ltr"
              />
            </label>
            <button
              type="submit"
              disabled={busy}
              className="w-full rounded-2xl bg-slate-900 px-4 py-3 text-sm font-black text-white transition disabled:opacity-50"
            >
              {busy
                ? t("publicWidgets.portal.sending")
                : t("publicWidgets.portal.sendResetLink")}
            </button>
          </form>
        ) : (
          <form className="mt-5 space-y-4" onSubmit={handleReset}>
            {!token ? (
              <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-bold text-amber-800">
                {t("publicWidgets.portal.missingToken")}
              </div>
            ) : null}
            <label className="block text-xs font-black text-slate-500">
              {t("publicWidgets.portal.newPassword")}
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className={inputClass}
              />
            </label>
            <label className="block text-xs font-black text-slate-500">
              {t("publicWidgets.portal.confirmPassword")}
              <input
                type="password"
                required
                minLength={6}
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                className={inputClass}
              />
            </label>
            <button
              type="submit"
              disabled={busy || !token}
              className="w-full rounded-2xl bg-slate-900 px-4 py-3 text-sm font-black text-white transition disabled:opacity-50"
            >
              {busy
                ? t("publicWidgets.portal.saving")
                : t("publicWidgets.portal.savePassword")}
            </button>
          </form>
        )}

        <a
          href={loginPath}
          className="mt-5 inline-block text-sm font-black text-slate-500 hover:text-slate-800"
        >
          {t("publicWidgets.portal.backToLogin")}
        </a>
      </div>
    </div>
  );
}
