import React from "react";
import "../styles/Unsubscribe.css";

export default function Unsubscribe() {
  const params = new URLSearchParams(window.location.search);
  const status = params.get("status"); // success / invalid
  const type = params.get("type") || "subscription"; // onboarding / marketing / partnerOffers

  return (
    <div className="unsub-container">
      {/* SUCCESS */}
      {status === "success" && (
        <div className="unsub-card fade">
          <div className="unsub-emoji">👋</div>
          <h1>You’ve been unsubscribed!</h1>
          <p>
            You will no longer receive <strong>{type}</strong> emails from BizUply.
            <br />
            You may still receive important account or billing messages.
          </p>
        </div>
      )}

      {/* INVALID */}
      {status !== "success" && (
        <div className="unsub-card fade">
          <div className="unsub-emoji">⚠️</div>
          <h1>Invalid link</h1>
          <p>This unsubscribe link is not valid or has expired.</p>
        </div>
      )}
    </div>
  );
}
