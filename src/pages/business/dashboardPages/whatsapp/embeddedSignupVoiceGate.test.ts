import { shouldAbortEmbeddedSignupForVoiceError } from "./embeddedSignupVoiceGate";

describe("embeddedSignupVoiceGate", () => {
  it("aborts Embedded Signup when the business has no verification DID", () => {
    expect(shouldAbortEmbeddedSignupForVoiceError("VERIFICATION_DID_MISSING")).toBe(
      true
    );
  });

  it("does not abort Embedded Signup for other voice-session errors", () => {
    expect(shouldAbortEmbeddedSignupForVoiceError("VOICE_VERIFICATION_START_FAILED")).toBe(
      false
    );
    expect(shouldAbortEmbeddedSignupForVoiceError("")).toBe(false);
    expect(shouldAbortEmbeddedSignupForVoiceError(undefined)).toBe(false);
  });
});
