export type CookieBannerSettings = {
  isActive: boolean;
  message: string;
  acceptLabel: string;
  declineLabel: string;
  policyUrl: string;
  policyLabel: string;
  backgroundColor: string;
  textColor: string;
  accentColor: string;
  position: "bottom" | "top";
};

const DEFAULTS: CookieBannerSettings = {
  isActive: true,
  message:
    "אנחנו משתמשים בעוגיות כדי לשפר את חוויית הגלישה ולנתח שימוש באתר.",
  acceptLabel: "אני מסכים/ה",
  declineLabel: "דחייה",
  policyUrl: "/privacy",
  policyLabel: "מדיניות פרטיות",
  backgroundColor: "#0F172A",
  textColor: "#FFFFFF",
  accentColor: "#0F766E",
  position: "bottom",
};

export function mergeCookieBannerSettings(
  stored?: Partial<CookieBannerSettings> | null
): CookieBannerSettings {
  return { ...DEFAULTS, ...(stored || {}) };
}

export function cookieConsentKey(siteKey: string) {
  return `bizuply-cookie-consent:${siteKey || "site"}`;
}
