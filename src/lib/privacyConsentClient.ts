import API from "../api";
import { NOTICE_VERSION } from "./trackingConsent";

export function createConsentKey(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID().replace(/-/g, "");
  }
  return `c${Date.now().toString(36)}${Math.random().toString(36).slice(2, 14)}`;
}

export async function storePrivacyConsent(body: {
  consentKey: string;
  source: "register" | "contact";
  email?: string;
  termsAccepted: boolean;
  marketingOptIn: boolean;
  locale?: string;
  plan?: string;
}): Promise<string> {
  try {
    const { data } = await API.post("/privacy/consent", {
      ...body,
      noticeVersion: NOTICE_VERSION,
    });
    if (data?.success !== true || data?.stored !== true || !data?.id) {
      throw new Error(data?.code || "consent_not_stored");
    }
    return String(data.id);
  } catch (err) {
    const code = (err as { response?: { data?: { code?: string } } }).response?.data?.code;
    throw new Error(code || "consent_not_stored");
  }
}
