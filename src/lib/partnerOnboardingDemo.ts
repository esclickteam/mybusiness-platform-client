import { getManagedBusinessId } from "./partnerManagedContext";

const DEMO_REL: Record<string, string> = {
  dashboard: "dashboard",
  crm: "crm/clients",
  leads: "crm/leads",
  inbox: "whatsapp/inbox",
  campaigns: "whatsapp/messages/compose",
  automations: "automations",
  website: "website",
  appointments: "crm/appointments",
  team: "crm/settings",
  reports: "dashboard",
  present: "dashboard",
};

const PUBLIC_FALLBACK: Record<string, string> = {
  dashboard: "/crm",
  crm: "/crm",
  leads: "/crm",
  inbox: "/crm",
  campaigns: "/crm",
  automations: "/automations",
  website: "/website-builder",
  appointments: "/appointments",
  team: "/crm",
  reports: "/crm",
  present: "/crm",
};

export function partnerProductDemoUrl(demoKey: string) {
  const key = demoKey || "dashboard";
  const businessId = getManagedBusinessId();
  if (businessId) {
    const rel = DEMO_REL[key] || "dashboard";
    return `/business/${businessId}/dashboard/${rel}`;
  }
  return PUBLIC_FALLBACK[key] || "/crm";
}
