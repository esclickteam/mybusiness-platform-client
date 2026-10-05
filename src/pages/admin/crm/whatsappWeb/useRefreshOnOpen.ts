import { useCallback, useEffect, useRef } from "react";

/**
 * Returns a trigger for focus / mousedown on a picker. Focus and mousedown fire
 * together on a click, so calls within `minIntervalMs` or while a refresh is in
 * flight are ignored.
 */
export function useRefreshOnOpen(
  refresh: () => Promise<unknown> | unknown,
  minIntervalMs = 2000
) {
  const refreshRef = useRef(refresh);
  useEffect(() => {
    refreshRef.current = refresh;
  });
  const inFlightRef = useRef(false);
  const lastRef = useRef(0);

  return useCallback(() => {
    const now = Date.now();
    if (inFlightRef.current || now - lastRef.current < minIntervalMs) return;
    lastRef.current = now;
    inFlightRef.current = true;
    Promise.resolve()
      .then(() => refreshRef.current())
      .catch(() => undefined)
      .finally(() => {
        inFlightRef.current = false;
      });
  }, [minIntervalMs]);
}
