import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import he from "../../../../../i18n/locales/he.json";

const api = vi.hoisted(() => ({
  getMetaLeadgenTos: vi.fn(),
}));

vi.mock("../../../../../api/metaCampaignsApi", () => api);

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string, options?: Record<string, unknown>) => {
      const value = key.split(".").reduce<unknown>((acc, segment) => {
        if (!acc || typeof acc !== "object") return undefined;
        return (acc as Record<string, unknown>)[segment];
      }, he);
      const text = typeof value === "string" ? value : key;
      return Object.entries(options || {}).reduce(
        (current, [name, replacement]) =>
          current.replaceAll(`{{${name}}}`, String(replacement)),
        text
      );
    },
    i18n: { language: "he" },
  }),
  initReactI18next: { type: "3rdParty", init: () => undefined },
}));

import LeadgenTosCard from "./LeadgenTosCard";

describe("LeadgenTosCard", () => {
  beforeEach(() => {
    api.getMetaLeadgenTos.mockReset();
  });

  it("links to Meta's official terms page for the selected page and does not mark acceptance locally", async () => {
    api.getMetaLeadgenTos.mockResolvedValue({
      success: true,
      pageId: "111",
      accepted: false,
      verified: false,
      status: "required",
      tosUrl: "https://www.facebook.com/ads/leadgen/tos?page_id=111",
    });

    render(
      <LeadgenTosCard businessId="biz-1" pageId="111" pageName="Evently360" />
    );

    const link = await screen.findByTestId("leadgen-tos-link");
    expect(link.getAttribute("href")).toBe(
      "https://www.facebook.com/ads/leadgen/tos?page_id=111"
    );
    expect(link.getAttribute("target")).toBe("_blank");
    expect(screen.getByText("אישור תנאי השירות של מודעות לידים")).toBeTruthy();
    expect(screen.getByText(/Evently360/)).toBeTruthy();
    expect(screen.getByTestId("leadgen-tos-card").getAttribute("data-status")).toBe(
      "required"
    );

    fireEvent.click(link);
    expect(screen.getByTestId("leadgen-tos-card").getAttribute("data-status")).toBe(
      "required"
    );
    expect(screen.queryByText(/Meta אישרה/)).toBeNull();
  });

  it("shows acceptance only after Meta verifies that page", async () => {
    api.getMetaLeadgenTos.mockResolvedValue({
      success: true,
      pageId: "111",
      accepted: true,
      verified: true,
      status: "accepted",
      tosUrl: "https://www.facebook.com/ads/leadgen/tos?page_id=111",
    });

    render(
      <LeadgenTosCard businessId="biz-1" pageId="111" pageName="Evently360" />
    );

    expect(await screen.findByText(/Meta אישרה את תנאי השירות/)).toBeTruthy();
    expect(screen.queryByTestId("leadgen-tos-link")).toBeNull();
    expect(screen.getByTestId("leadgen-tos-card").getAttribute("data-status")).toBe(
      "accepted"
    );
  });

  it("explains a missing Meta permission without treating it as acceptance", async () => {
    api.getMetaLeadgenTos.mockResolvedValue({
      success: true,
      pageId: "111",
      accepted: false,
      verified: false,
      status: "missing_permission",
      tosUrl: "https://www.facebook.com/ads/leadgen/tos?page_id=111",
    });

    render(<LeadgenTosCard businessId="biz-1" pageId="111" pageName="Evently360" />);

    expect(await screen.findByText(/pages_manage_ads/)).toBeTruthy();
    expect(screen.getByTestId("leadgen-tos-link").getAttribute("href")).toContain(
      "page_id=111"
    );
    expect(screen.getByTestId("leadgen-tos-card").getAttribute("data-status")).not.toBe(
      "accepted"
    );
  });

  it("checks the newly selected page instead of reusing another page's acceptance", async () => {
    api.getMetaLeadgenTos.mockImplementation(async (_businessId: string, pageId: string) => ({
      success: true,
      pageId,
      accepted: pageId === "111",
      verified: pageId === "111",
      status: pageId === "111" ? "accepted" : "required",
      tosUrl: `https://www.facebook.com/ads/leadgen/tos?page_id=${pageId}`,
    }));

    const { rerender } = render(
      <LeadgenTosCard businessId="biz-1" pageId="111" pageName="Evently360" />
    );
    expect(await screen.findByText(/Meta אישרה/)).toBeTruthy();

    rerender(
      <LeadgenTosCard businessId="biz-1" pageId="222" pageName="Invistimo RSVP" />
    );

    await waitFor(() => {
      expect(screen.getByTestId("leadgen-tos-card").getAttribute("data-page-id")).toBe(
        "222"
      );
      expect(screen.getByTestId("leadgen-tos-card").getAttribute("data-status")).toBe(
        "required"
      );
    });
    expect(screen.getByTestId("leadgen-tos-link").getAttribute("href")).toContain(
      "page_id=222"
    );
    expect(api.getMetaLeadgenTos).toHaveBeenCalledWith("biz-1", "222");
  });

  it("rechecks when the user returns to the page", async () => {
    api.getMetaLeadgenTos
      .mockResolvedValueOnce({
        success: true,
        pageId: "111",
        accepted: false,
        verified: false,
        status: "required",
        tosUrl: "https://www.facebook.com/ads/leadgen/tos?page_id=111",
      })
      .mockResolvedValue({
        success: true,
        pageId: "111",
        accepted: true,
        verified: true,
        status: "accepted",
        tosUrl: "https://www.facebook.com/ads/leadgen/tos?page_id=111",
      });

    render(<LeadgenTosCard businessId="biz-1" pageId="111" pageName="Evently360" />);
    expect(await screen.findByTestId("leadgen-tos-link")).toBeTruthy();

    window.dispatchEvent(new Event("focus"));

    await waitFor(() => {
      expect(screen.getByTestId("leadgen-tos-card").getAttribute("data-status")).toBe(
        "accepted"
      );
    });
    expect(api.getMetaLeadgenTos.mock.calls.length).toBeGreaterThan(1);
  });
});
