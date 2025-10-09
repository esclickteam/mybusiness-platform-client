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
        setError("Error loading pending withdrawals");
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
      alert("Withdrawal approved successfully");
    } catch (err) {
      alert("Error approving withdrawal");
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

      alert("Receipt uploaded successfully");
    } catch (err) {
      alert("Error uploading receipt");
    } finally {
      setUploadingId(null);
    }
  };

  const isPdf = (url) => {
    return url?.toLowerCase().endsWith(".pdf") || url?.includes("/raw/");
  };

  return (
    <div className="admin-payout-page">
      <h1>Manage Pending Affiliate Withdrawals</h1>

      {loading && <p>Loading withdrawals...</p>}
      {error && <p className="error">{error}</p>}

      {!loading && withdrawals.length === 0 && <p>No pending withdrawals at the moment.</p>}

      {!loading && withdrawals.length > 0 && (
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
                <th>ID / Company No.</th>
                <th>Receipt</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {withdrawals.map((w) => (
                <tr key={w.id}>
                  <td>{w.businessName || w.name || "—"}</td>
                  <td>{w.phone}</td>
                  <td>${Number(w.amount).toFixed(2)}</td>
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
                          📎 View (PDF)
                        </button>
                      ) : (
                        <a href={w.receiptUrl} target="_blank" rel="noreferrer">
                          📎 View
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
                        {uploadingId === w.id ? "Uploading..." : "Upload Receipt"}
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
                  <td>{w.status || "Pending"}</td>
                  <td>
                    <button onClick={() => handleApprove(w.id)}>Approve Withdrawal</button>
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
                  Close
                </button>
                <iframe
                  src={viewingReceiptUrl}
                  title="Receipt"
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
