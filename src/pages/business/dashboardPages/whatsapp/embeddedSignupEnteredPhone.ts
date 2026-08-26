export const EMBEDDED_SIGNUP_ENTERED_PHONE_MIN_DIGITS = 8;

export type NormalizedEnteredPhone = {
  e164: string;
  digits: string;
};

function digitsOnly(value: string): string {
  return String(value || "").replace(/\D/g, "");
}

/**
 * Number the user will verify in the current Embedded Signup.
 * Israeli local 05x… becomes 9725x…. Does not invent a tenant DID.
 */
export function normalizeEnteredSignupPhone(
  raw?: string | null
): NormalizedEnteredPhone | null {
  let digits = digitsOnly(String(raw || "").trim());
  if (!digits) return null;
  if (digits.startsWith("00")) digits = digits.slice(2);
  if (digits.startsWith("0") && digits.length >= 9) {
    digits = `972${digits.slice(1)}`;
  }
  if (digits.length < EMBEDDED_SIGNUP_ENTERED_PHONE_MIN_DIGITS) return null;
  return { e164: `+${digits}`, digits };
}

const COUNTRY_CODES = ["972", "1", "44", "49", "33", "34", "39", "31", "32", "46", "47", "45", "48", "380", "90", "91", "61", "81", "82", "86", "55", "52", "27", "971", "966", "974", "965", "973", "968"];

export function splitE164ForMetaPrefill(
  raw?: string | null
): { code: number; number: string } | null {
  const normalized = normalizeEnteredSignupPhone(raw);
  if (!normalized) return null;
  const digits = normalized.digits;
  const code = COUNTRY_CODES.find((prefix) => digits.startsWith(prefix));
  if (!code || digits.length <= code.length) return null;
  return { code: Number(code), number: digits.slice(code.length) };
}

function firstNonEmptyString(values: unknown[]): string {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return "";
}

/**
 * Best-effort extract of a phone from a Meta ES postMessage.
 * Official FINISH / CANCEL payloads do not include E.164 before OTP.
 */
export function extractEmbeddedSignupEnteredPhone(payload: unknown): string {
  const root = payload && typeof payload === "object" ? (payload as Record<string, unknown>) : {};
  const data =
    root.data && typeof root.data === "object"
      ? (root.data as Record<string, unknown>)
      : root;
  const nestedPhone =
    data.phone && typeof data.phone === "object"
      ? (data.phone as Record<string, unknown>)
      : {};
  const raw = firstNonEmptyString([
    data.display_phone_number,
    data.phone_number,
    data.wa_phone_number,
    data.business_phone_number,
    data.entered_phone_number,
    nestedPhone.display_phone_number,
    nestedPhone.number,
    typeof data.phone === "string" ? data.phone : "",
  ]);
  const normalized = normalizeEnteredSignupPhone(raw);
  return normalized?.e164 || "";
}
