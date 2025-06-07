import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import ConversationsList from "./ConversationsList";
import BusinessChatTab from "./BusinessChatTab";
import styles from "./BusinessChatPage.module.css";
import createSocket from "../socket";
import API from "../api";

export default function BusinessChatPage() {
  const { user, initialized, refreshAccessToken, logout } = useAuth(); // <-- כאן השינוי
  const businessId = user?.businessId || user?.business?._id;

  const [convos, setConvos] = useState([]);
  const [selected, setSelected] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const socketRef = useRef(null);
  const prevSelectedRef = useRef(null);
  const selectedRef = useRef(selected);

  // Keep latest selected in ref for message handler
  useEffect(() => {
    selectedRef.current = selected;
  }, [selected]);

  // 1. Initialize & connect socket
  useEffect(() => {
    if (!initialized || !businessId) return;

    (async () => {
      // בקש טוקן תקין (כולל רענון)
      const token = await refreshAccessToken(); // <-- כאן השינוי
      if (!token) {
        setError("Session expired, please login again");
        logout();
        return;
      }

      const sock = await createSocket(token, refreshAccessToken, logout); // <-- כאן השינוי
      if (!sock) {
        setError("Socket connection failed");
        return;
      }
      socketRef.current = sock;

      sock.on("connect_error", (err) => {
        setError("Socket error: " + err.message);
        console.log("Socket connection failed:", err);
      });

      sock.on("tokenExpired", async () => {
        console.log("Token expired - refreshing...");
        const newToken = await refreshAccessToken(); // <-- כאן השינוי
        if (!newToken) {
          logout();
          return;
        }
        sock.auth.token = newToken;
        sock.disconnect();
        sock.connect();
      });

      console.log("Socket connected:", sock.id);
    })();

    return () => {
      socketRef.current?.disconnect();
      prevSelectedRef.current = null;
    };
  }, [initialized, businessId, refreshAccessToken, logout]);

  // 2. Load conversations via REST
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
      .catch(() => {
        setError("שגיאה בטעינת שיחות");
      })
      .finally(() => setLoading(false));
  }, [initialized, businessId]);

  // 3. Listen for incoming messages
  useEffect(() => {
    const sock = socketRef.current;
    if (!sock) return;

    const handler = (msg) => {
      console.log("New message received:", msg);

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

  // 4. Join/leave rooms & load messages on selection change
  useEffect(() => {
    const sock = socketRef.current;
    if (!sock || !sock.connected || !selected?.conversationId) {
      setMessages([]);
      return;
    }

    if (prevSelectedRef.current && prevSelectedRef.current !== selected.conversationId) {
      sock.emit("leaveConversation", prevSelectedRef.current);
    }

    sock.emit("joinConversation", selected.conversationId, (ack) => {
      if (!ack.ok) setError("לא ניתן להצטרף לשיחה");
    });

    sock.emit("getHistory", { conversationId: selected.conversationId }, (res) => {
      if (res.ok) {
        setMessages(res.messages || []);
      } else {
        setMessages([]);
        setError("שגיאה בטעינת ההודעות");
      }
    });

    prevSelectedRef.current = selected.conversationId;
  }, [selected]);

  // 5. Handle selection change from conversation list
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
