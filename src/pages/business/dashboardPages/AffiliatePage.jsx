import React, { useState, useEffect } from "react";
import API from "@api";
import "./AffiliatePage.css";
import BankDetailsForm from "./BankDetailsForm";

const AffiliatePage = () => {
  const [showBankForm, setShowBankForm] = useState(false);
  const [showReceiptForm, setShowReceiptForm] = useState(false);
  const [stats, setStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);
  const [errorStats, setErrorStats] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState("2025-04");
  const [businessId, setBusinessId] = useState(null);
  const [packageDuration, setPackageDuration] = useState("3 חודשים"); // ניתן לשנות בהתאם

  // מצב למשיכת כספים
  const [withdrawAmount, setWithdrawAmount] = useState(0);
  const [withdrawStatus, setWithdrawStatus] = useState(null); // הודעות למשתמש
  const [receiptFile, setReceiptFile] = useState(null);
  const [withdrawalId, setWithdrawalId] = useState(null); // מזהה משיכה שנוצרה בשרת

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

  // פונקציה לעדכון סטטוס תשלום (mark-paid)
  const updatePaymentStatus = async (affiliateId, month, packageDur) => {
    try {
      const res = await API.post("/affiliate/mark-paid", {
        affiliateId,
        month,
        packageDuration: packageDur,
      });
      return res.data;
    } catch (err) {
      console.error("Error updating payment status:", err);
      return null;
    }
  };

  useEffect(() => {
    if (!businessId) return;

    async function fetchAndUpdateStats() {
      try {
        setLoadingStats(true);
        // קודם מביאים את הנתונים הקיימים
        const response = await API.get("/affiliate/stats", {
          params: { affiliateId: businessId, month: selectedMonth },
        });

        // אם הסטטוס עדיין לא שולם, מבצעים עדכון סטטוס תשלום
        if (response.data.paymentStatus !== "paid") {
          const updateResult = await updatePaymentStatus(
            businessId,
            selectedMonth,
            packageDuration
          );
          if (updateResult && updateResult.stat) {
            setStats(updateResult.stat);
          } else {
            setStats(response.data);
          }
        } else {
          setStats(response.data);
        }
        setErrorStats(null);
      } catch (error) {
        setErrorStats("שגיאה בטעינת הנתונים");
      } finally {
        setLoadingStats(false);
      }
    }

    fetchAndUpdateStats();
  }, [businessId, selectedMonth, packageDuration]);

  const affiliateLink = businessId
    ? `https://esclick.co.il/register?ref=${businessId}`
    : "לא זוהה מזהה עסק";

  // בקשת משיכה
  const handleWithdrawRequest = async () => {
    if (withdrawAmount < 200) {
      alert('סכום מינימום למשיכה הוא 200 ש"ח');
      return;
    }
    if (withdrawAmount > (stats?.totalCommissions || 0)) {
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
      setLoadingStats(true);
      const response = await API.get("/affiliate/stats", {
        params: { affiliateId: businessId, month: selectedMonth },
      });
      setStats(response.data);
      setLoadingStats(false);
    } catch (error) {
      alert(error.response?.data?.message || "שגיאה בהעלאת הקבלה");
    }
  };

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

      {/* סטטיסטיקות */}
      <section className="affiliate-stats">
        <h2>📊 סטטיסטיקות לחודש נוכחי</h2>
        {loadingStats && <p>טוען נתונים...</p>}
        {errorStats && <p className="error">{errorStats}</p>}
        {stats && (
          <div className="stats-grid">
            <div className="stat-card">
              <h4>הפניות</h4>
              <p>{stats.referrals} משתמשים</p>
            </div>
            <div className="stat-card">
              <h4>רכישות שבוצעו</h4>
              <p>{stats.purchases} עסקאות</p>
            </div>
            <div className="stat-card">
              <h4>סה״כ עמלות</h4>
              <p>₪{stats.totalCommissions}</p>
            </div>
            <div className="stat-card">
              <h4>סטטוס תשלום</h4>
              <p className={stats.paymentStatus === "paid" ? "paid" : "unpaid"}>
                {stats.paymentStatus === "paid" ? "שולם ✅" : "ממתין"}
              </p>
            </div>
          </div>
        )}

        <div className="month-selector">
          <label htmlFor="month">בחר חודש:</label>
          <select
            id="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          >
            <option value="2025-04">אפריל 2025</option>
            <option value="2025-03">מרץ 2025</option>
            <option value="2025-02">פברואר 2025</option>
          </select>
        </div>
      </section>

      {/* הסבר איך זה עובד */}
      <section className="affiliate-info">
        <h2>💡 איך זה עובד?</h2>
        <ol>
          <li>העתק את הקישור האישי שלך.</li>
          <li>שתף אותו עם חברים, קולגות או ברשתות החברתיות.</li>
          <li>כאשר בעל עסק נרשם דרך הקישור ורוכש חבילה – תקבל עמלה.</li>
        </ol>
        <h3>📌 חשוב לדעת:</h3>
        <ul>
          <li>✅ העמלה תינתן רק עבור רכישות שבוצעו דרך הקישור האישי שלך.</li>
          <li>⏳ העמלה תינתן רק בתנאי שהרוכש לא ביטל את העסקה בתוך 14 ימים.</li>
          <li>❌ אם המשתמש רכש דרך קישור אחר או ביטל את העסקה בתוך 14 ימים – לא תינתן עמלה.</li>
          <li>💳 תשלומי עמלות מתבצעים אחת לחודש, לאחר אישור הרכישות.</li>
          <li>🧾 לאחר קבלת התשלום, יש להעלות קבלה דרך הטופס למטה.</li>
        </ul>
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
          <p>יתרתך הזמינה למשיכה: ₪{stats?.totalCommissions ?? 0}</p>
          <input
            type="number"
            min="200"
            max={stats?.totalCommissions ?? 0}
            value={withdrawAmount}
            onChange={(e) => setWithdrawAmount(Number(e.target.value))}
            placeholder={`סכום למשיכה (מינימום 200 ש"ח)`}
          />
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
