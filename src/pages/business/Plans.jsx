// src/pages/Plans.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "../../styles/Plans.css";

export default function Plans() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) return <p role="status" aria-live="polite" className="loading-text">טוען...</p>;

  const handleSelectPlan = () => {
    if (!user) {
      navigate("/login", { replace: true });
      return;
    }

    navigate("/checkout", {
      state: {
        planName: "עסקליק – חבילת ניהול מלאה",
        totalPrice: 585,
        duration: 1,
      },
    });
  };

  return (
    <section className="plans-container" aria-label="הצטרפות לחבילת עסקליק">
      <h1 className="plans-title">הצטרפות לחבילת עסקליק</h1>
      <p className="plans-subtitle">כשהלקוחות מחפשים, כדאי שהם ימצאו אותך!</p>

      <article className="plan-card full-plan-card" aria-labelledby="full-plan-title">
        <h2 id="full-plan-title">עסקליק – חבילת ניהול מלאה</h2>
        <p className="plan-price">585 ₪ / חודש (כולל מע"מ)</p>

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

        <button
          className="select-button"
          onClick={handleSelectPlan}
          aria-label="הצטרפו עכשיו לחבילת עסקליק המלאה"
        >
          הצטרפו עכשיו לחבילת עסקליק המלאה
        </button>
      </article>
    </section>
  );
}
