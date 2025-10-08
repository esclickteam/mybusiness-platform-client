import React, { useState } from "react";

const StarDisplay = ({ rating }) => {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  const stars = [];
  for (let i = 0; i < full; i++) stars.push("★");
  if (half) stars.push("✩");
  while (stars.length < 5) stars.push("☆");
  return (
    <span style={{ color: "#f5a623", fontSize: "1.2rem" }}>{stars.join("")}</span>
  );
};

// מילון תרגום השדות לעברית עם האייקונים
const ratingLabels = {
  service: "שירות 🤝",
  professional: "מקצועיות 💼",
  timing: "עמידה בזמנים ⏰",
  availability: "זמינות 📞",
  value: "תמורה למחיר 💰",
  goal: "השגת מטרה 🎯",
  experience: "חוויה כללית 🎉",
};

export default function ReviewCard({ review }) {
  const [showDetails, setShowDetails] = useState(false);

  if (!review) return null;

  const average =
    typeof review.averageScore === "number"
      ? review.averageScore
      : review.ratings
      ? Object.values(review.ratings).reduce((a, b) => a + b, 0) /
        Object.values(review.ratings).length
      : 0;

  const date = review.createdAt
    ? new Date(review.createdAt).toLocaleDateString("he-IL", {
        day: "numeric",
        month: "numeric",
        year: "numeric",
      })
    : "לא ידוע";

  return (
    <div
      style={{
        borderLeft: "5px solid #9b59b6",
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        background: "#fff",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        fontFamily: "'Arial', sans-serif",
        lineHeight: 1.5,
      }}
    >
      <div style={{ marginBottom: 8, fontWeight: "bold", fontSize: "1.1rem" }}>
        דירוג ממוצע: {average.toFixed(1)} <StarDisplay rating={average} />
      </div>

      <div style={{ marginBottom: 8 }}>
        <strong>חוות דעת:</strong> {review.comment || review.text || "—"}
      </div>

      <div style={{ marginBottom: 8 }}>
        <strong>תאריך:</strong> {date}
      </div>

      <div style={{ marginBottom: 12 }}>
        <strong>מאת:</strong> {review.client?.name || review.client || "אנונימי"}
      </div>

      <button
        onClick={() => setShowDetails(!showDetails)}
        style={{
          background: "#9b59b6",
          color: "white",
          border: "none",
          borderRadius: 5,
          padding: "6px 12px",
          cursor: "pointer",
          marginBottom: 10,
        }}
      >
        {showDetails ? "הסתר פירוט דירוג" : "📋 פירוט דירוג"}
      </button>

      {showDetails && review.ratings && (
        <div style={{ borderTop: "1px solid #eee", paddingTop: 8 }}>
          {Object.entries(review.ratings).map(([key, val]) => (
            <div
              key={key}
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: 4,
                fontSize: "0.95rem",
                direction: "rtl",
              }}
            >
              <span>{ratingLabels[key] || key}</span>
              <span>
                {val} <StarDisplay rating={val} />
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
