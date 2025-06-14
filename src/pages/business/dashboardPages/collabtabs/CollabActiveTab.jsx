import React, { useEffect, useState } from "react";
import API from "@api"; // ייבוא ה-API

export default function CollabActiveTab({ userBusinessId, token }) {
  const [view, setView] = useState("sent"); // "sent" | "received"
  const [sentProposals, setSentProposals] = useState([]);
  const [receivedProposals, setReceivedProposals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userBusinessId || !token) return;

    async function fetchProposals() {
      setLoading(true);
      setError(null);
      try {
        const sentRes = await API.get("/business/my/proposals/sent");
        const receivedRes = await API.get("/business/my/proposals/received");
        setSentProposals(sentRes.data.proposalsSent || []);
        setReceivedProposals(receivedRes.data.proposalsReceived || []);
      } catch (err) {
        setError(err.message || "שגיאה בטעינת ההצעות");
      } finally {
        setLoading(false);
      }
    }

    fetchProposals();
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
              <b>עסק שולח:</b> {proposal.fromBusinessId?.businessName || "לא ידוע"}
            </div>
            <div>
              <b>עסק מקבל:</b> {proposal.toBusinessId?.businessName || "לא ידוע"}
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
