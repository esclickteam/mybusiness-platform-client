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
  /* ⏳ fallback של 48 שעות */
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

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 60_000);
    return () => clearInterval(id);
  }, []);

  const msLeft = Math.max(0, targetTs - now);
  const isExpired = msLeft <= 0;

  return (
    <div className="offer-overlay" role="dialog" aria-modal="true">
      <div className="offer-card">
        {/* ❌ Close */}
        <button
          type="button"
          className="offer-close"
          onClick={onClose}
          aria-label="Close offer"
        >
          ×
        </button>

        <span className="offer-badge">🎁 Limited-time</span>

        {/* ⭐ Price highlight */}
        <h2 className="offer-title">
          First Month Only{" "}
          <span className="price-highlight">$99</span>
          <span className="price-original">$119</span>
        </h2>

        <p className="offer-save">Save $20 on your first month</p>

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

        {/* ✅ הכפתור הקריטי — מוגדר כ־button */}
        <button
          type="button"
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
