/** Hebrew display labels for proposal customer-facing UI (no raw slugs). */

const RELEVANT: Record<string, string> = {
  crm: "CRM וניהול לקוחות",
  leads: "ניהול לידים",
  whatsapp: "WhatsApp",
  automations: "אוטומציות",
  website: "אתר",
  scheduling: "תיאום פגישות",
  tasks: "ניהול משימות",
  collab: "שיתופי פעולה",
  full_system: "מערכת מלאה",
  other: "נושא נוסף",
};

const AUTOMATION: Record<string, string> = {
  new_lead_msg: "הודעה אוטומטית לליד חדש",
  lead_followup: "מעקב אחרי לידים",
  client_reminders: "תזכורות ללקוחות",
  internal_reminders: "תזכורות פנימיות",
  status_changes: "שינוי סטטוסים",
  task_creation: "יצירת משימות",
  alerts: "התראות",
  scheduling: "תיאום פגישות",
  whatsapp_msgs: "הודעות WhatsApp",
  internal_flows: "תהליכים פנימיים בעסק",
  other: "אוטומציה נוספת",
};

const SERVICE: Record<string, string> = {
  website_build: "בניית אתר",
  automation_build: "בניית אוטומציות",
  sales_agents: "נציגי מכירות שחוזרים ללידים",
  other: "שירות נוסף",
  not_now: "לא כרגע",
};

const BLOCKER: Record<string, string> = {
  price: "המחיר",
  missing_feature: "חסר משהו במערכת",
  migration: "מעבר ממערכת קיימת",
  onboarding_time: "זמן להטמעה",
  need_consult: "צריך להתייעץ עם אדם נוסף",
  not_sure_fit: "עדיין לא בטוחים שהמערכת מתאימה",
  need_more_info: "צריך להבין יותר איך זה יעבוד",
  nothing_blocking: "אין משהו שמונע להתקדם",
  other: "נושא נוסף",
};

const START_TIMING: Record<string, string> = {
  asap: "בהקדם האפשרי",
  soon: "בימים הקרובים",
  this_month: "במהלך החודש",
  next_month: "בחודש הבא",
  later: "בהמשך",
  unknown: "עדיין לא יודעים",
  other: "מועד אחר",
};

const MAPS = [RELEVANT, AUTOMATION, SERVICE, BLOCKER, START_TIMING];

export function heLabel(value?: string): string {
  const raw = String(value || "").trim();
  if (!raw) return "";
  for (const map of MAPS) {
    if (map[raw]) return map[raw];
  }
  if (/^[\u0590-\u05FF]/.test(raw) || raw.includes(" ")) return raw;
  if (/^[a-z][a-z0-9_]+$/i.test(raw)) {
    return raw
      .split("_")
      .filter(Boolean)
      .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
      .join(" ");
  }
  return raw;
}

export function heLabels(values?: string[]): string[] {
  return (values || []).map(heLabel).filter(Boolean);
}

export const PROPOSAL_STATUS_LABELS: Record<string, string> = {
  draft: "טיוטה",
  issued: "הונפקה",
  viewed: "נצפתה",
  question_asked: "שאלה על הצעה",
  thinking: "חושב על זה",
  signing_pending: "ממתין לחתימה",
  signed: "נחתמה",
  payment_pending: "ממתין לתשלום",
  paid: "שולמה",
  accepted: "אושרה",
  declined: "נדחתה",
  expired: "פג תוקף",
};
