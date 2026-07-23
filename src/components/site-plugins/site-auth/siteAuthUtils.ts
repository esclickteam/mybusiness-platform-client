import type { SiteAuthSettings } from "../../api/siteMemberAuthApi";

export type SiteAuthWidgetSettings = SiteAuthSettings & {
  triggerPosition?: { x: number; y: number };
};

export function mergeSiteAuthSettings(
  raw: unknown,
  fallback?: Partial<SiteAuthWidgetSettings>
): SiteAuthWidgetSettings {
  const stored = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const base = readPartialSettings(fallback);

  const triggerRaw = (stored.triggerPosition || fallback?.triggerPosition) as
    | { x?: number; y?: number }
    | undefined;

  return {
    ...base,
    isActive: stored.isActive !== false && base.isActive !== false,
    loginButtonLabel: String(stored.loginButtonLabel || base.loginButtonLabel),
    logoutButtonLabel: String(stored.logoutButtonLabel || base.logoutButtonLabel),
    allowSelfRegister: Boolean(stored.allowSelfRegister ?? base.allowSelfRegister),
    loginPageTitle: String(stored.loginPageTitle || base.loginPageTitle),
    loginSubtitle: String(stored.loginSubtitle ?? base.loginSubtitle),
    registerTitle: String(stored.registerTitle || base.registerTitle),
    registerSubtitle: String(stored.registerSubtitle ?? base.registerSubtitle),
    forgotPasswordEnabled: stored.forgotPasswordEnabled !== false,
    showLoginButton: stored.showLoginButton !== false,
    useLoginModal: Boolean(stored.useLoginModal ?? base.useLoginModal),
    buttonMode: normalizeButtonMode(stored.buttonMode ?? base.buttonMode),
    buttonDisplay: normalizeButtonDisplay(stored.buttonDisplay ?? base.buttonDisplay),
    buttonTransparent: stored.buttonTransparent !== false,
    buttonTextColor: String(stored.buttonTextColor ?? base.buttonTextColor),
    showMemberName: stored.showMemberName !== false,
    memberAreaPath: String(stored.memberAreaPath || base.memberAreaPath),
    defaultAddAsCrmClient: Boolean(
      stored.defaultAddAsCrmClient ?? base.defaultAddAsCrmClient
    ),
    autoAddRegisterAsCrmClient: Boolean(
      stored.autoAddRegisterAsCrmClient ?? base.autoAddRegisterAsCrmClient
    ),
    registerCollectPhone: Boolean(
      stored.registerCollectPhone ?? base.registerCollectPhone
    ),
    formBackgroundColor: String(stored.formBackgroundColor || base.formBackgroundColor),
    formTextColor: String(stored.formTextColor || base.formTextColor),
    formLabelColor: String(stored.formLabelColor || base.formLabelColor),
    formAccentColor: String(stored.formAccentColor ?? base.formAccentColor),
    formButtonTextColor: String(stored.formButtonTextColor || base.formButtonTextColor),
    formBorderColor: String(stored.formBorderColor || base.formBorderColor),
    formBorderRadius: Number(stored.formBorderRadius ?? base.formBorderRadius),
    triggerPosition: {
      x: Number(triggerRaw?.x ?? base.triggerPosition.x),
      y: Number(triggerRaw?.y ?? base.triggerPosition.y),
    },
  };
}

function readPartialSettings(
  fallback?: Partial<SiteAuthWidgetSettings>
): SiteAuthWidgetSettings {
  return {
    isActive: fallback?.isActive !== false,
    loginButtonLabel: String(fallback?.loginButtonLabel || "התחברות"),
    logoutButtonLabel: String(fallback?.logoutButtonLabel || "התנתקות"),
    allowSelfRegister: Boolean(fallback?.allowSelfRegister),
    loginPageTitle: String(fallback?.loginPageTitle || "התחברות"),
    loginSubtitle: String(fallback?.loginSubtitle || ""),
    registerTitle: String(fallback?.registerTitle || "הרשמה"),
    registerSubtitle: String(fallback?.registerSubtitle || ""),
    forgotPasswordEnabled: fallback?.forgotPasswordEnabled !== false,
    showLoginButton: fallback?.showLoginButton !== false,
    useLoginModal: Boolean(fallback?.useLoginModal),
    buttonMode: normalizeButtonMode(fallback?.buttonMode),
    buttonDisplay: normalizeButtonDisplay(fallback?.buttonDisplay),
    buttonTransparent: fallback?.buttonTransparent !== false,
    buttonTextColor: String(fallback?.buttonTextColor || ""),
    showMemberName: fallback?.showMemberName !== false,
    memberAreaPath: String(fallback?.memberAreaPath || "/member"),
    defaultAddAsCrmClient: Boolean(fallback?.defaultAddAsCrmClient),
    autoAddRegisterAsCrmClient: Boolean(fallback?.autoAddRegisterAsCrmClient),
    registerCollectPhone: Boolean(fallback?.registerCollectPhone),
    formBackgroundColor: String(fallback?.formBackgroundColor || "#ffffff"),
    formTextColor: String(fallback?.formTextColor || "#1e293b"),
    formLabelColor: String(fallback?.formLabelColor || "#334155"),
    formAccentColor: String(fallback?.formAccentColor || ""),
    formButtonTextColor: String(fallback?.formButtonTextColor || "#ffffff"),
    formBorderColor: String(fallback?.formBorderColor || "#e2e8f0"),
    formBorderRadius: Number(fallback?.formBorderRadius ?? 16),
    triggerPosition: {
      x: Number(fallback?.triggerPosition?.x ?? 92),
      y: Number(fallback?.triggerPosition?.y ?? 6),
    },
  };
}

function normalizeButtonMode(value: unknown): SiteAuthWidgetSettings["buttonMode"] {
  const mode = String(value || "inline");
  if (mode === "floating" || mode === "inline" || mode === "both") return mode;
  return "inline";
}

function normalizeButtonDisplay(
  value: unknown
): SiteAuthWidgetSettings["buttonDisplay"] {
  const display = String(value || "icon");
  if (display === "button" || display === "icon" || display === "text") return display;
  return "icon";
}

export function buildSiteAuthWidgetMarker(label = "כפתור התחברות") {
  return `<div data-bizuply-plugin="site-auth" data-bizuply-widget="site-auth" data-site-auth-mount="true" style="display:inline-flex;width:fit-content;height:fit-content;direction:rtl;box-sizing:border-box"><span style="display:inline-flex;align-items:center;justify-content:center;width:36px;height:36px;color:#6366f1;font-family:system-ui,sans-serif;font-size:11px;font-weight:700">${label}</span></div>`;
}

export function pageHasSiteAuthWidget(root: ParentNode | null | undefined) {
  if (!root) return false;
  return Boolean(root.querySelector('[data-bizuply-widget="site-auth"]'));
}

export function shouldShowFloatingAuthButton(settings: SiteAuthWidgetSettings) {
  if (!settings.isActive || !settings.showLoginButton) return false;
  return settings.buttonMode === "floating" || settings.buttonMode === "both";
}

export function shouldMountInlineAuthButton(settings: SiteAuthWidgetSettings) {
  if (!settings.isActive) return false;
  return settings.buttonMode === "inline" || settings.buttonMode === "both";
}

export function shouldCollectRegisterPhone(settings: SiteAuthWidgetSettings) {
  return (
    settings.registerCollectPhone || settings.autoAddRegisterAsCrmClient
  );
}
