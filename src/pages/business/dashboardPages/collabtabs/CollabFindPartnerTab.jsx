import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import "./CollabFindPartnerTab.css";

export default function CollabFindPartnerTab({
  searchMode,
  setSearchMode,
  searchCategory,
  setSearchCategory,
  freeText,
  setFreeText,
  categories,
  setSelectedBusiness,
  setOpenModal,
  isDevUser,
  handleSendProposal, // מגיע מהורה
  handleOpenChat,
  partners = []
}) {
  const navigate = useNavigate();
  const [localPartners, setLocalPartners] = useState([]);
  const [chatModalOpen, setChatModalOpen] = useState(false);
  const [proposalModalOpen, setProposalModalOpen] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [proposalText, setProposalText] = useState("");
  const [chatTarget, setChatTarget] = useState(null);
  const [proposalTarget, setProposalTarget] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  useEffect(() => {
    if (partners.length === 0) {
      setLocalPartners([
        {
          id: "biz1",
          businessName: "מאיה שיווק דיגיטלי",
          category: "שיווק",
          description: "מומחית בקידום ממומן וכתיבה שיווקית.",
          status: "מאושר"
        },
        {
          id: "biz2",
          businessName: "יוסי הדפסות",
          category: "עיצוב גרפי",
          description: "הדפסות איכותיות לכל מטרה.",
          status: "ממתין"
        }
      ]);
    } else {
      setLocalPartners(partners);
    }
  }, [partners]);

  const handleOpenProfile = (business) => {
    navigate(`/business-profile/${business.id}`);
  };

  const handleSendProposalWithModal = (business) => {
    setProposalTarget(business);
    setProposalModalOpen(true);
  };

  const handleStartChat = (business) => {
    setChatTarget(business);
    setChatModalOpen(true);
  };

  const handleSendChatMessage = () => {
    if (messageText.trim()) {
      handleOpenChat({ ...chatTarget, message: messageText });
      setChatModalOpen(false);
      setMessageText("");
      setSnackbarMessage("✅ ההודעה נשלחה בהצלחה!");
      setSnackbarOpen(true);
    }
  };

  const handleLocalSendProposal = () => {
    if (proposalText.trim()) {
      handleSendProposal({ ...proposalTarget, text: proposalText });
      setProposalModalOpen(false);
      setProposalText("");
      setSnackbarMessage("✅ ההצעה נשלחה בהצלחה!");
      setSnackbarOpen(true);
    }
  };

  return (
    <div>
      <div className="search-container">
        <div className="search-type-toggle">
          <label>
            <input
              type="radio"
              value="category"
              checked={searchMode === "category"}
              onChange={() => setSearchMode("category")}
            />
            חיפוש לפי תחום
          </label>
          <label>
            <input
              type="radio"
              value="free"
              checked={searchMode === "free"}
              onChange={() => setSearchMode("free")}
            />
            חיפוש חופשי
          </label>
        </div>

        <input
          className="search-input"
          type="text"
          placeholder={searchMode === "category" ? "הקלד תחום לעסק..." : "הקלד מילות מפתח"}
          value={searchMode === "category" ? searchCategory : freeText}
          onChange={(e) =>
            searchMode === "category"
              ? setSearchCategory(e.target.value)
              : setFreeText(e.target.value)
          }
        />
      </div>

      {localPartners.length === 0 ? (
        <p>לא נמצאו שותפים.</p>
      ) : (
        localPartners.map((business) => (
          <div key={business.id} className="collab-card">
            <h3 style={{ fontSize: "1.4rem", fontWeight: "700", marginBottom: "0.4rem" }}>
              {business.businessName}
            </h3>
            <p className="business-category">{business.category}</p>
            <p>{business.description}</p>
            <span className="status-badge">סטטוס בקשה: {business.status}</span>

            <div className="collab-card-buttons">
              <button
                className="message-box-button"
                onClick={() => handleSendProposalWithModal(business)}
              >
                שלח הצעה 📨
              </button>

              <button
                className="message-box-button secondary"
                onClick={() => handleOpenProfile(business)}
              >
                צפייה בפרופיל
              </button>

              <button
                className="message-box-button secondary"
                onClick={() => handleStartChat(business)}
              >
                צ'אט
              </button>
            </div>
          </div>
        ))
      )}

      <Modal open={chatModalOpen} onClose={() => setChatModalOpen(false)}>
        <Box sx={{ backgroundColor: '#fff', padding: 4, borderRadius: 2, maxWidth: 400, margin: '10% auto' }}>
          <h3>שלח הודעה אל {chatTarget?.businessName}</h3>
          <TextField
            multiline
            rows={4}
            fullWidth
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            placeholder="כתוב כאן את ההודעה שלך..."
          />
          <Button
            variant="contained"
            color="primary"
            sx={{ marginTop: 2 }}
            onClick={handleSendChatMessage}
          >
            שלח הודעה
          </Button>
        </Box>
      </Modal>

      <Modal open={proposalModalOpen} onClose={() => setProposalModalOpen(false)}>
        <Box sx={{ backgroundColor: '#fff', padding: 4, borderRadius: 2, maxWidth: 500, margin: '10% auto' }}>
          <h3>שלח הצעה אל {proposalTarget?.businessName}</h3>
          <TextField
            multiline
            rows={5}
            fullWidth
            value={proposalText}
            onChange={(e) => setProposalText(e.target.value)}
            placeholder="פרט את הצעת שיתוף הפעולה שלך..."
          />
          <Button
            variant="contained"
            color="primary"
            sx={{ marginTop: 2 }}
            onClick={handleLocalSendProposal}
          >
            שלח הצעה
          </Button>
        </Box>
      </Modal>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
}
