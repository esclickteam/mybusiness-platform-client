import React, { useMemo } from "react";
import "../styles/Unsubscribe.css";

export default function Unsubscribe() {
  const params = useMemo(() => new URLSearchParams(window.location.search), []);
  const status = params.get("status"); // success / invalid
  const type = params.get("type") || "subscription"; // onboarding / marketing / partnerOffers

  const content = (() => {
    switch (status) {
      case "success":
        return (
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

      case "invalid":
        return (
          <div className="unsub-card fade">
            <div className="unsub-emoji">⚠️</div>
            <h1>Invalid link</h1>
            <p>This unsubscribe link is not valid or has expired.</p>
          </div>
        );

      default:
        return (
           <div className="unsub-card fade">
            <div className="unsub-emoji">⚠️</div>
            <h1>Invalid request</h1>
            <p>Missing unsubscribe parameters.</p>
          </div>
        );
    }
  })();

  return <div className="unsub-container">{content}</div>;
}
