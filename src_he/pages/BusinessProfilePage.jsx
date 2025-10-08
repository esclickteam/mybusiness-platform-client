import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import API from "../api";
import ProposalForm from "./business/dashboardPages/collabtabs/ProposalForm";
import CreateAgreementForm from "../components/CreateAgreementForm";
// ✅ We added the Layout
import BusinessDashboardLayout from "./business/BusinessDashboardLayout";

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
  const [createAgreementModalOpen, setCreateAgreementModalOpen] = useState(false);

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

  if (loading)
    return <p style={{ textAlign: "center", marginTop: 50 }}>Loading profile...</p>;
  if (error)
    return (
      <p style={{ textAlign: "center", color: "red", marginTop: 50 }}>
        {error}
      </p>
    );
  if (!business)
    return <p style={{ textAlign: "center", marginTop: 50 }}>Business not found.</p>;

  const isOwnerViewingOther =
    currentUserBusinessId && currentUserBusinessId !== businessId;

  const openProposalModal = () => {
    if (!currentUserBusinessName) {
      alert("The sending business name has not been loaded yet, please wait and try again.");
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

  const handleCreateAgreement = () => setCreateAgreementModalOpen(true);
  const closeCreateAgreementModal = () =>
    setCreateAgreementModalOpen(false);

  return (
    // ✅ We wrapped all the content in the business management Layout
    <BusinessDashboardLayout>
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
              window.location.href = "/business/collaborations";
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
            aria-label="Back to collaborations"
          >
            ← Back to collaborations
          </button>
        )}

        {/* Title and Logo */}
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
            <h1
              style={{
                fontSize: 28,
                margin: 0,
                color: "#6c3483",
                fontWeight: "700",
                textShadow: "1px 1px 5px rgba(108, 52, 131, 0.5)",
              }}
              title={business.businessName}
            >
              {business.businessName}
            </h1>
            <p
              style={{
                fontSize: 16,
                margin: 0,
                color: "#9b59b6",
                fontWeight: "500",
              }}
            >
              {business.category}
            </p>
          </div>

          <img
            src={business.logo || "/default-logo.png"}
            alt={`${business.businessName} logo`}
            style={{
              width: 80,
              height: 80,
              objectFit: "cover",
              borderRadius: "50%",
              boxShadow: "0 4px 12px rgba(155,89,182,0.4)",
            }}
          />
        </div>

        {/* Content Blocks */}
        {[ 
          {
            title: "📍 Activity Area",
            content: business.area || "Not defined",
          },
          {
            title: "📝 About the Business",
            content: business.description || "No description available",
          },
          {
            title: "🤝 Desired Collaborations",
            content: (
              <>
                {business.collabPref && (
                  <p>
                    <b>General Preference:</b> {business.collabPref}
                  </p>
                )}
                {business.lookingFor?.length > 0 && (
                  <>
                    <p>
                      <b>Looking for collaborations in fields:</b>
                    </p>
                    <ul style={{ paddingInlineStart: 20 }}>
                      {business.lookingFor.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </>
                )}
                {business.complementaryCategories?.length > 0 && (
                  <>
                    <p>
                      <b>Complementary Categories:</b>
                    </p>
                    <ul style={{ paddingInlineStart: 20 }}>
                      {business.complementaryCategories.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </>
                )}
              </>
            ),
          },
          {
            title: "📞 Contact Details",
            content: (
              <>
                <p>
                  <b>Contact Person:</b> {business.contact}
                </p>
                {business.phone && (
                  <p>
                    <b>Phone:</b> {business.phone}
                  </p>
                )}
                {business.email && (
                  <p>
                    <b>Email:</b> {business.email}
                  </p>
                )}
              </>
            ),
          },
        ].map(({ title, content }, i) => (
          <div
            key={i}
            style={{
              backgroundColor: "#f3eafd",
              borderRadius: 16,
              padding: 20,
              marginBottom: 16,
              boxShadow: "0 4px 10px rgba(107, 72, 163, 0.1)",
            }}
          >
            <h3
              style={{
                margin: "0 0 8px 0",
                color: "#6c3483",
                fontWeight: "700",
              }}
            >
              {title}
            </h3>
            <div style={{ color: "#4b367c" }}>{content}</div>
          </div>
        ))}

        {/* Buttons */}
        <div
          style={{
            display: "flex",
            gap: 12,
            justifyContent: "center",
            marginTop: 24,
          }}
        >
          <button
            onClick={handleCreateAgreement}
            disabled={!currentProposalId}
            title={!currentProposalId ? "You must send a proposal first" : ""}
            style={{
              backgroundColor: !currentProposalId ? "#ccc" : "transparent",
              border: "1.5px solid #8e44ad",
              borderRadius: 20,
              padding: "8px 20px",
              fontWeight: "600",
              color: !currentProposalId ? "#666" : "#8e44ad",
              cursor: !currentProposalId ? "not-allowed" : "pointer",
              boxShadow: !currentProposalId
                ? "none"
                : "0 2px 6px rgba(142,68,173,0.25)",
              transition: "background-color 0.3s ease, color 0.3s ease",
            }}
            onMouseEnter={(e) => {
              if (currentProposalId) {
                e.currentTarget.style.backgroundColor = "#8e44ad";
                e.currentTarget.style.color = "white";
              }
            }}
            onMouseLeave={(e) => {
              if (currentProposalId) {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = "#8e44ad";
              }
            }}
          >
            Create New Agreement
          </button>

          <button
            onClick={openProposalModal}
            style={{
              backgroundColor: "#8e44ad",
              color: "white",
              border: "none",
              padding: "8px 20px",
              borderRadius: 20,
              cursor: "pointer",
              fontWeight: "600",
              boxShadow: "0 2px 8px rgba(142,68,173,0.4)",
              transition: "background-color 0.3s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#732d91")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#8e44ad")}
          >
            Send Proposal
          </button>

          <button
            onClick={openChatModal}
            style={{
              backgroundColor: "transparent",
              border: "1.5px solid #8e44ad",
              color: "#8e44ad",
              padding: "8px 20px",
              borderRadius: 20,
              cursor: "pointer",
              fontWeight: "600",
              boxShadow: "0 2px 6px rgba(142,68,173,0.25)",
              transition: "background-color 0.3s ease, color 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#8e44ad";
              e.currentTarget.style.color = "white";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.color = "#8e44ad";
            }}
          >
            Chat
          </button>
        </div>

        {/* Proposal Modal */}
        <Modal open={isProposalModalOpen} onClose={closeProposalModal}>
          <Box
            sx={{
              backgroundColor: "#fff",
              p: 4,
              borderRadius: 2,
              maxWidth: 600,
              margin: "10% auto",
              maxHeight: "80vh",
              overflowY: "auto",
            }}
          >
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

        {/* Chat Modal */}
        <Modal open={chatModalOpen} onClose={closeChatModal}>
          <Box
            sx={{
              backgroundColor: "#fff",
              p: 4,
              borderRadius: 2,
              maxWidth: 420,
              margin: "10% auto",
              maxHeight: "80vh",
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <h3>Send a message to {business.businessName}</h3>
            <TextField
              autoFocus
              multiline
              minRows={3}
              fullWidth
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              placeholder="Type your first message to the business…"
              sx={{ mb: 2 }}
            />
            <Button
              variant="contained"
              onClick={handleSendBusinessMessage}
              disabled={!chatMessage.trim() || sending}
            >
              Send
            </Button>
          </Box>
        </Modal>

        {/* Create Agreement Modal */}
        <Modal open={createAgreementModalOpen} onClose={closeCreateAgreementModal}>
          <Box
            sx={{
              backgroundColor: "#fff",
              p: 4,
              borderRadius: 2,
              maxWidth: 600,
              margin: "10% auto",
              maxHeight: "80vh",
              overflowY: "auto",
            }}
          >
            <CreateAgreementForm
              fromBusinessId={currentUserBusinessId}
              fromBusinessName={currentUserBusinessName}
              partnerBusiness={business}
              proposalId={currentProposalId}
              onCreated={() => {
                alert("Agreement created successfully!");
                closeCreateAgreementModal();
              }}
              onClose={closeCreateAgreementModal}
            />
          </Box>
        </Modal>
      </div>
    </BusinessDashboardLayout>
  );
}
