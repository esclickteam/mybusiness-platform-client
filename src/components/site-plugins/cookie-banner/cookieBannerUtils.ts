import i18n from "../../../i18n/i18n";

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

function defaultCookieBannerSettings(): CookieBannerSettings {
  return {
    isActive: true,
    message: i18n.t("publicWidgets.cookie.message"),
    acceptLabel: i18n.t("publicWidgets.cookie.accept"),
    declineLabel: i18n.t("publicWidgets.cookie.decline"),
    policyUrl: "/privacy",
    policyLabel: i18n.t("publicWidgets.cookie.policy"),
    backgroundColor: "#0F172A",
    textColor: "#FFFFFF",
    accentColor: "#0F766E",
    position: "bottom",
  };
}

export function mergeCookieBannerSettings(
  stored?: Partial<CookieBannerSettings> | null
): CookieBannerSettings {
  return { ...defaultCookieBannerSettings(), ...(stored || {}) };
}

export function cookieConsentKey(siteKey: string) {
  return `bizuply-cookie-consent:${siteKey || "site"}`;
}
