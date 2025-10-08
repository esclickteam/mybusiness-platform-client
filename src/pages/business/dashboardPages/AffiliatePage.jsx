```javascript
import React, { useState, useEffect } from "react";
import API from "@api";
import "./AffiliatePage.css";
import BankDetailsForm from "./BankDetailsForm";

/**
 * AffiliatePage – Full updated version
 */
const AffiliatePage = () => {
  // States
  const [affiliateId, setAffiliateId]     = useState(null);
  const [businessId, setBusinessId]       = useState(null);
  const [referralCode, setReferralCode]   = useState(null);
  const [marketerBusiness, setMarketerBusiness] = useState(null);
  const [currentBalance, setCurrentBalance]     = useState(0);

  const [allStats, setAllStats]         = useState([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const [errorStats, setErrorStats]     = useState(null);

  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawStatus, setWithdrawStatus] = useState(null);
  const [receiptFile, setReceiptFile]       = useState(null);
  const [withdrawalId, setWithdrawalId]     = useState(null);

  const [showBankForm, setShowBankForm] = useState(false);

  // Total unpaid commissions
  const totalUnpaidCommissions = allStats
    .filter((s) => s.paymentStatus !== "paid")
    .reduce((sum, s) =>
      sum + ((s.totalCommissions || 0) - (s.paidCommissions || 0))
    , 0);

  // ➊ Getting business details + affiliate code
  useEffect(() => {
    (async () => {
      try {
        const { data } = await API.get("/business/my");
        const business = data.business;
        const marketer = data.marketerBusiness || null;

        setBusinessId(business._id);
        setReferralCode(business.referralCode || null);
        // 👉 Changing: affiliateId = the business itself
        setAffiliateId(business._id);
        setMarketerBusiness(marketer);
        // We did not update currentBalance here
      } catch {
        setErrorStats("Failed to retrieve business details");
      }
    })();
  }, []);

  // ➋ Loading statistics when affiliateId is ready
  useEffect(() => {
    if (!affiliateId) return;
    (async () => {
      try {
        setLoadingStats(true);
        const { data } = await API.get("/affiliate/stats/all", {
          params: { affiliateId },
        });
        setAllStats(data.stats || []);
        // 👉 Getting the updated currentBalance from the API
        setCurrentBalance(data.currentBalance);
        setErrorStats(null);
      } catch {
        setErrorStats("Error loading data");
      } finally {
        setLoadingStats(false);
      }
    })();
  }, [affiliateId]);

  // 💸 Withdrawal request
  const handleWithdrawRequest = async () => {
    const amount = Number(withdrawAmount);
    if (isNaN(amount) || amount < 200) {
      return alert('Minimum withdrawal amount is 200 ILS');
    }
    if (amount > currentBalance) {
      return alert("Withdrawal amount exceeds available balance");
    }

    try {
      const { data } = await API.post("/affiliate/request-withdrawal", {
        affiliateId,
        amount,
      });
      setWithdrawStatus(data.message || "Withdrawal request received.");
      setWithdrawalId(data.withdrawalId || null);
      // The API no longer returns currentBalance here, but we can assume it will refresh
    } catch (err) {
      alert(err.response?.data?.message || "Error in withdrawal request");
    }
  };

  // 📤 Receipt upload
  const handleReceiptUpload = async (e) => {
    e.preventDefault();
    if (!receiptFile) return alert("Select a receipt file");

    try {
      const fd = new FormData();
      fd.append("receipt", receiptFile);
      fd.append("affiliateId", affiliateId);
      if (withdrawalId) fd.append("withdrawalId", withdrawalId);

      const { data } = await API.post("/affiliate/upload-receipt", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert(data.message || "Receipt uploaded successfully");
      setWithdrawStatus("Receipt uploaded and awaiting approval.");
      setReceiptFile(null);
      setWithdrawalId(null);
    } catch (err) {
      alert(err.response?.data?.message || "Error uploading receipt");
    }
  };

  // 🔗 Personal link
  const affiliateLink = referralCode
    ? `${window.location.origin}/register?ref=${referralCode}`
    : "";

  return (
    <div className="affiliate-page">
      <h1>Affiliate Program</h1>
      <p>Here you can track referrals, commissions, and income from your affiliate program.</p>

      {/* 🔗 Personal link */}
      <section className="affiliate-section">
        <h2>🎯 Your personal affiliate link</h2>
        <input
          type="text"
          value={affiliateLink}
          readOnly
          onClick={(e) => e.target.select()}
          className="affiliate-link-input"
        />
        <button
          onClick={() =>
            referralCode && navigator.clipboard.writeText(affiliateLink)
          }
          disabled={!referralCode}
        >
          📋 Copy Link
        </button>
        {!referralCode && (
          <p style={{ color: "red", marginTop: 8 }}>Affiliate code not recognized.</p>
        )}
      </section>

      {/* 🏷️ Marketer details */}
      {marketerBusiness && (
        <section className="marketer-business">
          <h2>Marketing Business:</h2>
          <p>
            Marketing business name: <strong>{marketerBusiness.businessName}</strong>
          </p>
        </section>
      )}

      {/* 📊 Statistics table */}
      <section className="affiliate-stats">
        <h2>📊 Statistics for all months</h2>
        {loadingStats && <p>Loading data...</p>}
        {errorStats && <p className="error">{errorStats}</p>}
        {!loadingStats && allStats.length === 0 && <p>No data found to display.</p>}
        {allStats.length > 0 && (
          <table className="stats-table">
            <thead>
              <tr>
                <th>Month</th>
                <th>Purchases</th>
                <th>Paid (₪)</th>
                <th>Unpaid (₪)</th>
                <th>Payment Status</th>
              </tr>
            </thead>
            <tbody>
              {allStats.map((s, i) => {
                const paid   = s.paidCommissions || 0;
                const unpaid = (s.totalCommissions || 0) - paid;
                return (
                  <tr key={s.month || i}>
                    <td>{s.month || "-"}</td>
                    <td>{s.purchases || 0}</td>
                    <td>₪{paid.toFixed(2)}</td>
                    <td>₪{unpaid.toFixed(2)}</td>
                    <td
                      className={
                        s.paymentStatus === "paid"
                          ? "paid"
                          : s.paymentStatus === "no-data"
                            ? "no-data"
                            : "unpaid"
                      }
                    >
                      {s.paymentStatus === "paid"
                        ? "Paid ✅"
                        : s.paymentStatus === "no-data"
                          ? "No data"
                          : "Pending"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </section>

      {/* 💵 Payment actions */}
      <section className="affiliate-bank-section">
        <h2>💵 Payment Actions</h2>
        <p>
          Your available balance for withdrawal: <strong>₪{currentBalance.toFixed(2)}</strong>
        </p>

        {currentBalance < 200 ? (
          <p style={{ color: "red", fontWeight: "bold" }}>
            Minimum withdrawal amount is 200 ILS.
          </p>
        ) : (
          <>
            <input
              type="number"
              min="200"
              max={currentBalance}
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
              placeholder='Minimum withdrawal amount 200 ILS'
            />
            <button
              onClick={handleWithdrawRequest}
              disabled={Number(withdrawAmount) < 200}
            >
              Request Withdrawal
            </button>
          </>
        )}
        {withdrawStatus && <p>{withdrawStatus}</p>}

        {withdrawalId && (
          <form className="receipt-upload-form" onSubmit={handleReceiptUpload}>
            <label>Select receipt file (PDF or image):</label>
            <input
              type="file"
              accept=".pdf,image/*"
              onChange={(e) => setReceiptFile(e.target.files[0])}
              required
            />
            <button type="submit">🚀 Upload Receipt</button>
          </form>
        )}

        <button
          className="payment-button"
          onClick={() => setShowBankForm((prev) => !prev)}
        >
          ⚙️ Manage Bank Account Details
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
```