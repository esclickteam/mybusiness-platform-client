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
  message: "משלוח חינם בהזמנות מעל ₪200 · לפרטים לחצו כאן",
  linkUrl: "",
  linkLabel: "",
  backgroundColor: "#0F172A",
  textColor: "#FFFFFF",
  dismissible: true,
};

export function mergeAnnouncementBarSettings(
  stored?: Partial<AnnouncementBarSettings> | null
): AnnouncementBarSettings {
  return { ...DEFAULTS, ...(stored || {}) };
}

export function announcementDismissKey(siteKey: string) {
  return `bizuply-announcement-dismissed:${siteKey || "site"}`;
}
