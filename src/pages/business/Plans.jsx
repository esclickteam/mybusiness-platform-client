import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "../../styles/Plans.css";

export default function Plans() {
  const [selectedPeriod, setSelectedPeriod] = useState("monthly");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const plans = {
    monthly: { price: 1, total: 1, save: 0 }, // בדיקה: $1 בלבד
    yearly: { price: 1, total: 1, save: 0 },
  };

  const { price, total, save } = plans[selectedPeriod];

  const now = new Date();
  const trialExpired =
    user?.subscriptionPlan === "trial" &&
    user?.subscriptionEnd &&
    new Date(user.subscriptionEnd) < now;

  /* ========================================
     💳 טעינת PayPal SDK
  ======================================== */
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

  /* ========================================
     ⚡ יצירת הזמנה בשרת
  ======================================== */
  const createOrder = async () => {
    if (!user?._id) {
      alert("Please log in before subscribing.");
      return;
    }

    const res = await fetch("/api/paypal/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: total,
        planName:
          selectedPeriod === "monthly"
            ? "BizUply Monthly Plan"
            : "BizUply Yearly Plan",
        userId: user?._id, // ✅ מזהה המשתמש שלך
      }),
    });

    if (!res.ok) throw new Error("Failed to create order");
    const data = await res.json();
    return data.id;
  };

  /* ========================================
     💰 אישור תשלום
  ======================================== */
  const captureOrder = async (orderId) => {
    const res = await fetch(`/api/paypal/capture/${orderId}`, {
      method: "POST",
    });
    if (!res.ok) throw new Error("Failed to capture order");
    const data = await res.json();
    return data;
  };

  /* ========================================
     🚀 הפעלת PayPal Checkout
  ======================================== */
  const handlePayPalCheckout = async () => {
    if (!user?._id) {
      alert("Please log in first.");
      return;
    }

    setLoading(true);

    try {
      const paypal = window.paypal;
      if (!paypal) {
        alert("PayPal SDK not loaded yet. Please refresh the page.");
        setLoading(false);
        return;
      }

      // מנקה כל כפתור קודם כדי למנוע כפילויות
      const container = document.getElementById("paypal-button-container");
      container.innerHTML = "";

      paypal
        .Buttons({
          createOrder: async () => await createOrder(),
          onApprove: async (data) => {
            await captureOrder(data.orderID);
            setLoading(false);
            setSuccess(true);
            setTimeout(() => navigate("/dashboard"), 2500);
          },
          onError: (err) => {
            console.error("PayPal error:", err);
            setLoading(false);
            alert("Payment failed. Please try again.");
          },
        })
        .render("#paypal-button-container");
    } catch (err) {
      console.error("Checkout error:", err);
      setLoading(false);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div className="plans-page">
      {/* 🌟 Header */}
      <header className="plans-header">
        <h1>Choose Your BizUply Plan</h1>
        <p>
          All the tools your business needs — in one smart platform.{" "}
          {!trialExpired ? (
            <>
              Start your <strong>14-day free trial</strong> today. No credit
              card required.
            </>
          ) : (
            <>
              Your free trial has ended. Choose a plan below to continue enjoying
              BizUply.
            </>
          )}
        </p>
      </header>

      {/* 🔘 Toggle Between Monthly / Yearly */}
      <div className="plans-toggle">
        {["monthly", "yearly"].map((period) => (
          <button
            key={period}
            className={`toggle-btn ${
              selectedPeriod === period ? "active" : ""
            }`}
            onClick={() => setSelectedPeriod(period)}
          >
            {period === "monthly" ? "Monthly" : "Yearly"}
          </button>
        ))}
      </div>

      {/* 💼 Main Plan Card */}
      <section className="plan-card-container">
        <div className="plan-card highlight">
          <h2>BizUply Professional Plan</h2>
          <p className="plan-desc">
            Access every BizUply feature — including your AI Partner, CRM,
            messaging, client reviews, and collaboration tools — all from one
            powerful dashboard.
          </p>

          <div className="plan-price">
            <span className="price">${price}</span>
            <span className="duration">
              {selectedPeriod === "monthly" ? "/month" : "/year"}
            </span>
          </div>

          <ul className="plan-features">
            <li>✔ Professional Business Page</li>
            <li>✔ Smart CRM for Clients & Appointments</li>
            <li>✔ Built-in Messaging System</li>
            <li>✔ Ratings & Reviews Management</li>
            <li>✔ Business Collaboration Network</li>
            <li>✔ AI Business Advisor & Smart Insights</li>
            <li>✔ Create and Track Client Tasks or Follow-ups</li>
            <li>✔ Log and Document Client Calls or Meetings</li>
            <li>✔ Automated Notifications and Smart Alerts</li>
            <li>✔ Predictive Analytics & Personalized Recommendations</li>
          </ul>

          {/* 🔘 CTA Button */}
          {success ? (
            <button className="plan-btn success">✅ Payment Successful!</button>
          ) : loading ? (
            <button className="plan-btn loading" disabled>
              Processing...
            </button>
          ) : trialExpired ? (
            <button className="plan-btn purchase" onClick={handlePayPalCheckout}>
              Subscribe Now
            </button>
          ) : (
            <button
              className="plan-btn primary"
              onClick={() => navigate("/checkout")}
            >
              Try Free for 14 Days
            </button>
          )}

          {/* 🧾 Summary Box */}
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

          {/* 🪙 PayPal Button Container */}
          <div id="paypal-button-container" style={{ marginTop: "1rem" }}></div>
        </div>
      </section>
    </div>
  );
}
