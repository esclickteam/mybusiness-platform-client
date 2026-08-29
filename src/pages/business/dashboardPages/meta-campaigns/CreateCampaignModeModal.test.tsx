import React from "react";
import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom";
import he from "../../../../i18n/locales/he.json";
import en from "../../../../i18n/locales/en.json";

const localeRef = { current: he as Record<string, unknown> };

function resolveKey(locale: unknown, key: string): string {
  const value = key.split(".").reduce<unknown>(
    (acc, segment) =>
      acc && typeof acc === "object"
        ? (acc as Record<string, unknown>)[segment]
        : undefined,
    locale
  );
  return typeof value === "string" ? value : key;
}

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => resolveKey(localeRef.current, key),
    i18n: { language: "he" },
  }),
}));

vi.mock("../../../../hooks/useLocaleDir", () => ({
  useLocaleDir: () => "rtl",
}));

import CreateCampaignModeModal from "./CreateCampaignModeModal";
import CreateCampaignButton from "./CreateCampaignButton";

const BASE = "/business/biz-1/dashboard/meta-campaigns";

function LocationProbe() {
  const location = useLocation();
  return <div data-testid="location">{location.pathname}</div>;
}

function renderAt(path: string, ui: React.ReactNode) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <LocationProbe />
      <Routes>
        <Route
          path="/business/:businessId/dashboard/meta-campaigns/overview"
          element={<>{ui}</>}
        />
        <Route
          path="/business/:businessId/dashboard/meta-campaigns/create"
          element={<div>manual-create-page</div>}
        />
        <Route
          path="/business/:businessId/dashboard/meta-campaigns/create-ai"
          element={<div>ai-create-page</div>}
        />
      </Routes>
    </MemoryRouter>
  );
}

describe("CreateCampaignModeModal", () => {
  it("does not render when closed", () => {
    renderAt(
      `${BASE}/overview`,
      <CreateCampaignModeModal open={false} basePath={BASE} onClose={() => undefined} />
    );
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(screen.getByTestId("location").textContent).toBe(`${BASE}/overview`);
  });

  it("navigates to /create from the manual CTA", () => {
    renderAt(
      `${BASE}/overview`,
      <CreateCampaignModeModal open basePath={BASE} onClose={() => undefined} />
    );

    fireEvent.click(screen.getByRole("button", { name: /יצירה ידנית/ }));
    expect(screen.getByText("manual-create-page")).toBeTruthy();
    expect(screen.getByTestId("location").textContent).toBe(`${BASE}/create`);
  });

  it("navigates to /create-ai from the AI CTA", () => {
    renderAt(
      `${BASE}/overview`,
      <CreateCampaignModeModal open basePath={BASE} onClose={() => undefined} />
    );

    fireEvent.click(screen.getByRole("button", { name: /צור עם AI/ }));
    expect(screen.getByText("ai-create-page")).toBeTruthy();
    expect(screen.getByTestId("location").textContent).toBe(`${BASE}/create-ai`);
  });

  it("keeps the current route when the modal is closed", () => {
    const onClose = vi.fn();
    renderAt(
      `${BASE}/overview`,
      <CreateCampaignModeModal open basePath={BASE} onClose={onClose} />
    );

    fireEvent.click(screen.getByRole("button", { name: he.metaCampaigns.creationMode.close }));
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(screen.getByTestId("location").textContent).toBe(`${BASE}/overview`);
    expect(screen.queryByText("manual-create-page")).toBeNull();
    expect(screen.queryByText("ai-create-page")).toBeNull();
  });

  it("exposes EN copy for both first-class options", () => {
    localeRef.current = en as Record<string, unknown>;
    renderAt(
      `${BASE}/overview`,
      <CreateCampaignModeModal open basePath={BASE} onClose={() => undefined} />
    );

    expect(screen.getByText(en.metaCampaigns.creationMode.manual.title)).toBeTruthy();
    expect(screen.getByText(en.metaCampaigns.creationMode.ai.title)).toBeTruthy();
    expect(screen.getByText(en.metaCampaigns.creationMode.manual.cta)).toBeTruthy();
    expect(screen.getByText(en.metaCampaigns.creationMode.ai.cta)).toBeTruthy();
    localeRef.current = he as Record<string, unknown>;
  });
});

describe("CreateCampaignButton", () => {
  it("opens the chooser without changing the route", () => {
    renderAt(`${BASE}/overview`, <CreateCampaignButton basePath={BASE} />);

    expect(screen.queryByRole("dialog")).toBeNull();
    fireEvent.click(screen.getByTestId("create-campaign-entry"));
    expect(screen.getByRole("dialog")).toBeTruthy();
    expect(screen.getByText(he.metaCampaigns.creationMode.title)).toBeTruthy();
    expect(screen.getByTestId("location").textContent).toBe(`${BASE}/overview`);
  });

  it("does not auto-select manual or AI when opened", () => {
    renderAt(`${BASE}/overview`, <CreateCampaignButton basePath={BASE} />);
    fireEvent.click(screen.getByTestId("create-campaign-entry"));

    expect(screen.getByTestId("location").textContent).toBe(`${BASE}/overview`);
    expect(screen.getByRole("button", { name: /יצירה ידנית/ })).toBeTruthy();
    expect(screen.getByRole("button", { name: /צור עם AI/ })).toBeTruthy();
  });
});
