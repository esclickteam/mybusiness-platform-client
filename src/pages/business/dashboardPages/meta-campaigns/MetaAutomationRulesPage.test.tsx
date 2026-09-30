import React from "react";
import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>("react-router-dom");
  return { ...actual, useOutletContext: () => ({ businessId: "biz-1" }) };
});

vi.mock("../../../../api/metaCampaignsApi", () => ({
  listAutomationRules: vi.fn().mockResolvedValue([]),
  saveAutomationRule: vi.fn(),
  deleteAutomationRule: vi.fn(),
  getAutomationRuleHistory: vi.fn(),
  testAutomationRule: vi.fn(),
  evaluateAutomationRule: vi.fn(),
}));

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

import MetaAutomationRulesPage from "./MetaAutomationRulesPage";

describe("MetaAutomationRulesPage", () => {
  it("renders the WHEN / IS / FOR / ONLY IF / THEN builder", async () => {
    render(<MetaAutomationRulesPage />);
    expect(await screen.findByTestId("automation-rules-page")).toBeTruthy();
    expect(screen.getByText("metaCampaigns.automationRules.when")).toBeTruthy();
    expect(screen.getByText("metaCampaigns.automationRules.is")).toBeTruthy();
    expect(screen.getByText("metaCampaigns.automationRules.for")).toBeTruthy();
    expect(screen.getByText("metaCampaigns.automationRules.onlyIf")).toBeTruthy();
    expect(screen.getByText("metaCampaigns.automationRules.then")).toBeTruthy();
  });
});
