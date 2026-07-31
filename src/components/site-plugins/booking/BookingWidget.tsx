import React, { useEffect, useMemo, useState } from "react";

import API from "../../../api";

type BookingService = {
  _id?: string;
  id?: string;
  name?: string;
  duration?: number;
  price?: number;
};

type BookingWidgetProps = {
  businessId?: string;
  pluginEnabled?: boolean;
  preview?: boolean;
  editorMode?: boolean;
};

function formatDateKey(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function nextDays(count: number) {
  const days: Date[] = [];
  const start = new Date();
  start.setHours(12, 0, 0, 0);
  for (let i = 0; i < count; i += 1) {
    const day = new Date(start);
    day.setDate(start.getDate() + i);
    days.push(day);
  }
  return days;
}

const HEB_DAYS = ["א׳", "ב׳", "ג׳", "ד׳", "ה׳", "ו׳", "ש׳"];

function DemoCalendar() {
  const days = nextDays(7);
  return (
    <div style={styles.panel} dir="rtl">
      <p style={styles.eyebrow}>יומן פגישות</p>
      <h3 style={styles.title}>בחרו תאריך ושעה</h3>
      <p style={styles.copy}>
        לאחר התקנת תוסף «יומן ותורים» הסקשן מתחבר אוטומטית לזמינות האמיתית.
      </p>
      <div style={styles.dayRow}>
        {days.map((day, index) => {
          const active = index === 1;
          return (
            <div
              key={formatDateKey(day)}
              style={{
                ...styles.dayPill,
                ...(active ? styles.dayPillActive : null),
              }}
            >
              <span style={styles.dayName}>{HEB_DAYS[day.getDay()]}</span>
              <strong style={styles.dayNum}>{day.getDate()}</strong>
            </div>
          );
        })}
      </div>
      <div style={styles.slotGrid}>
        {["09:00", "10:30", "12:00", "14:00", "16:30", "18:00"].map(
          (time, index) => {
            const active = index === 1;
            return (
              <div
                key={time}
                style={{
                  ...styles.slot,
                  ...(active ? styles.slotActive : null),
                }}
              >
                {time}
              </div>
            );
          },
        )}
      </div>
      <div style={styles.primaryBtn}>אישור תור</div>
    </div>
  );
}

export default function BookingWidget({
  businessId,
  pluginEnabled = false,
  preview = false,
  editorMode = false,
}: BookingWidgetProps) {
  const [services, setServices] = useState<BookingService[]>([]);
  const [selectedServiceId, setSelectedServiceId] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date>(() => {
    const d = new Date();
    d.setHours(12, 0, 0, 0);
    return d;
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

  const days = useMemo(() => nextDays(7), []);
  const live = Boolean(pluginEnabled && businessId && !preview);

  useEffect(() => {
    if (!live || !businessId) return;
    let cancelled = false;
    setLoadingServices(true);
    API.get(`/business/${businessId}/services`)
      .then((res) => {
        if (cancelled) return;
        const list = (res.data?.services || res.data || []) as BookingService[];
        setServices(Array.isArray(list) ? list : []);
        const first = list[0];
        const id = String(first?._id || first?.id || "");
        if (id) setSelectedServiceId(id);
      })
      .catch(() => {
        if (!cancelled) setError("לא ניתן לטעון שירותים מהיומן");
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
    API.get("/appointments/slots", {
      params: {
        businessId,
        serviceId: selectedServiceId,
        date: formatDateKey(selectedDate),
      },
    })
      .then((res) => {
        if (cancelled) return;
        const next = Array.isArray(res.data?.slots) ? res.data.slots : [];
        setSlots(next.map(String));
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
      await API.post("/appointments", {
        businessId,
        serviceId: selectedServiceId,
        date: formatDateKey(selectedDate),
        time: selectedSlot,
        clientName: clientName.trim(),
        clientPhone: clientPhone.trim(),
      });
      setSuccess(true);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
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
        style={{ width: "100%", height: "100%", minHeight: 220 }}
        data-bizuply-booking-preview={editorMode ? "editor" : "static"}
      >
        <DemoCalendar />
      </div>
    );
  }

  if (success) {
    return (
      <div style={styles.panel} dir="rtl">
        <p style={styles.eyebrow}>התור נשמר</p>
        <h3 style={styles.title}>תודה! ניצור איתכם קשר לאישור</h3>
        <p style={styles.copy}>
          {formatDateKey(selectedDate)} · {selectedSlot}
        </p>
      </div>
    );
  }

  return (
    <form style={styles.panel} dir="rtl" onSubmit={handleSubmit}>
      <p style={styles.eyebrow}>מחובר ליומן העסק</p>
      <h3 style={styles.title}>קביעת פגישה</h3>

      {loadingServices ? (
        <p style={styles.copy}>טוען שירותים...</p>
      ) : services.length === 0 ? (
        <p style={styles.copy}>
          אין שירותים עדיין — הוסיפו שירותים בפאנל ניהול היומן.
        </p>
      ) : (
        <div style={styles.serviceList}>
          {services.slice(0, 6).map((service) => {
            const id = String(service._id || service.id || "");
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

      <div style={styles.dayRow}>
        {days.map((day) => {
          const active = formatDateKey(day) === formatDateKey(selectedDate);
          return (
            <button
              key={formatDateKey(day)}
              type="button"
              onClick={() => setSelectedDate(day)}
              style={{
                ...styles.dayPill,
                ...(active ? styles.dayPillActive : null),
              }}
            >
              <span style={styles.dayName}>{HEB_DAYS[day.getDay()]}</span>
              <strong style={styles.dayNum}>{day.getDate()}</strong>
            </button>
          );
        })}
      </div>

      <div style={styles.slotGrid}>
        {loadingSlots ? (
          <p style={styles.copy}>טוען שעות...</p>
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
      />
      <input
        style={styles.input}
        placeholder="טלפון"
        value={clientPhone}
        onChange={(e) => setClientPhone(e.target.value)}
      />

      {error ? <p style={styles.error}>{error}</p> : null}

      <button type="submit" style={styles.primaryBtn} disabled={submitting}>
        {submitting ? "שומר..." : "אישור תור"}
      </button>
    </form>
  );
}

const styles: Record<string, React.CSSProperties> = {
  panel: {
    boxSizing: "border-box",
    width: "100%",
    height: "100%",
    minHeight: 220,
    padding: "22px 20px",
    borderRadius: 24,
    background:
      "linear-gradient(180deg, #f0f9ff 0%, #ffffff 42%, #ffffff 100%)",
    border: "1px solid #e2e8f0",
    fontFamily:
      "Heebo, Assistant, system-ui, -apple-system, Segoe UI, sans-serif",
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  eyebrow: {
    margin: 0,
    fontSize: 11,
    fontWeight: 800,
    letterSpacing: "0.14em",
    color: "#0284c7",
  },
  title: {
    margin: 0,
    fontSize: 24,
    fontWeight: 800,
    color: "#0f172a",
    lineHeight: 1.15,
  },
  copy: {
    margin: 0,
    fontSize: 13,
    fontWeight: 600,
    color: "#64748b",
    lineHeight: 1.55,
  },
  dayRow: {
    display: "grid",
    gridTemplateColumns: "repeat(7, minmax(0, 1fr))",
    gap: 6,
  },
  dayPill: {
    border: "1px solid #e2e8f0",
    background: "#ffffff",
    borderRadius: 14,
    padding: "8px 2px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 2,
    cursor: "pointer",
  },
  dayPillActive: {
    background: "#0f172a",
    borderColor: "#0f172a",
    color: "#ffffff",
  },
  dayName: { fontSize: 10, fontWeight: 800, opacity: 0.75 },
  dayNum: { fontSize: 16, fontWeight: 800 },
  slotGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: 8,
  },
  slot: {
    border: "1px solid #e2e8f0",
    background: "#ffffff",
    borderRadius: 12,
    minHeight: 42,
    fontSize: 14,
    fontWeight: 800,
    color: "#0f172a",
    cursor: "pointer",
  },
  slotActive: {
    background: "#0284c7",
    borderColor: "#0284c7",
    color: "#ffffff",
  },
  serviceList: {
    display: "grid",
    gap: 8,
  },
  serviceBtn: {
    textAlign: "right" as const,
    border: "1px solid #e2e8f0",
    background: "#ffffff",
    borderRadius: 14,
    padding: "10px 12px",
    display: "flex",
    flexDirection: "column" as const,
    gap: 4,
    cursor: "pointer",
    color: "#0f172a",
  },
  serviceBtnActive: {
    border: "2px solid #0284c7",
    background: "#f0f9ff",
  },
  input: {
    width: "100%",
    boxSizing: "border-box",
    minHeight: 44,
    borderRadius: 12,
    border: "1px solid #e2e8f0",
    padding: "0 12px",
    fontSize: 14,
    fontWeight: 600,
    outline: "none",
  },
  primaryBtn: {
    marginTop: 4,
    border: "none",
    borderRadius: 14,
    minHeight: 48,
    background: "#0f172a",
    color: "#ffffff",
    fontSize: 14,
    fontWeight: 800,
    cursor: "pointer",
    display: "grid",
    placeItems: "center",
  },
  error: {
    margin: 0,
    color: "#e11d48",
    fontSize: 13,
    fontWeight: 700,
  },
};
