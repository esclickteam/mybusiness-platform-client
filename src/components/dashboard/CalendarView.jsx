import React, { useState, useEffect } from "react";
import "./CalendarView.css";

const weekDays = ["ראשון", "שני", "שלישי", "רביעי", "חמישי", "שישי", "שבת"];

const CalendarView = ({ appointments, onDateClick }) => {
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());

  const goToPreviousMonth = () => {
    setCurrentMonth((prev) => {
      if (prev === 0) {
        setCurrentYear((y) => y - 1);
        return 11;
      }
      return prev - 1;
    });
  };

  const goToNextMonth = () => {
    setCurrentMonth((prev) => {
      if (prev === 11) {
        setCurrentYear((y) => y + 1);
        return 0;
      }
      return prev + 1;
    });
  };

  // חישוב מספר ימים בחודש וביום בשבוע של היום הראשון
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay();

  // מיון וסידור הפגישות לפי תאריך (מחרוזת YYYY-MM-DD)
  const byDay = {};
  (appointments || []).forEach((appt) => {
    if (!appt.date) return;
    const date = new Date(appt.date).toISOString().split("T")[0];
    if (!byDay[date]) byDay[date] = [];
    byDay[date].push(appt);
  });

  const totalCells = daysInMonth + firstDayOfWeek;
  const calendarCells = Array.from({ length: totalCells }, (_, i) => {
    if (i < firstDayOfWeek) {
      return { day: null, dateStr: null, events: [] };
    } else {
      const day = i - firstDayOfWeek + 1;
      const dateStr = `${currentYear}-${(currentMonth + 1)
        .toString()
        .padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
      return { day, dateStr, events: byDay[dateStr] || [] };
    }
  });

  const monthNames = [
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

  return (
    <>
      <div className="calendar-header" style={{ direction: "rtl" }}>
        <h3>{monthNames[currentMonth]}</h3>
        <span>{currentYear}</span>
      </div>

      <div className="month-navigation" style={{ direction: "rtl" }}>
        <button onClick={goToPreviousMonth}>← חודש קודם</button>
        <button onClick={goToNextMonth}>חודש הבא →</button>
      </div>

      <div className="date-picker-text" style={{ direction: "rtl" }}>
        בחר תאריך כדי לראות לוח"ז
      </div>

      <div className="calendar-weekdays" style={{ direction: "rtl" }}>
        {weekDays.map((dayName) => (
          <div key={dayName} className="weekday">
            {dayName}
          </div>
        ))}
      </div>

      <div className="calendar-grid" style={{ direction: "rtl" }}>
        {calendarCells.map(({ day, dateStr, events }, idx) => (
          <div
            key={idx}
            className="calendar-day"
            onClick={() => day && onDateClick && onDateClick(dateStr)}
            title={day ? "לחצי כדי לראות לו״ז יומי" : ""}
            style={{
              cursor: day ? "pointer" : "default",
              backgroundColor: day ? undefined : "#f0f0f0",
            }}
          >
            {day ? (
              <>
                <div className="day-number">{day}</div>
                {events.map((e, i) => (
                  <div key={i} className="event-item">
                    🕒{" "}
                    {new Date(e.date).toLocaleTimeString("he-IL", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                    <br />
                    👤 {e.client}
                  </div>
                ))}
              </>
            ) : (
              <div className="empty-day" />
            )}
          </div>
        ))}
      </div>
    </>
  );
};

export default CalendarView;
