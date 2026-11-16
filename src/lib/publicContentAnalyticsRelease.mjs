/**
 * Release lock for public-content measurement.
 * Environment variables cannot release this constant.
 * Activation requires a separate, explicitly approved code change.
 */
export const PUBLIC_CONTENT_ANALYTICS_RELEASED = false;

export function publicContentAnalyticsReleased() {
  return PUBLIC_CONTENT_ANALYTICS_RELEASED === true;
}
