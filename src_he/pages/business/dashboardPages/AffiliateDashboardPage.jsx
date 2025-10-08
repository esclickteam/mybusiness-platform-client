```javascript
import React, { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";
import API from "@api";
import "./AffiliatePage.css";
import MarketerBankDetailsForm from "./MarketerBankDetailsForm";

export default function AffiliateDashboardPage() {
  const { user } = useAuth();
  const affiliateId = user?.affiliateId;

  const [showBankForm, setShowBankForm] = useState(false);
  const [showReceiptForm, setShowReceiptForm] = useState(false);
  const [allStats, setAllStats] = useState([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const [errorStats, setErrorStats] = useState(null);
  const [withdrawAmount, setWithdrawAmount] = useState(0);
  const [withdrawStatus, setWithdrawStatus] = useState(null);
  const [receiptFile, setReceiptFile] = useState(null);
  const [withdrawalId, setWithdrawalId] = useState(null);
  const [currentBalance, setCurrentBalance] = useState(user?.balance || 0);

  // Calculate total unpaid commissions
  const totalUnpaidCommissions = allStats
    .filter((stat) => stat.paymentStatus !== "paid")
    .reduce(
      (sum, stat) => sum + (stat.totalCommissions - (stat.paidCommissions || 0)),
      0
    );

  // Load statistics and balance
  const refreshStats = async () => {
    if (!affiliateId) return;
    setErrorStats(null);
    setLoadingStats(true);
    try {
      const [{ data: stats }, { data: balanceData }] = await Promise.all([
        API.get("/affiliate-marketer/stats/all", {
          params: { affiliateId },
          withCredentials: true,
        }),
        API.get("/affiliate-marketer/balance", {
          params: { affiliateId },
          withCredentials: true,
        }),
      ]);
      setAllStats(stats);
      setCurrentBalance(balanceData.balance);
    } catch {
      setErrorStats("Error loading data");
    } finally {
      setLoadingStats(false);
    }
  };

  useEffect(() => {
    refreshStats();
  }, [affiliateId]);

  // Handle withdrawal request
  const handleWithdrawRequest = async () => {
    if (withdrawAmount < 200) {
      alert('The minimum withdrawal amount is 200 NIS');
      return;
    }
    if (withdrawAmount > currentBalance) {
      alert('The withdrawal amount exceeds the available balance');
      return;
    }
    try {
      const { data } = await API.post(
        `/affiliate-marketer/request-withdrawal/${affiliateId}`,
        { affiliateId, amount: withdrawAmount },
        { withCredentials: true }
      );
      setWithdrawStatus(data.message || "Withdrawal request received.");
      setWithdrawalId(data.withdrawalId || null);
      setShowReceiptForm(true);
      setCurrentBalance(
        data.currentBalance !== undefined
          ? data.currentBalance
          : currentBalance - withdrawAmount
      );
    } catch {
      alert("Error in withdrawal request");
    }
  };

  // Upload receipt
  const handleReceiptUpload = async (e) => {
    e.preventDefault();
    if (!receiptFile) {
      alert("Select a receipt file");
      return;
    }
    try {
      const formData = new FormData();
      formData.append("receipt", receiptFile);
      formData.append("affiliateId", affiliateId);
      if (withdrawalId) formData.append("withdrawalId", withdrawalId);

      const { data } = await API.post(
        "/affiliate-marketer/upload-receipt",
        formData,
        { withCredentials: true }
      );

      alert(data.message || "Receipt uploaded successfully");
      setWithdrawStatus("Receipt uploaded and awaiting approval.");
      setShowReceiptForm(false);
      setReceiptFile(null);
      refreshStats();
    } catch (error) {
      console.error("Error uploading receipt:", error);
      alert(error.response?.data?.message || "Error uploading receipt");
    }
  };

  // ** Add personal affiliate link with copy option **
  const affiliateLink = affiliateId
    ? `https://esclick.co.il/register?ref=${affiliateId}`
    : "Affiliate ID not recognized";

  // Function to update bank details
  const updateBankDetails = async (bankDetails) => {
    try {
      const response = await API.put(
        "/affiliate-marketer/marketers/bank-details",
        bankDetails,
        { withCredentials: true }
      );
      alert(response.data.message || "Bank details updated successfully");
      setShowBankForm(false);
      refreshStats();
    } catch (error) {
      console.error(error);
      alert("Error updating bank details");
    }
  };

  return (
    <div className="affiliate-page">
      <h1>Affiliate Program</h1>
      <p>Here you can track your referrals, commissions, and earnings.</p>

      <section className="affiliate-section">
        <h2>🎯 Your Personal Affiliate Link</h2>
        <input
          type="text"
          value={affiliateLink}
          readOnly
          onClick={(e) => e.target.select()}
          className="affiliate-link-input"
        />
        <button
          onClick={() => navigator.clipboard.writeText(affiliateLink)}
          disabled={!affiliateId}
        >
          📋 Copy Link
        </button>
      </section>

      <section className="affiliate-stats">
        <h2>📊 Statistics for All Months</h2>
        {loadingStats && <p>Loading data...</p>}
        {errorStats && <p className="error">{errorStats}</p>}
        {!loadingStats && allStats.length === 0 && <p>No data to display.</p>}
        {allStats.length > 0 && (
          <table className="stats-table">
            <thead>
              <tr>
                <th>Month</th>
                <th>Purchases</th>
                <th>Paid (₪)</th>
                <th>Unpaid (₪)</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {allStats.map((stat) => {
                const paid = stat.paidCommissions || 0;
                const unpaid = stat.totalCommissions - paid;
                return (
                  <tr key={stat._id}>
                    <td>{stat.month}</td>
                    <td>{stat.purchases}</td>
                    <td>₪{paid.toFixed(2)}</td>
                    <td>₪{unpaid.toFixed(2)}</td>
                    <td className={stat.paymentStatus === "paid" ? "paid" : "unpaid"}>
                      {stat.paymentStatus === "paid" ? "Paid ✅" : "Pending"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </section>

      <section className="affiliate-bank-section">
        <h2>💵 Payment Actions</h2>
        <p>
          Your available balance for withdrawal: <strong>₪{currentBalance.toFixed(2)}</strong>
        </p>
        <p>
          Unpaid commissions: <strong>₪{totalUnpaidCommissions.toFixed(2)}</strong>
        </p>
        {currentBalance < 200 ? (
          <p className="error">Minimum withdrawal amount: 200 ₪</p>
        ) : (
          <>
            <input
              type="number"
              min="200"
              max={currentBalance}
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(Number(e.target.value))}
              placeholder="Amount to withdraw"
            />
            <button onClick={handleWithdrawRequest} disabled={withdrawAmount < 200}>
              Request Withdrawal
            </button>
          </>
        )}
        {withdrawStatus && <p>{withdrawStatus}</p>}

        {showReceiptForm && (
          <form className="receipt-upload-form" onSubmit={handleReceiptUpload}>
            <input
              type="file"
              accept=".pdf,image/*"
              onChange={(e) => setReceiptFile(e.target.files[0])}
              required
            />
            <button type="submit">🚀 Upload Receipt</button>
          </form>
        )}

        <button className="payment-button" onClick={() => setShowBankForm((p) => !p)}>
          ⚙️ Manage Bank Account Details
        </button>
        {showBankForm && (
          <MarketerBankDetailsForm affiliateId={affiliateId} onSubmit={updateBankDetails} />
        )}
      </section>
    </div>
  );
}
```