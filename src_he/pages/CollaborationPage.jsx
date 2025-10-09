// src/pages/CollaborationPage.jsx
import React, { useState } from "react";
import API from "../../api";
import CollabFindPartnerTab from "../components/collabtabs/CollabFindPartnerTab";
import CollabSentRequestsTab from "../components/collabtabs/CollabSentRequestsTab";
import CollabReceivedRequestsTab from "../components/collabtabs/CollabReceivedRequestsTab";

export default function CollaborationPage({ isDevUser }) {
  const [refreshSent, setRefreshSent] = useState(0);
  const [refreshReceived, setRefreshReceived] = useState(0);

  // When sending a proposal → refresh Sent
  const handleSendProposal = async (toBusinessId, message) => {
    try {
      await API.post("/business/my/proposals", { toBusinessId, message });
      setRefreshSent(f => f + 1);
    } catch (err) {
      console.error(err);
      alert("Error sending the proposal");
    }
  };

  // After approval/rejection → refresh Received
  const handleStatusChange = () => {
    setRefreshReceived(f => f + 1);
  };

  return (
    <div className="collab-page">
      {/* Partner search tab */}
      <CollabFindPartnerTab onSend={handleSendProposal} />

      {/* Sent proposals tab */}
      <CollabSentRequestsTab refreshFlag={refreshSent} />

      {/* Received proposals tab */}
      <CollabReceivedRequestsTab
        isDevUser={isDevUser}
        refreshFlag={refreshReceived}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
}
