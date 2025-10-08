import React, { useEffect, useState } from "react";
import API from "@api";
import "./CollabActiveTab.css";

export default function CollabActiveTab({ userBusinessId, token }) {
  const [view, setView] = useState("active"); // "active" | "sent" | "received"
  const [activeProposals, setActiveProposals] = useState([]);
  const [sentProposals, setSentProposals] = useState([]);
  const [receivedProposals, setReceivedProposals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userBusinessId || !token) return;

    async function fetchProposals() {
      setLoading(true);
      setError(null);
      try {
        const [activeRes, sentRes, receivedRes] = await Promise.all([
          API.get("/business/my/proposals/active"),
          API.get("/business/my/proposals/sent"),
          API.get("/business/my/proposals/received"),
        ]);

        setActiveProposals(activeRes.data.activeProposals || []);
        setSentProposals(sentRes.data.proposalsSent || []);
        setReceivedProposals(receivedRes.data.proposalsReceived || []);
      } catch (err) {
        setError(err.message || "שגיאה בטעינת ההצעות");
      } finally {
        setLoading(false);
      }
    }

    fetchProposals();
  }, [userBusinessId, token]);

  let proposalsToShow = [];
  if (view === "active") proposalsToShow = activeProposals;
  else if (view === "sent") proposalsToShow = sentProposals;
  else if (view === "received") proposalsToShow = receivedProposals;

  async function handleAccept(id) {
    try {
      await API.put(`/business/my/proposals/${id}/status`, { status: "accepted" });
      updateProposalStatus(id, "accepted");
      alert("ההצעה אושרה בהצלחה");
    } catch {
      alert("שגיאה באישור ההצעה");
    }
  }
  async function handleReject(id) {
    try {
      await API.put(`/business/my/proposals/${id}/status`, { status: "rejected" });
      updateProposalStatus(id, "rejected");
      alert("ההצעה נדחתה בהצלחה");
    } catch {
      alert("שגיאה בדחיית ההצעה");
    }
  }
  async function handleCancel(id) {
    if (!window.confirm("האם למחוק את ההצעה?")) return;
    try {
      await API.delete(`/business/my/proposals/${id}`);
      removeProposal(id);
      alert("ההצעה בוטלה בהצלחה");
    } catch {
      alert("שגיאה בביטול ההצעה");
    }
  }

  function updateProposalStatus(id, status) {
    setActiveProposals((prev) =>
      prev.map((p) => (p._id === id ? { ...p, status } : p))
    );
    setSentProposals((prev) =>
      prev.map((p) => (p._id === id ? { ...p, status } : p))
    );
    setReceivedProposals((prev) =>
      prev.map((p) => (p._id === id ? { ...p, status } : p))
    );
  }
  function removeProposal(id) {
    setActiveProposals((prev) => prev.filter((p) => p._id !== id));
    setSentProposals((prev) => prev.filter((p) => p._id !== id));
    setReceivedProposals((prev) => prev.filter((p) => p._id !== id));
  }

  return (
    <div>
      <div
        style={{
          marginBottom: 20,
          display: "flex",
          justifyContent: "center",
          gap: 12,
        }}
      >
        <button onClick={() => setView("active")} style={buttonStyle(view === "active")}>
          שיתופי פעולה פעילים
        </button>
        <button onClick={() => setView("sent")} style={buttonStyle(view === "sent")}>
          הצעות שנשלחו
        </button>
        <button onClick={() => setView("received")} style={buttonStyle(view === "received")}>
          הצעות שהתקבלו
        </button>
      </div>

      {loading && <p style={{ textAlign: "center" }}>טוען הצעות...</p>}
      {error && <p style={{ color: "red", textAlign: "center" }}>שגיאה: {error}</p>}

      {!loading && proposalsToShow.length === 0 && (
        <p style={{ textAlign: "center" }}>אין הצעות להצגה.</p>
      )}

      {!loading &&
        proposalsToShow.map((proposal) => (
          <div key={proposal._id} className="collab-card">
            <p>
              <strong>עסק שולח:</strong> {proposal.fromBusinessId?.businessName || proposal.partnerName || "-"}
            </p>
            <p>
              <strong>עסק מקבל:</strong> {proposal.toBusinessId?.businessName || "-"}
            </p>
            <p>
              <strong>כותרת הצעה:</strong> {proposal.title || "-"}
            </p>
            <p>
              <strong>תיאור הצעה:</strong> {proposal.message || "-"}
            </p>
            <p>
              <strong>סכום:</strong> {proposal.amount ? `${proposal.amount} ₪` : "-"}
            </p>
            <p>
              <strong>תוקף הצעה:</strong>{" "}
              {proposal.expiryDate ? new Date(proposal.expiryDate).toLocaleDateString("he-IL") : "-"}
            </p>
            <p>
              <strong>סטטוס:</strong> {proposal.status || "-"}
            </p>
            <p>
              <strong>תאריך יצירה:</strong>{" "}
              {proposal.createdAt ? new Date(proposal.createdAt).toLocaleDateString("he-IL") : "-"}
            </p>

            <div
              style={{
                marginTop: 12,
                display: "flex",
                gap: 12,
                justifyContent: "flex-end",
              }}
            >
              {view === "sent" && (
                <button
                  onClick={() => handleCancel(proposal._id)}
                  className="collab-form-button collab-form-button-danger"
                >
                  ביטול
                </button>
              )}
              {view === "received" && proposal.status === "pending" && (
                <>
                  <button
                    onClick={() => handleAccept(proposal._id)}
                    className="collab-form-button collab-form-button-accept"
                  >
                    אשר
                  </button>
                  <button
                    onClick={() => handleReject(proposal._id)}
                    className="collab-form-button collab-form-button-reject"
                  >
                    דחה
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
    </div>
  );
}

const buttonStyle = (isActive) => ({
  backgroundColor: isActive ? "#6b46c1" : "#ccc",
  color: "white",
  padding: "8px 16px",
  border: "none",
  borderRadius: 8,
  cursor: "pointer",
  fontWeight: "bold",
});
