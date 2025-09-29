import React, { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet";
import { io } from "socket.io-client";
import "./Support.css";

export default function Support() {
  const [amount, setAmount] = useState("");
  const [raised, setRaised] = useState(0);
  const paypalReadyRef = useRef(false);
  const paypalContainerRef = useRef(null);

  // ===== קונפיג קמפיין =====
  const milestones = [50000, 100000, 250000];
  const goal = milestones[milestones.length - 1];
  const progress = Math.min((raised / goal) * 100, 100);

  // ---- טעינת PayPal SDK פעם אחת ----
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
    script.src = `https://www.paypal.com/sdk/js?client-id=Ad5vKKrnnrh28YQ58TH5sW34exTDt8j_fP68ebdSFrwGnKE__UZvcri0ENQ2ngJSDnyHzgpigne9xOnC&currency=USD&locale=en_US`;
    script.async = true;
    script.addEventListener("load", onLoad, { once: true });
    document.body.appendChild(script);
  }, []);

  // ---- רנדר מחודש של כפתורי PayPal כשסכום משתנה ----
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
            const paid = Number(details.purchase_units?.[0]?.amount?.value || 0);
            console.log(
              `✅ Payment of $${paid} approved. Waiting for server webhook update...`
            );
            // ⚠️ לא מעדכנים כאן state — ההעדכון מגיע מה־Webhook דרך socket
          });
        },
        onError: (err) => {
          console.error("PayPal Checkout Error:", err);
        },
      })
      .render("#paypal-button-container");
  };

  // ---- התחברות ל־socket לקבלת עדכוני תרומות בזמן אמת ----
  useEffect(() => {
    const socket = io(process.env.REACT_APP_API_URL, {
      path: "/socket.io",
      transports: ["websocket"],
    });

    socket.on("donationUpdated", (data) => {
      if (typeof data.totalRaised === "number") {
        setRaised(data.totalRaised);
      }
    });

    // טעינה ראשונית
    const fetchRaised = async () => {
      try {
        const res = await fetch("/api/donations/total");
        if (res.ok) {
          const data = await res.json();
          if (typeof data.totalRaised === "number") {
            setRaised(data.totalRaised);
          }
        }
      } catch (e) {
        console.error("Failed to fetch initial raised total:", e);
      }
    };
    fetchRaised();

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div className="support-page">
      <Helmet>
        <title>Support Bizuply</title>
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>

      <h1 className="support-title">Help Us Build a Future for Our Baby</h1>

      {/* === Progress Bar === */}
      <div className="support-progress-wrapper">
        <div className="support-progress-bar">
          <div
            className="support-progress-fill"
            style={{ width: `${progress}%` }}
          />
          {milestones.map((m, i) => {
            const reached = raised >= m;
            const isLast = i === milestones.length - 1;
            return (
              <div
                key={i}
                className={`support-progress-marker ${reached ? "reached" : ""} ${
                  isLast ? "last-marker" : ""
                }`}
                style={{ left: `${(m / goal) * 100}%` }}
                aria-hidden="true"
              >
                <div className="support-progress-label">
                  ${m.toLocaleString()}
                </div>
              </div>
            );
          })}
        </div>

        <div className="support-progress-text">
          <strong>${raised.toLocaleString()}</strong> raised of $
          {goal.toLocaleString()} goal
        </div>
        <div className="support-progress-left">
          {goal - raised > 0
            ? `$${(goal - raised).toLocaleString()} left to reach the goal`
            : "🎉 Goal reached!"}
        </div>
      </div>

      <hr className="support-divider" />

      {/* === שאר התוכן נשאר בדיוק כמו אצלך === */}
      {/* Our Story, Vision, Why, Donation Levels, Form וכו' */}

      <div className="support-cta donation-box">
        <label htmlFor="amount" className="support-label">
          Enter your support amount (USD):
        </label>
        <div className="donation-input-wrapper">
          <span className="donation-currency">$</span>
          <input
            id="amount"
            type="number"
            className="donation-input"
            placeholder="100"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>

        <div className="donation-quick-grid">
          {[1, 50, 250, 500, 1000, 5000, 10000].map((val) => (
            <button
              key={val}
              className="donation-quick-btn"
              onClick={() => setAmount(val)}
            >
              ${val}
            </button>
          ))}
        </div>

        <div id="paypal-button-container" ref={paypalContainerRef}></div>
      </div>
    </div>
  );
}
