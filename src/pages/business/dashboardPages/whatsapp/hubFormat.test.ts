import {
  formatMessagingLimit,
  formatNameStatus,
  formatQualityRating,
  connectionReadyLabel,
} from "./hubFormat";

describe("whatsapp hubFormat", () => {
  it("maps quality ratings", () => {
    expect(formatQualityRating("GREEN")).toBe("High");
    expect(formatQualityRating("YELLOW")).toBe("Medium");
    expect(formatQualityRating("RED")).toBe("Low");
  });

  it("maps name status", () => {
    expect(formatNameStatus("APPROVED")).toBe("APPROVED");
    expect(formatNameStatus("PENDING_REVIEW")).toBe("PENDING");
    expect(formatNameStatus("DECLINED")).toBe("REJECTED");
    expect(formatNameStatus("AVAILABLE_WITHOUT_REVIEW")).toBe("APPROVED");
    expect(formatNameStatus("DECLINED")).toBe("REJECTED");
  });

  it("formats messaging limits", () => {
    expect(formatMessagingLimit("TIER_10K")).toBe("\u200E10,000 / 24h");
    expect(formatMessagingLimit("TIER_1000")).toBe("\u200E1,000 / 24h");
    expect(formatMessagingLimit("UNLIMITED")).toBe("Unlimited");
  });

  it("derives ready label", () => {
    expect(connectionReadyLabel(true, true, "ready").tone).toBe("ok");
    expect(connectionReadyLabel(false).tone).toBe("neutral");
  });
});
