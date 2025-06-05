import React, { useState } from "react";

const CalendarView = ({ appointments, onDateClick }) => {
  // מצב פנימי של חודש ושנה שמוצגים
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth()); // 0-11

  // פונקציות ניווט
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

  // מספר ימים בחודש
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  // היום בשבוע שבו מתחיל החודש (0 = ראשון, 6 = שבת)
  const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay();

  // מיון הפגישות לפי תאריך (YYYY-MM-DD)
  const byDay = {};
  (appointments || []).forEach((appt) => {
    const date = new Date(appt.date).toISOString().split("T")[0];
    if (!byDay[date]) byDay[date] = [];
    byDay[date].push(appt);
  });

  // יצירת מערך תאים שיכלול גם רווחים לפני תחילת החודש
  const totalCells = daysInMonth + firstDayOfWeek;
  const calendarCells = Array.from({ length: totalCells }, (_, i) => {
    if (i < firstDayOfWeek) {
      // תאים ריקים לפני תחילת החודש
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

      {/* הטקסט בצד שמאל */}
      <div
        style={{
          textAlign: "left",
          marginBottom: "10px",
          fontStyle: "italic",
          color: "#333",
        }}
      >
        בחר תאריך כדי לראות לוח"ז
      </div>

      {/* ניווט חודשים */}
      <div
        style={{
          marginBottom: "10px",
          display: "flex",
          justifyContent: "center",
          gap: "12px",
        }}
      >
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
