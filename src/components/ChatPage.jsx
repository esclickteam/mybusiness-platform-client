import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ChatComponent from "./ChatComponent";
import ConversationsList from "./ConversationsList";
import "./ChatPage.css";
import createSocket from "../socket";

export default function ChatPage({ isBusiness, userId, initialPartnerId }) {
  const { state } = useLocation();
  const { getValidAccessToken, logout } = useAuth();

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
    if (socketRef.current) return;

    let isMounted = true;

    async function setupSocket() {
      const sock = await createSocket(getValidAccessToken, logout, userId);
      if (!sock) return;

      if (!sock.connected) sock.connect();

      socketRef.current = sock;

      sock.emit("getConversations", { userId }, (res) => {
        if (!isMounted) return;
        if (!res || typeof res !== "object") {
          setError("תגובה לא תקינה משרת השיחות");
          return;
        }
        if (res.ok) {
          const convs = Array.isArray(res.conversations) ? res.conversations : [];
          setConversations(convs);
          if (!selected && convs.length > 0) {
            const first = convs[0];
            const convoId = first._id || first.conversationId;

            // בדיקה קפדנית של partnerId: להשוות למחרוזות כדי למנוע השוואת סוגים שונים
            const partnerId =
              (first.participants || []).find(
                (pid) => pid && pid.toString() !== userId.toString()
              ) || null;

            console.log("Selected conversation initialized:", { convoId, partnerId });

            setSelected({ conversationId: convoId, partnerId });
          }
        } else {
          setError("לא ניתן לטעון שיחות: " + (res.error || "שגיאה"));
        }
      });

      const handleNew = (message) => {
        if (!isMounted) return;
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

      return () => {
        isMounted = false;
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
  }, [userId, isBusiness, getValidAccessToken, logout, selected]);

  const handleSelect = ({ conversationId, partnerId }) => {
    if (!partnerId) {
      console.warn("Selected partnerId is null or undefined:", partnerId);
      setError("לא ניתן לבחור שיחה ללא שותף תקין");
      return;
    }
    setSelected({ conversationId, partnerId });
  };

  if (!userId) return <p>⏳ טוען משתמש…</p>;
  if (!selected) return <p>⏳ בחר שיחה כדי להתחיל</p>;

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
        <ChatComponent
          isBusiness={isBusiness}
          userId={userId}
          partnerId={selected.partnerId}
          initialConversationId={selected.conversationId}
          socket={socketRef.current}
          existingMessages={selected.messages}
        />
      </main>
    </div>
  );
}
