import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import AuthShell, { AuthCard } from "../../components/auth/AuthShell";
import { fetchPartnerPlans, registerPartner } from "../../lib/partnerApi";
import type { PartnerPlan } from "../../types/partner";
import { getTextDirection } from "../../i18n/localeUtils";
import { partnerPlanDisplayName } from "../../i18n/partnerCatalogCopy";

export default function PartnerRegister() {
  const { t, i18n } = useTranslation();
  const formDir = getTextDirection(i18n.language);
  const navigate = useNavigate();
  const [plans, setPlans] = useState<PartnerPlan[]>([]);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    businessName: "",
    planKey: "partner_basic",
  });

  useEffect(() => {
    fetchPartnerPlans().then(setPlans).catch(() => {});
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    try {
      await registerPartner(form);
      navigate("/login", { replace: true });
    } catch (err: any) {
      setError(err.response?.data?.error || t("partner.errors.register"));
    }
  }

  return (
    <AuthShell>
      <AuthCard title={t("partner.register.title")} subtitle={t("partner.register.stagingOnly")}>
        <form onSubmit={submit} className="space-y-3" dir={formDir}>
          {error ? <p className="text-sm font-bold text-rose-600">{error}</p> : null}
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
            {plans.map((plan) => (
              <label key={plan.planKey} className="rounded-xl border border-slate-200 p-3 text-sm">
                <input
                  type="radio"
                  name="plan"
                  checked={form.planKey === plan.planKey}
                  onChange={() => setForm({ ...form, planKey: plan.planKey })}
                />{" "}
                <strong>{partnerPlanDisplayName(t, plan)}</strong>
                {plan.commissionModel === "percent_of_sale" || plan.planKey === "partner_percent"
                  ? ` · ${t("partner.register.freePlan", {
                      percent: Math.round((plan.saleCommissionRate || 0.15) * 100),
                      team: plan.additionalTeamUsers,
                    })}`
                  : ` · ${t("partner.register.paidPlan", {
                      setup: plan.setupIls,
                      monthly: plan.monthlyIls,
                      share: Math.round(plan.partnerMarkupShare * 100),
                      team: plan.additionalTeamUsers,
                    })}`}
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
