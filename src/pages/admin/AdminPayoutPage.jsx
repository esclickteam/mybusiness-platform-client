import React, { useState, useEffect } from "react";
import { CSVLink } from "react-csv";
import API from "../../api";
import "./AdminPayoutPage.css";

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
        setError("Error loading payout data");
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
      <h1>Affiliate Payout Report</h1>

      {/* 🔥 סיכום */}
      <h3>Total Paid: ${totalAmount.toFixed(2)}</h3>

      <label htmlFor="month">Filter by month:</label>
      <select
        id="month"
        value={month}
        onChange={(e) => setMonth(e.target.value)}
      >
        <option value="">All time</option> {/* 🔥 הכי חשוב */}

        {months.map((m) => (
          <option key={m} value={m}>
            {m}
          </option>
        ))}
      </select>

      {loading && <p>Loading data...</p>}
      {error && <p className="error">{error}</p>}

      {!loading && !error && (
        <>
          <table>
            <thead>
              <tr>
                <th>Business Name</th>
                <th>Email</th>
                <th>Amount</th>
                <th>Bank</th>
                <th>Branch</th>
                <th>Account</th>
                <th>ID</th>
                <th>Receipt</th>
              </tr>
            </thead>
            <tbody>
              {payouts.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: "center" }}>
                    No payout data
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
                          📎 View
                        </a>
                      ) : (
                        "No receipt"
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
              📤 Export to CSV
            </CSVLink>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminPayoutPage;