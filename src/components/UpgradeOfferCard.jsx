import React, { useEffect, useMemo, useState } from "react";
import "./UpgradeOfferCard.css";

function formatTimeLeft(ms) {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  return `${hours}h ${minutes}m`;
}

export default function UpgradeOfferCard({
  onUpgrade,
  onClose,
  expiresAt,
}) {
  const STORAGE_KEY = "seen_upgrade_offer";

  const fallbackExpiresAt = useMemo(
    () => Date.now() + 48 * 60 * 60 * 1000,
    []
  );

  const targetTs = useMemo(() => {
    if (!expiresAt) return fallbackExpiresAt;
    const t = new Date(expiresAt).getTime();
    return Number.isFinite(t) ? t : fallbackExpiresAt;
  }, [expiresAt, fallbackExpiresAt]);

  const [now, setNow] = useState(Date.now());
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const alreadySeen = localStorage.getItem(STORAGE_KEY);
    if (!alreadySeen) {
      setVisible(true);
      localStorage.setItem(STORAGE_KEY, "true");
    }
  }, []);

  useEffect(() => {
    if (!visible) return;
    const id = setInterval(() => setNow(Date.now()), 60000);
    return () => clearInterval(id);
  }, [visible]);

  if (!visible) return null;

  const msLeft = Math.max(0, targetTs - now);
  const isExpired = msLeft <= 0;

  return (
    <div className="offer-overlay">
      <div className="offer-card">
        <button className="offer-close" onClick={onClose}>✕</button>

        <span className="offer-badge">🎁 Limited-time</span>

        <h2 className="offer-title">
          First Month Only <span>$99</span>
        </h2>

        {!isExpired && (
          <p className="offer-timer">
            Offer ends in <strong>{formatTimeLeft(msLeft)}</strong>
          </p>
        )}

        <p className="offer-desc">
          Unlock <strong>BizUply</strong> automations, CRM & AI tools.
          <br />
          Early upgrade pricing — no commitment.
        </p>

        <p className="offer-note">
          Then <strong>$119/month</strong>. Cancel anytime.
        </p>

        <button
          className="offer-upgrade-btn"
          onClick={onUpgrade}
          disabled={isExpired}
        >
          Upgrade for $99
        </button>

        <p className="offer-footer">
          Your trial stays active • No obligation
        </p>
      </div>
    </div>
  );
}
