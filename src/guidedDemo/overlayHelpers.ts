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
const CONTROL_SELECTOR = "input, textarea, select, button, [role='button'], [role='combobox']";
const ALLOW_LARGE_TARGETS = new Set(["website-editor-canvas", "website-headline", "collab-find-area"]);

export const DEMO_HEADER_OFFSET = 72;
export const DEMO_TOOLTIP_RESERVE = 240;

function clamp(n: number, min: number, max: number) {
  return Math.min(Math.max(n, min), max);
}

function isGiantContainer(
  rect: Pick<DOMRect, "width" | "height">,
  vw: number,
  vh: number
) {
  return rect.width > vw * 0.7 && rect.height > vh * 0.35;
}

export function padHole(
  rect: Pick<DOMRect, "top" | "left" | "width" | "height">,
  vw = 1280,
  vh = 720,
  opts?: { maxWidth?: number; maxHeight?: number }
): Hole {
  const pad = 8;
  const naturalW = Math.max(rect.width + pad * 2, 28);
  const naturalH = Math.max(rect.height + pad * 2, 28);
  let width = Math.min(naturalW, vw - 16);
  let height = Math.min(naturalH, vh - 16);
  if (isGiantContainer(rect, vw, vh)) {
    if (opts?.maxWidth) width = Math.min(width, opts.maxWidth);
    if (opts?.maxHeight) height = Math.min(height, opts.maxHeight);
  }
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

export function resetPageScroll() {
  if (typeof window === "undefined") return;
  window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
}

export function scrollTargetFullyVisible(el: Element, headerOffset = DEMO_HEADER_OFFSET) {
  if (typeof window === "undefined") return;
  try {
    el.scrollIntoView({ block: "nearest", inline: "nearest", behavior: "auto" });
  } catch {
    /* ignore */
  }
  const rect = el.getBoundingClientRect();
  const safeTop = headerOffset + 88;
  const safeBottom = window.innerHeight - DEMO_TOOLTIP_RESERVE;
  if (rect.height >= Math.max(48, safeBottom - safeTop)) {
    const y = window.scrollY + rect.top - safeTop;
    window.scrollTo({ top: Math.max(0, y), behavior: "smooth" });
    return;
  }
  if (rect.top < safeTop) {
    window.scrollBy({ top: rect.top - safeTop, behavior: "smooth" });
  } else if (rect.bottom > safeBottom) {
    window.scrollBy({ top: rect.bottom - safeBottom, behavior: "smooth" });
  }
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

function pickInnerControl(wrapper: Element): Element | null {
  const controls = Array.from(wrapper.querySelectorAll(CONTROL_SELECTOR));
  const usable = controls.filter((el) => {
    const rect = el.getBoundingClientRect();
    return rect.width >= 20 && rect.height >= 18;
  });
  if (!usable.length) return null;
  usable.sort((a, b) => {
    const ar = a.getBoundingClientRect();
    const br = b.getBoundingClientRect();
    return ar.width * ar.height - br.width * br.height;
  });
  return usable[0];
}

function scoreDemoCandidate(el: Element, kind: DemoStepKind | undefined, viewport: number) {
  const rect = el.getBoundingClientRect();
  const area = Math.max(0, rect.width * rect.height);
  if (rect.width < 8 || rect.height < 8) return Number.POSITIVE_INFINITY;
  const giant = area > viewport * 0.42;
  const isControl = el.matches(CONTROL_SELECTOR);
  let score = area;
  if (giant) score += 1e12;
  if (kind === "input" || kind === "commit" || kind === "navigation") {
    if (!isControl) score += 5e8;
    if (isControl && rect.height < 22 && rect.width < 22) score += 1e7;
  }
  return score;
}

export function findDemoTarget(selector?: string | null, kind?: DemoStepKind): Element | null {
  if (!selector) return null;
  const matches = Array.from(document.querySelectorAll(`[data-demo-target="${selector}"]`));
  const visible = matches.filter((el) => {
    const rect = el.getBoundingClientRect();
    if (rect.width <= 2 || rect.height <= 2) return false;
    if (typeof window === "undefined") return true;
    const style = window.getComputedStyle(el);
    if (style.visibility === "hidden" || style.display === "none") return false;
    if (Number(style.opacity) === 0) return false;
    return true;
  });
  const pool = visible.length ? visible : matches;
  const viewport =
    typeof window === "undefined" ? 1 : Math.max(1, window.innerWidth * window.innerHeight);
  const ranked = [...pool].sort(
    (a, b) => scoreDemoCandidate(a, kind, viewport) - scoreDemoCandidate(b, kind, viewport)
  );
  let best = ranked[0] || null;
  if (!best) {
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
  if ((kind === "input" || kind === "commit" || kind === "navigation") && !best.matches(CONTROL_SELECTOR)) {
    const inner = pickInnerControl(best);
    if (inner) best = inner;
  }
  if (kind === "acknowledge" && !ALLOW_LARGE_TARGETS.has(selector)) {
    const rect = best.getBoundingClientRect();
    if (rect.width * rect.height > viewport * 0.45) return null;
  }
  return best;
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
