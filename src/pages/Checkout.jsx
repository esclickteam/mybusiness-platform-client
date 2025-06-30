import { useState } from "react";
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

  // שליפת מזהה המשתמש מ־user
  const getUserId = (user) => user?._id || user?.id || user?.userId || null;
  const realUserId = getUserId(user);

  if (loading) return null;

  if (!user) {
    navigate("/login", { replace: true });
    return null;
  }

  if (!planName || !totalPrice) {
    return (
      <div className="checkout-container error-container">
        <h2 className="error-message">❌ החבילה שבחרת אינה זמינה.</h2>
        <button
          className="return-link"
          onClick={() => navigate("/plans")}
        >
          🔙 חזרה לעמוד החבילות
        </button>
      </div>
    );
  }

  const handlePayment = () => {
    if (processing) return;
    setProcessing(true);
    setErrorMessage("");

    if (!planName || !totalPrice || !realUserId) {
      setErrorMessage("❌ חסרים נתונים, לא ניתן להמשיך לתשלום.");
      setProcessing(false);
      return;
    }

    // בונים <form> מוסתר ושולחים אותו בדפדפן
    const form = document.createElement("form");
    form.method = "POST";
    form.action = "/api/cardcom";
    form.style.display = "none";

    // השדות שהשרת מצפה להם
    const fields = {
      plan: planName,
      price: totalPrice,
      userId: realUserId,
    };

    Object.entries(fields).forEach(([name, value]) => {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = name;
      input.value = value;
      form.appendChild(input);
    });

    document.body.appendChild(form);
    form.submit();
    // הדפדפן יבצע POST רגיל ל-/api/cardcom,
    // וישתמש ב־AutoRedirect של CardCom כדי להעביר אוטומטית לדף הסליקה.
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
    </div>
  );
}
