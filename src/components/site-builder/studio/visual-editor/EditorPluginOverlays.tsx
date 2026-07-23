import React, { useCallback, useEffect, useState } from "react";

import {
  getSitePluginSettings,
  saveSitePluginSettings,
} from "../../../../api/sitePluginSettingsApi";
import { getSitePlugins, updateSitePlugins } from "../../../../api/sitePluginsApi";
import BenefitsWheelWidget from "../../../site-plugins/benefits-wheel/BenefitsWheelWidget";
import type { BenefitsWheelSettings } from "../../../site-plugins/benefits-wheel/benefitsWheelUtils";
import SiteAuthLoginWidget from "../../../site-plugins/site-auth/SiteAuthLoginWidget";
import {
  mergeSiteAuthSettings,
  shouldShowFloatingAuthButton,
} from "../../../site-plugins/site-auth/siteAuthUtils";
import { SiteMemberAuthProvider } from "../../../../context/SiteMemberAuthContext";

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
  const [authSettings, setAuthSettings] = useState<ReturnType<typeof mergeSiteAuthSettings> | null>(
    null
  );
  const [authEnabled, setAuthEnabled] = useState(false);

  useEffect(() => {
    if (!siteId) return;

    let cancelled = false;

    (async () => {
      try {
        const plugins = await getSitePlugins(siteId);
        const wheelOn = plugins.enabledPlugins.includes("benefits-wheel");
        const authOn = plugins.enabledPlugins.includes("site-auth");

        if (cancelled) return;

        setWheelEnabled(wheelOn);
        setAuthEnabled(authOn);

        if (!wheelOn) {
          setWheelSettings(null);
        } else {
          const settings = await getSitePluginSettings(siteId, "benefits-wheel");
          if (!cancelled) setWheelSettings(settings as BenefitsWheelSettings);
        }

        if (!authOn) {
          setAuthSettings(null);
        } else {
          const settings = await getSitePluginSettings(siteId, "site-auth");
          if (!cancelled) setAuthSettings(mergeSiteAuthSettings(settings));
        }
      } catch {
        if (!cancelled) {
          setWheelEnabled(false);
          setWheelSettings(null);
          setAuthEnabled(false);
          setAuthSettings(null);
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
    if (!siteId) return;
    try {
      const plugins = await getSitePlugins(siteId);
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

  const showAuthFloating =
    authEnabled &&
    authSettings &&
    authSettings.isActive !== false &&
    shouldShowFloatingAuthButton(authSettings);

  return (
    <>
      {siteId && wheelEnabled && wheelSettings && wheelSettings.isActive !== false ? (
        <BenefitsWheelWidget
          siteId={siteId}
          settings={wheelSettings}
          mode="editor"
          onPositionChange={handlePositionChange}
          onDeactivate={handleDeactivate}
        />
      ) : null}

      {showAuthFloating ? (
        <SiteMemberAuthProvider slug={siteSlug}>
          <SiteAuthLoginWidget
            site={{ slug: siteSlug, pluginSettings: { "site-auth": authSettings } }}
            settings={authSettings}
            variant="floating"
            mode="editor"
          />
        </SiteMemberAuthProvider>
      ) : null}
    </>
  );
}
