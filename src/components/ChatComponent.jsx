import React, { useState, useEffect, useRef } from "react";
import BusinessChatTab from "./BusinessChatTab";
import ClientChatTab from "./ClientChatTab";
import createSocket from "../socket"; // השתמשנו בפונקציה שאתה מייצא מקובץ socket.js

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

  // 1. אתחול הסוקט (פעם אחת בלבד) וטעינת שיחות/פתיחת שיחה
  useEffect(() => {
    if (!userId) return;
    if (socketRef.current) return; // כבר אתחלנו

    async function setupSocket() {
      const sock = await createSocket();
      if (!sock) return; // אין טוקן תקין, כבר הפניית login

      sock.connect();
      socketRef.current = sock;

      // טעינת שיחות עבור עסק
      if (isBusiness) {
        setLoadingConvs(true);
        sock.emit("getConversations", { userId }, (res) => {
          setLoadingConvs(false);
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
        });
      } else {
        // פתיחת שיחה עבור לקוח
        if (!conversationId && partnerId) {
          setLoadingInit(true);
          sock.emit("startConversation", { otherUserId: partnerId }, (res) => {
            setLoadingInit(false);
            if (res.ok) {
              setConversationId(res.conversationId);
            } else {
              console.error("Failed to start conversation:", res.error);
            }
          });
        }
      }
    }

    setupSocket();

    return () => {
      socketRef.current?.disconnect();
      socketRef.current = null;
    };
  }, [userId, isBusiness, partnerId, conversationId]);

  // 2. עדכון currentCustomerId כשרשות שיחה משתנה
  useEffect(() => {
    if (isBusiness && conversationId && conversations.length) {
      const conv = conversations.find(
        (c) => (c._id ?? c.conversationId) === conversationId
      );
      if (conv) {
        const custId =
          conv.customer?._id ?? conv.participants.find((pid) => pid !== userId);
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
      socket={socketRef.current}
    />
  ) : (
    <ClientChatTab
      conversationId={conversationId}
      businessId={currentCustomerId}
      userId={userId}
      socket={socketRef.current}
    />
  );
}
