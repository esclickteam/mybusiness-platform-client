import { describe, expect, it } from "vitest";
import { campaignComparison } from "./campaignSwitch";

const winter = { id: "winter" as const, leads: 86, cost: 21.9 };
const site = { id: "site" as const, leads: 120, cost: 16.4 };

describe("campaignComparison", () => {
  it("matches the approved website-leads comparison", () => {
    expect(campaignComparison(site, winter)).toEqual({ leadGap: 40, costGap: 25 });
  });

  it("reverses the comparison for the winter offer", () => {
    expect(campaignComparison(winter, site)).toEqual({ leadGap: -28, costGap: -34 });
  });
});
