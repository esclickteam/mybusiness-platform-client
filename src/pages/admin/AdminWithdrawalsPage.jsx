import React, { useState, useEffect } from "react";
import API from "../../api";
import "./AdminPayoutPage.css";

const BASE_RECEIPT_URL = "https://api.esclick.co.il/";

const getReceiptUrl = (url) => {
  if (!url) return null;
  if (url.startsWith("http")) return url;
  return BASE_RECEIPT_URL + url.replace(/^\/+/, '');
};

const AdminWithdrawalsPage = () => {
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [uploadingId, setUploadingId] = useState(null); 

  useEffect(() => {
    async function fetchPendingWithdrawals() {
      setLoading(true);
      setError(null);
      try {
        const res = await API.get("/admin/withdrawals/pending");
        setWithdrawals(res.data || []);
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
      setWithdrawals(withdrawals.filter(w => w.id !== id));
      alert("המשיכה אושרה בהצלחה");
    } catch (err) {
      alert("שגיאה באישור המשיכה");
    }
  };

  // טיפול בהעלאת הקבלה
  const handleReceiptUpload = async (e, withdrawalId) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingId(withdrawalId);
    try {
      const formData = new FormData();
      formData.append("receipt", file);

      const res = await API.post(`/admin/withdrawals/${withdrawalId}/receipt`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // עדכון הרשומה במצב המקומי
      setWithdrawals(prev =>
        prev.map(w =>
          w.id === withdrawalId ? { ...w, receiptUrl: res.data.receiptUrl } : w
        )
      );

      alert("קבלה הועלתה בהצלחה");
    } catch (err) {
      alert("שגיאה בהעלאת הקבלה");
    } finally {
      setUploadingId(null);
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
              <th>טלפון</th>
              <th>סכום</th>
              <th>בנק</th>
              <th>סניף</th>
              <th>חשבון</th>
              <th>ת.ז / ח.פ</th>
              <th>קבלה</th>
              <th>סטטוס</th>
              <th>פעולות</th>
            </tr>
          </thead>
          <tbody>
            {withdrawals.map((w) => (
              <tr key={w.id}>
                <td>{w.businessName || w.name || "—"}</td>
                <td>{w.phone}</td>
                <td>₪{Number(w.amount).toFixed(2)}</td>
                <td>{w.bankName}</td>
                <td>{w.branch}</td>
                <td>{w.account}</td>
                <td>{w.idNumber}</td>
                <td>
                  {w.receiptUrl ? (
                    <a href={getReceiptUrl(w.receiptUrl)} target="_blank" rel="noreferrer">
                      📎 צפייה
                    </a>
                  ) : (
                    <>
                      <label style={{cursor: "pointer", color: "#007bff", textDecoration: "underline"}}>
                        {uploadingId === w.id ? "טוען..." : "העלה קבלה"}
                        <input
                          type="file"
                          accept="image/*,.pdf"
                          style={{ display: "none" }}
                          onChange={(e) => handleReceiptUpload(e, w.id)}
                          disabled={uploadingId === w.id}
                        />
                      </label>
                    </>
                  )}
                </td>
                <td>{w.status || "ממתין"}</td>
                <td>
                  <button onClick={() => handleApprove(w.id)}>אשר משיכה</button>
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
