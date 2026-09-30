import React from "react";
import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>("react-router-dom");
  return { ...actual, useOutletContext: () => ({ businessId: "biz-1" }) };
});

const askMarketingCopilot = vi.fn().mockResolvedValue({
  answer: "There isn't enough data yet to answer this reliably.",
  supportingFacts: [{ text: "4 campaigns were reviewed for Last 7 days (default), and each has 0 spend and 0 results." }],
  suggestedActions: [
    {
      label: "Review creative",
      recommendationId: "rec-safe-1",
      handoff: { allowed: true, recommendationId: "rec-safe-1", confirmRequired: true },
    },
  ],
  confidence: "low",
  insufficientData: true,
  sources: ["4 campaigns", "Last 7 days (default)", "Meta Insights"],
  sessionId: "sess-1",
});

vi.mock("../../../../api/metaCampaignsApi", () => ({
  askMarketingCopilot: (...args: unknown[]) => askMarketingCopilot(...args),
  listAiCampaignRecommendations: vi.fn().mockResolvedValue([]),
  getMetaCampaignHealth: vi.fn().mockResolvedValue(null),
  getCampaignGoalDashboard: vi.fn().mockResolvedValue(null),
  generateAiCampaignRecommendations: vi.fn(),
  applyAiCampaignRecommendation: vi.fn(),
  undoAiCampaignRecommendation: vi.fn(),
  dismissAiCampaignRecommendation: vi.fn(),
  viewAiCampaignRecommendation: vi.fn().mockResolvedValue({}),
}));

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
  initReactI18next: { type: "3rdParty", init: () => {} },
}));

import MetaMarketingCopilotPage from "./MetaMarketingCopilotPage";

describe("MetaMarketingCopilotPage", () => {
  it("does not call AI on load and hands review action to the existing recommendation panel", async () => {
    render(<MetaMarketingCopilotPage />);
    expect(screen.getByTestId("marketing-copilot-page")).toBeTruthy();
    expect(askMarketingCopilot).not.toHaveBeenCalled();
    fireEvent.change(screen.getByTestId("copilot-question"), {
      target: { value: "What needs my attention today?" },
    });
    fireEvent.click(screen.getByTestId("copilot-ask"));
    expect(await screen.findByTestId("copilot-insufficient")).toBeTruthy();
    expect(screen.getByTestId("copilot-based-on").textContent).toMatch(/Last 7 days/);
    fireEvent.click(screen.getByTestId("copilot-review-action"));
    await waitFor(() => {
      expect(screen.getByTestId("copilot-handoff")).toBeTruthy();
      expect(screen.getByTestId("campaign-health-panel")).toBeTruthy();
    });
  });
});
