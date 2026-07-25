import { getSitePluginSettings, saveSitePluginSettings } from "../../../api/sitePluginSettingsApi";
import { ensureSiteAuthOverlayDefaults } from "./siteAuthUtils";

/** Load site-auth settings and persist overlay defaults so the button always appears. */
export async function loadSiteAuthOverlaySettings(siteId: string) {
  const stored = await getSitePluginSettings(siteId, "site-auth");
  const merged = ensureSiteAuthOverlayDefaults(stored);

  const needsPersist =
    stored?.showTrigger === false ||
    stored?.showLoginButton === false ||
    stored?.isActive === false ||
    stored?.buttonMode === "inline" ||
    stored?.buttonMode === "both" ||
    stored?.useLoginModal === true;

  if (needsPersist) {
    try {
      const saved = await saveSitePluginSettings(siteId, "site-auth", merged);
      return ensureSiteAuthOverlayDefaults(saved);
    } catch {
      return merged;
    }
  }

  return merged;
}
