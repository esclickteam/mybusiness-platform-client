import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "../../styles/Plans.css";

function Plans() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // מחירים לפי תקופה (מחיר לחודש)
  const prices = { "1": 399, "3": 379, "12": 329 };

  const [selectedDuration, setSelectedDuration] = useState("1");

  const handleDurationChange = (duration) => setSelectedDuration(duration);

  const handleSelectPlan = () => {
    if (!user) {
      navigate("/login");
      return;
    }

    const totalPrice = prices[selectedDuration] * parseInt(selectedDuration);

    navigate("/checkout", {
      state: {
        planName: "חבילת מנוי עסקליק",
        totalPrice: totalPrice,
        duration: selectedDuration,
      },
    });
  };

  return (
    <div className="plans-wrapper" dir="rtl">
      <h1 className="plans-header">
        הצטרפו עכשיו לחבילת מנוי עסקליק — הפתרון המוביל לניהול יעיל וחכם של העסק שלכם!
      </h1>
      <p className="plans-subheader">
        בחרו את תקופת המנוי המתאימה לכם ותתחילו ליהנות מכל הכלים והמערכות
        המתקדמות המאפשרות קידום וצמיחה איכותית של העסק.
      </p>

      <div className="plans-card">
        <h2 className="card-title">מה מקבל העסק שלך?</h2>
        <ul className="plans-list">
          {[
            "ייעוץ שיווקי ועסקי מתקדם מבוסס בינה מלאכותית הכולל עד 60 פניות איכותיות בחודש, הכוללות המלצות ופעולות לשיפור מתמיד של העסק.",
            "שותף AI חכם המספק עד 60 המלצות ופעולות כחלק מהמגבלה הכוללת של הפניות החודשיות.",
            "פלטפורמה מתקדמת לשיתופי פעולה עסקיים להרחבת רשת הקשרים וההזדמנויות.",
            "עמוד עסקי מקצועי ומקיף הכולל פרטי התקשרות, גלריה, שאלות נפוצות ורכיבים נוספים להעצמת הנראות והאמינות.",
            "מערכת ניהול תורים ידידותית למשתמש המאפשרת ללקוחות להזמין תורים במהירות וביעילות.",
            "צ'אט אינטראקטיבי לשירות לקוחות בזמן אמת – כלי קריטי לניהול תקשורת איכותית בעידן הדיגיטלי.",
            "מערכת ביקורות אמינה המאפשרת רק ללקוחות שקיבלו שירות להעניק דירוג וחוות דעת.",
            "גישה מלאה וללא הגבלה לכל מערכות הפלטפורמה המתקדמות שלנו.",
            "ניהול יומן הזמנות מתקדם עם מעקב מדויק אחר יעדים ופעילויות העסק.",
            "מערכת CRM חכמה לניהול ממוקד ואפקטיבי של קשרי הלקוחות.",
            "דשבורד אנליטי מתקדם לניטור וניהול פגישות, תזכורות ושינויים בזמן אמת.",
            "התראות חכמות לזיהוי וניהול אירועים עסקיים חשובים בזמן אמת.",
          ].map((text, idx) => (
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
          {["1", "3", "12"].map((d) => (
            <button
              key={d}
              onClick={() => handleDurationChange(d)}
              className={`duration-btn ${
                selectedDuration === d ? "active" : ""
              }`}
              role="radio"
              aria-checked={selectedDuration === d}
              tabIndex={selectedDuration === d ? 0 : -1}
              aria-label={`מנוי ${
                d === "1" ? "חודשי" : d === "3" ? "לשלושה חודשים" : "שנתי"
              } במחיר ${prices[d]} שקלים לחודש`}
              type="button"
            >
              {d === "1" ? "חודשי" : d === "3" ? "לשלושה חודשים" : "שנתי"}
              <span className="duration-price">{prices[d]} ₪ לחודש</span>
            </button>
          ))}
        </div>

        <button
          className="subscribe-btn"
          onClick={handleSelectPlan}
          type="button"
          aria-label={`בחר מנוי לתקופה של ${selectedDuration} חודשים במחיר כולל ${
            prices[selectedDuration] * parseInt(selectedDuration)
          } שקלים`}
        >
          בחר מנוי והתחל לגדול עם עסקליק עכשיו!
        </button>
      </div>
    </div>
  );
}

export default Plans;
