import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./CalendarSetup.css";

const CalendarSetup = ({ initialHours = {}, onSave, onCancel }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [customHours, setCustomHours] = useState(initialHours || {});
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [breaks, setBreaks] = useState("");
  const [savedFeedback, setSavedFeedback] = useState(false);

  useEffect(() => {
    const saved = customHours[selectedDate.toDateString()];
    setStart(saved?.start || "");
    setEnd(saved?.end || "");
    setBreaks(saved?.breaks || "");
    setSavedFeedback(false);
  }, [selectedDate, customHours]);

  const dateKey = selectedDate.toDateString();

  const saveDateHours = () => {
    if (!start || !end) return;
    setCustomHours((prev) => ({
      ...prev,
      [dateKey]: { start, end, breaks },
    }));
    setSavedFeedback(true);
  };

  const handleSaveAll = () => {
    if (onSave) {
      onSave({
        workHours: customHours,
      });
    } else {
      // fallback לדמו/לוקאלסטורג'
      const userEmail = localStorage.getItem("userEmail");
      if (userEmail === "newuser@example.com") {
        localStorage.setItem("demoWorkHours", JSON.stringify(customHours));
        alert("השעות נשמרו בדמו (localStorage)");
      }
    }
  };

  // פורמט יפה לתצוגה
  const formatHours = ({ start, end, breaks }) =>
    `${start || "--:--"} – ${end || "--:--"}${breaks ? ` | הפסקה: ${breaks}` : ""}`;

  // חיווי ויזואלי בקלנדר
  const tileContent = ({ date }) =>
    customHours[date.toDateString()] ? <span className="has-hours-dot"></span> : null;

  return (
    <div className="calendar-setup-container">
      <h2>📅 הגדרת שעות פעילות לפי תאריך</h2>

      <Calendar
        locale="he-IL"
        value={selectedDate}
        onChange={(date) => setSelectedDate(date)}
        tileContent={tileContent}
      />

      <div className="inputs" style={{ marginTop: "20px" }}>
        <h4>
          ⏰ שעות פעילות ל־{selectedDate.toLocaleDateString("he-IL")}
          {savedFeedback && (
            <span style={{ color: "#2ecc40", fontSize: "1.1em", marginRight: 8 }}>✓ נשמר</span>
          )}
        </h4>

        <label>
          <span role="img" aria-label="start">🕗</span> שעת התחלה:
        </label>
        <input
          type="time"
          value={start}
          onChange={(e) => setStart(e.target.value)}
        />

        <label>
          <span role="img" aria-label="end">🕘</span> שעת סיום:
        </label>
        <input
          type="time"
          value={end}
          onChange={(e) => setEnd(e.target.value)}
        />

        <label>
          <span role="img" aria-label="breaks">🍽️</span> הפסקות (לא חובה):
        </label>
        <input
          type="text"
          placeholder="לדוג' 12:00–12:30"
          value={breaks}
          onChange={(e) => setBreaks(e.target.value)}
        />

        <button
          onClick={saveDateHours}
          className="edit-date-btn"
          disabled={!start || !end}
          style={{
            opacity: !start || !end ? 0.5 : 1,
            cursor: !start || !end ? "not-allowed" : "pointer",
          }}
        >
          ✏️ שמור שעות ל־{selectedDate.toLocaleDateString("he-IL")}
        </button>
      </div>

      {/* הצג סיכום של כל התאריכים עם שעות שנשמרו */}
      {Object.keys(customHours).length > 0 && (
        <div className="summary">
          <strong>🗓️ סיכום שעות פעילות שהוגדרו:</strong>
          <ul style={{ paddingRight: 0, margin: "10px 0 0 0", listStyle: "none" }}>
            {Object.entries(customHours).map(([date, hours]) => (
              <li key={date} className="summary-item">
                <b>{new Date(date).toLocaleDateString("he-IL")}</b>: {formatHours(hours)}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div
        style={{
          marginTop: "2rem",
          textAlign: "center",
          display: "flex",
          gap: "1rem",
          justifyContent: "center",
        }}
      >
        <button className="save-all-btn styled" onClick={handleSaveAll}>
          💾 שמור את כל הגדרות היומן
        </button>
        {onCancel && (
          <button className="cancel-btn styled" onClick={onCancel}>
            חזור
          </button>
        )}
      </div>
    </div>
  );
};

export default CalendarSetup;
