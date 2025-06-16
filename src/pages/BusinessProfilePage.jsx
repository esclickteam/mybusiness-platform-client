import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import API from "../api";
import ProposalForm from "./business/dashboardPages/collabtabs/ProposalForm";

const chatModalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
};

export default function BusinessProfilePage({ currentUserBusinessId: propBusinessId, resetSearchFilters }) {
  const { businessId } = useParams();

  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentUserBusinessId, setCurrentUserBusinessId] = useState(propBusinessId || null);
  const [currentUserBusinessName, setCurrentUserBusinessName] = useState("");

  const [isProposalModalOpen, setIsProposalModalOpen] = useState(false);

  // סטייט וניהול מודאל צ'אט
  const [chatModalOpen, setChatModalOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState("");

  useEffect(() => {
    async function fetchBusiness() {
      try {
        const res = await API.get(`/business/${businessId}`);
        setBusiness(res.data.business);
      } catch (err) {
        setError("שגיאה בטעינת פרטי העסק");
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
      } catch (error) {
        setCurrentUserBusinessId(null);
        setCurrentUserBusinessName("");
      }
    }
    fetchMyBusiness();
  }, []);

  if (loading) return <p style={{ textAlign: "center", marginTop: 50 }}>טוען פרופיל...</p>;
  if (error) return <p style={{ textAlign: "center", color: "red", marginTop: 50 }}>{error}</p>;
  if (!business) return <p style={{ textAlign: "center", marginTop: 50 }}>העסק לא נמצא.</p>;

  const isOwnerViewingOther = currentUserBusinessId && currentUserBusinessId !== businessId;

  const openProposalModal = () => {
    if (!currentUserBusinessName) {
      alert("שם העסק השולח עדיין לא נטען, אנא המתן ונסה שוב.");
      return;
    }
    setIsProposalModalOpen(true);
  };

  const closeProposalModal = () => setIsProposalModalOpen(false);

  const openChatModal = () => setChatModalOpen(true);

  const closeChatModal = () => {
    setChatModalOpen(false);
    setChatMessage("");
  };

  const handleCreateAgreement = () => {
    window.location.href = `/agreements/new?partnerBusinessId=${businessId}`;
  };

  const handleSendChatMessage = () => {
    // כאן אפשר להוסיף לוגיקה לשליחת ההודעה לשרת (API או WebSocket)
    console.log("Sending chat message:", chatMessage);
    closeChatModal();
  };

  return (
    <div
      style={{
        maxWidth: 700,
        margin: "40px auto",
        padding: 30,
        direction: "rtl",
        textAlign: "right",
      }}
    >
      {isOwnerViewingOther && (
        <button
          onClick={() => {
            if (resetSearchFilters) resetSearchFilters();
            window.location.href = "/business/collaborations";
          }}
          style={{
            backgroundColor: "transparent",
            border: "none",
            color: "#8e44ad",
            cursor: "pointer",
            fontSize: 16,
            marginBottom: 24,
            fontWeight: "600",
            padding: 0,
            textDecoration: "underline",
          }}
          aria-label="חזרה לשיתופי פעולה"
        >
          ← חזרה לשיתופי פעולה
        </button>
      )}

      <div
        style={{
          backgroundColor: "#fff",
          borderRadius: 16,
          boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
          color: "#333",
          padding: 30,
        }}
      >
        {/* כל התוכן הקיים שלך... */}

        <div style={{ marginTop: 30, display: "flex", gap: 10, justifyContent: "center" }}>
          <button
            onClick={openProposalModal}
            style={{
              backgroundColor: "#8e44ad",
              color: "white",
              border: "none",
              padding: "12px 20px",
              borderRadius: 30,
              cursor: "pointer",
              fontWeight: "600",
              fontSize: 16,
              boxShadow: "0 4px 14px rgba(142, 68, 173, 0.4)",
              transition: "background-color 0.3s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#732d91")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#8e44ad")}
          >
            שלח הצעה
          </button>

          <button
            onClick={openChatModal}
            style={{
              backgroundColor: "transparent",
              border: "2px solid #8e44ad",
              color: "#8e44ad",
              padding: "12px 20px",
              borderRadius: 30,
              cursor: "pointer",
              fontWeight: "600",
              fontSize: 16,
              transition: "background-color 0.3s ease",
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
            צ'אט
          </button>

          <button
            onClick={handleCreateAgreement}
            style={{
              backgroundColor: "transparent",
              border: "2px solid #8e44ad",
              color: "#8e44ad",
              padding: "12px 20px",
              borderRadius: 30,
              cursor: "pointer",
              fontWeight: "600",
              fontSize: 16,
              transition: "background-color 0.3s ease",
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
            צור הסכם חדש
          </button>
        </div>
      </div>

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
            onSent={() => {
              closeProposalModal();
            }}
          />
        </Box>
      </Modal>

      {/* מודאל צ'אט */}
      <Modal open={chatModalOpen} onClose={closeChatModal}>
        <Box sx={chatModalStyle}>
          <h3>שלח הודעה אל {business.businessName}</h3>
          <TextField
            autoFocus
            multiline
            minRows={3}
            fullWidth
            value={chatMessage}
            onChange={(e) => setChatMessage(e.target.value)}
            placeholder="הקלד הודעה ראשונה לעסק…"
          />
          <Button
            variant="contained"
            sx={{ mt: 2 }}
            disabled={!chatMessage.trim()}
            onClick={handleSendChatMessage}
          >
            שלח
          </Button>
        </Box>
      </Modal>
    </div>
  );
}
