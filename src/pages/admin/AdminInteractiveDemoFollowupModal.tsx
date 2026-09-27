import React, { useCallback, useEffect, useMemo, useState } from "react";
import { X } from "lucide-react";
import {
  createGuidedDemo,
  fetchGuidedDemoCatalog,
  listGuidedDemos,
  resendGuidedDemo,
} from "../../api/guidedDemoApi";
import {
  demoContentSummary,
  demoLocaleNativeLabel,
  normalizeFullName,
  orderedPresets,
  resolveSelectedKeys,
  sourceNameForPrefill,
  sourcePhoneForPrefill,
  type GuidedDemoCatalog,
  type GuidedDemoLocale,
} from "../../guidedDemo/adminSendForm";
import {
  INTERACTIVE_DEMO_BUTTON,
  INTERACTIVE_DEMO_SENDER,
  INTERACTIVE_DEMO_TEMPLATE,
} from "./adminSupportChatDisplay";

const TEMPLATE_BODY =
  "Following up on our conversation yesterday, here’s an interactive demo for you to explore.";

const LOCALES: GuidedDemoLocale[] = ["en", "he", "es", "pt-BR", "ar"];

const MISSING_DEMO = "Create or select a demo before sending.";

export type InteractiveDemoChatContext = {
  customerName?: string;
  phone?: string;
  businessName?: string;
  sourceType?: "manual" | "early_access" | "customer" | "user";
  sourceLeadId?: string;
  sourceCustomerId?: string;
  preferredLocale?: string | null;
};

type HistoryRow = {
  _id?: string;
  id?: string;
  customerName?: string;
  locale?: string;
  presetKey?: string;
  selectedModules?: string[];
  status?: string;
  linkAvailable?: boolean;
  demoLink?: string;
};

function rowId(row: HistoryRow) {
  return String(row._id || row.id || "");
}

export default function AdminInteractiveDemoFollowupModal({
  open,
  onClose,
  onSent,
  context,
}: {
  open: boolean;
  onClose: () => void;
  onSent?: () => void;
  context: InteractiveDemoChatContext;
}) {
  const [catalog, setCatalog] = useState<GuidedDemoCatalog | null>(null);
  const [whatsappReady, setWhatsappReady] = useState(false);
  const [whatsappReason, setWhatsappReason] = useState("");
  const [history, setHistory] = useState<HistoryRow[]>([]);
  const [mode, setMode] = useState<"existing" | "new">("new");
  const [selectedId, setSelectedId] = useState("");
  const [locale, setLocale] = useState<GuidedDemoLocale>("en");
  const [presetKey, setPresetKey] = useState("full");
  const [submitting, setSubmitting] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState("");

  const customerName = sourceNameForPrefill(context.customerName);
  const phone = sourcePhoneForPrefill(context.phone);

  const load = useCallback(async () => {
    const cat = await fetchGuidedDemoCatalog({ managedConnectionId: "US_MANAGED" });
    setCatalog(cat.catalog);
    setWhatsappReady(Boolean(cat.delivery?.whatsapp?.available));
    setWhatsappReason(String(cat.delivery?.whatsapp?.reason || ""));
    const params: Record<string, string> = { limit: "20" };
    if (context.sourceLeadId) params.sourceLeadId = context.sourceLeadId;
    else if (context.sourceCustomerId) params.sourceCustomerId = context.sourceCustomerId;
    else if (phone) params.customerPhone = phone;
    const list =
      params.sourceLeadId || params.sourceCustomerId || params.customerPhone
        ? await listGuidedDemos(params).catch(() => ({ items: [] }))
        : { items: [] };
    const items = (list.items || []) as HistoryRow[];
    setHistory(items);
    const usable = items.find((row) => row.linkAvailable && rowId(row));
    if (usable) {
      setMode("existing");
      setSelectedId(rowId(usable));
    }
    setLoaded(true);
  }, [context.sourceLeadId, context.sourceCustomerId, phone]);

  useEffect(() => {
    if (!open) return;
    setError("");
    setLoaded(false);
    setSubmitting(false);
    setMode("new");
    setSelectedId("");
    setPresetKey("full");
    const preferred = String(context.preferredLocale || "en") as GuidedDemoLocale;
    setLocale(LOCALES.includes(preferred) ? preferred : "en");
    void load().catch((err) => {
      setLoaded(true);
      setError(err?.response?.data?.error || "טעינת הדמו נכשלה");
    });
  }, [open, context.preferredLocale, load]);

  const presets = orderedPresets(catalog);
  const selectedKeys = useMemo(
    () => resolveSelectedKeys({ catalog, presetKey, moduleKeys: [] }),
    [catalog, presetKey]
  );
  const selectedRow = history.find((row) => rowId(row) === selectedId) || null;
  const phoneDigits = phone.replace(/\D/g, "");
  const phoneOk = phoneDigits.length >= 8 && phoneDigits.length <= 15;
  const newDemoReady =
    Boolean(normalizeFullName(customerName)) && phoneOk && selectedKeys.length > 0;
  const existingReady = Boolean(selectedRow?.linkAvailable && rowId(selectedRow));
  const demoReady = mode === "existing" ? existingReady : newDemoReady;
  const canSend = demoReady && whatsappReady && !submitting;

  const selectedDemoLabel =
    mode === "existing"
      ? selectedRow
        ? demoContentSummary({
            catalog,
            presetKey: selectedRow.presetKey || "custom",
            selectedKeys: selectedRow.selectedModules || [],
          }) || selectedRow.customerName || "דמו קיים"
        : ""
      : demoContentSummary({ catalog, presetKey, selectedKeys });
  const selectedLocale =
    mode === "existing"
      ? demoLocaleNativeLabel(selectedRow?.locale || locale)
      : demoLocaleNativeLabel(locale);

  async function send() {
    if (!demoReady) {
      setError(MISSING_DEMO);
      return;
    }
    if (!whatsappReady || submitting) return;
    setSubmitting(true);
    setError("");
    try {
      const data =
        mode === "existing" && selectedRow
          ? await resendGuidedDemo(rowId(selectedRow), {
              forceUsInteractiveDemo: true,
            })
          : await createGuidedDemo({
              customerName: normalizeFullName(customerName),
              customerPhone: phone.trim(),
              businessName: context.businessName || "",
              presetKey,
              moduleKeys: selectedKeys,
              channel: "whatsapp",
              ttlHours: catalog?.defaultTtlHours || 24,
              send: true,
              locale,
              sourceType: context.sourceType || "manual",
              sourceLeadId: context.sourceLeadId || "",
              sourceCustomerId: context.sourceCustomerId || "",
              managedConnectionId: "US_MANAGED",
              forceUsInteractiveDemo: true,
            });
      if (!data?.delivery?.ok) {
        setError(data?.delivery?.error || "שליחת הדמו נכשלה");
        return;
      }
      onSent?.();
      onClose();
    } catch (err: any) {
      setError(err?.response?.data?.error || "שליחת הדמו נכשלה");
    } finally {
      setSubmitting(false);
    }
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[80] flex items-end justify-center bg-slate-950/50 p-0 sm:items-center sm:p-4"
      dir="rtl"
      data-testid="interactive-demo-send-modal"
    >
      <div className="flex max-h-[96vh] w-full max-w-xl flex-col overflow-hidden rounded-t-[28px] bg-white shadow-2xl sm:rounded-[28px]">
        <div className="flex items-start justify-between gap-3 border-b border-slate-100 px-5 py-4">
          <div>
            <h2 className="text-xl font-black text-slate-900">שליחת דמו אינטראקטיבי</h2>
            <p className="mt-1 text-sm font-semibold text-slate-500">
              נשלח כתבנית {INTERACTIVE_DEMO_TEMPLATE} מהמספר האמריקאי, גם בתוך חלון 24 השעות.
            </p>
          </div>
          <button type="button" onClick={onClose} aria-label="סגירה">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-5 py-4">
          <dl className="grid gap-2 rounded-2xl bg-slate-50 p-4 text-sm font-bold text-slate-700">
            <div className="flex justify-between gap-3">
              <dt>לקוח</dt>
              <dd>{customerName || "—"}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt>WhatsApp</dt>
              <dd dir="ltr">{phone || "—"}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt>Sender</dt>
              <dd dir="ltr" data-testid="interactive-demo-sender">
                {INTERACTIVE_DEMO_SENDER}
              </dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt>הדמו שנבחר</dt>
              <dd>{selectedDemoLabel || "—"}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt>שפת הדמו</dt>
              <dd>{demoReady ? selectedLocale : "—"}</dd>
            </div>
          </dl>

          <div className="flex gap-2">
            <button
              type="button"
              data-testid="interactive-demo-tab-existing"
              onClick={() => setMode("existing")}
              className={`rounded-full px-3 py-2 text-xs font-black ${
                mode === "existing" ? "bg-[#6D28D9] text-white" : "bg-slate-100 text-slate-700"
              }`}
            >
              בחירת דמו קיים
            </button>
            <button
              type="button"
              data-testid="interactive-demo-tab-new"
              onClick={() => setMode("new")}
              className={`rounded-full px-3 py-2 text-xs font-black ${
                mode === "new" ? "bg-[#6D28D9] text-white" : "bg-slate-100 text-slate-700"
              }`}
            >
              יצירת דמו חדש
            </button>
          </div>

          {mode === "existing" ? (
            <div className="space-y-2" data-testid="interactive-demo-existing-list">
              {history.length ? (
                history.map((row) => {
                  const id = rowId(row);
                  const active = id && id === selectedId;
                  return (
                    <button
                      key={id || row.customerName}
                      type="button"
                      disabled={!row.linkAvailable}
                      onClick={() => setSelectedId(id)}
                      className={`block w-full rounded-2xl border px-3 py-2 text-right text-sm font-bold disabled:opacity-40 ${
                        active ? "border-[#6D28D9] bg-violet-50" : "border-slate-200"
                      }`}
                    >
                      <span>{demoLocaleNativeLabel(row.locale)} · {row.status || "דמו"}</span>
                      {!row.linkAvailable ? (
                        <span className="mt-1 block text-xs text-amber-700">{MISSING_DEMO}</span>
                      ) : null}
                    </button>
                  );
                })
              ) : (
                <p className="text-sm font-bold text-slate-500">{MISSING_DEMO}</p>
              )}
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="text-sm font-black">
                שפת הדמו
                <select
                  className="mt-1 h-11 w-full rounded-xl border px-3 font-bold"
                  value={locale}
                  onChange={(e) => setLocale(e.target.value as GuidedDemoLocale)}
                  data-testid="interactive-demo-locale"
                >
                  {LOCALES.map((code) => (
                    <option key={code} value={code}>
                      {demoLocaleNativeLabel(code)}
                    </option>
                  ))}
                </select>
              </label>
              <label className="text-sm font-black">
                הדמו
                <select
                  className="mt-1 h-11 w-full rounded-xl border px-3 font-bold"
                  value={presetKey}
                  onChange={(e) => setPresetKey(e.target.value)}
                  data-testid="interactive-demo-preset"
                >
                  {(presets.length ? presets : [{ key: "full", title: "דמו מלא", moduleKeys: [] }]).map(
                    (preset) => (
                      <option key={preset.key} value={preset.key}>
                        {preset.title}
                      </option>
                    )
                  )}
                </select>
              </label>
            </div>
          )}

          <section
            className="rounded-2xl border border-slate-200 p-4"
            data-testid="interactive-demo-preview"
          >
            <p className="text-xs font-black text-slate-500">Preview</p>
            <p className="mt-2 text-sm font-semibold leading-6 text-slate-800" dir="ltr">
              {TEMPLATE_BODY}
            </p>
            <span
              className="mt-3 inline-flex rounded-full bg-[#6D28D9] px-3 py-1.5 text-xs font-black text-white"
              data-testid="interactive-demo-button-preview"
            >
              {INTERACTIVE_DEMO_BUTTON}
            </span>
          </section>

          {loaded && !demoReady ? (
            <p className="text-sm font-bold text-amber-800" data-testid="interactive-demo-missing">
              {MISSING_DEMO}
            </p>
          ) : null}
          {!whatsappReady && whatsappReason ? (
            <p className="text-sm font-bold text-amber-800">{whatsappReason}</p>
          ) : null}
          {error ? <p className="text-sm font-bold text-rose-600">{error}</p> : null}
        </div>

        <div className="border-t border-slate-100 px-5 py-4">
          <button
            type="button"
            data-testid="interactive-demo-send"
            disabled={!canSend}
            onClick={() => void send()}
            className="w-full rounded-2xl bg-[#6D28D9] px-4 py-3 text-sm font-black text-white disabled:opacity-40"
          >
            {submitting ? "שולח..." : "שלח דמו ב-WhatsApp"}
          </button>
        </div>
      </div>
    </div>
  );
}
