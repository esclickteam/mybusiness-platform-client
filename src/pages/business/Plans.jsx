import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "../../styles/Plans.css";

export default function Plans() {
  const [selectedPeriod, setSelectedPeriod] = useState("monthly");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const { user, initialized, loading: authLoading } = useAuth();

  const plans = {
    monthly: { price: 1, total: 1, save: 0 }, // בדיקה ב-$1 בלבד
    yearly: { price: 1, total: 1, save: 0 },
  };

  const { price, total, save } = plans[selectedPeriod];
  const API_BASE = import.meta.env.VITE_API_BASE_URL || "";
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
    try {
      if (!user?._id) {
        console.warn("⚠️ No user._id found — cannot create order!");
        alert("User not loaded yet. Please log in again.");
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

      console.log("📦 Sending create-order body:", body);

      const res = await fetch(`${API_BASE}/api/paypal/create-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      console.log("✅ create-order response:", data);

      if (!data.id) throw new Error("No PayPal order ID returned");
      return data.id;
    } catch (err) {
      console.error("❌ createOrder failed:", err);
      alert("Error creating order. Please try again.");
      setLoading(false);
      throw err;
    }
  };

  /* ========================================
     💰 אישור תשלום (CAPTURE)
  ======================================== */
  const captureOrder = async (orderId) => {
    console.log("💰 Capturing PayPal order:", orderId);
    const res = await fetch(`${API_BASE}/api/paypal/capture/${orderId}`, {
      method: "POST",
    });
    const data = await res.json();
    console.log("✅ capture response:", data);
    return data;
  };

  /* ========================================
     🚀 הפעלת PayPal Checkout
  ======================================== */
  const handlePayPalCheckout = async () => {
    if (!initialized || authLoading) {
      alert("Please wait until your account is fully loaded...");
      return;
    }

    if (!user?._id) {
      alert("User not loaded yet. Please log in again.");
      return;
    }

    console.log("🚀 Starting PayPal checkout for user:", user._id);
    setLoading(true);

    try {
      const paypal = window.paypal;
      if (!paypal) {
        alert("PayPal SDK not loaded yet. Please refresh the page.");
        setLoading(false);
        return;
      }

      // מנקים כל כפתור קודם כדי למנוע כפילויות
      const container = document.getElementById("paypal-button-container");
      container.innerHTML = "";

      paypal
        .Buttons({
          createOrder: async () => await createOrder(),
          onApprove: async (data) => {
            try {
              console.log("✅ Payment approved:", data);
              const result = await captureOrder(data.orderID);

              // 💾 עדכון משתמש במונגו מיד אחרי תשלום
              console.log("📩 Updating user subscription with:", {
                userId: user._id,
                plan: selectedPeriod,
                orderId: data.orderID,
              });

              await fetch(`${API_BASE}/api/paypal/subscription/confirm`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${user?.token || ""}`,
                },
                body: JSON.stringify({
                  userId: user._id,
                  plan: selectedPeriod,
                  orderId: data.orderID,
                  paypalData: result,
                }),
              });

              console.log("🎉 Payment + user update success!");
              setLoading(false);
              setSuccess(true);
              setTimeout(() => navigate("/dashboard"), 2000);
            } catch (err) {
              console.error("❌ Error after payment:", err);
              alert(
                "Payment succeeded but user update failed. Please contact support."
              );
              setLoading(false);
            }
          },
          onError: (err) => {
            console.error("💥 PayPal error:", err);
            alert("Payment failed. Please try again.");
            setLoading(false);
          },
        })
        .render("#paypal-button-container");
    } catch (err) {
      console.error("Checkout error:", err);
      setLoading(false);
    }
  };

  /* ========================================
     ⏳ Loading guard
  ======================================== */
  if (!initialized || authLoading) {
    return (
      <div className="plans-loading">
        <p>Loading your account...</p>
      </div>
    );
  }

  if (!user?._id) {
    return (
      <div className="plans-loading">
        <p>Session expired. Please log in again.</p>
        <button onClick={() => navigate("/login")}>Go to Login</button>
      </div>
    );
  }

  /* ========================================
     🖼️ Render UI
  ======================================== */
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
              Your free trial has ended. Choose a plan below to continue
              enjoying BizUply.
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
            <li>✔ Create and Track Client Tasks</li>
            <li>✔ Log and Document Client Calls</li>
            <li>✔ Automated Notifications</li>
            <li>✔ Predictive Analytics</li>
          </ul>

          {/* 🔘 CTA Button */}
          {success ? (
            <button className="plan-btn success">✅ Payment Successful!</button>
          ) : loading ? (
            <button className="plan-btn loading">Processing...</button>
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
