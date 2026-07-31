import React, { useEffect, useMemo, useState } from "react";

import {
  createPublicBooking,
  getPublicBookingServices,
  getPublicBookingSlots,
  type PublicBookingService,
} from "../../../api/publicBookingApi";

export type BookingWidgetVariant = "week" | "month";

export type BookingWidgetTheme = {
  accent?: string;
  ink?: string;
  muted?: string;
  surface?: string;
  line?: string;
  soft?: string;
  onAccent?: string;
  onInk?: string;
};

type BookingWidgetProps = {
  businessId?: string;
  pluginEnabled?: boolean;
  preview?: boolean;
  editorMode?: boolean;
  variant?: BookingWidgetVariant;
  theme?: BookingWidgetTheme;
};

const HEB_DAYS = ["א", "ב", "ג", "ד", "ה", "ו", "ש"];
const HEB_MONTHS = [
  "ינואר",
  "פברואר",
  "מרץ",
  "אפריל",
  "מאי",
  "יוני",
  "יולי",
  "אוגוסט",
  "ספטמבר",
  "אוקטובר",
  "נובמבר",
  "דצמבר",
];

const DEMO_SERVICES: PublicBookingService[] = [
  { _id: "demo-1", name: "ייעוץ ראשוני", duration: 30, price: 150 },
  { _id: "demo-2", name: "טיפול / מפגש", duration: 60, price: 280 },
  { _id: "demo-3", name: "חבילת ליווי", duration: 90, price: 450 },
];

const DEMO_SLOTS = ["09:00", "10:30", "12:00", "14:00", "16:30", "18:00"];

function formatDateKey(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function startOfDay(date: Date) {
  const next = new Date(date);
  next.setHours(12, 0, 0, 0);
  return next;
}

function daysFromOffset(startOffset: number, count: number) {
  const days: Date[] = [];
  const start = startOfDay(new Date());
  start.setDate(start.getDate() + startOffset);
  for (let i = 0; i < count; i += 1) {
    const day = new Date(start);
    day.setDate(start.getDate() + i);
    days.push(day);
  }
  return days;
}

function buildMonthCells(year: number, month: number) {
  const first = new Date(year, month, 1, 12);
  const startPad = first.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: Array<Date | null> = [];
  for (let i = 0; i < startPad; i += 1) cells.push(null);
  for (let day = 1; day <= daysInMonth; day += 1) {
    cells.push(new Date(year, month, day, 12));
  }
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

function serviceIdOf(service: PublicBookingService) {
  return String(service._id || service.id || "");
}

function resolveTheme(theme?: BookingWidgetTheme) {
  const accent = String(theme?.accent || "#0f766e").trim() || "#0f766e";
  const ink = String(theme?.ink || "#111827").trim() || "#111827";
  const muted = String(theme?.muted || "#6b7280").trim() || "#6b7280";
  const surface = String(theme?.surface || "#ffffff").trim() || "#ffffff";
  const line = String(theme?.line || "#e5e7eb").trim() || "#e5e7eb";
  const soft = String(theme?.soft || "#f3f4f6").trim() || "#f3f4f6";
  const onAccent =
    String(theme?.onAccent || "#ffffff").trim() || "#ffffff";
  const onInk = String(theme?.onInk || "#ffffff").trim() || "#ffffff";
  return { accent, ink, muted, surface, line, soft, onAccent, onInk };
}

function buildStyles(t: ReturnType<typeof resolveTheme>) {
  const styles: Record<string, React.CSSProperties> = {
    root: {
      boxSizing: "border-box",
      width: "100%",
      height: "100%",
      minHeight: 280,
      padding: 16,
      borderRadius: 20,
      background: t.surface,
      border: `1px solid ${t.line}`,
      fontFamily:
        "Heebo, Assistant, system-ui, -apple-system, Segoe UI, sans-serif",
      display: "flex",
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 16,
      color: t.ink,
      alignItems: "stretch",
    },
    servicesCol: {
      flex: "1 1 200px",
      minWidth: 180,
      maxWidth: 280,
      display: "flex",
      flexDirection: "column",
      gap: 12,
      borderLeft: `1px solid ${t.line}`,
      paddingLeft: 14,
    },
    calendarCol: {
      flex: "2 1 280px",
      minWidth: 240,
      display: "flex",
      flexDirection: "column",
      gap: 12,
    },
    header: {
      display: "flex",
      flexDirection: "column",
      gap: 4,
    },
    eyebrow: {
      margin: 0,
      fontSize: 11,
      fontWeight: 800,
      letterSpacing: "0.12em",
      color: t.accent,
    },
    title: {
      margin: 0,
      fontSize: 20,
      fontWeight: 800,
      color: t.ink,
      lineHeight: 1.2,
    },
    copy: {
      margin: 0,
      fontSize: 13,
      fontWeight: 600,
      color: t.muted,
      lineHeight: 1.5,
    },
    serviceList: {
      display: "grid",
      gap: 8,
      overflow: "auto",
      maxHeight: "100%",
      flex: 1,
    },
    serviceBtn: {
      textAlign: "right" as const,
      border: `1px solid ${t.line}`,
      background: t.surface,
      borderRadius: 12,
      padding: "10px 12px",
      display: "flex",
      flexDirection: "column" as const,
      gap: 3,
      cursor: "pointer",
      color: t.ink,
    },
    serviceBtnActive: {
      border: `2px solid ${t.accent}`,
      background: t.soft,
      boxShadow: `inset 3px 0 0 ${t.accent}`,
    },
    weekNav: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 8,
    },
    weekRow: {
      display: "grid",
      gridTemplateColumns: "repeat(7, minmax(0, 1fr))",
      gap: 6,
    },
    weekPill: {
      border: `1px solid ${t.line}`,
      background: t.surface,
      borderRadius: 12,
      padding: "8px 2px",
      display: "flex",
      flexDirection: "column" as const,
      alignItems: "center",
      gap: 2,
      cursor: "pointer",
      color: t.ink,
    },
    weekPillActive: {
      background: t.ink,
      borderColor: t.ink,
      color: t.onInk,
    },
    weekName: { fontSize: 10, fontWeight: 800, opacity: 0.75 },
    weekNum: { fontSize: 15, fontWeight: 800 },
    monthHeader: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 8,
    },
    monthTitle: { fontSize: 15, fontWeight: 800, color: t.ink },
    monthNav: {
      width: 34,
      height: 34,
      borderRadius: 10,
      border: `1px solid ${t.line}`,
      background: t.soft,
      cursor: "pointer",
      fontSize: 18,
      fontWeight: 700,
      color: t.ink,
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
    },
    monthDow: {
      display: "grid",
      gridTemplateColumns: "repeat(7, minmax(0, 1fr))",
      gap: 4,
    },
    monthDowCell: {
      textAlign: "center" as const,
      fontSize: 11,
      fontWeight: 800,
      color: t.muted,
    },
    monthGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(7, minmax(0, 1fr))",
      gap: 4,
    },
    monthEmpty: { minHeight: 36 },
    monthDay: {
      minHeight: 36,
      borderRadius: 10,
      border: `1px solid ${t.line}`,
      background: t.surface,
      fontSize: 13,
      fontWeight: 700,
      cursor: "pointer",
      color: t.ink,
    },
    monthDayActive: {
      background: t.ink,
      borderColor: t.ink,
      color: t.onInk,
    },
    monthDayPast: {
      opacity: 0.35,
      cursor: "not-allowed",
    },
    slotGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
      gap: 8,
    },
    slot: {
      border: `1px solid ${t.line}`,
      background: t.soft,
      borderRadius: 12,
      minHeight: 40,
      fontSize: 14,
      fontWeight: 800,
      color: t.ink,
      cursor: "pointer",
    },
    slotActive: {
      background: t.accent,
      borderColor: t.accent,
      color: t.onAccent,
    },
    input: {
      width: "100%",
      boxSizing: "border-box" as const,
      minHeight: 44,
      borderRadius: 12,
      border: `1px solid ${t.line}`,
      padding: "0 12px",
      fontSize: 14,
      fontWeight: 600,
      outline: "none",
      background: t.surface,
      color: t.ink,
    },
    primaryBtn: {
      marginTop: 2,
      border: "none",
      borderRadius: 12,
      minHeight: 46,
      background: t.ink,
      color: t.onInk,
      fontSize: 14,
      fontWeight: 800,
      cursor: "pointer",
    },
    error: {
      margin: 0,
      color: "#b91c1c",
      fontSize: 13,
      fontWeight: 700,
    },
  };
  return styles;
}

function ServiceMeta({ service }: { service: PublicBookingService }) {
  const parts = [
    service.duration ? `${service.duration} דק׳` : "",
    service.price != null ? `₪${service.price}` : "",
  ].filter(Boolean);
  return <span>{parts.join(" · ")}</span>;
}

function BookingSplitShell({
  styles,
  servicesPanel,
  calendarPanel,
}: {
  styles: Record<string, React.CSSProperties>;
  servicesPanel: React.ReactNode;
  calendarPanel: React.ReactNode;
}) {
  return (
    <div style={styles.root} dir="rtl">
      <aside style={styles.servicesCol}>{servicesPanel}</aside>
      <div style={styles.calendarCol}>{calendarPanel}</div>
    </div>
  );
}

function DemoBooking({
  variant,
  theme,
  editorMode,
}: {
  variant: BookingWidgetVariant;
  theme?: BookingWidgetTheme;
  editorMode?: boolean;
}) {
  const t = resolveTheme(theme);
  const styles = useMemo(() => buildStyles(t), [t.accent, t.ink, t.muted, t.surface, t.line, t.soft, t.onAccent, t.onInk]);
  const today = startOfDay(new Date());
  const [selectedServiceId, setSelectedServiceId] = useState(
    serviceIdOf(DEMO_SERVICES[0]),
  );
  const [monthCursor, setMonthCursor] = useState(() => ({
    year: today.getFullYear(),
    month: today.getMonth(),
  }));
  const [weekOffset, setWeekOffset] = useState(0);
  const [selectedDate, setSelectedDate] = useState<Date>(today);
  const [selectedSlot, setSelectedSlot] = useState(DEMO_SLOTS[1]);

  const cells = useMemo(
    () => buildMonthCells(monthCursor.year, monthCursor.month),
    [monthCursor.year, monthCursor.month],
  );
  const week = useMemo(() => daysFromOffset(weekOffset * 7, 7), [weekOffset]);

  return (
    <div
      style={{ width: "100%", height: "100%", minHeight: 280 }}
      data-bizuply-booking-preview={editorMode ? "editor" : "static"}
    >
      <BookingSplitShell
        styles={styles}
        servicesPanel={
          <>
            <div style={styles.header}>
              <p style={styles.eyebrow}>השירותים שלכם</p>
              <h3 style={styles.title}>בחרו שירות</h3>
              <p style={styles.copy}>מסונכרן ליומן ול-CRM של העסק.</p>
            </div>
            <div style={styles.serviceList}>
              {DEMO_SERVICES.map((service) => {
                const id = serviceIdOf(service);
                const active = id === selectedServiceId;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setSelectedServiceId(id)}
                    style={{
                      ...styles.serviceBtn,
                      ...(active ? styles.serviceBtnActive : null),
                    }}
                  >
                    <strong>{service.name}</strong>
                    <ServiceMeta service={service} />
                  </button>
                );
              })}
            </div>
          </>
        }
        calendarPanel={
          <>
            <div style={styles.header}>
              <p style={styles.eyebrow}>מחובר ליומן העסק</p>
              <h3 style={styles.title}>קביעת פגישה</h3>
            </div>

            {variant === "month" ? (
              <>
                <div style={styles.monthHeader}>
                  <button
                    type="button"
                    style={styles.monthNav}
                    aria-label="חודש קודם"
                    onClick={() =>
                      setMonthCursor((cur) => {
                        const d = new Date(cur.year, cur.month - 1, 1);
                        return { year: d.getFullYear(), month: d.getMonth() };
                      })
                    }
                  >
                    ›
                  </button>
                  <strong style={styles.monthTitle}>
                    {HEB_MONTHS[monthCursor.month]} {monthCursor.year}
                  </strong>
                  <button
                    type="button"
                    style={styles.monthNav}
                    aria-label="חודש הבא"
                    onClick={() =>
                      setMonthCursor((cur) => {
                        const d = new Date(cur.year, cur.month + 1, 1);
                        return { year: d.getFullYear(), month: d.getMonth() };
                      })
                    }
                  >
                    ‹
                  </button>
                </div>
                <div style={styles.monthDow}>
                  {HEB_DAYS.map((d) => (
                    <span key={d} style={styles.monthDowCell}>
                      {d}
                    </span>
                  ))}
                </div>
                <div style={styles.monthGrid}>
                  {cells.map((day, index) => {
                    if (!day) {
                      return <div key={`e-${index}`} style={styles.monthEmpty} />;
                    }
                    const active =
                      formatDateKey(day) === formatDateKey(selectedDate);
                    const past =
                      day.getTime() < startOfDay(new Date()).getTime();
                    return (
                      <button
                        key={formatDateKey(day)}
                        type="button"
                        disabled={past}
                        onClick={() => setSelectedDate(day)}
                        style={{
                          ...styles.monthDay,
                          ...(active ? styles.monthDayActive : null),
                          ...(past ? styles.monthDayPast : null),
                        }}
                      >
                        {day.getDate()}
                      </button>
                    );
                  })}
                </div>
              </>
            ) : (
              <>
                <div style={styles.weekNav}>
                  <button
                    type="button"
                    style={styles.monthNav}
                    aria-label="שבוע קודם"
                    onClick={() => setWeekOffset((v) => Math.max(0, v - 1))}
                  >
                    ›
                  </button>
                  <strong style={styles.monthTitle}>השבוע הקרוב</strong>
                  <button
                    type="button"
                    style={styles.monthNav}
                    aria-label="שבוע הבא"
                    onClick={() => setWeekOffset((v) => v + 1)}
                  >
                    ‹
                  </button>
                </div>
                <div style={styles.weekRow}>
                  {week.map((day) => {
                    const active =
                      formatDateKey(day) === formatDateKey(selectedDate);
                    return (
                      <button
                        key={formatDateKey(day)}
                        type="button"
                        onClick={() => setSelectedDate(day)}
                        style={{
                          ...styles.weekPill,
                          ...(active ? styles.weekPillActive : null),
                        }}
                      >
                        <span style={styles.weekName}>
                          {HEB_DAYS[day.getDay()]}
                        </span>
                        <strong style={styles.weekNum}>{day.getDate()}</strong>
                      </button>
                    );
                  })}
                </div>
              </>
            )}

            <div style={styles.slotGrid}>
              {DEMO_SLOTS.map((time) => {
                const active = time === selectedSlot;
                return (
                  <button
                    key={time}
                    type="button"
                    onClick={() => setSelectedSlot(time)}
                    style={{
                      ...styles.slot,
                      ...(active ? styles.slotActive : null),
                    }}
                  >
                    {time}
                  </button>
                );
              })}
            </div>
            <input style={styles.input} placeholder="שם מלא" disabled />
            <input style={styles.input} placeholder="טלפון" disabled />
            <button type="button" style={styles.primaryBtn} disabled>
              אישור תור
            </button>
          </>
        }
      />
    </div>
  );
}

export default function BookingWidget({
  businessId,
  pluginEnabled = false,
  preview = false,
  editorMode = false,
  variant = "week",
  theme,
}: BookingWidgetProps) {
  const live = Boolean(pluginEnabled && businessId && !preview);
  const t = resolveTheme(theme);
  const styles = useMemo(
    () => buildStyles(t),
    [t.accent, t.ink, t.muted, t.surface, t.line, t.soft, t.onAccent, t.onInk],
  );

  const [services, setServices] = useState<PublicBookingService[]>([]);
  const [selectedServiceId, setSelectedServiceId] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date>(() =>
    startOfDay(new Date()),
  );
  const [monthCursor, setMonthCursor] = useState(() => {
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() };
  });
  const [weekOffset, setWeekOffset] = useState(0);
  const [slots, setSlots] = useState<string[]>([]);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [loadingServices, setLoadingServices] = useState(false);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const weekDays = useMemo(
    () => daysFromOffset(weekOffset * 7, 7),
    [weekOffset],
  );
  const monthCells = useMemo(
    () => buildMonthCells(monthCursor.year, monthCursor.month),
    [monthCursor.year, monthCursor.month],
  );

  useEffect(() => {
    if (!live || !businessId) return;
    let cancelled = false;
    setLoadingServices(true);
    setError("");
    getPublicBookingServices(businessId)
      .then((list) => {
        if (cancelled) return;
        setServices(list);
        const first = list[0];
        const id = first ? serviceIdOf(first) : "";
        if (id) setSelectedServiceId(id);
      })
      .catch(() => {
        if (!cancelled) {
          setServices([]);
          setError("לא ניתן לטעון שירותים מהיומן");
        }
      })
      .finally(() => {
        if (!cancelled) setLoadingServices(false);
      });
    return () => {
      cancelled = true;
    };
  }, [live, businessId]);

  useEffect(() => {
    if (!live || !businessId || !selectedServiceId || !selectedDate) return;
    let cancelled = false;
    setLoadingSlots(true);
    setSelectedSlot("");
    setSlots([]);
    getPublicBookingSlots({
      businessId,
      serviceId: selectedServiceId,
      date: formatDateKey(selectedDate),
    })
      .then((next) => {
        if (!cancelled) setSlots(next);
      })
      .catch(() => {
        if (!cancelled) setSlots([]);
      })
      .finally(() => {
        if (!cancelled) setLoadingSlots(false);
      });
    return () => {
      cancelled = true;
    };
  }, [live, businessId, selectedServiceId, selectedDate]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!live || !businessId || !selectedServiceId || !selectedSlot) return;
    if (!clientName.trim() || !clientPhone.trim()) {
      setError("נא למלא שם וטלפון");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      await createPublicBooking({
        businessId,
        serviceId: selectedServiceId,
        date: formatDateKey(selectedDate),
        time: selectedSlot,
        guestName: clientName.trim(),
        guestPhone: clientPhone.trim(),
      });
      setSuccess(true);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          err?.message ||
          "שגיאה בקביעת התור",
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (!live) {
    return (
      <DemoBooking variant={variant} theme={theme} editorMode={editorMode} />
    );
  }

  if (success) {
    return (
      <div style={{ ...styles.root, flexDirection: "column" }} dir="rtl">
        <p style={styles.eyebrow}>התור נשמר ביומן</p>
        <h3 style={styles.title}>תודה! ניצור איתכם קשר לאישור</h3>
        <p style={styles.copy}>
          {formatDateKey(selectedDate)} · {selectedSlot}
        </p>
      </div>
    );
  }

  return (
    <form
      style={styles.root}
      dir="rtl"
      onSubmit={handleSubmit}
      data-bizuply-booking-live="true"
    >
      <aside style={styles.servicesCol}>
        <div style={styles.header}>
          <p style={styles.eyebrow}>השירותים שלכם</p>
          <h3 style={styles.title}>בחרו שירות</h3>
        </div>
        {loadingServices ? (
          <p style={styles.copy}>טוען שירותים מהיומן...</p>
        ) : services.length === 0 ? (
          <p style={styles.copy}>
            אין שירותים עדיין — הוסיפו שירותים בפאנל ניהול היומן.
          </p>
        ) : (
          <div style={styles.serviceList}>
            {services.slice(0, 12).map((service) => {
              const id = serviceIdOf(service);
              const active = id === selectedServiceId;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => setSelectedServiceId(id)}
                  style={{
                    ...styles.serviceBtn,
                    ...(active ? styles.serviceBtnActive : null),
                  }}
                >
                  <strong>{service.name || "שירות"}</strong>
                  <ServiceMeta service={service} />
                </button>
              );
            })}
          </div>
        )}
      </aside>

      <div style={styles.calendarCol}>
        <div style={styles.header}>
          <p style={styles.eyebrow}>מחובר ליומן העסק</p>
          <h3 style={styles.title}>קביעת פגישה</h3>
        </div>

        {variant === "month" ? (
          <>
            <div style={styles.monthHeader}>
              <button
                type="button"
                style={styles.monthNav}
                aria-label="חודש קודם"
                onClick={() =>
                  setMonthCursor((cur) => {
                    const d = new Date(cur.year, cur.month - 1, 1);
                    return { year: d.getFullYear(), month: d.getMonth() };
                  })
                }
              >
                ›
              </button>
              <strong style={styles.monthTitle}>
                {HEB_MONTHS[monthCursor.month]} {monthCursor.year}
              </strong>
              <button
                type="button"
                style={styles.monthNav}
                aria-label="חודש הבא"
                onClick={() =>
                  setMonthCursor((cur) => {
                    const d = new Date(cur.year, cur.month + 1, 1);
                    return { year: d.getFullYear(), month: d.getMonth() };
                  })
                }
              >
                ‹
              </button>
            </div>
            <div style={styles.monthDow}>
              {HEB_DAYS.map((d) => (
                <span key={d} style={styles.monthDowCell}>
                  {d}
                </span>
              ))}
            </div>
            <div style={styles.monthGrid}>
              {monthCells.map((day, index) => {
                if (!day) {
                  return <div key={`e-${index}`} style={styles.monthEmpty} />;
                }
                const active =
                  formatDateKey(day) === formatDateKey(selectedDate);
                const past = day.getTime() < startOfDay(new Date()).getTime();
                return (
                  <button
                    key={formatDateKey(day)}
                    type="button"
                    disabled={past}
                    onClick={() => setSelectedDate(day)}
                    style={{
                      ...styles.monthDay,
                      ...(active ? styles.monthDayActive : null),
                      ...(past ? styles.monthDayPast : null),
                    }}
                  >
                    {day.getDate()}
                  </button>
                );
              })}
            </div>
          </>
        ) : (
          <>
            <div style={styles.weekNav}>
              <button
                type="button"
                style={styles.monthNav}
                aria-label="שבוע קודם"
                onClick={() => setWeekOffset((v) => Math.max(0, v - 1))}
              >
                ›
              </button>
              <strong style={styles.monthTitle}>בחרו יום</strong>
              <button
                type="button"
                style={styles.monthNav}
                aria-label="שבוע הבא"
                onClick={() => setWeekOffset((v) => v + 1)}
              >
                ‹
              </button>
            </div>
            <div style={styles.weekRow}>
              {weekDays.map((day) => {
                const active =
                  formatDateKey(day) === formatDateKey(selectedDate);
                return (
                  <button
                    key={formatDateKey(day)}
                    type="button"
                    onClick={() => setSelectedDate(day)}
                    style={{
                      ...styles.weekPill,
                      ...(active ? styles.weekPillActive : null),
                    }}
                  >
                    <span style={styles.weekName}>
                      {HEB_DAYS[day.getDay()]}
                    </span>
                    <strong style={styles.weekNum}>{day.getDate()}</strong>
                  </button>
                );
              })}
            </div>
          </>
        )}

        <div style={styles.slotGrid}>
          {loadingSlots ? (
            <p style={styles.copy}>טוען שעות פנויות...</p>
          ) : slots.length === 0 ? (
            <p style={styles.copy}>אין שעות פנויות ביום זה</p>
          ) : (
            slots.map((time) => {
              const active = time === selectedSlot;
              return (
                <button
                  key={time}
                  type="button"
                  onClick={() => setSelectedSlot(time)}
                  style={{
                    ...styles.slot,
                    ...(active ? styles.slotActive : null),
                  }}
                >
                  {time}
                </button>
              );
            })
          )}
        </div>

        <input
          style={styles.input}
          placeholder="שם מלא"
          value={clientName}
          onChange={(e) => setClientName(e.target.value)}
          autoComplete="name"
        />
        <input
          style={styles.input}
          placeholder="טלפון"
          value={clientPhone}
          onChange={(e) => setClientPhone(e.target.value)}
          autoComplete="tel"
        />

        {error ? <p style={styles.error}>{error}</p> : null}

        <button type="submit" style={styles.primaryBtn} disabled={submitting}>
          {submitting ? "שומר ביומן..." : "אישור תור"}
        </button>
      </div>
    </form>
  );
}
