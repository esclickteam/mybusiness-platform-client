import React, { useState } from "react";
import "./AffiliatePage.css";
import BankDetailsForm from "./BankDetailsForm";

const AffiliatePage = () => {
  const [showBankForm, setShowBankForm] = useState(false);
  const [showReceiptForm, setShowReceiptForm] = useState(false);

  // פונקציית טיפול בהעלאת קבלה
  const handleReceiptSubmit = (e) => {
    e.preventDefault();
    // כאן תבצעי את שליחת הנתונים לשרת (למשל API call)
    alert("קבלה הועלתה בהצלחה!");
    setShowReceiptForm(false);
  };

  const affiliateId = "abcd1234"; // TODO: להחליף במזהה המשתמש המחובר
  const affiliateLink = `https://yourdomain.com/signup?ref=${affiliateId}`;

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
        <button onClick={() => navigator.clipboard.writeText(affiliateLink)}>
          📋 העתק קישור
        </button>
      </section>

      {/* סטטיסטיקות */}
      <section className="affiliate-stats">
        <h2>📊 סטטיסטיקות לחודש נוכחי</h2>
        <div className="stats-grid">
          <div className="stat-card">
            <h4>הפניות</h4>
            <p>23 משתמשים</p>
          </div>
          <div className="stat-card">
            <h4>רכישות שבוצעו</h4>
            <p>12 עסקאות</p>
          </div>
          <div className="stat-card">
            <h4>סה״כ עמלות</h4>
            <p>₪432</p>
          </div>
          <div className="stat-card">
            <h4>סטטוס תשלום</h4>
            <p className="paid">שולם ✅</p>
          </div>
        </div>
        <div className="month-selector">
          <label htmlFor="month">בחר חודש:</label>
          <select id="month">
            <option value="2025-04">אפריל 2025</option>
            <option value="2025-03">מרץ 2025</option>
            <option value="2025-02">פברואר 2025</option>
            {/* אפשר להחליף לבחירה דינמית בהמשך */}
          </select>
        </div>
      </section>

      {/* הסבר איך זה עובד */}
      <section className="affiliate-info">
        <h2>💡 איך זה עובד?</h2>
        <ol>
          <li>העתק את הקישור האישי שלך.</li>
          <li>שתף אותו עם חברים, קולגות או ברשתות החברתיות.</li>
          <li>
            כאשר בעל עסק נרשם דרך הקישור ורוכש חבילה – תקבל עמלה.
          </li>
        </ol>
        <h3>📌 חשוב לדעת:</h3>
        <ul>
          <li>
            ✅ העמלה תינתן רק עבור רכישות שבוצעו דרך הקישור שלך.
          </li>
          <li>❌ אם המשתמש רכש דרך קישור אחר – לא תינתן עמלה.</li>
          <li>
            💳 תשלומי עמלות מתבצעים אחת לחודש, לאחר אישור הרכישות.
          </li>
          <li>
            🧾 לאחר קבלת התשלום, יש להעלות קבלה דרך הטופס למטה.
          </li>
        </ul>
      </section>

      {/* מדרגות עמלות */}
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

      {/* פעולות תשלום: ניהול חשבון בנק והעלאת קבלה */}
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
      <form
        className="receipt-upload-form"
        onSubmit={handleReceiptSubmit}
      >
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