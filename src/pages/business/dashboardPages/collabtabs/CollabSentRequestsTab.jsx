import React, { useEffect, useMemo, useState } from "react";
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

  // Supports both:
  // 1) New structure: req.message is an object: { title, description, needs, offers, budget, expiryDate }
  // 2) Legacy: req.message is a string with lines like "Title: ...\nDescription: ...\nAmount: ...\nValid Until: ..."
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
        parsed.budget = line.split(":").slice(1).join(":").trim();
      } else if (line.toLowerCase().startsWith("valid until:")) {
        parsed.expiryDate = line.split(":").slice(1).join(":").trim();
      }
    });

    return parsed;
  };

  const formatMoney = (value) => {
    if (value === null || value === undefined || value === "") return "-";
    const num = Number(value);
    if (Number.isNaN(num)) return String(value);
    // keep it simple: show as $X
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

  // ---------- Actions ----------
  const handleCancelProposal = async (proposalId) => {
    console.log("handleCancelProposal called with proposalId:", proposalId);

    if (!window.confirm("Are you sure you want to delete this proposal?")) return;

    try {
      await API.delete(`/business/my/proposals/${proposalId}`);

      setSentRequests((prev) =>
        prev.filter((p) => (p.proposalId || p._id) !== proposalId)
      );

      alert("Proposal successfully cancelled");
      console.log("Proposal cancelled and state updated");
    } catch (err) {
      console.error("Error cancelling proposal:", err.response || err.message || err);
      alert("Error cancelling the proposal");
    }
  };

  const handleResendProposal = (proposal) => {
    console.log("handleResendProposal called for proposal:", proposal);

    // Placeholder - you can implement real resend logic later
    alert(
      `Resend function – resend the proposal to: ${
        proposal.toBusinessId?.businessName || "Unknown"
      }`
    );
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
          console.log("Rendering proposal message:", req.message);

          const key = req.proposalId || req._id;

          // Normalize message data
          const msgIsObject = req.message && typeof req.message === "object";
          const legacyParsed = !msgIsObject ? parseLegacyMessageString(req.message) : {};

          const title =
            cleanString(req?.message?.title) ||
            cleanString(req?.title) ||
            cleanString(legacyParsed?.title) ||
            "";

          const description =
            cleanString(req?.message?.description) ||
            cleanString(req?.description) ||
            cleanString(legacyParsed?.description) ||
            "";

          const budget =
            req?.message?.budget ??
            req?.budget ??
            legacyParsed?.budget ??
            null;

          const expiryDate =
            req?.message?.expiryDate ??
            req?.expiryDate ??
            legacyParsed?.expiryDate ??
            null;

          const status = req?.status || "-";

          const createdAt = req?.createdAt ? formatDate(req.createdAt) : "-";

          // Optional arrays (if you later want to show them)
          const needs = Array.isArray(req?.message?.needs) ? req.message.needs : [];
          const offers = Array.isArray(req?.message?.offers) ? req.message.offers : [];

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
                wordBreak: "break-word",
                lineHeight: "1.6",
              }}
            >
              <p>
                <strong>From Business:</strong>{" "}
                <span style={{ marginLeft: 6 }}>
                  {req.fromBusinessId?.businessName || "-"}
                </span>
              </p>

              <p>
                <strong>To Business:</strong>{" "}
                <span style={{ marginLeft: 6 }}>
                  {req.toBusinessId?.businessName || "Public Market"}
                </span>
              </p>

              <p style={{ marginTop: 10 }}>
                <strong>Title:</strong>
              </p>
              <p style={{ marginTop: 4 }}>{title || "-"}</p>

              <p style={{ marginTop: 10 }}>
                <strong>Description:</strong>
              </p>
              <p style={{ marginTop: 4 }}>{description || "-"}</p>

              {/* Optional: show needs/offers if they exist */}
              {needs.length > 0 && (
                <>
                  <p style={{ marginTop: 10 }}>
                    <strong>Needs:</strong>
                  </p>
                  <ul style={{ marginTop: 6, paddingLeft: 18 }}>
                    {needs.map((n, i) => (
                      <li key={`${key}-need-${i}`}>{cleanString(n)}</li>
                    ))}
                  </ul>
                </>
              )}

              {offers.length > 0 && (
                <>
                  <p style={{ marginTop: 10 }}>
                    <strong>Offers:</strong>
                  </p>
                  <ul style={{ marginTop: 6, paddingLeft: 18 }}>
                    {offers.map((o, i) => (
                      <li key={`${key}-offer-${i}`}>{cleanString(o)}</li>
                    ))}
                  </ul>
                </>
              )}

              <p style={{ marginTop: 10 }}>
                <strong>Budget:</strong>{" "}
                <span style={{ marginLeft: 6 }}>{formatMoney(budget)}</span>
              </p>

              <p>
                <strong>Valid Until:</strong>{" "}
                <span style={{ marginLeft: 6 }}>{formatDate(expiryDate)}</span>
              </p>

              <p>
                <strong>Status:</strong>{" "}
                <span style={{ marginLeft: 6 }}>{status}</span>
              </p>

              <p style={{ color: "#666", fontSize: "0.9rem", marginTop: 12 }}>
                Sent on {createdAt}
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
                  onClick={() => handleCancelProposal(req.proposalId || req._id)}
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
