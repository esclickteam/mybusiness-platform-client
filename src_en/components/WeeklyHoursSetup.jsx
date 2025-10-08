```javascript
import React, { useState } from "react";

// Days Sunday–Saturday in Hebrew, Sunday=0
const DAYS_HE = [
  { key: 0, label: "Sunday" },
  { key: 1, label: "Monday" },
  { key: 2, label: "Tuesday" },
  { key: 3, label: "Wednesday" },
  { key: 4, label: "Thursday" },
  { key: 5, label: "Friday" },
  { key: 6, label: "Saturday" },
];

// Default: open Sunday-Thursday, closed Saturday
const DEFAULT_HOURS = {
  0: { start: "09:00", end: "18:00" },
  1: { start: "09:00", end: "18:00" },
  2: { start: "09:00", end: "18:00" },
  3: { start: "09:00", end: "18:00" },
  4: { start: "09:00", end: "18:00" },
  5: { start: "09:00", end: "14:00" },
  6: null, // Saturday closed
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
    alert("Weekly operating hours saved!");
  };

  return (
    <div style={{
      maxWidth: 430, margin: "0 auto", background: "#f8ecff",
      borderRadius: 16, padding: 24, direction: "rtl", textAlign: "right"
    }}>
      <h2 style={{ textAlign: "center" }}>🗓️ Weekly Operating Hours Setup</h2>
      <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: "0 10px" }}>
        <thead>
          <tr style={{ color: "#6c36a7" }}>
            <th>Day</th>
            <th>Start</th>
            <th>End</th>
            <th>Closed</th>
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
                  aria-label={`Closed on ${label}`}
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
          💾 Save Weekly Operating Hours
        </button>
      </div>

      {/* Summary display */}
      <div style={{
        marginTop: 24, background: "#fff", borderRadius: 12,
        boxShadow: "0 0 6px #d3c1fa30", padding: 16
      }}>
        <div style={{ fontWeight: "bold", marginBottom: 8, color: "#6c36a7" }}>Summary of Operating Hours:</div>
        <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
          {DAYS_HE.map(({ key, label }) => (
            <li key={key} style={{ margin: "5px 0" }}>
              <span style={{ fontWeight: 500 }}>{label}:</span>{" "}
              {weeklyHours[key] === null
                ? <span style={{ color: "#e04040" }}>Closed</span>
                : ((weeklyHours[key]?.start && weeklyHours[key]?.end)
                    ? `${weeklyHours[key].start}–${weeklyHours[key].end}`
                    : <span style={{ color: "#aaa" }}>Not defined</span>
                  )
              }
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
```