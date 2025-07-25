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

  // חישוב סך כל העמלות שלא שולם
  const totalUnpaidCommissions = allStats
    .filter((stat) => stat.paymentStatus !== "paid")
    .reduce((sum, stat) => sum + (stat.totalCommissions - (stat.paidCommissions || 0)), 0);

  // טען סטטיסטיקות ויתרה
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
      setErrorStats("שגיאה בטעינת הנתונים");
    } finally {
      setLoadingStats(false);
    }
  };

  useEffect(() => {
    refreshStats();
  }, [affiliateId]);

  // טיפול בבקשת משיכה
  const handleWithdrawRequest = async () => {
    if (withdrawAmount < 200) {
      alert('סכום מינימום למשיכה הוא 200 ש"ח');
      return;
    }
    if (withdrawAmount > currentBalance) {
      alert('סכום המשיכה גבוה מהיתרה הזמינה');
      return;
    }
    try {
      const { data } = await API.post(
          `/affiliate-marketer/request-withdrawal/${affiliateId}`,
        { affiliateId, amount: withdrawAmount },
        { withCredentials: true }
      );
      setWithdrawStatus(data.message || "בקשת המשיכה התקבלה.");
      setWithdrawalId(data.withdrawalId || null);
      setShowReceiptForm(true);
      setCurrentBalance(
        data.currentBalance !== undefined
          ? data.currentBalance
          : currentBalance - withdrawAmount
      );
    } catch {
      alert("שגיאה בבקשת המשיכה");
    }
  };

  // העלאת קבלה
  const handleReceiptUpload = async (e) => {
    e.preventDefault();
    if (!receiptFile) {
      alert("בחר קובץ קבלה");
      return;
    }
    try {
      const formData = new FormData();
      formData.append("receipt", receiptFile);
      formData.append("affiliateId", affiliateId);
      if (withdrawalId) formData.append("withdrawalId", withdrawalId);

      const { data } = await API.post("/affiliate/upload-receipt", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      alert(data.message || "הקבלה הועלתה בהצלחה");
      setWithdrawStatus("קבלה הועלתה וממתינה לאישור.");
      setShowReceiptForm(false);
      setReceiptFile(null);
      refreshStats();
    } catch {
      alert("שגיאה בהעלאת הקבלה");
    }
  };

  // ** הוספת קישור השותף האישי עם אפשרות העתקה **
  const affiliateLink = affiliateId
    ? `https://esclick.co.il/register?ref=${affiliateId}`
    : "לא זוהה מזהה שותף";

  // פונקציה לעדכון פרטי בנק
  const updateBankDetails = async (bankDetails) => {
    try {
      const response = await API.put(
        "/affiliate-marketer/marketers/bank-details",
        bankDetails,
        { withCredentials: true }
      );
      alert(response.data.message || "פרטי הבנק עודכנו בהצלחה");
      setShowBankForm(false);
      refreshStats();
    } catch (error) {
      console.error(error);
      alert("שגיאה בעדכון פרטי הבנק");
    }
  };

  return (
    <div className="affiliate-page">
      <h1>תכנית השותפים</h1>
      <p>כאן תוכל לעקוב אחרי הפניות, עמלות והכנסות שלך.</p>

      <section className="affiliate-section">
        <h2>🎯 קישור השותף האישי שלך</h2>
        <input
          type="text"
          value={affiliateLink}
          readOnly
          onClick={(e) => e.target.select()}
          className="affiliate-link-input"
        />
        <button onClick={() => navigator.clipboard.writeText(affiliateLink)} disabled={!affiliateId}>
          📋 העתק קישור
        </button>
      </section>

      <section className="affiliate-stats">
        <h2>📊 סטטיסטיקות לכל החודשים</h2>
        {loadingStats && <p>טוען נתונים...</p>}
        {errorStats && <p className="error">{errorStats}</p>}
        {!loadingStats && allStats.length === 0 && <p>אין נתונים להצגה.</p>}
        {allStats.length > 0 && (
          <table className="stats-table">
            <thead>
              <tr>
                <th>חודש</th>
                <th>רכישות</th>
                <th>שולם (₪)</th>
                <th>לא שולם (₪)</th>
                <th>סטטוס</th>
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
                      {stat.paymentStatus === "paid" ? "שולם ✅" : "ממתין"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </section>

      <section className="affiliate-bank-section">
        <h2>💵 פעולות תשלום</h2>
        <p>
          יתרתך הזמינה למשיכה: <strong>₪{currentBalance.toFixed(2)}</strong>
        </p>
        <p>
          עמלות לא משולמות: <strong>₪{totalUnpaidCommissions.toFixed(2)}</strong>
        </p>
        {currentBalance < 200 ? (
          <p className="error">סכום מינימום למשיכה: 200 ₪</p>
        ) : (
          <>
            <input
              type="number"
              min="200"
              max={currentBalance}
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(Number(e.target.value))}
              placeholder="סכום למשיכה"
            />
            <button onClick={handleWithdrawRequest} disabled={withdrawAmount < 200}>
              בקש משיכה
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
            <button type="submit">🚀 העלאת קבלה</button>
          </form>
        )}

        <button className="payment-button" onClick={() => setShowBankForm((p) => !p)}>
          ⚙️ ניהול פרטי חשבון בנק
        </button>
        {showBankForm && (
          <MarketerBankDetailsForm
            affiliateId={affiliateId}
            onSubmit={updateBankDetails}
          />
        )}
      </section>
    </div>
  );
}
