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
  };
}

export default function AdminBizuplyHours({
  initial,
  saving,
  onSave,
  onClose,
}: {
  initial: ReturnType<typeof hoursFromPayload>;
  saving: boolean;
  onSave: (payload: Record<string, unknown>) => void;
  onClose: () => void;
}) {
  const [weeklyHours, setWeeklyHours] = useState(initial.weeklyHours);
  const [minAdvanceMinutes, setMinAdvanceMinutes] = useState(initial.minAdvanceMinutes);
  const [bookingHorizonDays, setBookingHorizonDays] = useState(initial.bookingHorizonDays);
  const [bufferMinutes, setBufferMinutes] = useState(initial.bufferMinutes);
  const [blocked, setBlocked] = useState(initial.blockedPeriods);
  const [blockDraft, setBlockDraft] = useState({
    date: "",
    allDay: true,
    start: "12:00",
    end: "15:00",
    note: "",
  });

  const activeCount = useMemo(
    () => DAY_ROWS.filter(([day]) => (weeklyHours as any)[day]?.length).length,
    [weeklyHours]
  );

  function setDayEnabled(day: string, enabled: boolean) {
    setWeeklyHours((prev) => ({
      ...prev,
      [day]: enabled ? (prev[day as keyof typeof prev].length ? prev[day as keyof typeof prev] : [{ start: "09:00", end: "17:00" }]) : [],
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
    <div className="fixed inset-0 z-40 bg-black/40 p-3 sm:p-6" onClick={onClose}>
      <div
        className="mx-auto flex max-h-full max-w-4xl flex-col overflow-hidden rounded-[28px] bg-white"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="border-b px-5 py-4">
          <p className="text-xs font-black text-[#7C4DFF]">יומן BizUply</p>
          <h2 className="text-xl font-black text-purple-950">שעות פעילות</h2>
          <p className="font-bold text-slate-500">
            שעון ישראל · שיחה ראשונית — 15 דקות · {activeCount} ימים פעילים
          </p>
        </div>
        <div className="flex-1 space-y-4 overflow-y-auto px-4 py-4 sm:px-5">
          {DAY_ROWS.map(([day, label]) => {
            const windows = weeklyHours[day as keyof typeof weeklyHours] || [];
            const enabled = windows.length > 0;
            return (
              <CrmCard key={day}>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-lg font-black text-purple-950">{label}</h3>
                  <button
                    type="button"
                    onClick={() => setDayEnabled(day, !enabled)}
                    className={[
                      "min-h-11 rounded-2xl px-4 text-sm font-black",
                      enabled ? "bg-[#7C4DFF] text-white" : "border border-purple-100 bg-white text-slate-500",
                    ].join(" ")}
                  >
                    {enabled ? "פעיל" : "לא פעיל"}
                  </button>
                </div>
                {enabled ? (
                  <div className="mt-3 space-y-2">
                    <div className="hidden grid-cols-[1fr_1fr_auto] gap-2 text-xs font-black text-slate-400 md:grid">
                      <span>מ</span>
                      <span>עד</span>
                      <span />
                    </div>
                    {windows.map((window, index) => (
                      <div key={`${day}-${index}`} className="grid grid-cols-1 gap-2 md:grid-cols-[1fr_1fr_auto]">
                        <label className="text-sm font-bold text-slate-600">
                          <span className="md:hidden">מ</span>
                          <input
                            type="time"
                            className="mt-1 min-h-11 w-full rounded-2xl border px-3"
                            value={window.start}
                            onChange={(e) => updateWindow(day, index, "start", e.target.value)}
                          />
                        </label>
                        <label className="text-sm font-bold text-slate-600">
                          <span className="md:hidden">עד</span>
                          <input
                            type="time"
                            className="mt-1 min-h-11 w-full rounded-2xl border px-3"
                            value={window.end}
                            onChange={(e) => updateWindow(day, index, "end", e.target.value)}
                          />
                        </label>
                        <button
                          type="button"
                          className="min-h-11 rounded-2xl border border-rose-100 px-3 text-sm font-black text-rose-700"
                          onClick={() => removeWindow(day, index)}
                        >
                          הסרה
                        </button>
                      </div>
                    ))}
                    <SecondaryButton onClick={() => addWindow(day)}>+ הוסף טווח שעות</SecondaryButton>
                  </div>
                ) : (
                  <p className="mt-2 text-sm font-bold text-slate-400">לא פעיל</p>
                )}
              </CrmCard>
            );
          })}

          <CrmCard>
            <h3 className="font-black text-purple-950">כללי תיאום</h3>
            <div className="mt-3 grid gap-3 md:grid-cols-3">
              <label className="text-sm font-bold text-slate-600">
                כמה זמן מראש ניתן לקבוע שיחה
                <select
                  className="mt-1 min-h-11 w-full rounded-2xl border px-3"
                  value={minAdvanceMinutes}
                  onChange={(e) => setMinAdvanceMinutes(Number(e.target.value))}
                >
                  {NOTICE_OPTIONS.map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </label>
              <label className="text-sm font-bold text-slate-600">
                כמה זמן קדימה ניתן להזמין
                <select
                  className="mt-1 min-h-11 w-full rounded-2xl border px-3"
                  value={bookingHorizonDays}
                  onChange={(e) => setBookingHorizonDays(Number(e.target.value))}
                >
                  {HORIZON_OPTIONS.map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </label>
              <label className="text-sm font-bold text-slate-600">
                מרווח בין שיחות
                <select
                  className="mt-1 min-h-11 w-full rounded-2xl border px-3"
                  value={bufferMinutes}
                  onChange={(e) => setBufferMinutes(Number(e.target.value))}
                >
                  {BUFFER_OPTIONS.map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </label>
            </div>
          </CrmCard>

          <CrmCard>
            <h3 className="font-black text-purple-950">חסימות ביומן</h3>
            <p className="text-sm font-bold text-slate-500">ימים או טווחים שאינם זמינים לתיאום שיחה ראשונית.</p>
            <div className="mt-3 grid gap-2 md:grid-cols-2">
              <label className="text-sm font-bold">
                תאריך
                <input
                  type="date"
                  className="mt-1 min-h-11 w-full rounded-2xl border px-3"
                  value={blockDraft.date}
                  onChange={(e) => setBlockDraft((prev) => ({ ...prev, date: e.target.value }))}
                />
              </label>
              <label className="flex items-center gap-2 text-sm font-black">
                <input
                  type="checkbox"
                  checked={blockDraft.allDay}
                  onChange={(e) => setBlockDraft((prev) => ({ ...prev, allDay: e.target.checked }))}
                />
                לא זמין כל היום
              </label>
              {!blockDraft.allDay ? (
                <>
                  <label className="text-sm font-bold">
                    מ
                    <input
                      type="time"
                      className="mt-1 min-h-11 w-full rounded-2xl border px-3"
                      value={blockDraft.start}
                      onChange={(e) => setBlockDraft((prev) => ({ ...prev, start: e.target.value }))}
                    />
                  </label>
                  <label className="text-sm font-bold">
                    עד
                    <input
                      type="time"
                      className="mt-1 min-h-11 w-full rounded-2xl border px-3"
                      value={blockDraft.end}
                      onChange={(e) => setBlockDraft((prev) => ({ ...prev, end: e.target.value }))}
                    />
                  </label>
                </>
              ) : null}
              <label className="md:col-span-2 text-sm font-bold">
                הערה
                <input
                  className="mt-1 min-h-11 w-full rounded-2xl border px-3"
                  value={blockDraft.note}
                  onChange={(e) => setBlockDraft((prev) => ({ ...prev, note: e.target.value }))}
                  placeholder="חג / ישיבה / יום חופש"
                />
              </label>
            </div>
            <div className="mt-3">
              <SecondaryButton onClick={addBlock}>הוספת חסימה</SecondaryButton>
            </div>
            <div className="mt-3 space-y-2">
              {blocked.map((row, index) => (
                <div key={`${row.date}-${index}`} className="flex items-center justify-between gap-2 rounded-2xl bg-slate-50 px-3 py-2">
                  <p className="text-sm font-bold">
                    {row.allDay
                      ? `${row.date} — לא זמין כל היום`
                      : `${row.date} — ${row.start}–${row.end}`}
                    {row.note ? ` · ${row.note}` : ""}
                  </p>
                  <button
                    type="button"
                    className="text-sm font-black text-rose-700"
                    onClick={() => setBlocked((prev) => prev.filter((_, i) => i !== index))}
                  >
                    הסרה
                  </button>
                </div>
              ))}
              {!blocked.length ? <p className="text-sm font-bold text-slate-400">אין חסימות.</p> : null}
            </div>
          </CrmCard>
        </div>
        <div className="flex flex-wrap gap-2 border-t px-5 py-4">
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
              })
            }
          >
            שמירת שעות פעילות
          </PrimaryButton>
          <SecondaryButton onClick={onClose}>סגירה</SecondaryButton>
        </div>
      </div>
    </div>
  );
}
