import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

import "./ReviewsModule.css";
import StarRatingChart from "./StarRatingChart";
import ReviewForm from "./ReviewForm";

/* =========================
   PARAMETERS
========================= */
const PARAMETERS = {
  service: "🤝 Service",
  professional: "💼 Professionalism",
  timing: "⏰ Punctuality",
  availability: "📞 Availability",
  value: "💰 Value for Money",
  goal: "🎯 Goal Achievement",
  experience: "🎉 Overall Experience",
};

const exampleReviews = [
  {
    id: "ex1",
    user: "Shira",
    date: "03/10/2025",
    comment:
      "Excellent service experience! They responded quickly, the price was fair, and they met the deadlines.",
    service: "5",
    professional: "4.5",
    timing: "5",
    availability: "5",
    value: "4.5",
    goal: "5",
    experience: "4.5",
    isExample: true,
  },
];

/* =========================
   STAR DISPLAY
========================= */
const StarDisplay = ({ rating }) => {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  return (
    <span className="stars">
      {"★".repeat(full)}
      {half && "✩"}
      {"☆".repeat(5 - full - (half ? 1 : 0))}
    </span>
  );
};

/* =========================
   REVIEW CARD
========================= */
const ReviewCard = ({ review }) => {
  const [open, setOpen] = useState(false);

  const values = Object.keys(PARAMETERS)
    .map((k) => parseFloat(review[k]))
    .filter((v) => !isNaN(v));

  const avg = values.length
    ? values.reduce((a, b) => a + b, 0) / values.length
    : null;

  return (
    <div className={`review-card ${review.isExample ? "example" : ""}`}>
      <div className="review-header">
        <strong>{review.user || "Anonymous"}</strong>
        <span className="review-date">🗓️ {review.date}</span>
      </div>

      <div className="review-rating">
        ⭐ {avg?.toFixed(1) || "—"} / 5
        {review.isExample && <span className="example-tag">Example</span>}
      </div>

      <p className={`review-comment ${open ? "open" : ""}`}>
        {review.comment}
      </p>

      <button
        className="toggle-review-btn"
        onClick={() => setOpen(!open)}
      >
        {open ? "Hide details ▲" : "View full review ▼"}
      </button>

      {open && (
        <div className="review-details">
          {Object.entries(PARAMETERS).map(
            ([key, label]) =>
              review[key] && (
                <div key={key} className="detail-row">
                  <span>{label}</span>
                  <span>
                    <StarDisplay rating={parseFloat(review[key])} />{" "}
                    ({review[key]})
                  </span>
                </div>
              )
          )}
        </div>
      )}
    </div>
  );
};

/* =========================
   MAIN MODULE
========================= */
export default function ReviewsModule({
  reviews = [],
  currentUser,
  businessId,
  socket,
  isPreview,
}) {
  const [showForm, setShowForm] = useState(false);
  const [canReview, setCanReview] = useState(false);
  const [liveReviews, setLiveReviews] = useState(reviews);

  /* Permission */
  useEffect(() => {
    if (!currentUser || !businessId) return;
    axios
      .get(`/reviews/can-review?businessId=${businessId}`)
      .then((r) => setCanReview(r.data.canReview))
      .catch(() => setCanReview(false));
  }, [currentUser, businessId]);

  /* Live socket */
  useEffect(() => {
    if (!socket || !businessId) return;

    socket.emit("joinBusinessRoom", businessId);
    socket.on("review:new", (review) =>
      setLiveReviews((prev) => [review, ...prev])
    );

    return () => socket.off("review:new");
  }, [socket, businessId]);

  const displayReviews =
    liveReviews.length > 0
      ? liveReviews
      : currentUser
      ? exampleReviews
      : [];

  return (
    <div className="reviews-tab">
      <h2 className="section-title">⭐ Customer Reviews</h2>

      {currentUser && canReview && (
        <button
          className="primary-cta"
          onClick={() => setShowForm(true)}
        >
          💬 Write a review
        </button>
      )}

      {showForm && (
        <ReviewForm
          businessId={businessId}
          socket={socket}
          onSuccess={(review) => {
            setLiveReviews((prev) => [review, ...prev]);
            setShowForm(false);
          }}
        />
      )}

      <StarRatingChart reviews={displayReviews} />

      <div className="review-list">
        {displayReviews.map((r) => (
          <ReviewCard key={r.id || r.user} review={r} />
        ))}
      </div>
    </div>
  );
}
