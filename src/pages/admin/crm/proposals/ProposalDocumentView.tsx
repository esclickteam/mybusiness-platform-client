import React, { useMemo, useState } from "react";

const BRAND = "#6D28D9";

export type ProposalLine = {
  sku: string;
  nameHe: string;
  category?: string;
  billing?: string;
  amountIls: number;
  quantity?: number;
  bullets?: string[];
  descriptionHe?: string;
  highlightedByCustomer?: boolean;
};

export type ProposalViewModel = {
  proposalNumber?: string;
  customerName?: string;
  businessName?: string;
  understandingText?: string;
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
  status?: string;
};

function money(n?: number) {
  return `₪${Number(n || 0).toLocaleString("he-IL")}`;
}

function billingLabel(billing?: string) {
  if (billing === "recurring_month") return "חודשי";
  if (billing === "recurring_year") return "שנתי";
  return "חד־פעמי";
}

export function ProposalDocumentView({
  proposal,
  interactive = false,
  footer,
}: {
  proposal: ProposalViewModel;
  interactive?: boolean;
  footer?: React.ReactNode;
}) {
  const [open, setOpen] = useState<Record<string, boolean>>({});
  const lines = proposal.lines || [];
  const totals = proposal.totals || {};

  const grouped = useMemo(() => {
    const plans = lines.filter((l) => l.category === "plan" || l.category === "addon");
    const services = lines.filter(
      (l) => l.category === "managed_service" || l.category === "managed_service_addon"
    );
    return { plans, services };
  }, [lines]);

  return (
    <div dir="rtl" className="mx-auto w-full max-w-3xl text-right">
      <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-xl">
        <div
          className="px-6 py-8 text-white sm:px-8"
          style={{ background: `linear-gradient(135deg, ${BRAND}, #4c1d95)` }}
        >
          <p className="text-sm font-bold opacity-90">BizUply</p>
          <h1 className="mt-2 text-2xl font-black sm:text-3xl">הצעה מותאמת אישית</h1>
          <p className="mt-2 text-sm font-semibold opacity-90">
            {proposal.businessName || proposal.customerName || "ללקוח"}
            {proposal.proposalNumber ? ` · ${proposal.proposalNumber}` : ""}
          </p>
          {proposal.expiresAt ? (
            <p className="mt-1 text-xs font-bold opacity-80">
              בתוקף עד{" "}
              {new Date(proposal.expiresAt).toLocaleDateString("he-IL", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })}
            </p>
          ) : null}
        </div>

        <div className="space-y-6 px-5 py-6 sm:px-8">
          {proposal.showUnderstanding !== false && proposal.understandingText ? (
            <section>
              <h2 className="text-lg font-black text-slate-900">מה הבנו על העסק</h2>
              <p className="mt-2 text-sm font-semibold leading-7 text-slate-600">
                {proposal.understandingText}
              </p>
            </section>
          ) : null}

          <section>
            <h2 className="text-lg font-black text-slate-900">הפתרון המומלץ</h2>
            <div className="mt-3 space-y-3">
              {(grouped.plans.length ? grouped.plans : lines).map((line) => {
                const key = line.sku;
                const isOpen = Boolean(open[key]);
                return (
                  <div key={key} className="rounded-2xl border border-slate-200 bg-slate-50/60">
                    <button
                      type="button"
                      disabled={!interactive && !line.bullets?.length}
                      onClick={() =>
                        setOpen((prev) => ({ ...prev, [key]: !prev[key] }))
                      }
                      className="flex w-full items-start justify-between gap-3 px-4 py-4 text-right"
                    >
                      <div>
                        <p className="text-base font-black text-slate-900">{line.nameHe}</p>
                        <p className="mt-1 text-xs font-bold text-slate-500">
                          {billingLabel(line.billing)}
                          {line.quantity && line.quantity > 1 ? ` · ×${line.quantity}` : ""}
                        </p>
                      </div>
                      <div className="text-left">
                        <p className="text-base font-black text-[#6D28D9]">
                          {money(line.amountIls * (line.quantity || 1))}
                        </p>
                        <p className="mt-1 text-xs font-bold text-slate-500">
                          {isOpen ? "⌃ הסתר פירוט" : "⌄ פירוט"}
                        </p>
                      </div>
                    </button>
                    {isOpen && (line.bullets || []).length ? (
                      <ul className="space-y-1 border-t border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700">
                        {(line.bullets || []).map((b) => (
                          <li key={b}>• {b}</li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </section>

          {grouped.services.length ? (
            <section>
              <h2 className="text-lg font-black text-slate-900">שירותים נוספים</h2>
              <div className="mt-3 space-y-3">
                {grouped.services.map((line) => {
                  const key = `svc-${line.sku}`;
                  const isOpen = Boolean(open[key]);
                  return (
                    <div key={key} className="rounded-2xl border border-violet-100 bg-violet-50/40">
                      <button
                        type="button"
                        onClick={() =>
                          setOpen((prev) => ({ ...prev, [key]: !prev[key] }))
                        }
                        className="flex w-full items-start justify-between gap-3 px-4 py-4 text-right"
                      >
                        <div>
                          <p className="text-base font-black text-slate-900">{line.nameHe}</p>
                          <p className="mt-1 text-xs font-bold text-slate-500">
                            {billingLabel(line.billing)}
                          </p>
                        </div>
                        <div className="text-left">
                          <p className="text-base font-black text-[#6D28D9]">
                            {money(line.amountIls * (line.quantity || 1))}
                          </p>
                          <p className="mt-1 text-xs font-bold text-slate-500">
                            {isOpen ? "⌃ הסתר פירוט" : "⌄ פירוט"}
                          </p>
                        </div>
                      </button>
                      {isOpen && (line.bullets || []).length ? (
                        <ul className="space-y-1 border-t border-violet-100 px-4 py-3 text-sm font-semibold text-slate-700">
                          {(line.bullets || []).map((b) => (
                            <li key={b}>• {b}</li>
                          ))}
                        </ul>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            </section>
          ) : null}

          <section className="rounded-2xl border border-slate-200 bg-white p-4">
            <h2 className="text-lg font-black text-slate-900">סיכום מחירים</h2>
            <div className="mt-3 space-y-2 text-sm font-bold text-slate-700">
              {totals.monthlyIls ? (
                <p className="flex justify-between">
                  <span>חיוב חודשי</span>
                  <span>{money(totals.monthlyIls)}</span>
                </p>
              ) : null}
              {totals.yearlyIls ? (
                <p className="flex justify-between">
                  <span>חיוב שנתי</span>
                  <span>{money(totals.yearlyIls)}</span>
                </p>
              ) : null}
              {totals.oneTimeIls ? (
                <p className="flex justify-between">
                  <span>חד־פעמי</span>
                  <span>{money(totals.oneTimeIls)}</span>
                </p>
              ) : null}
              {totals.servicesIls ? (
                <p className="flex justify-between">
                  <span>שירותים נוספים</span>
                  <span>{money(totals.servicesIls)}</span>
                </p>
              ) : null}
            </div>
          </section>

          {proposal.notesPublic ? (
            <section>
              <h2 className="text-lg font-black text-slate-900">הערות</h2>
              <p className="mt-2 whitespace-pre-wrap text-sm font-semibold leading-7 text-slate-600">
                {proposal.notesPublic}
              </p>
            </section>
          ) : null}

          {proposal.termsText ? (
            <section>
              <h2 className="text-lg font-black text-slate-900">תנאים</h2>
              <p className="mt-2 whitespace-pre-wrap text-sm font-semibold leading-7 text-slate-600">
                {proposal.termsText}
              </p>
            </section>
          ) : null}

          {footer}
        </div>
      </div>
    </div>
  );
}

export default ProposalDocumentView;
