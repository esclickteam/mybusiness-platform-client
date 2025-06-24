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
    <div className="page-container">
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

      <aside className="sidebar">
        <ul>
          <li><a href="#profile" className="active">פרופיל עסקי</a></li>
          <li><a href="#collaborations">שיתופי פעולה רצויים</a></li>
          <li><a href="#contact">פרטי קשר</a></li>
          <li><a href="#actions">פעולות</a></li>
        </ul>
      </aside>

      <main className="main-content" dir="rtl">
        <section id="profile" className="profile-section">
          <h3>📇 פרופיל עסקי</h3>
          <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 20 }}>
            <img
              src={business.logo || "/default-logo.png"}
              alt={`${business.businessName} לוגו`}
              style={{
                width: 140,
                height: 140,
                objectFit: "cover",
                borderRadius: "50%",
                border: "4px solid #9b59b6",
                boxShadow: "0 4px 12px rgba(155,89,182,0.4)",
              }}
            />
            <div>
              <h2 style={{ color: "#6c3483", margin: 0 }}>{business.businessName}</h2>
              <p style={{ color: "#9b59b6", fontWeight: "600", fontSize: "1.2rem" }}>
                {business.category}
              </p>
            </div>
          </div>
          <p><b>📍 אזור פעילות:</b> {business.area || "לא מוגדר"}</p>
          <p><b>📝 תיאור העסק:</b></p>
          <p style={{ color: "#555" }}>{business.description || "אין תיאור זמין"}</p>
        </section>

        <section id="collaborations" className="profile-section">
          <h3>🤝 שיתופי פעולה רצויים</h3>
          {(business.collabPref ||
            (business.lookingFor && business.lookingFor.length) ||
            (business.complementaryCategories &&
              business.complementaryCategories.length)) ? (
            <>
              {business.collabPref && <p><b>העדפה כללית:</b> {business.collabPref}</p>}
              {business.lookingFor && business.lookingFor.length > 0 && (
                <>
                  <p><b>מחפש שיתופי פעולה בתחומים:</b></p>
                  <ul style={{ paddingLeft: 20 }}>
                    {business.lookingFor.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </>
              )}
              {business.complementaryCategories && business.complementaryCategories.length > 0 && (
                <>
                  <p><b>קטגוריות משלימות:</b></p>
                  <ul style={{ paddingLeft: 20 }}>
                    {business.complementaryCategories.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </>
              )}
            </>
          ) : (
            <p>אין שיתופי פעולה מוזנים.</p>
          )}
        </section>

        <section id="contact" className="profile-section">
          <h3>📞 פרטי איש הקשר</h3>
          <p><b>איש קשר:</b> {business.contact}</p>
          <p><b>טלפון:</b> {business.phone}</p>
          <p><b>אימייל:</b> {business.email}</p>
        </section>

        <section id="actions" className="profile-section" style={{ display: "flex", gap: 10, justifyContent: "center" }}>
          <button className="btn-primary" onClick={openProposalModal}>
            שלח הצעה
          </button>
          <button className="btn-secondary" onClick={openChatModal}>
            צ'אט
          </button>
          <button
            className="btn-secondary"
            disabled={!currentProposalId}
            title={!currentProposalId ? "יש לשלוח הצעה קודם" : ""}
            style={{ cursor: !currentProposalId ? "not-allowed" : "pointer" }}
            onClick={handleCreateAgreement}
          >
            צור הסכם חדש
          </button>
        </section>
      </main>

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
