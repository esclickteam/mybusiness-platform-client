import React, { useState, useEffect } from "react";
import { CSVLink } from "react-csv";
import API from "../api"; // ייבוא API מותאם לפרויקט שלך
import "./AdminPayoutPage.css";

const AdminPayoutPage = () => {
  const [month, setMonth] = useState("2025-04");
  const [payouts, setPayouts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const headers = [
    { label: "שם העסק", key: "businessName" },
    { label: "טלפון", key: "phone" },
    { label: "סכום עמלות", key: "amount" },
    { label: "בנק", key: "bankName" },
    { label: "סניף", key: "branch" },
    { label: "מס' חשבון", key: "account" },
    { label: "ת.ז / ח.פ", key: "idNumber" },
    { label: "קובץ קבלה", key: "receiptUrl" },
  ];

  useEffect(() => {
    async function fetchPayouts() {
      setLoading(true);
      setError(null);
      try {
        // קריאה ל-API לקבלת נתוני תשלומים לפי החודש הנבחר
        const res = await API.get("/affiliate/admin/payouts", {
          params: { month },
        });
        setPayouts(res.data.payouts || []);
      } catch (err) {
        console.error("Error fetching payouts:", err);
        setError("שגיאה בטעינת נתוני תשלומים");
      } finally {
        setLoading(false);
      }
    }

    fetchPayouts();
  }, [month]);

  return (
    <div className="admin-payout-page">
      <h1>דו"ח תשלומים לשותפים</h1>

      <label htmlFor="month">בחר חודש:</label>
      <select id="month" value={month} onChange={(e) => setMonth(e.target.value)}>
        <option value="2025-04">אפריל 2025</option>
        <option value="2025-03">מרץ 2025</option>
        <option value="2025-02">פברואר 2025</option>
      </select>

      {loading && <p>טוען נתונים...</p>}
      {error && <p className="error">{error}</p>}

      {!loading && !error && (
        <>
          <table>
            <thead>
              <tr>
                <th>שם עסק</th>
                <th>טלפון</th>
                <th>סכום</th>
                <th>בנק</th>
                <th>סניף</th>
                <th>חשבון</th>
                <th>ת.ז</th>
                <th>קבלה</th>
              </tr>
            </thead>
            <tbody>
              {payouts.length === 0 && (
                <tr>
                  <td colSpan="8" style={{ textAlign: "center" }}>
                    אין נתוני תשלומים לחודש זה
                  </td>
                </tr>
              )}
              {payouts.map((partner, idx) => (
                <tr key={idx}>
                  <td>{partner.businessName}</td>
                  <td>{partner.phone}</td>
                  <td>₪{partner.amount}</td>
                  <td>{partner.bankName}</td>
                  <td>{partner.branch}</td>
                  <td>{partner.account}</td>
                  <td>{partner.idNumber}</td>
                  <td>
                    {partner.receiptUrl ? (
                      <a href={partner.receiptUrl} target="_blank" rel="noreferrer">
                        📎 צפייה
                      </a>
                    ) : (
                      "אין קבלה"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="export-button">
            <CSVLink data={payouts} headers={headers} filename={`payouts-${month}.csv`}>
              📤 ייצוא ל-CSV
            </CSVLink>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminPayoutPage;
