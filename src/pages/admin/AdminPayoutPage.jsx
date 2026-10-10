import React, { useState, useEffect } from "react";
import { CSVLink } from "react-csv";
import API from "../../api";
import "./AdminPayoutPage.css";
import AdminPageHeader from "./shell/AdminPageHeader";
import BizuplyLoader from "../../components/ui/BizuplyLoader";

const AdminPayoutPage = () => {
  const [months, setMonths] = useState([]);
  const [month, setMonth] = useState(""); // "" = All time
  const [payouts, setPayouts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const headers = [
    { label: "Business Name", key: "businessName" },
    { label: "Email", key: "email" },
    { label: "Commission Amount", key: "amount" },
    { label: "Bank", key: "bankName" },
    { label: "Branch", key: "branch" },
    { label: "Account Number", key: "account" },
    { label: "ID / Company No.", key: "idNumber" },
    { label: "Receipt File", key: "receiptUrl" },
  ];

  // 🔥 load months (לא חובה למערכת לעבוד)
  useEffect(() => {
    async function fetchMonths() {
      try {
        const res = await API.get("/admin/payout-months");
        const monthsList = res.data.months || [];
        setMonths(monthsList);
      } catch (err) {
        console.error("Error fetching months:", err);
        // לא חוסמים את המערכת!
      }
    }
    fetchMonths();
  }, []);

  // 🔥 fetch payouts (עובד גם בלי חודש)
  useEffect(() => {
    async function fetchPayouts() {
      setLoading(true);
      setError(null);

      try {
        const res = await API.get("/admin/payouts", {
          params: month ? { month } : {}, // 🔥 רק אם יש חודש
        });

        setPayouts(res.data.payouts || []);
      } catch (err) {
        console.error("Error fetching payouts:", err);
        setError("לא ניתן לטעון את נתוני התשלום");
      } finally {
        setLoading(false);
      }
    }

    fetchPayouts();
  }, [month]);

  // 🔥 סכום כולל
  const totalAmount = payouts.reduce((sum, p) => sum + (p.amount || 0), 0);

  return (
    <div className="admin-payout-page">
      <AdminPageHeader
        title="תשלומי שותפים"
        description="סיכום עמלות לפי חודש וייצוא לקובץ."
      />

      {/* 🔥 סיכום */}
      <h3>סה״כ שולם: ${totalAmount.toFixed(2)}</h3>

      <label htmlFor="month">סינון לפי חודש</label>
      <select
        id="month"
        value={month}
        onChange={(e) => setMonth(e.target.value)}
      >
        <option value="">כל התקופה</option>

        {months.map((m) => (
          <option key={m} value={m}>
            {m}
          </option>
        ))}
      </select>

      {loading && <BizuplyLoader size="lg" label="טוען נתונים" />}
      {error && <p className="error">{error}</p>}

      {!loading && !error && (
        <>
          <table>
            <thead>
              <tr>
                <th>עסק</th>
                <th>אימייל</th>
                <th>סכום</th>
                <th>בנק</th>
                <th>סניף</th>
                <th>חשבון</th>
                <th>מזהה</th>
                <th>קבלה</th>
              </tr>
            </thead>
            <tbody>
              {payouts.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: "center" }}>
                    אין נתוני תשלום
                  </td>
                </tr>
              ) : (
                payouts.map((partner, idx) => (
                  <tr key={idx}>
                    <td>{partner.businessName || "—"}</td>
                    <td>{partner.email || "—"}</td>
                    <td>${Number(partner.amount || 0).toFixed(2)}</td>
                    <td>{partner.bankName || "—"}</td>
                    <td>{partner.branch || "—"}</td>
                    <td>{partner.account || "—"}</td>
                    <td>{partner.idNumber || "—"}</td>
                    <td>
                      {partner.receiptUrl ? (
                        <a href={partner.receiptUrl} target="_blank" rel="noreferrer">
                          צפייה
                        </a>
                      ) : (
                        "אין קבלה"
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          <div className="export-button">
            <CSVLink
              data={payouts}
              headers={headers}
              filename={`payouts-${month || "all"}.csv`} // 🔥 תיקון
            >
              ייצוא CSV
            </CSVLink>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminPayoutPage;