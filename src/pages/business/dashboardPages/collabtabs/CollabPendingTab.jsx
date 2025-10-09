import React, { useEffect, useState } from "react";
import API from "../../../../api";

export default function CollabPendingTab({ token }) {
  const [pendingCollabs, setPendingCollabs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPendingCollabs = async () => {
      try {
        const res = await API.get("/collab-contracts/collaborations/pending", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPendingCollabs(res.data.pendingCollaborations);
      } catch (err) {
        console.error("שגיאה בטעינת שיתופי פעולה בהמתנה:", err);
        setError("אירעה שגיאה בעת טעינת הנתונים.");
      } finally {
        setLoading(false);
      }
    };

    fetchPendingCollabs();
  }, [token]);

  if (loading) return <p>טוען שיתופי פעולה בהמתנה...</p>;
  if (error) return <p>{error}</p>;
  if (pendingCollabs.length === 0) return <p>אין שיתופי פעולה בהמתנה.</p>;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {pendingCollabs.map((collab) => (
        <div
          key={collab._id}
          style={{
            background: "#f5f5f5",
            padding: "16px",
            borderRadius: "8px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
            direction: "rtl",
          }}
        >
          <p><strong>שולח:</strong> {collab.fromBusinessId?.businessName}</p>
          <p><strong>מקבל:</strong> {collab.toBusinessId?.businessName}</p>
          <p><strong>כותרת:</strong> {collab.subject}</p>
          <p><strong>תיאור:</strong> {collab.description}</p>
          <p><strong>תוקף:</strong> {collab.expiresAt ? new Date(collab.expiresAt).toLocaleDateString("he-IL") : "לא זמין"}</p>
          <p><strong>סטטוס:</strong> {collab.status || "בהמתנה"}</p>
        </div>
      ))}
    </div>
  );
}
