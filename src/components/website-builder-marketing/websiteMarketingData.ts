import type { MarketingFaq, MarketingStat } from "../product-marketing";

type TFn = (key: string, options?: Record<string, unknown>) => any;

/**
 * Copy for the /website-builder page.
 * Every number and feature name below is taken from what the studio actually
 * ships today (template folders, plugin catalog, SEO panel, publish flow).
 */

export function getWebsiteHeroStats(t: TFn): MarketingStat[] {
  return [
    { value: 205, label: t("websitePage.heroStats.templates") },
    { value: 140, label: t("websitePage.heroStats.pages") },
    { value: 59, label: t("websitePage.heroStats.plugins") },
    { value: 80, label: t("websitePage.heroStats.undo") },
  ];
}

export type TemplateCategoryStat = {
  label: string;
  count: number;
  accent: string;
};

/** Real category distribution across the template library. */
export function getTemplateCategories(t: TFn): TemplateCategoryStat[] {
  return [
    { label: t("websitePage.categories.commerce"), count: 32, accent: "#9a6f3b" },
    { label: t("websitePage.categories.landing"), count: 27, accent: "#2563eb" },
    { label: t("websitePage.categories.portfolio"), count: 26, accent: "#0f172a" },
    { label: t("websitePage.categories.beauty"), count: 26, accent: "#e11d8c" },
    { label: t("websitePage.categories.realEstate"), count: 25, accent: "#c9a962" },
    { label: t("websitePage.categories.food"), count: 24, accent: "#8b1e3f" },
    { label: t("websitePage.categories.tourism"), count: 10, accent: "#0891b2" },
    { label: t("websitePage.categories.education"), count: 10, accent: "#7c3aed" },
  ];
}

export type PluginChip = {
  name: string;
  category: string;
  accent: string;
};

/** Names taken from the plugin store catalog. */
export function getPluginChips(t: TFn): PluginChip[] {
  return [
    { name: t("websitePage.plugins.accessibility.name"), category: t("websitePage.plugins.accessibility.category"), accent: "#2563eb" },
    { name: t("websitePage.plugins.countdown.name"), category: t("websitePage.plugins.countdown.category"), accent: "#f59e0b" },
    { name: t("websitePage.plugins.rewardsWheel.name"), category: t("websitePage.plugins.rewardsWheel.category"), accent: "#e11d8c" },
    { name: t("websitePage.plugins.smartSearch.name"), category: t("websitePage.plugins.smartSearch.category"), accent: "#0891b2" },
    { name: t("websitePage.plugins.onlineStore.name"), category: t("websitePage.plugins.onlineStore.category"), accent: "#9a6f3b" },
    { name: t("websitePage.plugins.booking.name"), category: t("websitePage.plugins.booking.category"), accent: "#4f46e5" },
    { name: t("websitePage.plugins.payments.name"), category: t("websitePage.plugins.payments.category"), accent: "#059669" },
    { name: t("websitePage.plugins.invoices.name"), category: t("websitePage.plugins.invoices.category"), accent: "#0d9488" },
    { name: t("websitePage.plugins.leadForm.name"), category: t("websitePage.plugins.leadForm.category"), accent: "#7c3aed" },
    { name: t("websitePage.plugins.reviews.name"), category: t("websitePage.plugins.reviews.category"), accent: "#f59e0b" },
    { name: t("websitePage.plugins.loyalty.name"), category: t("websitePage.plugins.loyalty.category"), accent: "#db2777" },
    { name: t("websitePage.plugins.heatmap.name"), category: t("websitePage.plugins.heatmap.category"), accent: "#dc2626" },
    { name: t("websitePage.plugins.formAnalytics.name"), category: t("websitePage.plugins.formAnalytics.category"), accent: "#ea580c" },
    { name: t("websitePage.plugins.sessionRecording.name"), category: t("websitePage.plugins.sessionRecording.category"), accent: "#0284c7" },
    { name: t("websitePage.plugins.whatsapp.name"), category: t("websitePage.plugins.whatsapp.category"), accent: "#16a34a" },
    { name: t("websitePage.plugins.digitalMenu.name"), category: t("websitePage.plugins.digitalMenu.category"), accent: "#b91c1c" },
    { name: t("websitePage.plugins.exitPopup.name"), category: t("websitePage.plugins.exitPopup.category"), accent: "#c026d3" },
    { name: t("websitePage.plugins.languageSwitch.name"), category: t("websitePage.plugins.languageSwitch.category"), accent: "#0ea5e9" },
  ];
}

export type LivePlugin = {
  name: string;
  text: string;
};

/** Plugins that render on the published site, not just install from the store. */
export function getLivePlugins(t: TFn): LivePlugin[] {
  return [
    {
      name: t("websitePage.plugins.accessibility.name"),
      text: t("websitePage.livePlugins.accessibility"),
    },
    {
      name: t("websitePage.plugins.countdown.name"),
      text: t("websitePage.livePlugins.countdown"),
    },
    {
      name: t("websitePage.plugins.rewardsWheel.name"),
      text: t("websitePage.livePlugins.rewardsWheel"),
    },
    {
      name: t("websitePage.plugins.smartSearch.name"),
      text: t("websitePage.livePlugins.smartSearch"),
    },
  ];
}

/** Schema.org types the JSON-LD builder can generate. */
export const schemaTypes = [
  "LocalBusiness",
  "Service",
  "FAQPage",
  "Product",
  "Organization",
  "WebSite",
  "BreadcrumbList",
];

export function getSeoControls(t: TFn): string[] {
  return [
    t("websitePage.seoControls.titleDesc"),
    t("websitePage.seoControls.canonical"),
    t("websitePage.seoControls.robots"),
    t("websitePage.seoControls.openGraph"),
    t("websitePage.seoControls.searchConsole"),
    t("websitePage.seoControls.hreflang"),
    t("websitePage.seoControls.schema"),
    t("websitePage.seoControls.sitemap"),
  ];
}

export const paymentProviders = [
  "Stripe",
  "PayPal",
  "Tranzila",
  "Max / Hyp",
  "Grow",
  "Morning",
];

export function getWebsiteFaq(t: TFn): MarketingFaq[] {
  return [
    {
      q: t("websitePage.faq.code.q"),
      a: t("websitePage.faq.code.a"),
    },
    {
      q: t("websitePage.faq.structure.q"),
      a: t("websitePage.faq.structure.a"),
    },
    {
      q: t("websitePage.faq.domain.q"),
      a: t("websitePage.faq.domain.a"),
    },
    {
      q: t("websitePage.faq.crm.q"),
      a: t("websitePage.faq.crm.a"),
    },
    {
      q: t("websitePage.faq.sell.q"),
      a: t("websitePage.faq.sell.a"),
    },
    {
      q: t("websitePage.faq.collaborate.q"),
      a: t("websitePage.faq.collaborate.a"),
    },
    {
      q: t("websitePage.faq.analytics.q"),
      a: t("websitePage.faq.analytics.a"),
    },
  ];
}
