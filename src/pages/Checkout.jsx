// src/pages/Checkout.jsx
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import API from "../api";
import { useAuth } from "../context/AuthContext";
import "../styles/Checkout.css";

export default function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  const { planName, totalPrice, duration } = location.state || {};

  const [processing, setProcessing] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");

  // עד שלא יודעים אם יש user או לא, לא מציגים כלום (מונע “הבזקים”)
  if (loading) return null;

  // אם אין משתמש, נעביר אותו ל־login דרך react-router
  if (!user) {
    navigate("/login", { replace: true });
    return null;
  }

  // אם אין פרטי חבילה, נראה שגיאה
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

  const handlePayment = async () => {
    setProcessing(true);
    setErrorMessage("");

    try {
      console.log("🚀 Requesting payment:", { plan: planName, price: totalPrice });

      const response = await API.post("/api/payments", {
        plan: planName,
        price: totalPrice,
      });

      console.log("✅ Payment response:", response.data);

      if (response.data.paymentUrl) {
        window.location.href = response.data.paymentUrl;
      } else {
        throw new Error("השרת לא החזיר כתובת תשלום תקינה");
      }
    } catch (err) {
      console.error("❌ Payment error:", err.response?.data || err.message);
      setErrorMessage("❌ שגיאה בעת יצירת התשלום. נסה שוב מאוחר יותר.");
    } finally {
      setProcessing(false);
    }
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
          {processing ? "⏳ מעבד תשלום..." : "💳 עבור לתשלום"}
        </button>
      </div>
    </div>
  );
}
