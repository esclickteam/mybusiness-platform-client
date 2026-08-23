import React, { useEffect, useMemo } from "react";

import BenefitsWheelWidget from "../../site-plugins/benefits-wheel/BenefitsWheelWidget";
import SmartSearchWidget from "../../site-plugins/smart-search/SmartSearchWidget";
import SmartBotWidget from "../../site-plugins/smart-bot/SmartBotWidget";
import AccessibilityWidget from "../../site-plugins/accessibility/AccessibilityWidget";
import WhatsAppFloatWidget from "../../site-plugins/whatsapp-float/WhatsAppFloatWidget";
import AnnouncementBarWidget from "../../site-plugins/announcement-bar/AnnouncementBarWidget";
import CookieBannerWidget from "../../site-plugins/cookie-banner/CookieBannerWidget";
import ExitPopupWidget from "../../site-plugins/exit-popup/ExitPopupWidget";
import SocialProofWidget from "../../site-plugins/social-proof/SocialProofWidget";
import FloatingContactBarWidget from "../../site-plugins/floating-contact-bar/FloatingContactBarWidget";
import LanguageSwitcherWidget from "../../site-plugins/multi-language/LanguageSwitcherWidget";
import FaqWidget from "../../site-plugins/faq-pro/FaqWidget";
import { mergeExitPopupSettings } from "../../site-plugins/exit-popup/exitPopupUtils";
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
import type { BenefitsWheelSettings } from "../../site-plugins/benefits-wheel/benefitsWheelUtils";
import type { SmartSearchSettings } from "../../site-plugins/smart-search/smartSearchUtils";
import type { SmartBotSettings } from "../../site-plugins/smart-bot/smartBotUtils";
import type { AccessibilitySettings } from "../../site-plugins/accessibility/accessibilityUtils";
import PublicStoreCheckout from "./PublicStoreCheckout";
import PublicStoreCatalogGrid from "./PublicStoreCatalogGrid";
import {
  isStoreFeatureEnabled,
  shouldShowPublicStoreCart,
} from "./shouldShowPublicStoreCart";

type PublicSitePluginOverlaysProps = {
  site: Record<string, any>;
  pageId?: string;
};

function currentPublicPageId(site: Record<string, any>, explicit?: string) {
  if (explicit) return String(explicit);
  const path =
    typeof window !== "undefined"
      ? String(window.location.pathname || "/").replace(/\/+$/, "") || "/"
      : "/";
  const slug = path.replace(/^\//, "") || "home";
  const pages = Array.isArray(site?.pages) ? site.pages : [];
  const match = pages.find((page: any) => {
    const pageSlug = String(page?.slug || page?.path || "").replace(/^\//, "");
    return pageSlug === slug || `/${pageSlug}` === path || String(page?.id || "") === slug;
  });
  return String(match?.id || match?._id || slug);
}

function extraPopupIsRenderable(popup: Record<string, any> | null | undefined) {
  if (!popup || popup.isActive === false) return false;
  const keys = Object.keys(popup).filter((key) => key !== "id" && key !== "popups");
  return keys.length > 0;
}

export default function PublicSitePluginOverlays({ site, pageId }: PublicSitePluginOverlaysProps) {
  const siteId = String(site?._id || site?.id || "");
  const slug = String(site?.slug || "");
  const businessId = String(site?.businessId || site?.business?._id || "");
  const siteKey = siteId || slug || "site";
  const activePageId = currentPublicPageId(site, pageId);
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

  const showWheel = Boolean(siteId && wheelSettings?.isActive);
  const showSearch = Boolean(searchSettings?.isActive);
  const showAccessibility = Boolean(accessibilitySettings?.isActive);
  const showSmartBot = Boolean(smartBotSettings?.isActive);
  const contactBarSettings = enabledPlugins.includes("floating-contact-bar")
    ? site?.pluginSettings?.["floating-contact-bar"] || { isActive: true }
    : null;
  const contactBarPhone = String(
    contactBarSettings?.phone ||
      contactBarSettings?.whatsappPhone ||
      whatsappSettings?.phone ||
      whatsappFallbackPhone ||
      ""
  ).trim();
  // Only treat the bar as "shown" when it will actually render at least one action.
  // Otherwise we must not hide the standalone WhatsApp float.
  const contactBarHasActions = Boolean(
    contactBarSettings &&
      contactBarSettings.isActive !== false &&
      ((contactBarSettings.showWhatsapp !== false && contactBarPhone) ||
        (contactBarSettings.showPhone !== false && contactBarPhone) ||
        (contactBarSettings.showEmail !== false && contactBarSettings.email) ||
        contactBarSettings.showForm ||
        contactBarSettings.showBooking)
  );
  const showContactBar = Boolean(
    enabledPlugins.includes("floating-contact-bar") && contactBarHasActions
  );
  const hideWhatsappForBar = Boolean(
    showContactBar &&
      contactBarSettings?.hideWhatsappFloat !== false &&
      contactBarSettings?.showWhatsapp !== false &&
      contactBarPhone
  );
  const showWhatsapp = Boolean(whatsappSettings?.isActive) && !hideWhatsappForBar;
  const showSocialProof = enabledPlugins.includes("social-proof");
  const showLanguage = enabledPlugins.includes("multi-language");
  const showFaq = enabledPlugins.includes("faq-pro");
  const extraPopups = [];
  const showAnnouncement = Boolean(announcementSettings?.isActive);
  const showCookie = Boolean(cookieSettings?.isActive);
  const showExitPopup = Boolean(exitPopupSettings?.isActive);
  const showStoreCheckout = shouldShowPublicStoreCart(site);
  const showStoreCatalog = Boolean(
    businessId && enabledPlugins.includes("store")
  );

  useEffect(() => {
    removeOverlayPluginPlaceholders(document);
    const root = document.querySelector("[data-bizuply-public-render-root='true']");
    if (root) removeOverlayPluginPlaceholders(root);
  }, [siteId, showSmartBot, showWhatsapp, showAnnouncement, showCookie]);

  if (
    !showWheel &&
    !showSearch &&
    !showAccessibility &&
    !showSmartBot &&
    !showWhatsapp &&
    !showAnnouncement &&
    !showCookie &&
    !showExitPopup &&
    !showStoreCheckout &&
    !showStoreCatalog &&
    !showContactBar &&
    !showSocialProof &&
    !showLanguage &&
    !showFaq
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
          siteSlug={slug}
        />
      ) : null}
      {showContactBar ? (
        <FloatingContactBarWidget
          settings={contactBarSettings}
          fallbackPhone={contactBarPhone || whatsappFallbackPhone}
          hidesWhatsappFloat={hideWhatsappForBar}
        />
      ) : null}
      {showSocialProof ? (
        <SocialProofWidget
          slug={slug}
          pageId={activePageId}
          settings={site?.pluginSettings?.["social-proof"]}
        />
      ) : null}
      {showLanguage ? (
        <LanguageSwitcherWidget
          languages={site?.pluginSettings?.["multi-language"]?.languages || [
            { code: "he", label: "HE", dir: "rtl" },
            { code: "en", label: "EN", dir: "ltr" },
          ]}
          current={site?.__activeLanguage}
        />
      ) : null}
      {showCookie ? (
        <CookieBannerWidget siteKey={siteKey} settings={cookieSettings!} mode="live" />
      ) : null}
      {showFaq ? (
        <FaqWidget
          slug={slug}
          pageId={activePageId}
          settings={site?.pluginSettings?.["faq-pro"]}
        />
      ) : null}
      {showExitPopup ? (
        <ExitPopupWidget
          siteKey={siteKey}
          slug={slug}
          pageId={activePageId}
          settings={exitPopupSettings}
          mode="live"
        />
      ) : null}
      {showStoreCheckout ? (
        <PublicStoreCheckout
          businessId={businessId}
          enabled={showStoreCheckout}
          storeFeatureEnabled={isStoreFeatureEnabled(site)}
          language={site?.__activeLanguage}
          shiftForLeftWidgets={showAccessibility}
        />
      ) : null}
      {showStoreCatalog ? (
        <PublicStoreCatalogGrid businessId={businessId} enabled />
      ) : null}
    </>
  );
}
