import React, { useEffect, useState } from "react";
import API from "../../../../api";

export default function CollabSentRequestsTab({ refreshFlag }) {
  const [sentRequests, setSentRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /* =========================
     Helpers
  ========================= */

  const cleanString = (str) =>
    str ? String(str).replace(/^"+|"+$/g, "").trim() : "";

  const formatMoney = (value) => {
    if (value === null || value === undefined || value === "") return "-";
    const num = Number(value);
    if (Number.isNaN(num)) return String(value);
    return `$${num}`;
  };

  const formatDate = (value) => {
    if (!value) return "-";
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? "-" : d.toLocaleDateString("en-US");
  };

  /* =========================
     Fetch sent proposals
  ========================= */

  useEffect(() => {
    setLoading(true);

    async function fetchSentRequests() {
      try {
        const res = await API.get("/business/my/proposals/sent");
        setSentRequests(res.data.proposalsSent || []);
        setError(null);
      } catch (err) {
        console.error("Error loading sent proposals:", err);
        setError("Error loading sent proposals");
      } finally {
        setLoading(false);
      }
    }

    fetchSentRequests();
  }, [refreshFlag]);

  /* =========================
     Actions
  ========================= */

  const handleCancelProposal = async (proposalId) => {
    if (!window.confirm("Are you sure you want to cancel this proposal?")) return;

    try {
      await API.delete(`/business/my/proposals/${proposalId}`);
      setSentRequests((prev) =>
        prev.filter((p) => p.proposalId !== proposalId)
      );
      alert("Proposal successfully cancelled");
    } catch (err) {
      console.error("Error cancelling proposal:", err);
      alert("Error cancelling the proposal");
    }
  };

  const handleResendProposal = (proposal) => {
    alert(
      `Resend proposal to ${
        proposal.toBusinessId?.businessName || "Public Market"
      } (feature coming soon)`
    );
  };

  /* =========================
     Render
  ========================= */

  if (loading) return <p>Loading sent proposals...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div
      style={{
        direction: "ltr",
        fontFamily: "Arial, sans-serif",
        maxWidth: 720,
        margin: "auto",
      }}
    >
      <h3 style={{ color: "#6b46c1", textAlign: "center", marginBottom: 20 }}>
        📤 Sent Proposals
      </h3>

      {sentRequests.length === 0 ? (
        <p style={{ textAlign: "center" }}>
          No proposals have been sent yet.
        </p>
      ) : (
        sentRequests.map((req) => {
          const key = req.proposalId || req._id;

          return (
            <div
              key={key}
              style={{
                background: "#fff",
                padding: 18,
                borderRadius: 14,
                boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                marginBottom: 18,
              }}
            >
              <p>
                <strong>From:</strong>{" "}
                {req.fromBusinessId?.businessName || "-"}
              </p>

              <p>
                <strong>To:</strong>{" "}
                {req.toBusinessId?.businessName || "Public Market"}
              </p>

              <hr style={{ margin: "12px 0" }} />

              <p>
                <strong>Title:</strong>
              </p>
              <p>{cleanString(req.title) || "-"}</p>

              <p>
                <strong>Description:</strong>
              </p>
              <p>{cleanString(req.description) || "-"}</p>

              {Array.isArray(req.giving) && req.giving.length > 0 && (
                <>
                  <p>
                    <strong>What you provide:</strong>
                  </p>
                  <ul>
                    {req.giving.map((g, i) => (
                      <li key={`${key}-give-${i}`}>{cleanString(g)}</li>
                    ))}
                  </ul>
                </>
              )}

              {Array.isArray(req.receiving) && req.receiving.length > 0 && (
                <>
                  <p>
                    <strong>What you receive:</strong>
                  </p>
                  <ul>
                    {req.receiving.map((r, i) => (
                      <li key={`${key}-receive-${i}`}>{cleanString(r)}</li>
                    ))}
                  </ul>
                </>
              )}

              <p>
                <strong>Payment:</strong>{" "}
                {cleanString(req.payment) || "-"}
              </p>

              <p>
                <strong>Amount:</strong>{" "}
                {formatMoney(req.amount)}
              </p>

              <p>
                <strong>Valid Until:</strong>{" "}
                {formatDate(req.validUntil)}
              </p>

              <p>
                <strong>Status:</strong>{" "}
                <span style={{ fontWeight: "bold" }}>{req.status}</span>
              </p>

              <p style={{ fontSize: "0.85rem", color: "#666" }}>
                Sent on {formatDate(req.createdAt)}
              </p>

              <div
                style={{
                  marginTop: 14,
                  display: "flex",
                  gap: 12,
                  justifyContent: "flex-end",
                }}
              >
                <button
                  onClick={() => handleResendProposal(req)}
                  style={{
                    background: "#6b46c1",
                    color: "#fff",
                    border: "none",
                    padding: "8px 16px",
                    borderRadius: 8,
                    cursor: "pointer",
                    fontWeight: "bold",
                  }}
                >
                  📨 Resend
                </button>

                <button
                  onClick={() => handleCancelProposal(req.proposalId)}
                  style={{
                    background: "#e53e3e",
                    color: "#fff",
                    border: "none",
                    padding: "8px 16px",
                    borderRadius: 8,
                    cursor: "pointer",
                    fontWeight: "bold",
                  }}
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
