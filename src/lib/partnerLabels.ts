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
