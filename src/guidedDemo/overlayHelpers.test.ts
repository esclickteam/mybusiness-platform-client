import { describe, expect, it } from "vitest";
import { calcHand, padHole, INTRO_CATEGORIES } from "./overlayHelpers";

describe("guided demo hand orientation", () => {
  it("points right into a target on the right side of the screen", () => {
    const hole = padHole({ top: 200, left: 980, width: 140, height: 48 }, 1280, 720);
    const hand = calcHand(hole, 1280, 720);
    expect(hand.direction).toBe("right");
    expect(hand.flip).toBe(false);
    expect(hand.x).toBeLessThan(hole.left);
  });

  it("points left into a target on the left side of the screen", () => {
    const hole = padHole({ top: 200, left: 24, width: 140, height: 48 }, 1280, 720);
    const hand = calcHand(hole, 1280, 720);
    expect(hand.direction).toBe("left");
    expect(hand.flip).toBe(true);
    expect(hand.x).toBeGreaterThan(hole.left);
  });

  it("points down into a target near the bottom", () => {
    const hole = padHole({ top: 620, left: 480, width: 220, height: 64 }, 1280, 720);
    const hand = calcHand(hole, 1280, 720);
    expect(hand.direction).toBe("down");
    expect(hand.y).toBeLessThan(hole.top);
  });

  it("points up into a target near the top", () => {
    const hole = padHole({ top: 16, left: 480, width: 220, height: 64 }, 1280, 720);
    const hand = calcHand(hole, 1280, 720);
    expect(hand.direction).toBe("up");
    expect(hand.y).toBeGreaterThan(hole.top);
  });
});

describe("guided demo intro categories", () => {
  it("shows a short visual set instead of a long checklist", () => {
    expect(INTRO_CATEGORIES).toHaveLength(6);
    expect(INTRO_CATEGORIES.map((item) => item.title)).toEqual([
      "ניהול העסק",
      "לידים ו־CRM",
      "משימות ופגישות",
      "אוטומציות",
      "שיתופי פעולה וכלים עסקיים",
      "בניית אתר",
    ]);
  });
});
