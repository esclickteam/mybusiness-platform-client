import { describe, expect, it } from "vitest";
import {
  buildTelnyxOutboundInvite,
  isE164,
  normalizeDialNumber,
  outboundUpdateFromTelnyxState,
  telnyxLegIsOngoing,
} from "./softphoneDial";

describe("normalizeDialNumber", () => {
  it("converts the Bizuply NANP number 2109444809 to E.164", () => {
    expect(normalizeDialNumber("2109444809")).toBe("+12109444809");
    expect(isE164(normalizeDialNumber("2109444809"))).toBe(true);
  });

  it("keeps an existing +1 number and other explicit countries", () => {
    expect(normalizeDialNumber("+1 (210) 944-4809")).toBe("+12109444809");
    expect(normalizeDialNumber("12109444809")).toBe("+12109444809");
    expect(normalizeDialNumber("+972501234567")).toBe("+972501234567");
    expect(normalizeDialNumber("+447911123456")).toBe("+447911123456");
  });

  it("does not invent an Israeli prefix for a local 0 number", () => {
    expect(normalizeDialNumber("0501234567")).toBe("");
  });
});

describe("buildTelnyxOutboundInvite", () => {
  it("sends 2109444809 to Telnyx as E.164 +12109444809", () => {
    const built = buildTelnyxOutboundInvite("2109444809", "+12109444809");
    expect(built.ok).toBe(true);
    if (!built.ok) return;
    expect(built.invite).toEqual({
      destinationNumber: "+12109444809",
      callerNumber: "+12109444809",
      audio: true,
      video: false,
    });
  });
});

describe("outboundUpdateFromTelnyxState", () => {
  it("treats trying and ringing as remote progress, not a connected call", () => {
    expect(outboundUpdateFromTelnyxState("trying")?.status).toBe("ringing");
    expect(outboundUpdateFromTelnyxState("ringing")?.terminal).toBe(false);
    expect(outboundUpdateFromTelnyxState("active", "", false)?.status).toBe(
      "in-progress"
    );
  });

  it("surfaces a hangup before answer as a visible failure", () => {
    const update = outboundUpdateFromTelnyxState("hangup", "call_rejected", false);
    expect(update?.terminal).toBe(true);
    expect(update?.status).toBe("failed");
    expect(update?.error).toBeTruthy();
  });

  it("does not treat a finished new-state leg as an ongoing call", () => {
    expect(telnyxLegIsOngoing("new")).toBe(false);
    expect(telnyxLegIsOngoing("hangup")).toBe(false);
    expect(telnyxLegIsOngoing("ringing")).toBe(true);
    expect(telnyxLegIsOngoing("active")).toBe(true);
  });
});
