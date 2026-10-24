import React, { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Mail } from "lucide-react";

import API from "../api";
import { useTranslation } from "react-i18next";
import AuthShell, { AuthCard } from "../components/auth/AuthShell";
import { persistBillingCountry } from "../billing/billingMarkets";
import { useBillingMarket } from "../billing/useBillingMarket";
import { getManualLanguageChoice } from "../i18n/localeUtils";
import { loadPendingPurchaseIntent } from "../utils/pendingPurchaseIntent";
import SocialAuthButtons from "../components/auth/SocialAuthButtons";
import {
  DEFAULT_BIZUPLY_AUTH_PROVIDERS,
  fetchBizuplyAuthProviders,
  oauthErrorMessage,
  startBizuplySocialAuth,
  type SocialProvider,
} from "../components/auth/socialAuth";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

type PricingPlan = "monthly" | "yearly" | "website" | "crm_only";
type Step = "identity" | "otp";

const PLAN_LABEL_KEYS: Record<PricingPlan, string> = {
  monthly: "register.planMonthly",
  yearly: "register.planYearly",
  website: "register.planWebsite",
  crm_only: "register.planCrm",
};

function parsePlan(value: string | null): PricingPlan | null {
  if (value === "monthly" || value === "yearly" || value === "website" || value === "crm_only") {
    return value;
  }
  return null;
}

export default function Register() {
  const { t, i18n } = useTranslation();
  const billingMarket = useBillingMarket();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const selectedPlan = parsePlan(searchParams.get("plan"));
  const pendingPurchaseIntent = loadPendingPurchaseIntent();
  const pendingPurchaseSignup =
    searchParams.get("purchaseIntent") === "1" &&
    searchParams.get("redirect") === "/pricing" &&
    Boolean(pendingPurchaseIntent);
  // Kept for plan-first redirect exception only (staged upsell).
  const includeWebsiteAddon =
    searchParams.get("websiteAddon") === "1" &&
    (selectedPlan === "monthly" || selectedPlan === "yearly");
  const checkoutCancelled = searchParams.get("checkout") === "cancel";
  const referralCode =
    searchParams.get("ref") || localStorage.getItem("affiliate_referral") || "";

  const [error, setError] = useState("");
  const [purchaseIntentValidationFailed, setPurchaseIntentValidationFailed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [socialProviders, setSocialProviders] = useState<SocialProvider[]>(
    DEFAULT_BIZUPLY_AUTH_PROVIDERS
  );
  const [socialBusy, setSocialBusy] = useState<SocialProvider | "otp" | "email" | null>(null);
  const [step, setStep] = useState<Step>("identity");
  const [email, setEmail] = useState("");
  const [emailMasked, setEmailMasked] = useState("");
  const [otp, setOtp] = useState("");
  const [otpCooldown, setOtpCooldown] = useState(0);

  const oauthQueryError = oauthErrorMessage(
    searchParams.get("oauth_error"),
    searchParams.get("provider"),
    t
  );

  useEffect(() => {
    if (selectedPlan || pendingPurchaseSignup || purchaseIntentValidationFailed) return;
    const params = new URLSearchParams();
    if (referralCode) params.set("ref", referralCode);
    const qs = params.toString();
    navigate(qs ? `/pricing?${qs}` : "/pricing", { replace: true });
  }, [
    navigate,
    pendingPurchaseSignup,
    purchaseIntentValidationFailed,
    referralCode,
    selectedPlan,
  ]);

  useEffect(() => {
    let alive = true;
    void fetchBizuplyAuthProviders().then((list) => {
      if (alive) setSocialProviders(list);
    });
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    if (referralCode) localStorage.setItem("affiliate_referral", referralCode);
  }, [referralCode]);

  useEffect(() => {
    if (otpCooldown <= 0) return;
    const id = window.setInterval(() => {
      setOtpCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => window.clearInterval(id);
  }, [otpCooldown]);

  if (!selectedPlan && !pendingPurchaseSignup && !purchaseIntentValidationFailed) {
    return null;
  }

  const language = getManualLanguageChoice() || i18n.language;

  const handleSocialStart = (provider: SocialProvider) => {
    setError("");
    setSocialBusy(provider);
    startBizuplySocialAuth(provider, {
      intent: "signup",
      language,
      plan: selectedPlan,
      websiteAddon: includeWebsiteAddon,
      referralCode: referralCode || undefined,
      purchaseIntent: pendingPurchaseSignup,
    });
  };

  const startEmailOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const clean = email.trim().toLowerCase();
    if (!clean || !clean.includes("@")) {
      setError(t("register.identity.emailInvalid"));
      return;
    }
    if (!selectedPlan) {
      setError(t("register.genericError"));
      return;
    }
    setSocialBusy("email");
    setLoading(true);
    try {
      const { data } = await API.post("/auth/signup/email/start", {
        email: clean,
        plan: selectedPlan,
        includeWebsiteAddon,
        websiteAddon: includeWebsiteAddon,
        referralCode: referralCode || undefined,
        language,
        billingCountry: persistBillingCountry(billingMarket.billingCountry),
        clientOrigin: typeof window !== "undefined" ? window.location.origin : undefined,
      });
      setEmailMasked(String(data?.emailMasked || clean));
      setOtpCooldown(Number(data?.cooldownSeconds || 60) || 60);
      setStep("otp");
    } catch (err) {
      const apiErr = err as { response?: { data?: { code?: string } } };
      const code = apiErr.response?.data?.code;
      if (code === "email_registered") setError(t("register.emailExists"));
      else if (code === "whatsapp_account") setError(t("login.oauth.errors.whatsapp_account"));
      else if (code === "otp_cooldown") setError(t("login.oauth.errors.otp_cooldown"));
      else setError(t("register.identity.sendFailed"));
    } finally {
      setLoading(false);
      setSocialBusy(null);
    }
  };

  const resendOtp = async () => {
    if (otpCooldown > 0) return;
    setError("");
    setSocialBusy("otp");
    try {
      const { data } = await API.post("/auth/signup/email/send", {});
      setOtpCooldown(Number(data?.cooldownSeconds || 60) || 60);
      if (data?.emailMasked) setEmailMasked(String(data.emailMasked));
    } catch (err) {
      const apiErr = err as { response?: { data?: { code?: string; cooldownSeconds?: number } } };
      const code = apiErr.response?.data?.code;
      if (code === "otp_cooldown") {
        setOtpCooldown(Number(apiErr.response?.data?.cooldownSeconds || 60) || 60);
      }
      setError(t("register.identity.sendFailed"));
    } finally {
      setSocialBusy(null);
    }
  };

  const verifyOtpAndPay = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const code = otp.replace(/\D/g, "");
    if (code.length !== 6) {
      setError(t("login.oauth.errors.otp_invalid"));
      return;
    }
    setLoading(true);
    setSocialBusy("otp");
    try {
      const { data } = await API.post<{ url?: string }>("/auth/signup/email/verify", { code });
      if (!data?.url) {
        setError(t("register.checkoutFailed"));
        return;
      }
      if (window.fbq) window.fbq("track", "InitiateCheckout");
      window.location.href = data.url;
    } catch (err) {
      const apiErr = err as { response?: { data?: { code?: string } } };
      const code = apiErr.response?.data?.code || "otp_invalid";
      setError(
        t(`login.oauth.errors.${code}`, { defaultValue: t("login.oauth.errors.otp_invalid") })
      );
    } finally {
      setLoading(false);
      setSocialBusy(null);
    }
  };

  /** Staged unpaid exception: still uses /auth/register without a plan. */
  const handlePurchaseIntentEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(t("register.identity.useSocialForIntent"));
  };

  return (
    <AuthShell cardMaxWidthClassName="max-w-[480px]">
      <AuthCard
        title={t("register.identity.title")}
        subtitle={
          selectedPlan
            ? t("register.identity.subtitlePaid")
            : t("register.identity.subtitleFree")
        }
      >
        <div className="space-y-4">
          {selectedPlan ? (
            <div className="rounded-2xl border border-emerald-100 bg-gradient-to-l from-emerald-50 to-sky-50 px-4 py-3 text-start">
              <p className="text-sm font-black text-emerald-900">
                {t("register.selectedPlan", { plan: t(PLAN_LABEL_KEYS[selectedPlan]) })}
              </p>
              {includeWebsiteAddon ? (
                <p className="mt-1 text-xs font-semibold text-emerald-800/80">
                  {t("register.websiteAddonNote")}
                </p>
              ) : null}
              <p className="mt-1 text-xs font-semibold text-emerald-800/70">
                {t("register.identity.checkoutNote")}
              </p>
            </div>
          ) : null}

          {checkoutCancelled ? (
            <p
              className="rounded-2xl border border-amber-100 bg-amber-50 px-4 py-3 text-sm font-bold leading-6 text-amber-800"
              role="status"
            >
              {t("register.checkoutCancelled")}
            </p>
          ) : null}

          {step === "identity" ? (
            <>
              <SocialAuthButtons
                providers={socialProviders}
                labels={{
                  google: t("login.continueGoogle"),
                  microsoft: t("login.continueMicrosoft"),
                }}
                orLabel={t("login.or")}
                redirectingLabel={t("login.redirecting")}
                busy={socialBusy}
                onStart={handleSocialStart}
              />

              <form
                onSubmit={selectedPlan ? startEmailOtp : handlePurchaseIntentEmail}
                className="space-y-3"
              >
                <div className="text-start">
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    {t("register.identity.continueEmail")}
                  </label>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute end-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      type="email"
                      name="email"
                      autoComplete="email"
                      placeholder="name@company.com"
                      value={email}
                      onChange={(ev) => setEmail(ev.target.value)}
                      required
                      dir="ltr"
                      className="h-12 w-full rounded-2xl border border-slate-200 bg-white pe-11 ps-4 text-start text-sm font-semibold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-300 focus:ring-4 focus:ring-sky-100"
                    />
                  </div>
                </div>

                {error || oauthQueryError ? (
                  <p
                    className="rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm font-bold leading-6 text-rose-600"
                    role="alert"
                  >
                    {error || oauthQueryError}
                  </p>
                ) : null}

                <button
                  type="submit"
                  disabled={loading || socialBusy !== null}
                  className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-l from-sky-500 via-indigo-500 to-violet-600 text-base font-black text-white shadow-[0_14px_30px_rgba(99,102,241,0.35)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {loading ? t("register.identity.sendingCode") : t("register.identity.sendCode")}
                </button>
              </form>
            </>
          ) : (
            <form onSubmit={verifyOtpAndPay} className="space-y-3">
              <p className="text-sm font-semibold leading-6 text-slate-600">
                {t("register.identity.otpHint", { email: emailMasked || email })}
              </p>
              <div className="text-start">
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  {t("login.oauth.otpLabel")}
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  name="otp"
                  value={otp}
                  onChange={(ev) => setOtp(ev.target.value.replace(/\D/g, "").slice(0, 6))}
                  maxLength={6}
                  dir="ltr"
                  className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-center text-lg font-black tracking-[0.35em] text-slate-900 outline-none transition focus:border-sky-300 focus:ring-4 focus:ring-sky-100"
                />
              </div>
              <button
                type="button"
                disabled={otpCooldown > 0 || socialBusy !== null}
                onClick={() => void resendOtp()}
                className="text-sm font-bold text-violet-700 disabled:text-slate-400"
              >
                {otpCooldown > 0
                  ? t("login.oauth.otpResendIn", { seconds: otpCooldown })
                  : t("login.oauth.otpResend")}
              </button>

              {error ? (
                <p
                  className="rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm font-bold leading-6 text-rose-600"
                  role="alert"
                >
                  {error}
                </p>
              ) : null}

              <button
                type="submit"
                disabled={loading || socialBusy !== null}
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-l from-sky-500 via-indigo-500 to-violet-600 text-base font-black text-white shadow-[0_14px_30px_rgba(99,102,241,0.35)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading
                  ? t("register.redirectingToPayment")
                  : t("register.identity.verifyAndPay")}
              </button>
              <button
                type="button"
                className="w-full text-sm font-bold text-slate-500"
                onClick={() => {
                  setStep("identity");
                  setOtp("");
                  setError("");
                }}
              >
                {t("register.identity.changeEmail")}
              </button>
            </form>
          )}

          <p className="pt-1 text-center text-sm font-semibold text-slate-600">
            {t("register.haveAccount")}{" "}
            <Link
              to="/login"
              className="font-black text-violet-700 transition hover:text-indigo-700"
            >
              {t("register.loginCta")}
            </Link>
          </p>
        </div>
      </AuthCard>
    </AuthShell>
  );
}
