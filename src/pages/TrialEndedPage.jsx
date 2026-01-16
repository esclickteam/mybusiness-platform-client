// TrialEndedPage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import UpgradeOfferCard from "../components/UpgradeOfferCard/UpgradeOfferCard";
import "./TrialEndedPage.css";

export default function TrialEndedPage() {
  const navigate = useNavigate();

  return (
    <div className="trial-ended-wrapper">
      <UpgradeOfferCard
        onUpgrade={() => navigate("/pricing")}
        onHome={() => navigate("/")}
      />
    </div>
  );
}
