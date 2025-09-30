import React, { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet";
import { io } from "socket.io-client";
import "./Support.css";

export default function Support() {
  const [amount, setAmount] = useState("");
  const [raised, setRaised] = useState(0);
  const [expanded, setExpanded] = useState(false); // ✅ מצב קריאה מלאה
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

      <div className="support-text">
        {!expanded ? (
          <>
            <p>
              We are a young couple with a big dream — to build a platform that will
              help small businesses manage their operations in a smart and innovative way.
            </p>
            <p>
              For two years we went through difficult fertility treatments,
              which were very costly both financially and emotionally...
            </p>
            
           <div className="readmore-wrapper">
  <button
    className="support-btn"
    onClick={() => setExpanded(true)}
  >
    Read More
  </button>
</div>
</>
) : (
          <>
            <p>
              We are a young couple with a big dream — to build a platform that will
              help small businesses manage their operations in a smart and innovative way.
            </p>
            <p>
              For two years we went through difficult fertility treatments, which were very
              costly both financially and emotionally. To cover the treatments, as well as our
              basic living expenses, we had to take out loans and rely on credit card payments.
            </p>
            <p>
              Since the war of October 7th, my husband has been called up for reserve duty
              again and again. Altogether he served for about half a year (more or less),
              and during those periods our income dropped sharply — in some months down to
              zero. Even in the short breaks when he returned, the business could not recover,
              and the financial burden kept growing. We applied for a government-backed loan
              but were rejected, even though we demonstrated the loss of income.
            </p>
            <p>
              After a very difficult period, our income began to stabilize slightly, but in
              reality we are unable to keep up with the monthly payments on our loans and
              credit cards. Every month we face high interest rates and growing debt, and we
              simply have nowhere left to take money from.
            </p>
            <p>
              And despite everything — we have not given up. We work around the clock, from
              morning until late at night. For the past seven months we have been developing
              on our own an advanced SaaS platform, building it step by step: a business page
              with ratings and reviews, chat, gallery, CRM system, a collaboration network to
              increase revenues, and even an AI business partner to assist entrepreneurs.
            </p>
            <p>
              On a personal level, the road has not been easy either. After two years of
              treatments, we finally managed to get pregnant — but sadly, the pregnancy did
              not progress, and we lost twins. Despite the heartbreak and depression, we
              continued to work. Just one month later, we unexpectedly became pregnant again.
              This pregnancy is so precious to us, and all we want now is to live with dignity,
              pay off our debts, complete the platform, and build a stable foundation for our
              baby on the way.
            </p>
           <div className="readmore-wrapper">
  <button
    className="support-btn"
    onClick={() => setExpanded(false)}
  >
    Read Less
  </button>
</div>
</>
)}
</div>

      <p className="support-text" style={{ textAlign: "center" }}>⸻</p>

      {/* Our Vision */}
      <div className="support-subtitle-wrapper">
        <h2 className="support-subtitle">Our Vision</h2>
      </div>

      <figure className="support-image">
        <img src="/images/support/1.jpg" alt="Small moment of light" />
        <figcaption>A small moment of light in a difficult time</figcaption>
      </figure>

      <div className="support-text">
        <p>
          The platform we are building was born from a true desire to help businesses.
          Our dream is that, over time, it will grow into an American company with
          international reach, serving businesses around the world. We know we cannot
          promise this today — but it is our vision, and we believe we have the ability
          to get there with enough support.
        </p>
      </div>

      <p className="support-text" style={{ textAlign: "center" }}>⸻</p>

      {/* Why We Are Reaching Out */}
      <div className="support-subtitle-wrapper">
        <h2 className="support-subtitle">Why We Are Reaching Out</h2>
      </div>

      <figure className="support-image">
        <img src="/images/support/4.jpg" alt="Smiling towards the future" />
        <figcaption>Smiling towards the future thanks to your support</figcaption>
      </figure>

      <div className="support-text">
        <p>
          We are not a nonprofit, and we are not backed by large investors. We are a
          young family, with a real story and a real dream. All we ask for is support
          to help us hold on, pay off our debts, complete the development, and build a
          stable and secure future for ourselves and for our baby.
        </p>
        <p>Any amount you choose to give will be received with deep gratitude 🙏</p>
      </div>

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
