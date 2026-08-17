import { describe, expect, it } from "vitest";

import {
  clampPanelToViewport,
  isElementInViewport,
  placeTextSettingsPanel,
} from "./textSettingsPlacement";

const panel = { width: 320, height: 480 };

describe("placeTextSettingsPanel", () => {
  it("opens to the right when there is room", () => {
    const placed = placeTextSettingsPanel({
      element: { top: 160, left: 120, right: 360, bottom: 220, width: 240, height: 60 },
      panel,
      viewport: { width: 1440, height: 900 },
    });
    expect(placed.side).toBe("right");
    expect(placed.left).toBe(380);
    expect(placed.top).toBe(160);
  });

  it("flips to the left when the right side is tight", () => {
    const placed = placeTextSettingsPanel({
      element: { top: 160, left: 980, right: 1320, bottom: 220, width: 340, height: 60 },
      panel,
      viewport: { width: 1400, height: 900 },
    });
    expect(placed.side).toBe("left");
    expect(placed.left).toBeLessThan(980);
  });

  it("opens below when both sides are tight", () => {
    const placed = placeTextSettingsPanel({
      element: { top: 80, left: 40, right: 1360, bottom: 160, width: 1320, height: 80 },
      panel,
      viewport: { width: 1400, height: 900 },
    });
    expect(placed.side).toBe("below");
    expect(placed.top).toBeGreaterThan(160);
  });

  it("opens above when only the top has room", () => {
    const placed = placeTextSettingsPanel({
      element: { top: 620, left: 40, right: 1360, bottom: 860, width: 1320, height: 240 },
      panel,
      viewport: { width: 1400, height: 900 },
    });
    expect(placed.side).toBe("above");
    expect(placed.top).toBeLessThan(620);
  });

  it("clamps into the viewport", () => {
    const placed = placeTextSettingsPanel({
      element: { top: 20, left: 20, right: 80, bottom: 60, width: 60, height: 40 },
      panel: { width: 320, height: 800 },
      viewport: { width: 390, height: 700 },
    });
    expect(placed.left).toBeGreaterThanOrEqual(12);
    expect(placed.top).toBeGreaterThanOrEqual(12);
    expect(placed.left + 320).toBeLessThanOrEqual(390);
    expect(placed.top).toBe(12);
    const clamped = clampPanelToViewport(placed, { width: 320, height: 800 }, { width: 390, height: 700 });
    expect(clamped.top).toBe(12);
    expect(clamped.left).toBeGreaterThanOrEqual(12);
  });

  it("treats offscreen elements as not in the viewport", () => {
    expect(
      isElementInViewport(
        { top: -80, left: 20, right: 80, bottom: -20, width: 60, height: 60 },
        { width: 1200, height: 800 },
      ),
    ).toBe(false);
  });
});
