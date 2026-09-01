import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import adminCrmApi from "../../../../api/adminCrmApi";
import { getAdminManagedWhatsAppStatus } from "../../../../api/adminManagedWhatsAppApi";
import { Badge, WHATSAPP_INBOX_STATUS_LABELS } from "../adminCrmLabels";
import { SecondaryButton } from "../AdminCrmUi";
import { WhatsAppMessageBody } from "./WhatsAppMediaBubble";
import { WhatsAppMessageComposer } from "./WhatsAppMessageComposer";
import type { StagedWhatsAppFile } from "./whatsappMedia";
import { WhatsAppWebTicks } from "./WhatsAppWebTicks";
import { useAdminCrmWhatsAppRealtime } from "./useAdminCrmWhatsAppRealtime";
import {
  applyStatusPatch,
  buildMessageFeed,
  formatClock,
  inboundEventMatches,
  mergeMessages,
  type PublicWhatsAppMessage,
} from "./whatsAppWebMessages";
import {
  isNearBottom,
  preserveScrollerOnResize,
  scrollScrollerToBottom,
} from "./whatsAppWebScroll";

type Template = {
  id: string;
  name: string;
  language: string;
  languageLabel?: string;
  status: string;
  statusLabel?: string;
  variables: string[];
  buttonVariables?: Array<{
    key: string;
    label?: string;
    buttonIndex?: number;
    buttonText?: string;
    kind?: string;
  }>;
  headerVariables?: string[];
  body?: string;
  prefill?: Record<string, string>;
};

const CHAT_COLUMN_CLASS =
  "mx-auto flex h-full min-h-0 w-full min-w-0 max-w-[920px] flex-col";

const SEND_FROM_OPTIONS = [
  { id: "IL_MANAGED", flag: "🇮🇱", label: "Israel" },
  { id: "US_MANAGED", flag: "🇺🇸", label: "USA" },
] as const;

function inboundReceivedOnLabel(message: PublicWhatsAppMessage) {
  if (message.receivedOnLabel) return message.receivedOnLabel;
  const id = String(message.managedConnectionId || "").trim().toUpperCase();
  const preset = SEND_FROM_OPTIONS.find((row) => row.id === id);
  if (preset) return `${preset.flag} ${preset.label}`;
  if (message.sendFromLabel) return message.sendFromLabel;
  return "";
}

const CHAT_WALLPAPER_STYLE: React.CSSProperties = {
  backgroundColor: "#efeae2",
  backgroundImage:
    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='72' height='72' viewBox='0 0 72 72'%3E%3Cg fill='%23c9c2b8' fill-opacity='0.22'%3E%3Ccircle cx='8' cy='10' r='1.1'/%3E%3Ccircle cx='40' cy='18' r='1.1'/%3E%3Ccircle cx='22' cy='46' r='1.1'/%3E%3Ccircle cx='58' cy='52' r='1.1'/%3E%3C/g%3E%3C/svg%3E\")",
};

export default function WhatsAppWebThread({
  customerId,
  threadId,
  phone: phoneProp,
  contactName: contactNameProp,
  canSend,
  canTemplates,
  canDemo = true,
  onBanner,
  initialIntent = "message",
  showConnectionCards = false,
  onBack,
  onOpenSendDemo,
}: {
  customerId?: string | null;
  threadId?: string | null;
  phone?: string | null;
  contactName?: string | null;
  canSend: boolean;
  canTemplates: boolean;
  canDemo?: boolean;
  onBanner: (msg: string) => void;
  initialIntent?: "message" | "follow_up" | "demo" | "payment";
  showConnectionCards?: boolean;
  onBack?: () => void;
  onOpenSendDemo?: () => void;
}) {
  const [data, setData] = useState<any>(null);
  const [messages, setMessages] = useState<PublicWhatsAppMessage[]>([]);
  const [error, setError] = useState("");
  const [intent, setIntent] = useState<"message" | "follow_up" | "demo" | "payment">(
    initialIntent
  );
  const [templateId, setTemplateId] = useState("");
  const [body, setBody] = useState("");
  const [vars, setVars] = useState<Record<string, string>>({});
  const [preview, setPreview] = useState("");
  const [modules, setModules] = useState<string[]>(["dashboard", "crm"]);
  const [paymentPlan, setPaymentPlan] = useState("monthly");
  const [sending, setSending] = useState(false);
  const [stagedFile, setStagedFile] = useState<StagedWhatsAppFile | null>(null);
  const [unseen, setUnseen] = useState(0);
  const [sendFromConnectionId, setSendFromConnectionId] = useState("IL_MANAGED");
  const [managedConnections, setManagedConnections] = useState<
    Array<{ connectionId: string; ready: boolean }>
  >([
    { connectionId: "IL_MANAGED", ready: true },
    { connectionId: "US_MANAGED", ready: false },
  ]);
  const stickRef = useRef(true);
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const lastScrollTopRef = useRef(0);
  const sendingRef = useRef(false);

  const templates: Template[] = data?.bizuplyManaged?.templates || [];
  const selected = templates.find((t) => t.id === templateId);
  const sessionOpen = Boolean(data?.bizuplyManaged?.sessionWindowOpen);
  const sender = data?.bizuplyManaged?.sender || {};
  const senderReady = Boolean(
    sender.sendReady ?? (sender.ready && sender.registrationStatus !== "required")
  );
  const sendFromReady = useMemo(() => {
    const row = managedConnections.find(
      (conn) => conn.connectionId === sendFromConnectionId
    );
    return row?.ready !== false;
  }, [managedConnections, sendFromConnectionId]);
  const composerSendReady = sendFromReady && senderReady;
  const needsRegistration =
    Boolean(sender.ready) &&
    (sender.phoneRegistered === false ||
      sender.registrationStatus === "required" ||
      sender.registrationStatus === "failed" ||
      sender.registrationStatus === "pending");
  const linkedCustomerId =
    customerId ||
    data?.bizuplyManaged?.thread?.adminCustomerId ||
    data?.thread?.adminCustomerId ||
    null;
  const contactName =
    contactNameProp ||
    data?.customerConnection?.customerName ||
    data?.bizuplyManaged?.prefill?.contact_name ||
    data?.bizuplyManaged?.prefill?.name ||
    data?.thread?.name ||
    "";
  const matchPhone =
    phoneProp ||
    data?.bizuplyManaged?.prefill?.phone ||
    data?.bizuplyManaged?.thread?.phone ||
    "";

  const scrollToBottom = useCallback((smooth = false) => {
    scrollScrollerToBottom(scrollerRef.current, smooth);
  }, []);

  const loadMessages = useCallback(
    async (since?: string) => {
      if (customerId) {
        const { data: hist } = await adminCrmApi.whatsappMessages(customerId, {
          since,
          limit: since ? 500 : 500,
        });
        return (hist.messages || []) as PublicWhatsAppMessage[];
      }
      if (threadId) {
        const { data: hist } = await adminCrmApi.whatsappThreadMessages(threadId, {
          since,
          limit: since ? 500 : 500,
        });
        if (hist.thread) {
          setData((prev: any) => ({
            ...(prev || {}),
            thread: hist.thread,
            bizuplyManaged: {
              ...(prev?.bizuplyManaged || {}),
              thread: {
                ...(prev?.bizuplyManaged?.thread || {}),
                ...hist.thread,
              },
            },
          }));
        }
        return (hist.messages || []) as PublicWhatsAppMessage[];
      }
      return [];
    },
    [customerId, threadId]
  );

  const load = useCallback(async () => {
    setError("");
    try {
      const nextMessages = await loadMessages();
      setMessages(nextMessages);
      if (customerId) {
        const { data: wa } = await adminCrmApi.whatsapp(customerId);
        setData(wa);
        if ((wa.bizuplyManaged?.thread?.unreadCount || 0) > 0) {
          await adminCrmApi.whatsappRead(customerId).catch(() => null);
        }
      }
      requestAnimationFrame(() => scrollToBottom(false));
    } catch (err: any) {
      setError(err?.response?.data?.error || "טעינת WhatsApp נכשלה");
    }
  }, [customerId, loadMessages, scrollToBottom]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    getAdminManagedWhatsAppStatus()
      .then((st) => {
        const rows = (st.connections || [])
          .filter((conn) => {
            const id = String(conn.connectionId || "").toUpperCase();
            return id === "IL_MANAGED" || id === "US_MANAGED";
          })
          .map((conn) => {
            const status = String(conn.connectionStatus || "").toUpperCase();
            const ready =
              status === "READY" ||
              status === "CONNECTED" ||
              Boolean(conn.credentialsConfigured);
            return {
              connectionId: String(conn.connectionId || "").toUpperCase(),
              ready,
            };
          });
        if (rows.length) setManagedConnections(rows);
        const defaultId = String(
          st.defaultManagedConnectionId || "IL_MANAGED"
        ).toUpperCase();
        if (defaultId === "IL_MANAGED" || defaultId === "US_MANAGED") {
          setSendFromConnectionId(defaultId);
        }
      })
      .catch(() => null);
  }, []);

  const sendFromOptions = useMemo(() => SEND_FROM_OPTIONS, []);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(() => {
      preserveScrollerOnResize(el, {
        wasNearBottom: stickRef.current,
        previousScrollTop: lastScrollTopRef.current,
      });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [customerId, threadId]);

  useEffect(() => {
    if (!templateId) {
      setVars({});
      setPreview("");
      return;
    }
    if (!selected) return;
    setVars((prev) => ({ ...(selected.prefill || {}), ...prev }));
  }, [templateId]);

  const lastStamp = messages.length
    ? messages[messages.length - 1]?.timestamp
    : null;

  const mappedVars = useMemo(() => {
    const next: Record<string, string> = { ...vars };
    if (selected?.prefill) {
      for (const [k, v] of Object.entries(selected.prefill)) {
        if (!next[k]) next[k] = v;
      }
    }
    return next;
  }, [vars, selected]);

  const matchCtx = {
    customerId: customerId || null,
    threadId: threadId || null,
    phone: matchPhone,
  };

  useAdminCrmWhatsAppRealtime({
    onMessage: (payload) => {
      if (!inboundEventMatches(payload, matchCtx) || !payload.message) return;
      setMessages((prev) => mergeMessages(prev, payload.message!));
      if (stickRef.current) {
        requestAnimationFrame(() => scrollToBottom(true));
        setUnseen(0);
      } else if (payload.message.direction === "inbound") {
        setUnseen((n) => n + 1);
      }
    },
    onStatus: (payload) => {
      if (!inboundEventMatches(payload, matchCtx)) return;
      setMessages((prev) => applyStatusPatch(prev, payload));
    },
    onReconnect: () => {
      const since =
        lastStamp instanceof Date
          ? lastStamp.toISOString()
          : lastStamp
            ? String(lastStamp)
            : undefined;
      loadMessages(since)
        .then((rows) => {
          if (!rows.length) return;
          setMessages((prev) => {
            const next = mergeMessages(prev, rows);
            const added = next.length > prev.length;
            if (added && stickRef.current) {
              requestAnimationFrame(() => scrollToBottom(false));
            }
            return next;
          });
        })
        .catch(() => null);
    },
  });

  async function buildPreview() {
    if (!customerId || !templateId) {
      setPreview(body);
      return;
    }
    try {
      const { data: res } = await adminCrmApi.whatsappPreview(customerId, {
        templateId,
        vars: mappedVars,
        intent,
      });
      setPreview(res.preview?.preview || "");
      if (res.preview?.mapped) setVars(res.preview.mapped);
    } catch (err: any) {
      onBanner(err?.response?.data?.error || "תצוגה מקדימה נכשלה");
    }
  }

  async function send() {
    if (!canSend || !customerId || sendingRef.current) return;
    if (intent === "demo" && !canDemo) {
      onBanner("אין הרשאה לשליחת דמו");
      return;
    }
    const text = String(body || preview || "").trim();
    if (!stagedFile) {
      if (sessionOpen && !templateId && !text) return;
      if (!sessionOpen && !templateId) {
        onBanner("מחוץ לחלון 24 שעות יש לבחור תבנית מאושרת");
        return;
      }
    } else if (!sessionOpen) {
      onBanner("שליחת מדיה זמינה רק בתוך חלון 24 שעות");
      return;
    }

    sendingRef.current = true;
    setSending(true);
    const clientRequestId =
      typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
        ? crypto.randomUUID()
        : `req-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
    const optimistic: PublicWhatsAppMessage = {
      id: `tmp-${clientRequestId}`,
      direction: "outbound",
      status: "queued",
      timestamp: new Date().toISOString(),
      bodyPreview: stagedFile
        ? stagedFile.filename
        : text || selected?.body || "…",
      messageType: stagedFile?.messageType || "text",
      filename: stagedFile?.filename,
      caption: stagedFile && text ? text : "",
      mimeType: stagedFile?.mimeType,
      mediaSize: stagedFile?.size,
      hasMedia: Boolean(stagedFile),
      kind: templateId ? "template" : "free_form",
      pending: true,
      clientRequestId,
      localPreviewUrl: stagedFile?.previewUrl || "",
    };
    stickRef.current = true;
    setMessages((prev) => mergeMessages(prev, optimistic));
    requestAnimationFrame(() => scrollToBottom(true));
    try {
      let uploadedMedia: Record<string, unknown> | null = null;
      if (stagedFile) {
        const { data: uploadRes } = await adminCrmApi.whatsappUploadMedia(
          customerId,
          stagedFile.file
        );
        uploadedMedia = uploadRes.media || null;
        if (!uploadedMedia?.mediaId && !uploadedMedia?.mediaUrl) {
          throw Object.assign(new Error("העלאת המדיה נכשלה — לא התקבל media_id"), {
            response: { data: { error: "העלאת המדיה ל-WhatsApp נכשלה" } },
          });
        }
      }

      const payload: Record<string, unknown> = {
        intent,
        templateId: templateId || null,
        body: text,
        vars: mappedVars,
        previewConfirmed: Boolean(
          preview ||
            (!(selected?.variables || []).length &&
              !(selected?.headerVariables || []).length &&
              !(selected?.buttonVariables || []).length)
        ),
        demoModules: modules,
        paymentPlan,
        managedConnectionId: sendFromConnectionId,
        clientRequestId,
      };
      if (uploadedMedia) {
        payload.mediaType = uploadedMedia.messageType;
        payload.mediaUrl = uploadedMedia.mediaUrl;
        payload.mediaId = uploadedMedia.mediaId;
        payload.filename = uploadedMedia.filename;
        payload.mimeType = uploadedMedia.mimeType;
        payload.mediaSize = uploadedMedia.mediaSize;
        payload.mediaPublicId = uploadedMedia.mediaPublicId;
      }

      const { data: res } = await adminCrmApi.whatsappSend(customerId, payload);
      if (res.message) {
        setMessages((prev) => {
          const withoutTmp = prev.filter((m) => m.id !== optimistic.id);
          return mergeMessages(withoutTmp, {
            ...res.message,
            clientRequestId,
          });
        });
      } else {
        setMessages((prev) => prev.filter((m) => m.id !== optimistic.id));
      }
      onBanner(
        res.kind === "media"
          ? "מדיה נשלחה ב-WhatsApp"
          : res.kind === "template"
            ? "תבנית WhatsApp נשלחה מערוץ BizUply"
            : "הודעת WhatsApp נשלחה מערוץ BizUply"
      );
      // Only after success: collapse template composer so the chat regains height.
      setTemplateId("");
      setVars({});
      setPreview("");
      setBody("");
      setStagedFile(null);
      stickRef.current = true;
      // Wait for React layout (composer shrink) before scrolling to the new message.
      requestAnimationFrame(() => {
        requestAnimationFrame(() => scrollToBottom(true));
      });
    } catch (err: any) {
      // Keep template + vars + preview on failure so the user can retry.
      setMessages((prev) =>
        applyStatusPatch(prev, {
          id: optimistic.id,
          status: "failed",
          error: err?.response?.data?.error || "שליחה נכשלה",
        })
      );
      onBanner(err?.response?.data?.error || "השליחה נכשלה. הטיוטה נשמרה.");
    } finally {
      sendingRef.current = false;
      setSending(false);
    }
  }

  const feed = useMemo(() => buildMessageFeed(messages), [messages]);

  if (error) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-[#efeae2] p-6">
        <p className="font-bold text-rose-700">{error}</p>
        <SecondaryButton onClick={load}>נסה שוב</SecondaryButton>
      </div>
    );
  }

  if (!data && customerId) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-[#efeae2] text-sm font-bold text-slate-500">
        טוען שיחה…
      </div>
    );
  }

  return (
    <div
      className="flex h-full min-h-0 w-full min-w-0 flex-col overflow-hidden"
      dir="rtl"
      style={CHAT_WALLPAPER_STYLE}
    >
      <div className={CHAT_COLUMN_CLASS}>
      <header className="flex shrink-0 items-center gap-3 border-b border-black/5 bg-[#f0f2f5] px-3 py-2">
        {onBack ? (
          <button
            type="button"
            className="min-h-11 min-w-11 rounded-full text-lg font-black text-slate-600 lg:hidden"
            onClick={onBack}
            aria-label="חזרה לרשימה"
          >
            →
          </button>
        ) : null}
        <div className="grid h-10 w-10 place-items-center rounded-full bg-[#dfe5e7] text-sm font-black text-[#54656f]">
          {(contactName || "WA").slice(0, 1)}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[15px] font-black text-[#111b21]">
            {contactName || "שיחת WhatsApp"}
          </p>
          <p className="truncate text-[12px] font-bold text-[#667781]" dir="ltr">
            {matchPhone || ""}
            {sessionOpen ? " · חלון 24 שעות פתוח" : " · נדרשת תבנית"}
          </p>
          {data?.bizuplyManaged?.conversation?.active ? (
            <div className="mt-1 flex flex-wrap items-center gap-1">
              <Badge tone="bg-emerald-50 text-emerald-700 border-emerald-200">שיחת WhatsApp פעילה</Badge>
              {data.bizuplyManaged.conversation.status === "waiting_for_staff" ? (
                <Badge tone="bg-amber-50 text-amber-800 border-amber-200">
                  {data.bizuplyManaged.conversation.statusLabel ||
                    WHATSAPP_INBOX_STATUS_LABELS.waiting_for_staff}
                </Badge>
              ) : null}
            </div>
          ) : null}
        </div>
        {linkedCustomerId ? (
          <Link
            className="hidden text-xs font-black text-[#7C4DFF] sm:inline"
            to={`/admin/crm/customers/${linkedCustomerId}`}
          >
            כרטיס לקוח
          </Link>
        ) : null}
      </header>

      {showConnectionCards ? (
        <div className="shrink-0 border-b border-black/5 bg-white px-3 py-2 text-[11px] font-bold text-slate-500">
          <span className="text-[#7C4DFF]">BizUply WhatsApp</span>
          {sender.displayPhoneMasked ? (
            <span dir="ltr"> · {sender.displayPhoneMasked}</span>
          ) : null}
          {" · "}
          {data?.customerConnection?.connected
            ? "יש חיבור עסקי (לא בשימוש לשליחת אדמין)"
            : "אין חיבור WhatsApp של העסק"}
        </div>
      ) : null}

      <div
        ref={scrollerRef}
        className="relative min-h-0 flex-1 overflow-x-hidden overflow-y-auto px-4 py-3 [overflow-anchor:none]"
        onScroll={(e) => {
          const el = e.currentTarget;
          lastScrollTopRef.current = el.scrollTop;
          stickRef.current = isNearBottom(el);
          if (stickRef.current) setUnseen(0);
        }}
      >
        <div className="flex w-full min-w-0 flex-col">
          {!feed.length ? (
            <div className="my-10 text-center text-sm font-bold text-[#667781]">
              אין שיחה עדיין. אפשר להתחיל לשלוח הודעה מכאן.
            </div>
          ) : null}
          {feed.map((item) => {
            if (item.type === "date") {
              return (
                <div key={item.key} className="my-2 flex justify-center">
                  <span className="rounded-lg bg-[#ffffff99] px-3 py-1 text-[12px] font-bold text-[#54656f] shadow-sm">
                    {item.label}
                  </span>
                </div>
              );
            }
            const outbound = item.message.direction !== "inbound";
            const receivedOn = !outbound ? inboundReceivedOnLabel(item.message) : "";
            return (
              <div
                key={item.key}
                className={[
                  "flex w-full",
                  outbound ? "justify-end" : "justify-start",
                  item.grouped ? "mt-[2px]" : "mt-2",
                ].join(" ")}
              >
                <div
                  className={[
                    "relative max-w-[65%] rounded-lg px-[9px] pb-[6px] pt-[6px] text-[14.2px] leading-[19px] shadow-[0_1px_0.5px_rgba(11,20,26,0.13)]",
                    outbound
                      ? "rounded-ee-none bg-[#d9fdd3] text-[#111b21]"
                      : "rounded-es-none bg-white text-[#111b21]",
                  ].join(" ")}
                >
                  <WhatsAppMessageBody
                    message={item.message}
                    customerId={customerId}
                    threadId={threadId}
                  />
                  {receivedOn ? (
                    <p className="mt-1 text-[11px] font-bold text-[#667781]">
                      Received on: {receivedOn}
                    </p>
                  ) : null}
                  {item.message.templateName ? (
                    <p className="mt-1 text-[11px] text-[#667781]">{item.message.templateName}</p>
                  ) : null}
                  {item.message.error ? (
                    <p className="mt-1 text-[11px] font-bold text-rose-700">{item.message.error}</p>
                  ) : null}
                  <span className="mt-1 flex items-center justify-end gap-1 text-[11px] text-[#667781]">
                    <span>{formatClock(item.message.timestamp)}</span>
                    {outbound ? <WhatsAppWebTicks status={item.message.status} /> : null}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
        {unseen > 0 ? (
          <button
            type="button"
            className="absolute bottom-3 left-1/2 z-10 -translate-x-1/2 rounded-full bg-white px-3 py-1 text-xs font-black text-[#7C4DFF] shadow"
            onClick={() => {
              stickRef.current = true;
              setUnseen(0);
              scrollToBottom(true);
            }}
          >
            {unseen} הודעות חדשות
          </button>
        ) : null}
      </div>

      <div className="max-h-[min(42vh,380px)] shrink-0 overflow-x-hidden overflow-y-auto border-t border-black/5 bg-[#f0f2f5] px-3 py-2">
        {!canSend ? (
          <p className="mb-2 px-2 text-xs font-bold text-rose-700">אין הרשאה לשלוח WhatsApp.</p>
        ) : null}
        {!customerId ? (
          <p className="mb-2 px-2 text-xs font-bold text-amber-800">
            השיחה עדיין לא משויכת ללקוח — ניתן לקרוא, לא לשלוח.
          </p>
        ) : null}
        {!composerSendReady && customerId ? (
          <p className="mb-2 px-2 text-xs font-bold text-rose-700">
            {needsRegistration ? (
              <>
                נדרש רישום PIN ב-
                <Link className="underline" to="/admin/managed-whatsapp">
                  WhatsApp Managed
                </Link>
                {sendFromConnectionId === "US_MANAGED" ? " (USA)" : " (Israel)"}
              </>
            ) : !sendFromReady ? (
              "חיבור USA אינו מחובר — בחר Israel או חבר USA ב-WhatsApp Managed."
            ) : (
              "ערוץ WhatsApp של BizUply אינו זמין."
            )}
          </p>
        ) : null}

        {customerId && canSend ? (
          <div className="mb-2 flex flex-wrap items-center gap-2 px-1">
            <span className="text-xs font-bold text-[#667781]">Send from:</span>
            <select
              className="min-h-9 rounded-full border-none bg-white px-3 text-sm font-bold"
              value={sendFromConnectionId}
              onChange={(e) => setSendFromConnectionId(e.target.value)}
              dir="ltr"
            >
              {sendFromOptions.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.flag} {opt.label}
                </option>
              ))}
            </select>
          </div>
        ) : null}

        <div className="mb-2 flex flex-wrap gap-1 px-1">
          <SecondaryButton type="button" className="!min-h-9 !rounded-full !px-3 !text-xs" onClick={() => setIntent("message")}>
            שליחת הודעה
          </SecondaryButton>
          <SecondaryButton type="button" className="!min-h-9 !rounded-full !px-3 !text-xs" onClick={() => setIntent("follow_up")}>
            שליחת מעקב
          </SecondaryButton>
          {canDemo ? (
            <SecondaryButton
              type="button"
              className="!min-h-9 !rounded-full !px-3 !text-xs"
              onClick={() => (onOpenSendDemo ? onOpenSendDemo() : setIntent("demo"))}
            >
              שליחת דמו
            </SecondaryButton>
          ) : null}
          <SecondaryButton type="button" className="!min-h-9 !rounded-full !px-3 !text-xs" onClick={() => setIntent("payment")}>
            קישור תשלום / שדרוג
          </SecondaryButton>
        </div>

        {intent === "demo" && !onOpenSendDemo ? (
          <div className="mb-2 flex flex-wrap gap-2 px-1">
            {(data?.bizuplyManaged?.demoModules || []).map((mod: { key: string; label: string }) => (
              <label key={mod.key} className="flex min-h-9 items-center gap-2 rounded-full border border-purple-100 bg-white px-3 text-xs font-bold">
                <input
                  type="checkbox"
                  checked={modules.includes(mod.key)}
                  onChange={(e) => {
                    setModules((prev) =>
                      e.target.checked ? [...prev, mod.key] : prev.filter((k) => k !== mod.key)
                    );
                  }}
                />
                {mod.label}
              </label>
            ))}
          </div>
        ) : null}
        {intent === "payment" ? (
          <select
            className="mb-2 min-h-10 w-full rounded-full border-none bg-white px-3 text-sm"
            value={paymentPlan}
            onChange={(e) => setPaymentPlan(e.target.value)}
          >
            <option value="monthly">חודשי</option>
            <option value="yearly">שנתי</option>
            <option value="website_only">אתר בלבד</option>
          </select>
        ) : null}

        {canTemplates || templates.length ? (
          <select
            className="mb-2 min-h-10 w-full rounded-full border-none bg-white px-3 text-sm"
            value={templateId}
            onChange={(e) => {
              setTemplateId(e.target.value);
              setPreview("");
            }}
          >
            <option value="">{sessionOpen ? "הודעה חופשית (חלון פתוח)" : "בחירת תבנית מאושרת"}</option>
            {templates.map((tpl) => (
              <option key={tpl.id} value={tpl.id}>
                {tpl.name} · {tpl.languageLabel || tpl.language}
              </option>
            ))}
          </select>
        ) : null}

        {(selected?.variables?.length ||
          selected?.headerVariables?.length ||
          selected?.buttonVariables?.length) ? (
          <div className="mb-2 space-y-2 px-1">
            {(selected.headerVariables || []).map((key) => (
              <input
                key={`hdr-${key}`}
                className="min-h-10 w-full rounded-2xl border-none bg-white px-3 text-sm"
                placeholder={`HEADER {{${String(key).replace(/^header_/, "")}}}`}
                value={mappedVars[key] || ""}
                onChange={(e) => setVars((prev) => ({ ...prev, [key]: e.target.value }))}
              />
            ))}
            {(selected.variables || []).map((key) => (
              <input
                key={`body-${key}`}
                className="min-h-10 w-full rounded-2xl border-none bg-white px-3 text-sm"
                placeholder={`BODY {{${key}}}`}
                value={mappedVars[key] || ""}
                onChange={(e) => setVars((prev) => ({ ...prev, [key]: e.target.value }))}
              />
            ))}
            {(selected.buttonVariables || []).map((row) => (
              <input
                key={`btn-${row.key}`}
                className="min-h-10 w-full rounded-2xl border-none bg-white px-3 text-sm"
                placeholder={row.label || `כפתור URL · ${row.key}`}
                value={mappedVars[row.key] || ""}
                onChange={(e) =>
                  setVars((prev) => ({ ...prev, [row.key]: e.target.value }))
                }
              />
            ))}
            <SecondaryButton type="button" className="!min-h-9 !text-xs" onClick={buildPreview}>
              תצוגה מקדימה
            </SecondaryButton>
          </div>
        ) : null}

        {preview ? (
          <div className="mb-2 rounded-2xl bg-white px-3 py-2 text-sm whitespace-pre-wrap">{preview}</div>
        ) : null}

        <WhatsAppMessageComposer
          body={body}
          onBodyChange={setBody}
          disabled={!canSend || !customerId || !composerSendReady}
          sending={sending}
          sessionOpen={sessionOpen}
          hasTemplate={Boolean(templateId)}
          stagedFile={stagedFile}
          onStageFile={setStagedFile}
          onSend={() => void send()}
        />
        <p className="mt-1 px-2 text-[11px] font-semibold text-[#8696a0]">
          {sessionOpen ? (
            <>
              <Badge tone="bg-emerald-50 text-emerald-700 border-emerald-200">הודעה חופשית</Badge>
              <span className="ms-2">Enter לשליחה · Shift+Enter לשורה חדשה</span>
            </>
          ) : (
            "חלון 24 השעות סגור — שליחה בתבנית מאושרת בלבד"
          )}
        </p>
      </div>
      </div>
    </div>
  );
}
