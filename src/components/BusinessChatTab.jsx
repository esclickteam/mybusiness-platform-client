// BusinessChatTab.jsx
import { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import API from "../api";
// כאן אנחנו מייבאים את כל המחלקות כ־styles
import styles from "./BusinessChatTab.module.css";

export default function BusinessChatTab({ conversationId, businessId, customerId }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const socketRef = useRef();

  useEffect(() => {
    if (!conversationId) return;

    // טוען היסטוריית הודעות
    API.get("/messages/history", {
      params: { conversationId },
      withCredentials: true
    })
      .then(res => {
        const loaded = Array.isArray(res.data)
          ? res.data
          : res.data.messages || [];
        setMessages(loaded);
      })
      .catch(() => {});

    // התחברות לסוקט
    const socketUrl = import.meta.env.VITE_SOCKET_URL;
    socketRef.current = io(socketUrl, {
      query: { conversationId, businessId, userId: businessId, role: "business" }
    });

    socketRef.current.on("connect", () => {
      socketRef.current.emit("joinRoom", conversationId);
    });

    socketRef.current.on("newMessage", msg => {
      setMessages(prev => [...prev, msg]);
    });

    return () => {
      socketRef.current?.disconnect();
      setMessages([]);
    };
  }, [conversationId, businessId]);

  const sendMessage = () => {
    if (!input.trim() || !conversationId || !customerId) return;

    const msg = {
      conversationId,
      from: businessId,
      to: customerId,
      text: input.trim(),
      timestamp: new Date().toISOString()
    };

    socketRef.current.emit("sendMessage", msg, ack => {
      if (ack?.success) setInput("");
      else alert("שגיאה בשליחת ההודעה. נסה שוב.");
    });
  };

  return (
    <div className={styles.chatContainer}>
      {/* צד שיחות אפשר להוסיף כאן עם styles.sidebar */}
      <div className={styles.messageList}>
        {messages.map((m, i) => (
          <div
            key={i}
            className={`${styles.message} ${
              m.from === businessId ? styles.mine : styles.theirs
            }`}
          >
            <div>{m.text}</div>
            <div className={styles.time}>
              {new Date(m.timestamp).toLocaleTimeString("he-IL", {
                hour: "2-digit",
                minute: "2-digit"
              })}
            </div>
          </div>
        ))}
      </div>

      <div className={styles.inputBar}>
        <input
          className={styles.inputField}
          type="text"
          placeholder="הקלד הודעה..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && sendMessage()}
        />
        <button className={styles.sendButton} onClick={sendMessage}>
          שלח
        </button>
      </div>
    </div>
  );
}
