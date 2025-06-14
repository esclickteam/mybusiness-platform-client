import React, { useEffect, useState } from "react";
import API from "@api";

export default function CollabActiveTab({ userBusinessId, token }) {
  const [view, setView] = useState("active"); // "active" | "sent" | "received"
  const [activeProposals, setActiveProposals] = useState([]);
  const [sentProposals, setSentProposals] = useState([]);
  const [receivedProposals, setReceivedProposals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userBusinessId || !token) {
      console.warn("Missing userBusinessId or token, abort fetching");
      return;
    }

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
  if (view === "sent") proposalsToShow = sentProposals;
  if (view === "received") proposalsToShow = receivedProposals;

  // פונקציות לאישור, דחייה וביטול הצעה
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
      <div style={{ marginBottom: 20, display: "flex", justifyContent: "center", gap: 12 }}>
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
          <div
            key={proposal._id}
            style={{
              border: "1px solid #ddd",
              padding: 16,
              marginBottom: 16,
              borderRadius: 8,
              backgroundColor: "#fff",
              maxWidth: 700,
              margin: "auto",
            }}
          >
            <div>
              <b>עסק שולח:</b> {proposal.fromBusinessId?.businessName || proposal.partnerName || "לא ידוע"}
            </div>
            <div>
              <b>עסק מקבל:</b> {proposal.toBusinessId?.businessName || ""}
            </div>
            <div>
              <b>תוכן ההצעה:</b> {proposal.title || proposal.message || "-"}
            </div>
            <div>
              <b>סטטוס:</b> {proposal.status}
            </div>
            <div>
              <b>תאריך יצירה:</b> {new Date(proposal.createdAt).toLocaleDateString("he-IL")}
            </div>

            <div style={{ marginTop: 12, display: "flex", gap: 12, justifyContent: "flex-end" }}>
              {view === "sent" && (
                <button
                  onClick={() => handleCancel(proposal._id)}
                  style={buttonDangerStyle}
                >
                  ביטול
                </button>
              )}
              {view === "received" && proposal.status === "pending" && (
                <>
                  <button
                    onClick={() => handleAccept(proposal._id)}
                    style={buttonAcceptStyle}
                  >
                    אשר
                  </button>
                  <button
                    onClick={() => handleReject(proposal._id)}
                    style={buttonRejectStyle}
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

const buttonDangerStyle = {
  backgroundColor: "#d53f8c",
  color: "white",
  border: "none",
  borderRadius: 8,
  padding: "8px 16px",
  cursor: "pointer",
  fontWeight: "bold",
};

const buttonAcceptStyle = {
  backgroundColor: "#38a169",
  color: "white",
  border: "none",
  borderRadius: 8,
  padding: "8px 16px",
  cursor: "pointer",
  fontWeight: "bold",
};

const buttonRejectStyle = {
  backgroundColor: "#e53e3e",
  color: "white",
  border: "none",
  borderRadius: 8,
  padding: "8px 16px",
  cursor: "pointer",
  fontWeight: "bold",
};
