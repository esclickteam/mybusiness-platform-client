export const STATUS_LABELS: Record<string, string> = {
  discovered: "אותר",
  pending_review: "ממתין לבדיקה",
  approved_for_outreach: "אושר לפנייה",
  outreach_sent: "נשלחה פנייה",
  response_received: "התקבלה תגובה",
  interested: "מתעניין",
  negotiation: "משא ומתן",
  proposal_sent: "נשלחה הצעה",
  agreement_signed: "נחתם הסכם",
  active_partner: "שותף פעיל",
  rejected: "לא רלוונטי / נדחה",
};

export const TRACK_LABELS: Record<string, string> = {
  affiliate: "שותף שיווקי",
  business_partner: "שותף עסקי",
  reseller: "מפיץ",
  white_label: "מותג לבן",
  exclusive_territory: "בלעדיות טריטוריאלית",
  referral_strategic: "הפניה אסטרטגית",
};

export const CHANNEL_LABELS: Record<string, string> = {
  email: "אימייל",
  phone: "טלפון",
  form: "טופס יצירת קשר",
  linkedin: "לינקדאין",
};

export const DIRECTION_LABELS: Record<string, string> = {
  outbound: "יוצאת",
  inbound: "נכנסת",
};

export const MESSAGE_STATUS_LABELS: Record<string, string> = {
  draft: "טיוטה",
  previewed: "בתצוגה מקדימה",
  approved: "מאושרת",
  queued: "בתור",
  sent: "נשלחה",
  failed: "נכשלה",
  suppressed: "חסומה",
  dry_run: "בדיקה פנימית",
};

export const CHANNEL_STATUS_LABELS: Record<string, string> = {
  extracted: "חולץ",
  verified: "מאומת",
  manual_verified: "אומת ידנית",
  invalid: "לא תקין",
  bounced: "חזר",
  mx_ok: "MX תקין",
  format_ok: "פורמט תקין",
  published: "פורסם",
  pending: "ממתין",
};

export const AUDIT_LABELS: Record<string, string> = {
  "candidate.create": "יצירת מועמד",
  "candidate.update": "עדכון מועמד",
  "candidate.rescore": "חישוב ציון מחדש",
  "candidate.enrich": "העשרת פרטי קשר",
  "outreach.preview": "הכנת טיוטת פנייה",
  "outreach.draft_save": "שמירת טיוטת פנייה",
  "outreach.approve": "אישור פנייה",
  "outreach.send": "שליחת פנייה",
  "outreach.status": "עדכון סטטוס פנייה",
  "outreach.inbound_unmatched": "תשובה שלא שויכה",
  "outreach.inbound_forwarded": "העברת אירוע נכנס",
};

export function statusLabel(status: string) {
  return STATUS_LABELS[status] || status || "—";
}

export function trackLabel(track: string) {
  return TRACK_LABELS[track] || track || "—";
}

export function channelLabel(type: string) {
  return CHANNEL_LABELS[type] || type || "—";
}

export function directionLabel(dir: string) {
  return DIRECTION_LABELS[dir] || dir || "—";
}

export function messageStatusLabel(status: string) {
  return MESSAGE_STATUS_LABELS[status] || status || "—";
}

export function channelStatusLabel(status: string) {
  return CHANNEL_STATUS_LABELS[status] || status || "—";
}

export function auditLabel(action: string) {
  return AUDIT_LABELS[action] || action || "פעילות";
}
