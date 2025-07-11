import React, { useState, useEffect } from "react";
import API from "@api";
import "./AffiliatePage.css";
import BankDetailsForm from "./BankDetailsForm";

export default function AffiliateDashboardPage() {
  const [showBankForm, setShowBankForm] = useState(false);
  const [showReceiptForm, setShowReceiptForm] = useState(false);
  const [allStats, setAllStats] = useState([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const [errorStats, setErrorStats] = useState(null);
  const [affiliateId, setAffiliateId] = useState(null);

  const [withdrawAmount, setWithdrawAmount] = useState(0);
  const [withdrawStatus, setWithdrawStatus] = useState(null);
  const [receiptFile, setReceiptFile] = useState(null);
  const [withdrawalId, setWithdrawalId] = useState(null);
  const [currentBalance, setCurrentBalance] = useState(0);

  // חישוב סך כל העמלות שלא שולם
  const totalUnpaidCommissions = allStats
    .filter((stat) => stat.paymentStatus !== "paid")
    .reduce((sum, stat) => sum + (stat.totalCommissions - (stat.paidCommissions || 0)), 0);

  // טען סטטיסטיקות ויתרה
  const refreshStats = async (affiliateId) => {
    try {
      setLoadingStats(true);
      const statsRes = await API.get("/affiliate/stats/all", {
        params: { affiliateId },
      });
      setAllStats(statsRes.data);

      const balanceRes = await API.get("/affiliate/balance", {
        params: { affiliateId },
      });
      setCurrentBalance(balanceRes.data.balance);

      setErrorStats(null);
    } catch (error) {
      setErrorStats("שגיאה בטעינת הנתונים");
    } finally {
      setLoadingStats(false);
    }
  };

  // טען affiliateId ונתונים ראשוניים
  useEffect(() => {
    async function fetchAffiliateInfo() {
      try {
        const res = await API.get("/affiliate/me");
        setAffiliateId(res.data.affiliateId);
        setCurrentBalance(res.data.balance);
      } catch (error) {
        setErrorStats("לא הצלחנו לקבל נתוני שותף");
      }
    }
    fetchAffiliateInfo();
  }, []);

  // עדכן נתונים ברגע שיש affiliateId
  useEffect(() => {
    if (!affiliateId) return;
    refreshStats(affiliateId);
  }, [affiliateId]);

  // טיפול בבקשת משיכה
  const handleWithdrawRequest = async () => {
    if (withdrawAmount < 200) {
      alert("סכום מינימום למשיכה הוא 200 ש\"ח");
      return;
    }
    if (withdrawAmount > currentBalance) {
      alert("סכום המשיכה גבוה מהיתרה הזמינה");
      return;
    }
    try {
      const res = await API.post("/affiliate/request-withdrawal", {
        affiliateId,
        amount: withdrawAmount,
      });
      setWithdrawStatus(res.data.message || "בקשת המשיכה התקבלה.");
      if (res.data.withdrawalId) setWithdrawalId(res.data.withdrawalId);
      setShowReceiptForm(true);

      // עדכון היתרה בהתאם לתשובה
      if (res.data.currentBalance !== undefined) {
        setCurrentBalance(res.data.currentBalance);
      } else {
        refreshStats(affiliateId);
      }
    } catch (error) {
      alert(error.response?.data?.message || "שגיאה בבקשת המשיכה");
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

      const res = await API.post("/affiliate/upload-receipt", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert(res.data.message || "הקבלה הועלתה בהצלחה");
      setWithdrawStatus("קבלה הועלתה וממתינה לאישור.");
      setShowReceiptForm(false);
      setReceiptFile(null);

      refreshStats(affiliateId);
    } catch (error) {
      alert(error.response?.data?.message || "שגיאה בהעלאת הקבלה");
    }
  };

  // קישור השותף האישי
  const affiliateLink = affiliateId
    ? `https://esclick.co.il/register?ref=${affiliateId}`
    : "לא זוהה מזהה שותף";

  return (
    <div className="affiliate-page">
      <h1>תכנית השותפים</h1>
      <p>כאן תוכל לעקוב אחרי הפניות, עמלות והכנסות מתכנית השותפים שלך.</p>

      <section className="affiliate-section">
        <h2>🎯 קישור השותף האישי שלך</h2>
        <p>העתיקו את הקישור ושתפו אותו כדי לצרף לקוחות חדשים ולקבל עמלות:</p>
        <input
          type="text"
          value={affiliateLink}
          readOnly
          onClick={(e) => e.target.select()}
          className="affiliate-link-input"
        />
        <button
          onClick={() => affiliateId && navigator.clipboard.writeText(affiliateLink)}
          disabled={!affiliateId}
        >
          📋 העתק קישור
        </button>
        {!affiliateId && (
          <p style={{ color: "red", marginTop: 8 }}>
            לא זוהה מזהה שותף. התחבר כדי לקבל קישור אישי.
          </p>
        )}
      </section>

      <section className="affiliate-stats">
        <h2>📊 סטטיסטיקות לכל החודשים</h2>
        {loadingStats && <p>טוען נתונים...</p>}
        {errorStats && <p className="error">{errorStats}</p>}
        {!loadingStats && allStats.length === 0 && <p>לא נמצאו נתונים להצגה.</p>}
        {allStats.length > 0 && (
          <table className="stats-table">
            <thead>
              <tr>
                <th>חודש</th>
                <th>מספר רכישות</th>
                <th>שולם (₪)</th>
                <th>לא שולם (₪)</th>
                <th>סטטוס תשלום</th>
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

      <section className="affiliate-commission-rules">
        <h2>💰 מדרגות עמלות לפי תקופת חבילה ובונוסים לפי עסקאות</h2>
        <table>
          <thead>
            <tr>
              <th>סוג חבילה</th>
              <th>תקופת התחייבות</th>
              <th>אחוז עמלה</th>
              <th>עסקאות מינימום לבונוס</th>
              <th>בונוס (₪)</th>
            </tr>
          </thead>
          <tbody>
            {/* שים כאן את הנתונים כפי שכתבת */}
            <tr><td>חבילה חודשית</td><td>1 חודש</td><td>3%</td><td>10</td><td>200</td></tr>
            {/* שאר הטבלה */}
          </tbody>
        </table>
        <p style={{ marginTop: "1rem", fontWeight: "bold", color: "#444" }}>
          ⚠️ הבונוס האקסטרה יינתן רק פעם אחת בחודש, לפי הרף הגבוה ביותר של עסקאות שהושג באותו חודש.
        </p>
      </section>

      <section className="affiliate-bank-section">
        <h2>💵 פעולות תשלום</h2>
        <div>
          <p>יתרתך הזמינה למשיכה: <strong>₪{currentBalance.toFixed(2)}</strong></p>
          <p>סך כל העמלות להשלמה: <strong>₪{totalUnpaidCommissions.toFixed(2)}</strong></p>
          {totalUnpaidCommissions > currentBalance && (
            <p style={{ color: "orange", fontWeight: "bold" }}>
              שימו לב: סך העמלות גבוה מיתרת המשיכה הזמינה.
            </p>
          )}

          {currentBalance < 200 ? (
            <p style={{ color: "red", fontWeight: "bold" }}>
              סכום מינימום למשיכה הוא 200 ש"ח. אנא המתן שיצטבר סכום מינימלי למשיכה.
            </p>
          ) : (
            <>
              <input
                type="number"
                min="200"
                max={currentBalance || 0}
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(Number(e.target.value))}
                placeholder="סכום למשיכה (מינימום 200 ש&quot;ח)"
              />
              <p style={{ color: "red", fontWeight: "bold", marginTop: "4px" }}>
                סכום מינימום למשיכה הוא 200 ש"ח
              </p>
              <button onClick={handleWithdrawRequest} disabled={withdrawAmount < 200}>
                בקש משיכה
              </button>
            </>
          )}
          {withdrawStatus && <p>{withdrawStatus}</p>}
        </div>

        {showReceiptForm && (
          <form className="receipt-upload-form" onSubmit={handleReceiptUpload}>
            <label>בחר קובץ קבלה (PDF או תמונה):</label>
            <input
              type="file"
              accept=".pdf,image/*"
              onChange={(e) => setReceiptFile(e.target.files[0])}
              required
            />
            <button type="submit">🚀 העלאת קבלה</button>
          </form>
        )}

        <button
          className="payment-button"
          onClick={() => setShowBankForm((prev) => !prev)}
        >
          ⚙️ ניהול פרטי חשבון בנק
        </button>
        {showBankForm && (
          <div className="bank-form-wrapper">
            <BankDetailsForm />
          </div>
        )}
      </section>
    </div>
  );
}
