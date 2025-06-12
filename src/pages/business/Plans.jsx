// src/pages/Plans.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "../../styles/Plans.css";

export default function Plans() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  // עד שלא יודעים אם יש session – לא מציגים כלום כדי למנוע “הבזקים”
  if (loading) return null;

  const handleSelectPlan = () => {
    // אם לא מחובר – נעביר ללוגין
    if (!user) {
      navigate("/login", { replace: true });
      return;
    }

    // נתוני החבילה היחידה
    const planName = "עסקליק – חבילת ניהול מלאה";
    const totalPrice = 585;
    const duration = 1; // חודש

    navigate("/checkout", {
      state: {
        planName,
        totalPrice,
        duration,
      },
    });
  };

  return (
    <div className="plans-container">
      <h1 className="plans-title">הצטרפות לחבילת עסקליק</h1>
      <p className="plans-subtitle">כשהלקוחות מחפשים, כדאי שהם ימצאו אותך!</p>

      <div className="plans-grid single-plan-grid">
        <div className="plan-card full-plan-card">
          <h2>עסקליק – חבילת ניהול מלאה</h2>
          <p className="plan-price">585 ₪ / חודש (כולל מע"מ)</p>

          <ul>
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

          <button className="select-button" onClick={handleSelectPlan}>
            הצטרפו עכשיו לחבילת עסקליק המלאה
          </button>
        </div>
      </div>
    </div>
  );
}
