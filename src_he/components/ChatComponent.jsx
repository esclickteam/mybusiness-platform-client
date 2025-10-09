import React, { useState, useEffect } from "react";
import { useSocket } from "../context/socketContext";
import { useAuth } from "../context/AuthContext";
import BusinessChatTab from "./BusinessChatTab";
import ClientChatTab from "./ClientChatTab";

export default function ChatComponent({
  partnerId,
  initialConversationId,
  customerId: customerIdProp,
  isBusiness,
}) {
  const socket = useSocket();
  const { user, authToken, initialized } = useAuth();
  // Getting the businessId from the AuthContext
  const businessId =
    user?.businessId?.toString() || user?.business?._id?.toString() || null;

  const [conversationId, setConversationId] = useState(
    initialConversationId || null
  );
  const [conversations, setConversations] = useState([]);
  const [loadingConvs, setLoadingConvs] = useState(false);
  const [loadingInit, setLoadingInit] = useState(false);
  const [currentCustomerId, setCurrentCustomerId] = useState(
    customerIdProp || null
  );

  // Loading conversations for the business
  useEffect(() => {
    if (!businessId || !socket) return;

    if (isBusiness) {
      setLoadingConvs(true);
      socket.emit(
        "getConversations",
        { userId: businessId },
        (res) => {
          setLoadingConvs(false);
          if (!res || typeof res !== "object") {
            console.error("Invalid response from getConversations:", res);
            return;
          }
          if (res.ok) {
            const convs = Array.isArray(res.conversations)
              ? res.conversations
              : [];
            setConversations(convs);
            if (!conversationId && convs.length > 0) {
              const first = convs[0];
              const convoId = first._id ?? first.conversationId;
              const custId = first.participants.find(
                (pid) => pid.toString() !== businessId.toString()
              );
              setConversationId(convoId);
              setCurrentCustomerId(custId);
            }
          } else {
            console.error("Error loading conversations:", res.error);
          }
        }
      );
    } else {
      // Client starts a conversation
      if (!conversationId && partnerId) {
        setLoadingInit(true);
        socket.emit(
          "startConversation",
          { otherUserId: partnerId },
          (res) => {
            setLoadingInit(false);
            if (!res || typeof res !== "object") {
              console.error(
                "Invalid response from startConversation:",
                res
              );
              return;
            }
            if (res.ok) {
              setConversationId(res.conversationId);
            } else {
              console.error("Failed to start conversation:", res.error);
            }
          }
        );
      }
    }
  }, [businessId, isBusiness, partnerId, socket, conversationId]);

  // Updating currentCustomerId when assigning a conversation
  useEffect(() => {
    if (isBusiness && conversationId && conversations.length) {
      const conv = conversations.find(
        (c) => (c._id ?? c.conversationId) === conversationId
      );
      if (conv) {
        const custId = conv.participants.find(
          (pid) => pid.toString() !== businessId.toString()
        );
        setCurrentCustomerId(custId);
      }
    }
  }, [conversationId, isBusiness, conversations, businessId]);

  // Loading states
  if (!initialized) return <p>⏳ Loading user details…</p>;
  if (isBusiness && loadingConvs) return <p>⏳ Loading conversations…</p>;
  if (!conversationId) return <p>⏳ No conversation available</p>;

  return isBusiness ? (
    <BusinessChatTab
      socket={socket}
      conversationId={conversationId}
      businessId={businessId}
      customerId={currentCustomerId}
      customerName={
        // The name of the customer, if known you can extract it from conversations
        conversations.find(c => (c._id ?? c.conversationId) === conversationId)
          ?.otherParty?.name || ""
      }
      userRole="business"
      conversationType="user-business"
      authToken={authToken}
    />
  ) : (
    <ClientChatTab
      socket={socket}
      conversationId={conversationId}
      businessId={partnerId}
      userId={businessId}
      userRole="client"
      conversationType="user-business"
    />
  );
}
