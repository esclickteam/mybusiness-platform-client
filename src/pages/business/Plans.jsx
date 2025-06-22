import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "../../styles/Plans.css";

function Plans() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [selectedDuration, setSelectedDuration] = useState("1");
  const prices = { "1": 799, "3": 769, "12": 699 };

  const handleDurationChange = (duration) => setSelectedDuration(duration);

  const handleSelectPlan = () => {
    if (!user) {
      navigate("/login");
      return;
    }
    navigate("/checkout", {
      state: {
        planName: "חבילת מנוי עסקליק",
        totalPrice: prices[selectedDuration] * parseInt(selectedDuration),
        duration: selectedDuration,
      },
    });
  };

  return (
    <div className="plans-wrapper">
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
          {[
            "ייעוץ שיווקי ועסקי מבוסס בינה מלאכותית עם 30 פניות איכותיות בחודש",
            "שותף AI חכם עם יותר מ-20 המלצות ופעולות לשיפור מתמיד של העסק",
            "פלטפורמה לשיתופי פעולה עסקיים והרחבת רשת הקשרים שלך",
            "עמוד עסקי מקצועי הכולל פרטים מלאים, גלריה, שאלות נפוצות ועוד",
            "מערכת נוחה להזמנת תורים ללקוחות שלך – פשוטה ומהירה",
            "צ'אט אינטראקטיבי לשירות לקוחות בזמן אמת – קריטי בעידן המודרני",
            "מערכת ביקורות אמינה – רק לקוחות שקיבלו שירות יכולים לדרג ולהשאיר חוות דעת",
            "גישה מלאה וללא הגבלה לכל מערכות הפלטפורמה המקצועיות שלנו",
            "ניהול יומן הזמנות מתקדם ומעקב יעדים חכם",
            "מערכת CRM חכמה לניהול קשרי לקוחות ממוקד ואפקטיבי",
            "דשבורד אנליטי מתקדם לניהול פגישות, תזכורות ושינויים בזמן אמת",
            "התראות חכמות לזיהוי וניהול אירועים חשובים בזמן אמת",
          ].map((text, idx) => (
            <li key={idx} className="plans-list-item">
              <span className="checkmark">✔</span> {text}
            </li>
          ))}
        </ul>

        <div className="plans-duration-selector">
          {["1", "3", "12"].map((d) => (
            <button
              key={d}
              onClick={() => handleDurationChange(d)}
              className={`duration-btn ${selectedDuration === d ? "active" : ""}`}
              aria-label={`מנוי ${
                d === "1" ? "חודשי" : d === "3" ? "3 חודשים" : "שנתי"
              } במחיר ${prices[d]} שקלים לחודש`}
            >
              {d === "1" ? "חודשי" : d === "3" ? "3 חודשים" : "שנתי"}
              <span className="duration-price">{prices[d]} ₪ לחודש</span>
            </button>
          ))}
        </div>

        <button className="subscribe-btn" onClick={handleSelectPlan}>
          בחר מנוי והתחל לגדול עם עסקליק עכשיו!
        </button>
      </div>
    </div>
  );
}

export default Plans;
