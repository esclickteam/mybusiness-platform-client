import { useEffect, useState } from "react";

import {
  computeCountdownUnits,
  parseEndDate,
  type CountdownSettings,
  type CountdownUnit,
} from "./countdownUtils";

function evergreenEndMs(settings: CountdownSettings) {
  if (settings.mode !== "evergreen") return null;
  const minutes = Math.max(1, Number(settings.evergreenMinutes) || 30);
  if (typeof window === "undefined") return Date.now() + minutes * 60 * 1000;
  const key = `bizuply-countdown-evergreen:${settings.title || "default"}`;
  try {
    const existing = Number(window.localStorage.getItem(key) || 0);
    if (existing > Date.now()) return existing;
    const next = Date.now() + minutes * 60 * 1000;
    window.localStorage.setItem(key, String(next));
    return next;
  } catch {
    return Date.now() + minutes * 60 * 1000;
  }
}

export function useCountdownTimer(settings: CountdownSettings) {
  const endMs = parseEndDate(settings.endDate) || evergreenEndMs(settings);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!endMs) return undefined;
    const id = window.setInterval(() => setTick((t) => t + 1), 1000);
    return () => window.clearInterval(id);
  }, [endMs]);

  const { units, expired } = computeCountdownUnits(endMs, settings);
  void tick;

  return { units, expired, endMs };
}

export type CountdownTimerState = {
  units: CountdownUnit[];
  expired: boolean;
  endMs: number | null;
};
