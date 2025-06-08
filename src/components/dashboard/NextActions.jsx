import React from "react";

const actionColors = {
  warning: "#d9534f",
  info: "#5bc0de",
  success: "#5cb85c",
};

const NextActions = ({ stats }) => {
  if (!stats || typeof stats !== "object") return null;

  const {
    orders_count = 0,
    views_count = 0,
    appointments_count = 0,  // עדכון לשם השדה הנכון
    reviews_count = 0,
    requests_count = 0,
  } = stats;

  const actions = [];

  if (views_count > 100 && orders_count < 5) {
    actions.push({ text: "👀 הרבה צפיות – כדאי לפרסם שירות חדש או מבצע", type: "info" });
  }

  if (appointments_count === 0) {  // שימוש בשדה המעודכן
    actions.push({ text: "📅 אין פגישות השבוע – קבעי שיחות ייעוץ", type: "warning" });
  }

  if (reviews_count === 0) {
    actions.push({ text: "⭐ אין ביקורות – בקשי מלקוחות לדרג אותך", type: "warning" });
  }

  if (requests_count === 0) {
    actions.push({ text: "📩 אין פניות חדשות – נסי להעלות תוכן חדש במדיה החברתית", type: "warning" });
  }

  if (actions.length === 0) {
    actions.push({ text: "✅ הכל נראה מעולה – המשיכי ככה!", type: "success" });
  }

  return (
    <div className="actions-container">
      <h4>המלצות לפעולה חכמה 🤖</h4>
      <ul>
        {actions.map(({ text, type }, i) => (
          <li key={i} style={{ color: actionColors[type], marginBottom: '8px', fontWeight: '600' }}>
            {text}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NextActions;
