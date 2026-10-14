import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { dishesForCategory, guestFrame } from "./tableflowGuestLayout";

describe("TableFlow guest frame", () => {
  for (const width of [375, 768, 1024, 1366, 1440, 1920]) {
    it(`uses the window at ${width}px without a fixed menu column`, () => {
      const frame = guestFrame(width);
      expect(frame.pageScrollX).toBe(false);
      expect(frame.menuMaxWidth).toBe("none");
      if (width < 768) {
        expect(frame.menu).toBe("100%");
        expect(frame.orderBar).toBe("fixed");
      } else if (width < 1024) {
        expect(frame.hero).toBe("32%");
        expect(frame.menu).toBe("68%");
      } else {
        expect(frame.hero).toBe("35%");
        expect(frame.menu).toBe("65%");
      }
    });
  }

  it("does not cap the menu at 440px", () => {
    const css = readFileSync(new URL("./tableflowGuest.css", import.meta.url), "utf8");
    expect(css).not.toContain("440px");
    expect(css).toContain("35%");
    expect(css).toContain("minmax(0, 1fr)");
    expect(css).toContain("overflow-x: hidden");
    expect(css).toContain("@container tf (min-width: 1024px)");
  });

  it("keeps an uncategorized dish in one group", () => {
    const dishes = [
      { name: "Hummus", categoryId: "a" },
      { name: "Water" },
    ];
    expect(dishesForCategory(dishes, "a").map((dish) => dish.name)).toEqual(["Hummus"]);
    expect(dishesForCategory(dishes, "all")).toHaveLength(2);
  });
});
