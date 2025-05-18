import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import API from "../api";
import "./ClientChatTab.css";

export default function ClientChatTab({
  conversationId,
  businessId,
  userId,
  partnerId,
}) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const socketRef = useRef();
  const messageListRef = useRef();

  useEffect(() => {
    if (!conversationId) return;

    // 1. טען היסטוריה מה־REST
    API.get("/api/messages/history", {
      params: { conversationId },
      withCredentials: true,
    })
      .then((res) => {
        const loaded = Array.isArray(res.data)
          ? res.data
          : res.data.messages || [];
        setMessages(loaded);
      })
      .catch((e) => console.error("Error loading history:", e));

    // 2. התחבר ל־Socket.IO
    const socketUrl = import.meta.env.VITE_SOCKET_URL;
    socketRef.current = io(socketUrl, {
      path: "/socket.io",
      query: { conversationId, businessId, userId, role: "client" },
    });

    socketRef.current.on("connect", () => {
      socketRef.current.emit("joinRoom", { conversationId });
    });

    socketRef.current.on("newMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socketRef.current.off("newMessage");
      socketRef.current.disconnect();
      socketRef.current = null;
      setMessages([]);
    };
  }, [conversationId, businessId, userId]);

  // גלילה אוטומטית לתחתית בכל עדכון
  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop =
        messageListRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = () => {
    const text = input.trim();
    if (!text || !conversationId) return;

    const toId = businessId || partnerId;
    const msgPayload = {
      conversationId,
      from: userId,
      to: toId,
      text,
      timestamp: new Date().toISOString(),
    };

    // 1) שליחה דרך Socket.IO
    socketRef.current.emit("sendMessage", msgPayload, (ack) => {
      if (ack?.success) {
        setInput("");
      } else {
        console.warn("Socket send failed, falling back to REST");
        // 2) במקרה של כישלון ב־socket, נFallback ל־HTTP POST
        API.post(
          "/api/messages/history",
          { ...msgPayload },
          { withCredentials: true }
        )
          .then((res) => {
            setMessages((prev) => [...prev, res.data.message]);
            setInput("");
          })
          .catch((err) =>
            console.error("Error sending via REST:", err)
          );
      }
    });
  };

  return (
    <div className="whatsapp-bg">
      <div className="chat-container client">
        <div
          className="message-list"
          ref={messageListRef}
        >
          {messages.length === 0 && (
            <div className="empty">עדיין אין הודעות</div>
          )}
          {messages.map((m, i) => (
            <div
              key={i}
              className={`message ${
                m.from === userId ? "mine" : "theirs"
              }`}
            >
              <div className="text">{m.text}</div>
              <div className="time">
                {new Date(m.timestamp).toLocaleTimeString("he-IL", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="input-bar">
          <input
            type="text"
            placeholder="הקלד הודעה..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) =>
              e.key === "Enter" && !e.shiftKey && sendMessage()
            }
          />
          <button onClick={sendMessage} title="שלח">
            <span role="img" aria-label="send">
              ✈️
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
