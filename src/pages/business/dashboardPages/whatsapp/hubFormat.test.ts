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
    expect(formatNameStatus("APPROVED")).toBe("Approved");
    expect(formatNameStatus("PENDING_REVIEW")).toBe("Pending");
    expect(formatNameStatus("DECLINED")).toBe("Rejected");
  });

  it("formats messaging limits", () => {
    expect(formatMessagingLimit("TIER_10K")).toMatch(/10/);
    expect(formatMessagingLimit("UNLIMITED")).toBe("Unlimited");
  });

  it("derives ready label", () => {
    expect(connectionReadyLabel(true, true, "ready").tone).toBe("ok");
    expect(connectionReadyLabel(false).tone).toBe("neutral");
  });
});
