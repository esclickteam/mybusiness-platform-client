import React, { useState, useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import "./ClientChatTab.css";
import { Buffer } from "buffer";
import API from "../api";

function WhatsAppAudioPlayer({ src, userAvatar, duration }) {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => setProgress(audio.currentTime);
    const onEnded = () => {
      setPlaying(false);
      setProgress(0);
    };

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("ended", onEnded);
    audio.load();

    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("ended", onEnded);
    };
  }, [src]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    playing ? audio.pause() : audio.play();
    setPlaying((p) => !p);
  };

  const formatTime = (time) => {
    if (!time || isNaN(time) || !isFinite(time)) return "0:00";
    const m = Math.floor(time / 60);
    const s = Math.floor(time % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const totalDots = 20;
  const activeDot = duration ? Math.floor((progress / duration) * totalDots) : 0;
  const containerClass = userAvatar
    ? "custom-audio-player with-avatar"
    : "custom-audio-player no-avatar";

  return (
    <div className={containerClass}>
      {userAvatar && (
        <div className="avatar-wrapper">
          <img src={userAvatar} alt="avatar" />
          <div className="mic-icon">🎤</div>
        </div>
      )}
      <button
        onClick={togglePlay}
        aria-label={playing ? "Pause audio" : "Play audio"}
        className={`play-pause ${playing ? "playing" : ""}`}
      >
        {playing ? "❚❚" : "▶"}
      </button>
      <div className="progress-dots">
        {[...Array(totalDots)].map((_, i) => (
          <div key={i} className={`dot${i <= activeDot ? " active" : ""}`} />
        ))}
      </div>
      <div className="time-display">
        {formatTime(progress)} / {formatTime(duration || 0)}
      </div>
      <audio ref={audioRef} src={src} preload="metadata" />
    </div>
  );
}

export default function ClientChatTab({ socket, conversationId, businessId, userId }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [recording, setRecording] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState(null);
  const [timer, setTimer] = useState(0);

  const messageListRef = useRef(null);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);
  const timerRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const recordedChunksRef = useRef([]);
  const mediaStreamRef = useRef(null);

  useEffect(() => {
    if (!conversationId) return;
    setLoading(true);
    setError("");
    API.get("/conversations/history", { params: { conversationId } })
      .then((res) => {
        setMessages(res.data);
        setLoading(false);
      })
      .catch(() => {
        setMessages([]);
        setError("שגיאה בטעינת היסטוריית ההודעות");
        setLoading(false);
      });
  }, [conversationId]);

  useEffect(() => {
    if (!socket) return;

    const handleIncomingMessage = (msg) => {
      console.log("Received socket message:", msg);

      // מזהה ייחודי להודעה, לפי סדר עדיפות
      const id = msg._id || msg.recommendationId || msg.tempId;

      setMessages((prev) => {
        let replaced = false;
        const updated = prev.map((m) => {
          if (
            (m._id && id && m._id === id) ||
            (m.recommendationId && id && m.recommendationId === id) ||
            (m.tempId && id && m.tempId === id)
          ) {
            replaced = true;
            return { ...m, ...msg };
          }
          return m;
        });
        if (replaced) return updated;

        // אם ההודעה לא קיימת כלל, הוסף חדשה
        const exists = prev.some(
          (m) =>
            (m._id && id && m._id === id) ||
            (m.recommendationId && id && m.recommendationId === id) ||
            (m.tempId && id && m.tempId === id)
        );
        if (exists) return prev;

        return [...prev, msg];
      });
    };

    socket.on("newMessage", handleIncomingMessage);
    socket.on("newAiSuggestion", handleIncomingMessage);
    socket.on("messageApproved", handleIncomingMessage);

    socket.emit("joinConversation", conversationId);
    socket.emit("joinRoom", businessId);

    return () => {
      socket.off("newMessage", handleIncomingMessage);
      socket.off("newAiSuggestion", handleIncomingMessage);
      socket.off("messageApproved", handleIncomingMessage);
      socket.emit("leaveConversation", conversationId);
    };
  }, [socket, conversationId, businessId]);

  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [messages]);

  const resizeTextarea = () => {
    if (!textareaRef.current) return;
    textareaRef.current.style.height = "auto";
    textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
  };

  // פונקציה לשליחת הודעה עם tempId (שליחה אופטימית)
  const sendMessage = () => {
    if (!input.trim() || sending || !socket) return;
    setSending(true);
    const tempId = uuidv4();

    const optimisticMsg = {
      _id: tempId, // משתמשים ב-tempId זמני בהתחלה
      tempId,
      conversationId,
      from: userId,
      to: businessId,
      role: "client",
      text: input.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, optimisticMsg]);
    setInput("");

    socket.emit(
      "sendMessage",
      {
        conversationId,
        from: userId,
        to: businessId,
        role: "client",
        text: optimisticMsg.text,
        tempId,
      },
      (ack) => {
        setSending(false);
        if (ack?.ok && ack.message) {
          // מחליפים הודעה זמנית בהודעה המאושרת עם _id אמיתי
          setMessages((prev) =>
            prev.map((msg) => (msg.tempId === tempId ? { ...ack.message } : msg))
          );
        } else {
          // במקרה של שגיאה, מסירים את ההודעה הזמנית ומציגים שגיאה
          setMessages((prev) => prev.filter((msg) => msg.tempId !== tempId));
          setError("שגיאה בשליחת ההודעה");
        }
      }
    );
  };

  // כאן ניתן להוסיף שאר הפונקציות והלוגיקות שלך (הקלטה, שליחת קבצים וכו')...

  return (
    <div className="chat-container client">
      <div className="message-list" ref={messageListRef}>
        {loading && <div className="loading">טוען...</div>}
        {!loading && messages.length === 0 && <div className="empty">עדיין אין הודעות</div>}
        {messages.map((m) => (
          <div
            key={
              m.recommendationId
                ? `${m.recommendationId}_rec`
                : m._id
                ? `${m._id}_msg`
                : m.tempId
                ? `${m.tempId}_temp`
                : uuidv4()
            }
            className={`message${m.role === "client" ? " mine" : " theirs"}${
              m.isRecommendation ? " ai-recommendation" : ""
            }`}
          >
            {/* כאן הקוד להצגת תוכן ההודעה (טקסט, תמונות, אודיו וכו') */}
            <div className="text">{m.text}</div>
            <div className="meta">
              <span className="time">
                {(() => {
                  const timeString = m.timestamp || m.createdAt || "";
                  if (!timeString) return "";
                  const date = new Date(timeString);
                  if (isNaN(date.getTime())) return "";
                  return date.toLocaleTimeString("he-IL", {
                    hour: "2-digit",
                    minute: "2-digit",
    });
  })()}
</span>
              {m.fileDuration && (
                <span className="audio-length">
                  {String(Math.floor(m.fileDuration / 60)).padStart(2, "0")}:
                  {String(Math.floor(m.fileDuration % 60)).padStart(2, "0")}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="inputBar">
        {error && <div className="error-alert">⚠ {error}</div>}

        {(recording || recordedBlob) ? (
          <div className="audio-preview-row">
            {recording ? (
              <>
                <button className="recordBtn recording" onClick={handleRecordStop} type="button">
                  ⏹️
                </button>
                <span className="preview-timer">
                  {String(Math.floor(timer / 60)).padStart(2, "0")}:
                  {String(timer % 60).padStart(2, "0")}
                </span>
                <button
                  className="preview-btn trash"
                  onClick={() => {
                    setRecording(false);
                    setRecordedBlob(null);
                    setTimer(0);
                  }}
                  type="button"
                >
                  🗑️
                </button>
              </>
            ) : (
              <>
                <audio src={URL.createObjectURL(recordedBlob)} controls style={{ height: 30 }} />
                <div>
                  משך הקלטה:{" "}
                  {String(Math.floor(timer / 60)).padStart(2, "0")}:
                  {String(timer % 60).padStart(2, "0")}
                </div>
                <button className="send-btn" onClick={handleSendRecording} disabled={sending}>
                  שלח
                </button>
              </>
            )}
          </div>
        ) : (
          <>
            <textarea
              ref={textareaRef}
              className="inputField"
              placeholder="הקלד הודעה..."
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                resizeTextarea();
              }}
              onKeyDown={(e) =>
                e.key === "Enter" && !e.shiftKey && (e.preventDefault(), sendMessage())
              }
              disabled={sending}
              rows={1}
            />
            <button
              className="sendButtonFlat"
              onClick={sendMessage}
              disabled={sending || !input.trim()}
              type="button"
            >
              ◀
            </button>
            <div className="inputBar-right">
              <button className="attachBtn" onClick={handleAttach} disabled={sending} type="button">
                📎
              </button>
              <button
                className={`recordBtn${recording ? " recording" : ""}`}
                onClick={handleRecordStart}
                disabled={sending}
                type="button"
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
