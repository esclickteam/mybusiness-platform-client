import React, { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Building2, Lock, Mail, Phone, User } from "lucide-react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

import API from "../api";
import { useTranslation } from "react-i18next";
import AuthShell, { AuthCard } from "../components/auth/AuthShell";
import { useAuth } from "../context/AuthContext";
import {
  detectPhoneCountry,
  detectPhoneCountrySync,
} from "../utils/detectPhoneCountry";
import { persistBillingCountry } from "../billing/billingMarkets";
import { useBillingMarket } from "../billing/useBillingMarket";
import { getManualLanguageChoice } from "../i18n/localeUtils";
import { loadPendingPurchaseIntent } from "../utils/pendingPurchaseIntent";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

type RegisterFormData = {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  userType: "business";
  businessName: string;
  referralCode: string;
};

type ApiError = {
  response?: {
    status?: number;
    data?: {
      error?: string;
      url?: string;
      code?: string;
    };
  };
  message?: string;
};

type PricingPlan = "monthly" | "yearly" | "website" | "crm_only";

const PLAN_LABEL_KEYS: Record<PricingPlan, string> = {
  monthly: "register.planMonthly",
  yearly: "register.planYearly",
  website: "register.planWebsite",
  crm_only: "register.planCrm",
};

function parsePlan(value: string | null): PricingPlan | null {
  if (
    value === "monthly" ||
    value === "yearly" ||
    value === "website" ||
    value === "crm_only"
  ) {
    return value;
  }
  return null;
}

export default function Register() {
  const { t, i18n } = useTranslation();
  const billingMarket = useBillingMarket();
  const [formData, setFormData] = useState<RegisterFormData>({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    userType: "business",
    businessName: "",
    referralCode: "",
  });

  const [error, setError] = useState<string>("");
  const [purchaseIntentValidationFailed, setPurchaseIntentValidationFailed] =
    useState(false);
  const [phoneCountry, setPhoneCountry] = useState(detectPhoneCountrySync);

  useEffect(() => {
    let active = true;
    detectPhoneCountry().then((code) => {
      if (active && code) setPhoneCountry(code);
    });
    return () => {
      active = false;
    };
  }, []);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { loginWithToken } = useAuth();

  const selectedPlan = parsePlan(searchParams.get("plan"));
  const pendingPurchaseIntent = loadPendingPurchaseIntent();
  const pendingPurchaseSignup =
    searchParams.get("purchaseIntent") === "1" &&
    searchParams.get("redirect") === "/pricing" &&
    Boolean(pendingPurchaseIntent);
  const includeWebsiteAddon =
    searchParams.get("websiteAddon") === "1" &&
    (selectedPlan === "monthly" || selectedPlan === "yearly");
  const checkoutCancelled = searchParams.get("checkout") === "cancel";
  const isPaidSignupFlow = Boolean(selectedPlan);

  // Normal registrations remain plan-first. The staged upsell flow is the
  // only exception: create an unpaid business account, restore the
  // identifier-only intent, and let the authenticated server build Checkout.
  useEffect(() => {
    if (selectedPlan || pendingPurchaseSignup || purchaseIntentValidationFailed) {
      return;
    }

    const params = new URLSearchParams();
    const ref =
      searchParams.get("ref") || localStorage.getItem("affiliate_referral");
    if (ref) params.set("ref", ref);
    const qs = params.toString();
    navigate(qs ? `/pricing?${qs}` : "/pricing", { replace: true });
  }, [
    navigate,
    pendingPurchaseSignup,
    purchaseIntentValidationFailed,
    searchParams,
    selectedPlan,
  ]);

  useEffect(() => {
    const refFromUrl = searchParams.get("ref");
    const refFromStorage = localStorage.getItem("affiliate_referral");

    if (refFromUrl) {
      localStorage.setItem("affiliate_referral", refFromUrl);
      setFormData((prev) => ({ ...prev, referralCode: refFromUrl }));
      return;
    }

    if (refFromStorage) {
      setFormData((prev) => ({ ...prev, referralCode: refFromStorage }));
    }
  }, [searchParams]);

  if (
    !selectedPlan &&
    !pendingPurchaseSignup &&
    !purchaseIntentValidationFailed
  ) {
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const isValidPhone = (phone: string) => {
    const cleaned = phone.trim().replace(/\s|-/g, "");
    return /^\+?[1-9]\d{7,14}$/.test(cleaned);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const {
      name,
      email,
      phone,
      password,
      confirmPassword,
      businessName,
      referralCode,
    } = formData;

    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
      setError(t("register.fillRequired"));
      return;
    }

    if (!businessName.trim()) {
      setError(t("register.enterBusinessName"));
      return;
    }

    if (!phone.trim()) {
      setError(t("register.enterPhone"));
      return;
    }

    if (!isValidPhone(phone.trim())) {
      setError(t("register.invalidPhone"));
      return;
    }

    if (password !== confirmPassword) {
      setError(t("register.passwordMismatch"));
      return;
    }

    setLoading(true);

    try {
      // Pricing packages: collect details → Stripe → create account only after payment
      if (selectedPlan) {
        const { data } = await API.post<{ url?: string; error?: string }>(
          "/stripe/create-signup-checkout",
          {
            name: name.trim(),
            email: email.trim().toLowerCase(),
            phone: phone.trim(),
            password,
            businessName: businessName.trim(),
            plan: selectedPlan,
            includeWebsiteAddon,
            billingCountry: persistBillingCountry(billingMarket.billingCountry),
            language: getManualLanguageChoice() || i18n.language,
            referralCode:
              referralCode ||
              localStorage.getItem("affiliate_referral") ||
              undefined,
          }
        );

        if (!data?.url) {
          setError(data?.error || t("register.checkoutFailed"));
          return;
        }

        if (window.fbq) {
          window.fbq("track", "InitiateCheckout");
        }

        window.location.href = data.url;
        return;
      }

      if (pendingPurchaseSignup) {
        if (!loadPendingPurchaseIntent()) {
          setPurchaseIntentValidationFailed(true);
          setError(t("register.purchaseIntentExpired"));
          return;
        }
        const { data } = await API.post<{
          accessToken?: string;
          user?: Record<string, unknown>;
          error?: string;
        }>("/auth/register", {
          name: name.trim(),
          email: email.trim().toLowerCase(),
          phone: phone.trim(),
          password,
          userType: "business",
          businessName: businessName.trim(),
          language: getManualLanguageChoice() || i18n.language,
          referralCode:
            referralCode ||
            localStorage.getItem("affiliate_referral") ||
            undefined,
        });

        if (!data?.accessToken || !data?.user) {
          setError(data?.error || t("register.registerFailed"));
          return;
        }

        // Keep Auth bootstrap from yanking unpaid registrants to the dashboard
        // before Pricing can restore the pending purchase intent.
        sessionStorage.setItem("postLoginRedirect", "/pricing");
        loginWithToken(data.user, data.accessToken, { skipRedirect: true });
        navigate("/pricing", { replace: true });
        return;
      }

      navigate("/pricing", { replace: true });
    } catch (err) {
      const apiError = err as ApiError;
      console.error(
        "Registration error:",
        apiError.response?.data || apiError.message
      );

      if (apiError.response?.data?.code === "REGIONAL_PRICE_UNAVAILABLE") {
        setError(t("billing.regional.unavailable"));
        return;
      }
      if (apiError.response?.data?.code === "PRICING_CONFIGURATION_ERROR") {
        setError(t("billing.errors.pricingConfiguration"));
        return;
      }
      if (apiError.response?.data?.code === "EMAIL_ALREADY_REGISTERED") {
        setError(t("register.emailExists"));
        return;
      }

      if (apiError.response?.status === 400) {
        setError(t("register.emailExists"));
        return;
      }

      setError(t("register.genericError"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      cardMaxWidthClassName="max-w-[480px]"
      headline={
        <>
          {t("register.headline")}{" "}
          <span className="bg-gradient-to-l from-sky-500 via-indigo-500 to-violet-600 bg-clip-text text-transparent">
            {t("register.heroOs")}
          </span>
          {t("register.heroBusiness") ? (
            <>
              <br />
              <span className="bg-gradient-to-l from-sky-500 via-indigo-500 to-violet-600 bg-clip-text text-transparent">
                {t("register.heroBusiness")}
              </span>
            </>
          ) : null}
        </>
      }
    >
      <AuthCard
        title={t("register.businessSignupTitle")}
        subtitle={
          isPaidSignupFlow
            ? t("register.paidSubtitle")
            : t("register.freeSubtitle")
        }
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="rounded-2xl border border-violet-100 bg-violet-50 px-4 py-3 text-start">
            <p className="text-sm font-black text-violet-800">
              {t("register.accountTypeTitle")}
            </p>
            <p className="mt-1 text-xs font-semibold text-violet-700/70">
              {t("register.accountTypeHint")}
            </p>
          </div>

          {selectedPlan ? (
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-start">
              <p className="text-sm font-black text-emerald-800">
                {t("register.selectedPlan", {
                  plan: t(PLAN_LABEL_KEYS[selectedPlan]),
                })}
              </p>
              {includeWebsiteAddon ? (
                <p className="mt-1 text-xs font-semibold text-emerald-700/80">
                  {t("register.websiteAddonNote")}
                </p>
              ) : null}
              <p className="mt-1 text-xs font-semibold text-emerald-700/70">
                {t("register.stripeCheckoutNote")}
              </p>
            </div>
          ) : null}

          {checkoutCancelled ? (
            <p
              className="rounded-2xl border border-amber-100 bg-amber-50 px-4 py-3 text-sm font-bold leading-6 text-amber-700"
              role="status"
            >
              {t("register.checkoutCancelled")}
            </p>
          ) : null}

          <div className="text-start">
            <label className="mb-2 block text-sm font-bold text-slate-700">
              {t("register.name")}
            </label>
            <div className="relative">
              <User className="pointer-events-none absolute end-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                name="name"
                placeholder={t("register.namePlaceholder")}
                value={formData.name}
                onChange={handleChange}
                required
                className="h-12 w-full rounded-2xl border border-slate-200 bg-white pe-11 ps-4 text-sm font-semibold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-300 focus:ring-4 focus:ring-violet-100"
              />
            </div>
          </div>

          <div className="text-start">
            <label className="mb-2 block text-sm font-bold text-slate-700">
              {t("register.email")}
            </label>
            <div className="relative">
              <Mail className="pointer-events-none absolute end-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                name="email"
                placeholder="name@company.com"
                value={formData.email}
                onChange={handleChange}
                required
                dir="ltr"
                className="h-12 w-full rounded-2xl border border-slate-200 bg-white pe-11 ps-4 text-start text-sm font-semibold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-300 focus:ring-4 focus:ring-violet-100"
              />
            </div>
          </div>

          <div className="text-start">
            <label className="mb-2 block text-sm font-bold text-slate-700">
              {t("register.businessName")}
            </label>
            <div className="relative">
              <Building2 className="pointer-events-none absolute end-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                name="businessName"
                placeholder={t("register.businessNamePlaceholder")}
                value={formData.businessName}
                onChange={handleChange}
                required
                className="h-12 w-full rounded-2xl border border-slate-200 bg-white pe-11 ps-4 text-sm font-semibold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-300 focus:ring-4 focus:ring-violet-100"
              />
            </div>
          </div>

          <div className="text-start">
            <label className="mb-2 block text-sm font-bold text-slate-700">
              {t("register.phone")}
            </label>
            <div className="rounded-2xl border border-slate-200 bg-white px-2 py-1.5 transition focus-within:border-violet-300 focus-within:ring-4 focus-within:ring-violet-100">
              <div className="flex items-center gap-2">
                <Phone className="mr-2 h-4 w-4 shrink-0 text-slate-400" />
                <PhoneInput
                  key={phoneCountry}
                  country={phoneCountry}
                  preferredCountries={["il", "us", "gb", "fr", "de"]}
                  enableSearch
                  value={formData.phone.replace(/^\+/, "")}
                  onChange={(phone: string) =>
                    setFormData((prev) => ({
                      ...prev,
                      phone: `+${phone}`,
                    }))
                  }
                  inputStyle={{
                    width: "100%",
                    height: "42px",
                    borderRadius: "14px",
                    border: "0",
                    paddingLeft: "48px",
                    fontSize: "14px",
                    fontWeight: 600,
                    color: "#0f172a",
                    background: "transparent",
                    direction: "ltr",
                    textAlign: "left",
                  }}
                  buttonStyle={{
                    border: "0",
                    background: "transparent",
                    borderRadius: "14px",
                  }}
                  dropdownStyle={{
                    borderRadius: "16px",
                    border: "1px solid #e2e8f0",
                    boxShadow: "0 20px 60px rgba(15,23,42,0.14)",
                    direction: "ltr",
                    textAlign: "left",
                  }}
                />
              </div>
            </div>
          </div>

          {formData.referralCode ? (
            <div className="text-start">
              <label className="mb-2 block text-sm font-bold text-slate-700">
                {t("register.referralCode")}
              </label>
              <input
                type="text"
                name="referralCode"
                value={formData.referralCode}
                readOnly
                className="h-12 w-full rounded-2xl border border-violet-100 bg-violet-50 px-4 text-sm font-black text-violet-700 outline-none"
              />
            </div>
          ) : null}

          <div className="text-start">
            <label className="mb-2 block text-sm font-bold text-slate-700">
              {t("register.password")}
            </label>
            <div className="relative">
              <Lock className="pointer-events-none absolute end-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="password"
                name="password"
                placeholder={t("register.passwordPlaceholder")}
                value={formData.password}
                onChange={handleChange}
                required
                dir="ltr"
                className="h-12 w-full rounded-2xl border border-slate-200 bg-white pe-11 ps-4 text-start text-sm font-semibold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-300 focus:ring-4 focus:ring-violet-100"
              />
            </div>
          </div>

          <div className="text-start">
            <label className="mb-2 block text-sm font-bold text-slate-700">
              {t("register.confirmPassword")}
            </label>
            <div className="relative">
              <Lock className="pointer-events-none absolute end-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="password"
                name="confirmPassword"
                placeholder={t("register.confirmPasswordPlaceholder")}
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                dir="ltr"
                className="h-12 w-full rounded-2xl border border-slate-200 bg-white pe-11 ps-4 text-start text-sm font-semibold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-300 focus:ring-4 focus:ring-violet-100"
              />
            </div>
          </div>

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
            disabled={loading}
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-l from-sky-500 via-indigo-500 to-violet-600 text-base font-black text-white shadow-[0_14px_30px_rgba(99,102,241,0.35)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading
              ? isPaidSignupFlow
                ? t("register.redirectingToPayment")
                : t("register.submitting")
              : isPaidSignupFlow
                ? t("register.continueToPayment")
                : t("register.submit")}
            {!loading ? <span aria-hidden className="rtl-flip">←</span> : null}
          </button>

          <p className="pt-1 text-center text-sm font-semibold text-slate-600">
            {t("register.haveAccount")}{" "}
            <Link
              to="/login"
              className="font-black text-violet-700 transition hover:text-indigo-700"
            >
              {t("register.loginCta")}
            </Link>
          </p>
        </form>
      </AuthCard>
    </AuthShell>
  );
}
