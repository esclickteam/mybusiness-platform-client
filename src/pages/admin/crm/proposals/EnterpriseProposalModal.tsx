import React, { useEffect, useMemo, useState } from "react";
import adminCrmApi from "../../../../api/adminCrmApi";
import { AdminModal } from "../AdminModal";
import { PrimaryButton, SecondaryButton } from "../AdminCrmUi";
import EnterpriseProposalView, {
  type EnterpriseSection,
  type EnterpriseSnapshot,
} from "./EnterpriseProposalView";

type CancellationOption = { key: string; labelHe: string; text: string };

function defaultExpiryIso() {
  const d = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 16);
}

function newId() {
  return Math.random().toString(36).slice(2, 10);
}

function sanitizePriceInput(raw: string): number | null {
  const cleaned = String(raw || "").trim().replace(",", ".");
  if (!cleaned) return 0;
  if (!/^\d+(\.\d{0,2})?$/.test(cleaned)) return null;
  const n = Number(cleaned);
  if (!Number.isFinite(n) || n < 0) return null;
  return Math.round(n * 100) / 100;
}

function emptySection(): EnterpriseSection {
  return { id: newId(), title: "", items: [""] };
}

function moveItem<T>(list: T[], from: number, to: number) {
  if (from === to || from < 0 || to < 0 || from >= list.length || to >= list.length) return list;
  const next = [...list];
  const [row] = next.splice(from, 1);
  next.splice(to, 0, row);
  return next;
}

export default function EnterpriseProposalModal({
  open,
  customerId,
  existing,
  onClose,
  onIssued,
}: {
  open: boolean;
  customerId: string;
  existing?: any;
  onClose: () => void;
  onIssued?: (proposal: any) => void;
}) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState<"edit" | "preview" | "issued">("edit");
  const [proposalId, setProposalId] = useState("");
  const [issued, setIssued] = useState<any>(null);
  const [customerName, setCustomerName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [expiresAt, setExpiresAt] = useState(defaultExpiryIso());
  const [title, setTitle] = useState("מערכת ניהול ואוטומציה בהתאמה אישית");
  const [setupInput, setSetupInput] = useState("");
  const [monthlyInput, setMonthlyInput] = useState("");
  const [projectGoal, setProjectGoal] = useState("");
  const [sections, setSections] = useState<EnterpriseSection[]>([emptySection()]);
  const [openSection, setOpenSection] = useState("");
  const [termsText, setTermsText] = useState("");
  const [cancellationTerms, setCancellationTerms] = useState("");
  const [cancellationOptions, setCancellationOptions] = useState<CancellationOption[]>([]);
  const [defaultTerms, setDefaultTerms] = useState("");
  const [defaultCancellation, setDefaultCancellation] = useState("");
  const [defaultThirdParty, setDefaultThirdParty] = useState(
    "עלויות WhatsApp, הודעות, ספקי תקשורת ושירותי צד ג' יחויבו בנפרד בהתאם לשימוש ולתעריפי הספק."
  );
  const [thirdPartyOn, setThirdPartyOn] = useState(false);
  const [thirdPartyText, setThirdPartyText] = useState("");
  const [dragSection, setDragSection] = useState<number | null>(null);
  const [dragItem, setDragItem] = useState<{ section: number; item: number } | null>(null);

  useEffect(() => {
    if (!open) return;
    let alive = true;
    (async () => {
      setLoading(true);
      setError("");
      setStep("edit");
      setIssued(null);
      try {
        const [{ data: catalogData }, { data: ctxData }] = await Promise.all([
          adminCrmApi.proposalCatalog(),
          adminCrmApi.proposalContext(customerId),
        ]);
        if (!alive) return;
        setDefaultTerms(catalogData.defaultTerms || "");
        setDefaultCancellation(catalogData.defaultCancellationTerms || "");
        setCancellationOptions(catalogData.cancellationOptions || []);
        if (catalogData.defaultThirdPartyFeesText) {
          setDefaultThirdParty(catalogData.defaultThirdPartyFeesText);
        }
        setCustomerName(existing?.customerName || ctxData.context?.customerName || "");
        setBusinessName(existing?.businessName || ctxData.context?.businessName || "");
        const ent: EnterpriseSnapshot = existing?.enterprise || {};
        setProposalId(existing?.id && existing?.status === "draft" ? existing.id : "");
        setTitle(ent.title || "מערכת ניהול ואוטומציה בהתאמה אישית");
        setSetupInput(ent.setupPriceIls ? String(ent.setupPriceIls) : "");
        setMonthlyInput(ent.monthlyPriceIls ? String(ent.monthlyPriceIls) : "");
        setProjectGoal(ent.projectGoal || "");
        setSections(ent.sections?.length ? ent.sections : [emptySection()]);
        setOpenSection(ent.sections?.[0]?.id || "");
        setTermsText(ent.termsText || existing?.termsText || catalogData.defaultTerms || "");
        setCancellationTerms(
          ent.cancellationTerms || existing?.cancellationTerms || catalogData.defaultCancellationTerms || ""
        );
        setThirdPartyOn(Boolean(ent.thirdPartyFeesEnabled));
        setThirdPartyText(ent.thirdPartyFeesText || catalogData.defaultThirdPartyFeesText || "");
        if (existing?.expiresAt) {
          const d = new Date(existing.expiresAt);
          d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
          setExpiresAt(d.toISOString().slice(0, 16));
        } else {
          setExpiresAt(defaultExpiryIso());
        }
      } catch (err: any) {
        if (alive) setError(err?.response?.data?.error || "טעינה נכשלה");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [open, customerId, existing]);

  const setupPrice = sanitizePriceInput(setupInput) ?? 0;
  const monthlyPrice = sanitizePriceInput(monthlyInput) ?? 0;

  const enterprisePayload: EnterpriseSnapshot = useMemo(
    () => ({
      title: title.trim(),
      projectGoal: projectGoal.trim(),
      sections: sections
        .map((section) => ({
          ...section,
          title: section.title.trim(),
          items: section.items.map((item) => item.trim()).filter(Boolean),
        }))
        .filter((section) => section.title || section.items.length),
      setupPriceIls: setupPrice,
      monthlyPriceIls: monthlyPrice,
      termsText,
      cancellationTerms,
      thirdPartyFeesEnabled: thirdPartyOn,
      thirdPartyFeesText: thirdPartyOn ? thirdPartyText : "",
    }),
    [
      title,
      projectGoal,
      sections,
      setupPrice,
      monthlyPrice,
      termsText,
      cancellationTerms,
      thirdPartyOn,
      thirdPartyText,
    ]
  );

  async function persistDraft() {
    const body = {
      kind: "enterprise",
      customerName,
      businessName,
      expiresAt: new Date(expiresAt).toISOString(),
      enterprise: enterprisePayload,
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
      if (!title.trim()) {
        setError("יש למלא שם להצעה");
        return;
      }
      if (setupPrice <= 0 && monthlyPrice <= 0) {
        setError("יש להזין סכום הקמה או מנוי חודשי");
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

  function patchSection(index: number, patch: Partial<EnterpriseSection>) {
    setSections((prev) => prev.map((row, i) => (i === index ? { ...row, ...patch } : row)));
  }

  function patchItem(sectionIndex: number, itemIndex: number, value: string) {
    setSections((prev) =>
      prev.map((row, i) =>
        i === sectionIndex
          ? { ...row, items: row.items.map((item, j) => (j === itemIndex ? value : item)) }
          : row
      )
    );
  }

  return (
    <AdminModal
      open={open}
      onClose={onClose}
      title="יצירת הצעה מותאמת אישית"
      eyebrow="Enterprise"
      size="full"
      footer={
        step === "issued" ? (
          <PrimaryButton onClick={onClose}>סיום</PrimaryButton>
        ) : step === "preview" ? (
          <div className="flex flex-wrap gap-2">
            <SecondaryButton onClick={() => setStep("edit")}>חזרה לעריכה</SecondaryButton>
            <PrimaryButton disabled={saving} onClick={() => void issue()}>
              {saving ? "יוצר קישור..." : "יצירת קישור להצעה"}
            </PrimaryButton>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            <SecondaryButton onClick={onClose}>ביטול</SecondaryButton>
            <PrimaryButton disabled={saving || loading} onClick={() => void goPreview()}>
              {saving ? "שומר..." : "תצוגה מקדימה"}
            </PrimaryButton>
          </div>
        )
      }
    >
      {error ? <p className="mb-3 text-sm font-bold text-rose-600">{error}</p> : null}
      {loading ? <p className="text-sm font-bold text-slate-500">טוען...</p> : null}

      {step === "issued" && issued ? (
        <div className="space-y-4">
          <h3 className="text-xl font-black text-emerald-700">ההצעה מוכנה</h3>
          <p className="text-sm font-bold text-slate-600">{issued.proposalNumber}</p>
          <p className="break-all rounded-2xl bg-slate-50 p-3 text-left text-sm font-bold" dir="ltr">
            {issued.publicUrl}
          </p>
          <div className="flex flex-wrap gap-2">
            <PrimaryButton onClick={() => void navigator.clipboard?.writeText(issued.publicUrl || "")}>
              העתקת קישור
            </PrimaryButton>
            <SecondaryButton
              onClick={() => {
                const text = encodeURIComponent(
                  `היי, הכנו לך הצעה מותאמת אישית ב-BizUply:\n${issued.publicUrl}`
                );
                window.open(`https://wa.me/?text=${text}`, "_blank");
              }}
            >
              שליחה ללקוח
            </SecondaryButton>
          </div>
        </div>
      ) : null}

      {step === "preview" ? (
        <EnterpriseProposalView
          proposal={{
            proposalNumber: "תצוגה מקדימה",
            customerName,
            businessName,
            expiresAt: new Date(expiresAt).toISOString(),
            createdAt: new Date().toISOString(),
            enterprise: enterprisePayload,
            termsText,
            cancellationTerms,
          }}
          footer={
            <div className="border-t border-slate-100 pt-6">
              <div className="min-h-12 rounded-2xl bg-[#6D28D9] px-4 py-3 text-center text-base font-black text-white">
                אישור ההצעה ומעבר לתשלום
              </div>
            </div>
          }
        />
      ) : null}

      {step === "edit" && !loading ? (
        <div className="space-y-8">
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
            <label className="text-sm font-black sm:col-span-2">
              תוקף ההצעה
              <input
                type="datetime-local"
                className="mt-1 min-h-11 w-full rounded-2xl border px-3"
                value={expiresAt}
                onChange={(e) => setExpiresAt(e.target.value)}
              />
            </label>
          </section>

          <section className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <label className="rounded-3xl border-2 border-slate-200 bg-slate-50 p-4 text-sm font-black">
              הקמה חד־פעמית
              <div className="mt-2 flex items-center gap-2">
                <input
                  inputMode="decimal"
                  className="min-h-12 w-full rounded-2xl border bg-white px-3 text-xl font-black"
                  value={setupInput}
                  onChange={(e) => setSetupInput(e.target.value)}
                  placeholder="4,990"
                />
                <span className="shrink-0 text-sm font-bold text-slate-500">₪</span>
              </div>
            </label>
            <label className="rounded-3xl border-2 border-violet-200 bg-violet-50 p-4 text-sm font-black">
              מנוי חודשי
              <div className="mt-2 flex items-center gap-2">
                <input
                  inputMode="decimal"
                  className="min-h-12 w-full rounded-2xl border bg-white px-3 text-xl font-black"
                  value={monthlyInput}
                  onChange={(e) => setMonthlyInput(e.target.value)}
                  placeholder="590"
                />
                <span className="shrink-0 text-sm font-bold text-slate-500">₪ / חודש</span>
              </div>
            </label>
          </section>

          <label className="block text-sm font-black">
            שם ההצעה
            <input
              className="mt-1 min-h-12 w-full rounded-2xl border px-3 text-base"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="מערכת ניהול ואוטומציה בהתאמה אישית"
            />
          </label>

          <section>
            <h3 className="text-lg font-black">מטרת הפרויקט</h3>
            <textarea
              className="mt-2 min-h-32 w-full rounded-2xl border p-3 text-sm leading-7"
              value={projectGoal}
              onChange={(e) => setProjectGoal(e.target.value)}
              placeholder="הקמת מערכת ניהול ואוטומציה מותאמת לתהליכי העבודה של העסק..."
            />
          </section>

          <section>
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-lg font-black">מה כולל הפרויקט</h3>
              <button
                type="button"
                className="rounded-xl bg-[#6D28D9] px-3 py-2 text-xs font-black text-white"
                onClick={() => {
                  const next = emptySection();
                  setSections((prev) => [...prev, next]);
                  setOpenSection(next.id);
                }}
              >
                + הוספת תת־כותרת
              </button>
            </div>
            <div className="space-y-3">
              {sections.map((section, sectionIndex) => (
                <div
                  key={section.id}
                  draggable
                  onDragStart={() => setDragSection(sectionIndex)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => {
                    if (dragSection == null) return;
                    setSections((prev) => moveItem(prev, dragSection, sectionIndex));
                    setDragSection(null);
                  }}
                  className="rounded-2xl border border-slate-200 bg-white"
                >
                  <div className="flex items-center gap-2 p-3">
                    <button
                      type="button"
                      className="cursor-grab text-slate-400"
                      aria-label="גרירת תת־כותרת"
                    >
                      ⋮⋮
                    </button>
                    <input
                      className="min-h-10 flex-1 rounded-xl border px-3 text-sm font-black"
                      value={section.title}
                      onChange={(e) => patchSection(sectionIndex, { title: e.target.value })}
                      placeholder="תת־כותרת, למשל אפיון והקמת CRM"
                    />
                    <button
                      type="button"
                      className="text-xs font-black text-[#6D28D9]"
                      onClick={() => setOpenSection((id) => (id === section.id ? "" : section.id))}
                    >
                      {openSection === section.id ? "סגירה" : "פתיחה"}
                    </button>
                    <button
                      type="button"
                      className="text-xs font-black text-rose-600"
                      onClick={() => setSections((prev) => prev.filter((_, i) => i !== sectionIndex))}
                    >
                      מחיקה
                    </button>
                  </div>
                  {openSection === section.id ? (
                    <div className="space-y-2 border-t border-slate-100 p-3">
                      {section.items.map((item, itemIndex) => (
                        <div
                          key={`${section.id}-${itemIndex}`}
                          draggable
                          onDragStart={() => setDragItem({ section: sectionIndex, item: itemIndex })}
                          onDragOver={(e) => e.preventDefault()}
                          onDrop={() => {
                            if (!dragItem || dragItem.section !== sectionIndex) return;
                            patchSection(sectionIndex, {
                              items: moveItem(section.items, dragItem.item, itemIndex),
                            });
                            setDragItem(null);
                          }}
                          className="flex items-center gap-2"
                        >
                          <span className="cursor-grab text-slate-300">⋮⋮</span>
                          <input
                            className="min-h-10 flex-1 rounded-xl border px-3 text-sm"
                            value={item}
                            onChange={(e) => patchItem(sectionIndex, itemIndex, e.target.value)}
                            placeholder="סעיף"
                          />
                          <button
                            type="button"
                            className="text-xs font-black text-rose-600"
                            onClick={() =>
                              patchSection(sectionIndex, {
                                items: section.items.filter((_, i) => i !== itemIndex),
                              })
                            }
                          >
                            מחיקה
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        className="text-xs font-black text-[#6D28D9]"
                        onClick={() =>
                          patchSection(sectionIndex, { items: [...section.items, ""] })
                        }
                      >
                        + הוספת סעיף
                      </button>
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          </section>

          <section>
            <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-lg font-black">תנאי החבילה</h3>
              <button
                type="button"
                className="text-xs font-black text-[#6D28D9]"
                onClick={() => setTermsText(defaultTerms)}
              >
                השתמש בתנאי החבילה הקיימים
              </button>
            </div>
            <textarea
              className="min-h-32 w-full rounded-2xl border p-3 text-sm leading-7"
              value={termsText}
              onChange={(e) => setTermsText(e.target.value)}
            />
          </section>

          <section>
            <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-lg font-black">תנאי ביטול</h3>
              <button
                type="button"
                className="text-xs font-black text-[#6D28D9]"
                onClick={() => setCancellationTerms(defaultCancellation)}
              >
                השתמש בתנאי הביטול הקיימים
              </button>
            </div>
            {cancellationOptions.length ? (
              <select
                className="mb-2 min-h-11 w-full rounded-2xl border px-3 text-sm font-bold"
                value=""
                onChange={(e) => {
                  const opt = cancellationOptions.find((row) => row.key === e.target.value);
                  if (opt) setCancellationTerms(opt.text);
                }}
              >
                <option value="">בחירת תנאי ביטול מהמערכת</option>
                {cancellationOptions.map((opt) => (
                  <option key={opt.key} value={opt.key}>
                    {opt.labelHe}
                  </option>
                ))}
              </select>
            ) : null}
            <textarea
              className="min-h-28 w-full rounded-2xl border p-3 text-sm leading-7"
              value={cancellationTerms}
              onChange={(e) => setCancellationTerms(e.target.value)}
            />
          </section>

          <section className="rounded-2xl border border-slate-200 p-4">
            <label className="flex items-center gap-2 text-sm font-black">
              <input
                type="checkbox"
                checked={thirdPartyOn}
                onChange={(e) => {
                  setThirdPartyOn(e.target.checked);
                  if (e.target.checked && !thirdPartyText) setThirdPartyText(defaultThirdParty);
                }}
              />
              עלויות צד ג' אינן כלולות במחיר
            </label>
            {thirdPartyOn ? (
              <textarea
                className="mt-3 min-h-24 w-full rounded-2xl border p-3 text-sm leading-7"
                value={thirdPartyText}
                onChange={(e) => setThirdPartyText(e.target.value)}
              />
            ) : null}
          </section>
        </div>
      ) : null}
    </AdminModal>
  );
}
