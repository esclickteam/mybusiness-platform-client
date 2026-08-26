import {
  shouldAbortEmbeddedSignupForVoiceError,
  voiceVerificationErrorCode,
} from "./embeddedSignupVoiceGate";

describe("embeddedSignupVoiceGate", () => {
  it("reads interceptor-shaped error.code when response.data is stripped", () => {
    expect(
      voiceVerificationErrorCode({ code: "VERIFICATION_DID_MISSING" })
    ).toBe("VERIFICATION_DID_MISSING");
    expect(
      voiceVerificationErrorCode({
        response: { data: { code: "VERIFICATION_DID_MISSING" } },
      })
    ).toBe("VERIFICATION_DID_MISSING");
  });

  it("aborts Embedded Signup when the entered phone is missing", () => {
    expect(shouldAbortEmbeddedSignupForVoiceError("ENTERED_PHONE_REQUIRED")).toBe(
      true
    );
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
