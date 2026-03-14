import React, { useState, useEffect } from "react";
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

  const refreshStats = async () => {
    try {
      setLoadingStats(true);

      const { data } = await API.get("/affiliate-marketer/dashboard", {
        withCredentials: true,
      });

      setStatsSummary({
        totalUsers: data.totalUsers,
        payingUsers: data.payingUsers,
        monthlyCommission: data.monthlyCommission,
      });

      setAllStats(data.months || []);
      setClients(data.clients || []);
      setCurrentBalance(data.balance || 0);
    } catch (err) {
      setErrorStats("Error loading data");
    } finally {
      setLoadingStats(false);
    }
  };

  useEffect(() => {
    refreshStats();
  }, []);

  const handleCreateClient = async () => {
    try {
      setCreatingClient(true);

      const { data } = await API.post(
        "/affiliate-marketer/create-client",
        {
          ...newClient,
        },
        { withCredentials: true }
      );

      setPaymentLink(data.paymentLink);

      setNewClient({
        businessName: "",
        name: "",
        email: "",
        phone: "",
      });

      refreshStats();
    } catch (err) {
      console.error(err);
      alert("Error creating client");
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
      alert("Error updating bank details");
    }
  };

  return (
    <div className="affiliate-page">

      <h1>Partner Dashboard</h1>

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
          <p>${statsSummary.monthlyCommission.toFixed(2)}</p>
        </div>

      </section>

      {/* CREATE CLIENT */}

      <section className="affiliate-section">

        <h2>Create New Client</h2>

        <input
          placeholder="Business Name"
          value={newClient.businessName}
          onChange={(e) =>
            setNewClient({ ...newClient, businessName: e.target.value })
          }
        />

        <input
          placeholder="Contact Name"
          value={newClient.name}
          onChange={(e) =>
            setNewClient({ ...newClient, name: e.target.value })
          }
        />

        <input
          placeholder="Email"
          value={newClient.email}
          onChange={(e) =>
            setNewClient({ ...newClient, email: e.target.value })
          }
        />

        <input
          placeholder="Phone"
          value={newClient.phone}
          onChange={(e) =>
            setNewClient({ ...newClient, phone: e.target.value })
          }
        />

        <button onClick={handleCreateClient} disabled={creatingClient}>
          {creatingClient ? "Creating..." : "Create Client & Payment Link"}
        </button>

        {paymentLink && (
          <div className="payment-link-box">

            <h3>Payment Link</h3>

            <input value={paymentLink} readOnly />

            <button
              onClick={() => navigator.clipboard.writeText(paymentLink)}
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
                    {new Date(client.partnerCreatedAt).toLocaleDateString()}
                  </td>

                  <td>
                    {client.partnerStatus === "active"
                      ? "$23.80"
                      : "$0"}
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
                  <td>${stat.commission.toFixed(2)}</td>
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
          Available balance: <strong>${currentBalance.toFixed(2)}</strong>
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