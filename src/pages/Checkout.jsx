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

  // Convert to number of months (test => 1)
  const monthsCount = duration === "test" ? 1 : Number(duration || 0);

  // Update payment options based on the number of months
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
        <h2 className="error-message">❌ The selected plan is not available.</h2>
        <button className="return-link" onClick={() => navigate("/pricing")}>
          🔙 Back to Pricing
        </button>
      </div>
    );
  }

  const handlePayment = async () => {
    if (processing) return;

    setProcessing(true);
    setErrorMessage("");

    if (!planName || !totalPrice || !realUserId) {
      setErrorMessage("❌ Missing data; cannot proceed to payment.");
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
        // ① Save where to redirect after successful payment
        sessionStorage.setItem(
          "postLoginRedirect",
          `/business/${realUserId}/dashboard`
        );

        // ② Redirect the browser to the external payment page
        window.location.href = paymentUrl;
      } else {
        throw new Error("Server did not return a valid payment URL");
      }
    } catch (err) {
      console.error("❌ Error while creating payment:", err);
      if (err.response?.status === 429) {
        setErrorMessage("⏳ Too many payment attempts. Please try again in a minute.");
      } else {
        setErrorMessage(
          "❌ Error creating the payment. Click 'Try again' to get a new link."
        );
      }
    } finally {
      setProcessing(false);
    }
  };

  // Pluralization for "month"/"months"
  const durationLabel = monthsCount === 1 ? "month" : "months";

  return (
    <div className="checkout-container">
      <div className="checkout-card" dir="ltr">
        <h1>🔹 Payment for {planName}</h1>
        <p className="checkout-price">
          Final price: <strong>{totalPrice} $</strong>
        </p>
        <p className="checkout-duration">
          Subscription length: <strong>{monthsCount} {durationLabel}</strong>
        </p>

        <label htmlFor="paymentCountSelect">Number of installments:</label>
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

        <button className="pay-button" onClick={handlePayment} disabled={processing}>
          {processing ? (
            <>
              <span className="spinner" />
              ⏳ Processing payment...
            </>
          ) : (
            "💳 Proceed to payment"
          )}
        </button>

        {!processing && errorMessage && (
          <button
            className="retry-link"
            onClick={handlePayment}
            style={{ marginTop: "1em" }}
          >
            🔄 Try again
          </button>
        )}

        <button
          className="return-link"
          onClick={() => navigate("/pricing")}
          disabled={processing}
        >
          🔙 Back to Pricing
        </button>
      </div>
    </div>
  );
}
