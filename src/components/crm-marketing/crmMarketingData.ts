import type { MarketingFaq, MarketingStat } from "../product-marketing";

/**
 * Copy for the /crm page.
 * Statuses, field names and integration steps below mirror the real CRM module
 * (leads pipeline, client file, appointments, services).
 */

type TFn = (key: string, options?: Record<string, unknown>) => any;

export function getCrmHeroStats(t: TFn): MarketingStat[] {
  return [
    { value: 6, label: t("crmPage.stats.pipelineStatuses") },
    { value: 3, label: t("crmPage.stats.autoChannels") },
    { value: 7, label: t("crmPage.stats.docTypes") },
    {
      value: 15,
      suffix: t("crmPage.stats.minSuffix"),
      label: t("crmPage.stats.calendarResolution"),
    },
  ];
}

export type PipelineStage = {
  id: "new" | "contacted" | "interested" | "converted" | "lost" | "old";
  label: string;
  accent: string;
};

/** The statuses a lead can hold, including the Old Leads tab. */
export function getPipelineStages(t: TFn): PipelineStage[] {
  return [
    { id: "new", label: t("crmPage.pipeline.new"), accent: "#7c3aed" },
    { id: "contacted", label: t("crmPage.pipeline.contacted"), accent: "#2563eb" },
    { id: "interested", label: t("crmPage.pipeline.interested"), accent: "#0891b2" },
    { id: "converted", label: t("crmPage.pipeline.converted"), accent: "#059669" },
    { id: "lost", label: t("crmPage.pipeline.lost"), accent: "#94a3b8" },
    { id: "old", label: t("crmPage.pipeline.old"), accent: "#ea580c" },
  ];
}

export type IntegrationSpec = {
  id: "meta" | "google" | "website";
  name: string;
  badge: string;
  accent: string;
  steps: string[];
  note: string;
};

export function getCrmIntegrations(t: TFn): IntegrationSpec[] {
  return [
    {
      id: "meta",
      name: t("crmPage.integrationSources.meta.name"),
      badge: t("crmPage.integrationSources.meta.badge"),
      accent: "#1877f2",
      steps: t("crmPage.integrationSources.meta.steps", {
        returnObjects: true,
      }) as string[],
      note: t("crmPage.integrationSources.meta.note"),
    },
    {
      id: "google",
      name: t("crmPage.integrationSources.google.name"),
      badge: t("crmPage.integrationSources.google.badge"),
      accent: "#ea4335",
      steps: t("crmPage.integrationSources.google.steps", {
        returnObjects: true,
      }) as string[],
      note: t("crmPage.integrationSources.google.note"),
    },
    {
      id: "website",
      name: t("crmPage.integrationSources.website.name"),
      badge: t("crmPage.integrationSources.website.badge"),
      accent: "#7c3aed",
      steps: t("crmPage.integrationSources.website.steps", {
        returnObjects: true,
      }) as string[],
      note: t("crmPage.integrationSources.website.note"),
    },
  ];
}

export function getCrmFaq(t: TFn): MarketingFaq[] {
  return [
    {
      q: t("crmPage.faq.statuses.q"),
      a: t("crmPage.faq.statuses.a"),
    },
    {
      q: t("crmPage.faq.sources.q"),
      a: t("crmPage.faq.sources.a"),
    },
    {
      q: t("crmPage.faq.approved.q"),
      a: t("crmPage.faq.approved.a"),
    },
    {
      q: t("crmPage.faq.followup.q"),
      a: t("crmPage.faq.followup.a"),
    },
    {
      q: t("crmPage.faq.clientFile.q"),
      a: t("crmPage.faq.clientFile.a"),
    },
    {
      q: t("crmPage.faq.calendar.q"),
      a: t("crmPage.faq.calendar.a"),
    },
    {
      q: t("crmPage.faq.selfBooking.q"),
      a: t("crmPage.faq.selfBooking.a"),
    },
    {
      q: t("crmPage.faq.dashboard.q"),
      a: t("crmPage.faq.dashboard.a"),
    },
  ];
}
