import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import AuthShell, { AuthCard } from "../../components/auth/AuthShell";
import { fetchPartnerPlans, registerPartner } from "../../lib/partnerApi";
import type { PartnerPlan } from "../../types/partner";
import { getTextDirection } from "../../i18n/localeUtils";
import { partnerPlanDisplayName } from "../../i18n/partnerCatalogCopy";
import {
  INTERNATIONAL_BILLING_OPTIONS,
  INTERNATIONAL_PLAN_KEY,
  internationalBillingOptionsFromPlan,
  isInternationalPlanKey,
  isInternationalRegisterLock,
  plansForRegisterForm,
  readInternationalBillingInterval,
  readInternationalRegisterStep,
  rememberInternationalBillingInterval,
  rememberInternationalRegisterStep,
  resolvePartnerRegisterPlanKey,
  type InternationalBillingInterval,
} from "../../lib/partnerInternationalPlan";

function planSummary(t: (key: string, opts?: Record<string, unknown>) => string, plan: PartnerPlan) {
  if (isInternationalPlanKey(plan.planKey) || plan.commissionModel === "agreement_percent") {
    return t("partner.register.internationalPlan", {
      annual: plan.annualUsd || 5000,
      recurring: "30 / 35 / 40",
      oneTime: Math.round((plan.oneTimeSaleCommissionRate || 0.1) * 100),
    });
  }
  if (plan.commissionModel === "percent_of_sale" || plan.planKey === "partner_percent") {
    return t("partner.register.freePlan", {
      percent: Math.round((plan.saleCommissionRate || 0.15) * 100),
      team: plan.additionalTeamUsers,
    });
  }
  return t("partner.register.paidPlan", {
    setup: plan.setupIls,
    monthly: plan.monthlyIls,
    share: Math.round(plan.partnerMarkupShare * 100),
    team: plan.additionalTeamUsers,
  });
}

export default function PartnerRegister() {
  const { t, i18n } = useTranslation();
  const formDir = getTextDirection(i18n.language);
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const lockedToInternational = isInternationalRegisterLock(params);
  const billingInterval: InternationalBillingInterval = lockedToInternational
    ? readInternationalBillingInterval(params.toString())
    : "annual";
  const registerStep = lockedToInternational ? readInternationalRegisterStep(params.toString()) : "account";
  const [plans, setPlans] = useState<PartnerPlan[]>([]);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    businessName: "",
    planKey: lockedToInternational ? INTERNATIONAL_PLAN_KEY : "partner_basic",
  });

  useEffect(() => {
    fetchPartnerPlans()
      .then((rows) => setPlans(rows || []))
      .catch(() => {});
  }, []);

  const visiblePlans = useMemo(
    () => plansForRegisterForm(plans, lockedToInternational),
    [plans, lockedToInternational]
  );

  useEffect(() => {
    if (lockedToInternational && form.planKey !== INTERNATIONAL_PLAN_KEY) {
      setForm((prev) => ({ ...prev, planKey: INTERNATIONAL_PLAN_KEY }));
    }
  }, [lockedToInternational, form.planKey]);

  useEffect(() => {
    if (!lockedToInternational) return;
    const requested = params.get("billing") || params.get("interval") || params.get("billingInterval");
    if (requested) rememberInternationalBillingInterval(billingInterval);
  }, [lockedToInternational, billingInterval, params]);

  const billingOptions = internationalBillingOptionsFromPlan(
    plans.find((plan) => isInternationalPlanKey(plan.planKey))
  );

  function chooseBillingInterval(interval: InternationalBillingInterval) {
    rememberInternationalBillingInterval(interval);
    const next = new URLSearchParams(params);
    next.set("planKey", INTERNATIONAL_PLAN_KEY);
    next.set("billing", interval);
    setParams(next, { replace: true });
  }

  function openAccountStep() {
    rememberInternationalBillingInterval(billingInterval);
    rememberInternationalRegisterStep("account");
    const next = new URLSearchParams(params);
    next.set("planKey", INTERNATIONAL_PLAN_KEY);
    next.set("billing", billingInterval);
    next.set("step", "account");
    setParams(next, { replace: true });
  }

  function openPlanStep() {
    rememberInternationalRegisterStep("plan");
    const next = new URLSearchParams(params);
    next.delete("step");
    setParams(next, { replace: true });
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const resolved = resolvePartnerRegisterPlanKey({
      requested: form.planKey,
      lockedToInternational,
    });
    if (!resolved.ok) {
      setError(resolved.error);
      return;
    }
    try {
      await registerPartner({
        ...form,
        planKey: resolved.planKey,
        ...(resolved.planKey === INTERNATIONAL_PLAN_KEY ? { billingInterval } : {}),
      });
      navigate("/login", { replace: true });
    } catch (err: any) {
      setError(err.response?.data?.error || t("partner.errors.register"));
    }
  }

  return (
    <AuthShell>
      <AuthCard
        title={t("partner.register.title")}
        subtitle={
          lockedToInternational
            ? t("partner.register.internationalLocked")
            : t("partner.register.stagingOnly")
        }
      >
        <form onSubmit={submit} className="space-y-3" dir={formDir}>
          {error ? <p className="text-sm font-bold text-rose-600">{error}</p> : null}
          <input type="hidden" name="planKey" value={form.planKey} readOnly />
          {lockedToInternational ? (
            <div className="space-y-3" data-testid="international-plan-only">
              <p className="font-black">{t("partner.planNames.partner_international")}</p>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {billingOptions.map((option) => {
                  const selected = billingInterval === option.interval;
                  const price = option.amountUsd.toLocaleString("en-US");
                  return (
                    <button
                      key={option.interval}
                      type="button"
                      data-testid={option.interval === "annual" ? "international-annual-price" : "international-monthly-price"}
                      aria-pressed={selected}
                      onClick={() => chooseBillingInterval(option.interval)}
                      className={`rounded-xl border p-3 text-start text-sm ${selected ? "border-[#6D28D9] bg-violet-50" : "border-slate-200"}`}
                    >
                      {option.bestValue ? (
                        <span className="mb-2 inline-block whitespace-nowrap rounded-full bg-[#6D28D9] px-2 py-0.5 text-xs font-black text-white">
                          Best Value
                        </span>
                      ) : null}
                      <span className="block font-black">
                        {i18n.language?.startsWith("he") ? option.labelHe : option.labelEn}
                      </span>
                      <span className="mt-1 block text-lg font-black">
                        {option.interval === "annual"
                          ? t("partner.register.internationalPrice", { annual: price })
                          : t("partner.register.internationalMonthlyPrice", { monthly: price })}
                      </span>
                      {option.interval === "annual" ? (
                        <span className="mt-1 block text-xs font-black text-emerald-700" data-testid="register-annual-savings">
                          {t("partner.register.annualSavings", { amount: (option.savingsUsd || 988).toLocaleString("en-US") })}
                        </span>
                      ) : null}
                    </button>
                  );
                })}
              </div>
              <p className="text-slate-600">{t("partner.register.internationalManual")}</p>
              <p className="text-slate-600">{t("partner.register.noAutoCharge")}</p>
            </div>
          ) : null}
          {!lockedToInternational || registerStep === "account" ? (
            <>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder={t("partner.register.fullName")}
                className="w-full rounded-xl border border-slate-200 px-3 py-2"
              />
              <input
                value={form.businessName}
                onChange={(e) => setForm({ ...form, businessName: e.target.value })}
                placeholder={t("partner.register.brandName")}
                className="w-full rounded-xl border border-slate-200 px-3 py-2"
              />
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder={t("partner.email")}
                className="w-full rounded-xl border border-slate-200 px-3 py-2"
              />
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder={t("common.password")}
                className="w-full rounded-xl border border-slate-200 px-3 py-2"
              />
              {lockedToInternational ? null : (
                <div className="grid gap-2">
                  {visiblePlans.map((plan) => (
                    <label key={plan.planKey} className="rounded-xl border border-slate-200 p-3 text-sm">
                      <input
                        type="radio"
                        name="plan"
                        checked={form.planKey === plan.planKey}
                        onChange={() => setForm({ ...form, planKey: plan.planKey })}
                      />{" "}
                      <strong>{partnerPlanDisplayName(t, plan)}</strong>
                      {` · ${planSummary(t, plan)}`}
                    </label>
                  ))}
                </div>
              )}
              <button type="submit" className="w-full rounded-xl bg-slate-900 py-2 font-black text-white">
                {t("partner.register.createAccount")}
              </button>
            </>
          ) : (
            <button
              type="button"
              data-testid="international-continue"
              className="w-full rounded-xl bg-slate-900 py-2 font-black text-white"
              onClick={openAccountStep}
            >
              {t("partner.register.continue")}
            </button>
          )}
          {lockedToInternational && registerStep === "account" ? (
            <button type="button" className="text-sm font-black text-slate-600" onClick={openPlanStep}>
              {t("partner.register.backToInterval")}
            </button>
          ) : null}
          <p className="text-center text-sm">
            {t("partner.register.alreadyRegistered")} <Link to="/login">{t("partner.register.signIn")}</Link>
          </p>
        </form>
      </AuthCard>
    </AuthShell>
  );
}
