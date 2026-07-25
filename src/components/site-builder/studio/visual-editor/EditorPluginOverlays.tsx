import React, { useCallback, useEffect, useState } from "react";

import { getSitePlugins } from "../../../../api/sitePluginsApi";
import { getMySite } from "../../../../api/mySitesApi";
import { saveSitePluginSettings } from "../../../../api/sitePluginSettingsApi";
import BenefitsWheelWidget from "../../../site-plugins/benefits-wheel/BenefitsWheelWidget";
import SmartSearchWidget from "../../../site-plugins/smart-search/SmartSearchWidget";
import AccessibilityWidget from "../../../site-plugins/accessibility/AccessibilityWidget";
import type { BenefitsWheelSettings } from "../../../site-plugins/benefits-wheel/benefitsWheelUtils";
import type { SmartSearchSettings } from "../../../site-plugins/smart-search/smartSearchUtils";
import type { AccessibilitySettings } from "../../../site-plugins/accessibility/accessibilityUtils";
import { mergeSmartSearchSettings } from "../../../site-plugins/smart-search/smartSearchUtils";
import { mergeAccessibilitySettings } from "../../../site-plugins/accessibility/accessibilityUtils";

type EditorPluginOverlaysProps = {
  siteId?: string;
  siteSlug?: string;
  refreshKey?: number;
};

export default function EditorPluginOverlays({
  siteId,
  refreshKey = 0,
}: EditorPluginOverlaysProps) {
  const [wheelSettings, setWheelSettings] = useState<BenefitsWheelSettings | null>(null);
  const [wheelEnabled, setWheelEnabled] = useState(false);
  const [searchSettings, setSearchSettings] = useState<SmartSearchSettings | null>(null);
  const [searchEnabled, setSearchEnabled] = useState(false);
  const [a11ySettings, setA11ySettings] = useState<AccessibilitySettings | null>(null);
  const [a11yEnabled, setA11yEnabled] = useState(false);
  const [pages, setPages] = useState<Array<Record<string, unknown>>>([]);

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
        const a11yOn = plugins.enabledPlugins.includes("accessibility");

        if (cancelled) return;

        setWheelEnabled(wheelOn);
        setSearchEnabled(searchOn);
        setA11yEnabled(a11yOn);
        setPages(Array.isArray(site?.pages) ? site.pages : []);

        const { getSitePluginSettings } = await import(
          "../../../../api/sitePluginSettingsApi"
        );

        if (!wheelOn) {
          setWheelSettings(null);
        } else {
          const settings = await getSitePluginSettings(siteId, "benefits-wheel");
          if (!cancelled) setWheelSettings(settings as BenefitsWheelSettings);
        }

        if (!searchOn) {
          setSearchSettings(null);
        } else {
          const settings = await getSitePluginSettings(siteId, "smart-search");
          if (!cancelled) {
            setSearchSettings(mergeSmartSearchSettings(settings as SmartSearchSettings));
          }
        }

        if (!a11yOn) {
          setA11ySettings(null);
        } else {
          const settings = await getSitePluginSettings(siteId, "accessibility");
          if (!cancelled) {
            setA11ySettings(mergeAccessibilitySettings(settings as AccessibilitySettings));
          }
        }
      } catch {
        if (!cancelled) {
          setWheelEnabled(false);
          setWheelSettings(null);
          setSearchEnabled(false);
          setSearchSettings(null);
          setA11yEnabled(false);
          setA11ySettings(null);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [siteId, refreshKey]);

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

      {a11yEnabled && a11ySettings && a11ySettings.isActive !== false ? (
        <AccessibilityWidget
          siteKey={siteId || "editor"}
          settings={a11ySettings}
          mode="editor"
        />
      ) : null}
    </>
  );
}
