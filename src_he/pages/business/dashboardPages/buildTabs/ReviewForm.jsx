import { useState } from "react";
import jwtDecode from "jwt-decode"; // You need to install: npm install jwt-decode
import "./ReviewForm.css";

const ratingFields = [
  { key: "service", label: "🤝 Service" },
  { key: "professional", label: "💼 Professionalism" },
  { key: "timing", label: "⏰ Timeliness" },
  { key: "availability", label: "📞 Availability" },
  { key: "value", label: "💰 Value for Money" },
  { key: "goal", label: "🎯 Goal Achievement" },
  { key: "experience", label: "🎉 Overall Experience" },
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

  const sendRecommendation = async (avgRating, clientId, reviewText) => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No authentication token, please log in again");

    const payload = {
      businessId,
      clientId,
      conversationId,
      text: reviewText,
      reviewRating: parseFloat(avgRating),
    };

    const res = await fetch("/api/chat/createRecommendation", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Error creating recommendation");
    }

    const data = await res.json();
    console.log("Recommendation created:", data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token, please log in again");

      const decoded = jwtDecode(token);
      const clientId = decoded.userId;
      if (!clientId) throw new Error("Invalid token - missing userId");

      const reviewData = {
        business: businessId,
        client: clientId,
        ratings: {
          service: ratings.service,
          professional: ratings.professional,
          timing: ratings.timing,
          availability: ratings.availability,
          value: ratings.value,
          goal: ratings.goal,
          experience: ratings.experience,
        },
        averageScore: parseFloat(calculateAverage()),
        comment: text,
      };

      if (socket && socket.connected) {
        // Sending via socket
        socket.emit("createReview", reviewData, async (res) => {
          if (res.ok) {
            try {
              await sendRecommendation(reviewData.averageScore, clientId, text);
            } catch (recErr) {
              console.error("Error creating recommendation:", recErr);
            }
            onSuccess && onSuccess(res.review);
            setRatings({});
            setText("");
            setIsSubmitting(false);
          } else {
            setError(res.error || "Error sending the review");
            setIsSubmitting(false);
          }
        });
      } else {
        // fallback to regular fetch
        const response = await fetch("/api/reviews", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(reviewData),
          credentials: "include",
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || "Error sending the review");
        }

        const data = await response.json();
        onSuccess && onSuccess(data.review);

        try {
          await sendRecommendation(reviewData.averageScore, clientId, text);
        } catch (recErr) {
          console.error("Error creating recommendation:", recErr);
        }

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
                {"★".repeat(Math.round(n)) + "☆".repeat(5 - Math.round(n))} ({n})
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

      <div className="average-score">⭐ Average Score: {calculateAverage()} / 5</div>

      {error && <div className="error-message">{error}</div>}

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Loading…" : "Submit Review"}
      </button>
    </form>
  );
};

export default ReviewForm;
