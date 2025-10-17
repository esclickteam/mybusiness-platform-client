import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "../../styles/Plans.css";

export default function Plans() {
  const [selectedPeriod, setSelectedPeriod] = useState("monthly");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  const monthlyPlanId = "P-0JB4726150008570HNDY7UMI"; // ✅ Plan ID (Recurring)
  const API_BASE = import.meta.env.VITE_API_BASE_URL || "";
  const userId = user?._id || user?.userId || user?.id;

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
      }&vault=true&intent=subscription&currency=USD&locale=en_US`;
      script.async = true;
      script.onload = () => console.log("✅ PayPal SDK loaded");
      document.body.appendChild(script);
    }
  }, []);

  /* ========================================
     🚀 יצירת תשלום לפי סוג מנוי
  ======================================== */
  const handlePayPalCheckout = async () => {
    setLoading(true);
    setError(null);

    try {
      if (!userId) {
        alert("User not loaded yet. Please log in again.");
        setLoading(false);
        return;
      }

      const paypal = window.paypal;
      if (!paypal) {
        alert("PayPal SDK not loaded yet. Please refresh the page.");
        setLoading(false);
        return;
      }

      // מנקה כפתורים קודמים
      const container = document.getElementById("paypal-button-container");
      container.innerHTML = "";

      paypal
        .Buttons({
          style: {
            shape: "rect",
            color: "gold",
            layout: "vertical",
            label: "paypal",
          },

          ...(selectedPeriod === "monthly"
            ? {
                // 🌀 מנוי חודשי מתחדש
                createSubscription: function (data, actions) {
                  return actions.subscription.create({
                    plan_id: monthlyPlanId,
                  });
                },
                onApprove: async function (data) {
                  console.log("✅ Monthly subscription approved:", data);
                  try {
                    const res = await fetch(
                      `${API_BASE}/api/paypal/subscription/success`,
                      {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          userId,
                          subscriptionId: data.subscriptionID,
                          plan: "monthly",
                        }),
                      }
                    );
                    if (!res.ok) throw new Error("Failed to save subscription");
                    console.log("🎉 Monthly subscription saved to DB");
                    setSuccess(true);
                    setTimeout(() => navigate("/dashboard"), 2000);
                  } catch (err) {
                    console.error("❌ Error saving subscription:", err);
                    setError("Payment succeeded but updating your account failed.");
                  } finally {
                    setLoading(false);
                  }
                },
              }
            : {
                // 💰 מנוי שנתי חד-פעמי
                createOrder: async function () {
                  const res = await fetch(`${API_BASE}/api/paypal/create-order`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      amount: 1,
                      planName: "BizUply Yearly Plan",
                      userId,
                    }),
                  });
                  const data = await res.json();
                  return data.id;
                },
                onApprove: async function (data, actions) {
                  console.log("✅ Yearly payment approved:", data);
                  try {
                    await fetch(`${API_BASE}/api/paypal/capture/${data.orderID}`, {
                      method: "POST",
                    });
                    await fetch(`${API_BASE}/api/paypal/subscription/confirm`, {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        userId,
                        plan: "yearly",
                        orderId: data.orderID,
                      }),
                    });
                    console.log("🎉 Yearly payment recorded successfully");
                    setSuccess(true);
                    setTimeout(() => navigate("/dashboard"), 2000);
                  } catch (err) {
                    console.error("❌ Error saving yearly plan:", err);
                    setError("Payment succeeded but updating your account failed.");
                  } finally {
                    setLoading(false);
                  }
                },
              }),

          onError: (err) => {
            console.error("💥 PayPal error:", err);
            setError("Payment failed. Please try again.");
            setLoading(false);
          },
        })
        .render("#paypal-button-container");
    } catch (err) {
      console.error("Checkout error:", err);
      setError("Unexpected error occurred.");
      setLoading(false);
    }
  };

  /* ========================================
     🖼️ Render UI
  ======================================== */
  return (
    <div className="plans-page">
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

      {/* Toggle Between Monthly / Yearly */}
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

      {/* Plan Card */}
      <section className="plan-card-container">
        <div className="plan-card highlight">
          <h2>BizUply Professional Plan</h2>
          <p className="plan-desc">
            Access every BizUply feature — including your AI Partner, CRM,
            messaging, client reviews, and collaboration tools — all from one
            powerful dashboard.
          </p>

          <div className="plan-price">
            <span className="price">$1</span>
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

          {error && <p className="error-text">{error}</p>}

          <div className="summary-box">
            <div className="summary-row">
              <span>Total to pay:</span>
              <strong>
                {selectedPeriod === "monthly" ? "$1 / month" : "$1 / year"}
              </strong>
            </div>
            <div className="summary-row">
              <span>Billing type:</span>
              <strong>
                {selectedPeriod === "monthly"
                  ? "Recurring (auto-renewal)"
                  : "One-time payment"}
              </strong>
            </div>
          </div>

          <div id="paypal-button-container" style={{ marginTop: "1rem" }}></div>
        </div>
      </section>
    </div>
  );
}
