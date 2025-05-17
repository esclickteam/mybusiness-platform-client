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
  // המשתמש מחובר כעסק
  if (isBusiness) {
    return (
      <BusinessChatTab
        conversationId={initialConversationId}
        businessId={userId}
        customerId={partnerId}
      />
    );
  }
  // המשתמש מחובר כלקוח
  return (
    <ClientChatTab
      conversationId={initialConversationId}
      businessId={partnerId}
      user={{ id: userId }}
    />
  );
}
