import { useState } from "react";
import "./ReviewForm.css";

const ratingFields = [
  { key: "service", label: "🤝 שירותיות" },
  { key: "professional", label: "💼 מקצועיות" },
  { key: "timing", label: "⏰ עמידה בזמנים" },
  { key: "availability", label: "📞 זמינות" },
  { key: "value", label: "💰 תמורה למחיר" },
  { key: "goal", label: "🎯 השגת מטרה" },
  { key: "experience", label: "🎉 חוויה כללית" },
];

const ReviewForm = ({ businessId, onSuccess }) => {
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

    const reviewData = {
      business: businessId,          // שים לב לשם השדה שתואם לשרת
      ratings,
      averageScore: parseFloat(calculateAverage()),
      comment: text,
    };

    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // הוסף כאן Authorization אם צריך טוקן:
          // 'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(reviewData),
        credentials: "include", // אם משתמש בקוקיז לאימות
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "שגיאה בשליחת הביקורת");
      }

      const data = await response.json();
      onSuccess && onSuccess(data.review);

      setRatings({});
      setText("");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="review-form" onSubmit={handleSubmit}>
      <h3>📝 השאר ביקורת על השירות</h3>

      {ratingFields.map(({ key, label }) => (
        <div key={key} className="rating-row">
          <label>{label}</label>
          <select
            value={ratings[key] || ""}
            onChange={(e) => handleRatingChange(key, Number(e.target.value))}
            required
          >
            <option value="">בחר דירוג</option>
            {[5, 4.5, 4, 3.5, 3, 2.5, 2, 1.5, 1].map((n) => (
              <option key={n} value={n}>
                {"★".repeat(Math.round(n)) + "☆".repeat(5 - Math.round(n))} ({n})
              </option>
            ))}
          </select>
        </div>
      ))}

      <label>✍️ חוות דעת</label>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows="4"
        placeholder="כתוב כאן את החוויה שלך עם השירות..."
        required
      />

      <div className="average-score">⭐ ציון ממוצע: {calculateAverage()} / 5</div>

      {error && <div className="error-message">{error}</div>}

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "טוען…" : "שלח ביקורת"}
      </button>
    </form>
  );
};

export default ReviewForm;
