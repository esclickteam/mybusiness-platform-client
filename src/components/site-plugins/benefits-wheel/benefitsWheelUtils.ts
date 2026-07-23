export type BenefitsWheelSegment = {
  label: string;
  color?: string;
  couponCode?: string;
};

export type BenefitsWheelTriggerShape = "pill" | "rounded" | "circle";

export type BenefitsWheelSettings = {
  isActive?: boolean;
  title?: string;
  subtitle?: string;
  spinsPerUser?: number;
  segmentCount?: number;
  segments?: BenefitsWheelSegment[];
  autoOpenOnFirstVisit?: boolean;
  showTrigger?: boolean;
  triggerPosition?: { x: number; y: number };
  triggerLabel?: string;
  triggerColor?: string;
  triggerColorEnd?: string;
  triggerTextColor?: string;
  triggerShape?: BenefitsWheelTriggerShape;
};

export const WHEEL_COLORS = [
  "#7C3AED",
  "#0284C7",
  "#059669",
  "#F59E0B",
  "#EC4899",
  "#EF4444",
  "#8B5CF6",
  "#14B8A6",
  "#F97316",
  "#6366F1",
  "#CA8A04",
  "#0891B2",
];

export function normalizeSegments(
  segments: BenefitsWheelSegment[] | undefined,
  count: number
): BenefitsWheelSegment[] {
  const n = Math.min(12, Math.max(3, count || 6));
  const base = Array.isArray(segments) ? segments : [];
  return Array.from({ length: n }, (_, i) => ({
    label: String(base[i]?.label || `הטבה ${i + 1}`).trim() || `הטבה ${i + 1}`,
    color: base[i]?.color || WHEEL_COLORS[i % WHEEL_COLORS.length],
    couponCode: String(base[i]?.couponCode || "").trim(),
  }));
}

export function visitorStorageKey(siteId: string, suffix: string) {
  return `bizuply:benefits-wheel:${siteId}:${suffix}`;
}

export function readVisitorSpinCount(siteId: string) {
  try {
    return Number(localStorage.getItem(visitorStorageKey(siteId, "spins")) || 0);
  } catch {
    return 0;
  }
}

export function readVisitorSavedPrize(siteId: string) {
  try {
    const raw = localStorage.getItem(visitorStorageKey(siteId, "prize"));
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function writeVisitorSpin(
  siteId: string,
  prize: { label: string; index: number; couponCode?: string }
) {
  try {
    const count = readVisitorSpinCount(siteId) + 1;
    localStorage.setItem(visitorStorageKey(siteId, "spins"), String(count));
    localStorage.setItem(
      visitorStorageKey(siteId, "prize"),
      JSON.stringify({ ...prize, savedAt: new Date().toISOString() })
    );
    localStorage.setItem(visitorStorageKey(siteId, "seen"), "1");
  } catch {
    // ignore
  }
}

export function sessionAutoShownKey(siteId: string) {
  return `bizuply:benefits-wheel:${siteId}:session-auto`;
}

export function wasAutoShownThisSession(siteId: string) {
  try {
    return sessionStorage.getItem(sessionAutoShownKey(siteId)) === "1";
  } catch {
    return false;
  }
}

export function markAutoShownThisSession(siteId: string) {
  try {
    sessionStorage.setItem(sessionAutoShownKey(siteId), "1");
  } catch {
    // ignore
  }
}

/** Delta rotation (deg) from prev so pointer lands on segment index (pointer at top). */
export function rotationDeltaForSegment(
  prevRotation: number,
  index: number,
  segmentCount: number,
  extraSpins = 5
) {
  const slice = 360 / segmentCount;
  const mid = index * slice + slice / 2;
  const targetMod = (360 - mid + 360) % 360;
  const currentMod = ((prevRotation % 360) + 360) % 360;
  let align = (targetMod - currentMod + 360) % 360;
  if (align === 0) align = 360;
  return extraSpins * 360 + align;
}

export function pickWinningIndex(segmentCount: number, excludeIndex?: number | null) {
  if (segmentCount <= 1) return 0;
  if (excludeIndex == null || excludeIndex < 0 || excludeIndex >= segmentCount) {
    return Math.floor(Math.random() * segmentCount);
  }
  let idx = Math.floor(Math.random() * segmentCount);
  let guard = 0;
  while (idx === excludeIndex && guard < 12) {
    idx = Math.floor(Math.random() * segmentCount);
    guard += 1;
  }
  return idx;
}

/** @deprecated use rotationDeltaForSegment */
export function rotationForSegmentIndex(index: number, segmentCount: number, extraSpins = 5) {
  const slice = 360 / segmentCount;
  const segmentCenter = index * slice + slice / 2;
  return extraSpins * 360 + (360 - segmentCenter);
}

export function resolveTriggerPresentation(settings: BenefitsWheelSettings) {
  const shape = settings.triggerShape || "pill";
  const label =
    String(settings.triggerLabel || settings.title || "גלגל הטבות").trim() ||
    "גלגל הטבות";
  const colorStart = settings.triggerColor || "#7C3AED";
  const colorEnd = settings.triggerColorEnd || settings.triggerColor || "#a855f7";
  const textColor = settings.triggerTextColor || "#ffffff";

  const shapeClass =
    shape === "circle"
      ? "rounded-full p-3.5"
      : shape === "rounded"
        ? "rounded-xl px-4 py-3"
        : "rounded-full px-4 py-3";

  return {
    label,
    textColor,
    shape,
    shapeClass,
    background: `linear-gradient(135deg, ${colorStart}, ${colorEnd})`,
    showLabel: shape !== "circle",
  };
}
