// src/components/BusinessChatTab.jsx
import { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import API from "../api";
import "./BusinessChatPage.module"; // <<< ייבוא CSS נכון

export default function BusinessChatTab({ conversationId, businessId, customerId }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const socketRef = useRef();
  const messageListRef = useRef();

  useEffect(() => {
    if (!conversationId) return;

    // 1) טען היסטוריית הודעות מן ה־API
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

    // 2) התחבר לסוקט
    const socketUrl = import.meta.env.VITE_SOCKET_URL;
    socketRef.current = io(socketUrl, {
      query: { conversationId, businessId, userId: businessId, role: "business" }
    });

    socketRef.current.on("connect", () => {
      socketRef.current.emit("joinRoom", conversationId);
    });

    // 3) קבל הודעות חדשות עם בדיקת כפילויות
    socketRef.current.on("newMessage", msg => {
      setMessages(prev => {
        // המזהה היחיד שלנו הוא timestamp+from+text (או _id אם קיים)
        const exists = prev.some(m =>
          (m._id && msg._id && m._id === msg._id) ||
          (m.timestamp === msg.timestamp &&
           m.from === msg.from &&
           m.text === msg.text)
        );
        if (exists) return prev;
        return [...prev, msg];
      });
    });

    return () => {
      socketRef.current?.disconnect();
      setMessages([]);
    };
  }, [conversationId, businessId]);

  // גלילה אוטומטית לתחתית בכל עדכון רשימת הודעות
  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [messages]);

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
      if (ack?.success) {
        setInput("");
        // לא מוסיפים ידנית ל־messages – הסוקט יחזיר לנו ב־newMessage
      } else {
        alert("שגיאה בשליחת ההודעה. נסה שוב.");
      }
    });
  };

  return (
    <div className="whatsapp-bg">
      <div className="chat-container business">
        <div className="message-list" ref={messageListRef}>
          {messages.length === 0 && (
            <div className="empty">עדיין אין הודעות</div>
          )}
          {messages.map((m, i) => (
            <div
              key={m._id || i}
              className={`message ${m.from === businessId ? "mine" : "theirs"}`}
            >
              <div>{m.text}</div>
              <div className="time">
                {new Date(m.timestamp).toLocaleTimeString("he-IL", {
                  hour: "2-digit",
                  minute: "2-digit"
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
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && sendMessage()}
          />
          <button onClick={sendMessage} title="שלח">
            <span role="img" aria-label="send">✈️</span>
          </button>
        </div>
      </div>
    </div>
  );
}
