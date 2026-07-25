import React, { useCallback, useEffect, useState } from "react";

import { getSitePlugins } from "../../../../api/sitePluginsApi";
import { saveSitePluginSettings } from "../../../../api/sitePluginSettingsApi";
import BenefitsWheelWidget from "../../../site-plugins/benefits-wheel/BenefitsWheelWidget";
import type { BenefitsWheelSettings } from "../../../site-plugins/benefits-wheel/benefitsWheelUtils";

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

  useEffect(() => {
    if (!siteId) return;

    let cancelled = false;

    (async () => {
      try {
        const plugins = await getSitePlugins(siteId);
        const wheelOn = plugins.enabledPlugins.includes("benefits-wheel");

        if (cancelled) return;

        setWheelEnabled(wheelOn);

        if (!wheelOn) {
          setWheelSettings(null);
        } else {
          const { getSitePluginSettings } = await import(
            "../../../../api/sitePluginSettingsApi"
          );
          const settings = await getSitePluginSettings(siteId, "benefits-wheel");
          if (!cancelled) setWheelSettings(settings as BenefitsWheelSettings);
        }
      } catch {
        if (!cancelled) {
          setWheelEnabled(false);
          setWheelSettings(null);
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
    </>
  );
}
