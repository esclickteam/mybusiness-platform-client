import React, { useMemo, useState } from "react";
import {
  CrmCard,
  PrimaryButton,
  SecondaryButton,
} from "./crm/AdminCrmUi";

const DAY_ROWS: Array<[string, string]> = [
  ["sun", "ראשון"],
  ["mon", "שני"],
  ["tue", "שלישי"],
  ["wed", "רביעי"],
  ["thu", "חמישי"],
  ["fri", "שישי"],
  ["sat", "שבת"],
];

const NOTICE_OPTIONS = [
  [30, "30 דקות"],
  [60, "שעה"],
  [120, "שעתיים"],
  [240, "4 שעות"],
  [720, "12 שעות"],
  [1440, "24 שעות"],
];

const HORIZON_OPTIONS = [
  [7, "7 ימים"],
  [14, "14 ימים"],
  [30, "30 ימים"],
  [60, "60 ימים"],
];

const BUFFER_OPTIONS = [
  [0, "ללא"],
  [5, "5 דקות"],
  [10, "10 דקות"],
  [15, "15 דקות"],
  [30, "30 דקות"],
];

const DURATION_OPTIONS = [15, 30, 45, 60, 90, 120];

function emptyHours() {
  return {
    sun: [] as Array<{ start: string; end: string }>,
    mon: [] as Array<{ start: string; end: string }>,
    tue: [] as Array<{ start: string; end: string }>,
    wed: [] as Array<{ start: string; end: string }>,
    thu: [] as Array<{ start: string; end: string }>,
    fri: [] as Array<{ start: string; end: string }>,
    sat: [] as Array<{ start: string; end: string }>,
  };
}

function TimeInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      type="time"
      step={60}
      lang="en-GB"
      className={`min-h-9 rounded-xl border px-2 text-sm tabular-nums ${props.className || ""}`}
    />
  );
}

export function hoursFromPayload(data: any) {
  const availability = data?.availability || {};
  const weeklyHours = emptyHours();
  const source = availability.weeklyHours || data?.weeklyHours || {};
  for (const [day] of DAY_ROWS) {
    weeklyHours[day as keyof typeof weeklyHours] = (source[day] || []).map((row: any) => ({
      start: row.start || "09:00",
      end: row.end || "18:00",
    }));
  }
  const holidaySettings = availability.holidaySettings || data?.holidaySettings || {};
  return {
    weeklyHours,
    minAdvanceMinutes: Number(availability.minAdvanceMinutes || data?.introCall?.minAdvanceMinutes || 60),
    bookingHorizonDays: Number(availability.bookingHorizonDays || data?.introCall?.bookingHorizonDays || 30),
    bufferMinutes: Number(availability.bufferMinutes || data?.introCall?.bufferAfterMinutes || 0),
    blockedPeriods: (availability.blockedPeriods || data?.blockedPeriods || []).map((row: any) => ({
      id: row.id || "",
      date: row.date || "",
      allDay: row.allDay !== false && !row.start,
      start: row.start || "09:00",
      end: row.end || "17:00",
      note: row.note || "",
      label: row.label || "",
    })),
    holidaySettings: {
      blockHolidays: holidaySettings.blockHolidays !== false,
      blockHolidayEves: holidaySettings.blockHolidayEves !== false,
      holidayEveEndTime: holidaySettings.holidayEveEndTime || "13:00",
      overrides: (holidaySettings.overrides || []).map((row: any) => ({
        date: row.date,
        mode: row.mode || "open",
        note: row.note || "",
      })),
    },
    holidays: availability.holidays || data?.holidays || [],
    services: (data?.services || data?.visibleAppointmentTypes || []).map((row: any) => ({
      key: row.key,
      nameHe: row.nameHe,
      descriptionHe: row.descriptionHe || "",
      durationMinutes: Number(row.durationMinutes) || 15,
      active: row.active !== false,
      bufferBeforeMinutes: Number(row.bufferBeforeMinutes) || 0,
      bufferAfterMinutes: Number(row.bufferAfterMinutes) || 0,
      locked: row.key === "intro_call" || row.locked,
    })),
  };
}

export default function AdminBizuplyHours({
  initial,
  saving,
  onSave,
  onClose,
  initialTab = "hours",
}: {
  initial: ReturnType<typeof hoursFromPayload>;
  saving: boolean;
  onSave: (payload: Record<string, unknown>) => void;
  onClose: () => void;
  initialTab?: "hours" | "services" | "holidays" | "blocks";
}) {
  const [tab, setTab] = useState<"hours" | "services" | "holidays" | "blocks">(initialTab);
  const [weeklyHours, setWeeklyHours] = useState(initial.weeklyHours);
  const [minAdvanceMinutes, setMinAdvanceMinutes] = useState(initial.minAdvanceMinutes);
  const [bookingHorizonDays, setBookingHorizonDays] = useState(initial.bookingHorizonDays);
  const [bufferMinutes, setBufferMinutes] = useState(initial.bufferMinutes);
  const [blocked, setBlocked] = useState(initial.blockedPeriods);
  const [holidaySettings, setHolidaySettings] = useState(initial.holidaySettings);
  const [services, setServices] = useState(
    initial.services.length
      ? initial.services
      : [
          {
            key: "intro_call",
            nameHe: "שיחה ראשונית",
            descriptionHe: "",
            durationMinutes: 15,
            active: true,
            bufferBeforeMinutes: 0,
            bufferAfterMinutes: 0,
            locked: true,
          },
        ]
  );
  const [serviceDraft, setServiceDraft] = useState({
    nameHe: "",
    descriptionHe: "",
    durationMinutes: 30,
    bufferBeforeMinutes: 0,
    bufferAfterMinutes: 0,
  });
  const [blockDraft, setBlockDraft] = useState({
    date: "",
    allDay: true,
    start: "12:00",
    end: "15:00",
    note: "",
  });
  const [overrideDraft, setOverrideDraft] = useState({
    date: "",
    mode: "open",
    note: "",
  });

  const activeCount = useMemo(
    () => DAY_ROWS.filter(([day]) => (weeklyHours as any)[day]?.length).length,
    [weeklyHours]
  );

  function setDayEnabled(day: string, enabled: boolean) {
    setWeeklyHours((prev) => ({
      ...prev,
      [day]: enabled
        ? prev[day as keyof typeof prev].length
          ? prev[day as keyof typeof prev]
          : [{ start: "09:00", end: "18:00" }]
        : [],
    }));
  }

  function updateWindow(day: string, index: number, key: "start" | "end", value: string) {
    setWeeklyHours((prev) => {
      const next = [...prev[day as keyof typeof prev]];
      next[index] = { ...next[index], [key]: value };
      return { ...prev, [day]: next };
    });
  }

  function addWindow(day: string) {
    setWeeklyHours((prev) => ({
      ...prev,
      [day]: [...prev[day as keyof typeof prev], { start: "15:00", end: "18:00" }],
    }));
  }

  function removeWindow(day: string, index: number) {
    setWeeklyHours((prev) => ({
      ...prev,
      [day]: prev[day as keyof typeof prev].filter((_, i) => i !== index),
    }));
  }

  function addBlock() {
    if (!blockDraft.date) return;
    setBlocked((prev) => [
      ...prev,
      {
        id: "",
        date: blockDraft.date,
        allDay: blockDraft.allDay,
        start: blockDraft.start,
        end: blockDraft.end,
        note: blockDraft.note,
        label: "",
      },
    ]);
    setBlockDraft({ date: "", allDay: true, start: "12:00", end: "15:00", note: "" });
  }

  return (
    <div className="fixed inset-0 z-40 bg-black/40 p-2 sm:p-4" onClick={onClose}>
      <div
        className="mx-auto flex max-h-full max-w-3xl flex-col overflow-hidden rounded-[24px] bg-white"
        onClick={(e) => e.stopPropagation()}
        dir="rtl"
      >
        <div className="border-b px-4 py-3">
          <p className="text-xs font-black text-[#7C4DFF]">יומן BizUply</p>
          <h2 className="text-lg font-black text-purple-950">שעות פעילות ושירותים</h2>
          <p className="text-sm font-bold text-slate-500">
            שעון ישראל · 24 שעות · {activeCount} ימים פעילים
          </p>
          <div className="mt-2 flex flex-wrap gap-1">
            {([
              ["hours", "שעות"],
              ["services", "שירותים"],
              ["holidays", "חגים"],
              ["blocks", "חסימות"],
            ] as const).map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => setTab(key)}
                className={[
                  "min-h-9 rounded-xl px-3 text-sm font-black",
                  tab === key ? "bg-[#7C4DFF] text-white" : "border border-purple-100 text-slate-600",
                ].join(" ")}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 space-y-3 overflow-y-auto px-3 py-3 sm:px-4">
          {tab === "hours" ? (
            <>
              <div className="hidden md:grid md:grid-cols-[88px_72px_1fr_auto] md:gap-2 md:px-1 md:text-xs md:font-black md:text-slate-400">
                <span>יום</span>
                <span>פעיל</span>
                <span>טווחים 09:00 → 18:00</span>
                <span />
              </div>
              {DAY_ROWS.map(([day, label]) => {
                const windows = weeklyHours[day as keyof typeof weeklyHours] || [];
                const enabled = windows.length > 0;
                return (
                  <div
                    key={day}
                    className="rounded-2xl border border-purple-100 bg-slate-50/70 px-3 py-2 md:grid md:grid-cols-[88px_72px_1fr_auto] md:items-center md:gap-2 md:border-0 md:bg-transparent md:px-1 md:py-1"
                  >
                    <p className="font-black text-purple-950">{label}</p>
                    <button
                      type="button"
                      onClick={() => setDayEnabled(day, !enabled)}
                      className={[
                        "min-h-8 rounded-xl px-2 text-xs font-black",
                        enabled ? "bg-[#7C4DFF] text-white" : "border border-purple-100 bg-white text-slate-500",
                      ].join(" ")}
                    >
                      {enabled ? "פעיל" : "כבוי"}
                    </button>
                    <div className="mt-2 space-y-1 md:mt-0">
                      {enabled ? (
                        windows.map((window, index) => (
                          <div key={`${day}-${index}`} className="flex flex-wrap items-center gap-1">
                            <TimeInput value={window.start} onChange={(e) => updateWindow(day, index, "start", e.target.value)} />
                            <span className="text-xs font-black text-slate-400">→</span>
                            <TimeInput value={window.end} onChange={(e) => updateWindow(day, index, "end", e.target.value)} />
                            {windows.length > 1 ? (
                              <button type="button" className="text-xs font-black text-rose-700" onClick={() => removeWindow(day, index)}>
                                הסרה
                              </button>
                            ) : null}
                          </div>
                        ))
                      ) : (
                        <p className="text-xs font-bold text-slate-400">לא פעיל</p>
                      )}
                    </div>
                    {enabled ? (
                      <button type="button" className="min-h-8 text-xs font-black text-[#7C4DFF]" onClick={() => addWindow(day)}>
                        + טווח
                      </button>
                    ) : (
                      <span />
                    )}
                  </div>
                );
              })}
              <CrmCard className="!p-3">
                <h3 className="text-sm font-black text-purple-950">כללי תיאום לכל השירותים</h3>
                <div className="mt-2 grid gap-2 md:grid-cols-3">
                  <label className="text-xs font-bold text-slate-600">
                    מינימום מראש
                    <select className="mt-1 min-h-9 w-full rounded-xl border px-2 text-sm" value={minAdvanceMinutes} onChange={(e) => setMinAdvanceMinutes(Number(e.target.value))}>
                      {NOTICE_OPTIONS.map(([value, label]) => (
                        <option key={value} value={value}>{label}</option>
                      ))}
                    </select>
                  </label>
                  <label className="text-xs font-bold text-slate-600">
                    אופק הזמנה
                    <select className="mt-1 min-h-9 w-full rounded-xl border px-2 text-sm" value={bookingHorizonDays} onChange={(e) => setBookingHorizonDays(Number(e.target.value))}>
                      {HORIZON_OPTIONS.map(([value, label]) => (
                        <option key={value} value={value}>{label}</option>
                      ))}
                    </select>
                  </label>
                  <label className="text-xs font-bold text-slate-600">
                    מרווח בין שיחות
                    <select className="mt-1 min-h-9 w-full rounded-xl border px-2 text-sm" value={bufferMinutes} onChange={(e) => setBufferMinutes(Number(e.target.value))}>
                      {BUFFER_OPTIONS.map(([value, label]) => (
                        <option key={value} value={value}>{label}</option>
                      ))}
                    </select>
                  </label>
                </div>
              </CrmCard>
            </>
          ) : null}

          {tab === "services" ? (
            <div className="space-y-3">
              {services.map((row, index) => (
                <div key={row.key || index} className="rounded-2xl border border-purple-100 p-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="font-black text-purple-950">{row.nameHe}</p>
                      <p className="text-xs font-bold text-slate-500">
                        {row.key} · {row.durationMinutes} דקות
                        {row.locked ? " · שירות מובנה" : ""}
                      </p>
                    </div>
                    {row.locked ? (
                      <span className="rounded-full bg-purple-50 px-2 py-1 text-xs font-black text-[#7C4DFF]">פעיל תמיד</span>
                    ) : (
                      <button
                        type="button"
                        onClick={() =>
                          setServices((prev) =>
                            prev.map((item, i) => (i === index ? { ...item, active: !item.active } : item))
                          )
                        }
                        className={[
                          "min-h-8 rounded-xl px-3 text-xs font-black",
                          row.active ? "bg-[#7C4DFF] text-white" : "border text-slate-500",
                        ].join(" ")}
                      >
                        {row.active ? "פעיל" : "מושבת"}
                      </button>
                    )}
                  </div>
                  <textarea
                    className="mt-2 min-h-16 w-full rounded-xl border p-2 text-sm"
                    placeholder="תיאור"
                    value={row.descriptionHe}
                    onChange={(e) =>
                      setServices((prev) =>
                        prev.map((item, i) => (i === index ? { ...item, descriptionHe: e.target.value } : item))
                      )
                    }
                  />
                  <div className="mt-2 grid gap-2 md:grid-cols-3">
                    <label className="text-xs font-bold">
                      משך
                      <select
                        className="mt-1 min-h-9 w-full rounded-xl border px-2"
                        value={row.durationMinutes}
                        disabled={row.locked}
                        onChange={(e) =>
                          setServices((prev) =>
                            prev.map((item, i) =>
                              i === index ? { ...item, durationMinutes: Number(e.target.value) } : item
                            )
                          )
                        }
                      >
                        {DURATION_OPTIONS.map((value) => (
                          <option key={value} value={value}>{value} דקות</option>
                        ))}
                      </select>
                    </label>
                    <label className="text-xs font-bold">
                      באפר לפני
                      <select
                        className="mt-1 min-h-9 w-full rounded-xl border px-2"
                        value={row.bufferBeforeMinutes}
                        onChange={(e) =>
                          setServices((prev) =>
                            prev.map((item, i) =>
                              i === index ? { ...item, bufferBeforeMinutes: Number(e.target.value) } : item
                            )
                          )
                        }
                      >
                        {BUFFER_OPTIONS.map(([value, label]) => (
                          <option key={value} value={value}>{label}</option>
                        ))}
                      </select>
                    </label>
                    <label className="text-xs font-bold">
                      באפר אחרי
                      <select
                        className="mt-1 min-h-9 w-full rounded-xl border px-2"
                        value={row.bufferAfterMinutes}
                        onChange={(e) =>
                          setServices((prev) =>
                            prev.map((item, i) =>
                              i === index ? { ...item, bufferAfterMinutes: Number(e.target.value) } : item
                            )
                          )
                        }
                      >
                        {BUFFER_OPTIONS.map(([value, label]) => (
                          <option key={value} value={value}>{label}</option>
                        ))}
                      </select>
                    </label>
                  </div>
                </div>
              ))}
              <div className="rounded-2xl border border-dashed border-purple-200 p-3">
                <h3 className="font-black">שירות חדש</h3>
                <input
                  className="mt-2 min-h-9 w-full rounded-xl border px-3"
                  placeholder="שם השירות"
                  value={serviceDraft.nameHe}
                  onChange={(e) => setServiceDraft((prev) => ({ ...prev, nameHe: e.target.value }))}
                />
                <textarea
                  className="mt-2 min-h-16 w-full rounded-xl border p-2 text-sm"
                  placeholder="תיאור"
                  value={serviceDraft.descriptionHe}
                  onChange={(e) => setServiceDraft((prev) => ({ ...prev, descriptionHe: e.target.value }))}
                />
                <label className="mt-2 block text-xs font-bold">
                  משך
                  <select
                    className="mt-1 min-h-9 w-full rounded-xl border px-2"
                    value={serviceDraft.durationMinutes}
                    onChange={(e) => setServiceDraft((prev) => ({ ...prev, durationMinutes: Number(e.target.value) }))}
                  >
                    {DURATION_OPTIONS.map((value) => (
                      <option key={value} value={value}>{value} דקות</option>
                    ))}
                  </select>
                </label>
                <div className="mt-2">
                  <SecondaryButton
                    onClick={() => {
                      if (!serviceDraft.nameHe.trim()) return;
                      setServices((prev) => [
                        ...prev,
                        {
                          key: "",
                          nameHe: serviceDraft.nameHe.trim(),
                          descriptionHe: serviceDraft.descriptionHe,
                          durationMinutes: serviceDraft.durationMinutes,
                          active: true,
                          bufferBeforeMinutes: serviceDraft.bufferBeforeMinutes,
                          bufferAfterMinutes: serviceDraft.bufferAfterMinutes,
                          locked: false,
                        },
                      ]);
                      setServiceDraft({
                        nameHe: "",
                        descriptionHe: "",
                        durationMinutes: 30,
                        bufferBeforeMinutes: 0,
                        bufferAfterMinutes: 0,
                      });
                    }}
                  >
                    הוספת שירות
                  </SecondaryButton>
                </div>
              </div>
            </div>
          ) : null}

          {tab === "holidays" ? (
            <div className="space-y-3">
              <label className="flex items-center gap-2 font-black">
                <input
                  type="checkbox"
                  checked={holidaySettings.blockHolidays}
                  onChange={(e) => setHolidaySettings((prev) => ({ ...prev, blockHolidays: e.target.checked }))}
                />
                חסום חגים אוטומטית
              </label>
              <label className="flex items-center gap-2 font-black">
                <input
                  type="checkbox"
                  checked={holidaySettings.blockHolidayEves}
                  onChange={(e) => setHolidaySettings((prev) => ({ ...prev, blockHolidayEves: e.target.checked }))}
                />
                קיצור ערבי חג
              </label>
              <label className="text-xs font-bold">
                סיום פעילות בערב חג
                <TimeInput
                  className="mt-1 block"
                  value={holidaySettings.holidayEveEndTime}
                  onChange={(e) => setHolidaySettings((prev) => ({ ...prev, holidayEveEndTime: e.target.value }))}
                />
              </label>
              <div>
                <h3 className="text-sm font-black">חגים קרובים</h3>
                <div className="mt-2 max-h-48 space-y-1 overflow-y-auto">
                  {(initial.holidays || []).slice(0, 40).map((row: any) => (
                    <p key={`${row.date}-${row.nameHe}`} className="text-sm font-bold text-slate-600">
                      {row.date} · {row.nameHe}
                      {row.kind === "eve" ? " · ערב" : ""}
                      {row.overridden ? " · דריסה ידנית" : ""}
                    </p>
                  ))}
                </div>
              </div>
              <div className="rounded-2xl border border-purple-100 p-3">
                <h3 className="text-sm font-black">דריסת תאריך</h3>
                <div className="mt-2 grid gap-2 md:grid-cols-3">
                  <input type="date" className="min-h-9 rounded-xl border px-2" value={overrideDraft.date} onChange={(e) => setOverrideDraft((prev) => ({ ...prev, date: e.target.value }))} />
                  <select className="min-h-9 rounded-xl border px-2" value={overrideDraft.mode} onChange={(e) => setOverrideDraft((prev) => ({ ...prev, mode: e.target.value }))}>
                    <option value="open">פתוח</option>
                    <option value="block">חסום</option>
                    <option value="eve">ערב חג</option>
                  </select>
                  <input className="min-h-9 rounded-xl border px-2" placeholder="הערה" value={overrideDraft.note} onChange={(e) => setOverrideDraft((prev) => ({ ...prev, note: e.target.value }))} />
                </div>
                <div className="mt-2">
                  <SecondaryButton
                    onClick={() => {
                      if (!overrideDraft.date) return;
                      setHolidaySettings((prev) => ({
                        ...prev,
                        overrides: [...prev.overrides.filter((row) => row.date !== overrideDraft.date), { ...overrideDraft }],
                      }));
                      setOverrideDraft({ date: "", mode: "open", note: "" });
                    }}
                  >
                    שמירת דריסה
                  </SecondaryButton>
                </div>
                <div className="mt-2 space-y-1">
                  {holidaySettings.overrides.map((row) => (
                    <div key={row.date} className="flex items-center justify-between text-sm font-bold">
                      <span>
                        {row.date} · {row.mode === "open" ? "פתוח" : row.mode === "eve" ? "ערב" : "חסום"}
                        {row.note ? ` · ${row.note}` : ""}
                      </span>
                      <button
                        type="button"
                        className="text-rose-700"
                        onClick={() =>
                          setHolidaySettings((prev) => ({
                            ...prev,
                            overrides: prev.overrides.filter((item) => item.date !== row.date),
                          }))
                        }
                      >
                        הסרה
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : null}

          {tab === "blocks" ? (
            <div className="space-y-3">
              <p className="text-sm font-bold text-slate-500">חסימות ידניות / חופשות פנימיות. לא דורשות לקוח CRM.</p>
              <div className="grid gap-2 md:grid-cols-2">
                <input type="date" className="min-h-9 rounded-xl border px-2" value={blockDraft.date} onChange={(e) => setBlockDraft((prev) => ({ ...prev, date: e.target.value }))} />
                <label className="flex items-center gap-2 text-sm font-black">
                  <input type="checkbox" checked={blockDraft.allDay} onChange={(e) => setBlockDraft((prev) => ({ ...prev, allDay: e.target.checked }))} />
                  כל היום
                </label>
                {!blockDraft.allDay ? (
                  <>
                    <TimeInput value={blockDraft.start} onChange={(e) => setBlockDraft((prev) => ({ ...prev, start: e.target.value }))} />
                    <TimeInput value={blockDraft.end} onChange={(e) => setBlockDraft((prev) => ({ ...prev, end: e.target.value }))} />
                  </>
                ) : null}
                <input className="min-h-9 rounded-xl border px-2 md:col-span-2" placeholder="הערה" value={blockDraft.note} onChange={(e) => setBlockDraft((prev) => ({ ...prev, note: e.target.value }))} />
              </div>
              <SecondaryButton onClick={addBlock}>הוספת חסימה</SecondaryButton>
              {blocked.map((row, index) => (
                <div key={`${row.date}-${index}`} className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2 text-sm font-bold">
                  <span>
                    {row.allDay ? `${row.date} — כל היום` : `${row.date} — ${row.start}–${row.end}`}
                    {row.note ? ` · ${row.note}` : ""}
                  </span>
                  <button type="button" className="text-rose-700" onClick={() => setBlocked((prev) => prev.filter((_, i) => i !== index))}>
                    הסרה
                  </button>
                </div>
              ))}
            </div>
          ) : null}
        </div>

        <div className="flex flex-wrap gap-2 border-t px-4 py-3">
          <PrimaryButton
            disabled={saving}
            onClick={() =>
              onSave({
                weeklyHours,
                minAdvanceMinutes,
                bookingHorizonDays,
                bufferMinutes,
                blockedPeriods: blocked.map((row) => ({
                  date: row.date,
                  allDay: row.allDay,
                  start: row.allDay ? undefined : row.start,
                  end: row.allDay ? undefined : row.end,
                  note: row.note,
                })),
                holidaySettings,
                services,
              })
            }
          >
            שמירה
          </PrimaryButton>
          <SecondaryButton onClick={onClose}>סגירה</SecondaryButton>
        </div>
      </div>
    </div>
  );
}
