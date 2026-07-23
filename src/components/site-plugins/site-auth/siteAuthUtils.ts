import type { SiteAuthSettings } from "../../api/siteMemberAuthApi";

export type SiteAuthWidgetSettings = SiteAuthSettings & {
  triggerPosition?: { x: number; y: number };
};

export function mergeSiteAuthSettings(
  raw: unknown,
  fallback?: Partial<SiteAuthWidgetSettings>
): SiteAuthWidgetSettings {
  const stored = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const base = (fallback && typeof fallback === "object" ? fallback : {}) as Record<
    string,
    unknown
  >;

  const triggerRaw = (stored.triggerPosition || base.triggerPosition) as
    | { x?: number; y?: number }
    | undefined;

  return {
    isActive: stored.isActive !== false && base.isActive !== false,
    loginButtonLabel: String(stored.loginButtonLabel || base.loginButtonLabel || "התחברות"),
    logoutButtonLabel: String(stored.logoutButtonLabel || base.logoutButtonLabel || "התנתקות"),
    allowSelfRegister: Boolean(stored.allowSelfRegister ?? base.allowSelfRegister),
    loginPageTitle: String(stored.loginPageTitle || base.loginPageTitle || "התחברות"),
    forgotPasswordEnabled: stored.forgotPasswordEnabled !== false,
    showLoginButton: stored.showLoginButton !== false,
    useLoginModal: stored.useLoginModal !== false,
    buttonMode: normalizeButtonMode(stored.buttonMode || base.buttonMode),
    showMemberName: stored.showMemberName !== false,
    memberAreaPath: String(stored.memberAreaPath || base.memberAreaPath || "/member"),
    triggerPosition: {
      x: Number(triggerRaw?.x ?? 92),
      y: Number(triggerRaw?.y ?? 6),
    },
  };
}

function normalizeButtonMode(value: unknown): SiteAuthWidgetSettings["buttonMode"] {
  const mode = String(value || "both");
  if (mode === "floating" || mode === "inline" || mode === "both") return mode;
  return "both";
}

export function buildSiteAuthWidgetMarker(label = "כפתור התחברות") {
  return `<div data-bizuply-plugin="site-auth" data-bizuply-widget="site-auth" data-site-auth-mount="true" style="display:inline-flex;min-height:44px;direction:rtl;box-sizing:border-box"><div style="display:inline-flex;align-items:center;justify-content:center;padding:10px 18px;border-radius:999px;background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#fff;font-family:system-ui,sans-serif;font-size:13px;font-weight:800;box-shadow:0 8px 24px rgba(99,102,241,.35)">${label}</div></div>`;
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
