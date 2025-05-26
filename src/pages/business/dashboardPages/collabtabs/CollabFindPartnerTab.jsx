import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import API from "../../../../api"; // עדכן לפי הנתיב שלך
import socket from "../../../../socket"; // חיבור לסוקט (socket.io client)
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
  handleSendProposal, // פונקציה מהורה לשליחת הצעה: (toBusinessId, message)
}) {
  const navigate = useNavigate();
  const [partners, setPartners] = useState([]);
  const [myBusinessId, setMyBusinessId] = useState(null);

  // מודאלים וניהול צ'אט
  const [chatModalOpen, setChatModalOpen] = useState(false);
  const [proposalModalOpen, setProposalModalOpen] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [proposalText, setProposalText] = useState("");
  const [chatTarget, setChatTarget] = useState(null);
  const [proposalTarget, setProposalTarget] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  // ניהול שיחה - מזהה היסטוריית הודעות
  const [conversationId, setConversationId] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");

  // טען שותפים ומזהה העסק שלי
  useEffect(() => {
    async function fetchPartners() {
      try {
        const res = await API.get("/business/findPartners");
        setPartners(res.data.relevant || []);
        if (res.data.myBusinessId) {
          setMyBusinessId(res.data.myBusinessId);
        } else {
          const mine = (res.data.relevant || []).find((b) => b.isMine);
          if (mine) setMyBusinessId(mine._id || mine.id);
        }
      } catch (err) {
        console.error("Error fetching partners", err);
      }
    }
    fetchPartners();
    const intervalId = setInterval(fetchPartners, 10000);
    return () => clearInterval(intervalId);
  }, []);

  // סינון לפי חיפוש
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

  // ניווט לפרופיל עסק
  const handleOpenProfile = (business) => {
    navigate(`/business-profile/${business._id || business.id}`);
  };

  // פתיחת מודאל שליחת הצעה
  const openProposalModal = (business) => {
    setProposalTarget(business);
    setProposalModalOpen(true);
  };

  // פתיחת מודאל צ'אט והתחלת שיחה
  const openChatModal = async (business) => {
    try {
      const res = await API.post("/business-chat/start", {
        otherBusinessId: business._id || business.id,
      });
      const convId = res.data.conversationId;
      setConversationId(convId);
      setChatTarget(business);
      setChatModalOpen(true);

      socket.emit("joinConversation", convId);

      // טען היסטוריית הודעות
      const historyRes = await API.get(`/business-chat/${convId}/messages`);
      setChatMessages(historyRes.data.messages);
    } catch (err) {
      console.error("Error starting chat:", err);
      setSnackbarMessage("❌ שגיאה בפתיחת הצ'אט");
      setSnackbarOpen(true);
    }
  };

  // שליחת הודעה בצ'אט
  const sendChatMessage = () => {
    if (!chatInput.trim()) return;
    const msg = {
      conversationId,
      from: localStorage.getItem("businessId"),
      to: chatTarget._id || chatTarget.id,
      text: chatInput.trim(),
    };
    socket.emit("sendMessage", msg, null, (ack) => {
      if (ack.ok) {
        setChatMessages((prev) => [...prev, ack.message]);
        setChatInput("");
      } else {
        setSnackbarMessage("❌ שגיאה בשליחת ההודעה");
        setSnackbarOpen(true);
      }
    });
  };

  // מאזין להודעות חדשות בסוקט
  useEffect(() => {
    socket.on("newMessage", (msg) => {
      if (msg.conversationId === conversationId) {
        setChatMessages((prev) => [...prev, msg]);
      }
    });
    return () => {
      socket.off("newMessage");
    };
  }, [conversationId]);

  // שליחת הצעה
  const handleSubmitProposal = () => {
    if (!proposalText.trim()) return;
    handleSendProposal(proposalTarget._id || proposalTarget.id, proposalText.trim());
    setProposalModalOpen(false);
    setProposalText("");
    setSnackbarMessage("✅ ההצעה נשלחה בהצלחה!");
    setSnackbarOpen(true);
  };

  return (
    <div>
      {/* --- Search Bar --- */}
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
          placeholder={
            searchMode === "category"
              ? "הקלד תחום לעסק..."
              : "הקלד מילות מפתח"
          }
          value={searchMode === "category" ? searchCategory : freeText}
          onChange={(e) =>
            searchMode === "category"
              ? setSearchCategory(e.target.value)
              : setFreeText(e.target.value)
          }
        />
      </div>

      {/* --- Partners List --- */}
      {filteredPartners.length === 0 ? (
        <p>לא נמצאו שותפים.</p>
      ) : (
        filteredPartners.map((business) => {
          const isMine =
            myBusinessId &&
            (business._id === myBusinessId || business.id === myBusinessId);

          return (
            <div
              key={business._id || business.id}
              className={`collab-card${isMine ? " my-business" : ""}`}
            >
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
                      onClick={() => openProposalModal(business)}
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
                  </>
                )}
              </div>
            </div>
          );
        })
      )}

      {/* --- Chat Modal --- */}
      <Modal open={chatModalOpen} onClose={() => setChatModalOpen(false)}>
        <Box sx={modalStyle}>
          <h3>צ'אט עם {chatTarget?.businessName}</h3>
          <div
            style={{
              height: 300,
              overflowY: "auto",
              border: "1px solid #ccc",
              padding: 8,
              marginBottom: 12,
              backgroundColor: "#f9f9f9",
            }}
          >
            {chatMessages.map((m, i) => (
              <div
                key={i}
                style={{
                  marginBottom: 8,
                  textAlign:
                    m.from === localStorage.getItem("businessId")
                      ? "right"
                      : "left",
                }}
              >
                <b>{m.from === localStorage.getItem("businessId") ? "אני" : "הם"}:</b>{" "}
                {m.text}
              </div>
            ))}
          </div>
          <TextField
            multiline
            rows={2}
            fullWidth
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            placeholder="כתוב כאן את ההודעה שלך..."
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendChatMessage();
              }
            }}
          />
          <Button variant="contained" sx={{ mt: 2 }} onClick={sendChatMessage}>
            שלח הודעה
          </Button>
        </Box>
      </Modal>

      {/* --- Proposal Modal --- */}
      <Modal open={proposalModalOpen} onClose={() => setProposalModalOpen(false)}>
        <Box sx={modalStyle}>
          <h3>שלח הצעה אל {proposalTarget?.businessName}</h3>
          <TextField
            multiline
            rows={5}
            fullWidth
            value={proposalText}
            onChange={(e) => setProposalText(e.target.value)}
            placeholder="פרט את הצעת שיתוף הפעולה שלך..."
          />
          <Button variant="contained" sx={{ mt: 2 }} onClick={handleSubmitProposal}>
            שלח הצעה
          </Button>
        </Box>
      </Modal>

      {/* --- Snackbar --- */}
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

// סגנון אחיד למודאלים
const modalStyle = {
  backgroundColor: "#fff",
  p: 4,
  borderRadius: 2,
  maxWidth: 500,
  m: "10% auto",
};
