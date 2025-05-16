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

  useEffect(() => {
    const saved = customHours[selectedDate.toDateString()];
    setStart(saved?.start || "");
    setEnd(saved?.end || "");
    setBreaks(saved?.breaks || "");
  }, [selectedDate, customHours]);

  const dateKey = selectedDate.toDateString();

  const saveDateHours = () => {
    if (!start || !end) return;

    setCustomHours((prev) => ({
      ...prev,
      [dateKey]: { start, end, breaks },
    }));
    // הערכים נשארים עד מעבר יום
  };

  const handleSaveAll = () => {
    if (onSave) {
      onSave({
        workHours: customHours
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

  return (
    <div className="calendar-setup-container">
      <h2>📅 הגדרת שעות פעילות לפי תאריך</h2>

      <Calendar
        locale="he-IL"
        value={selectedDate}
        onChange={(date) => setSelectedDate(date)}
      />

      <div className="inputs" style={{ marginTop: "20px" }}>
        <h4>⏰ שעות פעילות ל־{selectedDate.toLocaleDateString("he-IL")}:</h4>

        <label>שעת התחלה:</label>
        <input
          type="time"
          value={start}
          onChange={(e) => setStart(e.target.value)}
        />

        <label>שעת סיום:</label>
        <input
          type="time"
          value={end}
          onChange={(e) => setEnd(e.target.value)}
        />

        <label>הפסקות (לא חובה):</label>
        <input
          type="text"
          placeholder="לדוגמה: 12:00–12:30"
          value={breaks}
          onChange={(e) => setBreaks(e.target.value)}
        />

        <button onClick={saveDateHours} className="edit-date-btn">
          ✏️ שמור שעות לתאריך זה
        </button>
      </div>

      <div style={{
        marginTop: "2rem",
        textAlign: "center",
        display: "flex",
        gap: "1rem",
        justifyContent: "center"
      }}>
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
