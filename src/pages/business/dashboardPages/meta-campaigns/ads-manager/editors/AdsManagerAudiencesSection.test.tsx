import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { I18nextProvider } from "react-i18next";
import i18n from "../../../../../../i18n/i18n";
import { createDefaultAdSet } from "../adsManagerDefaults";

const api = vi.hoisted(() => ({
  listMetaCustomAudiences: vi.fn(),
  listMetaSavedAudiences: vi.fn(),
  listMetaAdStudies: vi.fn(),
  createMetaAdStudy: vi.fn(),
  createMetaLookalikeAudience: vi.fn(),
  startMetaAdStudy: vi.fn(),
}));

vi.mock("../../../../../../api/metaCampaignsApi", () => api);

import AdsManagerAudiencesSection from "./AdsManagerAudiencesSection";

function renderSection() {
  return render(
    <I18nextProvider i18n={i18n}>
      <AdsManagerAudiencesSection
        adSet={createDefaultAdSet("Test")}
        businessId="biz-1"
        onChange={() => undefined}
      />
    </I18nextProvider>
  );
}

describe("AdsManagerAudiencesSection Ad Studies", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    api.listMetaCustomAudiences.mockResolvedValue({
      success: true,
      results: [{ id: "ca-1", name: "Buyers" }],
    });
    api.listMetaSavedAudiences.mockResolvedValue({ success: true, results: [] });
  });

  it("shows a clean unavailable state for Graph 2500 without dumping the error", async () => {
    api.listMetaAdStudies.mockRejectedValue({
      response: {
        status: 400,
        data: {
          error: "Unknown path components: /adstudies [code 2500] [fbtrace TRACE]",
          details: { code: 2500, fbtrace_id: "TRACE" },
        },
      },
      message: "Unknown path components: /adstudies",
    });
    renderSection();
    expect(await screen.findByTestId("meta-ab-studies-unavailable")).toBeTruthy();
    expect(screen.queryByText(/fbtrace/i)).toBeNull();
    expect(screen.queryByText(/#2500/)).toBeNull();
    expect((await screen.findAllByText("Buyers")).length).toBeGreaterThan(0);
  });

  it("treats available:false from the server as unavailable, not as an empty study list", async () => {
    api.listMetaAdStudies.mockResolvedValue({
      success: true,
      available: false,
      results: [],
    });
    renderSection();
    expect(await screen.findByTestId("meta-ab-studies-unavailable")).toBeTruthy();
    expect(screen.queryByText(/No Ad Studies returned/i)).toBeNull();
    expect((await screen.findAllByText("Buyers")).length).toBeGreaterThan(0);
  });

  it("still surfaces a real audience load failure", async () => {
    api.listMetaCustomAudiences.mockRejectedValue({
      message: "(#190) Error validating access token",
    });
    api.listMetaAdStudies.mockResolvedValue({
      success: true,
      available: true,
      results: [],
    });
    renderSection();
    await waitFor(() => {
      expect(screen.getByText(/access token/i)).toBeTruthy();
    });
  });
});
