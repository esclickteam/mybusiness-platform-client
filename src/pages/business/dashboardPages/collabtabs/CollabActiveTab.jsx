// קומפוננטה מלאה לטאב 4 – שיתופי פעולה פעילים כולל נתוני דמו ובדיקה למשתמש דמו

import React, { useEffect, useState } from "react";

export default function CollabActiveTab({ isDevUser }) {
  const [activeCollabs, setActiveCollabs] = useState([]);

  useEffect(() => {
    if (isDevUser) {
      setActiveCollabs([
        {
          _id: "demo1",
          partnerName: "מאיה שיווק דיגיטלי",
          subject: "קמפיין קיץ",
          startedAt: "2024-06-01"
        },
        {
          _id: "demo2",
          partnerName: "יוסי עיצוב גרפי",
          subject: "קטלוג מוצרי סתיו",
          startedAt: "2024-05-15"
        }
      ]);
    } else {
      fetch("/api/collab-requests/active")
        .then((res) => res.json())
        .then(setActiveCollabs)
        .catch(console.error);
    }
  }, [isDevUser]);

  return (
    <div className="collab-section">
      <h3 className="collab-title">🤝 שיתופי פעולה פעילים</h3>
      {activeCollabs.length === 0 ? (
        <p>אין שיתופי פעולה פעילים.</p>
      ) : (
        activeCollabs.map((collab) => (
          <div key={collab._id} className="collab-card">
            <p><strong>עם:</strong> {collab.partnerName}</p>
            <p><strong>נושא:</strong> {collab.subject}</p>
            <p className="collab-tag">התחיל ב־{new Date(collab.startedAt).toLocaleDateString("he-IL")}</p>
            <div className="flex gap-2 mt-2">
              <button className="collab-form-button">📂 פתח פרויקט</button>
              <button className="collab-form-button">📞 צור קשר</button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
