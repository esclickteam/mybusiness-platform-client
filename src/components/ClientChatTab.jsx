import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
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
  const fileInputRef = useRef();
  const [recording, setRecording] = useState(false);
  const mediaRecorderRef = useRef();
  const recordedChunksRef = useRef([]);

  // 1. התחברות והיסטוריה
  useEffect(() => {
    if (!conversationId) return;
    setLoading(true);

    // התחבר לסוקט
    const socketUrl = import.meta.env.VITE_SOCKET_URL;
    socketRef.current = io(socketUrl, {
      path: "/socket.io",
      query: { conversationId, userId, role: "client" },
    });

    // בקש היסטוריה
    socketRef.current.emit("getHistory", { conversationId }, (history) => {
      setMessages(Array.isArray(history) ? history : []);
      setLoading(false);
    });

    // מאזין להודעות חדשות
    socketRef.current.on("newMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    // מקבל "מקליד"
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
  }, [conversationId, businessId, userId]);

  // גלילה אוטומטית
  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  // שליחת טקסט
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
    reader.readAsDataURL(file); // הופך לבייס64
  };

  // שליחת הקלטת קול
  const sendAudio = (blob) => {
    if (!conversationId) return;
    setSending(true);
    const reader = new FileReader();
    reader.onload = () => {
      socketRef.current.emit(
        "sendMessage",
        {
          conversationId,
          from: userId,
          to: businessId,
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

  // קלט הודעה
  const handleInput = (e) => {
    setInput(e.target.value);
    if (socketRef.current && !sending) {
      socketRef.current.emit("typing", {
        conversationId,
        from: userId,
        to: businessId,
      });
    }
  };

  // קבצים
  const handleAttach = () => fileInputRef.current.click();
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) sendFile(file);
    e.target.value = null;
  };

  // הקלטה קולית
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
      } catch (err) {
        alert("לא הצלחנו להתחיל הקלטה");
      }
    }
  };

  return (
    <div className="chat-container client">
      <div className="message-list" ref={messageListRef}>
        {loading && <div className="loading">טוען...</div>}
        {!loading && messages.length === 0 && <div className="empty">עדיין אין הודעות</div>}
        {messages.map((m, i) => (
          <div key={m._id || i} className={`message${m.from === userId ? " mine" : " theirs"}`}>
            {m.fileUrl ? (
              m.fileUrl.match(/\.(mp3|webm|wav)$/i) ? (
                <audio controls src={m.fileUrl} />
              ) : m.fileUrl.match(/\.(jpe?g|png|gif)$/i) ? (
                <img src={m.fileUrl} alt={m.fileName || "image"} style={{ maxWidth: '200px', borderRadius: '8px' }} />
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
            onClick={handleAttach}
            disabled={sending}
          >📎</button>
          <button
            type="button"
            className={`recordBtn${recording ? " recording" : ""}`}
            title={recording ? "עצור הקלטה" : "התחל הקלטה"}
            onClick={handleRecordToggle}
            disabled={sending}
          >🎤</button>
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={handleFileChange}
            disabled={sending}
          />
        </div>
      </div>
    </div>
  );
}
