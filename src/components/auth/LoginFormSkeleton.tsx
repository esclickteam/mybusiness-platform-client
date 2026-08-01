import React from "react";
import AuthShell, { AuthCard } from "./AuthShell";

/**
 * Loading placeholder for the /login route.
 *
 * Renders the exact same AuthShell/AuthCard structure as the real Login
 * page (same wrapper, same card size/padding, same title/subtitle) and
 * only swaps the form fields for fixed-height skeleton bars. Because the
 * surrounding shell never changes size or position between this loading
 * state and the real form, swapping it in causes no layout shift (unlike
 * the previous full-screen loader, which had a completely different
 * layout from the final page and was the dominant cause of this page's
 * high CLS).
 */
export function LoginFormSkeleton() {
  return (
    <AuthShell>
      <AuthCard
        title="התחברות"
        subtitle="התחברו כדי לנהל את העסק שלכם ב-BizUply"
      >
        <div
          className="space-y-4"
          role="status"
          aria-live="polite"
          aria-busy="true"
          aria-label="טוען..."
        >
          <div>
            <div className="mb-2 h-[17px] w-14 rounded bg-slate-100" />
            <div className="h-12 w-full animate-pulse rounded-2xl bg-slate-100" />
          </div>

          <div>
            <div className="mb-2 h-[17px] w-14 rounded bg-slate-100" />
            <div className="h-12 w-full animate-pulse rounded-2xl bg-slate-100" />
          </div>

          <div className="flex items-center justify-between gap-3 pt-1">
            <div className="h-[17px] w-24 rounded bg-slate-100" />
            <div className="h-[17px] w-20 rounded bg-slate-100" />
          </div>

          <div className="mt-2 h-12 w-full animate-pulse rounded-2xl bg-slate-100" />

          <div className="flex justify-center pt-2">
            <div className="h-[17px] w-40 rounded bg-slate-100" />
          </div>
        </div>
      </AuthCard>
    </AuthShell>
  );
}

export default LoginFormSkeleton;
