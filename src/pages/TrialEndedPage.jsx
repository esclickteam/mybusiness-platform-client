// TrialEndedPage.jsx
import React from "react";
import UpgradeOfferCard from "../components/UpgradeOfferCard/UpgradeOfferCard";
import "./TrialEndedPage.css";

export default function TrialEndedPage() {
  return (
    <div className="trial-ended-wrapper">
      <UpgradeOfferCard
        onUpgrade={() => (window.location.href = "/plans")}
        onHome={() => (window.location.href = "/")}
      />
    </div>
  );
}
