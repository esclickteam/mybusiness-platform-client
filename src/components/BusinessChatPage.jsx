import React, { useEffect, useState, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { useOutletContext } from "react-router-dom";
import ConversationsList from "./ConversationsList";
import BusinessChatTab from "./BusinessChatTab";
import styles from "./BusinessChatPage.module.css";
import createSocket from "../socket";
import API from "../api";

export default function BusinessChatPage() {
  const { user, initialized, refreshAccessToken, logout } = useAuth();
  const businessId = user?.businessId || user?.business?._id;

  const { resetMessagesCount, updateMessagesCount } = useOutletContext();

  const [convos, setConvos] = useState([]);
  const [selected, setSelected] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const socketRef = useRef(null);
  const prevSelectedRef = useRef(null);
  const selectedRef = useRef(selected);

  // Sync selected ref
  useEffect(() => {
    selectedRef.current = selected;
  }, [selected]);

  // Reset unread messages count on mount
  useEffect(() => {
    console.log("[BusinessChatPage] resetMessagesCount called");
    if (resetMessagesCount) {
      resetMessagesCount();
    }
  }, [resetMessagesCount]);

  // Create socket connection once
  useEffect(() => {
    console.log("[BusinessChatPage] useEffect for socket - initialized:", initialized, "businessId:", businessId);

    if (!initialized || !businessId) {
      console.log("[BusinessChatPage] Socket creation skipped - not initialized or missing businessId");
      return;
    }

    if (socketRef.current) {
      console.log("[BusinessChatPage] Socket already exists, skipping creation. Socket ID:", socketRef.current.id);
      return; // Prevent duplicate sockets
    }

    let isMounted = true;

    (async () => {
      console.log("[BusinessChatPage] Attempting to refresh token...");
      const token = await refreshAccessToken();

      if (!token) {
        setError("Session expired, please login again");
        console.warn("[BusinessChatPage] No token after refresh, logging out");
        logout();
        return;
      }

      console.log("[BusinessChatPage] Creating socket...");
      const sock = await createSocket(refreshAccessToken, logout, businessId);

      if (!sock) {
        setError("Socket connection failed");
        console.error("[BusinessChatPage] createSocket returned null");
        return;
      }

      if (!isMounted) {
        console.log("[BusinessChatPage] Component unmounted before socket created, disconnecting socket");
        sock.disconnect();
        return;
      }

      socketRef.current = sock;
      console.log("[BusinessChatPage] Socket assigned to ref, Socket ID:", sock.id);

      sock.on("connect", () => {
        console.log("[BusinessChatPage] Socket connected:", sock.id);

        if (selectedRef.current?.conversationId) {
          console.log("[BusinessChatPage] Rejoining conversation on reconnect:", selectedRef.current.conversationId);
          sock.emit(
            "joinConversation",
            selectedRef.current.conversationId,
            (ack) => {
              if (!ack.ok) {
                console.error("[BusinessChatPage] Failed to join conversation on reconnect:", ack.error);
              } else {
                console.log("[BusinessChatPage] Re-joined conversation on reconnect");
              }
            }
          );
        }
      });

      sock.on("connect_error", (err) => {
        setError("Socket error: " + err.message);
        console.error("[BusinessChatPage] Socket connection failed:", err);
      });

      sock.on("disconnect", (reason) => {
        console.log("[BusinessChatPage] Socket disconnected:", reason);
      });

      sock.on("tokenExpired", async () => {
        console.log("[BusinessChatPage] Token expired, refreshing...");
        const newToken = await refreshAccessToken();
        if (!newToken) {
          console.warn("[BusinessChatPage] Token refresh failed, logging out");
          logout();
          return;
        }
        console.log("[BusinessChatPage] New token received, reconnecting socket");
        sock.auth.token = newToken;
        sock.disconnect();
        sock.connect();
      });

      sock.on("unreadMessagesCount", (count) => {
        console.log("[BusinessChatPage] Received unreadMessagesCount:", count);
        if (updateMessagesCount) {
          updateMessagesCount(count);
        }
      });
    })();

    return () => {
      isMounted = false;
      if (socketRef.current) {
        console.log("[BusinessChatPage] Disconnecting socket on cleanup. Socket ID:", socketRef.current.id);
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [initialized, businessId, refreshAccessToken, logout, updateMessagesCount]);

  // Load conversations list
  useEffect(() => {
    if (!initialized || !businessId) {
      console.log("[BusinessChatPage] Skipping conversations load - not initialized or no businessId");
      return;
    }

    console.log("[BusinessChatPage] Loading conversations...");
    setLoading(true);
    API.get("/conversations", { params: { businessId } })
      .then(({ data }) => {
        console.log("[BusinessChatPage] Conversations loaded:", data.length);
        setConvos(data);
        if (data.length > 0) {
          const first = data[0];
          const convoId = first.conversationId || first._id;
          const partnerId =
            first.partnerId || first.participants.find((p) => p !== businessId);
          setSelected({ conversationId: convoId, partnerId });
          console.log("[BusinessChatPage] Selected first conversation:", convoId);
        }
      })
      .catch(() => {
        setError("שגיאה בטעינת שיחות");
        console.error("[BusinessChatPage] Error loading conversations");
      })
      .finally(() => setLoading(false));
  }, [initialized, businessId]);

  // Listen for new messages and update conversations/messages accordingly
  useEffect(() => {
    const sock = socketRef.current;
    if (!sock) {
      console.log("[BusinessChatPage] Socket not ready - skipping newMessage listener");
      return;
    }

    const handler = (msg) => {
      console.log("[BusinessChatPage] Received newMessage:", msg);

      setConvos((prev) => {
        const idx = prev.findIndex(
          (c) => String(c._id || c.conversationId) === msg.conversationId
        );
        if (idx === -1) {
          console.warn("[BusinessChatPage] newMessage conversation not found:", msg.conversationId);
          return prev;
        }

        const updated = {
          ...prev[idx],
          updatedAt: msg.timestamp || new Date().toISOString(),
        };
        return [updated, ...prev.filter((_, i) => i !== idx)];
      });

      const sel = selectedRef.current;
      if (msg.conversationId === sel?.conversationId) {
        setMessages((prev) =>
          prev.some((m) => m._id === msg._id) ? prev : [...prev, msg]
        );
      }
    };

    sock.on("newMessage", handler);
    console.log("[BusinessChatPage] newMessage listener attached");

    return () => {
      sock.off("newMessage", handler);
      console.log("[BusinessChatPage] newMessage listener removed");
    };
  }, []);

  // Manage joining/leaving conversation on selection change
  useEffect(() => {
    const sock = socketRef.current;
    if (!sock || !sock.connected || !selected?.conversationId) {
      console.log("[BusinessChatPage] No socket or no selected conversation - clearing messages");
      setMessages([]);
      return;
    }

    if (resetMessagesCount) {
      resetMessagesCount();
      console.log("[BusinessChatPage] resetMessagesCount called due to conversation change");
    }

    // Mark messages as read
    sock.emit("markMessagesRead", selected.conversationId, (response) => {
      if (!response.ok) {
        console.error("[BusinessChatPage] Failed to mark messages as read:", response.error);
      } else {
        console.log("[BusinessChatPage] Marked messages as read for", selected.conversationId);
      }
    });

    // Leave previous conversation
    if (
      prevSelectedRef.current &&
      prevSelectedRef.current !== selected.conversationId
    ) {
      sock.emit("leaveConversation", prevSelectedRef.current, (ack) => {
        if (!ack.ok) {
          console.error("[BusinessChatPage] Failed to leave previous conversation:", ack.error);
        } else {
          console.log("[BusinessChatPage] Left previous conversation:", prevSelectedRef.current);
        }
      });
    }

    // Join new conversation
    sock.emit("joinConversation", selected.conversationId, (ack) => {
      if (!ack.ok) {
        setError("לא ניתן להצטרף לשיחה");
        console.error("[BusinessChatPage] Error joining conversation:", ack.error);
      } else {
        console.log("[BusinessChatPage] Successfully joined conversation:", selected.conversationId);
      }
    });

    // Fetch conversation history
    sock.emit(
      "getHistory",
      { conversationId: selected.conversationId },
      (res) => {
        if (res.ok) {
          setMessages(res.messages || []);
          console.log("[BusinessChatPage] History loaded for conversation:", selected.conversationId);
        } else {
          setMessages([]);
          setError("שגיאה בטעינת ההודעות");
          console.error("[BusinessChatPage] Error loading history:", res.error);
        }
      }
    );

    prevSelectedRef.current = selected.conversationId;
  }, [selected, resetMessagesCount]);

  const handleSelect = (conversationId, partnerId) => {
    console.log("[BusinessChatPage] Conversation selected:", conversationId);
    setSelected({ conversationId, partnerId });
  };

  if (!initialized) {
    return <p className={styles.loading}>טוען מידע…</p>;
  }

  return (
    <div className={styles.chatContainer}>
      <aside className={styles.sidebarInner}>
        {loading ? (
          <p className={styles.loading}>טוען שיחות…</p>
        ) : (
          <ConversationsList
            conversations={convos}
            businessId={businessId}
            selectedConversationId={selected?.conversationId}
            onSelect={handleSelect}
            isBusiness
          />
        )}
        {error && <p className={styles.error}>{error}</p>}
      </aside>

      <section className={styles.chatArea}>
        {selected ? (
          <BusinessChatTab
            conversationId={selected.conversationId}
            businessId={businessId}
            customerId={selected.partnerId}
            businessName={user?.businessName || user?.name}
            socket={socketRef.current}
            messages={messages}
            setMessages={setMessages}
          />
        ) : (
          <div className={styles.emptyMessage}>בחר שיחה כדי לראות הודעות</div>
        )}
      </section>
    </div>
  );
}
