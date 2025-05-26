import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import API from "../../../../api"; // עדכן לפי הנתיב אצלך
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
  handleOpenChat,
}) {
  const navigate = useNavigate();
  const [partners, setPartners] = useState({ all: [], relevant: [] });
  const [showAll, setShowAll] = useState(false);
  const [myBusinessId, setMyBusinessId] = useState(null);

  const [chatModalOpen, setChatModalOpen] = useState(false);
  const [proposalModalOpen, setProposalModalOpen] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [proposalText, setProposalText] = useState("");
  const [chatTarget, setChatTarget] = useState(null);
  const [proposalTarget, setProposalTarget] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  // פונקציה להסרת כפילויות לפי id
  function uniqueById(arr) {
    const seen = new Set();
    return arr.filter(item => {
      const id = item._id || item.id;
      if (seen.has(id)) return false;
      seen.add(id);
      return true;
    });
  }

  // שליפת רשימת השותפים + זיהוי העסק שלי
  useEffect(() => {
    async function fetchPartners() {
      try {
        const res = await API.get("/business/findPartners");
        setPartners({
          all: res.data.all || [],
          relevant: res.data.relevant || [],
        });

        if (res.data.myBusinessId) {
          setMyBusinessId(res.data.myBusinessId);
        } else if (res.data.all) {
          const myBiz = res.data.all.find(b => b.isMine);
          if (myBiz) setMyBusinessId(myBiz._id || myBiz.id);
        }
      } catch (err) {
        console.error("Error fetching partners", err);
      }
    }

    fetchPartners();
    const intervalId = setInterval(fetchPartners, 10000);
    return () => clearInterval(intervalId);
  }, []);

  // רשימת עסקים להצגה – רלוונטיים כברירת מחדל, או הכל
  const displayedPartners = showAll ? partners.all : partners.relevant;

  // הסרת כפילויות לפני סינון החיפוש
  const uniquePartners = uniqueById(displayedPartners);

  // חיפוש/סינון קליינט
  const filteredPartners = uniquePartners.filter((business) => {
    if (searchMode === "category" && searchCategory) {
      return (
        business.category
          .toLowerCase()
          .includes(searchCategory.toLowerCase()) ||
        (business.complementaryCategories &&
          business.complementaryCategories.some((cat) =>
            cat.toLowerCase().includes(searchCategory.toLowerCase())
          ))
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
    navigate(`/business-profile/${business._id || business.id}`);
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

        <button
          className="toggle-button"
          onClick={() => setShowAll((prev) => !prev)}
        >
          {showAll ? "הצג עסקים רלוונטיים בלבד" : "הצג את כל העסקים"}
        </button>
      </div>

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
              <h3
                style={{
                  fontSize: "1.4rem",
                  fontWeight: "700",
                  marginBottom: "0.4rem",
                }}
              >
                {business.businessName}
                {isMine && (
                  <span className="my-business-badge"> (העסק שלי) </span>
                )}
              </h3>
              <p className="business-category">{business.category}</p>
              <p>{business.description}</p>
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
                  </>
                )}
              </div>
            </div>
          );
        })
      )}

      {/* מודאל שליחת הודעה בצ'אט */}
      <Modal open={chatModalOpen} onClose={() => setChatModalOpen(false)}>
        <Box
          sx={{
            backgroundColor: "#fff",
            padding: 4,
            borderRadius: 2,
            maxWidth: 400,
            margin: "10% auto",
          }}
        >
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

      {/* מודאל שליחת הצעת שיתוף פעולה */}
      <Modal
        open={proposalModalOpen}
        onClose={() => setProposalModalOpen(false)}
      >
        <Box
          sx={{
            backgroundColor: "#fff",
            padding: 4,
            borderRadius: 2,
            maxWidth: 500,
            margin: "10% auto",
          }}
        >
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
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="success" sx={{ width: "100%" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
}
