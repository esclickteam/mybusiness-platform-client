import React from "react";
import "./NextActions.css";

const THRESHOLDS = {
  views: 40,
  appointments: 1,
  reviews: 1,
  messages: 1,  
};

const NextActions = ({ stats }) => {
  if (!stats || typeof stats !== "object") return null;

  const {
    weekly_views_count = 0,
    weekly_appointments_count = 0,
    weekly_reviews_count = 0,
    weekly_messages_count = 0,
  } = stats;

  const actions = [];

  if (weekly_views_count < THRESHOLDS.views) {
    actions.push({ text: "אין הרבה צפיות השבוע – כדאי לפרסם שירות חדש או מבצע", type: "info" });
  } else {
    actions.push({ text: "👀 צפיות בפרופיל השבוע במצב טוב", type: "success" });
  }

  if (weekly_appointments_count < THRESHOLDS.appointments) {
    actions.push({ text: "📅 מעט פגישות השבוע – שקלי לקבוע שיחות ייעוץ", type: "warning" });
  } else {
    actions.push({ text: "📅 מספר הפגישות השבועי תקין", type: "success" });
  }

  if (weekly_reviews_count < THRESHOLDS.reviews) {
    actions.push({ text: "⭐ מעט ביקורות השבוע – בקשי מלקוחות לדרג אותך", type: "warning" });
  } else {
    actions.push({ text: "⭐ יש ביקורות טובות ומספיקות השבוע", type: "success" });
  }

  if (weekly_messages_count < THRESHOLDS.messages) {
    actions.push({ text: "📩 אין הודעות חדשות מלקוחות השבוע – נסי להעלות תוכן חדש במדיה החברתית", type: "warning" });
  } else {
    actions.push({ text: "📩 יש מספיק הודעות מלקוחות השבוע", type: "success" });
  }

  return (
    <div className="actions-container">
      <h4>המלצות לפעולה חכמה 💡</h4>

      <ul>
        {actions.map(({ text, type }, i) => (
          <li key={i} className={type}>
            {text}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NextActions;
