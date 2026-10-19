import React, { useEffect, useId, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import { CalendarRange, ChevronLeft, ChevronRight } from "lucide-react";
import { useLocaleDir } from "../../../../hooks/useLocaleDir";
import { btnPrimary, btnSecondary } from "../../../../styles/bizuplyUi";
import {
  META_RANGE_PRESETS,
  compareIso,
  formatIsoDate,
  monthCells,
  previousWindow,
  resolveMetaRange,
  shiftMonth,
  type MetaRangePreset,
} from "./metaAdsCalendar";
import { useMetaAdsDateRange } from "./useMetaAdsDateRange";

const WEEKDAYS = ["ראשון", "שני", "שלישי", "רביעי", "חמישי", "שישי", "שבת"];

type Draft = {
  preset: MetaRangePreset;
  since: string;
  until: string;
  compare: boolean;
  compareMode: "previous" | "custom";
  compareSince: string;
  compareUntil: string;
};

function labelKey(preset: MetaRangePreset) {
  const keys: Record<MetaRangePreset, string> = {
    today: "metaCampaigns.ranges.today",
    yesterday: "metaCampaigns.ranges.yesterday",
    today_yesterday: "metaCampaigns.ranges.todayYesterday",
    last_7: "metaCampaigns.ranges.last7",
    rolling_7: "metaCampaigns.ranges.rolling7",
    last_14: "metaCampaigns.ranges.last14",
    last_28: "metaCampaigns.ranges.last28",
    last_30: "metaCampaigns.ranges.last30",
    this_week: "metaCampaigns.ranges.thisWeek",
    last_week: "metaCampaigns.ranges.lastWeek",
    this_month: "metaCampaigns.ranges.thisMonth",
    last_month: "metaCampaigns.ranges.lastMonth",
    maximum: "metaCampaigns.ranges.maximum",
    custom: "metaCampaigns.ranges.custom",
  };
  return keys[preset];
}

export default function MetaAdsDateRangePicker({ now }: { now?: Date }) {
  const { t, i18n } = useTranslation();
  const dir = useLocaleDir();
  const titleId = useId();
  const range = useMetaAdsDateRange(now);
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [anchor, setAnchor] = useState<"since" | "until">("since");
  const [visible, setVisible] = useState(() => {
    const today = range.resolved.until || range.resolved.since || "2026-10-01";
    return { year: Number(today.slice(0, 4)), month: Number(today.slice(5, 7)) };
  });

  const clock = now || new Date();
  const locale = i18n.language?.startsWith("he") ? "he-IL" : "en-US";
  const today = range.resolved.preset ? resolveMetaRange("today", range.timeZone, clock).since || "" : "";

  function openPanel() {
    const since = range.resolved.since || today;
    const until = range.resolved.until || since;
    const comparison = range.comparison;
    setDraft({
      preset: range.preset,
      since,
      until,
      compare: range.compare,
      compareMode: range.compareMode,
      compareSince: comparison?.since || "",
      compareUntil: comparison?.until || "",
    });
    setAnchor("since");
    setVisible({ year: Number(until.slice(0, 4)), month: Number(until.slice(5, 7)) });
    setOpen(true);
  }

  function closePanel() {
    setOpen(false);
    setDraft(null);
  }

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") closePanel();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const earlier = shiftMonth(visible.year, visible.month, -1);
  const draftCompare = useMemo(() => {
    if (!draft?.compare) return null;
    if (draft.compareMode === "custom" && draft.compareSince && draft.compareUntil) {
      return { since: draft.compareSince, until: draft.compareUntil };
    }
    if (!draft.since || !draft.until) return null;
    return previousWindow(draft.since, draft.until);
  }, [draft]);

  function choosePreset(preset: MetaRangePreset) {
    const resolved = resolveMetaRange(preset, range.timeZone, clock, draft ? { since: draft.since, until: draft.until } : undefined);
    setDraft((current) =>
      current
        ? {
            ...current,
            preset,
            since: resolved.since || current.since,
            until: resolved.until || current.until,
          }
        : current
    );
    if (resolved.until) setVisible({ year: Number(resolved.until.slice(0, 4)), month: Number(resolved.until.slice(5, 7)) });
  }

  function chooseDay(iso: string) {
    if (!draft || compareIso(iso, today) > 0) return;
    if (anchor === "since" || !draft.since) {
      setAnchor("until");
      setDraft({ ...draft, preset: "custom", since: iso, until: iso });
      return;
    }
    if (compareIso(iso, draft.since) < 0) {
      setDraft({ ...draft, preset: "custom", since: iso, until: draft.since });
      return;
    }
    setAnchor("since");
    setDraft({ ...draft, preset: "custom", until: iso });
  }

  function commit() {
    if (!draft) return;
    if (compareIso(draft.until, draft.since) < 0) return;
    if (draft.compare && draft.compareMode === "custom" && compareIso(draft.compareUntil, draft.compareSince) < 0) return;
    range.commitRange(draft);
    closePanel();
  }

  const triggerSince = range.resolved.since ? formatIsoDate(range.resolved.since, locale) : "";
  const triggerUntil = range.resolved.until ? formatIsoDate(range.resolved.until, locale) : "";
  const trigger =
    range.preset === "maximum"
      ? t(range.labelKey)
      : `${t(range.labelKey)}: ${triggerSince} – ${triggerUntil}`;

  return (
    <div data-testid="meta-ads-date-range">
      <button
        type="button"
        className="inline-flex max-w-full items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-start text-sm font-bold text-slate-800 shadow-sm"
        onClick={openPanel}
        aria-haspopup="dialog"
        aria-expanded={open}
        data-testid="meta-date-picker-trigger"
      >
        <CalendarRange className="h-4 w-4 shrink-0 text-violet-700" />
        <span className="min-w-0">
          <span className="block truncate">{trigger}</span>
          {range.compare && range.comparison ? (
            <span className="block truncate text-xs font-semibold text-slate-500">
              {t("metaCampaigns.ranges.compare")}: {formatIsoDate(range.comparison.since, locale)} – {formatIsoDate(range.comparison.until, locale)}
            </span>
          ) : null}
        </span>
      </button>
      {open && draft
        ? createPortal(
            <div dir={dir} className="fixed inset-0 z-[80] bg-slate-900/20 p-2 sm:p-6" onMouseDown={closePanel}>
              <div
                role="dialog"
                dir={dir}
                aria-modal="true"
                aria-labelledby={titleId}
                data-testid="meta-date-picker-panel"
                className="mx-auto flex max-h-[calc(100vh-1rem)] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
                onMouseDown={(event) => event.stopPropagation()}
              >
                <div className="grid min-h-0 flex-1 grid-cols-1 overflow-y-auto md:grid-cols-[220px_minmax(0,1fr)]">
                  <div className="order-1 border-b border-slate-100 md:order-none md:border-b-0 md:border-e">
                    <p id={titleId} className="px-3 pt-3 text-xs font-black text-slate-500">
                      {t("metaCampaigns.ranges.presets")}
                    </p>
                    <div className="max-h-52 overflow-y-auto p-2 md:max-h-[28rem]" data-testid="meta-date-preset-list">
                      {META_RANGE_PRESETS.map((preset) => (
                        <label key={preset} className="flex cursor-pointer items-center justify-between gap-2 rounded-lg px-2 py-1.5 text-sm font-bold hover:bg-violet-50">
                          <span>{t(labelKey(preset))}</span>
                          <input
                            type="radio"
                            name="meta-date-preset"
                            checked={draft.preset === preset}
                            onChange={() => choosePreset(preset)}
                            data-testid={`meta-date-preset-${preset}`}
                          />
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="order-2 min-w-0 p-3">
                    <div className="mb-2 flex items-center justify-between gap-2">
                      <button type="button" className={btnSecondary} aria-label={t("metaCampaigns.ranges.previousMonths")} data-testid="meta-date-month-prev" onClick={() => setVisible((current) => shiftMonth(current.year, current.month, -1))}>
                        <ChevronLeft className="h-4 w-4 rtl:hidden" />
                        <ChevronRight className="hidden h-4 w-4 rtl:block" />
                      </button>
                      <button type="button" className={btnSecondary} aria-label={t("metaCampaigns.ranges.nextMonths")} data-testid="meta-date-month-next" onClick={() => setVisible((current) => shiftMonth(current.year, current.month, 1))}>
                        <ChevronRight className="h-4 w-4 rtl:hidden" />
                        <ChevronLeft className="hidden h-4 w-4 rtl:block" />
                      </button>
                    </div>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      {[{ ...earlier, id: "earlier" }, { ...visible, id: "later" }].map((month, index) => (
                        <MonthGrid
                          key={month.id}
                          year={month.year}
                          month={month.month}
                          locale={locale}
                          today={today}
                          since={draft.since}
                          until={draft.until}
                          showOnMobile={index === 1}
                          onYear={(year) => setVisible(index === 1 ? { year, month: visible.month } : shiftMonth(year, month.month, 1))}
                          onMonth={(value) => setVisible(index === 1 ? { year: visible.year, month: value } : shiftMonth(visible.year, value, 1))}
                          onDay={chooseDay}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="space-y-3 border-t border-slate-100 p-3">
                  <div className="grid gap-2 md:grid-cols-[1fr_1fr_1fr_auto]">
                    <label className="text-xs font-black text-slate-500">
                      {t("metaCampaigns.ranges.since")}
                      <input className="mt-1 h-10 w-full rounded-lg border border-slate-200 px-2 text-sm font-bold" type="date" max={today} value={draft.since} data-testid="meta-date-since" onChange={(event) => {
                        const since = event.target.value;
                        const until = since && draft.until && draft.until < since ? since : draft.until;
                        setDraft({ ...draft, preset: "custom", since, until });
                      }} />
                    </label>
                    <label className="text-xs font-black text-slate-500">
                      {t("metaCampaigns.ranges.until")}
                      <input className="mt-1 h-10 w-full rounded-lg border border-slate-200 px-2 text-sm font-bold" type="date" min={draft.since} max={today} value={draft.until} data-testid="meta-date-until" onChange={(event) => {
                        const requested = event.target.value;
                        const until = requested && draft.since && requested < draft.since ? draft.since : requested;
                        setDraft({ ...draft, preset: "custom", until });
                      }} />
                    </label>
                    <label className="text-xs font-black text-slate-500">
                      {t("metaCampaigns.ranges.presets")}
                      <select className="mt-1 h-10 w-full rounded-lg border border-slate-200 px-2 text-sm font-bold" value={draft.preset} data-testid="meta-date-preset-select" onChange={(event) => choosePreset(event.target.value as MetaRangePreset)}>
                        {META_RANGE_PRESETS.map((preset) => (
                          <option key={preset} value={preset}>{t(labelKey(preset))}</option>
                        ))}
                      </select>
                    </label>
                    <label className="flex items-center gap-2 self-end pb-2 text-sm font-black">
                      <input type="checkbox" checked={draft.compare} data-testid="meta-date-compare" onChange={(event) => setDraft({ ...draft, compare: event.target.checked })} />
                      {t("metaCampaigns.ranges.compare")}
                    </label>
                  </div>
                  {draft.compare ? (
                    <div className="grid gap-2 md:grid-cols-[220px_1fr_1fr]">
                      <select className="h-10 rounded-lg border border-slate-200 px-2 text-sm font-bold" value={draft.compareMode} data-testid="meta-date-compare-mode" onChange={(event) => setDraft({ ...draft, compareMode: event.target.value === "custom" ? "custom" : "previous" })}>
                        <option value="previous">{t("metaCampaigns.ranges.comparePrevious")}</option>
                        <option value="custom">{t("metaCampaigns.ranges.compareCustom")}</option>
                      </select>
                      {draft.compareMode === "custom" ? (
                        <>
                          <input className="h-10 rounded-lg border border-slate-200 px-2 text-sm font-bold" type="date" max={today} value={draft.compareSince} data-testid="meta-date-compare-since" onChange={(event) => setDraft({ ...draft, compareSince: event.target.value })} />
                          <input className="h-10 rounded-lg border border-slate-200 px-2 text-sm font-bold" type="date" min={draft.compareSince} max={today} value={draft.compareUntil} data-testid="meta-date-compare-until" onChange={(event) => setDraft({ ...draft, compareUntil: event.target.value })} />
                        </>
                      ) : draftCompare ? (
                        <p className="text-sm font-bold text-slate-600 md:col-span-2" data-testid="meta-date-compare-label">
                          {formatIsoDate(draftCompare.since, locale)} – {formatIsoDate(draftCompare.until, locale)}
                        </p>
                      ) : null}
                    </div>
                  ) : null}
                  <div className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-xs font-semibold text-slate-500">{t("metaCampaigns.ranges.timezoneNote", { zone: range.timeZone })}</p>
                    <div className="flex gap-2">
                      <button type="button" className={btnSecondary} data-testid="meta-date-cancel" onClick={closePanel}>{t("metaCampaigns.ranges.cancel")}</button>
                      <button type="button" className={btnPrimary} data-testid="meta-date-update" onClick={commit}>{t("metaCampaigns.ranges.update")}</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>,
            document.body
          )
        : null}
    </div>
  );
}

function MonthGrid({
  year,
  month,
  locale,
  today,
  since,
  until,
  showOnMobile,
  onYear,
  onMonth,
  onDay,
}: {
  year: number;
  month: number;
  locale: string;
  today: string;
  since: string;
  until: string;
  showOnMobile: boolean;
  onYear: (year: number) => void;
  onMonth: (month: number) => void;
  onDay: (iso: string) => void;
}) {
  const cells = monthCells(year, month);
  const currentYear = Number(today.slice(0, 4));
  const years = Array.from({ length: 12 }, (_, index) => currentYear - 10 + index);
  return (
    <div className={showOnMobile ? "min-w-0" : "hidden min-w-0 md:block"}>
      <div className="mb-2 flex gap-2">
        <select aria-label="month" className="h-9 flex-1 rounded-lg border border-slate-200 px-2 text-sm font-bold" value={month} onChange={(event) => onMonth(Number(event.target.value))}>
          {Array.from({ length: 12 }, (_, index) => index + 1).map((value) => (
            <option key={value} value={value}>
              {new Intl.DateTimeFormat(locale, { month: "long", timeZone: "UTC" }).format(new Date(Date.UTC(2026, value - 1, 1)))}
            </option>
          ))}
        </select>
        <select aria-label="year" className="h-9 w-24 rounded-lg border border-slate-200 px-2 text-sm font-bold" value={year} onChange={(event) => onYear(Number(event.target.value))}>
          {years.map((value) => (
            <option key={value} value={value}>{value}</option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-bold text-slate-400">
        {WEEKDAYS.map((day) => (
          <span key={day}>{day}</span>
        ))}
      </div>
      <div className="mt-1 grid grid-cols-7 gap-1">
        {cells.map((iso, index) => {
          if (!iso) return <span key={`empty-${index}`} />;
          const future = compareIso(iso, today) > 0;
          const selected = iso === since || iso === until;
          const inRange = since && until && compareIso(iso, since) >= 0 && compareIso(iso, until) <= 0;
          const isToday = iso === today;
          return (
            <button
              key={iso}
              type="button"
              disabled={future}
              data-testid={`meta-date-day-${iso}`}
              className={[
                "h-9 rounded-lg text-sm font-bold",
                future ? "cursor-not-allowed text-slate-300" : "",
                selected ? "bg-violet-600 text-white" : inRange ? "bg-violet-100 text-violet-900" : "text-slate-700 hover:bg-slate-100",
                isToday && !selected ? "ring-2 ring-violet-400" : "",
              ].join(" ")}
              onClick={() => onDay(iso)}
            >
              {Number(iso.slice(8, 10))}
            </button>
          );
        })}
      </div>
    </div>
  );
}
