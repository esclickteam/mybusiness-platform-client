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
  messages: 1,  
};

const NextActions = ({ stats }) => {
  if (!stats || typeof stats !== "object") return null;

  const {
    views_count = 0,
    appointments_count = 0,
    reviews_count = 0,
    messages_count = 0,
  } = stats;

  const actions = [];

  if (views_count < THRESHOLDS.views) {
    actions.push({ text: "אין הרבה צפיות – כדאי לפרסם שירות חדש או מבצע", type: "info" });
  } else {
    actions.push({ text: "👀 צפיות בפרופיל במצב טוב", type: "success" });
  }

  if (appointments_count < THRESHOLDS.appointments) {
    actions.push({ text: "📅 מעט פגישות השבוע – שקלי לקבוע שיחות ייעוץ", type: "warning" });
  } else {
    actions.push({ text: "📅 מספר הפגישות השבועי תקין", type: "success" });
  }

  if (reviews_count < THRESHOLDS.reviews) {
    actions.push({ text: "⭐ מעט ביקורות – בקשי מלקוחות לדרג אותך", type: "warning" });
  } else {
    actions.push({ text: "⭐ יש ביקורות טובות ומספיקות", type: "success" });
  }

  if (messages_count < THRESHOLDS.messages) {
    actions.push({ text: "📩 אין הודעות חדשות מלקוחות – נסי להעלות תוכן חדש במדיה החברתית", type: "warning" });
  } else {
    actions.push({ text: "📩 יש מספיק הודעות מלקוחות", type: "success" });
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
