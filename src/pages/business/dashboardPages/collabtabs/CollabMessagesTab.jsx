```javascript
import React, { useEffect, useState, useMemo } from "react";
import API from "../../../../api";
import PartnershipAgreementView from "../../../../components/PartnershipAgreementView";

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
  marginTop: 12,
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

export default function CollabMessagesTab({ socket, refreshFlag, onStatusChange, userBusinessId }) {
  const [messages, setMessages] = useState({ sent: [], received: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("sent"); // 'sent', 'received', 'accepted'
  const [selectedAgreement, setSelectedAgreement] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

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
      setError("Error loading messages");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [refreshFlag]);

  useEffect(() => {
    if (!socket) return;

    let timeoutId = null;
    const fetchWithDebounce = () => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(fetchMessages, 500);
    };

    socket.on("newNotification", fetchWithDebounce);
    socket.on("newProposalCreated", fetchWithDebounce);

    return () => {
      socket.off("newNotification", fetchWithDebounce);
      socket.off("newProposalCreated", fetchWithDebounce);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [socket]);

  const updateMessageStatus = (proposalId, status) => {
    setMessages((prev) => ({
      sent: prev.sent.map((p) =>
        p.proposalId === proposalId || p._id === proposalId ? { ...p, status } : p
      ),
      received: prev.received.map((p) =>
        p.proposalId === proposalId || p._id === proposalId ? { ...p, status } : p
      ),
    }));
  };

  const handleCancelProposal = async (proposalId) => {
    if (!window.confirm("Are you sure you want to delete the proposal?")) return;
    try {
      await API.delete(`/business/my/proposals/${proposalId}`);
      setMessages((prev) => ({
        sent: prev.sent.filter((p) => p.proposalId !== proposalId && p._id !== proposalId),
        received: prev.received.filter((p) => p.proposalId !== proposalId && p._id !== proposalId),
      }));
      alert("The proposal was successfully canceled");
      onStatusChange?.();
    } catch (err) {
      console.error("Error canceling the proposal:", err);
      alert("Error canceling the proposal");
    }
  };

  const handleAccept = async (proposalId) => {
    try {
      await API.put(`/business/my/proposals/${proposalId}/status`, { status: "accepted" });
      updateMessageStatus(proposalId, "accepted");
      alert("The proposal was successfully accepted");
      onStatusChange?.();
    } catch (err) {
      console.error(err);
      alert("Error accepting the proposal");
    }
  };

  const handleReject = async (proposalId) => {
    try {
      await API.put(`/business/my/proposals/${proposalId}/status`, { status: "rejected" });
      updateMessageStatus(proposalId, "rejected");
      alert("The proposal was successfully rejected");
      onStatusChange?.();
    } catch (err) {
      console.error(err);
      alert("Error rejecting the proposal");
    }
  };

  const onOpenAgreement = async (agreementId) => {
    try {
      const res = await API.get(`/partnershipAgreements/${agreementId}`);
      setSelectedAgreement(res.data);
      setModalOpen(true);
    } catch {
      alert("You do not have permission to view this agreement or the agreement was not found");
    }
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedAgreement(null);
  };

  const messagesToShow = useMemo(() => {
    if (filter === "sent") return messages.sent;
    if (filter === "received") return messages.received;
    if (filter === "accepted")
      return [...messages.sent, ...messages.received].filter((m) => m.status === "accepted");
    return [];
  }, [filter, messages]);

  if (loading) {
    return <div style={{ textAlign: "center", padding: 20 }}>🔄 Loading proposals...</div>;
  }

  if (error) {
    return <div style={{ textAlign: "center", padding: 20, color: "red" }}>{error}</div>;
  }

  return (
    <div style={{ direction: "rtl", fontFamily: "Arial, sans-serif", maxWidth: 700, margin: "auto" }}>
      <div style={{ marginBottom: 20, display: "flex", gap: 12, justifyContent: "center" }}>
        <button onClick={() => setFilter("sent")} style={filterButtonStyle(filter === "sent")}>
          Sent Proposals
        </button>
        <button onClick={() => setFilter("received")} style={filterButtonStyle(filter === "received")}>
          Received Proposals
        </button>
        <button onClick={() => setFilter("accepted")} style={filterButtonStyle(filter === "accepted")}>
          Accepted Proposals
        </button>
      </div>

      {messagesToShow.length === 0 ? (
        <p style={{ textAlign: "center" }}>
          {filter === "sent"
            ? "No proposals have been sent yet."
            : filter === "received"
            ? "No proposals have been received yet."
            : "No accepted proposals to display."}
        </p>
      ) : (
        messagesToShow.map((msg) => {
          const userIdStr = String(userBusinessId);
          const fromIdStr = String(msg.fromBusinessId?._id);
          const toIdStr = String(msg.toBusinessId?._id);
          const isUserParty = userIdStr === fromIdStr || userIdStr === toIdStr;

          return (
            <div
              key={msg.proposalId || msg._id}
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
                <strong>Sending Business:</strong>{" "}
                <span style={{ marginLeft: 6 }}>{msg.fromBusinessId?.businessName || "Unknown"}</span>
              </p>
              <p>
                <strong>Receiving Business:</strong>{" "}
                <span style={{ marginLeft: 6 }}>{msg.toBusinessId?.businessName || "Unknown"}</span>
              </p>

              {msg.message && (
                <>
                  {msg.message.title && (
                    <p style={{ fontWeight: "bold", marginBottom: 4 }}>Title: {msg.message.title}</p>
                  )}
                  {msg.message.description && (
                    <p style={{ marginBottom: 4, whiteSpace: "pre-line" }}>
                      Description: {msg.message.description}
                    </p>
                  )}
                  {msg.message.budget != null && (
                    <p>
                      <strong>Amount:</strong> {msg.message.budget}
                    </p>
                  )}
                  {msg.message.expiryDate && (
                    <p>
                      <strong>Expiry Date:</strong>{" "}
                      {new Date(msg.message.expiryDate).toLocaleDateString("he-IL")}
                    </p>
                  )}
                </>
              )}

              <p>
                <strong>Status:</strong> <span style={{ marginLeft: 6 }}>{msg.status}</span>
              </p>

              {(msg.agreementId || msg._id) && isUserParty && (
                <button
                  onClick={() => {
                    const idStr = msg.agreementId
                      ? typeof msg.agreementId === "string"
                        ? msg.agreementId
                        : msg.agreementId._id
                        ? msg.agreementId._id.toString()
                        : msg.agreementId.toString()
                      : msg._id.toString();

                    onOpenAgreement(idStr);
                  }}
                  style={buttonStylePurple}
                >
                  View Agreement
                </button>
              )}

              <div
                style={{
                  marginTop: 12,
                  display: "flex",
                  gap: 12,
                  justifyContent: "flex-end",
                }}
              >
                {filter === "sent" ? (
                  <>
                    <button
                      style={buttonStylePurple}
                      onClick={() => alert("Resend (not yet implemented)")}
                    >
                      📨 Resend
                    </button>
                    <button
                      style={buttonStylePink}
                      onClick={() => handleCancelProposal(msg.proposalId || msg._id)}
                    >
                      🗑️ Cancel
                    </button>
                  </>
                ) : filter === "received" && msg.status === "pending" ? (
                  <>
                    <button
                      style={buttonStylePurple}
                      onClick={() => handleAccept(msg.proposalId || msg._id)}
                    >
                      ✅ Accept
                    </button>
                    <button
                      style={buttonStylePink}
                      onClick={() => handleReject(msg.proposalId || msg._id)}
                    >
                      ❌ Reject
                    </button>
                  </>
                ) : (
                  <p style={{ alignSelf: "center" }}>Status: {msg.status}</p>
                )}
              </div>
            </div>
          );
        })
      )}

      {modalOpen && selectedAgreement && (
        <div
          onClick={closeModal}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
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
              backgroundColor: "white",
              borderRadius: 12,
              padding: 24,
              maxWidth: 600,
              width: "90%",
              maxHeight: "80vh",
              overflowY: "auto",
              direction: "rtl",
              boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
            }}
          >
            <PartnershipAgreementView
              agreementId={selectedAgreement._id || selectedAgreement.agreementId}
              currentBusinessId={userBusinessId}
            />
            <button
              onClick={closeModal}
              style={{
                marginTop: 20,
                padding: "10px 20px",
                borderRadius: 8,
                border: "none",
                backgroundColor: "#6b46c1",
                color: "white",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
```