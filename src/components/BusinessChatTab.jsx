// src/components/BusinessChatTab.jsx
import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import API from "../api";
import "./BusinessChatTab.css";

export default function BusinessChatTab({ conversationId, businessId, customerId }) {
  const [messages, setMessages]     = useState([]);
  const [input, setInput]           = useState("");
  const [sending, setSending]       = useState(false);
  const [isTyping, setIsTyping]     = useState(false);
  const [loading, setLoading]       = useState(true);
  const [recording, setRecording]   = useState(false);

  const socketRef       = useRef();
  const messageListRef  = useRef();
  const typingTimeout   = useRef();
  const fileInputRef    = useRef();
  const mediaRecorder   = useRef(null);
  const recordedChunks  = useRef([]);

  // Load history + open socket
  useEffect(() => {
    if (!conversationId) return;
    setLoading(true);

    API.get("/messages/history", {
      params: { conversationId },
      withCredentials: true,
    })
      .then(res => {
        const loaded = Array.isArray(res.data)
          ? res.data
          : res.data.messages || [];
        setMessages(loaded);
      })
      .catch(() => {})
      .finally(() => setLoading(false));

    const socketUrl = import.meta.env.VITE_SOCKET_URL;
    socketRef.current = io(socketUrl, {
      query: { conversationId, userId: businessId, role: "business" },
    });
    socketRef.current.on("connect", () => {
      socketRef.current.emit("joinRoom", conversationId);
    });
    socketRef.current.on("newMessage", msg => {
      setMessages(prev =>
        prev.some(m => m._id === msg._id) ? prev : [...prev, msg]
      );
    });
    socketRef.current.on("typing", ({ from }) => {
      if (from === customerId) {
        setIsTyping(true);
        clearTimeout(typingTimeout.current);
        typingTimeout.current = setTimeout(() => setIsTyping(false), 1800);
      }
    });

    return () => {
      socketRef.current.disconnect();
      clearTimeout(typingTimeout.current);
      setMessages([]);
    };
  }, [conversationId, businessId, customerId]);

  // Auto-scroll
  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  // Start/stop recording
  const toggleRecording = async () => {
    if (recording) {
      mediaRecorder.current.stop();
      setRecording(false);
    } else {
      // request mic
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      recordedChunks.current = [];
      mediaRecorder.current = new MediaRecorder(stream);
      mediaRecorder.current.ondataavailable = e => {
        if (e.data.size > 0) recordedChunks.current.push(e.data);
      };
      mediaRecorder.current.onstop = sendRecording;
      mediaRecorder.current.start();
      setRecording(true);
    }
  };

  // Send recorded audio
  const sendRecording = () => {
    const blob = new Blob(recordedChunks.current, { type: "audio/webm" });
    sendFile(blob, `voice-${Date.now()}.webm`);
  };

  // Generic file send
  const sendFile = async (fileBlob, fileName) => {
    if (!conversationId || !customerId) return;
    setSending(true);
    try {
      const form = new FormData();
      form.append("conversationId", conversationId);
      form.append("to", customerId);
      form.append("text", "");
      form.append("fileData", fileBlob, fileName);

      await API.post("/messages/send", form, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });
    } catch (err) {
      console.error("Error sending file:", err);
      alert("שגיאה בשליחת הקובץ. נסה שוב.");
    } finally {
      setSending(false);
    }
  };

  // Click 📎 to open file picker
  const onAttachClick = () => {
    fileInputRef.current.click();
  };

  // Handle file selection
  const onFileChange = e => {
    const file = e.target.files[0];
    if (file) sendFile(file, file.name);
    e.target.value = "";
  };

  // Send text message
  const sendMessage = async () => {
    if (!input.trim() || sending) return;
    setSending(true);
    try {
      await API.post(
        "/messages/send",
        { conversationId, to: customerId, text: input.trim() },
        { withCredentials: true }
      );
      setInput("");
    } catch {
      alert("שגיאה בשליחת ההודעה");
    } finally {
      setSending(false);
    }
  };

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

  return (
    <>
      <div className="messageList" ref={messageListRef}>
        {loading && <div className="loading">טוען...</div>}
        {!loading && messages.length === 0 && <div className="empty">עדיין אין הודעות</div>}
        {messages.map((m, i) => (
          m.system ? (
            <div key={i} className="system-message">{m.text}</div>
          ) : (
            <div
              key={m._id || i}
              className={"message" + (m.from === businessId ? " mine" : " theirs")}
            >
              <div className="content">
                {m.fileUrl && (
                  m.fileUrl.endsWith(".webm") ? (
                    <audio controls src={m.fileUrl} />
                  ) : (
                    <img src={m.fileUrl} alt={m.fileName} className="message-image"/>
                  )
                )}
                {m.text && <div className="text">{m.text}</div>}
              </div>
              <div className="meta">
                <span className="time">
                  {new Date(m.timestamp).toLocaleTimeString("he-IL", {
                    hour: "2-digit", minute: "2-digit"
                  })}
                </span>
                {m.from === businessId && <span className={`status ${m.status||"sent"}`} />}
              </div>
            </div>
        )))}
        {isTyping && <div className="typing-indicator">הלקוח מקליד...</div>}
      </div>

      <div className="inputBar">
  {/* כפתור שלח - שמאל */}
  <button
    className="sendButtonFlat"
    onClick={sendMessage}
    disabled={sending || !input.trim()}
    title="שלח"
  >
    ◀
  </button>

  {/* שדה הקלט */}
  <input
    className="inputField"
    type="text"
    placeholder="הקלד הודעה..."
    value={input}
    disabled={sending}
    onChange={handleInput}
    onKeyDown={e => e.key === "Enter" && sendMessage()}
  />

  {/* כפתורי ימין */}
  <div className="inputBar-right">
    <button
      type="button"
      className="attachBtn"
      title="צרף קובץ"
      onClick={onAttachClick}
      disabled={sending}
    >📎</button>
    <button
      type="button"
      className={`recordBtn${recording ? " recording" : ""}`}
      title={recording ? "עצור הקלטה" : "התחל הקלטה"}
      onClick={toggleRecording}
      disabled={sending}
    >🎤</button>
    <input
      type="file"
      ref={fileInputRef}
      style={{ display: 'none' }}
      onChange={onFileChange}
      disabled={sending}
    />
  </div>
</div>
    </>
  );
}
