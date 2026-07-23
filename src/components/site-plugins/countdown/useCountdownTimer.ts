import { useEffect, useState } from "react";

import {
  computeCountdownUnits,
  parseEndDate,
  type CountdownSettings,
  type CountdownUnit,
} from "./countdownUtils";

export function useCountdownTimer(settings: CountdownSettings) {
  const endMs = parseEndDate(settings.endDate);
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
