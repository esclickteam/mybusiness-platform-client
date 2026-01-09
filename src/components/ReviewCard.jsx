import React, { useState } from "react";
import "./ReviewCard.css";


/* ===========================
   ⭐ Star display (compact)
=========================== */
const StarDisplay = ({ rating, size = 14 }) => {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  const stars = [];

  for (let i = 0; i < full; i++) stars.push("★");
  if (half) stars.push("☆");
  while (stars.length < 5) stars.push("☆");

  return (
    <span style={{ color: "#f59e0b", fontSize: size }}>
      {stars.join("")}
    </span>
  );
};

/* ===========================
   Labels
=========================== */
const ratingLabels = {
  service: "Service 🤝",
  professionalism: "Professionalism 💼",
  timeliness: "Timeliness ⏰",
  availability: "Availability 📞",
  valueForMoney: "Value for money 💰",
  goalAchievement: "Goal achievement 🎯",
  overall: "Overall experience 🎉",
};

/* ===========================
   Review Card
=========================== */
export default function ReviewCard({ review }) {
  const [showDetails, setShowDetails] = useState(false);
  if (!review) return null;

  const ratings = review.ratings || {};

  const average =
    typeof review.averageScore === "number"
      ? review.averageScore
      : Object.values(ratings).length
      ? Object.values(ratings).reduce((a, b) => a + b, 0) /
        Object.values(ratings).length
      : 0;

  const date = review.createdAt
    ? new Date(review.createdAt).toLocaleDateString("en-US")
    : "Unknown";

  return (
    <div className="review-card">
      {/* ===== Header ===== */}
      <div className="review-header">
        <div className="review-average">
          ⭐ {average.toFixed(1)}
        </div>

        <div className="review-meta">
          <StarDisplay rating={average} size={16} />
          <div className="review-date">{date}</div>
        </div>
      </div>

      {/* ===== Comment ===== */}
      {review.comment && (
        <div className="review-comment">
          “{review.comment}”
        </div>
      )}

      {/* ===== Author ===== */}
      <div className="review-author">
        — {review.client?.name || review.client || "Anonymous"}
      </div>

      {/* ===== Toggle ===== */}
      {Object.keys(ratings).length > 0 && (
        <button
          className="review-toggle"
          onClick={() => setShowDetails(!showDetails)}
        >
          {showDetails ? "Hide rating details" : "Show rating details"}
        </button>
      )}

      {/* ===== Details ===== */}
      {showDetails && (
        <div className="rating-details">
          {Object.entries(ratings).map(([key, val]) => (
            <div key={key} className="rating-row">
              <div className="rating-label">
                {ratingLabels[key] || key}
              </div>

              <div className="rating-bar">
                <div
                  className="rating-bar-fill"
                  style={{ width: `${(val / 5) * 100}%` }}
                />
              </div>

              <div className="rating-value">
                {val.toFixed(1)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
