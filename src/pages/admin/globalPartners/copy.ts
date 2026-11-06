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
  rejected: "נפסל",
  archived: "בארכיון",
};

export const WORK_AREA_LABELS: Record<string, string> = {
  discovery: "מאגר מועמדים",
  outreach: "מרכז פניות",
  pipeline: "שותפים בתהליך",
  active: "שותפים פעילים",
};

export const OUTREACH_WORKFLOW_LABELS: Record<string, string> = {
  awaiting_prep: "ממתין להכנת פנייה",
  draft_in_progress: "טיוטה בהכנה",
  awaiting_approval: "ממתין לאישור",
  approved_to_send: "מאושר לשליחה",
  sent: "נשלח",
  reply_received: "התקבלה תשובה",
  interested: "מעוניין",
  not_interested: "לא מעוניין",
  needs_followup: "נדרש מעקב",
  closed: "סגור",
};

export const PIPELINE_STAGE_LABELS: Record<string, string> = {
  expressed_interest: "הביע עניין",
  contact_established: "נוצר קשר",
  intro_call: "שיחת היכרות",
  proposal_sent: "הצעה נשלחה",
  negotiation: "משא ומתן",
  awaiting_agreement: "ממתין להסכם",
  agreement_signed: "הסכם נחתם",
  onboarding_complete: "הצטרפות הושלמה",
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
  blocked: "חסומה",
  cancelled: "בוטלה",
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
  "candidate.status_change": "שינוי סטטוס",
  "outreach.preview": "הכנת טיוטת פנייה",
  "outreach.draft_save": "שמירת טיוטת פנייה",
  "outreach.approve": "אישור פנייה",
  "outreach.send": "שליחת פנייה",
  "outreach.status": "עדכון סטטוס פנייה",
  "outreach.inbound_unmatched": "תשובה שלא שויכה",
  "outreach.inbound_forwarded": "העברת אירוע נכנס",
  "workflow.approve_for_outreach": "אישור להעברה למרכז פניות",
  "workflow.reject": "פסילת מועמד",
  "workflow.archive": "העברה לארכיון",
  "workflow.outreach_status": "עדכון סטטוס פנייה",
  "workflow.move_to_pipeline": "העברה לשותפים בתהליך",
  "workflow.pipeline_stage": "מעבר שלב בתהליך",
  "workflow.promote_to_active": "הפיכה לשותף פעיל",
  "workflow.revert_area": "החזרה לאזור קודם",
};

export function statusLabel(status: string) {
  return STATUS_LABELS[status] || status || "—";
}

export function workAreaLabel(area: string) {
  return WORK_AREA_LABELS[area] || area || "—";
}

export function outreachWorkflowLabel(status: string) {
  return OUTREACH_WORKFLOW_LABELS[status] || status || "—";
}

export function pipelineStageLabel(stage: string) {
  return PIPELINE_STAGE_LABELS[stage] || stage || "—";
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

export const PIPELINE_STAGE_ORDER = Object.keys(PIPELINE_STAGE_LABELS);
export const OUTREACH_WORKFLOW_ORDER = Object.keys(OUTREACH_WORKFLOW_LABELS);
