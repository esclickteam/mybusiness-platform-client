export type Hole = { top: number; left: number; width: number; height: number };
export type HandDirection = "left" | "right" | "up" | "down";
export type DemoStepKind = "navigation" | "input" | "commit" | "acknowledge";
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

export function padHole(
  rect: Pick<DOMRect, "top" | "left" | "width" | "height">,
  vw = 1280,
  vh = 720,
  opts?: { maxWidth?: number; maxHeight?: number }
): Hole {
  const pad = 8;
  let width = Math.min(Math.max(rect.width + pad * 2, 28), vw - 16);
  let height = Math.min(Math.max(rect.height + pad * 2, 28), vh - 16);
  if (opts?.maxWidth) width = Math.min(width, opts.maxWidth);
  if (opts?.maxHeight) height = Math.min(height, opts.maxHeight);
  return {
    top: rect.top - pad,
    left: rect.left - pad,
    width,
    height,
  };
}

export function holeOptionsForKind(kind: DemoStepKind): { maxWidth?: number; maxHeight?: number } | undefined {
  if (kind === "input" || kind === "commit") {
    return { maxWidth: 640, maxHeight: 220 };
  }
  return undefined;
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
  const matches = Array.from(document.querySelectorAll(`[data-demo-target="${selector}"]`));
  const visible = matches.filter((el) => {
    const rect = el.getBoundingClientRect();
    return rect.width > 2 && rect.height > 2;
  });
  const ranked = (visible.length ? visible : matches).sort((a, b) => {
    const ar = a.getBoundingClientRect();
    const br = b.getBoundingClientRect();
    return ar.width * ar.height - br.width * br.height;
  });
  if (ranked[0]) return ranked[0];
  if (selector === "website-editor-canvas") {
    return document.querySelector("[data-visual-template-canvas='true']");
  }
  if (selector === "website-headline") {
    return (
      document.querySelector("[data-visual-editable='true'] h1") ||
      document.querySelector("[data-visual-template-canvas='true'] h1")
    );
  }
  return null;
}

export function resolveStepKind(step: any): DemoStepKind {
  const kind = String(step?.kind || "");
  if (kind === "navigation" || kind === "input" || kind === "commit" || kind === "acknowledge") {
    return kind;
  }
  const ruleType = String(step?.completionRule?.type || "");
  const action = String(step?.action || "");
  if (ruleType === "input" || action === "input") return "input";
  if (ruleType === "event") {
    if (action === "select") return "input";
    return "commit";
  }
  if (ruleType === "click" || action === "click") return "navigation";
  return "acknowledge";
}

export function readDemoInputValue(el: Element | null): string {
  if (!el) return "";
  if (
    el instanceof HTMLInputElement ||
    el instanceof HTMLTextAreaElement ||
    el instanceof HTMLSelectElement
  ) {
    return String(el.value || "");
  }
  const inner = el.querySelector("input, textarea, select");
  if (inner) return readDemoInputValue(inner);
  return String((el as HTMLElement).innerText || "").trim();
}

export function inputValueSatisfied(
  rule: { minLength?: number; match?: Record<string, unknown> | null; numeric?: boolean } | null | undefined,
  value: string
) {
  const trimmed = String(value || "").trim();
  if (rule?.match && typeof rule.match === "object") {
    const expected =
      rule.match.value ??
      rule.match.status ??
      Object.values(rule.match)[0];
    if (expected != null && expected !== "") {
      return trimmed === String(expected);
    }
  }
  if (rule?.numeric) {
    const n = Number(trimmed);
    return trimmed.length > 0 && Number.isFinite(n) && n >= 0;
  }
  const minLength = Number(rule?.minLength ?? 1);
  return trimmed.length >= minLength;
}

export const INTRO_CATEGORIES = [
  { key: "dash", title: "דשבורד", hint: "מדדים ופעילות", icon: "dashboard" },
  { key: "crm", title: "CRM ולידים", hint: "פניות ומעקב", icon: "crm" },
  { key: "work", title: "משימות ופגישות", hint: "Follow-up ויומן", icon: "work" },
  { key: "auto", title: "אוטומציות", hint: "טריגרים ופעולות", icon: "auto" },
  { key: "growth", title: "כלים לצמיחה", hint: "שותפים ויועץ", icon: "growth" },
  { key: "web", title: "בניית אתר", hint: "תבניות ופרסום", icon: "web" },
];
