/** Client-side defaults mirror for public render when server merge unavailable */
import {
  normalizeSegments,
  type BenefitsWheelSettings,
} from "../../site-plugins/benefits-wheel/benefitsWheelUtils";

export function mergePluginSettings(stored: unknown): BenefitsWheelSettings {
  const base: BenefitsWheelSettings = {
    isActive: true,
    title: "גלגל ההטבות",
    subtitle: "סובבו וגלו מה זכיתם!",
    spinsPerUser: 1,
    segmentCount: 6,
    autoOpenOnFirstVisit: true,
    showTrigger: true,
    triggerPosition: { x: 88, y: 82 },
    segments: normalizeSegments(
      [
        { label: "10% הנחה" },
        { label: "משלוח חינם" },
        { label: "מתנה" },
        { label: "20% הנחה" },
        { label: "שדרוג חינם" },
        { label: "נסו שוב" },
      ],
      6
    ),
  };

  if (!stored || typeof stored !== "object") return base;
  const s = stored as BenefitsWheelSettings;
  const count = Math.min(12, Math.max(3, Number(s.segmentCount) || 6));
  return {
    ...base,
    ...s,
    segmentCount: count,
    segments: normalizeSegments(s.segments, count),
  };
}
