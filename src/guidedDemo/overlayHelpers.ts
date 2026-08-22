export type Hole = { top: number; left: number; width: number; height: number };
export type HandDirection = "left" | "right" | "up" | "down";
export type HandPos = {
  x: number;
  y: number;
  rotation: number;
  flip: boolean;
  dx: number;
  dy: number;
  direction: HandDirection;
};

const HAND_SIZE = 40;

function clamp(n: number, min: number, max: number) {
  return Math.min(Math.max(n, min), max);
}

export function padHole(rect: Pick<DOMRect, "top" | "left" | "width" | "height">, vw = 1280, vh = 720): Hole {
  const width = Math.min(rect.width + 14, Math.max(28, vw - 16));
  const height = Math.min(rect.height + 14, Math.max(28, vh - 16));
  return {
    top: clamp(rect.top - 7, 8, Math.max(8, vh - height - 8)),
    left: clamp(rect.left - 7, 8, Math.max(8, vw - width - 8)),
    width,
    height,
  };
}

/**
 * Place a pointing hand so it always aims INTO the highlighted element.
 * Direction is physical (viewport), so it stays correct in RTL.
 */
export function calcHand(hole: Hole, vw = 1280, vh = 720): HandPos {
  const cx = hole.left + hole.width / 2;
  const cy = hole.top + hole.height / 2;
  const spaceLeft = hole.left;
  const spaceRight = vw - (hole.left + hole.width);
  const spaceTop = hole.top;
  const spaceBottom = vh - (hole.top + hole.height);
  const preferHorizontal = Math.max(spaceLeft, spaceRight) >= Math.max(spaceTop, spaceBottom) - 8;

  let direction: HandDirection;
  if (preferHorizontal) {
    direction = spaceLeft >= spaceRight ? "right" : "left";
  } else {
    direction = spaceTop >= spaceBottom ? "down" : "up";
  }

  let x = 0;
  let y = 0;
  let rotation = 0;
  let flip = false;

  if (direction === "right") {
    x = hole.left - HAND_SIZE - 2;
    y = cy - HAND_SIZE / 2;
    rotation = 0;
    flip = false;
  } else if (direction === "left") {
    x = hole.left + hole.width + 2;
    y = cy - HAND_SIZE / 2;
    rotation = 0;
    flip = true;
  } else if (direction === "down") {
    x = cx - HAND_SIZE / 2;
    y = hole.top - HAND_SIZE - 2;
    rotation = 90;
    flip = false;
  } else {
    x = cx - HAND_SIZE / 2;
    y = hole.top + hole.height + 2;
    rotation = -90;
    flip = false;
  }

  x = clamp(x, 4, vw - HAND_SIZE - 4);
  y = clamp(y, 4, vh - HAND_SIZE - 4);

  const tipX = flip ? x : x + HAND_SIZE;
  const tipY = y + HAND_SIZE / 2;
  return {
    x,
    y,
    rotation,
    flip,
    dx: clamp(cx - tipX, -12, 12),
    dy: clamp(cy - tipY, -12, 12),
    direction,
  };
}

export function findDemoTarget(selector?: string | null): Element | null {
  if (!selector) return null;
  const byAttr = document.querySelector(`[data-demo-target="${selector}"]`);
  if (byAttr) return byAttr;
  if (selector === "website-editor-canvas") {
    return document.querySelector("[data-visual-template-canvas='true']");
  }
  if (selector === "website-headline") {
    return (
      document.querySelector("[data-demo-target='website-headline']") ||
      document.querySelector("[data-visual-editable='true'] h1") ||
      document.querySelector("[data-visual-template-canvas='true'] h1")
    );
  }
  return null;
}

export const INTRO_CATEGORIES = [
  { key: "ops", title: "ניהול העסק", hint: "דשבורד, מדדים ופעילות" },
  { key: "crm", title: "לידים ו־CRM", hint: "פניות, כרטיס לקוח ומעקב" },
  { key: "work", title: "משימות ופגישות", hint: "Follow-up ויומן" },
  { key: "auto", title: "אוטומציות", hint: "טריגרים ופעולות חכמות" },
  { key: "growth", title: "שיתופי פעולה וכלים עסקיים", hint: "שותפים והיועץ העסקי" },
  { key: "web", title: "בניית אתר", hint: "תבניות, עריכה ופרסום" },
];
