import React, { useEffect, useState } from "react";
import API from "@api";
import "./CollabActiveTab.css";

export default function CollabActiveTab({ userBusinessId }) {
  const [view, setView] = useState("active"); // active | sent | received
  const [activeProposals, setActiveProposals] = useState([]);
  const [sentProposals, setSentProposals] = useState([]);
  const [receivedProposals, setReceivedProposals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /* =========================
     Fetch proposals
  ========================= */

  useEffect(() => {
    if (!userBusinessId) return;

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
        console.error(err);
        setError("Error loading proposals");
      } finally {
        setLoading(false);
      }
    }

    fetchProposals();
  }, [userBusinessId]);

  /* =========================
     Helpers
  ========================= */

  const formatDate = (value) => {
    if (!value) return "-";
    const d = new Date(value);
    return Number.isNaN(d.getTime())
      ? "-"
      : d.toLocaleDateString("en-GB");
  };

  const formatMoney = (value) => {
    if (value === null || value === undefined) return "-";
    return `$${value}`;
  };

  const getId = (p) => p.proposalId || p._id;

  /* =========================
     Actions
  ========================= */

  async function handleAccept(id) {
    try {
      await API.put(`/business/my/proposals/${id}/status`, {
        status: "accepted",
      });
      updateStatus(id, "accepted");
      alert("Proposal approved successfully");
    } catch {
      alert("Error approving proposal");
    }
  }

  async function handleReject(id) {
    try {
      await API.put(`/business/my/proposals/${id}/status`, {
        status: "rejected",
      });
      updateStatus(id, "rejected");
      alert("Proposal rejected successfully");
    } catch {
      alert("Error rejecting proposal");
    }
  }

  async function handleCancel(id) {
    if (!window.confirm("Are you sure you want to cancel this proposal?")) return;

    try {
      await API.delete(`/business/my/proposals/${id}`);
      removeProposal(id);
      alert("Proposal cancelled successfully");
    } catch {
      alert("Error cancelling proposal");
    }
  }

  function updateStatus(id, status) {
    const updater = (list) =>
      list.map((p) =>
        getId(p) === id ? { ...p, status } : p
      );

    setActiveProposals(updater);
    setSentProposals(updater);
    setReceivedProposals(updater);
  }

  function removeProposal(id) {
    const filter = (list) =>
      list.filter((p) => getId(p) !== id);

    setActiveProposals(filter);
    setSentProposals(filter);
    setReceivedProposals(filter);
  }

  /* =========================
     Select view
  ========================= */

  const proposalsToShow =
    view === "active"
      ? activeProposals
      : view === "sent"
      ? sentProposals
      : receivedProposals;

  /* =========================
     Render
  ========================= */

  return (
    <div>
      {/* Tabs */}
      <div style={{ marginBottom: 20, display: "flex", justifyContent: "center", gap: 12 }}>
        <button style={buttonStyle(view === "active")} onClick={() => setView("active")}>
          Active Collaborations
        </button>
        <button style={buttonStyle(view === "sent")} onClick={() => setView("sent")}>
          Sent Proposals
        </button>
        <button style={buttonStyle(view === "received")} onClick={() => setView("received")}>
          Received Proposals
        </button>
      </div>

      {loading && <p style={{ textAlign: "center" }}>Loading proposals...</p>}
      {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}

      {!loading && proposalsToShow.length === 0 && (
        <p style={{ textAlign: "center" }}>No proposals to display.</p>
      )}

      {!loading &&
        proposalsToShow.map((p) => (
          <div key={getId(p)} className="collab-card">
            <p>
              <strong>From:</strong>{" "}
              {p.fromBusinessName ||
                p.fromBusinessId?.businessName ||
                "-"}
            </p>

            <p>
              <strong>To:</strong>{" "}
              {p.toBusinessName ||
                p.toBusinessId?.businessName ||
                "Public Market"}
            </p>

            <p>
              <strong>Title:</strong> {p.title || "-"}
            </p>

            <p>
              <strong>Description:</strong> {p.description || "-"}
            </p>

            <p>
              <strong>Amount:</strong> {formatMoney(p.amount)}
            </p>

            <p>
              <strong>Valid Until:</strong> {formatDate(p.validUntil)}
            </p>

            <p>
              <strong>Status:</strong> {p.status}
            </p>

            <p>
              <strong>Created:</strong> {formatDate(p.createdAt)}
            </p>

            {/* Actions */}
            <div style={{ marginTop: 12, display: "flex", gap: 12, justifyContent: "flex-end" }}>
              {view === "sent" && (
                <button
                  onClick={() => handleCancel(getId(p))}
                  className="collab-form-button collab-form-button-danger"
                >
                  Cancel
                </button>
              )}

              {view === "received" && p.status === "pending" && (
                <>
                  <button
                    onClick={() => handleAccept(getId(p))}
                    className="collab-form-button collab-form-button-accept"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleReject(getId(p))}
                    className="collab-form-button collab-form-button-reject"
                  >
                    Reject
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
    </div>
  );
}

const buttonStyle = (active) => ({
  backgroundColor: active ? "#6b46c1" : "#ccc",
  color: "white",
  padding: "8px 16px",
  border: "none",
  borderRadius: 8,
  cursor: "pointer",
  fontWeight: "bold",
});
