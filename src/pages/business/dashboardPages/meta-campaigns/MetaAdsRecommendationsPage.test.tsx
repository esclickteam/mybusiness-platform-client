import React from "react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import he from "../../../../i18n/locales/he.json";
import MetaAdsRecommendationsPage from "./MetaAdsRecommendationsPage";

const localeRef = { current: he as Record<string, unknown> };

function resolveKey(locale: unknown, key: string, opts?: Record<string, unknown>) {
  let value = key.split(".").reduce<unknown>(
    (acc, segment) =>
      acc && typeof acc === "object"
        ? (acc as Record<string, unknown>)[segment]
        : undefined,
    locale
  );
  if (typeof value !== "string") return key;
  if (opts) {
    for (const [name, raw] of Object.entries(opts)) {
      value = value.replace(new RegExp(`{{${name}}}`, "g"), String(raw));
    }
  }
  return value;
}

vi.mock("react-i18next", () => ({
  initReactI18next: { type: "3rdParty", init: () => undefined },
  useTranslation: () => ({
    t: (key: string, opts?: Record<string, unknown>) =>
      resolveKey(localeRef.current, key, opts),
    i18n: { language: "he" },
  }),
}));

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>("react-router-dom");
  return { ...actual, useOutletContext: () => ({ businessId: "biz-1" }) };
});

const listAiCampaignRecommendations = vi.fn();
vi.mock("../../../../api/metaCampaignsApi", async () => {
  const actual = await vi.importActual<typeof import("../../../../api/metaCampaignsApi")>(
    "../../../../api/metaCampaignsApi"
  );
  return {
    ...actual,
    listAiCampaignRecommendations: (...args: unknown[]) =>
      listAiCampaignRecommendations(...args),
    viewAiCampaignRecommendation: vi.fn().mockResolvedValue({}),
    dismissAiCampaignRecommendation: vi.fn(),
    applyAiCampaignRecommendation: vi.fn(),
    undoAiCampaignRecommendation: vi.fn(),
  };
});

describe("MetaAdsRecommendationsPage", () => {
  beforeEach(() => {
    listAiCampaignRecommendations.mockImplementation((_: string, status?: string) =>
      Promise.resolve(
        status === "open"
          ? [
              {
                id: "rec-1",
                businessId: "biz-1",
                metaCampaignId: "120251636463900469",
                campaignName: "Invistimo RSVP",
                sourceRuleKeys: ["Phase5"],
                severity: "WARNING",
                title: "Phase5 Recommend CPL watch",
                finding: "CREATE_RECOMMENDATION CAMPAIGN 120251636463900469",
                explanation: "Deterministic TEST hygiene candidate",
                recommendedActionType: "CREATE_RECOMMENDATION",
                recommendedAction: "CREATE_RECOMMENDATION",
                requiresApproval: true,
                status: "OPEN",
                aiGenerated: false,
              },
            ]
          : []
      )
    );
  });

  it("shows localized customer copy instead of Phase5 / Meta IDs", async () => {
    render(
      <MemoryRouter>
        <MetaAdsRecommendationsPage />
      </MemoryRouter>
    );
    await waitFor(() =>
      expect(screen.getByText("עלות לליד דורשת תשומת לב")).toBeInTheDocument()
    );
    expect(screen.queryByText(/Phase5/i)).toBeNull();
    expect(screen.queryByText(/CREATE_RECOMMENDATION/)).toBeNull();
    expect(screen.queryByText(/120251636463900469/)).toBeNull();
    expect(screen.getByText("Invistimo RSVP")).toBeInTheDocument();
  });
});
