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

  const [newClient, setNewClient] = useState({
    businessName: "",
    name: "",
    email: "",
    phone: "",
  });

  const [paymentLink, setPaymentLink] = useState(null);
  const [creatingClient, setCreatingClient] = useState(false);
  const [clientStatus, setClientStatus] = useState("");
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

      const { data } = await API.get("/affiliate-marketer/dashboard", {
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

  const handleCreateClient = async () => {
    const payload = {
      businessName: newClient.businessName.trim(),
      name: newClient.name.trim(),
      email: newClient.email.trim().toLowerCase(),
      phone: newClient.phone.trim(),
    };

    if (!payload.businessName || !payload.name || !payload.email || !payload.phone) {
      alert("Please fill all fields");
      return;
    }

    try {
      setCreatingClient(true);
      setClientStatus("");
      setPaymentLink(null);

      const { data } = await API.post(
        "/affiliate-marketer/create-client",
        payload,
        { withCredentials: true }
      );

      setPaymentLink(data.paymentLink || null);
      setClientStatus(
        data.message || "Client created successfully. Invite email sent."
      );

      setNewClient({
        businessName: "",
        name: "",
        email: "",
        phone: "",
      });

      await refreshStats();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Error creating client");
    } finally {
      setCreatingClient(false);
    }
  };

  const updateBankDetails = async (bankDetails) => {
    try {
      const response = await API.put(
        "/affiliate-marketer/marketers/bank-details",
        bankDetails,
        { withCredentials: true }
      );

      alert(response.data.message || "Bank details updated successfully");
      setShowBankForm(false);
    } catch (error) {
      console.error(error);
      alert("Error updating bank details");
    }
  };

  return (
    <div className="affiliate-page">
      <h1>Partner Dashboard</h1>

      {copyStatus && <p className="success">{copyStatus}</p>}

      {/* SUMMARY */}
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

      {/* INVITE LINK */}
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

      {/* CREATE CLIENT */}
      <section className="affiliate-section">
        <h2>Create New Client</h2>

        <input
          placeholder="Business Name"
          value={newClient.businessName}
          onChange={(e) =>
            setNewClient((prev) => ({
              ...prev,
              businessName: e.target.value,
            }))
          }
        />

        <input
          placeholder="Contact Name"
          value={newClient.name}
          onChange={(e) =>
            setNewClient((prev) => ({
              ...prev,
              name: e.target.value,
            }))
          }
        />

        <input
          type="email"
          placeholder="Email"
          value={newClient.email}
          onChange={(e) =>
            setNewClient((prev) => ({
              ...prev,
              email: e.target.value,
            }))
          }
        />

        <input
          placeholder="Phone"
          value={newClient.phone}
          onChange={(e) =>
            setNewClient((prev) => ({
              ...prev,
              phone: e.target.value,
            }))
          }
        />

        <button onClick={handleCreateClient} disabled={creatingClient}>
          {creatingClient ? "Creating..." : "Create Client & Payment Link"}
        </button>

        {clientStatus && <p className="success">{clientStatus}</p>}

        {paymentLink && (
          <div className="payment-link-box">
            <h3>Payment Link</h3>

            <input value={paymentLink} readOnly />

            <button
              onClick={() =>
                copyToClipboard(paymentLink, "Payment link copied successfully")
              }
            >
              Copy Payment Link
            </button>
          </div>
        )}
      </section>

      {/* CLIENTS CREATED */}
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

      {/* MONTHLY COMMISSIONS */}
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

      {/* PAYMENTS */}
      <section className="affiliate-bank-section">
        <h2>Payments</h2>

        <p>
          Available balance: <strong>${Number(currentBalance || 0).toFixed(2)}</strong>
        </p>

        <button
          className="payment-button"
          onClick={() => setShowBankForm((p) => !p)}
        >
          Manage Bank Details
        </button>

        {showBankForm && (
          <MarketerBankDetailsForm
            affiliateId={user?.affiliateId}
            onSubmit={updateBankDetails}
          />
        )}
      </section>
    </div>
  );
}