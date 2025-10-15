import React from "react";
import { useNavigate } from "react-router-dom";
import "./TrialExpiredModal.css";

export default function TrialExpiredModal() {
  const navigate = useNavigate();

  return (
    <div className="trial-overlay">
      <div className="trial-modal">
        <h2>⏳ Your Free Trial Has Ended</h2>
        <p>
          Continue using <strong>BizUply</strong>’s smart tools, automations, and CRM by upgrading your plan.
        </p>
        <button className="upgrade-btn" onClick={() => navigate("/pricing")}>
          Upgrade Now
        </button>
        <p className="note">Thank you for trying BizUply 💜</p>
      </div>
    </div>
  );
}
