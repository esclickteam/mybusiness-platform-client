import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import type { SocialProvider } from "./authConfig";

/** English source of the shared WhatsApp API auth copy; translations live under `whatsappApiAuth` in the locales. */
export const WA_AUTH_COPY_EN = {
  providers: {
    google: "Continue with Google",
    microsoft: "Continue with Microsoft",
  },
  providerNames: { google: "Google", microsoft: "Microsoft" },
  or: "OR",
  email: "Email address",
  password: "Password",
  showPassword: "Show password",
  hidePassword: "Hide password",
  redirecting: "Redirecting…",
  botCheck: "Please complete the security check and try again.",
  botChecking: "Checking your browser…",
  errors: {
    existing_account:
      "This email already has a Bizuply account. Log in with the method you used before, for example email and password.",
    email_unverified:
      "{{provider}} didn't confirm this email address. Verify it with {{provider}}, or use email and password.",
    no_account: "No WhatsApp API account uses this {{provider}} login yet. Create an account to get started.",
    provider_mismatch:
      "This account is linked to a different {{provider}} login. Use that one, or log in with email and password.",
    state_invalid: "Your sign-in session expired. Please try again.",
    cancelled: "{{provider}} sign-in was cancelled.",
    provider_unavailable: "{{provider}} sign-in isn't available right now. Use email and password.",
    provider_error: "We couldn't sign you in with {{provider}}. Please try again.",
    account_disabled: "This account is disabled. Contact support@bizuply.com.",
    rate_limited: "Too many attempts. Try again in a few minutes.",
    signup_closed: "Sign-up is temporarily unavailable. Please try again later.",
    session: "We couldn't finish signing you in. Please try again.",
  },
};

export type WaAuthCopy = typeof WA_AUTH_COPY_EN;

/** Translated copy for screens that follow the app language (the product login page). */
export function useWaAuthCopy(): WaAuthCopy {
  const { t, i18n } = useTranslation();
  return useMemo(() => {
    // `{{provider}}` stays a placeholder here; oauthErrorMessage fills it in.
    const tr = (key: string, fallback: string) =>
      t(`whatsappApiAuth.${key}`, { defaultValue: fallback, provider: "{{provider}}" });
    const map = <T extends Record<string, string>>(prefix: string, obj: T) =>
      Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, tr(`${prefix}.${k}`, v)])) as T;
    return {
      providers: map("providers", WA_AUTH_COPY_EN.providers),
      providerNames: WA_AUTH_COPY_EN.providerNames,
      or: tr("or", WA_AUTH_COPY_EN.or),
      email: tr("email", WA_AUTH_COPY_EN.email),
      password: tr("password", WA_AUTH_COPY_EN.password),
      showPassword: tr("showPassword", WA_AUTH_COPY_EN.showPassword),
      hidePassword: tr("hidePassword", WA_AUTH_COPY_EN.hidePassword),
      redirecting: tr("redirecting", WA_AUTH_COPY_EN.redirecting),
      botCheck: tr("botCheck", WA_AUTH_COPY_EN.botCheck),
      botChecking: tr("botChecking", WA_AUTH_COPY_EN.botChecking),
      errors: map("errors", WA_AUTH_COPY_EN.errors),
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [t, i18n.language]);
}

const KNOWN_PROVIDERS = new Set(["google", "microsoft"]);

/** Message for an `oauth_error` code returned by the sign-in callback, or null if unknown. */
export function oauthErrorMessage(code: string | null, provider: string | null, copy: WaAuthCopy): string | null {
  if (!code) return null;
  const template = (copy.errors as Record<string, string>)[code] ?? copy.errors.provider_error;
  const name = provider && KNOWN_PROVIDERS.has(provider) ? copy.providerNames[provider as SocialProvider] : "";
  return template.replace(/\{\{provider\}\}/g, name || "Your provider");
}
