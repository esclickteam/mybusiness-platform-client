import API from "@api";
import type {
  AmountDue,
  PartnerClient,
  PartnerMe,
  PartnerPermission,
  PartnerPlan,
  PartnerPlanKey,
  PartnerPriceLine,
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
  return data.partner as PartnerMe;
}

export async function fetchPartnerDashboard() {
  const { data } = await API.get("/partner/dashboard");
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
  return (data.items || []) as PartnerPriceLine[];
}

export async function fetchPartnerPricebook() {
  const { data } = await API.get("/partner/pricebook");
  return (data.items || []) as PartnerPriceLine[];
}

export async function updatePricebookItem(
  sku: string,
  payload: { markupIls: number; enabledInStorefront?: boolean }
) {
  const { data } = await API.patch(`/partner/pricebook/${encodeURIComponent(sku)}`, payload);
  return data.item as PartnerPriceLine;
}

export async function fetchPartnerClients(params: {
  q?: string;
  status?: string;
  page?: number;
}) {
  const { data } = await API.get("/partner/clients", { params });
  return data as { items: PartnerClient[]; total: number; page: number; limit: number };
}

export async function fetchPartnerClient(id: string) {
  const { data } = await API.get(`/partner/clients/${id}`);
  return data.client as PartnerClient;
}

export async function createPartnerClient(payload: Record<string, unknown>) {
  const { data } = await API.post("/partner/clients", payload);
  return data;
}

export async function updatePartnerClient(id: string, payload: Record<string, unknown>) {
  const { data } = await API.patch(`/partner/clients/${id}`, payload);
  return data.client as PartnerClient;
}

export async function quotePartnerClient(id: string, lines: { sku: string; markupIls: number }[]) {
  const { data } = await API.post(`/partner/clients/${id}/quote`, { lines });
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

export async function enterPartnerClient(id: string) {
  const { data } = await API.post(`/partner/clients/${id}/enter`);
  return data as {
    token: string;
    user: {
      businessId?: string;
      enabledModules?: string[] | null;
      businessName?: string | null;
      impersonatorRole?: string;
    };
  };
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

export async function adminChangePartnerPlan(id: string, planKey: PartnerPlanKey) {
  const { data } = await API.post(`/admin/partners/${id}/plan`, { planKey });
  return data;
}

export async function adminSuspendPartner(id: string, resume = false) {
  const { data } = await API.post(`/admin/partners/${id}/suspend`, {
    status: resume ? "active" : "suspended",
  });
  return data;
}
