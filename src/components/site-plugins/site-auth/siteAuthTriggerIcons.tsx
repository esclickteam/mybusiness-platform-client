import React from "react";
import type { LucideIcon } from "lucide-react";
import {
  DoorOpen,
  KeyRound,
  Lock,
  LogIn,
  LogOut,
  Shield,
  UserCircle,
  UserRound,
} from "lucide-react";

export type SiteAuthTriggerIcon =
  | "log-in"
  | "log-out"
  | "user"
  | "user-circle"
  | "key"
  | "door"
  | "lock"
  | "shield"
  | "none";

export const SITE_AUTH_ICON_OPTIONS: {
  value: SiteAuthTriggerIcon;
  label: string;
  Icon: LucideIcon;
}[] = [
  { value: "log-in", label: "כניסה", Icon: LogIn },
  { value: "log-out", label: "יציאה", Icon: LogOut },
  { value: "user", label: "משתמש", Icon: UserRound },
  { value: "user-circle", label: "פרופיל", Icon: UserCircle },
  { value: "key", label: "מפתח", Icon: KeyRound },
  { value: "door", label: "דלת", Icon: DoorOpen },
  { value: "lock", label: "מנעול", Icon: Lock },
  { value: "shield", label: "מגן", Icon: Shield },
  { value: "none", label: "ללא", Icon: LogIn },
];

const ICON_MAP: Record<Exclude<SiteAuthTriggerIcon, "none">, LucideIcon> = {
  "log-in": LogIn,
  "log-out": LogOut,
  user: UserRound,
  "user-circle": UserCircle,
  key: KeyRound,
  door: DoorOpen,
  lock: Lock,
  shield: Shield,
};

export function SiteAuthTriggerIcon({
  icon,
  size = 22,
  className,
}: {
  icon?: SiteAuthTriggerIcon;
  size?: number;
  className?: string;
}) {
  if (!icon || icon === "none") return null;
  const Icon = ICON_MAP[icon] || LogIn;
  return <Icon size={size} className={className} strokeWidth={2.25} />;
}

export function resolveSiteAuthTriggerIcon(
  icon: unknown,
  fallback: SiteAuthTriggerIcon = "log-in"
): SiteAuthTriggerIcon {
  const value = String(icon || fallback);
  if (SITE_AUTH_ICON_OPTIONS.some((option) => option.value === value)) {
    return value as SiteAuthTriggerIcon;
  }
  return fallback;
}
