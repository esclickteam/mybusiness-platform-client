import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../../api";
import LanguageSwitcher from "../../components/LanguageSwitcher";
import logo from "../../images/logo_final.svg";
import { agreementStatusLabel } from "../admin/partnerAgreements/partnerAgreementPageCopy.js";
import { usePartnerAgreementPage } from "../admin/partnerAgreements/usePartnerAgreementPage";

type Signatory = {
  signatoryId: string;
  party: "partner" | "bizuply";
  fullName: string;
  title: string;
  email: string;
  order: number;
  required: boolean;
};

type Preview = {
  agreementNumber: string;
  locale: string;
  dir?: string;
  partnerLegalCompanyName: string;
  territoryLabel: string;
  territoryType: string;
  licenseFee: number | null;
  currency: string;
  startDate: string;
  endDate: string;
  confirmationText: string;
  partnerAlreadySigned: boolean;
  alreadySigned?: boolean;
  signatureStatus?: string;
  signatureStatusLabel?: string;
  signatureProgress?: {
    partner: { completed: number; required: number };
    bizuply: { completed: number; required: number };
  };
  signatory?: Signatory | null;
  sections: { number: number | null; title: string; paragraphs: string[] }[];
  parts?: { locale: string; dir: string; title: string; sections: { number: number | null; title: string; paragraphs: string[] }[] }[];
};

export default function PartnerAgreementSign() {
  const page = usePartnerAgreementPage();
  const text = page.text.sign;
  const { token = "" } = useParams();
  const [data, setData] = useState<Preview | null>(null);
  const [error, setError] = useState("");
  const [done, setDone] = useState("");
  const [typedName, setTypedName] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  useEffect(() => {
    API.get(`/public/partner-agreement-sign/${token}`)
      .then((res) => {
        setData(res.data);
        if (res.data?.signatory?.fullName) setTypedName("");
      })
      .catch(() => setError(text.invalidLink));
  }, [token, text.invalidLink]);

  async function sign(event: React.FormEvent) {
    event.preventDefault();
    if (!data) return;
    setError("");
    try {
      const res = await API.post(`/public/partner-agreement-sign/${token}`, {
        confirmed,
        method: "typed",
        typedName,
        confirmationText: data.confirmationText,
      });
      const label = agreementStatusLabel(res.data.signatureStatus || res.data.status, page.text) || res.data.signatureStatusLabel || res.data.status;
      setDone(`${text.signedAgreement} ${res.data.agreementNumber}. ${label}`);
    } catch (err: unknown) {
      const row = err as { response?: { data?: { error?: string } } };
      setError(row.response?.data?.error || text.couldNotSign);
    }
  }

  const parts = data?.parts?.length
    ? data.parts
    : data
      ? [{ locale: data.locale, dir: data.dir || "ltr", title: "", sections: data.sections }]
      : [];
  const progress = data?.signatureProgress;

  return (
    <main className="min-h-screen bg-[#F3F0EA] px-4 py-8" dir={page.dir} lang={page.locale}>
      <div className="mx-auto max-w-[860px]">
        <div className="flex items-center justify-between gap-3">
          <img src={logo} alt="Bizuply" className="h-12 w-auto" />
          <LanguageSwitcher compact={false} />
        </div>
        <h1 className="mt-4 text-3xl font-black">{text.signPageTitle}</h1>
        {error ? <p className="mt-4 rounded-2xl bg-rose-50 px-4 py-3 text-sm font-bold text-rose-800">{error}</p> : null}
        {done ? <p className="mt-4 rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-900">{done}</p> : null}
        {data ? (
          <article className="mt-4 rounded-[28px] bg-white px-6 py-8" data-testid="partner-sign">
            <p className="font-black">{data.agreementNumber}</p>
            {data.signatureStatus || data.signatureStatusLabel ? (
              <p className="mt-1 text-sm font-bold text-[#6D28D9]">{agreementStatusLabel(data.signatureStatus, page.text) || data.signatureStatusLabel}</p>
            ) : null}
            {progress ? (
              <div className="mt-3 text-sm font-bold text-slate-700" data-testid="public-signature-progress">
                <p>{text.partnerProgress}: {progress.partner.completed} {text.of} {progress.partner.required} {text.completed}</p>
                <p>{text.bizuplyProgress}: {progress.bizuply.completed} {text.of} {progress.bizuply.required} {text.completed}</p>
              </div>
            ) : null}
            {data.signatory ? (
              <p className="mt-4 rounded-2xl bg-[#F5F3FF] px-4 py-3 text-sm font-bold" data-testid="signing-as">
                {text.signingAs} {data.signatory.fullName}
                {data.signatory.title ? ` — ${data.signatory.title}` : ""}
              </p>
            ) : null}
            <dl className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
              <div><dt className="text-slate-500">{text.company}</dt><dd className="font-black">{data.partnerLegalCompanyName}</dd></div>
              <div><dt className="text-slate-500">{text.territory}</dt><dd className="font-black">{data.territoryLabel}</dd></div>
              <div><dt className="text-slate-500">{text.exclusivity}</dt><dd className="font-black">{data.territoryType}</dd></div>
              <div><dt className="text-slate-500">{text.fee}</dt><dd className="font-black">{data.currency} {data.licenseFee}</dd></div>
              <div><dt className="text-slate-500">{text.dates}</dt><dd className="font-black">{data.startDate} – {data.endDate}</dd></div>
            </dl>
            {parts.map((part) => (
              <div key={part.locale} dir={part.dir === "rtl" ? "rtl" : "ltr"} lang={part.locale} className="mt-6 space-y-4">
                {part.sections.map((section) => (
                  <section key={`${part.locale}-${section.number}`}>
                    <h2 className="font-black text-[#6D28D9]">{section.number}. {section.title}</h2>
                    {section.paragraphs.map((paragraph) => (
                      <p key={paragraph.slice(0, 60)} className="mt-1 text-sm leading-6">{paragraph}</p>
                    ))}
                  </section>
                ))}
              </div>
            ))}
            {data.alreadySigned || done ? null : (
              <form onSubmit={sign} className="mt-8 space-y-3 border-t border-slate-200 pt-4">
                <label className="flex items-start gap-2 text-sm font-bold">
                  <input type="checkbox" checked={confirmed} onChange={(e) => setConfirmed(e.target.checked)} />
                  <span>{data.confirmationText}</span>
                </label>
                <input className="w-full rounded-xl border px-3 py-2" placeholder={text.typeName} aria-label={text.typeName} value={typedName} onChange={(e) => setTypedName(e.target.value)} />
                <button className="rounded-xl bg-[#6D28D9] px-4 py-2 text-sm font-black text-white" type="submit">{text.signButton}</button>
              </form>
            )}
          </article>
        ) : null}
      </div>
    </main>
  );
}
