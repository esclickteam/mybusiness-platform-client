export function formatBillingDate(
  value: string | Date | null | undefined,
  locale: string
) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString(locale, {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}

export function formatIls(
  amount: number | null | undefined,
  locale: string
) {
  const safe = typeof amount === "number" ? amount : 0;
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "ILS",
    maximumFractionDigits: 2,
  }).format(safe);
}

export function statusBadgeClass(status?: string | null) {
  const s = (status || "").toLowerCase();
  if (["paid", "active", "renewed"].includes(s)) {
    return "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200";
  }
  if (["failed", "expired", "canceled", "cancelled", "unpaid"].includes(s)) {
    return "bg-rose-50 text-rose-700 ring-1 ring-rose-200";
  }
  if (["past_due", "partially_refunded", "paused", "cancel_scheduled"].includes(s)) {
    return "bg-amber-50 text-amber-700 ring-1 ring-amber-200";
  }
  return "bg-slate-50 text-slate-600 ring-1 ring-slate-200";
}

export const ONE_TIME_SERVICE_KEYS = new Set([
  "website_addon",
  "crm_migration_790_ils",
  "automations_setup_1_390_ils",
  "automations_setup_3_890_ils",
  "automations_setup_6_1490_ils",
  "expert_website_build_1490_ils",
  "store_products_upload_490_ils",
  "old_leads_followup_590_ils",
]);

export const MONTHLY_SERVICE_KEYS = new Set([
  "lead_response_690_ils_monthly",
  "collaboration_manager_790_ils_monthly",
  "personal_sales_rep_1490_ils_monthly",
]);
