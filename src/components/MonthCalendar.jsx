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
  const weekdays = ['ראשון','שני','שלישי','רביעי','חמישי','שישי','שבת'];
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startDay = new Date(year, month, 1).getDay();

  // מבנה תאי התאריכים (ריקים + תאריכים)
  const cells = [];
  for (let i = 0; i < startDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  const isSelected = day =>
    selectedDate &&
    day &&
    selectedDate.getFullYear() === year &&
    selectedDate.getMonth() === month &&
    selectedDate.getDate() === day;

  return (
    <div className="calendar-container">
      {/* כותרת חודש ושנה עם חצים (אם התקבלו פונקציות) */}
      <div className="calendar-header">
        {onPrevMonth && (
          <button className="month-arrow" onClick={onPrevMonth} aria-label="חודש קודם">
            ←
          </button>
        )}
        <div>
          <div className="month-hebrew">
            {new Date(year, month).toLocaleString('he-IL', { month: 'long' })}
          </div>
          <div className="year">{year}</div>
        </div>
        {onNextMonth && (
          <button className="month-arrow" onClick={onNextMonth} aria-label="חודש הבא">
            →
          </button>
        )}
      </div>

      {/* ימי השבוע */}
      <div className="calendar-weekdays">
        {weekdays.map(w => (
          <div key={w} className="weekday">{w}</div>
        ))}
      </div>

      {/* תאריכים */}
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
