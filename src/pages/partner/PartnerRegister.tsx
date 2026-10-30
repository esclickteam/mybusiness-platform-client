import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import AuthShell, { AuthCard } from "../../components/auth/AuthShell";
import { fetchPartnerPlans, registerPartner } from "../../lib/partnerApi";
import type { PartnerPlan } from "../../types/partner";
import { getTextDirection } from "../../i18n/localeUtils";
import { partnerPlanDisplayName } from "../../i18n/partnerCatalogCopy";
import {
  INTERNATIONAL_PARTNER_PLAN,
  INTERNATIONAL_PLAN_KEY,
  isInternationalPlanKey,
  isInternationalRegisterLock,
  plansForRegisterForm,
  resolvePartnerRegisterPlanKey,
} from "../../lib/partnerInternationalPlan";

function planSummary(t: (key: string, opts?: Record<string, unknown>) => string, plan: PartnerPlan) {
  if (isInternationalPlanKey(plan.planKey) || plan.commissionModel === "agreement_percent") {
    return t("partner.register.internationalPlan", {
      annual: plan.annualUsd || INTERNATIONAL_PARTNER_PLAN.annualUsd,
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
  const [params] = useSearchParams();
  const lockedToInternational = isInternationalRegisterLock(params);
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
      await registerPartner({ ...form, planKey: resolved.planKey });
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
          <div className="grid gap-2">
            {visiblePlans.map((plan) => (
              <label key={plan.planKey} className="rounded-xl border border-slate-200 p-3 text-sm">
                <input
                  type="radio"
                  name="plan"
                  checked={form.planKey === plan.planKey}
                  disabled={lockedToInternational}
                  onChange={() => {
                    if (lockedToInternational) return;
                    setForm({ ...form, planKey: plan.planKey });
                  }}
                />{" "}
                <strong>{partnerPlanDisplayName(t, plan)}</strong>
                {` · ${planSummary(t, plan)}`}
              </label>
            ))}
          </div>
          <button type="submit" className="w-full rounded-xl bg-slate-900 py-2 font-black text-white">
            {t("partner.register.createAccount")}
          </button>
          <p className="text-center text-sm">
            {t("partner.register.alreadyRegistered")} <Link to="/login">{t("partner.register.signIn")}</Link>
          </p>
        </form>
      </AuthCard>
    </AuthShell>
  );
}
