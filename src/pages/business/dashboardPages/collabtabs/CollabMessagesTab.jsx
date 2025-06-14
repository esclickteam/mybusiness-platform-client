import React, { useEffect, useState } from "react";
import API from "../../../../api";
import PartnershipAgreementsTab from "../PartnershipAgreementsTab";

export default function CollabMessagesTab({ refreshFlag, onStatusChange, userBusinessId }) {
  const [sentMessages, setSentMessages] = useState([]);
  const [receivedMessages, setReceivedMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("sent"); // 'sent', 'received', 'accepted'
  const [selectedAgreementId, setSelectedAgreementId] = useState(null);

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

  if (selectedAgreementId) {
    return (
      <div>
        <button
          onClick={() => setSelectedAgreementId(null)}
          style={{
            marginBottom: 12,
            backgroundColor: "#ccc",
            padding: "6px 12px",
            borderRadius: 6,
            border: "none",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          ← חזור להצעות
        </button>
        <PartnershipAgreementsTab
          selectedId={selectedAgreementId}
          userBusinessId={userBusinessId}
          onClose={() => setSelectedAgreementId(null)}
        />
      </div>
    );
  }

  // סינון לפי הטאב הנבחר
  let messagesToShow = [];
  if (filter === "sent") messagesToShow = sentMessages;
  else if (filter === "received") messagesToShow = receivedMessages;
  else if (filter === "accepted")
    messagesToShow = [...sentMessages, ...receivedMessages].filter((m) => m.status === "accepted");

  // פונקציות לשינוי סטטוס וביטול (כמו שהיו)

  const handleCancelProposal = async (proposalId) => {
    if (!window.confirm("האם למחוק את ההצעה?")) return;
    try {
      await API.delete(`/business/my/proposals/${proposalId}`);
      setSentMessages((prev) => prev.filter((p) => p.proposalId !== proposalId && p._id !== proposalId));
      setReceivedMessages((prev) => prev.filter((p) => p.proposalId !== proposalId && p._id !== proposalId));
      alert("ההצעה בוטלה בהצלחה");
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

  const parseMessage = (message) => {
    if (!message) return {};
    const lines = message.split("\n").map((line) => line.trim());
    const parsed = {};
    lines.forEach((line) => {
      if (line.startsWith("כותרת:")) parsed.title = line.replace("כותרת:", "").trim();
      else if (line.startsWith("תיאור:")) parsed.description = line.replace("תיאור:", "").trim();
      else if (line.startsWith("סכום:")) parsed.amount = line.replace("סכום:", "").trim();
      else if (line.startsWith("תוקף עד:")) parsed.validUntil = line.replace("תוקף עד:", "").trim();
    });
    return parsed;
  };

  if (loading) return <p>טוען הודעות...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

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
        messagesToShow.map((msg) => {
          const { title, description, amount, validUntil } = parseMessage(msg.message);
          return (
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
                <span style={{ marginLeft: 6 }}>
                  {msg.fromBusinessId?.businessName || "לא ידוע"}
                </span>
              </p>
              <p>
                <strong>עסק מקבל:</strong>{" "}
                <span style={{ marginLeft: 6 }}>
                  {msg.toBusinessId?.businessName || "לא ידוע"}
                </span>
              </p>
              <p>
                <strong>כותרת הצעה:</strong> <span style={{ marginLeft: 6 }}>{title || "-"}</span>
              </p>
              <p>
                <strong>תיאור הצעה:</strong>{" "}
                <span style={{ marginLeft: 6 }}>{description || "-"}</span>
              </p>
              <p>
                <strong>סכום:</strong>{" "}
                <span style={{ marginLeft: 6 }}>{amount != null ? amount + " ₪" : "-"}</span>
              </p>
              <p>
                <strong>תוקף הצעה:</strong>{" "}
                <span style={{ marginLeft: 6 }}>
                  {validUntil ? new Date(validUntil).toLocaleDateString("he-IL") : "-"}
                </span>
              </p>
              <p>
                <strong>סטטוס:</strong> <span style={{ marginLeft: 6 }}>{msg.status}</span>
              </p>
              <p
                style={{
                  color: "#666",
                  fontSize: "0.9rem",
                  marginTop: 12,
                  marginBottom: 0,
                }}
              >
                {filter === "sent"
                  ? "נשלח ב־"
                  : filter === "received"
                  ? "התקבל ב־"
                  : "אושר ב־"}
                {new Date(msg.createdAt).toLocaleDateString("he-IL")}
              </p>

              {/* כפתור צפייה בהסכם */}
              {filter === "accepted" && msg.agreementId && (
                <button
                  onClick={() => setSelectedAgreementId(msg.agreementId)}
                  style={{
                    marginTop: 12,
                    backgroundColor: "#6b46c1",
                    color: "white",
                    padding: "8px 16px",
                    borderRadius: 8,
                    border: "none",
                    cursor: "pointer",
                    fontWeight: "bold",
                  }}
                >
                  צפייה בהסכם
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
                      onClick={() => handleResendProposal && handleResendProposal(msg)}
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
          );
        })
      )}
    </div>
  );
}
