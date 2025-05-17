import React, { useState } from "react";
import "react-calendar/dist/Calendar.css";
import "./CalendarSetup.css";

// ימי השבוע בעברית
const weekdays = [
  "ראשון", "שני", "שלישי", "רביעי", "חמישי", "שישי", "שבת"
];

// ברירת מחדל: שעות לכל יום (סגור בשבת)
const defaultWeeklyHours = {
  0: { start: "09:00", end: "18:00" },
  1: { start: "09:00", end: "18:00" },
  2: { start: "09:00", end: "18:00" },
  3: { start: "09:00", end: "18:00" },
  4: { start: "09:00", end: "18:00" },
  5: { start: "09:00", end: "14:00" },
  6: null, // שבת: סגור
};

export default function CalendarSetup({
  initialHours = defaultWeeklyHours,
  onSave,
  onCancel
}) {
  const [weeklyHours, setWeeklyHours] = useState(initialHours);

  // שינוי שעות או "סגור" לכל יום
  const handleChange = (dayIdx, field, value) => {
    setWeeklyHours(prev => ({
      ...prev,
      [dayIdx]: prev[dayIdx]
        ? { ...prev[dayIdx], [field]: value }
        : { start: "", end: "" }
    }));
  };

  const handleToggleClosed = dayIdx => {
    setWeeklyHours(prev => ({
      ...prev,
      [dayIdx]: prev[dayIdx] ? null : { start: "", end: "" }
    }));
  };

  const handleSave = () => {
    if (onSave) onSave(weeklyHours);
    else alert("השעות נשמרו");
  };

  return (
    <div className="calendar-setup-container">
      <h2 style={{ textAlign: "center" }}>🗓️ הגדרת שעות פעילות קבועות לשבוע</h2>
      <div className="weekly-hours-table" style={{
        background: "#fff",
        borderRadius: 12,
        boxShadow: "0 1px 6px #d3c1fa40",
        maxWidth: 430,
        margin: "0 auto",
        padding: 16
      }}>
        <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: "0 10px" }}>
          <thead>
            <tr>
              <th>יום</th>
              <th>התחלה</th>
              <th>סיום</th>
              <th>סגור</th>
            </tr>
          </thead>
          <tbody>
            {weekdays.map((name, i) => (
              <tr key={i}>
                <td style={{ fontWeight: 500 }}>{name}</td>
                <td>
                  <input
                    type="time"
                    value={weeklyHours[i]?.start || ""}
                    onChange={e => handleChange(i, "start", e.target.value)}
                    disabled={weeklyHours[i] === null}
                    style={{ borderRadius: 8, padding: 4, border: "1px solid #ccc", minWidth: 70 }}
                  />
                </td>
                <td>
                  <input
                    type="time"
                    value={weeklyHours[i]?.end || ""}
                    onChange={e => handleChange(i, "end", e.target.value)}
                    disabled={weeklyHours[i] === null}
                    style={{ borderRadius: 8, padding: 4, border: "1px solid #ccc", minWidth: 70 }}
                  />
                </td>
                <td>
                  <input
                    type="checkbox"
                    checked={weeklyHours[i] === null}
                    onChange={() => handleToggleClosed(i)}
                    aria-label={`סגור ביום ${name}`}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* כפתורי שמירה */}
      <div style={{
        marginTop: "2rem",
        textAlign: "center",
        display: "flex",
        gap: "1rem",
        justifyContent: "center"
      }}>
        <button className="save-all-btn styled" onClick={handleSave}>
          💾 שמור שעות שבועיות
        </button>
        {onCancel && (
          <button className="cancel-btn styled" onClick={onCancel}>
            חזור
          </button>
        )}
      </div>
      <div className="summary" style={{ marginTop: 30 }}>
        <strong>🗓️ סיכום שעות פעילות:</strong>
        <ul style={{ paddingRight: 0, margin: "10px 0 0 0", listStyle: "none" }}>
          {weekdays.map((name, i) => (
            <li key={i} className="summary-item">
              <b>{name}:</b>{" "}
              {weeklyHours[i] === null
                ? <span style={{ color: "#e04040" }}>סגור</span>
                : (
                  weeklyHours[i]?.start && weeklyHours[i]?.end
                    ? `${weeklyHours[i].start}–${weeklyHours[i].end}`
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
