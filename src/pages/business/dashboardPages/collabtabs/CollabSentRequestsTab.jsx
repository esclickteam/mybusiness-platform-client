import React, { useEffect, useState } from "react";
import API from "../../../../api";

export default function CollabSentRequestsTab({ refreshFlag }) {
  const [sentRequests, setSentRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("useEffect triggered - fetchSentRequests starting");
    setLoading(true);
    async function fetchSentRequests() {
      try {
        console.log("Fetching sent proposals from API...");
        const res = await API.get("/business/my/proposals/sent");
        console.log("proposalsSent from API:", res.data.proposalsSent);
        setSentRequests(res.data.proposalsSent || []);
        setError(null);
      } catch (err) {
        console.error("Error loading sent proposals:", err);
        setError("שגיאה בטעינת הצעות שנשלחו");
      } finally {
        setLoading(false);
        console.log("Finished fetchSentRequests, loading set to false");
      }
    }
    fetchSentRequests();
  }, [refreshFlag]);

  const handleCancelProposal = async (proposalId) => {
    console.log("handleCancelProposal called with proposalId:", proposalId);
    if (!window.confirm("האם למחוק את ההצעה?")) return;
    try {
      await API.delete(`/business/my/proposals/${proposalId}`);
      setSentRequests((prev) => prev.filter((p) => p.proposalId !== proposalId));
      alert("ההצעה בוטלה בהצלחה");
      console.log("Proposal cancelled and state updated");
    } catch (err) {
      console.error("שגיאה בביטול ההצעה:", err.response || err.message || err);
      alert("שגיאה בביטול ההצעה");
    }
  };

  const handleResendProposal = (proposal) => {
    console.log("handleResendProposal called for proposal:", proposal);
    alert(
      `פונקציית שליחה מחדש - לשלוח שוב את ההצעה ל: ${
        proposal.toBusinessId?.businessName || "לא ידוע"
      }`
    );
  };

  const cleanString = (str) => {
    if (!str) return "";
    return str.replace(/^"+|"+$/g, "");
  };

  if (loading) return <p>טוען הצעות שנשלחו...</p>;
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
        📤 הצעות שנשלחו
      </h3>

      {sentRequests.length === 0 ? (
        <p style={{ textAlign: "center" }}>לא נשלחו עדיין הצעות.</p>
      ) : (
        sentRequests.map((req) => {
          console.log("Rendering proposal message:", req.message);

          const rawMsg = req.message ?? {};

          const {
            title = "",
            description = "",
            budget = null,
            expiryDate = null,
          } = rawMsg;

          const cleanTitle = cleanString(title);
          const cleanDescription = cleanString(description);

          return (
            <div
              key={req.proposalId}
              className="collab-card"
              style={{
                background: "#fff",
                padding: 16,
                borderRadius: 12,
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                marginBottom: 16,
                wordBreak: "break-word",
                lineHeight: "1.6",
              }}
            >
              <p>
                <strong>עסק שולח:</strong> {req.fromBusinessId?.businessName || "-"}
              </p>
              <p>
                <strong>עסק מקבל:</strong> {req.toBusinessId?.businessName || "-"}
              </p>

              <p><strong>כותרת:</strong></p>
              <p>{cleanTitle || "-"}</p>

              <p><strong>תיאור:</strong></p>
              <p>{cleanDescription || "-"}</p>

              <p>
                <strong>סכום:</strong> {budget != null ? budget : "-"}
              </p>
              <p>
                <strong>תאריך תוקף:</strong>{" "}
                {expiryDate
                  ? new Date(expiryDate).toLocaleDateString("he-IL")
                  : "-"}
              </p>
              <p>
                <strong>סטטוס:</strong> {req.status || "-"}
              </p>

              <div
                style={{
                  marginTop: 12,
                  display: "flex",
                  gap: 12,
                  justifyContent: "flex-end",
                }}
              >
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
                  onClick={() => handleResendProposal(req)}
                >
                  📨 שלח שוב
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
                  onClick={() => handleCancelProposal(req.proposalId)}
                >
                  🗑️ ביטול
                </button>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
