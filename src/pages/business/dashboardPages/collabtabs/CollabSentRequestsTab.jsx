import React, { useEffect, useState } from "react";
import API from "../../../../api";

export default function CollabSentRequestsTab({ refreshFlag }) {
  const [sentRequests, setSentRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ---------- Helpers ----------
  const cleanString = (str) => {
    if (!str) return "";
    return String(str).replace(/^"+|"+$/g, "").trim();
  };

  // Legacy support: parse old message string
  const parseLegacyMessageString = (message) => {
    if (!message || typeof message !== "string") return {};
    const lines = message.split("\n").map((line) => line.trim());
    const parsed = {};

    lines.forEach((line) => {
      if (line.toLowerCase().startsWith("title:")) {
        parsed.title = line.split(":").slice(1).join(":").trim();
      } else if (line.toLowerCase().startsWith("description:")) {
        parsed.description = line.split(":").slice(1).join(":").trim();
      } else if (line.toLowerCase().startsWith("amount:")) {
        parsed.amount = line.split(":").slice(1).join(":").trim();
      } else if (line.toLowerCase().startsWith("valid until:")) {
        parsed.validUntil = line.split(":").slice(1).join(":").trim();
      }
    });

    return parsed;
  };

  const formatMoney = (value) => {
    if (value === null || value === undefined || value === "") return "-";
    const num = Number(value);
    if (Number.isNaN(num)) return String(value);
    return `$${num}`;
  };

  const formatDate = (value) => {
    if (!value) return "-";
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return "-";
    return d.toLocaleDateString("en-US");
  };

  // ---------- Fetch ----------
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

  // ---------- Actions ----------
  const handleCancelProposal = async (proposalId) => {
    if (!window.confirm("Are you sure you want to delete this proposal?")) return;

    try {
      await API.delete(`/business/my/proposals/${proposalId}`);
      setSentRequests((prev) =>
        prev.filter((p) => (p.proposalId || p._id) !== proposalId)
      );
      alert("Proposal successfully cancelled");
    } catch (err) {
      console.error("Error cancelling proposal:", err);
      alert("Error cancelling the proposal");
    }
  };

  // ---------- Render ----------
  if (loading) return <p>Loading sent proposals...</p>;
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
        📤 Sent Proposals
      </h3>

      {sentRequests.length === 0 ? (
        <p style={{ textAlign: "center" }}>No proposals have been sent yet.</p>
      ) : (
        sentRequests.map((req) => {
          const key = req.proposalId || req._id;

          const legacyParsed =
            typeof req.message === "string"
              ? parseLegacyMessageString(req.message)
              : {};

          const title =
            cleanString(req.message?.title) ||
            cleanString(req.title) ||
            cleanString(legacyParsed.title) ||
            "-";

          const description =
            cleanString(req.message?.description) ||
            cleanString(req.description) ||
            cleanString(legacyParsed.description) ||
            "-";

          const amount =
            req.message?.amount ??
            req.amount ??
            legacyParsed.amount ??
            null;

          const validUntil =
            req.message?.validUntil ??
            req.validUntil ??
            legacyParsed.validUntil ??
            null;

          const status = req.status || "-";

          return (
            <div
              key={key}
              className="collab-card"
              style={{
                background: "#fff",
                padding: 16,
                borderRadius: 12,
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                marginBottom: 16,
                lineHeight: "1.6",
              }}
            >
              <p>
                <strong>From Business:</strong>{" "}
                {req.fromBusinessId?.businessName || "-"}
              </p>

              <p>
                <strong>To Business:</strong>{" "}
                {req.toBusinessId?.businessName || "-"}
              </p>

              <p>
                <strong>Title:</strong> {title}
              </p>

              <p>
                <strong>Description:</strong> {description}
              </p>

              <p>
                <strong>Amount:</strong> {formatMoney(amount)}
              </p>

              <p>
                <strong>Valid Until:</strong> {formatDate(validUntil)}
              </p>

              <p>
                <strong>Status:</strong> {status}
              </p>

              <div style={{ textAlign: "right", marginTop: 12 }}>
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
                  onClick={() => handleCancelProposal(key)}
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
