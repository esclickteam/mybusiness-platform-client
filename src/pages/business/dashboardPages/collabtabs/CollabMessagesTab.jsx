import React, { useEffect, useState, useMemo } from "react";
import API from "../../../../api";
import PartnershipAgreementView from "../../../../components/PartnershipAgreementView";
import { useLocation } from "react-router-dom";
import "./CollabMessagesTab.css";



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
      onStatusChange?.();
    } catch (err) {
      alert("Error cancelling proposal");
    }
  };

  const handleAccept = async (proposalId) => {
    try {
      await API.put(`/business/my/proposals/${proposalId}/status`, {
        status: "accepted",
      });
      updateMessageStatus(proposalId, "accepted");
      onStatusChange?.();
    } catch (err) {
      alert("Error accepting proposal");
    }
  };

  const handleReject = async (proposalId) => {
    try {
      await API.put(`/business/my/proposals/${proposalId}/status`, {
        status: "rejected",
      });
      updateMessageStatus(proposalId, "rejected");
      onStatusChange?.();
    } catch (err) {
      alert("Error rejecting proposal");
    }
  };

  /* =======================
     Agreement Modal
  ======================= */

  const openAgreement = async (agreement) => {
    const agreementId =
      typeof agreement === "string" ? agreement : agreement?._id;
    if (!agreementId) return;

    const res = await API.get(`/partnershipAgreements/${agreementId}`);
    setSelectedAgreement(res.data);
    setModalOpen(true);
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
    return <div className="collab-loading">Loading proposals…</div>;
  }

  if (error) {
    return <div className="collab-error">{error}</div>;
  }

  return (
    <div className="collab-messages-wrapper">
      {/* Filters */}
      <div className="collab-filters">
        <button
          className={`collab-filter-btn ${filter === "sent" ? "active" : ""}`}
          onClick={() => setFilter("sent")}
        >
          Sent
        </button>
        <button
          className={`collab-filter-btn ${filter === "received" ? "active" : ""}`}
          onClick={() => setFilter("received")}
        >
          Received
        </button>
        <button
          className={`collab-filter-btn ${filter === "accepted" ? "active" : ""}`}
          onClick={() => setFilter("accepted")}
        >
          Accepted
        </button>
      </div>

      {/* Empty State */}
      {messagesToShow.length === 0 && (
        <div className="collab-empty">
          No proposals to display
        </div>
      )}

      {/* Proposals */}
      {messagesToShow.map((msg) => (
        <div key={msg._id} className="collab-card">
          <div className="collab-card-header">

            <div className="collab-business">
  <p>
    <strong>From Business:</strong>{" "}
    {msg.fromBusinessName}
  </p>
  <p>
    <strong>To Business:</strong>{" "}
    {msg.toBusinessName}
  </p>
</div>
            
            <span className={`collab-status ${msg.status}`}>
              {msg.status}
            </span>
          </div>

          <div className="collab-card-body">
            <p><strong>Contact:</strong> {msg.contactName || "—"}</p>
            <p><strong>Phone:</strong> {msg.phone || "—"}</p>
            <p><strong>Description:</strong> {msg.description || "—"}</p>
            <p><strong>Giving:</strong> {msg.giving?.join(", ") || "—"}</p>
            <p><strong>Receiving:</strong> {msg.receiving?.join(", ") || "—"}</p>
            <p><strong>Payment:</strong> {msg.payment || "—"}</p>
          </div>

          <div className="collab-card-actions">
            {msg.status === "accepted" && msg.agreementId && (
              <button
                className="collab-btn primary"
                onClick={() => openAgreement(msg.agreementId)}
              >
                View Agreement
              </button>
            )}

            {filter === "sent" && (
              <button
                className="collab-btn danger"
                onClick={() => handleCancelProposal(msg._id)}
              >
                Cancel
              </button>
            )}

            {filter === "received" && msg.status === "pending" && (
              <>
                <button
                  className="collab-btn primary"
                  onClick={() => handleAccept(msg._id)}
                >
                  Accept
                </button>
                <button
                  className="collab-btn danger"
                  onClick={() => handleReject(msg._id)}
                >
                  Reject
                </button>
              </>
            )}
          </div>
        </div>
      ))}

      {/* Agreement Modal */}
      {modalOpen && selectedAgreement && (
        <div className="collab-modal-overlay" onClick={closeModal}>
          <div
            className="collab-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <PartnershipAgreementView
              agreementId={selectedAgreement._id}
              currentBusinessId={userBusinessId}
            />
            <button className="collab-btn primary" onClick={closeModal}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
