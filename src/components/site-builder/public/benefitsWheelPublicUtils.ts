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
    triggerLabel: "גלגל הטבות",
    triggerColor: "#7C3AED",
    triggerColorEnd: "#a855f7",
    triggerTextColor: "#ffffff",
    triggerShape: "pill",
    segments: normalizeSegments(
      [
        { label: "10% הנחה", couponCode: "SALE10" },
        { label: "משלוח חינם", couponCode: "FREESHIP" },
        { label: "מתנה", couponCode: "GIFT2024" },
        { label: "20% הנחה", couponCode: "SALE20" },
        { label: "שדרוג חינם", couponCode: "UPGRADE" },
        { label: "נסו שוב", couponCode: "" },
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
