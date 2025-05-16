import React from 'react';
import './MonthCalendar.css';

export default function MonthCalendar({ year, month }) {
  // month: 0=Jan, ..., 8=Sep
  // רשימת שמות ימי השבוע בעברית, החל מיום ראשון
  const weekdays = ['ראשון','שני','שלישי','רביעי','חמישי','שישי','שבת'];

  // כמה ימים בחודש
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  // באיזה יום בשבוע מתחיל היום הראשון (0=ראשון)
  const startDay = new Date(year, month, 1).getDay();

  // בונים מערך של תאים: קודם תאים ריקים לפי startDay, אחר־כך 1..daysInMonth
  const cells = [];
  for (let i = 0; i < startDay; i++) {
    cells.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push(d);
  }
  // אם רוצים להשלים לשורה מלאה בסוף:
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <div className="calendar-container">
      {/* כותרת חודש ושנה */}
      <div className="calendar-header">
        <div className="month-hebrew">{new Date(year, month).toLocaleString('he-IL', { month: 'long' })}</div>
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
          <div key={idx} className="date-cell">
            {day && <span className="date-number">{day}</span>}
          </div>
        ))}
      </div>
    </div>
  );
}
