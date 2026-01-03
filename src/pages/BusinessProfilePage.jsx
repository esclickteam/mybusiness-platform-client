import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import API from "../api";

import ProposalForm from "./business/dashboardPages/collabtabs/ProposalForm";
import CreateAgreementForm from "../components/CreateAgreementForm";

export default function BusinessProfilePage({ resetSearchFilters }) {
  const { businessId } = useParams();

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
  const [createAgreementModalOpen, setCreateAgreementModalOpen] =
    useState(false);

  /* =========================
     🔹 Load public business
     ========================= */
  useEffect(() => {
    let isMounted = true;

    async function fetchBusiness() {
      try {
        const res = await API.get(`/business/${businessId}`);
        if (isMounted) setBusiness(res.data.business);
      } catch {
        if (isMounted) setError("Failed to load business details.");
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchBusiness();
    return () => {
      isMounted = false;
    };
  }, [businessId]);

  /* =========================
     🔹 Load my business (optional)
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
        // Public user – allowed
        setCurrentUserBusinessId(null);
        setCurrentUserBusinessName("");
      }
    }

    fetchMyBusiness();
  }, []);

  /* =========================
     UI states
     ========================= */
  if (loading)
    return (
      <p style={{ textAlign: "center", marginTop: 50 }}>
        Loading business profile…
      </p>
    );

  if (error)
    return (
      <p style={{ textAlign: "center", color: "red", marginTop: 50 }}>
        {error}
      </p>
    );

  if (!business)
    return (
      <p style={{ textAlign: "center", marginTop: 50 }}>
        Business not found.
      </p>
    );

  const isLoggedIn = !!currentUserBusinessId;
  const isOwnerViewingOther =
    isLoggedIn && currentUserBusinessId !== business._id;

  /* =========================
     Actions
     ========================= */
  const openProposalModal = () => {
    if (!currentUserBusinessName) {
      alert("Please wait while your business details load.");
      return;
    }
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
      alert("Message sent successfully.");
      setChatModalOpen(false);
      setChatMessage("");
    } catch {
      alert("Failed to send the message.");
    } finally {
      setSending(false);
    }
  };

  /* =========================
     Render
     ========================= */
  return (
    <div
      style={{
        maxWidth: 700,
        margin: "40px auto",
        padding: 30,
        direction: "ltr",
        textAlign: "left",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        color: "#4b367c",
        background: "linear-gradient(180deg, #ede8fb 0%, #d9d1ff 100%)",
        borderRadius: 20,
        boxShadow: "0 4px 40px rgba(131, 90, 184, 0.2)",
      }}
    >
      {/* Back (internal users only) */}
      {isOwnerViewingOther && (
        <button
          onClick={() => {
            resetSearchFilters?.();
            window.location.href = "/business/collaborations";
          }}
          style={{
            background: "none",
            border: "none",
            color: "#6c3483",
            cursor: "pointer",
            fontSize: 16,
            marginBottom: 24,
            fontWeight: 600,
            textDecoration: "underline",
          }}
        >
          ← Back to Collaborations
        </button>
      )}

      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          backgroundColor: "#fff",
          padding: 20,
          borderRadius: 16,
          marginBottom: 24,
        }}
      >
        <div>
          <h1 style={{ margin: 0 }}>{business.businessName}</h1>
          <p style={{ margin: 0 }}>{business.category}</p>
        </div>
        <img
          src={business.logo || "/default-logo.png"}
          alt="Business logo"
          style={{ width: 80, height: 80, borderRadius: "50%" }}
        />
      </div>

      {/* Info blocks */}
      <Block title="📍 Service Area" content={business.area} />
      <Block title="📝 About the Business" content={business.description} />
      <Block
        title="📞 Contact Information"
        content={
          <>
            {business.contact && <p>{business.contact}</p>}
            {business.phone && <p>{business.phone}</p>}
            {business.email && <p>{business.email}</p>}
          </>
        }
      />

      {/* Actions – only logged in */}
      {isLoggedIn && (
        <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
          <button onClick={openProposalModal}>Send Proposal</button>
          <button onClick={() => setChatModalOpen(true)}>Start Chat</button>
        </div>
      )}

      {/* Proposal Modal */}
      <Modal
        open={isProposalModalOpen}
        onClose={() => setIsProposalModalOpen(false)}
      >
        <Box
          sx={{
            position: "absolute",
            top: 24,
            left: "50%",
            transform: "translateX(-50%)",
            width: "100%",
            maxWidth: 760,
            maxHeight: "calc(100vh - 48px)",
            overflow: "auto",
            bgcolor: "#fff",
            borderRadius: 16,
            boxShadow: "0 10px 40px rgba(0,0,0,0.25)",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <ProposalForm
            fromBusinessId={currentUserBusinessId}
            fromBusinessName={currentUserBusinessName}
            toBusiness={business}
            onSent={(id) => {
              setCurrentProposalId(id);
              setIsProposalModalOpen(false);
            }}
          />
        </Box>
      </Modal>

      {/* Chat Modal */}
      <Modal open={chatModalOpen} onClose={() => setChatModalOpen(false)}>
        <Box
          sx={{
            position: "absolute",
            top: 80,
            left: "50%",
            transform: "translateX(-50%)",
            width: "100%",
            maxWidth: 420,
            bgcolor: "#fff",
            borderRadius: 16,
            p: 4,
          }}
        >
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
   Helper component
   ========================= */
function Block({ title, content }) {
  if (!content) return null;
  return (
    <div
      style={{
        background: "#f3eafd",
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
      }}
    >
      <h3>{title}</h3>
      <div>{content}</div>
    </div>
  );
}
