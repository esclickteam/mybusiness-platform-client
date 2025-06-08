import React from "react";

const actionColors = {
  warning: "#d9534f",
  info: "#5bc0de",
  success: "#5cb85c",
};

const NextActions = ({ stats }) => {
  // כאן לא בודקים תנאים, מציגים תמיד את כל ההמלצות
  const actions = [
  { text: "אין הרבה צפיות – כדאי לפרסם שירות חדש או מבצע", type: "info" },
  { text: "📅 אין פגישות השבוע – קבעי שיחות ייעוץ", type: "warning" },
  { text: "⭐ אין ביקורות – בקשי מלקוחות לדרג אותך", type: "warning" },
  { text: "📩 אין פניות חדשות – נסי להעלות תוכן חדש במדיה החברתית", type: "warning" },
];

  return (
    <div className="actions-container">
      <h4>המלצות לפעולה חכמה 🤖</h4>
      <ul>
        {actions.map(({ text, type }, i) => (
          <li
            key={i}
            style={{ color: actionColors[type], marginBottom: '8px', fontWeight: '600' }}
          >
            {text}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NextActions;
