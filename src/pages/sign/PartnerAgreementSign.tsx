import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../../api";
import logo from "../../images/logo_final.svg";
import SignaturePad from "../../components/SignaturePad";

type Preview = {
  agreementNumber: string;
  locale: string;
  dir?: string;
  partnerLegalCompanyName: string;
  confirmationText: string;
  alreadySigned?: boolean;
  portalMode?: boolean;
  signatureStatus?: string;
  presentationHtml?: string;
  onboarding?: Record<string, string>;
  teamPackageRequest?: { requestedSubPartnerSeats?: number; subPartnerPackageStatus?: string };
  companyVerification?: {
    status?: string;
    registrationShowsSignatory?: boolean | null;
    hasRegistration?: boolean;
    hasAuthority?: boolean;
    identityRequired?: boolean;
  };
  activationAnnex?: {
    status?: string;
    lines?: Record<string, string>;
    startDate?: string | null;
    endDate?: string | null;
    renewalDeadline?: string | null;
    readOnly?: boolean;
  };
  partnerSignatureTimeline?: { legalName: string; title: string; signedAt?: string; timeZone?: string; localDate?: string; localTime?: string }[];
};

function localStamp() {
  const now = new Date();
  return {
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone || "",
    localDate: now.toLocaleDateString(),
    localTime: now.toLocaleTimeString(),
  };
}

export default function PartnerAgreementSign() {
  const { token = "" } = useParams();
  const [data, setData] = useState<Preview | null>(null);
  const [error, setError] = useState("");
  const [step, setStep] = useState(1);
  const [reviewed, setReviewed] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [signature, setSignature] = useState("");
  const [seats, setSeats] = useState(0);
  const [seatConfirmed, setSeatConfirmed] = useState(false);
  const [portalTab, setPortalTab] = useState("agreement");

  async function load() {
    const res = await API.get(`/public/partner-agreement-sign/${token}`);
    setData(res.data);
    if (res.data?.alreadySigned || res.data?.portalMode) setStep(5);
  }

  useEffect(() => {
    load().catch(() => setError("This signing link is not valid."));
  }, [token]);

  const copy = data?.onboarding || {};
  const dir = data?.dir === "rtl" ? "rtl" : "ltr";
  const verification = data?.companyVerification || {};
  const authorityRequired = verification.registrationShowsSignatory === false;
  const documentsReady = Boolean(verification.hasRegistration) && (!authorityRequired || verification.hasAuthority);
  const checklist = [
    [reviewed, copy.checklistReview],
    [verification.hasRegistration, copy.checklistRegistration],
    [!authorityRequired || verification.hasAuthority, authorityRequired ? copy.checklistAuthority : ""],
    [confirmed, copy.checklistConfirm],
    [Boolean(signature), copy.checklistSignature],
  ].filter((row) => row[1]);

  async function upload(kind: string, file: File) {
    const body = new FormData();
    body.append("kind", kind);
    body.append("file", file);
    await API.post(`/public/partner-agreement-sign/${token}/verification`, body);
    await load();
  }

  async function submitSignature(event: React.FormEvent) {
    event.preventDefault();
    if (!data || !documentsReady || !confirmed || !signature || !reviewed) return;
    setError("");
    try {
      await API.post(`/public/partner-agreement-sign/${token}`, {
        confirmed,
        method: "drawn",
        imageDataUrl: signature,
        confirmationText: data.confirmationText,
        ...localStamp(),
      });
      await load();
      setStep(5);
    } catch (err: unknown) {
      const row = err as { response?: { data?: { error?: string } } };
      setError(row.response?.data?.error || "Could not submit the signature.");
    }
  }

  const portal = step === 5 || data?.portalMode || data?.alreadySigned;

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-8" dir={dir} lang={data?.locale || "en"}>
      <div className="mx-auto max-w-3xl">
        <img src={logo} alt="Bizuply" className="mb-4 h-8" />
        {error ? <p className="mb-4 rounded-2xl bg-rose-50 px-4 py-3 text-sm font-bold text-rose-800">{error}</p> : null}
        {!data ? null : portal ? (
          <article className="rounded-3xl bg-white p-6 shadow-sm" data-testid="agreement-portal">
            <h1 className="text-2xl font-black">{copy.viewAgreement}</h1>
            <p className="mt-1 text-sm font-semibold text-slate-500">{data.agreementNumber}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {([
                ["agreement", copy.portalAgreement],
                ["documents", copy.portalDocuments],
                ["annex", copy.portalAnnex],
                ["team", copy.portalTeam],
              ] as const).map(([id, label]) => (
                <button key={id} type="button" onClick={() => setPortalTab(id)} className={`rounded-full px-3 py-1.5 text-sm font-black ${portalTab === id ? "bg-slate-900 text-white" : "bg-slate-100"}`}>
                  {label}
                </button>
              ))}
            </div>
            {portalTab === "agreement" ? (
              <div className="mt-4">
                <div data-testid="partner-signature-timeline" className="mb-4 space-y-2">
                  {(data.partnerSignatureTimeline || []).map((row) => (
                    <p key={`${row.legalName}-${row.signedAt}`} className="text-sm font-semibold">
                      {row.legalName} · {row.title}
                      <br />
                      {row.localDate} {row.localTime} · {row.timeZone}
                    </p>
                  ))}
                </div>
                {data.presentationHtml ? <iframe title={data.agreementNumber} className="h-[70vh] w-full rounded-2xl border" srcDoc={data.presentationHtml} /> : null}
              </div>
            ) : null}
            {portalTab === "documents" ? (
              <p className="mt-4 text-sm font-semibold">{verification.status || copy.pending}</p>
            ) : null}
            {portalTab === "annex" ? (
              <section className="mt-4 space-y-1 text-sm font-semibold" data-testid="activation-annex">
                <h2 className="text-xl font-black">{copy.annexTitle}</h2>
                <p>{data.activationAnnex?.status === "completed" ? copy.annexCompleted : copy.annexInProgress}</p>
                <p>{copy.paymentInitiated}: {data.activationAnnex?.lines?.paymentInitiated === "pending" ? copy.pending : data.activationAnnex?.lines?.paymentInitiated}</p>
                <p>{copy.paymentReceived}: {data.activationAnnex?.lines?.paymentReceived === "pending" ? copy.pending : data.activationAnnex?.lines?.paymentReceived}</p>
                <p>{copy.verificationApproved}: {data.activationAnnex?.lines?.verification === "pending" ? copy.pending : data.activationAnnex?.lines?.verification}</p>
                <p>{copy.partnerActivated}: {data.activationAnnex?.lines?.partnerActivated === "pending" ? copy.pending : data.activationAnnex?.lines?.partnerActivated}</p>
                <p>{copy.agreementStart}: {data.activationAnnex?.startDate?.slice(0, 10) || copy.pending}</p>
                <p>{copy.agreementEnd}: {data.activationAnnex?.endDate?.slice(0, 10) || copy.pending}</p>
                <p>{copy.renewalDeadline}: {data.activationAnnex?.renewalDeadline?.slice(0, 10) || copy.pending}</p>
              </section>
            ) : null}
            {portalTab === "team" ? (
              <p className="mt-4 text-sm font-semibold">
                {copy.additionalRequested}: {data.teamPackageRequest?.requestedSubPartnerSeats ?? 0} · {data.teamPackageRequest?.subPartnerPackageStatus || "none"}
              </p>
            ) : null}
          </article>
        ) : (
          <article className="rounded-3xl bg-white p-6 shadow-sm" data-testid="signing-steps">
            <p className="text-xs font-black uppercase text-slate-400">{data.agreementNumber}</p>
            <ol className="mt-3 flex flex-wrap gap-2 text-sm font-black">
              {[copy.stepReview, copy.stepDocuments, copy.stepTeam, copy.stepSign].map((label, index) => (
                <li key={label} className={step === index + 1 ? "text-[#6D28D9]" : "text-slate-400"}>{index + 1}. {label}</li>
              ))}
            </ol>
            {step === 1 ? (
              <section className="mt-4">
                {data.presentationHtml ? <iframe title={data.agreementNumber} className="h-[70vh] w-full rounded-2xl border" srcDoc={data.presentationHtml} /> : null}
                <button type="button" className="mt-4 rounded-2xl bg-slate-900 px-4 py-2 text-sm font-black text-white" onClick={() => { setReviewed(true); setStep(2); }}>{copy.continue}</button>
              </section>
            ) : null}
            {step === 2 ? (
              <section className="mt-4" data-testid="company-verification">
                <h2 className="text-xl font-black">{copy.stepDocuments}</h2>
                {verification.hasRegistration ? <p className="mt-2 text-sm font-bold text-emerald-800">{copy.documentsSubmitted || "Company Registration — Already submitted"}</p> : (
                  <label className="mt-3 block cursor-pointer rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center">
                    <p className="text-sm font-black">{copy.registrationLabel}</p>
                    <p className="mt-1 text-xs font-semibold text-slate-500">PDF, JPEG, or PNG up to 8 MB</p>
                    <input type="file" accept="application/pdf,image/jpeg,image/png" className="mt-3 text-sm" onChange={(event) => { const file = event.target.files?.[0]; if (file) void upload("company_registration", file); }} />
                  </label>
                )}
                <p className="mt-4 text-sm font-bold">{copy.showsSignatory}</p>
                <div className="mt-2 flex gap-2">
                  <button type="button" className="rounded-xl border px-3 py-1 text-sm font-bold" onClick={async () => { await API.post(`/public/partner-agreement-sign/${token}/verification`, { showsSignatory: true }); await load(); }}>{copy.yes}</button>
                  <button type="button" className="rounded-xl border px-3 py-1 text-sm font-bold" onClick={async () => { await API.post(`/public/partner-agreement-sign/${token}/verification`, { showsSignatory: false }); await load(); }}>{copy.no}</button>
                </div>
                {authorityRequired && !verification.hasAuthority ? (
                  <div className="mt-3">
                    <p className="text-sm font-bold">{copy.authorityLabel}</p>
                    <input type="file" accept="application/pdf,image/jpeg,image/png" className="mt-1 text-sm" onChange={(event) => { const file = event.target.files?.[0]; if (file) void upload("signatory_authority", file); }} />
                  </div>
                ) : null}
                <div className="mt-4 flex gap-2">
                  <button type="button" className="rounded-2xl border px-4 py-2 text-sm font-black" onClick={() => setStep(1)}>{copy.back}</button>
                  <button type="button" disabled={!documentsReady} className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-black text-white disabled:opacity-40" onClick={() => setStep(3)}>{copy.continue}</button>
                </div>
              </section>
            ) : null}
            {step === 3 ? (
              <section className="mt-4" data-testid="team-package-request">
                <h2 className="text-xl font-black">{copy.stepTeam}</h2>
                <p className="mt-2 text-sm leading-6">{copy.teamIntro}</p>
                <label className="mt-3 block text-sm font-bold">
                  {copy.teamAsk}
                  <input type="number" min={0} value={seats} onChange={(event) => setSeats(Number(event.target.value))} className="mt-1 w-28 rounded-xl border px-3 py-2" />
                </label>
                <label className="mt-3 flex items-start gap-2 text-sm font-bold">
                  <input type="checkbox" checked={seatConfirmed} onChange={(event) => setSeatConfirmed(event.target.checked)} />
                  <span>{copy.teamConfirm}</span>
                </label>
                <div className="mt-4 flex gap-2">
                  <button type="button" className="rounded-2xl border px-4 py-2 text-sm font-black" onClick={() => setStep(2)}>{copy.back}</button>
                  <button type="button" disabled={!seatConfirmed} className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-black text-white disabled:opacity-40" onClick={async () => {
                    await API.post(`/public/partner-agreement-sign/${token}/team-package`, { seats, confirmed: true });
                    setStep(4);
                  }}>{copy.continue}</button>
                </div>
              </section>
            ) : null}
            {step === 4 ? (
              <form className="mt-4 space-y-3" onSubmit={submitSignature}>
                <ul className="space-y-1 text-sm font-semibold">
                  {checklist.map(([ok, label]) => (
                    <li key={String(label)}>{ok ? "✓" : "•"} {label}</li>
                  ))}
                </ul>
                <label className="flex items-start gap-2 text-sm font-bold">
                  <input type="checkbox" checked={confirmed} onChange={(event) => setConfirmed(event.target.checked)} />
                  <span>{data.confirmationText}</span>
                </label>
                <SignaturePad label={copy.drawSignature || "Draw your signature"} clearLabel={copy.clearSignature || "Clear"} onChange={setSignature} />
                <div className="flex gap-2">
                  <button type="button" className="rounded-2xl border px-4 py-2 text-sm font-black" onClick={() => setStep(3)}>{copy.back}</button>
                  <button type="submit" disabled={!documentsReady || !confirmed || !signature || !reviewed} className="rounded-2xl bg-[#6D28D9] px-4 py-2 text-sm font-black text-white disabled:opacity-40">{copy.submitSignature}</button>
                </div>
              </form>
            ) : null}
          </article>
        )}
      </div>
    </main>
  );
}
