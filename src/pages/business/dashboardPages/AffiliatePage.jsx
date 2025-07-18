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
  const [withdrawAmount, setWithdrawAmount] = useState(0);
  const [withdrawStatus, setWithdrawStatus] = useState(null);
  const [receiptFile, setReceiptFile] = useState(null);
  const [withdrawalId, setWithdrawalId] = useState(null);

  // מצב ליתרת המשיכה המעודכנת
  const [currentBalance, setCurrentBalance] = useState(0);

  // סכום כולל עמלות לתשלום (כל הסטטוסים לא שולם)
  const totalUnpaidCommissions = allStats
    .filter((stat) => stat.paymentStatus !== "paid")
    .reduce(
      (sum, stat) => sum + (stat.totalCommissions - (stat.paidCommissions || 0)),
      0
    );

  // פונקציה לריענון הסטטיסטיקות והיתרה
  const refreshStats = async (affiliateId) => {
      console.log("Using affiliateId for stats:", affiliateId); // <-- כאן

    try {
      setLoadingStats(true);

      // 1. קבלת הסטטיסטיקות
      const statsRes = await API.get("/affiliate/stats/all", {
        params: { affiliateId },
      });

      console.log("affiliate stats response:", statsRes.data); // לוג נתונים

      setAllStats(statsRes.data);

      // 2. חישוב balance מתוך הסטטיסטיקות שהרגע קיבלנו
      const unpaid = statsRes.data
        .filter((s) => s.paymentStatus !== "paid")
        .reduce(
          (sum, s) => sum + (s.totalCommissions - (s.paidCommissions || 0)),
          0
        );

      console.log("calculated unpaid balance:", unpaid); // לוג חישוב יתרה

      setCurrentBalance(unpaid);

      setErrorStats(null);
    } catch (error) {
      console.error("Error refreshing stats:", error); // לוג שגיאה
      setErrorStats("שגיאה בטעינת הנתונים");
    } finally {
      setLoadingStats(false);
    }
  };

  // ניסיון ראשון לקבלת מזהה העסק בלבד
  useEffect(() => {
    async function fetchBusinessId() {
      try {
        const res = await API.get("/business/my");
        console.log("business info response:", res.data); // לוג מזהה עסק
        setBusinessId(res.data.business._id);
      } catch (error) {
        console.error("Error fetching businessId:", error);
        setErrorStats("לא הצלחנו לקבל מזהה עסק");
      }
    }
    fetchBusinessId();
  }, []);

  // ריענון לסטטיסטיקות וליתרה ברגע שיש businessId
  useEffect(() => {
    if (!businessId) return;
    refreshStats(businessId);
  }, [businessId]);

  // בקשת משיכה
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
      const res = await API.post("/affiliate/request-withdrawal", {
        affiliateId: businessId,
        amount: withdrawAmount,
      });

      console.log("withdraw request response:", res.data); // לוג תגובת בקשה

      setWithdrawStatus(res.data.message || "בקשת המשיכה התקבלה.");
      if (res.data.withdrawalId) setWithdrawalId(res.data.withdrawalId);
      setShowReceiptForm(true);

      // עדכון ביתרת הלקוח בהתאם לתשובת השרת
      if (res.data.currentBalance !== undefined) {
        setCurrentBalance(res.data.currentBalance);
      } else {
        // fallback: ריענון מלא
        refreshStats(businessId);
      }
    } catch (error) {
      console.error("Withdraw request error:", error); // לוג שגיאה
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
      formData.append("affiliateId", businessId);
      if (withdrawalId) formData.append("withdrawalId", withdrawalId);

      const res = await API.post("/affiliate/upload-receipt", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("receipt upload response:", res.data); // לוג תגובה

      alert(res.data.message || "הקבלה הועלתה בהצלחה");
      setWithdrawStatus("קבלה הועלתה וממתינה לאישור.");
      setShowReceiptForm(false);
      setReceiptFile(null);

      // ריענון הסטטיסטיקות (לרבות balance)
      refreshStats(businessId);
    } catch (error) {
      console.error("Receipt upload error:", error); // לוג שגיאה
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
        <p>העתיקו את הקישור ושתפו אותו כדי לצרף לקוחות חדשים ולקבל עמלות:</p>
        <input
          type="text"
          value={affiliateLink}
          readOnly
          onClick={(e) => e.target.select()}
          className="affiliate-link-input"
        />
        <button
          onClick={() => businessId && navigator.clipboard.writeText(affiliateLink)}
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
          <p>
            סך כל העמלות להשלמה:{" "}
            <strong>₪{totalUnpaidCommissions.toFixed(2)}</strong>
          </p>
          {totalUnpaidCommissions > currentBalance && (
            <p style={{ color: "orange", fontWeight: "bold" }}>
              שימו לב: סך העמלות גבוה מיתרת המשיכה הזמינה.
            </p>
          )}

          {currentBalance < 200 ? (
            <p style={{ color: "red", fontWeight: "bold" }}>
              סכום מינימום למשיכה הוא 200 ש"ח. אנא המתן שיצטבר סכום מינימלי
              למשיכה.
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
            <button type="submit">🚀  העלאת קבלה</button>
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
