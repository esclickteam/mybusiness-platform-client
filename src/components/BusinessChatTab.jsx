// src/components/BusinessChatTab.jsx
import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import API from "../api";              // baseURL = /api
import "./BusinessChatTab.css";

export default function BusinessChatTab({
  conversationId,
  businessId,
  customerId,
}) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [loading, setLoading] = useState(true);
  const [recording, setRecording] = useState(false);

  const socketRef = useRef();
  const messageListRef = useRef();
  const typingTimeout = useRef();
  const fileInputRef = useRef();
  const mediaRecorderRef = useRef();
  const recordedChunksRef = useRef([]);

  // טען היסטוריה ופתח socket
  useEffect(() => {
    if (!conversationId) return;
    setLoading(true);

    API.get(`/messages/conversations/${conversationId}`)
      .then(res => setMessages(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));

    const socketUrl = import.meta.env.VITE_SOCKET_URL;
    socketRef.current = io(socketUrl, {
      path: "/socket.io",
      query: { conversationId, userId: businessId, role: "business" },
    });

    socketRef.current.on("newMessage", msg =>
      setMessages(prev => [...prev, msg])
    );
    socketRef.current.on("typing", ({ from }) => {
      if (from === customerId) {
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

  // שליחת כל סוג הודעה
  const doSend = async ({ text = "", file, audioBlob }) => {
    if (!conversationId || sending) return;
    const to = customerId;
    const form = new FormData();
    form.append("to", to);
    form.append("conversationId", conversationId);
    if (text) form.append("text", text);
    if (file) form.append("fileData", file);
    if (audioBlob)
      form.append("fileData", new File([audioBlob], "voice.webm"));

    setSending(true);
    try {
      await API.post("/messages/send", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setInput("");
    } catch (err) {
      console.error("Send error:", err);
    } finally {
      setSending(false);
    }
  };

  const sendMessage = () => {
    const text = input.trim();
    if (!text) return;
    doSend({ text });
  };

  // טיפוס "מקליד"
  const handleInput = e => {
    setInput(e.target.value);
    if (socketRef.current && !sending) {
      socketRef.current.emit("typing", {
        conversationId,
        from: businessId,
        to: customerId,
      });
    }
  };

  // קבצים
  const handleAttach = () => fileInputRef.current.click();
  const handleFileChange = e => {
    const file = e.target.files?.[0];
    if (file) doSend({ file });
    e.target.value = null;
  };

  // הקלטת קול
  const handleRecordToggle = async () => {
    if (recording) {
      mediaRecorderRef.current.stop();
    } else {
      recordedChunksRef.current = [];
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const recorder = new MediaRecorder(stream);
        mediaRecorderRef.current = recorder;
        recorder.ondataavailable = ev => {
          if (ev.data.size > 0) recordedChunksRef.current.push(ev.data);
        };
        recorder.onstop = () => {
          const blob = new Blob(recordedChunksRef.current, { type: "audio/webm" });
          doSend({ audioBlob: blob });
        };
        recorder.start();
      } catch (err) {
        console.error("Recording error:", err);
      }
    }
    setRecording(r => !r);
  };

  // תצוגת הודעה לפי סוג
  const renderMessage = (m, idx) => (
    <div key={m._id || idx} className={`message${m.from === businessId ? " mine" : " theirs"}`}>
      {m.fileUrl ? (
        /\.(mp3|webm|wav)$/i.test(m.fileUrl) ? (
          <audio controls src={m.fileUrl} />
        ) : /\.(jpe?g|png|gif)$/i.test(m.fileUrl) ? (
          <img src={m.fileUrl} alt={m.fileName || "image"} className="chat-img-preview" />
        ) : (
          <a href={m.fileUrl} target="_blank" rel="noopener">
            {m.fileName || "קובץ להורדה"}
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
  );

  return (
    <div className="chat-container business">
      <div className="message-list" ref={messageListRef}>
        {loading && <div className="loading">טוען...</div>}
        {!loading && messages.length === 0 && <div className="empty">עדיין אין הודעות</div>}
        {messages.map(renderMessage)}
        {isTyping && <div className="typing-indicator">הלקוח מקליד...</div>}
      </div>

      <div className="inputBar">
        <input
          type="text"
          placeholder="הקלד הודעה..."
          value={input}
          disabled={sending}
          onChange={handleInput}
          onKeyDown={e => e.key === "Enter" && !e.shiftKey && sendMessage()}
          className="inputField"
        />
        <button
          className="sendButtonFlat"
          onClick={sendMessage}
          disabled={sending || !input.trim()}
        >
          <span className="arrowFlat">◀</span>
        </button>

        <button className="attachBtn" onClick={handleAttach} title="צרף קובץ">
          📎
        </button>
        <input
          ref={fileInputRef}
          type="file"
          style={{ display: "none" }}
          onChange={handleFileChange}
        />

        <button
          className={`recordBtn ${recording ? "active" : ""}`}
          onClick={handleRecordToggle}
          title={recording ? "עצור הקלטה" : "התחל הקלטה"}
        >
          🎤
        </button>
      </div>
    </div>
  );
}
