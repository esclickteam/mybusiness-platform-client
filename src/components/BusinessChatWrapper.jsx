import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ConversationsList from "./ConversationsList";
import ChatPage from "./ChatPage";
import "./ConversationsList.css";
import createSocket from "../socket";

export default function BusinessChatWrapper() {
  const { businessId: routeBusinessId } = useParams();
  const { user, getValidAccessToken, logout } = useAuth();
  const businessId = user?.businessId || routeBusinessId;

  const [convos, setConvos] = useState([]);
  const [selected, setSelected] = useState(null);
  const socketRef = useRef(null);
  const hasJoinedRef = useRef(false);
  const selectedRef = useRef(selected);

  useEffect(() => {
    selectedRef.current = selected;
  }, [selected]);

  useEffect(() => {
    if (!businessId) return;

    async function setupSocket() {
      const token = await getValidAccessToken();
      if (!token) {
        logout();
        return;
      }

      // כאן שולחים את הפונקציה getValidAccessToken, לא את הטוקן עצמו!
      const sock = await createSocket(getValidAccessToken, logout, businessId);
      if (!sock) return;

      if (!sock.connected) sock.connect();

      socketRef.current = sock;

      sock.emit(
        "getConversations",
        { businessId },
        (res) => {
          if (!res || typeof res !== "object") {
            console.error("Invalid response from getConversations:", res);
            return;
          }
          const { ok, conversations = [], error } = res;
          if (ok) {
            setConvos(conversations);
            if (!selected && conversations.length > 0) {
              const first = conversations[0];
              const convoId = first._id || first.conversationId || first.id;
              const partnerId =
                (first.participants || []).find((pid) => pid !== businessId) ||
                first.customer?._id ||
                null;
              setSelected({ conversationId: convoId, partnerId });
              hasJoinedRef.current = false;
            }
          } else {
            console.error("Error loading conversations:", error);
          }
        }
      );

      sock.on("connect_error", (err) => {
        console.error("Socket connect error:", err.message);
      });
    }

    setupSocket();

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      setConvos([]);
      setSelected(null);
      hasJoinedRef.current = false;
    };
  }, [businessId, getValidAccessToken, logout, selected]);

  const handleSelect = (conversationId) => {
    const sock = socketRef.current;
    if (!sock || !sock.connected) {
      console.warn("Socket not connected, cannot emit joinConversation");
      return;
    }

    const convo = convos.find(
      (c) =>
        c._id === conversationId ||
        c.conversationId === conversationId ||
        c.id === conversationId
    );
    if (!convo) {
      setSelected(null);
      return;
    }

    const partnerId =
      (convo.participants || []).find((pid) => pid !== businessId) ||
      convo.customer?._id ||
      null;

    if (hasJoinedRef.current && selectedRef.current?.conversationId) {
      sock.emit("leaveConversation", selectedRef.current.conversationId, (ack) => {
        if (!ack || !ack.ok) {
          console.error("Failed to leave conversation:", ack?.error);
        }
      });
    }

    sock.emit("joinConversation", conversationId, (ack) => {
      if (!ack || !ack.ok) {
        console.error("Failed to join conversation:", ack?.error);
      }
    });

    hasJoinedRef.current = true;
    setSelected({ conversationId, partnerId });
  };

  return (
    <div
      className="business-chat-wrapper"
      style={{ display: "flex", height: "100%" }}
    >
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
