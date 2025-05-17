// src/components/ChatComponent.jsx
import React from "react";
import ClientChatTab   from "./ClientChatTab";
import BusinessChatTab from "./BusinessChatTab";

export default function ChatComponent({
  userId,
  partnerId,
  initialConversationId,
  isBusiness
}) {
  if (isBusiness) {
    return (
      <BusinessChatTab
        conversationId={initialConversationId}
        businessId={userId}
        customerId={partnerId}
      />
    );
  } else {
    return (
      <ClientChatTab
        conversationId={initialConversationId}
        businessId={partnerId}
        user={{ id: userId }}
      />
    );
  }
}
