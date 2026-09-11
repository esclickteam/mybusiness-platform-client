/**
 * Safe extraction of Meta Embedded Signup session asset IDs.
 * Fail-closed: unknown/malformed completion events yield no assets.
 * Never logs auth codes, tokens, or PINs.
 */

export const EMBEDDED_SIGNUP_SUCCESS_EVENTS = [
  "FINISH",
  "FINISH_ONLY_WABA",
  "FINISH_OBO_MIGRATION",
] as const;

export type EmbeddedSignupSuccessEvent =
  (typeof EMBEDDED_SIGNUP_SUCCESS_EVENTS)[number];

export type EmbeddedSignupSessionAssets = {
  phoneNumberId: string;
  wabaId: string;
  metaBusinessId: string;
  event: EmbeddedSignupSuccessEvent;
};

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object"
    ? (value as Record<string, unknown>)
    : {};
}

function firstString(...values: unknown[]): string {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return "";
}

export function isEmbeddedSignupSuccessEvent(
  event: unknown
): event is EmbeddedSignupSuccessEvent {
  return (
    typeof event === "string" &&
    (EMBEDDED_SIGNUP_SUCCESS_EVENTS as readonly string[]).includes(event)
  );
}

/**
 * Extract phone/WABA/portfolio IDs from a Meta WA_EMBEDDED_SIGNUP postMessage.
 * Supports FINISH, FINISH_ONLY_WABA, and FINISH_OBO_MIGRATION.
 * Returns null when the event is not a recognized success completion or IDs are missing.
 */
export function extractEmbeddedSignupSessionAssets(
  payload: unknown
): EmbeddedSignupSessionAssets | null {
  const root = asRecord(payload);
  if (root.type != null && root.type !== "WA_EMBEDDED_SIGNUP") {
    return null;
  }

  const event = firstString(root.event);
  if (!isEmbeddedSignupSuccessEvent(event)) {
    return null;
  }

  const data = asRecord(root.data);
  const phoneNumberId = firstString(
    data.phone_number_id,
    data.phoneNumberId,
    data.phone_number_ids && Array.isArray(data.phone_number_ids)
      ? data.phone_number_ids[0]
      : ""
  );
  const wabaId = firstString(
    data.waba_id,
    data.wabaId,
    data.waba_ids && Array.isArray(data.waba_ids) ? data.waba_ids[0] : ""
  );
  const metaBusinessId = firstString(
    data.business_id,
    data.businessId,
    data.meta_business_id,
    data.portfolio_id
  );

  // FINISH_ONLY_WABA intentionally may omit phone — still return when waba present
  // for diagnostics, but staging complete requires phone+waba (caller enforces).
  if (event === "FINISH_ONLY_WABA") {
    if (!wabaId) return null;
    return {
      phoneNumberId,
      wabaId,
      metaBusinessId,
      event,
    };
  }

  // FINISH and FINISH_OBO_MIGRATION require both phone and WABA (fail closed).
  if (!phoneNumberId || !wabaId) {
    return null;
  }

  return {
    phoneNumberId,
    wabaId,
    metaBusinessId,
    event,
  };
}

/** Safe diagnostic fields only — never include code/token/pin. */
export function embeddedSignupAssetsLogFields(
  assets: EmbeddedSignupSessionAssets | null,
  eventRaw?: string
) {
  return {
    event: assets?.event || eventRaw || null,
    hasPhoneNumberId: Boolean(assets?.phoneNumberId),
    hasWabaId: Boolean(assets?.wabaId),
    hasMetaBusinessId: Boolean(assets?.metaBusinessId),
    phoneNumberIdSuffix: assets?.phoneNumberId
      ? String(assets.phoneNumberId).slice(-6)
      : null,
    wabaIdSuffix: assets?.wabaId ? String(assets.wabaId).slice(-6) : null,
  };
}
