import React, { useEffect, useRef, useState, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import "./BusinessChatTab.css";

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
  const audioDuration = duration || 0;
  const activeDot = audioDuration
    ? Math.floor((progress / audioDuration) * totalDots)
    : 0;
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
        {formatTime(progress)} / {formatTime(audioDuration)}
      </div>
      <audio ref={audioRef} src={src} preload="metadata" />
    </div>
  );
}

const PAGE_SIZE = 20;

export default function BusinessChatTab({
  conversationId,
  businessId,
  customerId,
  businessName,
  socket,
  messages,
  setMessages,
}) {
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [loading, setLoading] = useState(true);
  const [recording, setRecording] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState(null);
  const [timer, setTimer] = useState(0);

  // Pagination states
  const [page, setPage] = useState(1);
  const [paginatedMessages, setPaginatedMessages] = useState([]);

  const messageListRef = useRef(null);
  const typingTimeout = useRef(null);
  const fileInputRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const recordedChunks = useRef([]);
  const timerRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const currentRoomRef = useRef(null);

  // Update paginated messages on messages or page change
  useEffect(() => {
    const end = page * PAGE_SIZE;
    const sliced = messages.slice(-end);
    setPaginatedMessages(sliced);
  }, [messages, page]);

  // Scroll to bottom only on first page load
  useEffect(() => {
    if (messageListRef.current && page === 1) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [paginatedMessages, page]);

  const handleReconnect = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `/api/conversations/history?conversationId=${conversationId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!response.ok) throw new Error("Failed to fetch history on reconnect");
      const data = await response.json();
      setMessages(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Fetch history on reconnect failed:", err);
    }
  }, [conversationId, setMessages]);

  const handleNew = useCallback(
    (msg) => {
      if (msg.conversationId === conversationId) {
        setMessages((prev) => {
          if (msg.tempId && prev.some((m) => m._id === msg.tempId)) {
            return prev.map((m) =>
              m._id === msg.tempId ? { ...msg, sending: false } : m
            );
          }
          if (prev.some((m) => m._id === msg._id)) {
            return prev;
          }
          return [...prev, msg];
        });
      }
    },
    [conversationId, setMessages]
  );

  const handleTyping = useCallback(
    ({ from }) => {
      if (from === customerId) {
        setIsTyping(true);
        clearTimeout(typingTimeout.current);
        typingTimeout.current = setTimeout(() => setIsTyping(false), 1800);
      }
    },
    [customerId]
  );

  useEffect(() => {
    if (!socket || !conversationId) return;

    if (currentRoomRef.current === conversationId) return;

    if (currentRoomRef.current) {
      socket.emit("leaveConversation", currentRoomRef.current);
    }

    currentRoomRef.current = conversationId;

    setMessages([]);
    setLoading(true);

    socket.emit("joinConversation", conversationId, (res) => {
      const history = Array.isArray(res?.messages) ? res.messages : [];
      setMessages(history);
      setLoading(false);

      if (!history.length) {
        const token = localStorage.getItem("token");
        fetch(`/api/conversations/history?conversationId=${conversationId}`, {
          headers: { Authorization: `Bearer ${token}` },
          credentials: "include",
        })
          .then((r) => {
            if (!r.ok) throw new Error(`HTTP ${r.status}`);
            return r.json();
          })
          .then((data) => setMessages(Array.isArray(data) ? data : []))
          .catch((err) => {
            console.error("Fetch history failed:", err);
            setMessages([]);
          })
          .finally(() => setLoading(false));
      }
    });

    socket.on("newMessage", handleNew);
    socket.on("typing", handleTyping);
    socket.on("reconnect", handleReconnect);

    return () => {
      socket.off("newMessage", handleNew);
      socket.off("typing", handleTyping);
      socket.off("reconnect", handleReconnect);
      clearTimeout(typingTimeout.current);
      if (timerRef.current) clearInterval(timerRef.current);
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((t) => t.stop());
        mediaStreamRef.current = null;
      }
      if (currentRoomRef.current === conversationId) {
        socket.emit("leaveConversation", conversationId);
        currentRoomRef.current = null;
      }
    };
  }, [
    socket,
    conversationId,
    handleNew,
    handleTyping,
    handleReconnect,
    setMessages,
  ]);

  useEffect(() => {
    if (messageListRef.current && page === 1) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [paginatedMessages, page]);

  // Your existing input handlers, sendMessage, recording handlers etc.
  // No changes to these, keep as is.

  // Render:
  return (
    <div className="chat-container business">
      {page * PAGE_SIZE < messages.length && (
        <button
          className="load-more-btn"
          onClick={() => setPage((prev) => prev + 1)}
          style={{
            margin: "10px auto",
            display: "block",
            padding: "8px 12px",
            cursor: "pointer",
            borderRadius: "8px",
            border: "none",
            backgroundColor: "#6e4fff",
            color: "#fff",
            fontWeight: "700",
          }}
          aria-label="טען עוד הודעות ישנות"
        >
          טען עוד הודעות ישנות
        </button>
      )}

      <div className="message-list" ref={messageListRef}>
        {loading && <div className="loading">טוען...</div>}
        {!loading && paginatedMessages.length === 0 && (
          <div className="empty">עדיין אין הודעות</div>
        )}

        {paginatedMessages.map((m, i) =>
          m.system ? (
            <div
              key={
                m._id
                  ? m._id.toString()
                  : m.timestamp
                  ? m.timestamp.toString()
                  : `system-${i}`
              }
              className="system-message"
            >
              {m.text}
            </div>
          ) : (
            <div
              key={
                m._id
                  ? m._id.toString() + (m.sending ? "-sending" : "")
                  : `msg-${i}`
              }
              className={`message${m.from === businessId ? " mine" : " theirs"}${
                m.sending ? " sending" : ""
              }${m.failed ? " failed" : ""}`}
            >
              {m.fileUrl ? (
                m.fileType && m.fileType.startsWith("audio") ? (
                  <WhatsAppAudioPlayer
                    src={m.fileUrl}
                    userAvatar={m.userAvatar}
                    duration={m.fileDuration}
                  />
                ) : m.fileType && m.fileType.startsWith("image") ? (
                  <img
                    src={m.fileUrl}
                    alt={m.fileName || "image"}
                    style={{ maxWidth: 200, borderRadius: 8 }}
                  />
                ) : (
                  <a
                    href={m.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    download
                  >
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
                {m.fileDuration && (
                  <span className="audio-length">
                    {String(Math.floor(m.fileDuration / 60)).padStart(2, "0")}:
                    {String(Math.floor(m.fileDuration % 60)).padStart(2, "0")}
                  </span>
                )}
                {m.sending && <span className="sending-indicator">⏳</span>}
                {m.failed && <span className="failed-indicator">❌</span>}
              </div>
            </div>
          )
        )}

        {isTyping && <div className="typing-indicator">הלקוח מקליד...</div>}
      </div>

      <div className="inputBar">
        {(recording || recordedBlob) ? (
          <div className="audio-preview-row">
            {recording ? (
              <>
                <button
                  className="recordBtn recording"
                  onClick={handleRecordStop}
                  title="עצור הקלטה"
                  type="button"
                >
                  ⏹️
                </button>
                <span className="preview-timer">
                  {String(Math.floor(timer / 60)).padStart(2, "0")}:
                  {String(timer % 60).padStart(2, "0")}
                </span>
                <button
                  className="preview-btn trash"
                  onClick={handleDiscard}
                  type="button"
                >
                  🗑️
                </button>
              </>
            ) : (
              <>
                <audio
                  src={URL.createObjectURL(recordedBlob)}
                  controls
                  style={{ height: 30 }}
                />
                <div>
                  משך הקלטה: {Math.floor(timer / 60)}:
                  {Math.floor(timer % 60).toString().padStart(2, "0")}
                </div>
                <button
                  className="send-btn"
                  onClick={handleSendRecording}
                  disabled={sending}
                >
                  שלח
                </button>
                <button
                  className="discard-btn"
                  onClick={handleDiscard}
                  type="button"
                >
                  מחק
                </button>
              </>
            )}
          </div>
        ) : (
          <>
            <textarea
              className="inputField"
              placeholder="הקלד הודעה..."
              value={input}
              disabled={sending}
              onChange={handleInput}
              onKeyDown={(e) =>
                e.key === "Enter" && !e.shiftKey && (e.preventDefault(), sendMessage())
              }
              rows={1}
            />
            <button
              className="sendButtonFlat"
              onClick={sendMessage}
              disabled={sending || !input.trim()}
              title="שלח"
            >
              ◀
            </button>
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
                onClick={handleRecordStart}
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
                style={{ display: "none" }}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
