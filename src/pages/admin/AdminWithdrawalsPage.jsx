import React, { useState, useEffect } from "react";
import API from "../../api";
import "./AdminPayoutPage.css";

const AdminWithdrawalsPage = () => {
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [uploadingId, setUploadingId] = useState(null);
  const [viewingReceiptUrl, setViewingReceiptUrl] = useState(null);

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

  const isPdf = (url) => {
    return url?.toLowerCase().endsWith(".pdf") || url?.includes("/raw/");
  };

  return (
    <div className="admin-payout-page">
      <h1>ניהול משיכות שותפים ממתינות לאישור</h1>

      {loading && <p>טוען משיכות...</p>}
      {error && <p className="error">{error}</p>}

      {!loading && withdrawals.length === 0 && <p>אין משיכות ממתינות כרגע.</p>}

      {!loading && withdrawals.length > 0 && (
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
                      isPdf(w.receiptUrl) ? (
                        <button
                          style={{ cursor: "pointer", color: "#007bff", textDecoration: "underline", background: "none", border: "none", padding: 0 }}
                          onClick={() => setViewingReceiptUrl(w.receiptUrl)}
                        >
                          📎 צפייה (PDF)
                        </button>
                      ) : (
                        <a href={w.receiptUrl} target="_blank" rel="noreferrer">
                          📎 צפייה
                        </a>
                      )
                    ) : (
                      <label
                        style={{
                          cursor: "pointer",
                          color: "#007bff",
                          textDecoration: "underline"
                        }}
                      >
                        {uploadingId === w.id ? "טוען..." : "העלה קבלה"}
                        <input
                          type="file"
                          accept="image/*,.pdf"
                          style={{ display: "none" }}
                          onChange={(e) => handleReceiptUpload(e, w.id)}
                          disabled={uploadingId === w.id}
                        />
                      </label>
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

          {viewingReceiptUrl && (
            <div
              className="modal-overlay"
              onClick={() => setViewingReceiptUrl(null)}
              style={{
                position: "fixed",
                top: 0, left: 0, right: 0, bottom: 0,
                backgroundColor: "rgba(0,0,0,0.7)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 1000,
              }}
            >
              <div
                onClick={e => e.stopPropagation()}
                style={{
                  backgroundColor: "#fff",
                  padding: 10,
                  maxWidth: "90vw",
                  maxHeight: "90vh",
                  width: 800,
                  height: "90vh",
                  boxShadow: "0 0 10px #000",
                  position: "relative",
                }}
              >
                <button
                  onClick={() => setViewingReceiptUrl(null)}
                  style={{
                    position: "absolute",
                    top: 10,
                    right: 10,
                    background: "red",
                    color: "white",
                    border: "none",
                    borderRadius: 3,
                    padding: "5px 10px",
                    cursor: "pointer",
                    fontSize: 16,
                  }}
                >
                  סגור
                </button>
                <iframe
                  src={viewingReceiptUrl}
                  title="קבלה"
                  width="100%"
                  height="100%"
                  frameBorder="0"
                />
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AdminWithdrawalsPage;
