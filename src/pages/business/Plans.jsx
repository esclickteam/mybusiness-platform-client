import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "../../styles/Plans.css";

function Plans() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // תקופות מנוי עם מחירים תואמים, כולל חבילת ניסיון יומית
  const [selectedDuration, setSelectedDuration] = useState("1");
  const prices = { "1": 1, "3": 769, "12": 699 }; // חבילת ניסיון 1 ש"ח ליום

  const planLabels = {
    "1": "חבילת מנוי עסקליק - ניסיון ליום",
    "3": "חבילת מנוי עסקליק - 3 חודשים",
    "12": "חבילת מנוי עסקליק - שנתי",
  };

  const handleDurationChange = (duration) => setSelectedDuration(duration);

  const handleSelectPlan = () => {
    if (!user) {
      navigate("/login");
      return;
    }
    // חישוב המחיר הכולל לפי המחיר לחודש כפול מספר החודשים
    const totalPrice = prices[selectedDuration] * Number(selectedDuration);

    navigate("/checkout", {
      state: {
        planName: planLabels[selectedDuration],
        totalPrice: totalPrice.toFixed(2), // לשמור על 2 ספרות אחרי הנקודה
        duration: selectedDuration,
      },
    });
  };

  return (
    <div className="plans-wrapper" dir="rtl">
      <h1 className="plans-header">
        הצטרפו עכשיו לחבילת מנוי עסקליק — הפתרון החכם לניהול העסק שלכם!
      </h1>
      <p className="plans-subheader">
        בחרו את תקופת המנוי המתאימה לכם, ותתחילו ליהנות מכל הכלים והמערכות
        החכמות שמקדמות את העסק שלכם קדימה בקלות וביעילות.
      </p>

      <div className="plans-card">
        <h2 className="card-title">מה מקבל העסק שלך?</h2>
        <ul className="plans-list">
          {[
            "ייעוץ שיווקי ועסקי מבוסס בינה מלאכותית עם 30 פניות איכותיות בחודש",
            "שותף AI חכם עם יותר מ-20 המלצות ופעולות לשיפור מתמיד של העסק",
            "פלטפורמה לשיתופי פעולה עסקיים והרחבת רשת הקשרים שלך",
            "עמוד עסקי מקצועי הכולל פרטים מלאים, גלריה, שאלות נפוצות ועוד",
            "מערכת נוחה להזמנת תורים ללקוחות שלך – פשוטה ומהירה",
            "צ'אט אינטראקטיבי לשירות לקוחות בזמן אמת – קריטי בעידן המודרני",
            "מערכת ביקורות אמינה – רק לקוחות שקיבלו שירות יכולים לדרג ולהשאיר חוות דעת",
            "גישה מלאה וללא הגבלה לכל מערכות הפלטפורמה המקצועיות שלנו",
            "ניהול יומן הזמנות מתקדם ומעקב יעדים חכם",
            "מערכת CRM חכמה לניהול קשרי לקוחות ממוקד ואפקטיבי",
            "דשבורד אנליטי מתקדם לניהול פגישות, תזכורות ושינויים בזמן אמת",
            "התראות חכמות לזיהוי וניהול אירועים חשובים בזמן אמת",
          ].map((text, idx) => (
            <li key={idx} className="plans-list-item">
              <span aria-hidden="true" className="checkmark">✔</span> {text}
            </li>
          ))}
        </ul>

        <div
          className="plans-duration-selector"
          role="radiogroup"
          aria-label="בחירת תקופת מנוי"
        >
          {[
            { id: "1", label: "ניסיון", price: 1, priceLabel: "ליום" },
            { id: "3", label: "3 חודשים", price: 1, priceLabel: "לשלושה חודשים" },
            { id: "12", label: "שנתי", price: 1, priceLabel: "לשנה" },
          ].map(({ id, label, price, priceLabel }) => (
            <button
              key={id}
              onClick={() => handleDurationChange(id)}
              className={`duration-btn ${selectedDuration === id ? "active" : ""}`}
              role="radio"
              aria-checked={selectedDuration === id}
              tabIndex={selectedDuration === id ? 0 : -1}
              aria-label={`מנוי ${label} במחיר ${price} שקלים ${priceLabel}`}
              type="button"
            >
              {label}
              <span className="duration-price">{price} ₪ {priceLabel}</span>
            </button>
          ))}
        </div>

        <button className="subscribe-btn" onClick={handleSelectPlan} type="button">
          בחר מנוי והתחל לגדול עם עסקליק עכשיו!
        </button>
      </div>
    </div>
  );
}

export default Plans;
