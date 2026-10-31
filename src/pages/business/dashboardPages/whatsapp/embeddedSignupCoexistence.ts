export const COEXISTENCE_FINISH_EVENT =
  "FINISH_WHATSAPP_BUSINESS_APP_ONBOARDING";
export const COEXISTENCE_FEATURE_TYPE = "whatsapp_business_app_onboarding";
export const COEXISTENCE_EXTRAS_VERSION = "v5";

export type WhatsAppConnectionPath = "cloud_api" | "coexistence";

export function isCoexistenceFinishEvent(event: unknown): boolean {
  return String(event || "").trim() === COEXISTENCE_FINISH_EVENT;
}

export function buildCloudApiEmbeddedSignupExtras(enteredE164?: string) {
  return {
    setup: extrasSetup(enteredE164),
    featureType: "",
    sessionInfoVersion: "3" as const,
  };
}

export function buildCoexistenceEmbeddedSignupExtras(enteredE164?: string) {
  return {
    version: COEXISTENCE_EXTRAS_VERSION,
    setup: extrasSetup(enteredE164),
  };
}

function extrasSetup(enteredE164?: string) {
  const prefill = splitPhone(enteredE164);
  return prefill ? { business: { phone: prefill } } : {};
}

function splitPhone(e164?: string): { code: number; number: string } | null {
  const digits = String(e164 || "").replace(/\D/g, "");
  if (digits.length < 8) return null;
  if (digits.startsWith("972") && digits.length >= 11) {
    return { code: 972, number: digits.slice(3) };
  }
  if (digits.startsWith("1") && digits.length >= 11) {
    return { code: 1, number: digits.slice(1) };
  }
  return { code: Number(digits.slice(0, -10)) || 1, number: digits.slice(-10) };
}
