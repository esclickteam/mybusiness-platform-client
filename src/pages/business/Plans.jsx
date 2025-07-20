import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "../../styles/Plans.css";

function Plans() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // מחירים לפי תקופה (מחיר לחודש)
  const prices = { "1": 399, "3": 379, "12": 329 };

  const [selectedDuration, setSelectedDuration] = useState("1");

  const handleDurationChange = (duration) => setSelectedDuration(duration);

  const handleSelectPlan = () => {
    if (!user) {
      navigate("/login");
      return;
    }

    const totalPrice = prices[selectedDuration] * parseInt(selectedDuration);

    navigate("/checkout", {
      state: {
        planName: "חבילת מנוי עסקליק",
        totalPrice: totalPrice,
        duration: selectedDuration,
      },
    });
  };

  const features = [
    "100 מסמכים בחודש קלנדרי",
    "תמיכה מלאה בחשבונית ישראל(קבלת מספרי הקצאה מרשות המיסים)",
    "חתימה דיגיטלית מאובטחת",
    "הפקת דוחות",
    "שליחה אוטומטית של דוחות ומסמכים",
    "הרשאת רו\"ח",
    "חיבור לריווחית DOCS (לא כולל את מחיר המערכת)",
    "ניהול משתמשים והרשאות",
    "הפקת חשבוניות מתשלום דחוי",
    "חיבור לסליקת אשראי (לא כולל את מחיר הסליקה)",
    "גישה ל-API",
    "עלות מסמך נוסף 0.5₪"
  ];

  return (
    <div className="plans-wrapper" dir="rtl">
      <h1 className="plans-header">
        הצטרפו עכשיו לחבילת מנוי עסקליק — הפתרון המוביל לניהול יעיל וחכם של העסק שלכם!
      </h1>
      <p className="plans-subheader">
        בחרו את תקופת המנוי המתאימה לכם ותתחילו ליהנות מכל הכלים והמערכות
        המתקדמות המאפשרות קידום וצמיחה איכותית של העסק.
      </p>

      <div className="plans-card">
        <h2 className="card-title">מה מקבל העסק שלך?</h2>

        <ul className="features-list">
          {features.map((item, idx) => (
            <li key={idx} className="features-list-item">
              <span className="check-icon" aria-hidden="true">✓</span>
              {item}
            </li>
          ))}
        </ul>

        <div
          className="plans-duration-selector"
          role="radiogroup"
          aria-label="בחירת תקופת מנוי"
        >
          {["1", "3", "12"].map((d) => (
            <button
              key={d}
              onClick={() => handleDurationChange(d)}
              className={`duration-btn ${
                selectedDuration === d ? "active" : ""
              }`}
              role="radio"
              aria-checked={selectedDuration === d}
              tabIndex={selectedDuration === d ? 0 : -1}
              aria-label={`מנוי ${
                d === "1" ? "חודשי" : d === "3" ? "לשלושה חודשים" : "שנתי"
              } במחיר ${prices[d]} שקלים לחודש`}
              type="button"
            >
              {d === "1" ? "חודשי" : d === "3" ? "לשלושה חודשים" : "שנתי"}
              <span className="duration-price">{prices[d]} ₪ לחודש</span>
            </button>
          ))}
        </div>

        <div
          className="launch-price-banner"
          role="alert"
          aria-live="polite"
        >
          הצטרפו עכשיו במחיר השקה מיוחד לזמן מוגבל – אל תפספסו!
        </div>

        <button
          className="subscribe-btn"
          onClick={handleSelectPlan}
          type="button"
          aria-label={`בחר מנוי לתקופה של ${selectedDuration} חודשים במחיר כולל ${
            prices[selectedDuration] * parseInt(selectedDuration)
          } שקלים`}
        >
          בחר מנוי והתחל לגדול עם עסקליק עכשיו!
        </button>
      </div>
    </div>
  );
}

export default Plans;
