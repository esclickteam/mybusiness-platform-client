import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import BusinessChatTab from "./BusinessChatTab";
import ClientChatTab from "./ClientChatTab";
import createSocket from "../socket";

export default function ChatComponent({
  userId,
  partnerId,             // מזהה הצד השני בשיחה (ללקוח - העסק, לעסק - הלקוח)
  initialConversationId,
  customerId: customerIdProp,
  isBusiness,
}) {
  const { getValidAccessToken, logout } = useAuth();

  const [conversationId, setConversationId] = useState(initialConversationId || null);
  const [conversations, setConversations] = useState([]);
  const [loadingConvs, setLoadingConvs] = useState(false);
  const [loadingInit, setLoadingInit] = useState(false);
  const [currentCustomerId, setCurrentCustomerId] = useState(customerIdProp || null);

  const socketRef = useRef(null);

  useEffect(() => {
    if (!userId) return;
    if (socketRef.current) return;

    async function setupSocket() {
      const token = await getValidAccessToken();
      if (!token) {
        logout();
        return;
      }

      const sock = await createSocket(getValidAccessToken, logout);
      if (!sock) return;

      socketRef.current = sock;

      if (!sock.connected) sock.connect();

      if (isBusiness) {
        setLoadingConvs(true);
        sock.emit("getConversations", { userId }, (res) => {
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
              // לוקח מזהה לקוח מתוך המשתתפים (לא העסק)
              const custId = first.participants.find((pid) => pid !== userId) ?? null;
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
          sock.emit("startConversation", { otherUserId: partnerId }, (res) => {
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
    }

    setupSocket();

    return () => {
      socketRef.current?.disconnect();
      socketRef.current = null;
    };
    // הוצאתי conversationId מה-deps כדי למנוע לולאות אינסופיות
  }, [userId, isBusiness, partnerId, getValidAccessToken, logout]);

  useEffect(() => {
    if (isBusiness && conversationId && conversations.length) {
      const conv = conversations.find(
        (c) => (c._id ?? c.conversationId) === conversationId
      );
      if (conv) {
        const custId = conv.participants.find((pid) => pid !== userId) ?? null;
        setCurrentCustomerId(custId);
      }
    }
  }, [conversationId, isBusiness, conversations, userId]);

  if (loadingInit) return <p>⏳ פותח שיחה…</p>;
  if (loadingConvs) return <p>⏳ טוען שיחות…</p>;
  if (!conversationId) return <p>⏳ אין שיחה זמינה</p>;
  if (!userId) return <p>⏳ טוען משתמש…</p>;

  // חשיבות: בלקוח, businessId הוא מזהה העסק (partnerId)
  // בעסק, userId הוא מזהה העסק, customerId הוא הלקוח
  return isBusiness ? (
    <BusinessChatTab
      conversationId={conversationId}
      businessId={userId}              // העסק שמחובר
      customerId={currentCustomerId}   // הלקוח המשתתף בשיחה
      socket={socketRef.current}
    />
  ) : (
    <ClientChatTab
      conversationId={conversationId}
      businessId={partnerId}           // העסק שאליו הלקוח מדבר
      userId={userId}                 // המשתמש המחובר (הלקוח)
      socket={socketRef.current}
    />
  );
}
