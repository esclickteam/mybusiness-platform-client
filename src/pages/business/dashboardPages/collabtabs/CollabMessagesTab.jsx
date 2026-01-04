import React, { useEffect, useState, useMemo } from "react";
import API from "../../../../api";
import PartnershipAgreementView from "../../../../components/PartnershipAgreementView";
import { useLocation } from "react-router-dom";

/* =======================
   Button Styles
======================= */

const buttonStyleBase = {
  border: "none",
  padding: "10px 18px",
  borderRadius: 10,
  cursor: "pointer",
  fontWeight: 600,
  fontSize: 14,
};

const buttonStylePurple = {
  ...buttonStyleBase,
  background: "linear-gradient(135deg, #6b46c1, #805ad5)",
  color: "white",
};

const buttonStylePink = {
  ...buttonStyleBase,
  background: "linear-gradient(135deg, #d53f8c, #ed64a6)",
  color: "white",
};

const filterButtonStyle = (active) => ({
  padding: "10px 22px",
  borderRadius: 999,
  border: "none",
  cursor: "pointer",
  fontWeight: 600,
  background: active
    ? "linear-gradient(135deg, #6b46c1, #805ad5)"
    : "#e5e7eb",
  color: active ? "white" : "#374151",
});

/* =======================
   Card / Badge Styles
======================= */

const cardStyle = {
  background: "#ffffff",
  borderRadius: 16,
  padding: 20,
  boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
  marginBottom: 20,
};

const sectionStyle = {
  background: "#f9fafb",
  borderRadius: 12,
  padding: 14,
  marginBottom: 14,
};

const labelStyle = {
  fontSize: 12,
  color: "#6b7280",
  marginBottom: 4,
};

const valueStyle = {
  fontSize: 14,
  fontWeight: 600,
  color: "#111827",
};

const badgeStyle = (status) => ({
  padding: "6px 14px",
  borderRadius: 999,
  fontSize: 12,
  fontWeight: 700,
  background:
    status === "accepted"
      ? "#dcfce7"
      : status === "pending"
      ? "#fef9c3"
      : "#fee2e2",
  color:
    status === "accepted"
      ? "#166534"
      : status === "pending"
      ? "#854d0e"
      : "#991b1b",
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
     Agreement Modal
  ======================= */

  const openAgreement = async (agreement) => {
    const agreementId =
      typeof agreement === "string" ? agreement : agreement?._id;

    if (!agreementId) return alert("Invalid agreement reference");

    try {
      const res = await API.get(`/partnershipAgreements/${agreementId}`);
      setSelectedAgreement(res.data);
      setModalOpen(true);
    } catch {
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

  if (loading) return <div style={{ textAlign: "center" }}>Loading...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  return (
    <div style={{ maxWidth: 760, margin: "auto", fontFamily: "Inter, Arial" }}>
      {/* Filters */}
      <div style={{ display: "flex", gap: 12, justifyContent: "center", marginBottom: 24 }}>
        <button style={filterButtonStyle(filter === "sent")} onClick={() => setFilter("sent")}>Sent</button>
        <button style={filterButtonStyle(filter === "received")} onClick={() => setFilter("received")}>Received</button>
        <button style={filterButtonStyle(filter === "accepted")} onClick={() => setFilter("accepted")}>Accepted</button>
      </div>

      {/* Cards */}
      {messagesToShow.map((msg) => (
        <div key={msg._id} style={cardStyle}>
          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
            <h3 style={{ margin: 0 }}>🤝 Partnership Proposal</h3>
            <span style={badgeStyle(msg.status)}>{msg.status}</span>
          </div>

          {/* Parties */}
          <div style={sectionStyle}>
            <div style={labelStyle}>From</div>
            <div style={valueStyle}>{msg.fromBusinessName}</div>
            <div style={labelStyle}>To</div>
            <div style={valueStyle}>{msg.toBusinessName}</div>
          </div>

          {/* Contact */}
          <div style={sectionStyle}>
            <div style={labelStyle}>Contact Person</div>
            <div style={valueStyle}>{msg.contactName}</div>
            <div style={labelStyle}>Phone</div>
            <div style={valueStyle}>{msg.phone}</div>
          </div>

          {/* Details */}
          <div style={sectionStyle}>
            <div style={labelStyle}>Description</div>
            <div style={valueStyle}>{msg.description}</div>
          </div>

          {/* Payment */}
          <div style={{ ...sectionStyle, textAlign: "center" }}>
            <div style={{ fontSize: 28, fontWeight: 800 }}>
              {msg.payment || "—"}
            </div>
            <div style={{ fontSize: 12, color: "#6b7280" }}>
              Payment / Commission
            </div>
          </div>

          {/* Actions */}
          {msg.status === "accepted" && msg.agreementId && (
            <button
              style={{ ...buttonStylePurple, width: "100%", marginTop: 12 }}
              onClick={() => openAgreement(msg.agreementId)}
            >
              📄 View Agreement
            </button>
          )}
        </div>
      ))}

      {/* Modal */}
      {modalOpen && selectedAgreement && (
        <div
          onClick={closeModal}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#fff",
              borderRadius: 16,
              padding: 24,
              maxWidth: 640,
              width: "90%",
              maxHeight: "85vh",
              overflowY: "auto",
            }}
          >
            <PartnershipAgreementView
              agreementId={selectedAgreement._id}
              currentBusinessId={userBusinessId}
            />
            <button style={{ ...buttonStylePurple, marginTop: 16 }} onClick={closeModal}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
