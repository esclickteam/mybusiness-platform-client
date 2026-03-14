import React, { useState, useEffect } from "react";
import API from "@api";
import "./AffiliatePage.css";
import BankDetailsForm from "./BankDetailsForm";

const AffiliatePage = () => {

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
        setErrorStats("Failed to retrieve business details");
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
        setErrorStats("Error loading data");
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
      return alert("Please fill all fields");
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
      setClientStatus("Client created successfully. Invite email sent.");

      // reset form
      setClientBusinessName("");
      setClientName("");
      setClientEmail("");
      setClientPhone("");

    } catch (err) {
      alert(err.response?.data?.message || "Error creating client");
    }
  };

  // ----------------------------------------------------
  // WITHDRAWAL
  // ----------------------------------------------------

  const handleWithdrawRequest = async () => {

    const amount = Number(withdrawAmount);

    if (isNaN(amount) || amount < 200) {
      return alert("Minimum withdrawal amount is $200");
    }

    if (amount > currentBalance) {
      return alert("Withdrawal amount exceeds available balance");
    }

    try {

      const { data } = await API.post("/affiliate/request-withdrawal", {
        affiliateId,
        amount
      });

      setWithdrawStatus(data.message || "Withdrawal request received.");

    } catch (err) {
      alert(err.response?.data?.message || "Error submitting withdrawal request");
    }
  };

  // ----------------------------------------------------
  // Affiliate link
  // ----------------------------------------------------

  const affiliateLink = referralCode
    ? `${window.location.origin}/register?ref=${referralCode}`
    : "";

  // ----------------------------------------------------
  // UI
  // ----------------------------------------------------

  return (
    <div className="affiliate-page">

      <h1>Affiliate Program</h1>

      {/* -------------------------------------------------- */}
      {/* PERSONAL LINK */}
      {/* -------------------------------------------------- */}

      <section className="affiliate-section">

        <h2>🎯 Your Personal Affiliate Link</h2>

        <input
          type="text"
          value={affiliateLink}
          readOnly
          className="affiliate-link-input"
        />

        <button
          onClick={() => navigator.clipboard.writeText(affiliateLink)}
        >
          Copy Link
        </button>

      </section>

      {/* -------------------------------------------------- */}
      {/* CREATE CLIENT */}
      {/* -------------------------------------------------- */}

      <section className="create-client-section">

        <h2>Create New Client</h2>

        <input
          type="text"
          placeholder="Business Name"
          value={clientBusinessName}
          onChange={(e) => setClientBusinessName(e.target.value)}
        />

        <input
          type="text"
          placeholder="Contact Name"
          value={clientName}
          onChange={(e) => setClientName(e.target.value)}
        />

        <input
          type="email"
          placeholder="Email"
          value={clientEmail}
          onChange={(e) => setClientEmail(e.target.value)}
        />

        <input
          type="text"
          placeholder="Phone"
          value={clientPhone}
          onChange={(e) => setClientPhone(e.target.value)}
        />

        <button onClick={handleCreateClient}>
          Create Client & Payment Link
        </button>

        {clientStatus && (
          <p className="success">{clientStatus}</p>
        )}

        {paymentLink && (
          <div className="payment-link-box">
            <p>Payment link:</p>
            <input value={paymentLink} readOnly />
            <button onClick={() => navigator.clipboard.writeText(paymentLink)}>
              Copy Link
            </button>
          </div>
        )}

      </section>

      {/* -------------------------------------------------- */}
      {/* STATS */}
      {/* -------------------------------------------------- */}

      <section className="affiliate-stats">

        <h2>Statistics</h2>

        {loadingStats && <p>Loading...</p>}
        {errorStats && <p>{errorStats}</p>}

        {!loadingStats && allStats.length > 0 && (

          <table className="stats-table">

            <thead>
              <tr>
                <th>Month</th>
                <th>Purchases</th>
                <th>Paid</th>
                <th>Unpaid</th>
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

      </section>

      {/* -------------------------------------------------- */}
      {/* WITHDRAW */}
      {/* -------------------------------------------------- */}

      <section className="affiliate-bank-section">

        <h2>Withdraw Balance</h2>

        <p>
          Available balance: <b>${currentBalance.toFixed(2)}</b>
        </p>

        <input
          type="number"
          value={withdrawAmount}
          onChange={(e) => setWithdrawAmount(e.target.value)}
          placeholder="Minimum $200"
        />

        <button onClick={handleWithdrawRequest}>
          Request Withdrawal
        </button>

        {withdrawStatus && <p>{withdrawStatus}</p>}

        <button
          className="payment-button"
          onClick={() => setShowBankForm(!showBankForm)}
        >
          Manage Bank Details
        </button>

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