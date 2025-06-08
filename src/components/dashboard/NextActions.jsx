import React from "react";

const actionColors = {
  warning: "#d9534f",
  info: "#5bc0de",
  success: "#5cb85c",
};

const THRESHOLDS = {
  views: 50,
  appointments: 3,
  reviews: 3,
  messages: 1,  // שינית את השם ל messages
};

const NextActions = ({ stats }) => {
  if (!stats || typeof stats !== "object") return null;

  const {
    views_count = 0,
    appointments_count = 0,
    reviews_count = 0,
    messages_count = 0,  // כאן עדכון לשם הנכון
  } = stats;

  const actions = [];

  if (views_count < THRESHOLDS.views) {
    actions.push({ text: "אין הרבה צפיות – כדאי לפרסם שירות חדש או מבצע", type: "info" });
  }

  if (appointments_count < THRESHOLDS.appointments) {
    actions.push({ text: "📅 מעט פגישות השבוע – שקלי לקבוע שיחות ייעוץ", type: "warning" });
  }

  if (reviews_count < THRESHOLDS.reviews) {
    actions.push({ text: "⭐ מעט ביקורות – בקשי מלקוחות לדרג אותך", type: "warning" });
  }

  if (messages_count < THRESHOLDS.messages) {
    actions.push({ text: "📩 אין הודעות חדשות מלקוחות – נסי להעלות תוכן חדש במדיה החברתית", type: "warning" });
  }

  if (actions.length === 0) {
    actions.push({ text: "✅ הכל נראה מעולה – המשיכי ככה!", type: "success" });
  }

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
