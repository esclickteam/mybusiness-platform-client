import React, { useEffect, useMemo, useState } from "react";
import "./UpgradeOfferCard.css";

function formatTimeLeft(ms) {
  const total = Math.max(0, ms);
  const totalSeconds = Math.floor(total / 1000);

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const pad = (n) => String(n).padStart(2, "0");
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}

export default function UpgradeOfferCard({
  onUpgrade,
  onHome,
  expiresAt, // ✅ Date string or timestamp (recommended: user.earlyBirdExpiresAt)
}) {
  // fallback: 48 hours from first render (only if expiresAt not provided)
  const fallbackExpiresAt = useMemo(() => Date.now() + 48 * 60 * 60 * 1000, []);

  const targetTs = useMemo(() => {
    if (!expiresAt) return fallbackExpiresAt;
    const d = new Date(expiresAt);
    const t = d.getTime();
    return Number.isFinite(t) ? t : fallbackExpiresAt;
  }, [expiresAt, fallbackExpiresAt]);

  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const msLeft = Math.max(0, targetTs - now);
  const isExpired = msLeft <= 0;

  return (
    <div className="offer-card">
      <div className="offer-header-line" />

      <div className="offer-badge-row">
        <span className="offer-badge">Limited-time</span>
        <span className={`offer-timer ${isExpired ? "is-expired" : ""}`}>
          {isExpired ? "Offer expired" : `Ends in ${formatTimeLeft(msLeft)}`}
        </span>
      </div>

      <h2 className="offer-title">
        🎁 Limited-Time Offer <br />
        First Month Only $99
      </h2>

      <p className="offer-desc">
        Upgrade now to unlock <strong>BizUply’s</strong> smart automations, CRM,
        and AI tools — with a special early upgrade price.
      </p>

      <p className="offer-note">
        You’ll pay <strong>$99</strong> for the first month, then{" "}
        <strong>$119/month</strong>.
      </p>

      <button
        className="offer-upgrade-btn"
        onClick={onUpgrade}
        disabled={isExpired}
        title={isExpired ? "This offer has expired" : "Upgrade now"}
      >
        Upgrade & Claim $99 First Month
      </button>

      <button className="offer-home-btn" onClick={onHome}>
        ← Back to Home
      </button>

      <p className="offer-subtext">
        Questions?{" "}
        <a href="mailto:support@bizuply.com" className="offer-link">
          Contact support
        </a>
      </p>

      <p className="offer-footer">
        Your trial is still active — this is just a limited-time discount 🚀
      </p>
    </div>
  );
}
