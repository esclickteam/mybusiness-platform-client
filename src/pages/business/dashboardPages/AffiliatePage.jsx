import React, { useState, useEffect } from "react";
import API from "@api"; // השתמש ב־API במקום axios
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

  useEffect(() => {
    async function fetchBusinessId() {
      try {
        const res = await API.get("/business/my");
        setBusinessId(res.data.business._id); // תיקון לפי מבנה הנתונים מהשרת
      } catch (error) {
        console.error("Error fetching businessId:", error);
        setErrorStats("לא הצלחנו לקבל מזהה עסק");
      }
    }
    fetchBusinessId();
  }, []);

  useEffect(() => {
    if (!businessId) return;

    async function fetchAffiliateStats() {
      try {
        setLoadingStats(true);
        const response = await API.get("/affiliate/stats", {
          params: { affiliateId: businessId, month: selectedMonth },
        });
        setStats(response.data);
      } catch (error) {
        setErrorStats("שגיאה בטעינת הנתונים");
      } finally {
        setLoadingStats(false);
      }
    }

    fetchAffiliateStats();
  }, [businessId, selectedMonth]);

  const affiliateLink = businessId
    ? `https://esclick.co.il/register?ref=${businessId}`  // <-- שונה מ-/signup ל-/register
    : "לא זוהה מזהה עסק";

  const handleReceiptSubmit = (e) => {
    e.preventDefault();
    alert("קבלה הועלתה בהצלחה!");
    setShowReceiptForm(false);
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
            onChange={(e) =>  setSelectedMonth(e.target.value)}
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
            {/* חבילה חודשית */}
            <tr>
              <td>חבילה חודשית</td>
              <td>1 חודש</td>
              <td>3%</td>
              <td>10</td>
              <td>200</td>
            </tr>
            <tr>
              <td>חבילה חודשית</td>
              <td>1 חודש</td>
              <td>3%</td>
              <td>30</td>
              <td>400</td>
            </tr>
            <tr>
              <td>חבילה חודשית</td>
              <td>1 חודש</td>
              <td>3%</td>
              <td>60</td>
              <td>1000</td>
            </tr>
            <tr>
              <td>חבילה חודשית</td>
              <td>1 חודש</td>
              <td>3%</td>
              <td>100</td>
              <td>2200</td>
            </tr>

            {/* חבילה רבעונית */}
            <tr>
              <td>חבילה רבעונית</td>
              <td>3 חודשים</td>
              <td>5%</td>
              <td>10</td>
              <td>450</td>
            </tr>
            <tr>
              <td>חבילה רבעונית</td>
              <td>3 חודשים</td>
              <td>5%</td>
              <td>30</td>
              <td>600</td>
            </tr>
            <tr>
              <td>חבילה רבעונית</td>
              <td>3 חודשים</td>
              <td>5%</td>
              <td>60</td>
              <td>1500</td>
            </tr>
            <tr>
              <td>חבילה רבעונית</td>
              <td>3 חודשים</td>
              <td>5%</td>
              <td>100</td>
              <td>3300</td>
            </tr>

            {/* חבילה שנתית */}
            <tr>
              <td>חבילה שנתית</td>
              <td>12 חודשים</td>
              <td>7%</td>
              <td>10</td>
              <td>900</td>
            </tr>
            <tr>
              <td>חבילה שנתית</td>
              <td>12 חודשים</td>
              <td>7%</td>
              <td>30</td>
              <td>1200</td>
            </tr>
            <tr>
              <td>חבילה שנתית</td>
              <td>12 חודשים</td>
              <td>7%</td>
              <td>60</td>
              <td>3000</td>
            </tr>
            <tr>
              <td>חבילה שנתית</td>
              <td>12 חודשים</td>
              <td>7%</td>
              <td>100</td>
              <td>6600</td>
            </tr>
          </tbody>
        </table>
        <p style={{marginTop: "1rem", fontWeight: "bold", color: "#444"}}>
          ⚠️ הבונוס האקסטרה יינתן רק פעם אחת בחודש, לפי הרף הגבוה ביותר של עסקאות שהושג באותו חודש.
        </p>
      </section>

      {/* פעולות תשלום */}
      <section className="affiliate-bank-section">
        <h2>💵 פעולות תשלום</h2>
        <div className="payment-actions">
          <div className="payment-actions-buttons">
            <button
              className="payment-button"
              onClick={() => setShowBankForm((prev) => !prev)}
            >
              ⚙️ ניהול פרטי חשבון בנק
            </button>
            <button
              className="payment-button"
              onClick={() => setShowReceiptForm((prev) => !prev)}
            >
              📎 העלאת קבלה לחודש הנוכחי
            </button>
          </div>
          {showBankForm && (
            <div className="bank-form-wrapper">
              <BankDetailsForm />
            </div>
          )}
          {showReceiptForm && (
            <form className="receipt-upload-form" onSubmit={handleReceiptSubmit}>
              <label>בחר קובץ קבלה (PDF / תמונה):</label>
              <input type="file" accept=".pdf,image/*" required />
              <button type="submit" className="payment-button">
                🚀 שלח קבלה
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
};

export default AffiliatePage;
