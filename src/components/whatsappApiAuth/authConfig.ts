import { useEffect, useState } from "react";
import API from "../../api";

export type SocialProvider = "google" | "microsoft";

export type WhatsAppApiAuthConfig = {
  loaded: boolean;
  selfServe: boolean;
  /** Only providers whose dedicated login app is configured on the server. */
  providers: SocialProvider[];
  turnstileSiteKey: string | null;
};

const KNOWN: SocialProvider[] = ["google", "microsoft"];
/** Optimistic self-serve so Get Started never flashes the sales-request form. */
const EMPTY: WhatsAppApiAuthConfig = { loaded: false, selfServe: true, providers: [], turnstileSiteKey: null };

let pending: Promise<WhatsAppApiAuthConfig> | null = null;

function parseSelfServe(data: { selfServe?: unknown } | null | undefined): boolean {
  return data?.selfServe == null ? true : Boolean(data.selfServe);
}

/** Signup/checkout unless the server has loaded and explicitly closed self-serve. */
export function isWhatsAppApiSelfServe(config: WhatsAppApiAuthConfig): boolean {
  return !config.loaded || config.selfServe;
}

export function fetchWhatsAppApiAuthConfig(): Promise<WhatsAppApiAuthConfig> {
  if (!pending) {
    pending = API.get("/whatsapp-api/availability")
      .then(({ data }) => ({
        loaded: true,
        selfServe: parseSelfServe(data),
        providers: KNOWN.filter((p) => Array.isArray(data?.providers) && data.providers.includes(p)),
        turnstileSiteKey: typeof data?.turnstileSiteKey === "string" && data.turnstileSiteKey ? data.turnstileSiteKey : null,
      }))
      .catch(() => {
        pending = null;
        return { loaded: true, selfServe: true, providers: [], turnstileSiteKey: null };
      });
  }
  return pending;
}

export function useWhatsAppApiAuthConfig(): WhatsAppApiAuthConfig {
  const [config, setConfig] = useState<WhatsAppApiAuthConfig>(EMPTY);
  useEffect(() => {
    let alive = true;
    void fetchWhatsAppApiAuthConfig().then((next) => {
      if (alive) setConfig(next);
    });
    return () => {
      alive = false;
    };
  }, []);
  return config;
}

/** Full-page navigation to the API; the server redirects to the provider. */
export function startSocialAuth(provider: SocialProvider, intent: "signup" | "login", language: string) {
  const base = String(API.defaults.baseURL || "").replace(/\/+$/, "");
  const params = new URLSearchParams({ intent, language });
  window.location.assign(`${base}/auth/oauth/${provider}/start?${params.toString()}`);
}

export function resetWhatsAppApiAuthConfigForTests() {
  pending = null;
}
