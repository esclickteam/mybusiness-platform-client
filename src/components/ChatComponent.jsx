// src/components/ChatComponent.jsx
import React, { useState, useEffect } from "react";
import API from "../api";
import ClientChatTab from "./ClientChatTab";
import BusinessChatTab from "./BusinessChatTab";

export default function ChatComponent({
  userId,
  partnerId,
  initialConversationId,
  isBusiness
}) {
  const [conversationId, setConversationId] = useState(initialConversationId);

  // Initialize or fetch conversation if not provided
  useEffect(() => {
    if (!partnerId || conversationId) return;

    const initConversation = async () => {
      try {
        // Create or retrieve a conversation via POST
        const { data } = await API.post(
          "/messages/conversations",
          { otherId: partnerId },
          { withCredentials: true }
        );
        setConversationId(data.conversationId);
      } catch (err) {
        console.error("⚠️ failed to init conversation", err);
      }
    };

    initConversation();
  }, [partnerId, conversationId]);

  // Show loading state until conversationId is ready
  if (!conversationId) {
    return <p>⏳ טוען שיחה...</p>;
  }

  // Render appropriate chat tab
  if (isBusiness) {
    return (
      <BusinessChatTab
        conversationId={conversationId}
        businessId={userId}
        customerId={partnerId}
        userId={userId}       
      />
    );
  }

  return (
    <ClientChatTab
      conversationId={conversationId}
      businessId={partnerId}
      userId={userId}
    />
  );
}
