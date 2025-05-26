import React, { useEffect, useState } from "react";
import API from "../../../../api";

export default function CollabReceivedRequestsTab({ isDevUser, refreshFlag, onStatusChange }) {
  const [receivedRequests, setReceivedRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // טען הצעות שהתקבלו מהשרת, ורענן כש-isDevUser ו-refreshFlag משתנים
  useEffect(() => {
    setLoading(true);
    if (isDevUser) {
      setReceivedRequests([
        {
          _id: "demo-recv-1",
          fromBusiness: { businessName: "מעצבת גרפית" },
          message: "עיצוב משותף לחוברת",
          status: "pending",
          createdAt: "2024-05-30"
        },
        {
          _id: "demo-recv-2",
          fromBusiness: { businessName: "מפיקת אירועים" },
          message: "שיתוף פעולה לאירוע נשים",
          status: "rejected",
          createdAt: "2024-05-28"
        }
      ]);
      setError(null);
      setLoading(false);
    } else {
      async function fetchReceivedRequests() {
        try {
          const res = await API.get("/my/proposals/received"); // נתיב API מתוקן
          setReceivedRequests(res.data.proposalsReceived || []);
          setError(null);
        } catch (err) {
          console.error(err);
          setError("שגיאה בטעינת הצעות שהתקבלו");
        } finally {
          setLoading(false);
        }
      }
      fetchReceivedRequests();
    }
  }, [isDevUser, refreshFlag]);

  // אישור הצעה
  const handleAccept = async (proposalId) => {
    try {
      await API.put(`/my/proposals/${proposalId}/status`, { status: "accepted" }); // נתיב API מתוקן
      setReceivedRequests(prev =>
        prev.map(p =>
          (p.proposalId === proposalId || p._id === proposalId)
            ? { ...p, status: "accepted" }
            : p
        )
      );
      alert("ההצעה אושרה בהצלחה");
      onStatusChange?.();
    } catch (err) {
      console.error(err);
      alert("שגיאה באישור ההצעה");
    }
  };

  // דחיית הצעה
  const handleReject = async (proposalId) => {
    try {
      await API.put(`/my/proposals/${proposalId}/status`, { status: "rejected" }); // נתיב API מתוקן
      setReceivedRequests(prev =>
        prev.map(p =>
          (p.proposalId === proposalId || p._id === proposalId)
            ? { ...p, status: "rejected" }
            : p
        )
      );
      alert("ההצעה נדחתה בהצלחה");
      onStatusChange?.();
    } catch (err) {
      console.error(err);
      alert("שגיאה בדחיית ההצעה");
    }
  };

  if (loading) return <p>טוען הצעות שהתקבלו...</p>;
  if (error)   return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="collab-section">
      <h3 className="collab-title">📥 הצעות שהתקבלו</h3>
      {receivedRequests.length === 0 ? (
        <p>לא התקבלו עדיין הצעות.</p>
      ) : (
        receivedRequests.map(req => (
          <div key={req.proposalId || req._id} className="collab-card">
            <p><strong>מאת:</strong> {req.fromBusinessId?.businessName || "לא ידוע"}</p>
            <p><strong>הודעה:</strong> {req.message || "-"}</p>
            <p><strong>סטטוס:</strong> {req.status}</p>
            <p className="collab-tag">
              התקבל ב־{new Date(req.createdAt).toLocaleDateString("he-IL")}
            </p>
            <div className="flex gap-2 mt-2">
              {req.status === "pending" ? (
                <>
                  <button
                    className="collab-form-button"
                    type="button"
                    onClick={() => handleAccept(req.proposalId || req._id)}
                  >
                    ✅ אשר
                  </button>
                  <button
                    className="collab-form-button"
                    type="button"
                    onClick={() => handleReject(req.proposalId || req._id)}
                  >
                    ❌ דחה
                  </button>
                </>
              ) : (
                <p>סטטוס: {req.status}</p>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
