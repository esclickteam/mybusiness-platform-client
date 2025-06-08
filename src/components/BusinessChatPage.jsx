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
    if (resetMessagesCount) {
      resetMessagesCount();
    }
  }, [resetMessagesCount]);

  // Create socket connection once
  useEffect(() => {
    if (!initialized || !businessId) return;
    if (socketRef.current) return; // Prevent duplicate sockets

    let isMounted = true;

    (async () => {
      const token = await refreshAccessToken();
      if (!token) {
        setError("Session expired, please login again");
        logout();
        return;
      }

      const sock = await createSocket(refreshAccessToken, logout, businessId);
      if (!sock) {
        setError("Socket connection failed");
        return;
      }
      if (!isMounted) {
        sock.disconnect();
        return;
      }
      socketRef.current = sock;

      sock.on("connect", () => {
        console.log("Socket connected:", sock.id);

        // Rejoin selected conversation after reconnect
        if (selectedRef.current?.conversationId) {
          sock.emit(
            "joinConversation",
            selectedRef.current.conversationId,
            (ack) => {
              if (!ack.ok) {
                console.error("Failed to join conversation on reconnect");
              } else {
                console.log("Re-joined conversation on reconnect");
              }
            }
          );
        }
      });

      sock.on("connect_error", (err) => {
        setError("Socket error: " + err.message);
        console.error("Socket connection failed:", err);
      });

      sock.on("disconnect", (reason) => {
        console.log("Socket disconnected:", reason);
      });

      sock.on("tokenExpired", async () => {
        console.log("Token expired, refreshing...");
        const newToken = await refreshAccessToken();
        if (!newToken) {
          logout();
          return;
        }
        sock.auth.token = newToken;
        sock.disconnect();
        sock.connect();
      });

      sock.on("unreadMessagesCount", (count) => {
        if (updateMessagesCount) {
          updateMessagesCount(count);
        }
      });
    })();

    return () => {
      isMounted = false;
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [initialized, businessId, refreshAccessToken, logout, updateMessagesCount]);

  // Load conversations list
  useEffect(() => {
    if (!initialized || !businessId) return;

    setLoading(true);
    API.get("/conversations", { params: { businessId } })
      .then(({ data }) => {
        setConvos(data);
        if (data.length > 0) {
          const first = data[0];
          const convoId = first.conversationId || first._id;
          const partnerId =
            first.partnerId || first.participants.find((p) => p !== businessId);
          setSelected({ conversationId: convoId, partnerId });
        }
      })
      .catch(() => setError("שגיאה בטעינת שיחות"))
      .finally(() => setLoading(false));
  }, [initialized, businessId]);

  // Listen for new messages and update conversations/messages accordingly
  useEffect(() => {
    const sock = socketRef.current;
    if (!sock) return;

    const handler = (msg) => {
      setConvos((prev) => {
        const idx = prev.findIndex(
          (c) => String(c._id || c.conversationId) === msg.conversationId
        );
        if (idx === -1) return prev;

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
    return () => sock.off("newMessage", handler);
  }, []);

  // Manage joining/leaving conversation on selection change
  useEffect(() => {
    const sock = socketRef.current;
    if (!sock || !sock.connected || !selected?.conversationId) {
      setMessages([]); // Clear messages if no socket or no selection
      return;
    }

    if (resetMessagesCount) {
      resetMessagesCount();
    }

    // Mark messages as read
    sock.emit("markMessagesRead", selected.conversationId, (response) => {
      if (!response.ok) {
        console.error("Failed to mark messages as read:", response.error);
      }
    });

    // Leave previous conversation
    if (
      prevSelectedRef.current &&
      prevSelectedRef.current !== selected.conversationId
    ) {
      sock.emit("leaveConversation", prevSelectedRef.current, (ack) => {
        if (!ack.ok) {
          console.error("Failed to leave previous conversation");
        } else {
          console.log("Left previous conversation:", prevSelectedRef.current);
        }
      });
    }

    // Join new conversation
    sock.emit("joinConversation", selected.conversationId, (ack) => {
      if (!ack.ok) {
        setError("לא ניתן להצטרף לשיחה");
        console.error("Error joining conversation:", ack.error);
      } else {
        console.log("Successfully joined conversation:", selected.conversationId);
      }
    });

    // Fetch conversation history
    sock.emit(
      "getHistory",
      { conversationId: selected.conversationId },
      (res) => {
        if (res.ok) {
          setMessages(res.messages || []);
          console.log("History loaded for conversation:", selected.conversationId);
        } else {
          setMessages([]);
          setError("שגיאה בטעינת ההודעות");
        }
      }
    );

    prevSelectedRef.current = selected.conversationId;
  }, [selected, resetMessagesCount]);

  const handleSelect = (conversationId, partnerId) => {
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
