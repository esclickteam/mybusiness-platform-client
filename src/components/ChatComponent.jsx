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
        const params = isBusiness
          ? { businessId: userId, customerId: partnerId }
          : { businessId: partnerId };

        const { data } = await API.get("/conversations", {
          params,
          withCredentials: true
        });

        setConversationId(data.conversationId);
      } catch (err) {
        console.error("⚠️ failed to init conversation", err);
      }
    };

    initConversation();
  }, [partnerId, conversationId, isBusiness, userId]);

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
      />
    );
  }

  return (
    <ClientChatTab
      conversationId={conversationId}
      businessId={partnerId}
      user={{ id: userId }}
    />
  );
}
