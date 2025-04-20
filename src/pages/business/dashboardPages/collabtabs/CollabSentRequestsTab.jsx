// קומפוננטה מלאה לטאב 2 – הצעות שנשלחו
// כולל תצוגת כרטיסים, מידע מדויק, תגית תאריך, וכל נתוני הדמו

import React from "react";

export default function CollabSentRequestsTab({ sentRequests }) {
  return (
    <div className="collab-section">
      <h3 className="collab-title">📤 הצעות שנשלחו</h3>
      {sentRequests.length === 0 ? (
        <p>לא נשלחו עדיין הצעות.</p>
      ) : (
        sentRequests.map((req) => (
          <div key={req._id} className="collab-card">
            <p><strong>אל:</strong> {req.toBusinessId?.name || "לא ידוע"}</p>
            <p><strong>נושא:</strong> {req.subject}</p>
            <p><strong>סטטוס:</strong> {req.status}</p>
            <p className="collab-tag">נשלח ב־{new Date(req.createdAt).toLocaleDateString("he-IL")}</p>
            <div className="flex gap-2 mt-2">
              <button className="collab-form-button">📨 שלח שוב</button>
              <button className="collab-form-button">🗑️ ביטול</button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
