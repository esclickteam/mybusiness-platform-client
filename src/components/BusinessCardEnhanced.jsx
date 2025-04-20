import React from "react";
import { Button } from "@mui/material";

export default function BusinessCardEnhanced({ business, onSendRequest, onChat }) {
  const hasActiveCollab = business.hasActiveCollab; // true/false
  const existingRequestStatus = business.requestStatus; // "pending", "approved", "rejected", null

  return (
    <div className="collab-card">
      <h3 style={{ fontSize: "1.1rem", fontWeight: "600", marginBottom: "0.3rem" }}>
        🧑‍💼 {business.name}
      </h3>
      <p className="collab-tag">{business.category}</p>
      <p style={{ marginTop: "0.6rem" }}>{business.description || "אין תיאור לעסק זה."}</p>

      {existingRequestStatus && (
        <p className="collab-tag" style={{ backgroundColor: "#ffeaa7", color: "#d35400" }}>
          סטטוס בקשה: {existingRequestStatus === "pending" ? "ממתין לאישור" :
          existingRequestStatus === "approved" ? "מאושר" : "נדחה"}
        </p>
      )}

      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "1rem" }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => onSendRequest(business)}
        >
          🤝 שלח הצעה
        </Button>

        <Button
          variant="outlined"
          disabled={!hasActiveCollab}
          onClick={() => onChat(business)}
        >
          💬 צ׳אט
        </Button>
      </div>
    </div>
  );
}
