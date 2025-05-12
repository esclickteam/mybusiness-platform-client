// 📁 src/components/ChatComponent.jsx
import React, { useState, useEffect, useRef, useCallback } from "react";
import { io } from "socket.io-client";
import API from "../api";
import "./ChatComponent.css";

const SOCKET_URL = process.env.REACT_APP_API_URL || "https://api.esclick.co.il";

export default function ChatComponent({
  conversationId,
  partnerId,
  isBusiness,
}) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const [partnerName, setPartnerName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [typingUsers, setTypingUsers] = useState([]);
  const socketRef = useRef(null);
  const bottomRef = useRef(null);
  let typingTimeout = useRef();

  // Scroll to bottom
  const scrollToBottom = useCallback(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Load partner name
  useEffect(() => {
    if (!partnerId) return;
    API.get(`/users/${partnerId}`, { withCredentials: true })
      .then(res => setPartnerName(res.data.name || ""))
      .catch(() => {});
  }, [partnerId]);

  // Load history + socket events
  useEffect(() => {
    if (!conversationId) return;
    setIsLoading(true);
    setError("");
    API.get(`/messages/${conversationId}`, { withCredentials: true })
      .then(res => setMessages(res.data))
      .catch(() => setError("שגיאה בטעינת היסטוריה"))
      .finally(() => setIsLoading(false));

    socketRef.current = io(SOCKET_URL, { withCredentials: true });
    socketRef.current.emit("join", conversationId);

    socketRef.current.on("message", msg => {
      setMessages(prev => [...prev, msg]);
    });

    socketRef.current.on("typing", user => {
      setTypingUsers(prev => prev.includes(user) ? prev : [...prev, user]);
      clearTimeout(typingTimeout.current);
      typingTimeout.current = setTimeout(() => {
        setTypingUsers(prev => prev.filter(u => u !== user));
      }, 2000);
    });

    return () => socketRef.current.disconnect();
  }, [conversationId]);

  // Emit typing
  const handleTyping = e => {
    setText(e.target.value);
    socketRef.current.emit("typing", isBusiness ? 'עסק' : 'לקוח');
  };

  // Send message + file
  const sendMessage = async () => {
    if (!text.trim() && !file) return;
    setIsSending(true);
    setError("");

    const payload = new FormData();
    payload.append('conversationId', conversationId);
    payload.append('text', text);
    payload.append('to', partnerId);
    payload.append('fromBusiness', isBusiness);
    payload.append('timestamp', new Date().toISOString());
    if (file) payload.append('file', file);

    try {
      const res = await API.post("/messages", payload, {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const msg = res.data;
      socketRef.current.emit("sendMessage", msg);
      setMessages(prev => [...prev, { ...msg, fromSelf: true }]);
      setText("");
      setFile(null);
    } catch {
      setError("שגיאה בשליחת ההודעה");
    } finally {
      setIsSending(false);
    }
  };

  // Retry loading
  const retry = () => {
    if (conversationId) {
      setError("");
      setIsLoading(true);
      API.get(`/messages/${conversationId}`, { withCredentials: true })
        .then(res => setMessages(res.data))
        .catch(() => setError("שגיאה בטעינת היסטוריה"))
        .finally(() => setIsLoading(false));
    }
  };

  return (
    <div className="chat-component">
      {isLoading && <div className="spinner">טעינה…</div>}
      {error && <div className="error-banner" onClick={retry}>{error} (נסה שוב)</div>}

      <div className="messages-list">
        {messages.map(m => (
          <div
            key={m._id || m.timestamp}
            className={`message-item ${m.fromSelf ? "self" : ""}`}
          >
            <div className="message-meta">
              <strong>{m.fromSelf ? "אתה" : partnerName}</strong>
              <span className="timestamp">
                {m.timestamp && new Date(m.timestamp).toLocaleTimeString("he-IL", { hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>
            {m.fileUrl && <img src={m.fileUrl} alt="attachment" className="attachment" />}
            <p className="message-text">{m.text}</p>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {typingUsers.length > 0 && (
        <div className="typing-indicator">
          {typingUsers.join(', ')} מקליד…
        </div>
      )}

      <div className="input-area">
        <input
          type="text"
          value={text}
          onChange={handleTyping}
          placeholder="הודעה…"
          onKeyDown={e => e.key === "Enter" && sendMessage()}
          disabled={isSending}
        />
        <input
          type="file"
          onChange={e => setFile(e.target.files[0])}
          disabled={isSending}
        />
        <button onClick={sendMessage} disabled={isSending}>
          {isSending ? 'שולח…' : 'שלח'}
        </button>
      </div>
    </div>
  );
}
