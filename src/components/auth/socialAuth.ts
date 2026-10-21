import API from "../../api";

export type SocialProvider = "google" | "microsoft";

const KNOWN: SocialProvider[] = ["google", "microsoft"];

export const DEFAULT_BIZUPLY_AUTH_PROVIDERS: SocialProvider[] = [...KNOWN];

let pending: Promise<SocialProvider[]> | null = null;

function advertisedProviders(data: { providers?: unknown } | undefined): SocialProvider[] | null {
  if (!Array.isArray(data?.providers)) return null;
  return KNOWN.filter((p) => data.providers.includes(p));
}

export function fetchBizuplyAuthProviders(): Promise<SocialProvider[]> {
  if (!pending) {
    pending = API.get("/auth/oauth/providers")
      .then(({ data }) => advertisedProviders(data) ?? [...KNOWN])
      .catch(() => {
        pending = null;
        return [...KNOWN];
      });
  }
  return pending;
}

export function resetBizuplyAuthProvidersForTests() {
  pending = null;
}

export type BizuplySocialStart = {
  intent: "signup" | "login";
  language: string;
  plan?: string | null;
  websiteAddon?: boolean;
  referralCode?: string | null;
  redirect?: string | null;
  purchaseIntent?: boolean;
};

/** Full-page navigation to the API; the server redirects to the provider. */
export function startBizuplySocialAuth(provider: SocialProvider, opts: BizuplySocialStart) {
  const base = String(API.defaults.baseURL || "").replace(/\/+$/, "");
  const params = new URLSearchParams({
    intent: opts.intent,
    product: "bizuply",
    language: opts.language || "en",
  });
  if (opts.plan) params.set("plan", opts.plan);
  if (opts.websiteAddon) params.set("websiteAddon", "1");
  if (opts.referralCode) params.set("ref", opts.referralCode);
  if (opts.redirect) params.set("redirect", opts.redirect);
  if (opts.purchaseIntent) params.set("purchaseIntent", "1");
  if (typeof window !== "undefined" && window.location?.origin) {
    params.set("clientOrigin", window.location.origin);
  }
  window.location.assign(`${base}/auth/oauth/${provider}/start?${params.toString()}`);
}

const ERROR_KEYS: Record<string, string> = {
  existing_account: "login.oauth.errors.existing_account",
  email_unverified: "login.oauth.errors.email_unverified",
  no_account: "login.oauth.errors.no_account",
  provider_mismatch: "login.oauth.errors.provider_mismatch",
  state_invalid: "login.oauth.errors.state_invalid",
  cancelled: "login.oauth.errors.cancelled",
  provider_unavailable: "login.oauth.errors.provider_unavailable",
  provider_error: "login.oauth.errors.provider_error",
  account_disabled: "login.oauth.errors.account_disabled",
  rate_limited: "login.oauth.errors.rate_limited",
  signup_closed: "login.oauth.errors.signup_closed",
  session: "login.oauth.errors.session",
  plan_required: "login.oauth.errors.plan_required",
  incorrect_password: "login.oauth.errors.incorrect_password",
};

type Translate = (key: string, opts?: Record<string, string>) => string;

export function oauthErrorMessage(
  code: string | null,
  provider: string | null,
  t: Translate
): string | null {
  if (!code) return null;
  const providerName =
    provider === "google"
      ? t("login.providerGoogle")
      : provider === "microsoft"
        ? t("login.providerMicrosoft")
        : "";
  const key = ERROR_KEYS[code] || ERROR_KEYS.provider_error;
  return t(key, { provider: providerName });
}

export { ERROR_KEYS as OAUTH_ERROR_KEYS };
