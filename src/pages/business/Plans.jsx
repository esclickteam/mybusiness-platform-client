import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "../../styles/Plans.css";

const pricingOptions = {
  month: { label: "חודש", monthlyPrice: 585, duration: 1 },
  quarter: { label: "3 חודשים", monthlyPrice: 520, duration: 3 }, // מחיר מופחת לחודש
  year: { label: "שנה", monthlyPrice: 490, duration: 12 },        // מחיר מופחת לחודש
};

export default function Plans() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const [selectedPlan, setSelectedPlan] = useState("month");

  if (loading) return <p role="status" aria-live="polite" className="loading-text">טוען...</p>;

  const { label, monthlyPrice, duration } = pricingOptions[selectedPlan];
  const totalPrice = monthlyPrice * duration;

  const handleSelectPlan = () => {
    if (!user) {
      navigate("/login", { replace: true });
      return;
    }

    navigate("/checkout", {
      state: {
        planName: `הצטרפו למהפכת העסקים של עסקליק (${label})`,
        totalPrice,
        duration,
      },
    });
  };

  return (
    <section className="plans-container" aria-label="הצטרפות לחבילת עסקליק">
      <h1 className="plans-title">הצטרפו למהפכת העסקים של עסקליק</h1>
      <p className="plans-subtitle">כשהלקוחות מחפשים, כדאי שהם ימצאו אותך!</p>

      <article className="plan-card full-plan-card" aria-labelledby="full-plan-title">
        <h2 id="full-plan-title">הצטרפו למהפכת העסקים של עסקליק</h2>

        <ul className="plan-features">
          <li>קבלת פניות ללא הגבלה</li>
          <li>צ'אט עם לקוחות בזמן אמת</li>
          <li>פרופיל עסקי מקצועי ודינמי</li>
          <li>טפסים חכמים ליצירת קשר והצעות מחיר</li>
          <li>ניהול גלריית תמונות וסרטונים</li>
          <li>יומן עסקי מסונכרן עם לקוחות (כולל CRM מובנה)</li>
          <li>תיאום עצמי בין לקוחות ובעל העסק</li>
          <li>מערכת שיתופי פעולה בין עסקים – כולל מרקט שיתופים והסכמים דיגיטליים</li>
          <li>AI שותף עסקי חכם – ייעוץ, תמחור, ביצוע פעולות, שיחה קולית (עד 30 שימושים בחודש)</li>
          <li>דשבורד חכם לניהול העסק עם ניתוחים ומעקב בזמן אמת</li>
          <li>מתאים לכל סוגי העסקים – גם נותני שירות במקום וגם ניידים עד הבית</li>
        </ul>

        <div className="plan-footer">
          <div className="plan-duration-selector" role="radiogroup" aria-label="בחירת תוקף חבילה">
            {Object.entries(pricingOptions).map(([key, { label, monthlyPrice }]) => (
              <label key={key} className={`radio-label ${selectedPlan === key ? "selected" : ""}`}>
                <input
                  type="radio"
                  name="planDuration"
                  value={key}
                  checked={selectedPlan === key}
                  onChange={() => setSelectedPlan(key)}
                />
                {label} — <strong>{monthlyPrice.toLocaleString()} ₪ לחודש</strong>
              </label>
            ))}
          </div>

          <p className="plan-price" aria-live="polite" aria-atomic="true">
            סה"כ לתקופה: <strong>{totalPrice.toLocaleString()} ₪</strong> ({label})
          </p>

          <button
            className="select-button"
            onClick={handleSelectPlan}
            aria-label={`הצטרפו עכשיו למהפכת העסקים של עסקליק ${label}`}
          >
            הצטרפו עכשיו למהפכת העסקים של עסקליק {label}
          </button>
        </div>
      </article>
    </section>
  );
}
