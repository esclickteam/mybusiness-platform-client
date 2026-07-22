import API from "../api";

export async function getSitePluginSettings(siteId: string, pluginKey: string) {
  const { data } = await API.get(
    `/site-builder/sites/${siteId}/plugins/${pluginKey}/settings`
  );
  return (data?.settings || {}) as Record<string, unknown>;
}

export async function saveSitePluginSettings(
  siteId: string,
  pluginKey: string,
  settings: Record<string, unknown>
) {
  const { data } = await API.put(
    `/site-builder/sites/${siteId}/plugins/${pluginKey}/settings`,
    { settings }
  );
  return (data?.settings || {}) as Record<string, unknown>;
}
