import { describe, expect, it } from "vitest";
import {
  deliveryStatusLabel,
  formatWhatsAppPhoneDisplay,
  isOutboundSupportBubble,
  splitMessageSegments,
} from "./adminSupportChatDisplay";

describe("admin support chat display", () => {
  it("places bubbles by direction, not RTL text", () => {
    expect(
      isOutboundSupportBubble({
        _id: "1",
        senderType: "visitor",
        direction: "outbound",
        text: "היי דניאל",
      })
    ).toBe(true);
    expect(
      isOutboundSupportBubble({
        _id: "2",
        senderType: "agent",
        direction: "inbound",
        text: "reply",
      })
    ).toBe(false);
  });

  it("keeps urls and phones as LTR segments", () => {
    const parts = splitMessageSegments(
      "היי דניאל\nhttps://bizuply.com/demo/abc123\n0501234567"
    );
    expect(parts.some((p) => p.type === "url" && p.value.includes("/demo/"))).toBe(
      true
    );
    expect(parts.some((p) => p.type === "phone" && p.value.includes("050"))).toBe(
      true
    );
  });

  it("formats israeli whatsapp digits for display", () => {
    expect(formatWhatsAppPhoneDisplay("972501234567")).toBe("0501234567");
  });

  it("labels delivery statuses without fabricating delivered/read", () => {
    expect(deliveryStatusLabel("sent")).toBe("נשלח");
    expect(deliveryStatusLabel("")).toBe("");
    expect(deliveryStatusLabel("failed")).toBe("נכשל");
  });
});
