import React, { useEffect, useMemo } from "react";

import BenefitsWheelWidget from "../../site-plugins/benefits-wheel/BenefitsWheelWidget";
import SmartSearchWidget from "../../site-plugins/smart-search/SmartSearchWidget";
import SmartBotWidget from "../../site-plugins/smart-bot/SmartBotWidget";
import AccessibilityWidget from "../../site-plugins/accessibility/AccessibilityWidget";
import WhatsAppFloatWidget from "../../site-plugins/whatsapp-float/WhatsAppFloatWidget";
import AnnouncementBarWidget from "../../site-plugins/announcement-bar/AnnouncementBarWidget";
import CookieBannerWidget from "../../site-plugins/cookie-banner/CookieBannerWidget";
import ExitPopupWidget from "../../site-plugins/exit-popup/ExitPopupWidget";
import { mergePluginSettings as mergeWheelSettings } from "./benefitsWheelPublicUtils";
import { mergePluginSettings as mergeSearchSettings } from "./smartSearchPublicUtils";
import { mergeAccessibilitySettings } from "../../site-plugins/accessibility/accessibilityUtils";
import { mergeSmartBotSettings } from "../../site-plugins/smart-bot/smartBotUtils";
import {
  mergeWhatsAppFloatSettings,
  removeOverlayPluginPlaceholders,
} from "../../site-plugins/whatsapp-float/whatsappFloatUtils";
import { mergeAnnouncementBarSettings } from "../../site-plugins/announcement-bar/announcementBarUtils";
import { mergeCookieBannerSettings } from "../../site-plugins/cookie-banner/cookieBannerUtils";
import { mergeExitPopupSettings } from "../../site-plugins/exit-popup/exitPopupUtils";
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
  const siteKey = siteId || slug || "site";
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

  const whatsappSettings = useMemo(() => {
    if (!enabledPlugins.includes("whatsapp-float")) return null;
    return mergeWhatsAppFloatSettings(site?.pluginSettings?.["whatsapp-float"]);
  }, [enabledPlugins, site?.pluginSettings]);

  const announcementSettings = useMemo(() => {
    if (!enabledPlugins.includes("announcement-bar")) return null;
    return mergeAnnouncementBarSettings(site?.pluginSettings?.["announcement-bar"]);
  }, [enabledPlugins, site?.pluginSettings]);

  const cookieSettings = useMemo(() => {
    if (!enabledPlugins.includes("cookie-banner")) return null;
    return mergeCookieBannerSettings(site?.pluginSettings?.["cookie-banner"]);
  }, [enabledPlugins, site?.pluginSettings]);

  const exitPopupSettings = useMemo(() => {
    if (!enabledPlugins.includes("exit-popup")) return null;
    return mergeExitPopupSettings(site?.pluginSettings?.["exit-popup"]);
  }, [enabledPlugins, site?.pluginSettings]);

  const pages = useMemo(
    () => (Array.isArray(site?.pages) ? site.pages : []),
    [site?.pages]
  );

  const showWheel = Boolean(siteId && wheelSettings?.isActive);
  const showSearch = Boolean(searchSettings?.isActive);
  const showAccessibility = Boolean(accessibilitySettings?.isActive);
  const showSmartBot = Boolean(smartBotSettings?.isActive);
  const showWhatsapp = Boolean(whatsappSettings?.isActive);
  const showAnnouncement = Boolean(announcementSettings?.isActive);
  const showCookie = Boolean(cookieSettings?.isActive);
  const showExitPopup = Boolean(exitPopupSettings?.isActive);
  const showStoreCheckout = Boolean(businessId);

  const whatsappFallbackPhone = useMemo(() => {
    const business = site?.business || {};
    const brand = site?.brand || {};
    return String(
      business.whatsappUrl ||
        business.whatsapp ||
        business.whatsappLink ||
        business.phone ||
        brand.phone ||
        site?.phone ||
        ""
    ).trim();
  }, [site]);

  useEffect(() => {
    removeOverlayPluginPlaceholders(document);
    const root = document.querySelector("[data-bizuply-public-render-root='true']");
    if (root) removeOverlayPluginPlaceholders(root);
  }, [
    siteId,
    showSmartBot,
    showWhatsapp,
    showAnnouncement,
    showCookie,
    showExitPopup,
  ]);

  if (
    !showWheel &&
    !showSearch &&
    !showAccessibility &&
    !showSmartBot &&
    !showWhatsapp &&
    !showAnnouncement &&
    !showCookie &&
    !showExitPopup &&
    !showStoreCheckout
  ) {
    return null;
  }

  return (
    <>
      {showAnnouncement ? (
        <AnnouncementBarWidget
          siteKey={siteKey}
          settings={announcementSettings!}
          mode="live"
        />
      ) : null}
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
          siteKey={siteKey}
          settings={accessibilitySettings}
          mode="live"
        />
      ) : null}
      {showWhatsapp ? (
        <WhatsAppFloatWidget
          settings={whatsappSettings!}
          fallbackPhone={whatsappFallbackPhone}
          mode="live"
        />
      ) : null}
      {showCookie ? (
        <CookieBannerWidget siteKey={siteKey} settings={cookieSettings!} mode="live" />
      ) : null}
      {showExitPopup ? (
        <ExitPopupWidget
          siteKey={siteKey}
          slug={slug}
          settings={exitPopupSettings!}
          mode="live"
        />
      ) : null}
      {showStoreCheckout ? (
        <PublicStoreCheckout businessId={businessId} />
      ) : null}
    </>
  );
}
