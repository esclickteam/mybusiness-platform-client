import { measurementNotice, measurementNoticeLocales } from "./publicContentMeasurementNotice.mjs";
import { PUBLIC_CONTENT_ANALYTICS_RELEASED } from "./publicContentAnalyticsRelease.mjs";

const EVENTS = [
  "resource_view",
  "guide_view",
  "guide_product_click",
  "template_download",
  "calculator_use",
  "pricing_click",
  "content_signup",
];

describe("public content measurement notice", () => {
  it("keeps collection locked while the notice is only a proposal", () => {
    expect(PUBLIC_CONTENT_ANALYTICS_RELEASED).toBe(false);
  });

  it("states the same facts in all five languages without internal program labels", () => {
    for (const locale of measurementNoticeLocales()) {
      const copy = measurementNotice(locale);
      const text = JSON.stringify(copy);
      expect(copy.events.map((event) => event.id)).toEqual(EVENTS);
      expect(text).toMatch(/180/);
      expect(text).toContain("bizuply_measure");
      expect(text).toContain("bizuply_measure_hint");
      expect(text).not.toMatch(/\b(SEO|GEO|AEO)\b/);
      expect(text).not.toContain("תשובה למנועי AI");
    }
    expect(measurementNotice("he").leadOff).toContain("האיסוף כבוי");
    expect(measurementNotice("ar").deletion.length).toBeGreaterThan(40);
  });
});
