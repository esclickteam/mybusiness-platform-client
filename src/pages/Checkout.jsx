import { useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/Checkout.css";

export default function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  const { planName, totalPrice, duration } = location.state || {};
  const [processing, setProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // ref ל־<form> המוסתרת
  const formRef = useRef(null);

  // בדיקות התחלה
  if (loading) return null;
  if (!user) {
    navigate("/login", { replace: true });
    return null;
  }
  if (!planName || !totalPrice) {
    return (
      <div className="checkout-container error-container">
        <h2 className="error-message">❌ החבילה שבחרת אינה זמינה.</h2>
        <button className="return-link" onClick={() => navigate("/plans")}>
          🔙 חזרה לעמוד החבילות
        </button>
      </div>
    );
  }

  const realUserId = user._id || user.id || user.userId;

  const handlePayment = () => {
    if (processing) return;
    setProcessing(true);
    setErrorMessage("");

    if (!realUserId) {
      setErrorMessage("❌ משתמש לא תקין.");
      setProcessing(false);
      return;
    }

    // שולחים את ה־form המוסתר
    formRef.current.submit();
    // הדפדפן יעשה POST רגיל ל־/api/cardcom,
    // והשרת יחזיר 303 Redirect ל־CardCom → דף סליקה
  };

  return (
    <div className="checkout-container">
      <div className="checkout-card">
        <h1>🔹 תשלום עבור חבילת {planName}</h1>
        <p className="checkout-price">
          מחיר סופי: <strong>{totalPrice} ₪</strong>
        </p>
        <p className="checkout-duration">
          משך המנוי: <strong>{duration} חודשים</strong>
        </p>

        {errorMessage && <p className="error-message">{errorMessage}</p>}

        {/* הכפתור שמפעיל את השליחה */}
        <button
          className="pay-button"
          onClick={handlePayment}
          disabled={processing}
        >
          {processing ? (
            <>
              <span className="spinner" />⏳ מעבד תשלום...
            </>
          ) : (
            "💳 עבור לתשלום"
          )}
        </button>

        <button
          className="return-link"
          onClick={() => navigate("/plans")}
          disabled={processing}
        >
          🔙 חזרה לעמוד החבילות
        </button>
      </div>

      {/* הטופס המוסתר */}
      <form
        ref={formRef}
        method="POST"
        action="/api/cardcom"
        style={{ display: "none" }}
      >
        <input type="hidden" name="plan" value={planName} />
        <input type="hidden" name="price" value={totalPrice} />
        <input type="hidden" name="userId" value={realUserId} />
      </form>
    </div>
  );
}
