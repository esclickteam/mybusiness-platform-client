import React, { useState } from "react";
import jwtDecode from "jwt-decode"; 
import "./ReviewForm.css";

const ratingFields = [
  { key: "service", label: "🤝 Service" },
  { key: "professional", label: "💼 Professionalism" },
  { key: "timing", label: "⏰ Timeliness" },
  { key: "availability", label: "📞 Availability" },
  { key: "value", label: "💰 Value for money" },
  { key: "goal", label: "🎯 Goal achievement" },
  { key: "experience", label: "🎉 Overall experience" },
];

const ReviewForm = ({ businessId, socket, conversationId, onSuccess }) => {
  const [ratings, setRatings] = useState({});
  const [text, setText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleRatingChange = (key, value) => {
    setRatings((prev) => ({ ...prev, [key]: value }));
  };

  const calculateAverage = () => {
    const values = ratingFields.map(({ key }) => parseFloat(ratings[key] || 0));
    const sum = values.reduce((acc, val) => acc + val, 0);
    return (sum / ratingFields.length).toFixed(1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No auth token");

      const decoded = jwtDecode(token);
      const clientId = decoded.userId;

      const reviewData = {
        business: businessId,
        client: clientId,
        comment: text,
        averageScore: parseFloat(calculateAverage()),

        // 🔥 Flatten fields (this is what server expects)
        service: ratings.service,
        professional: ratings.professional,
        timing: ratings.timing,
        availability: ratings.availability,
        value: ratings.value,
        goal: ratings.goal,
        experience: ratings.experience,
      };

      if (socket && socket.connected) {
        socket.emit("createReview", reviewData, (res) => {
          if (!res.ok) {
            setError(res.error || "Error submitting review");
            setIsSubmitting(false);
            return;
          }

          // 📌 Pass the new review upward
          onSuccess && onSuccess(res.review);

          // Reset form
          setRatings({});
          setText("");
          setIsSubmitting(false);
        });
      } else {
        const response = await fetch(`/api/business/${businessId}/reviews`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(reviewData),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Error submitting review");
        }

        onSuccess && onSuccess(data.review);

        setRatings({});
        setText("");
        setIsSubmitting(false);
      }
    } catch (err) {
      setError(err.message);
      setIsSubmitting(false);
    }
  };

  return (
    <form className="review-form" onSubmit={handleSubmit}>
      <h3>📝 Leave a review for the service</h3>

      {ratingFields.map(({ key, label }) => (
        <div key={key} className="rating-row">
          <label>{label}</label>
          <select
            value={ratings[key] || ""}
            onChange={(e) => handleRatingChange(key, Number(e.target.value))}
            required
          >
            <option value="">Select rating</option>
            {[5, 4.5, 4, 3.5, 3, 2.5, 2, 1.5, 1].map((n) => (
              <option key={n} value={n}>
                {"★".repeat(Math.round(n)) +
                  "☆".repeat(5 - Math.round(n))}{" "}
                ({n})
              </option>
            ))}
          </select>
        </div>
      ))}

      <label>✍️ Review</label>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows="4"
        placeholder="Write your experience with the service here..."
        required
      />

      <div className="average-score">⭐ Average score: {calculateAverage()} / 5</div>

      {error && <div className="error-message">{error}</div>}

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Loading…" : "Submit Review"}
      </button>
    </form>
  );
};

export default ReviewForm;
