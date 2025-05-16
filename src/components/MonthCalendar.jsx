import React from 'react';
import './MonthCalendar.css';

export default function MonthCalendar({ year, onDateClick }) {
  const weekdays = ['ראשון','שני','שלישי','רביעי','חמישי','שישי','שבת'];

  // בונה מערך תאים ליחידת חודש
  const buildCells = (year, month) => {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const startDay = new Date(year, month, 1).getDay(); // 0=ראשון
    const cells = [];
    for (let i = 0; i < startDay; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(d);
    while (cells.length % 7 !== 0) cells.push(null);
    return cells;
  };

  const allMonths = Array.from({ length: 12 }, (_, i) => i);

  return (
    <div className="calendar-year-wrapper">
      <div className="calendar-year-title">{year}</div>
      <div className="calendar-year-grid">
        {allMonths.map(month => {
          const cells = buildCells(year, month);
          return (
            <div key={month} className="month-block">
              <div className="month-block-title">
                {new Date(year, month).toLocaleString('he-IL', { month: 'long' })}
              </div>
              <div className="month-weekdays">
                {weekdays.map(w => (
                  <div key={w} className="weekday">{w}</div>
                ))}
              </div>
              <div className="month-cells">
                {cells.map((day, idx) => (
                  <div
                    key={idx}
                    className="month-cell"
                    onClick={() => {
                      if (day && onDateClick) {
                        onDateClick(new Date(year, month, day));
                      }
                    }}
                  >
                    {day && <span className="day-number">{day}</span>}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
