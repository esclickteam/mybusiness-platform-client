// src/components/ClientChatTab.jsx
import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import "./ClientChatTab.css";

export default function ClientChatTab({ conversationId, businessId, userId }) {
  // State
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userScrolledUp, setUserScrolledUp] = useState(false);
  const [error, setError] = useState("");
  // Recording state
  const [recording, setRecording] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState(null);
  const [timer, setTimer] = useState(0);
  const [isBlocked, setIsBlocked] = useState(false);

  // Refs
  const socketRef = useRef(null);
  const messageListRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);
  const timerRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const recordedChunksRef = useRef([]);
  const recordStopPromise = useRef(null);

  // חיבור סוקט וטעינת הודעות קודמות
  useEffect(() => {
    if (!conversationId) return;

    setLoading(true);
    setError("");
    setIsBlocked(false);

    const socketUrl = import.meta.env.VITE_SOCKET_URL;
    socketRef.current = io(socketUrl, {
      path: "/socket.io",
      query: { conversationId, userId, role: "client" },
    });

    socketRef.current.emit("getHistory", { conversationId }, (history) => {
      setMessages(Array.isArray(history) ? history : []);
      setLoading(false);
    });

    socketRef.current.on("newMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    socketRef.current.on("typing", ({ from }) => {
      if (from === businessId) {
        setIsTyping(true);
        clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(() => setIsTyping(false), 1500);
      }
    });

    return () => {
      socketRef.current.disconnect();
      clearTimeout(typingTimeoutRef.current);
    };
  }, [conversationId, businessId, userId]);

  // גלילה אוטומטית
  useEffect(() => {
    if (!userScrolledUp && messageListRef.current) {
      messageListRef.current.scrollTo({
        top: messageListRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, isTyping, userScrolledUp]);

  const onScroll = () => {
    if (!messageListRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = messageListRef.current;
    setUserScrolledUp(scrollTop + clientHeight < scrollHeight - 20);
  };

  // התאמת גובה textarea
  const resizeTextarea = () => {
    if (!textareaRef.current) return;
    textareaRef.current.style.height = "auto";
    textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
  };

  // שליחת טקסט
  const sendMessage = () => {
    const text = input.trim();
    if (!text || sending) return;
    setSending(true);
    setError("");
    socketRef.current.emit(
      "sendMessage",
      { conversationId, from: userId, to: businessId, role: "client", text },
      (ack) => {
        setSending(false);
        if (ack?.ok) setInput("");
        else setError("שגיאה בשליחת ההודעה, נסה שוב");
      }
    );
  };

  // שליחת קובץ
  const sendFile = (file) => {
    if (!file) return;
    setSending(true);
    setError("");
    const reader = new FileReader();
    reader.onload = () => {
      socketRef.current.emit(
        "sendMessage",
        {
          conversationId,
          from: userId,
          to: businessId,
          role: "client",
          file: { name: file.name, type: file.type, data: reader.result },
        },
        (ack) => {
          setSending(false);
          if (!ack?.ok) setError("שגיאה בשליחת קובץ");
        }
      );
    };
    reader.readAsDataURL(file);
  };

  // שליחת הקלטה קולית
  const sendAudio = (blob) => {
    if (!blob) return;
    setSending(true);
    setError("");
    const reader = new FileReader();
    reader.onload = () => {
      socketRef.current.emit(
        "sendMessage",
        {
          conversationId,
          from: userId,
          to: businessId,
          role: "client",
          file: { name: "voice.webm", type: "audio/webm", data: reader.result },
        },
        (ack) => {
          setSending(false);
          if (!ack?.ok) setError("שגיאה בשליחת הקלטה");
        }
      );
    };
    reader.readAsDataURL(blob);
  };

  // ==== הקלטת אודיו ====
  // יוצרים פרומיס שמוחזר ב-stop
  const handleRecordStart = async () => {
    if (recording || isBlocked) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new window.MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      recordedChunksRef.current = [];

      recordStopPromise.current = new Promise((resolve) => {
        recorder.ondataavailable = (e) => {
          if (e.data.size > 0) recordedChunksRef.current.push(e.data);
        };
        recorder.onstop = () => {
          const blob = new Blob(recordedChunksRef.current, { type: "audio/webm" });
          setRecordedBlob(blob);
          resolve(blob);
        };
      });

      recorder.start();
      setRecording(true);
      setTimer(0);
      timerRef.current = setInterval(() => setTimer((t) => t + 1), 1000);
    } catch {
      setError("אין הרשאה להקלטה. בדוק הרשאות דפדפן.");
      setIsBlocked(true);
    }
  };

  // מחכים שהקלטה באמת תסתיים לפני מעבר ל-preview
  const handleRecordStop = async () => {
    if (!recording || !mediaRecorderRef.current) return;
    mediaRecorderRef.current.stop();
    clearInterval(timerRef.current);
    setRecording(false);
    // חכה שה־onstop יסיים
    if (recordStopPromise.current) await recordStopPromise.current;
    setTimer(0);
  };

  // שלח הקלטה
  const handleSendRecording = () => {
    if (!recordedBlob) return;
    sendAudio(recordedBlob);
    setRecordedBlob(null);
    setTimer(0);
  };

  // מחיקת הקלטה
  const handleDiscard = () => {
    setRecordedBlob(null);
    setTimer(0);
  };

  // שינוי אינפוט
  const handleInputChange = (e) => {
    setInput(e.target.value);
    resizeTextarea();
    if (socketRef.current && !sending) {
      socketRef.current.emit("typing", { conversationId, from: userId, to: businessId });
    }
  };

  const handleAttach = () => fileInputRef.current.click();
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) sendFile(file);
    e.target.value = null;
  };

  // גל אנימציה
  const Waveform = () => (
    <div className="waveform">
      {[...Array(5)].map((_, i) => (
        <span key={i} className="wave-dot" />
      ))}
    </div>
  );

  // ==== JSX ====
  return (
    <div className="chat-container client">
      <div className="message-list" ref={messageListRef} onScroll={onScroll}>
        {loading && <div className="loading">טוען...</div>}
        {!loading && messages.length === 0 && <div className="empty">עדיין אין הודעות</div>}
        {messages.map((m, i) => (
          <div key={m._id || i} className={`message${m.from === userId ? " mine" : " theirs"}`}>
            {m.fileUrl ? (
              m.fileType?.startsWith("audio") ? (
                <audio controls src={m.fileUrl} />
              ) : m.fileUrl.match(/\.(jpe?g|png|gif)$/i) ? (
                <img src={m.fileUrl} alt={m.fileName} style={{ maxWidth: 200, borderRadius: 8 }} />
              ) : (
                <a href={m.fileUrl} target="_blank" rel="noopener noreferrer">
                  {m.fileName}
                </a>
              )
            ) : (
              <div className="text">{m.text ?? m.message}</div>
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

      <div className="inputBar">
        {!recordedBlob && error && <div className="error-alert">⚠ {error}</div>}

        {recordedBlob ? (
          <div className="recording-preview">
            <audio controls src={URL.createObjectURL(recordedBlob)} style={{ verticalAlign: "middle" }} />
            <Waveform />
            <span className="preview-timer">
              {String(Math.floor(timer / 60)).padStart(2, "0")}:
              {String(timer % 60).padStart(2, "0")}
            </span>
            <button className="preview-btn send" onClick={handleSendRecording} title="שלח">
              ✔️
            </button>
            <button className="preview-btn trash" onClick={handleDiscard} title="מחק">
              🗑
            </button>
          </div>
        ) : (
          <>
            <button className="sendButtonFlat" onClick={sendMessage} disabled={sending || !input.trim()}>
              ◀
            </button>
            <textarea
              ref={textareaRef}
              className="inputField"
              placeholder="הקלד הודעה..."
              value={input}
              onChange={handleInputChange}
              onFocus={() => setError("")}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), sendMessage())}
              disabled={sending}
              rows={1}
            />
            <div className="inputBar-right">
              <button className="attachBtn" onClick={handleAttach} disabled={sending}>
                📎
              </button>
              <button
                className={`recordBtn${recording ? " recording" : ""}`}
                onMouseDown={handleRecordStart}
                onMouseUp={handleRecordStop}
                onMouseLeave={recording ? handleRecordStop : undefined}
                onTouchStart={handleRecordStart}
                onTouchEnd={handleRecordStop}
                disabled={sending}
                title="לחיצה ארוכה להקלטה"
              >
                🎤
              </button>
              <input
                type="file"
                ref={fileInputRef}
                className="fileInput"
                onChange={handleFileChange}
                disabled={sending}
                style={{ display: "none" }}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
