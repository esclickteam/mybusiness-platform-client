import {
  normalizeCountdownSettings,
  type CountdownSettings,
} from "../../site-plugins/countdown/countdownUtils";

export function mergeCountdownSettings(stored: unknown): CountdownSettings {
  return normalizeCountdownSettings(stored);
}
