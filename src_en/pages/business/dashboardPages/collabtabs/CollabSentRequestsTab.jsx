```javascript
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
        setError("Error loading sent proposals");
      } finally {
        setLoading(false);
        console.log("Finished fetchSentRequests, loading set to false");
      }
    }
    fetchSentRequests();
  }, [refreshFlag]);

  const handleCancelProposal = async (proposalId) => {
    console.log("handleCancelProposal called with proposalId:", proposalId);
    if (!window.confirm("Are you sure you want to delete the proposal?")) return;
    try {
      await API.delete(`/business/my/proposals/${proposalId}`);
      setSentRequests((prev) => prev.filter((p) => p.proposalId !== proposalId));
      alert("The proposal has been successfully canceled");
      console.log("Proposal cancelled and state updated");
    } catch (err) {
      console.error("Error canceling the proposal:", err.response || err.message || err);
      alert("Error canceling the proposal");
    }
  };

  const handleResendProposal = (proposal) => {
    console.log("handleResendProposal called for proposal:", proposal);
    alert(
      `Resend function - send the proposal again to: ${
        proposal.toBusinessId?.businessName || "unknown"
      }`
    );
  };

  const cleanString = (str) => {
    if (!str) return "";
    return str.replace(/^"+|"+$/g, "");
  };

  if (loading) return <p>Loading sent proposals...</p>;
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
        📤 Sent Proposals
      </h3>

      {sentRequests.length === 0 ? (
        <p style={{ textAlign: "center" }}>No proposals have been sent yet.</p>
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
                <strong>Sending Business:</strong> {req.fromBusinessId?.businessName || "-"}
              </p>
              <p>
                <strong>Receiving Business:</strong> {req.toBusinessId?.businessName || "-"}
              </p>

              <p><strong>Title:</strong></p>
              <p>{cleanTitle || "-"}</p>

              <p><strong>Description:</strong></p>
              <p>{cleanDescription || "-"}</p>

              <p>
                <strong>Amount:</strong> {budget != null ? budget : "-"}
              </p>
              <p>
                <strong>Expiry Date:</strong>{" "}
                {expiryDate
                  ? new Date(expiryDate).toLocaleDateString("he-IL")
                  : "-"}
              </p>
              <p>
                <strong>Status:</strong> {req.status || "-"}
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
                  📨 Resend
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
                  🗑️ Cancel
                </button>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
```