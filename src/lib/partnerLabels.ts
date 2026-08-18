import type { PartnerClientStatus } from "../types/partner";

export const PARTNER_STATUS_LABEL: Record<string, string> = {
  lead: "ליד",
  waiting_payment: "ממתין לתשלום",
  provisioning: "בהקמה",
  active: "פעיל",
  payment_issue: "בעיית תשלום",
  suspended: "מושעה",
  cancelled: "בוטל",
};

export const PARTNER_STATUS_TONE: Record<string, string> = {
  lead: "bg-sky-50 text-sky-800",
  waiting_payment: "bg-amber-50 text-amber-800",
  provisioning: "bg-indigo-50 text-indigo-800",
  active: "bg-emerald-50 text-emerald-800",
  payment_issue: "bg-orange-50 text-orange-800",
  suspended: "bg-rose-50 text-rose-800",
  cancelled: "bg-slate-100 text-slate-500",
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
