import type { CSSProperties } from "react";

import type { SiteAuthWidgetSettings } from "./siteAuthUtils";

export function resolveSiteAuthAccentColor(
  settings: SiteAuthWidgetSettings,
  brandColor?: string
) {
  return settings.formAccentColor || brandColor || "#6366F1";
}

export function buildSiteAuthFormShellStyle(
  settings: SiteAuthWidgetSettings,
  brandColor?: string
): CSSProperties {
  const radius = Math.max(0, Number(settings.formBorderRadius ?? 16));
  return {
    backgroundColor: settings.formBackgroundColor || "#ffffff",
    color: settings.formTextColor || "#1e293b",
    borderColor: settings.formBorderColor || "#e2e8f0",
    borderRadius: `${radius}px`,
  };
}

export function buildSiteAuthLabelStyle(settings: SiteAuthWidgetSettings): CSSProperties {
  return {
    color: settings.formLabelColor || "#334155",
  };
}

export function buildSiteAuthInputStyle(
  settings: SiteAuthWidgetSettings
): CSSProperties {
  const radius = Math.max(0, Number(settings.formBorderRadius ?? 16));
  return {
    backgroundColor: settings.formBackgroundColor || "#ffffff",
    color: settings.formTextColor || "#1e293b",
    borderColor: settings.formBorderColor || "#e2e8f0",
    borderRadius: `${Math.max(8, radius - 4)}px`,
  };
}

export function buildSiteAuthButtonStyle(
  settings: SiteAuthWidgetSettings,
  brandColor?: string
): CSSProperties {
  const radius = Math.max(0, Number(settings.formBorderRadius ?? 16));
  return {
    backgroundColor: resolveSiteAuthAccentColor(settings, brandColor),
    color: settings.formButtonTextColor || "#ffffff",
    borderRadius: `${Math.max(8, radius - 4)}px`,
  };
}

export function buildSiteAuthLinkStyle(
  settings: SiteAuthWidgetSettings,
  brandColor?: string
): CSSProperties {
  return {
    color: resolveSiteAuthAccentColor(settings, brandColor),
  };
}
