import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import "./ClientChatTab.css";

export default function ClientChatTab({ conversationId, businessId, userId, partnerId }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userScrolledUp, setUserScrolledUp] = useState(false);

  const socketRef = useRef();
  const messageListRef = useRef();
  const typingTimeout = useRef();
  const fileInputRef = useRef();
  const textareaRef = useRef();
  const [recording, setRecording] = useState(false);
  const mediaRecorderRef = useRef();
  const recordedChunksRef = useRef([]);

  // התחברות לסוקט וטעינת היסטוריה
  useEffect(() => {
    if (!conversationId) return;
    setLoading(true);

    const socketUrl = import.meta.env.VITE_SOCKET_URL;
    socketRef.current = io(socketUrl, {
      path: "/socket.io",
      query: { conversationId, userId, role: "client", businessName: "" },
    });

    socketRef.current.emit(
      "getHistory",
      { conversationId },
      (history) => {
        setMessages(Array.isArray(history) ? history : []);
        setLoading(false);
      }
    );

    socketRef.current.on("newMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
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
      // שחרור URL-ים זמניים של הודעות מקומיות
      messages.forEach(m => {
        if (m.isLocal && m.fileUrl) {
          URL.revokeObjectURL(m.fileUrl);
        }
      });
    };
  }, [conversationId, businessId, userId]);

  // גלילה אוטומטית מכבדת גלילה ידנית
  useEffect(() => {
    if (!userScrolledUp && messageListRef.current) {
      messageListRef.current.scrollTo({
        top: messageListRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, isTyping, userScrolledUp]);

  // מניעת גלילה אוטומטית אם המשתמש גולל למעלה
  const onScroll = () => {
    if (!messageListRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = messageListRef.current;
    setUserScrolledUp(scrollTop + clientHeight < scrollHeight - 20);
  };

  // התאמת גובה הטקסטארא
  const resizeTextarea = () => {
    if (!textareaRef.current) return;
    textareaRef.current.style.height = "auto";
    textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
  };

  // שליחת הודעה
  const sendMessage = () => {
    const text = input.trim();
    if (!text || sending) return;
    setSending(true);
    socketRef.current.emit(
      "sendMessage",
      {
        conversationId,
        from: userId,
        to: businessId,
        role: "client",
        text,
      },
      (ack) => {
        setSending(false);
        if (ack?.ok) setInput("");
        else alert("שגיאה בשליחת ההודעה");
      }
    );
  };

  // שליחת קובץ
  const sendFile = (file) => {
    if (!file || !conversationId) return;
    setSending(true);
    const reader = new FileReader();
    reader.onload = () => {
      socketRef.current.emit(
        "sendMessage",
        {
          conversationId,
          from: userId,
          to: businessId,
          role: "client",
          file: {
            name: file.name,
            type: file.type,
            data: reader.result,
          },
        },
        (ack) => {
          setSending(false);
          if (!ack?.ok) alert("שגיאה בשליחת קובץ");
        }
      );
    };
    reader.readAsDataURL(file);
  };

  // שליחת קול עם יצירת URL זמני להצגה מידית
  const sendAudio = (blob) => {
    if (!conversationId) return;

    // יצירת URL זמני להצגה מיידית
    const audioUrl = URL.createObjectURL(blob);

    // הוספת הודעה מקומית עם URL זמני
    setMessages(prev => [
      ...prev,
      {
        _id: Date.now(), // id זמני
        from: userId,
        to: businessId,
        role: "client",
        fileUrl: audioUrl,
        fileName: "voice.webm",
        timestamp: new Date().toISOString(),
        isLocal: true,
      }
    ]);

    setSending(true);
    const reader = new FileReader();
    reader.onload = () => {
      socketRef.current.emit(
        "sendMessage",
        {
          conversationId,
          from: userId,
          to: businessId,
          role: "client",
          file: {
            name: "voice.webm",
            type: "audio/webm",
            data: reader.result,
          },
        },
        (ack) => {
          setSending(false);
          if (!ack?.ok) alert("שגיאה בשליחת קול");
        }
      );
    };
    reader.readAsDataURL(blob);
  };

  // שינוי שדה הקלט עם שליחה של אירוע "מקליד"
  const handleInput = (e) => {
    setInput(e.target.value);
    resizeTextarea();
    if (socketRef.current && !sending) {
      socketRef.current.emit("typing", {
        conversationId,
        from: userId,
        to: businessId,
      });
    }
  };

  // טיפול בקבצים
  const handleAttach = () => fileInputRef.current.click();
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) sendFile(file);
    e.target.value = null;
  };

  // הקלטה קולית (כמו בקוד שלך)
  const handleRecordToggle = async () => {
    if (recording) {
      mediaRecorderRef.current.stop();
      setRecording(false);
    } else {
      recordedChunksRef.current = [];
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorderRef.current = new MediaRecorder(stream);
        mediaRecorderRef.current.ondataavailable = (ev) => {
          if (ev.data.size > 0) recordedChunksRef.current.push(ev.data);
        };
        mediaRecorderRef.current.onstop = () => {
          const blob = new Blob(recordedChunksRef.current, { type: "audio/webm" });
          sendAudio(blob);
        };
        mediaRecorderRef.current.start();
        setRecording(true);
      } catch {
        alert("לא הצלחנו להתחיל הקלטה");
      }
    }
  };

  return (
    <div className="chat-container client">
      <div className="message-list" ref={messageListRef} onScroll={onScroll} aria-live="polite">
        {loading && <div className="loading">טוען...</div>}
        {!loading && messages.length === 0 && <div className="empty">עדיין אין הודעות</div>}
        {messages.map((m, i) => (
          <div
            key={m._id || i}
            className={`message${m.from === userId ? " mine" : " theirs"} fade-in`}
          >
            {m.fileUrl ? (
              m.fileUrl.match(/\.(mp3|webm|wav)$/i) ? (
                <audio controls src={m.fileUrl} />
              ) : m.fileUrl.match(/\.(jpe?g|png|gif)$/i) ? (
                <img
                  src={m.fileUrl}
                  alt={m.fileName || "image"}
                  style={{ maxWidth: "200px", borderRadius: "8px" }}
                />
              ) : (
                <a href={m.fileUrl} target="_blank" rel="noopener noreferrer">
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
        ))}
        {isTyping && <div className="typing-indicator">העסק מקליד...</div>}
      </div>

      <div className="inputBar">
        {/* כפתור שלח - שמאל */}
        <button
          className="sendButtonFlat"
          onClick={sendMessage}
          disabled={sending || !input.trim()}
          title="שלח"
          aria-label="שלח הודעה"
        >
          ◀
        </button>
        {/* שדה הקלט (textarea) */}
        <textarea
          className="inputField"
          placeholder="הקלד הודעה..."
          value={input}
          disabled={sending}
          onChange={handleInput}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), sendMessage())}
          ref={textareaRef}
          rows={1}
          aria-label="כתיבת הודעה"
        />
        {/* כפתורי ימין */}
        <div className="inputBar-right">
          <button
            type="button"
            className="attachBtn"
            title="צרף קובץ"
            onClick={handleAttach}
            disabled={sending}
            aria-label="צרף קובץ"
          >
            📎
          </button>
          <button
            type="button"
            className={`recordBtn${recording ? " recording" : ""}`}
            title={recording ? "עצור הקלטה" : "התחל הקלטה"}
            onClick={handleRecordToggle}
            disabled={sending}
            aria-label={recording ? "עצור הקלטה קולית" : "התחל הקלטה קולית"}
          >
            🎤
          </button>
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleFileChange}
            disabled={sending}
            aria-hidden="true"
          />
        </div>
      </div>
    </div>
  );
}
