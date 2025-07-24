import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "../../styles/Plans.css";

function Plans() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // מחירים לחבילות רגילות
  const prices = { "1": 399, "3": 379, "12": 329 };
  const [selectedDuration, setSelectedDuration] = useState("1");

  // אם המשתמש הוא משתמש ניסוי, נוסיף חבילה ניסיונית
  const isTestUser = user?.isTestUser || false;

  // חבילות זמינות להצגה
  const durations = ["1", "3", "12"];
  if (isTestUser) {
    durations.unshift("test"); // נוסיף חבילה ניסיונית בקידומת "test"
  }

  // מחירי החבילה הניסיונית
  const testPrices = { test: 1 };

  const handleDurationChange = (duration) => setSelectedDuration(duration);

  const handleSelectPlan = () => {
    if (!user) {
      navigate("/login");
      return;
    }

    let totalPrice;
    let planName;

    if (selectedDuration === "test") {
      totalPrice = testPrices.test;
      planName = "חבילת מנוי ניסיונית - 1 ש\"ח";
    } else {
      totalPrice = prices[selectedDuration] * parseInt(selectedDuration);
      planName = "חבילת מנוי עסקליק";
    }

    navigate("/checkout", {
      state: {
        planName,
        totalPrice,
        duration: selectedDuration,
      },
    });
  };

  const features = [
    "ייעוץ שיווקי ועסקי מבוסס בינה מלאכותית עם עד 60 פניות איכותיות בחודש.",
    "שותף AI חכם שמספק פעולות והמלצות עסקיות.",
    "פלטפורמה לשיתופי פעולה עסקיים.",
    "עמוד עסקי מקצועי עם גלריה, שאלות נפוצות ועוד.",
    "מערכת ניהול תורים חכמה ללקוחות.",
    "צ'אט שירות לקוחות בזמן אמת.",
    "מערכת ביקורות אמינה ללקוחות אמיתיים.",
    "גישה מלאה וללא הגבלה לכל המערכות.",
    "CRM חכם לניהול קשרי לקוחות.",
    "דשבורד אנליטי לניטור תזכורות ופגישות.",
    "התראות חכמות לאירועים חשובים.",
  ];

  return (
    <div className="plans-wrapper" dir="rtl">
      <h1 className="plans-header">מה מקבל העסק שלך?</h1>

      <div className="plans-card">
        <ul className="plans-list">
          {features.map((text, idx) => (
            <li key={idx} className="plans-list-item">
              <span className="checkmark" aria-hidden="true">✔</span> {text}
            </li>
          ))}
        </ul>

        <div
          className="plans-duration-selector"
          role="radiogroup"
          aria-label="בחירת תקופת מנוי"
        >
          {durations.map((d) => {
            // טקסט להצגה למחיר ומשך המנוי
            let label = "";
            let price = 0;
            if (d === "test") {
              label = "חבילת ניסיון";
              price = testPrices.test;
            } else if (d === "1") {
              label = "חודשי";
              price = prices["1"];
            } else if (d === "3") {
              label = "3 חודשים";
              price = prices["3"];
            } else if (d === "12") {
              label = "שנתי";
              price = prices["12"];
            }

            return (
              <button
                key={d}
                onClick={() => handleDurationChange(d)}
                className={`duration-btn ${selectedDuration === d ? "active" : ""} ${
                  d === "12" ? "recommended" : ""
                }`}
                role="radio"
                aria-checked={selectedDuration === d}
                tabIndex={selectedDuration === d ? 0 : -1}
                aria-label={`מנוי ${label} במחיר ${price} שקלים לחודש`}
                type="button"
              >
                {label}
                <span className="duration-price">{price} ₪ לחודש</span>
              </button>
            );
          })}
        </div>

        <div className="total-price" aria-live="polite">
          המחיר הכולל:{" "}
          {selectedDuration === "test"
            ? testPrices.test
            : prices[selectedDuration] * parseInt(selectedDuration)}{" "}
          ₪
        </div>

        <div className="launch-price-banner" role="alert" aria-live="polite">
          הצטרפו עכשיו במחיר השקה מיוחד לזמן מוגבל – אל תפספסו!
        </div>

        <button
          className="subscribe-btn"
          onClick={handleSelectPlan}
          type="button"
          aria-label={`בחר מנוי לתקופה של ${selectedDuration} חודשים במחיר כולל ${
            selectedDuration === "test"
              ? testPrices.test
              : prices[selectedDuration] * parseInt(selectedDuration)
          } שקלים`}
        >
          בחר מנוי והתחל לגדול עם עסקליק עכשיו!
        </button>
      </div>
    </div>
  );
}

export default Plans;
