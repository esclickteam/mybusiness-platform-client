import { describe, expect, it } from "vitest";
import {
  deliveryFailureDetail,
  deliveryStatusLabel,
  formatWhatsAppPhoneDisplay,
  isOutboundSupportBubble,
  splitMessageSegments,
  supportConnectionBadge,
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

  it("maps managed connection ids to US/IL badges", () => {
    expect(supportConnectionBadge({ managedConnectionId: "US_MANAGED" })).toBe(
      "US"
    );
    expect(
      supportConnectionBadge({
        managedConnectionId: "IL_MANAGED",
        connectionCountry: "IL",
      })
    ).toBe("IL");
  });

  it("filters US connection to WhatsApp US only (hides web/bot)", () => {
    const rows = [
      { channel: "whatsapp", managedConnectionId: "US_MANAGED", phone: "258" },
      { channel: "whatsapp", managedConnectionId: "IL_MANAGED", phone: "972" },
      { channel: "web", managedConnectionId: "", phone: "" },
    ];
    const filter = "US_MANAGED";
    const visible = rows.filter((c) => {
      if (c.channel !== "whatsapp") return false;
      return String(c.managedConnectionId || "").toUpperCase() === filter;
    });
    expect(visible).toHaveLength(1);
    expect(visible[0].phone).toBe("258");
  });

  it("labels delivery statuses without fabricating delivered/read", () => {
    expect(deliveryStatusLabel("sent")).toBe("נשלח");
    expect(deliveryStatusLabel("")).toBe("");
    expect(deliveryStatusLabel("failed")).toBe("נכשל");
  });

  it("surfaces Meta failure detail for admins", () => {
    expect(
      deliveryFailureDetail({
        _id: "1",
        deliveryStatus: "failed",
        metadata: {
          error: "Re-engagement message — code 131047 — fbtrace abc",
        },
      })
    ).toContain("Re-engagement message");
    expect(
      deliveryFailureDetail({
        _id: "2",
        deliveryStatus: "failed",
        metadata: { graphCode: 131047, fbtraceId: "xyz" },
      })
    ).toBe("code 131047 — fbtrace xyz");
  });
});
