import React, { useState } from "react";
import CollabActiveTab from "./collabtabs/CollabActiveTab";
import PartnershipAgreementsTab from "./PartnershipAgreementsTab";

export default function CollabCollaborationsTab({ isDevUser, userBusinessId, token }) {
  const [activeView, setActiveView] = useState("active"); // 'active' או 'agreements'

  return (
    <div style={{ maxWidth: 900, margin: "auto" }}>
      <div style={{ display: "flex", justifyContent: "center", gap: 12, marginBottom: 20 }}>
        <button
          style={{
            backgroundColor: activeView === "active" ? "#6b46c1" : "#ccc",
            color: "white",
            border: "none",
            padding: "8px 16px",
            borderRadius: 8,
            cursor: "pointer",
            fontWeight: "bold",
          }}
          onClick={() => setActiveView("active")}
        >
          שיתופי פעולה פעילים
        </button>
        <button
          style={{
            backgroundColor: activeView === "agreements" ? "#6b46c1" : "#ccc",
            color: "white",
            border: "none",
            padding: "8px 16px",
            borderRadius: 8,
            cursor: "pointer",
            fontWeight: "bold",
          }}
          onClick={() => setActiveView("agreements")}
        >
          הסכמי שיתוף פעולה
        </button>
      </div>

      {activeView === "active" && (
        <CollabActiveTab isDevUser={isDevUser} userBusinessId={userBusinessId} token={token} />
      )}
      {activeView === "agreements" && <PartnershipAgreementsTab userBusinessId={userBusinessId} />}
    </div>
  );
}
