import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "../../styles/Plans.css";

export default function Plans() {
  const [selectedPeriod, setSelectedPeriod] = useState("monthly");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const { user, initialized, refreshUser } = useAuth();

  const plans = {
    monthly: { price: 1, total: 1, save: 0 },
    yearly: { price: 1, total: 1, save: 0 },
  };

  const { price, total, save } = plans[selectedPeriod];
  const API_BASE = import.meta.env.VITE_API_BASE_URL || "";
  const now = new Date();

  const trialExpired =
    user?.subscriptionPlan === "trial" &&
    user?.subscriptionEnd &&
    new Date(user.subscriptionEnd) < now;

  /* 💳 טעינת PayPal SDK */
  useEffect(() => {
    const existingScript = document.querySelector("#paypal-sdk");
    if (!existingScript) {
      const script = document.createElement("script");
      script.id = "paypal-sdk";
      script.src = `https://www.paypal.com/sdk/js?client-id=${
        import.meta.env.VITE_PAYPAL_CLIENT_ID
      }&currency=USD&locale=en_US`;
      script.async = true;
      script.onload = () => console.log("✅ PayPal SDK loaded");
      document.body.appendChild(script);
    }
  }, []);

  /* ✅ ודא שהמשתמש מעודכן */
  useEffect(() => {
    if (initialized && !user?._id) {
      console.warn("⚠️ User not loaded after init — refreshing...");
      refreshUser(true);
    }
  }, [initialized, user, refreshUser]);

  /* ⚡ יצירת הזמנה בשרת */
  const createOrder = async () => {
    if (!user?._id) {
      alert("User not loaded yet. Please log in again.");
      console.error("🚫 Missing user._id when creating order");
      return;
    }

    const body = {
      amount: total,
      planName:
        selectedPeriod === "monthly"
          ? "BizUply Monthly Plan"
          : "BizUply Yearly Plan",
      userId: user._id,
    };

    console.log("📦 create-order body:", body);

    const res = await fetch(`${API_BASE}/api/paypal/create-order`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    console.log("✅ create-order response:", data);

    if (!data.id) throw new Error("No PayPal order ID returned");
    return data.id;
  };

  /* 💰 אישור תשלום */
  const captureOrder = async (orderId) => {
    console.log("💰 Capturing order:", orderId);
    const res = await fetch(`${API_BASE}/api/paypal/capture/${orderId}`, {
      method: "POST",
    });
    const data = await res.json();
    return data;
  };

  /* 🚀 Checkout */
  const handlePayPalCheckout = async () => {
    setLoading(true);
    try {
      if (!initialized) {
        alert("Please wait a moment until your profile is ready.");
        setLoading(false);
        return;
      }

      if (!user?._id) {
        alert("User not loaded yet. Please log in again.");
        console.error("🚫 user missing in handlePayPalCheckout");
        setLoading(false);
        return;
      }

      const paypal = window.paypal;
      if (!paypal) {
        alert("PayPal SDK not loaded yet. Please refresh the page.");
        setLoading(false);
        return;
      }

      const container = document.getElementById("paypal-button-container");
      container.innerHTML = "";

      paypal
        .Buttons({
          createOrder: async () => await createOrder(),
          onApprove: async (data) => {
            const result = await captureOrder(data.orderID);
            await fetch(`${API_BASE}/api/paypal/subscription/confirm`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                userId: user._id,
                plan: selectedPeriod,
                orderId: data.orderID,
                paypalData: result,
              }),
            });

            setLoading(false);
            setSuccess(true);
            setTimeout(() => navigate("/dashboard"), 2000);
          },
          onError: (err) => {
            console.error("PayPal error:", err);
            alert("Payment failed. Please try again.");
            setLoading(false);
          },
        })
        .render("#paypal-button-container");
    } catch (err) {
      console.error("❌ Checkout error:", err);
      setLoading(false);
    }
  };

  /* מצב טעינה עד שהמשתמש מוכן */
  if (!initialized) {
    return (
      <div className="plans-loading">
        <p>Loading your account...</p>
      </div>
    );
  }

  return (
    <div className="plans-page">
      <header className="plans-header">
        <h1>Choose Your BizUply Plan</h1>
        <p>
          {!trialExpired
            ? "Start your 14-day free trial today. No credit card required."
            : "Your free trial has ended. Choose a plan below to continue enjoying BizUply."}
        </p>
      </header>

      <div className="plans-toggle">
        {["monthly", "yearly"].map((period) => (
          <button
            key={period}
            className={`toggle-btn ${selectedPeriod === period ? "active" : ""}`}
            onClick={() => setSelectedPeriod(period)}
          >
            {period === "monthly" ? "Monthly" : "Yearly"}
          </button>
        ))}
      </div>

      <section className="plan-card-container">
        <div className="plan-card highlight">
          <h2>BizUply Professional Plan</h2>

          <div className="plan-price">
            <span className="price">${price}</span>
            <span className="duration">
              {selectedPeriod === "monthly" ? "/month" : "/year"}
            </span>
          </div>

          {success ? (
            <button className="plan-btn success">✅ Payment Successful!</button>
          ) : loading ? (
            <button className="plan-btn loading">Processing...</button>
          ) : trialExpired ? (
            <button className="plan-btn purchase" onClick={handlePayPalCheckout}>
              Subscribe Now
            </button>
          ) : (
            <button className="plan-btn primary" onClick={() => navigate("/checkout")}>
              Try Free for 14 Days
            </button>
          )}

          <div className="summary-box">
            <div className="summary-row">
              <span>Total to pay:</span>
              <strong>${total}</strong>
            </div>
            {save > 0 && (
              <div className="summary-row save">
                <span>You save:</span>
                <strong>${save}</strong>
              </div>
            )}
          </div>

          <div id="paypal-button-container" style={{ marginTop: "1rem" }}></div>
        </div>
      </section>
    </div>
  );
}
