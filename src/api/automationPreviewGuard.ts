/**
 * Preview write-guard for Automations.
 *
 * Vercel injects VERCEL_ENV at build time, but Vite only exposes VITE_* to the
 * client bundle unless explicitly mapped. Prefer setting Preview-only:
 *   VITE_AUTOMATIONS_READ_ONLY=1
 * Optionally also set VITE_VERCEL_ENV=preview in the Vercel Preview env.
 */

export const AUTOMATION_PREVIEW_WRITE_BLOCKED_MESSAGE =
  "פעולות כתיבה באוטומציות חסומות בסביבת Preview";

export const AUTOMATION_PREVIEW_ACTION_TOOLTIP =
  "הפעולה אינה זמינה בסביבת Preview";

export function isAutomationsReadOnly(): boolean {
  return (
    import.meta.env.VITE_AUTOMATIONS_READ_ONLY === "1" ||
    import.meta.env.VITE_VERCEL_ENV === "preview"
  );
}

export function assertAutomationWritesAllowed(): void {
  if (isAutomationsReadOnly()) {
    throw new Error(AUTOMATION_PREVIEW_WRITE_BLOCKED_MESSAGE);
  }
}
