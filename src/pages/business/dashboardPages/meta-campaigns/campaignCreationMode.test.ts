import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";
import {
  isMetaCampaignsKnownChildPath,
  META_CAMPAIGNS_CREATE_AI_PATH,
  META_CAMPAIGNS_CREATE_PATH,
  metaCampaignsChildPath,
} from "./campaignCreationMode";

describe("campaignCreationMode helpers", () => {
  it("builds manual and AI child paths", () => {
    expect(
      metaCampaignsChildPath(
        "/business/biz-1/dashboard/meta-campaigns",
        META_CAMPAIGNS_CREATE_PATH
      )
    ).toBe("/business/biz-1/dashboard/meta-campaigns/create");
    expect(
      metaCampaignsChildPath(
        "/business/biz-1/dashboard/meta-campaigns/",
        META_CAMPAIGNS_CREATE_AI_PATH
      )
    ).toBe("/business/biz-1/dashboard/meta-campaigns/create-ai");
  });

  it("treats create-ai as a known Meta Campaigns child", () => {
    expect(isMetaCampaignsKnownChildPath("create")).toBe(true);
    expect(isMetaCampaignsKnownChildPath("create-ai")).toBe(true);
    expect(isMetaCampaignsKnownChildPath("overview")).toBe(true);
    expect(isMetaCampaignsKnownChildPath("settings")).toBe(true);
    expect(isMetaCampaignsKnownChildPath("rules")).toBe(false);
    expect(isMetaCampaignsKnownChildPath("goals")).toBe(true);
    expect(isMetaCampaignsKnownChildPath("recommendations")).toBe(true);
    expect(isMetaCampaignsKnownChildPath("portfolio")).toBe(true);
    expect(isMetaCampaignsKnownChildPath("copilot")).toBe(false);
    expect(isMetaCampaignsKnownChildPath("campaigns")).toBe(true);
    expect(isMetaCampaignsKnownChildPath("automations")).toBe(false);
    expect(isMetaCampaignsKnownChildPath("library")).toBe(true);
    expect(isMetaCampaignsKnownChildPath("mystery")).toBe(false);
  });
});

describe("BusinessDashboardRoutes wiring", () => {
  it("keeps /create on MetaAdsManagerPage and adds /create-ai", () => {
    const source = fs.readFileSync(
      path.resolve(__dirname, "../../BusinessDashboardRoutes.jsx"),
      "utf8"
    );

    expect(source).toMatch(
      /path="create"\s+element=\{<MetaAdsManagerPage/
    );
    expect(source).toMatch(
      /path="create-ai"\s+element=\{<MetaAiCampaignWizardPage/
    );
    expect(source).toMatch(
      /path="overview"\s+element=\{<MetaCampaignsOverviewTab/
    );
    expect(source).toMatch(
      /path="settings"\s+element=\{<MetaCampaignsSettingsTab/
    );
    expect(source).toMatch(
      /path="rules"\s+element=\{<Navigate to="overview"/
    );
    expect(source).toMatch(
      /path="automations"\s+element=\{<Navigate to="overview"/
    );
    expect(source).toMatch(
      /path="goals"\s+element=\{<MetaCampaignGoalsPage/
    );
    expect(source).toMatch(
      /path="recommendations"\s+element=\{<MetaAdsRecommendationsPage/
    );
    expect(source).toMatch(
      /path="health"\s+element=\{<Navigate to="recommendations"/
    );
    expect(source).toMatch(
      /path="portfolio"\s+element=\{<MetaPortfolioPage/
    );
    expect(source).toMatch(
      /path="copilot"\s+element=\{<Navigate to="overview"/
    );
    expect(source).toMatch(
      /path="campaigns"\s+element=\{<MetaCampaignsCampaignsPage/
    );
    expect(source).toMatch(
      /path="edit\/:campaignId"\s+element=\{<MetaCampaignEditorPage/
    );
    expect(source).not.toMatch(/MetaMediaLibraryTab/);
    expect(source).toMatch(/path="library"\s+element=\{<Navigate to="overview"/);
    const shell = fs.readFileSync(
      path.resolve(__dirname, "./MetaCampaignsMain.tsx"),
      "utf8"
    );
    expect(shell).not.toMatch(/path: "create"/);
    expect(shell).not.toMatch(/path: "library"/);
    expect(shell).not.toMatch(/path: "rules"/);
    expect(shell).not.toMatch(/path: "copilot"/);
    const goals = fs.readFileSync(
      path.resolve(__dirname, "./MetaCampaignGoalsPage.tsx"),
      "utf8"
    );
    const overview = fs.readFileSync(
      path.resolve(__dirname, "./MetaCampaignsOverviewTab.tsx"),
      "utf8"
    );
    const portfolio = fs.readFileSync(
      path.resolve(__dirname, "./MetaPortfolioPage.tsx"),
      "utf8"
    );
    const drawer = fs.readFileSync(
      path.resolve(__dirname, "./MetaCampaignDetailsDrawer.tsx"),
      "utf8"
    );
    const campaigns = fs.readFileSync(
      path.resolve(__dirname, "./MetaCampaignsCampaignsPage.tsx"),
      "utf8"
    );
    for (const file of [goals, overview, portfolio, drawer, campaigns]) {
      expect(file).not.toMatch(/\/copilot/);
      expect(file).not.toMatch(/askAi/);
    }
  });
});
