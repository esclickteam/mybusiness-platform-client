import React, { useCallback, useEffect, useState } from "react";
import { CreditCard, PiggyBank } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  formatIlsFromMinor,
  getWhatsAppFunds,
  type WhatsAppFundsOverview,
} from "../../../../../api/whatsappWalletApi";
import { useWhatsAppHubContext } from "../../../../dev/useWhatsAppHubContext";
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
  const { t, i18n } = useTranslation();
  const { connection } = useWhatsAppHubContext();
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
          ?.error || t("whatsapp.funds.errors.loadFailed");
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [businessId, t]);

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
  const low = Boolean(funds?.alerts?.lowBalance);
  const blocked = Boolean(funds?.alerts?.cannotSend);
  const phone = connection?.displayPhoneNumber || null;

  return (
    <>
      <article className="wa-billing-card">
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
              <p className="wa-billing-card__title">
                {t("whatsapp.funds.currentBalance")}
              </p>
              <p className="wa-billing-card__hint" style={{ margin: 0 }}>
                {t("whatsapp.funds.perMessage", {
                  price: formatIlsFromMinor(f?.unitPriceMinor || 20),
                })}
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
            {t("whatsapp.funds.manageCta")}
          </button>
        </div>

        {loading ? (
          <p className="wa-billing-card__hint">{t("whatsapp.funds.loading")}</p>
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

            {blocked ? (
              <p className="wa-billing-banner wa-billing-banner--warn">
                {t("whatsapp.funds.insufficientBalance")}{" "}
                <button
                  type="button"
                  className="wa-billing-link"
                  onClick={() => {
                    setModalPanel("topup");
                    setModalOpen(true);
                  }}
                >
                  {t("whatsapp.funds.addFunds")}
                </button>
              </p>
            ) : low ? (
              <p className="wa-billing-banner wa-billing-banner--warn">
                {t("whatsapp.funds.balanceLow")}{" "}
                <button
                  type="button"
                  className="wa-billing-link"
                  onClick={() => {
                    setModalPanel("topup");
                    setModalOpen(true);
                  }}
                >
                  {t("whatsapp.funds.addFunds")}
                </button>
              </p>
            ) : null}

            {funds?.alerts?.autoFundingFailed ? (
              <p className="wa-billing-banner wa-billing-banner--error">
                {t("whatsapp.funds.autoFailed")}
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
                <span>{t("whatsapp.funds.autoRecharge")}</span>
                <span>
                  {f?.autoFundingEnabled
                    ? t("whatsapp.funds.autoOnSummary", {
                        amount: formatIlsFromMinor(
                          f.autoFundingAmountMinor || 0
                        ),
                      })
                    : t("whatsapp.funds.off")}
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>{t("whatsapp.funds.balanceThreshold")}</span>
                <span>
                  {formatIlsFromMinor(f?.lowBalanceThresholdMinor || 0)}
                </span>
              </div>
              {f?.nextAutoFundingAt ? (
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <span>{t("whatsapp.funds.nextAutoTopupLabel")}</span>
                  <span>
                    {new Date(f.nextAutoFundingAt).toLocaleDateString(
                      i18n.language
                    )}
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
        phoneNumber={phone}
        initialPanel={modalPanel}
        onClose={() => setModalOpen(false)}
        onUpdated={refresh}
      />
    </>
  );
}
