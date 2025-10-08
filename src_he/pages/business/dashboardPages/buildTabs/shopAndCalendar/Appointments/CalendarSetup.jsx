import React, { useState, useEffect } from "react";
import "./CalendarSetup.css";

// Days of the week in Hebrew according to the day index (0=Sunday, 6=Saturday)
const weekdays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday"
];

// Default working hours (can be fetched from the server or set locally)
const defaultWeeklyHours = {
  0: { start: "09:00", end: "18:00" },
  1: { start: "09:00", end: "18:00" },
  2: { start: "09:00", end: "18:00" },
  3: { start: "09:00", end: "18:00" },
  4: { start: "09:00", end: "18:00" },
  5: { start: "09:00", end: "14:00" },
  6: null // Closed on Saturday
};

export default function CalendarSetup({ initialHours = defaultWeeklyHours, onSave, onCancel }) {
  const [weeklyHours, setWeeklyHours] = useState(initialHours);

  // Internal synchronization: update weeklyHours on any change of initialHours in props
  useEffect(() => {
    setWeeklyHours(initialHours);
  }, [initialHours]);

  // Change start/end hours for a specific day
  const handleChange = (dayIdx, field, value) => {
    setWeeklyHours(prev => ({
      ...prev,
      [dayIdx]: prev[dayIdx]
        ? { ...prev[dayIdx], [field]: value }
        : { start: "", end: "" }
    }));
  };

  // Click on "Close" / "Open" for a specific day
  const handleToggleClosed = dayIdx => {
    setWeeklyHours(prev => ({
      ...prev,
      [dayIdx]: prev[dayIdx] ? null : { start: "", end: "" }
    }));
  };

  // Save function
  const handleSave = () => {
    if (onSave) {
      onSave(weeklyHours);
    } else {
      alert("The hours have been saved");
    }
  };

  return (
    <div className="calendar-setup-container">
      <h2 className="calendar-title">🗓️ Setting Fixed Weekly Operating Hours</h2>

      <div className="weekly-hours-table">
        <table>
          <thead>
            <tr>
              <th>Day</th>
              <th>Start</th>
              <th>End</th>
              <th>Close</th>
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
                    aria-label={`Close ${name}`}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="actions">
        <button className="save-all-btn styled" onClick={handleSave}>
          💾 Save Weekly Hours
        </button>
        {onCancel && (
          <button className="cancel-btn styled" onClick={onCancel}>
            Back
          </button>
        )}
      </div>

      <div className="summary">
        <strong>🗓️ Summary of Operating Hours:</strong>
        <ul>
          {weekdays.map((name, i) => (
            <li key={i} className="summary-item">
              <span className="day-label">{name}:</span>
              {weeklyHours[i] === null ? (
                <span className="closed-label">Closed</span>
              ) : weeklyHours[i]?.start && weeklyHours[i]?.end ? (
                <span className="hours-label">
                  {weeklyHours[i].start} – {weeklyHours[i].end}
                </span>
              ) : (
                <span className="hours-label">Not Defined</span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
