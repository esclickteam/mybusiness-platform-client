import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import AdminHeader from "../AdminsHeader";
import CountrySelect from "./CountrySelect";
import {
  agreementError,
  downloadAgreementPdf,
  fetchAgreementMeta,
  fetchTerritoryAvailability,
  getPartnerAgreement,
  postAgreementAction,
  prefillAgreementPartner,
  quoteAgreementCommission,
  renewPartnerAgreement,
  savePartnerAgreement,
  searchAgreementPartners,
  type AgreementInput,
  type CommissionTier,
  type CountryOption,
  type PartnerAgreement,
} from "../../../lib/partnerAgreementApi";
import { EXCLUSIVITY_NOTICE } from "../../../lib/partnerAgreementRules";

const inputClass =
  "w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-semibold outline-none focus:border-violet-400";

const EMPTY: AgreementInput = {
  partnerId: "",
  agreementNumber: "",
  brandName: "",
  legalCompanyName: "",
  registrationNumber: "",
  registeredAddress: "",
  incorporationCountryCode: "",
  contactName: "",
  contactEmail: "",
  phone: "",
  whatsapp: "",
  signatoryName: "",
  signatoryTitle: "",
  signatoryEmail: "",
  agreementDate: "",
  countryCode: "",
  territoryName: "",
  territoryType: "non_exclusive",
  startDate: "",
  endDate: "",
  licenseTerm: "12 months",
  licenseFee: "",
  currency: "USD",
  paymentDueDate: "",
  commissionOverride: false,
  commissionPercents: [30, 35, 40],
  salesTarget: "",
  targetPeriod: "",
  renewalDate: "",
  renewalNotes: "",
  specialTermsEnabled: false,
  specialTerms: "",
};

function fromAgreement(row: PartnerAgreement): AgreementInput {
  return {
    partnerId: row.partnerId || "",
    agreementNumber: row.agreementNumber || "",
    brandName: row.brandName || "",
    legalCompanyName: row.legalCompanyName || "",
    registrationNumber: row.registrationNumber || "",
    registeredAddress: row.registeredAddress || "",
    incorporationCountryCode: row.incorporationCountryCode || "",
    contactName: row.contactName || "",
    contactEmail: row.contactEmail || "",
    phone: row.phone || "",
    whatsapp: row.whatsapp || "",
    signatoryName: row.signatoryName || "",
    signatoryTitle: row.signatoryTitle || "",
    signatoryEmail: row.signatoryEmail || "",
    agreementDate: row.agreementDate || "",
    countryCode: row.countryCode || "",
    territoryName: row.territoryName || "",
    territoryType: row.territoryType || "non_exclusive",
    startDate: row.startDate || "",
    endDate: row.endDate || "",
    licenseTerm: row.licenseTerm || "",
    licenseFee: row.licenseFee ?? "",
    currency: row.currency || "USD",
    paymentDueDate: row.paymentDueDate || "",
    commissionOverride: Boolean(row.commissionOverride),
    commissionPercents: row.commissionPercents?.length === 3 ? row.commissionPercents : [30, 35, 40],
    salesTarget: row.salesTarget || "",
    targetPeriod: row.targetPeriod || "",
    renewalDate: row.renewalDate || "",
    renewalNotes: row.renewalNotes || "",
    specialTermsEnabled: Boolean(row.specialTermsEnabled),
    specialTerms: row.specialTerms || "",
  };
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block text-sm font-bold text-slate-800">
      {label}
      <div className="mt-1 font-semibold">{children}</div>
    </label>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5">
      <h2 className="text-lg font-black text-slate-900">{title}</h2>
      <div className="mt-4 grid gap-3 md:grid-cols-2">{children}</div>
    </section>
  );
}

export default function AdminPartnerAgreementEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState<AgreementInput>(EMPTY);
  const [record, setRecord] = useState<PartnerAgreement | null>(null);
  const [countries, setCountries] = useState<CountryOption[]>([]);
  const [currencies, setCurrencies] = useState<string[]>(["USD"]);
  const [tiers, setTiers] = useState<CommissionTier[]>([]);
  const [partnerQuery, setPartnerQuery] = useState("");
  const [partners, setPartners] = useState<{ id: string; name: string; legalCompanyName: string }[]>([]);
  const [commissionNote, setCommissionNote] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [renewal, setRenewal] = useState({ startDate: "", endDate: "", agreementNumber: "" });
  const [quote, setQuote] = useState({ customers: "20", gross: "1000", taxes: "0", refunds: "0", chargebacks: "0", passThrough: "0", result: "" });

  const editable = !record || record.status === "draft" || record.status === "ready_for_review";
  const sampleRequested = !id && new URLSearchParams(window.location.search).get("sample") === "1";

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [meta, territories] = await Promise.all([fetchAgreementMeta(), fetchTerritoryAvailability()]);
        if (cancelled) return;
        setCurrencies(meta.currencies || ["USD"]);
        setTiers(meta.defaultTiers || []);
        setCountries(territories.countries || []);
        if (id) {
          const loaded = await getPartnerAgreement(id);
          if (cancelled) return;
          setRecord(loaded.agreement);
          setForm(fromAgreement(loaded.agreement));
        }
      } catch (err) {
        if (!cancelled) setError(agreementError(err, "Could not open the agreement."));
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  useEffect(() => {
    if (!sampleRequested) return;
    setForm({
      ...EMPTY,
      brandName: "Harbor Test Brand",
      legalCompanyName: "Harbor & Co. Test Partners Ltd",
      registrationNumber: "TEST-000",
      registeredAddress: "1 Test Quay, Example City",
      incorporationCountryCode: "MZ",
      contactName: "Test Contact",
      contactEmail: "harbor-test@example.com",
      phone: "+258000000",
      whatsapp: "+258000000",
      signatoryName: "Test Signatory",
      signatoryTitle: "Director",
      signatoryEmail: "signatory-test@example.com",
      agreementDate: "2026-01-15",
      countryCode: "MZ",
      territoryType: "exclusive",
      startDate: "2026-02-01",
      endDate: "2027-01-31",
      licenseTerm: "12 months",
      licenseFee: 12000,
      currency: "USD",
      paymentDueDate: "2026-02-15",
      salesTarget: "20 active paying customers",
      targetPeriod: "First 12 months",
      renewalDate: "2026-12-01",
      renewalNotes: "Continued exclusivity is subject to the customer target.",
      agreementNumber: "BPA-TEST-HARBOR",
    });
  }, [sampleRequested]);

  useEffect(() => {
    const handle = window.setTimeout(() => {
      if (partnerQuery.trim().length < 2) {
        setPartners([]);
        return;
      }
      searchAgreementPartners(partnerQuery.trim())
        .then((data) => setPartners(data.items || []))
        .catch(() => setPartners([]));
    }, 250);
    return () => window.clearTimeout(handle);
  }, [partnerQuery]);

  function set<K extends keyof AgreementInput>(key: K, value: AgreementInput[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  const selectedCountry = useMemo(
    () => countries.find((row) => row.countryCode === form.countryCode),
    [countries, form.countryCode]
  );

  async function choosePartner(partnerId: string) {
    setError("");
    const { prefill } = await prefillAgreementPartner(partnerId);
    setForm((current) => ({
      ...current,
      partnerId: prefill.partnerId,
      brandName: prefill.brandName,
      legalCompanyName: prefill.legalCompanyName,
      contactName: prefill.contactName,
      contactEmail: prefill.contactEmail,
      phone: prefill.phone,
      whatsapp: prefill.whatsapp,
      countryCode: prefill.countryCode || current.countryCode,
      territoryName: prefill.territoryName,
      territoryType: prefill.territoryType || current.territoryType,
      incorporationCountryCode: prefill.incorporationCountryCode || current.incorporationCountryCode,
      startDate: prefill.startDate || current.startDate,
      endDate: prefill.endDate || current.endDate,
    }));
    setCommissionNote(
      prefill.currentCustomCommissionPercent == null
        ? ""
        : `This partner profile has a custom commission of ${prefill.currentCustomCommissionPercent}%. This agreement still uses the 30/35/40 template unless you override the percentages.`
    );
    setPartnerQuery("");
    setPartners([]);
  }

  async function persist() {
    const saved = await savePartnerAgreement(id || null, form);
    setRecord(saved.agreement);
    setForm(fromAgreement(saved.agreement));
    if (!id) navigate(`/admin/partner-agreements/${saved.agreement.id}`, { replace: true });
    return saved.agreement;
  }

  async function onSave() {
    setBusy(true);
    setError("");
    setMessage("");
    try {
      await persist();
      setMessage("Draft saved. The territory is not reserved.");
    } catch (err) {
      setError(agreementError(err, "Could not save the draft."));
    } finally {
      setBusy(false);
    }
  }

  async function onPreview() {
    setBusy(true);
    setError("");
    try {
      const saved = editable ? await persist() : record;
      if (saved) navigate(`/admin/partner-agreements/${saved.id}/preview`);
    } catch (err) {
      setError(agreementError(err, "Could not open the preview."));
    } finally {
      setBusy(false);
    }
  }

  async function onPdf() {
    if (!record) return;
    setBusy(true);
    setError("");
    try {
      const blob = await downloadAgreementPdf(record.id, record.signedVersionNumber || undefined);
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Bizuply-Partner-Agreement-${record.agreementNumber}.pdf`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(agreementError(err, "Could not generate the PDF."));
    } finally {
      setBusy(false);
    }
  }

  async function run(action: "ready" | "send" | "sign" | "payment-pending" | "payment" | "activate" | "expire" | "terminate" | "cancel") {
    if (!record) return;
    setBusy(true);
    setError("");
    setMessage("");
    try {
      const result = await postAgreementAction(record.id, action, action === "payment" ? { reference: "Admin recorded" } : {});
      setRecord(result.agreement);
      setForm(fromAgreement(result.agreement));
      setMessage(result.message || `Status is now ${result.agreement.status.replace(/_/g, " ")}.`);
    } catch (err) {
      setError(agreementError(err, "Could not update the agreement."));
    } finally {
      setBusy(false);
    }
  }

  async function onRenew() {
    if (!record) return;
    setBusy(true);
    setError("");
    try {
      const result = await renewPartnerAgreement(record.id, renewal);
      navigate(`/admin/partner-agreements/${result.agreement.id}`);
    } catch (err) {
      setError(agreementError(err, "Could not renew the agreement."));
    } finally {
      setBusy(false);
    }
  }

  async function onQuote() {
    setError("");
    try {
      const result = await quoteAgreementCommission({
        commissionOverride: Boolean(form.commissionOverride),
        commissionPercents: form.commissionPercents || [30, 35, 40],
        activePayingCustomers: Number(quote.customers || 0),
        grossCollected: Number(quote.gross || 0),
        taxes: Number(quote.taxes || 0),
        refunds: Number(quote.refunds || 0),
        chargebacks: Number(quote.chargebacks || 0),
        passThroughUsage: Number(quote.passThrough || 0),
      });
      setQuote((current) => ({
        ...current,
        result: `${result.percent}% of ${result.commissionableRevenue} = ${result.amount}`,
      }));
    } catch (err) {
      setError(agreementError(err, "Could not calculate commission."));
    }
  }

  const status = record?.status || "draft";

  return (
    <div className="min-h-screen bg-[#F7F8FA]" dir="ltr">
      <AdminHeader />
      <main className="mx-auto max-w-[1100px] space-y-4 px-4 py-6" data-testid="partner-agreement-form">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <Link to="/admin/partner-agreements" className="text-sm font-black text-[#6D28D9]">
              Partner Agreements
            </Link>
            <h1 className="text-3xl font-black text-slate-900">{id ? "Agreement" : "Create agreement"}</h1>
            <p className="text-sm font-semibold text-slate-500">
              {record ? `${record.agreementNumber} · ${status.replace(/_/g, " ")} · version ${record.currentVersion || 0}` : "Fill the commercial details. The legal text stays in the template."}
            </p>
          </div>
        </div>
        {sampleRequested ? (
          <p className="rounded-2xl bg-amber-50 px-4 py-3 text-sm font-bold text-amber-950">
            Test sample only. Harbor & Co. is not a real partner and nothing has been saved.
          </p>
        ) : null}
        {error ? <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm font-bold text-rose-800">{error}</p> : null}
        {message ? <p className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-800">{message}</p> : null}

        <Section title="Partner">
          <div className="md:col-span-2">
            <Field label="Existing partner">
              <input
                value={partnerQuery}
                onChange={(event) => setPartnerQuery(event.target.value)}
                placeholder="Search by name or company"
                className={inputClass}
                disabled={!editable}
              />
              {partners.length > 0 ? (
                <div className="mt-1 rounded-2xl border border-slate-200 bg-white">
                  {partners.map((partner) => (
                    <button
                      key={partner.id}
                      type="button"
                      className="block w-full px-3 py-2 text-left text-sm font-bold hover:bg-violet-50"
                      onClick={() => void choosePartner(partner.id)}
                    >
                      {partner.name}
                      {partner.legalCompanyName ? ` · ${partner.legalCompanyName}` : ""}
                    </button>
                  ))}
                </div>
              ) : null}
            </Field>
          </div>
          <Field label="Partner / brand name">
            <input className={inputClass} disabled={!editable} value={form.brandName || ""} onChange={(e) => set("brandName", e.target.value)} />
          </Field>
          <Field label="Legal company name">
            <input className={inputClass} disabled={!editable} value={form.legalCompanyName || ""} onChange={(e) => set("legalCompanyName", e.target.value)} />
          </Field>
          <Field label="Registration number">
            <input className={inputClass} disabled={!editable} value={form.registrationNumber || ""} onChange={(e) => set("registrationNumber", e.target.value)} />
          </Field>
          <Field label="Country of incorporation">
            <CountrySelect
              id="incorporation-country"
              countries={countries}
              value={form.incorporationCountryCode || ""}
              disabled={!editable}
              onChange={(code) => set("incorporationCountryCode", code)}
            />
          </Field>
          <div className="md:col-span-2">
            <Field label="Registered address">
              <textarea className={inputClass} rows={2} disabled={!editable} value={form.registeredAddress || ""} onChange={(e) => set("registeredAddress", e.target.value)} />
            </Field>
          </div>
          <Field label="Main contact">
            <input className={inputClass} disabled={!editable} value={form.contactName || ""} onChange={(e) => set("contactName", e.target.value)} />
          </Field>
          <Field label="Contact email">
            <input className={inputClass} disabled={!editable} value={form.contactEmail || ""} onChange={(e) => set("contactEmail", e.target.value)} />
          </Field>
          <Field label="Phone">
            <input className={inputClass} disabled={!editable} value={form.phone || ""} onChange={(e) => set("phone", e.target.value)} />
          </Field>
          <Field label="WhatsApp">
            <input className={inputClass} disabled={!editable} value={form.whatsapp || ""} onChange={(e) => set("whatsapp", e.target.value)} />
          </Field>
          <Field label="Authorized signatory name">
            <input className={inputClass} disabled={!editable} value={form.signatoryName || ""} onChange={(e) => set("signatoryName", e.target.value)} />
          </Field>
          <Field label="Authorized signatory title">
            <input className={inputClass} disabled={!editable} value={form.signatoryTitle || ""} onChange={(e) => set("signatoryTitle", e.target.value)} />
          </Field>
          <Field label="Authorized signatory email">
            <input className={inputClass} disabled={!editable} value={form.signatoryEmail || ""} onChange={(e) => set("signatoryEmail", e.target.value)} />
          </Field>
        </Section>

        <Section title="Territory & Exclusivity">
          <Field label="Territory type">
            <select
              className={inputClass}
              disabled={!editable}
              value={form.territoryType || "non_exclusive"}
              onChange={(e) => set("territoryType", e.target.value as AgreementInput["territoryType"])}
            >
              <option value="non_exclusive">Non-exclusive</option>
              <option value="exclusive">Exclusive</option>
            </select>
          </Field>
          <Field label="Country / territory">
            <CountrySelect
              countries={countries}
              value={form.countryCode || ""}
              territoryType={form.territoryType || ""}
              blockExclusive
              disabled={!editable}
              onChange={(code) => set("countryCode", code)}
            />
          </Field>
          <div className="md:col-span-2">
            <Field label="Custom territory, if it is not the whole country">
              <input
                className={inputClass}
                disabled={!editable}
                placeholder="Leave blank for the whole country. Example: a province inside the selected country."
                value={form.territoryName || ""}
                onChange={(e) => set("territoryName", e.target.value)}
              />
            </Field>
          </div>
          {form.territoryType === "exclusive" ? (
            <div className="md:col-span-2 rounded-2xl bg-amber-50 px-4 py-3 text-sm font-bold text-amber-950" data-testid="exclusivity-notice">
              {EXCLUSIVITY_NOTICE}
              {selectedCountry && selectedCountry.selectableForExclusive === false ? (
                <span className="mt-1 block text-rose-800">
                  Exclusive — Unavailable. {selectedCountry.partnerName} · {selectedCountry.startDate} to {selectedCountry.endDate}
                </span>
              ) : (
                <span className="mt-1 block font-semibold text-amber-900">
                  A draft, a sent agreement, or interest from a prospect does not reserve this country.
                </span>
              )}
            </div>
          ) : null}
        </Section>

        <Section title="Commercial Terms">
          <Field label="Agreement date">
            <input type="date" className={inputClass} disabled={!editable} value={form.agreementDate || ""} onChange={(e) => set("agreementDate", e.target.value)} />
          </Field>
          <Field label="License term">
            <input className={inputClass} disabled={!editable} value={form.licenseTerm || ""} onChange={(e) => set("licenseTerm", e.target.value)} />
          </Field>
          <Field label="Agreement start date">
            <input type="date" className={inputClass} disabled={!editable} value={form.startDate || ""} onChange={(e) => set("startDate", e.target.value)} />
          </Field>
          <Field label="Agreement end date">
            <input type="date" className={inputClass} disabled={!editable} value={form.endDate || ""} onChange={(e) => set("endDate", e.target.value)} />
          </Field>
          <Field label="License fee">
            <input className={inputClass} disabled={!editable} value={form.licenseFee ?? ""} onChange={(e) => set("licenseFee", e.target.value)} />
          </Field>
          <Field label="Currency">
            <select className={inputClass} disabled={!editable} value={form.currency || "USD"} onChange={(e) => set("currency", e.target.value)}>
              {currencies.map((code) => (
                <option key={code} value={code}>{code}</option>
              ))}
            </select>
          </Field>
          <Field label="Payment due date">
            <input type="date" className={inputClass} disabled={!editable} value={form.paymentDueDate || ""} onChange={(e) => set("paymentDueDate", e.target.value)} />
          </Field>
          <Field label="Payment status">
            <input className={inputClass} disabled value={record?.paymentStatus || "unpaid"} />
          </Field>
        </Section>

        <Section title="Commission">
          <div className="md:col-span-2 space-y-2 text-sm font-semibold text-slate-700">
            <p>Default Partner Agreement template. Commission continues while the customer remains active and successfully paying.</p>
            {(tiers.length ? tiers : [
              { minCustomers: 1, maxCustomers: 19, percent: 30 },
              { minCustomers: 20, maxCustomers: 39, percent: 35 },
              { minCustomers: 40, maxCustomers: null, percent: 40 },
            ]).map((tier, index) => (
              <label key={tier.minCustomers} className="flex items-center justify-between gap-3 rounded-2xl bg-slate-50 px-3 py-2" data-testid={`commission-tier-${index}`}>
                <span>
                  {tier.maxCustomers == null ? `${tier.minCustomers}+` : `${tier.minCustomers}-${tier.maxCustomers}`} active paying customers
                </span>
                <input
                  type="number"
                  min={0}
                  max={100}
                  disabled={!editable || !form.commissionOverride}
                  value={form.commissionPercents?.[index] ?? tier.percent}
                  onChange={(event) => {
                    const next = [...(form.commissionPercents || [30, 35, 40])];
                    next[index] = Number(event.target.value);
                    set("commissionPercents", next);
                  }}
                  className="w-24 rounded-xl border border-slate-200 px-2 py-1 text-right font-black"
                />
              </label>
            ))}
            <label className="flex items-center gap-2 font-bold">
              <input
                type="checkbox"
                disabled={!editable}
                checked={Boolean(form.commissionOverride)}
                onChange={(event) => set("commissionOverride", event.target.checked)}
              />
              Override percentages for this agreement
            </label>
            {commissionNote ? <p className="text-amber-900">{commissionNote}</p> : null}
            <p>Taxes, refunds, chargebacks, and pass-through usage charges are excluded.</p>
            <div className="grid gap-2 md:grid-cols-3">
              {([
                ["customers", "Active paying customers"],
                ["gross", "Gross collected"],
                ["taxes", "Taxes"],
                ["refunds", "Refunds"],
                ["chargebacks", "Chargebacks"],
                ["passThrough", "Pass-through usage"],
              ] as const).map(([key, label]) => (
                <label key={key} className="text-xs font-black uppercase text-slate-500">
                  {label}
                  <input
                    className={`${inputClass} mt-1`}
                    value={quote[key]}
                    onChange={(event) => setQuote((current) => ({ ...current, [key]: event.target.value }))}
                  />
                </label>
              ))}
            </div>
            <button type="button" onClick={() => void onQuote()} className="rounded-xl bg-slate-900 px-3 py-2 text-sm font-black text-white">
              Calculate commission
            </button>
            {quote.result ? <p className="font-black" data-testid="commission-quote">{quote.result}</p> : null}
          </div>
        </Section>

        <Section title="Performance & Renewal">
          <Field label="Sales / customer target">
            <input className={inputClass} disabled={!editable} value={form.salesTarget || ""} onChange={(e) => set("salesTarget", e.target.value)} />
          </Field>
          <Field label="Target period">
            <input className={inputClass} disabled={!editable} value={form.targetPeriod || ""} onChange={(e) => set("targetPeriod", e.target.value)} />
          </Field>
          <Field label="Renewal date">
            <input type="date" className={inputClass} disabled={!editable} value={form.renewalDate || ""} onChange={(e) => set("renewalDate", e.target.value)} />
          </Field>
          <div className="md:col-span-2">
            <Field label="Renewal terms / notes">
              <textarea className={inputClass} rows={3} disabled={!editable} value={form.renewalNotes || ""} onChange={(e) => set("renewalNotes", e.target.value)} />
            </Field>
          </div>
          <p className="md:col-span-2 text-sm font-semibold text-slate-600">
            Continued exclusivity may be subject to the agreed commercial and performance conditions.
          </p>
        </Section>

        <Section title="Agreement">
          <Field label="Agreement number">
            <input className={inputClass} disabled={!editable} placeholder="Assigned on save if left blank" value={form.agreementNumber || ""} onChange={(e) => set("agreementNumber", e.target.value)} />
          </Field>
          <div className="md:col-span-2">
            <button
              type="button"
              className="rounded-xl border border-slate-300 px-3 py-2 text-sm font-black"
              onClick={() => set("specialTermsEnabled", !form.specialTermsEnabled)}
              disabled={!editable}
            >
              Edit special terms
            </button>
            {form.specialTermsEnabled ? (
              <textarea
                className={`${inputClass} mt-3`}
                rows={5}
                disabled={!editable}
                placeholder="Exceptional terms for this agreement only."
                value={form.specialTerms || ""}
                onChange={(e) => set("specialTerms", e.target.value)}
              />
            ) : (
              <p className="mt-2 text-sm font-semibold text-slate-500">The standard legal sections are not edited here.</p>
            )}
          </div>
        </Section>

        <div className="flex flex-wrap gap-2">
          <button type="button" disabled={busy || !editable} onClick={() => void onSave()} className="rounded-2xl bg-[#7C4DFF] px-4 py-2 text-sm font-black text-white disabled:opacity-50">Save draft</button>
          <button type="button" disabled={busy} onClick={() => void onPreview()} className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-black text-white disabled:opacity-50">Preview agreement</button>
          <button type="button" disabled={busy || !record} onClick={() => void onPdf()} className="rounded-2xl bg-white px-4 py-2 text-sm font-black text-slate-900 ring-1 ring-slate-200 disabled:opacity-50">Generate PDF</button>
          {status === "draft" ? <Action busy={busy} onClick={() => void run("ready")}>Ready for review</Action> : null}
          {status === "ready_for_review" ? <Action busy={busy} onClick={() => void run("send")}>Send for review</Action> : null}
          {status === "sent" ? <Action busy={busy} onClick={() => void run("sign")}>Mark signed</Action> : null}
          {status === "signed" ? <Action busy={busy} onClick={() => void run("payment-pending")}>Payment pending</Action> : null}
          {(status === "signed" || status === "payment_pending") && record?.paymentStatus !== "paid" ? (
            <Action busy={busy} onClick={() => void run("payment")}>Record payment</Action>
          ) : null}
          {(status === "signed" || status === "payment_pending") && record?.paymentStatus === "paid" ? (
            <Action busy={busy} onClick={() => void run("activate")}>Activate agreement</Action>
          ) : null}
          {status === "active" ? <Action busy={busy} onClick={() => void run("expire")}>Expire</Action> : null}
          {["active", "signed", "payment_pending", "sent"].includes(status) ? <Action busy={busy} onClick={() => void run("terminate")}>Terminate</Action> : null}
          {["draft", "ready_for_review", "sent", "signed", "payment_pending"].includes(status) && record ? (
            <Action busy={busy} onClick={() => void run("cancel")}>Cancel</Action>
          ) : null}
        </div>
        {status === "ready_for_review" ? (
          <p className="text-xs font-bold text-slate-500">Send for review marks the agreement as sent. No email is sent.</p>
        ) : null}

        {status === "active" ? (
          <section className="rounded-3xl border border-slate-200 bg-white p-5">
            <h2 className="text-lg font-black">Renew</h2>
            <p className="mt-1 text-sm font-semibold text-slate-600">
              Renewal activates the next term in the same step, so an exclusive country does not become available in between.
            </p>
            <div className="mt-3 grid gap-3 md:grid-cols-3">
              <input type="date" className={inputClass} value={renewal.startDate} onChange={(e) => setRenewal({ ...renewal, startDate: e.target.value })} />
              <input type="date" className={inputClass} value={renewal.endDate} onChange={(e) => setRenewal({ ...renewal, endDate: e.target.value })} />
              <input className={inputClass} placeholder="New agreement number" value={renewal.agreementNumber} onChange={(e) => setRenewal({ ...renewal, agreementNumber: e.target.value })} />
            </div>
            <button type="button" disabled={busy} onClick={() => void onRenew()} className="mt-3 rounded-2xl bg-[#7C4DFF] px-4 py-2 text-sm font-black text-white">Renew</button>
          </section>
        ) : null}

        {record?.history?.length ? (
          <section className="rounded-3xl border border-slate-200 bg-white p-5">
            <h2 className="text-lg font-black">History</h2>
            <ul className="mt-3 space-y-2 text-sm">
              {record.history.map((row, index) => (
                <li key={`${row.at}-${index}`} className="rounded-2xl bg-slate-50 px-3 py-2">
                  <span className="font-black">{row.action.replace(/_/g, " ")}</span>
                  <span className="text-slate-500"> · {row.fromStatus || "new"} → {row.toStatus}</span>
                  <p className="font-semibold text-slate-600">{row.note}</p>
                </li>
              ))}
            </ul>
            {record.versions?.length ? (
              <div className="mt-3 flex flex-wrap gap-2">
                {record.versions.map((version) => (
                  <Link
                    key={version.versionNumber}
                    className="rounded-full bg-violet-50 px-3 py-1 text-xs font-black text-[#6D28D9]"
                    to={`/admin/partner-agreements/${record.id}/preview?version=${version.versionNumber}`}
                  >
                    Version {version.versionNumber}{version.frozen ? " · signed" : ""}
                  </Link>
                ))}
              </div>
            ) : null}
          </section>
        ) : null}
      </main>
    </div>
  );
}

function Action({ children, onClick, busy }: { children: React.ReactNode; onClick: () => void; busy: boolean }) {
  return (
    <button type="button" disabled={busy} onClick={onClick} className="rounded-2xl bg-white px-4 py-2 text-sm font-black text-slate-900 ring-1 ring-slate-200 disabled:opacity-50">
      {children}
    </button>
  );
}
