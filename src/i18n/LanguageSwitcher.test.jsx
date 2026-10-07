import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import LanguageSwitcher from "../components/LanguageSwitcher";
import i18n from "./i18n";
import { MANUAL_LANG_FLAG } from "./localeUtils";

vi.mock("../api", () => ({
  default: { patch: vi.fn(() => Promise.resolve({ data: {} })) },
}));

describe("LanguageSwitcher", () => {
  beforeEach(async () => {
    localStorage.clear();
    document.cookie.split(";").forEach((cookie) => {
      const name = cookie.split("=")[0].trim();
      if (name) document.cookie = `${name}=; Path=/; Max-Age=0`;
    });
    await i18n.changeLanguage("en");
    document.documentElement.lang = "en";
    document.documentElement.dir = "ltr";
  });

  it("shows the compact current-language control and all five options", async () => {
    render(<LanguageSwitcher />);
    expect(screen.getByText("EN")).toBeTruthy();
    fireEvent.click(screen.getByLabelText(/change language/i));
    expect(screen.getByText("English")).toBeTruthy();
    expect(screen.getByText("עברית")).toBeTruthy();
    expect(screen.getByText("Español")).toBeTruthy();
    expect(screen.getByText("Português (Brasil)")).toBeTruthy();
    expect(screen.getByText("العربية")).toBeTruthy();
  });

  it("applies Hebrew RTL immediately and persists the choice", async () => {
    render(<LanguageSwitcher />);
    fireEvent.click(screen.getByLabelText(/change language/i));
    fireEvent.click(screen.getByText("עברית"));
    await waitFor(() => {
      expect(document.documentElement.lang).toBe("he");
      expect(document.documentElement.dir).toBe("rtl");
      expect(localStorage.getItem(MANUAL_LANG_FLAG)).toBe("he");
    });
  });

  it.each([
    ["overflowing the right edge", 261, 501, -119],
    ["overflowing the left edge", -90, 150, 98],
  ])("keeps the whole menu inside a 390px viewport when %s", (_label, left, right, shift) => {
    const originalWidth = window.innerWidth;
    Object.defineProperty(document.documentElement, "clientWidth", { configurable: true, value: 390 });
    const rectSpy = vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(function rect() {
      return this.getAttribute("role") === "listbox"
        ? { left, right, top: 60, bottom: 400, width: right - left, height: 340, x: left, y: 60, toJSON: () => ({}) }
        : { left: 0, right: 0, top: 0, bottom: 0, width: 0, height: 0, x: 0, y: 0, toJSON: () => ({}) };
    });
    try {
      render(<LanguageSwitcher />);
      fireEvent.click(screen.getByLabelText(/change language/i));
      const menu = screen.getByRole("listbox");
      expect(menu.style.translate).toBe(`${shift}px 0`);
      expect(menu.className).toContain("max-w-[calc(100vw-1rem)]");
      expect(menu.className).not.toContain("inset-inline");
      for (const option of ["English", "עברית", "Español", "Português (Brasil)", "العربية"]) {
        expect(screen.getByRole("option", { name: new RegExp(option.replace(/[()]/g, "\\$&")) })).toBeTruthy();
      }
    } finally {
      rectSpy.mockRestore();
      delete document.documentElement.clientWidth;
      Object.defineProperty(window, "innerWidth", { configurable: true, value: originalWidth });
    }
  });

  it("leaves a menu that already fits untouched", () => {
    Object.defineProperty(document.documentElement, "clientWidth", { configurable: true, value: 1440 });
    const rectSpy = vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockReturnValue(
      { left: 1100, right: 1340, top: 60, bottom: 400, width: 240, height: 340, x: 1100, y: 60, toJSON: () => ({}) },
    );
    try {
      render(<LanguageSwitcher />);
      fireEvent.click(screen.getByLabelText(/change language/i));
      expect(screen.getByRole("listbox").style.translate).toBe("");
    } finally {
      rectSpy.mockRestore();
      delete document.documentElement.clientWidth;
    }
  });

  it("applies Arabic RTL immediately", async () => {
    render(<LanguageSwitcher />);
    fireEvent.click(screen.getByLabelText(/change language/i));
    fireEvent.click(screen.getByText("العربية"));
    await waitFor(() => {
      expect(document.documentElement.lang).toBe("ar");
      expect(document.documentElement.dir).toBe("rtl");
      expect(localStorage.getItem(MANUAL_LANG_FLAG)).toBe("ar");
    });
  });
});
