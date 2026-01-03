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

  /* =========================================================
     Legacy message parser (for old proposals)
  ========================================================= */
  const parseMessage = (message) => {
    if (!message || typeof message !== "string") return {};
    const lines = message.split("\n").map((line) => line.trim());
    const parsed = {};

    lines.forEach((line) => {
      if (line.startsWith("Title:")) {
        parsed.title = line.replace("Title:", "").trim();
      } else if (line.startsWith("Description:")) {
        parsed.description = line.replace("Description:", "").trim();
      } else if (line.startsWith("Amount:")) {
        parsed.amount = line.replace("Amount:", "").trim();
      } else if (line.startsWith("Valid Until:")) {
        parsed.validUntil = line.replace("Valid Until:", "").trim();
      }
    });

    return parsed;
  };

  /* =========================================================
     Fetch received proposals
  ========================================================= */
  useEffect(() => {
    setLoading(true);

    async function fetchReceivedRequests() {
      try {
        const res = await API.get("/business/my/proposals/received");
        setReceivedRequests(res.data.proposalsReceived || []);
        setError(null);
      } catch (err) {
        console.error(err);
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

  /* =========================================================
     Accept proposal
  ========================================================= */
  const handleAccept = async (proposalId) => {
    try {
      const res = await API.put(
        `/business/my/proposals/${proposalId}/status`,
        { status: "accepted" }
      );

      const agreementId = res.data?.agreementId || null;

      setReceivedRequests((prev) =>
        prev.map((p) =>
          p._id === proposalId || p.proposalId === proposalId
            ? {
                ...p,
                status: "accepted",
                agreementId: agreementId || p.agreementId,
              }
            : p
        )
      );

      alert("✅ Proposal approved successfully. An agreement was created.");
      onStatusChange?.();
    } catch (err) {
      console.error(err);
      alert("❌ Error approving the proposal");
    }
  };

  /* =========================================================
     Reject proposal
  ========================================================= */
  const handleReject = async (proposalId) => {
    try {
      await API.put(`/business/my/proposals/${proposalId}/status`, {
        status: "rejected",
      });

      setReceivedRequests((prev) =>
        prev.map((p) =>
          p._id === proposalId || p.proposalId === proposalId
            ? { ...p, status: "rejected" }
            : p
        )
      );

      alert("❌ Proposal rejected successfully.");
      onStatusChange?.();
    } catch (err) {
      console.error(err);
      alert("❌ Error rejecting the proposal");
    }
  };

  /* =========================================================
     UI states
  ========================================================= */
  if (loading) return <p>Loading received proposals...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  /* =========================================================
     Render
  ========================================================= */
  return (
    <div
      style={{
        direction: "ltr",
        fontFamily: "Arial, sans-serif",
        maxWidth: 700,
        margin: "auto",
      }}
    >
      <h3
        style={{
          color: "#6b46c1",
          marginBottom: 20,
          textAlign: "center",
        }}
      >
        📥 Received Proposals
      </h3>

      {receivedRequests.length === 0 ? (
        <p style={{ textAlign: "center" }}>
          No proposals have been received yet.
        </p>
      ) : (
        receivedRequests.map((req) => {
          /* =========================
             Normalize proposal data
          ========================= */

          const legacy =
            typeof req.message === "string"
              ? parseMessage(req.message)
              : {};

          const title =
            req?.message?.title ||
            req.title ||
            legacy.title ||
            "-";

          const description =
            req?.message?.description ||
            req.description ||
            legacy.description ||
            "-";

          const amountRaw =
            req?.message?.budget ??
            req.amount ??
            legacy.amount ??
            null;

          const amount =
            amountRaw !== null && amountRaw !== undefined && amountRaw !== ""
              ? Number(amountRaw)
              : null;

          const validUntilRaw =
            req?.message?.expiryDate ||
            req.validUntil ||
            legacy.validUntil ||
            null;

          const validUntil = validUntilRaw
            ? new Date(validUntilRaw)
            : null;

          const createdAt = req.createdAt
            ? new Date(req.createdAt)
            : null;

          const agreementId =
            req.agreementId?._id ||
            req.agreementId ||
            req.agreement?._id ||
            req.agreement ||
            null;

          /* =========================
             Card
          ========================= */
          return (
            <div
              key={req._id || req.proposalId}
              style={{
                background: "#fff",
                padding: 16,
                borderRadius: 12,
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                marginBottom: 16,
                lineHeight: 1.6,
              }}
            >
              <p>
                <strong>From Business:</strong>{" "}
                {req.fromBusinessId?.businessName || "Unknown"}
              </p>

              <p>
                <strong>To Business:</strong>{" "}
                {req.toBusinessId?.businessName || "Unknown"}
              </p>

              <p>
                <strong>Proposal Title:</strong> {title}
              </p>

              <p>
                <strong>Description:</strong> {description}
              </p>

              <p>
                <strong>Budget:</strong>{" "}
                {amount !== null && !Number.isNaN(amount)
                  ? `$${amount}`
                  : "-"}
              </p>

              <p>
                <strong>Valid Until:</strong>{" "}
                {validUntil
                  ? validUntil.toLocaleDateString("en-US")
                  : "-"}
              </p>

              <p>
                <strong>Status:</strong> {req.status}
              </p>

              {/* Agreement */}
              {req.status === "accepted" && agreementId && (
                <button
                  style={{
                    marginTop: 10,
                    padding: "8px 14px",
                    backgroundColor: "#2b6cb0",
                    color: "white",
                    border: "none",
                    borderRadius: 8,
                    cursor: "pointer",
                    fontWeight: "bold",
                  }}
                  onClick={() =>
                    window.open(`/agreements/${agreementId}`, "_blank")
                  }
                >
                  📄 View Agreement
                </button>
              )}

              <p
                style={{
                  color: "#666",
                  fontSize: "0.9rem",
                  marginTop: 12,
                }}
              >
                Received on{" "}
                {createdAt
                  ? createdAt.toLocaleDateString("en-US")
                  : "-"}
              </p>

              {/* Actions */}
              {req.status === "pending" && (
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
                    onClick={() =>
                      handleAccept(req._id || req.proposalId)
                    }
                  >
                    ✅ Accept
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
                    onClick={() =>
                      handleReject(req._id || req.proposalId)
                    }
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
