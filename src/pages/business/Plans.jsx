// src/pages/Plans.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "../../styles/Plans.css";
import PlanComparisonGrid from "./dashboardPages/buildTabs/PlanComparisonGrid.jsx";

export default function Plans() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  // עד שלא יודעים אם יש session – לא מציגים כלום כדי למנוע “הבזקים”
  if (loading) return null;

  const [selectedDurations, setSelectedDurations] = useState({
    advanced: "1",
    professional: "1",
    vip: "1",
  });
  const [showComparison, setShowComparison] = useState(false);

  const handleDurationChange = (plan, duration) => {
    setSelectedDurations(prev => ({ ...prev, [plan]: duration }));
  };

  const handleSelectPlan = (planKey) => {
    // אם לא מחובר – נעביר ללוגין
    if (!user) {
      navigate("/login", { replace: true });
      return;
    }

    const plan = plansData[planKey];
    const months = parseInt(selectedDurations[planKey], 10);
    const monthlyPrice = plan.prices?.[selectedDurations[planKey]] || plan.price || 0;
    const total = monthlyPrice * months;

    navigate("/checkout", {
      state: {
        planName: plan.name,
        totalPrice: total,
        duration: months,
      },
    });
  };

  const plansData = {
    free: {
      name: "חינמית",
      price: 0,
      features: [
        { text: "קבלת פניות", enabled: false },
        { text: "צ'אט עם לקוחות", enabled: false },
        { text: "ניהול חנות/תורים", enabled: false },
        { text: "שיתוף פעולה בין עסקים", enabled: false },
      ],
      description: "למי שרוצה לנסות ולהתחיל בקטן",
    },
    advanced: {
      name: "מתקדמת",
      prices: { "1": 89, "3": 79, "12": 59 },
      features: [
        { text: "עד 50 פניות", enabled: true },
        { text: "צ'אט עם לקוחות", enabled: true },
        { text: "חנות / יומן לזימון תורים / זימון שירות לבית", enabled: false },
        { text: "שיתוף פעולה בין עסקים", enabled: false },
      ],
      description: "מתאימה לעסקים מתחילים עם תקשורת בסיסית",
    },
    professional: {
      name: "מקצועית",
      prices: { "1": 189, "3": 169, "12": 129 },
      recommended: true,
      features: [
        { text: "פניות ללא הגבלה", enabled: true },
        { text: "צ'אט עם לקוחות", enabled: true },
        { text: "חנות / יומן לזימון תורים / זימון שירות לבית", enabled: true },
        { text: "שיתוף פעולה בין עסקים", enabled: false },
      ],
      description: "הכי משתלם לעסק שצריך שליטה מלאה",
    },
    vip: {
      name: "VIP",
      prices: { "1": 219, "3": 199, "12": 189 },
      recommendedVip: true,
      features: [
        { text: "פניות ללא הגבלה", enabled: true },
        { text: "צ'אט עם לקוחות", enabled: true },
        { text: "חנות / יומן לזימון תורים / זימון שירות לבית", enabled: true },
        { text: "שיתוף פעולה בין עסקים", enabled: true },
      ],
      description: "לעסקים שרוצים להוביל ולהיחשף יותר",
    },
  };

  return (
    <div className="plans-container">
      <h1 className="plans-title">הצטרפות לחבילות עסקים</h1>
      <p className="plans-subtitle">כשהלקוחות מחפשים, כדאי שהם ימצאו אותך!</p>

      <div className="plans-grid">
        {Object.entries(plansData).map(([planKey, plan]) => {
          const duration = selectedDurations[planKey];
          const price = plan.prices?.[duration] ?? plan.price ?? 0;
          const isRecommended = !!plan.recommended;
          const isVip = planKey === "vip";

          const cardClasses = [
            "plan-card",
            isRecommended && "recommended-plan",
            isVip ? "vip-background vip-highlight" : `bordered-card ${planKey}`,
          ]
            .filter(Boolean)
            .join(" ");

          return (
            <div key={planKey} className={cardClasses}>
              {isRecommended && <div className="plan-badge">⭐ הכי משתלם</div>}
              {plan.recommendedVip && <div className="plan-badge vip-badge">🏆 הבחירה של המובילים</div>}

              <h2 className={isVip ? "vip-title" : ""}>
                {isVip ? <>VIP <span className="vip-crown">👑</span></> : plan.name}
              </h2>

              {price > 0 && <p>{price} ₪ / חודש</p>}

              {plan.prices && (
                <label>
                  בחר תקופה:
                  <select
                    value={duration}
                    onChange={e => handleDurationChange(planKey, e.target.value)}
                  >
                    <option value="1">חודש</option>
                    <option value="3">3 חודשים ({plan.prices["3"]} ₪ לחודש)</option>
                    <option value="12">שנה ({plan.prices["12"]} ₪ לחודש)</option>
                  </select>
                </label>
              )}

              <ul>
                {plan.features.map((feat, idx) => (
                  <li key={idx} className={feat.enabled ? "" : "no-feature"}>
                    {feat.text}
                  </li>
                ))}
              </ul>

              <p className="plan-description">{plan.description}</p>

              <button
                className="select-button"
                onClick={() => handleSelectPlan(planKey)}
              >
                {planKey === "free" && "🚀 התחילו עכשיו בחינם"}
                {planKey === "advanced" && "✨ שדרגו לתקשורת ישירה"}
                {planKey === "professional" && "💼 ניהול מקצועי מתחיל כאן"}
                {planKey === "vip" && "👑 הצטרפו למנוי VIP"}
              </button>
            </div>
          );
        })}
      </div>

      <button
        className="toggle-comparison-button"
        onClick={() => setShowComparison(prev => !prev)}
      >
        {showComparison ? "הסתר השוואת חבילות" : "השוואת חבילות"}
      </button>

      {showComparison && (
        <div style={{ marginTop: "2rem" }}>
          <PlanComparisonGrid onSelectPlan={handleSelectPlan} />
        </div>
      )}
    </div>
  );
}
