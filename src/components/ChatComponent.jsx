import React, { useState, useEffect, useRef, useCallback } from "react";
import { io } from "socket.io-client";
import API from "../api";  // axios.create({ baseURL: process.env.REACT_APP_API_URL + "/api", withCredentials: true })
import "./ChatComponent.css";

const SOCKET_URL = process.env.REACT_APP_API_URL || "https://api.esclick.co.il";

export default function ChatComponent({
  userId,
  partnerId,
  initialConversationId = null,
  isBusiness = false,
  businessName = "",   // passed for client view
  clientName   = "לקוח" // passed for business view
}) {
  const [conversationId, setConversationId] = useState(initialConversationId);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [typingUsers, setTypingUsers] = useState([]);
  const socketRef = useRef(null);
  const bottomRef = useRef(null);
  const typingTimeout = useRef();

  // Scroll to bottom
  const scrollToBottom = useCallback(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);
  useEffect(() => scrollToBottom(), [messages, scrollToBottom]);

  // Reset on partner change
  useEffect(() => {
    setConversationId(initialConversationId);
    setMessages([]);
    setError("");
    setText("");
    setFile(null);
    setTypingUsers([]);
  }, [partnerId, initialConversationId]);

  // Ensure conversation
  const ensureConversation = useCallback(async () => {
    if (!conversationId && partnerId) {
      try {
        const res = await API.post(
          "/messages/conversations",
          { otherId: partnerId },
          { withCredentials: true }
        );
        setConversationId(res.data.conversationId);
        return res.data.conversationId;
      } catch {
        setError("שגיאה ביצירת שיחה");
      }
    }
    return conversationId;
  }, [conversationId, partnerId]);

  // Load & socket
  useEffect(() => {
    let mounted = true;
    const init = async () => {
      if (!partnerId) return;
      const convId = await ensureConversation();
      if (!convId) return;

      setIsLoading(true);
      setError("");

      API.get(`/messages/${convId}/messages`, { withCredentials: true })
        .then(res => mounted && setMessages(res.data))
        .catch(() => mounted && setError("שגיאה בטעינת היסטוריה"))
        .finally(() => mounted && setIsLoading(false));

      socketRef.current?.disconnect();
      const socket = io(SOCKET_URL, { withCredentials: true });
      socketRef.current = socket;

      socket.on("connect", () => socket.emit("joinRoom", convId));
      socket.on("newMessage", msg => setMessages(prev => [...prev, msg]));
      socket.on("typing", user => {
        setTypingUsers(prev => prev.includes(user) ? prev : [...prev, user]);
        clearTimeout(typingTimeout.current);
        typingTimeout.current = setTimeout(() => {
          setTypingUsers(prev => prev.filter(u => u !== user));
        }, 2000);
      });
    };
    init();
    return () => {
      mounted = false;
      socketRef.current?.disconnect();
      clearTimeout(typingTimeout.current);
    };
  }, [partnerId, conversationId, ensureConversation]);

  // Typing
  const handleTyping = e => {
    setText(e.target.value);
    socketRef.current?.emit("typing", isBusiness ? clientName : businessName);
  };

  // Send
  const sendMessage = async () => {
    if ((!text.trim() && !file) || isSending || !partnerId) return;
    setIsSending(true);
    setError("");

    const convId = await ensureConversation();
    if (!convId) { setIsSending(false); return; }

    const form = new FormData();
    form.append("text", text);
    if (file) form.append("fileData", file);

    try {
      const res = await API.post(
        `/messages/${convId}/messages`,
        form,
        { withCredentials: true }
      );
      setMessages(prev => [...prev, res.data]);
      setText("");
      setFile(null);
    } catch {
      setError("שגיאה בשליחת ההודעה");
    } finally {
      setIsSending(false);
    }
  };

  const retryLoad = () => { setError(""); setConversationId(null); };

  return (
    <div className="chat-component">
      {/* Header */}
      <header className="chat-header">
        <h2>{isBusiness ? clientName : businessName}</h2>
      </header>

      {isLoading && <div className="spinner">טעינה…</div>}
      {error && (
        <div className="error-banner">
          {error}
          <button onClick={retryLoad} className="retry-btn">נסה שוב</button>
        </div>
      )}

      <div className="messages-list">
        {messages.map((m, i) => {
          const isSelf = m.from === userId;
          const senderName = isSelf
            ? "אתה"
            : isBusiness ? clientName : businessName;

          return (
            <div
              key={`${m._id||m.timestamp}-${i}`}
              className={`message-item ${isSelf?"self":""}`}
            >
              <div className="message-body">
                <div className="message-meta">
                  <strong>{senderName}</strong>
                  <span className="timestamp">
                    {new Date(m.timestamp).toLocaleTimeString("he-IL", {
                      hour: "2-digit", minute: "2-digit"
                    })}
                  </span>
                </div>
                {m.fileUrl && <img src={m.fileUrl} alt="attachment" className="attachment" />}
                <p className="message-text">{m.text}</p>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {typingUsers.length>0 && <div className="typing-indicator">{typingUsers.join(", ")} מקליד…</div>}

      <div className="input-area">
        <input
          type="text"
          value={text}
          onChange={handleTyping}
          placeholder="הודעה…"
          onKeyDown={e=>e.key==="Enter"&&sendMessage()}
          disabled={!partnerId||isSending||isLoading}
        />
        <input
          type="file"
          onChange={e=>setFile(e.target.files[0])}
          disabled={!partnerId||isSending||isLoading}
        />
        <button
          onClick={sendMessage}
          disabled={!partnerId||isSending||isLoading}
        >
          {isSending?"שולח…":"שלח"}
        </button>
      </div>
    </div>
  );
}
