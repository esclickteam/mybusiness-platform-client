import React from "react";
import { BellRing, Smartphone } from "lucide-react";
import { useTranslation } from "react-i18next";
import { getTextDirection } from "../../i18n/localeUtils";

type CommonProps = {
  trialEligible: boolean;
  onOpenPushSettings: () => void;
};

export function PushEmptyStateUpsell({
  trialEligible,
  onOpenPushSettings,
}: CommonProps) {
  const { t } = useTranslation();
  return (
    <div
      className="mt-5 w-full max-w-sm text-center"
      data-testid="push-empty-upsell"
    >
      <p className="text-sm font-black text-slate-800">
        {t("push.discover.emptyTitle")}
      </p>
      <p className="mt-1.5 text-xs font-semibold leading-5 text-slate-500">
        {t("push.discover.emptyHint")}
      </p>

      {trialEligible ? (
        <p
          className="mt-3 text-[11px] font-bold text-sky-700"
          data-testid="push-upsell-trial-badge"
        >
          {t("push.discover.trialThenMonthly")}
        </p>
      ) : (
        <p
          className="mt-3 text-[11px] font-bold text-sky-700"
          data-testid="push-upsell-paid-price"
        >
          {t("push.discover.monthly")}
        </p>
      )}

      <button
        type="button"
        onClick={onOpenPushSettings}
        className="mt-3 inline-flex h-10 w-full items-center justify-center gap-2 rounded-2xl bg-sky-600 px-4 text-xs font-black text-white shadow-sm transition hover:bg-sky-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2"
        data-testid="push-empty-upsell-cta"
      >
        <Smartphone className="h-4 w-4" aria-hidden />
        {trialEligible
          ? t("push.discover.tryPush")
          : t("push.discover.enablePush")}
      </button>

      <p className="mt-2 text-[10px] font-semibold text-slate-400">
        {trialEligible
          ? t("push.discover.yearlyTrial")
          : t("push.discover.yearly")}
      </p>
    </div>
  );
}

export function PushCompactUpsellCard({
  trialEligible,
  onOpenPushSettings,
}: CommonProps) {
  const { t } = useTranslation();
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
            {t("push.discover.compactTitle")}
          </p>
          {trialEligible ? (
            <span
              className="inline-flex rounded-full bg-sky-100 px-2 py-0.5 text-[9px] font-black text-sky-700 ring-1 ring-sky-200"
              data-testid="push-upsell-trial-badge"
            >
              {t("push.discover.free7")}
            </span>
          ) : null}
        </div>
        <p className="mt-0.5 text-[11px] font-semibold text-slate-500">
          {trialEligible
            ? t("push.discover.whenClosed")
            : t("push.discover.whenClosedPaid")}
        </p>
        {!trialEligible ? (
          <p className="mt-0.5 text-[10px] font-semibold text-slate-400">
            {t("push.discover.yearly")}
          </p>
        ) : null}
      </div>

      <button
        type="button"
        onClick={onOpenPushSettings}
        className="inline-flex h-9 shrink-0 items-center justify-center rounded-2xl bg-sky-600 px-3 text-[11px] font-black text-white transition hover:bg-sky-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2"
        data-testid="push-compact-upsell-cta"
      >
        {trialEligible
          ? t("push.discover.enablePushShort")
          : t("push.discover.enablePush")}
      </button>
    </div>
  );
}

export function PushBellDiscoverChip({
  trialEligible,
  onOpenPushSettings,
}: CommonProps) {
  const { t, i18n } = useTranslation();
  const chipDir = getTextDirection(i18n.language);
  const trialLabel = t("push.discover.free7Push");
  const enableLabel = t("push.discover.enablePush");
  const label = trialEligible ? trialLabel : enableLabel;
  return (
    <button
      type="button"
      dir={chipDir}
      onClick={(event) => {
        event.stopPropagation();
        onOpenPushSettings();
      }}
      aria-label={label}
      title={label}
      className={[
        "inline-flex max-w-[18rem] shrink-0 items-center justify-center rounded-full",
        "border border-sky-200 bg-sky-50 px-2.5 py-1 text-[11px] font-black leading-4 text-sky-700 shadow-sm",
        "whitespace-nowrap text-center transition hover:bg-sky-100",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300",
      ].join(" ")}
      data-testid="push-bell-chip"
    >
      {label}
    </button>
  );
}
