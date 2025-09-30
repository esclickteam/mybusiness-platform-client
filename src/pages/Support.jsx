import React, { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet";
import { io } from "socket.io-client";
import "./Support.css";

export default function Support() {
  const [amount, setAmount] = useState("");
  const [raised, setRaised] = useState(0);
  const paypalReadyRef = useRef(false);
  const paypalContainerRef = useRef(null);

  // ===== Campaign Config =====
  const milestones = [50000, 100000, 250000];
  const goal = milestones[milestones.length - 1];
  const progress = Math.min((raised / goal) * 100, 100);

  // ---- Load PayPal SDK once ----
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
      "https://www.paypal.com/sdk/js?client-id=Ad5vKKrnnrh28YQ58TH5sW34exTDt8j_fP68ebdSFrwGnKE__UZvcri0ENQ2ngJSDnyHzgpigne9xOnC&currency=USD&locale=en_US";
    script.async = true;
    script.addEventListener("load", onLoad, { once: true });
    document.body.appendChild(script);
  }, []);

  // ---- Re-render PayPal buttons when amount changes ----
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
            // ⚠️ State update comes from Webhook via socket
          });
        },
        onError: (err) => {
          console.error("PayPal Checkout Error:", err);
        },
      })
      .render("#paypal-button-container");
  };

  // ---- Socket connection for real-time donation updates ----
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

        {/* ✅ נוסח מתוקן */}
        <div className="support-progress-text">
          raised <strong>${raised.toLocaleString()}</strong> of ${goal.toLocaleString()} goal
        </div>
        <div className="support-progress-left">
          {goal - raised > 0
            ? `$${(goal - raised).toLocaleString()} left to reach the goal`
            : "🎉 Goal reached!"}
        </div>
      </div>

      <hr className="support-divider" />

      {/* Our Story */}
      <div className="support-subtitle-wrapper">
        <h2 className="support-subtitle">Our Story</h2>
      </div>

      <figure className="support-image">
        <img src="/images/support/3.jpg" alt="Together during service" />
        <figcaption>Together even in the hardest moments</figcaption>
      </figure>

      <p className="support-text">
        We are a young couple with a big dream — to build a platform that will
        help small businesses manage their operations in a smart and innovative
        way.
      </p>

      <figure className="support-image">
        <img src="/images/support/2.jpg" alt="On the way, serious moment" />
        <figcaption>
          On the way to another challenging day, with faith in our hearts
        </figcaption>
      </figure>

      <p className="support-text">
        For two years we went through difficult fertility treatments, which were
        very costly both financially and emotionally...
      </p>

      <hr className="support-divider" />

      {/* Our Vision */}
      <div className="support-subtitle-wrapper">
        <h2 className="support-subtitle">Our Vision</h2>
      </div>

      <figure className="support-image">
        <img src="/images/support/1.jpg" alt="Small moment of light" />
        <figcaption>A small moment of light in a difficult time</figcaption>
      </figure>

      <p className="support-text">
        The platform we are building was born from a true desire to help
        businesses...
      </p>

      <hr className="support-divider" />

      {/* Why We Are Reaching Out */}
      <div className="support-subtitle-wrapper">
        <h2 className="support-subtitle">Why We Are Reaching Out</h2>
      </div>

      <p className="support-text">
        We are not a nonprofit, and we are not backed by large investors...
      </p>

      <figure className="support-image">
        <img src="/images/support/4.jpg" alt="Smiling towards the future" />
        <figcaption>
          Smiling towards the future thanks to your support
        </figcaption>
      </figure>

      <p className="support-text">
        Any amount you choose to give will be received with deep gratitude 🙏
      </p>

      <hr className="support-divider" />

      {/* Donation Levels */}
      <div className="support-subtitle-wrapper">
        <h2 className="support-subtitle">✨ Donation Levels (Thank-You Only)</h2>
      </div>
      <ul className="support-list">
        <li>Above $50 → A personal thank-you email</li>
        <li>Above $250 → A digital certificate of appreciation</li>
        <li>Above $500 → A printed thank-you letter sent by mail</li>
        <li>Above $1,000 → Your name listed on “Friends & Supporters”</li>
        <li>Above $5,000 → A personal thank-you video call with us</li>
        <li>Above $10,000 → Featured as a Main Supporter</li>
      </ul>

      {/* Support Form */}
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
          {[50, 250, 500, 1000, 5000, 10000].map((val) => (
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
