import React, { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import AdminHeader from "../AdminsHeader";
import logo from "../../../images/logo_final.svg";
import { agreementError, previewPartnerAgreement } from "../../../lib/partnerAgreementApi";

export default function AdminPartnerAgreementPreview() {
  const { id = "" } = useParams();
  const [params] = useSearchParams();
  const version = params.get("version");
  const [data, setData] = useState<Awaited<ReturnType<typeof previewPartnerAgreement>> | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    previewPartnerAgreement(id, version ? Number(version) : undefined)
      .then((preview) => {
        if (!cancelled) setData(preview);
      })
      .catch((err) => {
        if (!cancelled) setError(agreementError(err, "Could not preview the agreement."));
      });
    return () => {
      cancelled = true;
    };
  }, [id, version]);

  const tiers = Array.isArray(data?.variables?.tierLines) ? data?.variables.tierLines : [];

  return (
    <div className="min-h-screen bg-[#F3F0EA]">
      <AdminHeader />
      <main className="mx-auto max-w-[860px] px-4 py-6">
        <Link to={`/admin/partner-agreements/${id}`} className="text-sm font-black text-[#6D28D9]">
          Back to agreement
        </Link>
        {error ? <p className="mt-4 rounded-2xl bg-rose-50 px-4 py-3 text-sm font-bold text-rose-800">{error}</p> : null}
        {data ? (
          <article
            data-testid="agreement-preview"
            dir={data.dir === "rtl" ? "rtl" : "ltr"}
            lang={String(data.locale || "en")}
            className="mt-4 rounded-[28px] bg-white px-6 py-8 shadow-sm sm:px-12"
          >
            <img src={logo} alt="Bizuply" className="h-12 w-auto" />
            <p className="mt-6 text-xs font-black uppercase tracking-[0.18em] text-[#6D28D9]">Partner Program</p>
            <h1 className="mt-2 text-3xl font-black text-slate-950">{data.title}</h1>
            <p className="mt-2 text-sm font-bold text-slate-500">
              {String(data.agreementNumber || "")}
              {data.frozen ? " · signed version preserved" : data.live ? " · current template" : ""}
              {data.versionNumber ? ` · version ${data.versionNumber}` : ""}
            </p>
            <dl className="mt-6 grid gap-2 rounded-2xl bg-[#F5F3FF] p-4 text-sm sm:grid-cols-2">
              <div><dt className="font-bold text-slate-500">Partner</dt><dd className="font-black">{String(data.variables.legalCompanyName || "")}</dd></div>
              <div><dt className="font-bold text-slate-500">Territory</dt><dd className="font-black">{String(data.variables.territoryLabel || "")}</dd></div>
              <div><dt className="font-bold text-slate-500">Type</dt><dd className="font-black">{String(data.variables.territoryTypeLabel || "")}</dd></div>
              <div><dt className="font-bold text-slate-500">License fee</dt><dd className="font-black">{String(data.variables.licenseFee || "")}</dd></div>
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
          </article>
        ) : !error ? (
          <p className="mt-6 font-bold text-slate-500">Loading preview...</p>
        ) : null}
      </main>
    </div>
  );
}
