// src/components/MonthCalendar.jsx
import React from 'react';
import './MonthCalendar.css';

export default function MonthCalendar({ year, onDateClick }) {
  const weekdays = ['ראשון','שני','שלישי','רביעי','חמישי','שישי','שבת'];

  // בונים מערך של 42 תאים עבור חודש מסוים
  const buildCells = (year, month) => {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const startDay = new Date(year, month, 1).getDay(); // 0=ראשון
    const cells = [];

    // תאים ריקים לפני יום 1
    for (let i = 0; i < startDay; i++) cells.push(null);

    // תאים עם מספרי ימים
    for (let d = 1; d <= daysInMonth; d++) {
      cells.push(d);
    }

    // משלים שורה שלימה
    while (cells.length % 7 !== 0) cells.push(null);

    return cells;
  };

  // כל 12 החודשים (0 = ינואר, …, 11 = דצמבר)
  const allMonths = Array.from({ length: 12 }, (_, i) => i);

  return (
    <div className="year-calendar">
      {allMonths.map(month => {
        const cells = buildCells(year, month);
        return (
          <div key={month} className="month-block">
            <div className="month-title">
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
                      // בונים אובייקט Date עבור היום שנלחץ
                      const clicked = new Date(year, month, day);
                      onDateClick(clicked);
                    }
                  }}
                >
                  {day && (
                    <span className="day-number">{day}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
