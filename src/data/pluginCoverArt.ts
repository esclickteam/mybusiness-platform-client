/** Cover art for plugin store cards — generated via scripts/generate-plugin-covers.mjs */

export function getPluginCoverUrl(pluginKey: string): string {
  return `/plugin-covers/${pluginKey}.svg`;
}

export function getPluginCoverSrcSet(pluginKey: string): string | undefined {
  return undefined;
}
