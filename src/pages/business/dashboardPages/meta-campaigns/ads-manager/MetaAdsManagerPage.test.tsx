import React from "react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Outlet, Route, Routes } from "react-router-dom";
import fs from "node:fs";
import path from "node:path";

vi.mock("react-toastify", () => ({
  toast: { error: vi.fn(), success: vi.fn() },
}));

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string, opts?: Record<string, unknown>) => {
      let value = resolveKey(en, key);
      if (typeof value !== "string") return key;
      if (opts) {
        for (const [name, raw] of Object.entries(opts)) {
          value = value.replace(new RegExp(`{{${name}}}`, "g"), String(raw));
        }
      }
      return value;
    },
    i18n: { language: "en" },
  }),
  initReactI18next: { type: "3rdParty", init: () => undefined },
}));

vi.mock("../../../../../hooks/useLocaleDir", () => ({
  useLocaleDir: () => "ltr",
}));

vi.mock("../../../../../api/metaCampaignsApi", () => ({
  getMetaCampaignsStatus: vi.fn().mockResolvedValue({ connected: false }),
  getMetaCampaign: vi.fn().mockResolvedValue({ campaign: null }),
  listMetaLeadForms: vi.fn().mockResolvedValue({ forms: [] }),
  estimateMetaAudienceReach: vi.fn(),
  publishMetaCampaign: vi.fn(),
  retryMetaPublish: vi.fn(),
  syncMetaPublish: vi.fn(),
  updateMetaCampaign: vi.fn(),
  updateMetaAdSet: vi.fn(),
  updateMetaAd: vi.fn(),
  duplicateMetaCampaign: vi.fn(),
}));

import en from "../../../../../i18n/locales/en.json";
import MetaAdsManagerPage from "./MetaAdsManagerPage";

function resolveKey(locale: unknown, key: string) {
  return key.split(".").reduce<unknown>(
    (acc, segment) =>
      acc && typeof acc === "object"
        ? (acc as Record<string, unknown>)[segment]
        : undefined,
    locale
  );
}

function renderManager(state?: unknown) {
  return render(
    <MemoryRouter
      initialEntries={[
        {
          pathname: "/business/biz-1/dashboard/meta-campaigns/create",
          state,
        },
      ]}
    >
      <Routes>
        <Route
          path="/business/:businessId/dashboard/meta-campaigns"
          element={<Outlet context={{ businessId: "biz-1" }} />}
        >
          <Route path="create" element={<MetaAdsManagerPage />} />
          <Route path="edit/:campaignId" element={<MetaAdsManagerPage />} />
          <Route path="overview" element={<div>overview-page</div>} />
        </Route>
      </Routes>
    </MemoryRouter>
  );
}

describe("MetaAdsManagerPage manual create", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("still opens the objective chooser on /create without an AI proposal", () => {
    renderManager();
    expect(screen.getByText("Create new campaign")).toBeTruthy();
    expect(screen.getByText("Leads")).toBeTruthy();
    expect(screen.queryByDisplayValue("Facial — לידים")).toBeNull();
  });

  it("skips the chooser and hydrates the existing Ads Manager from an AI proposal", () => {
    renderManager({
      aiProposal: {
        destinationKey: "LEAD_FORM",
        proposal: {
          campaign: {
            name: "Facial — לידים",
            objectiveKey: "LEADS",
            metaObjective: "OUTCOME_LEADS",
          },
          adSet: {
            dailyBudget: { amount: 70, currency: "ILS" },
            locations: [{ kind: "city", name: "Haifa", country: "IL" }],
            audience: { ageMin: 25, ageMax: 45, gender: "all" },
            placements: { recommendation: "ADVANTAGE", surfaces: ["ADVANTAGE"] },
          },
          creative: {
            primaryText: "Leave details",
            headline: "Facial in Haifa",
            description: "Clinic",
            ctaKey: "SIGN_UP",
            media: { status: "MISSING" },
          },
          leadForm: { mode: "DRAFT" },
          graphSafe: { objective: "OUTCOME_LEADS", cta: "SIGN_UP" },
        },
      },
    });
    expect(screen.queryByText("Create new campaign")).toBeNull();
    expect(screen.getAllByDisplayValue("Facial — לידים").length).toBeGreaterThan(0);
  });

  it("does not import AI session APIs", () => {
    const source = fs.readFileSync(
      path.resolve(__dirname, "./MetaAdsManagerPage.tsx"),
      "utf8"
    );
    expect(source).not.toMatch(/metaAiCampaignApi/);
    expect(source).not.toMatch(/generateAiCampaign/);
    expect(source).not.toMatch(/reviseAiCampaign/);
  });
});
