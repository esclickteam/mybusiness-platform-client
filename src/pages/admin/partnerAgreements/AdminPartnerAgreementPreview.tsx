import React, { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import AdminHeader from "../AdminsHeader";
import logo from "../../../images/logo_final.svg";
import { agreementError, previewPartnerAgreement } from "../../../lib/partnerAgreementApi";
import { fill } from "./partnerAgreementPageCopy.js";
import { usePartnerAgreementPage } from "./usePartnerAgreementPage";

type PreviewIssue = { field?: string; code?: string; message?: string };

const ISSUE_KEYS: Record<string, string> = {
  legalProfile: "issueLegalProfile",
  legalCompanyName: "issueLegalCompanyName",
  brandName: "issueBrandName",
  country: "issueCountry",
  incorporationCountry: "issueIncorporation",
  territoryType: "issueTerritoryType",
  dates: "issueDates",
  agreementDate: "issueDates",
  effectiveDate: "issueDates",
  startDate: "issueDates",
  endDate: "issueDates",
  paymentDueDate: "issueDates",
  renewalDate: "issueDates",
  licenseFee: "issueLicenseFee",
  currency: "issueCurrency",
  contactEmail: "issueContactEmail",
  signatoryEmail: "issueSignatoryEmail",
  signatories: "issueSignatories",
  subdivision: "issueSubdivision",
  locale: "issueLocale",
  commission: "issueCommission",
  payment: "issuePayment",
  commercial: "issuePayment",
  form: "issueGeneric",
};

function issueLines(issues: PreviewIssue[], text: object) {
  const pack = text as Record<string, string>;
  const lines: string[] = [];
  const seen = new Set<string>();
  issues.forEach((issue) => {
    const key = ISSUE_KEYS[issue.field || ""] || "";
    const line = (key && pack[key]) || issue.message || pack.issueGeneric;
    if (!line || seen.has(line)) return;
    seen.add(line);
    lines.push(line);
  });
  return lines;
}

export default function AdminPartnerAgreementPreview({ unsaved = false }: { unsaved?: boolean }) {
  const page = usePartnerAgreementPage();
  const t = page.text.preview;
  const { id = "" } = useParams();
  const [params] = useSearchParams();
  const version = params.get("version");
  const [data, setData] = useState<(Awaited<ReturnType<typeof previewPartnerAgreement>> & { issues?: PreviewIssue[] }) | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    if (unsaved) {
      try {
        const stored = sessionStorage.getItem("partner-agreement-unsaved-preview");
        const preview = stored ? JSON.parse(stored) : null;
        if (!preview || preview.persisted) {
          setError(t.empty);
        } else {
          setData(preview);
        }
      } catch {
        setError(t.unreadable);
      }
      return () => {
        cancelled = true;
      };
    }
    previewPartnerAgreement(id, version ? Number(version) : undefined)
      .then((preview) => {
        if (!cancelled) setData(preview);
      })
      .catch((err) => {
        if (!cancelled) setError(agreementError(err, t.error));
      });
    return () => {
      cancelled = true;
    };
  }, [id, t.empty, t.error, t.unreadable, unsaved, version]);

  const tiers = Array.isArray(data?.variables?.tierLines) ? data?.variables.tierLines : [];

  return (
    <div className="min-h-screen bg-[#F3F0EA]">
      <AdminHeader />
      <main className="mx-auto max-w-[860px] px-4 py-6" dir={page.dir} lang={page.locale}>
        <Link to={unsaved ? "/admin/partner-agreements/new" : `/admin/partner-agreements/${id}`} className="text-sm font-black text-[#6D28D9]">
          {unsaved ? t.backCreate : t.back}
        </Link>
        {unsaved ? <p className="mt-2 text-sm font-bold text-emerald-800">{t.unsaved}</p> : null}
        {error ? <p className="mt-4 rounded-2xl bg-rose-50 px-4 py-3 text-sm font-bold text-rose-800">{error}</p> : null}
        {data?.issues?.length ? (
          <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-bold text-amber-950" data-testid="preview-issues">
            <p>{t.issuesTitle}</p>
            <ul className="mt-2 list-disc space-y-1 ps-5">
              {issueLines(data.issues, t).map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </div>
        ) : null}
        {data ? (
          <article
            data-testid="agreement-preview"
            dir={data.dir === "rtl" ? "rtl" : "ltr"}
            lang={String(data.locale || "en")}
            className="mt-4 rounded-[28px] bg-white px-6 py-8 shadow-sm sm:px-12"
          >
            <img src={logo} alt="Bizuply" className="h-12 w-auto" />
            <p className="mt-6 text-xs font-black uppercase tracking-[0.18em] text-[#6D28D9]">{t.program}</p>
            <h1 className="mt-2 text-3xl font-black text-slate-950">{data.title}</h1>
            <p className="mt-2 text-sm font-bold text-slate-500">
              {String(data.agreementNumber || "")}
              {data.frozen ? ` · ${t.signedPreserved}` : data.live ? ` · ${t.currentTemplate}` : ""}
              {data.versionNumber ? ` · ${fill(t.version, { version: data.versionNumber })}` : ""}
            </p>
            <dl className="mt-6 grid gap-2 rounded-2xl bg-[#F5F3FF] p-4 text-sm sm:grid-cols-2" dir={page.dir}>
              <div><dt className="font-bold text-slate-500">{t.partner}</dt><dd className="font-black">{String(data.variables.legalCompanyName || "")}</dd></div>
              <div><dt className="font-bold text-slate-500">{t.territory}</dt><dd className="font-black">{String(data.variables.territoryLabel || "")}</dd></div>
              <div><dt className="font-bold text-slate-500">{t.type}</dt><dd className="font-black">{String(data.variables.territoryTypeLabel || data.variables.TERRITORY_TYPE || "")}</dd></div>
              <div><dt className="font-bold text-slate-500">{t.fee}</dt><dd className="font-black">{String(data.variables.licenseFee || "")}</dd></div>
            </dl>
            {tiers.length ? (
              <ul className="mt-4 list-disc pl-5 text-sm font-semibold text-slate-700">
                {tiers.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            ) : null}
            <div className="mt-8 space-y-8">
              {(data.parts?.length ? data.parts : [{ locale: data.locale || "en", dir: data.dir || "ltr", title: data.title, sections: data.sections }]).map((part) => (
                <div key={part.locale} dir={part.dir === "rtl" ? "rtl" : "ltr"} lang={part.locale}>
                  {data.parts && data.parts.length > 1 ? <h2 className="mb-4 text-2xl font-black">{part.title}</h2> : null}
                  {part.sections.map((section) => (
                    <section key={`${part.locale}-${section.number}-${section.title}`} className="mb-6">
                      <h2 className="text-lg font-black text-[#6D28D9]">
                        {section.number ? `${section.number}. ${section.title}` : section.title}
                      </h2>
                      {section.paragraphs.map((paragraph) => (
                        <p key={paragraph.slice(0, 80)} className="mt-2 text-sm font-medium leading-6 text-slate-700">
                          {paragraph}
                        </p>
                      ))}
                    </section>
                  ))}
                </div>
              ))}
            </div>
            <div className="mt-10 space-y-4 border-t border-slate-200 pt-6" data-testid="signature-blocks" dir={page.dir}>
              {(data.signatories?.length
                ? data.signatories
                : [
                    { party: "partner" as const, fullName: String(data.variables.PARTNER_SIGNATORY_NAME || ""), title: String(data.variables.PARTNER_SIGNATORY_TITLE || ""), order: 1, required: true, email: "" },
                    { party: "bizuply" as const, fullName: String(data.variables.BIZUPLY_SIGNATORY_NAME || t.authorized), title: String(data.variables.BIZUPLY_SIGNATORY_TITLE || "Bizuply"), order: 1, required: true, email: "" },
                  ]
              ).map((signatory, index) => (
                <section
                  key={`${signatory.party}-${signatory.fullName}-${index}`}
                  data-testid={signatory.party === "bizuply" ? "bizuply-signature" : "partner-signature"}
                  className="rounded-2xl border border-dashed border-slate-300 p-4"
                >
                  <h2 className="text-sm font-black uppercase tracking-wide text-slate-500">
                    {signatory.party === "bizuply" ? t.bizuply : t.partner}
                  </h2>
                  <p className="mt-3 font-black text-slate-950">{signatory.fullName || t.name}</p>
                  <p className="text-sm font-semibold text-slate-600">{signatory.title || t.title}</p>
                  <p className="mt-6 text-sm font-semibold text-slate-400">{t.signature}: __________</p>
                  <p className="text-sm font-semibold text-slate-400">{t.date}: __________</p>
                </section>
              ))}
            </div>
          </article>
        ) : !error ? (
          <p className="mt-6 font-bold text-slate-500">{t.loading}</p>
        ) : null}
      </main>
    </div>
  );
}
