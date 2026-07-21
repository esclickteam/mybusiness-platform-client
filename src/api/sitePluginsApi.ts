import API from "../api";

export type SitePluginDefinition = {
  key: string;
  name: string;
  description: string;
  category: string;
  icon: string;
};

export type SitePluginsResponse = {
  catalog: SitePluginDefinition[];
  enabledPlugins: string[];
  detectedFromSite?: string[];
};

export async function getSitePlugins(siteId: string) {
  const { data } = await API.get(`/site-builder/sites/${siteId}/plugins`);
  return {
    catalog: (data?.catalog || []) as SitePluginDefinition[],
    enabledPlugins: (data?.enabledPlugins || []) as string[],
    detectedFromSite: (data?.detectedFromSite || []) as string[],
  } satisfies SitePluginsResponse;
}

export async function updateSitePlugins(siteId: string, enabledPlugins: string[]) {
  const { data } = await API.put(`/site-builder/sites/${siteId}/plugins`, {
    enabledPlugins,
  });
  return {
    enabledPlugins: (data?.enabledPlugins || []) as string[],
    catalog: (data?.catalog || []) as SitePluginDefinition[],
  };
}
