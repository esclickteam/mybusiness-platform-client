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
