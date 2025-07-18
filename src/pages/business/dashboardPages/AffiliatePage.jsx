import React, { useState, useEffect } from "react";
import API from "@api";
import "./AffiliatePage.css";
import BankDetailsForm from "./BankDetailsForm";

const AffiliatePage = () => {
  const [showBankForm, setShowBankForm] = useState(false);
  const [showReceiptForm, setShowReceiptForm] = useState(false);
  const [allStats, setAllStats] = useState([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const [errorStats, setErrorStats] = useState(null);
  const [businessId, setBusinessId] = useState(null);

  // מצב למשיכת כספים
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawStatus, setWithdrawStatus] = useState(null);
  const [receiptFile, setReceiptFile] = useState(null);
  const [withdrawalId, setWithdrawalId] = useState(null);

  // יתרה עדכנית מהשרת
  const [currentBalance, setCurrentBalance] = useState(0);

  // סכום כולל עמלות לא משולמות (לצורכי מידע בלבד)
  const totalUnpaidCommissions = allStats
    .filter((stat) => stat.paymentStatus !== "paid")
    .reduce(
      (sum, stat) => sum + ((stat.totalCommissions || 0) - (stat.paidCommissions || 0)),
      0
    );

  // פונקציה לריענון סטטיסטיקות ויתרה
  const refreshStats = async (affiliateId) => {
    console.log("refreshStats: מתחיל ריענון עם affiliateId:", affiliateId);
    try {
      setLoadingStats(true);

      const statsRes = await API.get("/affiliate/stats/all", {
        params: { affiliateId },
      });

      console.log("refreshStats: נתונים שהתקבלו מהשרת:", statsRes.data);

      setAllStats(statsRes.data.stats || []);
      setCurrentBalance(statsRes.data.currentBalance || 0);

      setErrorStats(null);
    } catch (error) {
      console.error("refreshStats: שגיאה בטעינת הנתונים", error);
      setErrorStats("שגיאה בטעינת הנתונים");
    } finally {
      setLoadingStats(false);
    }
  };

  // קבלת מזהה עסק ראשונית
  useEffect(() => {
    async function fetchBusinessInfo() {
      try {
        console.log("fetchBusinessInfo: מנסה לקבל מידע עסקי...");
        const res = await API.get("/business/my");
        if (res.data?.business?._id) {
          console.log("fetchBusinessInfo: מזהה עסק שהתקבל:", res.data.business._id);
          setBusinessId(res.data.business._id);
          setCurrentBalance(res.data.business.balance || 0);
        } else {
          setErrorStats("לא נמצא מזהה עסק תקין");
        }
      } catch (error) {
        console.error("fetchBusinessInfo: שגיאה בקבלת מזהה עסק", error);
        setErrorStats("לא הצלחנו לקבל מזהה עסק");
      }
    }
    fetchBusinessInfo();
  }, []);

  // ריענון סטטיסטיקות לאחר קבלת מזהה עסק
  useEffect(() => {
    if (businessId) {
      console.log("useEffect: מזהה עסק התעדכן, מרענן סטטיסטיקות", businessId);
      refreshStats(businessId);
    }
  }, [businessId]);

  // בקשת משיכה
  const handleWithdrawRequest = async () => {
    const amount = Number(withdrawAmount);
    console.log("handleWithdrawRequest: מבקשים משיכה, סכום:", amount);
    if (isNaN(amount) || amount < 200) {
      alert('סכום מינימום למשיכה הוא 200 ש"ח');

      return;
    }
    if (amount > currentBalance) {
      alert("סכום המשיכה גבוה מהיתרה הזמינה");
      return;
    }
    try {
      const res = await API.post("/affiliate/request-withdrawal", {
        affiliateId: businessId,
        amount,
      });
      console.log("handleWithdrawRequest: תגובת השרת:", res.data);

      setWithdrawStatus(res.data.message || "בקשת המשיכה התקבלה.");
      if (res.data.withdrawalId) {
        setWithdrawalId(res.data.withdrawalId);
        console.log("handleWithdrawRequest: זיהוי משיכה (withdrawalId):", res.data.withdrawalId);
      }
      setShowReceiptForm(true);

      if (res.data.currentBalance !== undefined) {
        setCurrentBalance(res.data.currentBalance);
        console.log("handleWithdrawRequest: עדכון יתרה לאחר משיכה:", res.data.currentBalance);
      } else {
        console.log("handleWithdrawRequest: מרענן סטטיסטיקות לאחר בקשה");
        refreshStats(businessId);
      }
    } catch (error) {
      console.error("handleWithdrawRequest: שגיאה בבקשת המשיכה", error);
      alert(error.response?.data?.message || "שגיאה בבקשת המשיכה");
    }
  };

  // העלאת קבלה
  const handleReceiptUpload = async (e) => {
    e.preventDefault();
    console.log("handleReceiptUpload: מתחיל העלאת קבלה");
    if (!receiptFile) {
      alert("בחר קובץ קבלה");
      return;
    }
    try {
      const formData = new FormData();
      formData.append("receipt", receiptFile);
      formData.append("affiliateId", businessId);
      if (withdrawalId) formData.append("withdrawalId", withdrawalId);

      const res = await API.post("/affiliate/upload-receipt", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("handleReceiptUpload: תגובת השרת:", res.data);

      alert(res.data.message || "הקבלה הועלתה בהצלחה");
      setWithdrawStatus("קבלה הועלתה וממתינה לאישור.");
      setShowReceiptForm(false);
      setReceiptFile(null);
      refreshStats(businessId);
    } catch (error) {
      console.error("handleReceiptUpload: שגיאה בהעלאת הקבלה", error);
      alert(error.response?.data?.message || "שגיאה בהעלאת הקבלה");
    }
  };

  // קישור השותף
  const affiliateLink = businessId
    ? `https://esclick.co.il/register?ref=${businessId}`
    : "לא זוהה מזהה עסק";

  return (
    <div className="affiliate-page">
      <h1>תכנית השותפים</h1>
      <p>כאן תוכל לעקוב אחרי הפניות, עמלות והכנסות מתכנית השותפים שלך.</p>

      {/* קישור אישי */}
      <section className="affiliate-section">
        <h2>🎯 קישור השותף האישי שלך</h2>
        <p>העתק את הקישור ושתף אותו כדי לצרף לקוחות חדשים ולקבל עמלות:</p>
        <input
          type="text"
          value={affiliateLink}
          readOnly
          onClick={(e) => e.target.select()}
          className="affiliate-link-input"
        />
        <button
          onClick={() => {
            if (businessId) {
              navigator.clipboard.writeText(affiliateLink);
              console.log("קישור השותף הועתק:", affiliateLink);
            }
          }}
          disabled={!businessId}
        >
          📋 העתק קישור
        </button>
        {!businessId && (
          <p style={{ color: "red", marginTop: 8 }}>
            לא זוהה מזהה עסק. התחבר כדי לקבל קישור אישי.
          </p>
        )}
      </section>

      {/* טבלת סטטיסטיקות */}
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
              {allStats.map((stat, idx) => {
                const paid = stat.paidCommissions || 0;
                const unpaid = (stat.totalCommissions || 0) - paid;
                const key = stat.month || `row-${idx}`;
                return (
                  <tr key={key}>
                    <td>{stat.month || "-"}</td>
                    <td>{stat.purchases || 0}</td>
                    <td>₪{paid.toFixed(2)}</td>
                    <td>₪{unpaid.toFixed(2)}</td>
                    <td
                      className={
                        stat.paymentStatus === "paid"
                          ? "paid"
                          : stat.paymentStatus === "אין נתונים"
                          ? "no-data"
                          : "unpaid"
                      }
                    >
                      {stat.paymentStatus === "paid"
                        ? "שולם ✅"
                        : stat.paymentStatus === "אין נתונים"
                        ? "אין נתונים"
                        : "ממתין"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </section>

      {/* מדרגות עמלות ללא בונוסים */}
      <section className="affiliate-commission-rules">
        <h2>💰 מדרגות עמלות לפי תקופת חבילה</h2>
        <table>
          <thead>
            <tr>
              <th>סוג חבילה</th>
              <th>תקופת התחייבות</th>
              <th>אחוז עמלה</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>חבילה חודשית</td>
              <td>1 חודש</td>
              <td>5%</td>
            </tr>
            <tr>
              <td>חבילה רבעונית</td>
              <td>3 חודשים</td>
              <td>7%</td>
            </tr>
            <tr>
              <td>חבילה שנתית</td>
              <td>12 חודשים</td>
              <td>10%</td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* פעולות תשלום */}
      <section className="affiliate-bank-section">
        <h2>💵 פעולות תשלום</h2>
        <div>
          <p>
            יתרתך הזמינה למשיכה: <strong>₪{currentBalance.toFixed(2)}</strong>
          </p>
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
                max={currentBalance}
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                placeholder='סכום מינימום למשיכה 200 ש"ח'

              />

              <p style={{ color: "red", fontWeight: "bold", marginTop: "4px" }}>
                סכום מינימום למשיכה הוא 200 ש"ח
              </p>
              <button onClick={handleWithdrawRequest} disabled={Number(withdrawAmount) < 200}>
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
};

export default AffiliatePage;
