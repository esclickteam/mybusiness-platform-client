import React, { useState } from "react";
import "./CalendarView.css"; // ודא שאתה מייבא את קובץ ה-CSS

const CalendarView = ({ appointments, onDateClick }) => {
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());

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

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay();

  const byDay = {};
  (appointments || []).forEach((appt) => {
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

  return (
    <div className="graph-box" style={{ direction: "rtl" }}>
      <h4>
        📆 יומן חודשי ({currentYear}/
        {(currentMonth + 1).toString().padStart(2, "0")})
      </h4>

      <div className="date-picker-text">
        בחר תאריך כדי לראות לוח"ז
      </div>

      <div className="month-navigation">
        <button onClick={goToPreviousMonth}>← חודש קודם</button>
        <button onClick={goToNextMonth}>חודש הבא →</button>
      </div>

      <div className="calendar-grid">
        {calendarCells.map(({ day, dateStr, events }, idx) => (
          <div
            key={idx}
            className="calendar-day"
            onClick={() => day && onDateClick && onDateClick(dateStr)}
            style={{
              cursor: day ? "pointer" : "default",
              backgroundColor: day ? undefined : "#f0f0f0",
            }}
            title={day ? "לחצי כדי לראות לו״ז יומי" : ""}
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
    </div>
  );
};

export default CalendarView;
