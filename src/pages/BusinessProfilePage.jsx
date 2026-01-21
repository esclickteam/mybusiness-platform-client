import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import API from "../api";

import ProposalForm from "./business/dashboardPages/collabtabs/ProposalForm";
import "./BusinessProfilePage.css";


export default function BusinessProfilePage({ resetSearchFilters }) {
  const { businessId } = useParams();
  const navigate = useNavigate();

  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentUserBusinessId, setCurrentUserBusinessId] = useState(null);
  const [currentUserBusinessName, setCurrentUserBusinessName] = useState("");

  const [isProposalModalOpen, setIsProposalModalOpen] = useState(false);
  const [chatModalOpen, setChatModalOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const [sending, setSending] = useState(false);

  /* =========================
     Load business
  ========================= */
  useEffect(() => {
    let mounted = true;

    async function fetchBusiness() {
      try {
        const res = await API.get(`/business/${businessId}`);
        if (mounted) setBusiness(res.data.business);
      } catch {
        if (mounted) setError("Failed to load business details");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchBusiness();
    return () => (mounted = false);
  }, [businessId]);

  /* =========================
     Load my business
  ========================= */
  useEffect(() => {
    async function fetchMyBusiness() {
      try {
        const res = await API.get("/business/my");
        setCurrentUserBusinessId(res.data.business?._id || null);
        setCurrentUserBusinessName(
          res.data.business?.businessName || ""
        );
      } catch {
        setCurrentUserBusinessId(null);
        setCurrentUserBusinessName("");
      }
    }

    fetchMyBusiness();
  }, []);

  if (loading) return <div className="bp-state">Loading business…</div>;
  if (error) return <div className="bp-state error">{error}</div>;
  if (!business) return <div className="bp-state">Business not found</div>;

  const isLoggedIn = !!currentUserBusinessId;
  const isOwnerViewingOther =
    isLoggedIn && currentUserBusinessId !== business._id;

  /* =========================
     Actions
  ========================= */
  const openProposalModal = () => {
    if (!currentUserBusinessName) return;
    setIsProposalModalOpen(true);
  };

  const handleSendBusinessMessage = async () => {
    if (!chatMessage.trim()) return;
    setSending(true);
    try {
      await API.post("/business-chat/start", {
        otherBusinessId: business._id,
        text: chatMessage.trim(),
      });
      setChatModalOpen(false);
      setChatMessage("");
    } finally {
      setSending(false);
    }
  };

  /* =========================
     Render
  ========================= */
  return (
    <div className="business-profile-page">
      {isOwnerViewingOther && (
        <button
          className="bp-back"
          onClick={() => {
            resetSearchFilters?.();
            navigate(
              `/business/${currentUserBusinessId}/dashboard/collab/find-partner`
            );
          }}
        >
          ← Back to partners
        </button>
      )}

      {/* Header */}
      <div className="bp-header">
        <div className="bp-header-info">
          <h1>{business.businessName}</h1>
          <p className="bp-category">{business.category}</p>
        </div>

        <img
          src={business.logo || "/default-logo.png"}
          alt="Business logo"
          className="bp-logo"
        />
      </div>

      {/* Info sections */}
      <InfoBlock title="Service Area" content={business.area} />
      <InfoBlock title="About the Business" content={business.description} />
      <InfoBlock
        title="Contact Information"
        content={
          <>
            {business.contact && <p>{business.contact}</p>}
            {business.phone && <p>{business.phone}</p>}
            {business.email && <p>{business.email}</p>}
          </>
        }
      />

      {/* Actions */}
      {isLoggedIn && (
        <div className="bp-actions">
          <button className="bp-btn primary" onClick={openProposalModal}>
            Send Proposal
          </button>
          <button
            className="bp-btn secondary"
            onClick={() => setChatModalOpen(true)}
          >
            Start Chat
          </button>
        </div>
      )}

      {/* Proposal Modal */}
      <Modal
        open={isProposalModalOpen}
        onClose={() => setIsProposalModalOpen(false)}
      >
        <Box className="bp-modal">
          <ProposalForm
            fromBusinessId={currentUserBusinessId}
            fromBusinessName={currentUserBusinessName}
            toBusiness={business}
            onSent={() => {
              setIsProposalModalOpen(false);
              navigate(
                `/business/${businessId}/dashboard/collab/messages?tab=sent`,
                { replace: true }
              );
            }}
          />
        </Box>
      </Modal>

      {/* Chat Modal */}
      <Modal open={chatModalOpen} onClose={() => setChatModalOpen(false)}>
        <Box className="bp-chat-modal">
          <TextField
            multiline
            minRows={3}
            fullWidth
            placeholder="Type your message…"
            value={chatMessage}
            onChange={(e) => setChatMessage(e.target.value)}
          />
          <Button
            sx={{ mt: 2 }}
            onClick={handleSendBusinessMessage}
            disabled={!chatMessage.trim() || sending}
          >
            Send Message
          </Button>
        </Box>
      </Modal>
    </div>
  );
}

/* =========================
   Info Block
========================= */
function InfoBlock({ title, content }) {
  if (!content) return null;

  return (
    <section className="bp-block">
      <h3>{title}</h3>
      <div className="bp-block-content">{content}</div>
    </section>
  );
}
