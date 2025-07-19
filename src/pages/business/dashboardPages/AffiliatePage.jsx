import React, { useState, useEffect } from "react";
import API from "@api";
import "./AffiliatePage.css";
import BankDetailsForm from "./BankDetailsForm";

/**
 * AffiliatePage – גרסה מעודכנת
 * --------------------------------------------------------
 * - משתמש במזהה נכון (affiliateId) לבקשות API.
 * - אם המשתמש הוא לקוח שהופנה, נשתמש במזהה העסק-המשווק (marketerBusiness._id).
 * - otherwise משתמש במזהה העסק שלו עצמו.
 */
const AffiliatePage = () => {
  /*------------------------------------------------------------------*/
  /*  🗄️‎ States                                                        */
  /*------------------------------------------------------------------*/
  const [affiliateId, setAffiliateId] = useState(null);   // מזהה שיישלח ל-API
  const [businessId, setBusinessId]   = useState(null);   // לצורך קישור ref=
  const [marketerBusiness, setMarketerBusiness] = useState(null);

  const [showBankForm,    setShowBankForm]    = useState(false);
  const [showReceiptForm, setShowReceiptForm] = useState(false);

  const [allStats,     setAllStats]     = useState([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const [errorStats,   setErrorStats]   = useState(null);

  // 🔄 משיכה
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawStatus, setWithdrawStatus] = useState(null);
  const [receiptFile,    setReceiptFile]    = useState(null);
  const [withdrawalId,   setWithdrawalId]   = useState(null);

  // 💰 יתרה
  const [currentBalance, setCurrentBalance] = useState(0);

  /*------------------------------------------------------------------*/
  /*  🔢 חישובי עזר                                                    */
  /*------------------------------------------------------------------*/
  const totalUnpaidCommissions = allStats
    .filter((s) => s.paymentStatus !== "paid")
    .reduce(
      (sum, s) => sum + ((s.totalCommissions || 0) - (s.paidCommissions || 0)),
      0
    );

  /*------------------------------------------------------------------*/
  /*  📡  טעינת נתונים מהשרת                                           */
  /*------------------------------------------------------------------*/
  const refreshStats = async (id) => {
    try {
      setLoadingStats(true);
      const { data } = await API.get("/affiliate/stats/all", { params: { affiliateId: id } });
      setAllStats(data.stats || []);
      setCurrentBalance(data.currentBalance || 0);
      setErrorStats(null);
    } catch {
      setErrorStats("שגיאה בטעינת הנתונים");
    } finally {
      setLoadingStats(false);
    }
  };

  // ➊ קבלת פרטי עסק + משווק
  useEffect(() => {
    (async () => {
      try {
        const { data } = await API.get("/business/my");
        const business  = data.business;
        const marketer  = data.marketerBusiness; // null אם המשתמש הוא המשווק בעצמו

        if (!business?._id) throw new Error();

        setBusinessId(business._id); // ref=
        setAffiliateId(marketer?._id || business._id); // מזהה שיישלח ל-API
        setCurrentBalance(business.balance || 0);
        setMarketerBusiness(marketer || null);
      } catch {
        setErrorStats("לא הצלחנו לקבל פרטי עסק");
      }
    })();
  }, []);

  // ➋ טעינת סטטיסטיקות כאשר affiliateId מוכן
  useEffect(() => {
    if (affiliateId) refreshStats(affiliateId);
  }, [affiliateId]);

  /*------------------------------------------------------------------*/
  /*  💸 בקשת משיכה                                                    */
  /*------------------------------------------------------------------*/
  const handleWithdrawRequest = async () => {
    const amount = Number(withdrawAmount);
    if (isNaN(amount) || amount < 200) return alert("סכום מינימום למשיכה הוא 200 ש\"ח");
    if (amount > currentBalance)       return alert("סכום המשיכה גבוה מהיתרה הזמינה");

    try {
      const { data } = await API.post("/affiliate/request-withdrawal", {
        affiliateId,
        amount,
      });

      setWithdrawStatus(data.message || "בקשת המשיכה התקבלה.");
      setWithdrawalId(data.withdrawalId || null);
      setShowReceiptForm(true);

      if (data.currentBalance !== undefined) setCurrentBalance(data.currentBalance);
      else refreshStats(affiliateId);
    } catch (err) {
      alert(err.response?.data?.message || "שגיאה בבקשת המשיכה");
    }
  };

  /*------------------------------------------------------------------*/
  /*  📤 העלאת קבלה                                                    */
  /*------------------------------------------------------------------*/
  const handleReceiptUpload = async (e) => {
    e.preventDefault();
    if (!receiptFile) return alert("בחר קובץ קבלה");

    try {
      const fd = new FormData();
      fd.append("receipt", receiptFile);
      fd.append("affiliateId", affiliateId);
      if (withdrawalId) fd.append("withdrawalId", withdrawalId);

      const { data } = await API.post("/affiliate/upload-receipt", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert(data.message || "הקבלה הועלתה בהצלחה");
      setWithdrawStatus("קבלה הועלתה וממתינה לאישור.");
      setShowReceiptForm(false);
      setReceiptFile(null);
      refreshStats(affiliateId);
    } catch (err) {
      alert(err.response?.data?.message || "שגיאה בהעלאת הקבלה");
    }
  };

  /*------------------------------------------------------------------*/
  /*  🔗 קישור השותף                                                   */
  /*------------------------------------------------------------------*/
  const affiliateLink = businessId
    ? `https://esclick.co.il/register?ref=${businessId}`
    : "לא זוהה מזהה עסק";

  /*------------------------------------------------------------------*/
  /*  🖼️‎ UI                                                           */
  /*------------------------------------------------------------------*/
  return (
    <div className="affiliate-page">
      <h1>תכנית השותפים</h1>
      <p>כאן תוכל לעקוב אחרי הפניות, עמלות והכנסות מתכנית השותפים שלך.</p>

      {/* 🔗 קישור אישי */}
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
          onClick={() => businessId && navigator.clipboard.writeText(affiliateLink)}
          disabled={!businessId}
        >📋 העתק קישור</button>
        {!businessId && <p style={{ color: "red", marginTop: 8 }}>לא זוהה מזהה עסק.</p>}
      </section>

      {/* 🏷️‎ פרטי משווק */}
      {marketerBusiness && (
        <section className="marketer-business">
          <h2>עסק משווק:</h2>
          <p>שם העסק המשווק: <strong>{marketerBusiness.businessName}</strong></p>
        </section>
      )}

      {/* 📊 טבלת סטטיסטיקות */}
      <section className="affiliate-stats">
        <h2>📊 סטטיסטיקות לכל החודשים</h2>
        {loadingStats && <p>טוען נתונים...</p>}
        {errorStats && <p className="error">{errorStats}</p>}
        {!loadingStats && allStats.length === 0 && <p>לא נמצאו נתונים להצגה.</p>}
        {allStats.length > 0 && (
          <table className="stats-table">
            <thead>
              <tr>
                <th>חודש</th><th>מספר רכישות</th><th>שולם (₪)</th><th>לא שולם (₪)</th><th>סטטוס תשלום</th>
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
                    <td className={
                      s.paymentStatus === "paid"       ? "paid"    :
                      s.paymentStatus === "אין נתונים" ? "no-data" : "unpaid"
                    }>
                      {s.paymentStatus === "paid" ? "שולם ✅" : s.paymentStatus === "אין נתונים" ? "אין נתונים" : "ממתין"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </section>

      {/* 💰 מדרגות עמלות */}
      <section className="affiliate-commission-rules">
        <h2>💰 מדרגות עמלות לפי תקופת חבילה</h2>
        <table>
          <thead>
            <tr><th>סוג חבילה</th><th>תקופת התחייבות</th><th>אחוז עמלה</th></tr>
          </thead>
          <tbody>
            <tr><td>חבילה חודשית</td><td>1 חודש</td><td>5%</td></tr>
            <tr><td>חבילה רבעונית</td><td>3 חודשים</td><td>7%</td></tr>
            <tr><td>חבילה שנתית</td><td>12 חודשים</td><td>10%</td></tr>
          </tbody>
        </table>
      </section>

      {/* 💵 פעולות תשלום */}
      <section className="affiliate-bank-section">
        <h2>💵 פעולות תשלום</h2>
        <div>
          <p>יתרתך הזמינה למשיכה: <strong>₪{currentBalance.toFixed(2)}</strong></p>
          {totalUnpaidCommissions > currentBalance && (
            <p style={{ color: "orange", fontWeight: "bold" }}>שימו לב: סכום העמלות גבוה מיתרת המשיכה.</p>
          )}

          {currentBalance < 200 ? (
            <p style={{ color: "red", fontWeight: "bold" }}>סכום מינימום למשיכה הוא 200 ש"ח.</p>
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
            <input type="file" accept=".pdf,image/*" onChange={(e) => setReceiptFile(e.target.files[0])} required />
            <button type="submit">🚀 העלאת קבלה</button>
          </form>
        )}

        <button className="payment-button" onClick={() => setShowBankForm((prev) => !prev)}>
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
