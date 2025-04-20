import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import API from "../api";
import { useAuth } from "../context/AuthContext";
import "../styles/Checkout.css";

function Checkout() {
  const location = useLocation();
  const { planName, totalPrice, duration } = location.state || {};

  // ✅ הגנה בטוחה על useAuth
  const auth = useAuth() || {};
  const user = auth.user;

  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");

  if (!planName || !totalPrice) {
    return (
      <div className="checkout-container error-container">
        <h2 className="error-message">❌ החבילה שבחרת אינה זמינה.</h2>
        <a className="return-link" href="/plans">🔙 חזרה לעמוד החבילות</a>
      </div>
    );
  }

  // ✅ אם המשתמש לא מחובר – הפניה
  React.useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const handlePayment = async () => {
    setLoading(true);
    setErrorMessage("");

    try {
      console.log("🚀 שליחת בקשת תשלום לשרת:", { plan: planName, price: totalPrice });

      const response = await API.post(
        "/api/payments",
        {
          plan: planName,
          price: totalPrice,
        },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          }
        }
      );

      console.log("✅ תשובת השרת:", response.data);

      if (response.data && response.data.paymentUrl) {
        console.log("🔗 מעבר לעמוד התשלום:", response.data.paymentUrl);
        window.location.href = response.data.paymentUrl;
      } else {
        setErrorMessage("❌ שגיאה: השרת לא החזיר כתובת תשלום תקינה.");
        console.error("❌ שגיאה: השרת לא החזיר כתובת תשלום תקינה.", response.data);
      }
    } catch (error) {
      setErrorMessage("❌ שגיאה בעת יצירת תשלום. נסה שוב מאוחר יותר.");
      console.error("❌ שגיאה בתשלום:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null; // מונע טעינה לפני redirect

  return (
    <div className="checkout-container">
      <div className="checkout-card">
        <h1>🔹 תשלום עבור חבילת {planName}</h1>
        <p className="checkout-price">מחיר סופי: <strong>{totalPrice} ₪</strong></p>
        <p className="checkout-duration">משך המנוי: <strong>{duration} חודשים</strong></p>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <button className="pay-button" onClick={handlePayment} disabled={loading}>
          {loading ? "⏳ מעבד תשלום..." : "💳 עבור לתשלום"}
        </button>
      </div>
    </div>
  );
}

export default Checkout;
