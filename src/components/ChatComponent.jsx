// src/components/ChatComponent.jsx
import React, { useState, useEffect, useRef, useMemo } from "react";
import { useAuth } from "../context/AuthContext";
import BusinessChatTab from "./BusinessChatTab";
import ClientChatTab from "./ClientChatTab";
import ConversationsList from "./ConversationsList";
import API from "../api";
import { createSocket } from "../socket";
import { ensureValidToken, getBusinessId } from "../utils/authHelpers";

export default function ChatComponent({
  initialConversationId,
  partnerId: partnerIdProp,
  isBusiness,
}) {
  const { user, initialized, refreshToken } = useAuth();
  const userId = user?.userId;
  const businessId = getBusinessId();

  const [conversationId, setConversationId]   = useState(initialConversationId);
  const [conversations, setConversations]     = useState([]);
  const [loadingConvs, setLoadingConvs]       = useState(false);
  const [loadingInit, setLoadingInit]         = useState(false);
  const [currentCustomerId, setCurrentCustomerId] = useState(partnerIdProp || null);
  const socketRef = useRef(null);
  const hasJoinedRef = useRef(false);

  // 1. Initialize socket
  useEffect(() => {
    if (!initialized) return;
    let sock;
    (async () => {
      try {
        setLoadingInit(true);
        const token = await ensureValidToken();
        sock = createSocket();
        sock.auth = {
          token,
          role: isBusiness ? "business" : "client",
          businessId,
        };
        sock.connect();
        socketRef.current = sock;
      } catch (e) {
        console.error("Socket init failed:", e);
      } finally {
        setLoadingInit(false);
      }
    })();
    return () => {
      sock?.disconnect();
    };
  }, [initialized, businessId, refreshToken]);

  // 2. Load or start conversations
  useEffect(() => {
    const sock = socketRef.current;
    if (!sock?.connected) return;

    if (isBusiness) {
      setLoadingConvs(true);
      sock.emit("getConversations", { businessId }, (res) => {
        setLoadingConvs(false);
        if (res.ok) {
          setConversations(res.conversations);
          if (!conversationId && res.conversations.length) {
            const first = res.conversations[0];
            const convoId = first._id || first.conversationId;
            const custId = first.customer?._id
              || first.participants.find(p => p !== businessId);
            setConversationId(convoId);
            setCurrentCustomerId(custId);
          }
        } else {
          console.error("getConversations error:", res.error);
        }
      });
    } else {
      if (!conversationId && partnerIdProp) {
        setLoadingInit(true);
        sock.emit("startConversation", { otherUserId: partnerIdProp }, (res) => {
          setLoadingInit(false);
          if (res.ok) {
            setConversationId(res.conversationId);
          } else {
            console.error("startConversation failed:", res.error);
          }
        });
      }
    }
  }, [socketRef.current?.connected, isBusiness, partnerIdProp]);

  // 3. Update currentCustomerId for business
  useEffect(() => {
    if (isBusiness && conversationId && conversations.length) {
      const conv = conversations.find(c => (c._id || c.conversationId) === conversationId);
      if (conv) {
        const custId = conv.customer?._id
          || conv.participants.find(p => p !== businessId);
        setCurrentCustomerId(custId);
      }
    }
  }, [conversationId, isBusiness, conversations]);

  // 4. Join conversation and listen for messages
  useEffect(() => {
    const sock = socketRef.current;
    if (!sock?.connected || !conversationId) return;

    if (hasJoinedRef.current) {
      sock.emit("leaveConversation", conversationId);
    }
    sock.emit("joinConversation", conversationId, (ack) => {
      if (!ack.ok) console.error("joinConversation failed:", ack.error);
    });
    hasJoinedRef.current = true;
  }, [socketRef.current?.connected, conversationId]);

  // 5. Listen for incoming messages
  useEffect(() => {
    const sock = socketRef.current;
    if (!sock) return;

    const handler = msg => {
      if (msg.conversationId !== conversationId) return;
      // messages are managed in parent via props...
    };
    sock.on("newMessage", handler);
    return () => {
      sock.off("newMessage", handler);
    };
  }, [conversationId]);

  if (!initialized) return <p>⏳ טוען משתמש…</p>;
  if (loadingInit)  return <p>⏳ פותח שיחה…</p>;
  if (loadingConvs) return <p>⏳ טוען שיחות…</p>;
  if (!conversationId) return <p>⏳ אין שיחה זמינה</p>;

  return isBusiness ? (
    <BusinessChatTab
      conversationId={conversationId}
      businessId={businessId}
      customerId={currentCustomerId}
      socket={socketRef.current}
    />
  ) : (
    <ClientChatTab
      conversationId={conversationId}
      businessId={businessId}
      userId={userId}
      socket={socketRef.current}
    />
  );
}
