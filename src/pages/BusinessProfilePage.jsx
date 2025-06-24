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

  const isOwnerViewingOther =
    currentUserBusinessId && currentUserBusinessId !== businessId;

  const openProposalModal = () => {
    if (!currentUserBusinessName) {
      alert("שם העסק השולח עדיין לא נטען, אנא המתן ונסה שוב.");
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
      alert("ההודעה נשלחה בהצלחה!");
      closeChatModal();
    } catch {
      alert("שגיאה בשליחת ההודעה");
    } finally {
      setSending(false);
    }
  };

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
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        color: "#4b367c",
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
            color: "#6c3483",
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

      {/* אזור פעילות */}
      <div
        style={{
          backgroundColor: "#f3eafd",
          borderRadius: 16,
          padding: 20,
          marginBottom: 16,
          boxShadow: "0 4px 10px rgba(107, 72, 163, 0.1)",
        }}
      >
        <h3 style={{ margin: "0 0 8px 0", color: "#6c3483", fontWeight: "700" }}>
          📍 אזור פעילות
        </h3>
        <p style={{ margin: 0 }}>{business.area || "לא מוגדר"}</p>
      </div>

      {/* על העסק */}
      <div
        style={{
          backgroundColor: "#f3eafd",
          borderRadius: 16,
          padding: 20,
          marginBottom: 16,
          boxShadow: "0 4px 10px rgba(107, 72, 163, 0.1)",
        }}
      >
        <h3 style={{ margin: "0 0 8px 0", color: "#6c3483", fontWeight: "700" }}>
          📝 על העסק
        </h3>
        <p style={{ margin: 0 }}>{business.description || "אין תיאור זמין"}</p>
      </div>

      {/* שיתופי פעולה רצויים */}
      {(business.collabPref ||
        (business.lookingFor && business.lookingFor.length) ||
        (business.complementaryCategories &&
          business.complementaryCategories.length)) && (
        <div
          style={{
            backgroundColor: "#f3eafd",
            borderRadius: 16,
            padding: 20,
            marginBottom: 16,
            boxShadow: "0 4px 10px rgba(107, 72, 163, 0.1)",
          }}
        >
          <h3
            style={{ margin: "0 0 8px 0", color: "#6c3483", fontWeight: "700" }}
          >
            🤝 שיתופי פעולה רצויים
          </h3>
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

      {/* פרטי איש הקשר */}
      {business.contact && (
        <div
          style={{
            backgroundColor: "#f3eafd",
            borderRadius: 16,
            padding: 20,
            marginBottom: 16,
            boxShadow: "0 4px 10px rgba(107, 72, 163, 0.1)",
          }}
        >
          <h3 style={{ margin: "0 0 8px 0", color: "#6c3483", fontWeight: "700" }}>
            📞 פרטי איש הקשר
          </h3>
          <p style={{ marginBottom: 8 }}>
            <b>איש קשר:</b> {business.contact}
          </p>
          {business.phone && (
            <p style={{ margin: 0 }}>
              <b>טלפון:</b> {business.phone}
            </p>
          )}
          {business.email && (
            <p style={{ margin: 0 }}>
              <b>אימייל:</b> {business.email}
            </p>
          )}
        </div>
      )}

      {/* כפתורים בסגנון פשוט */}
      <div
        style={{
          marginTop: 20,
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
            padding: "10px 16px",
            borderRadius: 12,
            cursor: "pointer",
            fontWeight: "600",
            fontSize: 14,
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
            padding: "10px 16px",
            borderRadius: 12,
            cursor: "pointer",
            fontWeight: "600",
            fontSize: 14,
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
          disabled={!currentProposalId}
          title={!currentProposalId ? "יש לשלוח הצעה קודם" : ""}
          style={{
            backgroundColor: !currentProposalId ? "#ccc" : "transparent",
            border: "2px solid #8e44ad",
            color: !currentProposalId ? "#666" : "#8e44ad",
            padding: "10px 16px",
            borderRadius: 12,
            cursor: !currentProposalId ? "not-allowed" : "pointer",
            fontWeight: "600",
            fontSize: 14,
            transition: "background-color 0.3s ease",
          }}
        >
          צור הסכם חדש
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
