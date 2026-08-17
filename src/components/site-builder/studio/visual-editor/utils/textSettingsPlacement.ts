export const TEXT_SETTINGS_PANEL_WIDTH = 320;
export const TEXT_SETTINGS_PANEL_GAP = 20;
export const TEXT_SETTINGS_VIEWPORT_PAD = 12;

export type TextSettingsPlacementSide = "right" | "left" | "below" | "above";

export type TextSettingsPlacement = {
  top: number;
  left: number;
  side: TextSettingsPlacementSide;
};

type RectLike = {
  top: number;
  left: number;
  right: number;
  bottom: number;
  width: number;
  height: number;
};

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(min, value), Math.max(min, max));
}

export function isElementInViewport(
  rect: RectLike,
  viewport: { width: number; height: number },
) {
  return (
    rect.bottom > 0 &&
    rect.top < viewport.height &&
    rect.right > 0 &&
    rect.left < viewport.width &&
    rect.width > 0 &&
    rect.height > 0
  );
}

export function clampPanelToViewport(
  position: { top: number; left: number },
  panel: { width: number; height: number },
  viewport: { width: number; height: number },
  pad = TEXT_SETTINGS_VIEWPORT_PAD,
) {
  const maxLeft = Math.max(pad, viewport.width - panel.width - pad);
  const maxTop = Math.max(pad, viewport.height - panel.height - pad);
  return {
    top: clamp(position.top, pad, maxTop),
    left: clamp(position.left, pad, maxLeft),
  };
}

export function placeTextSettingsPanel(input: {
  element: RectLike;
  panel: { width: number; height: number };
  viewport: { width: number; height: number };
  gap?: number;
  pad?: number;
}): TextSettingsPlacement {
  const gap = input.gap ?? TEXT_SETTINGS_PANEL_GAP;
  const pad = input.pad ?? TEXT_SETTINGS_VIEWPORT_PAD;
  const { element, panel, viewport } = input;

  const spaceRight = viewport.width - element.right - pad;
  const spaceLeft = element.left - pad;
  const spaceBelow = viewport.height - element.bottom - pad;
  const spaceAbove = element.top - pad;

  let side: TextSettingsPlacementSide = "right";
  let left = element.right + gap;
  let top = element.top;

  if (spaceRight >= panel.width + gap) {
    side = "right";
    left = element.right + gap;
    top = element.top;
  } else if (spaceLeft >= panel.width + gap) {
    side = "left";
    left = element.left - gap - panel.width;
    top = element.top;
  } else if (spaceBelow >= Math.min(panel.height, 240) + gap) {
    side = "below";
    left = element.left;
    top = element.bottom + gap;
  } else if (spaceAbove >= Math.min(panel.height, 240) + gap) {
    side = "above";
    left = element.left;
    top = element.top - gap - panel.height;
  } else {
    const ranked: Array<{ side: TextSettingsPlacementSide; space: number }> = [
      { side: "right", space: spaceRight },
      { side: "left", space: spaceLeft },
      { side: "below", space: spaceBelow },
      { side: "above", space: spaceAbove },
    ].sort((a, b) => b.space - a.space);
    side = ranked[0]?.side || "right";
    if (side === "right") {
      left = element.right + gap;
      top = element.top;
    } else if (side === "left") {
      left = element.left - gap - panel.width;
      top = element.top;
    } else if (side === "below") {
      left = element.left;
      top = element.bottom + gap;
    } else {
      left = element.left;
      top = element.top - gap - panel.height;
    }
  }

  const clamped = clampPanelToViewport(
    { top, left },
    panel,
    viewport,
    pad,
  );

  return {
    top: clamped.top,
    left: clamped.left,
    side,
  };
}
