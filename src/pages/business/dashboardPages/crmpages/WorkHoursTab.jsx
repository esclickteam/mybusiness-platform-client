import React, { useState, useEffect } from "react";
import API from "@api";
import '../buildTabs/shopAndCalendar/Appointments/CalendarSetup.css';

const weekdays = [
  "ראשון",
  "שני",
  "שלישי",
  "רביעי",
  "חמישי",
  "שישי",
  "שבת"
];

export default function WorkHoursTab() {
  const [weeklyHours, setWeeklyHours] = useState({});

  useEffect(() => {
    async function fetchWorkHours() {
      try {
        const res = await API.get("/appointments/get-work-hours");
        setWeeklyHours(res.data.workHours || {});
      } catch (e) {
        console.error("Error loading work hours:", e);
      }
    }
    fetchWorkHours();
  }, []);

  const handleChange = (dayIdx, field, value) => {
    setWeeklyHours(prev => ({
      ...prev,
      [dayIdx]: {
        ...(prev[dayIdx] ?? { start: "", end: "" }),
        [field]: value,
      }
    }));
  };

  const handleToggleClosed = dayIdx => {
    setWeeklyHours(prev => ({
      ...prev,
      [dayIdx]: prev[dayIdx] === null ? { start: "", end: "" } : null,
    }));
  };

  const handleSave = async () => {
    try {
      await API.post("/appointments/update-work-hours", { workHours: weeklyHours });
      alert("השעות נשמרו בהצלחה");
    } catch (e) {
      console.error("Error saving work hours:", e);
      alert("שגיאה בשמירת השעות");
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
