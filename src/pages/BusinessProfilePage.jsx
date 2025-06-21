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

  // מזהה ההצעה שנוצרה לאחרונה
  const [currentProposalId, setCurrentProposalId] = useState(null);

  const [isProposalModalOpen, setIsProposalModalOpen] = useState(false);
  const [chatModalOpen, setChatModalOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [createAgreementModalOpen, setCreateAgreementModalOpen] = useState(false);

  // טען פרטי העסק שנבחר
  useEffect(() => {
    async function fetchBusiness() {
      try {
        const res = await API.get(`/business/${businessId}`);
        setBusiness(res.data.business);
      } catch {
        setError("שגיאה בטעינת פרטי העסק");
      } finally {
        setLoading(false);
      }
    }
    fetchBusiness();
  }, [businessId]);

  // טען פרטי העסק של המשתמש הנוכחי
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
    return <p style={{ textAlign: "center", marginTop: 50 }}>טוען פרופיל...</p>;

  if (error)
    return (
      <p style={{ textAlign: "center", color: "red", marginTop: 50 }}>{error}</p>
    );

  if (!business)
    return <p style={{ textAlign: "center", marginTop: 50 }}>העסק לא נמצא.</p>;

  // האם המשתמש צופה בפרופיל עסק אחר
  const isOwnerViewingOther =
    currentUserBusinessId && currentUserBusinessId !== businessId;

  // פתיחת חלון שליחת הצעה
  const openProposalModal = () => {
    if (!currentUserBusinessName) {
      alert("שם העסק השולח עדיין לא נטען, אנא המתן ונסה שוב.");
      return;
    }
    setIsProposalModalOpen(true);
  };
  const closeProposalModal = () => setIsProposalModalOpen(false);

  // פתיחת חלון הצ'אט
  const openChatModal = () => {
    setChatModalOpen(true);
    setChatMessage("");
  };
  const closeChatModal = () => {
    setChatModalOpen(false);
    setChatMessage("");
  };

  // שליחת הודעה דרך צ'אט עסקי
  const handleSendBusinessMessage = async () => {
    if (!chatMessage.trim()) return;
    setSending(true);
    try {
      await API.post("/business-chat/start", {
        otherBusinessId: business._id,
        text: chatMessage.trim(),
      });
      alert("ההודעה נשלחה בהצלחה!");
      closeChatModal();
    } catch {
      alert("שגיאה בשליחת ההודעה");
    } finally {
      setSending(false);
    }
  };

  // פתיחת חלון יצירת הסכם חדש
  const handleCreateAgreement = () => setCreateAgreementModalOpen(true);
  const closeCreateAgreementModal = () => setCreateAgreementModalOpen(false);

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
        <div style={{ display: "flex", alignItems: "center", marginBottom: 24 }}>
          <img
            src={business.logo || "/default-logo.png"}
            alt={`${business.businessName} לוגו`}
            style={{
              width: 140,
              height: 140,
              objectFit: "cover",
              borderRadius: "50%",
              border: "4px solid #9b59b6",
              marginRight: 24,
              boxShadow: "0 4px 12px rgba(155,89,182,0.4)",
            }}
          />
          <div>
            <h1
              style={{ fontSize: 28, marginBottom: 4, color: "#6c3483" }}
              title={business.businessName}
            >
              {business.businessName}
            </h1>
            <p
              style={{ fontSize: 18, color: "#9b59b6", fontWeight: "600" }}
              title={business.category}
            >
              {business.category}
            </p>
          </div>
        </div>

        <div style={{ lineHeight: 1.6, fontSize: 16 }}>
          <p>
            <b>📍 אזור פעילות:</b> {business.area || "לא מוגדר"}
          </p>
          <p>
            <b>📝 תיאור העסק:</b>
          </p>
          <p style={{ marginTop: 8, color: "#555" }}>
            {business.description || "אין תיאור זמין"}
          </p>

          {(business.collabPref ||
            (business.lookingFor && business.lookingFor.length) ||
            (business.complementaryCategories &&
              business.complementaryCategories.length)) && (
            <div style={{ marginTop: 20 }}>
              <h3 style={{ color: "#6c3483" }}>🤝 שיתופי פעולה רצויים:</h3>
              {business.collabPref && (
                <p>
                  <b>העדפה כללית:</b> {business.collabPref}
                </p>
              )}
              {business.lookingFor && business.lookingFor.length > 0 && (
                <>
                  <p>
                    <b>מחפש שיתופי פעולה בתחומים:</b>
                  </p>
                  <ul style={{ paddingLeft: 20 }}>
                    {business.lookingFor.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </>
              )}
              {business.complementaryCategories &&
                business.complementaryCategories.length > 0 && (
                  <>
                    <p>
                      <b>קטגוריות משלימות:</b>
                    </p>
                    <ul style={{ paddingLeft: 20 }}>
                      {business.complementaryCategories.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </>
                )}
            </div>
          )}

          {business.contact && (
            <div style={{ marginTop: 20 }}>
              <h3 style={{ color: "#6c3483" }}>📞 פרטי איש הקשר:</h3>
              <p>{business.contact}</p>
              <div style={{ marginTop: 12 }}>
                {business.phone && (
                  <p>
                    <b>טלפון:</b> {business.phone}
                  </p>
                )}
                {business.email && (
                  <p>
                    <b>אימייל:</b> {business.email}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        <div
          style={{
            marginTop: 30,
            display: "flex",
            gap: 10,
            justifyContent: "center",
          }}
        >
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
          <h3>שלח הודעה אל {business.businessName}</h3>
          <TextField
            autoFocus
            multiline
            minRows={3}
            fullWidth
            value={chatMessage}
            onChange={(e) => setChatMessage(e.target.value)}
            placeholder="הקלד הודעה ראשונה לעסק…"
            sx={{ mb: 2 }}
          />
          <Button
            variant="contained"
            onClick={handleSendBusinessMessage}
            disabled={!chatMessage.trim() || sending}
          >
            שלח
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
              alert("ההסכם נוצר בהצלחה!");
              closeCreateAgreementModal();
            }}
            onClose={closeCreateAgreementModal}
          />
        </Box>
      </Modal>
    </div>
  );
}
