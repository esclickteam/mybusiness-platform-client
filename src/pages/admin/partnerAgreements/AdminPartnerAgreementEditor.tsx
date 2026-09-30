import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import AdminHeader from "../AdminsHeader";
import CountrySelect from "./CountrySelect";
import CommercialTermsPanel, { resetCommercialModes } from "./CommercialTermsPanel";
import SignatoriesPanel from "./SignatoriesPanel";
import { signatoryCopy } from "./signatoryCopy";
import {
  agreementError,
  amendPartnerAgreement,
  downloadAgreementPdf,
  fetchAgreementMeta,
  fetchSubdivisions,
  fetchTerritoryAvailability,
  getPartnerAgreement,
  postAgreementAction,
  prefillAgreementPartner,
  previewDraftAgreement,
  quoteAgreementCommission,
  renewPartnerAgreement,
  resendSignatoryLink,
  revokeSignatoryLink,
  savePartnerAgreement,
  searchAgreementPartners,
  type AgreementInput,
  type AgreementSignatory,
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
  entityType: "",
  taxNumber: "",
  locale: "en",
  bilingual: false,
  secondaryLocale: "",
  agreementDate: "",
  effectiveDate: "",
  countryCode: "",
  subdivisionCode: "",
  localityName: "",
  localityKind: "custom",
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
  curePeriod: "",
  adminNotes: "",
  renewalDate: "",
  renewalNotes: "",
  specialTermsEnabled: false,
  specialTerms: "",
  fieldModes: {},
  paymentSchedule: "single",
  depositAmount: 0,
  remainingBalance: "",
  installmentCount: 1,
  installments: [],
  additionalAmounts: [],
  commissionStructure: "tiers",
  commissionTiers: [
    { minCustomers: 1, maxCustomers: 19, percent: 30 },
    { minCustomers: 20, maxCustomers: 39, percent: 35 },
    { minCustomers: 40, maxCustomers: null, percent: 40 },
  ],
  flatCommissionPercent: "",
  productCommissions: [],
  minimumCustomerTarget: "",
  renewalPrice: "",
  renewalTerm: "12 months",
  signingMode: "parallel",
  signatories: [
    { party: "partner", fullName: "", title: "", email: "", phone: "", order: 1, required: true },
    { party: "bizuply", fullName: "", title: "", email: "", phone: "", order: 1, required: true },
  ],
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
    entityType: row.entityType || "",
    taxNumber: row.taxNumber || "",
    locale: row.locale || "en",
    bilingual: Boolean(row.bilingual),
    secondaryLocale: row.secondaryLocale || "",
    agreementDate: row.agreementDate || "",
    effectiveDate: row.effectiveDate || "",
    countryCode: row.countryCode || "",
    subdivisionCode: row.subdivisionCode || "",
    localityName: row.localityName || row.territoryName || "",
    localityKind: row.localityKind || "custom",
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
    curePeriod: row.curePeriod || "",
    adminNotes: row.adminNotes || "",
    renewalDate: row.renewalDate || "",
    renewalNotes: row.renewalNotes || "",
    specialTermsEnabled: Boolean(row.specialTermsEnabled),
    specialTerms: row.specialTerms || "",
    fieldModes: row.fieldModes || {},
    paymentSchedule: row.paymentSchedule || "single",
    depositAmount: row.depositAmount ?? 0,
    remainingBalance: row.remainingBalance ?? "",
    installmentCount: row.installmentCount ?? 1,
    installments: row.installments || [],
    additionalAmounts: row.additionalAmounts || [],
    commissionStructure: row.commissionStructure || (row.commissionOverride ? "tiers" : "tiers"),
    commissionTiers: row.tiers || [],
    flatCommissionPercent: row.flatCommissionPercent ?? "",
    productCommissions: row.productCommissions || [],
    minimumCustomerTarget: row.minimumCustomerTarget || "",
    renewalPrice: row.renewalPrice ?? "",
    renewalTerm: row.renewalTerm || "12 months",
    signingMode: row.signingMode || "parallel",
    signatories: row.signatories?.length
      ? row.signatories
      : [
          {
            party: "partner",
            fullName: row.signatoryName || "",
            title: row.signatoryTitle || "",
            email: row.signatoryEmail || "",
            phone: row.phone || "",
            order: 1,
            required: true,
          },
          { party: "bizuply", fullName: "", title: "", email: "", phone: "", order: 1, required: true },
        ],
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
  const [subdivisions, setSubdivisions] = useState<{ code: string; name: string }[]>([]);
  const [subdivisionKind, setSubdivisionKind] = useState("");
  const [currencies, setCurrencies] = useState<string[]>(["USD"]);
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
      signingMode: "parallel",
      signatories: [
        { party: "partner", fullName: "Test Signatory", title: "Director", email: "signatory-test@example.com", phone: "+258000000", order: 1, required: true },
        { party: "partner", fullName: "Second Test Signatory", title: "Manager", email: "second-signatory-test@example.com", phone: "+258000001", order: 2, required: true },
        { party: "bizuply", fullName: "", title: "", email: "", phone: "", order: 1, required: true },
      ],
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

  useEffect(() => {
    const code = form.countryCode || "";
    if (!code) {
      setSubdivisions([]);
      setSubdivisionKind("");
      return;
    }
    let cancelled = false;
    fetchSubdivisions(code)
      .then((data) => {
        if (cancelled) return;
        setSubdivisions(data.subdivisions || []);
        setSubdivisionKind(data.kind || "");
      })
      .catch(() => {
        if (!cancelled) {
          setSubdivisions([]);
          setSubdivisionKind("");
        }
      });
    return () => {
      cancelled = true;
    };
  }, [form.countryCode]);

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
      const preview = await previewDraftAgreement(form);
      if (preview.persisted) {
        setError("Preview was refused because it would save an agreement.");
        return;
      }
      sessionStorage.setItem("partner-agreement-unsaved-preview", JSON.stringify(preview));
      navigate("/admin/partner-agreements/preview");
    } catch (err) {
      setError(agreementError(err, "Could not open the preview."));
    } finally {
      setBusy(false);
    }
  }

  async function onAmend() {
    if (!record) return;
    setBusy(true);
    setError("");
    try {
      const created = await amendPartnerAgreement(record.id);
      navigate(`/admin/partner-agreements/${created.agreement.id}`);
    } catch (err) {
      setError(agreementError(err, "Could not create a new agreement version."));
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

  function onSignatories(signatories: AgreementSignatory[], mode: "parallel" | "sequential") {
    const primary = signatories.find((row) => row.party === "partner" && row.required !== false && row.fullName) || signatories.find((row) => row.party === "partner");
    setForm((current) => ({
      ...current,
      signatories,
      signingMode: mode,
      signatoryName: primary?.fullName || "",
      signatoryTitle: primary?.title || "",
      signatoryEmail: primary?.email || "",
    }));
  }

  async function onResend(signatoryId: string) {
    if (!record) return;
    setBusy(true);
    setError("");
    try {
      const link = await resendSignatoryLink(record.id, signatoryId);
      setMessage(`${signatoryCopy(form.locale).text.linkReady} ${link.path}`);
      const loaded = await getPartnerAgreement(record.id);
      setRecord(loaded.agreement);
      setForm(fromAgreement(loaded.agreement));
    } catch (err) {
      setError(agreementError(err, "Could not resend the signing link."));
    } finally {
      setBusy(false);
    }
  }

  async function onRevoke(signatoryId: string) {
    if (!record) return;
    setBusy(true);
    setError("");
    try {
      await revokeSignatoryLink(record.id, signatoryId);
      const loaded = await getPartnerAgreement(record.id);
      setRecord(loaded.agreement);
      setForm(fromAgreement(loaded.agreement));
    } catch (err) {
      setError(agreementError(err, "Could not revoke the signing link."));
    } finally {
      setBusy(false);
    }
  }

  async function onSignBizuply(signatory: AgreementSignatory) {
    if (!record || !signatory.signatoryId) return;
    const company = record.bizuplyLegalCompanyName || "";
    setBusy(true);
    setError("");
    try {
      const result = await postAgreementAction(record.id, "sign", {
        party: "bizuply",
        signatoryId: signatory.signatoryId,
        confirmed: true,
        method: "typed",
        typedName: signatory.fullName,
        confirmationText: `I am authorized to sign this agreement on behalf of ${company}.`,
      });
      setRecord(result.agreement);
      setForm(fromAgreement(result.agreement));
    } catch (err) {
      setError(agreementError(err, "Could not sign for Bizuply."));
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
    <div className="min-h-screen bg-[#F7F8FA]">
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
          <Field label="Entity type">
            <input className={inputClass} disabled={!editable} value={form.entityType || ""} onChange={(e) => set("entityType", e.target.value)} />
          </Field>
          <Field label="Tax / VAT number">
            <input className={inputClass} disabled={!editable} value={form.taxNumber || ""} onChange={(e) => set("taxNumber", e.target.value)} />
          </Field>
        </Section>

        <SignatoriesPanel
          locale={form.locale}
          signingMode={form.signingMode || "parallel"}
          signatories={form.signatories || []}
          editable={editable}
          locked={Boolean(record?.signatories?.some((row) => row.signedAt))}
          agreementId={record?.id}
          busy={busy}
          onChange={onSignatories}
          onResend={(signatoryId) => void onResend(signatoryId)}
          onRevoke={(signatoryId) => void onRevoke(signatoryId)}
          onSignBizuply={(signatory) => void onSignBizuply(signatory)}
        />
        {record?.signatureProgress ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-5" data-testid="signature-progress" dir={signatoryCopy(form.locale).dir}>
            <p className="text-sm font-black text-slate-900" data-testid="partner-signature-progress">
              {signatoryCopy(form.locale).text.partnerProgress}: {record.signatureProgress.partner.completed} of {record.signatureProgress.partner.required} {signatoryCopy(form.locale).text.completed}
            </p>
            <p className="mt-1 text-sm font-black text-slate-900" data-testid="bizuply-signature-progress">
              {signatoryCopy(form.locale).text.bizuplyProgress}: {record.signatureProgress.bizuply.completed} of {record.signatureProgress.bizuply.required} {signatoryCopy(form.locale).text.completed}
            </p>
            {record.signatureStatusLabel ? <p className="mt-2 text-sm font-bold text-[#6D28D9]">{record.signatureStatusLabel}</p> : null}
          </div>
        ) : null}

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
          <Field label={subdivisionLabel(subdivisionKind, form.countryCode || "")}>
            {subdivisions.length ? (
              <select
                className={inputClass}
                disabled={!editable}
                data-testid="subdivision-select"
                value={form.subdivisionCode || ""}
                onChange={(e) => set("subdivisionCode", e.target.value)}
              >
                <option value="">Whole country</option>
                {subdivisions.map((row) => (
                  <option key={row.code} value={row.code}>
                    {row.name}
                  </option>
                ))}
              </select>
            ) : (
              <p className="rounded-xl bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-600" data-testid="country-level-territory">
                This country is sold at country level. A state or province is not required.
              </p>
            )}
          </Field>
          <Field label="City / metro / custom territory">
            <select
              className={`${inputClass} mb-2`}
              disabled={!editable}
              data-testid="locality-kind"
              value={form.localityKind || "custom"}
              onChange={(e) => set("localityKind", e.target.value)}
            >
              <option value="city">City</option>
              <option value="metro">Metro</option>
              <option value="custom">Custom territory</option>
            </select>
            <input
              className={inputClass}
              disabled={!editable}
              placeholder="Optional. Example: Miami or South Florida"
              value={form.localityName || ""}
              onChange={(e) => {
                set("localityName", e.target.value);
                set("territoryName", e.target.value);
              }}
            />
          </Field>
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
          <Field label="Agreement language">
            <select className={inputClass} disabled={!editable} value={form.locale || "en"} onChange={(e) => set("locale", e.target.value)}>
              <option value="en">English</option>
              <option value="he">עברית</option>
              <option value="es">Español</option>
              <option value="pt-BR">Português (Brasil)</option>
              <option value="ar">العربية</option>
            </select>
          </Field>
          <Field label="Bilingual with">
            <select
              className={inputClass}
              disabled={!editable}
              value={form.bilingual ? form.secondaryLocale || "" : ""}
              onChange={(e) => {
                const value = e.target.value;
                set("bilingual", Boolean(value));
                set("secondaryLocale", value);
              }}
            >
              <option value="">One language</option>
              <option value="en">English</option>
              <option value="he">עברית</option>
              <option value="es">Español</option>
              <option value="pt-BR">Português (Brasil)</option>
              <option value="ar">العربية</option>
            </select>
          </Field>
          <Field label="Agreement date">
            <input type="date" className={inputClass} disabled={!editable} value={form.agreementDate || ""} onChange={(e) => set("agreementDate", e.target.value)} />
          </Field>
          <Field label="Payment status">
            <input className={inputClass} disabled value={record?.paymentStatus || "unpaid"} />
          </Field>
          <div className="md:col-span-2">
            <Field label="Renewal notes">
              <textarea className={inputClass} rows={3} disabled={!editable} value={form.renewalNotes || ""} onChange={(e) => set("renewalNotes", e.target.value)} />
            </Field>
          </div>
        </Section>

        <CommercialTermsPanel
          form={form}
          set={set}
          editable={editable}
          currencies={currencies}
          onResetAll={() => setForm((current) => resetCommercialModes(current))}
        />

        <section className="rounded-3xl border border-slate-200 bg-white p-5" data-testid="commission-quote-panel">
          <h2 className="text-lg font-black">Commission quote</h2>
          <p className="mt-1 text-sm font-semibold text-slate-600">This calculator does not save an agreement.</p>
          <div className="mt-3 grid gap-2 md:grid-cols-3">
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
                <input className={`${inputClass} mt-1`} value={quote[key]} onChange={(event) => setQuote((current) => ({ ...current, [key]: event.target.value }))} />
              </label>
            ))}
          </div>
          <button type="button" onClick={() => void onQuote()} className="mt-3 rounded-xl bg-slate-900 px-3 py-2 text-sm font-black text-white">
            Calculate commission
          </button>
          {quote.result ? <p className="mt-2 font-black" data-testid="commission-quote">{quote.result}</p> : null}
          {commissionNote ? <p className="mt-2 text-sm font-semibold text-amber-900">{commissionNote}</p> : null}
        </section>

        <Section title="Agreement">
          <Field label="Agreement number">
            <input className={inputClass} disabled={!editable} placeholder="Assigned on save if left blank" value={form.agreementNumber || ""} onChange={(e) => set("agreementNumber", e.target.value)} />
          </Field>
          <p className="text-sm font-semibold text-slate-500 md:col-span-2">Special commercial terms are set in the commercial section. The fixed legal sections are not edited here.</p>
        </Section>

        <div className="flex flex-wrap gap-2">
          <button type="button" disabled={busy || !editable} onClick={() => void onSave()} className="rounded-2xl bg-[#7C4DFF] px-4 py-2 text-sm font-black text-white disabled:opacity-50">Save draft</button>
          <button type="button" disabled={busy} onClick={() => void onPreview()} className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-black text-white disabled:opacity-50">Preview agreement</button>
          {!editable && record ? (
            <button type="button" disabled={busy} onClick={() => void onAmend()} className="rounded-2xl bg-amber-500 px-4 py-2 text-sm font-black text-white disabled:opacity-50" data-testid="new-agreement-version">
              New Agreement Version / Amendment
            </button>
          ) : null}
          <button type="button" disabled={busy || !record} onClick={() => void onPdf()} className="rounded-2xl bg-white px-4 py-2 text-sm font-black text-slate-900 ring-1 ring-slate-200 disabled:opacity-50">Generate PDF</button>
          {status === "draft" ? <Action busy={busy} onClick={() => void run("ready")}>Ready for review</Action> : null}
          {status === "ready_for_review" ? <Action busy={busy} onClick={() => void run("send")}>Send for review</Action> : null}
          {status === "sent" ? <Action busy={busy} onClick={() => void run("sign")}>Mark signed</Action> : null}
          {status === "signed" ? <Action busy={busy} onClick={() => void run("payment-pending")}>Payment pending</Action> : null}
          {["sent", "partially_signed", "partner_signed", "bizuply_signed", "payment_pending", "signed"].includes(status) && record?.paymentStatus !== "paid" ? (
            <Action busy={busy} onClick={() => void run("payment")}>Record payment</Action>
          ) : null}
          {status === "fully_signed" && record?.paymentStatus === "paid" ? (
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

        <section className="rounded-3xl border border-slate-200 bg-white p-5" data-testid="commercial-audit">
          <h2 className="text-lg font-black">Commercial audit</h2>
          <p className="mt-1 text-sm font-semibold text-slate-600">
            Manual overrides record the field, the previous value, the new value, the Admin, and the time. A signed version is not edited in place.
          </p>
          {record?.commercialAudit?.length ? (
            <ul className="mt-3 space-y-2 text-sm">
              {record.commercialAudit.map((row, index) => (
                <li key={`${row.field}-${row.at}-${index}`} className="rounded-2xl bg-slate-50 px-3 py-2" data-testid="audit-row">
                  <p className="font-black">{row.field}</p>
                  <p className="font-semibold text-slate-600">{row.previousValue} → {row.newValue}</p>
                  <p className="text-xs font-bold text-slate-500">{row.adminName || "Admin"} · {row.at ? new Date(row.at).toLocaleString() : ""}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-sm font-semibold text-slate-500">No manual commercial overrides have been saved on this agreement.</p>
          )}
        </section>

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

function subdivisionLabel(kind: string, countryCode = "") {
  if (countryCode === "US") return "State";
  if (countryCode === "CA") return "Province / territory";
  if (countryCode === "AU") return "State / territory";
  if (countryCode === "AE") return "Emirate";
  if (countryCode === "BR" || countryCode === "MX") return "State";
  if (countryCode === "IN") return "State / union territory";
  if (kind === "province") return "Province / territory";
  if (kind === "emirate") return "Emirate";
  if (kind === "state") return "State / territory";
  return "State / province / emirate / region";
}

function Action({ children, onClick, busy }: { children: React.ReactNode; onClick: () => void; busy: boolean }) {
  return (
    <button type="button" disabled={busy} onClick={onClick} className="rounded-2xl bg-white px-4 py-2 text-sm font-black text-slate-900 ring-1 ring-slate-200 disabled:opacity-50">
      {children}
    </button>
  );
}
