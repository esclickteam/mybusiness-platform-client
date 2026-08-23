import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthShell, { AuthCard } from "../../components/auth/AuthShell";
import { fetchPartnerPlans, registerPartner } from "../../lib/partnerApi";
import type { PartnerPlan } from "../../types/partner";

export default function PartnerRegister() {
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
      setError(err.response?.data?.error || "שגיאה ברישום");
    }
  }

  return (
    <AuthShell>
      <AuthCard title="הרשמת פרטנר" subtitle="Staging בלבד — בלי Stripe LIVE">
        <form onSubmit={submit} className="space-y-3" dir="rtl">
          {error ? <p className="text-sm font-bold text-rose-600">{error}</p> : null}
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="שם מלא"
            className="w-full rounded-xl border border-slate-200 px-3 py-2"
          />
          <input
            value={form.businessName}
            onChange={(e) => setForm({ ...form, businessName: e.target.value })}
            placeholder="שם העסק / המותג"
            className="w-full rounded-xl border border-slate-200 px-3 py-2"
          />
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="אימייל"
            className="w-full rounded-xl border border-slate-200 px-3 py-2"
          />
          <input
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            placeholder="סיסמה"
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
                <strong>{plan.nameHe}</strong> · הקמה ₪{plan.setupIls} · חודשי ₪{plan.monthlyIls} ·
                חלק עמלה {Math.round(plan.partnerMarkupShare * 100)}% · צוות {plan.additionalTeamUsers}
              </label>
            ))}
          </div>
          <button type="submit" className="w-full rounded-xl bg-slate-900 py-2 font-black text-white">
            יצירת חשבון
          </button>
          <p className="text-center text-sm">
            כבר רשומים? <Link to="/login">התחברות</Link>
          </p>
        </form>
      </AuthCard>
    </AuthShell>
  );
}
