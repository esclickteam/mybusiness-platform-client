// src/components/MonthCalendar.jsx
import React from 'react';
import './MonthCalendar.css';

export default function MonthCalendar({ year, month, onDateClick }) {
  const weekdays = ['ראשון','שני','שלישי','רביעי','חמישי','שישי','שבת'];

  // בונה מערך תאים לחודש ספציפי
  const buildCells = (year, month) => {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const startDay  = new Date(year, month, 1).getDay(); // 0=ראשון
    const cells = [];

    for (let i = 0; i < startDay; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(d);
    while (cells.length % 7 !== 0) cells.push(null);
    return cells;
  };

  const cells = buildCells(year, month);

  return (
    <div className="calendar-single-wrapper">
      <div className="calendar-single-title">
        {new Date(year, month).toLocaleString('he-IL', { month: 'long' })} {year}
      </div>

      <div className="calendar-single-weekdays">
        {weekdays.map(w => (
          <div key={w} className="weekday">{w}</div>
        ))}
      </div>

      <div className="calendar-single-cells">
        {cells.map((day, idx) => (
          <div
            key={idx}
            className="cell"
            onClick={() => day && onDateClick(new Date(year, month, day))}
            style={{ cursor: day ? 'pointer' : 'default' }}
          >
            {day && <span className="day">{day}</span>}
          </div>
        ))}
      </div>
    </div>
  );
}
