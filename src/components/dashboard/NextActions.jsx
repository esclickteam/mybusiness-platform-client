import React from "react";

const NextActions = ({ stats }) => {
  if (!stats || typeof stats !== "object") return null;

  const {
    orders_count = 0,
    views_count = 0,
    upcoming_appointments = 0,
    reviews_count = 0,
    requests_count = 0,
  } = stats;

  const actions = [];

  if (orders_count < 3) {
    actions.push("📉 ירידה בהזמנות – שלחי קופון ללקוחות קודמים");
  }

  if (views_count > 100 && orders_count < 5) {
    actions.push("👀 הרבה צפיות – כדאי לפרסם שירות חדש או מבצע");
  }

  if (upcoming_appointments === 0) {
    actions.push("📅 אין פגישות השבוע – קבעי שיחות ייעוץ");
  }

  if (reviews_count === 0) {
    actions.push("⭐ אין ביקורות – בקשי מלקוחות לדרג אותך");
  }

  if (requests_count === 0) {
    actions.push("📩 לא התקבלו פניות – נסי להעלות סטורי חדש");
  }

  if (actions.length === 0) {
    actions.push("✅ הכל נראה מעולה – המשיכי ככה!");
  }

  return (
    <div className="actions-container">
      <h4>המלצות לפעולה חכמה 🤖</h4>
      <ul>
        {actions.map((a, i) => (
          <li key={i}>{a}</li>
        ))}
      </ul>
    </div>
  );
};

export default NextActions;
