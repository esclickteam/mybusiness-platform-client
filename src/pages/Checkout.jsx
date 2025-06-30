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

  // שליפת מזהה משתמש (MongoDB _id / id / userId)
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
        <button className="return-link" onClick={() => navigate("/plans")}>🔙 חזרה לעמוד החבילות</button>
      </div>
    );
  }

  const handlePayment = async () => {
    if (processing) return;

    setProcessing(true);
    setErrorMessage("");

    if (!planName || !totalPrice || !realUserId) {
      setErrorMessage("❌ חסרים נתונים, לא ניתן להמשיך לתשלום.");
      setProcessing(false);
      return;
    }

    try {
      const response = await API.post("/cardcom", {
        plan: planName,
        price: totalPrice,
        userId: realUserId,
      });

      const { paymentUrl } = response.data;
      if (paymentUrl) {
        window.location.href = paymentUrl;
      } else {
        throw new Error("השרת לא החזיר כתובת תשלום תקינה");
      }
    } catch (err) {
      console.error("❌ שגיאה בעת יצירת תשלום:", err);

      if (err.response?.status === 429) {
        setErrorMessage("⏳ נעשו יותר מדי ניסיונות תשלום. נסה שוב בעוד דקה.");
      } else {
        setErrorMessage("❌ שגיאה בעת יצירת התשלום. לחץ 'נסה שוב' כדי לקבל קישור חדש.");
      }
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
          {processing ? (
            <>
              <span className="spinner" />⏳ מעבד תשלום...
            </>
          ) : (
            "💳 עבור לתשלום"
          )}
        </button>
        {errorMessage && !processing && (
          <button className="retry-link" onClick={handlePayment} style={{ marginTop: "1em" }}>
            🔄 נסה שוב
          </button>
        )}
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
