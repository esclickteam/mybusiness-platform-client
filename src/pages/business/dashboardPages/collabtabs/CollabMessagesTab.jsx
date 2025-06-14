import React, { useEffect, useState } from "react";
import API from "../../../../api";
import PartnershipAgreementView from "../../../../components/PartnershipAgreementView";

export default function CollabMessagesTab({ refreshFlag, onStatusChange, userBusinessId }) {
  const [sentMessages, setSentMessages] = useState([]);
  const [receivedMessages, setReceivedMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("sent"); // 'sent', 'received', 'accepted'

  // מצב למודל הצגת הסכם
  const [selectedAgreement, setSelectedAgreement] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    setLoading(true);
    async function fetchMessages() {
      try {
        const [sentRes, receivedRes] = await Promise.all([
          API.get("/business/my/proposals/sent"),
          API.get("/business/my/proposals/received"),
        ]);
        setSentMessages(sentRes.data.proposalsSent || []);
        setReceivedMessages(receivedRes.data.proposalsReceived || []);
        setError(null);
      } catch (err) {
        console.error("Error loading proposals:", err);
        setError("שגיאה בטעינת ההודעות");
      } finally {
        setLoading(false);
      }
    }
    fetchMessages();
  }, [refreshFlag]);

  const createAgreementFromProposal = async (proposalId, agreementData) => {
    try {
      const payload = {
        ...agreementData,
        invitedBusinessId: agreementData.invitedBusinessId,
        title: agreementData.title,
        description: agreementData.description,
        giving: agreementData.giving,
        receiving: agreementData.receiving,
        type: agreementData.type,
        payment: agreementData.payment,
        startDate: agreementData.startDate,
        endDate: agreementData.endDate,
        cancelAnytime: agreementData.cancelAnytime,
        confidentiality: agreementData.confidentiality,
        signatureDataUrl: agreementData.signatureDataUrl || "",
        proposalId,
      };
      const res = await API.post('/partnershipAgreements', payload);
      alert('ההסכם נוצר בהצלחה!');
      onStatusChange?.();
      return res.data;
    } catch (err) {
      console.error('Error creating agreement:', err);
      alert('שגיאה ביצירת ההסכם');
    }
  };

  const handleCancelProposal = async (proposalId) => {
    if (!window.confirm("האם למחוק את ההצעה?")) return;
    try {
      await API.delete(`/business/my/proposals/${proposalId}`);
      setSentMessages((prev) => prev.filter((p) => p.proposalId !== proposalId && p._id !== proposalId));
      setReceivedMessages((prev) => prev.filter((p) => p.proposalId !== proposalId && p._id !== proposalId));
      alert("ההצעה בוטלה בהצלחה");
      onStatusChange?.();
    } catch (err) {
      console.error("שגיאה בביטול ההצעה:", err);
      alert("שגיאה בביטול ההצעה");
    }
  };

  const handleAccept = async (proposalId) => {
    try {
      await API.put(`/business/my/proposals/${proposalId}/status`, { status: "accepted" });
      setSentMessages((prev) =>
        prev.map((p) => (p.proposalId === proposalId || p._id === proposalId ? { ...p, status: "accepted" } : p))
      );
      setReceivedMessages((prev) =>
        prev.map((p) => (p.proposalId === proposalId || p._id === proposalId ? { ...p, status: "accepted" } : p))
      );
      alert("ההצעה אושרה בהצלחה");
      onStatusChange?.();
    } catch (err) {
      console.error(err);
      alert("שגיאה באישור ההצעה");
    }
  };

  const handleReject = async (proposalId) => {
    try {
      await API.put(`/business/my/proposals/${proposalId}/status`, { status: "rejected" });
      setSentMessages((prev) =>
        prev.map((p) => (p.proposalId === proposalId || p._id === proposalId ? { ...p, status: "rejected" } : p))
      );
      setReceivedMessages((prev) =>
        prev.map((p) => (p.proposalId === proposalId || p._id === proposalId ? { ...p, status: "rejected" } : p))
      );
      alert("ההצעה נדחתה בהצלחה");
      onStatusChange?.();
    } catch (err) {
      console.error(err);
      alert("שגיאה בדחיית ההצעה");
    }
  };

  const onOpenAgreement = async (agreementId) => {
    try {
      const res = await API.get(`/partnershipAgreements/${agreementId}`);
      setSelectedAgreement(res.data);
      setModalOpen(true);
    } catch {
      alert("אין לך הרשאה לצפות בהסכם זה או שההסכם לא נמצא");
    }
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedAgreement(null);
  };

  let messagesToShow = [];
  if (filter === "sent") messagesToShow = sentMessages;
  else if (filter === "received") messagesToShow = receivedMessages;
  else if (filter === "accepted")
    messagesToShow = [...sentMessages, ...receivedMessages].filter((m) => m.status === "accepted");

  const buttonStylePurple = {
    marginTop: 12,
    backgroundColor: "#6b46c1",
    color: "white",
    padding: "8px 16px",
    borderRadius: 8,
    border: "none",
    cursor: "pointer",
    fontWeight: "bold",
  };

  const buttonStyleBlue = {
    marginTop: 12,
    backgroundColor: "#3182ce",
    color: "white",
    padding: "8px 16px",
    borderRadius: 8,
    border: "none",
    cursor: "pointer",
    fontWeight: "bold",
  };

  return (
    <div style={{ direction: "rtl", fontFamily: "Arial, sans-serif", maxWidth: 700, margin: "auto" }}>
      <div style={{ marginBottom: 20, display: "flex", gap: 12, justifyContent: "center" }}>
        <button
          onClick={() => setFilter("sent")}
          style={{
            padding: "8px 20px",
            borderRadius: 8,
            border: "none",
            cursor: "pointer",
            fontWeight: "bold",
            backgroundColor: filter === "sent" ? "#6b46c1" : "#ccc",
            color: filter === "sent" ? "white" : "black",
          }}
        >
          הצעות שנשלחו
        </button>
        <button
          onClick={() => setFilter("received")}
          style={{
            padding: "8px 20px",
            borderRadius: 8,
            border: "none",
            cursor: "pointer",
            fontWeight: "bold",
            backgroundColor: filter === "received" ? "#6b46c1" : "#ccc",
            color: filter === "received" ? "white" : "black",
          }}
        >
          הצעות שהתקבלו
        </button>
        <button
          onClick={() => setFilter("accepted")}
          style={{
            padding: "8px 20px",
            borderRadius: 8,
            border: "none",
            cursor: "pointer",
            fontWeight: "bold",
            backgroundColor: filter === "accepted" ? "#6b46c1" : "#ccc",
            color: filter === "accepted" ? "white" : "black",
          }}
        >
          הצעות שאושרו
        </button>
      </div>

      {messagesToShow.length === 0 ? (
        <p style={{ textAlign: "center" }}>
          {filter === "sent"
            ? "לא נשלחו עדיין הצעות."
            : filter === "received"
            ? "לא התקבלו עדיין הצעות."
            : "אין הצעות שאושרו להצגה."}
        </p>
      ) : (
        messagesToShow.map((msg) => (
          <div
            key={msg.proposalId || msg._id}
            style={{
              background: "#fff",
              padding: 16,
              borderRadius: 12,
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              marginBottom: 16,
              wordBreak: "break-word",
              lineHeight: 1.6,
            }}
          >
            <p>
              <strong>עסק שולח:</strong>{" "}
              <span style={{ marginLeft: 6 }}>{msg.fromBusinessId?.businessName || "לא ידוע"}</span>
            </p>
            <p>
              <strong>עסק מקבל:</strong>{" "}
              <span style={{ marginLeft: 6 }}>{msg.toBusinessId?.businessName || "לא ידוע"}</span>
            </p>
            <p>
              <strong>כותרת הצעה:</strong> <span style={{ marginLeft: 6 }}>{msg.message || "-"}</span>
            </p>
            <p>
              <strong>סטטוס:</strong> <span style={{ marginLeft: 6 }}>{msg.status}</span>
            </p>

            {/* כפתורים קשורים להסכם */}
            {msg.agreementId && (
              <>
                {/* העסק השולח תמיד רואה צפייה בהסכם */}
                {String(userBusinessId) === String(msg.fromBusinessId?._id) && (
                  <button
                    onClick={() => onOpenAgreement(msg.agreementId._id || msg.agreementId)}
                    style={buttonStylePurple}
                  >
                    צפייה בהסכם
                  </button>
                )}

                {/* העסק השני - אם חתם כבר, רואה צפייה בהסכם */}
                {String(userBusinessId) === String(msg.toBusinessId?._id) &&
                  msg.agreementId.signatures?.invitedBusiness?.signed && (
                    <button
                      onClick={() => onOpenAgreement(msg.agreementId._id || msg.agreementId)}
                      style={buttonStylePurple}
                    >
                      צפייה בהסכם
                    </button>
                  )}

                {/* העסק השני - אם לא חתם עדיין, רואה כפתור חתימה */}
                {String(userBusinessId) === String(msg.toBusinessId?._id) &&
                  !msg.agreementId.signatures?.invitedBusiness?.signed && (
                    <button
                      onClick={() => onOpenAgreement(msg.agreementId._id || msg.agreementId)}
                      style={buttonStyleBlue}
                    >
                      חתום על ההסכם
                    </button>
                  )}
              </>
            )}

            {/* כפתור יצירת הסכם רק להצעות שהסטטוס שלהן הוא accepted ואין עדיין agreementId */}
            {filter === "received" && msg.status === "accepted" && !msg.agreementId && (
              <button
                onClick={async () => {
                  const dummyAgreementData = {
                    invitedBusinessId: msg.fromBusinessId._id,
                    title: "הסכם שותפות לדוגמה",
                    description: "תיאור לדוגמה",
                    giving: "מה שהעסק נותן",
                    receiving: "מה שהעסק מקבל",
                    type: "שותפות",
                    payment: "תשלום",
                    startDate: new Date().toISOString(),
                    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
                    cancelAnytime: true,
                    confidentiality: false,
                    signatureDataUrl: "",
                  };
                  await createAgreementFromProposal(msg.proposalId || msg._id, dummyAgreementData);
                }}
                style={{
                  marginTop: 12,
                  backgroundColor: "#38a169",
                  color: "white",
                  padding: "8px 16px",
                  borderRadius: 8,
                  border: "none",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
              >
                צור הסכם
              </button>
            )}

            <div
              style={{
                marginTop: 12,
                display: "flex",
                gap: 12,
                justifyContent: "flex-end",
              }}
            >
              {filter === "sent" ? (
                <>
                  <button
                    style={{
                      backgroundColor: "#6b46c1",
                      color: "white",
                      border: "none",
                      padding: "8px 16px",
                      borderRadius: 8,
                      cursor: "pointer",
                      fontWeight: "bold",
                    }}
                    onClick={() => alert("שלח שוב (טרם מיושם)")}
                  >
                    📨 שלח שוב
                  </button>
                  <button
                    style={{
                      backgroundColor: "#d53f8c",
                      color: "white",
                      border: "none",
                      padding: "8px 16px",
                      borderRadius: 8,
                      cursor: "pointer",
                      fontWeight: "bold",
                    }}
                    onClick={() => handleCancelProposal(msg.proposalId || msg._id)}
                  >
                    🗑️ ביטול
                  </button>
                </>
              ) : filter === "received" && msg.status === "pending" ? (
                <>
                  <button
                    style={{
                      backgroundColor: "#6b46c1",
                      color: "white",
                      border: "none",
                      padding: "8px 16px",
                      borderRadius: 8,
                      cursor: "pointer",
                      fontWeight: "bold",
                    }}
                    onClick={() => handleAccept(msg.proposalId || msg._id)}
                  >
                    ✅ אשר
                  </button>
                  <button
                    style={{
                      backgroundColor: "#d53f8c",
                      color: "white",
                      border: "none",
                      padding: "8px 16px",
                      borderRadius: 8,
                      cursor: "pointer",
                      fontWeight: "bold",
                    }}
                    onClick={() => handleReject(msg.proposalId || msg._id)}
                  >
                    ❌ דחה
                  </button>
                </>
              ) : (
                <p style={{ alignSelf: "center" }}>סטטוס: {msg.status}</p>
              )}
            </div>
          </div>
        ))
      )}

      {/* מודל הצגת ההסכם */}
      {modalOpen && selectedAgreement && (
        <div
          onClick={closeModal}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.6)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: "white",
              borderRadius: 12,
              padding: 24,
              maxWidth: 600,
              width: "90%",
              maxHeight: "80vh",
              overflowY: "auto",
              direction: "rtl",
              boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
            }}
          >
            <PartnershipAgreementView
              agreementId={selectedAgreement._id || selectedAgreement.agreementId}
              currentBusinessId={userBusinessId}
            />
            <button
              onClick={closeModal}
              style={{
                marginTop: 20,
                padding: "10px 20px",
                borderRadius: 8,
                border: "none",
                backgroundColor: "#6b46c1",
                color: "white",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              סגור
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
