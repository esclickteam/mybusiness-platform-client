import { describe, expect, it } from "vitest";
import { rewriteDashboardTargetForBusiness } from "./notificationNavigation";

describe("AI campaign notification navigation", () => {
  it("keeps campaignId and recommendationId when rewriting the business path", () => {
    const target =
      "/business/biz-other/dashboard/meta-campaigns/overview?campaignId=120&recommendationId=rec-1";
    expect(rewriteDashboardTargetForBusiness(target, "biz-1")).toBe(
      "/business/biz-1/dashboard/meta-campaigns/overview?campaignId=120&recommendationId=rec-1"
    );
  });
});
