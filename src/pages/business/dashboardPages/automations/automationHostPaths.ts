export const ADMIN_AUTOMATIONS_BASE = "/admin/automations";
export const ADMIN_WHATSAPP_PATH = "/admin/managed-whatsapp";

export function isAdminAutomationHost(hostBasePath?: string | null) {
  return String(hostBasePath || "").startsWith("/admin");
}

export function automationBasePath(
  businessId: string | null | undefined,
  hostBasePath?: string | null
) {
  if (hostBasePath) return hostBasePath;
  if (businessId) return `/business/${businessId}/dashboard/automations`;
  return "/";
}

export function whatsappConnectPath(
  businessId: string | null | undefined,
  hostBasePath?: string | null
) {
  if (isAdminAutomationHost(hostBasePath)) return ADMIN_WHATSAPP_PATH;
  if (!businessId) return "";
  return `/business/${businessId}/dashboard/whatsapp`;
}

export function whatsappSettingsPath(
  businessId: string | null | undefined,
  hostBasePath?: string | null
) {
  if (isAdminAutomationHost(hostBasePath)) return ADMIN_WHATSAPP_PATH;
  if (!businessId) return "";
  return `/business/${businessId}/dashboard/whatsapp/settings`;
}
