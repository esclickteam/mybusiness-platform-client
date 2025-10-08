import React, { useState } from "react";

// ימים א'–ש' בעברית, Sunday=0
const DAYS_HE = [
  { key: 0, label: "ראשון" },
  { key: 1, label: "שני" },
  { key: 2, label: "שלישי" },
  { key: 3, label: "רביעי" },
  { key: 4, label: "חמישי" },
  { key: 5, label: "שישי" },
  { key: 6, label: "שבת" },
];

// ברירת מחדל: פתוח א'-ה', סגור שבת
const DEFAULT_HOURS = {
  0: { start: "09:00", end: "18:00" },
  1: { start: "09:00", end: "18:00" },
  2: { start: "09:00", end: "18:00" },
  3: { start: "09:00", end: "18:00" },
  4: { start: "09:00", end: "18:00" },
  5: { start: "09:00", end: "14:00" },
  6: null, // שבת סגור
};

export default function WeeklyHoursSetup({ initialHours = DEFAULT_HOURS, onSave }) {
  const [weeklyHours, setWeeklyHours] = useState(initialHours);

  const handleChange = (day, field, value) => {
    setWeeklyHours((prev) => ({
      ...prev,
      [day]: {
        ...(prev[day] || { start: "", end: "" }),
        [field]: value,
      },
    }));
  };

  const handleClosedToggle = (day) => {
    setWeeklyHours((prev) => ({
      ...prev,
      [day]: prev[day] ? null : { start: "", end: "" },
    }));
  };

  const handleSave = () => {
    if (onSave) onSave(weeklyHours);
    alert("שעות פעילות שבועיות נשמרו!");
  };

  return (
    <div style={{
      maxWidth: 430, margin: "0 auto", background: "#f8ecff",
      borderRadius: 16, padding: 24, direction: "rtl", textAlign: "right"
    }}>
      <h2 style={{ textAlign: "center" }}>🗓️ הגדרת שעות פעילות שבועיות</h2>
      <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: "0 10px" }}>
        <thead>
          <tr style={{ color: "#6c36a7" }}>
            <th>יום</th>
            <th>התחלה</th>
            <th>סיום</th>
            <th>סגור</th>
          </tr>
        </thead>
        <tbody>
          {DAYS_HE.map(({ key, label }) => (
            <tr key={key}>
              <td style={{ fontWeight: 500 }}>{label}</td>
              <td>
                <input
                  type="time"
                  value={weeklyHours[key]?.start || ""}
                  onChange={e => handleChange(key, "start", e.target.value)}
                  disabled={weeklyHours[key] === null}
                  style={{ borderRadius: 8, padding: 4, border: "1px solid #ccc", minWidth: 70 }}
                />
              </td>
              <td>
                <input
                  type="time"
                  value={weeklyHours[key]?.end || ""}
                  onChange={e => handleChange(key, "end", e.target.value)}
                  disabled={weeklyHours[key] === null}
                  style={{ borderRadius: 8, padding: 4, border: "1px solid #ccc", minWidth: 70 }}
                />
              </td>
              <td>
                <input
                  type="checkbox"
                  checked={weeklyHours[key] === null}
                  onChange={() => handleClosedToggle(key)}
                  aria-label={`סגור ביום ${label}`}
                  style={{ transform: "scale(1.2)" }}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ margin: "2.5em 0 0.5em", textAlign: "center" }}>
        <button
          onClick={handleSave}
          style={{
            background: "linear-gradient(to right, #a36eff, #d8b4ff)",
            color: "#fff", fontWeight: "bold", fontSize: 16,
            border: "none", borderRadius: 22, padding: "12px 36px",
            cursor: "pointer", boxShadow: "0 1px 6px #d3c1fa60"
          }}
        >
          💾 שמור שעות פעילות שבועיות
        </button>
      </div>

      {/* תצוגת סיכום */}
      <div style={{
        marginTop: 24, background: "#fff", borderRadius: 12,
        boxShadow: "0 0 6px #d3c1fa30", padding: 16
      }}>
        <div style={{ fontWeight: "bold", marginBottom: 8, color: "#6c36a7" }}>סיכום שעות פעילות:</div>
        <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
          {DAYS_HE.map(({ key, label }) => (
            <li key={key} style={{ margin: "5px 0" }}>
              <span style={{ fontWeight: 500 }}>{label}:</span>{" "}
              {weeklyHours[key] === null
                ? <span style={{ color: "#e04040" }}>סגור</span>
                : ((weeklyHours[key]?.start && weeklyHours[key]?.end)
                    ? `${weeklyHours[key].start}–${weeklyHours[key].end}`
                    : <span style={{ color: "#aaa" }}>לא הוגדר</span>
                  )
              }
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
