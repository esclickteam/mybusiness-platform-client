import React, { useEffect, useState } from "react";
import API from "../../../../api";

export default function CollabSentRequestsTab({ refreshFlag }) {
  const [sentRequests, setSentRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    async function fetchSentRequests() {
      try {
        const res = await API.get("/business/my/proposals/sent");
        setSentRequests(res.data.proposalsSent || []);
        setError(null);
      } catch (err) {
        console.error("Error loading sent proposals:", err);
        setError("שגיאה בטעינת הצעות שנשלחו");
      } finally {
        setLoading(false);
      }
    }
    fetchSentRequests();
  }, [refreshFlag]);

  const handleCancelProposal = async (proposalId) => {
    if (!window.confirm("האם למחוק את ההצעה?")) return;
    try {
      await API.delete(`/business/my/proposals/${proposalId}`);
      setSentRequests((prev) => prev.filter((p) => p.proposalId !== proposalId));
      alert("ההצעה בוטלה בהצלחה");
    } catch (err) {
      console.error("שגיאה בביטול ההצעה:", err.response || err.message || err);
      alert("שגיאה בביטול ההצעה");
    }
  };

  const handleResendProposal = (proposal) => {
    alert(
      `פונקציית שליחה מחדש - לשלוח שוב את ההצעה ל: ${
        proposal.toBusinessId?.businessName || "לא ידוע"
      }`
    );
    // כאן אפשר לממש פתיחת טופס עריכה/שליחה מחדש
  };

  const parseMessage = (message) => {
    if (!message) return {};
    const lines = message.split('\n').map(line => line.trim());
    const parsed = {};
    lines.forEach(line => {
      if (line.startsWith('כותרת:')) parsed.title = line.replace('כותרת:', '').trim();
      else if (line.startsWith('תיאור:')) parsed.description = line.replace('תיאור:', '').trim();
      else if (line.startsWith('סכום:')) parsed.amount = line.replace('סכום:', '').trim();
      else if (line.startsWith('תוקף עד:')) parsed.validUntil = line.replace('תוקף עד:', '').trim();
    });
    return parsed;
  };

  if (loading) return <p>טוען הצעות שנשלחו...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="collab-section" style={{ direction: 'rtl', fontFamily: 'Arial, sans-serif', maxWidth: 700, margin: 'auto' }}>
      <h3 className="collab-title" style={{ color: '#6b46c1', marginBottom: 20, textAlign: 'center' }}>📤 הצעות שנשלחו</h3>
      {sentRequests.length === 0 ? (
        <p style={{ textAlign: 'center' }}>לא נשלחו עדיין הצעות.</p>
      ) : (
        sentRequests.map((req) => {
          const { title, description, amount, validUntil } = parseMessage(req.message);
          return (
            <div
              key={req.proposalId}
              className="collab-card"
              style={{
                background: '#fff',
                padding: 16,
                borderRadius: 12,
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                marginBottom: 16,
                wordBreak: 'break-word'
              }}
            >
              <p><strong>עסק שולח:</strong> {req.fromBusinessId?.businessName || "לא ידוע"}</p>
              <p><strong>עסק מקבל:</strong> {req.toBusinessId?.businessName || "לא ידוע"}</p>
              <p><strong>כותרת הצעה:</strong> {title || "-"}</p>
              <p><strong>תיאור הצעה:</strong> {description || "-"}</p>
              <p><strong>סכום:</strong> {amount || "-"}</p>
              <p><strong>תוקף עד:</strong> {validUntil || "-"}</p>
              <p><strong>סטטוס:</strong> {req.status || "לא ידוע"}</p>
              <p style={{ color: '#666', fontSize: '0.9rem' }}>
                נשלח ב־{new Date(req.createdAt).toLocaleDateString("he-IL")}
              </p>
              <div style={{ marginTop: 12, display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
                <button
                  style={{
                    backgroundColor: '#6b46c1',
                    color: 'white',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: 8,
                    cursor: 'pointer',
                    fontWeight: 'bold',
                  }}
                  onClick={() => handleResendProposal(req)}
                >
                  📨 שלח שוב
                </button>
                <button
                  style={{
                    backgroundColor: '#d53f8c',
                    color: 'white',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: 8,
                    cursor: 'pointer',
                    fontWeight: 'bold',
                  }}
                  onClick={() => handleCancelProposal(req.proposalId)}
                >
                  🗑️ ביטול
                </button>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
