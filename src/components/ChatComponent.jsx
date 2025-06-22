import React, { useState, useEffect } from "react";
import { useSocket } from "../context/socketContext"; // קונטקסט של socket
import { useAuth } from "../context/AuthContext";
import BusinessChatTab from "./BusinessChatTab";
import ClientChatTab from "./ClientChatTab";

export default function ChatComponent({
  userId,
  partnerId,
  initialConversationId,
  customerId: customerIdProp,
  isBusiness,
}) {
  const socket = useSocket();
  const { logout } = useAuth();

  const [conversationId, setConversationId] = useState(initialConversationId || null);
  const [conversations, setConversations] = useState([]);
  const [loadingConvs, setLoadingConvs] = useState(false);
  const [loadingInit, setLoadingInit] = useState(false);
  const [currentCustomerId, setCurrentCustomerId] = useState(customerIdProp || null);

  useEffect(() => {
    if (!userId || !socket) return;

    if (isBusiness) {
      setLoadingConvs(true);
      socket.emit("getConversations", { userId }, (res) => {
        setLoadingConvs(false);
        if (!res || typeof res !== "object") {
          console.error("Invalid response from getConversations:", res);
          return;
        }
        if (res.ok) {
          const convs = Array.isArray(res.conversations) ? res.conversations : [];
          setConversations(convs);
          if (!conversationId && convs.length > 0) {
            const first = convs[0];
            const convoId = first._id ?? first.conversationId;
            const custId = first.participants.find((pid) => pid !== userId) ?? null;
            console.log("ChatComponent: setting conversationId and currentCustomerId", convoId, custId);
            setConversationId(convoId);
            setCurrentCustomerId(custId);
          }
        } else {
          console.error("Error loading conversations:", res.error);
        }
      });
    } else {
      if (!conversationId && partnerId) {
        setLoadingInit(true);
        socket.emit("startConversation", { otherUserId: partnerId }, (res) => {
          setLoadingInit(false);
          if (!res || typeof res !== "object") {
            console.error("Invalid response from startConversation:", res);
            return;
          }
          if (res.ok) {
            setConversationId(res.conversationId);
          } else {
            console.error("Failed to start conversation:", res.error);
          }
        });
      }
    }
  }, [userId, isBusiness, partnerId, socket, conversationId]);

  useEffect(() => {
    if (isBusiness && conversationId && conversations.length) {
      const conv = conversations.find(
        (c) => (c._id ?? c.conversationId) === conversationId
      );
      if (conv) {
        const custId = conv.participants.find((pid) => pid !== userId) ?? null;
        console.log("ChatComponent: updated currentCustomerId from conversations:", custId);
        setCurrentCustomerId(custId);
      }
    }
  }, [conversationId, isBusiness, conversations, userId]);

  if (loadingInit) return <p>⏳ פותח שיחה…</p>;
  if (loadingConvs) return <p>⏳ טוען שיחות…</p>;
  if (!conversationId) return <p>⏳ אין שיחה זמינה</p>;
  if (!userId) return <p>⏳ טוען משתמש…</p>;

  return isBusiness ? (
    <BusinessChatTab
      conversationId={conversationId}
      businessId={userId}
      customerId={currentCustomerId}
      socket={socket}
      userRole="business"   // העברת userRole לעסק
    />
  ) : (
    <ClientChatTab
      conversationId={conversationId}
      businessId={partnerId}
      userId={userId}
      socket={socket}
      userRole="client"     // העברת userRole ללקוח
    />
  );
}
