import { describe, expect, it } from "vitest";
import {
  DEMO_ACTIVITY_TIMELINE,
  DEMO_ADVISOR_RECOMMENDATION,
  DEMO_COLLAB_PARTNERS,
  DEMO_DASHBOARD_OVERLAY,
} from "./demoOverlayData";

describe("guided demo overlay data", () => {
  it("seeds a lived-in dashboard, not an empty business", () => {
    expect(DEMO_DASHBOARD_OVERLAY.website.totalViews).toBe(184);
    expect(DEMO_DASHBOARD_OVERLAY.website.uniqueVisitors).toBe(63);
    expect(DEMO_DASHBOARD_OVERLAY.leads.newCount).toBe(8);
    expect(DEMO_DASHBOARD_OVERLAY.leads.untreatedCount).toBe(3);
    expect(DEMO_DASHBOARD_OVERLAY.reviews.averageRating).toBe(4.8);
    expect(DEMO_ACTIVITY_TIMELINE.length).toBeGreaterThanOrEqual(4);
  });

  it("keeps collab and advisor examples in demo-only ids", () => {
    expect(DEMO_COLLAB_PARTNERS.every((partner) => String(partner._id).startsWith("demo-partner-"))).toBe(
      true
    );
    expect(DEMO_ADVISOR_RECOMMENDATION.title).toBe("המלצה השבוע");
  });
});
