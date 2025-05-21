import React, { useState, useEffect, useRef } from "react";
import BusinessChatTab from "./BusinessChatTab";
import ClientChatTab from "./ClientChatTab";
import io from "socket.io-client";

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

  const socketRef = useRef();

  // אתחול socket + טעינת שיחות ו/או יצירת שיחה
  useEffect(() => {
    if (!userId) return;

    const socketUrl = import.meta.env.VITE_SOCKET_URL;
socketRef.current = io(socketUrl, {
  auth: { userId, role: isBusiness ? "business" : "client" },
  transports: ["websocket"],
});


    if (isBusiness) {
      setLoadingConvs(true);
      socketRef.current.emit("getConversations", {}, (res) => {
        if (res.ok) {
          const convs = Array.isArray(res.conversations) ? res.conversations : [];
          setConversations(convs);
          if (!conversationId && convs.length > 0) {
            const first = convs[0];
            const convoId = first._id || first.conversationId;
            let custId = null;
            if (first.customer?._id) custId = first.customer._id;
            else if (first.participants && Array.isArray(first.participants)) {
              custId = first.participants.find(pid => pid !== userId);
            }
            setConversationId(convoId);
            setCurrentCustomerId(custId);
          }
        } else {
          console.error("Error loading conversations:", res.error);
        }
        setLoadingConvs(false);
      });
    } else {
      // לקוח - אם אין conversationId, צור שיחה חדשה דרך socket
      if (!conversationId && partnerId) {
        setLoadingInit(true);
        socketRef.current.emit("startConversation", { otherUserId: partnerId }, (res) => {
          if (res.ok) {
            setConversationId(res.conversationId);
          } else {
            console.error("Failed to start conversation:", res.error);
          }
          setLoadingInit(false);
        });
      }
    }

    return () => {
      socketRef.current.disconnect();
    };
  }, [userId, isBusiness, partnerId]);

  // סנכרון customerId עם conversationId כאשר מתחלף
  useEffect(() => {
    if (!isBusiness || !conversationId) return;
    const conv = conversations.find(c => (c._id || c.conversationId) === conversationId);
    if (conv) {
      let custId = null;
      if (conv.customer?._id) custId = conv.customer._id;
      else if (conv.participants && Array.isArray(conv.participants)) {
        custId = conv.participants.find(pid => pid !== userId);
      }
      setCurrentCustomerId(custId);
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
      userId={userId}
      socket={socketRef.current} // במידת הצורך
    />
  ) : (
    <ClientChatTab
      conversationId={conversationId}
      businessId={partnerId}
      userId={userId}
      partnerId={partnerId}
      socket={socketRef.current} // במידת הצורך
    />
  );
}
