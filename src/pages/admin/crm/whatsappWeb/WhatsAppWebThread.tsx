import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import adminCrmApi from "../../../../api/adminCrmApi";
import { Badge } from "../adminCrmLabels";
import { PrimaryButton, SecondaryButton } from "../AdminCrmUi";
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

type Template = {
  id: string;
  name: string;
  language: string;
  languageLabel?: string;
  status: string;
  statusLabel?: string;
  variables: string[];
  body?: string;
  prefill?: Record<string, string>;
};

export default function WhatsAppWebThread({
  customerId,
  threadId,
  phone: phoneProp,
  canSend,
  canTemplates,
  canDemo = true,
  onBanner,
  initialIntent = "message",
  showConnectionCards = false,
  onBack,
}: {
  customerId?: string | null;
  threadId?: string | null;
  phone?: string | null;
  canSend: boolean;
  canTemplates: boolean;
  canDemo?: boolean;
  onBanner: (msg: string) => void;
  initialIntent?: "message" | "follow_up" | "demo" | "payment";
  showConnectionCards?: boolean;
  onBack?: () => void;
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
  const [unseen, setUnseen] = useState(0);
  const stickRef = useRef(true);
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const templates: Template[] = data?.bizuplyManaged?.templates || [];
  const selected = templates.find((t) => t.id === templateId);
  const sessionOpen = Boolean(data?.bizuplyManaged?.sessionWindowOpen);
  const sender = data?.bizuplyManaged?.sender || {};
  const senderReady = Boolean(
    sender.sendReady ?? (sender.ready && sender.registrationStatus !== "required")
  );
  const needsRegistration =
    Boolean(sender.ready) &&
    (sender.phoneRegistered === false ||
      sender.registrationStatus === "required" ||
      sender.registrationStatus === "failed" ||
      sender.registrationStatus === "pending");
  const contactName =
    data?.customerConnection?.customerName ||
    data?.bizuplyManaged?.prefill?.contact_name ||
    data?.bizuplyManaged?.prefill?.name ||
    "";
  const matchPhone =
    phoneProp ||
    data?.bizuplyManaged?.prefill?.phone ||
    data?.bizuplyManaged?.thread?.phone ||
    "";

  const scrollToBottom = useCallback((smooth = false) => {
    bottomRef.current?.scrollIntoView({
      block: "end",
      behavior: smooth ? "smooth" : "auto",
    });
  }, []);

  const loadMessages = useCallback(
    async (since?: string) => {
      if (customerId) {
        const { data: hist } = await adminCrmApi.whatsappMessages(customerId, {
          since,
          limit: since ? 300 : 120,
        });
        return (hist.messages || []) as PublicWhatsAppMessage[];
      }
      if (threadId) {
        const { data: hist } = await adminCrmApi.whatsappThreadMessages(threadId, {
          since,
          limit: since ? 300 : 120,
        });
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
          setMessages((prev) => mergeMessages(prev, rows));
          if (stickRef.current) requestAnimationFrame(() => scrollToBottom(false));
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
    if (!canSend || !customerId) return;
    if (intent === "demo" && !canDemo) {
      onBanner("אין הרשאה לשליחת דמו");
      return;
    }
    const text = String(body || preview || "").trim();
    if (sessionOpen && !templateId && !text) return;
    if (!sessionOpen && !templateId) {
      onBanner("מחוץ לחלון 24 שעות יש לבחור תבנית מאושרת");
      return;
    }
    setSending(true);
    const optimistic: PublicWhatsAppMessage = {
      id: `tmp-${Date.now()}`,
      direction: "outbound",
      status: "queued",
      timestamp: new Date().toISOString(),
      bodyPreview: text || selected?.body || "…",
      kind: templateId ? "template" : "free_form",
      pending: true,
    };
    stickRef.current = true;
    setMessages((prev) => mergeMessages(prev, optimistic));
    requestAnimationFrame(() => scrollToBottom(true));
    try {
      const payload: Record<string, unknown> = {
        intent,
        templateId: templateId || null,
        body,
        vars: mappedVars,
        previewConfirmed: Boolean(preview || !(selected?.variables || []).length),
        demoModules: modules,
        paymentPlan,
      };
      const { data: res } = await adminCrmApi.whatsappSend(customerId, payload);
      if (res.message) {
        setMessages((prev) => mergeMessages(prev, res.message));
      }
      onBanner(
        res.kind === "template"
          ? "תבנית WhatsApp נשלחה מערוץ BizUply"
          : "הודעת WhatsApp נשלחה מערוץ BizUply"
      );
      setBody("");
      setPreview("");
      requestAnimationFrame(() => scrollToBottom(true));
    } catch (err: any) {
      setMessages((prev) =>
        applyStatusPatch(prev, { id: optimistic.id, status: "failed", error: "שליחה נכשלה" })
      );
      onBanner(err?.response?.data?.error || "השליחה נכשלה. הטיוטה נשמרה.");
    } finally {
      setSending(false);
    }
  }

  const feed = useMemo(() => buildMessageFeed(messages), [messages]);

  if (error) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 bg-[#efeae2] p-6">
        <p className="font-bold text-rose-700">{error}</p>
        <SecondaryButton onClick={load}>נסה שוב</SecondaryButton>
      </div>
    );
  }

  if (!data && customerId) {
    return (
      <div className="flex h-full items-center justify-center bg-[#efeae2] text-sm font-bold text-slate-500">
        טוען שיחה…
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden bg-[#efeae2]" dir="rtl">
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
            {data?.bizuplyManaged?.prefill?.phone || phone || ""}
            {sessionOpen ? " · חלון 24 שעות פתוח" : " · נדרשת תבנית"}
          </p>
        </div>
        {customerId ? (
          <Link
            className="hidden text-xs font-black text-[#7C4DFF] sm:inline"
            to={`/admin/crm/customers/${customerId}`}
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
        className="relative min-h-0 flex-1 overflow-x-hidden overflow-y-auto px-3 py-3 sm:px-8"
        onScroll={(e) => {
          const el = e.currentTarget;
          const distance = el.scrollHeight - el.scrollTop - el.clientHeight;
          stickRef.current = distance < 72;
          if (stickRef.current) setUnseen(0);
        }}
      >
        <div className="mx-auto flex max-w-[760px] flex-col">
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
                    "relative max-w-[75%] rounded-lg px-[9px] pb-[6px] pt-[6px] text-[14.2px] leading-[19px] shadow-[0_1px_0.5px_rgba(11,20,26,0.13)]",
                    outbound
                      ? "rounded-ee-none bg-[#d9fdd3] text-[#111b21]"
                      : "rounded-es-none bg-white text-[#111b21]",
                  ].join(" ")}
                >
                  <p className="whitespace-pre-wrap break-words [overflow-wrap:anywhere]">
                    {item.message.bodyPreview || "—"}
                  </p>
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
          <div ref={bottomRef} />
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

      <div className="shrink-0 border-t border-black/5 bg-[#f0f2f5] px-2 py-2">
        {!canSend ? (
          <p className="mb-2 px-2 text-xs font-bold text-rose-700">אין הרשאה לשלוח WhatsApp.</p>
        ) : null}
        {!customerId ? (
          <p className="mb-2 px-2 text-xs font-bold text-amber-800">
            השיחה עדיין לא משויכת ללקוח — ניתן לקרוא, לא לשלוח.
          </p>
        ) : null}
        {!senderReady && customerId ? (
          <p className="mb-2 px-2 text-xs font-bold text-rose-700">
            {needsRegistration ? (
              <>
                נדרש רישום PIN ב-
                <Link className="underline" to="/admin/managed-whatsapp">
                  WhatsApp Managed
                </Link>
              </>
            ) : (
              "ערוץ WhatsApp של BizUply אינו זמין."
            )}
          </p>
        ) : null}

        <div className="mb-2 flex flex-wrap gap-1 px-1">
          <SecondaryButton type="button" className="!min-h-9 !rounded-full !px-3 !text-xs" onClick={() => setIntent("message")}>
            שליחת הודעה
          </SecondaryButton>
          <SecondaryButton type="button" className="!min-h-9 !rounded-full !px-3 !text-xs" onClick={() => setIntent("follow_up")}>
            שליחת מעקב
          </SecondaryButton>
          {canDemo ? (
            <SecondaryButton type="button" className="!min-h-9 !rounded-full !px-3 !text-xs" onClick={() => setIntent("demo")}>
              שליחת דמו
            </SecondaryButton>
          ) : null}
          <SecondaryButton type="button" className="!min-h-9 !rounded-full !px-3 !text-xs" onClick={() => setIntent("payment")}>
            קישור תשלום / שדרוג
          </SecondaryButton>
        </div>

        {intent === "demo" ? (
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

        {selected?.variables?.length ? (
          <div className="mb-2 space-y-2 px-1">
            {selected.variables.map((key) => (
              <input
                key={key}
                className="min-h-10 w-full rounded-2xl border-none bg-white px-3 text-sm"
                placeholder={key}
                value={mappedVars[key] || ""}
                onChange={(e) => setVars((prev) => ({ ...prev, [key]: e.target.value }))}
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

        <div className="flex items-end gap-2">
          <textarea
            className="max-h-36 min-h-[44px] flex-1 resize-none rounded-[24px] border-none bg-white px-4 py-2.5 text-[15px] leading-5 text-[#111b21] outline-none"
            placeholder={sessionOpen ? "הודעה חופשית" : "מחוץ לחלון 24 שעות חובה לבחור תבנית"}
            value={body}
            rows={1}
            disabled={!customerId || sending || (!sessionOpen && !templateId)}
            onChange={(e) => setBody(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                void send();
              }
            }}
          />
          <PrimaryButton
            type="button"
            className="!min-h-11 !min-w-11 !rounded-full !px-0"
            disabled={!canSend || !senderReady || !customerId || sending}
            onClick={() => void send()}
            aria-label="שליחה"
          >
            {sending ? "…" : "➤"}
          </PrimaryButton>
        </div>
        <p className="mt-1 px-2 text-[11px] font-bold text-[#667781]">
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
  );
}
