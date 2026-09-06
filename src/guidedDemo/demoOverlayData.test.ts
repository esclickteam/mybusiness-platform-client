import { describe, expect, it } from "vitest";
import i18n from "../i18n/i18n";
import {
  DEMO_DASHBOARD_OVERLAY,
  getDemoActivityTimeline,
  getDemoAdvisorRecommendation,
  getDemoCollabPartners,
} from "./demoOverlayData";

describe("guided demo overlay data", () => {
  it("seeds a lived-in dashboard, not an empty business", () => {
    expect(DEMO_DASHBOARD_OVERLAY.website.totalViews).toBe(184);
    expect(DEMO_DASHBOARD_OVERLAY.website.uniqueVisitors).toBe(63);
    expect(DEMO_DASHBOARD_OVERLAY.leads.newCount).toBe(8);
    expect(DEMO_DASHBOARD_OVERLAY.leads.untreatedCount).toBe(3);
    expect(DEMO_DASHBOARD_OVERLAY.reviews.averageRating).toBe(4.8);
    expect(getDemoActivityTimeline().length).toBeGreaterThanOrEqual(4);
  });

  it("keeps collab and advisor examples in demo-only ids", () => {
    expect(getDemoCollabPartners().every((partner) => String(partner._id).startsWith("demo-partner-"))).toBe(
      true
    );
    expect(getDemoAdvisorRecommendation().title).toBe(
      i18n.t("leftover.demoOverlay.recTitle", "This week's recommendation")
    );
    expect(getDemoAdvisorRecommendation().question).toBe(
      i18n.t("leftover.demoOverlay.recQuestion", "Which leads should I follow up with today?")
    );
    expect(getDemoAdvisorRecommendation().actionLabel).toBe(
      i18n.t("leftover.demoOverlay.recAction", "Open the relevant lead list")
    );
    expect(getDemoAdvisorRecommendation().resultBody).toBe(
      i18n.t(
        "leftover.demoOverlay.recResultBody",
        "The list of 3 leads to follow up with today was opened. No real message was sent in the demo."
      )
    );
  });
});
