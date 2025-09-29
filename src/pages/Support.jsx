import React, { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet";
import "./Support.css";

export default function Support() {
  const [amount, setAmount] = useState("");
  const [raised, setRaised] = useState(0); 
  const [donors, setDonors] = useState(0);
  const paypalReadyRef = useRef(false);
  const paypalContainerRef = useRef(null);

  // ===== קונפיג קמפיין =====
  const milestones = [50000, 100000, 250000];
  const goal = milestones[milestones.length - 1];
  const progress = Math.min((raised / goal) * 100, 100);

  // ---- טעינת PayPal SDK ----
  useEffect(() => {
    if (paypalReadyRef.current) return;
    const existing = document.querySelector(
      'script[src^="https://www.paypal.com/sdk/js"]'
    );
    const onLoad = () => {
      paypalReadyRef.current = true;
      renderPaypalButtons();
    };

    if (existing) {
      if (window.paypal) {
        paypalReadyRef.current = true;
        renderPaypalButtons();
      } else {
        existing.addEventListener("load", onLoad, { once: true });
      }
      return;
    }

    const script = document.createElement("script");
    script.src =
      "https://www.paypal.com/sdk/js?client-id=YOUR_CLIENT_ID&currency=USD";
    script.async = true;
    script.addEventListener("load", onLoad, { once: true });
    document.body.appendChild(script);
  }, []);

  // ---- עדכון כפתור PayPal כשהסכום משתנה ----
  useEffect(() => {
    if (!paypalReadyRef.current) return;
    renderPaypalButtons();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [amount]);

  const renderPaypalButtons = () => {
    if (!window.paypal) return;
    if (paypalContainerRef.current) {
      paypalContainerRef.current.innerHTML = "";
    }

    window.paypal
      .Buttons({
        style: {
          color: "blue",
          shape: "pill",
          label: "paypal",
        },
        createOrder: (data, actions) => {
          return actions.order.create({
            purchase_units: [
              {
                amount: {
                  value: amount || "10",
                },
              },
            ],
          });
        },
        onApprove: (data, actions) => {
          return actions.order.capture().then((details) => {
            alert(`Thank you, ${details.payer.name.given_name}!`);
            const paid = Number(amount || 10);
            setRaised((prev) => prev + paid);
            setDonors((prev) => prev + 1);
          });
        },
        onError: (err) => {
          console.error("PayPal Checkout Error:", err);
          alert("Something went wrong. Please try again.");
        },
      })
      .render("#paypal-button-container");
  };

  // ---- עדכון בזמן אמת מהשרת ----
  useEffect(() => {
    const fetchRaised = async () => {
      try {
        const res = await fetch("/api/donations/total"); 
        if (res.ok) {
          const data = await res.json();
          if (typeof data.totalRaised === "number") {
            setRaised(data.totalRaised);
          }
          if (typeof data.totalDonors === "number") {
            setDonors(data.totalDonors);
          }
        }
      } catch (e) {}
    };
    fetchRaised();
    const id = setInterval(fetchRaised, 5000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="support-page">
      <Helmet>
        <title>Support Bizuply</title>
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>

      <h1 className="support-title">
        Help Us Hold On, Finish the Development, and Build a Future for Our Baby on the Way
      </h1>

      {/* === Progress Bar === */}
      <div className="support-progress-wrapper">
        <div className="support-progress-bar">
          <div
            className="support-progress-fill"
            style={{ width: `${progress}%` }}
          />
          {milestones.map((m, i) => {
            const reached = raised >= m;
            return (
              <div
                key={i}
                className={`support-progress-marker ${reached ? "reached" : ""}`}
                style={{ left: `${(m / goal) * 100}%` }}
              >
                <span className="support-progress-label">
                  ${m.toLocaleString()}
                </span>
              </div>
            );
          })}
        </div>
        <div className="support-progress-text">
          <strong>${raised.toLocaleString()}</strong> raised of ${goal.toLocaleString()} goal
        </div>
        <div className="support-progress-left">
          {goal - raised > 0
            ? `$${(goal - raised).toLocaleString()} left to reach the goal`
            : "🎉 Goal reached!"}
        </div>
        <div className="support-progress-donors">
          {donors === 0
            ? "Be the first to support us 💜"
            : `${donors} supporter${donors > 1 ? "s" : ""} so far`}
        </div>
      </div>

      <hr className="support-divider" />

      {/* Support Form */}
      <div className="support-cta">
        <label htmlFor="amount" className="support-label">
          Enter your support amount (USD):
        </label>
        <input
          id="amount"
          type="number"
          className="support-input"
          placeholder="e.g. 100"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <div className="support-quick">
          {[50, 250, 500, 1000, 5000, 10000].map((val) => (
            <button
              key={val}
              className="support-quick-btn"
              onClick={() => setAmount(val)}
            >
              ${val}
            </button>
          ))}
        </div>

        <button className="cta-donate">Donate Now</button>

        {/* PayPal Smart Buttons */}
        <div id="paypal-button-container" ref={paypalContainerRef}></div>
      </div>
    </div>
  );
}
