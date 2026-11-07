import API from "../api";
import { NOTICE_VERSION } from "./trackingConsent";

export function createConsentKey(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID().replace(/-/g, "");
  }
  return `c${Date.now().toString(36)}${Math.random().toString(36).slice(2, 14)}`;
}

export type ConsentStoreResult =
  | { status: "stored"; id: string }
  | { status: "unavailable" };

function routeMissing(err: unknown): boolean {
  const status = (err as { response?: { status?: number } }).response?.status;
  return status === 404 || status === 405;
}

/**
 * Stores the choice when the new route exists.
 * A missing route means the previous server is still running. Callers continue
 * the existing action and must not tell the visitor that a record was saved.
 * Any other failure blocks the action.
 */
export async function storePrivacyConsent(body: {
  consentKey: string;
  source: "register" | "contact";
  email?: string;
  termsAccepted: boolean;
  marketingOptIn: boolean;
  locale?: string;
  plan?: string;
}): Promise<ConsentStoreResult> {
  try {
    const { data } = await API.post("/privacy/consent", {
      ...body,
      noticeVersion: NOTICE_VERSION,
    });
    if (data?.success !== true || data?.stored !== true || !data?.id) {
      throw new Error(data?.code || "consent_not_stored");
    }
    return { status: "stored", id: String(data.id) };
  } catch (err) {
    if (routeMissing(err)) return { status: "unavailable" };
    const code = (err as { response?: { data?: { code?: string } } }).response?.data?.code;
    throw new Error(code || (err instanceof Error ? err.message : "consent_not_stored"));
  }
}
