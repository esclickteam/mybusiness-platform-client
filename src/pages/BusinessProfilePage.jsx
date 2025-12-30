import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import API from "../api";
import ProposalForm from "./business/dashboardPages/collabtabs/ProposalForm";
import CreateAgreementForm from "../components/CreateAgreementForm";

export default function BusinessProfilePage({ resetSearchFilters }) {
  const { businessId } = useParams();
  const navigate = useNavigate();

  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentUserBusinessId, setCurrentUserBusinessId] = useState(null);
  const [currentUserBusinessName, setCurrentUserBusinessName] = useState("");

  const [currentProposalId, setCurrentProposalId] = useState(null);
  const [isProposalModalOpen, setIsProposalModalOpen] = useState(false);
  const [chatModalOpen, setChatModalOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [createAgreementModalOpen, setCreateAgreementModalOpen] = useState(false);

  /* =========================================================
     🔽 Always scroll to top when profile changes
  ========================================================= */
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [businessId]);

  /* =========================================================
     📌 Load viewed business
  ========================================================= */
  useEffect(() => {
    async function fetchBusiness() {
      try {
        const res = await API.get(`/business/${businessId}`);
        setBusiness(res.data.business);
      } catch {
        setError("Error loading business details");
      } finally {
        setLoading(false);
      }
    }
    fetchBusiness();
  }, [businessId]);

  /* =========================================================
     📌 Load current user business
  ========================================================= */
  useEffect(() => {
    async function fetchMyBusiness() {
      try {
        const res = await API.get("/business/my");
        setCurrentUserBusinessId(res.data.business._id);
        setCurrentUserBusinessName(res.data.business.businessName || "");
      } catch {
        setCurrentUserBusinessId(null);
        setCurrentUserBusinessName("");
      }
    }
    fetchMyBusiness();
  }, []);

  if (loading) {
    return <p style={{ textAlign: "center", marginTop: 50 }}>Loading profile…</p>;
  }

  if (error) {
    return (
      <p style={{ textAlign: "center", color: "red", marginTop: 50 }}>
        {error}
      </p>
    );
  }

  if (!business) {
    return (
      <p style={{ textAlign: "center", marginTop: 50 }}>
        Business was not found.
      </p>
    );
  }

  const isOwnerViewingOther =
    currentUserBusinessId && currentUserBusinessId !== businessId;

  /* =========================================================
     🧠 Actions
  ========================================================= */
  const openProposalModal = () => {
    if (!currentUserBusinessName) {
      alert("The sender business name hasn’t loaded yet. Please wait and try again.");
      return;
    }
    setIsProposalModalOpen(true);
  };

  const closeProposalModal = () => setIsProposalModalOpen(false);

  const openChatModal = () => {
    setChatModalOpen(true);
    setChatMessage("");
  };

  const closeChatModal = () => {
    setChatModalOpen(false);
    setChatMessage("");
  };

  const handleSendBusinessMessage = async () => {
    if (!chatMessage.trim()) return;
    setSending(true);
    try {
      await API.post("/business-chat/start", {
        otherBusinessId: business._id,
        text: chatMessage.trim(),
      });
      alert("Message sent successfully!");
      closeChatModal();
    } catch {
      alert("Error sending the message");
    } finally {
      setSending(false);
    }
  };

  const handleCreateAgreement = () => {
    setCreateAgreementModalOpen(true);
  };

  const closeCreateAgreementModal = () => {
    setCreateAgreementModalOpen(false);
  };

  /* =========================================================
     🎨 RENDER
  ========================================================= */
  return (
    <div
      style={{
        maxWidth: 700,
        margin: "40px auto",
        padding: 30,
        direction: "rtl",
        textAlign: "right",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        color: "#4b367c",
        background: "linear-gradient(180deg, #ede8fb 0%, #d9d1ff 100%)",
        borderRadius: 20,
        boxShadow: "0 4px 40px rgba(131, 90, 184, 0.2)",
      }}
    >
      {isOwnerViewingOther && (
        <button
          onClick={() => {
            resetSearchFilters?.();
            navigate("/business/collaborations");
          }}
          style={{
            backgroundColor: "transparent",
            border: "none",
            color: "#6c3483",
            cursor: "pointer",
            fontSize: 16,
            marginBottom: 24,
            fontWeight: "600",
            padding: 0,
            textDecoration: "underline",
          }}
        >
          ← Back to Collaborations
        </button>
      )}

      {/* ================= HEADER ================= */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: "#fff",
          padding: 20,
          borderRadius: 16,
          boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
          marginBottom: 24,
        }}
      >
        <div>
          <h1 style={{ fontSize: 28, margin: 0, fontWeight: 700 }}>
            {business.businessName}
          </h1>
          <p style={{ fontSize: 16, margin: 0, color: "#9b59b6" }}>
            {business.category}
          </p>
        </div>

        <img
          src={business.logo || "/default-logo.png"}
          alt={business.businessName}
          style={{
            width: 80,
            height: 80,
            borderRadius: "50%",
            objectFit: "cover",
          }}
        />
      </div>

      {/* ================= ACTIONS ================= */}
      <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
        <button onClick={openProposalModal}>Send Proposal</button>
        <button onClick={openChatModal}>Chat</button>
        <button
          onClick={handleCreateAgreement}
          disabled={!currentProposalId}
        >
          Create Agreement
        </button>
      </div>

      {/* ================= MODALS ================= */}
      <Modal open={isProposalModalOpen} onClose={closeProposalModal}>
        <Box sx={{ backgroundColor: "#fff", p: 4, maxWidth: 600, margin: "10% auto" }}>
          <ProposalForm
            fromBusinessId={currentUserBusinessId}
            fromBusinessName={currentUserBusinessName}
            toBusiness={business}
            onClose={closeProposalModal}
            onSent={(proposalId) => {
              setCurrentProposalId(proposalId);
              closeProposalModal();
            }}
          />
        </Box>
      </Modal>

      <Modal open={chatModalOpen} onClose={closeChatModal}>
        <Box sx={{ backgroundColor: "#fff", p: 4, maxWidth: 420, margin: "10% auto" }}>
          <TextField
            multiline
            minRows={3}
            fullWidth
            value={chatMessage}
            onChange={(e) => setChatMessage(e.target.value)}
          />
          <Button
            variant="contained"
            onClick={handleSendBusinessMessage}
            disabled={sending}
          >
            Send
          </Button>
        </Box>
      </Modal>

      <Modal open={createAgreementModalOpen} onClose={closeCreateAgreementModal}>
        <Box sx={{ backgroundColor: "#fff", p: 4, maxWidth: 600, margin: "10% auto" }}>
          <CreateAgreementForm
            fromBusinessId={currentUserBusinessId}
            fromBusinessName={currentUserBusinessName}
            partnerBusiness={business}
            proposalId={currentProposalId}
            onClose={closeCreateAgreementModal}
          />
        </Box>
      </Modal>
    </div>
  );
}
