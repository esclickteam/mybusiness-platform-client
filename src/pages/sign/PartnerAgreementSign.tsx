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
  paymentState?: string;
  completion?: { title: string; message: string; signedAtLabel?: string; readOnly?: boolean } | null;
  presentationHtml?: string;
  onboarding?: Record<string, string>;
  teamPackages?: TeamPackage[];
  teamPackageRequest?: {
    requestedSubPartnerSeats?: number;
    requestedSubPartnerPackage?: string;
    packageLabel?: string;
    priceLabel?: string;
    paymentStatus?: string;
    subPartnerPackageStatus?: string;
  };
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

type TeamPackage = {
  tierKey: string;
  minUsers: number;
  maxUsers: number | null;
  annualPriceUsd: number | null;
  custom: boolean;
  label: string;
  priceLabel: string;
};

function quoteFor(seats: number, packages: TeamPackage[], copy: Record<string, string>) {
  if (!Number.isFinite(seats) || seats < 0 || seats > 500) return null;
  const count = Math.floor(seats);
  if (count === 0) {
    return {
      packageKey: "none",
      label: copy.noPackage || "No additional package",
      seats: 0,
      priceLabel: copy.priceZero || "USD $0",
      annualPrice: 0 as number | null,
    };
  }
  const tier = packages.find((row) => count >= row.minUsers && (row.maxUsers == null || count <= row.maxUsers));
  if (!tier) return null;
  return {
    packageKey: tier.custom ? "custom" : tier.tierKey,
    label: tier.label,
    seats: count,
    priceLabel: tier.priceLabel,
    annualPrice: tier.annualPriceUsd,
  };
}

function catalogFrom(copy: Record<string, string>, fromApi?: TeamPackage[]) {
  if (fromApi?.length) return fromApi;
  return [
    { tierKey: "1", minUsers: 1, maxUsers: 1, annualPriceUsd: 250, custom: false, label: copy.package1 || "1 Additional User", priceLabel: "USD $250" },
    { tierKey: "2-4", minUsers: 2, maxUsers: 4, annualPriceUsd: 700, custom: false, label: copy.package2 || "2–4 Additional Users", priceLabel: "USD $700" },
    { tierKey: "5-9", minUsers: 5, maxUsers: 9, annualPriceUsd: 1300, custom: false, label: copy.package5 || "5–9 Additional Users", priceLabel: "USD $1,300" },
    { tierKey: "10-19", minUsers: 10, maxUsers: 19, annualPriceUsd: 2200, custom: false, label: copy.package10 || "10–19 Additional Users", priceLabel: "USD $2,200" },
    { tierKey: "20+", minUsers: 20, maxUsers: null, annualPriceUsd: null, custom: true, label: copy.package20 || "20 or more Additional Users", priceLabel: copy.priceCustom || "Custom pricing — approval required" },
  ];
}

function fillConfirm(template: string, quote: { label: string; seats: number; priceLabel: string }) {
  return template
    .replace("{package}", quote.label)
    .replace("{seats}", String(quote.seats))
    .replace("{price}", quote.priceLabel);
}

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
            {data.completion ? (
              <section className="mb-4 rounded-2xl bg-emerald-50 px-4 py-3" data-testid="signature-completed">
                <h1 className="text-2xl font-black">{data.completion.title}</h1>
                <p className="mt-1 text-sm font-semibold text-emerald-950">{data.completion.message}</p>
              </section>
            ) : (
              <h1 className="text-2xl font-black">{copy.viewAgreement}</h1>
            )}
            <p className="mt-1 text-sm font-semibold text-slate-500">{data.agreementNumber}</p>
            <p className="mt-2 text-sm font-black" data-testid="partner-signature-status">
              Signatures: {data.signatureStatus === "fully_signed" ? "Fully Signed" : data.signatureStatus === "awaiting_signatures" ? "Signature pending" : "Partially signed"}
            </p>
            <p className="text-sm font-black" data-testid="partner-payment-status">
              Payment: {data.paymentState === "paid" ? "Paid" : data.paymentState === "payment_pending" ? "Pending" : "Unpaid"}
            </p>
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
              <section className="mt-4 space-y-1 text-sm font-semibold" data-testid="saved-team-request">
                <p>{copy.quotePackage}: {data.teamPackageRequest?.packageLabel || copy.noPackage}</p>
                <p>{copy.quoteRequested}: {data.teamPackageRequest?.requestedSubPartnerSeats ?? 0}</p>
                <p>{copy.quotePrice}: {data.teamPackageRequest?.priceLabel || copy.priceZero}</p>
                <p>{copy.quotePrimary}: {copy.quotePrimaryValue}</p>
                <p>{data.teamPackageRequest?.paymentStatus || copy.noPackage}</p>
              </section>
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
              <TeamUsersStep
                copy={copy}
                packages={catalogFrom(copy, data.teamPackages)}
                seats={seats}
                confirmed={seatConfirmed}
                onSeats={(value) => {
                  setSeats(value);
                  setSeatConfirmed(false);
                }}
                onConfirmed={setSeatConfirmed}
                onBack={() => setStep(2)}
                onContinue={async (quote) => {
                  await API.post(`/public/partner-agreement-sign/${token}/team-package`, {
                    seats: quote.seats,
                    confirmed: true,
                    packageKey: quote.packageKey,
                    annualPrice: quote.annualPrice,
                  });
                  setStep(4);
                }}
              />
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

function TeamUsersStep({
  copy,
  packages,
  seats,
  confirmed,
  onSeats,
  onConfirmed,
  onBack,
  onContinue,
}: {
  copy: Record<string, string>;
  packages: TeamPackage[];
  seats: number;
  confirmed: boolean;
  onSeats: (value: number) => void;
  onConfirmed: (value: boolean) => void;
  onBack: () => void;
  onContinue: (quote: { packageKey: string; seats: number; annualPrice: number | null }) => Promise<void>;
}) {
  const quote = quoteFor(seats, packages, copy);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  return (
    <section className="mt-4" data-testid="team-package-request">
      <h2 className="text-xl font-black">{copy.stepTeam}</h2>
      <p className="mt-2 text-sm leading-6">{copy.teamIntro}</p>
      <label className="mt-3 block text-sm font-bold">
        {copy.teamAsk}
        <input
          type="number"
          min={0}
          max={500}
          value={seats}
          data-testid="additional-users"
          onChange={(event) => onSeats(Number(event.target.value))}
          className="mt-1 w-28 rounded-xl border px-3 py-2"
        />
      </label>
      {quote ? (
        <dl className="mt-4 space-y-2 rounded-2xl bg-slate-50 p-4 text-sm" data-testid="team-quote">
          <div className="flex justify-between gap-4">
            <dt className="font-bold text-slate-500">{copy.quotePackage || "Package"}</dt>
            <dd className="font-black" data-testid="quote-package">{quote.label}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="font-bold text-slate-500">{copy.quoteRequested || "Requested Users"}</dt>
            <dd className="font-black" data-testid="quote-seats">{quote.seats}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="font-bold text-slate-500">{copy.quotePrice || "Annual Package Price"}</dt>
            <dd className="font-black" data-testid="quote-price">{quote.priceLabel}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="font-bold text-slate-500">{copy.quotePrimary || "Primary Partner Account"}</dt>
            <dd className="font-black">{copy.quotePrimaryValue || "Included separately"}</dd>
          </div>
          <p className="pt-1 text-xs font-semibold text-slate-500">{copy.separatePayment}</p>
        </dl>
      ) : null}
      <ul className="mt-4 space-y-1 text-sm" data-testid="package-catalog">
        <li className="font-black">{copy.availablePackages || "Available packages"}</li>
        <li className={quote?.packageKey === "none" ? "font-black text-[#6D28D9]" : "font-semibold text-slate-600"}>
          {copy.noPackage || "No additional package"} — {copy.priceZero || "USD $0"}
        </li>
        {packages.map((row) => (
          <li key={row.tierKey} className={quote?.packageKey === (row.custom ? "custom" : row.tierKey) ? "font-black text-[#6D28D9]" : "font-semibold text-slate-600"}>
            {row.label} — {row.priceLabel}
          </li>
        ))}
      </ul>
      {quote ? (
        <label className="mt-4 flex items-start gap-2 text-sm font-bold">
          <input type="checkbox" checked={confirmed} data-testid="confirm-package" onChange={(event) => onConfirmed(event.target.checked)} />
          <span>
            {fillConfirm(
              copy.teamConfirm?.includes("{package}")
                ? copy.teamConfirm
                : "I confirm the package {package} for {seats} additional users at {price}. The Primary Partner account is included separately. This request does not activate additional users or charge payment.",
              quote,
            )}
          </span>
        </label>
      ) : null}
      {saveError ? <p className="mt-2 text-sm font-bold text-rose-700">{saveError}</p> : null}
      <div className="mt-4 flex gap-2">
        <button type="button" className="rounded-2xl border px-4 py-2 text-sm font-black" onClick={onBack}>{copy.back}</button>
        <button
          type="button"
          disabled={!quote || !confirmed || saving}
          className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-black text-white disabled:opacity-40"
          onClick={async () => {
            if (!quote) return;
            setSaving(true);
            setSaveError("");
            try {
              await onContinue(quote);
            } catch {
              setSaveError(copy.separatePayment || "The request could not be saved.");
            } finally {
              setSaving(false);
            }
          }}
        >
          {copy.continue}
        </button>
      </div>
    </section>
  );
}
