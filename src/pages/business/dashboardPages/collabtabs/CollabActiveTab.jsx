import React, { useEffect, useState } from "react";

export default function CollabActiveTab({ userBusinessId, token }) {
  const [view, setView] = useState("sent"); // "sent" | "received"
  const [sentProposals, setSentProposals] = useState([]);
  const [receivedProposals, setReceivedProposals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userBusinessId || !token) return;

    setLoading(true);
    setError(null);

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
        setSentProposals(sentData.proposalsSent || []);
        setReceivedProposals(receivedData.proposalsReceived || []);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, [userBusinessId, token]);

  const proposalsToShow = view === "sent" ? sentProposals : receivedProposals;

  return (
    <div>
      <div style={{ marginBottom: 20, display: "flex", justifyContent: "center", gap: 12 }}>
        <button
          onClick={() => setView("sent")}
          style={{
            backgroundColor: view === "sent" ? "#6b46c1" : "#ccc",
            color: "white",
            padding: "8px 16px",
            border: "none",
            borderRadius: 8,
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          הצעות שנשלחו
        </button>
        <button
          onClick={() => setView("received")}
          style={{
            backgroundColor: view === "received" ? "#6b46c1" : "#ccc",
            color: "white",
            padding: "8px 16px",
            border: "none",
            borderRadius: 8,
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          הצעות שהתקבלו
        </button>
      </div>

      {loading && <p style={{ textAlign: "center" }}>טוען הצעות...</p>}
      {error && <p style={{ color: "red", textAlign: "center" }}>שגיאה: {error}</p>}

      {!loading && proposalsToShow.length === 0 && (
        <p style={{ textAlign: "center" }}>אין הצעות להצגה.</p>
      )}

      {!loading &&
        proposalsToShow.map((proposal) => (
          <div
            key={proposal._id}
            style={{
              border: "1px solid #ddd",
              padding: 16,
              marginBottom: 16,
              borderRadius: 8,
              backgroundColor: "#fff",
              maxWidth: 700,
              margin: "auto",
            }}
          >
            <div>
              <b>עסק שולח:</b> {proposal.fromBusiness?.businessName || "לא ידוע"}
            </div>
            <div>
              <b>עסק מקבל:</b> {proposal.toBusiness?.businessName || "לא ידוע"}
            </div>
            <div>
              <b>כותרת הצעה:</b> {proposal.title || proposal.message || "-"}
            </div>
            <div>
              <b>סטטוס:</b> {proposal.status}
            </div>
            <div>
              <b>תאריך יצירה:</b>{" "}
              {new Date(proposal.createdAt).toLocaleDateString("he-IL")}
            </div>
          </div>
        ))}
    </div>
  );
}
