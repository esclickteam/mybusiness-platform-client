import type { PartnerClientStatus } from "../types/partner";

export const PARTNER_STATUS_LABEL: Record<string, string> = {
  lead: "New lead",
  waiting_payment: "Waiting for payment",
  provisioning: "In progress",
  active: "Active",
  payment_issue: "Follow-up",
  suspended: "Suspended",
  cancelled: "Cancelled",
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

type TranslateFn = (key: string, options?: { defaultValue?: string }) => string;

export function partnerStatusKey(value: string) {
  return `partner.status.${value}`;
}

/**
 * Partner UI should pass `t` so labels resolve via partner.status.*.
 * Without `t`, English enum fallbacks are returned (not locale-specific).
 */
export function partnerStatusLabel(value?: string | null, t?: TranslateFn) {
  if (!value) return "—";
  const fallback = PARTNER_ENUM_LABEL[value] || PARTNER_STATUS_LABEL[value] || value;
  if (!t) return fallback;
  return t(partnerStatusKey(value), { defaultValue: fallback });
}

export const PARTNER_ENUM_LABEL: Record<string, string> = {
  pending: "Pending",
  processing: "Processing",
  paid: "Paid",
  failed: "Failed",
  refunded: "Refunded",
  not_started: "Not started",
  active: "Active",
  requires_action: "Needs attention",
  eligible: "Eligible",
  requested: "Withdrawal requested",
  approved: "Approved",
  rejected: "Rejected",
  cancelled: "Cancelled",
  submitted: "Submitted",
  contacted: "Contacted",
  partner_created: "Partner opened",
  reward_approved: "Reward approved",
  reward_paid: "Reward paid",
  partner_manual: "Manual deal",
  partner_public_page: "Purchase via my link",
  initial_deal: "First deal",
  renewal: "Renewal",
  partner_referral: "Partner referral",
  awaiting_paid_package: "Waiting for a paid package",
  partner_percent: "Percentage only",
  customer_sale: "Customer sale",
  customer_sale_one_time: "One-time commission",
  customer_sale_recurring: "Monthly commission",
  customer_renewal: "Customer renewal",
  software_entitlement: "Software module",
  human_service: "Human service",
  fulfilled: "Activated",
  not_applicable: "Not required",
  completed: "Completed",
  paid_requires_action: "Paid — needs attention",
  open: "Open",
  withdrawal_requested: "Withdrawal requested",
  reversed: "Reversed",
  unpaid: "Unpaid",
  chargeback: "Chargeback",
  incomplete: "Incomplete",
  draft: "Draft",
  waiting_customer: "Waiting for customer",
  waiting_payment: "Waiting for payment",
  payment_failed: "Payment failed",
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
