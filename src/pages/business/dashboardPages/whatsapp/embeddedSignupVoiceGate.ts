export const EMBEDDED_SIGNUP_VOICE_BLOCKING_CODES = new Set([
  "VERIFICATION_DID_MISSING",
]);

export function shouldAbortEmbeddedSignupForVoiceError(
  code?: string | null
): boolean {
  return EMBEDDED_SIGNUP_VOICE_BLOCKING_CODES.has(String(code || "").trim());
}
