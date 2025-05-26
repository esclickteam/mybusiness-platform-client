import React, { useEffect, useState } from "react";
import API from "../../../../../JS/api";


export default function CollabSentRequestsTab() {
  const [sentRequests, setSentRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // טען הצעות שנשלחו מהשרת
  useEffect(() => {
    async function fetchSentRequests() {
      try {
        const res = await API.get("/business/my/proposals/sent");
        setSentRequests(res.data.proposalsSent || []);
      } catch (err) {
        setError("שגיאה בטעינת הצעות שנשלחו");
      } finally {
        setLoading(false);
      }
    }
    fetchSentRequests();
  }, []);

  // ביטול הצעה לפי proposalId
  const handleCancelProposal = async (proposalId) => {
    if (!window.confirm("האם למחוק את ההצעה?")) return;
    try {
      // קריאה לשרת למחיקת ההצעה (צריך לממש בשרת)
      await API.delete(`/business/my/proposals/${proposalId}`);
      // עדכון רשימת ההצעות בממשק
      setSentRequests((prev) => prev.filter((p) => p.proposalId !== proposalId));
      alert("ההצעה בוטלה בהצלחה");
    } catch {
      alert("שגיאה בביטול ההצעה");
    }
  };

  // שליחה מחדש (דמו)
  const handleResendProposal = (proposal) => {
    alert(`פונקציית שליחה מחדש - לשלוח שוב את ההצעה ל: ${proposal.toBusinessName || proposal.toBusiness?.businessName || "לא ידוע"}`);
    // כאן אפשר לממש לוגיקה לשליחה מחדש או פתיחת טופס עריכה
  };

  if (loading) return <p>טוען הצעות שנשלחו...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="collab-section">
      <h3 className="collab-title">📤 הצעות שנשלחו</h3>
      {sentRequests.length === 0 ? (
        <p>לא נשלחו עדיין הצעות.</p>
      ) : (
        sentRequests.map((req) => (
          <div key={req.proposalId || req._id} className="collab-card">
            <p><strong>אל:</strong> {req.toBusinessName || req.toBusiness?.businessName || "לא ידוע"}</p>
            <p><strong>הודעה:</strong> {req.message || req.text || "-"}</p>
            <p><strong>סטטוס:</strong> {req.status || "לא ידוע"}</p>
            <p className="collab-tag">נשלח ב־{new Date(req.createdAt).toLocaleDateString("he-IL")}</p>
            <div className="flex gap-2 mt-2">
              <button
                className="collab-form-button"
                type="button"
                onClick={() => handleResendProposal(req)}
              >
                📨 שלח שוב
              </button>
              <button
                className="collab-form-button"
                type="button"
                onClick={() => handleCancelProposal(req.proposalId)}
              >
                🗑️ ביטול
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
