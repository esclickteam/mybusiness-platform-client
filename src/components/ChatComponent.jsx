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
  const typingTimeout = useRef();

  // Scroll to bottom when messages change
  const scrollToBottom = useCallback(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Load partner name
  useEffect(() => {
    if (!partnerId) return;
    API.get(`/business/${partnerId}`, { withCredentials: true })
      .then(res => setPartnerName(res.data.businessName || ""))
      .catch(() => setPartnerName(''));
  }, [partnerId]);

  // Load conversation history and init socket
  useEffect(() => {
    if (!conversationId) return;
    setIsLoading(true);
    setError("");

    // Fetch history
    API.get(`/messages/conversations/${conversationId}`, { withCredentials: true })
      .then(res => setMessages(res.data))
      .catch(() => setError("שגיאה בטעינת היסטוריה"))
      .finally(() => setIsLoading(false));

    // Setup socket.io
    socketRef.current = io(SOCKET_URL, { withCredentials: true });
    socketRef.current.emit("joinRoom", conversationId);

    socketRef.current.on("newMessage", msg => {
      setMessages(prev => [...prev, msg]);
    });

    socketRef.current.on("typing", user => {
      setTypingUsers(prev => prev.includes(user) ? prev : [...prev, user]);
      clearTimeout(typingTimeout.current);
      typingTimeout.current = setTimeout(() => {
        setTypingUsers(prev => prev.filter(u => u !== user));
      }, 2000);
    });

    return () => socketRef.current?.disconnect();
  }, [conversationId]);

  // Handle typing indicator
  const handleTyping = e => {
    setText(e.target.value);
    socketRef.current?.emit("typing", isBusiness ? 'עסק' : 'לקוח');
  };

  // Send message (text or file)
  const sendMessage = async () => {
    if (!text.trim() && !file) return;
    setIsSending(true);
    setError("");

    const payload = new FormData();
    payload.append('to', partnerId);
    payload.append('text', text);
    payload.append('conversationId', conversationId);
    if (file) payload.append('fileData', file);

    try {
      const res = await API.post(
  `/messages/${conversationId}/messages`,
  payload,
  { withCredentials: true }
);
      const { message: msg } = res.data;
      setMessages(prev => [...prev, { ...msg, fromSelf: true }]);
      setText("");
      setFile(null);
    } catch {
      setError("שגיאה בשליחת ההודעה");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="chat-component">
      {isLoading && <div className="spinner">טעינה…</div>}
      {error && <div className="error-banner" onClick={() => window.location.reload()}>{error} (רענן)</div>}

      <div className="messages-list">
        {messages.map(m => (
          <div
            key={m.timestamp}
            className={`message-item ${m.fromSelf ? "self" : ""}`}
          >
            <div className="message-meta">
              <strong>{m.fromSelf ? "אתה" : partnerName}</strong>
              <span className="timestamp">
                {new Date(m.timestamp).toLocaleTimeString("he-IL", { hour: "2-digit", minute: "2-digit" })}
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