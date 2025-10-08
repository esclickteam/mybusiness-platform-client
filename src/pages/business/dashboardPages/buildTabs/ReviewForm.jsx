import { useState } from "react";
import jwtDecode from "jwt-decode"; // יש להתקין: npm install jwt-decode
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
    if (!token) throw new Error("אין טוקן אימות, אנא התחבר מחדש");

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
      throw new Error(err.error || "שגיאה ביצירת המלצה");
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
      if (!token) throw new Error("אין טוקן אימות, אנא התחבר מחדש");

      const decoded = jwtDecode(token);
      const clientId = decoded.userId;
      if (!clientId) throw new Error("טוקן לא תקין - חסר userId");

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
        // שליחה דרך socket
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
            setError(res.error || "שגיאה בשליחת הביקורת");
            setIsSubmitting(false);
          }
        });
      } else {
        // fallback לביצוע fetch רגיל
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
          throw new Error(data.error || "שגיאה בשליחת הביקורת");
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
