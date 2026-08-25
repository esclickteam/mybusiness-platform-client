import type { PartnerClientStatus } from "../types/partner";

export const PARTNER_STATUS_LABEL: Record<string, string> = {
  lead: "ליד חדש",
  waiting_payment: "ממתין לתשלום",
  provisioning: "בתהליך",
  active: "פעיל",
  payment_issue: "מעקב",
  suspended: "מושעה",
  cancelled: "בוטל",
};

export const PARTNER_STATUS_TONE: Record<string, string> = {
  lead: "bg-[#F3E8FF] text-[#6B21A8]",
  waiting_payment: "bg-[#FFEDD5] text-[#9A3412]",
  provisioning: "bg-[#E0F2FE] text-[#075985]",
  active: "bg-[#DCFCE7] text-[#166534]",
  payment_issue: "bg-[#F1F5F9] text-[#475569]",
  suspended: "bg-[#FFE4E6] text-[#9F1239]",
  cancelled: "bg-[#F1F5F9] text-[#64748B]",
};

export const PARTNER_STATUS_BADGE_TONE: Record<
  string,
  "violet" | "sky" | "amber" | "emerald" | "slate" | "rose"
> = {
  lead: "violet",
  waiting_payment: "amber",
  provisioning: "sky",
  active: "emerald",
  payment_issue: "slate",
  suspended: "rose",
  cancelled: "slate",
};

export function partnerStatusLabel(value?: string | null) {
  if (!value) return "—";
  return PARTNER_ENUM_LABEL[value] || PARTNER_STATUS_LABEL[value] || value;
}

export const PARTNER_ENUM_LABEL: Record<string, string> = {
  pending: "ממתין",
  processing: "בתהליך",
  paid: "שולם",
  failed: "נכשל",
  refunded: "הוחזר",
  not_started: "טרם התחיל",
  active: "פעיל",
  requires_action: "דורש טיפול",
  eligible: "זכאית",
  requested: "בבקשת משיכה",
  approved: "מאושר",
  rejected: "נדחה",
  cancelled: "בוטל",
  submitted: "נשלח",
  contacted: "נוצר קשר",
  partner_created: "נפתח פרטנר",
  reward_approved: "תגמול אושר",
  reward_paid: "תגמול שולם",
  partner_manual: "עסקה ידנית",
  partner_public_page: "רכישה דרך הקישור שלי",
  initial_deal: "עסקה ראשונה",
  renewal: "חידוש",
  partner_referral: "צירוף פרטנר",
  customer_sale: "מכירת לקוח",
  customer_sale_one_time: "עמלה חד-פעמית",
  customer_sale_recurring: "עמלה חודשית",
  customer_renewal: "חידוש לקוח",
  software_entitlement: "מודול תוכנה",
  human_service: "שירות אנושי",
  fulfilled: "הופעל",
  not_applicable: "לא נדרש",
  completed: "הושלם",
  paid_requires_action: "שולם – דורש טיפול",
  open: "פתוח",
  withdrawal_requested: "בבקשת משיכה",
  reversed: "הפוכה",
  unpaid: "לא שולם",
  chargeback: "חיוב חוזר",
  incomplete: "חסר",
  draft: "טיוטה",
  waiting_customer: "ממתין ללקוח",
  waiting_payment: "ממתין לתשלום",
  payment_failed: "תשלום נכשל",
};

export const PARTNER_CLIENT_STATUSES: Array<PartnerClientStatus | ""> = [
  "",
  "lead",
  "waiting_payment",
  "provisioning",
  "active",
  "payment_issue",
  "suspended",
  "cancelled",
];
