import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import API from "../../api";
import { useAuth } from "../../context/AuthContext";
import { detectPhoneCountrySync } from "../../utils/detectPhoneCountry";

/**
 * Short post-payment onboarding when the business profile is still pending.
 * Does not ask again for name/email from Google/Microsoft.
 */
export default function BusinessSetupGate() {
  const { t, i18n } = useTranslation();
  const { user, refreshUser } = useAuth() as {
    user?: { profilePending?: boolean; businessName?: string; name?: string; email?: string };
    refreshUser?: () => Promise<unknown>;
  };
  const [businessName, setBusinessName] = useState(String(user?.businessName || "").trim());
  const [phone, setPhone] = useState("");
  const [phoneCountry] = useState(detectPhoneCountrySync);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  if (!user?.profilePending) return null;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const name = businessName.trim();
    if (!name) {
      setError(t("register.enterBusinessName"));
      return;
    }
    setBusy(true);
    try {
      await API.post("/auth/complete-business-profile", {
        businessName: name,
        phone: phone.trim() || undefined,
      });
      if (typeof refreshUser === "function") await refreshUser();
    } catch {
      setError(t("register.genericError"));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[80] flex items-end justify-center bg-slate-950/45 p-4 sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="biz-setup-title"
    >
      <form
        onSubmit={onSubmit}
        className="w-full max-w-md space-y-4 rounded-[28px] border border-white/70 bg-white p-6 shadow-[0_30px_80px_rgba(15,23,42,0.28)]"
        dir={i18n.dir()}
      >
        <div className="text-start">
          <p className="text-[11px] font-black uppercase tracking-[0.18em] text-violet-600">
            BizUply
          </p>
          <h2 id="biz-setup-title" className="mt-2 text-2xl font-black tracking-tight text-slate-900">
            {t("register.setup.title")}
          </h2>
          <p className="mt-2 text-sm font-semibold leading-6 text-slate-600">
            {t("register.setup.subtitle")}
          </p>
        </div>

        <div className="text-start">
          <label className="mb-2 block text-sm font-bold text-slate-700">
            {t("register.businessName")}
          </label>
          <input
            value={businessName}
            onChange={(ev) => setBusinessName(ev.target.value)}
            placeholder={t("register.businessNamePlaceholder")}
            className="h-12 w-full rounded-2xl border border-slate-200 px-4 text-sm font-semibold outline-none focus:border-violet-300 focus:ring-4 focus:ring-violet-100"
            required
          />
        </div>

        <div className="text-start">
          <label className="mb-2 block text-sm font-bold text-slate-700">
            {t("register.phone")}{" "}
            <span className="font-semibold text-slate-400">({t("register.setup.optional")})</span>
          </label>
          <div className="rounded-2xl border border-slate-200 px-2 py-1.5">
            <PhoneInput
              country={phoneCountry}
              value={phone.replace(/^\+/, "")}
              onChange={(value: string) => setPhone(value ? `+${value}` : "")}
              inputStyle={{
                width: "100%",
                height: "42px",
                border: "0",
                direction: "ltr",
                textAlign: "left",
                fontWeight: 600,
              }}
              buttonStyle={{ border: "0", background: "transparent" }}
            />
          </div>
        </div>

        {error ? (
          <p className="rounded-2xl bg-rose-50 px-3 py-2 text-sm font-bold text-rose-600" role="alert">
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={busy}
          className="inline-flex h-12 w-full items-center justify-center rounded-2xl bg-gradient-to-l from-sky-500 via-indigo-500 to-violet-600 text-base font-black text-white disabled:opacity-70"
        >
          {busy ? t("register.setup.saving") : t("register.setup.continue")}
        </button>
      </form>
    </div>
  );
}
