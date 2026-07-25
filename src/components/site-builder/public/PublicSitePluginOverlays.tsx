import React, { useMemo } from "react";

import BenefitsWheelWidget from "../../site-plugins/benefits-wheel/BenefitsWheelWidget";
import SmartSearchWidget from "../../site-plugins/smart-search/SmartSearchWidget";
import { mergePluginSettings as mergeWheelSettings } from "./benefitsWheelPublicUtils";
import { mergePluginSettings as mergeSearchSettings } from "./smartSearchPublicUtils";
import type { BenefitsWheelSettings } from "../../site-plugins/benefits-wheel/benefitsWheelUtils";
import type { SmartSearchSettings } from "../../site-plugins/smart-search/smartSearchUtils";

type PublicSitePluginOverlaysProps = {
  site: Record<string, any>;
};

export default function PublicSitePluginOverlays({ site }: PublicSitePluginOverlaysProps) {
  const siteId = String(site?._id || site?.id || "");
  const slug = String(site?.slug || "");
  const enabledPlugins: string[] = Array.isArray(site?.enabledPlugins)
    ? site.enabledPlugins
    : [];

  const wheelSettings = useMemo(() => {
    if (!enabledPlugins.includes("benefits-wheel")) return null;
    const stored = site?.pluginSettings?.["benefits-wheel"];
    return mergeWheelSettings(stored) as BenefitsWheelSettings;
  }, [enabledPlugins, site?.pluginSettings]);

  const searchSettings = useMemo(() => {
    if (!enabledPlugins.includes("smart-search")) return null;
    const stored = site?.pluginSettings?.["smart-search"];
    return mergeSearchSettings(stored) as SmartSearchSettings;
  }, [enabledPlugins, site?.pluginSettings]);

  const pages = useMemo(
    () => (Array.isArray(site?.pages) ? site.pages : []),
    [site?.pages]
  );

  const showWheel = Boolean(siteId && wheelSettings?.isActive);
  const showSearch = Boolean(searchSettings?.isActive);

  if (!showWheel && !showSearch) {
    return null;
  }

  return (
    <>
      {showWheel ? (
        <BenefitsWheelWidget siteId={siteId} slug={slug} settings={wheelSettings!} mode="live" />
      ) : null}
      {showSearch ? (
        <SmartSearchWidget settings={searchSettings} pages={pages} mode="live" />
      ) : null}
    </>
  );
}
