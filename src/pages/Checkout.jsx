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
  const [lowProfileCode, setLowProfileCode] = useState(null);

  // שליפת מזהה משתמש (MongoDB _id / id / userId)
  const getUserId = (user) => user?._id || user?.id || user?.userId || null;
  const realUserId = getUserId(user);

  // כאשר מתקבל lowProfileCode, מעבירים אותו ל-CardCom
  useEffect(() => {
    if (lowProfileCode && window.CardCom) {
      CardCom.LowProfile({
        LowProfileCode: lowProfileCode,
        DivId: "cardcom-form",
        AutoRedirect: true,
      });
    }
  }, [lowProfileCode]);

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
    if (processing) return;

    setProcessing(true);
    setErrorMessage("");

    if (!planName || !totalPrice || !realUserId) {
      setErrorMessage("❌ חסרים נתונים, לא ניתן להמשיך לתשלום.");
      setProcessing(false);
      return;
    }

    try {
      const resp = await API.post("/cardcom", {
        plan: planName,
        price: totalPrice,
        userId: realUserId,
      });
      const { lowProfileCode: code } = resp.data;
      if (!code) {
        throw new Error("השרת לא החזיר LowProfileCode תקין");
      }
      // מאתחל טעינת ה־LowProfile
      setLowProfileCode(code);
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

        {!lowProfileCode ? (
          <>
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
              <button
                className="retry-link"
                onClick={handlePayment}
                style={{ marginTop: "1em" }}
              >
                🔄 נסה שוב
              </button>
            )}
          </>
        ) : (
          // ברגע שקיבלנו lowProfileCode, נטען כאן את טופס כרטיס האשראי
          <div id="cardcom-form" style={{ marginTop: "1em" }} />
        )}

        <button
          className="return-link"
          onClick={() => navigate("/plans")}
          disabled={processing}
          style={{ marginTop: "1em" }}
        >
          🔙 חזרה לעמוד החבילות
        </button>
      </div>
    </div>
  );
}
