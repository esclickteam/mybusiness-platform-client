// src/components/BusinessChatWrapper.jsx
import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ConversationsList from "./ConversationsList";
import ChatPage from "./ChatPage";
import "./ConversationsList.css";
import createSocket from "../socket";

export default function BusinessChatWrapper() {
  const { businessId: routeBusinessId } = useParams();
  const { accessToken, user } = useAuth();
  const businessId = user?.businessId || routeBusinessId;

  const [convos, setConvos]     = useState([]);
  const [selected, setSelected] = useState(null);
  const socketRef               = useRef(null);
  const hasJoinedRef            = useRef(false);

  useEffect(() => {
    if (!businessId || !accessToken) return;
    if (socketRef.current) return; // כבר אתחלנו סוקט

    // צור וסנכרן סוקט
    const sock = createSocket();
    socketRef.current = sock;
    sock.auth = { token: accessToken, role: "business", businessId };
    sock.connect();

    // קבל שיחות
    sock.emit("getConversations", { businessId }, ({ ok, conversations = [], error }) => {
      if (ok) {
        setConvos(conversations);
        if (!selected && conversations.length > 0) {
          const first = conversations[0];
          const convoId   = first._id || first.conversationId || first.id;
          const partnerId = (first.participants || []).find(pid => pid !== businessId) || first.customer?._id || null;
          setSelected({ conversationId: convoId, partnerId });
        }
      } else {
        console.error("Error loading conversations:", error);
      }
    });

    // ניקוי בסגירה
    return () => {
      sock.disconnect();
      socketRef.current = null;
      setConvos([]);
      setSelected(null);
    };
  }, [businessId, accessToken, selected]);

  const handleSelect = (conversationId) => {
    const sock = socketRef.current;
    if (!sock) return;

    const convo = convos.find(
      c =>
        c._id === conversationId ||
        c.conversationId === conversationId ||
        c.id === conversationId
    );
    if (!convo) {
      setSelected(null);
      return;
    }

    const partnerId =
      (convo.participants || []).find(pid => pid !== businessId) ||
      convo.customer?._id ||
      null;
    setSelected({ conversationId, partnerId });

    // יציאה ממועדון קודם והצטרפות למועדון חדש
    if (hasJoinedRef.current) {
      sock.emit("leaveConversation", selected.conversationId);
    }
    sock.emit("joinConversation", conversationId, ack => {
      if (!ack.ok) console.error("joinConversation failed:", ack.error);
    });
    hasJoinedRef.current = true;
  };

  return (
    <div className="business-chat-wrapper" style={{ display: "flex", height: "100%" }}>
      <ConversationsList
        conversations={convos}
        businessId={businessId}
        isBusiness={true}
        selectedConversationId={selected?.conversationId}
        onSelect={handleSelect}
      />
      {selected && selected.partnerId ? (
        <ChatPage
          isBusiness={true}
          userId={businessId}
          partnerId={selected.partnerId}
          initialConversationId={selected.conversationId}
          socket={socketRef.current}
        />
      ) : (
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#b5b5b5",
          }}
        >
          בחר שיחה כדי לראות הודעות
        </div>
      )}
    </div>
  );
}
