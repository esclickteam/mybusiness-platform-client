import React, { useState, useEffect, useMemo } from "react";
import { useAuth } from "../../../context/AuthContext";
import API from "@api";
import "./AffiliatePage.css";
import MarketerBankDetailsForm from "./MarketerBankDetailsForm";

export default function AffiliateDashboardPage() {
  const { user } = useAuth();

  const [showBankForm, setShowBankForm] = useState(false);

  const [allStats, setAllStats] = useState([]);
  const [clients, setClients] = useState([]);

  const [loadingStats, setLoadingStats] = useState(true);
  const [errorStats, setErrorStats] = useState(null);

  const [currentBalance, setCurrentBalance] = useState(user?.balance || 0);

  const [statsSummary, setStatsSummary] = useState({
    totalUsers: 0,
    payingUsers: 0,
    monthlyCommission: 0,
  });

  const [copyStatus, setCopyStatus] = useState("");

  const inviteLink = useMemo(() => {
    if (!user?.affiliateId) return "";
    return `${window.location.origin}/register?ref=${encodeURIComponent(
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
      alert("Failed to copy");
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
      });

      setAllStats(data.months || []);
      setClients(data.clients || []);
      setCurrentBalance(data.balance || 0);
    } catch (err) {
      console.error(err);
      setErrorStats("Error loading data");
    } finally {
      setLoadingStats(false);
    }
  };

  useEffect(() => {
    refreshStats();
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

  return (
    <div className="affiliate-page">
      <h1>Partner Dashboard</h1>

      {copyStatus && <p className="success">{copyStatus}</p>}

      <section className="affiliate-stats-summary">
        <div className="stat-card">
          <h3>Users Created</h3>
          <p>{statsSummary.totalUsers}</p>
        </div>

        <div className="stat-card">
          <h3>Paying Users</h3>
          <p>{statsSummary.payingUsers}</p>
        </div>

        <div className="stat-card">
          <h3>Monthly Commission</h3>
          <p>${Number(statsSummary.monthlyCommission || 0).toFixed(2)}</p>
        </div>
      </section>

      <section className="affiliate-section">
        <h2>Your Invite Link</h2>

        <input value={inviteLink} readOnly className="affiliate-link-input" />

        <button
          onClick={() =>
            copyToClipboard(inviteLink, "Invite link copied successfully")
          }
          disabled={!inviteLink}
        >
          Copy Invite Link
        </button>

        <p className="affiliate-helper-text">
          Share this link with leads. If they register through it, they will be
          linked to you automatically.
        </p>
      </section>

      <section className="affiliate-clients">
        <h2>Your Clients</h2>

        {clients.length === 0 && <p>No clients yet</p>}

        {clients.length > 0 && (
          <table className="stats-table">
            <thead>
              <tr>
                <th>Business</th>
                <th>Email</th>
                <th>Status</th>
                <th>Created</th>
                <th>Commission</th>
              </tr>
            </thead>

            <tbody>
              {clients.map((client) => (
                <tr key={client._id}>
                  <td>{client.businessName}</td>
                  <td>{client.email}</td>

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

                  <td>
                    {client.partnerStatus === "active" ? "$23.80" : "$0"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <section className="affiliate-stats">
        <h2>Monthly Commissions</h2>

        {loadingStats && <p>Loading data...</p>}
        {errorStats && <p>{errorStats}</p>}

        {!loadingStats && !errorStats && allStats.length === 0 && (
          <p>No monthly data yet</p>
        )}

        {allStats.length > 0 && (
          <table className="stats-table">
            <thead>
              <tr>
                <th>Month</th>
                <th>Paying Users</th>
                <th>Commission</th>
              </tr>
            </thead>

            <tbody>
              {allStats.map((stat) => (
                <tr key={stat.month}>
                  <td>{stat.month}</td>
                  <td>{stat.users}</td>
                  <td>${Number(stat.commission || 0).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <section className="affiliate-bank-section">
        <h2>Payments</h2>

        <p>
          Available balance:{" "}
          <strong>${Number(currentBalance || 0).toFixed(2)}</strong>
        </p>

        <button
          className="payment-button"
          onClick={() => setShowBankForm((prev) => !prev)}
        >
          Manage Bank Details
        </button>

        {showBankForm && (
          <MarketerBankDetailsForm onSubmit={updateBankDetails} />
        )}
      </section>
    </div>
  );
}