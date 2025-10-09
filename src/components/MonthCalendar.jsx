import React from 'react';
import './MonthCalendar.css';

export default function MonthCalendar({
  year,
  month,
  selectedDate,
  onDateClick,
  onPrevMonth,
  onNextMonth
}) {
  const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startDay = new Date(year, month, 1).getDay();

  // Build the date cells (empty + date numbers)
  const cells = [];
  for (let i = 0; i < startDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  const isSelected = (day) =>
    selectedDate &&
    day &&
    selectedDate.getFullYear() === year &&
    selectedDate.getMonth() === month &&
    selectedDate.getDate() === day;

  return (
    <div className="calendar-container">
      {/* Month and year header with arrows (if handlers exist) */}
      <div className="calendar-header">
        {onPrevMonth && (
          <button className="month-arrow" onClick={onPrevMonth} aria-label="Previous month">
            ←
          </button>
        )}
        <div>
          <div className="month-hebrew">
            {new Date(year, month).toLocaleString('en-US', { month: 'long' })}
          </div>
          <div className="year">{year}</div>
        </div>
        {onNextMonth && (
          <button className="month-arrow" onClick={onNextMonth} aria-label="Next month">
            →
          </button>
        )}
      </div>

      {/* Weekdays */}
      <div className="calendar-weekdays">
        {weekdays.map((w) => (
          <div key={w} className="weekday">{w}</div>
        ))}
      </div>

      {/* Dates */}
      <div className="calendar-dates">
        {cells.map((day, idx) => (
          <div
            key={idx}
            className={
              `date-cell${isSelected(day) ? " selected" : ""}${day ? " clickable" : ""}`
            }
            onClick={() => day && onDateClick && onDateClick(new Date(year, month, day))}
            tabIndex={day ? 0 : -1}
            role={day ? "button" : undefined}
            aria-selected={isSelected(day) ? "true" : undefined}
          >
            {day && <span className="date-number">{day}</span>}
          </div>
        ))}
      </div>
    </div>
  );
}
