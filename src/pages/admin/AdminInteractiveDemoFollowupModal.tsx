import React, { useCallback, useEffect, useMemo, useState } from "react";
import { X } from "lucide-react";
import { createGuidedDemo, fetchGuidedDemoCatalog, resendGuidedDemo } from "../../api/guidedDemoApi";
import {
  demoContentSummary,
  demoLocaleNativeLabel,
  invitationIdOf,
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

const CREATE_BEFORE_SEND = "צרו דמו חדש לפני השליחה.";
const DIRECT_WINDOW_CLOSED = "זמין רק בתוך חלון 24 השעות של WhatsApp";
const TOKEN_PLACEHOLDER = "…";

type SendMode = "template" | "direct";

function directPreviewUrl(token: string) {
  const value = token || TOKEN_PLACEHOLDER;
  return `https://bizuply.com/demo/${value}`;
}

export type InteractiveDemoChatContext = {
  customerName?: string;
  phone?: string;
  businessName?: string;
  sourceType?: "manual" | "early_access" | "customer" | "user";
  sourceLeadId?: string;
  sourceCustomerId?: string;
  preferredLocale?: string | null;
};

function tokenFromDemoLink(demoLink?: string) {
  const match = String(demoLink || "").trim().match(/\/demo\/([^/?#]+)$/i);
  if (!match) return "";
  const token = decodeURIComponent(match[1]);
  if (!token || /[/?#\s%]/.test(token) || token.includes("{{") || /^https?:/i.test(token)) {
    return "";
  }
  return token;
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
  const [locale, setLocale] = useState<GuidedDemoLocale>("en");
  const [presetKey, setPresetKey] = useState("full");
  const [invitationId, setInvitationId] = useState("");
  const [demoToken, setDemoToken] = useState("");
  const [creating, setCreating] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [sendMode, setSendMode] = useState<SendMode>("template");
  const [sessionWindowOpen, setSessionWindowOpen] = useState(false);

  const customerName = sourceNameForPrefill(context.customerName);
  const phone = sourcePhoneForPrefill(context.phone);

  const load = useCallback(async () => {
    const cat = await fetchGuidedDemoCatalog({
      managedConnectionId: "US_MANAGED",
      phone,
    });
    setCatalog(cat.catalog);
    setWhatsappReady(Boolean(cat.delivery?.whatsapp?.available));
    setWhatsappReason(String(cat.delivery?.whatsapp?.reason || ""));
    setSessionWindowOpen(Boolean(cat.delivery?.usSessionWindow?.open));
  }, [phone]);

  useEffect(() => {
    if (!open) return;
    setError("");
    setCreating(false);
    setSending(false);
    setInvitationId("");
    setDemoToken("");
    setPresetKey("full");
    setSendMode("template");
    setSessionWindowOpen(false);
    const preferred = String(context.preferredLocale || "en") as GuidedDemoLocale;
    setLocale(LOCALES.includes(preferred) ? preferred : "en");
    void load().catch((err) => {
      setError(err?.response?.data?.error || "טעינת הדמו נכשלה");
    });
  }, [open, context.preferredLocale, load]);

  const presets = orderedPresets(catalog);
  const selectedKeys = useMemo(
    () => resolveSelectedKeys({ catalog, presetKey, moduleKeys: [] }),
    [catalog, presetKey]
  );
  const phoneDigits = phone.replace(/\D/g, "");
  const phoneOk = phoneDigits.length >= 8 && phoneDigits.length <= 15;
  const formReady =
    Boolean(normalizeFullName(customerName)) && phoneOk && selectedKeys.length > 0;
  const selectedDemoLabel = demoContentSummary({ catalog, presetKey, selectedKeys });
  const selectedLocale = demoLocaleNativeLabel(locale);
  const canCreate = formReady && !creating && !sending;
  const directAllowed = sessionWindowOpen;
  const activeMode: SendMode = sendMode === "direct" && directAllowed ? "direct" : "template";
  const canSend =
    Boolean(invitationId && demoToken) &&
    !creating &&
    !sending &&
    (activeMode === "direct" ? directAllowed : whatsappReady);

  function clearCreatedDemo() {
    setInvitationId("");
    setDemoToken("");
  }

  async function createDemo() {
    if (!canCreate) return;
    setCreating(true);
    setError("");
    clearCreatedDemo();
    try {
      const data = await createGuidedDemo({
        customerName: normalizeFullName(customerName),
        customerPhone: phone.trim(),
        businessName: context.businessName || "",
        presetKey,
        moduleKeys: selectedKeys,
        channel: "whatsapp",
        ttlHours: catalog?.defaultTtlHours || 24,
        send: false,
        locale,
        sourceType: context.sourceType || "manual",
        sourceLeadId: context.sourceLeadId || "",
        sourceCustomerId: context.sourceCustomerId || "",
        managedConnectionId: "US_MANAGED",
        forceUsInteractiveDemo: true,
      });
      const id = invitationIdOf(data?.invitation);
      const token = tokenFromDemoLink(data?.demoLink);
      if (!id || !token) {
        setError("יצירת הדמו נכשלה — לא התקבל token");
        return;
      }
      setInvitationId(id);
      setDemoToken(token);
    } catch (err: any) {
      setError(err?.response?.data?.error || "יצירת הדמו נכשלה");
    } finally {
      setCreating(false);
    }
  }

  async function send() {
    if (!canSend) return;
    setSending(true);
    setError("");
    try {
      const data = await resendGuidedDemo(invitationId, {
        forceUsInteractiveDemo: true,
        sendMode: activeMode,
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
      setSending(false);
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
              {activeMode === "direct"
                ? "נשלח כהודעת WhatsApp רגילה מהמספר האמריקאי, רק בתוך חלון 24 השעות."
                : `נשלח כתבנית ${INTERACTIVE_DEMO_TEMPLATE} מהמספר האמריקאי, גם מחוץ לחלון 24 השעות.`}
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
              <dd>{selectedLocale}</dd>
            </div>
          </dl>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="text-sm font-black">
              שפת הדמו
              <select
                className="mt-1 h-11 w-full rounded-xl border px-3 font-bold"
                value={locale}
                onChange={(e) => {
                  setLocale(e.target.value as GuidedDemoLocale);
                  clearCreatedDemo();
                }}
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
              סוג הדמו
              <select
                className="mt-1 h-11 w-full rounded-xl border px-3 font-bold"
                value={presetKey}
                onChange={(e) => {
                  setPresetKey(e.target.value);
                  clearCreatedDemo();
                }}
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

          <section className="space-y-2" data-testid="interactive-demo-send-mode">
            <p className="text-sm font-black text-slate-900">אופן שליחה</p>
            <button
              type="button"
              data-testid="interactive-demo-mode-template"
              aria-pressed={activeMode === "template"}
              onClick={() => setSendMode("template")}
              className={`w-full rounded-2xl border px-4 py-3 text-right transition ${
                activeMode === "template"
                  ? "border-[#6D28D9] bg-violet-50 shadow-sm"
                  : "border-slate-200 bg-white hover:border-slate-300"
              }`}
            >
              <span className="flex items-start justify-between gap-3">
                <span>
                  <span className="block text-sm font-black text-slate-900">
                    {activeMode === "template" ? "✓ " : ""}עם תבנית WhatsApp
                  </span>
                  <span className="mt-1 block text-xs font-bold text-slate-500">
                    מומלץ · עובד גם אחרי 24 שעות
                  </span>
                </span>
              </span>
            </button>
            <button
              type="button"
              data-testid="interactive-demo-mode-direct"
              aria-pressed={activeMode === "direct"}
              disabled={!directAllowed}
              onClick={() => {
                if (directAllowed) setSendMode("direct");
              }}
              className={`w-full rounded-2xl border px-4 py-3 text-right transition disabled:cursor-not-allowed disabled:opacity-50 ${
                activeMode === "direct"
                  ? "border-[#6D28D9] bg-violet-50 shadow-sm"
                  : "border-slate-200 bg-white hover:border-slate-300"
              }`}
            >
              <span className="block text-sm font-black text-slate-900">
                {activeMode === "direct" ? "✓ " : ""}דמו בלבד
              </span>
              <span className="mt-1 block text-xs font-bold text-slate-500">
                {directAllowed ? "זמין בתוך חלון 24 השעות" : DIRECT_WINDOW_CLOSED}
              </span>
            </button>
          </section>

          <section
            className="rounded-2xl border border-slate-200 p-4"
            data-testid="interactive-demo-preview"
          >
            <p className="text-xs font-black text-slate-500">Preview</p>
            {activeMode === "direct" ? (
              <div dir="ltr" className="mt-2 text-sm font-semibold leading-6 text-slate-800">
                <p>Interactive demo:</p>
                <p className="break-all text-[#6D28D9]" data-testid="interactive-demo-direct-preview">
                  {directPreviewUrl(demoToken)}
                </p>
              </div>
            ) : (
              <>
                <p className="mt-2 text-sm font-semibold leading-6 text-slate-800" dir="ltr">
                  {TEMPLATE_BODY}
                </p>
                <span
                  className="mt-3 inline-flex rounded-full bg-[#6D28D9] px-3 py-1.5 text-xs font-black text-white"
                  data-testid="interactive-demo-button-preview"
                >
                  {INTERACTIVE_DEMO_BUTTON}
                </span>
              </>
            )}
            <p className="mt-3 text-xs font-bold text-slate-500">
              {selectedLocale}
              {selectedDemoLabel ? ` · ${selectedDemoLabel}` : ""}
              {demoToken ? " · הדמו מוכן לשליחה" : ""}
            </p>
          </section>

          {!demoToken ? (
            <p className="text-sm font-bold text-amber-800" data-testid="interactive-demo-missing">
              {CREATE_BEFORE_SEND}
            </p>
          ) : null}
          {activeMode === "template" && !whatsappReady && whatsappReason ? (
            <p className="text-sm font-bold text-amber-800">{whatsappReason}</p>
          ) : null}
          {error ? <p className="text-sm font-bold text-rose-600">{error}</p> : null}
        </div>

        <div className="flex flex-col gap-2 border-t border-slate-100 px-5 py-4">
          <button
            type="button"
            data-testid="interactive-demo-create"
            disabled={!canCreate}
            onClick={() => void createDemo()}
            className="w-full rounded-2xl border border-[#6D28D9] px-4 py-3 text-sm font-black text-[#6D28D9] disabled:opacity-40"
          >
            {creating ? "יוצר דמו..." : "יצירת דמו חדש"}
          </button>
          <button
            type="button"
            data-testid="interactive-demo-send"
            disabled={!canSend}
            onClick={() => void send()}
            className="w-full rounded-2xl bg-[#6D28D9] px-4 py-3 text-sm font-black text-white disabled:opacity-40"
          >
            {sending
              ? "שולח..."
              : activeMode === "direct"
                ? "שלח דמו"
                : "שלח דמו עם תבנית"}
          </button>
        </div>
      </div>
    </div>
  );
}
