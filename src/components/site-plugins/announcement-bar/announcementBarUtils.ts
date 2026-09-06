import i18n from "../../../i18n/i18n";

export type AnnouncementBarSettings = {
  isActive: boolean;
  message: string;
  linkUrl: string;
  linkLabel: string;
  backgroundColor: string;
  textColor: string;
  dismissible: boolean;
};

function defaultAnnouncementBarSettings(): AnnouncementBarSettings {
  return {
    isActive: true,
    message: i18n.t("publicWidgets.announcement.message"),
    linkUrl: "",
    linkLabel: i18n.t("publicWidgets.announcement.details"),
    backgroundColor: "#0F172A",
    textColor: "#FFFFFF",
    dismissible: true,
  };
}

export function mergeAnnouncementBarSettings(
  stored?: Partial<AnnouncementBarSettings> | null
): AnnouncementBarSettings {
  const defaults = defaultAnnouncementBarSettings();
  const merged = { ...defaults, ...(stored || {}) };
  if (!String(merged.message || "").trim()) {
    merged.message = defaults.message;
  }
  if (merged.isActive == null) merged.isActive = true;
  return merged;
}

export function announcementDismissKey(siteKey: string) {
  return `bizuply-announcement-dismissed:${siteKey || "site"}`;
}
