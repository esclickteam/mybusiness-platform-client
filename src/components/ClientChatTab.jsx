import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import API from "../api"; // baseURL = /api/messages
import "./ClientChatTab.css";

export default function ClientChatTab({
  conversationId,
  businessId,
  userId,
  partnerId,
}) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [loading, setLoading] = useState(true);

  const socketRef = useRef();
  const messageListRef = useRef();
  const typingTimeout = useRef();

  // לצירוף קבצים
  const fileInputRef = useRef();

  // להקלטה קולית
  const [recording, setRecording] = useState(false);
  const mediaRecorderRef = useRef();
  const recordedChunksRef = useRef([]);

  // ─── טעינת היסטוריה ו־Socket.IO ───
  useEffect(() => {
    if (!conversationId) return;
    setLoading(true);

    // קריאה ל־GET /api/messages/conversations/:id
    API.get(`/conversations/${conversationId}`)
      .then(res => setMessages(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));

    const socketUrl = import.meta.env.VITE_SOCKET_URL;
    socketRef.current = io(socketUrl, {
      path: "/socket.io",
      query: { conversationId, userId, role: "client" },
    });

    socketRef.current.on("newMessage", msg => {
      setMessages(prev => [...prev, msg]);
    });

    socketRef.current.on("typing", ({ from }) => {
      if (from === businessId) {
        setIsTyping(true);
        clearTimeout(typingTimeout.current);
        typingTimeout.current = setTimeout(() => setIsTyping(false), 1500);
      }
    });

    return () => {
      socketRef.current.disconnect();
      clearTimeout(typingTimeout.current);
    };
  }, [conversationId]);

  // גלילה אוטומטית
  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  // ─── שליחת טקסט ───
  const sendMessage = async () => {
    const text = input.trim();
    if (!text || sending) return;
    await doSend({ text });
  };

  // ─── מרכז השליחה ───
  const doSend = async ({ text = "", file, audioBlob }) => {
    if (!conversationId) return;
    const to = businessId || partnerId;

    const form = new FormData();
    form.append("to", to);
    form.append("conversationId", conversationId);
    if (text) form.append("text", text);
    if (file) form.append("fileData", file);
    if (audioBlob) form.append("fileData", new File([audioBlob], "voice.webm"));

    setSending(true);
    try {
      // POST /api/messages/send
      const { data } = await API.post("/send", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMessages(prev => [...prev, data.message]);
      setInput("");
    } catch (err) {
      console.error("Send error:", err);
    } finally {
      setSending(false);
    }
  };

  // ─── הקלדת 'מקליד...' ───
  const handleInput = e => {
    setInput(e.target.value);
    if (socketRef.current && !sending) {
      socketRef.current.emit("typing", {
        conversationId,
        from: userId,
        to: businessId,
      });
    }
  };

  // ─── קישור כפתור קובץ ───
  const handleAttach = () => fileInputRef.current.click();
  const handleFileChange = e => {
    const file = e.target.files?.[0];
    if (file) doSend({ file });
    e.target.value = null;
  };

  // ─── Toggle הקלטה קולית ───
  const handleRecordToggle = async () => {
    if (recording) {
      mediaRecorderRef.current.stop();
    } else {
      recordedChunksRef.current = [];
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorderRef.current = new MediaRecorder(stream);
        mediaRecorderRef.current.ondataavailable = ev => {
          if (ev.data.size > 0) recordedChunksRef.current.push(ev.data);
        };
        mediaRecorderRef.current.onstop = () => {
          const blob = new Blob(recordedChunksRef.current, { type: "audio/webm" });
          doSend({ audioBlob: blob });
        };
        mediaRecorderRef.current.start();
      } catch (err) {
        console.error("Recording error:", err);
      }
    }
    setRecording(r => !r);
  };

  return (
    <div className="chat-container client">
      <div className="message-list" ref={messageListRef}>
        {loading && <div className="loading">טוען...</div>}
        {!loading && messages.length === 0 && <div className="empty">עדיין אין הודעות</div>}
        {messages.map((m, i) => (
          <div key={m._id || i} className={`message${m.from===userId?' mine':' theirs'}`}>
            {m.fileUrl ? (
              m.fileUrl.match(/\.(mp3|webm|wav)$/) ? (
                <audio controls src={m.fileUrl} />
              ) : (
                <a href={m.fileUrl} target="_blank" rel="noopener">
                  {m.fileName||"קובץ להורדה"}
                </a>
              )
            ) : (
              <div className="text">{m.text}</div>
            )}
            <div className="meta">
              <span className="time">
                {new Date(m.timestamp).toLocaleTimeString("he-IL", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          </div>
        ))}
        {isTyping && <div className="typing-indicator">העסק מקליד...</div>}
      </div>

      <div className="input-bar client">
        <input
          type="text"
          placeholder="הקלד הודעה..."
          value={input}
          disabled={sending}
          onChange={handleInput}
          onKeyDown={e => e.key==="Enter"&&!e.shiftKey&&sendMessage()}
          className="inputField"
        />

        <button className="sendButtonFlat" onClick={sendMessage} disabled={sending||!input.trim()}>
          <span className="arrowFlat">◀</span>
        </button>

        <button className="attachBtn" onClick={handleAttach} title="צרף קובץ">📎</button>
        <input ref={fileInputRef} type="file" style={{display:'none'}} onChange={handleFileChange} />

        <button
          className={`recordBtn ${recording?'active':''}`}
          onClick={handleRecordToggle}
          title={recording?'עצור הקלטה':'התחל הקלטה'}
        >🎤</button>
      </div>
    </div>
  );
}
