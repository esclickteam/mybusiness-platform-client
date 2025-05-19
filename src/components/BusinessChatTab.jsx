import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import API from "../api"; // baseURL = /api
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

  const socketRef = useRef();
  const messageListRef = useRef();
  const typingTimeout = useRef();
  const fileInputRef = useRef();

  // הקלטה קולית
  const [recording, setRecording] = useState(false);
  const mediaRecorderRef = useRef();
  const recordedChunksRef = useRef([]);

  // טעינת היסטוריה + Socket.IO
  useEffect(() => {
    if (!conversationId) return;
    setLoading(true);

    // טעינת היסטוריה דרך REST
    API.get("/messages/history", {
      params: { conversationId },
    })
      .then(res => setMessages(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));

    // התחברות לסוקט
    const socketUrl = import.meta.env.VITE_SOCKET_URL;
    socketRef.current = io(socketUrl, {
      path: "/socket.io",
      query: {
        conversationId,
        businessId,
        userId: businessId,
        role: "business",
      },
    });

    socketRef.current.on("newMessage", msg => {
      setMessages(prev => {
        const exists = prev.some(
          m =>
            (m._id && msg._id && m._id === msg._id) ||
            (m.timestamp === msg.timestamp &&
              m.from === msg.from &&
              m.text === msg.text)
        );
        if (exists) return prev;
        return [...prev, msg];
      });
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
    };
  }, [conversationId]);

  // גלילה אוטומטית
  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  // מרכז השליחה (טקסט / קובץ / קול)
  const doSend = async ({ text = "", file, audioBlob }) => {
    if (!conversationId) return;
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
      // ההודעה תתווסף דרך הסוקט
    } catch (err) {
      console.error("Send error:", err);
      alert("שגיאה בשליחת ההודעה");
    } finally {
      setSending(false);
    }
  };

  // שליחת טקסט
  const sendText = () => {
    const txt = input.trim();
    if (!txt || sending) return;
    doSend({ text: txt });
  };

  // טיפול קובץ
  const handleAttach = () => fileInputRef.current.click();
  const handleFileChange = e => {
    const file = e.target.files?.[0];
    if (file) doSend({ file });
    e.target.value = null;
  };

  // טיפול הקלטה קולית
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
          const blob = new Blob(recordedChunksRef.current, {
            type: "audio/webm",
          });
          doSend({ audioBlob: blob });
        };
        mediaRecorderRef.current.start();
      } catch (err) {
        console.error("Recording error:", err);
        alert("לא הצלחנו להתחיל הקלטה");
      }
    }
    setRecording(r => !r);
  };

  // שליחת 'מקליד...'
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
        {!loading && messages.length === 0 && (
          <div className="empty">עדיין אין הודעות</div>
        )}
        {messages.map((m, i) =>
          m.system ? (
            <div key={i} className="system-message">
              {m.text}
            </div>
          ) : (
            <div
              key={m._id || i}
              className={
                "message" +
                (m.from === businessId ? " mine" : " theirs") +
                (m.status === "sending" ? " sending" : "")
              }
            >
              {/* תצוגת קובץ/אודיו/טקסט */}
              {m.fileUrl ? (
                m.fileUrl.match(/\.(mp3|webm|wav)$/i) ? (
                  <audio controls src={m.fileUrl} />
                ) : m.fileUrl.match(/\.(jpe?g|png|gif)$/i) ? (
                  <img
                    src={m.fileUrl}
                    alt={m.fileName || "image"}
                    className="attachedImage"
                  />
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
                {m.from === businessId && (
                  <span className={`status ${m.status || "sent"}`} />
                )}
              </div>
            </div>
          )
        )}
        {isTyping && <div className="typing-indicator">הלקוח מקליד...</div>}
      </div>

      <div className="inputBar">
        <button
          type="button"
          className="attachBtn"
          onClick={handleAttach}
          title="צרף קובץ"
        >
          📎
        </button>
        <input
          ref={fileInputRef}
          type="file"
          style={{ display: "none" }}
          onChange={handleFileChange}
        />

        <input
          className="inputField"
          type="text"
          placeholder="הקלד הודעה..."
          value={input}
          disabled={sending}
          onChange={handleInput}
          onKeyDown={e => e.key === "Enter" && sendText()}
        />

        <button
          className="sendButtonFlat"
          onClick={sendText}
          disabled={sending || !input.trim()}
        >
          <span className="arrowFlat">◀</span>
        </button>

        <button
          className={`recordBtn ${recording ? "active" : ""}`}
          onClick={handleRecordToggle}
          title={recording ? "עצור הקלטה" : "התחל הקלטה"}
        >
          🎤
        </button>
      </div>
    </>
  );
}
