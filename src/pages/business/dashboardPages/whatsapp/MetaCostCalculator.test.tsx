import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import i18n from "../../../../i18n/i18n";
import MetaCostCalculator from "./MetaCostCalculator";

describe("MetaCostCalculator", () => {
  beforeEach(async () => {
    vi.stubGlobal("fetch", vi.fn(async () => ({ ok: false })));
    await i18n.changeLanguage("en");
  });

  it("prices the official North America marketing list rate and keeps Bizuply separate", async () => {
    render(<MetaCostCalculator variant="public" />);
    expect(screen.getByRole("heading", { name: "Meta cost calculator" })).toBeTruthy();
    expect(screen.getAllByText("$25.00").length).toBeGreaterThan(0);
    expect(screen.getAllByText("$29.00").length).toBeGreaterThan(0);
    expect(screen.getByText(/Meta \+ Bizuply: \$54\.00/)).toBeTruthy();
    expect(screen.queryByText(/hidden fee/i)).toBeNull();
  });

  it("switches to the Hebrew labels with the site language", async () => {
    await i18n.changeLanguage("he");
    render(<MetaCostCalculator variant="public" />);
    expect(screen.getByRole("heading", { name: "מחשבון עלויות Meta" })).toBeTruthy();
    expect(screen.getByText("דמי הפלטפורמה של ביזאפלי")).toBeTruthy();
  });

  it("recalculates when the country and volume change", () => {
    render(<MetaCostCalculator variant="public" />);
    const country = screen.getAllByRole("combobox")[1] as HTMLSelectElement;
    fireEvent.change(country, { target: { value: "IL" } });
    expect(screen.getAllByText("$35.30").length).toBeGreaterThan(0);
    const quantity = screen.getByDisplayValue("1000") as HTMLInputElement;
    fireEvent.change(quantity, { target: { value: "2" } });
    expect(screen.getAllByText("$0.0706").length).toBeGreaterThan(0);
  });
});
