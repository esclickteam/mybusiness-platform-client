import React, { useEffect, useState, useMemo } from "react";
import API from "../../../../api";
import PartnershipAgreementView from "../../../../components/PartnershipAgreementView";
import { useLocation } from "react-router-dom";


/* =======================
   Button Styles
======================= */

const buttonStyleBase = {
  border: "none",
  padding: "8px 16px",
  borderRadius: 8,
  cursor: "pointer",
  fontWeight: "bold",
};

const buttonStylePurple = {
  ...buttonStyleBase,
  backgroundColor: "#6b46c1",
  color: "white",
};

const buttonStylePink = {
  ...buttonStyleBase,
  backgroundColor: "#d53f8c",
  color: "white",
};

const filterButtonStyle = (active) => ({
  padding: "8px 20px",
  borderRadius: 8,
  border: "none",
  cursor: "pointer",
  fontWeight: "bold",
  backgroundColor: active ? "#6b46c1" : "#ccc",
  color: active ? "white" : "black",
});

/* =======================
   Component
======================= */

export default function CollabMessagesTab({
  socket,
  refreshFlag,
  onStatusChange,
  userBusinessId,
}) {
  const [messages, setMessages] = useState({ sent: [], received: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("sent");
  const [selectedAgreement, setSelectedAgreement] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const location = useLocation();


  /* =======================
     Fetch Proposals
  ======================= */

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const [sentRes, receivedRes] = await Promise.all([
        API.get("/business/my/proposals/sent"),
        API.get("/business/my/proposals/received"),
      ]);

      setMessages({
        sent: sentRes.data.proposalsSent || [],
        received: receivedRes.data.proposalsReceived || [],
      });

      setError(null);
    } catch (err) {
      console.error("Error loading proposals:", err);
      setError("Error loading proposals");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [refreshFlag]);

  useEffect(() => {
  const params = new URLSearchParams(location.search);
  const tab = params.get("tab");

  if (tab && ["sent", "received", "accepted"].includes(tab)) {
    setFilter(tab);
  }
}, [location.search]);

  useEffect(() => {
    if (!socket) return;

    let timeoutId = null;

    const fetchWithDebounce = () => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(fetchMessages, 400);
    };

    socket.on("newNotification", fetchWithDebounce);
    socket.on("newProposalCreated", fetchWithDebounce);

    return () => {
      socket.off("newNotification", fetchWithDebounce);
      socket.off("newProposalCreated", fetchWithDebounce);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [socket]);

  /* =======================
     Status Updates
  ======================= */

  const updateMessageStatus = (proposalId, status) => {
    setMessages((prev) => ({
      sent: prev.sent.map((p) =>
        p._id === proposalId ? { ...p, status } : p
      ),
      received: prev.received.map((p) =>
        p._id === proposalId ? { ...p, status } : p
      ),
    }));
  };

  const handleCancelProposal = async (proposalId) => {
    if (!window.confirm("Are you sure you want to cancel this proposal?")) return;

    try {
      await API.delete(`/business/my/proposals/${proposalId}`);

      setMessages((prev) => ({
        sent: prev.sent.filter((p) => p._id !== proposalId),
        received: prev.received.filter((p) => p._id !== proposalId),
      }));

      alert("Proposal cancelled successfully");
      onStatusChange?.();
    } catch (err) {
      console.error(err);
      alert("Error cancelling proposal");
    }
  };

  const handleAccept = async (proposalId) => {
    try {
      await API.put(`/business/my/proposals/${proposalId}/status`, {
        status: "accepted",
      });

      updateMessageStatus(proposalId, "accepted");
      alert("Proposal accepted successfully");
      onStatusChange?.();
    } catch (err) {
      console.error(err);
      alert("Error accepting proposal");
    }
  };

  const handleReject = async (proposalId) => {
    try {
      await API.put(`/business/my/proposals/${proposalId}/status`, {
        status: "rejected",
      });

      updateMessageStatus(proposalId, "rejected");
      alert("Proposal rejected");
      onStatusChange?.();
    } catch (err) {
      console.error(err);
      alert("Error rejecting proposal");
    }
  };

  /* =======================
     Agreement Modal
  ======================= */

  const openAgreement = async (agreement) => {
  const agreementId =
    typeof agreement === "string"
      ? agreement
      : agreement?._id;

  if (!agreementId) {
    alert("Invalid agreement reference");
    return;
  }

  try {
    const res = await API.get(`/partnershipAgreements/${agreementId}`);
    setSelectedAgreement(res.data);
    setModalOpen(true);
  } catch (err) {
    console.error("Failed to open agreement:", err);
    alert("Agreement not found or access denied");
  }
};

  const closeModal = () => {
    setModalOpen(false);
    setSelectedAgreement(null);
  };

  /* =======================
     Filters
  ======================= */

  const messagesToShow = useMemo(() => {
    if (filter === "sent") return messages.sent;
    if (filter === "received") return messages.received;
    if (filter === "accepted") {
      return [...messages.sent, ...messages.received].filter(
        (m) => m.status === "accepted"
      );
    }
    return [];
  }, [filter, messages]);

  /* =======================
     Render
  ======================= */

  if (loading) {
    return <div style={{ textAlign: "center", padding: 20 }}>🔄 Loading proposals...</div>;
  }

  if (error) {
    return <div style={{ textAlign: "center", padding: 20, color: "red" }}>{error}</div>;
  }

  return (
    <div style={{ direction: "ltr", fontFamily: "Arial, sans-serif", maxWidth: 720, margin: "auto" }}>
      {/* Filters */}
      <div style={{ marginBottom: 20, display: "flex", gap: 12, justifyContent: "center" }}>
        <button onClick={() => setFilter("sent")} style={filterButtonStyle(filter === "sent")}>
          Sent
        </button>
        <button onClick={() => setFilter("received")} style={filterButtonStyle(filter === "received")}>
          Received
        </button>
        <button onClick={() => setFilter("accepted")} style={filterButtonStyle(filter === "accepted")}>
          Accepted
        </button>
      </div>

      {/* Proposals */}
      {messagesToShow.map((msg) => (
        <div
          key={msg._id}
          style={{
            background: "#fff",
            padding: 16,
            borderRadius: 12,
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            marginBottom: 16,
          }}
        >
          <p><strong>From Business:</strong> {msg.fromBusinessName || "—"}</p>
          <p><strong>To Business:</strong> {msg.toBusinessName || "—"}</p>

          <p><strong>Contact Person:</strong> {msg.contactName || "—"}</p>
          <p><strong>Phone:</strong> {msg.phone || "—"}</p>

          <hr style={{ margin: "12px 0" }} />

          <p><strong>Description:</strong> {msg.description || "—"}</p>
          <p><strong>What You Will Provide:</strong> {msg.giving?.join(", ") || "—"}</p>
          <p><strong>What You Will Receive:</strong> {msg.receiving?.join(", ") || "—"}</p>
          <p><strong>Collaboration Type:</strong> {msg.type || "Two-sided"}</p>
          <p><strong>Payment / Commission:</strong> {msg.payment || "—"}</p>

          <p>
            <strong>Agreement Period:</strong>{" "}
            {msg.startDate
              ? `${new Date(msg.startDate).toLocaleDateString()} – ${new Date(msg.endDate).toLocaleDateString()}`
              : "—"}
          </p>

          <p><strong>Cancelable Anytime:</strong> {msg.cancelAnytime ? "Yes" : "No"}</p>
          <p><strong>Confidentiality Clause:</strong> {msg.confidentiality ? "Yes" : "No"}</p>
          <p><strong>Status:</strong> {msg.status}</p>

          {msg.status === "accepted" && msg.agreementId && (
            <button
              style={{ ...buttonStylePurple, marginTop: 10 }}
              onClick={() => openAgreement(msg.agreementId)}
            >
              📄 View Agreement
            </button>
          )}

          <div style={{ marginTop: 12, display: "flex", gap: 12, justifyContent: "flex-end" }}>
            {filter === "sent" && (
              <button
                style={buttonStylePink}
                onClick={() => handleCancelProposal(msg._id)}
              >
                🗑️ Cancel
              </button>
            )}

            {filter === "received" && msg.status === "pending" && (
              <>
                <button
                  style={buttonStylePurple}
                  onClick={() => handleAccept(msg._id)}
                >
                  ✅ Accept
                </button>
                <button
                  style={buttonStylePink}
                  onClick={() => handleReject(msg._id)}
                >
                  ❌ Reject
                </button>
              </>
            )}
          </div>
        </div>
      ))}

      {/* Agreement Modal */}
      {modalOpen && selectedAgreement && (
        <div
          onClick={closeModal}
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.6)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "white",
              borderRadius: 12,
              padding: 24,
              maxWidth: 600,
              width: "90%",
              maxHeight: "80vh",
              overflowY: "auto",
            }}
          >
            <PartnershipAgreementView
              agreementId={selectedAgreement._id}
              currentBusinessId={userBusinessId}
            />
            <button style={{ ...buttonStylePurple, marginTop: 12 }} onClick={closeModal}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
