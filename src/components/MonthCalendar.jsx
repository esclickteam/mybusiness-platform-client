import React from 'react';
import './MonthCalendar.css';

export default function MonthCalendar({ year, month, selectedDate, onDateClick }) {
  // שמות ימי השבוע
  const weekdays = ['ראשון','שני','שלישי','רביעי','חמישי','שישי','שבת'];

  // כמה ימים בחודש
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  // באיזה יום בשבוע מתחיל היום הראשון (0=ראשון)
  const startDay = new Date(year, month, 1).getDay();

  // מערך תאים: ריקים + תאריכים
  const cells = [];
  for (let i = 0; i < startDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  // תאריך נבחר
  const selected =
    selectedDate &&
    selectedDate.getFullYear() === year &&
    selectedDate.getMonth() === month
      ? selectedDate.getDate()
      : null;

  return (
    <div className="calendar-container">
      {/* כותרת חודש ושנה */}
      <div className="calendar-header">
        <div className="month-hebrew">
          {new Date(year, month).toLocaleString('he-IL', { month: 'long' })}
        </div>
        <div className="year">{year}</div>
      </div>

      {/* ימי שבוע */}
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
            className={`date-cell${day === selected ? " selected" : ""}${day ? " clickable" : ""}`}
            onClick={() => day && onDateClick && onDateClick(new Date(year, month, day))}
          >
            {day && <span className="date-number">{day}</span>}
          </div>
        ))}
      </div>
    </div>
  );
}
