import React, { useEffect, useMemo, useState } from "react";
import adminCrmApi from "../../../../api/adminCrmApi";
import { AdminModal } from "../AdminModal";
import { PrimaryButton, SecondaryButton } from "../AdminCrmUi";
import ProposalDocumentView from "./ProposalDocumentView";
import { heLabel, heLabels } from "./proposalLabels";

type CatalogItem = {
  sku: string;
  nameHe: string;
  category: string;
  categoryLabel: string;
  billing: string;
  billingLabel: string;
  amountIls: number;
  descriptionHe: string;
  summaryHe?: string;
  icon?: string;
  badge?: string;
  defaultBullets: string[];
  defaultLimits?: string[];
  defaultNotIncluded?: string[];
  hidden?: boolean;
  allowQuantity?: boolean;
  allowBillingChange?: boolean;
  allowNameEdit?: boolean;
  customizable?: boolean;
  proposalOnly?: boolean;
  parentSku?: string | null;
};

type LineDraft = {
  sku: string;
  nameHe: string;
  amountIls: number;
  catalogAmountIls: number;
  billing: string;
  catalogBilling: string;
  priceEdited: boolean;
  quantity: number;
  bullets: string[];
  limits: string[];
  notIncluded: string[];
  descriptionHe: string;
  summaryHe: string;
  icon: string;
  badge: string;
  highlightedByCustomer?: boolean;
  customerInterestSource?: string;
};

const BILLING_OPTIONS = [
  { value: "recurring_month", label: "חודשי" },
  { value: "recurring_year", label: "שנתי" },
  { value: "one_time", label: "חד־פעמי" },
];

const ENTERPRISE_MONTHLY_SKU = "enterprise_custom";
const ENTERPRISE_SETUP_SKU = "enterprise_setup";

function defaultExpiryIso() {
  const d = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 16);
}

function sanitizePriceInput(raw: string): number | null {
  const cleaned = String(raw || "").trim().replace(",", ".");
  if (!cleaned) return null;
  if (!/^\d+(\.\d{0,2})?$/.test(cleaned)) return null;
  const n = Number(cleaned);
  if (!Number.isFinite(n) || n < 0) return null;
  return Math.round(n * 100) / 100;
}

function billingSuffix(billing?: string) {
  if (billing === "recurring_month") return "₪ / חודש";
  if (billing === "recurring_year") return "₪ / שנה";
  return "₪ חד־פעמי";
}

function billingLabelOf(billing?: string) {
  return BILLING_OPTIONS.find((o) => o.value === billing)?.label || billing || "";
}

function isPriceEdited(line: Pick<LineDraft, "amountIls" | "catalogAmountIls" | "billing" | "catalogBilling">) {
  return line.amountIls !== line.catalogAmountIls || line.billing !== line.catalogBilling;
}

function formatMoney(n: number) {
  if (Number(n) === 0) return "ללא עלות";
  return `₪${Number(n).toLocaleString("he-IL")}`;
}

function LinePriceEditor({
  line,
  item,
  priceValue,
  onPriceChange,
  onBillingChange,
  onNameChange,
}: {
  line: LineDraft;
  item: CatalogItem;
  priceValue: string;
  onPriceChange: (raw: string) => void;
  onBillingChange: (billing: string) => void;
  onNameChange?: (name: string) => void;
}) {
  return (
    <div className="mt-3 space-y-2 rounded-xl border border-violet-100 bg-violet-50/60 p-3">
      {item.allowNameEdit && onNameChange ? (
        <label className="block text-xs font-black text-slate-700">
          שם בהצעה
          <input
            className="mt-1 min-h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-bold"
            value={line.nameHe}
            onChange={(e) => onNameChange(e.target.value)}
          />
        </label>
      ) : null}
      <div className="flex flex-wrap items-end gap-2">
        <label className="min-w-[140px] flex-1 text-xs font-black text-slate-700">
          מחיר בהצעה
          <div className="mt-1 flex items-center gap-2">
            <input
              type="text"
              inputMode="decimal"
              className="min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-black"
              value={priceValue}
              onChange={(e) => onPriceChange(e.target.value)}
            />
            <span className="shrink-0 text-[11px] font-bold text-slate-500">
              {billingSuffix(line.billing)}
            </span>
          </div>
        </label>
        <label className="min-w-[120px] text-xs font-black text-slate-700">
          סוג חיוב
          <select
            className="mt-1 min-h-11 w-full rounded-xl border border-slate-200 bg-white px-2 text-sm font-black"
            value={line.billing}
            onChange={(e) => onBillingChange(e.target.value)}
          >
            {BILLING_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>
      </div>
      <p className="text-[11px] font-bold text-slate-500">
        מחיר קטלוג: {formatMoney(line.catalogAmountIls)} · {billingLabelOf(line.catalogBilling)}
        {isPriceEdited(line) ? " · מחיר/חיוב מותאם להצעה זו בלבד" : ""}
      </p>
    </div>
  );
}

function CatalogCard({
  item,
  selected,
  line,
  priceValue,
  interestBadge,
  onToggle,
  onExpand,
  expanded,
  onPriceChange,
  onBillingChange,
}: {
  item: CatalogItem;
  selected: boolean;
  line?: LineDraft;
  priceValue?: string;
  interestBadge?: string;
  onToggle: () => void;
  onExpand: () => void;
  expanded: boolean;
  onPriceChange?: (raw: string) => void;
  onBillingChange?: (billing: string) => void;
}) {
  return (
    <div
      className={[
        "rounded-2xl border p-4",
        selected ? "border-[#6D28D9] bg-[#6D28D9]/5" : "border-slate-200 bg-white",
        interestBadge ? "border-amber-200 bg-amber-50/40 ring-1 ring-amber-200" : "",
      ].join(" ")}
    >
      {interestBadge ? (
        <p className="mb-2 inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-[11px] font-black text-amber-800">
          ★ {interestBadge}
        </p>
      ) : null}
      <div className="flex items-start justify-between gap-2">
        <div className="flex min-w-0 items-start gap-2">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-violet-50 text-base">
            {item.icon || "•"}
          </span>
          <div className="min-w-0">
            <p className="font-black text-slate-900">{item.nameHe}</p>
            <p className="text-xs font-bold text-slate-500">
              {formatMoney(item.amountIls)} · {item.billingLabel}
              {item.hidden ? " · הצעה פרטית" : ""}
            </p>
            {item.summaryHe ? (
              <p className="mt-1 text-xs font-semibold text-slate-500 line-clamp-2">
                {item.summaryHe}
              </p>
            ) : null}
          </div>
        </div>
        <button
          type="button"
          onClick={onToggle}
          className={[
            "min-h-10 shrink-0 rounded-xl px-3 text-xs font-black",
            selected
              ? "border border-slate-300 bg-white text-slate-700"
              : interestBadge
                ? "bg-[#6D28D9] text-white"
                : "border border-slate-200 bg-white",
          ].join(" ")}
        >
          {selected ? "הוסר" : "הוסף"}
        </button>
      </div>
      {selected && line && onPriceChange && onBillingChange ? (
        <LinePriceEditor
          line={line}
          item={item}
          priceValue={priceValue ?? String(line.amountIls)}
          onPriceChange={onPriceChange}
          onBillingChange={onBillingChange}
        />
      ) : null}
      <button
        type="button"
        className="mt-3 text-xs font-black text-[#6D28D9]"
        onClick={onExpand}
      >
        {expanded ? "⌃ הסתר פירוט" : "⌄ פירוט מה כלול"}
      </button>
      {expanded ? (
        <ul className="mt-2 space-y-1.5 rounded-xl bg-white/80 p-3">
          {(item.defaultBullets || []).map((b) => (
            <li key={b} className="flex items-start gap-2 text-xs font-semibold text-slate-700">
              <span className="text-emerald-500">✓</span>
              <span>{b}</span>
            </li>
          ))}
          {(item.defaultLimits || []).map((b) => (
            <li key={b} className="flex items-start gap-2 text-xs font-semibold text-amber-800">
              <span>!</span>
              <span>{b}</span>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

export default function ProposalBuilderModal({
  open,
  customerId,
  onClose,
  onIssued,
  onOpenEnterprise,
}: {
  open: boolean;
  customerId: string;
  onClose: () => void;
  onIssued?: (proposal: any) => void;
  onOpenEnterprise?: () => void;
}) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState<"edit" | "preview" | "issued">("edit");
  const [catalog, setCatalog] = useState<CatalogItem[]>([]);
  const [context, setContext] = useState<any>(null);
  const [proposalId, setProposalId] = useState("");
  const [issued, setIssued] = useState<any>(null);

  const [customerName, setCustomerName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [understandingText, setUnderstandingText] = useState("");
  const [showUnderstanding, setShowUnderstanding] = useState(true);
  const [notesPublic, setNotesPublic] = useState("");
  const [notesInternal, setNotesInternal] = useState("");
  const [termsText, setTermsText] = useState("");
  const [expiresAt, setExpiresAt] = useState(defaultExpiryIso());
  const [selected, setSelected] = useState<Record<string, LineDraft>>({});
  const [expandedSku, setExpandedSku] = useState("");
  const [priceInput, setPriceInput] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!open) return;
    let alive = true;
    (async () => {
      setLoading(true);
      setError("");
      setStep("edit");
      setIssued(null);
      setProposalId("");
      setPriceInput({});
      try {
        const { data } = await adminCrmApi.proposalContext(customerId);
        if (!alive) return;
        setContext(data.context);
        setCatalog(data.catalog || []);
        setCustomerName(data.context?.customerName || "");
        setBusinessName(data.context?.businessName || "");
        setUnderstandingText(data.context?.understandingDraft || "");
        const { data: catalogData } = await adminCrmApi.proposalCatalog();
        if (!alive) return;
        setTermsText(catalogData.defaultTerms || "");
        setSelected({});
      } catch (err: any) {
        if (alive) setError(err?.response?.data?.error || "טעינה נכשלה");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [open, customerId]);

  const interested = useMemo(
    () => new Set(context?.interestedServiceSkus || []),
    [context]
  );

  const interestGroups = useMemo(() => {
    const groups = Array.isArray(context?.interestGroups) ? context.interestGroups : [];
    if (groups.length) return groups;
    // Fallback from flat SKU list
    if (!interested.size) return [];
    return [
      {
        key: "interested",
        labelHe: "שירותים שהלקוח התעניין בהם",
        skus: [...interested],
        source: "post_demo_questionnaire",
      },
    ];
  }, [context, interested]);

  const linesPayload = useMemo(() => {
    return Object.values(selected)
      .filter((line) => {
        if (
          (line.sku === ENTERPRISE_MONTHLY_SKU || line.sku === ENTERPRISE_SETUP_SKU) &&
          Number(line.amountIls || 0) <= 0
        ) {
          return false;
        }
        return true;
      })
      .map((line) => {
      const item = catalog.find((c) => c.sku === line.sku);
      return {
        sku: line.sku,
        nameHe: line.nameHe || item?.nameHe,
        amountIls: line.amountIls,
        proposalPrice: line.amountIls,
        catalogPrice: line.catalogAmountIls,
        originalPrice: line.catalogAmountIls,
        catalogAmountIls: line.catalogAmountIls,
        customPrice: line.priceEdited ? line.amountIls : null,
        priceEdited: line.priceEdited,
        priceOverridden: line.priceEdited,
        quantity: line.quantity,
        bullets: line.bullets,
        limits: line.limits,
        notIncluded: line.notIncluded,
        descriptionHe: line.descriptionHe,
        summaryHe: line.summaryHe,
        icon: line.icon,
        badge: line.badge,
        highlightedByCustomer: Boolean(line.highlightedByCustomer) || interested.has(line.sku),
        customerInterestSource:
          line.customerInterestSource ||
          (interested.has(line.sku) ? "post_demo_questionnaire" : ""),
        category: item?.category,
        billing: line.billing || item?.billing,
      };
    });
  }, [selected, catalog, interested]);

  const previewTotals = useMemo(() => {
    const totals = { monthlyIls: 0, yearlyIls: 0, oneTimeIls: 0, servicesIls: 0 };
    for (const line of linesPayload) {
      const amount = Number(line.amountIls || 0) * Math.max(1, Number(line.quantity || 1));
      const isService =
        line.category === "managed_service" || line.category === "managed_service_addon";
      if (line.billing === "recurring_month") totals.monthlyIls += amount;
      else if (line.billing === "recurring_year") totals.yearlyIls += amount;
      else if (isService) totals.servicesIls += amount;
      else totals.oneTimeIls += amount;
    }
    return totals;
  }, [linesPayload]);

  function addItem(item: CatalogItem, fromInterest = false) {
    setSelected((prev) => {
      if (prev[item.sku]) return prev;
      return {
        ...prev,
        [item.sku]: {
          sku: item.sku,
          nameHe: item.nameHe,
          amountIls: item.amountIls,
          catalogAmountIls: item.amountIls,
          billing: item.billing,
          catalogBilling: item.billing,
          priceEdited: false,
          quantity: 1,
          bullets: [...(item.defaultBullets || [])],
          limits: [...(item.defaultLimits || [])],
          notIncluded: [...(item.defaultNotIncluded || [])],
          descriptionHe: item.descriptionHe || "",
          summaryHe: item.summaryHe || item.descriptionHe || "",
          icon: item.icon || "•",
          badge: item.badge || item.categoryLabel,
          highlightedByCustomer: fromInterest || interested.has(item.sku),
          customerInterestSource:
            fromInterest || interested.has(item.sku) ? "post_demo_questionnaire" : "",
        },
      };
    });
    setPriceInput((prev) => ({
      ...prev,
      [item.sku]: item.amountIls ? String(item.amountIls) : "",
    }));
  }

  function removeItem(sku: string) {
    setSelected((prev) => {
      const next = { ...prev };
      delete next[sku];
      return next;
    });
    setPriceInput((prev) => {
      const next = { ...prev };
      delete next[sku];
      return next;
    });
  }

  function toggleSku(item: CatalogItem, fromInterest = false) {
    if (selected[item.sku]) removeItem(item.sku);
    else addItem(item, fromInterest);
  }


  function setLinePrice(sku: string, value: number) {
    setSelected((prev) => {
      const row = prev[sku];
      if (!row) return prev;
      const amountIls = Math.max(0, Math.round(value * 100) / 100);
      const next = { ...row, amountIls };
      return {
        ...prev,
        [sku]: {
          ...next,
          priceEdited: isPriceEdited(next),
        },
      };
    });
    setPriceInput((prev) => ({ ...prev, [sku]: String(value) }));
  }

  function setLineBilling(sku: string, billing: string) {
    setSelected((prev) => {
      const row = prev[sku];
      if (!row) return prev;
      const next = { ...row, billing };
      return {
        ...prev,
        [sku]: {
          ...next,
          priceEdited: isPriceEdited(next),
        },
      };
    });
  }

  function setLineName(sku: string, nameHe: string) {
    setSelected((prev) => {
      const row = prev[sku];
      if (!row) return prev;
      return { ...prev, [sku]: { ...row, nameHe } };
    });
  }

  function onPriceChange(sku: string, raw: string) {
    setPriceInput((prev) => ({ ...prev, [sku]: raw }));
    const parsed = sanitizePriceInput(raw);
    if (parsed == null) return;
    setLinePrice(sku, parsed);
  }

  async function persistDraft() {
    const body = {
      customerName,
      businessName,
      understandingText,
      showUnderstanding,
      notesPublic,
      notesInternal,
      termsText,
      expiresAt: new Date(expiresAt).toISOString(),
      lines: linesPayload,
    };
    if (proposalId) {
      const { data } = await adminCrmApi.updateProposal(proposalId, body);
      return data.proposal;
    }
    const { data } = await adminCrmApi.createProposal(customerId, body);
    setProposalId(data.proposal.id);
    return data.proposal;
  }

  async function goPreview() {
    setSaving(true);
    setError("");
    try {
      if (!linesPayload.length) {
        setError("יש לבחור לפחות רכיב אחד להצעה");
        setSaving(false);
        return;
      }
      await persistDraft();
      setStep("preview");
    } catch (err: any) {
      setError(err?.response?.data?.error || "שמירה נכשלה");
    } finally {
      setSaving(false);
    }
  }

  async function issue() {
    setSaving(true);
    setError("");
    try {
      const draft = await persistDraft();
      const { data } = await adminCrmApi.issueProposal(draft.id || proposalId);
      setIssued(data.proposal);
      setStep("issued");
      onIssued?.(data.proposal);
    } catch (err: any) {
      setError(err?.response?.data?.error || "הנפקה נכשלה");
    } finally {
      setSaving(false);
    }
  }

  const plans = catalog.filter(
    (c) =>
      (c.category === "plan" || c.category === "addon") &&
      !c.proposalOnly
  );
  const interestedSkuSet = useMemo(() => {
    const set = new Set<string>();
    for (const g of interestGroups) {
      (g.skus || []).forEach((s: string) => set.add(s));
    }
    return set;
  }, [interestGroups]);

  const otherServices = catalog.filter(
    (c) =>
      (c.category === "managed_service" || c.category === "managed_service_addon") &&
      !interestedSkuSet.has(c.sku)
  );

  const selectedList = Object.values(selected)
    .map((line) => ({ line, item: catalog.find((c) => c.sku === line.sku) }))
    .filter((x) => x.item && !x.item.proposalOnly);

  function catalogCardExtras(item: CatalogItem) {
    const line = selected[item.sku];
    return {
      line,
      priceValue:
        priceInput[item.sku] !== undefined
          ? priceInput[item.sku]
          : line
            ? String(line.amountIls || "")
            : "",
      onPriceChange: (raw: string) => onPriceChange(item.sku, raw),
      onBillingChange: (billing: string) => setLineBilling(item.sku, billing),
    };
  }

  return (
    <AdminModal
      open={open}
      onClose={onClose}
      title="יצירת הצעה מותאמת"
      size="xl"
      footer={
        step === "issued" ? (
          <PrimaryButton onClick={onClose}>סיום</PrimaryButton>
        ) : step === "preview" ? (
          <div className="flex flex-wrap gap-2">
            <SecondaryButton onClick={() => setStep("edit")}>חזרה לעריכה</SecondaryButton>
            <PrimaryButton disabled={saving} onClick={() => void issue()}>
              {saving ? "מנפיק..." : "הנפקת הצעה"}
            </PrimaryButton>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            <SecondaryButton onClick={onClose}>ביטול</SecondaryButton>
            <PrimaryButton disabled={saving || loading} onClick={() => void goPreview()}>
              {saving ? "שומר..." : "צפייה מקדימה"}
            </PrimaryButton>
          </div>
        )
      }
    >
      {loading ? <p className="text-sm font-bold text-slate-500">טוען קטלוג פעיל...</p> : null}
      {error ? <p className="mb-3 text-sm font-bold text-rose-600">{error}</p> : null}

      {step === "issued" && issued ? (
        <div className="space-y-4">
          <h3 className="text-xl font-black text-emerald-700">ההצעה מוכנה</h3>
          <p className="text-sm font-bold text-slate-600">{issued.proposalNumber}</p>
          <p className="break-all rounded-2xl bg-slate-50 p-3 text-left text-sm font-bold" dir="ltr">
            {issued.publicUrl}
          </p>
          <div className="flex flex-wrap gap-2">
            <PrimaryButton
              onClick={() => void navigator.clipboard?.writeText(issued.publicUrl || "")}
            >
              Copy Link
            </PrimaryButton>
            <SecondaryButton
              onClick={() => {
                const text = encodeURIComponent(
                  `היי, הכנו לך הצעה מותאמת ב-BizUply:\n${issued.publicUrl}`
                );
                window.open(`https://wa.me/?text=${text}`, "_blank");
              }}
            >
              שליחה ב-WhatsApp
            </SecondaryButton>
          </div>
        </div>
      ) : null}

      {step === "preview" ? (
        <ProposalDocumentView
          interactive
          mode="admin-preview"
          proposal={{
            proposalNumber: "תצוגה מקדימה",
            customerName,
            businessName,
            understandingText,
            showUnderstanding,
            notesPublic,
            termsText,
            lines: linesPayload as any,
            totals: previewTotals,
            expiresAt: new Date(expiresAt).toISOString(),
            createdAt: new Date().toISOString(),
            status: "draft",
            contextSnapshot: context,
          }}
          footer={
            <div className="space-y-2 border-t border-slate-100 pt-6 opacity-70">
              <div className="min-h-12 rounded-2xl bg-[#6D28D9] px-4 py-3 text-center text-base font-black text-white">
                אני רוצה להתחיל
              </div>
              <div className="min-h-11 rounded-2xl border border-slate-200 px-4 py-3 text-center text-sm font-black text-slate-700">
                יש לי שאלה על ההצעה
              </div>
              <div className="min-h-11 rounded-2xl px-4 py-3 text-center text-sm font-bold text-slate-500">
                אני רוצה לחשוב על זה
              </div>
            </div>
          }
        />
      ) : null}

      {step === "edit" && !loading ? (
        <div className="space-y-6">
          <section className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <label className="text-sm font-black">
              שם לקוח
              <input
                className="mt-1 min-h-11 w-full rounded-2xl border px-3"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
              />
            </label>
            <label className="text-sm font-black">
              שם העסק
              <input
                className="mt-1 min-h-11 w-full rounded-2xl border px-3"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
              />
            </label>
            <label className="text-sm font-black">
              תוקף ההצעה
              <input
                type="datetime-local"
                className="mt-1 min-h-11 w-full rounded-2xl border px-3"
                value={expiresAt}
                onChange={(e) => setExpiresAt(e.target.value)}
              />
            </label>
            <label className="text-sm font-black">
              הערה פנימית לנציג
              <input
                className="mt-1 min-h-11 w-full rounded-2xl border px-3"
                value={notesInternal}
                onChange={(e) => setNotesInternal(e.target.value)}
              />
            </label>
          </section>

          {(context?.intro || context?.postDemo) && (
            <section className="rounded-2xl border border-amber-100 bg-amber-50/50 p-4 text-sm">
              <h3 className="font-black text-amber-900">מידע מהלקוח (לעזרת הנציג)</h3>
              <div className="mt-2 space-y-1 font-bold text-slate-700">
                {context.postDemo?.relevant?.length ? (
                  <p>הכי עניין מהדמו: {heLabels(context.postDemo.relevant).join(", ")}</p>
                ) : null}
                {context.postDemo?.goals?.length ? (
                  <p>חשוב לשפר: {heLabels(context.postDemo.goals).join(", ")}</p>
                ) : null}
                {context.postDemo?.automation?.length ? (
                  <p>אוטומציות: {heLabels(context.postDemo.automation).join(", ")}</p>
                ) : null}
                {context.postDemo?.services?.length ? (
                  <p>שירותים שסימן: {heLabels(context.postDemo.services).join(", ")}</p>
                ) : null}
                {context.postDemo?.blockers?.length ? (
                  <p>התלבטויות: {heLabels(context.postDemo.blockers).join(", ")}</p>
                ) : null}
                {context.postDemo?.startTiming ? (
                  <p>מועד התחלה: {heLabel(context.postDemo.startTiming)}</p>
                ) : null}
              </div>
            </section>
          )}

          <section>
            <div className="mb-2 flex items-center justify-between gap-2">
              <h3 className="font-black">מה הבנו על העסק</h3>
              <label className="flex items-center gap-2 text-xs font-bold">
                <input
                  type="checkbox"
                  checked={showUnderstanding}
                  onChange={(e) => setShowUnderstanding(e.target.checked)}
                />
                להציג בהצעה
              </label>
            </div>
            <textarea
              className="min-h-28 w-full rounded-2xl border p-3 text-sm"
              value={understandingText}
              onChange={(e) => setUnderstandingText(e.target.value)}
            />
          </section>

          {/* Selected lines — always-visible price edit */}
          <section className="rounded-3xl border-2 border-[#6D28D9]/30 bg-violet-50/30 p-4 sm:p-5">
            <h3 className="text-lg font-black text-slate-900">רכיבי ההצעה שנבחרו</h3>
            <p className="mt-1 text-xs font-semibold text-slate-500">
              אפשר לשנות סכום חודשי או חד־פעמי לכל רכיב. השינוי חל רק על ההצעה הזו.
            </p>
            {!selectedList.length ? (
              <p className="mt-4 text-sm font-bold text-slate-500">
                עדיין לא נוספו רכיבים — בחרו מהקטלוג למטה, כולל Enterprise בהתאמה אישית.
              </p>
            ) : (
              <div className="mt-4 space-y-3">
                {selectedList.map(({ line, item }) => (
                  <div
                    key={line.sku}
                    className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="font-black text-slate-900">{line.nameHe || item!.nameHe}</p>
                        <p className="mt-1 text-xs font-bold text-slate-500">
                          {item!.categoryLabel} · {billingLabelOf(line.billing)}
                        </p>
                        {line.highlightedByCustomer || line.customerInterestSource ? (
                          <p className="mt-1 text-[11px] font-black text-amber-700">
                            ★ הלקוח סימן עניין בשירות זה
                          </p>
                        ) : null}
                      </div>
                      <button
                        type="button"
                        className="text-xs font-black text-rose-600"
                        onClick={() => removeItem(line.sku)}
                      >
                        הסרה
                      </button>
                    </div>

                    <LinePriceEditor
                      line={line}
                      item={item!}
                      priceValue={
                        priceInput[line.sku] !== undefined
                          ? priceInput[line.sku]
                          : String(line.amountIls || "")
                      }
                      onPriceChange={(raw) => onPriceChange(line.sku, raw)}
                      onBillingChange={(billing) => setLineBilling(line.sku, billing)}
                      onNameChange={
                        item!.allowNameEdit
                          ? (name) => setLineName(line.sku, name)
                          : undefined
                      }
                    />
                    {line.priceEdited && !item!.customizable ? (
                      <button
                        type="button"
                        className="mt-2 text-xs font-black text-[#6D28D9]"
                        onClick={() => {
                          setLineBilling(line.sku, line.catalogBilling);
                          setLinePrice(line.sku, line.catalogAmountIls);
                        }}
                      >
                        איפוס למחיר וסוג חיוב בקטלוג
                      </button>
                    ) : null}

                    {item!.allowQuantity ? (
                      <label className="mt-3 block text-xs font-bold">
                        כמות
                        <input
                          type="number"
                          min={1}
                          className="mt-1 min-h-10 w-28 rounded-xl border px-2"
                          value={line.quantity}
                          onChange={(e) =>
                            setSelected((prev) => ({
                              ...prev,
                              [line.sku]: {
                                ...prev[line.sku],
                                quantity: Math.max(1, Number(e.target.value || 1)),
                              },
                            }))
                          }
                        />
                      </label>
                    ) : null}

                    <details className="mt-3">
                      <summary className="cursor-pointer text-xs font-black text-[#6D28D9]">
                        עריכת פירוט להצעה זו
                      </summary>
                      <div className="mt-2 space-y-2">
                        <label className="block text-xs font-bold">
                          שורות פירוט
                          <textarea
                            className="mt-1 min-h-20 w-full rounded-xl border p-2"
                            value={(line.bullets || []).join("\n")}
                            onChange={(e) =>
                              setSelected((prev) => ({
                                ...prev,
                                [line.sku]: {
                                  ...prev[line.sku],
                                  bullets: e.target.value
                                    .split("\n")
                                    .map((x) => x.trim())
                                    .filter(Boolean),
                                },
                              }))
                            }
                          />
                        </label>
                        <label className="block text-xs font-bold">
                          מגבלות
                          <textarea
                            className="mt-1 min-h-16 w-full rounded-xl border p-2"
                            value={(line.limits || []).join("\n")}
                            onChange={(e) =>
                              setSelected((prev) => ({
                                ...prev,
                                [line.sku]: {
                                  ...prev[line.sku],
                                  limits: e.target.value
                                    .split("\n")
                                    .map((x) => x.trim())
                                    .filter(Boolean),
                                },
                              }))
                            }
                          />
                        </label>
                      </div>
                    </details>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4 text-sm font-bold">
              <h4 className="font-black">סיכום מחירים (לפי מחיר ההצעה)</h4>
              <p className="mt-2">חודשי: {formatMoney(previewTotals.monthlyIls)}</p>
              <p>שנתי: {formatMoney(previewTotals.yearlyIls)}</p>
              <p>חד־פעמי: {formatMoney(previewTotals.oneTimeIls)}</p>
              <p>שירותים נוספים: {formatMoney(previewTotals.servicesIls)}</p>
            </div>
          </section>

          {/* Customer interest recommendations */}
          {interestGroups.length ? (
            <section className="space-y-4">
              <div>
                <h3 className="text-lg font-black text-slate-900">
                  שירותים שהלקוח ביקש / התעניין בהם
                </h3>
                <p className="mt-1 text-xs font-semibold text-slate-500">
                  המלצה לפי שאלון לאחר הדמו — לא מתווסף אוטומטית להצעה.
                </p>
              </div>
              {interestGroups.map((group: any) => {
                const items = (group.skus || [])
                  .map((sku: string) => catalog.find((c) => c.sku === sku))
                  .filter(Boolean) as CatalogItem[];
                if (!items.length) return null;
                return (
                  <div key={group.key} className="space-y-3">
                    <p className="text-sm font-black text-amber-800">
                      הלקוח התעניין ב{group.labelHe}
                    </p>
                    <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
                      {items.map((item) => (
                        <CatalogCard
                          key={`interest-${item.sku}`}
                          item={item}
                          selected={Boolean(selected[item.sku])}
                          interestBadge="הלקוח סימן עניין בשירות זה"
                          onToggle={() => toggleSku(item, true)}
                          expanded={expandedSku === `interest-${item.sku}`}
                          onExpand={() =>
                            setExpandedSku((s) =>
                              s === `interest-${item.sku}` ? "" : `interest-${item.sku}`
                            )
                          }
                          {...catalogCardExtras(item)}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </section>
          ) : null}

          <button
            type="button"
            onClick={() => onOpenEnterprise?.()}
            className="w-full rounded-3xl border-2 border-slate-900 bg-gradient-to-l from-violet-50 to-white p-5 text-right"
          >
            <p className="text-[11px] font-black uppercase tracking-wide text-[#6D28D9]">
              Enterprise
            </p>
            <h3 className="mt-1 text-lg font-black text-slate-900">
              חבילה ומערכת בהתאמה אישית
            </h3>
            <p className="mt-1 text-xs font-semibold text-slate-500">
              פתיחת מודאל נפרד להצעת Enterprise — מחיר הקמה, מנוי חודשי ותוכן מותאם.
            </p>
          </button>

          <section>
            <h3 className="mb-3 font-black">חבילות ותוספים פעילים</h3>
            <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
              {plans.map((item) => (
                <CatalogCard
                  key={item.sku}
                  item={item}
                  selected={Boolean(selected[item.sku])}
                  onToggle={() => toggleSku(item)}
                  expanded={expandedSku === item.sku}
                  onExpand={() => setExpandedSku((s) => (s === item.sku ? "" : item.sku))}
                  {...catalogCardExtras(item)}
                />
              ))}
            </div>
          </section>

          <section>
            <h3 className="mb-3 font-black">שירותים נוספים / Upsells</h3>
            <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
              {otherServices.map((item) => (
                <CatalogCard
                  key={item.sku}
                  item={item}
                  selected={Boolean(selected[item.sku])}
                  onToggle={() => toggleSku(item)}
                  expanded={expandedSku === item.sku}
                  onExpand={() => setExpandedSku((s) => (s === item.sku ? "" : item.sku))}
                  {...catalogCardExtras(item)}
                />
              ))}
            </div>
          </section>

          <section>
            <h3 className="mb-2 font-black">הערות להצעה</h3>
            <textarea
              className="min-h-24 w-full rounded-2xl border p-3 text-sm"
              value={notesPublic}
              onChange={(e) => setNotesPublic(e.target.value)}
            />
          </section>

          <section>
            <h3 className="mb-2 font-black">תנאים</h3>
            <textarea
              className="min-h-32 w-full rounded-2xl border p-3 text-sm"
              value={termsText}
              onChange={(e) => setTermsText(e.target.value)}
            />
          </section>
        </div>
      ) : null}
    </AdminModal>
  );
}
