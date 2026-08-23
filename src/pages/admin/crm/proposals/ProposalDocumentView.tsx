import React, { useMemo, useState } from "react";
import { heLabel, heLabels, PROPOSAL_STATUS_LABELS } from "./proposalLabels";

const BRAND = "#6D28D9";

export type ProposalLine = {
  sku: string;
  nameHe: string;
  category?: string;
  billing?: string;
  amountIls: number;
  originalPrice?: number;
  catalogAmountIls?: number;
  customPrice?: number | null;
  priceEdited?: boolean;
  quantity?: number;
  bullets?: string[];
  limits?: string[];
  notIncluded?: string[];
  descriptionHe?: string;
  summaryHe?: string;
  icon?: string;
  badge?: string;
  highlightedByCustomer?: boolean;
};

export type ProposalViewModel = {
  proposalNumber?: string;
  customerName?: string;
  businessName?: string;
  understandingText?: string;
  understandingSections?: { title: string; items: string[] }[];
  showUnderstanding?: boolean;
  notesPublic?: string;
  termsText?: string;
  lines?: ProposalLine[];
  totals?: {
    monthlyIls?: number;
    yearlyIls?: number;
    oneTimeIls?: number;
    servicesIls?: number;
  };
  expiresAt?: string | null;
  createdAt?: string | null;
  status?: string;
  contextSnapshot?: any;
  approvedByName?: string;
  signedAt?: string | null;
  hasSignature?: boolean;
  signatureData?: string;
};

function money(n?: number) {
  const value = Number(n || 0);
  if (value === 0) return "ללא עלות";
  return `₪${value.toLocaleString("he-IL")}`;
}

function billingLabel(billing?: string) {
  if (billing === "recurring_month") return "לחודש";
  if (billing === "recurring_year") return "לשנה";
  return "חד־פעמי";
}

function badgeFor(line: ProposalLine) {
  if (line.badge) return line.badge;
  if (line.category === "plan") return "כלול בחבילה";
  if (line.category === "addon") return "תוסף";
  return "שירות נוסף";
}

function formatDate(value?: string | null) {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("he-IL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function termsToItems(termsText?: string) {
  return String(termsText || "")
    .split("\n")
    .map((t) => t.trim())
    .filter(Boolean);
}

function LineCard({
  line,
  open,
  onToggle,
}: {
  line: ProposalLine;
  open: boolean;
  onToggle: () => void;
}) {
  const qty = Math.max(1, Number(line.quantity || 1));
  const total = Number(line.amountIls || 0) * qty;
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-start gap-3 p-4 text-right sm:gap-4 sm:p-5"
      >
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-violet-50 text-xl">
          {line.icon || "•"}
        </span>
        <span className="min-w-0 flex-1">
          <span className="flex flex-wrap items-center gap-2">
            <span className="text-base font-black text-slate-900 sm:text-lg">{line.nameHe}</span>
            <span className="rounded-full bg-violet-50 px-2.5 py-0.5 text-[11px] font-black text-[#6D28D9]">
              {badgeFor(line)}
            </span>
            {line.priceEdited ? (
              <span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-[11px] font-black text-amber-700">
                מחיר מותאם
              </span>
            ) : null}
          </span>
          {line.summaryHe ? (
            <span className="mt-1 block text-sm font-semibold leading-6 text-slate-600">
              {line.summaryHe}
            </span>
          ) : null}
          <span className="mt-2 inline-flex items-center gap-1 text-xs font-black text-[#6D28D9]">
            {open ? "⌃ הסתר פירוט" : "⌄ פירוט מלא"}
          </span>
        </span>
        <span className="shrink-0 text-left">
          <span className="block text-lg font-black text-slate-900">{money(total)}</span>
          <span className="block text-xs font-bold text-slate-500">{billingLabel(line.billing)}</span>
          {line.priceEdited && line.originalPrice != null && line.originalPrice !== Number(line.amountIls) ? (
            <span className="mt-0.5 block text-xs font-bold text-slate-400 line-through">
              {money(line.originalPrice * qty)}
            </span>
          ) : null}
        </span>
      </button>
      {open ? (
        <div className="space-y-4 border-t border-slate-100 bg-slate-50/80 px-4 py-4 sm:px-5">
          <div>
            <p className="mb-2 text-xs font-black uppercase tracking-wide text-slate-400">מה כלול</p>
            {(line.bullets || []).length ? (
              <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {(line.bullets || []).map((b) => (
                  <li key={b} className="flex items-start gap-2 text-sm font-semibold text-slate-700">
                    <span className="mt-0.5 text-emerald-500">✓</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm font-semibold text-slate-700">
                {line.summaryHe || line.descriptionHe || "פירוט לפי ההצעה המותאמת."}
              </p>
            )}
          </div>
          {(line.limits || []).length ? (
            <div>
              <p className="mb-2 text-xs font-black uppercase tracking-wide text-amber-600">
                מגבלות והגבלות
              </p>
              <ul className="space-y-1.5">
                {(line.limits || []).map((b) => (
                  <li key={b} className="flex items-start gap-2 text-sm font-semibold text-slate-700">
                    <span className="mt-0.5 text-amber-500">!</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
          {(line.notIncluded || []).length ? (
            <div>
              <p className="mb-2 text-xs font-black uppercase tracking-wide text-slate-400">
                לא כלול / דורש תוספת
              </p>
              <ul className="space-y-1.5">
                {(line.notIncluded || []).map((b) => (
                  <li key={b} className="flex items-start gap-2 text-sm font-semibold text-slate-600">
                    <span className="mt-0.5 text-slate-400">–</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

export function ProposalDocumentView({
  proposal,
  interactive = true,
  footer,
  mode = "customer",
}: {
  proposal: ProposalViewModel;
  interactive?: boolean;
  footer?: React.ReactNode;
  mode?: "customer" | "admin-preview";
}) {
  const [open, setOpen] = useState<Record<string, boolean>>({});
  const lines = proposal.lines || [];
  const totals = proposal.totals || {};
  const ctx = proposal.contextSnapshot || {};

  const grouped = useMemo(() => {
    const packageLines = lines.filter(
      (l) => l.category === "plan" || (l.category === "addon" && l.billing !== "one_time")
    );
    const oneTimeAddons = lines.filter(
      (l) => l.category === "addon" && l.billing === "one_time"
    );
    const services = lines.filter(
      (l) => l.category === "managed_service" || l.category === "managed_service_addon"
    );
    if (!packageLines.length && !services.length && !oneTimeAddons.length && lines.length) {
      return { packageLines: lines, oneTimeAddons: [], services: [] };
    }
    return { packageLines, oneTimeAddons, services };
  }, [lines]);

  const understandingBits = useMemo(() => {
    const fromApi =
      proposal.understandingSections ||
      ctx.understandingSections ||
      [];
    if (Array.isArray(fromApi) && fromApi.length) {
      return fromApi.map((bit: any) => ({
        title: bit.title,
        items: heLabels(bit.items || []),
      }));
    }
    const bits: { title: string; items: string[] }[] = [];
    const post = ctx.postDemo || {};
    if (post.relevant?.length) {
      bits.push({ title: "מה עניין בדמו", items: heLabels(post.relevant).slice(0, 6) });
    }
    if (post.automation?.length) {
      bits.push({ title: "אוטומציות רצויות", items: heLabels(post.automation).slice(0, 6) });
    }
    if (post.services?.length) {
      bits.push({
        title: "שירותים שמעניינים",
        items: heLabels(post.services.filter((s: string) => s !== "not_now")).slice(0, 6),
      });
    }
    if (post.blockers?.length) {
      bits.push({ title: "התלבטויות", items: heLabels(post.blockers).slice(0, 6) });
    }
    if (post.startTiming) {
      bits.push({ title: "מועד התחלה", items: [heLabel(post.startTiming)] });
    }
    return bits.slice(0, 4);
  }, [ctx, proposal.understandingSections]);

  function toggle(key: string) {
    if (!interactive) return;
    setOpen((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  const termItems = termsToItems(proposal.termsText);

  return (
    <div dir="rtl" className="mx-auto w-full max-w-5xl text-right">
      <article className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-2xl sm:rounded-[32px]">
        <header
          className="relative overflow-hidden px-5 py-8 text-white sm:px-10 sm:py-10"
          style={{
            background: `linear-gradient(120deg, #1e1b4b 0%, ${BRAND} 55%, #7c3aed 100%)`,
          }}
        >
          <div className="pointer-events-none absolute inset-0 opacity-20">
            <div className="absolute -left-10 top-0 h-40 w-40 rounded-full bg-white blur-3xl" />
            <div className="absolute bottom-0 right-10 h-32 w-32 rounded-full bg-fuchsia-300 blur-3xl" />
          </div>
          <div className="relative flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm font-black tracking-wide">BizUply</p>
              <h1 className="mt-3 max-w-xl text-2xl font-black leading-tight sm:text-3xl">
                הצעה מותאמת ל־{proposal.businessName || proposal.customerName || "העסק שלך"}
              </h1>
              <p className="mt-2 text-sm font-semibold text-violet-100">
                {[
                  proposal.proposalNumber,
                  formatDate(proposal.createdAt),
                  proposal.expiresAt ? `בתוקף עד ${formatDate(proposal.expiresAt)}` : "",
                ]
                  .filter(Boolean)
                  .join(" · ")}
              </p>
            </div>
            {mode === "admin-preview" || proposal.status ? (
              <span className="rounded-full bg-white/15 px-3 py-1.5 text-xs font-black backdrop-blur">
                {PROPOSAL_STATUS_LABELS[proposal.status || ""] ||
                  proposal.status ||
                  "תצוגה מקדימה"}
              </span>
            ) : null}
          </div>
        </header>

        <div className="space-y-8 px-5 py-7 sm:px-10 sm:py-10">
          <section className="rounded-3xl border border-slate-200 bg-gradient-to-l from-slate-50 to-white p-5 sm:p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-wide text-slate-400">
                  פרטי הלקוח
                </p>
                <h2 className="mt-1 text-xl font-black text-slate-900">
                  {proposal.businessName || proposal.customerName || "לקוח"}
                </h2>
                {proposal.customerName && proposal.businessName ? (
                  <p className="mt-1 text-sm font-semibold text-slate-600">
                    איש קשר: {proposal.customerName}
                  </p>
                ) : null}
                <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm font-semibold text-slate-600">
                  {ctx.phone || ctx.customerPhone ? (
                    <span>טלפון: {ctx.phone || ctx.customerPhone}</span>
                  ) : null}
                  {ctx.email || ctx.customerEmail ? (
                    <span>אימייל: {ctx.email || ctx.customerEmail}</span>
                  ) : null}
                  {proposal.expiresAt ? (
                    <span>תוקף: {formatDate(proposal.expiresAt)}</span>
                  ) : null}
                </div>
              </div>
              {proposal.proposalNumber ? (
                <div className="rounded-2xl bg-violet-50 px-4 py-3 text-center">
                  <p className="text-[11px] font-black text-[#6D28D9]">מספר הצעה</p>
                  <p className="mt-1 text-sm font-black text-slate-900">
                    {proposal.proposalNumber}
                  </p>
                </div>
              ) : null}
            </div>
          </section>

          {proposal.showUnderstanding !== false &&
          (proposal.understandingText || understandingBits.length) ? (
            <section>
              <h2 className="text-xl font-black text-slate-900">מה הבנו על העסק שלך</h2>
              {proposal.understandingText ? (
                <p className="mt-3 text-base font-semibold leading-7 text-slate-600">
                  {proposal.understandingText}
                </p>
              ) : null}
              {understandingBits.length ? (
                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {understandingBits.map((bit) => (
                    <div
                      key={bit.title}
                      className="rounded-2xl border border-violet-100 bg-violet-50/50 p-4"
                    >
                      <p className="text-xs font-black text-[#6D28D9]">{bit.title}</p>
                      <ul className="mt-2 space-y-1 text-sm font-semibold text-slate-700">
                        {bit.items.map((item) => (
                          <li key={item}>• {item}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              ) : null}
            </section>
          ) : null}

          <section>
            <h2 className="text-xl font-black text-slate-900">הפתרון שאנחנו מציעים</h2>
            <p className="mt-1 text-sm font-semibold text-slate-500">
              לחצו על פירוט בכל רכיב כדי לראות מה כלול, מגבלות ומה דורש תוספת
            </p>
            <div className="mt-4 space-y-3">
              {grouped.packageLines.map((line) => (
                <LineCard
                  key={line.sku}
                  line={line}
                  open={Boolean(open[line.sku])}
                  onToggle={() => toggle(line.sku)}
                />
              ))}
            </div>
          </section>

          {grouped.packageLines[0]?.bullets?.length ? (
            <section className="rounded-3xl border border-slate-200 bg-slate-50 p-5 sm:p-6">
              <h2 className="text-xl font-black text-slate-900">מה כלול בחבילה</h2>
              <ul className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
                {grouped.packageLines[0].bullets.map((b) => (
                  <li key={b} className="flex items-start gap-2 text-sm font-semibold text-slate-700">
                    <span className="text-emerald-500">✓</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {grouped.services.length || grouped.oneTimeAddons.length ? (
            <section>
              <h2 className="text-xl font-black text-slate-900">שירותים נוספים</h2>
              <div className="mt-4 space-y-3">
                {[...grouped.oneTimeAddons, ...grouped.services].map((line) => (
                  <LineCard
                    key={`svc-${line.sku}`}
                    line={line}
                    open={Boolean(open[`svc-${line.sku}`])}
                    onToggle={() => toggle(`svc-${line.sku}`)}
                  />
                ))}
              </div>
            </section>
          ) : null}

          <section className="space-y-4">
            <h2 className="text-xl font-black text-slate-900">סיכום השקעה</h2>
            <div className="overflow-hidden rounded-3xl border border-violet-100 bg-gradient-to-l from-violet-50 via-white to-white">
              <div className="grid grid-cols-1 divide-y divide-violet-100 sm:grid-cols-2 lg:grid-cols-4 sm:divide-x sm:divide-y-0 sm:divide-x-reverse">
                <div className="p-5 sm:p-6">
                  <p className="text-xs font-black uppercase tracking-wide text-slate-400">
                    חיוב חודשי
                  </p>
                  <p className="mt-2 text-2xl font-black text-[#6D28D9] sm:text-3xl">
                    {money(totals.monthlyIls || 0)}
                  </p>
                  <p className="mt-1 text-xs font-bold text-slate-500">לחודש</p>
                </div>
                <div className="p-5 sm:p-6">
                  <p className="text-xs font-black uppercase tracking-wide text-slate-400">
                    חיוב שנתי
                  </p>
                  <p className="mt-2 text-2xl font-black text-slate-900 sm:text-3xl">
                    {money(totals.yearlyIls || 0)}
                  </p>
                  <p className="mt-1 text-xs font-bold text-slate-500">אם נבחר</p>
                </div>
                <div className="p-5 sm:p-6">
                  <p className="text-xs font-black uppercase tracking-wide text-slate-400">
                    חיוב חד־פעמי
                  </p>
                  <p className="mt-2 text-2xl font-black text-slate-900 sm:text-3xl">
                    {money(totals.oneTimeIls || 0)}
                  </p>
                  <p className="mt-1 text-xs font-bold text-slate-500">הקמה / אתר / תוספות</p>
                </div>
                <div className="p-5 sm:p-6">
                  <p className="text-xs font-black uppercase tracking-wide text-slate-400">
                    שירותים מקצועיים
                  </p>
                  <p className="mt-2 text-2xl font-black text-slate-900 sm:text-3xl">
                    {money(totals.servicesIls || 0)}
                  </p>
                  <p className="mt-1 text-xs font-bold text-slate-500">שירותים נוספים</p>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-black text-slate-900">מה קורה אחרי אישור?</h2>
            <ol className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
              {[
                { n: "1", t: "אישור וחתימה", d: "קוראים את התנאים וחותמים דיגיטלית" },
                { n: "2", t: "תשלום מאובטח", d: "מעבר ל-Stripe לפי המחיר שבהצעה" },
                { n: "3", t: "הטמעה והדרכה", d: "מקימים ומלווים אתכם" },
              ].map((step) => (
                <li
                  key={step.n}
                  className="rounded-2xl border border-slate-200 bg-white p-4 text-center"
                >
                  <span className="mx-auto grid h-9 w-9 place-items-center rounded-full bg-[#6D28D9] text-sm font-black text-white">
                    {step.n}
                  </span>
                  <p className="mt-3 text-sm font-black text-slate-900">{step.t}</p>
                  <p className="mt-1 text-xs font-semibold text-slate-500">{step.d}</p>
                </li>
              ))}
            </ol>
          </section>

          {proposal.notesPublic ? (
            <section>
              <h2 className="text-lg font-black text-slate-900">הערות</h2>
              <p className="mt-2 whitespace-pre-wrap text-sm font-semibold leading-7 text-slate-600">
                {proposal.notesPublic}
              </p>
            </section>
          ) : null}

          {termItems.length ? (
            <section className="rounded-3xl border border-slate-200 bg-slate-50 p-5 sm:p-6">
              <h2 className="text-xl font-black text-slate-900">תנאים</h2>
              <ul className="mt-4 space-y-3">
                {termItems.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2 text-sm font-semibold leading-6 text-slate-700"
                  >
                    <span className="mt-1 text-[#6D28D9]">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {(proposal.hasSignature || proposal.signatureData) && proposal.approvedByName ? (
            <section className="rounded-3xl border border-emerald-100 bg-emerald-50/40 p-5">
              <h2 className="text-lg font-black text-emerald-900">אישור וחתימה</h2>
              <p className="mt-2 text-sm font-semibold text-slate-700">
                נחתם על ידי {proposal.approvedByName}
                {proposal.signedAt ? ` · ${formatDate(proposal.signedAt)}` : ""}
              </p>
              {proposal.signatureData ? (
                <img
                  src={proposal.signatureData}
                  alt="חתימה"
                  className="mt-3 max-h-28 rounded-xl border border-emerald-100 bg-white p-2"
                />
              ) : null}
            </section>
          ) : null}

          {footer}

          {proposal.expiresAt ? (
            <p className="text-center text-xs font-bold text-slate-400">
              ההצעה בתוקף עד {formatDate(proposal.expiresAt)}
            </p>
          ) : null}
        </div>
      </article>
    </div>
  );
}

export default ProposalDocumentView;
