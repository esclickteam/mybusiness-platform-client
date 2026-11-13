import { describe, expect, it } from "vitest";
import { leadCameFromMetaViaMake, leadSourceLabel } from "./leadSourceLabel";

describe("lead source display", () => {
  it("shows Meta for a stored meta_lead_ads source", () => {
    expect(leadSourceLabel({ source: "meta_lead_ads" })).toBe("Meta");
  });

  it("shows Meta for a Make lead that carries Facebook lead-ad evidence", () => {
    expect(leadCameFromMetaViaMake({
      source: "make",
      provider: "facebook_lead_ads",
      facebook: { formId: "form-1", pageId: "page-1" },
    })).toBe(true);
    expect(leadSourceLabel({
      source: "make",
      provider: "facebook_lead_ads",
      facebook: { leadId: "lead-1" },
    })).toBe("Meta");
    expect(leadSourceLabel({
      source: "Make",
      facebook: { campaignName: "Thursday shoot" },
    })).toBe("Meta");
  });

  it("keeps an unidentified Make lead unchanged", () => {
    expect(leadCameFromMetaViaMake({ source: "make", provider: "manual" })).toBe(false);
    expect(leadSourceLabel({ source: "make" })).toBe("make");
    expect(leadSourceLabel({ source: "make", provider: "other", facebook: {} })).toBe("make");
  });

  it("leaves other stored sources unchanged", () => {
    expect(leadSourceLabel({ source: "website" })).toBe("website");
    expect(leadSourceLabel({ source: "whatsapp" })).toBe("whatsapp");
    expect(leadSourceLabel({ source: "manual" })).toBe("manual");
    expect(leadSourceLabel({ source: "google_ads" })).toBe("google_ads");
    expect(leadSourceLabel({ source: "" })).toBe("");
  });
});
