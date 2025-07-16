import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "../../styles/Plans.css";

function Plans() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // מחירים לחודש עבור כל חבילה
  const monthlyPrices = { "1": 99, "3": 89, "12": 79 }; // דוגמה במחירים שווים (ניתן לעדכן)

  const planLabels = {
    "1": "חבילת מנוי עסקליק - חודש",
    "3": "חבילת מנוי עסקליק - 3 חודשים",
    "12": "חבילת מנוי עסקליק - שנתי",
  };

  const handleDurationChange = (duration) => setSelectedDuration(duration);
  const [selectedDuration, setSelectedDuration] = useState("1");

  const handleSelectPlan = () => {
    if (!user) {
      navigate("/login");
      return;
    }
    const durationNum = Number(selectedDuration);
    const totalPrice = monthlyPrices[selectedDuration] * durationNum;

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
          {[
            { id: "1", label: "חודש", price: monthlyPrices["1"], priceLabel: "לחודש" },
            { id: "3", label: "3 חודשים", price: monthlyPrices["3"], priceLabel: "לשלושה חודשים" },
            { id: "12", label: "שנתי", price: monthlyPrices["12"], priceLabel: "לשנה" },
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
