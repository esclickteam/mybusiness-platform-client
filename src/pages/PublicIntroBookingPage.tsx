import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Calendar, Check, ChevronLeft, ChevronRight, Info, Phone, X } from "lucide-react";
import API from "../api";

type Slot = { startAt: string; endAt: string; label: string };
type DateRow = { key: string; slots: Slot[]; sampleIso: string };

const TIMEZONE = "Asia/Jerusalem";
const DATES_VISIBLE = 4;
const TIMES_VISIBLE = 11;

function dayKey(iso: string) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(iso));
}

function formatDateCard(iso: string) {
  return new Intl.DateTimeFormat("he-IL", {
    timeZone: TIMEZONE,
    day: "2-digit",
    month: "2-digit",
  }).format(new Date(iso));
}

function formatWeekday(iso: string) {
  return new Intl.DateTimeFormat("he-IL", {
    timeZone: TIMEZONE,
    weekday: "long",
  }).format(new Date(iso));
}

function formatTime(iso: string) {
  return new Intl.DateTimeFormat("he-IL", {
    timeZone: TIMEZONE,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date(iso));
}

function formatWhen(iso: string) {
  return new Intl.DateTimeFormat("he-IL", {
    timeZone: TIMEZONE,
    weekday: "long",
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date(iso));
}

function formatPickerLabel(key: string, sampleIso: string) {
  try {
    return new Intl.DateTimeFormat("he-IL", {
      timeZone: TIMEZONE,
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date(sampleIso || `${key}T12:00:00`));
  } catch {
    return key;
  }
}

const dateCardClass = (active: boolean) =>
  [
    "flex min-h-[72px] flex-col items-center justify-center rounded-2xl border px-1 py-2 transition",
    active
      ? "border-[#7C4DFF] bg-[#7C4DFF]/5 text-[#7C4DFF] ring-1 ring-[#7C4DFF]/30"
      : "border-slate-200 bg-white text-slate-700 hover:border-[#7C4DFF]/30",
  ].join(" ");

function DateCard({
  day,
  active,
  onSelect,
  compact = false,
}: {
  day: DateRow;
  active: boolean;
  onSelect: (key: string) => void;
  compact?: boolean;
}) {
  return (
    <button
      type="button"
      data-date-key={day.key}
      onClick={() => onSelect(day.key)}
      className={[
        dateCardClass(active),
        compact ? "w-[72px] shrink-0 snap-center" : "w-full",
      ].join(" ")}
    >
      <span className="text-sm font-black tabular-nums">{formatDateCard(day.sampleIso)}</span>
      <span className="mt-0.5 text-center text-[10px] font-bold leading-tight">
        {formatWeekday(day.sampleIso)}
      </span>
    </button>
  );
}

function DatePickerCube({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex min-h-[72px] w-[72px] shrink-0 snap-center flex-col items-center justify-center rounded-2xl border border-dashed border-[#7C4DFF]/40 bg-[#7C4DFF]/5 px-1 py-2 text-[#7C4DFF] transition hover:border-[#7C4DFF]/60 hover:bg-[#7C4DFF]/10"
    >
      <Calendar className="h-5 w-5" strokeWidth={2.2} />
      <span className="mt-1 text-center text-[10px] font-black leading-tight">בחירת תאריך</span>
    </button>
  );
}

function DatePickerModal({
  open,
  onClose,
  dates,
  selectedDateKey,
  onSelect,
}: {
  open: boolean;
  onClose: () => void;
  dates: DateRow[];
  selectedDateKey: string;
  onSelect: (key: string) => void;
}) {
  const availableKeys = useMemo(() => new Set(dates.map((d) => d.key)), [dates]);
  const minDate = dates[0]?.key || "";
  const maxDate = dates[dates.length - 1]?.key || "";
  const [draft, setDraft] = useState(selectedDateKey);
  const [pickerError, setPickerError] = useState("");

  useEffect(() => {
    if (open) {
      setDraft(selectedDateKey || dates[0]?.key || "");
      setPickerError("");
    }
  }, [open, selectedDateKey, dates]);

  if (!open) return null;

  function applyDate(key: string) {
    if (!availableKeys.has(key)) {
      setPickerError("אין מועדים פנויים בתאריך זה. בחרו תאריך אחר.");
      return;
    }
    onSelect(key);
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/40 p-4 sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-label="בחירת תאריך"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-[24px] border border-purple-100 bg-white p-4 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-3 flex items-center justify-between gap-2">
          <h3 className="text-base font-black text-[#1E1B4B]">בחרו תאריך</h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="סגירה"
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-slate-50 text-slate-500"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <label className="block text-xs font-bold text-slate-500">תאריך</label>
        <input
          type="date"
          dir="ltr"
          min={minDate}
          max={maxDate}
          value={draft}
          onChange={(e) => {
            setDraft(e.target.value);
            setPickerError("");
          }}
          className="mt-1 h-12 w-full rounded-2xl border border-slate-200 px-3 text-sm font-bold text-slate-800"
        />

        {pickerError ? (
          <p className="mt-2 text-xs font-bold text-rose-600">{pickerError}</p>
        ) : null}

        <div className="mt-3 max-h-44 space-y-1 overflow-y-auto overscroll-contain">
          {dates.map((day) => (
            <button
              key={day.key}
              type="button"
              onClick={() => applyDate(day.key)}
              className={[
                "flex w-full items-center justify-between rounded-xl border px-3 py-2 text-right text-sm font-semibold transition",
                day.key === selectedDateKey
                  ? "border-[#7C4DFF] bg-[#7C4DFF]/5 text-[#7C4DFF]"
                  : "border-slate-100 bg-slate-50 text-slate-700 hover:border-[#7C4DFF]/30",
              ].join(" ")}
            >
              <span>{formatPickerLabel(day.key, day.sampleIso)}</span>
              <span className="text-xs tabular-nums text-slate-500">{day.slots.length} מועדים</span>
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => applyDate(draft)}
          className="mt-4 inline-flex h-11 w-full items-center justify-center rounded-2xl bg-[#7C4DFF] text-sm font-black text-white"
        >
          אישור תאריך
        </button>
      </div>
    </div>
  );
}

function Stepper() {
  const steps = [
    { label: "לקוח", done: true },
    { label: "שירות", done: true },
    { label: "מועד", active: true, number: 3 },
  ];
  return (
    <div className="flex items-center justify-center gap-2 sm:gap-3">
      {steps.map((step, index) => (
        <React.Fragment key={step.label}>
          <div className="flex min-w-0 flex-col items-center gap-1">
            <span
              className={[
                "flex h-7 w-7 items-center justify-center rounded-full text-xs font-black",
                step.active
                  ? "bg-[#7C4DFF] text-white"
                  : step.done
                    ? "bg-emerald-500 text-white"
                    : "bg-slate-100 text-slate-400",
              ].join(" ")}
            >
              {step.done && !step.active ? <Check className="h-3.5 w-3.5" strokeWidth={3} /> : step.number || "✓"}
            </span>
            <span
              className={[
                "text-[11px] font-bold",
                step.active ? "text-[#7C4DFF]" : step.done ? "text-emerald-600" : "text-slate-400",
              ].join(" ")}
            >
              {step.label}
            </span>
          </div>
          {index < steps.length - 1 ? (
            <span className="mb-4 h-px w-6 bg-slate-200 sm:w-10" aria-hidden />
          ) : null}
        </React.Fragment>
      ))}
    </div>
  );
}

export default function PublicIntroBookingPage() {
  const navigate = useNavigate();
  const { token, businessId } = useParams();
  const rawToken = String(token || businessId || "").trim();
  const mobileDateScrollRef = useRef<HTMLDivElement | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [data, setData] = useState<any>(null);
  const [selectedDateKey, setSelectedDateKey] = useState("");
  const [selected, setSelected] = useState("");
  const [datePage, setDatePage] = useState(0);
  const [timePage, setTimePage] = useState(0);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState<any>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError("");
      try {
        const { data: res } = await API.get(`/public/book/${encodeURIComponent(rawToken)}`);
        if (!cancelled) setData(res);
      } catch (err: any) {
        if (!cancelled) {
          setError(err?.response?.data?.error || "קישור התיאום אינו תקף או שפג תוקפו.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    if (rawToken) load();
    return () => {
      cancelled = true;
    };
  }, [rawToken]);

  const timezone = data?.timezone || TIMEZONE;
  const durationMinutes = data?.durationMinutes || 15;
  const serviceName = "שיחה ראשונית";

  const dates = useMemo(() => {
    const map = new Map<string, Slot[]>();
    for (const slot of data?.slots || []) {
      const key = dayKey(slot.startAt);
      const list = map.get(key) || [];
      list.push(slot);
      map.set(key, list);
    }
    return [...map.entries()].map(([key, slots]) => ({
      key,
      slots: slots.sort((a, b) => a.startAt.localeCompare(b.startAt)),
      sampleIso: slots[0]?.startAt || key,
    }));
  }, [data?.slots]);

  useEffect(() => {
    if (!dates.length) return;
    if (!selectedDateKey || !dates.some((d) => d.key === selectedDateKey)) {
      setSelectedDateKey(dates[0].key);
      setDatePage(0);
    }
  }, [dates, selectedDateKey]);

  const visibleDates = useMemo(() => {
    const start = datePage * DATES_VISIBLE;
    return dates.slice(start, start + DATES_VISIBLE);
  }, [dates, datePage]);

  const selectedDaySlots = useMemo(() => {
    return dates.find((d) => d.key === selectedDateKey)?.slots || [];
  }, [dates, selectedDateKey]);

  const visibleTimes = useMemo(() => {
    const start = timePage * TIMES_VISIBLE;
    return selectedDaySlots.slice(start, start + TIMES_VISIBLE);
  }, [selectedDaySlots, timePage]);

  const hasMoreDates = (datePage + 1) * DATES_VISIBLE < dates.length;
  const hasPrevDates = datePage > 0;
  const hasMoreTimes = (timePage + 1) * TIMES_VISIBLE < selectedDaySlots.length;
  const showMoreTimesButton =
    hasMoreTimes && visibleTimes.length >= TIMES_VISIBLE - 1;

  function scrollSelectedDateIntoView(key: string) {
    const container = mobileDateScrollRef.current;
    if (!container || !key) return;
    const target = container.querySelector<HTMLElement>(`[data-date-key="${key}"]`);
    target?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }

  function selectDate(key: string) {
    setSelectedDateKey(key);
    setSelected("");
    setTimePage(0);
    const index = dates.findIndex((d) => d.key === key);
    if (index >= 0) {
      setDatePage(Math.floor(index / DATES_VISIBLE));
    }
    window.requestAnimationFrame(() => scrollSelectedDateIntoView(key));
  }

  useEffect(() => {
    if (!selectedDateKey) return;
    scrollSelectedDateIntoView(selectedDateKey);
  }, [selectedDateKey, dates.length]);

  function goBack() {
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }
    window.close();
  }

  async function book() {
    if (!selected) return;
    setSaving(true);
    setError("");
    try {
      const { data: res } = await API.post(`/public/book/${encodeURIComponent(rawToken)}`, {
        startAt: selected,
      });
      setDone(res.booking);
    } catch (err: any) {
      setError(err?.response?.data?.error || "לא ניתן לקבוע את המועד. ייתכן שהוא כבר נתפס.");
      try {
        const { data: res } = await API.get(`/public/book/${encodeURIComponent(rawToken)}`);
        setData(res);
        setSelected("");
      } catch {
        /* ignore refresh errors */
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      className="flex min-h-[100dvh] flex-col overflow-x-hidden bg-[#F7F4FF]"
      dir="rtl"
      style={{ fontFamily: '"Assistant", "Heebo", "Rubik", sans-serif' }}
    >
      <header className="shrink-0 border-b border-purple-100/80 bg-white/90 px-4 pb-4 pt-3 backdrop-blur sm:px-6">
        <div className="mx-auto flex w-full max-w-lg items-start justify-between gap-3">
          <button
            type="button"
            onClick={goBack}
            aria-label="חזרה"
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-500 transition hover:border-slate-300 hover:text-slate-800"
          >
            <X className="h-5 w-5" />
          </button>
          <div className="min-w-0 flex-1 text-center">
            <p className="inline-flex items-center justify-center gap-1.5 text-xs font-bold text-[#7C4DFF]">
              <Calendar className="h-3.5 w-3.5" />
              יומן BizUply
            </p>
            <h1 className="mt-1 text-xl font-black text-[#1E1B4B] sm:text-2xl">תיאום חדש</h1>
            <p className="mt-0.5 text-sm font-semibold text-slate-500">
              בחרו מועד לשיחה הראשונית
            </p>
          </div>
          <span className="h-10 w-10 shrink-0" aria-hidden />
        </div>
        <div className="mx-auto mt-4 w-full max-w-lg">
          <Stepper />
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-lg flex-1 flex-col px-4 py-4 sm:px-6">
        {loading ? (
          <p className="text-center text-sm font-bold text-slate-500">טוען מועדים…</p>
        ) : null}

        {error ? (
          <div className="mb-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-bold text-rose-800">
            {error}
          </div>
        ) : null}

        {done ? (
          <section className="rounded-[24px] border border-emerald-200 bg-white p-5 shadow-sm">
            <h2 className="text-xl font-black text-emerald-800">השיחה נקבעה בהצלחה</h2>
            <p className="mt-3 font-black text-[#1E1B4B]">{done.serviceName || serviceName}</p>
            <p className="mt-1 font-bold text-slate-700">
              {new Date(done.startAt).toLocaleDateString("he-IL", {
                timeZone: done.timezone || timezone,
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })}{" "}
              בשעה {formatTime(done.startAt)}
            </p>
            <p className="mt-1 font-black text-[#7C4DFF]">{done.durationMinutes || durationMinutes} דקות</p>
            <p className="mt-4 text-sm font-bold text-slate-500">ניצור איתך קשר במועד שנבחר.</p>
          </section>
        ) : data?.alreadyBooked ? (
          <section className="rounded-[24px] border border-emerald-200 bg-white p-5">
            <p className="font-black text-emerald-800">כבר נקבעה לכם שיחה ראשונית.</p>
          </section>
        ) : (
          <div className="flex flex-1 flex-col gap-4">
            <section className="rounded-[20px] border border-purple-100 bg-white p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#7C4DFF] text-white">
                  <Phone className="h-5 w-5" />
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-black text-[#1E1B4B]">
                    {serviceName} — {durationMinutes} דקות
                  </p>
                  <p className="text-xs font-semibold text-slate-500">
                    משך הפגישה: {durationMinutes} דקות
                  </p>
                </div>
              </div>
            </section>

            {!dates.length && !loading ? (
              <p className="text-center text-sm font-bold text-slate-500">אין מועדים פנויים כרגע.</p>
            ) : null}

            {dates.length ? (
              <>
                <section className="min-w-0">
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <h2 className="text-sm font-black text-slate-800">בחרו תאריך</h2>
                    <div className="hidden items-center gap-1 sm:flex">
                      <button
                        type="button"
                        disabled={!hasPrevDates}
                        onClick={() => setDatePage((p) => Math.max(0, p - 1))}
                        aria-label="תאריכים קודמים"
                        className="inline-flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 disabled:opacity-30"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        disabled={!hasMoreDates}
                        onClick={() => setDatePage((p) => p + 1)}
                        aria-label="תאריכים הבאים"
                        className="inline-flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 disabled:opacity-30"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Mobile: continuous horizontal swipe row */}
                  <div
                    ref={mobileDateScrollRef}
                    className={[
                      "-mx-4 flex gap-2 overflow-x-auto overscroll-x-contain px-4 pb-1",
                      "[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
                      "[scroll-snap-type:x_mandatory] [touch-action:pan-x]",
                      "sm:hidden",
                    ].join(" ")}
                  >
                    {dates.map((day) => (
                      <DateCard
                        key={day.key}
                        day={day}
                        active={day.key === selectedDateKey}
                        onSelect={selectDate}
                        compact
                      />
                    ))}
                    <DatePickerCube onClick={() => setPickerOpen(true)} />
                  </div>

                  {/* Desktop: paginated grid + picker cube */}
                  <div className="hidden gap-2 sm:flex">
                    <div className="grid min-w-0 flex-1 grid-cols-4 gap-2">
                      {visibleDates.map((day) => (
                        <DateCard
                          key={day.key}
                          day={day}
                          active={day.key === selectedDateKey}
                          onSelect={selectDate}
                        />
                      ))}
                    </div>
                    <DatePickerCube onClick={() => setPickerOpen(true)} />
                  </div>
                </section>

                <section>
                  <h2 className="mb-2 text-sm font-black text-slate-800">בחרו מועד לשיחה</h2>
                  <div className="grid grid-cols-4 gap-2">
                    {visibleTimes.map((slot) => {
                      const active = selected === slot.startAt;
                      return (
                        <button
                          key={slot.startAt}
                          type="button"
                          onClick={() => setSelected(slot.startAt)}
                          className={[
                            "relative flex min-h-11 items-center justify-center rounded-2xl border text-sm font-black tabular-nums transition",
                            active
                              ? "border-[#7C4DFF] bg-[#7C4DFF] text-white shadow-sm"
                              : "border-slate-200 bg-white text-slate-800 hover:border-[#7C4DFF]/30",
                          ].join(" ")}
                        >
                          {formatTime(slot.startAt)}
                          {active ? (
                            <span className="absolute -bottom-1 -left-1 flex h-4 w-4 items-center justify-center rounded-full bg-white text-[#7C4DFF] shadow">
                              <Check className="h-2.5 w-2.5" strokeWidth={3} />
                            </span>
                          ) : null}
                        </button>
                      );
                    })}
                    {showMoreTimesButton ? (
                      <button
                        type="button"
                        onClick={() => setTimePage((p) => p + 1)}
                        className="flex min-h-11 flex-col items-center justify-center rounded-2xl border border-dashed border-[#7C4DFF]/40 bg-[#7C4DFF]/5 px-1 text-[11px] font-black text-[#7C4DFF]"
                      >
                        עוד זמנים
                      </button>
                    ) : null}
                  </div>
                  {timePage > 0 ? (
                    <button
                      type="button"
                      onClick={() => setTimePage((p) => Math.max(0, p - 1))}
                      className="mt-2 text-xs font-bold text-[#7C4DFF] hover:underline"
                    >
                      ← זמנים קודמים
                    </button>
                  ) : null}
                </section>

                <div className="flex items-start gap-2 text-xs font-semibold text-slate-500">
                  <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                  <span>כל המועדים מוצגים לפי שעון ישראל (GMT+3)</span>
                </div>

                {selected ? (
                  <p className="text-xs font-bold text-slate-600">נבחר: {formatWhen(selected)}</p>
                ) : null}
              </>
            ) : null}
          </div>
        )}
      </main>

      {!done && !data?.alreadyBooked && dates.length ? (
        <footer className="sticky bottom-0 shrink-0 border-t border-purple-100/80 bg-white/95 px-4 py-3 backdrop-blur sm:px-6">
          <div className="mx-auto flex w-full max-w-lg gap-2">
            <button
              type="button"
              onClick={goBack}
              className="inline-flex h-12 min-w-[96px] items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 text-sm font-black text-[#7C4DFF]"
            >
              חזרה
            </button>
            <button
              type="button"
              disabled={!selected || saving}
              onClick={book}
              className="inline-flex h-12 flex-1 items-center justify-center rounded-2xl bg-[#7C4DFF] px-4 text-sm font-black text-white shadow-sm disabled:opacity-50"
            >
              {saving ? "קובע מועד…" : "אישור תיאום"}
            </button>
          </div>
        </footer>
      ) : null}

      <DatePickerModal
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        dates={dates}
        selectedDateKey={selectedDateKey}
        onSelect={selectDate}
      />
    </div>
  );
}
