import React, { useEffect, useState } from "react";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import API from "../../../../api";
import CollabContractForm from "../CollabContractForm";
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
  handleSendProposal,
}) {
  const myBusinessId = localStorage.getItem("myBusinessId");
  const businessDetails = JSON.parse(localStorage.getItem("businessDetails") || "{}");
  const myBusinessName = businessDetails.businessName || "";

  const [partners, setPartners] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [chatModalOpen, setChatModalOpen] = useState(false);
  const [chatTarget, setChatTarget] = useState(null);
  const [chatMessage, setChatMessage] = useState("");
  const [sending, setSending] = useState(false);

  // מודאל חוזה
  const [contractModalOpen, setContractModalOpen] = useState(false);
  const [contractBusiness, setContractBusiness] = useState(null);

  useEffect(() => {
    async function fetchPartners() {
      try {
        const res = await API.get("/business/findPartners");
        setPartners(res.data.relevant || []);
      } catch (err) {
        console.error("Error fetching partners", err);
      }
    }
    fetchPartners();
    const intervalId = setInterval(fetchPartners, 10000);
    return () => clearInterval(intervalId);
  }, []);

  const filteredPartners = partners.filter((business) => {
    if (searchMode === "category" && searchCategory) {
      return (
        business.category.toLowerCase().includes(searchCategory.toLowerCase()) ||
        (business.complementaryCategories || []).some((cat) =>
          cat.toLowerCase().includes(searchCategory.toLowerCase())
        )
      );
    }
    if (searchMode === "free" && freeText) {
      const text = freeText.toLowerCase();
      return (
        business.businessName.toLowerCase().includes(text) ||
        business.description.toLowerCase().includes(text) ||
        business.category.toLowerCase().includes(text)
      );
    }
    return true;
  });

  const handleOpenProfile = (business) => {
    // הוסף כאן לוגיקה לפתיחת פרופיל
  };

  const openChatModal = (business) => {
    setChatTarget(business);
    setChatMessage("");
    setChatModalOpen(true);
  };

  const handleSendBusinessMessage = async () => {
    if (!chatTarget || !chatMessage.trim()) return;
    setSending(true);
    try {
      await API.post("/business-chat/start", {
        otherBusinessId: chatTarget._id || chatTarget.id,
        text: chatMessage.trim(),
      });
      setSnackbarMessage("ההודעה נשלחה בהצלחה 👍");
      setSnackbarOpen(true);
      setChatModalOpen(false);
    } catch (err) {
      setSnackbarMessage("שגיאה בשליחה: " + (err?.response?.data?.error || err.message));
      setSnackbarOpen(true);
    } finally {
      setSending(false);
    }
  };

  // פתיחת מודאל חוזה
  const openContractModal = (business) => {
    setContractBusiness(business);
    setContractModalOpen(true);
  };
  const closeContractModal = () => setContractModalOpen(false);

  return (
    <div>
      {/* Search Bar */}
      <div className="search-container">
        {/* כאן תוכל להוסיף את שדה החיפוש או הפילטרים שלך */}
      </div>

      {/* Partners List */}
      {filteredPartners.length === 0 ? (
        <p>לא נמצאו שותפים.</p>
      ) : (
        filteredPartners.map((business) => {
          const isMine = business._id === myBusinessId;
          return (
            <div key={business._id || business.id} className={`collab-card${isMine ? " my-business" : ""}`}>
              <h3 className="business-name">
                {business.businessName}
                {isMine && <span className="my-business-badge"> (העסק שלי) </span>}
              </h3>
              <p className="business-category">{business.category}</p>
              <p className="business-desc">{business.description}</p>
              <span className="status-badge">
                סטטוס בקשה: {business.status || "לא ידוע"}
              </span>
              <div className="collab-card-buttons">
                {isMine ? (
                  <span className="disabled-action">לא ניתן לשלוח לעצמך</span>
                ) : (
                  <>
                    <button
                      className="message-box-button"
                      onClick={() => setSelectedBusiness(business)}
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
                      onClick={() => openChatModal(business)}
                    >
                      צ'אט
                    </button>
                    <button
                      className="message-box-button send-contract-button"
                      onClick={() => openContractModal(business)}
                    >
                      📄 שלח חוזה
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })
      )}

      {/* Chat Modal */}
      <Modal open={chatModalOpen} onClose={() => setChatModalOpen(false)}>
        <Box sx={modalStyle}>
          <h3>שלח הודעה אל {chatTarget?.businessName}</h3>
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
            onClick={handleSendBusinessMessage}
            disabled={!chatMessage.trim() || sending}
          >
            שלח
          </Button>
        </Box>
      </Modal>

      {/* Contract Modal עם CollabContractForm */}
      <Modal open={contractModalOpen} onClose={closeContractModal}>
        <Box sx={{ ...modalStyle, maxWidth: 700 }}>
          <CollabContractForm
            currentUser={{ businessName: myBusinessName }}
            partnerBusiness={contractBusiness || {}}
            existingContract={null}
            onSubmit={async (contractData) => {
              setSending(true);
              try {
                await API.post("/collab-contracts/contract/send", contractData);
                setSnackbarMessage("החוזה נשלח בהצלחה 📄");
                setSnackbarOpen(true);
                closeContractModal();
              } catch (err) {
                setSnackbarMessage(
                  "שגיאה בשליחת החוזה: " + (err?.response?.data?.error || err.message)
                );
                setSnackbarOpen(true);
              } finally {
                setSending(false);
              }
            }}
          />
        </Box>
      </Modal>

      {/* Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="success" sx={{ width: "100%" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
}

const modalStyle = {
  backgroundColor: "#fff",
  p: 4,
  borderRadius: 2,
  maxWidth: 420,
  m: "10% auto",
  maxHeight: "80vh",
  overflowY: "auto",
  display: "flex",
  flexDirection: "column",
};
