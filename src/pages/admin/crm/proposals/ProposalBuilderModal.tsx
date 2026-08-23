import React, { useEffect, useMemo, useState } from "react";
import adminCrmApi from "../../../../api/adminCrmApi";
import { AdminModal } from "../AdminModal";
import { PrimaryButton, SecondaryButton } from "../AdminCrmUi";
import ProposalDocumentView from "./ProposalDocumentView";

type CatalogItem = {
  sku: string;
  nameHe: string;
  category: string;
  categoryLabel: string;
  billing: string;
  billingLabel: string;
  amountIls: number;
  descriptionHe: string;
  defaultBullets: string[];
  hidden?: boolean;
  allowQuantity?: boolean;
  parentSku?: string | null;
};

type LineDraft = {
  sku: string;
  amountIls: number;
  quantity: number;
  bullets: string[];
  descriptionHe: string;
  highlightedByCustomer?: boolean;
};

function defaultExpiryIso() {
  const d = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 16);
}

export default function ProposalBuilderModal({
  open,
  customerId,
  onClose,
  onIssued,
}: {
  open: boolean;
  customerId: string;
  onClose: () => void;
  onIssued?: (proposal: any) => void;
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

  useEffect(() => {
    if (!open) return;
    let alive = true;
    (async () => {
      setLoading(true);
      setError("");
      setStep("edit");
      setIssued(null);
      setProposalId("");
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

  const linesPayload = useMemo(() => {
    return Object.values(selected).map((line) => {
      const item = catalog.find((c) => c.sku === line.sku);
      return {
        sku: line.sku,
        amountIls: line.amountIls,
        quantity: line.quantity,
        bullets: line.bullets,
        descriptionHe: line.descriptionHe,
        highlightedByCustomer: interested.has(line.sku),
        nameHe: item?.nameHe,
        category: item?.category,
        billing: item?.billing,
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

  function toggleSku(item: CatalogItem) {
    setSelected((prev) => {
      const next = { ...prev };
      if (next[item.sku]) {
        delete next[item.sku];
        return next;
      }
      next[item.sku] = {
        sku: item.sku,
        amountIls: item.amountIls,
        quantity: 1,
        bullets: [...(item.defaultBullets || [])],
        descriptionHe: item.descriptionHe || "",
      };
      return next;
    });
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

  const plans = catalog.filter((c) => c.category === "plan" || c.category === "addon");
  const services = catalog.filter(
    (c) => c.category === "managed_service" || c.category === "managed_service_addon"
  );

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
      {loading ? (
        <p className="text-sm font-bold text-slate-500">טוען קטלוג פעיל...</p>
      ) : null}
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
                const phone = "";
                const text = encodeURIComponent(
                  `היי, הכנו לך הצעה מותאמת ב-BizUply:\n${issued.publicUrl}`
                );
                window.open(`https://wa.me/${phone}?text=${text}`, "_blank");
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
          }}
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
                  <p>הכי עניין מהדמו: {context.postDemo.relevant.join(", ")}</p>
                ) : null}
                {context.postDemo?.automation?.length ? (
                  <p>אוטומציות: {context.postDemo.automation.join(", ")}</p>
                ) : null}
                {context.postDemo?.services?.length ? (
                  <p>שירותים שסימן: {context.postDemo.services.join(", ")}</p>
                ) : null}
                {context.postDemo?.blockers?.length ? (
                  <p>התלבטויות: {context.postDemo.blockers.join(", ")}</p>
                ) : null}
                {context.postDemo?.startTiming ? (
                  <p>מועד התחלה: {context.postDemo.startTiming}</p>
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

          <section>
            <h3 className="mb-3 font-black">חבילות ותוספים פעילים</h3>
            <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
              {plans.map((item) => {
                const on = Boolean(selected[item.sku]);
                const draft = selected[item.sku];
                return (
                  <div
                    key={item.sku}
                    className={[
                      "rounded-2xl border p-4",
                      on ? "border-[#6D28D9] bg-[#6D28D9]/5" : "border-slate-200",
                    ].join(" ")}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-black text-slate-900">{item.nameHe}</p>
                        <p className="text-xs font-bold text-slate-500">
                          {item.categoryLabel} · {item.billingLabel} · ₪{item.amountIls}
                          {item.hidden ? " · הצעה פרטית" : ""}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => toggleSku(item)}
                        className="min-h-10 rounded-xl border px-3 text-xs font-black"
                      >
                        {on ? "הוסר" : "הוסף"}
                      </button>
                    </div>
                    {on ? (
                      <div className="mt-3 space-y-2">
                        <button
                          type="button"
                          className="text-xs font-black text-[#6D28D9]"
                          onClick={() =>
                            setExpandedSku((s) => (s === item.sku ? "" : item.sku))
                          }
                        >
                          {expandedSku === item.sku ? "⌃ פירוט" : "⌄ פירוט / עריכה"}
                        </button>
                        {expandedSku === item.sku ? (
                          <div className="space-y-2">
                            <label className="block text-xs font-bold">
                              מחיר להצעה (₪)
                              <input
                                type="number"
                                className="mt-1 min-h-10 w-full rounded-xl border px-2"
                                value={draft.amountIls}
                                onChange={(e) =>
                                  setSelected((prev) => ({
                                    ...prev,
                                    [item.sku]: {
                                      ...prev[item.sku],
                                      amountIls: Number(e.target.value || 0),
                                    },
                                  }))
                                }
                              />
                            </label>
                            <label className="block text-xs font-bold">
                              שורות פירוט (שורה לכל נקודה)
                              <textarea
                                className="mt-1 min-h-24 w-full rounded-xl border p-2"
                                value={(draft.bullets || []).join("\n")}
                                onChange={(e) =>
                                  setSelected((prev) => ({
                                    ...prev,
                                    [item.sku]: {
                                      ...prev[item.sku],
                                      bullets: e.target.value
                                        .split("\n")
                                        .map((x) => x.trim())
                                        .filter(Boolean),
                                    },
                                  }))
                                }
                              />
                            </label>
                          </div>
                        ) : null}
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </section>

          <section>
            <h3 className="mb-3 font-black">שירותים נוספים / Upsells</h3>
            <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
              {services.map((item) => {
                const on = Boolean(selected[item.sku]);
                const draft = selected[item.sku];
                const customerInterest = interested.has(item.sku);
                return (
                  <div
                    key={item.sku}
                    className={[
                      "rounded-2xl border p-4",
                      on ? "border-[#6D28D9] bg-[#6D28D9]/5" : "border-slate-200",
                      customerInterest ? "ring-2 ring-amber-300" : "",
                    ].join(" ")}
                  >
                    {customerInterest ? (
                      <p className="mb-2 text-[11px] font-black text-amber-700">
                        הלקוח סימן עניין בשירות זה
                      </p>
                    ) : null}
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-black text-slate-900">{item.nameHe}</p>
                        <p className="text-xs font-bold text-slate-500">
                          {item.billingLabel} · ₪{item.amountIls}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => toggleSku(item)}
                        className="min-h-10 rounded-xl border px-3 text-xs font-black"
                      >
                        {on ? "הוסר" : "הוסף"}
                      </button>
                    </div>
                    {on ? (
                      <div className="mt-3 space-y-2">
                        <button
                          type="button"
                          className="text-xs font-black text-[#6D28D9]"
                          onClick={() =>
                            setExpandedSku((s) => (s === item.sku ? "" : item.sku))
                          }
                        >
                          {expandedSku === item.sku ? "⌃ פירוט" : "⌄ פירוט / עריכה"}
                        </button>
                        {expandedSku === item.sku ? (
                          <div className="space-y-2">
                            <label className="block text-xs font-bold">
                              מחיר להצעה (₪)
                              <input
                                type="number"
                                className="mt-1 min-h-10 w-full rounded-xl border px-2"
                                value={draft.amountIls}
                                onChange={(e) =>
                                  setSelected((prev) => ({
                                    ...prev,
                                    [item.sku]: {
                                      ...prev[item.sku],
                                      amountIls: Number(e.target.value || 0),
                                    },
                                  }))
                                }
                              />
                            </label>
                            {item.allowQuantity ? (
                              <label className="block text-xs font-bold">
                                כמות
                                <input
                                  type="number"
                                  min={1}
                                  className="mt-1 min-h-10 w-full rounded-xl border px-2"
                                  value={draft.quantity}
                                  onChange={(e) =>
                                    setSelected((prev) => ({
                                      ...prev,
                                      [item.sku]: {
                                        ...prev[item.sku],
                                        quantity: Math.max(1, Number(e.target.value || 1)),
                                      },
                                    }))
                                  }
                                />
                              </label>
                            ) : null}
                            <label className="block text-xs font-bold">
                              שורות פירוט
                              <textarea
                                className="mt-1 min-h-24 w-full rounded-xl border p-2"
                                value={(draft.bullets || []).join("\n")}
                                onChange={(e) =>
                                  setSelected((prev) => ({
                                    ...prev,
                                    [item.sku]: {
                                      ...prev[item.sku],
                                      bullets: e.target.value
                                        .split("\n")
                                        .map((x) => x.trim())
                                        .filter(Boolean),
                                    },
                                  }))
                                }
                              />
                            </label>
                          </div>
                        ) : null}
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 p-4 text-sm font-bold">
            <h3 className="mb-2 font-black">סיכום מחירים</h3>
            <p>חודשי: ₪{previewTotals.monthlyIls}</p>
            <p>שנתי: ₪{previewTotals.yearlyIls}</p>
            <p>חד־פעמי: ₪{previewTotals.oneTimeIls}</p>
            <p>שירותים נוספים: ₪{previewTotals.servicesIls}</p>
            <p className="mt-2 text-xs text-slate-500">
              אין מנגנון הנחות אחוזים פעיל במערכת — ניתן להתאים מחיר לרכיב בודד.
            </p>
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
