import React, { useState, useEffect } from "react";
import API from "../../api";
import "./AdminPayoutPage.css";

const AdminWithdrawalsPage = () => {
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchPendingWithdrawals() {
      setLoading(true);
      setError(null);
      try {
        const res = await API.get("/admin/withdrawals/pending");
        setWithdrawals(res.data.withdrawals || []);
      } catch (err) {
        setError("שגיאה בטעינת משיכות ממתינות");
      } finally {
        setLoading(false);
      }
    }
    fetchPendingWithdrawals();
  }, []);

  const handleApprove = async (id) => {
    try {
      await API.put(`/admin/withdrawals/${id}/approve`);
      // סינון לפי המפתח המתאים (כאן _id assumed)
      setWithdrawals(withdrawals.filter(w => w._id !== id));
      alert("המשיכה אושרה בהצלחה");
    } catch (err) {
      alert("שגיאה באישור המשיכה");
    }
  };

  return (
    <div className="admin-payout-page">
      <h1>ניהול משיכות שותפים ממתינות לאישור</h1>

      {loading && <p>טוען משיכות...</p>}
      {error && <p className="error">{error}</p>}

      {!loading && withdrawals.length === 0 && <p>אין משיכות ממתינות כרגע.</p>}

      {!loading && withdrawals.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>שם עסק</th>
              <th>סכום</th>
              <th>סטטוס</th>
              <th>פעולות</th>
            </tr>
          </thead>
          <tbody>
            {withdrawals.map((w) => (
              <tr key={w._id}>
                <td>{w.businessName}</td>
                <td>₪{w.amount.toFixed(2)}</td>
                <td>{w.status}</td>
                <td>
                  <button onClick={() => handleApprove(w._id)}>אשר משיכה</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminWithdrawalsPage;
