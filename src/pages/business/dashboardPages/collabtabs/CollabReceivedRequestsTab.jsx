import React, { useEffect, useState } from "react";
import API from "../../../../api";

export default function CollabReceivedRequestsTab({
  isDevUser,
  refreshFlag,
  onStatusChange,
}) {
  const [receivedRequests, setReceivedRequests] = useState([]);
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
    if (Number.isNaN(num)) return "-";
    return `$${num}`;
  };

  const formatDate = (value) => {
    if (!value) return "-";
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? "-" : d.toLocaleDateString("en-US");
  };

  /* =========================
     Fetch received proposals
  ========================= */

  useEffect(() => {
    setLoading(true);

    async function fetchReceivedRequests() {
      try {
        const res = await API.get("/business/my/proposals/received");
        setReceivedRequests(res.data.proposalsReceived || []);
        setError(null);
      } catch (err) {
        console.error("Error loading received proposals:", err);
        setError("Error loading received proposals");
      } finally {
        setLoading(false);
      }
    }

    if (!isDevUser) {
      fetchReceivedRequests();
    } else {
      setReceivedRequests([]);
      setLoading(false);
    }
  }, [isDevUser, refreshFlag]);

  /* =========================
     Actions
  ========================= */

  const handleAccept = async (proposalId) => {
    try {
      const res = await API.put(
        `/business/my/proposals/${proposalId}/status`,
        { status: "accepted" }
      );

      const agreementId = res.data?.proposal?.agreementId || null;

      setReceivedRequests((prev) =>
        prev.map((p) =>
          p.proposalId === proposalId || p._id === proposalId
            ? {
                ...p,
                status: "accepted",
                agreementId: agreementId || p.agreementId,
              }
            : p
        )
      );

      alert("✅ Proposal approved successfully. Agreement created.");
      onStatusChange?.();
    } catch (err) {
      console.error("Error approving proposal:", err);
      alert("❌ Error approving the proposal");
    }
  };

  const handleReject = async (proposalId) => {
    try {
      await API.put(`/business/my/proposals/${proposalId}/status`, {
        status: "rejected",
      });

      setReceivedRequests((prev) =>
        prev.map((p) =>
          p.proposalId === proposalId || p._id === proposalId
            ? { ...p, status: "rejected" }
            : p
        )
      );

      alert("❌ Proposal rejected successfully.");
      onStatusChange?.();
    } catch (err) {
      console.error("Error rejecting proposal:", err);
      alert("❌ Error rejecting the proposal");
    }
  };

  /* =========================
     UI states
  ========================= */

  if (loading) return <p>Loading received proposals...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  /* =========================
     Render
  ========================= */

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
        📥 Received Proposals
      </h3>

      {receivedRequests.length === 0 ? (
        <p style={{ textAlign: "center" }}>
          No proposals have been received yet.
        </p>
      ) : (
        receivedRequests.map((req) => {
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
                lineHeight: 1.6,
              }}
            >
              <p>
                <strong>From:</strong>{" "}
                {req.fromBusinessName ||
                  req.fromBusinessId?.businessName ||
                  "-"}
              </p>

              <p>
                <strong>To:</strong>{" "}
                {req.toBusinessName ||
                  req.toBusinessId?.businessName ||
                  "-"}
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
                    <strong>What they provide:</strong>
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
                    <strong>What they expect:</strong>
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
                <strong>{req.status}</strong>
              </p>

              {req.status === "accepted" && req.agreementId && (
                <button
                  style={{
                    marginTop: 12,
                    padding: "8px 14px",
                    backgroundColor: "#2b6cb0",
                    color: "white",
                    border: "none",
                    borderRadius: 8,
                    cursor: "pointer",
                    fontWeight: "bold",
                  }}
                  onClick={() =>
                    window.open(`/agreements/${req.agreementId}`, "_blank")
                  }
                >
                  📄 View Agreement
                </button>
              )}

              <p style={{ fontSize: "0.85rem", color: "#666", marginTop: 12 }}>
                Received on {formatDate(req.createdAt)}
              </p>

              {req.status === "pending" && (
                <div
                  style={{
                    marginTop: 14,
                    display: "flex",
                    gap: 12,
                    justifyContent: "flex-end",
                  }}
                >
                  <button
                    onClick={() => handleAccept(req.proposalId)}
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
                    ✅ Accept
                  </button>

                  <button
                    onClick={() => handleReject(req.proposalId)}
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
                    ❌ Reject
                  </button>
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}
