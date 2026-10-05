import { useEffect, useState } from "react";
import API from "../../api";

export type SocialProvider = "google" | "facebook" | "microsoft";

export type WhatsAppApiAuthConfig = {
  loaded: boolean;
  selfServe: boolean;
  /** Only providers whose dedicated login app is configured on the server. */
  providers: SocialProvider[];
  turnstileSiteKey: string | null;
};

const KNOWN: SocialProvider[] = ["google", "facebook", "microsoft"];
const EMPTY: WhatsAppApiAuthConfig = { loaded: false, selfServe: false, providers: [], turnstileSiteKey: null };

let pending: Promise<WhatsAppApiAuthConfig> | null = null;

export function fetchWhatsAppApiAuthConfig(): Promise<WhatsAppApiAuthConfig> {
  if (!pending) {
    pending = API.get("/whatsapp-api/availability")
      .then(({ data }) => ({
        loaded: true,
        selfServe: Boolean(data?.selfServe),
        providers: KNOWN.filter((p) => Array.isArray(data?.providers) && data.providers.includes(p)),
        turnstileSiteKey: typeof data?.turnstileSiteKey === "string" && data.turnstileSiteKey ? data.turnstileSiteKey : null,
      }))
      .catch(() => {
        pending = null;
        return { ...EMPTY, loaded: true };
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
