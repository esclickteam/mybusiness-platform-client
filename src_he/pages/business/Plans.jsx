import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "../../styles/Plans.css";

function Plans() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Reading the reason parameter from the URL
  const queryParams = new URLSearchParams(location.search);
  const reason = queryParams.get("reason");

  const isTrial = user?.subscriptionPlan === "trial";
  const trialActive = isTrial && user?.isSubscriptionValid;

  const isTestUser = user?.isTestUser || false;
  const durations = isTestUser ? ["test", "1", "3", "12"] : ["1", "3", "12"];
  const [selectedDuration, setSelectedDuration] = useState(
    isTestUser ? "test" : "1"
  );

  const prices = { "1": 399, "3": 379, "12": 329 };
  const testPrices = { test: 3 };

  const handleDurationChange = (duration) => setSelectedDuration(duration);

  const handleSelectPlan = () => {
    if (!user) {
      navigate("/login");
      return;
    }
    let totalPrice;
    let planName;
    if (selectedDuration === "test") {
      totalPrice = testPrices.test;
      planName = "Experimental Subscription Package - 3 Months";
    } else {
      totalPrice = prices[selectedDuration] * parseInt(selectedDuration);
      planName = "Escalick Subscription Package";
    }
    navigate("/checkout", {
      state: {
        planName,
        totalPrice,
        duration: selectedDuration === "test" ? "3" : selectedDuration,
      },
    });
  };

  const features = [
    "Marketing and business consulting based on artificial intelligence with up to 60 quality inquiries per month.",
    "Smart AI partner providing business actions and recommendations.",
    "Platform for business collaborations.",
    "Professional business page with gallery, FAQs, and more.",
    "Smart appointment management system for clients.",
    "Real-time customer service chat.",
    "Reliable review system for real customers.",
    "Full and unlimited access to all systems.",
    "Smart CRM for customer relationship management.",
    "Analytical dashboard for monitoring reminders and meetings.",
    "Smart alerts for important events.",
  ];

  return (
    <div className="plans-wrapper" dir="rtl">
      <h1 className="plans-header">What does your business get?</h1>

      {/* Message about trial expiration */}
      {reason === "trial_expired" && (
        <div className="plans-alert plans-alert-error">
          The free trial period has ended. Choose a package to continue using Escalick.
        </div>
      )}

      {/* Message about active trial */}
      {trialActive && (
        <div className="plans-alert plans-alert-info">
          You are in a free trial month. You can upgrade to a paid package at any time to ensure continued access after the trial ends.
        </div>
      )}

      <div className="plans-card">
        <ul className="plans-list">
          {features.map((text, idx) => (
            <li key={idx} className="plans-list-item">
              <span className="checkmark" aria-hidden="true">✔</span> {text}
            </li>
          ))}
        </ul>

        <div
          className="plans-duration-selector"
          role="radiogroup"
          aria-label="Subscription period selection"
        >
          {durations.map((d) => {
            let label = "";
            let price = 0;
            if (d === "test") {
              label = "Trial Package (3 Months)";
              price = (testPrices.test / 3).toFixed(2);
            } else if (d === "1") {
              label = "Monthly";
              price = prices["1"];
            } else if (d === "3") {
              label = "3 Months";
              price = prices["3"];
            } else if (d === "12") {
              label = "Yearly";
              price = prices["12"];
            }
            return (
              <button
                key={d}
                onClick={() => handleDurationChange(d)}
                className={`duration-btn ${d} ${selectedDuration === d ? "active" : ""} ${d === "12" ? "recommended" : ""}`}
                role="radio"
                aria-checked={selectedDuration === d}
                tabIndex={selectedDuration === d ? 0 : -1}
                type="button"
              >
                {label}
                <span className="duration-price">{price} $ per month</span>
              </button>
            );
          })}
        </div>

        <div className="total-price" aria-live="polite">
          Total price:{" "}
          {selectedDuration === "test"
            ? testPrices.test
            : prices[selectedDuration] * parseInt(selectedDuration)}
          {" "}$
        </div>

        <div className="launch-price-banner" role="alert">
          Join now at a special launch price for a limited time – don't miss out!
        </div>

        <button
          className="subscribe-btn"
          onClick={handleSelectPlan}
          type="button"
        >
          Choose a subscription and start growing with Escalick now!
        </button>
      </div>
    </div>
  );
}

export default Plans;
