import { isFeatureAccessible } from "@/utils/entitlementAccess";
import { isAutomationsAccessible, isModuleEnabled } from "@/utils/moduleAccess";

export type DashboardSurfaces = {
  leads: boolean;
  appointments: boolean;
  website: boolean;
  reviews: boolean;
  collaborations: boolean;
  whatsapp: boolean;
  metaCampaigns: boolean;
  automations: boolean;
  advisor: boolean;
};

/**
 * Display gate only. Module lists and entitlements are already calculated
 * by the server and attached to the signed-in user.
 */
export function resolveDashboardSurfaces(input: {
  enabledModules?: string[] | null;
  entitlements?: unknown;
  whatsappInNav: boolean;
  metaInNav: boolean;
  automationsAccessible?: boolean;
}): DashboardSurfaces {
  const feature = (key: string) => isFeatureAccessible(input.entitlements, key);
  const moduleOn = (key: string) => isModuleEnabled(input.enabledModules, key);
  const leads = moduleOn("crm") && (feature("crm") || feature("leads"));
  const website = moduleOn("website") && feature("websiteBuilder");

  return {
    leads,
    appointments: leads && feature("appointments"),
    website,
    reviews: website || moduleOn("build"),
    collaborations: moduleOn("collab") && feature("collaborations"),
    whatsapp:
      input.whatsappInNav &&
      (feature("whatsapp") || feature("whatsappManaged") || feature("whatsappApi")),
    metaCampaigns: input.metaInNav && feature("campaignManagement"),
    automations:
      isAutomationsAccessible(input.enabledModules, input.automationsAccessible) &&
      feature("automations"),
    advisor: moduleOn("BizUply") && feature("aiAssistant"),
  };
}

export function describeLoadedAppointments(
  appointments: Array<{ date?: string; status?: string; isConfirmed?: boolean }>,
  today: string
) {
  const byStatus: Record<string, number> = {};
  let todayCount = 0;

  appointments.forEach((appointment) => {
    const status = String(
      appointment.status || (appointment.isConfirmed ? "confirmed" : "pending")
    );
    byStatus[status] = (byStatus[status] || 0) + 1;
    if (String(appointment.date || "").slice(0, 10) === today) todayCount += 1;
  });

  return {
    total: appointments.length,
    today: todayCount,
    byStatus,
  };
}

export function seriesHasActivity(points?: Array<{ value?: number }> | null) {
  return Boolean(points?.some((point) => Number(point?.value) > 0));
}

export type CampaignSummaryInput = {
  status?: string;
  scheduledAt?: string | null;
  stats?: { failed?: number };
};

export function summarizeWhatsAppCampaigns(
  campaigns: CampaignSummaryInput[],
  now = Date.now()
) {
  const byStatus: Record<string, number> = {};
  let scheduled = 0;
  let failedRecipients = 0;

  campaigns.forEach((campaign) => {
    const status = String(campaign.status || "unknown");
    byStatus[status] = (byStatus[status] || 0) + 1;
    const when = campaign.scheduledAt ? new Date(campaign.scheduledAt).getTime() : NaN;
    if (
      Number.isFinite(when) &&
      when > now &&
      status !== "completed" &&
      status !== "cancelled" &&
      status !== "failed"
    ) {
      scheduled += 1;
    }
    const failed = Number(campaign.stats?.failed);
    if (Number.isFinite(failed)) failedRecipients += failed;
  });

  return {
    total: campaigns.length,
    byStatus,
    scheduled,
    failedRecipients,
  };
}

export type MessageSampleInput = {
  direction?: string;
  status?: string;
};

export function summarizeMessageSample(logs: MessageSampleInput[]) {
  const sample = {
    total: logs.length,
    inbound: 0,
    outbound: 0,
    delivered: 0,
    read: 0,
    failed: 0,
  };

  logs.forEach((log) => {
    if (log.direction === "inbound") sample.inbound += 1;
    if (log.direction === "outbound") sample.outbound += 1;
    if (log.status === "delivered") sample.delivered += 1;
    if (log.status === "read") sample.read += 1;
    if (log.status === "failed") sample.failed += 1;
  });

  return sample;
}

export type AttentionKind =
  | "untreated"
  | "appointments"
  | "wa-failed"
  | "wa-connect"
  | "campaign-failed";

export type AttentionItem = {
  id: AttentionKind;
  count: number;
  href: string;
};

export function buildAttentionItems(input: {
  showLeads: boolean;
  untreatedLeads: number;
  showAppointments: boolean;
  upcomingAppointments: number;
  showWhatsapp: boolean;
  whatsappLoaded: boolean;
  whatsappConnected: boolean | null;
  failedMessages: number;
  failedCampaigns: number;
  leadsHref: string;
  appointmentsHref: string;
  whatsappHref: string;
  connectionHref: string;
}): AttentionItem[] {
  const items: AttentionItem[] = [];

  if (input.showLeads && input.untreatedLeads > 0) {
    items.push({
      id: "untreated",
      count: input.untreatedLeads,
      href: input.leadsHref,
    });
  }
  if (input.showAppointments && input.upcomingAppointments > 0) {
    items.push({
      id: "appointments",
      count: input.upcomingAppointments,
      href: input.appointmentsHref,
    });
  }
  if (input.showWhatsapp && input.whatsappLoaded && input.whatsappConnected === false) {
    items.push({
      id: "wa-connect",
      count: 0,
      href: input.connectionHref,
    });
  }
  if (input.showWhatsapp && input.failedMessages > 0) {
    items.push({
      id: "wa-failed",
      count: input.failedMessages,
      href: input.whatsappHref,
    });
  }
  if (input.showWhatsapp && input.failedCampaigns > 0) {
    items.push({
      id: "campaign-failed",
      count: input.failedCampaigns,
      href: input.whatsappHref,
    });
  }

  return items;
}
