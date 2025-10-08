import React, { useState, useEffect } from "react";
import "./CalendarSetup.css";

// ימי השבוע בעברית לפי אינדקס יום בשבוע (0=ראשון, 6=שבת)
const weekdays = [
  "ראשון",
  "שני",
  "שלישי",
  "רביעי",
  "חמישי",
  "שישי",
  "שבת"
];

// ברירת מחדל לשעות עבודה (אפשר להכניס מהשרת או מקומית)
const defaultWeeklyHours = {
  0: { start: "09:00", end: "18:00" },
  1: { start: "09:00", end: "18:00" },
  2: { start: "09:00", end: "18:00" },
  3: { start: "09:00", end: "18:00" },
  4: { start: "09:00", end: "18:00" },
  5: { start: "09:00", end: "14:00" },
  6: null // סגור בשבת
};

export default function CalendarSetup({ initialHours = defaultWeeklyHours, onSave, onCancel }) {
  const [weeklyHours, setWeeklyHours] = useState(initialHours);

  // סנכרון פנימי: עדכון weeklyHours בכל שינוי של initialHours בפרופס
  useEffect(() => {
    setWeeklyHours(initialHours);
  }, [initialHours]);

  // שינוי בשעות התחלה/סיום עבור יום ספציפי
  const handleChange = (dayIdx, field, value) => {
    setWeeklyHours(prev => ({
      ...prev,
      [dayIdx]: prev[dayIdx]
        ? { ...prev[dayIdx], [field]: value }
        : { start: "", end: "" }
    }));
  };

  // לחיצה על "סגור" / "פתח" עבור יום ספציפי
  const handleToggleClosed = dayIdx => {
    setWeeklyHours(prev => ({
      ...prev,
      [dayIdx]: prev[dayIdx] ? null : { start: "", end: "" }
    }));
  };

  // פונקציית שמירה
  const handleSave = () => {
    if (onSave) {
      onSave(weeklyHours);
    } else {
      alert("השעות נשמרו");
    }
  };

  return (
    <div className="calendar-setup-container">
      <h2 className="calendar-title">🗓️ הגדרת שעות פעילות קבועות לשבוע</h2>

      <div className="weekly-hours-table">
        <table>
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
                <td className="day-cell">{name}</td>
                <td>
                  <input
                    type="time"
                    className="time-input"
                    value={weeklyHours[i]?.start || ""}
                    onChange={e => handleChange(i, "start", e.target.value)}
                    disabled={weeklyHours[i] === null}
                  />
                </td>
                <td>
                  <input
                    type="time"
                    className="time-input"
                    value={weeklyHours[i]?.end || ""}
                    onChange={e => handleChange(i, "end", e.target.value)}
                    disabled={weeklyHours[i] === null}
                  />
                </td>
                <td>
                  <input
                    type="checkbox"
                    className="close-checkbox"
                    checked={weeklyHours[i] === null}
                    onChange={() => handleToggleClosed(i)}
                    aria-label={`סגור ${name}`}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="actions">
        <button className="save-all-btn styled" onClick={handleSave}>
          💾 שמור שעות שבועיות
        </button>
        {onCancel && (
          <button className="cancel-btn styled" onClick={onCancel}>
            חזור
          </button>
        )}
      </div>

      <div className="summary">
        <strong>🗓️ סיכום שעות פעילות:</strong>
        <ul>
          {weekdays.map((name, i) => (
            <li key={i} className="summary-item">
              <span className="day-label">{name}:</span>
              {weeklyHours[i] === null ? (
                <span className="closed-label">סגור</span>
              ) : weeklyHours[i]?.start && weeklyHours[i]?.end ? (
                <span className="hours-label">
                  {weeklyHours[i].start} – {weeklyHours[i].end}
                </span>
              ) : (
                <span className="hours-label">לא הוגדר</span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
