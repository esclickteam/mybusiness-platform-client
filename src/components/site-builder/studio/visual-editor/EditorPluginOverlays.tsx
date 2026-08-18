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
import SocialProofWidget from "../../../site-plugins/social-proof/SocialProofWidget";
import FloatingContactBarWidget from "../../../site-plugins/floating-contact-bar/FloatingContactBarWidget";
import LanguageSwitcherWidget from "../../../site-plugins/multi-language/LanguageSwitcherWidget";
import FaqWidget from "../../../site-plugins/faq-pro/FaqWidget";
import type { BenefitsWheelSettings } from "../../../site-plugins/benefits-wheel/benefitsWheelUtils";
import type { SmartSearchSettings } from "../../../site-plugins/smart-search/smartSearchUtils";
import type { SmartBotSettings } from "../../../site-plugins/smart-bot/smartBotUtils";
import type { AccessibilitySettings } from "../../../site-plugins/accessibility/accessibilityUtils";
import type { WhatsAppFloatSettings } from "../../../site-plugins/whatsapp-float/whatsappFloatUtils";
import type { AnnouncementBarSettings } from "../../../site-plugins/announcement-bar/announcementBarUtils";
import type { CookieBannerSettings } from "../../../site-plugins/cookie-banner/cookieBannerUtils";
import type { ExitPopupSettings } from "../../../site-plugins/exit-popup/exitPopupUtils";
import { mergeExitPopupSettings } from "../../../site-plugins/exit-popup/exitPopupUtils";
import { mergeSmartSearchSettings } from "../../../site-plugins/smart-search/smartSearchUtils";
import { mergeSmartBotSettings } from "../../../site-plugins/smart-bot/smartBotUtils";
import { mergeAccessibilitySettings } from "../../../site-plugins/accessibility/accessibilityUtils";
import {
  mergeWhatsAppFloatSettings,
  removeOverlayPluginPlaceholders,
} from "../../../site-plugins/whatsapp-float/whatsappFloatUtils";
import { mergeAnnouncementBarSettings } from "../../../site-plugins/announcement-bar/announcementBarUtils";
import { mergeCookieBannerSettings } from "../../../site-plugins/cookie-banner/cookieBannerUtils";

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
  const [exitPopupSettings, setExitPopupSettings] = useState<ExitPopupSettings | null>(null);
  const [exitPopupEnabled, setExitPopupEnabled] = useState(false);
  const [socialProofEnabled, setSocialProofEnabled] = useState(false);
  const [socialProofSettings, setSocialProofSettings] = useState<Record<string, unknown> | null>(
    null
  );
  const [languageEnabled, setLanguageEnabled] = useState(false);
  const [languageSettings, setLanguageSettings] = useState<Record<string, unknown> | null>(null);
  const [contactBarEnabled, setContactBarEnabled] = useState(false);
  const [contactBarSettings, setContactBarSettings] = useState<Record<string, unknown> | null>(
    null
  );
  const [faqEnabled, setFaqEnabled] = useState(false);
  const [faqSettings, setFaqSettings] = useState<Record<string, unknown> | null>(null);
  const [fallbackPhone, setFallbackPhone] = useState("");
  const [pages, setPages] = useState<Array<Record<string, unknown>>>([]);
  const [activePageId, setActivePageId] = useState("");

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
          getMySite(siteId, { view: "studio" }),
        ]);
        const wheelOn = plugins.enabledPlugins.includes("benefits-wheel");
        const searchOn = plugins.enabledPlugins.includes("smart-search");
        const botOn = plugins.enabledPlugins.includes("smart-bot");
        const a11yOn = plugins.enabledPlugins.includes("accessibility");
        const whatsappOn = plugins.enabledPlugins.includes("whatsapp-float");
        const announcementOn = plugins.enabledPlugins.includes("announcement-bar");
        const cookieOn = plugins.enabledPlugins.includes("cookie-banner");
        const exitOn = plugins.enabledPlugins.includes("exit-popup");
        const socialOn = plugins.enabledPlugins.includes("social-proof");
        const languageOn = plugins.enabledPlugins.includes("multi-language");
        const contactOn = plugins.enabledPlugins.includes("floating-contact-bar");
        const faqOn = plugins.enabledPlugins.includes("faq-pro");

        if (cancelled) return;

        setWheelEnabled(wheelOn);
        setSearchEnabled(searchOn);
        setBotEnabled(botOn);
        setA11yEnabled(a11yOn);
        setWhatsappEnabled(whatsappOn);
        setAnnouncementEnabled(announcementOn);
        setCookieEnabled(cookieOn);
        setExitPopupEnabled(exitOn);
        setSocialProofEnabled(socialOn);
        setLanguageEnabled(languageOn);
        setContactBarEnabled(contactOn);
                setFaqEnabled(faqOn);
        {
          const business = site?.business || {};
          const brand = site?.brand || {};
          setFallbackPhone(
            String(
              business.whatsappUrl ||
                business.whatsapp ||
                business.whatsappLink ||
                business.phone ||
                brand.phone ||
                site?.phone ||
                ""
            ).trim()
          );
        }
        setPages(Array.isArray(site?.pages) ? site.pages : []);
        setActivePageId(
          String(
            site?.pages?.[0]?.id ||
              site?.pages?.[0]?._id ||
              site?.pages?.[0]?.slug ||
              ""
          )
        );

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

        if (!exitOn) setExitPopupSettings(null);
        else {
          const settings = await getSitePluginSettings(siteId, "exit-popup");
          if (!cancelled) {
            setExitPopupSettings(mergeExitPopupSettings(settings as ExitPopupSettings));
          }
        }

        if (!socialOn) setSocialProofSettings(null);
        else {
          const settings = await getSitePluginSettings(siteId, "social-proof");
          if (!cancelled) setSocialProofSettings((settings as Record<string, unknown>) || {});
        }

        if (!languageOn) setLanguageSettings(null);
        else {
          const settings = await getSitePluginSettings(siteId, "multi-language");
          if (!cancelled) setLanguageSettings((settings as Record<string, unknown>) || {});
        }

        if (!contactOn) setContactBarSettings(null);
        else {
          const settings = await getSitePluginSettings(siteId, "floating-contact-bar");
          if (!cancelled) {
            setContactBarSettings(
              (settings as Record<string, unknown>) || { isActive: true }
            );
          }
        }

        if (!faqOn) setFaqSettings(null);
        else {
          const settings = await getSitePluginSettings(siteId, "faq-pro");
          if (!cancelled) setFaqSettings((settings as Record<string, unknown>) || {});
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
          setExitPopupEnabled(false);
          setExitPopupSettings(null);
          setSocialProofEnabled(false);
          setSocialProofSettings(null);
          setLanguageEnabled(false);
          setLanguageSettings(null);
          setContactBarEnabled(false);
          setContactBarSettings(null);
          setFaqEnabled(false);
          setFaqSettings(null);
          setFallbackPhone("");
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

  const handleA11yPositionChange = useCallback(
    async (pos: { x: number; y: number }) => {
      if (!siteId || !a11ySettings) return;
      const next = {
        ...a11ySettings,
        triggerPosition: pos,
        widgetPosition: pos.x > 50 ? ("bottom-left" as const) : ("bottom-right" as const),
      };
      setA11ySettings(next);
      try {
        await saveSitePluginSettings(siteId, "accessibility", next);
      } catch {
        // local preview still updates
      }
    },
    [siteId, a11ySettings]
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
  const contactBarPhone = String(
    (contactBarSettings as any)?.phone ||
      (contactBarSettings as any)?.whatsappPhone ||
      whatsappSettings?.phone ||
      fallbackPhone ||
      ""
  ).trim();
  const contactBarHasActions = Boolean(
    contactBarEnabled &&
      contactBarSettings?.isActive !== false &&
      (((contactBarSettings as any)?.showWhatsapp !== false && contactBarPhone) ||
        ((contactBarSettings as any)?.showPhone !== false && contactBarPhone) ||
        ((contactBarSettings as any)?.showEmail !== false &&
          (contactBarSettings as any)?.email) ||
        (contactBarSettings as any)?.showForm ||
        (contactBarSettings as any)?.showBooking)
  );
  const hideWhatsappForBar = Boolean(
    contactBarHasActions &&
      contactBarSettings?.hideWhatsappFloat !== false &&
      contactBarSettings?.showWhatsapp !== false &&
      contactBarPhone
  );

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
          onPositionChange={handleA11yPositionChange}
        />
      ) : null}

      {whatsappEnabled &&
      whatsappSettings &&
      whatsappSettings.isActive !== false &&
      !hideWhatsappForBar ? (
        <WhatsAppFloatWidget
          settings={whatsappSettings}
          mode="editor"
          onPositionChange={async (pos) => {
            if (!siteId || !whatsappSettings) return;
            const next = { ...whatsappSettings, triggerPosition: pos };
            setWhatsappSettings(next);
            try {
              await saveSitePluginSettings(siteId, "whatsapp-float", next as any);
            } catch {
              // keep local preview
            }
          }}
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

      {exitPopupEnabled && exitPopupSettings && exitPopupSettings.isActive !== false ? (
        <ExitPopupWidget
          siteKey={siteKey}
          slug={siteSlug}
          settings={exitPopupSettings}
          mode="editor"
        />
      ) : null}

      {contactBarHasActions ? (
        <FloatingContactBarWidget
          settings={contactBarSettings}
          hidesWhatsappFloat={hideWhatsappForBar}
          fallbackPhone={contactBarPhone || fallbackPhone}
        />
      ) : null}

      {socialProofEnabled ? (
        <SocialProofWidget
          slug={siteSlug}
          pageId={activePageId}
          settings={socialProofSettings}
        />
      ) : null}

      {languageEnabled ? (
        <LanguageSwitcherWidget
          languages={
            (languageSettings?.languages as Array<{
              code: string;
              label: string;
              dir?: string;
            }>) || [
              { code: "he", label: "HE", dir: "rtl" },
              { code: "en", label: "EN", dir: "ltr" },
            ]
          }
        />
      ) : null}

      {faqEnabled ? (
        <FaqWidget slug={siteSlug} pageId={activePageId} settings={faqSettings} />
      ) : null}
    </>
  );
}
