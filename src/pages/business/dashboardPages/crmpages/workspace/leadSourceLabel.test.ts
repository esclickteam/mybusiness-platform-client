import { describe, expect, it } from "vitest";
import { leadSourceLabel } from "./leadSourceLabel";

describe("lead source display", () => {
  it("shows Meta for make, meta_lead_ads and facebook_lead_ads", () => {
    expect(leadSourceLabel({ source: "make" })).toBe("Meta");
    expect(leadSourceLabel({ source: "Make" })).toBe("Meta");
    expect(leadSourceLabel({ source: "meta_lead_ads" })).toBe("Meta");
    expect(leadSourceLabel({ source: "facebook_lead_ads" })).toBe("Meta");
  });

  it("shows Meta for a Make lead even when it has no Meta evidence", () => {
    expect(leadSourceLabel({ source: "make" })).toBe("Meta");
  });

  it("leaves other stored sources unchanged and does not invent a label", () => {
    expect(leadSourceLabel({ source: "website" })).toBe("website");
    expect(leadSourceLabel({ source: "whatsapp" })).toBe("whatsapp");
    expect(leadSourceLabel({ source: "manual" })).toBe("manual");
    expect(leadSourceLabel({ source: "google_ads" })).toBe("google_ads");
    expect(leadSourceLabel({ source: "" })).toBe("");
    expect(leadSourceLabel({})).toBe("");
  });
});
