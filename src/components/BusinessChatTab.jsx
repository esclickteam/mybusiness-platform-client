// src/components/BusinessChatTab.jsx
import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import "./BusinessChatTab.css";

export default function BusinessChatTab({ conversationId, businessId, customerId, businessName }) {
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
  const mediaRecorder = useRef(null);
  const recordedChunks = useRef([]);

  useEffect(() => {
    if (!conversationId) return;
    setLoading(true);

    const socketUrl = import.meta.env.VITE_SOCKET_URL;
    socketRef.current = io(socketUrl, {
      path: "/socket.io",
      query: { conversationId, userId: businessId, role: "business", businessName },
    });

    socketRef.current.emit("getHistory", { conversationId }, (history) => {
      setMessages(history || []);
      setLoading(false);
    });

    socketRef.current.on("connect", () => {
      socketRef.current.emit("joinRoom", conversationId);
    });

    socketRef.current.on("newMessage", (msg) => {
      setMessages(prev => [...prev, msg]);
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
  }, [conversationId, businessId, customerId, businessName]);

  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleRecordToggle = async () => {
    if (recording) {
      mediaRecorder.current.stop();
      setRecording(false);
    } else {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      recordedChunks.current = [];
      mediaRecorder.current = new MediaRecorder(stream);
      mediaRecorder.current.ondataavailable = (e) => {
        if (e.data.size > 0) recordedChunks.current.push(e.data);
      };
      mediaRecorder.current.onstop = sendRecording;
      mediaRecorder.current.start();
      setRecording(true);
    }
  };

  const sendRecording = () => {
    const blob = new Blob(recordedChunks.current, { type: "audio/webm" });
    const reader = new FileReader();
    reader.onloadend = () => {
      sendFile({ name: `voice-${Date.now()}.webm`, type: "audio/webm", data: reader.result });
    };
    reader.readAsDataURL(blob);
  };

  const sendFile = (file) => {
    if (!conversationId || !customerId) return;
    setSending(true);
    socketRef.current.emit(
      "sendMessage",
      {
        conversationId,
        from: businessId,
        to: customerId,
        role: "business",
        text: "",
        file,
      },
      (ack) => {
        setSending(false);
        if (!ack?.ok) alert("שגיאה בשליחת הקובץ");
      }
    );
  };

  const handleAttach = () => fileInputRef.current.click();
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => sendFile({ name: file.name, type: file.type, data: reader.result });
      reader.readAsDataURL(file);
    }
    e.target.value = "";
  };

  const sendMessage = () => {
    if (!input.trim() || sending) return;
    setSending(true);
    socketRef.current.emit(
      "sendMessage",
      {
        conversationId,
        from: businessId,
        to: customerId,
        role: "business",
        text: input.trim(),
      },
      (ack) => {
        setSending(false);
        if (ack?.ok) setInput("");
        else alert("שגיאה בשליחת ההודעה");
      }
    );
  };

  const handleInput = (e) => {
    setInput(e.target.value);
    if (socketRef.current && !sending) {
      socketRef.current.emit("typing", { conversationId, from: businessId, to: customerId });
    }
  };

  return (
    <>
      <div className="messageList" ref={messageListRef}>
        {loading && <div className="loading">טוען...</div>}
        {!loading && messages.length === 0 && <div className="empty">עדיין אין הודעות</div>}
        {messages.map((m, i) =>
          m.system ? (
            <div key={i} className="system-message">{m.text}</div>
          ) : (
            <div
              key={m._id || i}
              className={`message${m.from === businessId ? " mine" : " theirs"}`}>
              <div className="content">
                {m.fileUrl ? (
                  m.fileUrl.endsWith(".webm") ? (
                    <audio controls src={m.fileUrl} />
                  ) : (
                    <img src={m.fileUrl} alt={m.fileName} className="message-image" />
                  )
                ) : m.file ? (
                  m.file.type.startsWith("audio") ? (
                    <audio controls src={m.file.data} />
                  ) : (
                    <img src={m.file.data} alt={m.file.name} className="message-image" />
                  )
                ) : (
                  <div className="text">{m.text}</div>
                )}
              </div>
              <div className="meta">
                <span className="time">
                  {new Date(m.timestamp).toLocaleTimeString("he-IL", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
                {m.from === businessId && <span className={`status ${m.status || "sent"}`} />}
              </div>
            </div>
          )
        )}
        {isTyping && <div className="typing-indicator">הלקוח מקליד...</div>}
      </div>

      <div className="inputBar">
        {/* כפתור שליחה משמאל */}
        <button
          className="sendButtonFlat"
          onClick={sendMessage}
          disabled={sending || !input.trim()}
          title="שלח"
        >
          ◀
        </button>

        {/* שדה הקלט באמצע */}
        <input
          className="inputField"
          type="text"
          placeholder="הקלד הודעה..."
          value={input}
          disabled={sending}
          onChange={handleInput}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />

        {/* כפתורי צרף והקלטה מימין */}
        <div className="inputBar-right">
          <button
            type="button"
            className="attachBtn"
            onClick={handleAttach}
            disabled={sending}
            title="צרף קובץ"
          >
            📎
          </button>
          <button
            type="button"
            className={`recordBtn${recording ? " recording" : ""}`}
            onClick={handleRecordToggle}
            disabled={sending}
            title={recording ? "עצור הקלטה" : "התחל הקלטה"}
          >
            🎤
          </button>
          <input
            type="file"
            ref={fileInputRef}
            className="fileInput"
            onChange={handleFileChange}
            accept="image/*,audio/*,video/*"
          />
        </div>
      </div>
    </>
  );
}
