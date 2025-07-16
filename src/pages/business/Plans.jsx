import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "../../styles/Plans.css";

function Plans() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // מחיר קבוע לכל חבילה
  const pricePerPeriod = 1;

  const planLabels = {
    "1": "חבילת מנוי עסקליק - חודש",
    "3": "חבילת מנוי עסקליק - 3 חודשים",
    "12": "חבילת מנוי עסקליק - שנתי",
  };

  const [selectedDuration, setSelectedDuration] = useState("1");

  const handleDurationChange = (duration) => setSelectedDuration(duration);

  const handleSelectPlan = () => {
    if (!user) {
      navigate("/login");
      return;
    }

    // מחיר קבוע, לא כופלים במספר החודשים
    const totalPrice = pricePerPeriod;

    navigate("/checkout", {
      state: {
        planName: planLabels[selectedDuration],
        totalPrice: totalPrice.toFixed(2),
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
          {[/* רשימת התכונות שלך כאן */].map((text, idx) => (
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
          {[1, 3, 12].map((id) => {
            const labels = {
              1: "לחודש",
              3: "לשלושה חודשים",
              12: "לשנה",
            };
            const planLabel = planLabels[id.toString()] || "";
            return (
              <button
                key={id}
                onClick={() => handleDurationChange(id.toString())}
                className={`duration-btn ${selectedDuration === id.toString() ? "active" : ""}`}
                role="radio"
                aria-checked={selectedDuration === id.toString()}
                tabIndex={selectedDuration === id.toString() ? 0 : -1}
                aria-label={`מנוי ${planLabel} במחיר ${pricePerPeriod} שקלים ${labels[id]}`}
                type="button"
              >
                {planLabel}
                <span className="duration-price">{pricePerPeriod} ₪ {labels[id]}</span>
              </button>
            );
          })}
        </div>

        <button className="subscribe-btn" onClick={handleSelectPlan} type="button">
          בחר מנוי והתחל לגדול עם עסקליק עכשיו!
        </button>
      </div>
    </div>
  );
}

export default Plans;
