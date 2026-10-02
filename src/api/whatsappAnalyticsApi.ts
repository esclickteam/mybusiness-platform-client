import API from "../api";

export type AnalyticsPreset = "7" | "30" | "90" | "custom";

export type AnalyticsDelta = { value: number | null; reason: string | null };

export type AnalyticsClicks = {
  available: boolean;
  total: number | null;
  unique: number | null;
  items: Array<{ type: string; buttonContent: string; count: number }> | null;
};

export type AnalyticsTemplateRow = {
  templateId?: string;
  name: string;
  language: string;
  category: string;
  sent: number | null;
  delivered: number | null;
  read: number | null;
  failed?: number | null;
  deliveryRate: number | null;
  readRate: number | null;
  clicks: AnalyticsClicks;
  source: "meta_template" | "webhook";
};

export type AnalyticsSeriesPoint = {
  date: string;
  metaSent: number | null;
  metaDelivered: number | null;
  localSent: number | null;
  localDelivered: number | null;
  localRead: number | null;
  localFailed: number | null;
};

export type WhatsAppPerformanceView = {
  success?: boolean;
  demoData?: boolean;
  samplePreview?: boolean;
  sourcesMixed: false;
  timezone: "UTC";
  skipped?: boolean;
  reason?: string;
  range: {
    preset: string;
    since: string | null;
    until: string | null;
    days: number;
    timezone: "UTC";
    clamped: boolean;
    clampReasons: string[];
    templateSince: string | null;
    templateUntil: string | null;
    previous: { since: string; until: string } | null;
  };
  phones: Array<{
    phoneNumberId: string;
    displayPhoneNumber: string;
    verifiedName?: string;
    digits?: string;
  }>;
  selectedPhone: {
    phoneNumberId: string;
    scope: "all" | "phone";
    displayPhoneNumber?: string;
    verifiedName?: string;
  };
  sync: {
    lastAttemptAt: string | null;
    lastSuccessAt: string | null;
    lastError: string;
    lastErrorCode: string;
    rateLimitedUntil: string | null;
    templateInsightsEnabled: boolean | null;
    templateInsightsReason: string;
    messagingAvailable: boolean | null;
    messagingReason: string;
    wabaTimezone: string;
  };
  meta: {
    messaging: {
      available: boolean;
      reason: string | null;
      sent: number | null;
      delivered: number | null;
      read: number | null;
      readAvailable: boolean;
      readReason: string | null;
      deliveryRate: number | null;
      deliveryRateReason?: string | null;
      partial: boolean;
      coverage?: { requested: number; covered: number; missing: string[]; partial: boolean };
      series: Array<{ date: string; sent: number | null; delivered: number | null }>;
      comparison: {
        available: boolean;
        reason?: string;
        sent?: number | null;
        delivered?: number | null;
        deliveryRate?: number | null;
        deltas?: { sent?: AnalyticsDelta; delivered?: AnalyticsDelta };
      };
    };
    templates: {
      available: boolean;
      reason: string | null;
      lookbackDays?: number;
      clamped?: boolean;
      clampReason?: string | null;
      readRetention?: string;
      phoneScoped: boolean;
      rows: AnalyticsTemplateRow[];
      comparison?: { available: boolean; reason?: string };
    };
  };
  local: {
    available: boolean;
    source: "webhook";
    reason?: string | null;
    truncated?: boolean;
    sent: number | null;
    delivered: number | null;
    read: number | null;
    failed: number | null;
    apiRejected: number | null;
    deliveryRate?: number | null;
    readRate?: number | null;
    series: Array<{
      date: string;
      sent: number;
      delivered: number;
      read: number;
      failed: number;
    }>;
    templates: AnalyticsTemplateRow[];
    comparison: {
      available: boolean;
      reason?: string;
      sent?: number | null;
      delivered?: number | null;
      read?: number | null;
      failed?: number | null;
      deltas?: Record<string, AnalyticsDelta>;
    };
  };
  series: AnalyticsSeriesPoint[];
};

export type AnalyticsQuery = {
  businessId: string;
  preset: AnalyticsPreset;
  since?: string;
  until?: string;
  phoneNumberId?: string;
};

function params(query: AnalyticsQuery) {
  return {
    params: {
      businessId: query.businessId,
      preset: query.preset,
      since: query.since || undefined,
      until: query.until || undefined,
      phoneNumberId: query.phoneNumberId || undefined,
    },
  };
}

export async function getWhatsAppPerformance(query: AnalyticsQuery) {
  const { data } = await API.get("/whatsapp/analytics", params(query));
  return data as WhatsAppPerformanceView;
}

export async function syncWhatsAppPerformance(query: AnalyticsQuery) {
  const { data } = await API.post(
    "/whatsapp/analytics/sync",
    {
      businessId: query.businessId,
      preset: query.preset,
      since: query.since || "",
      until: query.until || "",
      phoneNumberId: query.phoneNumberId || "",
    },
    params(query)
  );
  return data as WhatsAppPerformanceView;
}

export async function enableWhatsAppTemplateInsights(businessId: string) {
  const { data } = await API.post("/whatsapp/analytics/template-insights/enable", {
    businessId,
    confirm: true,
  });
  return data as { success: boolean; templateInsightsEnabled: boolean };
}
