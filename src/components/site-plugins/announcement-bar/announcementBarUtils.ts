export type AnnouncementBarSettings = {
  isActive: boolean;
  message: string;
  linkUrl: string;
  linkLabel: string;
  backgroundColor: string;
  textColor: string;
  dismissible: boolean;
};

const DEFAULTS: AnnouncementBarSettings = {
  isActive: true,
  message: "משלוח חינם בהזמנות מעל 300 ₪ — לפרטים לחצו כאן",
  linkUrl: "",
  linkLabel: "לפרטים",
  backgroundColor: "#0F172A",
  textColor: "#FFFFFF",
  dismissible: true,
};

export function mergeAnnouncementBarSettings(
  stored?: Partial<AnnouncementBarSettings> | null
): AnnouncementBarSettings {
  const merged = { ...DEFAULTS, ...(stored || {}) };
  if (!String(merged.message || "").trim()) {
    merged.message = DEFAULTS.message;
  }
  if (merged.isActive == null) merged.isActive = true;
  return merged;
}

export function announcementDismissKey(siteKey: string) {
  return `bizuply-announcement-dismissed:${siteKey || "site"}`;
}
