import React, { useEffect, useMemo, useState } from "react";

import {
  createPublicBooking,
  getPublicBookingServices,
  getPublicBookingSlots,
  type PublicBookingService,
} from "../../../api/publicBookingApi";

export type BookingWidgetVariant = "week" | "month";

type BookingWidgetProps = {
  businessId?: string;
  pluginEnabled?: boolean;
  preview?: boolean;
  editorMode?: boolean;
  variant?: BookingWidgetVariant;
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

function nextDays(count: number) {
  const days: Date[] = [];
  const start = startOfDay(new Date());
  for (let i = 0; i < count; i += 1) {
    const day = new Date(start);
    day.setDate(start.getDate() + i);
    days.push(day);
  }
  return days;
}

function buildMonthCells(year: number, month: number) {
  const first = new Date(year, month, 1, 12);
  const startPad = first.getDay(); // Sunday=0
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

function DemoCalendar({ variant }: { variant: BookingWidgetVariant }) {
  const today = startOfDay(new Date());
  const [monthCursor] = useState(() => ({
    year: today.getFullYear(),
    month: today.getMonth(),
  }));
  const cells = buildMonthCells(monthCursor.year, monthCursor.month);
  const week = nextDays(7);

  return (
    <div style={styles.root} dir="rtl">
      <div style={styles.header}>
        <div>
          <p style={styles.eyebrow}>יומן פגישות</p>
          <h3 style={styles.title}>בחרו תאריך ושעה</h3>
        </div>
        <span style={styles.badge}>תצוגה מקדימה</span>
      </div>

      {variant === "month" ? (
        <>
          <div style={styles.monthHeader}>
            <strong style={styles.monthTitle}>
              {HEB_MONTHS[monthCursor.month]} {monthCursor.year}
            </strong>
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
              if (!day) return <div key={`e-${index}`} style={styles.monthEmpty} />;
              const active = day.getDate() === today.getDate() + 1;
              return (
                <div
                  key={formatDateKey(day)}
                  style={{
                    ...styles.monthDay,
                    ...(active ? styles.monthDayActive : null),
                  }}
                >
                  {day.getDate()}
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <div style={styles.weekRow}>
          {week.map((day, index) => {
            const active = index === 1;
            return (
              <div
                key={formatDateKey(day)}
                style={{
                  ...styles.weekPill,
                  ...(active ? styles.weekPillActive : null),
                }}
              >
                <span style={styles.weekName}>{HEB_DAYS[day.getDay()]}</span>
                <strong style={styles.weekNum}>{day.getDate()}</strong>
              </div>
            );
          })}
        </div>
      )}

      <div style={styles.slotGrid}>
        {["09:00", "10:30", "12:00", "14:00", "16:30", "18:00"].map(
          (time, index) => (
            <div
              key={time}
              style={{
                ...styles.slot,
                ...(index === 1 ? styles.slotActive : null),
              }}
            >
              {time}
            </div>
          ),
        )}
      </div>
      <button type="button" style={styles.primaryBtn} disabled>
        אישור תור
      </button>
    </div>
  );
}

export default function BookingWidget({
  businessId,
  pluginEnabled = false,
  preview = false,
  editorMode = false,
  variant = "week",
}: BookingWidgetProps) {
  const live = Boolean(pluginEnabled && businessId && !preview);

  const [services, setServices] = useState<PublicBookingService[]>([]);
  const [selectedServiceId, setSelectedServiceId] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date>(() => startOfDay(new Date()));
  const [monthCursor, setMonthCursor] = useState(() => {
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() };
  });
  const [slots, setSlots] = useState<string[]>([]);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [loadingServices, setLoadingServices] = useState(false);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const weekDays = useMemo(() => nextDays(7), []);
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
      <div
        style={{ width: "100%", height: "100%", minHeight: 240 }}
        data-bizuply-booking-preview={editorMode ? "editor" : "static"}
      >
        <DemoCalendar variant={variant} />
      </div>
    );
  }

  if (success) {
    return (
      <div style={styles.root} dir="rtl">
        <p style={styles.eyebrow}>התור נשמר ביומן</p>
        <h3 style={styles.title}>תודה! ניצור איתכם קשר לאישור</h3>
        <p style={styles.copy}>
          {formatDateKey(selectedDate)} · {selectedSlot}
        </p>
      </div>
    );
  }

  return (
    <form style={styles.root} dir="rtl" onSubmit={handleSubmit}>
      <div style={styles.header}>
        <div>
          <p style={styles.eyebrow}>מחובר ליומן העסק</p>
          <h3 style={styles.title}>קביעת פגישה</h3>
        </div>
      </div>

      {loadingServices ? (
        <p style={styles.copy}>טוען שירותים מהיומן...</p>
      ) : services.length === 0 ? (
        <p style={styles.copy}>
          אין שירותים עדיין — הוסיפו שירותים בפאנל ניהול היומן.
        </p>
      ) : (
        <div style={styles.serviceList}>
          {services.slice(0, 8).map((service) => {
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
                <span>
                  {service.duration ? `${service.duration} דק׳` : ""}
                  {service.price != null ? ` · ₪${service.price}` : ""}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {variant === "month" ? (
        <>
          <div style={styles.monthHeader}>
            <button
              type="button"
              style={styles.monthNav}
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
              if (!day) return <div key={`e-${index}`} style={styles.monthEmpty} />;
              const active = formatDateKey(day) === formatDateKey(selectedDate);
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
        <div style={styles.weekRow}>
          {weekDays.map((day) => {
            const active = formatDateKey(day) === formatDateKey(selectedDate);
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
                <span style={styles.weekName}>{HEB_DAYS[day.getDay()]}</span>
                <strong style={styles.weekNum}>{day.getDate()}</strong>
              </button>
            );
          })}
        </div>
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
    </form>
  );
}

const ink = "#111827";
const muted = "#6b7280";
const line = "#e5e7eb";
const soft = "#f3f4f6";
const accent = "#0f766e";

const styles: Record<string, React.CSSProperties> = {
  root: {
    boxSizing: "border-box",
    width: "100%",
    height: "100%",
    minHeight: 240,
    padding: "18px 16px",
    borderRadius: 20,
    background: "#ffffff",
    border: `1px solid ${line}`,
    fontFamily:
      "Heebo, Assistant, system-ui, -apple-system, Segoe UI, sans-serif",
    display: "flex",
    flexDirection: "column",
    gap: 12,
    color: ink,
  },
  header: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
  },
  eyebrow: {
    margin: 0,
    fontSize: 11,
    fontWeight: 800,
    letterSpacing: "0.12em",
    color: accent,
  },
  title: {
    margin: "4px 0 0",
    fontSize: 22,
    fontWeight: 800,
    color: ink,
    lineHeight: 1.15,
  },
  copy: {
    margin: 0,
    fontSize: 13,
    fontWeight: 600,
    color: muted,
    lineHeight: 1.5,
  },
  badge: {
    fontSize: 11,
    fontWeight: 800,
    color: muted,
    background: soft,
    borderRadius: 999,
    padding: "6px 10px",
    whiteSpace: "nowrap",
  },
  weekRow: {
    display: "grid",
    gridTemplateColumns: "repeat(7, minmax(0, 1fr))",
    gap: 6,
  },
  weekPill: {
    border: `1px solid ${line}`,
    background: "#ffffff",
    borderRadius: 12,
    padding: "8px 2px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 2,
    cursor: "pointer",
    color: ink,
  },
  weekPillActive: {
    background: ink,
    borderColor: ink,
    color: "#ffffff",
  },
  weekName: { fontSize: 10, fontWeight: 800, opacity: 0.75 },
  weekNum: { fontSize: 15, fontWeight: 800 },
  monthHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  monthTitle: { fontSize: 15, fontWeight: 800, color: ink },
  monthNav: {
    width: 34,
    height: 34,
    borderRadius: 10,
    border: `1px solid ${line}`,
    background: soft,
    cursor: "pointer",
    fontSize: 18,
    fontWeight: 700,
    color: ink,
  },
  monthDow: {
    display: "grid",
    gridTemplateColumns: "repeat(7, minmax(0, 1fr))",
    gap: 4,
  },
  monthDowCell: {
    textAlign: "center",
    fontSize: 11,
    fontWeight: 800,
    color: muted,
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
    border: `1px solid ${line}`,
    background: "#ffffff",
    fontSize: 13,
    fontWeight: 700,
    cursor: "pointer",
    color: ink,
  },
  monthDayActive: {
    background: ink,
    borderColor: ink,
    color: "#ffffff",
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
    border: `1px solid ${line}`,
    background: soft,
    borderRadius: 12,
    minHeight: 40,
    fontSize: 14,
    fontWeight: 800,
    color: ink,
    cursor: "pointer",
  },
  slotActive: {
    background: accent,
    borderColor: accent,
    color: "#ffffff",
  },
  serviceList: {
    display: "grid",
    gap: 8,
    maxHeight: 150,
    overflow: "auto",
  },
  serviceBtn: {
    textAlign: "right",
    border: `1px solid ${line}`,
    background: "#ffffff",
    borderRadius: 12,
    padding: "10px 12px",
    display: "flex",
    flexDirection: "column",
    gap: 3,
    cursor: "pointer",
    color: ink,
  },
  serviceBtnActive: {
    border: `2px solid ${accent}`,
    background: "#f0fdfa",
  },
  input: {
    width: "100%",
    boxSizing: "border-box",
    minHeight: 44,
    borderRadius: 12,
    border: `1px solid ${line}`,
    padding: "0 12px",
    fontSize: 14,
    fontWeight: 600,
    outline: "none",
    background: "#ffffff",
    color: ink,
  },
  primaryBtn: {
    marginTop: 2,
    border: "none",
    borderRadius: 12,
    minHeight: 46,
    background: ink,
    color: "#ffffff",
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
