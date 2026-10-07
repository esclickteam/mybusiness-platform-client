import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import MenuSelect from "./MenuSelect";

const LANGUAGES = [
  { value: "en", label: "English" },
  { value: "he", label: "עברית" },
  { value: "es", label: "Español" },
  { value: "pt-BR", label: "Português (Brasil)" },
  { value: "ar", label: "العربية" },
];

const originalWidth = window.innerWidth;

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  Object.defineProperty(window, "innerWidth", { configurable: true, value: originalWidth });
});

function openAt(buttonLeft: number, buttonRight: number, dir: "ltr" | "rtl") {
  Object.defineProperty(window, "innerWidth", { configurable: true, value: 390 });
  vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockReturnValue({
    left: buttonLeft, right: buttonRight, top: 10, bottom: 46, width: buttonRight - buttonLeft, height: 36,
    x: buttonLeft, y: 10, toJSON: () => ({}),
  } as DOMRect);
  render(
    <div dir={dir} style={{ direction: dir }}>
      <MenuSelect value="he" options={LANGUAGES} onChange={() => undefined} ariaLabel="Change language" fit />
    </div>
  );
  fireEvent.click(screen.getByRole("combobox", { name: "Change language" }));
  return screen.getByRole("listbox");
}

describe("MenuSelect on a 390px screen", () => {
  it.each([
    ["a trigger at the right edge", 330, 382, "ltr"],
    ["a trigger at the left edge in RTL", 8, 60, "rtl"],
  ] as const)("keeps every option of the menu inside the viewport for %s", (_label, left, right, dir) => {
    const menu = openAt(left, right, dir);
    const menuLeft = parseFloat(menu.style.left);
    const menuWidth = parseFloat(menu.style.width);
    expect(menuLeft).toBeGreaterThanOrEqual(8);
    expect(menuLeft + menuWidth).toBeLessThanOrEqual(390 - 8);
    expect(screen.getAllByRole("option")).toHaveLength(LANGUAGES.length);
  });
});
