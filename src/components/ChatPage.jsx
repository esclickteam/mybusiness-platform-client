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

  /* ======================
     SOCKET SETUP
  ====================== */
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
          setError("Invalid response from chat server");
          return;
        }

        if (res.ok) {
          const convs = Array.isArray(res.conversations)
            ? res.conversations
            : [];
          setConversations(convs);

          // ✅ auto-select רק בדסקטופ
          if (!selected && convs.length > 0 && window.innerWidth > 768) {
            const first = convs[0];
            const convoId = first._id || first.conversationId;
            const partnerId =
              (first.participants || []).find(
                (pid) => pid && pid.toString() !== userId.toString()
              ) || null;

            setSelected({ conversationId: convoId, partnerId });
          }
        } else {
          setError("Failed to load conversations");
        }
      });

      return () => {
        isMounted = false;
        sock.disconnect();
        socketRef.current = null;
      };
    }

    setupSocket();
  }, [userId, getValidAccessToken, logout]);

  /* ======================
     HANDLERS
  ====================== */
  const handleSelect = ({ conversationId, partnerId }) => {
    if (!partnerId) return;
    setSelected({ conversationId, partnerId });
  };

  const handleBackToList = () => {
    setSelected(null);
  };

  if (!userId) return <p>⏳ Loading user…</p>;

  /* ======================
     RENDER
  ====================== */
  return (
    <div className="chat-page">
      {/* ===== SIDEBAR ===== */}
      {!selected && (
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
      )}

      {/* ===== CHAT ===== */}
      {selected && (
        <main className="chat-main">
          {/* 🔙 חזרה – נייד בלבד */}
          <button className="mobile-back" onClick={handleBackToList}>
            ← Back
          </button>

          <ChatComponent
            isBusiness={isBusiness}
            userId={userId}
            partnerId={selected.partnerId}
            initialConversationId={selected.conversationId}
            socket={socketRef.current}
            existingMessages={selected.messages}
          />
        </main>
      )}
    </div>
  );
}
