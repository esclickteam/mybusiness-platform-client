import React, { useMemo } from "react";

import BenefitsWheelWidget from "../../site-plugins/benefits-wheel/BenefitsWheelWidget";
import SmartSearchWidget from "../../site-plugins/smart-search/SmartSearchWidget";
import SmartBotWidget from "../../site-plugins/smart-bot/SmartBotWidget";
import AccessibilityWidget from "../../site-plugins/accessibility/AccessibilityWidget";
import { mergePluginSettings as mergeWheelSettings } from "./benefitsWheelPublicUtils";
import { mergePluginSettings as mergeSearchSettings } from "./smartSearchPublicUtils";
import { mergeAccessibilitySettings } from "../../site-plugins/accessibility/accessibilityUtils";
import { mergeSmartBotSettings } from "../../site-plugins/smart-bot/smartBotUtils";
import type { BenefitsWheelSettings } from "../../site-plugins/benefits-wheel/benefitsWheelUtils";
import type { SmartSearchSettings } from "../../site-plugins/smart-search/smartSearchUtils";
import type { SmartBotSettings } from "../../site-plugins/smart-bot/smartBotUtils";
import type { AccessibilitySettings } from "../../site-plugins/accessibility/accessibilityUtils";
import PublicStoreCheckout from "./PublicStoreCheckout";

type PublicSitePluginOverlaysProps = {
  site: Record<string, any>;
};

export default function PublicSitePluginOverlays({ site }: PublicSitePluginOverlaysProps) {
  const siteId = String(site?._id || site?.id || "");
  const slug = String(site?.slug || "");
  const businessId = String(site?.businessId || site?.business?._id || "");
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

  const accessibilitySettings = useMemo(() => {
    if (!enabledPlugins.includes("accessibility")) return null;
    const stored = site?.pluginSettings?.accessibility;
    return mergeAccessibilitySettings(stored) as AccessibilitySettings;
  }, [enabledPlugins, site?.pluginSettings]);

  const smartBotSettings = useMemo(() => {
    if (!enabledPlugins.includes("smart-bot")) return null;
    const stored =
      site?.pluginSettings?.["smart-bot"] || site?.pluginSettings?.["sales-agent"];
    return mergeSmartBotSettings(stored) as SmartBotSettings;
  }, [enabledPlugins, site?.pluginSettings]);

  const pages = useMemo(
    () => (Array.isArray(site?.pages) ? site.pages : []),
    [site?.pages]
  );

  const showWheel = Boolean(siteId && wheelSettings?.isActive);
  const showSearch = Boolean(searchSettings?.isActive);
  const showAccessibility = Boolean(accessibilitySettings?.isActive);
  const showSmartBot = Boolean(smartBotSettings?.isActive);
  const showStoreCheckout = Boolean(businessId);

  if (
    !showWheel &&
    !showSearch &&
    !showAccessibility &&
    !showSmartBot &&
    !showStoreCheckout
  ) {
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
      {showSmartBot ? (
        <SmartBotWidget settings={smartBotSettings} mode="live" />
      ) : null}
      {showAccessibility ? (
        <AccessibilityWidget
          siteKey={siteId || slug || "site"}
          settings={accessibilitySettings}
          mode="live"
        />
      ) : null}
      {showStoreCheckout ? (
        <PublicStoreCheckout businessId={businessId} />
      ) : null}
    </>
  );
}
