import React from "react";
import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>("react-router-dom");
  return { ...actual, useOutletContext: () => ({ businessId: "biz-1" }) };
});

vi.mock("../../../../api/metaCampaignsApi", () => ({
  listCampaignGoals: vi.fn().mockResolvedValue([]),
  draftCampaignGoal: vi.fn(),
  updateCampaignGoal: vi.fn(),
  activateCampaignGoal: vi.fn(),
  evaluateCampaignGoal: vi.fn(),
  getCampaignGoalHistory: vi.fn(),
}));

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

import MetaCampaignGoalsPage from "./MetaCampaignGoalsPage";

describe("MetaCampaignGoalsPage", () => {
  it("renders the goal wizard objectives", async () => {
    render(<MetaCampaignGoalsPage />);
    expect(await screen.findByTestId("campaign-goals-page")).toBeTruthy();
    expect(screen.getByText("metaCampaigns.goals.moreLeads")).toBeTruthy();
    expect(screen.getByText("metaCampaigns.goals.lowerCpl")).toBeTruthy();
    expect(screen.queryByText("metaCampaigns.goals.recommendOnly")).toBeNull();
  });
});
