import {
  readVisualInsertedElements,
  removeVisualInsertedElement,
} from "../../site-builder/studio/visual-editor/utils/visualData";

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
    showTrigger: stored?.showTrigger !== false,
    useLoginModal: Boolean(stored.useLoginModal ?? base.useLoginModal),
    buttonMode: "floating",
    buttonDisplay: normalizeButtonDisplay(stored.buttonDisplay ?? base.buttonDisplay),
    buttonTransparent: stored?.buttonTransparent !== false,
    buttonTextColor: String(stored.buttonTextColor ?? base.buttonTextColor),
    showMemberName: stored.showMemberName !== false,
    memberAreaPath: String(stored.memberAreaPath || base.memberAreaPath),
    defaultAddAsCrmClient: Boolean(
      stored.defaultAddAsCrmClient ?? base.defaultAddAsCrmClient
    ),
    autoAddRegisterAsCrmClient: Boolean(
      stored.autoAddRegisterAsCrmClient ?? base.autoAddRegisterAsCrmClient
    ),
    registerCollectPhone: stored?.registerCollectPhone !== false,
    formBackgroundColor: String(stored.formBackgroundColor || base.formBackgroundColor),
    formTextColor: String(stored.formTextColor || base.formTextColor),
    formLabelColor: String(stored.formLabelColor || base.formLabelColor),
    formAccentColor: String(stored.formAccentColor ?? base.formAccentColor),
    formButtonTextColor: String(stored.formButtonTextColor || base.formButtonTextColor),
    formBorderColor: String(stored.formBorderColor || base.formBorderColor),
    formBorderRadius: Number(stored.formBorderRadius ?? base.formBorderRadius),
    triggerPosition: normalizeTriggerPosition(triggerRaw, base.triggerPosition),
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
    showTrigger: fallback?.showTrigger !== false,
    useLoginModal: Boolean(fallback?.useLoginModal),
    buttonMode: "floating",
    buttonDisplay: normalizeButtonDisplay(fallback?.buttonDisplay),
    buttonTransparent: fallback?.buttonTransparent !== false,
    buttonTextColor: String(fallback?.buttonTextColor || ""),
    showMemberName: fallback?.showMemberName !== false,
    memberAreaPath: String(fallback?.memberAreaPath || "/member"),
    defaultAddAsCrmClient: Boolean(fallback?.defaultAddAsCrmClient),
    autoAddRegisterAsCrmClient: Boolean(fallback?.autoAddRegisterAsCrmClient),
    registerCollectPhone: fallback?.registerCollectPhone !== false,
    formBackgroundColor: String(fallback?.formBackgroundColor || "#ffffff"),
    formTextColor: String(fallback?.formTextColor || "#1e293b"),
    formLabelColor: String(fallback?.formLabelColor || "#334155"),
    formAccentColor: String(fallback?.formAccentColor || ""),
    formButtonTextColor: String(fallback?.formButtonTextColor || "#ffffff"),
    formBorderColor: String(fallback?.formBorderColor || "#e2e8f0"),
    formBorderRadius: Number(fallback?.formBorderRadius ?? 16),
    triggerPosition: { x: 88, y: 82 },
  };
}

function normalizeButtonDisplay(
  value: unknown
): SiteAuthWidgetSettings["buttonDisplay"] {
  const display = String(value || "icon");
  if (display === "button" || display === "icon" || display === "text") return display;
  return "icon";
}

function normalizeTriggerPosition(
  raw: { x?: number; y?: number } | undefined,
  fallback: { x: number; y: number }
) {
  const x = Number(raw?.x ?? fallback.x);
  let y = Number(raw?.y ?? fallback.y);
  if (y < 24) y = 82;
  return {
    x: Math.min(96, Math.max(4, x)),
    y: Math.min(96, Math.max(4, y)),
  };
}

export function buildSiteAuthWidgetMarker(label = "כפתור התחברות") {
  return `<div data-bizuply-plugin="site-auth" data-bizuply-widget="site-auth" style="display:none">${label}</div>`;
}

export function pageHasSiteAuthWidget(root: ParentNode | null | undefined) {
  if (!root) return false;
  return Boolean(root.querySelector('[data-bizuply-widget="site-auth"]'));
}

export function shouldShowFloatingAuthButton(settings: SiteAuthWidgetSettings) {
  if (!settings.isActive || settings.showLoginButton === false) return false;
  if (settings.showTrigger === false) return false;
  return true;
}

export function stripLegacySiteAuthWidgetsFromVisualData(data: Record<string, any>) {
  const elements = readVisualInsertedElements(data || {});
  let next = data || {};
  let changed = false;

  Object.values(elements).forEach((item) => {
    const id = String(item?.id || "");
    const html = String(item?.html || "");
    const label = String(item?.label || "");
    const isLegacy =
      html.includes('data-bizuply-widget="site-auth"') ||
      label.includes("התחברות") ||
      label.includes("כפתור התחברות");

    if (id && isLegacy) {
      next = removeVisualInsertedElement(next, id);
      changed = true;
    }
  });

  return { data: next, changed };
}
