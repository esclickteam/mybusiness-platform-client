import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import API from "@api";
import "./AffiliatePage.css";
import BankDetailsForm from "./BankDetailsForm";
import BizuplyLoader from "../../../components/ui/BizuplyLoader";
import { bizAlert } from "../../../components/ui/bizDialog";
import { useLocaleDir } from "../../../hooks/useLocaleDir";

const AffiliatePage = () => {
  const { t } = useTranslation();
  const dir = useLocaleDir();

  const [affiliateId, setAffiliateId] = useState(null);
  const [referralCode, setReferralCode] = useState(null);
  const [currentBalance, setCurrentBalance] = useState(0);

  const [allStats, setAllStats] = useState([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const [errorStats, setErrorStats] = useState(null);

  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawStatus, setWithdrawStatus] = useState(null);

  const [showBankForm, setShowBankForm] = useState(false);

  // ⭐ NEW CLIENT FORM
  const [clientBusinessName, setClientBusinessName] = useState("");
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientPhone, setClientPhone] = useState("");

  const [clientStatus, setClientStatus] = useState(null);
  const [paymentLink, setPaymentLink] = useState(null);

  // ----------------------------------------------------
  // Load affiliate data
  // ----------------------------------------------------

  useEffect(() => {
    (async () => {
      try {
        const { data } = await API.get("/business/my");
        const business = data.business;

        setAffiliateId(business._id);
        setReferralCode(business.referralCode || null);
      } catch {
        setErrorStats(t("leftover.affiliate.businessDetailsFailed"));
      }
    })();
  }, []);

  // ----------------------------------------------------
  // Load statistics
  // ----------------------------------------------------

  useEffect(() => {
    if (!affiliateId) return;

    (async () => {
      try {
        setLoadingStats(true);

        const { data } = await API.get("/affiliate/stats/all", {
          params: { affiliateId }
        });

        setAllStats(data.stats || []);
        setCurrentBalance(data.currentBalance || 0);
        setErrorStats(null);

      } catch {
        setErrorStats(t("leftover.affiliate.loadError"));
      } finally {
        setLoadingStats(false);
      }
    })();

  }, [affiliateId]);

  // ----------------------------------------------------
  // CREATE CLIENT + PAYMENT LINK
  // ----------------------------------------------------

  const handleCreateClient = async () => {

    if (!clientBusinessName || !clientName || !clientEmail || !clientPhone) {
      return void bizAlert(t("leftover.affiliate.fillAll"));
    }

    try {

      const { data } = await API.post("/affiliate/create-client", {
        affiliateId,
        businessName: clientBusinessName,
        contactName: clientName,
        email: clientEmail,
        phone: clientPhone
      });

      setPaymentLink(data.paymentLink);
      setClientStatus(t("leftover.affiliate.clientCreated"));

      // reset form
      setClientBusinessName("");
      setClientName("");
      setClientEmail("");
      setClientPhone("");

    } catch (err) {
      void bizAlert(err.response?.data?.message || t("leftover.affiliate.createClientError"));
    }
  };

  // ----------------------------------------------------
  // WITHDRAWAL
  // ----------------------------------------------------

  const handleWithdrawRequest = async () => {

    const amount = Number(withdrawAmount);

    if (isNaN(amount) || amount < 200) {
      return void bizAlert(t("leftover.affiliate.minWithdraw"));
    }

    if (amount > currentBalance) {
      return void bizAlert(t("leftover.affiliate.withdrawExceeds"));
    }

    try {

      const { data } = await API.post("/affiliate/request-withdrawal", {
        affiliateId,
        amount
      });

      setWithdrawStatus(data.message || t("leftover.affiliate.withdrawReceived"));

    } catch (err) {
      void bizAlert(err.response?.data?.message || t("leftover.affiliate.withdrawError"));
    }
  };

  // ----------------------------------------------------
  // Affiliate link
  // ----------------------------------------------------

  const affiliateLink = referralCode
    ? `${window.location.origin}/pricing?ref=${referralCode}`
    : "";

  // ----------------------------------------------------
  // UI
  // ----------------------------------------------------

  return (
    <div className="affiliate-page" dir={dir}>

      <header className="affiliate-head">
        <h1>{t("leftover.affiliate.pageTitle", "תוכנית שותפים")}</h1>
        <p>{t("leftover.affiliate.pageHint", "קישור אישי, לקוחות חדשים, סטטיסטיקה ומשיכת יתרה.")}</p>
      </header>

      {/* -------------------------------------------------- */}
      {/* PERSONAL LINK */}
      {/* -------------------------------------------------- */}

      <section className="affiliate-section">

        <h2>{t("leftover.affiliate.linkTitle")}</h2>

        <div className="affiliate-link-row">
          <input
            type="text"
            value={affiliateLink}
            readOnly
            className="affiliate-link-input"
          />

          <button type="button" onClick={() => navigator.clipboard.writeText(affiliateLink)}>
            {t("leftover.affiliate.copyLink")}
          </button>
        </div>

      </section>

      {/* -------------------------------------------------- */}
      {/* CREATE CLIENT */}
      {/* -------------------------------------------------- */}

      <section className="create-client-section">

        <h2>{t("leftover.affiliate.createTitle")}</h2>

        <input
          type="text"
          placeholder={t("leftover.affiliate.businessNamePh")}
          value={clientBusinessName}
          onChange={(e) => setClientBusinessName(e.target.value)}
        />

        <input
          type="text"
          placeholder={t("leftover.affiliate.contactNamePh")}
          value={clientName}
          onChange={(e) => setClientName(e.target.value)}
        />

        <input
          type="email"
          placeholder={t("leftover.affiliate.emailPh")}
          value={clientEmail}
          onChange={(e) => setClientEmail(e.target.value)}
        />

        <input
          type="text"
          placeholder={t("leftover.affiliate.phonePh")}
          value={clientPhone}
          onChange={(e) => setClientPhone(e.target.value)}
        />

        <button type="button" onClick={handleCreateClient}>
          {t("leftover.affiliate.createButton")}
        </button>

        {clientStatus && (
          <p className="success">{clientStatus}</p>
        )}

        {paymentLink && (
          <div className="payment-link-box">
            <p>{t("leftover.affiliate.paymentLink")}</p>
            <input value={paymentLink} readOnly />
            <button type="button" onClick={() => navigator.clipboard.writeText(paymentLink)}>
              {t("leftover.affiliate.copyLink")}
            </button>
          </div>
        )}

      </section>

      {/* -------------------------------------------------- */}
      {/* STATS */}
      {/* -------------------------------------------------- */}

      <section className="affiliate-stats">

        <h2>{t("leftover.affiliate.statsTitle")}</h2>

        {loadingStats && <BizuplyLoader size="lg" label={t("leftover.affiliate.loading")} />}
        {errorStats && <p>{errorStats}</p>}

        {!loadingStats && allStats.length > 0 && (

          <table className="stats-table">

            <thead>
              <tr>
                <th>{t("leftover.affiliate.month")}</th>
                <th>{t("leftover.affiliate.purchases")}</th>
                <th>{t("leftover.affiliate.paid")}</th>
                <th>{t("leftover.affiliate.unpaid")}</th>
              </tr>
            </thead>

            <tbody>

              {allStats.map((s, i) => {

                const paid = s.paidCommissions || 0;
                const unpaid = (s.totalCommissions || 0) - paid;

                return (
                  <tr key={i}>
                    <td>{s.month}</td>
                    <td>{s.purchases}</td>
                    <td>${paid.toFixed(2)}</td>
                    <td>${unpaid.toFixed(2)}</td>
                  </tr>
                );

              })}

            </tbody>

          </table>

        )}

        {!loadingStats && !errorStats && allStats.length === 0 && (
          <p className="affiliate-empty">{t("leftover.affiliate.emptyStats")}</p>
        )}

      </section>

      {/* -------------------------------------------------- */}
      {/* WITHDRAW */}
      {/* -------------------------------------------------- */}

      <section className="affiliate-bank-section">

        <h2>{t("leftover.affiliate.withdrawTitle")}</h2>

        <p>
          {t("leftover.affiliate.available")}: <b>${currentBalance.toFixed(2)}</b>
        </p>

        <input
          type="number"
          value={withdrawAmount}
          onChange={(e) => setWithdrawAmount(e.target.value)}
          placeholder={t("leftover.affiliate.minPh")}
        />

        <div className="affiliate-actions">
          <button type="button" onClick={handleWithdrawRequest}>
            {t("leftover.affiliate.requestWithdraw")}
          </button>

          <button
            type="button"
            className="payment-button"
            onClick={() => setShowBankForm(!showBankForm)}
          >
            {t("leftover.affiliate.manageBank")}
          </button>
        </div>

        {withdrawStatus && <p>{withdrawStatus}</p>}

        {showBankForm && (
          <div className="bank-form-wrapper">
            <BankDetailsForm />
          </div>
        )}

      </section>

    </div>
  );
};

export default AffiliatePage;