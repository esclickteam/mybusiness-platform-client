import { describe, expect, it } from "vitest";

import {
  filterHomepageDemoStoryLeads,
  homepageDemoLeadLanguage,
  isHomepageDemoBusiness,
} from "./dashboardOverviewUtils";

const marked = {
  testData: true,
  tags: ["homepage-demo"],
  externalLeadId: "demo-lead-shira-mizrahi",
};

describe("homepage demo story list", () => {
  it("keeps the filter on the isolated demo business", () => {
    expect(isHomepageDemoBusiness("6ab62f565ba1a92f3046b5ad")).toBe(true);
    expect(isHomepageDemoBusiness("6ab62f565ba1a92f3046b5ae")).toBe(false);
  });

  it("splits Hebrew and English story rows and leaves other leads out", () => {
    const leads = [
      { ...marked, name: "שירה מזרחי", phone: "+972505550101", externalLeadId: "demo-lead-shira-mizrahi" },
      { ...marked, name: "נועה לוי", phone: "+972505550102", externalLeadId: "demo-lead-noa-levy" },
      { ...marked, name: "Olivia Parker", phone: "+12125550101", externalLeadId: "demo-lead-olivia-parker" },
      { ...marked, name: "Emma Collins", phone: "+12125550104", externalLeadId: "demo-lead-emma-collins" },
      { name: "שירה מזרחי", phone: "0525551917", source: "make", testData: false, tags: [], externalLeadId: "" },
      { name: "Miles Carter", phone: "0525552215", source: "make", testData: false, tags: [], externalLeadId: "" },
    ];

    expect(homepageDemoLeadLanguage(leads[0])).toBe("he");
    expect(homepageDemoLeadLanguage(leads[2])).toBe("en");
    expect(homepageDemoLeadLanguage(leads[4])).toBe("");
    expect(filterHomepageDemoStoryLeads(leads, "he").map((lead) => lead.name)).toEqual(["שירה מזרחי", "נועה לוי"]);
    expect(filterHomepageDemoStoryLeads(leads, "en").map((lead) => lead.name)).toEqual(["Olivia Parker", "Emma Collins"]);
  });
});
