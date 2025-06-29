import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import API from "../api";
import { useAuth } from "../context/AuthContext";
import "../styles/Checkout.css";

export default function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  const { planName, totalPrice, duration } = location.state || {};

  const [processing, setProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

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

  const handlePayment = async () => {
    setProcessing(true);
    setErrorMessage("");

    // בדיקת כל הערכים - לפני שליחה לשרת
    console.log("🚩 תשלום - DEBUG נתונים:");
    console.log("planName:", planName, "| totalPrice:", totalPrice, "| userId:", user?._id);

    if (!planName || !totalPrice || !user?._id) {
      setErrorMessage("❌ חסרים נתונים, לא ניתן להמשיך לתשלום.");
      setProcessing(false);
      return;
    }

    try {
      const response = await API.post("/cardcom", {
        plan: planName,
        price: totalPrice,
        userId: user._id,
      });

      if (response.data.paymentUrl) {
        window.location.href = response.data.paymentUrl;
      } else {
        throw new Error("השרת לא החזיר כתובת תשלום תקינה");
      }
    } catch (err) {
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
