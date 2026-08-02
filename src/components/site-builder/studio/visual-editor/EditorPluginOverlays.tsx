import React, { useCallback, useEffect, useState } from "react";

import { getSitePlugins } from "../../../../api/sitePluginsApi";
import { getMySite } from "../../../../api/mySitesApi";
import { saveSitePluginSettings } from "../../../../api/sitePluginSettingsApi";
import BenefitsWheelWidget from "../../../site-plugins/benefits-wheel/BenefitsWheelWidget";
import SmartSearchWidget from "../../../site-plugins/smart-search/SmartSearchWidget";
import SmartBotWidget from "../../../site-plugins/smart-bot/SmartBotWidget";
import AccessibilityWidget from "../../../site-plugins/accessibility/AccessibilityWidget";
import WhatsAppFloatWidget from "../../../site-plugins/whatsapp-float/WhatsAppFloatWidget";
import AnnouncementBarWidget from "../../../site-plugins/announcement-bar/AnnouncementBarWidget";
import CookieBannerWidget from "../../../site-plugins/cookie-banner/CookieBannerWidget";
import ExitPopupWidget from "../../../site-plugins/exit-popup/ExitPopupWidget";
import type { BenefitsWheelSettings } from "../../../site-plugins/benefits-wheel/benefitsWheelUtils";
import type { SmartSearchSettings } from "../../../site-plugins/smart-search/smartSearchUtils";
import type { SmartBotSettings } from "../../../site-plugins/smart-bot/smartBotUtils";
import type { AccessibilitySettings } from "../../../site-plugins/accessibility/accessibilityUtils";
import type { WhatsAppFloatSettings } from "../../../site-plugins/whatsapp-float/whatsappFloatUtils";
import type { AnnouncementBarSettings } from "../../../site-plugins/announcement-bar/announcementBarUtils";
import type { CookieBannerSettings } from "../../../site-plugins/cookie-banner/cookieBannerUtils";
import type { ExitPopupSettings } from "../../../site-plugins/exit-popup/exitPopupUtils";
import { mergeSmartSearchSettings } from "../../../site-plugins/smart-search/smartSearchUtils";
import { mergeSmartBotSettings } from "../../../site-plugins/smart-bot/smartBotUtils";
import { mergeAccessibilitySettings } from "../../../site-plugins/accessibility/accessibilityUtils";
import {
  mergeWhatsAppFloatSettings,
  removeOverlayPluginPlaceholders,
} from "../../../site-plugins/whatsapp-float/whatsappFloatUtils";
import { mergeAnnouncementBarSettings } from "../../../site-plugins/announcement-bar/announcementBarUtils";
import { mergeCookieBannerSettings } from "../../../site-plugins/cookie-banner/cookieBannerUtils";
import { mergeExitPopupSettings } from "../../../site-plugins/exit-popup/exitPopupUtils";

type EditorPluginOverlaysProps = {
  siteId?: string;
  siteSlug?: string;
  refreshKey?: number;
};

export default function EditorPluginOverlays({
  siteId,
  siteSlug = "",
  refreshKey = 0,
}: EditorPluginOverlaysProps) {
  const [wheelSettings, setWheelSettings] = useState<BenefitsWheelSettings | null>(null);
  const [wheelEnabled, setWheelEnabled] = useState(false);
  const [searchSettings, setSearchSettings] = useState<SmartSearchSettings | null>(null);
  const [searchEnabled, setSearchEnabled] = useState(false);
  const [botSettings, setBotSettings] = useState<SmartBotSettings | null>(null);
  const [botEnabled, setBotEnabled] = useState(false);
  const [a11ySettings, setA11ySettings] = useState<AccessibilitySettings | null>(null);
  const [a11yEnabled, setA11yEnabled] = useState(false);
  const [whatsappSettings, setWhatsappSettings] = useState<WhatsAppFloatSettings | null>(null);
  const [whatsappEnabled, setWhatsappEnabled] = useState(false);
  const [announcementSettings, setAnnouncementSettings] =
    useState<AnnouncementBarSettings | null>(null);
  const [announcementEnabled, setAnnouncementEnabled] = useState(false);
  const [cookieSettings, setCookieSettings] = useState<CookieBannerSettings | null>(null);
  const [cookieEnabled, setCookieEnabled] = useState(false);
  const [exitSettings, setExitSettings] = useState<ExitPopupSettings | null>(null);
  const [exitEnabled, setExitEnabled] = useState(false);
  const [pages, setPages] = useState<Array<Record<string, unknown>>>([]);
  const [slug, setSlug] = useState(siteSlug);

  useEffect(() => {
    const clean = () => {
      removeOverlayPluginPlaceholders(document);
      document.querySelectorAll("iframe").forEach((frame) => {
        try {
          if (frame.contentDocument) {
            removeOverlayPluginPlaceholders(frame.contentDocument);
          }
        } catch {
          // cross-origin iframe
        }
      });
    };
    clean();
    const t = window.setTimeout(clean, 400);
    return () => window.clearTimeout(t);
  }, [refreshKey, botEnabled, whatsappEnabled]);

  useEffect(() => {
    if (!siteId) return;

    let cancelled = false;

    (async () => {
      try {
        const [plugins, site] = await Promise.all([
          getSitePlugins(siteId),
          getMySite(siteId),
        ]);
        const wheelOn = plugins.enabledPlugins.includes("benefits-wheel");
        const searchOn = plugins.enabledPlugins.includes("smart-search");
        const botOn = plugins.enabledPlugins.includes("smart-bot");
        const a11yOn = plugins.enabledPlugins.includes("accessibility");
        const whatsappOn = plugins.enabledPlugins.includes("whatsapp-float");
        const announcementOn = plugins.enabledPlugins.includes("announcement-bar");
        const cookieOn = plugins.enabledPlugins.includes("cookie-banner");
        const exitOn = plugins.enabledPlugins.includes("exit-popup");

        if (cancelled) return;

        setWheelEnabled(wheelOn);
        setSearchEnabled(searchOn);
        setBotEnabled(botOn);
        setA11yEnabled(a11yOn);
        setWhatsappEnabled(whatsappOn);
        setAnnouncementEnabled(announcementOn);
        setCookieEnabled(cookieOn);
        setExitEnabled(exitOn);
        setPages(Array.isArray(site?.pages) ? site.pages : []);
        setSlug(String(site?.slug || siteSlug || ""));

        const { getSitePluginSettings } = await import(
          "../../../../api/sitePluginSettingsApi"
        );

        if (!wheelOn) setWheelSettings(null);
        else {
          const settings = await getSitePluginSettings(siteId, "benefits-wheel");
          if (!cancelled) setWheelSettings(settings as BenefitsWheelSettings);
        }

        if (!searchOn) setSearchSettings(null);
        else {
          const settings = await getSitePluginSettings(siteId, "smart-search");
          if (!cancelled) {
            setSearchSettings(mergeSmartSearchSettings(settings as SmartSearchSettings));
          }
        }

        if (!botOn) setBotSettings(null);
        else {
          const settings = await getSitePluginSettings(siteId, "smart-bot");
          if (!cancelled) {
            setBotSettings(mergeSmartBotSettings(settings as SmartBotSettings));
          }
        }

        if (!a11yOn) setA11ySettings(null);
        else {
          const settings = await getSitePluginSettings(siteId, "accessibility");
          if (!cancelled) {
            setA11ySettings(mergeAccessibilitySettings(settings as AccessibilitySettings));
          }
        }

        if (!whatsappOn) setWhatsappSettings(null);
        else {
          const settings = await getSitePluginSettings(siteId, "whatsapp-float");
          if (!cancelled) {
            setWhatsappSettings(mergeWhatsAppFloatSettings(settings as WhatsAppFloatSettings));
          }
        }

        if (!announcementOn) setAnnouncementSettings(null);
        else {
          const settings = await getSitePluginSettings(siteId, "announcement-bar");
          if (!cancelled) {
            setAnnouncementSettings(
              mergeAnnouncementBarSettings(settings as AnnouncementBarSettings)
            );
          }
        }

        if (!cookieOn) setCookieSettings(null);
        else {
          const settings = await getSitePluginSettings(siteId, "cookie-banner");
          if (!cancelled) {
            setCookieSettings(mergeCookieBannerSettings(settings as CookieBannerSettings));
          }
        }

        if (!exitOn) setExitSettings(null);
        else {
          const settings = await getSitePluginSettings(siteId, "exit-popup");
          if (!cancelled) {
            setExitSettings(mergeExitPopupSettings(settings as ExitPopupSettings));
          }
        }
      } catch {
        if (!cancelled) {
          setWheelEnabled(false);
          setWheelSettings(null);
          setSearchEnabled(false);
          setSearchSettings(null);
          setBotEnabled(false);
          setBotSettings(null);
          setA11yEnabled(false);
          setA11ySettings(null);
          setWhatsappEnabled(false);
          setWhatsappSettings(null);
          setAnnouncementEnabled(false);
          setAnnouncementSettings(null);
          setCookieEnabled(false);
          setCookieSettings(null);
          setExitEnabled(false);
          setExitSettings(null);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [siteId, siteSlug, refreshKey]);

  const handleWheelPositionChange = useCallback(
    async (pos: { x: number; y: number }) => {
      if (!siteId || !wheelSettings) return;
      const next = { ...wheelSettings, triggerPosition: pos, showTrigger: true };
      setWheelSettings(next);
      try {
        await saveSitePluginSettings(siteId, "benefits-wheel", next);
      } catch {
        // local preview still updates
      }
    },
    [siteId, wheelSettings]
  );

  const handleSearchPositionChange = useCallback(
    async (pos: { x: number; y: number }) => {
      if (!siteId || !searchSettings) return;
      const next = { ...searchSettings, triggerPosition: pos, showTrigger: true };
      setSearchSettings(next);
      try {
        await saveSitePluginSettings(siteId, "smart-search", next);
      } catch {
        // local preview still updates
      }
    },
    [siteId, searchSettings]
  );

  const handleBotPositionChange = useCallback(
    async (pos: { x: number; y: number }) => {
      if (!siteId || !botSettings) return;
      const next = {
        ...botSettings,
        triggerPosition: pos,
        positionAnchor: "right-bottom" as const,
      };
      setBotSettings(next);
      try {
        await saveSitePluginSettings(siteId, "smart-bot", next);
      } catch {
        // local preview still updates
      }
    },
    [siteId, botSettings]
  );

  const handleDeactivate = useCallback(async () => {
    if (!siteId) return;
    try {
      const plugins = await getSitePlugins(siteId);
      const { updateSitePlugins } = await import("../../../../api/sitePluginsApi");
      await updateSitePlugins(
        siteId,
        plugins.enabledPlugins.filter((key) => key !== "benefits-wheel")
      );
      setWheelEnabled(false);
      setWheelSettings(null);
    } catch {
      // ignore
    }
  }, [siteId]);

  const siteKey = siteId || "editor";

  return (
    <>
      {siteId && wheelEnabled && wheelSettings && wheelSettings.isActive !== false ? (
        <BenefitsWheelWidget
          siteId={siteId}
          settings={wheelSettings}
          mode="editor"
          onPositionChange={handleWheelPositionChange}
          onDeactivate={handleDeactivate}
        />
      ) : null}

      {searchEnabled && searchSettings && searchSettings.isActive !== false ? (
        <SmartSearchWidget
          settings={searchSettings}
          pages={pages}
          mode="editor"
          onPositionChange={handleSearchPositionChange}
        />
      ) : null}

      {botEnabled && botSettings && botSettings.isActive !== false ? (
        <SmartBotWidget
          settings={botSettings}
          mode="editor"
          onPositionChange={handleBotPositionChange}
        />
      ) : null}

      {a11yEnabled && a11ySettings && a11ySettings.isActive !== false ? (
        <AccessibilityWidget
          siteKey={siteKey}
          settings={a11ySettings}
          mode="editor"
        />
      ) : null}

      {whatsappEnabled && whatsappSettings && whatsappSettings.isActive !== false ? (
        <WhatsAppFloatWidget
          settings={whatsappSettings}
          mode="editor"
        />
      ) : null}

      {announcementEnabled &&
      announcementSettings &&
      announcementSettings.isActive !== false ? (
        <AnnouncementBarWidget
          siteKey={siteKey}
          settings={announcementSettings}
          mode="editor"
        />
      ) : null}

      {cookieEnabled && cookieSettings && cookieSettings.isActive !== false ? (
        <CookieBannerWidget
          siteKey={siteKey}
          settings={cookieSettings}
          mode="editor"
        />
      ) : null}

      {exitEnabled && exitSettings && exitSettings.isActive !== false ? (
        <ExitPopupWidget
          siteKey={siteKey}
          slug={slug}
          settings={exitSettings}
          mode="editor"
        />
      ) : null}
    </>
  );
}
