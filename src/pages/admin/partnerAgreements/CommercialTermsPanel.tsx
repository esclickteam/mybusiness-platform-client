import React from "react";
import type { AgreementInput, CommissionTier } from "../../../lib/partnerAgreementApi";
import { fill } from "./partnerAgreementPageCopy.js";
import { usePartnerAgreementPage } from "./usePartnerAgreementPage";

const inputClass =
  "w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-semibold outline-none focus:border-violet-400";

const DEFAULT_TIERS: CommissionTier[] = [
  { minCustomers: 1, maxCustomers: 19, percent: 30 },
  { minCustomers: 20, maxCustomers: 39, percent: 35 },
  { minCustomers: 40, maxCustomers: null, percent: 40 },
];

const FIELDS = [
  "licenseFee",
  "currency",
  "paymentDueDate",
  "paymentSchedule",
  "depositAmount",
  "remainingBalance",
  "installmentCount",
  "installments",
  "commission",
  "minimumCustomerTarget",
  "performanceTarget",
  "measurementPeriod",
  "curePeriod",
  "licenseTerm",
  "startDate",
  "endDate",
  "renewalPrice",
  "renewalTerm",
  "territoryType",
  "specialTerms",
  "additionalAmounts",
] as const;

type FieldKey = (typeof FIELDS)[number];

type Props = {
  form: AgreementInput;
  set: (key: keyof AgreementInput, value: AgreementInput[keyof AgreementInput]) => void;
  editable: boolean;
  currencies: string[];
  onResetAll: () => void;
};

function modeOf(form: AgreementInput, key: FieldKey) {
  return form.fieldModes?.[key] === "custom" ? "custom" : "default";
}

function TermField({
  field,
  label,
  mode,
  editable,
  onMode,
  onReset,
  defaultText,
  labels,
  children,
}: {
  field: string;
  label: string;
  mode: "default" | "custom";
  editable: boolean;
  onMode: (mode: "default" | "custom") => void;
  onReset: () => void;
  defaultText: string;
  labels: { customTerm: string; useDefault: string; custom: string; reset: string };
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3" data-testid={`commercial-${field}`}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-black text-slate-900">{label}</p>
        {mode === "custom" ? (
          <span data-testid={`custom-badge-${field}`} className="rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-black uppercase tracking-wide text-amber-950">
            {labels.customTerm}
          </span>
        ) : null}
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-3 text-sm font-bold text-slate-700">
        <label className="inline-flex items-center gap-1">
          <input type="radio" name={`mode-${field}`} checked={mode === "default"} disabled={!editable} onChange={() => onMode("default")} />
          {labels.useDefault}
        </label>
        <label className="inline-flex items-center gap-1">
          <input type="radio" name={`mode-${field}`} checked={mode === "custom"} disabled={!editable} onChange={() => onMode("custom")} />
          {labels.custom}
        </label>
        {mode === "custom" ? (
          <button type="button" className="text-xs font-black text-[#6D28D9]" disabled={!editable} onClick={onReset}>
            {labels.reset}
          </button>
        ) : null}
      </div>
      <div className="mt-2">
        {mode === "custom" ? children : <p className="text-sm font-semibold text-slate-600">{defaultText}</p>}
      </div>
    </div>
  );
}

export default function CommercialTermsPanel({ form, set, editable, currencies, onResetAll }: Props) {
  function setMode(key: FieldKey, mode: "default" | "custom") {
    set("fieldModes", { ...(form.fieldModes || {}), [key]: mode });
  }

  function resetField(key: FieldKey) {
    setMode(key, "default");
  }

  const tiers = form.commissionTiers?.length ? form.commissionTiers : DEFAULT_TIERS;
  const structure = form.commissionStructure || "tiers";
  const { text, dir, locale } = usePartnerAgreementPage();
  const c = text.commercial;
  const labels = { customTerm: c.customTerm, useDefault: c.useDefault, custom: c.custom, reset: c.reset };

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5" data-testid="commercial-terms" dir={dir} lang={locale}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-black text-slate-900">{c.title}</h2>
          <p className="mt-1 max-w-3xl text-sm font-semibold text-slate-600">{c.help}</p>
        </div>
        <button
          type="button"
          disabled={!editable}
          onClick={onResetAll}
          className="rounded-2xl bg-slate-900 px-3 py-2 text-sm font-black text-white disabled:opacity-50"
          data-testid="reset-commercial-section"
        >
          {c.resetAll}
        </button>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <TermField field="licenseFee" label={c.licenseFee} mode={modeOf(form, "licenseFee")} editable={editable} onMode={(mode) => setMode("licenseFee", mode)} onReset={() => resetField("licenseFee")} labels={labels} defaultText={c.licenseFeeDefault}>
          <input className={inputClass} disabled={!editable} value={form.licenseFee ?? ""} onChange={(e) => set("licenseFee", e.target.value)} />
        </TermField>
        <TermField field="currency" label={c.currency} mode={modeOf(form, "currency")} editable={editable} onMode={(mode) => setMode("currency", mode)} onReset={() => resetField("currency")} labels={labels} defaultText="USD">
          <select className={inputClass} disabled={!editable} value={form.currency || "USD"} onChange={(e) => set("currency", e.target.value)}>
            {currencies.map((code) => <option key={code} value={code}>{code}</option>)}
          </select>
        </TermField>
        <TermField field="licenseTerm" label={c.duration} mode={modeOf(form, "licenseTerm")} editable={editable} onMode={(mode) => setMode("licenseTerm", mode)} onReset={() => resetField("licenseTerm")} labels={labels} defaultText={c.months12}>
          <input className={inputClass} disabled={!editable} value={form.licenseTerm || ""} onChange={(e) => set("licenseTerm", e.target.value)} />
        </TermField>
        <TermField field="paymentDueDate" label={c.paymentDue} mode={modeOf(form, "paymentDueDate")} editable={editable} onMode={(mode) => setMode("paymentDueDate", mode)} onReset={() => resetField("paymentDueDate")} labels={labels} defaultText={c.paymentDueDefault}>
          <input type="date" className={inputClass} disabled={!editable} value={form.paymentDueDate || ""} onChange={(e) => set("paymentDueDate", e.target.value)} />
        </TermField>
        <TermField field="startDate" label={c.start} mode={modeOf(form, "startDate")} editable={editable} onMode={(mode) => setMode("startDate", mode)} onReset={() => resetField("startDate")} labels={labels} defaultText={c.startDefault}>
          <input type="date" className={inputClass} disabled={!editable} value={form.startDate || ""} onChange={(e) => set("startDate", e.target.value)} />
        </TermField>
        <TermField field="endDate" label={c.end} mode={modeOf(form, "endDate")} editable={editable} onMode={(mode) => setMode("endDate", mode)} onReset={() => resetField("endDate")} labels={labels} defaultText={c.endDefault}>
          <input type="date" className={inputClass} disabled={!editable} value={form.endDate || ""} onChange={(e) => set("endDate", e.target.value)} />
        </TermField>
        <TermField field="paymentSchedule" label={c.schedule} mode={modeOf(form, "paymentSchedule")} editable={editable} onMode={(mode) => setMode("paymentSchedule", mode)} onReset={() => resetField("paymentSchedule")} labels={labels} defaultText={c.scheduleDefault}>
          <select className={inputClass} disabled={!editable} value={form.paymentSchedule || "single"} onChange={(e) => set("paymentSchedule", e.target.value)}>
            <option value="single">{c.single}</option>
            <option value="deposit_balance">{c.depositBalance}</option>
            <option value="installments">{c.installmentsOption}</option>
            <option value="custom">{c.customSchedule}</option>
          </select>
        </TermField>
        <TermField field="depositAmount" label={c.deposit} mode={modeOf(form, "depositAmount")} editable={editable} onMode={(mode) => setMode("depositAmount", mode)} onReset={() => resetField("depositAmount")} labels={labels} defaultText="0">
          <input className={inputClass} disabled={!editable} value={form.depositAmount ?? ""} onChange={(e) => set("depositAmount", e.target.value)} />
        </TermField>
        <TermField field="remainingBalance" label={c.remaining} mode={modeOf(form, "remainingBalance")} editable={editable} onMode={(mode) => setMode("remainingBalance", mode)} onReset={() => resetField("remainingBalance")} labels={labels} defaultText={c.remainingDefault}>
          <input className={inputClass} disabled={!editable} value={form.remainingBalance ?? ""} onChange={(e) => set("remainingBalance", e.target.value)} />
        </TermField>
        <TermField field="installmentCount" label={c.installmentCount} mode={modeOf(form, "installmentCount")} editable={editable} onMode={(mode) => setMode("installmentCount", mode)} onReset={() => resetField("installmentCount")} labels={labels} defaultText="1">
          <input className={inputClass} disabled={!editable} value={form.installmentCount ?? ""} onChange={(e) => set("installmentCount", e.target.value)} />
        </TermField>
      </div>

      <div className="mt-3">
        <TermField field="installments" label={c.installmentAmounts} mode={modeOf(form, "installments")} editable={editable} onMode={(mode) => setMode("installments", mode)} onReset={() => resetField("installments")} labels={labels} defaultText={c.installmentDefault}>
          <div className="space-y-2">
            {(form.installments || [{ label: fill(c.installmentName, { n: 1 }), amount: "", dueDate: "" }]).map((row, index) => (
              <div key={`installment-${index}`} className="grid gap-2 md:grid-cols-3">
                <input className={inputClass} disabled={!editable} value={row.label || ""} placeholder={c.label} aria-label={c.label} onChange={(e) => {
                  const next = [...(form.installments || [])];
                  next[index] = { ...row, label: e.target.value };
                  set("installments", next);
                }} />
                <input className={inputClass} disabled={!editable} value={row.amount ?? ""} placeholder={c.amount} aria-label={c.amount} onChange={(e) => {
                  const next = [...(form.installments || [])];
                  next[index] = { ...row, amount: e.target.value };
                  set("installments", next);
                }} />
                <input type="date" className={inputClass} disabled={!editable} value={row.dueDate || ""} onChange={(e) => {
                  const next = [...(form.installments || [])];
                  next[index] = { ...row, dueDate: e.target.value };
                  set("installments", next);
                }} />
              </div>
            ))}
            <button type="button" className="text-sm font-black text-[#6D28D9]" disabled={!editable} onClick={() => set("installments", [...(form.installments || []), { label: fill(c.installmentName, { n: (form.installments?.length || 0) + 1 }), amount: "", dueDate: "" }])}>
              {c.addInstallment}
            </button>
          </div>
        </TermField>
      </div>

      <div className="mt-3" data-testid="commission-section">
        <TermField field="commission" label={c.commission} mode={modeOf(form, "commission")} editable={editable} onMode={(mode) => setMode("commission", mode)} onReset={() => resetField("commission")} labels={labels} defaultText={c.commissionDefault}>
          <div className="space-y-2">
            <select className={inputClass} disabled={!editable} value={structure} onChange={(e) => set("commissionStructure", e.target.value as AgreementInput["commissionStructure"])}>
              <option value="tiers">{c.tiers}</option>
              <option value="flat">{c.flat}</option>
              <option value="product">{c.product}</option>
            </select>
            {structure === "flat" ? (
              <label className="block text-sm font-bold">
                {c.flatPercent}
                <input className={`${inputClass} mt-1`} disabled={!editable} value={form.flatCommissionPercent ?? ""} onChange={(e) => set("flatCommissionPercent", e.target.value)} />
              </label>
            ) : null}
            {structure === "product" ? (
              <div className="space-y-2">
                {(form.productCommissions || [{ name: "", percent: "" }]).map((row, index) => (
                  <div key={`product-${index}`} className="grid gap-2 md:grid-cols-2">
                    <input className={inputClass} disabled={!editable} placeholder={c.productName} aria-label={c.productName} value={row.name} onChange={(e) => {
                      const next = [...(form.productCommissions || [])];
                      next[index] = { ...row, name: e.target.value };
                      set("productCommissions", next);
                    }} />
                    <input className={inputClass} disabled={!editable} placeholder={c.percent} aria-label={c.percent} value={row.percent} onChange={(e) => {
                      const next = [...(form.productCommissions || [])];
                      next[index] = { ...row, percent: e.target.value };
                      set("productCommissions", next);
                    }} />
                  </div>
                ))}
                <button type="button" className="text-sm font-black text-[#6D28D9]" disabled={!editable} onClick={() => set("productCommissions", [...(form.productCommissions || []), { name: "", percent: "" }])}>
                  {c.addProduct}
                </button>
                <label className="block text-sm font-bold">
                  {c.fallback}
                  <input className={`${inputClass} mt-1`} disabled={!editable} value={form.flatCommissionPercent ?? ""} onChange={(e) => set("flatCommissionPercent", e.target.value)} />
                </label>
              </div>
            ) : null}
            {structure === "tiers" ? (
              <div className="space-y-2" data-testid="custom-commission-tiers">
                {tiers.map((tier, index) => (
                  <div key={`tier-${index}`} className="grid gap-2 md:grid-cols-3">
                    <input className={inputClass} disabled={!editable} value={tier.minCustomers} onChange={(e) => {
                      const next = tiers.map((row, rowIndex) => rowIndex === index ? { ...row, minCustomers: Number(e.target.value) } : row);
                      set("commissionTiers", next);
                    }} />
                    <input className={inputClass} disabled={!editable} placeholder={c.openEnded} aria-label={c.openEnded} value={tier.maxCustomers ?? ""} onChange={(e) => {
                      const next = tiers.map((row, rowIndex) => rowIndex === index ? { ...row, maxCustomers: e.target.value === "" ? null : Number(e.target.value) } : row);
                      set("commissionTiers", next);
                    }} />
                    <input className={inputClass} disabled={!editable} value={tier.percent} onChange={(e) => {
                      const next = tiers.map((row, rowIndex) => rowIndex === index ? { ...row, percent: Number(e.target.value) } : row);
                      set("commissionTiers", next);
                    }} />
                  </div>
                ))}
                <button type="button" className="text-sm font-black text-[#6D28D9]" disabled={!editable || tiers.length >= 8} onClick={() => set("commissionTiers", [...tiers, { minCustomers: (tiers[tiers.length - 1]?.maxCustomers || 0) + 1, maxCustomers: null, percent: 0 }])}>
                  {c.addTier}
                </button>
              </div>
            ) : null}
          </div>
        </TermField>
      </div>

      <div className="mt-3 grid gap-3 md:grid-cols-2">
        <TermField field="minimumCustomerTarget" label={c.minimum} mode={modeOf(form, "minimumCustomerTarget")} editable={editable} onMode={(mode) => setMode("minimumCustomerTarget", mode)} onReset={() => resetField("minimumCustomerTarget")} labels={labels} defaultText={c.minimumDefault}>
          <input className={inputClass} disabled={!editable} value={form.minimumCustomerTarget || ""} onChange={(e) => set("minimumCustomerTarget", e.target.value)} />
        </TermField>
        <TermField field="performanceTarget" label={c.performance} mode={modeOf(form, "performanceTarget")} editable={editable} onMode={(mode) => setMode("performanceTarget", mode)} onReset={() => resetField("performanceTarget")} labels={labels} defaultText={c.performanceDefault}>
          <input className={inputClass} disabled={!editable} value={form.salesTarget || ""} onChange={(e) => set("salesTarget", e.target.value)} />
        </TermField>
        <TermField field="measurementPeriod" label={c.period} mode={modeOf(form, "measurementPeriod")} editable={editable} onMode={(mode) => setMode("measurementPeriod", mode)} onReset={() => resetField("measurementPeriod")} labels={labels} defaultText={c.periodDefault}>
          <input className={inputClass} disabled={!editable} value={form.targetPeriod || ""} onChange={(e) => set("targetPeriod", e.target.value)} />
        </TermField>
        <TermField field="curePeriod" label={c.cure} mode={modeOf(form, "curePeriod")} editable={editable} onMode={(mode) => setMode("curePeriod", mode)} onReset={() => resetField("curePeriod")} labels={labels} defaultText={c.cureDefault}>
          <input className={inputClass} disabled={!editable} value={form.curePeriod || ""} onChange={(e) => set("curePeriod", e.target.value)} />
        </TermField>
        <TermField field="renewalPrice" label={c.renewalPrice} mode={modeOf(form, "renewalPrice")} editable={editable} onMode={(mode) => setMode("renewalPrice", mode)} onReset={() => resetField("renewalPrice")} labels={labels} defaultText={c.renewalPriceDefault}>
          <input className={inputClass} disabled={!editable} value={form.renewalPrice ?? ""} onChange={(e) => set("renewalPrice", e.target.value)} />
        </TermField>
        <TermField field="renewalTerm" label={c.renewalTerm} mode={modeOf(form, "renewalTerm")} editable={editable} onMode={(mode) => setMode("renewalTerm", mode)} onReset={() => resetField("renewalTerm")} labels={labels} defaultText={c.months12}>
          <input className={inputClass} disabled={!editable} value={form.renewalTerm || ""} onChange={(e) => set("renewalTerm", e.target.value)} />
        </TermField>
        <TermField field="territoryType" label={c.exclusivity} mode={modeOf(form, "territoryType")} editable={editable} onMode={(mode) => setMode("territoryType", mode)} onReset={() => { resetField("territoryType"); set("territoryType", "non_exclusive"); }} labels={labels} defaultText={c.nonExclusiveDefault}>
          <select className={inputClass} disabled={!editable} value={form.territoryType || "non_exclusive"} onChange={(e) => set("territoryType", e.target.value as AgreementInput["territoryType"])}>
            <option value="non_exclusive">{c.nonExclusive}</option>
            <option value="exclusive">{c.exclusive}</option>
          </select>
        </TermField>
      </div>

      <div className="mt-3">
        <TermField field="additionalAmounts" label={c.additional} mode={modeOf(form, "additionalAmounts")} editable={editable} onMode={(mode) => setMode("additionalAmounts", mode)} onReset={() => resetField("additionalAmounts")} labels={labels} defaultText={c.none}>
          <div className="space-y-2">
            {(form.additionalAmounts || []).map((row, index) => (
              <div key={`extra-${index}`} className="grid gap-2 md:grid-cols-2">
                <input className={inputClass} disabled={!editable} value={row.label || ""} placeholder={c.label} aria-label={c.label} onChange={(e) => {
                  const next = [...(form.additionalAmounts || [])];
                  next[index] = { ...row, label: e.target.value };
                  set("additionalAmounts", next);
                }} />
                <input className={inputClass} disabled={!editable} value={row.amount ?? ""} placeholder={c.amount} aria-label={c.amount} onChange={(e) => {
                  const next = [...(form.additionalAmounts || [])];
                  next[index] = { ...row, amount: e.target.value };
                  set("additionalAmounts", next);
                }} />
              </div>
            ))}
            <button type="button" className="text-sm font-black text-[#6D28D9]" disabled={!editable} onClick={() => set("additionalAmounts", [...(form.additionalAmounts || []), { label: "", amount: "" }])}>
              {c.addAmount}
            </button>
          </div>
        </TermField>
      </div>

      <div className="mt-3">
        <TermField field="specialTerms" label={c.special} mode={modeOf(form, "specialTerms")} editable={editable} onMode={(mode) => { setMode("specialTerms", mode); set("specialTermsEnabled", mode === "custom"); }} onReset={() => { resetField("specialTerms"); set("specialTermsEnabled", false); set("specialTerms", ""); }} labels={labels} defaultText={c.specialDefault}>
          <textarea className={inputClass} rows={4} disabled={!editable} value={form.specialTerms || ""} onChange={(e) => { set("specialTermsEnabled", true); set("specialTerms", e.target.value); }} />
        </TermField>
      </div>
    </section>
  );
}

export function resetCommercialModes(form: AgreementInput): AgreementInput {
  const fieldModes = Object.fromEntries(FIELDS.map((key) => [key, "default"])) as AgreementInput["fieldModes"];
  return {
    ...form,
    fieldModes,
    licenseFee: "",
    currency: "USD",
    licenseTerm: "12 months",
    paymentSchedule: "single",
    depositAmount: 0,
    remainingBalance: "",
    installmentCount: 1,
    installments: [],
    additionalAmounts: [],
    commissionStructure: "tiers",
    commissionTiers: DEFAULT_TIERS,
    commissionOverride: false,
    flatCommissionPercent: "",
    productCommissions: [],
    minimumCustomerTarget: "",
    salesTarget: "",
    targetPeriod: "",
    curePeriod: "30 days",
    renewalPrice: "",
    renewalTerm: "12 months",
    territoryType: "non_exclusive",
    specialTermsEnabled: false,
    specialTerms: "",
  };
}
