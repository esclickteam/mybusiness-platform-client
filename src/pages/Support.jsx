import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import "./Support.css";

export default function Support() {
  const [amount, setAmount] = useState("");
  const [raised, setRaised] = useState(0);

  const milestones = [50000, 100000, 250000];
  const goal = milestones[milestones.length - 1];
  const progress = Math.min((raised / goal) * 100, 100);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = `https://www.paypal.com/sdk/js?client-id=Ad5vKKrnnrh28YQ58TH5sW34exTDt8j_fP68ebdSFrwGnKE__UZvcri0ENQ2ngJSDnyHzgpigne9xOnC&currency=USD`;
    script.async = true;
    script.onload = () => {
      if (window.paypal) {
        window.paypal.Buttons({
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
              setRaised((prev) => prev + Number(amount || 10));
            });
          },
          onError: (err) => {
            console.error("PayPal Checkout Error:", err);
            alert("Something went wrong. Please try again.");
          },
        }).render("#paypal-button-container");
      }
    };
    document.body.appendChild(script);
  }, [amount]);

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
          {milestones.map((m, i) => (
            <div
              key={i}
              className="support-progress-marker"
              style={{ left: `${(m / goal) * 100}%` }}
            >
              <span className="support-progress-label">
                ${m.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
        <div className="support-progress-text">
          <strong>${raised.toLocaleString()}</strong> raised of ${goal.toLocaleString()} goal
        </div>
        <div className="support-progress-left">
          {goal - raised > 0
            ? `$${(goal - raised).toLocaleString()} left to reach the goal`
            : "🎉 Goal reached!"}
        </div>
      </div>

      <hr className="support-divider" />

      {/* Our Story */}
      <h2 className="support-subtitle">Our Story</h2>
      <p className="support-text">
        We are a young couple with a big dream — to build a platform that will help small businesses
        manage their operations in a smart and innovative way.
      </p>
      <p className="support-text">
        For two years we went through difficult fertility treatments, which were very costly both
        financially and emotionally. To cover the treatments, as well as our basic living expenses,
        we had to take out loans and rely on credit card payments.
      </p>
      <p className="support-text">
        Since the war of October 7th, my husband has been called up for reserve duty again and again.
        Altogether he served for about half a year, and during those periods our income dropped sharply —
        in some months down to zero. Even in the short breaks when he returned, the business could not recover,
        and the financial burden kept growing.
      </p>
      <p className="support-text">
        After a very difficult period, our income began to stabilize slightly, but in reality we are unable
        to keep up with the monthly payments on our loans and credit cards. Every month we face high interest rates
        and growing debt, and we simply have nowhere left to take money from.
      </p>
      <p className="support-text">
        And despite everything — we have not given up. For the past seven months we have been developing on our own
        an advanced SaaS platform, building it step by step: a business page with ratings and reviews, chat, gallery,
        CRM system, a collaboration network to increase revenues, and even an AI business partner to assist entrepreneurs.
      </p>
      <p className="support-text">
        After two years of treatments, we finally managed to get pregnant — but sadly, we lost twins. Just one month later,
        we unexpectedly became pregnant again. This pregnancy is so precious to us, and all we want now is to live with dignity,
        pay off our debts, complete the platform, and build a stable foundation for our baby on the way.
      </p>

      <hr className="support-divider" />

      {/* Our Vision */}
      <h2 className="support-subtitle">Our Vision</h2>
      <p className="support-text">
        The platform we are building was born from a true desire to help businesses. Our dream is that, over time, it will grow
        into an American company with international reach, serving businesses around the world. We cannot promise this today —
        but it is our vision, and we believe we can get there with enough support.
      </p>

      <hr className="support-divider" />

      {/* Why We Are Reaching Out */}
      <h2 className="support-subtitle">Why We Are Reaching Out</h2>
      <p className="support-text">
        We are not a nonprofit, and we are not backed by large investors. We are a young family, with a real story and a real dream.  
        All we ask for is support to help us hold on, pay off our debts, complete the development, and build a stable and secure future
        for ourselves and for our baby.
      </p>
      <p className="support-text">
        Any amount you choose to give will be received with deep gratitude 🙏
      </p>

      <hr className="support-divider" />

      {/* Donation Levels */}
      <h2 className="support-subtitle">✨ Donation Levels (Thank-You Only)</h2>
      <ul className="support-list">
        <li>Above $50 → A personal thank-you email</li>
        <li>Above $250 → A digital certificate of appreciation (PDF with your name)</li>
        <li>Above $500 → A printed thank-you letter sent by mail</li>
        <li>Above $1,000 → Your name listed on a special page on our website: “Friends & Supporters”</li>
        <li>Above $5,000 → A personal thank-you video call with us (via Zoom)</li>
        <li>
          Above $10,000 → Your name featured at the top of our “Friends & Supporters” page as a Main Supporter +
          a personalized “Founding Donor” Certificate
        </li>
      </ul>

      <p className="support-text">
        Of course, there will always be an option to choose any other amount you wish to give.
      </p>

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

        {/* PayPal Smart Buttons */}
        <div id="paypal-button-container"></div>
      </div>
    </div>
  );
}
