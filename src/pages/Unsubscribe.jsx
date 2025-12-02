import React from "react";
import "../styles/Unsubscribe.css";

export default function Unsubscribe() {
  const params = new URLSearchParams(window.location.search);
  const status = params.get("status"); // success / invalid
  const type = params.get("type") || "subscription"; // onboarding / marketing / partnerOffers

  let content = null;

  if (status === "success") {
    content = (
      <div className="unsub-card fade">
        <div className="unsub-emoji">👋</div>
        <h1>You’ve been unsubscribed!</h1>
        <p>
          You will no longer receive <strong>{type}</strong> emails from BizUply.
          <br />
          You may still receive important account or billing messages.
        </p>
      </div>
    );
  } else if (status === "invalid") {
    content = (
      <div className="unsub-card fade">
        <div className="unsub-emoji">⚠️</div>
        <h1>Invalid link</h1>
        <p>This unsubscribe link is not valid or has expired.</p>
      </div>
    );
  } else {
    content = (
      <div className="unsub-card fade">
        <div className="unsub-emoji">⚠️</div>
        <h1>Invalid request</h1>
        <p>Missing unsubscribe parameters.</p>
      </div>
    );
  }

  return <div className="unsub-container">{content}</div>;
}
