import React, { useState, useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import "./ClientChatTab.css";
import { Buffer } from "buffer";

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

const getMessageKey = (m) => {
  if (m.recommendationId) return `rec_${m.recommendationId}`;
  if (m._id) return `msg_${m._id}`;
  if (m.tempId) return `temp_${m.tempId}`;
  return null; // לא ליצור UUID חדש, להימנע מבעיות רינדור
};

export default function ClientChatTab({
  socket,
  conversationId,
  businessId,
  userId,
  messages,
  setMessages,
  userRole,
  conversationType = "user-business",
}) {
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

  const isBusinessConversation = conversationType === "business-business";

  // טען היסטוריית הודעות דרך Socket.IO במקום fetch
  useEffect(() => {
    if (!socket || !conversationId) return;

    setLoading(true);
    setError("");

    socket.emit(
      "getHistory",
      { conversationId, limit: 50, conversationType },
      (response) => {
        if (response.ok) {
          setMessages(Array.isArray(response.messages) ? response.messages : []);
          setLoading(false);
        } else {
          setError("שגיאה בטעינת ההיסטוריה: " + (response.error || ""));
          setLoading(false);
        }
      }
    );
  }, [socket, conversationId, setMessages]);

  useEffect(() => {
    if (!socket || !conversationId || !businessId) return;

    const handleIncomingMessage = (msg) => {
      if (msg.isRecommendation && msg.status === "pending") return;

      const id = msg.isRecommendation
        ? `rec_${msg.recommendationId}`
        : msg._id
        ? `msg_${msg._id}`
        : msg.tempId
        ? `temp_${msg.tempId}`
        : null;

      setMessages((prev) => {
        const existsIdx = prev.findIndex((m) => {
          const mid = m.isRecommendation
            ? `rec_${m.recommendationId}`
            : m._id
            ? `msg_${m._id}`
            : m.tempId
            ? `temp_${m.tempId}`
            : null;

          // התאמת הודעות זמניות מול הודעות עם _id
          if (m.tempId && msg._id && m.tempId === msg.tempId) return true;
          return mid === id;
        });

        if (existsIdx !== -1) {
          const newMessages = [...prev];
          newMessages[existsIdx] = { ...newMessages[existsIdx], ...msg };
          return newMessages;
        }
        return [...prev, msg];
      });
    };

    const handleMessageApproved = (msg) => {
      if (msg.conversationId !== conversationId) return;

      setMessages((prev) => {
        const idx = prev.findIndex(
          (m) =>
            m._id === msg._id ||
            (m.tempId && msg.tempId && m.tempId === msg.tempId) ||
            (m.isRecommendation &&
              msg.recommendationId &&
              m.recommendationId === msg.recommendationId)
        );
        if (idx !== -1) {
          const newMessages = [...prev];
          newMessages[idx] = { ...newMessages[idx], ...msg, status: "approved" };
          return newMessages;
        }
        return [...prev, msg];
      });
    };

    const handleRecommendationUpdated = (updatedRec) => {
      if (updatedRec.conversationId !== conversationId) return;

      setMessages((prev) =>
        prev.map((m) =>
          m._id === updatedRec._id || m.recommendationId === updatedRec._id
            ? { ...m, ...updatedRec }
            : m
        )
      );
    };

    socket.on("newMessage", handleIncomingMessage);
    socket.on("messageApproved", handleMessageApproved);
    socket.on("recommendationUpdated", handleRecommendationUpdated);

    socket.emit("joinConversation", conversationId, isBusinessConversation);
    socket.emit("joinRoom", businessId);

    return () => {
      socket.off("newMessage", handleIncomingMessage);
      socket.off("messageApproved", handleMessageApproved);
      socket.off("recommendationUpdated", handleRecommendationUpdated);
      socket.emit("leaveConversation", conversationId, isBusinessConversation);
    };
  }, [socket, conversationId, businessId, setMessages, isBusinessConversation]);

  useEffect(() => {
    if (!messageListRef.current) return;
    // גלילה רק אם המשתמש כבר בתחתית או קרוב לתחתית
    const el = messageListRef.current;
    const isNearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 100;
    if (isNearBottom) {
      el.scrollTop = el.scrollHeight;
    }
  }, [messages]);

  const resizeTextarea = () => {
    if (!textareaRef.current) return;
    textareaRef.current.style.height = "auto";
    textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
  };

  const handleAttach = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const sendMessage = () => {
    if (!input.trim() || sending || !socket) return;
    if (!socket.connected) {
      setError("Socket אינו מחובר, נסה להתחבר מחדש");
      return;
    }
    setSending(true);
    setError("");

    const tempId = uuidv4();

    const optimisticMsg = {
      _id: tempId,
      tempId,
      conversationId,
      from: userId,
      to: businessId,
      role: "client",
      text: input.trim(),
      timestamp: new Date(),
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
        conversationType,
      },
      (ack) => {
        setSending(false);
        if (ack?.ok) {
          setMessages((prev) =>
            prev.map((msg) => (msg.tempId === tempId && ack.message ? ack.message : msg))
          );
        } else {
          setError("שגיאה בשליחת ההודעה");
          setMessages((prev) => prev.filter((msg) => msg.tempId !== tempId));
        }
      }
    );
  };

  const getSupportedMimeType = () =>
    MediaRecorder.isTypeSupported("audio/webm") ? "audio/webm" : "audio/webm";

  const handleRecordStart = async () => {
    if (recording) return;
    recordedChunksRef.current = [];
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;
      const mimeType = getSupportedMimeType();
      const recorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) recordedChunksRef.current.push(e.data);
      };
      recorder.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, { type: mimeType });
        setRecordedBlob(blob);
        clearInterval(timerRef.current);
        setRecording(false);
      };

      recorder.start();
      setRecording(true);
      setTimer(0);
      timerRef.current = setInterval(() => setTimer((t) => t + 1), 1000);
    } catch {
      setError("אין הרשאה להקלטה");
    }
  };

  const handleRecordStop = () => {
    if (!recording || !mediaRecorderRef.current) return;
    mediaRecorderRef.current.stop();
  };

  const handleSendRecording = async () => {
    if (!recordedBlob || !socket) return;
    setSending(true);
    try {
      const arrayBuffer = await recordedBlob.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      socket.emit(
        "sendAudio",
        {
          conversationId,
          from: userId,
          to: businessId,
          role: "client",
          buffer,
          fileType: recordedBlob.type,
          duration: timer,
          conversationType,
        },
        (ack) => {
          setSending(false);
          setRecordedBlob(null);
          setTimer(0);
          if (!ack.ok) setError("שגיאה בשליחת ההקלטה");
        }
      );
    } catch (e) {
      setSending(false);
      setError("שגיאה בהכנת הקובץ למשלוח");
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file || !socket) return;
    setSending(true);

    const reader = new FileReader();
    reader.onload = () => {
      socket.emit(
        "sendFile",
        {
          conversationId,
          from: userId,
          to: businessId,
          role: "client",
          buffer: Buffer.from(reader.result.split(",")[1], "base64"),
          fileType: file.type,
          fileName: file.name,
          conversationType,
        },
        (ack) => {
          setSending(false);
          if (!ack.ok) setError("שגיאה בשליחת הקובץ");
        }
      );
    };
    reader.onerror = () => {
      setSending(false);
      setError("שגיאה בהמרת הקובץ");
    };

    reader.readAsDataURL(file);
    e.target.value = null;
  };

  return (
    <div className="chat-container client">
      <div className="message-list" ref={messageListRef}>
        {loading && <div className="loading">טוען...</div>}
        {!loading && messages.length === 0 && <div className="empty">עדיין אין הודעות</div>}
        {messages.map((m) => {
          const key = getMessageKey(m);
          if (!key) return null;
          return (
            <div
              key={key}
              className={`message${m.role === "client" ? " mine" : " theirs"}${
                m.isRecommendation ? " ai-recommendation" : ""
              }`}
            >
              {m.image ? (
                <img
                  src={m.image}
                  alt={m.fileName || "image"}
                  style={{ maxWidth: 200, borderRadius: 8 }}
                />
              ) : m.fileUrl || m.file?.data ? (
                m.fileType && m.fileType.startsWith("audio") ? (
                  <WhatsAppAudioPlayer
                    src={m.fileUrl || m.file.data}
                    userAvatar={m.userAvatar}
                    duration={m.fileDuration}
                  />
                ) : /\.(jpe?g|png|gif|bmp|webp|svg)$/i.test(m.fileUrl || "") ? (
                  <img
                    src={m.fileUrl || m.file.data}
                    alt={m.fileName || "image"}
                    style={{ maxWidth: 200, borderRadius: 8 }}
                  />
                ) : (
                  <a
                    href={m.fileUrl || m.file?.data}
                    target="_blank"
                    rel="noopener noreferrer"
                    download
                  >
                    {m.fileName || "קובץ להורדה"}
                  </a>
                )
              ) : (
                <div className="text">{m.isEdited && m.editedText ? m.editedText : (m.content || m.text)}</div>
              )}
              {m.isEdited && userRole === "business" && (
                <div className="edited-label" style={{ fontSize: "0.8em", color: "#888" }}>
                  (נערך)
                </div>
              )}
              <div className="meta">
                <span className="time">
                  {(() => {
                    const date = new Date(m.createdAt);
                    if (isNaN(date)) return "";
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
          );
        })}
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
