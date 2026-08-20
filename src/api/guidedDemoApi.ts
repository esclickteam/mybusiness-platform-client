import API from "../api";

export async function fetchGuidedDemoAdminStatus() {
  const { data } = await API.get("/admin/guided-demos/status");
  return data;
}

export async function fetchGuidedDemoCatalog() {
  const { data } = await API.get("/admin/guided-demos/catalog");
  return data;
}

export async function fetchGuidedDemoAnalytics() {
  const { data } = await API.get("/admin/guided-demos/analytics");
  return data;
}

export async function listGuidedDemos(params = {}) {
  const { data } = await API.get("/admin/guided-demos", { params });
  return data;
}

export async function getGuidedDemo(id) {
  const { data } = await API.get(`/admin/guided-demos/${id}`);
  return data;
}

export async function createGuidedDemo(payload) {
  const { data } = await API.post("/admin/guided-demos", payload);
  return data;
}

export async function resendGuidedDemo(id) {
  const { data } = await API.post(`/admin/guided-demos/${id}/resend`);
  return data;
}

export async function revokeGuidedDemo(id) {
  const { data } = await API.post(`/admin/guided-demos/${id}/revoke`);
  return data;
}

export async function extendGuidedDemo(id, ttlHours) {
  const { data } = await API.post(`/admin/guided-demos/${id}/extend`, { ttlHours });
  return data;
}

export async function copyGuidedDemoLink(id) {
  const { data } = await API.post(`/admin/guided-demos/${id}/copy-link`);
  return data;
}

export async function recordGuidedDemoManualShare(id) {
  const { data } = await API.post(`/admin/guided-demos/${id}/manual-share`);
  return data;
}

export async function duplicateGuidedDemo(id, payload = {}) {
  const { data } = await API.post(`/admin/guided-demos/${id}/duplicate`, payload);
  return data;
}

export async function previewGuidedDemo(id) {
  const { data } = await API.post(`/admin/guided-demos/${id}/admin-preview`);
  return data;
}

export async function peekGuidedDemo(token) {
  const { data } = await API.get(`/guided-demo/peek/${encodeURIComponent(token)}`);
  return data;
}

export async function redeemGuidedDemo(token) {
  const { data } = await API.post(`/guided-demo/redeem/${encodeURIComponent(token)}`);
  return data;
}

export async function fetchGuidedDemoSession() {
  const { data } = await API.get("/guided-demo/session");
  return data;
}

export async function reportGuidedDemoProgress(event, payload = {}) {
  const { data } = await API.post("/guided-demo/session/progress", { event, payload });
  return data;
}

export async function reportGuidedDemoCta(cta) {
  const { data } = await API.post("/guided-demo/session/cta", { cta });
  return data;
}

export async function sendGuidedDemoSandboxMessage(text) {
  const { data } = await API.post("/guided-demo/session/demo-message", { text });
  return data;
}

export async function triggerGuidedDemoAutomation() {
  const { data } = await API.post("/guided-demo/session/demo-automation-trigger");
  return data;
}

export async function exitGuidedDemoSession() {
  const { data } = await API.post("/guided-demo/session/exit");
  return data;
}
