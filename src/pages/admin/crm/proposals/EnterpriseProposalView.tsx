import React from "react";

export type EnterpriseSection = {
  id: string;
  title: string;
  items: string[];
};

export type EnterpriseSnapshot = {
  title?: string;
  projectGoal?: string;
  sections?: EnterpriseSection[];
  setupPriceIls?: number;
  monthlyPriceIls?: number;
  termsText?: string;
  cancellationTerms?: string;
  thirdPartyFeesEnabled?: boolean;
  thirdPartyFeesText?: string;
};

export type EnterpriseProposalModel = {
  proposalNumber?: string;
  customerName?: string;
  businessName?: string;
  status?: string;
  expiresAt?: string | null;
  createdAt?: string | null;
  enterprise?: EnterpriseSnapshot | null;
  termsText?: string;
  cancellationTerms?: string;
};

function money(n?: number) {
  const value = Number(n || 0);
  if (!value) return "";
  return `₪${value.toLocaleString("he-IL")}`;
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

function paragraphs(text?: string) {
  return String(text || "")
    .split("\n")
    .map((row) => row.trim())
    .filter(Boolean);
}

export function EnterpriseProposalView({
  proposal,
  footer,
}: {
  proposal: EnterpriseProposalModel;
  footer?: React.ReactNode;
  interactive?: boolean;
}) {
  const ent = proposal.enterprise || {};
  const title = ent.title || "הצעה מותאמת אישית";
  const customer = proposal.businessName || proposal.customerName || "העסק שלך";
  const setup = Number(ent.setupPriceIls || 0);
  const monthly = Number(ent.monthlyPriceIls || 0);

  return (
    <div dir="rtl" className="mx-auto w-full max-w-4xl text-right">
      <article className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-2xl">
        <header className="bg-[#111827] px-5 py-8 text-white sm:px-10 sm:py-10">
          <p className="text-sm font-black tracking-[0.2em]">BIZUPLY</p>
          <h1 className="mt-4 text-2xl font-black leading-tight sm:text-3xl">
            הצעה מותאמת אישית עבור {customer}
          </h1>
          <p className="mt-2 text-sm font-semibold text-slate-300">
            {[proposal.proposalNumber, formatDate(proposal.createdAt)].filter(Boolean).join(" · ")}
          </p>
        </header>

        <div className="space-y-8 px-5 py-7 sm:px-10 sm:py-10">
          <section className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {setup > 0 ? (
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                <p className="text-xs font-black uppercase tracking-wide text-slate-400">
                  הקמה חד־פעמית
                </p>
                <p className="mt-2 text-3xl font-black text-slate-900">{money(setup)}</p>
              </div>
            ) : null}
            {monthly > 0 ? (
              <div className="rounded-3xl border border-violet-100 bg-violet-50 p-5">
                <p className="text-xs font-black uppercase tracking-wide text-[#6D28D9]">
                  מנוי חודשי
                </p>
                <p className="mt-2 text-3xl font-black text-[#6D28D9]">
                  {money(monthly)} <span className="text-base font-bold">לחודש</span>
                </p>
              </div>
            ) : null}
          </section>

          <section>
            <h2 className="text-xl font-black text-slate-900">{title}</h2>
            {proposal.expiresAt ? (
              <p className="mt-1 text-sm font-semibold text-slate-500">
                בתוקף עד {formatDate(proposal.expiresAt)}
              </p>
            ) : null}
          </section>

          {ent.projectGoal ? (
            <section>
              <h2 className="text-xl font-black text-slate-900">מטרת הפרויקט</h2>
              <p className="mt-3 whitespace-pre-wrap text-base font-semibold leading-8 text-slate-600">
                {ent.projectGoal}
              </p>
            </section>
          ) : null}

          {(ent.sections || []).length ? (
            <section>
              <h2 className="text-xl font-black text-slate-900">מה כולל הפרויקט</h2>
              <div className="mt-5 space-y-6">
                {(ent.sections || []).map((section) => (
                  <div key={section.id || section.title}>
                    <h3 className="text-base font-black text-slate-900">{section.title}</h3>
                    <ul className="mt-2 space-y-1.5">
                      {(section.items || []).map((item) => (
                        <li
                          key={item}
                          className="flex items-start gap-2 text-sm font-semibold leading-7 text-slate-700"
                        >
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#6D28D9]" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          ) : null}

          {paragraphs(ent.termsText || proposal.termsText).length ? (
            <section>
              <h2 className="text-xl font-black text-slate-900">תנאי החבילה</h2>
              <ul className="mt-3 space-y-2">
                {paragraphs(ent.termsText || proposal.termsText).map((row) => (
                  <li key={row} className="text-sm font-semibold leading-7 text-slate-600">
                    {row}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {paragraphs(ent.cancellationTerms || proposal.cancellationTerms).length ? (
            <section>
              <h2 className="text-xl font-black text-slate-900">תנאי ביטול</h2>
              <ul className="mt-3 space-y-2">
                {paragraphs(ent.cancellationTerms || proposal.cancellationTerms).map((row) => (
                  <li key={row} className="text-sm font-semibold leading-7 text-slate-600">
                    {row}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {ent.thirdPartyFeesEnabled && ent.thirdPartyFeesText ? (
            <section>
              <h2 className="text-xl font-black text-slate-900">עלויות נוספות</h2>
              <p className="mt-3 whitespace-pre-wrap text-sm font-semibold leading-7 text-slate-600">
                {ent.thirdPartyFeesText}
              </p>
            </section>
          ) : null}

          {footer}
        </div>
      </article>
    </div>
  );
}

export default EnterpriseProposalView;
