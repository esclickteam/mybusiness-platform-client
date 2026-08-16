import API from "../api";

export type SitePluginDefinition = {
  key: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  priceMonthly?: number | null;
  priceMax?: number | null;
  priceLabel?: string;
  accent?: string;
  billingEnabled?: boolean;
  installable?: boolean;
  entitled?: boolean;
  statusLabel?: string | null;
  ctaLabel?: string | null;
  displayPriceLabel?: string;
  futurePriceLabel?: string | null;
  helpText?: string;
  helpExamples?: string[];
};

export type SitePluginEditorHint = {
  pluginKey: string;
  action: string;
  pageTemplateId?: string;
  pageTemplateIds?: string[];
  sectionId?: string;
  message?: string;
};

export type SitePluginWarning = {
  pluginKey?: string;
  code?: string;
  message?: string;
};

export type SitePluginsResponse = {
  catalog: SitePluginDefinition[];
  enabledPlugins: string[];
  detectedFromSite?: string[];
  editorHints?: SitePluginEditorHint[];
  warnings?: SitePluginWarning[];
  entitlements?: Record<
    string,
    {
      addonKey?: string;
      entitled?: boolean;
      status?: string;
      reason?: string | null;
      currentPeriodEnd?: string | null;
      stripeSubscriptionId?: string | null;
      stripePriceId?: string | null;
      billingEnabled?: boolean;
    }
  >;
};

export async function getSitePlugins(siteId: string) {
  const { data } = await API.get(`/site-builder/sites/${siteId}/plugins`);
  return {
    catalog: (data?.catalog || []) as SitePluginDefinition[],
    enabledPlugins: (data?.enabledPlugins || []) as string[],
      detectedFromSite: (data?.detectedFromSite || []) as string[],
      entitlements: data?.entitlements || {},
  } satisfies SitePluginsResponse;
}

export async function updateSitePlugins(siteId: string, enabledPlugins: string[]) {
  const { data } = await API.put(`/site-builder/sites/${siteId}/plugins`, {
    enabledPlugins,
  });
  return {
    enabledPlugins: (data?.enabledPlugins || []) as string[],
    catalog: (data?.catalog || []) as SitePluginDefinition[],
    editorHints: (data?.editorHints || []) as SitePluginEditorHint[],
    warnings: (data?.warnings || []) as SitePluginWarning[],
  };
}
