import React from "react";
import { BellRing, Smartphone } from "lucide-react";

type CommonProps = {
  trialEligible: boolean;
  onOpenPushSettings: () => void;
};

export function PushEmptyStateUpsell({
  trialEligible,
  onOpenPushSettings,
}: CommonProps) {
  return (
    <div
      className="mt-5 w-full max-w-sm text-center"
      data-testid="push-empty-upsell"
    >
      <p className="text-sm font-black text-slate-800">
        קבלו התראות גם כש-Bizuply סגורה
      </p>
      <p className="mt-1.5 text-xs font-semibold leading-5 text-slate-500">
        לידים חדשים, פגישות ועדכונים חשובים — ישירות למכשיר.
      </p>

      {trialEligible ? (
        <p
          className="mt-3 text-[11px] font-bold text-sky-700"
          data-testid="push-upsell-trial-badge"
        >
          7 ימים חינם • לאחר מכן 29 ₪ לחודש
        </p>
      ) : (
        <p
          className="mt-3 text-[11px] font-bold text-sky-700"
          data-testid="push-upsell-paid-price"
        >
          29 ₪ לחודש
        </p>
      )}

      <button
        type="button"
        onClick={onOpenPushSettings}
        className="mt-3 inline-flex h-10 w-full items-center justify-center gap-2 rounded-2xl bg-sky-600 px-4 text-xs font-black text-white shadow-sm transition hover:bg-sky-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2"
        data-testid="push-empty-upsell-cta"
      >
        <Smartphone className="h-4 w-4" aria-hidden />
        {trialEligible ? "נסו התראות Push" : "גילוי Push למכשיר"}
      </button>

      <p className="mt-2 text-[10px] font-semibold text-slate-400">
        {trialEligible ? "או 19 ₪ לחודש בחיוב שנתי" : "או 228 ₪ לשנה"}
      </p>
    </div>
  );
}

export function PushCompactUpsellCard({
  trialEligible,
  onOpenPushSettings,
}: CommonProps) {
  return (
    <div
      className="mb-2 flex items-center gap-3 rounded-3xl border border-sky-100 bg-gradient-to-l from-sky-50/90 via-white to-white p-3 shadow-sm"
      data-testid="push-compact-upsell"
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-sky-50 text-sky-600 ring-1 ring-sky-100">
        <BellRing className="h-4 w-4" aria-hidden />
      </span>

      <div className="min-w-0 flex-1 text-start">
        <div className="flex flex-wrap items-center gap-1.5">
          <p className="text-xs font-black text-slate-800">
            קבלו התראות בזמן אמת למכשיר
          </p>
          {trialEligible ? (
            <span
              className="inline-flex rounded-full bg-sky-100 px-2 py-0.5 text-[9px] font-black text-sky-700 ring-1 ring-sky-200"
              data-testid="push-upsell-trial-badge"
            >
              7 ימים חינם
            </span>
          ) : null}
        </div>
        <p className="mt-0.5 text-[11px] font-semibold text-slate-500">
          גם כש-Bizuply לא פתוחה
          {!trialEligible ? " · 29 ₪ לחודש" : ""}
        </p>
        {!trialEligible ? (
          <p className="mt-0.5 text-[10px] font-semibold text-slate-400">
            או 228 ₪ לשנה
          </p>
        ) : null}
      </div>

      <button
        type="button"
        onClick={onOpenPushSettings}
        className="inline-flex h-9 shrink-0 items-center justify-center rounded-2xl bg-sky-600 px-3 text-[11px] font-black text-white transition hover:bg-sky-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2"
        data-testid="push-compact-upsell-cta"
      >
        {trialEligible ? "הפעלת Push" : "גילוי Push למכשיר"}
      </button>
    </div>
  );
}

export function PushBellDiscoverChip({
  trialEligible,
  onOpenPushSettings,
}: CommonProps) {
  return (
    <button
      type="button"
      onClick={(event) => {
        event.stopPropagation();
        onOpenPushSettings();
      }}
      aria-label={
        trialEligible
          ? "גילוי Push למכשיר — 7 ימים חינם"
          : "גילוי Push למכשיר"
      }
      title={
        trialEligible
          ? "גילוי Push למכשיר — 7 ימים חינם"
          : "גילוי Push למכשיר"
      }
      className={[
        "absolute -bottom-1 z-[1] inline-flex max-w-[5.5rem] items-center justify-center truncate rounded-full",
        "border border-sky-200 bg-sky-50 px-1.5 py-0.5 text-[9px] font-black leading-none text-sky-700 shadow-sm",
        "transition hover:bg-sky-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300",
        "start-[-0.35rem] sm:max-w-none sm:px-2",
      ].join(" ")}
      data-testid="push-bell-chip"
    >
      <span className="sm:hidden">Push</span>
      <span className="hidden sm:inline">
        {trialEligible ? "7 ימים חינם" : "Push"}
      </span>
    </button>
  );
}
