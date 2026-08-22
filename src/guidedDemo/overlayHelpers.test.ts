import { describe, expect, it } from "vitest";
import {
  calcHand,
  padHole,
  INTRO_CATEGORIES,
  resolveStepKind,
  inputValueSatisfied,
  holeOptionsForKind,
} from "./overlayHelpers";

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
      "דשבורד",
      "CRM ולידים",
      "משימות ופגישות",
      "אוטומציות",
      "כלים לצמיחה",
      "בניית אתר",
    ]);
  });
});

describe("guided demo step kinds and holes", () => {
  it("keeps input holes on the actual field instead of ballooning a container", () => {
    const hole = padHole(
      { top: 120, left: 80, width: 180, height: 44 },
      1280,
      720,
      holeOptionsForKind("input")
    );
    expect(hole.width).toBeLessThanOrEqual(196);
    expect(hole.height).toBeLessThanOrEqual(60);
    expect(hole.top).toBe(112);
    expect(hole.left).toBe(72);
  });

  it("caps huge containers so the highlight does not swallow the page", () => {
    const hole = padHole(
      { top: 90, left: 24, width: 1100, height: 620 },
      1280,
      720,
      holeOptionsForKind("input")
    );
    expect(hole.width).toBeLessThanOrEqual(640);
    expect(hole.height).toBeLessThanOrEqual(220);
    expect(hole.top).toBe(82);
  });

  it("resolves navigation, input and commit without treating open as complete", () => {
    expect(resolveStepKind({ kind: "navigation", action: "click" })).toBe("navigation");
    expect(resolveStepKind({ completionRule: { type: "input" } })).toBe("input");
    expect(resolveStepKind({ kind: "commit", completionRule: { type: "event", event: "TASK_CREATED" } })).toBe(
      "commit"
    );
  });

  it("requires a real value before an input step is satisfied", () => {
    expect(inputValueSatisfied({ minLength: 3 }, "")).toBe(false);
    expect(inputValueSatisfied({ minLength: 3 }, "hi")).toBe(false);
    expect(inputValueSatisfied({ minLength: 3 }, "note")).toBe(true);
    expect(inputValueSatisfied({ match: { value: "task" } }, "note")).toBe(false);
    expect(inputValueSatisfied({ match: { value: "task" } }, "task")).toBe(true);
    expect(inputValueSatisfied({ numeric: true }, "abc")).toBe(false);
    expect(inputValueSatisfied({ numeric: true }, "90")).toBe(true);
  });
});
