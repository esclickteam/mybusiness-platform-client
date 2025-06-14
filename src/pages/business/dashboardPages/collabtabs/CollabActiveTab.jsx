import React, { useEffect, useState } from "react";

export default function CollabActiveTab({ userBusinessId, token }) {
  const [activeCollabs, setActiveCollabs] = useState([]);

  useEffect(() => {
    if (!userBusinessId || !token) return;

    // קריאות מקבילות לשני ה-API
    const fetchSent = fetch("/my/proposals/sent", {
      headers: { Authorization: `Bearer ${token}` },
    }).then((res) => {
      if (!res.ok) throw new Error("Failed to fetch sent proposals");
      return res.json();
    });

    const fetchReceived = fetch("/my/proposals/received", {
      headers: { Authorization: `Bearer ${token}` },
    }).then((res) => {
      if (!res.ok) throw new Error("Failed to fetch received proposals");
      return res.json();
    });

    Promise.all([fetchSent, fetchReceived])
      .then(([sentData, receivedData]) => {
        const sentAccepted = (sentData.proposalsSent || []).filter(
          (p) => p.status === "accepted"
        );
        const receivedAccepted = (receivedData.proposalsReceived || []).filter(
          (p) => p.status === "accepted"
        );

        const combined = [...sentAccepted, ...receivedAccepted];

        const mapped = combined.map((p) => ({
          _id: p._id,
          partnerName:
            p.fromBusinessId._id === userBusinessId
              ? p.toBusinessId.businessName
              : p.fromBusinessId.businessName,
          subject: p.title || p.subject || "ללא נושא",
          startedAt: p.startedAt || p.createdAt || new Date().toISOString(),
        }));

        setActiveCollabs(mapped);
      })
      .catch((err) => {
        console.error("Error loading collaborations:", err);
        setActiveCollabs([]);
      });
  }, [userBusinessId, token]);

  return (
    <div className="collab-section">
      <h3 className="collab-title">🤝 שיתופי פעולה פעילים</h3>
      {activeCollabs.length === 0 ? (
        <p>אין שיתופי פעולה פעילים.</p>
      ) : (
        activeCollabs.map((collab) => (
          <div key={collab._id} className="collab-card">
            <p>
              <strong>עם:</strong> {collab.partnerName}
            </p>
            <p>
              <strong>נושא:</strong> {collab.subject}
            </p>
            <p className="collab-tag">
              התחיל ב־{new Date(collab.startedAt).toLocaleDateString("he-IL")}
            </p>
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
