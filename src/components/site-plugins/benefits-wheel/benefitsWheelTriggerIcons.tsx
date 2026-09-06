import React from "react";
import type { LucideIcon } from "lucide-react";
import {
  FerrisWheel,
  Gift,
  Percent,
  Sparkles,
  Star,
  Tag,
  Trophy,
} from "lucide-react";

import type { BenefitsWheelTriggerIcon } from "./benefitsWheelUtils";

export const TRIGGER_ICON_OPTIONS: {
  value: BenefitsWheelTriggerIcon;
  label: string;
  Icon: LucideIcon;
}[] = [
  { value: "ferris-wheel", label: "Wheel", Icon: FerrisWheel },
  { value: "gift", label: "Gift", Icon: Gift },
  { value: "sparkles", label: "Sparkles", Icon: Sparkles },
  { value: "tag", label: "Tag", Icon: Tag },
  { value: "percent", label: "Discount", Icon: Percent },
  { value: "star", label: "Star", Icon: Star },
  { value: "trophy", label: "Trophy", Icon: Trophy },
  { value: "none", label: "None", Icon: Tag },
];

const ICON_MAP: Record<Exclude<BenefitsWheelTriggerIcon, "none">, LucideIcon> = {
  "ferris-wheel": FerrisWheel,
  gift: Gift,
  sparkles: Sparkles,
  tag: Tag,
  percent: Percent,
  star: Star,
  trophy: Trophy,
};

export function BenefitsWheelTriggerIcon({
  icon,
  size = 20,
  className,
}: {
  icon?: BenefitsWheelTriggerIcon;
  size?: number;
  className?: string;
}) {
  if (!icon || icon === "none") return null;
  const Icon = ICON_MAP[icon] || FerrisWheel;
  return <Icon size={size} className={className} strokeWidth={2.25} />;
}

export function getTriggerIconComponent(icon?: BenefitsWheelTriggerIcon): LucideIcon | null {
  if (!icon || icon === "none") return null;
  return ICON_MAP[icon] || FerrisWheel;
}
