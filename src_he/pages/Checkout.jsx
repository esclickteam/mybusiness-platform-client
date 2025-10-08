import { useState, useEffect } from "react";
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
  const [paymentCount, setPaymentCount] = useState(1);
  const [paymentOptions, setPaymentOptions] = useState([1]);

  const getUserId = (user) => user?._id || user?.id || user?.userId || null;
  const realUserId = getUserId(user);

  // המרה למספר חודשים (test => 1)
  const monthsCount = duration === "test" ? 1 : Number(duration || 0);

  // עדכון אפשרויות התשלומים בהתאם למספר חודשים
  useEffect(() => {
    let maxPayments = 1;
    if (monthsCount > 1) maxPayments = monthsCount;

    const options = Array.from({ length: maxPayments }, (_, i) => i + 1);
    setPaymentOptions(options);
    setPaymentCount(1);
  }, [monthsCount]);

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
      const response = await API.post(
        "/cardcom",
        {
          plan: planName,
          price: totalPrice,
          userId: realUserId,
          paymentCount,
          duration: monthsCount,
        },
        { withCredentials: true }
      );

      const { paymentUrl } = response.data;
      if (paymentUrl) {
        // ① שומרים לאן לחזור אחרי שהתשלום יסתיים בהצלחה
        sessionStorage.setItem(
          "postLoginRedirect",
          `/business/${realUserId}/dashboard`
        );

        // ② מפנים את הדפדפן אל מסך התשלום החיצוני
        window.location.href = paymentUrl;
      } else {
        throw new Error("השרת לא החזיר כתובת תשלום תקינה");
      }
    } catch (err) {
      console.error("❌ שגיאה בעת יצירת תשלום:", err);
      if (err.response?.status === 429) {
        setErrorMessage("⏳ נעשו יותר מדי ניסיונות תשלום. נסה שוב בעוד דקה.");
      } else {
        setErrorMessage(
          "❌ שגיאה בעת יצירת התשלום. לחץ 'נסה שוב' כדי לקבל קישור חדש."
        );
      }
    } finally {
      setProcessing(false);
    }
  };

  // פלורליזציה של "חודש"/"חודשים"
  const durationLabel = monthsCount === 1 ? "חודש" : "חודשים";

  return (
    <div className="checkout-container">
      <div className="checkout-card" dir="rtl">
        <h1>🔹 תשלום עבור {planName}</h1>
        <p className="checkout-price">
          מחיר סופי: <strong>{totalPrice} ₪</strong>
        </p>
        <p className="checkout-duration">
          משך המנוי: <strong>{monthsCount} {durationLabel}</strong>
        </p>

        <label htmlFor="paymentCountSelect">מספר תשלומים:</label>
        <select
          id="paymentCountSelect"
          value={paymentCount}
          onChange={(e) => setPaymentCount(Number(e.target.value))}
          disabled={processing}
        >
          {paymentOptions.map((num) => (
            <option key={num} value={num}>
              {num}
            </option>
          ))}
        </select>

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

        {!processing && errorMessage && (
          <button
            className="retry-link"
            onClick={handlePayment}
            style={{ marginTop: "1em" }}
          >
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
