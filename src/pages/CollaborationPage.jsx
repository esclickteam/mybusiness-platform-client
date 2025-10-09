// src/pages/CollaborationPage.jsx
import React, { useState } from "react";
import API from "../../api";
import CollabFindPartnerTab from "../components/collabtabs/CollabFindPartnerTab";
import CollabSentRequestsTab from "../components/collabtabs/CollabSentRequestsTab";
import CollabReceivedRequestsTab from "../components/collabtabs/CollabReceivedRequestsTab";

export default function CollaborationPage({ isDevUser }) {
  const [refreshSent, setRefreshSent] = useState(0);
  const [refreshReceived, setRefreshReceived] = useState(0);

  // When creating a proposal → refresh "Sent"
  const handleSendProposal = async (toBusinessId, message) => {
    try {
      await API.post("/business/my/proposals", { toBusinessId, message });
      setRefreshSent((f) => f + 1);
    } catch (err) {
      console.error(err);
      alert("Error sending the proposal");
    }
  };

  // After approve/decline → refresh "Received"
  const handleStatusChange = () => {
    setRefreshReceived((f) => f + 1);
  };

  return (
    <div className="collab-page">
      {/* Find Partners tab */}
      <CollabFindPartnerTab onSend={handleSendProposal} />

      {/* Sent Proposals tab */}
      <CollabSentRequestsTab refreshFlag={refreshSent} />

      {/* Received Proposals tab */}
      <CollabReceivedRequestsTab
        isDevUser={isDevUser}
        refreshFlag={refreshReceived}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
}
