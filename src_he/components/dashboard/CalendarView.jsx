import React, { useState, useEffect } from "react";
import "./CalendarView.css";

const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const getDateTime = (dateStr, timeStr) => {
  if (!dateStr) return null;
  if (!timeStr) timeStr = "00:00";
  return new Date(`${dateStr}T${timeStr}:00`);
};

const CalendarView = ({ appointments = [], onDateClick }) => {
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());

  // Log for debugging
  useEffect(() => {
    console.log("CalendarView render - appointments:", appointments);
  }, [appointments]);

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

  // Organize appointments by day
  const byDay = {};
  appointments.forEach((appt) => {
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
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return (
    <div className="calendar-container" style={{ direction: "ltr" }}>
      <div className="calendar-header">
        <h3>
          {monthNames[currentMonth]} <span>{currentYear}</span>
        </h3>
      </div>

      <div className="month-navigation">
        <button onClick={goToPreviousMonth}>← Previous Month</button>
        <button onClick={goToNextMonth}>Next Month →</button>
      </div>

      <div className="date-picker-text">Select a date to view your agenda</div>

      <div className="calendar-weekdays">
        {weekDays.map((dayName) => (
          <div key={dayName} className="weekday">
            {dayName}
          </div>
        ))}
      </div>

      <div className="calendar-grid">
        {calendarCells.map(({ day, dateStr, events }, idx) => (
          <div
            key={idx}
            className="calendar-day"
            onClick={() => day && onDateClick && onDateClick(dateStr)}
            title={day ? "Click to view daily schedule" : ""}
            style={{
              cursor: day ? "pointer" : "default",
              backgroundColor: day ? undefined : "#f0f0f0",
            }}
          >
            {day ? (
              <>
                <div className="day-number">{day}</div>
                {events.map((e, i) => {
                  const clientName = e.clientName?.trim() || "Unknown";
                  const fullDate = getDateTime(e.date, e.time);

                  return (
                    <div key={i} className="event-item">
                      🕒{" "}
                      {fullDate
                        ? fullDate.toLocaleTimeString("en-US", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "Unknown"}
                      <br />
                      👤 {clientName}
                    </div>
                  );
                })}
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
