import React, { useState, useEffect } from "react";
import { CSVLink } from "react-csv";
import API from "../../api";
import "./AdminPayoutPage.css";

const AdminPayoutPage = () => {
  const [months, setMonths] = useState([]);
  const [month, setMonth] = useState("");
  const [payouts, setPayouts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const headers = [
    { label: "Business Name", key: "businessName" },
    { label: "Phone", key: "phone" },
    { label: "Commission Amount", key: "amount" },
    { label: "Bank", key: "bankName" },
    { label: "Branch", key: "branch" },
    { label: "Account Number", key: "account" },
    { label: "ID Number", key: "idNumber" },
    { label: "Receipt File", key: "receiptUrl" },
  ];

  useEffect(() => {
    async function fetchMonths() {
      try {
        const res = await API.get("/admin/payout-months");
        const monthsList = res.data.months || [];
        setMonths(monthsList);

        if (monthsList.length > 0) {
          setMonth((currentMonth) => {
            if (!currentMonth || !monthsList.includes(currentMonth)) {
              return monthsList[0];
            }
            return currentMonth;
          });
        }
      } catch (err) {
        console.error("Error fetching months:", err);
        setError("Error loading the list of months");
      }
    }
    fetchMonths();
  }, []);

  useEffect(() => {
    if (!month) return;

    async function fetchPayouts() {
      setLoading(true);
      setError(null);
      try {
        const res = await API.get("/admin/payouts", {
          params: { month },
        });
        setPayouts(res.data.payouts || []);
      } catch (err) {
        console.error("Error fetching payouts:", err);
        setError("Error loading payment data");
      } finally {
        setLoading(false);
      }
    }

    fetchPayouts();
  }, [month]);

  return (
    <div className="admin-payout-page">
      <h1>Partner Payment Report</h1>

      <label htmlFor="month">Select Month:</label>
      <select
        id="month"
        value={month}
        onChange={(e) => {
          setMonth(e.target.value);
        }}
        disabled={months.length === 0}
      >
        {months.length === 0 && <option>Loading months...</option>}
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
                <th>Phone</th>
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
                    No payment data for this month
                  </td>
                </tr>
              ) : (
                payouts.map((partner, idx) => (
                  <tr key={idx}>
                    <td>{partner.businessName}</td>
                    <td>{partner.phone}</td>
                    <td>${partner.amount.toFixed(2)}</td>
                    <td>{partner.bankName}</td>
                    <td>{partner.branch}</td>
                    <td>{partner.account}</td>
                    <td>{partner.idNumber}</td>
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
            <CSVLink data={payouts} headers={headers} filename={`payouts-${month}.csv`}>
              📤 Export to CSV
            </CSVLink>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminPayoutPage;
