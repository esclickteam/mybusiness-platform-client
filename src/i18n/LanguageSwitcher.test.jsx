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
    expect(screen.getByRole("listbox").parentElement).toBe(document.body);
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
    // right-aligned to trigger (501-240=261) then clamped: 390-8-240=142
    ["overflowing the right edge", 261, 501, 142],
    // right-aligned would be -90; clamped up to the 8px viewport margin
    ["overflowing the left edge", -90, 150, 8],
  ])("keeps the whole fixed menu inside a 390px viewport when %s", (_label, left, right, expectedLeft) => {
    Object.defineProperty(document.documentElement, "clientWidth", { configurable: true, value: 390 });
    Object.defineProperty(document.documentElement, "clientHeight", { configurable: true, value: 844 });
    Object.defineProperty(window, "innerWidth", { configurable: true, value: 390 });
    Object.defineProperty(window, "innerHeight", { configurable: true, value: 844 });
    const rectSpy = vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(function rect() {
      if (this.getAttribute("role") === "listbox") {
        return { left: 0, right: 240, top: 60, bottom: 400, width: 240, height: 340, x: 0, y: 60, toJSON: () => ({}) };
      }
      if (this.getAttribute("aria-haspopup") === "listbox") {
        return { left, right, top: 12, bottom: 52, width: right - left, height: 40, x: left, y: 12, toJSON: () => ({}) };
      }
      return { left: 0, right: 0, top: 0, bottom: 0, width: 0, height: 0, x: 0, y: 0, toJSON: () => ({}) };
    });
    try {
      render(<LanguageSwitcher />);
      fireEvent.click(screen.getByLabelText(/change language/i));
      const menu = screen.getByRole("listbox");
      expect(menu.style.position === "" || getComputedStyle(menu).position === "fixed" || menu.className.includes("fixed")).toBe(true);
      expect(menu.className).toContain("fixed");
      expect(menu.className).toContain("overflow-y-auto");
      expect(Number.parseFloat(menu.style.left)).toBe(expectedLeft);
      expect(Number.parseFloat(menu.style.maxHeight)).toBeGreaterThan(100);
      for (const option of ["English", "עברית", "Español", "Português (Brasil)", "العربية"]) {
        expect(screen.getByRole("option", { name: new RegExp(option.replace(/[()]/g, "\\$&")) })).toBeTruthy();
      }
    } finally {
      rectSpy.mockRestore();
      delete document.documentElement.clientWidth;
      delete document.documentElement.clientHeight;
    }
  });

  it("leaves a menu that already fits aligned to the trigger", () => {
    Object.defineProperty(document.documentElement, "clientWidth", { configurable: true, value: 1440 });
    Object.defineProperty(document.documentElement, "clientHeight", { configurable: true, value: 900 });
    Object.defineProperty(window, "innerWidth", { configurable: true, value: 1440 });
    Object.defineProperty(window, "innerHeight", { configurable: true, value: 900 });
    const rectSpy = vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(function rect() {
      if (this.getAttribute("aria-haspopup") === "listbox") {
        return { left: 1100, right: 1340, top: 20, bottom: 60, width: 240, height: 40, x: 1100, y: 20, toJSON: () => ({}) };
      }
      return { left: 0, right: 0, top: 0, bottom: 0, width: 0, height: 0, x: 0, y: 0, toJSON: () => ({}) };
    });
    try {
      render(<LanguageSwitcher />);
      fireEvent.click(screen.getByLabelText(/change language/i));
      const menu = screen.getByRole("listbox");
      expect(menu.style.left).toBe("1100px");
      expect(menu.style.top).toBe("68px");
    } finally {
      rectSpy.mockRestore();
      delete document.documentElement.clientWidth;
      delete document.documentElement.clientHeight;
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
