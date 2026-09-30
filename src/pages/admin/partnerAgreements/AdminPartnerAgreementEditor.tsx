import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import AdminHeader from "../AdminsHeader";
import API from "../../../api";
import CountrySelect from "./CountrySelect";
import CommercialTermsPanel, { resetCommercialModes } from "./CommercialTermsPanel";
import SignatoriesPanel from "./SignatoriesPanel";
import { agreementActionLabel, agreementStatusLabel, fill, subdivisionLabel } from "./partnerAgreementPageCopy.js";
import { usePartnerAgreementPage } from "./usePartnerAgreementPage";
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
  createSignedPartnerAgreement,
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
  paymentStructure: "one_time",
  paymentMethod: "",
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
    paymentStructure: row.paymentStructure || (row.paymentSchedule === "installments" ? "installments" : "one_time"),
    paymentMethod: row.paymentMethod || "",
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
  const page = usePartnerAgreementPage();
  const t = page.text.editor;
  const c = page.text.commercial;
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
  const [legalCompanyName, setLegalCompanyName] = useState("BizUply LLC");
  const [bizSignature, setBizSignature] = useState<{ typedName: string; confirmed: boolean } | null>(null);
  const [signName, setSignName] = useState("");
  const [signConfirmed, setSignConfirmed] = useState(false);
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
        if (!cancelled) setError(agreementError(err, t.openError));
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id, t.openError]);

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
    API.get("/admin/legal-profile")
      .then((res) => {
        const profile = res.data?.profile || {};
        if (profile.legalCompanyName) setLegalCompanyName(profile.legalCompanyName);
        if (profile.signatoryName) {
          setSignName((current) => current || profile.signatoryName);
          setForm((current) => {
            const rows = current.signatories?.length ? [...current.signatories] : [];
            const index = rows.findIndex((row) => row.party === "bizuply");
            if (index < 0 || rows[index].fullName) return current;
            rows[index] = {
              ...rows[index],
              fullName: profile.signatoryName,
              title: profile.signatoryTitle || rows[index].title,
              email: profile.signatoryEmail || rows[index].email,
            };
            return { ...current, signatories: rows };
          });
        }
      })
      .catch(() => undefined);
  }, []);

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
        : fill(t.customCommission, { percent: prefill.currentCustomCommissionPercent })
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

  async function onCreateSigned() {
    if (!bizSignature?.confirmed || !bizSignature.typedName) {
      setError("Sign as Bizuply before creating the agreement.");
      return;
    }
    setBusy(true);
    setError("");
    setMessage("");
    try {
      const preview = await previewDraftAgreement(form);
      if (preview.persisted) {
        setError(t.previewRefused);
        return;
      }
      if (preview.issues?.length) {
        setError(preview.issues.map((issue) => issue.message || issue.field).filter(Boolean).join(" "));
        return;
      }
      const saved = await createSignedPartnerAgreement({
        ...form,
        previewHash: preview.documentHash || "",
        bizuplySignature: {
          confirmed: true,
          method: "typed",
          typedName: bizSignature.typedName,
          confirmationText: `I confirm that I am authorized to sign this Agreement on behalf of ${legalCompanyName}.`,
        },
      });
      sessionStorage.removeItem("partner-agreement-pending-bizuply-signature");
      setRecord(saved.agreement);
      setForm(fromAgreement(saved.agreement));
      setMessage("Signed agreement created. Bizuply is signed. Partner signature is pending. Generate signing links when you are ready.");
      if (saved.agreement?.id) navigate(`/admin/partner-agreements/${saved.agreement.id}`, { replace: true });
    } catch (err) {
      setError(agreementError(err, "Could not create the signed agreement."));
    } finally {
      setBusy(false);
    }
  }

  async function onSave() {
    setBusy(true);
    setError("");
    setMessage("");
    try {
      await persist();
      setMessage(t.saved);
    } catch (err) {
      setError(agreementError(err, t.saveError));
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
        setError(t.previewRefused);
        return;
      }
      sessionStorage.setItem("partner-agreement-unsaved-preview", JSON.stringify(preview));
      sessionStorage.setItem("partner-agreement-pending-bizuply-signature", JSON.stringify(bizSignature));
      navigate("/admin/partner-agreements/preview");
    } catch (err) {
      setError(agreementError(err, t.previewError));
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
      setError(agreementError(err, t.amendError));
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
      setError(agreementError(err, t.pdfError));
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
      setMessage(fill(t.statusNow, { status: agreementStatusLabel(result.agreement.status, page.text) }));
    } catch (err) {
      setError(agreementError(err, t.updateError));
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
      setMessage(`${page.text.sign.linkReady} ${link.path}`);
      const loaded = await getPartnerAgreement(record.id);
      setRecord(loaded.agreement);
      setForm(fromAgreement(loaded.agreement));
    } catch (err) {
      setError(agreementError(err, t.resendError));
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
      setError(agreementError(err, t.revokeError));
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
      setError(agreementError(err, t.signError));
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
      setError(agreementError(err, t.renewError));
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
      setError(agreementError(err, t.quoteError));
    }
  }

  const status = record?.status || "draft";

  return (
    <div className="min-h-screen bg-[#F7F8FA]">
      <AdminHeader />
      <main className="mx-auto max-w-[1100px] space-y-4 px-4 py-6" data-testid="partner-agreement-form" dir={page.dir} lang={page.locale}>
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <Link to="/admin/partner-agreements" className="text-sm font-black text-[#6D28D9]">
              {t.back}
            </Link>
            <h1 className="text-3xl font-black text-slate-900">{id ? t.agreement : t.create}</h1>
            <p className="text-sm font-semibold text-slate-500">
              {record ? fill(t.meta, { number: record.agreementNumber, status: agreementStatusLabel(status, page.text), version: record.currentVersion || 0 }) : t.fill}
            </p>
          </div>
        </div>
        {sampleRequested ? (
          <p className="rounded-2xl bg-amber-50 px-4 py-3 text-sm font-bold text-amber-950">
            {t.sample}
          </p>
        ) : null}
        {error ? <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm font-bold text-rose-800">{error}</p> : null}
        {message ? <p className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-800">{message}</p> : null}

        <Section title={t.partner}>
          <div className="md:col-span-2">
            <Field label={t.existingPartner}>
              <input
                value={partnerQuery}
                onChange={(event) => setPartnerQuery(event.target.value)}
                placeholder={t.searchPartner}
                className={inputClass}
                disabled={!editable}
              />
              {partners.length > 0 ? (
                <div className="mt-1 rounded-2xl border border-slate-200 bg-white">
                  {partners.map((partner) => (
                    <button
                      key={partner.id}
                      type="button"
                      className="block w-full px-3 py-2 text-start text-sm font-bold hover:bg-violet-50"
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
          <Field label={t.brand}>
            <input className={inputClass} disabled={!editable} value={form.brandName || ""} onChange={(e) => set("brandName", e.target.value)} />
          </Field>
          <Field label={t.legal}>
            <input className={inputClass} disabled={!editable} value={form.legalCompanyName || ""} onChange={(e) => set("legalCompanyName", e.target.value)} />
          </Field>
          <Field label={t.registration}>
            <input className={inputClass} disabled={!editable} value={form.registrationNumber || ""} onChange={(e) => set("registrationNumber", e.target.value)} />
          </Field>
          <Field label={t.incorporation}>
            <CountrySelect
              id="incorporation-country"
              countries={countries}
              value={form.incorporationCountryCode || ""}
              disabled={!editable}
              onChange={(code) => set("incorporationCountryCode", code)}
            />
          </Field>
          <div className="md:col-span-2">
            <Field label={t.address}>
              <textarea className={inputClass} rows={2} disabled={!editable} value={form.registeredAddress || ""} onChange={(e) => set("registeredAddress", e.target.value)} />
            </Field>
          </div>
          <Field label={t.contact}>
            <input className={inputClass} disabled={!editable} value={form.contactName || ""} onChange={(e) => set("contactName", e.target.value)} />
          </Field>
          <Field label={t.contactEmail}>
            <input className={inputClass} disabled={!editable} value={form.contactEmail || ""} onChange={(e) => set("contactEmail", e.target.value)} />
          </Field>
          <Field label={t.phone}>
            <input className={inputClass} disabled={!editable} value={form.phone || ""} onChange={(e) => set("phone", e.target.value)} />
          </Field>
          <Field label={t.whatsapp}>
            <input className={inputClass} disabled={!editable} value={form.whatsapp || ""} onChange={(e) => set("whatsapp", e.target.value)} />
          </Field>
          <Field label={t.entity}>
            <input className={inputClass} disabled={!editable} value={form.entityType || ""} onChange={(e) => set("entityType", e.target.value)} />
          </Field>
          <Field label={t.tax}>
            <input className={inputClass} disabled={!editable} value={form.taxNumber || ""} onChange={(e) => set("taxNumber", e.target.value)} />
          </Field>
        </Section>

        <SignatoriesPanel
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
          <div className="rounded-3xl border border-slate-200 bg-white p-5" data-testid="signature-progress" dir={page.dir}>
            <p className="text-sm font-black text-slate-900" data-testid="partner-signature-progress">
              {page.text.sign.partnerProgress}: {record.signatureProgress.partner.completed} {page.text.sign.of} {record.signatureProgress.partner.required} {page.text.sign.completed}
            </p>
            <p className="mt-1 text-sm font-black text-slate-900" data-testid="bizuply-signature-progress">
              {page.text.sign.bizuplyProgress}: {record.signatureProgress.bizuply.completed} {page.text.sign.of} {record.signatureProgress.bizuply.required} {page.text.sign.completed}
            </p>
            {record.signatureStatus || record.signatureStatusLabel ? (
              <p className="mt-2 text-sm font-bold text-[#6D28D9]">{agreementStatusLabel(record.signatureStatus || record.status, page.text) || record.signatureStatusLabel}</p>
            ) : null}
          </div>
        ) : null}

        <Section title={t.territory}>
          <Field label={t.territoryType}>
            <select
              className={inputClass}
              disabled={!editable}
              value={form.territoryType || "non_exclusive"}
              onChange={(e) => set("territoryType", e.target.value as AgreementInput["territoryType"])}
            >
              <option value="non_exclusive">{c.nonExclusive}</option>
              <option value="exclusive">{c.exclusive}</option>
            </select>
          </Field>
          <Field label={t.country}>
            <CountrySelect
              countries={countries}
              value={form.countryCode || ""}
              territoryType={form.territoryType || ""}
              blockExclusive
              disabled={!editable}
              onChange={(code) => set("countryCode", code)}
            />
          </Field>
          <Field label={subdivisionLabel(subdivisionKind, form.countryCode || "", page.text)}>
            {subdivisions.length ? (
              <select
                className={inputClass}
                disabled={!editable}
                data-testid="subdivision-select"
                value={form.subdivisionCode || ""}
                onChange={(e) => set("subdivisionCode", e.target.value)}
              >
                <option value="">{t.wholeCountry}</option>
                {subdivisions.map((row) => (
                  <option key={row.code} value={row.code}>
                    {row.name}
                  </option>
                ))}
              </select>
            ) : (
              <p className="rounded-xl bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-600" data-testid="country-level-territory">
                {t.countryLevel}
              </p>
            )}
          </Field>
          <Field label={t.locality}>
            <select
              className={`${inputClass} mb-2`}
              disabled={!editable}
              data-testid="locality-kind"
              value={form.localityKind || "custom"}
              onChange={(e) => set("localityKind", e.target.value)}
            >
              <option value="city">{t.city}</option>
              <option value="metro">{t.metro}</option>
              <option value="custom">{t.customTerritory}</option>
            </select>
            <input
              className={inputClass}
              disabled={!editable}
              placeholder={t.localityPlaceholder}
              value={form.localityName || ""}
              onChange={(e) => {
                set("localityName", e.target.value);
                set("territoryName", e.target.value);
              }}
            />
          </Field>
          {form.territoryType === "exclusive" ? (
            <div className="md:col-span-2 rounded-2xl bg-amber-50 px-4 py-3 text-sm font-bold text-amber-950" data-testid="exclusivity-notice">
              {t.exclusivity}
              {selectedCountry && selectedCountry.selectableForExclusive === false ? (
                <span className="mt-1 block text-rose-800">
                  {fill(t.exclusiveTaken, { name: selectedCountry.partnerName, start: selectedCountry.startDate, end: selectedCountry.endDate })}
                </span>
              ) : (
                <span className="mt-1 block font-semibold text-amber-900">
                  {t.draftNoReserve}
                </span>
              )}
            </div>
          ) : null}
        </Section>

        <Section title={t.commercial}>
          <Field label={t.language}>
            <select className={inputClass} disabled={!editable} value={form.locale || "en"} onChange={(e) => set("locale", e.target.value)}>
              <option value="en">English</option>
              <option value="he">עברית</option>
              <option value="es">Español</option>
              <option value="pt-BR">Português (Brasil)</option>
              <option value="ar">العربية</option>
            </select>
          </Field>
          <Field label={t.bilingual}>
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
              <option value="">{t.oneLanguage}</option>
              <option value="en">English</option>
              <option value="he">עברית</option>
              <option value="es">Español</option>
              <option value="pt-BR">Português (Brasil)</option>
              <option value="ar">العربية</option>
            </select>
          </Field>
          <Field label={t.agreementDate}>
            <input type="date" className={inputClass} disabled={!editable} value={form.agreementDate || ""} onChange={(e) => set("agreementDate", e.target.value)} />
          </Field>
          <Field label={t.paymentStatus}>
            <input className={inputClass} disabled value={agreementStatusLabel(record?.paymentStatus || "unpaid", page.text)} />
          </Field>
          <div className="md:col-span-2">
            <Field label={t.renewalNotes}>
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
          <h2 className="text-lg font-black">{t.quoteTitle}</h2>
          <p className="mt-1 text-sm font-semibold text-slate-600">{t.quoteHelp}</p>
          <div className="mt-3 grid gap-2 md:grid-cols-3">
            {([
              ["customers", t.customers],
              ["gross", t.gross],
              ["taxes", t.taxes],
              ["refunds", t.refunds],
              ["chargebacks", t.chargebacks],
              ["passThrough", t.passThrough],
            ] as const).map(([key, label]) => (
              <label key={key} className="text-xs font-black uppercase text-slate-500">
                {label}
                <input className={`${inputClass} mt-1`} value={quote[key]} onChange={(event) => setQuote((current) => ({ ...current, [key]: event.target.value }))} />
              </label>
            ))}
          </div>
          <button type="button" onClick={() => void onQuote()} className="mt-3 rounded-xl bg-slate-900 px-3 py-2 text-sm font-black text-white">
            {t.calculate}
          </button>
          {quote.result ? <p className="mt-2 font-black" data-testid="commission-quote">{quote.result}</p> : null}
          {commissionNote ? <p className="mt-2 text-sm font-semibold text-amber-900">{commissionNote}</p> : null}
        </section>

        <Section title={t.agreementSection}>
          <Field label={t.agreementNumber}>
            <input className={inputClass} disabled={!editable} placeholder={t.numberPlaceholder} value={form.agreementNumber || ""} onChange={(e) => set("agreementNumber", e.target.value)} />
          </Field>
          <p className="text-sm font-semibold text-slate-500 md:col-span-2">{t.specialNote}</p>
        </Section>

        {!record ? (
          <section className="rounded-3xl border border-slate-200 bg-white p-5" data-testid="sign-before-create">
            <h2 className="text-lg font-black">Sign as Bizuply</h2>
            <p className="mt-1 text-sm font-semibold text-slate-600">
              The signature stays on this screen until you create the agreement. Creation binds it to the immutable document hash.
            </p>
            <label className="mt-3 block text-sm font-bold text-slate-800">
              Typed signature
              <input className={`${inputClass} mt-1`} value={signName} onChange={(e) => { setSignName(e.target.value); setBizSignature(null); }} />
            </label>
            <label className="mt-3 flex items-start gap-2 text-sm font-semibold text-slate-800">
              <input type="checkbox" className="mt-1" checked={signConfirmed} onChange={(e) => { setSignConfirmed(e.target.checked); setBizSignature(null); }} />
              <span>I confirm that I am authorized to sign this Agreement on behalf of {legalCompanyName}.</span>
            </label>
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-black text-white disabled:opacity-50"
                disabled={!signConfirmed || !signName.trim()}
                onClick={() => setBizSignature({ typedName: signName.trim(), confirmed: true })}
              >
                Sign as Bizuply
              </button>
              <button type="button" disabled={busy || !bizSignature} onClick={() => void onCreateSigned()} className="rounded-2xl bg-[#7C4DFF] px-4 py-2 text-sm font-black text-white disabled:opacity-50">
                Create Signed Agreement
              </button>
            </div>
            {bizSignature ? <p className="mt-2 text-sm font-bold text-emerald-800">Bizuply signature ready: {bizSignature.typedName}</p> : null}
          </section>
        ) : null}

        <div className="flex flex-wrap gap-2">
          <button type="button" disabled={busy || !editable} onClick={() => void onSave()} className="rounded-2xl bg-[#7C4DFF] px-4 py-2 text-sm font-black text-white disabled:opacity-50">{t.save}</button>
          <button type="button" disabled={busy} onClick={() => void onPreview()} className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-black text-white disabled:opacity-50">{t.preview}</button>
          {!editable && record ? (
            <button type="button" disabled={busy} onClick={() => void onAmend()} className="rounded-2xl bg-amber-500 px-4 py-2 text-sm font-black text-white disabled:opacity-50" data-testid="new-agreement-version">
              {t.newVersion}
            </button>
          ) : null}
          <button type="button" disabled={busy || !record} onClick={() => void onPdf()} className="rounded-2xl bg-white px-4 py-2 text-sm font-black text-slate-900 ring-1 ring-slate-200 disabled:opacity-50">{t.pdf}</button>
          {status === "draft" ? <Action busy={busy} onClick={() => void run("ready")}>{t.ready}</Action> : null}
          {status === "ready_for_review" ? <Action busy={busy} onClick={() => void run("send")}>{t.send}</Action> : null}
          {status === "sent" ? <Action busy={busy} onClick={() => void run("sign")}>{t.markSigned}</Action> : null}
          {status === "signed" ? <Action busy={busy} onClick={() => void run("payment-pending")}>{t.paymentPending}</Action> : null}
          {["sent", "partially_signed", "partner_signed", "bizuply_signed", "payment_pending", "signed"].includes(status) && record?.paymentStatus !== "paid" ? (
            <Action busy={busy} onClick={() => void run("payment")}>{t.recordPayment}</Action>
          ) : null}
          {status === "fully_signed" && record?.paymentStatus === "paid" ? (
            <Action busy={busy} onClick={() => void run("activate")}>{t.activate}</Action>
          ) : null}
          {status === "active" ? <Action busy={busy} onClick={() => void run("expire")}>{t.expire}</Action> : null}
          {["active", "signed", "payment_pending", "sent"].includes(status) ? <Action busy={busy} onClick={() => void run("terminate")}>{t.terminate}</Action> : null}
          {["draft", "ready_for_review", "sent", "signed", "payment_pending"].includes(status) && record ? (
            <Action busy={busy} onClick={() => void run("cancel")}>{t.cancel}</Action>
          ) : null}
        </div>
        {status === "ready_for_review" ? (
          <p className="text-xs font-bold text-slate-500">{t.sendNote}</p>
        ) : null}

        {status === "active" ? (
          <section className="rounded-3xl border border-slate-200 bg-white p-5">
            <h2 className="text-lg font-black">{t.renewTitle}</h2>
            <p className="mt-1 text-sm font-semibold text-slate-600">{t.renewHelp}</p>
            <div className="mt-3 grid gap-3 md:grid-cols-3">
              <input type="date" className={inputClass} value={renewal.startDate} onChange={(e) => setRenewal({ ...renewal, startDate: e.target.value })} />
              <input type="date" className={inputClass} value={renewal.endDate} onChange={(e) => setRenewal({ ...renewal, endDate: e.target.value })} />
              <input className={inputClass} placeholder={t.newNumber} value={renewal.agreementNumber} onChange={(e) => setRenewal({ ...renewal, agreementNumber: e.target.value })} />
            </div>
            <button type="button" disabled={busy} onClick={() => void onRenew()} className="mt-3 rounded-2xl bg-[#7C4DFF] px-4 py-2 text-sm font-black text-white">{t.renew}</button>
          </section>
        ) : null}

        <section className="rounded-3xl border border-slate-200 bg-white p-5" data-testid="commercial-audit">
          <h2 className="text-lg font-black">{t.audit}</h2>
          <p className="mt-1 text-sm font-semibold text-slate-600">{t.auditHelp}</p>
          {record?.commercialAudit?.length ? (
            <ul className="mt-3 space-y-2 text-sm">
              {record.commercialAudit.map((row, index) => (
                <li key={`${row.field}-${row.at}-${index}`} className="rounded-2xl bg-slate-50 px-3 py-2" data-testid="audit-row">
                  <p className="font-black">{row.field}</p>
                  <p className="font-semibold text-slate-600">{row.previousValue} → {row.newValue}</p>
                  <p className="text-xs font-bold text-slate-500">{row.adminName || t.admin} · {row.at ? new Date(row.at).toLocaleString() : ""}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-sm font-semibold text-slate-500">{t.noAudit}</p>
          )}
        </section>

        {record?.history?.length ? (
          <section className="rounded-3xl border border-slate-200 bg-white p-5">
            <h2 className="text-lg font-black">{t.history}</h2>
            <ul className="mt-3 space-y-2 text-sm">
              {record.history.map((row, index) => (
                <li key={`${row.at}-${index}`} className="rounded-2xl bg-slate-50 px-3 py-2">
                  <span className="font-black">{agreementActionLabel(row.action, page.text)}</span>
                  <span className="text-slate-500"> · {agreementStatusLabel(row.fromStatus || "new", page.text)} → {agreementStatusLabel(row.toStatus, page.text)}</span>
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
                    {fill(version.frozen ? t.versionSigned : t.version, { version: version.versionNumber })}
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
