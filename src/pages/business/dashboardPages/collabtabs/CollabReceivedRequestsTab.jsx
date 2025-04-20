// קומפוננטה מלאה לטאב 3 – הצעות שהתקבלו כולל דמו

import React, { useEffect, useState } from "react";

export default function CollabReceivedRequestsTab({ isDevUser }) {
  const [receivedRequests, setReceivedRequests] = useState([]);

  useEffect(() => {
    if (isDevUser) {
      setReceivedRequests([
        {
          _id: "demo-recv-1",
          fromBusinessId: { name: "מעצבת גרפית" },
          subject: "עיצוב משותף לחוברת",
          status: "pending",
          createdAt: "2024-05-30"
        },
        {
          _id: "demo-recv-2",
          fromBusinessId: { name: "מפיקת אירועים" },
          subject: "שיתוף פעולה לאירוע נשים",
          status: "rejected",
          createdAt: "2024-05-28"
        }
      ]);
    } else {
      fetch("/api/collab-requests/received")
        .then((res) => res.json())
        .then(setReceivedRequests)
        .catch(console.error);
    }
  }, [isDevUser]);

  return (
    <div className="collab-section">
      <h3 className="collab-title">📥 הצעות שהתקבלו</h3>
      {receivedRequests.length === 0 ? (
        <p>לא התקבלו עדיין הצעות.</p>
      ) : (
        receivedRequests.map((req) => (
          <div key={req._id} className="collab-card">
            <p><strong>מאת:</strong> {req.fromBusinessId?.name || "לא ידוע"}</p>
            <p><strong>נושא:</strong> {req.subject}</p>
            <p><strong>סטטוס:</strong> {req.status}</p>
            <p className="collab-tag">התקבל ב־{new Date(req.createdAt).toLocaleDateString("he-IL")}</p>
            <div className="flex gap-2 mt-2">
              <button className="collab-form-button">✅ אשר</button>
              <button className="collab-form-button">❌ דחה</button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}