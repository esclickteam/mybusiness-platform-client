import React, { useCallback, useEffect, useState } from "react";
import { CreditCard, PiggyBank } from "lucide-react";
import {
  formatIlsFromMinor,
  getWhatsAppFunds,
  type WhatsAppFundsOverview,
} from "../../../../../api/whatsappWalletApi";
import WhatsAppManageFundsModal from "./WhatsAppManageFundsModal";
import "./whatsappBilling.css";

type Props = {
  businessId: string;
  /** When parent already loaded wallet overview via /usage */
  initialFunds?: WhatsAppFundsOverview | null;
};

export default function WhatsAppFundsCard({
  businessId,
  initialFunds = null,
}: Props) {
  const [funds, setFunds] = useState<WhatsAppFundsOverview | null>(initialFunds);
  const [loading, setLoading] = useState(!initialFunds);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalPanel, setModalPanel] = useState<"manage" | "topup">("manage");

  const refresh = useCallback(async () => {
    if (!businessId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getWhatsAppFunds(businessId);
      setFunds(data);
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { error?: string } } })?.response?.data
          ?.error || "Could not load funds";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [businessId]);

  useEffect(() => {
    if (initialFunds) {
      setFunds(initialFunds);
      setLoading(false);
      return;
    }
    void refresh();
  }, [initialFunds, refresh]);

  const f = funds?.funds;
  const available = f?.availableMinor ?? 0;
  const warn = Boolean(funds?.alerts?.lowBalance);
  const blocked = Boolean(funds?.alerts?.cannotSend);

  return (
    <>
      <article
        className={`wa-billing-card ${
          blocked ? "wa-billing-card--blocked" : warn ? "wa-billing-card--warn" : ""
        }`}
      >
        <div className="wa-billing-card__header">
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span
              style={{
                width: 28,
                height: 28,
                borderRadius: "50%",
                background: "#0d9488",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
              }}
            >
              <PiggyBank size={16} />
            </span>
            <div>
              <p className="wa-billing-card__title">Current Balance</p>
              <p className="wa-billing-card__hint" style={{ margin: 0 }}>
                {formatIlsFromMinor(f?.unitPriceMinor || 20)} per billable message
              </p>
            </div>
          </div>
          <button
            type="button"
            className="wa-billing-btn wa-billing-btn--ghost"
            style={{ borderColor: "#0d9488", color: "#0d9488" }}
            onClick={() => {
              setModalPanel("manage");
              setModalOpen(true);
            }}
          >
            <CreditCard size={14} />
            Manage Funds
          </button>
        </div>

        {loading ? (
          <p className="wa-billing-card__hint">Loading balance…</p>
        ) : error ? (
          <p className="wa-billing-card__error">{error}</p>
        ) : (
          <>
            <p
              style={{
                margin: "8px 0 0",
                fontSize: 28,
                fontWeight: 900,
                color: "#0f172a",
              }}
            >
              {formatIlsFromMinor(available)}
            </p>

            {funds?.alerts?.cannotSend ? (
              <p className="wa-billing-banner wa-billing-banner--error">
                Cannot send messages — insufficient balance.{" "}
                <button
                  type="button"
                  className="wa-billing-link"
                  onClick={() => {
                    setModalPanel("topup");
                    setModalOpen(true);
                  }}
                >
                  Add funds
                </button>
              </p>
            ) : funds?.alerts?.lowBalance ? (
              <p className="wa-billing-banner wa-billing-banner--warn">
                Your WhatsApp balance is low.{" "}
                <button
                  type="button"
                  className="wa-billing-link"
                  onClick={() => {
                    setModalPanel("topup");
                    setModalOpen(true);
                  }}
                >
                  Add funds
                </button>
              </p>
            ) : null}

            {funds?.alerts?.autoFundingFailed ? (
              <p className="wa-billing-banner wa-billing-banner--error">
                Automatic top-up failed. Update your payment method or add funds
                manually.
              </p>
            ) : null}

            <div
              style={{
                marginTop: 12,
                display: "grid",
                gap: 8,
                fontSize: 12,
                fontWeight: 600,
                color: "#475569",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Monthly Auto Funding</span>
                <span>
                  {f?.autoFundingEnabled
                    ? `On · ${formatIlsFromMinor(f.autoFundingAmountMinor || 0)}/mo`
                    : "Off"}
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Low Balance Alert</span>
                <span>{formatIlsFromMinor(f?.lowBalanceThresholdMinor || 0)}</span>
              </div>
              {f?.nextAutoFundingAt ? (
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>Next automatic top-up</span>
                  <span>
                    {new Date(f.nextAutoFundingAt).toLocaleDateString("he-IL")}
                  </span>
                </div>
              ) : null}
            </div>
          </>
        )}
      </article>

      <WhatsAppManageFundsModal
        open={modalOpen}
        businessId={businessId}
        funds={funds}
        initialPanel={modalPanel}
        onClose={() => setModalOpen(false)}
        onUpdated={refresh}
      />
    </>
  );
}
