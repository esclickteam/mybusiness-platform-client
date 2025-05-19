import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import API from "../api";
import "./ChatTab.css";

export default function ClientChatTab({
  conversationId,
  businessId,
  userId,
  partnerId,
}) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const socketRef = useRef();
  const boxRef = useRef();

  useEffect(() => {
    if (!conversationId) return;

    API.get("/messages/history", { params: { conversationId } })
      .then((res) => setMessages(res.data))
      .catch(console.error);

    const socketUrl = import.meta.env.VITE_SOCKET_URL;
    socketRef.current = io(socketUrl, {
      path: "/socket.io",
      query: { conversationId, userId, role: "client" },
    });
    socketRef.current.on("newMessage", (msg) =>
      setMessages((prev) => [...prev, msg])
    );

    return () => {
      socketRef.current.disconnect();
      setMessages([]);
    };
  }, [conversationId, userId]);

  useEffect(() => {
    if (boxRef.current) {
      boxRef.current.scrollTop = boxRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = () => {
    const text = input.trim();
    if (!text || !conversationId) return;

    const payload = {
      conversationId,
      from: userId,
      to: businessId || partnerId,
      text,
      timestamp: new Date().toISOString(),
    };

    if (socketRef.current?.connected) {
      socketRef.current.emit("sendMessage", payload, (ack) =>
        ack?.success ? setInput("") : postFallback(payload)
      );
    } else {
      postFallback(payload);
    }
  };

  const postFallback = (payload) => {
    API.post("/messages/history", payload)
      .then((res) => {
        setMessages((prev) => [...prev, res.data.message]);
        setInput("");
      })
      .catch(console.error);
  };

  return (
    <div className="chat-tab-container">
      <div className="chat-preview">
        <h2>שיחה עם העסק</h2>
        <div className="chat-box" ref={boxRef}>
          {messages.length === 0 && (
            <div className="greeting-msg">עדיין אין הודעות</div>
          )}
          {messages.map((m, i) => {
            const mine = m.from?.toString() === userId?.toString();
            return (
              <div
                key={i}
                className={`chat-message ${
                  mine ? "sent chat-message-animate" : "received"
                }`}
              >
                {m.text}
                <div className="message-time">
                  {new Date(m.timestamp).toLocaleTimeString("he-IL", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            );
          })}
        </div>
        <div className="chat-input-row">
          <input
            type="text"
            placeholder="הקלד הודעה..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button onClick={sendMessage}>שלח</button>
        </div>
      </div>

      {/* כאן תוכל להשאיר את ה־settings בצד השמאלי אם צריך */}
      <div className="chat-settings">
        <h2>הגדרות צ'אט</h2>
        {/* … */}
      </div>
    </div>
  );
}
