export const EMBEDDED_SIGNUP_VOICE_BLOCKING_CODES = new Set([
  "VERIFICATION_DID_MISSING",
]);

export function voiceVerificationErrorCode(error: unknown): string {
  const err = error as {
    code?: string;
    response?: { data?: { code?: string } };
  } | null;
  return String(err?.response?.data?.code || err?.code || "").trim();
}

export function shouldAbortEmbeddedSignupForVoiceError(
  code?: string | null
): boolean {
  return EMBEDDED_SIGNUP_VOICE_BLOCKING_CODES.has(String(code || "").trim());
}
