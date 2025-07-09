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

  // פונקציה לריענון הסטטיסטיקות והיתרה
  const refreshStats = async (affiliateId) => {
    try {
      setLoadingStats(true);
      const response = await API.get("/affiliate/stats/all", {
        params: { affiliateId },
      });
      setAllStats(response.data);

      // חישוב יתרה עדכנית לפי העמלות הכוללות
      const balance = response.data.reduce(
        (acc, stat) => acc + (stat.totalCommissions || 0),
        0
      );
      setCurrentBalance(balance);
      setErrorStats(null);
    } catch (error) {
      setErrorStats("שגיאה בטעינת הנתונים");
    } finally {
      setLoadingStats(false);
    }
  };

  useEffect(() => {
    async function fetchBusinessId() {
      try {
        const res = await API.get("/business/my");
        setBusinessId(res.data.business._id);
      } catch (error) {
        console.error("Error fetching businessId:", error);
        setErrorStats("לא הצלחנו לקבל מזהה עסק");
      }
    }
    fetchBusinessId();
  }, []);

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
      alert("סכום המשיכה גבוה מהיתרה הזמינה");
      return;
    }
    try {
      const res = await API.post("/affiliate/request-withdrawal", {
        affiliateId: businessId,
        amount: withdrawAmount,
      });
      setWithdrawStatus(res.data.message || "בקשת המשיכה התקבלה.");
      if (res.data.withdrawalId) setWithdrawalId(res.data.withdrawalId);
      setShowReceiptForm(true);

      // אם השרת מחזיר יתרה עדכנית (אפשר להוסיף את זה בשרת), נעדכן גם בצד לקוח
      if (res.data.currentBalance !== undefined) {
        setCurrentBalance(res.data.currentBalance);
      } else {
        // אחרת, נעשה ריענון נתונים מלא
        refreshStats(businessId);
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
      formData.append("affiliateId", businessId);
      if (withdrawalId) formData.append("withdrawalId", withdrawalId);

      const res = await API.post("/affiliate/upload-receipt", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert(res.data.message || "הקבלה הועלתה בהצלחה");
      setWithdrawStatus("קבלה הועלתה וממתינה לאישור.");
      setShowReceiptForm(false);
      setReceiptFile(null);

      // ריענון הסטטיסטיקות לאחר העלאת הקבלה
      refreshStats(businessId);
    } catch (error) {
      alert(error.response?.data?.message || "שגיאה בהעלאת הקבלה");
    }
  };

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
          onClick={() =>
            businessId && navigator.clipboard.writeText(affiliateLink)
          }
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

      {/* טבלה של כל החודשים */}
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
                <th>סה"כ עמלות (₪)</th>
                <th>סטטוס תשלום</th>
              </tr>
            </thead>
            <tbody>
              {allStats.map((stat) => (
                <tr key={stat._id}>
                  <td>{stat.month}</td>
                  <td>{stat.purchases}</td>
                  <td>{stat.totalCommissions.toFixed(2)}</td>
                  <td className={stat.paymentStatus === "paid" ? "paid" : "unpaid"}>
                    {stat.paymentStatus === "paid" ? "שולם ✅" : "ממתין"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {/* מדרגות עמלות לפי תקופת חבילה עם בונוסים לפי עסקאות */}
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
            <tr><td>חבילה חודשית</td><td>1 חודש</td><td>3%</td><td>10</td><td>200</td></tr>
            <tr><td>חבילה חודשית</td><td>1 חודש</td><td>3%</td><td>30</td><td>400</td></tr>
            <tr><td>חבילה חודשית</td><td>1 חודש</td><td>3%</td><td>60</td><td>1000</td></tr>
            <tr><td>חבילה חודשית</td><td>1 חודש</td><td>3%</td><td>100</td><td>2200</td></tr>
            <tr><td>חבילה רבעונית</td><td>3 חודשים</td><td>5%</td><td>10</td><td>450</td></tr>
            <tr><td>חבילה רבעונית</td><td>3 חודשים</td><td>5%</td><td>30</td><td>600</td></tr>
            <tr><td>חבילה רבעונית</td><td>3 חודשים</td><td>5%</td><td>60</td><td>1500</td></tr>
            <tr><td>חבילה רבעונית</td><td>3 חודשים</td><td>5%</td><td>100</td><td>3300</td></tr>
            <tr><td>חבילה שנתית</td><td>12 חודשים</td><td>7%</td><td>10</td><td>900</td></tr>
            <tr><td>חבילה שנתית</td><td>12 חודשים</td><td>7%</td><td>30</td><td>1200</td></tr>
            <tr><td>חבילה שנתית</td><td>12 חודשים</td><td>7%</td><td>60</td><td>3000</td></tr>
            <tr><td>חבילה שנתית</td><td>12 חודשים</td><td>7%</td><td>100</td><td>6600</td></tr>
          </tbody>
        </table>
        <p style={{ marginTop: "1rem", fontWeight: "bold", color: "#444" }}>
          ⚠️ הבונוס האקסטרה יינתן רק פעם אחת בחודש, לפי הרף הגבוה ביותר של עסקאות שהושג באותו חודש.
        </p>
      </section>

      {/* פעולות תשלום */}
      <section className="affiliate-bank-section">
        <h2>💵 פעולות תשלום</h2>
        <div>
          <p>
            יתרתך הזמינה למשיכה: ₪{currentBalance.toFixed(2)}
          </p>
          <input
            type="number"
            min="200"
            max={currentBalance || 0}
            value={withdrawAmount}
            onChange={(e) => setWithdrawAmount(Number(e.target.value))}
            placeholder={`סכום למשיכה (מינימום 200 ש"ח)`}
          />
          {/* הודעת סכום מינימום */}
          <p style={{ color: "red", fontWeight: "bold", marginTop: "4px" }}>
            סכום מינימום למשיכה הוא 200 ש"ח
          </p>
          <button onClick={handleWithdrawRequest} disabled={withdrawAmount < 200}>
            בקש משיכה
          </button>
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
