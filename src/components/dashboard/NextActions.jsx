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
    actions.push({
      text: "📢 Quiet week? It’s a great time to promote a new service or offer.",
      type: "info",
    });
  } else {
    actions.push({
      text: "👀 Profile views are looking good this week.",
      type: "success",
    });
  }

  if (weekly_appointments_count < THRESHOLDS.appointments) {
    actions.push({
      text: "📅 Slow week? Reach out to schedule new consultations.",
      type: "warning",
    });
  } else {
    actions.push({
      text: "📅 Great! You have a healthy number of appointments this week.",
      type: "success",
    });
  }

  if (weekly_reviews_count < THRESHOLDS.reviews) {
    actions.push({
      text: "⭐ Haven’t received many reviews? Ask happy clients to leave one!",
      type: "warning",
    });
  } else {
    actions.push({
      text: "⭐ You’ve got enough good reviews this week. Keep it up!",
      type: "success",
    });
  }

  if (weekly_messages_count >= THRESHOLDS.messages) {
    actions.push({
      text: "📩 You’ve received enough client messages this week.",
      type: "success",
    });
  } else {
    actions.push({
      text: "💬 No client messages yet — consider posting something engaging.",
      type: "info",
    });
  }

  return (
    <div className="actions-container full-width">
      <h4>Smart Action Recommendations 💡</h4>
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
