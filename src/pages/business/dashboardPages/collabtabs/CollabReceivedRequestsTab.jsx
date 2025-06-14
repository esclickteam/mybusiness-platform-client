import React, { useEffect, useState } from "react";
import API from "../../../../api";

export default function CollabReceivedRequestsTab({ isDevUser, refreshFlag, onStatusChange }) {
  const [receivedRequests, setReceivedRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    async function fetchReceivedRequests() {
      try {
        const res = await API.get("/business/my/proposals/received");
        setReceivedRequests(res.data.proposalsReceived || []);
        setError(null);
      } catch (err) {
        console.error(err);
        setError("שגיאה בטעינת הצעות שהתקבלו");
      } finally {
        setLoading(false);
      }
    }
    if (!isDevUser) {
      fetchReceivedRequests();
    } else {
      // אם אתה רוצה, אפשר להוסיף כאן דמו, כרגע משאירים ריק
      setReceivedRequests([]);
      setLoading(false);
    }
  }, [isDevUser, refreshFlag]);

  const handleAccept = async (proposalId) => {
    try {
      await API.put(`/business/my/proposals/${proposalId}/status`, { status: "accepted" });
      setReceivedRequests(prev =>
        prev.map(p =>
          (p.proposalId === proposalId || p._id === proposalId)
            ? { ...p, status: "accepted" }
            : p
        )
      );
      alert("ההצעה אושרה בהצלחה");
      onStatusChange?.();
    } catch (err) {
      console.error(err);
      alert("שגיאה באישור ההצעה");
    }
  };

  const handleReject = async (proposalId) => {
    try {
      await API.put(`/business/my/proposals/${proposalId}/status`, { status: "rejected" });
      setReceivedRequests(prev =>
        prev.map(p =>
          (p.proposalId === proposalId || p._id === proposalId)
            ? { ...p, status: "rejected" }
            : p
        )
      );
      alert("ההצעה נדחתה בהצלחה");
      onStatusChange?.();
    } catch (err) {
      console.error(err);
      alert("שגיאה בדחיית ההצעה");
    }
  };

  if (loading) return <p>טוען הצעות שהתקבלו...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div
      className="collab-section"
      style={{
        direction: "rtl",
        fontFamily: "Arial, sans-serif",
        maxWidth: 700,
        margin: "auto",
      }}
    >
      <h3
        className="collab-title"
        style={{ color: "#6b46c1", marginBottom: 20, textAlign: "center" }}
      >
        📥 הצעות שהתקבלו
      </h3>
      {receivedRequests.length === 0 ? (
        <p style={{ textAlign: "center" }}>לא התקבלו עדיין הצעות.</p>
      ) : (
        receivedRequests.map((req) => (
          <div
            key={req.proposalId || req._id}
            className="collab-card"
            style={{
              background: "#fff",
              padding: 16,
              borderRadius: 12,
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              marginBottom: 16,
              wordBreak: "break-word",
              lineHeight: 1.6,
            }}
          >
            <p>
              <strong>עסק שולח:</strong>{" "}
              <span style={{ marginLeft: 6 }}>
                {req.fromBusinessId?.businessName || "לא ידוע"}
              </span>
            </p>
            <p>
              <strong>עסק מקבל:</strong>{" "}
              <span style={{ marginLeft: 6 }}>
                {req.toBusinessId?.businessName || "לא ידוע"}
              </span>
            </p>
            <p>
              <strong>כותרת הצעה:</strong>{" "}
              <span style={{ marginLeft: 6 }}>{req.title || "-"}</span>
            </p>
            <p>
              <strong>תיאור הצעה:</strong>{" "}
              <span style={{ marginLeft: 6 }}>{req.description || "-"}</span>
            </p>
            <p>
              <strong>סכום:</strong>{" "}
              <span style={{ marginLeft: 6 }}>
                {req.amount != null ? req.amount + " ₪" : "-"}
              </span>
            </p>
            <p>
              <strong>תוקף הצעה:</strong>{" "}
              <span style={{ marginLeft: 6 }}>
                {req.validUntil
                  ? new Date(req.validUntil).toLocaleDateString("he-IL")
                  : "-"}
              </span>
            </p>
            <p>
              <strong>סטטוס:</strong>{" "}
              <span style={{ marginLeft: 6 }}>{req.status}</span>
            </p>
            <p
              className="collab-tag"
              style={{ color: "#666", fontSize: "0.9rem", marginTop: 12 }}
            >
              התקבל ב־
              {new Date(req.createdAt).toLocaleDateString("he-IL")}
            </p>
            <div
              style={{
                marginTop: 12,
                display: "flex",
                gap: 12,
                justifyContent: "flex-end",
              }}
            >
              {req.status === "pending" ? (
                <>
                  <button
                    style={{
                      backgroundColor: "#6b46c1",
                      color: "white",
                      border: "none",
                      padding: "8px 16px",
                      borderRadius: 8,
                      cursor: "pointer",
                      fontWeight: "bold",
                    }}
                    onClick={() => handleAccept(req.proposalId || req._id)}
                  >
                    ✅ אשר
                  </button>
                  <button
                    style={{
                      backgroundColor: "#d53f8c",
                      color: "white",
                      border: "none",
                      padding: "8px 16px",
                      borderRadius: 8,
                      cursor: "pointer",
                      fontWeight: "bold",
                    }}
                    onClick={() => handleReject(req.proposalId || req._id)}
                  >
                    ❌ דחה
                  </button>
                </>
              ) : (
                <p style={{ alignSelf: "center" }}>סטטוס: {req.status}</p>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
