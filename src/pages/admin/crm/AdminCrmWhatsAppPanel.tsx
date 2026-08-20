import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import adminCrmApi from "../../../api/adminCrmApi";
import { Badge, formatIsraelDate, statusTone } from "./adminCrmLabels";
import { CrmCard, EmptyState, PrimaryButton, SecondaryButton } from "./AdminCrmUi";

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

type Message = {
  id: string;
  direction: "inbound" | "outbound";
  status: string;
  timestamp: string;
  bodyPreview: string;
  templateName?: string;
  kind: "template" | "free_form";
  adminSenderName?: string;
  error?: string;
};

const STATUS_HE: Record<string, string> = {
  queued: "בתור",
  sent: "נשלח",
  delivered: "נמסר",
  read: "נקרא",
  failed: "נכשל",
  received: "התקבל",
};

export default function AdminCrmWhatsAppPanel({
  customerId,
  canSend,
  canTemplates,
  canDemo = true,
  onBanner,
  initialIntent = "message",
}: {
  customerId: string;
  canSend: boolean;
  canTemplates: boolean;
  canDemo?: boolean;
  onBanner: (msg: string) => void;
  initialIntent?: "message" | "follow_up" | "demo" | "payment";
}) {
  const [data, setData] = useState<any>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [error, setError] = useState("");
  const [intent, setIntent] = useState<"message" | "follow_up" | "demo" | "payment">(initialIntent);
  const [templateId, setTemplateId] = useState("");
  const [body, setBody] = useState("");
  const [vars, setVars] = useState<Record<string, string>>({});
  const [preview, setPreview] = useState("");
  const [modules, setModules] = useState<string[]>(["dashboard", "crm"]);
  const [paymentPlan, setPaymentPlan] = useState("monthly");
  const [sending, setSending] = useState(false);

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

  async function load() {
    setError("");
    try {
      const [{ data: wa }, { data: hist }] = await Promise.all([
        adminCrmApi.whatsapp(customerId),
        adminCrmApi.whatsappMessages(customerId),
      ]);
      setData(wa);
      setMessages(hist.messages || []);
      if ((wa.bizuplyManaged?.thread?.unreadCount || 0) > 0) {
        await adminCrmApi.whatsappRead(customerId).catch(() => null);
      }
    } catch (err: any) {
      setError(err?.response?.data?.error || "טעינת WhatsApp נכשלה");
    }
  }

  useEffect(() => {
    load();
  }, [customerId]);

  useEffect(() => {
    if (!selected) return;
    setVars((prev) => ({ ...(selected.prefill || {}), ...prev }));
  }, [templateId]);

  const mappedVars = useMemo(() => {
    const next: Record<string, string> = { ...vars };
    if (selected?.prefill) {
      for (const [k, v] of Object.entries(selected.prefill)) {
        if (!next[k]) next[k] = v;
      }
    }
    return next;
  }, [vars, selected]);

  async function buildPreview() {
    if (!templateId) {
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
    if (!canSend) return;
    if (intent === "demo" && !canDemo) {
      onBanner("אין הרשאה לשליחת דמו");
      return;
    }
    setSending(true);
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
      onBanner(
        res.kind === "template" ? "תבנית WhatsApp נשלחה מערוץ BizUply" : "הודעת WhatsApp נשלחה מערוץ BizUply"
      );
      setBody("");
      setPreview("");
      await load();
    } catch (err: any) {
      onBanner(err?.response?.data?.error || "השליחה נכשלה. הטיוטה נשמרה.");
    } finally {
      setSending(false);
    }
  }

  if (error) {
    return (
      <CrmCard>
        <p className="font-bold text-rose-700">{error}</p>
        <SecondaryButton className="mt-3" onClick={load}>נסה שוב</SecondaryButton>
      </CrmCard>
    );
  }
  if (!data) return <CrmCard>טוען…</CrmCard>;

  return (
    <div className="space-y-4">
      <CrmCard>
        <h3 className="text-lg font-black text-purple-950">WhatsApp של BizUply</h3>
        <p className="mt-1 text-sm font-bold text-slate-500">
          תקשורת BizUply עם הלקוח. לא משתמש בחיבור WhatsApp של הלקוח.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Badge tone={senderReady ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-rose-50 text-rose-700 border-rose-200"}>
            {senderReady
              ? "ערוץ WhatsApp של BizUply מוכן לשליחה"
              : needsRegistration
                ? "נדרש רישום PIN במסך WhatsApp Managed"
                : data.bizuplyManaged?.sender?.message || "ערוץ WhatsApp של BizUply לא זמין"}
          </Badge>
          <Badge tone={sessionOpen ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-amber-50 text-amber-800 border-amber-200"}>
            {sessionOpen ? "חלון 24 שעות פתוח" : "נדרשת תבנית מאושרת"}
          </Badge>
          {data.bizuplyManaged?.thread?.unreadCount ? (
            <Badge tone="bg-violet-50 text-violet-700 border-violet-200">
              {data.bizuplyManaged.thread.unreadCount} שלא נקראו
            </Badge>
          ) : null}
        </div>
        {data.bizuplyManaged?.sender?.displayPhoneMasked ? (
          <p className="mt-2 text-sm font-bold" dir="ltr">
            {data.bizuplyManaged.sender.displayPhoneMasked}
          </p>
        ) : null}
      </CrmCard>

      <CrmCard>
        <h3 className="mb-3 font-black">חיבור WhatsApp של העסק</h3>
        <p className="text-sm font-bold text-slate-500">
          חיבור WhatsApp Business של הלקוח עצמו — מידע בלבד, לא משמש לשליחת הודעות אדמין.
        </p>
        {data.customerConnection?.connected ? (
          <div className="mt-2 text-sm font-bold">
            <p>מספר: {data.customerConnection.connection?.phoneNumber || "—"}</p>
            <p>סטטוס: {data.customerConnection.connection?.senderStatus || "—"}</p>
          </div>
        ) : (
          <p className="mt-2 font-bold text-slate-600">אין חיבור WhatsApp ללקוח זה.</p>
        )}
      </CrmCard>

      <CrmCard>
        <h3 className="mb-3 font-black">היסטוריית שיחה</h3>
        {!messages.length ? <EmptyState title="אין הודעות עדיין" /> : null}
        <div className="space-y-2">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`rounded-2xl p-3 ${msg.direction === "inbound" ? "bg-slate-50" : "bg-violet-50"}`}
            >
              <div className="flex flex-wrap items-center gap-2 text-xs font-black">
                <span>{msg.direction === "inbound" ? "נכנס" : "יוצא"}</span>
                <Badge tone={statusTone(msg.status)}>{STATUS_HE[msg.status] || msg.status}</Badge>
                <span>{msg.kind === "template" ? "תבנית" : "הודעה חופשית"}</span>
                <span>{formatIsraelDate(msg.timestamp, true)}</span>
                {msg.adminSenderName ? <span>נשלח ע״י {msg.adminSenderName}</span> : null}
              </div>
              <p className="mt-1 whitespace-pre-wrap font-bold text-slate-800">{msg.bodyPreview}</p>
              {msg.templateName ? <p className="text-xs text-slate-500">{msg.templateName}</p> : null}
              {msg.error ? <p className="text-xs font-bold text-rose-700">{msg.error}</p> : null}
            </div>
          ))}
        </div>
      </CrmCard>

      <CrmCard>
        <h3 className="mb-3 font-black">שליחת WhatsApp</h3>
        {!canSend ? (
          <p className="font-bold text-rose-700">אין הרשאה לשלוח WhatsApp.</p>
        ) : null}
        {!senderReady ? (
          <p className="mb-3 font-bold text-rose-700">
            {needsRegistration
              ? "לא ניתן לשלוח: מספר WhatsApp של BizUply עדיין לא רשום לשליחה ב-Meta. "
              : "לא ניתן לשלוח: ערוץ WhatsApp של BizUply אינו זמין."}
            {needsRegistration ? (
              <Link className="underline" to="/admin/managed-whatsapp">
                פתחו WhatsApp Managed והשלימו רישום עם PIN של 6 ספרות
              </Link>
            ) : null}
          </p>
        ) : null}
        <div className="mb-3 flex flex-wrap gap-2">
          <SecondaryButton type="button" onClick={() => setIntent("message")}>שליחת הודעה</SecondaryButton>
          <SecondaryButton type="button" onClick={() => setIntent("follow_up")}>שליחת מעקב</SecondaryButton>
          {canDemo ? (
            <SecondaryButton type="button" onClick={() => setIntent("demo")}>שליחת דמו</SecondaryButton>
          ) : null}
          <SecondaryButton type="button" onClick={() => setIntent("payment")}>קישור תשלום / שדרוג</SecondaryButton>
        </div>
        <p className="mb-3 text-sm font-bold text-[#7C4DFF]">
          {intent === "demo"
            ? "דמו מודרך — בחרו מודולים, צרו קישור חד־פעמי ושלחו בתבנית."
            : intent === "payment"
              ? "קישור תשלום נוצר בתשתית Stripe הקיימת."
              : intent === "follow_up"
                ? "הודעת מעקב דרך WhatsApp של BizUply."
                : "הודעה רגילה או תבנית מאושרת."}
        </p>
        {intent === "demo" ? (
          <div className="mb-3 flex flex-wrap gap-2">
            {(data.bizuplyManaged?.demoModules || []).map((mod: { key: string; label: string }) => (
              <label key={mod.key} className="flex min-h-11 items-center gap-2 rounded-2xl border border-purple-100 px-3 text-sm font-bold">
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
            className="mb-3 min-h-11 rounded-2xl border px-3"
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
            className="mb-3 min-h-11 w-full rounded-2xl border px-3"
            value={templateId}
            onChange={(e) => {
              setTemplateId(e.target.value);
              setPreview("");
            }}
          >
            <option value="">{sessionOpen ? "הודעה חופשית (חלון פתוח)" : "בחירת תבנית מאושרת"}</option>
            {templates.map((tpl) => (
              <option key={tpl.id} value={tpl.id}>
                {tpl.name} · {tpl.languageLabel || tpl.language} · {tpl.statusLabel || tpl.status}
                {tpl.variables?.length ? ` · ${tpl.variables.length} משתנים` : ""}
              </option>
            ))}
          </select>
        ) : null}
        {selected?.variables?.length ? (
          <div className="mb-3 space-y-2">
            {selected.variables.map((key) => (
              <label key={key} className="block text-sm font-bold">
                {key}
                <input
                  className="mt-1 min-h-11 w-full rounded-2xl border px-3"
                  value={mappedVars[key] || ""}
                  onChange={(e) => setVars((prev) => ({ ...prev, [key]: e.target.value }))}
                />
              </label>
            ))}
            <SecondaryButton type="button" onClick={buildPreview}>תצוגה מקדימה</SecondaryButton>
          </div>
        ) : (
          <textarea
            className="mb-3 min-h-28 w-full rounded-2xl border p-3"
            placeholder={sessionOpen ? "הודעה חופשית" : "מחוץ לחלון 24 שעות חובה לבחור תבנית"}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            disabled={!sessionOpen && !templateId}
          />
        )}
        {preview ? (
          <div className="mb-3 rounded-2xl bg-purple-50 p-3 text-sm font-bold whitespace-pre-wrap">{preview}</div>
        ) : null}
        <PrimaryButton type="button" disabled={!canSend || !senderReady || sending} onClick={send}>
          {sending ? "שולח…" : "שליחה"}
        </PrimaryButton>
      </CrmCard>
    </div>
  );
}
