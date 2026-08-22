import { describe, expect, it } from "vitest";
import { getAdminAnchoredPanelStyle } from "./adminResponsive";

function mockAnchor(rect: DOMRect) {
  return {
    getBoundingClientRect: () => rect,
  } as HTMLElement;
}

describe("getAdminAnchoredPanelStyle", () => {
  it("centers the panel under the bell and keeps it inside the viewport", () => {
    const anchor = mockAnchor({
      x: 24,
      y: 12,
      left: 24,
      top: 12,
      right: 68,
      bottom: 56,
      width: 44,
      height: 44,
      toJSON: () => ({}),
    });

    const style = getAdminAnchoredPanelStyle(anchor, { width: 390, height: 844 });

    expect(style.left).toBe(8);
    expect(style.right).toBe("auto");
    expect(style.width).toBe(374);
    expect(style.top).toBe(64);
    expect(style.visibility).toBe("visible");
  });

  it("clamps when the bell is near the right edge", () => {
    const anchor = mockAnchor({
      x: 340,
      y: 12,
      left: 340,
      top: 12,
      right: 384,
      bottom: 56,
      width: 44,
      height: 44,
      toJSON: () => ({}),
    });

    const style = getAdminAnchoredPanelStyle(anchor, { width: 390, height: 844 });

    expect(style.left).toBe(8);
    expect(style.width).toBe(374);
  });

  it("centers under the bell when there is room on both sides", () => {
    const anchor = mockAnchor({
      x: 500,
      y: 20,
      left: 500,
      top: 20,
      right: 548,
      bottom: 68,
      width: 48,
      height: 48,
      toJSON: () => ({}),
    });

    const style = getAdminAnchoredPanelStyle(anchor, { width: 1280, height: 900 });

    expect(style.left).toBe(334);
    expect(style.width).toBe(380);
    expect(style.top).toBe(76);
  });
});
