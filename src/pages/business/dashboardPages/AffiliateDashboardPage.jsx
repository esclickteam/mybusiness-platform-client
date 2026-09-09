import React, { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../../context/AuthContext";
import { useSearchParams } from "react-router-dom";
import API from "@api";
import "./AffiliatePage.css";
import MarketerBankDetailsForm from "./MarketerBankDetailsForm";
import BizuplyLoader from "../../../components/ui/BizuplyLoader";

export default function AffiliateDashboardPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();

  const [showBankForm, setShowBankForm] = useState(false);
  const [allStats, setAllStats] = useState([]);
  const [clients, setClients] = useState([]);

  const [loadingStats, setLoadingStats] = useState(true);
  const [errorStats, setErrorStats] = useState(null);

  const [currentBalance, setCurrentBalance] = useState(0);

  const [statsSummary, setStatsSummary] = useState({
    totalUsers: 0,
    payingUsers: 0,
    monthlyCommission: 0,
    paidOut: 0,
  });

  const [copyStatus, setCopyStatus] = useState("");

  const [payoutAmount, setPayoutAmount] = useState("");
  const [payoutLoading, setPayoutLoading] = useState(false);
  const [payoutMessage, setPayoutMessage] = useState("");
  const [payoutError, setPayoutError] = useState("");

  const inviteLink = useMemo(() => {
    if (!user?.affiliateId) return "";
    return `${window.location.origin}/pricing?ref=${encodeURIComponent(
      user.affiliateId
    )}`;
  }, [user?.affiliateId]);

  const showCopyStatus = (message) => {
    setCopyStatus(message);
    window.clearTimeout(window.__affiliateCopyTimer);
    window.__affiliateCopyTimer = window.setTimeout(() => {
      setCopyStatus("");
    }, 2200);
  };

  const copyToClipboard = async (value, successMessage) => {
    if (!value) return;

    try {
      await navigator.clipboard.writeText(value);
      showCopyStatus(successMessage);
    } catch (err) {
      console.error("Copy failed:", err);
      alert(t("leftover.affiliate.copyFailed"));
    }
  };

  const refreshStats = async () => {
    try {
      setLoadingStats(true);
      setErrorStats(null);

      const { data } = await API.get("/affiliate/dashboard", {
        withCredentials: true,
      });

      setStatsSummary({
        totalUsers: data.totalUsers || 0,
        payingUsers: data.payingUsers || 0,
        monthlyCommission: data.monthlyCommission || 0,
        paidOut: data.paidOut || 0,
      });

      setAllStats(data.months || []);
      setClients(data.clients || []);
      setCurrentBalance(data.balance || 0);
    } catch (err) {
      console.error(err);
      setErrorStats(t("leftover.affiliateDash.loadError"));
    } finally {
      setLoadingStats(false);
    }
  };

  useEffect(() => {
    refreshStats();

    if (searchParams.get("checkout") === "success") {
      setTimeout(() => {
        refreshStats();
      }, 3000);
    }
  }, []);

  const updateBankDetails = async (bankDetails) => {
    try {
      const response = await API.put("/affiliate/bank-details", bankDetails, {
        withCredentials: true,
      });

      alert(response.data.message || "Bank details updated successfully");
      setShowBankForm(false);
      await refreshStats();
    } catch (error) {
      console.error(error);
      alert(
        error?.response?.data?.message || "Error updating bank details"
      );
      throw error;
    }
  };

  const handleRequestPayout = async () => {
    try {
      setPayoutError("");
      setPayoutMessage("");

      const amount = Number(payoutAmount);

      if (!amount || amount <= 0) {
        setPayoutError("Please enter a valid amount");
        return;
      }

      if (amount < 50) {
        setPayoutError("Minimum payout amount is $50");
        return;
      }

      if (amount > currentBalance) {
        setPayoutError("Amount exceeds available balance");
        return;
      }

      setPayoutLoading(true);

      await API.post(
        "/affiliate/request-payout",
        { amount },
        { withCredentials: true }
      );

      setPayoutMessage("Payout request sent successfully ✅");
      setPayoutAmount("");

      await refreshStats();
    } catch (err) {
      console.error(err);
      setPayoutError(
        err?.response?.data?.message || "Failed to send payout request"
      );
    } finally {
      setPayoutLoading(false);
    }
  };

  return (
    <div className="affiliate-page">
      <h1>{t("leftover.affiliateDash.title")}</h1>

      {copyStatus && <p className="success">{copyStatus}</p>}

      {/* 🔥 SUMMARY */}
      <section className="affiliate-stats-summary">
        <div className="stat-card">
          <h3>{t("leftover.affiliateDash.usersCreated")}</h3>
          <p>{statsSummary.totalUsers}</p>
        </div>

        <div className="stat-card">
          <h3>{t("leftover.affiliateDash.payingUsers")}</h3>
          <p>{statsSummary.payingUsers}</p>
        </div>

        <div className="stat-card">
          <h3>{t("leftover.affiliateDash.monthEarnings")}</h3>
          <p>${Number(statsSummary.monthlyCommission || 0).toFixed(2)}</p>
        </div>

        <div className="stat-card balance">
          <h3>{t("leftover.affiliateDash.availableBalance")}</h3>
          <p>${Number(currentBalance || 0).toFixed(2)}</p>
        </div>

        <div className="stat-card">
          <h3>{t("leftover.affiliateDash.paidOut")}</h3>
          <p>${Number(statsSummary.paidOut || 0).toFixed(2)}</p>
        </div>
      </section>

      {/* 🔗 INVITE */}
      <section className="affiliate-section">
        <h2>{t("leftover.affiliateDash.inviteLink")}</h2>

        <input value={inviteLink} readOnly className="affiliate-link-input" />

        <button
          onClick={() =>
            copyToClipboard(inviteLink, t("leftover.affiliateDash.inviteCopied"))
          }
          disabled={!inviteLink}
        >
          {t("leftover.affiliateDash.copyInvite")}
        </button>
      </section>

      {/* 👥 CLIENTS */}
      <section className="affiliate-clients">
        <h2>{t("leftover.affiliateDash.yourClients")}</h2>

        {clients.length === 0 && <p>{t("leftover.affiliateDash.noClients")}</p>}

        {clients.length > 0 && (
          <table className="stats-table">
            <thead>
              <tr>
                <th>{t("leftover.affiliateDash.business")}</th>
                <th>{t("leftover.affiliateDash.email")}</th>
                <th>{t("leftover.affiliateDash.plan")}</th>
                <th>{t("leftover.affiliateDash.status")}</th>
                <th>{t("leftover.affiliateDash.created")}</th>
                <th>{t("leftover.affiliateDash.thisMonth")}</th>
                <th>{t("leftover.affiliateDash.totalCommission")}</th>
              </tr>
            </thead>

            <tbody>
              {clients.map((client) => (
                <tr key={client._id}>
                  <td>{client.businessName}</td>
                  <td>{client.email}</td>

                  {/* 🔥 PLAN */}
                  <td>
                    <span
                      className={
                        client.packageType === "yearly"
                          ? "badge yearly"
                          : "badge monthly"
                      }
                    >
                      {client.packageType === "yearly"
                        ? t("leftover.affiliateDash.yearly")
                        : t("leftover.affiliateDash.monthly")}
                    </span>
                  </td>

                  <td>
                    <span className={`status ${client.partnerStatus}`}>
                      {client.partnerStatus}
                    </span>
                  </td>

                  <td>
                    {client.partnerCreatedAt
                      ? new Date(client.partnerCreatedAt).toLocaleDateString()
                      : "-"}
                  </td>

                  <td>${Number(client.monthlyCommission || 0).toFixed(2)}</td>
                  <td>${Number(client.totalCommission || 0).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {/* 📊 MONTHS */}
      <section className="affiliate-stats">
        {loadingStats && <BizuplyLoader size="lg" label={t("leftover.affiliateDash.loading")} />}
        {errorStats && <p>{errorStats}</p>}

        {allStats.length > 0 && (
          <table className="stats-table">
            <thead>
              <tr>
                <th>{t("leftover.affiliateDash.month")}</th>
                <th>{t("leftover.affiliateDash.commission")}</th>
              </tr>
            </thead>

            <tbody>
              {allStats.map((stat) => (
                <tr key={stat.month}>
                  <td>{stat.month}</td>
                  <td>${Number(stat.commission || 0).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {/* 💸 PAYOUT */}
      <section className="affiliate-bank-section">
        <h2>{t("leftover.affiliateDash.payments")}</h2>

        <p>
          {t("leftover.affiliateDash.balanceLine")}{" "}
          <strong>${Number(currentBalance || 0).toFixed(2)}</strong>
        </p>

        <div className="payout-box">
          <input
            type="number"
            placeholder={t("leftover.affiliateDash.amountPh")}
            value={payoutAmount}
            onChange={(e) => setPayoutAmount(e.target.value)}
          />

          <button onClick={handleRequestPayout} disabled={payoutLoading}>
            {payoutLoading ? t("leftover.affiliateDash.sending") : t("leftover.affiliateDash.requestPayout")}
          </button>

          {payoutMessage && <p className="success">{payoutMessage}</p>}
          {payoutError && <p className="error">{payoutError}</p>}
        </div>

        <button
          className="payment-button"
          onClick={() => setShowBankForm((prev) => !prev)}
        >
          {t("leftover.affiliateDash.manageBank")}
        </button>

        {showBankForm && (
          <MarketerBankDetailsForm onSubmit={updateBankDetails} />
        )}
      </section>
    </div>
  );
}