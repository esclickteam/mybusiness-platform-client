import React, { useMemo } from "react";

import BenefitsWheelWidget from "../../site-plugins/benefits-wheel/BenefitsWheelWidget";
import { mergePluginSettings } from "./benefitsWheelPublicUtils";
import type { BenefitsWheelSettings } from "../site-plugins/benefits-wheel/benefitsWheelUtils";

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
    return mergePluginSettings(stored) as BenefitsWheelSettings;
  }, [enabledPlugins, site?.pluginSettings]);

  if (!siteId || !wheelSettings?.isActive) return null;

  return (
    <BenefitsWheelWidget siteId={siteId} slug={slug} settings={wheelSettings} mode="live" />
  );
}
