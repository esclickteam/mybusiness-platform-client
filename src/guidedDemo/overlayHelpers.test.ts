import { describe, expect, it } from "vitest";
import {
  calcHand,
  padHole,
  INTRO_CATEGORIES,
  resolveStepKind,
  inputValueSatisfied,
  holeOptionsForKind,
  findDemoTarget,
  resolveTemplateEditorPath,
  isWebsiteEditorPath,
  isWebsiteEditorStayStep,
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
      "פגישות ויומן",
      "אוטומציות",
      "כלים לצמיחה",
      "בניית אתר",
    ]);
    expect(INTRO_CATEGORIES.map((item) => item.title)).not.toContain("עמוד עסקי");
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

  it("caps a tall partner card so the tooltip still has room", () => {
    const hole = padHole(
      { top: 160, left: 720, width: 380, height: 560 },
      1280,
      720,
      holeOptionsForKind("acknowledge", "collab-partner-card")
    );
    expect(hole.height).toBeLessThanOrEqual(200);
    expect(hole.width).toBeLessThanOrEqual(560);
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

  it("does not clip a normal input field to half its size", () => {
    const hole = padHole(
      { top: 200, left: 40, width: 720, height: 44 },
      1280,
      720,
      holeOptionsForKind("input")
    );
    expect(hole.width).toBeGreaterThanOrEqual(720);
    expect(hole.height).toBeGreaterThanOrEqual(44);
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
    expect(inputValueSatisfied({ minLength: 2, requireChange: true }, "Hello", "Hello")).toBe(false);
    expect(inputValueSatisfied({ minLength: 2, requireChange: true }, "Hello there", "Hello")).toBe(true);
  });

  it("prefers the actual form control over a large wrapper", () => {
    document.body.innerHTML = `
      <section data-demo-target="crm-activity-text" class="wrap">
        <textarea data-demo-target="crm-activity-text"></textarea>
      </section>
    `;
    const wrap = document.querySelector("section") as HTMLElement;
    const field = document.querySelector("textarea") as HTMLElement;
    wrap.getBoundingClientRect = () =>
      ({ top: 80, left: 40, width: 900, height: 280, right: 940, bottom: 360, x: 40, y: 80, toJSON() {} }) as DOMRect;
    field.getBoundingClientRect = () =>
      ({ top: 120, left: 48, width: 420, height: 80, right: 468, bottom: 200, x: 48, y: 120, toJSON() {} }) as DOMRect;
    expect(findDemoTarget("crm-activity-text", "input")).toBe(field);
  });

  it("prefers the visual editor publish button over other publish controls", () => {
    document.body.innerHTML = `
      <button data-demo-target="website-publish" id="studio-publish">פרסום</button>
      <div data-template-visual-editor="true">
        <button data-demo-target="website-publish" id="visual-publish">פרסום</button>
      </div>
    `;
    const visual = document.getElementById("visual-publish") as HTMLElement;
    const studio = document.getElementById("studio-publish") as HTMLElement;
    visual.getBoundingClientRect = () =>
      ({ top: 12, left: 24, width: 88, height: 40, right: 112, bottom: 52, x: 24, y: 12, toJSON() {} }) as DOMRect;
    studio.getBoundingClientRect = () =>
      ({ top: 12, left: 200, width: 88, height: 40, right: 288, bottom: 52, x: 200, y: 12, toJSON() {} }) as DOMRect;
    expect(findDemoTarget("website-publish", "navigation")).toBe(visual);
  });
});

describe("resolveTemplateEditorPath", () => {
  it("turns a preview URL into the same-template editor path", () => {
    expect(
      resolveTemplateEditorPath(
        "/business/biz1/dashboard/website/templates/ido/preview",
        "biz1"
      )
    ).toBe("/business/biz1/dashboard/website/templates/ido/edit");
  });

  it("uses the selected template key when the path is not a preview", () => {
    expect(
      resolveTemplateEditorPath("/business/biz1/dashboard/website/templates", "biz1", "aeline")
    ).toBe("/business/biz1/dashboard/website/templates/aeline/edit");
  });
});

describe("website editor stay", () => {
  it("detects template and site editor paths", () => {
    expect(isWebsiteEditorPath("/business/biz1/dashboard/website/templates/ido/edit")).toBe(true);
    expect(isWebsiteEditorPath("/business/biz1/dashboard/website/sites/abc/edit")).toBe(true);
    expect(isWebsiteEditorPath("/business/biz1/dashboard/website/templates")).toBe(false);
    expect(isWebsiteEditorPath("/business/biz1/dashboard/website")).toBe(false);
  });

  it("keeps the editor steps on the editor", () => {
    expect(isWebsiteEditorStayStep({ id: "site-editor-open" })).toBe(true);
    expect(isWebsiteEditorStayStep({ id: "site-headline" })).toBe(true);
    expect(isWebsiteEditorStayStep({ id: "site-publish" })).toBe(true);
    expect(isWebsiteEditorStayStep({ id: "site-demo-card" })).toBe(false);
    expect(isWebsiteEditorStayStep({ id: "site-choose-template", keepEditor: true })).toBe(true);
  });
});
