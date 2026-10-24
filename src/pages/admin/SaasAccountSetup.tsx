import { useEffect, useState } from "react";
import API from "../../api";

export type SaasDraft = {
  templateSlug: string;
  templateSlugs: string[];
  subdomain: string;
  domainMode: "subdomain" | "existing" | "purchase";
  existingDomain: string;
  hostingPlanId: string;
  serviceIds: string[];
  dealModel: "license" | "white_label" | "partner" | "exclusive_country";
  paymentMode: "none" | "manual_paid";
  dealId: string;
  country: string;
  language: string;
  currency: "ILS" | "USD";
  pricing: {
    setup: number;
    licenseOnce: number;
    monthly: number;
    yearly: number;
    hostingMonthly: number;
    hostingYearly: number;
    hostingCycle: "monthly" | "yearly";
    billingCycle: "monthly" | "yearly";
    database: number;
    domain: number;
    discount: number;
    trialDays: number;
    trialApproved: boolean;
    renewalAt: string;
    extras: { label: string; amount: number; cycle: "once" | "monthly" | "yearly" }[];
  };
};

type TemplateOption = {
  slug: string;
  name: string;
  services: { id: string; label: string; activatesOnProvision: boolean }[];
  hostingPlans: { id: string; label: string; quotaMb: number }[];
  whiteLabel: boolean;
  partnerModel: boolean;
  exclusiveCountry: boolean;
};

const EMPTY: SaasDraft = {
  templateSlug: "",
  templateSlugs: [],
  subdomain: "",
  domainMode: "subdomain",
  existingDomain: "",
  hostingPlanId: "starter",
  serviceIds: ["license", "hosting", "database", "subdomain"],
  dealModel: "license",
  paymentMode: "none",
  dealId: "",
  country: "IL",
  language: "he",
  currency: "USD",
  pricing: {
    setup: 0,
    licenseOnce: 0,
    monthly: 0,
    yearly: 0,
    hostingMonthly: 0,
    hostingYearly: 0,
    hostingCycle: "monthly",
    billingCycle: "monthly",
    database: 0,
    domain: 0,
    discount: 0,
    trialDays: 0,
    trialApproved: false,
    renewalAt: "",
    extras: [],
  },
};

export default function SaasAccountSetup({
  value,
  onChange,
}: {
  value?: SaasDraft;
  onChange: (next: SaasDraft) => void;
}) {
  const draft = value || EMPTY;
  const [templates, setTemplates] = useState<TemplateOption[]>([]);
  const [quote, setQuote] = useState<Record<string, unknown> | null>(null);
  const selectedSlugs = draft.templateSlugs?.length ? draft.templateSlugs : draft.templateSlug ? [draft.templateSlug] : [];
  const selected = templates.find((item) => item.slug === selectedSlugs[0]) || null;

  function toggleTemplate(slug: string) {
    const set = new Set(selectedSlugs);
    if (set.has(slug)) set.delete(slug);
    else set.add(slug);
    const templateSlugs = templates.map((item) => item.slug).filter((item) => set.has(item));
    patch({ templateSlugs, templateSlug: templateSlugs[0] || "" });
  }

  useEffect(() => {
    API.get("/admin/saas-tenants/catalog")
      .then((res) => {
        const list = res.data.templates || [];
        setTemplates(list);
        const selected = draft.templateSlugs?.length ? draft.templateSlugs : draft.templateSlug ? [draft.templateSlug] : [];
        if (!selected.length && list[0]) {
          onChange({ ...draft, templateSlug: list[0].slug, templateSlugs: [list[0].slug] });
        } else if (selected.length && selected.join() !== (draft.templateSlugs || []).join()) {
          onChange({ ...draft, templateSlug: selected[0], templateSlugs: selected });
        }
      })
      .catch(() => setTemplates([]));
    // Catalog load is once per open.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      API.post("/admin/saas-tenants/quote", { currency: draft.currency, pricing: draft.pricing })
        .then((res) => setQuote(res.data.quote))
        .catch(() => setQuote(null));
    }, 250);
    return () => window.clearTimeout(timer);
  }, [draft.currency, draft.pricing]);

  function patch(partial: Partial<SaasDraft>) {
    onChange({ ...draft, ...partial });
  }

  function money(key: keyof SaasDraft["pricing"], amount: string) {
    patch({ pricing: { ...draft.pricing, [key]: Number(amount) || 0 } });
  }

  return (
    <section className="space-y-4 rounded-2xl border border-violet-200 bg-violet-50/40 p-4">
      <h2 className="text-base font-black">הקמת מערכת SaaS</h2>
      <fieldset className="grid gap-2 md:grid-cols-2">
        <legend className="text-sm font-bold">מערכות — אפשר לבחור יותר מאחת</legend>
        {templates.map((template) => (
          <label key={template.slug} className="flex items-center gap-2 rounded-xl border bg-white px-3 py-2 text-sm font-bold">
            <input type="checkbox" checked={selectedSlugs.includes(template.slug)} onChange={() => toggleTemplate(template.slug)} />
            {template.name}
          </label>
        ))}
      </fieldset>
      <div className="grid gap-3 md:grid-cols-2">
        <label className="text-sm font-bold">מדינה
          <input className="mt-1 w-full rounded-xl border px-3 py-2" value={draft.country} onChange={(event) => patch({ country: event.target.value })} />
        </label>
        <label className="text-sm font-bold">שפה
          <select className="mt-1 w-full rounded-xl border px-3 py-2" value={draft.language} onChange={(event) => patch({ language: event.target.value })}>
            <option value="he">עברית</option>
            <option value="en">English</option>
            <option value="ar">العربية</option>
          </select>
        </label>
        <label className="text-sm font-bold">מטבע
          <select className="mt-1 w-full rounded-xl border px-3 py-2" value={draft.currency} onChange={(event) => patch({ currency: event.target.value as "ILS" | "USD" })}>
            <option value="ILS">ILS</option>
            <option value="USD">USD</option>
          </select>
        </label>
        <label className="text-sm font-bold">כתובת מערכת *
          <input
            className="mt-1 w-full rounded-xl border px-3 py-2"
            value={draft.subdomain}
            onChange={(event) => patch({ subdomain: event.target.value })}
            placeholder="לדוגמה: north-salon"
            required
            autoComplete="off"
          />
          <span className="mt-1 block text-xs font-bold text-slate-500">חובה, באנגלית, פנויה. טקסט הדוגמה אינו כתובת.</span>
        </label>
        <label className="text-sm font-bold">מזהה עסקה מאושרת *
          <input
            className="mt-1 w-full rounded-xl border px-3 py-2"
            value={draft.dealId || ""}
            onChange={(event) => patch({ dealId: event.target.value })}
            placeholder="ממסך עסקאות SaaS"
            required
            autoComplete="off"
          />
          <span className="mt-1 block text-xs font-bold text-slate-500">הקצאה חסומה בלי אישור תשלום ומסירה.</span>
        </label>
      </div>
      <label className="block text-sm font-bold">דומיין
        <select className="mt-1 w-full rounded-xl border px-3 py-2" value={draft.domainMode} onChange={(event) => patch({ domainMode: event.target.value as SaasDraft["domainMode"] })}>
          <option value="subdomain">כתובת Bizuply</option>
          {(selected?.services || []).some((service) => service.id === "existing_domain") ? <option value="existing">דומיין קיים</option> : null}
          {(selected?.services || []).some((service) => service.id === "domain_purchase") ? <option value="purchase">רכישת דומיין</option> : null}
        </select>
      </label>
      {draft.domainMode !== "subdomain" ? (
        <input className="w-full rounded-xl border px-3 py-2" value={draft.existingDomain} placeholder="example.com" onChange={(event) => patch({ existingDomain: event.target.value })} />
      ) : null}
      <label className="block text-sm font-bold">חבילת אחסון
        <select className="mt-1 w-full rounded-xl border px-3 py-2" value={draft.hostingPlanId} onChange={(event) => patch({ hostingPlanId: event.target.value })}>
          {(selected?.hostingPlans || []).map((plan) => (
            <option key={plan.id} value={plan.id}>{plan.label} · {plan.quotaMb}MB</option>
          ))}
        </select>
      </label>
      <div className="grid gap-2">
        {(selected?.services || []).map((service) => (
          <label key={service.id} className="flex items-center gap-2 text-sm font-bold">
            <input
              type="checkbox"
              checked={draft.serviceIds.includes(service.id)}
              onChange={() => {
                const set = new Set(draft.serviceIds);
                if (set.has(service.id)) set.delete(service.id);
                else set.add(service.id);
                patch({ serviceIds: Array.from(set) });
              }}
            />
            {service.label} · {service.activatesOnProvision ? "יופעל בהקמה" : "ממתין לחיבור"}
          </label>
        ))}
      </div>
      <label className="block text-sm font-bold">מודל עסקה
        <select className="mt-1 w-full rounded-xl border px-3 py-2" value={draft.dealModel} onChange={(event) => patch({ dealModel: event.target.value as SaasDraft["dealModel"] })}>
          <option value="license">רישיון</option>
          {selected?.whiteLabel ? <option value="white_label">White Label</option> : null}
          {selected?.partnerModel ? <option value="partner">שותף</option> : null}
          {selected?.exclusiveCountry ? <option value="exclusive_country">בלעדיות למדינה</option> : null}
        </select>
      </label>
      <div className="grid gap-2 md:grid-cols-3">
        {([
          ["setup", "הקמה"],
          ["licenseOnce", "רישיון חד־פעמי"],
          ["monthly", "מנוי חודשי"],
          ["yearly", "מנוי שנתי"],
          ["hostingMonthly", "אחסון חודשי"],
          ["hostingYearly", "אחסון שנתי"],
          ["database", "מסד נתונים"],
          ["domain", "דומיין"],
          ["discount", "הנחה"],
        ] as const).map(([key, label]) => (
          <label key={key} className="text-xs font-bold">
            {label}
            <input type="number" min={0} className="mt-1 w-full rounded-lg border px-2 py-1" value={draft.pricing[key]} onChange={(event) => money(key, event.target.value)} />
          </label>
        ))}
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        <label className="text-sm font-bold">מחזור מנוי
          <select className="mt-1 w-full rounded-xl border px-3 py-2" value={draft.pricing.billingCycle} onChange={(event) => patch({ pricing: { ...draft.pricing, billingCycle: event.target.value as "monthly" | "yearly" } })}>
            <option value="monthly">חודשי</option>
            <option value="yearly">שנתי</option>
          </select>
        </label>
        <label className="text-sm font-bold">מחזור אחסון
          <select className="mt-1 w-full rounded-xl border px-3 py-2" value={draft.pricing.hostingCycle} onChange={(event) => patch({ pricing: { ...draft.pricing, hostingCycle: event.target.value as "monthly" | "yearly" } })}>
            <option value="monthly">חודשי</option>
            <option value="yearly">שנתי</option>
          </select>
        </label>
        <label className="text-sm font-bold">תאריך חידוש
          <input type="date" className="mt-1 w-full rounded-xl border px-3 py-2" value={draft.pricing.renewalAt} onChange={(event) => patch({ pricing: { ...draft.pricing, renewalAt: event.target.value } })} />
        </label>
        <label className="text-sm font-bold">סטטוס תשלום
          <select className="mt-1 w-full rounded-xl border px-3 py-2" value={draft.paymentMode} onChange={(event) => patch({ paymentMode: event.target.value as SaasDraft["paymentMode"] })}>
            <option value="none">לא שולם — ללא חיוב</option>
            <option value="manual_paid">סומן כשולם ידנית — ללא חיוב אוטומטי</option>
          </select>
        </label>
      </div>
      <div className="space-y-2">
        <p className="text-sm font-black">תוספות</p>
        {draft.pricing.extras.map((extra, index) => (
          <div key={`${extra.label}-${index}`} className="grid grid-cols-[1fr_120px_120px] gap-2">
            <input className="rounded-lg border px-2 py-1" value={extra.label} placeholder="שם" onChange={(event) => {
              const extras = draft.pricing.extras.slice();
              extras[index] = { ...extra, label: event.target.value };
              patch({ pricing: { ...draft.pricing, extras } });
            }} />
            <input type="number" min={0} className="rounded-lg border px-2 py-1" value={extra.amount} onChange={(event) => {
              const extras = draft.pricing.extras.slice();
              extras[index] = { ...extra, amount: Number(event.target.value) || 0 };
              patch({ pricing: { ...draft.pricing, extras } });
            }} />
            <select className="rounded-lg border px-2 py-1" value={extra.cycle} onChange={(event) => {
              const extras = draft.pricing.extras.slice();
              extras[index] = { ...extra, cycle: event.target.value as "once" | "monthly" | "yearly" };
              patch({ pricing: { ...draft.pricing, extras } });
            }}>
              <option value="once">חד־פעמי</option>
              <option value="monthly">חודשי</option>
              <option value="yearly">שנתי</option>
            </select>
          </div>
        ))}
        <button type="button" className="text-sm font-bold" onClick={() => patch({ pricing: { ...draft.pricing, extras: [...draft.pricing.extras, { label: "", amount: 0, cycle: "once" }] } })}>הוספת תוספת</button>
      </div>
      <label className="flex items-center gap-2 text-sm font-bold">
        <input type="checkbox" checked={draft.pricing.trialApproved} onChange={(event) => patch({ pricing: { ...draft.pricing, trialApproved: event.target.checked } })} />
        לאשר תקופת ניסיון
        <input type="number" min={0} className="w-20 rounded-lg border px-2 py-1" value={draft.pricing.trialDays} onChange={(event) => patch({ pricing: { ...draft.pricing, trialDays: Number(event.target.value) || 0 } })} />
      </label>
      {quote ? (
        <div className="rounded-xl bg-white p-3 text-sm">
          <p>הקמה: {String((quote.lines as Record<string, number>)?.setup ?? 0)}</p>
          <p>חד־פעמי: {String((quote.lines as Record<string, number>)?.licenseOnce ?? 0)}</p>
          <p>חודשי: {String((quote.lines as Record<string, number>)?.monthly ?? 0)}</p>
          <p>שנתי: {String((quote.lines as Record<string, number>)?.yearly ?? 0)}</p>
          <p>אחסון: {String((quote.lines as Record<string, number>)?.hosting ?? 0)}</p>
          <p>תוספות: {String((quote.extras as { amount?: number }[] | undefined)?.reduce((sum, item) => sum + Number(item.amount || 0), 0) ?? 0)}</p>
          <p>הנחה: {String(quote.discount ?? 0)}</p>
          <p className="font-black">לתשלום עכשיו: {String(quote.dueNow)} {String(quote.currency)}</p>
          <p className="font-black">חידוש: {String(quote.renewal)} {String(quote.currency)}</p>
          <p>לא יבוצע חיוב אוטומטי.</p>
        </div>
      ) : null}
    </section>
  );
}

export { EMPTY as EMPTY_SAAS_DRAFT };
