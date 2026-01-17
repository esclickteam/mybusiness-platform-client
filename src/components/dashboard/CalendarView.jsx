import React, { useState, useMemo } from "react";
import "./CalendarView.css";

const WEEK_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const MONTH_NAMES = [
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

const CalendarView = ({ appointments = [], onDateClick }) => {
  const today = new Date();

  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());

  /* =========================
     Month navigation
  ========================= */
  const goPrev = () => {
    setCurrentMonth((m) => {
      if (m === 0) {
        setCurrentYear((y) => y - 1);
        return 11;
      }
      return m - 1;
    });
  };

  const goNext = () => {
    setCurrentMonth((m) => {
      if (m === 11) {
        setCurrentYear((y) => y + 1);
        return 0;
      }
      return m + 1;
    });
  };

  /* =========================
     Appointments by day
  ========================= */
  const appointmentsByDay = useMemo(() => {
    const map = {};
    appointments.forEach((a) => {
      if (!a.date) return;
      const d = new Date(a.date).toISOString().split("T")[0];
      if (!map[d]) map[d] = [];
      map[d].push(a);
    });
    return map;
  }, [appointments]);

  /* =========================
     Calendar grid
  ========================= */
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay();

  const cells = Array.from(
    { length: daysInMonth + firstDayOfWeek },
    (_, i) => {
      if (i < firstDayOfWeek) {
        return { day: null };
      }

      const day = i - firstDayOfWeek + 1;
      const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(
        2,
        "0"
      )}-${String(day).padStart(2, "0")}`;

      const isToday =
        dateStr === new Date().toISOString().split("T")[0];

      return {
        day,
        dateStr,
        isToday,
        count: appointmentsByDay[dateStr]?.length || 0,
      };
    }
  );

  /* =========================
     Render
  ========================= */
  return (
    <div className="calendar-container" dir="ltr">
      {/* Header */}
      <div className="calendar-header">
        <button className="nav-btn" onClick={goPrev}>
          ←
        </button>

        <h3 className="calendar-title">
          {MONTH_NAMES[currentMonth]} {currentYear}
        </h3>

        <button className="nav-btn" onClick={goNext}>
          →
        </button>
      </div>

      <div className="calendar-hint">
        Click a date to view your daily agenda
      </div>

      {/* Weekdays */}
      <div className="calendar-weekdays">
        {WEEK_DAYS.map((d) => (
          <div key={d} className="weekday">
            {d}
          </div>
        ))}
      </div>

      {/* Grid */}
      <div className="calendar-grid">
        {cells.map((cell, idx) => {
          if (!cell.day) {
            return <div key={idx} className="calendar-cell empty" />;
          }

          return (
            <div
              key={idx}
              className={`calendar-cell ${
                cell.isToday ? "today" : ""
              } ${cell.count ? "has-events" : ""}`}
              onClick={() =>
                onDateClick && onDateClick(cell.dateStr)
              }
            >
              <div className="cell-day">{cell.day}</div>

              {cell.count > 0 && (
                <div className="cell-events">
                  {cell.count} appointment
                  {cell.count > 1 ? "s" : ""}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarView;
