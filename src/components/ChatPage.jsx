import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import ChatComponent from "./ChatComponent";
import ConversationsList from "./ConversationsList";
import "./ChatPage.css";
import createSocket from "../socket"; // השתמשנו בפונקציה שלך מ־src/socket.js

export default function ChatPage({ isBusiness, userId, initialPartnerId }) {
  const { state } = useLocation();
  const initialConversationId = state?.conversationId || null;

  const [conversations, setConversations] = useState([]);
  const [selected, setSelected] = useState(
    initialConversationId && initialPartnerId
      ? { conversationId: initialConversationId, partnerId: initialPartnerId }
      : null
  );
  const [error, setError] = useState("");
  const socketRef = useRef(null);

  useEffect(() => {
    if (!userId) return;
    if (socketRef.current) return; // כבר אתחול

    async function setupSocket() {
      const sock = await createSocket();
      if (!sock) return; // אין טוקן תקין, כנראה הפניית login כבר התבצעה

      sock.connect();
      socketRef.current = sock;

      // 1. fetch initial conversations
      sock.emit("getConversations", { userId }, (res) => {
        if (res.ok) {
          const convs = Array.isArray(res.conversations) ? res.conversations : [];
          setConversations(convs);
          if (!selected && convs.length > 0) {
            const first = convs[0];
            const convoId = first._id || first.conversationId;
            const partnerId =
              (first.participants || []).find((pid) => pid !== userId) ||
              first.customer?._id ||
              null;
            setSelected({ conversationId: convoId, partnerId });
          }
        } else {
          setError("לא ניתן לטעון שיחות: " + (res.error || "שגיאה"));
        }
      });

      // 2. listener for new messages
      const handleNew = (message) => {
        setConversations((prev) =>
          prev.map((conv) =>
            conv._id === message.conversationId ||
            conv.conversationId === message.conversationId
              ? { ...conv, messages: [...(conv.messages || []), message] }
              : conv
          )
        );
        if (selected?.conversationId === message.conversationId) {
          setSelected((prev) => ({
            ...prev,
            messages: [...(prev.messages || []), message],
          }));
        }
      };
      sock.on("newMessage", handleNew);

      // שמירת ההאזנה לניקוי בעת unmount
      return () => {
        sock.off("newMessage", handleNew);
        sock.disconnect();
        socketRef.current = null;
      };
    }

    const cleanupPromise = setupSocket();

    return () => {
      cleanupPromise.then((cleanup) => {
        if (cleanup) cleanup();
      });
    };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, isBusiness]);

  const handleSelect = ({ conversationId, partnerId }) => {
    setSelected({ conversationId, partnerId });
  };

  return (
    <div className="chat-page">
      <aside className="chat-sidebar">
        {error && <div className="error-banner">{error}</div>}
        <ConversationsList
          conversations={conversations}
          businessId={userId}
          isBusiness={isBusiness}
          onSelect={handleSelect}
          selectedConversationId={selected?.conversationId}
        />
      </aside>
      <main className="chat-main">
        {selected ? (
          <ChatComponent
            isBusiness={isBusiness}
            userId={userId}
            partnerId={selected.partnerId}
            initialConversationId={selected.conversationId}
            socket={socketRef.current}
            existingMessages={selected.messages}
          />
        ) : (
          <div className="empty-chat">בחר שיחה כדי להתחיל</div>
        )}
      </main>
    </div>
  );
}
