import React, { useState } from "react";
import jwtDecode from "jwt-decode";
import "./ReviewForm.css";

/* =========================
   Rating configuration
========================= */
const PRIMARY_FIELDS = [
  { key: "experience", label: "🎉 Overall experience", required: true },
  { key: "service", label: "🤝 Service", required: true },
  { key: "professional", label: "💼 Professionalism", required: true },
];

const OPTIONAL_FIELDS = [
  { key: "timing", label: "⏰ Timeliness" },
  { key: "availability", label: "📞 Availability" },
  { key: "value", label: "💰 Value for money" },
  { key: "goal", label: "🎯 Goal achievement" },
];

/* =========================
   Star Rating Component
========================= */
const StarRating = ({ value = 0, onChange }) => {
  const [hover, setHover] = useState(0);

  return (
    <div className="star-rating">
      {[1, 2, 3, 4, 5].map((n) => (
        <span
          key={n}
          className={`star ${n <= (hover || value) ? "filled" : ""}`}
          onMouseEnter={() => setHover(n)}
          onMouseLeave={() => setHover(0)}
          onClick={() => onChange(n)}
        >
          ★
        </span>
      ))}
      {value > 0 && <span className="star-value">{value.toFixed(1)}</span>}
    </div>
  );
};

const ReviewForm = ({ businessId, socket, onSuccess }) => {
  const [ratings, setRatings] = useState({});
  const [text, setText] = useState("");
  const [showMore, setShowMore] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleRatingChange = (key, value) => {
    setRatings((prev) => ({ ...prev, [key]: value }));
  };

  /* =========================
     Average (LIVE)
  ========================= */
  const average =
    Object.values(ratings).length > 0
      ? (
          Object.values(ratings).reduce((a, b) => a + b, 0) /
          Object.values(ratings).length
        ).toFixed(1)
      : "0.0";

  const canSubmit = PRIMARY_FIELDS.every(
    (f) => typeof ratings[f.key] === "number"
  );

  /* =========================
     Submit
  ========================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Not authenticated");

      const decoded = jwtDecode(token);

      const reviewData = {
        comment: text.trim(),
        ratings: {
          service: ratings.service,
          professionalism: ratings.professional,
          timeliness: ratings.timing,
          availability: ratings.availability,
          valueForMoney: ratings.value,
          goalAchievement: ratings.goal,
          overall: ratings.experience,
        },
      };

      const res = await fetch(`/api/business/${businessId}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(reviewData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Submit failed");

      onSuccess?.(data.review);
      setRatings({});
      setText("");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="review-form improved" onSubmit={handleSubmit}>
      <h3>📝 Leave a review</h3>

      {/* PRIMARY */}
      {PRIMARY_FIELDS.map(({ key, label }) => (
        <div key={key} className="rating-row">
          <label>{label}</label>
          <StarRating
            value={ratings[key] || 0}
            onChange={(v) => handleRatingChange(key, v)}
          />
        </div>
      ))}

      {/* OPTIONAL */}
      <button
        type="button"
        className="toggle-more"
        onClick={() => setShowMore((v) => !v)}
      >
        {showMore ? "Hide extra details" : "Add more details (optional)"}
      </button>

      {showMore &&
        OPTIONAL_FIELDS.map(({ key, label }) => (
          <div key={key} className="rating-row optional">
            <label>{label}</label>
            <StarRating
              value={ratings[key] || 0}
              onChange={(v) => handleRatingChange(key, v)}
            />
          </div>
        ))}

      {/* COMMENT */}
      <label className="review-label">
        ✍️ What stood out the most? <span>(optional)</span>
      </label>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Service, attitude, results…"
        maxLength={300}
      />
      <div className="char-count">{text.length} / 300</div>

      {/* AVERAGE */}
      <div className="average-box">
        ⭐ <strong>{average}</strong>
        <span>Based on your ratings</span>
      </div>

      {error && <div className="error-message">{error}</div>}

      <button
        type="submit"
        className="submit-btn"
        disabled={!canSubmit || isSubmitting}
      >
        {isSubmitting ? "Submitting…" : "Submit Review"}
      </button>
    </form>
  );
};

export default ReviewForm;
