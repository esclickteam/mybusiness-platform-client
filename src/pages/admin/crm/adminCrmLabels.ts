import type { ReactNode } from "react";

export const LIFECYCLE_LABELS: Record<string, string> = {
  lead: "ליד",
  prospect: "פרוספקט",
  trial: "ניסיון",
  customer: "לקוח",
  past_customer: "לקוח לשעבר",
};

export const STAGE_LABELS: Record<string, string> = {
  new_lead: "ליד חדש",
  contact_required: "נדרש יצירת קשר",
  contacted: "נוצר קשר",
  qualified: "הוכשר",
  demo_scheduled: "דמו נקבע",
  demo_sent: "דמו נשלח",
  proposal_sent: "הצעה נשלחה",
  negotiation: "משא ומתן",
  awaiting_payment: "ממתין לתשלום",
  won: "נסגר",
  lost: "אבוד",
  follow_up_later: "מעקב מאוחר יותר",
};

export const SOURCE_LABELS: Record<string, string> = {
  facebook: "פייסבוק / Meta",
  meta_lead_ads: "Meta Lead Ads",
  website_form: "טופס אתר",
  manual: "יצירה ידנית",
  imported: "ייבוא",
  demo_request: "בקשת דמו",
  landing_page: "דף נחיתה",
  early_access: "הרשמה מוקדמת",
  partner_referral: "שותף / הפניה",
  whatsapp: "וואטסאפ",
  other: "אחר",
};

export const HEALTH_LABELS: Record<string, string> = {
  healthy: "בריא",
  attention: "דורש תשומת לב",
  at_risk: "בסיכון",
};

export const TASK_STATUS_LABELS: Record<string, string> = {
  open: "פתוח",
  in_progress: "בתהליך",
  done: "הושלם",
  cancelled: "בוטל",
};

export const PRIORITY_LABELS: Record<string, string> = {
  low: "נמוכה",
  normal: "רגילה",
  high: "גבוהה",
  urgent: "דחוף",
};

export const LOST_REASON_LABELS: Record<string, string> = {
  price: "מחיר",
  not_interested: "לא מעוניין",
  no_response: "אין מענה",
  missing_feature: "חסרה יכולת",
  chose_competitor: "בחר מתחרה",
  timing: "תזמון",
  invalid_lead: "ליד לא תקין",
  other: "אחר",
};

export const ACTIVITY_LABELS: Record<string, string> = {
  note: "הערה",
  phone_call: "שיחת טלפון",
  whatsapp: "וואטסאפ",
  sms: "SMS",
  email: "אימייל",
  meeting: "פגישה",
  follow_up: "מעקב",
  demo: "דמו",
  proposal: "הצעה",
  custom: "פעילות אחרת",
};

export const TIMELINE_LABELS: Record<string, string> = {
  ...ACTIVITY_LABELS,
  whatsapp_message: "הודעת WhatsApp",
  whatsapp_template_sent: "תבנית WhatsApp נשלחה",
  whatsapp_message_sent: "הודעת WhatsApp נשלחה",
  whatsapp_message_received: "הודעת WhatsApp התקבלה",
  whatsapp_failed: "שליחת WhatsApp נכשלה",
  demo_sent: "דמו נשלח ב-WhatsApp",
};

export const PACKAGE_LABELS: Record<string, string> = {
  monthly: "חבילה חודשית",
  yearly: "חבילה שנתית",
  website_only: "אתר בלבד",
  crm_only: "CRM בלבד",
  trial: "ניסיון",
  earlybird: "Early Bird",
};

export function formatIsraelDate(value?: string | Date | null, withTime = false) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("he-IL", {
    timeZone: "Asia/Jerusalem",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    ...(withTime ? { hour: "2-digit", minute: "2-digit" } : {}),
  }).format(date);
}

export function lifecycleTone(lifecycle?: string) {
  if (lifecycle === "customer") return "bg-emerald-50 text-emerald-700 border-emerald-200";
  if (lifecycle === "trial") return "bg-violet-50 text-violet-700 border-violet-200";
  if (lifecycle === "prospect") return "bg-sky-50 text-sky-700 border-sky-200";
  if (lifecycle === "past_customer") return "bg-slate-100 text-slate-600 border-slate-200";
  return "bg-amber-50 text-amber-800 border-amber-200";
}

export function stageTone(stage?: string) {
  if (stage === "won") return "bg-emerald-50 text-emerald-700 border-emerald-200";
  if (stage === "lost") return "bg-rose-50 text-rose-700 border-rose-200";
  if (stage === "awaiting_payment") return "bg-orange-50 text-orange-700 border-orange-200";
  if (stage === "contact_required" || stage === "new_lead") {
    return "bg-amber-50 text-amber-800 border-amber-200";
  }
  return "bg-indigo-50 text-indigo-700 border-indigo-200";
}

export function healthTone(health?: string) {
  if (health === "healthy") return "bg-emerald-50 text-emerald-700 border-emerald-200";
  if (health === "at_risk") return "bg-rose-50 text-rose-700 border-rose-200";
  return "bg-amber-50 text-amber-800 border-amber-200";
}

export function statusTone(status?: string) {
  if (status === "active") return "bg-emerald-50 text-emerald-700 border-emerald-200";
  if (status === "pending" || status === "trialing") {
    return "bg-amber-50 text-amber-800 border-amber-200";
  }
  if (status === "past_due" || status === "canceled" || status === "failed") {
    return "bg-rose-50 text-rose-700 border-rose-200";
  }
  return "bg-slate-50 text-slate-600 border-slate-200";
}

export function Badge({
  children,
  tone,
}: {
  children: ReactNode;
  tone: string;
}) {
  return (
    <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-[11px] font-black ${tone}`}>
      {children}
    </span>
  );
}
