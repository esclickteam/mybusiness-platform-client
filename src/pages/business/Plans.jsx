import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "../../styles/Plans.css";

const pricingOptions = {
  month: { label: "חודש", price: 585, duration: 1 },
  quarter: { label: "3 חודשים", price: 1580, duration: 3 },
  year: { label: "שנה", price: 5850, duration: 12 },
};

export default function Plans() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const [selectedPlan, setSelectedPlan] = useState("month");

  if (loading) return <p role="status" aria-live="polite" className="loading-text">טוען...</p>;

  const handleSelectPlan = () => {
    if (!user) {
      navigate("/login", { replace: true });
      return;
    }

    const { label, price, duration } = pricingOptions[selectedPlan];

    navigate("/checkout", {
      state: {
        planName: `עסקליק – חבילת ניהול מלאה (${label})`,
        totalPrice: price,
        duration,
      },
    });
  };

  return (
    <section className="plans-container" aria-label="הצטרפות לחבילת עסקליק">
      <h1 className="plans-title">עסקליק – חבילת ניהול מלאה</h1>
      <p className="plans-subtitle">כשהלקוחות מחפשים, כדאי שהם ימצאו אותך!</p>

      <article className="plan-card full-plan-card" aria-labelledby="full-plan-title">
        <h2 id="full-plan-title">עסקליק – חבילת ניהול מלאה</h2>

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
          <li>מתאים לכל סוגי העסקים – גם נותני שירות במקום וגם ניידים עד הבית</li>
        </ul>

        {/* חיבור הבחירה והתשלום לתחתית הכרטיס */}
        <div className="plan-footer">
          <div className="plan-duration-selector" role="radiogroup" aria-label="בחירת תוקף חבילה">
            {Object.entries(pricingOptions).map(([key, { label, price }]) => (
              <label key={key} className={`radio-label ${selectedPlan === key ? "selected" : ""}`}>
                <input
                  type="radio"
                  name="planDuration"
                  value={key}
                  checked={selectedPlan === key}
                  onChange={() => setSelectedPlan(key)}
                />
                {label} — <strong>{price.toLocaleString()} ₪</strong>
              </label>
            ))}
          </div>

          <p className="plan-price" aria-live="polite" aria-atomic="true">
            <strong>{pricingOptions[selectedPlan].price.toLocaleString()} ₪</strong> / {pricingOptions[selectedPlan].label} (כולל מע"מ)
          </p>

          <button
            className="select-button"
            onClick={handleSelectPlan}
            aria-label={`הצטרפו עכשיו לחבילת עסקליק ${pricingOptions[selectedPlan].label}`}
          >
            הצטרפו עכשיו לחבילת עסקליק {pricingOptions[selectedPlan].label}
          </button>
        </div>
      </article>
    </section>
  );
}
