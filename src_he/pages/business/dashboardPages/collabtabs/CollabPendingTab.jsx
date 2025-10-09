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
        console.error("Error loading pending collaborations:", err);
        setError("An error occurred while loading the data.");
      } finally {
        setLoading(false);
      }
    };

    fetchPendingCollabs();
  }, [token]);

  if (loading) return <p>Loading pending collaborations...</p>;
  if (error) return <p>{error}</p>;
  if (pendingCollabs.length === 0) return <p>No pending collaborations.</p>;

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
          <p><strong>Sender:</strong> {collab.fromBusinessId?.businessName}</p>
          <p><strong>Receiver:</strong> {collab.toBusinessId?.businessName}</p>
          <p><strong>Title:</strong> {collab.subject}</p>
          <p><strong>Description:</strong> {collab.description}</p>
          <p><strong>Valid Until:</strong> {collab.expiresAt ? new Date(collab.expiresAt).toLocaleDateString("he-IL") : "Not available"}</p>
          <p><strong>Status:</strong> {collab.status || "Pending"}</p>
        </div>
      ))}
    </div>
  );
}
