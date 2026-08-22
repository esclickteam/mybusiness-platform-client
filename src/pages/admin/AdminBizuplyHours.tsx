import React, { useMemo, useState } from "react";
import {
  CompactInput,
  CompactSelect,
  CompactTextarea,
  PrimaryButton,
  SecondaryButton,
  SectionLabel,
} from "./crm/AdminCrmUi";
import { AdminModal } from "./crm/AdminModal";

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
      className={`h-8 w-[5.5rem] rounded-lg border border-slate-200 px-1.5 text-sm tabular-nums ${props.className || ""}`}
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

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "h-8 rounded-lg px-3 text-xs font-semibold transition",
        active ? "bg-[#7C4DFF] text-white" : "text-slate-600 hover:bg-slate-100",
      ].join(" ")}
    >
      {children}
    </button>
  );
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
  const [serviceDraftOpen, setServiceDraftOpen] = useState(false);
  const [editingService, setEditingService] = useState<number | null>(null);
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

  const sortedServices = useMemo(() => {
    const intro = services.filter((s) => s.key === "intro_call" || s.locked);
    const rest = services.filter((s) => s.key !== "intro_call" && !s.locked);
    return [...intro, ...rest];
  }, [services]);

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

  function addService() {
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
    setServiceDraftOpen(false);
  }

  const tabLabels: Record<typeof tab, string> = {
    hours: "שעות פעילות",
    services: "שירותים",
    holidays: "חגים",
    blocks: "חסימות",
  };

  const footer = (
    <>
      <PrimaryButton
        compact
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
        {saving ? "שומר…" : "שמירה"}
      </PrimaryButton>
      <SecondaryButton compact onClick={onClose}>
        סגירה
      </SecondaryButton>
    </>
  );

  return (
    <AdminModal
      open
      onClose={onClose}
      eyebrow="יומן BizUply"
      title={tabLabels[tab]}
      subtitle={`שעון ישראל · 24 שעות · ${activeCount} ימים פעילים`}
      footer={footer}
      size="lg"
    >
      <div className="mb-3 flex flex-wrap gap-1 border-b border-slate-100 pb-2">
        {([
          ["hours", "שעות"],
          ["services", "שירותים"],
          ["holidays", "חגים"],
          ["blocks", "חסימות"],
        ] as const).map(([key, label]) => (
          <TabButton key={key} active={tab === key} onClick={() => setTab(key)}>
            {label}
          </TabButton>
        ))}
      </div>

      {tab === "hours" ? (
        <>
          <div className="hidden md:grid md:grid-cols-[72px_56px_1fr_56px] md:gap-x-2 md:gap-y-0 md:border-b md:border-slate-100 md:pb-1.5 md:text-[10px] md:font-semibold md:uppercase md:tracking-wide md:text-slate-400">
            <span>יום</span>
            <span>פעיל</span>
            <span>טווחים</span>
            <span />
          </div>
          <div className="divide-y divide-slate-100 md:divide-y-0">
            {DAY_ROWS.map(([day, label]) => {
              const windows = weeklyHours[day as keyof typeof weeklyHours] || [];
              const enabled = windows.length > 0;
              return (
                <div
                  key={day}
                  className="py-2 md:grid md:grid-cols-[72px_56px_1fr_56px] md:items-center md:gap-x-2 md:py-1.5"
                >
                  <p className="text-sm font-semibold text-slate-800">{label}</p>
                  <button
                    type="button"
                    onClick={() => setDayEnabled(day, !enabled)}
                    className={[
                      "h-7 rounded-md px-2 text-[11px] font-semibold",
                      enabled ? "bg-[#7C4DFF] text-white" : "bg-slate-100 text-slate-500",
                    ].join(" ")}
                  >
                    {enabled ? "פעיל" : "כבוי"}
                  </button>
                  <div className="mt-1.5 md:mt-0">
                    {enabled ? (
                      <div className="space-y-1">
                        {windows.map((window, index) => (
                          <div key={`${day}-${index}`} className="flex flex-wrap items-center gap-1">
                            <TimeInput value={window.start} onChange={(e) => updateWindow(day, index, "start", e.target.value)} />
                            <span className="text-[10px] text-slate-400">→</span>
                            <TimeInput value={window.end} onChange={(e) => updateWindow(day, index, "end", e.target.value)} />
                            {windows.length > 1 ? (
                              <button type="button" className="text-[11px] font-medium text-rose-600" onClick={() => removeWindow(day, index)}>
                                הסרה
                              </button>
                            ) : null}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-[11px] text-slate-400">לא פעיל</p>
                    )}
                  </div>
                  {enabled ? (
                    <button type="button" className="mt-1 text-[11px] font-semibold text-[#7C4DFF] md:mt-0" onClick={() => addWindow(day)}>
                      + טווח
                    </button>
                  ) : (
                    <span />
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50/50 p-3">
            <SectionLabel>כללי תיאום לכל השירותים</SectionLabel>
            <div className="grid gap-2 sm:grid-cols-3">
              <label className="text-xs text-slate-600">
                מינימום מראש
                <CompactSelect className="mt-1" value={minAdvanceMinutes} onChange={(e) => setMinAdvanceMinutes(Number(e.target.value))}>
                  {NOTICE_OPTIONS.map(([value, lbl]) => (
                    <option key={value} value={value}>{lbl}</option>
                  ))}
                </CompactSelect>
              </label>
              <label className="text-xs text-slate-600">
                אופק הזמנה
                <CompactSelect className="mt-1" value={bookingHorizonDays} onChange={(e) => setBookingHorizonDays(Number(e.target.value))}>
                  {HORIZON_OPTIONS.map(([value, lbl]) => (
                    <option key={value} value={value}>{lbl}</option>
                  ))}
                </CompactSelect>
              </label>
              <label className="text-xs text-slate-600">
                מרווח בין שיחות
                <CompactSelect className="mt-1" value={bufferMinutes} onChange={(e) => setBufferMinutes(Number(e.target.value))}>
                  {BUFFER_OPTIONS.map(([value, lbl]) => (
                    <option key={value} value={value}>{lbl}</option>
                  ))}
                </CompactSelect>
              </label>
            </div>
          </div>
        </>
      ) : null}

      {tab === "services" ? (
        <div className="space-y-1">
          <div className="hidden text-[10px] font-semibold uppercase tracking-wide text-slate-400 sm:grid sm:grid-cols-[1fr_64px_64px_64px_72px_56px] sm:gap-2 sm:px-1 sm:pb-1">
            <span>שם</span>
            <span>משך</span>
            <span>לפני</span>
            <span>אחרי</span>
            <span>סטטוס</span>
            <span />
          </div>
          {sortedServices.map((row, index) => {
            const realIndex = services.findIndex((s) => s === row);
            const isEditing = editingService === realIndex;
            return (
              <div
                key={row.key || `svc-${index}`}
                className="rounded-lg border border-slate-100 bg-white sm:grid sm:grid-cols-[1fr_64px_64px_64px_72px_56px] sm:items-center sm:gap-2 sm:px-2 sm:py-1.5"
              >
                {isEditing && !row.locked ? (
                  <div className="col-span-full space-y-2 p-2">
                    <CompactInput
                      value={row.nameHe}
                      onChange={(e) =>
                        setServices((prev) =>
                          prev.map((item, i) => (i === realIndex ? { ...item, nameHe: e.target.value } : item))
                        )
                      }
                    />
                    <CompactTextarea
                      placeholder="תיאור"
                      value={row.descriptionHe}
                      onChange={(e) =>
                        setServices((prev) =>
                          prev.map((item, i) => (i === realIndex ? { ...item, descriptionHe: e.target.value } : item))
                        )
                      }
                    />
                    <div className="grid grid-cols-3 gap-2">
                      <label className="text-[11px] text-slate-500">
                        משך
                        <CompactSelect
                          className="mt-0.5"
                          value={row.durationMinutes}
                          onChange={(e) =>
                            setServices((prev) =>
                              prev.map((item, i) =>
                                i === realIndex ? { ...item, durationMinutes: Number(e.target.value) } : item
                              )
                            )
                          }
                        >
                          {DURATION_OPTIONS.map((v) => (
                            <option key={v} value={v}>{v} דק׳</option>
                          ))}
                        </CompactSelect>
                      </label>
                      <label className="text-[11px] text-slate-500">
                        לפני
                        <CompactSelect
                          className="mt-0.5"
                          value={row.bufferBeforeMinutes}
                          onChange={(e) =>
                            setServices((prev) =>
                              prev.map((item, i) =>
                                i === realIndex ? { ...item, bufferBeforeMinutes: Number(e.target.value) } : item
                              )
                            )
                          }
                        >
                          {BUFFER_OPTIONS.map(([v, lbl]) => (
                            <option key={v} value={v}>{lbl}</option>
                          ))}
                        </CompactSelect>
                      </label>
                      <label className="text-[11px] text-slate-500">
                        אחרי
                        <CompactSelect
                          className="mt-0.5"
                          value={row.bufferAfterMinutes}
                          onChange={(e) =>
                            setServices((prev) =>
                              prev.map((item, i) =>
                                i === realIndex ? { ...item, bufferAfterMinutes: Number(e.target.value) } : item
                              )
                            )
                          }
                        >
                          {BUFFER_OPTIONS.map(([v, lbl]) => (
                            <option key={v} value={v}>{lbl}</option>
                          ))}
                        </CompactSelect>
                      </label>
                    </div>
                    <button type="button" className="text-xs font-semibold text-[#7C4DFF]" onClick={() => setEditingService(null)}>
                      סיום עריכה
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="px-2 py-1.5 sm:px-0 sm:py-0">
                      <p className="text-sm font-semibold text-slate-900">{row.nameHe}</p>
                      {row.descriptionHe ? (
                        <p className="truncate text-[11px] text-slate-500">{row.descriptionHe}</p>
                      ) : null}
                      {row.locked ? (
                        <span className="text-[10px] font-medium text-[#7C4DFF]">ברירת מחדל</span>
                      ) : null}
                    </div>
                    <span className="hidden text-xs text-slate-600 sm:block">{row.durationMinutes} דק׳</span>
                    <span className="hidden text-xs text-slate-500 sm:block">{row.bufferBeforeMinutes || "—"}</span>
                    <span className="hidden text-xs text-slate-500 sm:block">{row.bufferAfterMinutes || "—"}</span>
                    <div className="px-2 pb-1 sm:px-0 sm:pb-0">
                      {row.locked ? (
                        <span className="inline-flex rounded-md bg-emerald-50 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-700">
                          פעיל
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() =>
                            setServices((prev) =>
                              prev.map((item, i) => (i === realIndex ? { ...item, active: !item.active } : item))
                            )
                          }
                          className={[
                            "rounded-md px-1.5 py-0.5 text-[10px] font-semibold",
                            row.active ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500",
                          ].join(" ")}
                        >
                          {row.active ? "פעיל" : "מושבת"}
                        </button>
                      )}
                    </div>
                    <div className="px-2 pb-1.5 sm:px-0 sm:pb-0">
                      {!row.locked ? (
                        <button
                          type="button"
                          className="text-[11px] font-semibold text-[#7C4DFF]"
                          onClick={() => setEditingService(realIndex)}
                        >
                          עריכה
                        </button>
                      ) : null}
                    </div>
                  </>
                )}
              </div>
            );
          })}

          {!serviceDraftOpen ? (
            <button
              type="button"
              className="mt-2 flex h-8 w-full items-center justify-center gap-1 rounded-lg border border-dashed border-slate-300 text-xs font-semibold text-[#7C4DFF] transition hover:border-[#7C4DFF]/40 hover:bg-[#7C4DFF]/5"
              onClick={() => setServiceDraftOpen(true)}
            >
              + הוספת שירות
            </button>
          ) : (
            <div className="mt-2 rounded-lg border border-slate-200 bg-slate-50/60 p-3">
              <p className="mb-2 text-xs font-semibold text-slate-700">שירות חדש</p>
              <div className="grid gap-2 sm:grid-cols-2">
                <CompactInput
                  placeholder="שם השירות"
                  value={serviceDraft.nameHe}
                  onChange={(e) => setServiceDraft((prev) => ({ ...prev, nameHe: e.target.value }))}
                />
                <CompactSelect
                  value={serviceDraft.durationMinutes}
                  onChange={(e) => setServiceDraft((prev) => ({ ...prev, durationMinutes: Number(e.target.value) }))}
                >
                  {DURATION_OPTIONS.map((v) => (
                    <option key={v} value={v}>{v} דקות</option>
                  ))}
                </CompactSelect>
              </div>
              <CompactTextarea
                className="mt-2"
                placeholder="תיאור (אופציונלי)"
                value={serviceDraft.descriptionHe}
                onChange={(e) => setServiceDraft((prev) => ({ ...prev, descriptionHe: e.target.value }))}
              />
              <div className="mt-2 flex gap-1.5">
                <PrimaryButton compact onClick={addService}>
                  הוספה
                </PrimaryButton>
                <SecondaryButton compact onClick={() => setServiceDraftOpen(false)}>
                  ביטול
                </SecondaryButton>
              </div>
            </div>
          )}
        </div>
      ) : null}

      {tab === "holidays" ? (
        <div className="space-y-3">
          <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
            <input
              type="checkbox"
              className="rounded"
              checked={holidaySettings.blockHolidays}
              onChange={(e) => setHolidaySettings((prev) => ({ ...prev, blockHolidays: e.target.checked }))}
            />
            חסום חגים אוטומטית
          </label>
          <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
            <input
              type="checkbox"
              className="rounded"
              checked={holidaySettings.blockHolidayEves}
              onChange={(e) => setHolidaySettings((prev) => ({ ...prev, blockHolidayEves: e.target.checked }))}
            />
            קיצור ערבי חג
          </label>
          <label className="text-xs text-slate-600">
            סיום פעילות בערב חג
            <TimeInput
              className="mt-1 block w-[5.5rem]"
              value={holidaySettings.holidayEveEndTime}
              onChange={(e) => setHolidaySettings((prev) => ({ ...prev, holidayEveEndTime: e.target.value }))}
            />
          </label>
          <div>
            <SectionLabel>חגים קרובים</SectionLabel>
            <div className="max-h-36 space-y-0.5 overflow-y-auto rounded-lg border border-slate-100 p-2">
              {(initial.holidays || []).slice(0, 40).map((row: any) => (
                <p key={`${row.date}-${row.nameHe}`} className="text-xs text-slate-600">
                  {row.date} · {row.nameHe}
                  {row.kind === "eve" ? " · ערב" : ""}
                  {row.overridden ? " · דריסה ידנית" : ""}
                </p>
              ))}
            </div>
          </div>
          <div className="rounded-lg border border-slate-200 p-3">
            <SectionLabel>דריסת תאריך</SectionLabel>
            <div className="grid gap-2 sm:grid-cols-3">
              <input type="date" className="h-8 rounded-lg border border-slate-200 px-2 text-sm" value={overrideDraft.date} onChange={(e) => setOverrideDraft((prev) => ({ ...prev, date: e.target.value }))} />
              <CompactSelect value={overrideDraft.mode} onChange={(e) => setOverrideDraft((prev) => ({ ...prev, mode: e.target.value }))}>
                <option value="open">פתוח</option>
                <option value="block">חסום</option>
                <option value="eve">ערב חג</option>
              </CompactSelect>
              <CompactInput placeholder="הערה" value={overrideDraft.note} onChange={(e) => setOverrideDraft((prev) => ({ ...prev, note: e.target.value }))} />
            </div>
            <div className="mt-2">
              <SecondaryButton
                compact
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
            <div className="mt-2 space-y-0.5">
              {holidaySettings.overrides.map((row) => (
                <div key={row.date} className="flex items-center justify-between text-xs">
                  <span className="text-slate-600">
                    {row.date} · {row.mode === "open" ? "פתוח" : row.mode === "eve" ? "ערב" : "חסום"}
                    {row.note ? ` · ${row.note}` : ""}
                  </span>
                  <button
                    type="button"
                    className="font-medium text-rose-600"
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
          <p className="text-xs text-slate-500">חסימות ידניות / חופשות פנימיות. לא דורשות לקוח CRM.</p>
          <div className="grid gap-2 sm:grid-cols-2">
            <input type="date" className="h-8 rounded-lg border border-slate-200 px-2 text-sm" value={blockDraft.date} onChange={(e) => setBlockDraft((prev) => ({ ...prev, date: e.target.value }))} />
            <label className="flex items-center gap-2 text-xs font-medium text-slate-700">
              <input type="checkbox" checked={blockDraft.allDay} onChange={(e) => setBlockDraft((prev) => ({ ...prev, allDay: e.target.checked }))} />
              כל היום
            </label>
            {!blockDraft.allDay ? (
              <>
                <TimeInput value={blockDraft.start} onChange={(e) => setBlockDraft((prev) => ({ ...prev, start: e.target.value }))} />
                <TimeInput value={blockDraft.end} onChange={(e) => setBlockDraft((prev) => ({ ...prev, end: e.target.value }))} />
              </>
            ) : null}
            <CompactInput className="sm:col-span-2" placeholder="הערה" value={blockDraft.note} onChange={(e) => setBlockDraft((prev) => ({ ...prev, note: e.target.value }))} />
          </div>
          <SecondaryButton compact onClick={addBlock}>הוספת חסימה</SecondaryButton>
          {blocked.map((row, index) => (
            <div key={`${row.date}-${index}`} className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-1.5 text-xs">
              <span className="text-slate-700">
                {row.allDay ? `${row.date} — כל היום` : `${row.date} — ${row.start}–${row.end}`}
                {row.note ? ` · ${row.note}` : ""}
              </span>
              <button type="button" className="font-medium text-rose-600" onClick={() => setBlocked((prev) => prev.filter((_, i) => i !== index))}>
                הסרה
              </button>
            </div>
          ))}
        </div>
      ) : null}
    </AdminModal>
  );
}
