import React, { useEffect, useState } from "react";
import API from "@api";
import "./CollabActiveTab.css";

export default function CollabActiveTab({ userBusinessId, token }) {
  const [view, setView] = useState("active"); // "active" | "sent" | "received"
  const [activeProposals, setActiveProposals] = useState([]);
  const [sentProposals, setSentProposals] = useState([]);
  const [receivedProposals, setReceivedProposals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userBusinessId || !token) return;

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
        setError(err.message || "Error loading proposals");
      } finally {
        setLoading(false);
      }
    }

    fetchProposals();
  }, [userBusinessId, token]);

  let proposalsToShow = [];
  if (view === "active") proposalsToShow = activeProposals;
  else if (view === "sent") proposalsToShow = sentProposals;
  else if (view === "received") proposalsToShow = receivedProposals;

  async function handleAccept(id) {
    try {
      await API.put(`/business/my/proposals/${id}/status`, { status: "accepted" });
      updateProposalStatus(id, "accepted");
      alert("The proposal was successfully accepted");
    } catch {
      alert("Error accepting the proposal");
    }
  }
  async function handleReject(id) {
    try {
      await API.put(`/business/my/proposals/${id}/status`, { status: "rejected" });
      updateProposalStatus(id, "rejected");
      alert("The proposal was successfully rejected");
    } catch {
      alert("Error rejecting the proposal");
    }
  }
  async function handleCancel(id) {
    if (!window.confirm("Are you sure you want to delete the proposal?")) return;
    try {
      await API.delete(`/business/my/proposals/${id}`);
      removeProposal(id);
      alert("The proposal was successfully canceled");
    } catch {
      alert("Error canceling the proposal");
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
      <div
        style={{
          marginBottom: 20,
          display: "flex",
          justifyContent: "center",
          gap: 12,
        }}
      >
        <button onClick={() => setView("active")} style={buttonStyle(view === "active")}>
          Active Collaborations
        </button>
        <button onClick={() => setView("sent")} style={buttonStyle(view === "sent")}>
          Sent Proposals
        </button>
        <button onClick={() => setView("received")} style={buttonStyle(view === "received")}>
          Received Proposals
        </button>
      </div>

      {loading && <p style={{ textAlign: "center" }}>Loading proposals...</p>}
      {error && <p style={{ color: "red", textAlign: "center" }}>Error: {error}</p>}

      {!loading && proposalsToShow.length === 0 && (
        <p style={{ textAlign: "center" }}>No proposals to display.</p>
      )}

      {!loading &&
        proposalsToShow.map((proposal) => (
          <div key={proposal._id} className="collab-card">
            <p>
              <strong>Sending Business:</strong> {proposal.fromBusinessId?.businessName || proposal.partnerName || "-"}
            </p>
            <p>
              <strong>Receiving Business:</strong> {proposal.toBusinessId?.businessName || "-"}
            </p>
            <p>
              <strong>Proposal Title:</strong> {proposal.title || "-"}
            </p>
            <p>
              <strong>Proposal Description:</strong> {proposal.message || "-"}
            </p>
            <p>
              <strong>Amount:</strong> {proposal.amount ? `${proposal.amount} $` : "-"}
            </p>
            <p>
              <strong>Proposal Expiry:</strong>{" "}
              {proposal.expiryDate ? new Date(proposal.expiryDate).toLocaleDateString("he-IL") : "-"}
            </p>
            <p>
              <strong>Status:</strong> {proposal.status || "-"}
            </p>
            <p>
              <strong>Creation Date:</strong>{" "}
              {proposal.createdAt ? new Date(proposal.createdAt).toLocaleDateString("he-IL") : "-"}
            </p>

            <div
              style={{
                marginTop: 12,
                display: "flex",
                gap: 12,
                justifyContent: "flex-end",
              }}
            >
              {view === "sent" && (
                <button
                  onClick={() => handleCancel(proposal._id)}
                  className="collab-form-button collab-form-button-danger"
                >
                  Cancel
                </button>
              )}
              {view === "received" && proposal.status === "pending" && (
                <>
                  <button
                    onClick={() => handleAccept(proposal._id)}
                    className="collab-form-button collab-form-button-accept"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleReject(proposal._id)}
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

const buttonStyle = (isActive) => ({
  backgroundColor: isActive ? "#6b46c1" : "#ccc",
  color: "white",
  padding: "8px 16px",
  border: "none",
  borderRadius: 8,
  cursor: "pointer",
  fontWeight: "bold",
});
