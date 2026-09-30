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
  presentationHtml?: string;
  onboarding?: Record<string, string>;
  teamPackageRequest?: { requestedSubPartnerSeats?: number; requestedSubPartnerPackage?: string; requestedSubPartnerAnnualPrice?: number | null; subPartnerPackageStatus?: string };
  companyVerification?: { status?: string; identityRequired?: boolean; registrationShowsSignatory?: boolean | null; hasRegistration?: boolean; hasAuthority?: boolean };
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
  const [seats, setSeats] = useState(0);
  const [seatConfirmed, setSeatConfirmed] = useState(false);
  const [seatMessage, setSeatMessage] = useState("");
  const [showsSignatory, setShowsSignatory] = useState<boolean | null>(null);
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
            {data.presentationHtml ? (
              <div className="mt-6 overflow-auto bg-[#E7E5E4] p-2" dir={data.dir === "rtl" ? "rtl" : "ltr"}>
                <iframe title={data.agreementNumber} srcDoc={data.presentationHtml} className="mx-auto block min-w-[210mm] border-0 bg-white" style={{ width: "210mm", height: "900px" }} onLoad={(event) => {
                  const frame = event.currentTarget;
                  const height = frame.contentDocument?.documentElement?.scrollHeight;
                  if (height) frame.style.height = `${height + 8}px`;
                }} />
              </div>
            ) : parts.map((part) => (
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
            {data.onboarding ? (
              <div className="mt-8 space-y-6 border-t border-slate-200 pt-6" dir={data.dir === "rtl" ? "rtl" : "ltr"} lang={data.locale}>
                <section data-testid="team-package-request">
                  <h2 className="text-xl font-black">{data.onboarding.teamTitle}</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-700">{data.onboarding.teamIntro}</p>
                  <label className="mt-4 block text-sm font-bold">
                    {data.onboarding.teamAsk}
                    <input type="number" min={0} max={100} value={seats} onChange={(event) => setSeats(Number(event.target.value))} className="mt-1 w-28 rounded-xl border px-3 py-2" />
                  </label>
                  <div className="mt-3 text-sm leading-6">
                    <p>{data.onboarding.additionalRequested}: {seats}</p>
                    <p>{data.onboarding.packageLabel}: {seats <= 0 ? data.onboarding.noPackage : seats === 1 ? `1 ${data.onboarding.usersPackage}` : seats <= 4 ? `2–4 ${data.onboarding.usersPackage}` : seats <= 9 ? `5–9 ${data.onboarding.usersPackage}` : seats <= 19 ? `10–19 ${data.onboarding.usersPackage}` : data.onboarding.customPricing}</p>
                    <p>{data.onboarding.annualPrice}: {seats <= 0 ? data.onboarding.primaryOnly : seats === 1 ? "USD $250" : seats <= 4 ? "USD $700" : seats <= 9 ? "USD $1,300" : seats <= 19 ? "USD $2,200" : data.onboarding.contactRequired}</p>
                    <p>{data.onboarding.primaryIncluded}</p>
                    <p>{data.onboarding.totalUsers}: {seats + 1}</p>
                  </div>
                  <label className="mt-3 flex items-start gap-2 text-sm font-bold">
                    <input type="checkbox" checked={seatConfirmed} onChange={(event) => setSeatConfirmed(event.target.checked)} />
                    <span>{data.onboarding.teamConfirm}</span>
                  </label>
                  <button type="button" className="mt-3 rounded-xl bg-slate-900 px-4 py-2 text-sm font-black text-white" onClick={async () => {
                    setSeatMessage("");
                    try {
                      const res = await API.post(`/public/partner-agreement-sign/${token}/team-package`, { seats, confirmed: seatConfirmed });
                      setSeatMessage(res.data?.teamPackageRequest?.subPartnerPackageStatus || "");
                    } catch (err: unknown) {
                      const row = err as { response?: { data?: { error?: string } } };
                      setSeatMessage(row.response?.data?.error || "");
                    }
                  }}>{data.onboarding.submitRequest}</button>
                  {seatMessage ? <p className="mt-2 text-sm font-bold">{seatMessage}</p> : null}
                </section>
                <section data-testid="company-verification">
                  <h2 className="text-xl font-black">{data.onboarding.verifyTitle}</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-700">{data.onboarding.verifyIntro}</p>
                  <p className="mt-3 text-sm font-bold">{data.onboarding.registrationLabel}</p>
                  <input type="file" accept="application/pdf,image/jpeg,image/png" className="mt-1 text-sm" onChange={async (event) => {
                    const file = event.target.files?.[0];
                    if (!file) return;
                    const body = new FormData();
                    body.append("kind", "company_registration");
                    body.append("file", file);
                    await API.post(`/public/partner-agreement-sign/${token}/verification`, body);
                  }} />
                  <p className="mt-4 text-sm font-bold">{data.onboarding.showsSignatory}</p>
                  <div className="mt-2 flex gap-2">
                    <button type="button" className="rounded-xl border px-3 py-1 text-sm font-bold" onClick={async () => { setShowsSignatory(true); await API.post(`/public/partner-agreement-sign/${token}/verification`, { showsSignatory: true }); }}>{data.onboarding.yes}</button>
                    <button type="button" className="rounded-xl border px-3 py-1 text-sm font-bold" onClick={async () => { setShowsSignatory(false); await API.post(`/public/partner-agreement-sign/${token}/verification`, { showsSignatory: false }); }}>{data.onboarding.no}</button>
                  </div>
                  {showsSignatory === false || data.companyVerification?.registrationShowsSignatory === false ? (
                    <div className="mt-3">
                      <p className="text-sm font-bold">{data.onboarding.authorityLabel}</p>
                      <input type="file" accept="application/pdf,image/jpeg,image/png" className="mt-1 text-sm" onChange={async (event) => {
                        const file = event.target.files?.[0];
                        if (!file) return;
                        const body = new FormData();
                        body.append("kind", "signatory_authority");
                        body.append("file", file);
                        await API.post(`/public/partner-agreement-sign/${token}/verification`, body);
                      }} />
                    </div>
                  ) : null}
                  {data.companyVerification?.identityRequired ? (
                    <div className="mt-3">
                      <p className="text-sm font-bold">{data.onboarding.idLabel}</p>
                      <input type="file" accept="application/pdf,image/jpeg,image/png" className="mt-1 text-sm" onChange={async (event) => {
                        const file = event.target.files?.[0];
                        if (!file) return;
                        const body = new FormData();
                        body.append("kind", "personal_id");
                        body.append("file", file);
                        await API.post(`/public/partner-agreement-sign/${token}/verification`, body);
                      }} />
                    </div>
                  ) : null}
                </section>
              </div>
            ) : null}
          </article>
        ) : null}
      </div>
    </main>
  );
}
