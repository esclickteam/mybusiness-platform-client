import { useRef } from "react";

import { parseEndDate, type CountdownSettings } from "./countdownUtils";

const PREVIEW_OFFSET_MS =
  47 * 86_400_000 + 8 * 3_600_000 + 45 * 60_000 + 22 * 1_000;

export function useCountdownPreviewSettings(
  settings: CountdownSettings,
  preview: boolean,
): CountdownSettings {
  const previewEndRef = useRef<string | null>(null);

  if (!preview || parseEndDate(settings.endDate)) {
    return settings;
  }

  if (!previewEndRef.current) {
    previewEndRef.current = new Date(Date.now() + PREVIEW_OFFSET_MS).toISOString();
  }

  return {
    ...settings,
    endDate: previewEndRef.current,
  };
}
