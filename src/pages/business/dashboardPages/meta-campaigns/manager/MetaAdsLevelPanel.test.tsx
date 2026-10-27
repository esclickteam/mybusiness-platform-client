import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import he from "../../../../../i18n/locales/he.json";

const api = vi.hoisted(() => ({
  getMetaAdsManager: vi.fn(),
  listMetaChangeHistory: vi.fn(),
  setMetaAdSetStatus: vi.fn(),
  setMetaAdStatus: vi.fn(),
  deleteMetaObjects: vi.fn(),
}));

vi.mock("../../../../../api/metaCampaignsApi", () => api);
vi.mock("react-toastify", () => ({ toast: { success: vi.fn(), error: vi.fn() } }));
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string, options?: Record<string, unknown>) => {
      const value = key.split(".").reduce<unknown>((acc, segment) => {
        if (!acc || typeof acc !== "object") return undefined;
        return (acc as Record<string, unknown>)[segment];
      }, he);
      const text = typeof value === "string" ? value : key;
      return Object.entries(options || {}).reduce(
        (current, [name, replacement]) => current.replaceAll(`{{${name}}}`, String(replacement)),
        text
      );
    },
    i18n: { language: "he" },
  }),
  initReactI18next: { type: "3rdParty", init: () => undefined },
}));

import MetaAdsLevelPanel from "./MetaAdsLevelPanel";

describe("Meta ads level panel", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    api.getMetaAdsManager.mockResolvedValue({
      rows: [
        {
          id: "120257524330680405",
          name: "מודעת Evently",
          level: "ad",
          campaignId: "120257519669290405",
          status: "ACTIVE",
          configuredStatus: "ACTIVE",
          effectiveStatus: "ACTIVE",
          metrics: {
            spend: 336.31,
            leads: 10,
            results: 33,
            clicks: 40,
            impressions: 4715,
            reach: 2533,
            ctr: 0.85,
            cpc: 8.4,
            costPerLead: 33.63,
            roas: null,
            insightsAvailable: true,
          },
        },
      ],
      paging: { hasNext: false, after: "", limit: 25 },
      insightsSync: { ok: true, syncedAt: "2026-10-18T10:00:00.000Z" },
    });
  });

  it("searches, selects, and asks before changing a live ad", async () => {
    render(
      <MetaAdsLevelPanel
        businessId="biz-1"
        level="ad"
        currency="ILS"
        rangeQuery={{ datePreset: "last_30d" }}
        onEdit={() => undefined}
        onDuplicate={() => undefined}
        onOpenCampaign={() => undefined}
        onOpenAdSet={() => undefined}
      />
    );

    expect(await screen.findByText("מודעת Evently")).toBeTruthy();
    expect(screen.getByText("שם המודעה")).toBeTruthy();
    expect(screen.getByText("4,715")).toBeTruthy();
    fireEvent.change(screen.getByTestId("meta-manager-search"), { target: { value: "120257524330680405" } });
    await waitFor(() =>
      expect(api.getMetaAdsManager).toHaveBeenCalledWith(
        "biz-1",
        expect.objectContaining({ q: "120257524330680405", level: "ad" })
      )
    );

    fireEvent.click(screen.getByLabelText("מודעת Evently"));
    fireEvent.click(screen.getAllByRole("button", { name: "השהיה" }).at(-1)!);
    expect(screen.getByText("הפעולה משנה פרסום חי ב-Meta.")).toBeTruthy();
    expect(screen.getByText("הפעולה: השהיה. הפריטים: מודעת Evently.")).toBeTruthy();
    expect(api.setMetaAdStatus).not.toHaveBeenCalled();

    fireEvent.click(screen.getByTestId("meta-bulk-confirm"));
    await waitFor(() =>
      expect(api.setMetaAdStatus).toHaveBeenCalledWith("biz-1", "120257524330680405", "PAUSED", undefined)
    );
  });

  it("asks before deleting a live ad and only then calls Meta", async () => {
    api.deleteMetaObjects.mockResolvedValue({
      success: true,
      results: [{ id: "120257524330680405", ok: true, kind: "meta" }],
      deletedIds: ["120257524330680405"],
      failed: [],
    });
    render(
      <MetaAdsLevelPanel
        businessId="biz-1"
        level="ad"
        currency="ILS"
        rangeQuery={{ datePreset: "last_30d" }}
        onEdit={() => undefined}
        onDuplicate={() => undefined}
        onOpenCampaign={() => undefined}
        onOpenAdSet={() => undefined}
      />
    );

    fireEvent.click(await screen.findByTestId("meta-level-delete-120257524330680405"));
    expect(screen.getByTestId("meta-campaign-delete-name")).toHaveTextContent("האם ברצונך למחוק את המודעה?");
    expect(screen.getByTestId("meta-campaign-delete-message")).toHaveTextContent(
      "אם תמחק את המודעה הזו, לא תהיה לך אפשרות לשחזר אותה מאוחר יותר."
    );
    expect(api.deleteMetaObjects).not.toHaveBeenCalled();
    fireEvent.click(screen.getByTestId("meta-campaign-delete-confirm"));
    await waitFor(() =>
      expect(api.deleteMetaObjects).toHaveBeenCalledWith(
        "biz-1",
        [expect.objectContaining({ id: "120257524330680405", level: "ad" })],
        { confirm: true }
      )
    );
  });
});
