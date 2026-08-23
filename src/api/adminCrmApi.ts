import API from "../api";

export type AdminCrmListQuery = Record<string, string | number | boolean | undefined>;

function qs(params: AdminCrmListQuery = {}) {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    search.set(key, String(value));
  });
  const text = search.toString();
  return text ? `?${text}` : "";
}

export const adminCrmApi = {
  meta: () => API.get("/admin/crm/meta"),
  dashboard: () => API.get("/admin/crm/dashboard"),
  admins: () => API.get("/admin/crm/admins"),
  customers: (params: AdminCrmListQuery = {}) =>
    API.get(`/admin/crm/customers${qs(params)}`),
  createCustomer: (body: Record<string, unknown>) =>
    API.post("/admin/crm/customers", body),
  customer: (id: string) => API.get(`/admin/crm/customers/${id}`),
  updateCustomer: (id: string, body: Record<string, unknown>) =>
    API.patch(`/admin/crm/customers/${id}`, body),
  archiveCustomer: (id: string) => API.post(`/admin/crm/customers/${id}/archive`),
  deleteCustomer: (id: string) => API.delete(`/admin/crm/customers/${id}`),
  markWon: (id: string) => API.post(`/admin/crm/customers/${id}/won`),
  markLost: (id: string, body: Record<string, unknown>) =>
    API.post(`/admin/crm/customers/${id}/lost`, body),
  followUp: (id: string, body: Record<string, unknown>) =>
    API.post(`/admin/crm/customers/${id}/follow-up`, body),
  completeFollowUp: (id: string, body: Record<string, unknown> = {}) =>
    API.post(`/admin/crm/customers/${id}/follow-up/complete`, body),
  followUps: (params: AdminCrmListQuery = {}) =>
    API.get(`/admin/crm/follow-ups${qs(params)}`),
  enterBusiness: (id: string, body: Record<string, unknown> = {}) =>
    API.post(`/admin/crm/customers/${id}/enter-business`, body),
  healthOverride: (id: string, body: Record<string, unknown>) =>
    API.post(`/admin/crm/customers/${id}/health-override`, body),
  timeline: (id: string) => API.get(`/admin/crm/customers/${id}/timeline`),
  activities: (id: string) => API.get(`/admin/crm/customers/${id}/activities`),
  createActivity: (id: string, body: Record<string, unknown>) =>
    API.post(`/admin/crm/customers/${id}/activities`, body),
  notes: (id: string) => API.get(`/admin/crm/customers/${id}/notes`),
  createNote: (id: string, body: Record<string, unknown>) =>
    API.post(`/admin/crm/customers/${id}/notes`, body),
  updateNote: (noteId: string, body: Record<string, unknown>) =>
    API.patch(`/admin/crm/notes/${noteId}`, body),
  customerTasks: (id: string) => API.get(`/admin/crm/customers/${id}/tasks`),
  createTask: (id: string, body: Record<string, unknown>) =>
    API.post(`/admin/crm/customers/${id}/tasks`, body),
  updateTask: (taskId: string, body: Record<string, unknown>) =>
    API.patch(`/admin/crm/tasks/${taskId}`, body),
  subscription: (id: string) => API.get(`/admin/crm/customers/${id}/subscription`),
  products: (id: string) => API.get(`/admin/crm/customers/${id}/products`),
  websites: (id: string) => API.get(`/admin/crm/customers/${id}/websites`),
  whatsapp: (id: string) => API.get(`/admin/crm/customers/${id}/whatsapp`),
  automations: (id: string) => API.get(`/admin/crm/customers/${id}/automations`),
  billing: (id: string) => API.get(`/admin/crm/customers/${id}/billing`),
  previewPlan: (id: string, body: Record<string, unknown>) =>
    API.post(`/admin/crm/customers/${id}/plan/preview`, body),
  confirmPlan: (id: string, body: Record<string, unknown>) =>
    API.post(`/admin/crm/customers/${id}/plan/confirm`, body),
  pipeline: (params: AdminCrmListQuery = {}) =>
    API.get(`/admin/crm/pipeline${qs(params)}`),
  movePipeline: (body: Record<string, unknown>) =>
    API.patch("/admin/crm/pipeline/move", body),
  tasks: (params: AdminCrmListQuery = {}) =>
    API.get(`/admin/crm/tasks${qs(params)}`),
  globalActivities: () => API.get("/admin/crm/activities"),
  tags: () => API.get("/admin/crm/tags"),
  createTag: (body: Record<string, unknown>) => API.post("/admin/crm/tags", body),
  filters: () => API.get("/admin/crm/filters"),
  saveFilter: (body: Record<string, unknown>) => API.post("/admin/crm/filters", body),
  deleteFilter: (id: string) => API.delete(`/admin/crm/filters/${id}`),
  bulk: (body: Record<string, unknown>) => API.post("/admin/crm/customers/bulk", body),
  audit: (id: string) => API.get(`/admin/crm/customers/${id}/audit`),
  exportUrl: (params: AdminCrmListQuery = {}) =>
    `/admin/crm/export${qs(params)}`,
  whatsappMessages: (id: string, params: AdminCrmListQuery = {}) =>
    API.get(`/admin/crm/customers/${id}/whatsapp/messages${qs(params)}`),
  whatsappPreview: (id: string, body: Record<string, unknown>) =>
    API.post(`/admin/crm/customers/${id}/whatsapp/preview`, body),
  whatsappSend: (id: string, body: Record<string, unknown>) =>
    API.post(`/admin/crm/customers/${id}/whatsapp/send`, body),
  whatsappUploadMedia: (id: string, file: File) => {
    const form = new FormData();
    form.append("file", file);
    return API.post(`/admin/crm/customers/${id}/whatsapp/media/upload`, form, {
      headers: { "Content-Type": "multipart/form-data" },
      timeout: 120000,
    });
  },
  whatsappRead: (id: string) => API.post(`/admin/crm/customers/${id}/whatsapp/read`),
  whatsappTemplates: () => API.get("/admin/crm/whatsapp/templates"),
  whatsappInbox: (params: AdminCrmListQuery = {}) =>
    API.get(`/admin/crm/whatsapp/inbox${qs(params)}`),
  whatsappSync: () =>
    API.post("/admin/crm/whatsapp/sync", {}, { timeout: 180000 }),
  whatsappThreadMessages: (threadId: string, params: AdminCrmListQuery = {}) =>
    API.get(`/admin/crm/whatsapp/inbox/${threadId}/messages${qs(params)}`),
  whatsappAssign: (threadId: string, body: Record<string, unknown>) =>
    API.post(`/admin/crm/whatsapp/inbox/${threadId}/assign`, body),
  calendar: (params: AdminCrmListQuery = {}) =>
    API.get(`/admin/crm/calendar${qs(params)}`),
  calendarSettings: (body: Record<string, unknown>) =>
    API.put("/admin/crm/calendar/settings", body),
  calendarSlots: (params: AdminCrmListQuery = {}) =>
    API.get(`/admin/crm/calendar/slots${qs(params)}`),
  calendarBook: (body: Record<string, unknown>) =>
    API.post("/admin/crm/calendar/bookings", body),
  calendarStatus: (id: string, body: Record<string, unknown>) =>
    API.post(`/admin/crm/calendar/bookings/${id}/status`, body),
  calendarCallSummary: (id: string, body: Record<string, unknown>) =>
    API.patch(`/admin/crm/calendar/bookings/${id}/call-summary`, body),
  calendarReschedule: (id: string, body: Record<string, unknown>) =>
    API.post(`/admin/crm/calendar/bookings/${id}/reschedule`, body),
  customerAppointments: (id: string) =>
    API.get(`/admin/crm/customers/${id}/appointments`),
  automationsList: () => API.get("/admin/crm/automations"),
  automationRuns: (params: AdminCrmListQuery = {}) =>
    API.get(`/admin/crm/automations/runs${qs(params)}`),
  setAutomationEnabled: (key: string, enabled: boolean) =>
    API.post(`/admin/crm/automations/${key}/enabled`, { enabled }),
  retryAutomationRun: (id: string) =>
    API.post(`/admin/crm/automations/runs/${id}/retry`),
  staffNotifications: (params: AdminCrmListQuery = {}) =>
    API.get(`/admin/crm/staff-notifications${qs(params)}`),
  markStaffNotificationRead: (id: string) =>
    API.post(`/admin/crm/staff-notifications/${id}/read`),
  markAllStaffNotificationsRead: () =>
    API.post("/admin/crm/staff-notifications/read-all"),

  proposalCatalog: () => API.get("/admin/crm/proposals/catalog"),
  proposalContext: (customerId: string) =>
    API.get(`/admin/crm/customers/${customerId}/proposals/context`),
  listProposals: (customerId: string) =>
    API.get(`/admin/crm/customers/${customerId}/proposals`),
  createProposal: (customerId: string, body: Record<string, unknown>) =>
    API.post(`/admin/crm/customers/${customerId}/proposals`, body),
  getProposal: (proposalId: string) =>
    API.get(`/admin/crm/proposals/${proposalId}`),
  updateProposal: (proposalId: string, body: Record<string, unknown>) =>
    API.patch(`/admin/crm/proposals/${proposalId}`, body),
  issueProposal: (proposalId: string) =>
    API.post(`/admin/crm/proposals/${proposalId}/issue`),
  reviseProposal: (proposalId: string) =>
    API.post(`/admin/crm/proposals/${proposalId}/revise`),
};

export default adminCrmApi;
