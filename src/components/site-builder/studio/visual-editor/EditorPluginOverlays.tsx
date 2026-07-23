import React, { useCallback, useEffect, useState } from "react";

import {
  getSitePluginSettings,
  saveSitePluginSettings,
} from "../../../../api/sitePluginSettingsApi";
import { getSitePlugins } from "../../../../api/sitePluginsApi";
import BenefitsWheelWidget from "../../../site-plugins/benefits-wheel/BenefitsWheelWidget";
import type { BenefitsWheelSettings } from "../../../site-plugins/benefits-wheel/benefitsWheelUtils";

type EditorPluginOverlaysProps = {
  siteId?: string;
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
        const enabled = plugins.enabledPlugins.includes("benefits-wheel");
        if (cancelled) return;
        setWheelEnabled(enabled);
        if (!enabled) {
          setWheelSettings(null);
          return;
        }
        const settings = await getSitePluginSettings(siteId, "benefits-wheel");
        if (!cancelled) setWheelSettings(settings as BenefitsWheelSettings);
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

  const handlePositionChange = useCallback(
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
    if (!siteId || !wheelSettings) return;
    const next = { ...wheelSettings, isActive: false, showTrigger: false };
    setWheelSettings(next);
    try {
      await saveSitePluginSettings(siteId, "benefits-wheel", next);
    } catch {
      // ignore
    }
  }, [siteId, wheelSettings]);

  if (!siteId || !wheelEnabled || !wheelSettings || wheelSettings.isActive === false) return null;

  return (
    <BenefitsWheelWidget
      siteId={siteId}
      settings={wheelSettings}
      mode="editor"
      onPositionChange={handlePositionChange}
      onDeactivate={handleDeactivate}
    />
  );
}
