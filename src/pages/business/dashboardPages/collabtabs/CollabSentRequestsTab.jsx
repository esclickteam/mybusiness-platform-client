import React, { useEffect, useState } from "react";
import API from "../../../../api";

export default function CollabSentRequestsTab({ refreshFlag }) {
  const [sentRequests, setSentRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // טען הצעות שנשלחו מהשרת, ורענן בכל שינוי של refreshFlag
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

  // ביטול הצעה לפי proposalId (שימו לב: זה צריך להיות ה-GUID של ההצעה)
  const handleCancelProposal = async (proposalId) => {
    console.log("מנסה לבטל הצעה עם proposalId:", proposalId);
    if (!window.confirm("האם למחוק את ההצעה?")) return;
    try {
      const response = await API.delete(`/business/my/proposals/${proposalId}`);
      console.log("תגובה מביטול הצעה:", response.data);

      // הסרת ההצעה מהרשימה בממשק המשתמש
      setSentRequests((prev) =>
        prev.filter((p) => p.proposalId !== proposalId)
      );
      alert("ההצעה בוטלה בהצלחה");
    } catch (err) {
      console.error("שגיאה בביטול ההצעה:", err.response || err.message || err);
      alert("שגיאה בביטול ההצעה");
    }
  };

  // פונקציית שליחה מחדש (דמו)
  const handleResendProposal = (proposal) => {
    alert(
      `פונקציית שליחה מחדש - לשלוח שוב את ההצעה ל: ${
        proposal.toBusinessId?.businessName || "לא ידוע"
      }`
    );
    // ניתן לממש כאן פתיחת טופס עריכה או שליחה מחדש
  };

  if (loading) return <p>טוען הצעות שנשלחו...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="collab-section">
      <h3 className="collab-title">📤 הצעות שנשלחו</h3>
      {sentRequests.length === 0 ? (
        <p>לא נשלחו עדיין הצעות.</p>
      ) : (
        sentRequests.map((req) => {
          const key = req.proposalId; // מזהה ההצעה - חשוב שזו המחרוזת GUID
          return (
            <div key={key} className="collab-card">
              <p>
                <strong>אל:</strong> {req.toBusinessId?.businessName || "לא ידוע"}
              </p>
              <p>
                <strong>הודעה:</strong> {req.message || "-"}
              </p>
              <p>
                <strong>סטטוס:</strong> {req.status || "לא ידוע"}
              </p>
              <p className="collab-tag">
                נשלח ב־{new Date(req.createdAt).toLocaleDateString("he-IL")}
              </p>
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
                  onClick={() => handleCancelProposal(key)}
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
