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

  // Parse message into separate fields (optional legacy support)
  const parseMessage = (message) => {
    if (!message) return {};
    const lines = message.split("\n").map((line) => line.trim());
    const parsed = {};

    lines.forEach((line) => {
      if (line.startsWith("Title:"))
        parsed.title = line.replace("Title:", "").trim();
      else if (line.startsWith("Description:"))
        parsed.description = line.replace("Description:", "").trim();
      else if (line.startsWith("Amount:"))
        parsed.amount = line.replace("Amount:", "").trim();
      else if (line.startsWith("Valid Until:"))
        parsed.validUntil = line.replace("Valid Until:", "").trim();
    });

    return parsed;
  };

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
      // Dev/demo mode (optional)
      setReceivedRequests([]);
      setLoading(false);
    }
  }, [isDevUser, refreshFlag]);

  const handleAccept = async (proposalId) => {
    try {
      const res = await API.put(`/business/my/proposals/${proposalId}/status`, {
        status: "accepted",
      });

      const { agreementId } = res.data || {};

      setReceivedRequests((prev) =>
        prev.map((p) =>
          p.proposalId === proposalId || p._id === proposalId
            ? { ...p, status: "accepted", agreementId: agreementId || p.agreementId }
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
      console.error(err);
      alert("❌ Error rejecting the proposal");
    }
  };

  if (loading) return <p>Loading received proposals...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div
      className="collab-section"
      style={{
        direction: "ltr",
        fontFamily: "Arial, sans-serif",
        maxWidth: 700,
        margin: "auto",
      }}
    >
      <h3
        className="collab-title"
        style={{ color: "#6b46c1", marginBottom: 20, textAlign: "center" }}
      >
        📥 Received Proposals
      </h3>

      {receivedRequests.length === 0 ? (
        <p style={{ textAlign: "center" }}>No proposals have been received yet.</p>
      ) : (
        receivedRequests.map((req) => {
          // Support both the new structure (message object) and legacy string parsing
          const parsedFromLegacyString =
            typeof req.message === "string" ? parseMessage(req.message) : {};

          const title =
            req?.message?.title ||
            req.title ||
            parsedFromLegacyString.title ||
            "-";

          const description =
            req?.message?.description ||
            req.description ||
            parsedFromLegacyString.description ||
            "-";

          const amountRaw =
            req?.message?.budget ??
            req.amount ??
            parsedFromLegacyString.amount ??
            null;

          const amount =
            amountRaw !== null && amountRaw !== undefined && amountRaw !== ""
              ? Number(amountRaw)
              : null;

          const validUntilRaw =
            req?.message?.expiryDate ||
            req.validUntil ||
            parsedFromLegacyString.validUntil ||
            null;

          const validUntil =
            validUntilRaw ? new Date(validUntilRaw) : null;

          const createdAt = req.createdAt ? new Date(req.createdAt) : null;

          const agreementId =
            req.agreementId ||
            (req.agreement && (req.agreement._id || req.agreement)) ||
            null;

          return (
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
                <strong>From Business:</strong>{" "}
                <span style={{ marginLeft: 6 }}>
                  {req.fromBusinessId?.businessName || "Unknown"}
                </span>
              </p>

              <p>
                <strong>To Business:</strong>{" "}
                <span style={{ marginLeft: 6 }}>
                  {req.toBusinessId?.businessName || "Unknown"}
                </span>
              </p>

              <p>
                <strong>Proposal Title:</strong>{" "}
                <span style={{ marginLeft: 6 }}>{title}</span>
              </p>

              <p>
                <strong>Proposal Description:</strong>{" "}
                <span style={{ marginLeft: 6 }}>{description}</span>
              </p>

              <p>
                <strong>Budget:</strong>{" "}
                <span style={{ marginLeft: 6 }}>
                  {amount !== null && !Number.isNaN(amount) ? `$${amount}` : "-"}
                </span>
              </p>

              <p>
                <strong>Valid Until:</strong>{" "}
                <span style={{ marginLeft: 6 }}>
                  {validUntil ? validUntil.toLocaleDateString("en-US") : "-"}
                </span>
              </p>

              <p>
                <strong>Status:</strong>{" "}
                <span style={{ marginLeft: 6 }}>{req.status}</span>
              </p>

              {/* Agreement display (if created on acceptance) */}
              {req.status === "accepted" && agreementId && (
                <p style={{ marginTop: 8 }}>
                  <strong>📄 Agreement ID:</strong>{" "}
                  <span
                    style={{
                      marginLeft: 6,
                      color: "#2b6cb0",
                      fontWeight: "bold",
                    }}
                  >
                    {String(agreementId)}
                  </span>
                </p>
              )}

              <p
                className="collab-tag"
                style={{ color: "#666", fontSize: "0.9rem", marginTop: 12 }}
              >
                Received on{" "}
                {createdAt ? createdAt.toLocaleDateString("en-US") : "-"}
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
                      onClick={() => handleReject(req.proposalId || req._id)}
                    >
                      ❌ Reject
                    </button>
                  </>
                ) : (
                  <p style={{ alignSelf: "center" }}>Status: {req.status}</p>
                )}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
