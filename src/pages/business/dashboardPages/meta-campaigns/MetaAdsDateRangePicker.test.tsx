import React from "react";
import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes, useSearchParams } from "react-router-dom";
import he from "../../../../i18n/locales/he.json";
import MetaAdsDateRangePicker from "./MetaAdsDateRangePicker";

const NOW = new Date("2026-10-19T10:00:00Z");

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

function Params() {
  const [params] = useSearchParams();
  return <div data-testid="params">{params.toString()}</div>;
}

function renderPicker(search = "") {
  return render(
    <MemoryRouter initialEntries={[`/campaigns${search}`]}>
      <Routes>
        <Route path="/campaigns" element={<><MetaAdsDateRangePicker now={NOW} /><Params /></>} />
      </Routes>
    </MemoryRouter>
  );
}

describe("Meta ads date picker", () => {
  it("opens, previews a Meta preset, and does not apply it until update", () => {
    renderPicker();
    fireEvent.click(screen.getByTestId("meta-date-picker-trigger"));
    expect(screen.getByTestId("meta-date-picker-panel")).toHaveAttribute("dir", "rtl");
    expect(screen.getByTestId("meta-date-day-2026-10-20")).toBeDisabled();
    expect(screen.getByTestId("meta-date-preset-rolling_7")).toBeChecked();
    expect(screen.getByTestId("meta-date-day-2026-10-19")).toBeTruthy();
    fireEvent.click(screen.getByTestId("meta-date-preset-last_7"));
    expect(screen.getByTestId("meta-date-since")).toHaveValue("2026-10-12");
    expect(screen.getByTestId("meta-date-until")).toHaveValue("2026-10-18");
    fireEvent.click(screen.getByTestId("meta-date-cancel"));
    expect(screen.queryByTestId("meta-date-picker-panel")).toBeNull();
    expect(screen.getByTestId("params")).toHaveTextContent("");
  });

  it("saves a custom range and a comparison only after update, and restores them from the URL", () => {
    renderPicker();
    fireEvent.click(screen.getByTestId("meta-date-picker-trigger"));
    fireEvent.click(screen.getByTestId("meta-date-preset-custom"));
    fireEvent.change(screen.getByTestId("meta-date-since"), { target: { value: "2026-10-01" } });
    fireEvent.change(screen.getByTestId("meta-date-until"), { target: { value: "2026-10-10" } });
    fireEvent.click(screen.getByTestId("meta-date-compare"));
    fireEvent.change(screen.getByTestId("meta-date-compare-mode"), { target: { value: "custom" } });
    fireEvent.change(screen.getByTestId("meta-date-compare-since"), { target: { value: "2026-09-01" } });
    fireEvent.change(screen.getByTestId("meta-date-compare-until"), { target: { value: "2026-09-10" } });
    fireEvent.click(screen.getByTestId("meta-date-update"));
    expect(screen.getByTestId("params").textContent).toContain("range=custom");
    expect(screen.getByTestId("params").textContent).toContain("since=2026-10-01");
    expect(screen.getByTestId("params").textContent).toContain("until=2026-10-10");
    expect(screen.getByTestId("params").textContent).toContain("compare=1");
    expect(screen.getByTestId("params").textContent).toContain("compareSince=2026-09-01");
    fireEvent.click(screen.getByTestId("meta-date-picker-trigger"));
    expect(screen.getByTestId("meta-date-preset-custom")).toBeChecked();
    expect(screen.getByTestId("meta-date-compare")).toBeChecked();
  });

  it("moves across months and shows 29 February in a leap year", () => {
    renderPicker();
    fireEvent.click(screen.getByTestId("meta-date-picker-trigger"));
    fireEvent.click(screen.getByTestId("meta-date-month-prev"));
    const years = screen.getAllByLabelText("year");
    fireEvent.change(years[years.length - 1], { target: { value: "2024" } });
    const months = screen.getAllByLabelText("month");
    fireEvent.change(months[months.length - 1], { target: { value: "2" } });
    expect(screen.getByTestId("meta-date-day-2024-02-29")).toBeTruthy();
  });

  it("closes on Escape without saving", () => {
    renderPicker("?range=today");
    fireEvent.click(screen.getByTestId("meta-date-picker-trigger"));
    fireEvent.click(screen.getByTestId("meta-date-preset-yesterday"));
    fireEvent.keyDown(window, { key: "Escape" });
    expect(screen.queryByTestId("meta-date-picker-panel")).toBeNull();
    expect(screen.getByTestId("params").textContent).toContain("range=today");
    expect(screen.getByTestId("params").textContent).not.toContain("yesterday");
  });
});
