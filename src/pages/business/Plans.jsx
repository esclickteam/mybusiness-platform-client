import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "../../styles/Plans.css";
import PlanComparisonGrid from './dashboardPages/buildTabs/PlanComparisonGrid.jsx';

function Plans() {
  // ✅ הגנה על useAuth
  const auth = useAuth() || {};
  const user = auth.user;

  const navigate = useNavigate();

  const [selectedDurations, setSelectedDurations] = useState({
    advanced: "1",
    professional: "1",
    vip: "1",
  });

  const [showComparison, setShowComparison] = useState(false);

  const handleDurationChange = (plan, duration) => {
    setSelectedDurations((prev) => ({ ...prev, [plan]: duration }));
  };

  const handleSelectPlan = (planKey) => {
    if (!user) {
      navigate("/login");
      return;
    }

    const plan = plansData[planKey];
    const selectedDuration = selectedDurations[planKey];
    const monthlyPrice = plan.prices ? plan.prices[selectedDuration] : 0;
    const total = monthlyPrice * parseInt(selectedDuration);

    navigate("/checkout", {
      state: {
        planName: plan.name,
        totalPrice: total,
        duration: selectedDuration,
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
          const selectedDuration = selectedDurations[planKey];
          const price = plan.prices ? plan.prices[selectedDuration] : 0;
          const isRecommended = plan.recommended;
          const isVipRecommended = plan.recommendedVip;

          const cardClass = [
            "plan-card",
            isRecommended ? "recommended-plan" : "",
            planKey === "vip" ? "vip-background vip-highlight" : "bordered-card " + planKey,
            planKey,
          ].join(" ").trim();

          return (
            <div key={planKey} className={cardClass}>
              {isRecommended && <div className="plan-badge">⭐ הכי משתלם</div>}
              {isVipRecommended && <div className="plan-badge vip-badge">🏆 הבחירה של המובילים</div>}

              <h2 className={planKey === "vip" ? "vip-title" : ""}>
                {planKey === "vip" ? <>VIP <span className="vip-crown">👑</span></> : plan.name}
              </h2>

              {price > 0 && <p>{price} ₪ / חודש</p>}
              {plan.prices && (
                <label>
                  בחר תקופה:
                  <select
                    value={selectedDuration}
                    onChange={(e) => handleDurationChange(planKey, e.target.value)}
                  >
                    <option value="1">חודש</option>
                    <option value="3">3 חודשים ({plan.prices["3"]} ₪ לחודש)</option>
                    <option value="12">שנה ({plan.prices["12"]} ₪ לחודש)</option>
                  </select>
                </label>
              )}
              <ul>
                {plan.features.map((feature, index) => (
                  <li key={index} className={feature.enabled ? "" : "no-feature"}>
                    {feature.text}
                  </li>
                ))}
              </ul>
              <p className="plan-description">{plan.description}</p>

              <button className="select-button" onClick={() => handleSelectPlan(planKey)}>
                {planKey === "free" && "🚀 התחילו עכשיו בחינם"}
                {planKey === "advanced" && "✨ שדרגו לתקשורת ישירה"}
                {planKey === "professional" && "💼 ניהול מקצועי מתחיל כאן"}
                {planKey === "vip" && "👑 הצטרפו למנוי VIP"}
              </button>
            </div>
          );
        })}
      </div>

      <button className="toggle-comparison-button" onClick={() => setShowComparison(!showComparison)}>
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

export default Plans;
