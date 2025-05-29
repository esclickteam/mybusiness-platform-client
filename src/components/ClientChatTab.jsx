import React, { useState, useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import "./ClientChatTab.css";
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

// Helper to convert Blob to base64 string
function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
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

  // Load history
  useEffect(() => {
    if (!conversationId) return;
    setLoading(true);
    API.get("/conversations/history", { params: { conversationId } })
      .then((res) => setMessages(res.data))
      .catch(() => {
        setMessages([]);
        setError("שגיאה בטעינת היסטוריה");
      })
      .finally(() => setLoading(false));
  }, [conversationId]);

  // Socket listeners
  useEffect(() => {
    if (!socket || !conversationId) return;
    const onNew = (msg) => {
      setMessages((prev) => (prev.some((m) => m._id === msg._id) ? prev : [...prev, msg]));
    };
    socket.on("newMessage", onNew);
    socket.on("connect_error", (e) => setError(e.message));
    socket.emit("joinConversation", conversationId);
    return () => {
      socket.off("newMessage", onNew);
      socket.emit("leaveConversation", conversationId);
    };
  }, [socket, conversationId]);

  // Auto-scroll
  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [messages]);

  const resizeTextarea = () => {
    if (!textareaRef.current) return;
    textareaRef.current.style.height = "auto";
    textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
  };

  // Send text-only
  const sendMessage = () => {
    const text = input.trim();
    if (!text || sending || !socket) return;
    if (!socket.connected) {
      setError("Socket אינו מחובר");
      return;
    }
    setSending(true);
    setError("");
    const tempId = uuidv4();

    socket.emit(
      "sendMessage",
      { conversationId, from: userId, to: businessId, role: "client", text, tempId },
      (ack) => {
        setSending(false);
        if (ack?.ok) {
          setInput("");
        } else {
          setError("שגיאה בשליחת ההודעה");
        }
      }
    );
  };

  // Handle file/image upload
  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !socket) return;
    if (!socket.connected) {
      setError("Socket אינו מחובר");
      return;
    }
    setSending(true);
    setError("");
    const tempId = uuidv4();

    const dataUrl = await new Promise((res, rej) => {
      const reader = new FileReader();
      reader.onload = () => res(reader.result);
      reader.onerror = rej;
      reader.readAsDataURL(file);
    });

    const isImage = file.type.startsWith("image/");
    const payload = {
      conversationId,
      from: userId,
      to: businessId,
      role: "client",
      tempId,
      ...(isImage
        ? { image: dataUrl }
        : { file: { name: file.name, type: file.type, data: dataUrl } }),
    };

    socket.emit("sendMessage", payload, (ack) => {
      setSending(false);
      fileInputRef.current.value = null;
      if (!ack?.ok) setError("שגיאה בהעלאת הקובץ");
    });
  };

  // Recording handlers (כמו קודם)
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
    if (!socket.connected) {
      setError("Socket אינו מחובר");
      return;
    }
    setSending(true);
    setError("");
    const base64Data = await blobToBase64(recordedBlob);
    socket.emit(
      "sendMessage",
      {
        conversationId,
        from: userId,
        to: businessId,
        role: "client",
        file: {
          name: `voice.webm`,
          type: recordedBlob.type,
          duration: timer,
          data: base64Data,
        },
      },
      (ack) => {
        setSending(false);
        setRecordedBlob(null);
        setTimer(0);
        if (!ack?.ok) setError("שגיאה בשליחת הקלטה");
      }
    );
  };

  const handleAttach = () => fileInputRef.current?.click();

  return (
    <div className="chat-container client">
      <div className="message-list" ref={messageListRef}>
        {loading && <div className="loading">טוען...</div>}
        {!loading && messages.length === 0 && <div className="empty">אין הודעות</div>}
        {messages.map((m, i) => (
          <div
            key={m._id || i}
            className={`message${m.role === "client" ? " mine" : " theirs"}`}
          >
            {m.fileUrl ? (
              m.fileType.startsWith("audio") ? (
                <WhatsAppAudioPlayer
                  src={m.fileUrl}
                  userAvatar={m.userAvatar}
                  duration={m.fileDuration}
                />
              ) : /\.(jpe?g|png|gif|bmp|webp|svg)$/i.test(m.fileType) ? (
                <img
                  src={m.fileUrl}
                  alt={m.fileName}
                  className="message-image"
                />
              ) : (
                <a href={m.fileUrl} download>
                  {m.fileName}
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
                <button className="recordBtn recording" onClick={handleRecordStop}>
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
                >
                  🗑️
                </button>
              </>
            ) : (
              <>
                <audio src={URL.createObjectURL(recordedBlob)} controls />
                <button onClick={handleSendRecording} disabled={sending}>
                  שלח הקלטה
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
            />
            <button onClick={sendMessage} disabled={sending || !input.trim()}>
              ◀
            </button>
            <div className="inputBar-right">
              <button onClick={handleAttach} disabled={sending}>
                📎
              </button>
              <button onClick={handleRecordStart} disabled={sending}>
                🎤
              </button>
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*,application/pdf"
                style={{ display: "none" }}
                onChange={handleFileChange}
              />
            </div>
          </>
        )}
      </div>
    </div>
);
}
