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
  contact_required: "צריך ליצור קשר",
  contacted: "נוצר קשר",
  qualified: "מתאים",
  initial_call_scheduled: "שיחה ראשונית נקבעה",
  demo_scheduled: "דמו נקבע",
  demo_sent: "דמו נשלח",
  proposal_sent: "הצעה נשלחה",
  negotiation: "משא ומתן",
  awaiting_payment: "ממתין לתשלום",
  won: "נסגר",
  lost: "לא נסגר",
  follow_up_later: "מעקב עתידי",
};

export const SOURCE_LABELS: Record<string, string> = {
  facebook: "Facebook",
  meta_lead_ads: "Facebook",
  website_form: "טופס באתר",
  website_bot: "בוט באתר BizUply",
  manual: "ידני",
  imported: "ייבוא",
  demo_request: "דמו",
  landing_page: "דף נחיתה",
  early_access: "הרשמה מוקדמת",
  partner_referral: "שותף",
  whatsapp: "WhatsApp",
  other: "אחר",
};

export const HEALTH_LABELS: Record<string, string> = {
  healthy: "תקין",
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
  lead_created: "ליד נוצר",
  sales_status_changed: "שינוי שלב מכירה",
  lifecycle_changed: "שינוי סטטוס CRM",
  note_added: "הערה",
  task_created: "משימה נוצרה",
  task_completed: "משימה הושלמה",
  phone_interaction: "שיחה",
  whatsapp_message: "הודעת WhatsApp",
  whatsapp_template_sent: "תבנית WhatsApp נשלחה",
  whatsapp_message_sent: "הודעת WhatsApp נשלחה",
  whatsapp_message_received: "הודעת WhatsApp התקבלה",
  whatsapp_delivered: "WhatsApp נמסר",
  whatsapp_read: "WhatsApp נקרא",
  whatsapp_failed: "שליחת WhatsApp נכשלה",
  demo_sent: "דמו נשלח",
  demo_opened: "דמו נפתח",
  account_created: "חשבון נוצר",
  subscription_activated: "מנוי הופעל",
  payment_succeeded: "תשלום הצליח",
  payment_failed: "תשלום נכשל",
  package_changed: "חבילה שונתה",
  addon_enabled: "תוסף נוסף",
  addon_disabled: "תוסף הוסר",
  website_created: "אתר נוצר",
  website_published: "אתר פורסם",
  domain_connected: "דומיין חובר",
  whatsapp_connected: "WhatsApp חובר",
  automation_enabled: "אוטומציה הופעלה",
  support_interaction: "פנייה לתמיכה",
  cancellation: "ביטול",
  reactivation: "חזרה לשירות",
  assignment_changed: "שינוי אחראי",
  follow_up_scheduled: "מעקב נקבע",
  customer_updated: "רשומת לקוח עודכנה",
  health_override: "עדכון מצב לקוח",
  migrated_existing: "שיוך לקוח קיים",
  meeting: "פגישה",
  initial_call_booked: "נקבעה שיחה ראשונית ביומן BizUply",
  whatsapp_conversation_started: "הלקוח בחר להמשיך בשיחה ב-WhatsApp",
  whatsapp_handoff_ack_sent: "נשלחה הודעת אישור אוטומטית",
  whatsapp_handoff_ack_failed: "שליחת הודעת אישור אוטומטית נכשלה",
  whatsapp_staff_replied: "נציג BizUply השיב ב-WhatsApp",
  initial_call_cancelled: "הפגישה בוטלה",
  initial_call_completed: "השיחה הושלמה",
  initial_call_no_show: "הלקוח לא הגיע לפגישה",
  initial_call_summary: "פגישה ראשונית — סיכום שיחה",
  automation_whatsapp_sent: "נשלחה הודעת WhatsApp לתיאום שיחה ראשונית",
  automation_whatsapp_failed: "שליחת WhatsApp לתיאום שיחה נכשלה",
};

export const FOLLOW_UP_TYPE_LABELS: Record<string, string> = {
  call_back: "לחזור טלפונית",
  after_demo: "לבדוק אחרי דמו",
  check_payment: "לבדוק תשלום",
  in_a_week: "לדבר בעוד שבוע",
  after_trial: "לבדוק אחרי ניסיון",
  renewal: "מעקב חידוש מנוי",
  other: "אחר",
};

export const NOTE_TYPE_LABELS: Record<string, string> = {
  normal: "הערה רגילה",
  important: "הערה חשובה",
  pinned: "הערה מוצמדת",
  call_summary: "סיכום שיחה",
  meeting_summary: "סיכום פגישה",
  support_summary: "סיכום תמיכה",
};

export const FIELD_LABELS: Record<string, string> = {
  contactName: "שם לקוח",
  companyName: "שם העסק",
  phone: "טלפון",
  email: "אימייל",
};

export const PACKAGE_LABELS: Record<string, string> = {
  monthly: "חבילה חודשית",
  yearly: "חבילה שנתית",
  website_only: "אתר בלבד",
  crm_only: "CRM בלבד",
  trial: "ניסיון",
  earlybird: "Early Bird",
};

export const WHATSAPP_INBOX_STATUS_LABELS: Record<string, string> = {
  waiting_for_staff: "ממתין לנציג",
  active: "שיחת WhatsApp פעילה",
};

export function waitingTimeLabel(since?: string | Date | null) {
  if (!since) return "";
  const ms = Date.now() - new Date(since).getTime();
  if (Number.isNaN(ms) || ms < 0) return "";
  const mins = Math.floor(ms / 60000);
  if (mins < 1) return "פחות מדקה";
  if (mins < 60) return `${mins} דק׳`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} שע׳`;
  const days = Math.floor(hours / 24);
  return `${days} ימים`;
}

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
