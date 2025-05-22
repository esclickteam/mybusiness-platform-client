// src/components/BusinessChatTab.jsx
import React, { useState, useEffect, useRef } from "react";
import "./BusinessChatTab.css";

// קומפוננטת נגן אודיו
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

export default function BusinessChatTab({
  conversationId,
  businessId,
  customerId,
  businessName,
  socket, // use socket from parent
}) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [loading, setLoading] = useState(true);
  const [recording, setRecording] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState(null);
  const [timer, setTimer] = useState(0);

  const messageListRef = useRef();
  const typingTimeout = useRef();
  const fileInputRef = useRef();
  const mediaRecorder = useRef(null);
  const recordedChunks = useRef([]);
  const timerRef = useRef(null);
  const mediaStreamRef = useRef(null);

  // טעינת היסטוריה והאזנה לאירועים
  useEffect(() => {
  if (!conversationId) return;

  setLoading(true);

  if (socket) {
    // 1. נסיון ראשון: getHistory דרך socket
    socket.emit("joinConversation", conversationId, (res) => {
      console.log("⚡ getHistory response:", res);
      const history = Array.isArray(res.messages) ? res.messages : [];
      if (history.length > 0) {
        setMessages(history);
        setLoading(false);
      } else {
        // 2. גיבוי: fetch דרך ה-proxy (relative path)
        fetch(`/api/conversations/${conversationId}`, {
          credentials: "include",
        })
          .then((r) => r.json())
          .then((data) => {
            console.log("🌐 fetch history:", data.messages);
            setMessages(data.messages || []);
          })
          .catch(console.error)
          .finally(() => setLoading(false));
      }
    });

    socket.emit("joinRoom", conversationId);

    const handleNew = (msg) => {
      if (msg.conversationId === conversationId) {
        setMessages((prev) => [...prev, msg]);
      }
    };
    socket.on("newMessage", handleNew);

    const handleTyping = ({ from }) => {
      if (from === customerId) {
        setIsTyping(true);
        clearTimeout(typingTimeout.current);
        typingTimeout.current = setTimeout(() => setIsTyping(false), 1800);
      }
    };
    socket.on("typing", handleTyping);

    return () => {
      socket.off("newMessage", handleNew);
      socket.off("typing", handleTyping);
      clearTimeout(typingTimeout.current);
      setMessages([]);
      if (timerRef.current) clearInterval(timerRef.current);
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((t) => t.stop());
        mediaStreamRef.current = null;
      }
    };
  }
}, [socket, conversationId, customerId]);


  // גלילה אוטומטית
  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  // טיפול בהקלדה
  const handleInput = (e) => {
    setInput(e.target.value);
    if (socket) {
      socket.emit("typing", { conversationId, from: businessId });
    }
  };

  // שליחת הודעה
  const sendMessage = () => {
    const text = input.trim();
    if (!text || !socket) return;
    setSending(true);
    const payload = { conversationId, from: businessId, to: customerId, text };
    socket.emit("sendMessage", payload, (ack) => {
      setSending(false);
      if (ack.ok) {
        setMessages((prev) => [
          ...prev,
          { ...payload, timestamp: ack.timestamp, _id: ack._id },
        ]);
        setInput("");
      } else {
        console.error("sendMessage error:", ack.error);
      }
    });
  };

  // צרוף קבצים
  const handleAttach = () => fileInputRef.current.click();
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file || !socket) return;
    const reader = new FileReader();
    reader.onload = () => {
      socket.emit(
        "sendFile",
        {
          conversationId,
          from: businessId,
          to: customerId,
          fileType: file.type,
          buffer: reader.result,
        },
        (ack) => {
          if (!ack.ok) console.error("sendFile error:", ack.error);
        }
      );
    };
    reader.readAsArrayBuffer(file);
  };

  // הקלטת שמע
  const getSupportedMimeType = () => {
    const pref = "audio/webm";
    return window.MediaRecorder?.isTypeSupported(pref) ? pref : "audio/webm";
  };
  const handleRecordStart = async () => {
    if (!navigator.mediaDevices || recording) return;
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaStreamRef.current = stream;
    recordedChunks.current = [];
    mediaRecorder.current = new MediaRecorder(stream, {
      mimeType: getSupportedMimeType(),
    });
    mediaRecorder.current.ondataavailable = (e) =>
      recordedChunks.current.push(e.data);
    mediaRecorder.current.start();
    setRecording(true);
    setTimer(0);
    timerRef.current = setInterval(() => setTimer((t) => t + 1), 1000);
  };
  const handleRecordStop = () => {
    if (!mediaRecorder.current) return;
    mediaRecorder.current.stop();
    mediaRecorder.current.onstop = () => {
      const blob = new Blob(recordedChunks.current, {
        type: mediaRecorder.current.mimeType,
      });
      setRecordedBlob(blob);
    };
    setRecording(false);
    clearInterval(timerRef.current);
  };
  const handleDiscard = () => setRecordedBlob(null);
  const handleSendRecording = () => {
    if (!recordedBlob || !socket) return;
    const reader = new FileReader();
    reader.onload = () => {
      socket.emit(
        "sendAudio",
        {
          conversationId,
          from: businessId,
          to: customerId,
          buffer: reader.result,
          fileType: recordedBlob.type,
          duration: timer,
        },
        (ack) => {
          if (ack.ok) setRecordedBlob(null);
          else console.error("sendAudio error:", ack.error);
        }
      );
    };
    reader.readAsArrayBuffer(recordedBlob);
  };

  return (
    <div className="chat-container business">
      <div className="message-list" ref={messageListRef}>
        {loading && <div className="loading">טוען...</div>}
        {!loading && messages.length === 0 && <div className="empty">עדיין אין הודעות</div>}

        {messages.map((m, i) =>
          m.system ? (
            <div key={i} className="system-message">
              {m.text}
            </div>
          ) : (
            <div
              key={m._id || i}
              className={`message${m.from === businessId ? " mine" : " theirs"}`}
            >
              {m.fileUrl ? (
                m.fileType?.startsWith("audio") ? (
                  <WhatsAppAudioPlayer
                    src={m.fileUrl}
                    userAvatar={m.userAvatar}
                    duration={m.fileDuration}
                  />
                ) : /\.(jpe?g|png|gif)$/i.test(m.fileUrl) ? (
                  <img
                    src={m.fileUrl}
                    alt={m.fileName}
                    style={{ maxWidth: 200, borderRadius: 8 }}
                  />
                ) : (
                  <a
                    href={m.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
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
                    {String(Math.floor(m.fileDuration / 60)).padStart(2, "0")
                    }:{
                    String(Math.floor(m.fileDuration % 60)).padStart(2, "0")}
                  </span>
                )}
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
                  {Math.floor(timer % 60)
                    .toString()
                    .padStart(2, "0")}
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
                e.key === "Enter" &&
                !e.shiftKey &&
                (e.preventDefault(), sendMessage())
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
