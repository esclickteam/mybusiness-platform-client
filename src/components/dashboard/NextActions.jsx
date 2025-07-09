import React from "react";
import "./NextActions.css";

const THRESHOLDS = {
  views: 10,
  appointments: 2,
  reviews: 2,
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
    actions.push({ text: "שבוע שקט? זו הזדמנות מצוינת לפרסם שירות חדש", type: "info" });
  } else {
    actions.push({ text: "👀 צפיות בפרופיל השבוע במצב טוב", type: "success" });
  }

  if (weekly_appointments_count < THRESHOLDS.appointments) {
    actions.push({ text: "📅 שבוע רגוע? זו הזדמנות לקבוע שיחות ייעוץ חדשות", type: "warning" });
  } else {
    actions.push({ text: "📅 מספר הפגישות השבועי תקין", type: "success" });
  }

  if (weekly_reviews_count < THRESHOLDS.reviews) {
    actions.push({ text: "⭐ לא קיבלת הרבה ביקורות השבוע? תזכירי ללקוחות מרוצים לדרג אותך", type: "warning" });
  } else {
    actions.push({ text: "⭐ יש ביקורות טובות ומספיקות השבוע", type: "success" });
  }

  if (weekly_messages_count >= THRESHOLDS.messages) {
    actions.push({ text: "📩 יש מספיק הודעות מלקוחות השבוע", type: "success" });
  }

  return (
    <div className="actions-container full-width">
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
