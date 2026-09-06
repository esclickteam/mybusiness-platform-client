/** Client-side defaults mirror for public render when server merge unavailable */
import i18n from "../../../i18n/i18n";
import {
  normalizeSegments,
  type BenefitsWheelSettings,
} from "../../site-plugins/benefits-wheel/benefitsWheelUtils";

export function mergePluginSettings(stored: unknown): BenefitsWheelSettings {
  const base: BenefitsWheelSettings = {
    isActive: true,
    title: i18n.t("leftover.wheel.title"),
    subtitle: i18n.t("leftover.wheel.subtitle"),
    spinsPerUser: 1,
    segmentCount: 6,
    autoOpenOnFirstVisit: true,
    showTrigger: true,
    triggerPosition: { x: 88, y: 82 },
    triggerLabel: i18n.t("leftover.wheel.trigger"),
    triggerIcon: "ferris-wheel",
    triggerShowIcon: true,
    triggerColor: "#7C3AED",
    triggerColorEnd: "#a855f7",
    triggerTextColor: "#ffffff",
    triggerShape: "pill",
    segments: normalizeSegments(
      [
        { label: i18n.t("leftover.wheel.sale10"), couponCode: "SALE10" },
        { label: i18n.t("leftover.wheel.freeShip"), couponCode: "FREESHIP" },
        { label: i18n.t("leftover.wheel.gift"), couponCode: "GIFT2024" },
        { label: i18n.t("leftover.wheel.sale20"), couponCode: "SALE20" },
        { label: i18n.t("leftover.wheel.upgrade"), couponCode: "UPGRADE" },
        { label: i18n.t("leftover.wheel.tryAgain"), couponCode: "" },
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
