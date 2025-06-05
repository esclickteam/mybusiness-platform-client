import React from "react";

const CalendarView = ({ appointments, onDateClick }) => {
  if (!appointments || appointments.length === 0) {
    return (
      <div className="graph-box">
        <h4>📆 יומן חודשי</h4>
        <p style={{ textAlign: "center" }}>אין פגישות החודש.</p>
      </div>
    );
  }

  // קבלת השנה והחודש הנוכחיים
  const now = new Date();
  const year = now.getFullYear();
  const month = (now.getMonth() + 1).toString().padStart(2, "0");

  // מיון הפגישות לפי תאריך (מחרוזת YYYY-MM-DD)
  const byDay = {};
  appointments.forEach(appt => {
    const date = new Date(appt.date).toISOString().split("T")[0];
    if (!byDay[date]) byDay[date] = [];
    byDay[date].push(appt);
  });

  // יצירת מערך של 31 ימים עם הפגישות ליום
  const daysInMonth = Array.from({ length: 31 }, (_, i) => {
    const day = i + 1;
    const dateStr = `${year}-${month}-${day.toString().padStart(2, "0")}`;
    return { day, dateStr, events: byDay[dateStr] || [] };
  });

  return (
    <div className="graph-box">
      <h4>📆 יומן חודשי ({year}/{month})</h4>
      <div className="calendar-grid">
        {daysInMonth.map(({ day, dateStr, events }) => (
          <div
            key={dateStr}
            className="calendar-day"
            onClick={() => onDateClick && onDateClick(dateStr)}
            style={{ cursor: "pointer" }}
            title="לחצי כדי לראות לו״ז יומי"
          >
            <div className="day-number">{day}</div>
            {events.map((e, i) => (
              <div key={i} className="event-item">
                🕒 {new Date(e.date).toLocaleTimeString("he-IL", {
                  hour: "2-digit",
                  minute: "2-digit"
                })}
                <br />
                👤 {e.client}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CalendarView;
