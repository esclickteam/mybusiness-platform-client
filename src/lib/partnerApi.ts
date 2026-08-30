import API from "@api";
import type {
  AmountDue,
  PartnerClient,
  PartnerMe,
  PartnerPermission,
  PartnerPlan,
  PartnerPlanKey,
  PartnerPriceLine,
  PartnerCompliance,
} from "../types/partner";

export async function fetchPartnerPlans() {
  const { data } = await API.get("/public/partner-plans");
  return (data.plans || []) as PartnerPlan[];
}

export async function registerPartner(payload: {
  name: string;
  email: string;
  password: string;
  businessName: string;
  planKey: string;
}) {
  const { data } = await API.post("/partner/register", payload);
  return data;
}

export async function fetchPartnerMe() {
  const { data } = await API.get("/partner/me");
  return {
    ...(data.partner || {}),
    branding: data.branding || data.partner?.branding,
    urls: data.urls,
    billingCheckoutAvailable: Boolean(data.billingCheckoutAvailable),
  } as PartnerMe;
}

export function partnerApiError(err: unknown, fallback: string) {
  const data = (
    err as {
      response?: { data?: { error?: string; message?: string; details?: string } };
      message?: string;
    }
  )?.response?.data;
  if (typeof data?.error === "string" && data.error.trim()) return data.error.trim();
  if (typeof data?.message === "string" && data.message.trim()) return data.message.trim();
  if (typeof data?.details === "string" && data.details.trim()) return data.details.trim();
  if (err instanceof Error) {
    const msg = String(err.message || "").trim();
    if (msg && msg !== "Error" && msg !== "undefined") return msg;
  }
  return fallback;
}

export async function enterPartnerClient(id: string) {
  const { data } = await API.post(`/partner/clients/${id}/enter`);
  return data as {
    token: string;
    user: {
      role?: string;
      businessId?: string;
      managedBusinessId?: string;
      managedBusinessName?: string | null;
      partnerId?: string;
      partnerName?: string | null;
      enabledModules?: string[] | null;
      businessName?: string | null;
      impersonatorRole?: string | null;
    };
  };
}

export async function exitPartnerManagedContext() {
  const { data } = await API.post("/partner/managed-context/exit");
  return data as { token: string; user: { redirectUrl?: string; role?: string } };
}

export async function fetchPartnerDashboard(params?: Record<string, string>) {
  const { data } = await API.get("/partner/dashboard", { params });
  return data;
}

export async function fetchPartnerTransactions(params?: Record<string, string | number | undefined>) {
  const { data } = await API.get("/partner/transactions", { params });
  return data;
}

export async function fetchPartnerBalance() {
  const { data } = await API.get("/partner/balance");
  return data as AmountDue;
}

export async function fetchPartnerLedger() {
  const { data } = await API.get("/partner/ledger");
  return data;
}

export async function fetchPartnerCatalog() {
  const { data } = await API.get("/partner/catalog");
  return data as {
    items: PartnerPriceLine[];
    wizard: import("../types/partner").PartnerWizardCatalog;
    planKey: string;
    partnerShareRate: number;
    bizuplyShareRate: number;
  };
}

export async function fetchPartnerPricebook() {
  const { data } = await API.get("/partner/pricebook");
  return (data.items || []) as PartnerPriceLine[];
}

export async function updatePricebookItem(
  sku: string,
  payload: {
    markupIls?: number;
    oneTimeMarkupEnabled?: boolean;
    oneTimeMarkupAmount?: number;
    recurringMarkupEnabled?: boolean;
    recurringMarkupAmount?: number;
    enabledInStorefront?: boolean;
  }
) {
  const { data } = await API.patch(`/partner/pricebook/${encodeURIComponent(sku)}`, payload);
  return data.item as PartnerPriceLine;
}

export async function fetchPartnerClients(params: {
  q?: string;
  status?: string;
  page?: number;
  limit?: number;
}) {
  const { data } = await API.get("/partner/clients", { params });
  return data as { items: PartnerClient[]; total: number; page: number; limit: number };
}

export async function fetchPartnerClient(id: string) {
  const { data } = await API.get(`/partner/clients/${id}`);
  return data as {
    client: PartnerClient;
    deals?: import("../types/partner").PartnerDeal[];
  };
}

export async function createPartnerClient(payload: Record<string, unknown>) {
  const { data } = await API.post("/partner/clients", payload);
  return data;
}

export async function updatePartnerClient(id: string, payload: Record<string, unknown>) {
  const { data } = await API.patch(`/partner/clients/${id}`, payload);
  return data.client as PartnerClient;
}

export async function quotePartnerClient(
  id: string,
  lines: { sku: string; displayNameHe?: string }[]
) {
  const { data } = await API.post(`/partner/clients/${id}/quote`, {
    lines,
  });
  return data;
}

export async function createPartnerDeal(
  clientId: string,
  payload: {
    lines: { sku: string; displayNameHe?: string }[];
    packageDisplayName?: string;
    packageDescription?: string;
    logoUrl?: string;
    kind?: string;
  }
) {
  const { data } = await API.post(`/partner/clients/${clientId}/deals`, payload);
  return data as {
    deal: import("../types/partner").PartnerDeal;
    publicUrl: string;
  };
}

export async function updatePartnerDeal(
  dealId: string,
  payload: {
    packageDisplayName?: string;
    packageDescription?: string;
    logoUrl?: string;
    lineNames?: Array<{ sku: string; displayNameHe: string }>;
  }
) {
  const { data } = await API.patch(`/partner/deals/${dealId}`, payload);
  return data as {
    deal: import("../types/partner").PartnerDeal;
    serviceRows?: PartnerServiceRow[];
  };
}

export type PartnerServiceRow = {
  sku: string;
  name: string;
  billing?: string;
  isPackage?: boolean;
  partnerPrice: number;
  customerPrice: number;
  customerSetup?: number;
  payBizuply: number;
  payBizuplySetupShare?: number;
  payBizuplyMonthlyShare?: number;
  oneTimeCommission?: number;
  monthlyCommission?: number;
  partnerIncomeOneTime?: number;
  partnerIncomeRecurring?: number;
};

export async function fetchPartnerDeal(dealId: string) {
  const { data } = await API.get(`/partner/deals/${dealId}`);
  return data as {
    deal: import("../types/partner").PartnerDeal;
    client: PartnerClient | null;
    stripeItems: Array<{ nameEn: string; nameHe: string; amountIls: number; billing: string; sku: string }>;
    serviceRows?: PartnerServiceRow[];
    billingSafety?: {
      ok: boolean;
      enabled: boolean;
      mode?: string;
      code?: string;
      message?: string;
    };
  };
}

export async function startPartnerDealCheckout(dealId: string) {
  const { data } = await API.post(`/partner/deals/${dealId}/checkout`);
  return data as { url: string; sessionId: string; livemode?: boolean };
}

export async function fetchPublicPartnerDeal(dealId: string) {
  const { data } = await API.get(`/public/partner-deals/${dealId}`);
  return data.summary as Record<string, unknown>;
}

export async function fetchPartnerWithdrawals() {
  const { data } = await API.get("/partner/withdrawals");
  return data as {
    items: any[];
    balances: {
      eligible: number;
      pending: number;
      requested: number;
      paid: number;
    };
    cycle: { copy: string; afterCutoff: boolean; expectedPaymentBy: string; cutoffDate: string };
  };
}

export async function submitPartnerWithdrawal(form: FormData) {
  const { data } = await API.post("/partner/withdrawals", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

export async function fetchAdminWithdrawalMonth() {
  const { data } = await API.get("/admin/partners/withdrawals/month");
  return data.summary as {
    count: number;
    total: number;
    submitted: number;
    under_review: number;
    approved: number;
    rejected: number;
    paid: number;
  };
}

export async function fetchAdminPartnerWithdrawalsPending() {
  const { data } = await API.get("/admin/partners/withdrawals/pending");
  return data as { items: any[] };
}

export async function fetchAdminPartnerPaymentsRecent() {
  const { data } = await API.get("/admin/partners/payments/recent");
  return data as { items: any[] };
}

export async function fetchAdminPartnerDossier(id: string) {
  const { data } = await API.get(`/admin/partners/${id}/dossier`);
  return data;
}

export async function fetchAdminWithdrawalRequest(partnerId: string, requestId: string) {
  const { data } = await API.get(`/admin/partners/${partnerId}/withdrawals/${requestId}`);
  return data as { request: any; commissions?: any[] };
}

export async function adminReviewWithdrawal(
  partnerId: string,
  requestId: string,
  action: "approve" | "reject" | "pay",
  payload: Record<string, unknown> = {}
) {
  const { data } = await API.post(
    `/admin/partners/${partnerId}/withdrawals/${requestId}/${action}`,
    payload
  );
  return data;
}

export async function submitPartnerClient(id: string) {
  const { data } = await API.post(`/partner/clients/${id}/submit`);
  return data;
}

export async function activatePartnerClient(id: string, password?: string) {
  const { data } = await API.post(`/partner/clients/${id}/activate`, { password });
  return data;
}

export async function addPartnerNote(id: string, text: string) {
  const { data } = await API.post(`/partner/clients/${id}/notes`, { text });
  return data.notes;
}

export async function addPartnerTask(id: string, title: string, dueAt?: string) {
  const { data } = await API.post(`/partner/clients/${id}/tasks`, { title, dueAt });
  return data.tasks;
}

export async function togglePartnerTask(id: string, taskId: string, done: boolean) {
  const { data } = await API.patch(`/partner/clients/${id}/tasks/${taskId}`, { done });
  return data.tasks;
}

export async function fetchPartnerStorefront() {
  const { data } = await API.get("/partner/storefront");
  return data;
}

export async function updatePartnerStorefront(payload: Record<string, unknown>) {
  const { data } = await API.patch("/partner/storefront", payload);
  return data;
}

export async function updatePartnerCompliance(payload: Record<string, unknown>) {
  const { data } = await API.patch("/partner/compliance", payload);
  return data.compliance as PartnerCompliance;
}

export async function uploadPartnerComplianceDocument(kind: string, file: File) {
  const form = new FormData();
  form.append("kind", kind);
  form.append("file", file);
  const { data } = await API.post("/partner/compliance/documents", form);
  return data.compliance as PartnerCompliance;
}

export async function adminReviewPartnerCompliance(
  partnerId: string,
  payload: { status: "approved" | "rejected"; adminFeedback?: string }
) {
  const { data } = await API.post(`/admin/partners/${partnerId}/compliance/review`, payload);
  return data.compliance as PartnerCompliance;
}

export async function fetchPartnerTeam() {
  const { data } = await API.get("/partner/team");
  return data;
}

export async function invitePartnerMember(payload: {
  name: string;
  email: string;
  password: string;
  permissions: PartnerPermission[];
}) {
  const { data } = await API.post("/partner/team", payload);
  return data;
}

export async function updatePartnerMember(
  membershipId: string,
  permissions: PartnerPermission[]
) {
  const { data } = await API.patch(`/partner/team/${membershipId}`, { permissions });
  return data;
}

export async function revokePartnerMember(membershipId: string) {
  const { data } = await API.delete(`/partner/team/${membershipId}`);
  return data;
}

export async function fetchPublicStorefront(slug: string) {
  const { data } = await API.get(`/public/p/${encodeURIComponent(slug)}`);
  return data;
}

export async function fetchAdminPartners(q?: string) {
  const { data } = await API.get("/admin/partners", { params: q ? { q } : undefined });
  return data;
}

export async function adminActivateSetup(id: string, waived = false) {
  const { data } = await API.post(`/admin/partners/${id}/activate-setup`, { waived });
  return data;
}

export async function adminPostMonthly(id: string) {
  const { data } = await API.post(`/admin/partners/${id}/post-monthly`);
  return data;
}

export async function adminRecordPayment(id: string, amountIls: number) {
  const { data } = await API.post(`/admin/partners/${id}/record-payment`, { amountIls });
  return data;
}

export async function adminSeedShowcaseDemo() {
  const { data } = await API.post("/admin/partners/showcase-demo");
  return data;
}

export async function adminChangePartnerPlan(id: string, planKey: PartnerPlanKey) {
  const { data } = await API.post(`/admin/partners/${id}/plan`, { planKey });
  return data;
}

export async function adminMarkCommissionPaid(partnerId: string, entryId: string) {
  const { data } = await API.post(`/admin/partners/${partnerId}/commissions/${entryId}/mark-paid`);
  return data;
}

export async function adminReverseCommission(
  partnerId: string,
  entryId: string,
  reason: "refund" | "chargeback" = "refund"
) {
  const { data } = await API.post(`/admin/partners/${partnerId}/commissions/${entryId}/reverse`, {
    reason,
  });
  return data;
}

export async function fetchAdminPartnerTransactions(partnerId: string) {
  const { data } = await API.get(`/admin/partners/${partnerId}/transactions`, {
    params: { preset: "month", limit: 100 },
  });
  return data;
}

export async function adminSuspendPartner(id: string, resume = false) {
  const { data } = await API.post(`/admin/partners/${id}/suspend`, {
    status: resume ? "active" : "suspended",
  });
  return data;
}

export async function createPartnerWorkItem(payload: {
  clientId: string;
  title: string;
  description?: string;
  dueAt?: string;
  kind?: "task" | "reminder";
  dealId?: string;
}) {
  const { data } = await API.post("/partner/work-items", payload);
  return data;
}

export async function retryPartnerDealActivation(dealId: string) {
  const { data } = await API.post(`/partner/deals/${dealId}/retry-activation`);
  return data;
}

export async function changePartnerDealEmail(dealId: string, email: string) {
  const { data } = await API.post(`/partner/deals/${dealId}/change-email`, { email });
  return data;
}

export async function linkPartnerDealBusiness(dealId: string, businessId: string) {
  const { data } = await API.post(`/partner/deals/${dealId}/link-business`, { businessId });
  return data;
}

export async function fetchPartnerBranding() {
  const { data } = await API.get("/partner/branding");
  return data;
}

export async function updatePartnerBranding(payload: Record<string, unknown>) {
  const { data } = await API.patch("/partner/branding", payload);
  return data;
}

export async function uploadPartnerLogo(file: File, kind: "logo" | "favicon" = "logo") {
  const form = new FormData();
  form.append("file", file);
  form.append("kind", kind);
  const { data } = await API.post("/partner/branding/logo", form);
  return data;
}

export type PartnerSubdomainCheck = {
  value: string;
  available: boolean;
  code: string;
  message: string;
};

export async function checkPartnerSubdomain(subdomain: string) {
  const { data } = await API.get("/partner/branding/subdomain", {
    params: { value: subdomain },
  });
  return data as PartnerSubdomainCheck;
}

export async function fetchPartnerReferrals() {
  const { data } = await API.get("/partner/referrals");
  return data;
}

export async function submitPartnerReferral(payload: Record<string, string>) {
  const { data } = await API.post("/partner/referrals", payload);
  return data;
}

export async function fetchPublicPartnerBranding(params?: { host?: string; slug?: string }) {
  const { data } = await API.get("/public/branding", { params });
  return data.branding;
}

export async function fetchPublicPartnerPlans(slug: string) {
  const { data } = await API.get(`/public/p/${encodeURIComponent(slug)}/plans`);
  return data;
}

export async function startPublicPartnerCheckout(
  slug: string,
  payload: { sku: string; email: string; name?: string; phone?: string; businessName?: string }
) {
  const { data } = await API.post(`/public/p/${encodeURIComponent(slug)}/checkout`, payload);
  return data;
}

export async function fetchPublicCheckoutStatus(slug: string, sessionId: string) {
  const { data } = await API.get(
    `/public/p/${encodeURIComponent(slug)}/checkout/${encodeURIComponent(sessionId)}`
  );
  return data;
}

export async function fetchAdminPartnerAttentionDeals() {
  const { data } = await API.get("/admin/partners/deals/needs-attention");
  return data as { items: any[] };
}

export async function fetchAdminPartnerReferrals() {
  const { data } = await API.get("/admin/partners/referrals");
  return data as { items: any[] };
}

export async function adminPartnerReferralAction(
  referralId: string,
  action: string,
  payload: Record<string, unknown> = {}
) {
  const { data } = await API.post(`/admin/partners/referrals/${referralId}/${action}`, payload);
  return data;
}

export async function adminRetryDealActivation(partnerId: string, dealId: string) {
  const { data } = await API.post(`/admin/partners/${partnerId}/deals/${dealId}/retry-activation`);
  return data;
}

export async function adminLinkDealBusiness(partnerId: string, dealId: string, businessId: string) {
  const { data } = await API.post(`/admin/partners/${partnerId}/deals/${dealId}/link-business`, {
    businessId,
  });
  return data;
}
