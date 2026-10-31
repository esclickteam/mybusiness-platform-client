import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getTextDirection } from "../../i18n/localeUtils";
import { fetchPartnerPlans } from "../../lib/partnerApi";
import {
  INTERNATIONAL_BILLING_OPTIONS,
  INTERNATIONAL_PLAN_KEY,
  internationalBillingOptionsFromPlan,
  type InternationalBillingOption,
} from "../../lib/partnerInternationalPlan";

const COPY = {
  en: {
    title: "International Partner Program",
    lead: "Submitting an application is free and waits for admin approval. This page does not start a live charge. Payment happens only after approval.",
    recurring: "Both intervals include the same rights. Recurring commission follows the partner agreement: 30% for 1–19 active paying customers, 35% for 20–39, and 40% for 40 or more.",
    oneTime: "Eligible one-time deals on this track earn 10%. Existing partner tracks keep their current terms.",
    center: "Training and marketing materials stay in the existing Partner Center. They open only when the partner is active, the partnership agreement is active, and an admin has recorded the payment after the money arrived. Admin approval alone does not open the center.",
    approval: "After approval the partner status is payment_due. The fee is collected outside Bizuply. There is no automatic renewal charge.",
    applyAnnual: "Apply annually",
    applyMonthly: "Apply monthly",
    login: "Partner sign in",
    bestValue: "Best Value",
    save: "Save $988 a year",
    perMonth: "/ month",
    perYear: "/ year",
    free: "Application is free",
  },
  he: {
    title: "תוכנית שותפים בינלאומית",
    lead: "הגשת הבקשה היא ללא תשלום. התשלום מתבצע רק לאחר אישור, והעמוד הזה לא מתחיל חיוב אוטומטי.",
    recurring: "שני המסלולים מעניקים את אותן זכויות. עמלה חוזרת לפי ההסכם: 30% עבור 1 עד 19 לקוחות משלמים פעילים, 35% עבור 20 עד 39, ו-40% עבור 40 או יותר.",
    oneTime: "עסקאות חד-פעמיות זכאיות במסלול הזה מזכות ב-10%. המסלולים הקיימים נשארים עם התנאים הנוכחיים שלהם.",
    center: "ההכשרה וחומרי השיווק נשארים במרכז השותפים הקיים. הם נפתחים רק כשהשותף פעיל, הסכם השותפות פעיל, ואדמין תיעד את התשלום אחרי שהכסף התקבל. אישור אדמין לבדו לא פותח את המרכז.",
    approval: "אחרי האישור הסטטוס הוא payment_due. הגבייה מתבצעת מחוץ ל-Bizuply. אין חיוב חידוש אוטומטי.",
    applyAnnual: "הרשמה שנתית",
    applyMonthly: "הרשמה חודשית",
    login: "כניסת שותפים",
    bestValue: "Best Value",
    save: "חיסכון של $988 בשנה",
    perMonth: "לחודש",
    perYear: "לשנה",
    free: "הגשת הבקשה ללא תשלום",
  },
} as const;

function copyFor(language: string) {
  return language.startsWith("he") ? COPY.he : COPY.en;
}

function money(amount: number) {
  return `$${amount.toLocaleString("en-US")}`;
}

export default function PartnersRecruitment() {
  const { i18n } = useTranslation();
  const copy = copyFor(i18n.language || "en");
  const dir = getTextDirection(i18n.language);
  const [options, setOptions] = useState<InternationalBillingOption[]>(INTERNATIONAL_BILLING_OPTIONS);

  useEffect(() => {
    let cancelled = false;
    fetchPartnerPlans()
      .then((plans) => {
        if (cancelled) return;
        const international = (plans || []).find((plan) => plan.planKey === INTERNATIONAL_PLAN_KEY);
        if (international) setOptions(internationalBillingOptionsFromPlan(international));
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const monthly = options.find((row) => row.interval === "monthly") || INTERNATIONAL_BILLING_OPTIONS[0];
  const annual = options.find((row) => row.interval === "annual") || INTERNATIONAL_BILLING_OPTIONS[1];
  const savings = annual.savingsUsd || 988;
  const annualHref = `/partner/register?planKey=${INTERNATIONAL_PLAN_KEY}`;
  const monthlyHref = `/partner/register?planKey=${INTERNATIONAL_PLAN_KEY}&billing=monthly`;

  return (
    <main className="mx-auto max-w-5xl px-4 py-12" dir={dir} data-testid="partners-recruitment">
      <Helmet>
        <title>International Partner Program | Bizuply</title>
        <meta
          name="description"
          content="Join the Bizuply International Partner program for $499 per month or $5,000 per year. Recurring commission is 30%, 35%, or 40% under the partner agreement, and eligible one-time deals earn 10%."
        />
        <link rel="canonical" href="https://bizuply.com/partners" />
      </Helmet>
      <p className="text-sm font-black uppercase tracking-wide text-[#6D28D9]">{copy.free}</p>
      <h1 className="mt-2 text-4xl font-black text-slate-900">{copy.title}</h1>
      <p className="mt-4 max-w-3xl text-lg text-slate-700">{copy.lead}</p>
      <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2" data-testid="international-price-cards">
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm" data-testid="monthly-price-card">
          <p className="text-sm font-black text-slate-500">{i18n.language?.startsWith("he") ? monthly.labelHe : monthly.labelEn}</p>
          <p className="mt-3 text-4xl font-black text-slate-900" data-testid="international-monthly-price">
            {money(monthly.amountUsd)}
            <span className="text-base font-bold text-slate-500"> {copy.perMonth}</span>
          </p>
          <Link
            className="mt-6 inline-flex rounded-xl border border-slate-300 px-5 py-3 text-sm font-black text-slate-800"
            to={monthlyHref}
            data-testid="international-monthly-link"
          >
            {copy.applyMonthly}
          </Link>
        </article>
        <article className="rounded-2xl border-2 border-[#6D28D9] bg-white p-5 shadow-sm" data-testid="annual-price-card">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-black text-[#6D28D9]">{i18n.language?.startsWith("he") ? annual.labelHe : annual.labelEn}</p>
            <span className="rounded-full bg-[#6D28D9] px-2 py-1 text-xs font-black text-white" data-testid="annual-best-value">
              {copy.bestValue}
            </span>
          </div>
          <p className="mt-3 text-4xl font-black text-slate-900" data-testid="international-annual-price">
            {money(annual.amountUsd)}
            <span className="text-base font-bold text-slate-500"> {copy.perYear}</span>
          </p>
          <p className="mt-2 text-sm font-black text-emerald-700" data-testid="annual-savings">
            {copy.save.replace("$988", money(savings))}
          </p>
          <Link
            className="mt-6 inline-flex rounded-xl bg-[#6D28D9] px-5 py-3 text-sm font-black text-white"
            to={annualHref}
            data-testid="international-register-link"
          >
            {copy.applyAnnual}
          </Link>
        </article>
      </div>
      <ul className="mt-8 space-y-3 text-slate-800">
        <li>{copy.recurring}</li>
        <li>{copy.oneTime}</li>
        <li>{copy.approval}</li>
        <li>{copy.center}</li>
      </ul>
      <div className="mt-8">
        <Link className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-black text-slate-800" to="/login">
          {copy.login}
        </Link>
      </div>
    </main>
  );
}
