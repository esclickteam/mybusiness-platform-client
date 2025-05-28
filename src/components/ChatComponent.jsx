 // src/components/ChatComponent.jsx
import React, { useState, useEffect, useRef } from "react";
import BusinessChatTab from "./BusinessChatTab";
import ClientChatTab   from "./ClientChatTab";
import { io } from "socket.io-client";

export default function ChatComponent({
  userId,
  partnerId,
  initialConversationId,
  customerId: customerIdProp,
  isBusiness,
}) {
  const [conversationId, setConversationId] = useState(initialConversationId);
  const [conversations, setConversations] = useState([]);
  const [loadingConvs, setLoadingConvs] = useState(false);
  const [loadingInit, setLoadingInit] = useState(false);
  const [currentCustomerId, setCurrentCustomerId] = useState(customerIdProp || null);

  const socketRef = useRef(null);

  useEffect(() => {
    if (!userId) return;

    const socketUrl = import.meta.env.VITE_SOCKET_URL;
    const token = localStorage.getItem("token");

    socketRef.current = io(socketUrl, {
      path: "/socket.io",
      transports: ["polling", "websocket"],
      auth: {
        token,
        role: isBusiness ? "business-dashboard" : "chat",
      },
      withCredentials: true,
    });

    if (isBusiness) {
      setLoadingConvs(true);
      socketRef.current.emit("getConversations", { userId }, (res) => {
        if (res.ok) {
          const convs = Array.isArray(res.conversations) ? res.conversations : [];
          setConversations(convs);
          if (!conversationId && convs.length > 0) {
            const first = convs[0];
            const convoId = first._id ?? first.conversationId;
            const custId =
              first.customer?._id ??
              first.participants.find((pid) => pid !== userId) ??
              null;
            setConversationId(convoId);
            setCurrentCustomerId(custId);
          }
        } else {
          console.error("Error loading conversations:", res.error);
        }
        setLoadingConvs(false);
      });
    } else {
      if (!conversationId && partnerId) {
        setLoadingInit(true);
        socketRef.current.emit(
          "startConversation",
          { otherUserId: partnerId },
          (res) => {
            if (res.ok) {
              setConversationId(res.conversationId);
            } else {
              console.error("Failed to start conversation:", res.error);
            }
            setLoadingInit(false);
          }
        );
      }
    }

    return () => {
      socketRef.current.disconnect();
    };
  }, [userId, isBusiness, partnerId]);

  useEffect(() => {
    if (isBusiness && conversationId) {
      const conv = conversations.find(
        (c) => (c._id ?? c.conversationId) === conversationId
      );
      if (conv) {
        const custId =
          conv.customer?._id ??
          conv.participants.find((pid) => pid !== userId) ??
          null;
        setCurrentCustomerId(custId);
      }
    }
  }, [conversationId, isBusiness, conversations, userId]);

  const currentConversation = conversations.find(
    (c) => (c._id ?? c.conversationId) === conversationId
  );
  const businessIdFromConversation =
    currentConversation?.business?._id ??
    currentConversation?.participants.find((pid) => pid !== userId) ??
    partnerId;

  if (loadingInit) return <p>⏳ פותח שיחה…</p>;
  if (loadingConvs) return <p>⏳ טוען שיחות…</p>;
  if (!conversationId) return <p>⏳ אין שיחה זמינה</p>;
  if (!userId) return <p>⏳ טוען משתמש…</p>;

  return isBusiness ? (
    <BusinessChatTab
      conversationId={conversationId}
      businessId={userId}
      customerId={currentCustomerId}
      socket={socketRef.current}
    />
  ) : (
    <ClientChatTab
      conversationId={conversationId}
      businessId={businessIdFromConversation}
      userId={userId}
      socket={socketRef.current}
    />
  );
}
