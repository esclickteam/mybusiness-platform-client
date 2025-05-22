// src/components/ClientChatTab.jsx
import React, { useState, useEffect, useRef } from "react";
import "./ClientChatTab.css";

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
    if (playing) audio.pause();
    else audio.play();
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
  const containerClass = userAvatar ? "custom-audio-player with-avatar" : "custom-audio-player no-avatar";

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
        className={`play-pause ${playing ? "playing" : ""}`}>
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

  // handle chat events
  useEffect(() => {
    if (!socket || !conversationId) return;

    setLoading(true);
    socket.emit("joinConversation", conversationId, (ack) => {
      console.log("[Client] joinConversation ack", ack);
    });
    socket.emit("getHistory", { conversationId }, (history) => {
      console.log("[Client] history", history);
      setMessages(Array.isArray(history) ? history : []);
      setLoading(false);
    });

    const handleNew = (msg) => {
  console.log("[Client] newMessage received:", msg);
  setMessages((prev) => [...prev, msg]);
};
    socket.on("newMessage", handleNew);

    socket.on("connect_error", (err) => {
      console.error("[Client] connect_error", err);
      setError(err.message);
      setLoading(false);
    });
    socket.on("disconnect", (reason) => {
      console.log("[Client] disconnected", reason);
    });

    return () => {
      socket.off("newMessage", handleNew);
    };
  }, [socket, conversationId]);

  // auto-scroll
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

  const sendMessage = () => {
    if (!input.trim() || sending || !socket) return;
    setSending(true);
    setError("");
    socket.emit(
      "sendMessage",
      { conversationId, from: userId, to: businessId, role: "client", text: input.trim() },
      (ack) => {
        setSending(false);
        if (ack.ok) setInput("");
        else setError("שגיאה בשליחת ההודעה");
      }
    );
  };

  // recording
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
      recorder.start();
      setRecording(true);
      setTimer(0);
      timerRef.current = setInterval(() => setTimer((t) => t + 1), 1000);
    } catch {
      setError("אין הרשאה להקלטה");
    }
  };

  const handleRecordStop = () => {
    if (!recording) return;
    mediaRecorderRef.current.stop();
    mediaRecorderRef.current.onstop = () => {
      const blob = new Blob(recordedChunksRef.current, { type: mediaRecorderRef.current.mimeType });
      setRecordedBlob(blob);
    };
    setRecording(false);
    clearInterval(timerRef.current);
  };

  const handleSendRecording = () => {
    if (!recordedBlob || !socket) return;
    setSending(true);
    socket.emit(
      "sendMessage",
      { conversationId, from: userId, to: businessId, role: "client", file: { name: `voice.webm`, type: recordedBlob.type, duration: timer } },
      recordedBlob,
      (ack) => {
        setSending(false);
        setRecordedBlob(null);
        setTimer(0);
        if (!ack.ok) setError("שגיאה בשליחת ההקלטה");
      }
    );
  };

  const handleAttach = () => fileInputRef.current?.click();
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file || !socket) return;
    setSending(true);
    const reader = new FileReader();
    reader.onload = () => {
      socket.emit(
        "sendMessage",
        { conversationId, from: userId, to: businessId, role: "client", file: { name: file.name, type: file.type, data: reader.result } },
        (ack) => {
          setSending(false);
          if (!ack.ok) setError("שגיאה בשליחת הקובץ");
        }
      );
    };
    reader.readAsDataURL(file);
    e.target.value = null;
  };

  return (
    <div className="chat-container client">
      <div className="message-list" ref={messageListRef}>
        {loading && <div className="loading">טוען...</div>}
        {!loading && messages.length === 0 && <div className="empty">עדיין אין הודעות</div>}
        {messages.map((m, i) => (
          <div key={m._id || i} className={`message${m.role === "client" ? " mine" : " theirs"}`}>

            {m.fileUrl ? (
              m.fileType?.startsWith("audio") ? (
                <WhatsAppAudioPlayer src={m.fileUrl} userAvatar={m.userAvatar} duration={m.fileDuration} />
              ) : /\.(jpe?g|png|gif)$/i.test(m.fileUrl) ? (
                <img src={m.fileUrl} alt={m.fileName} style={{ maxWidth: 200, borderRadius: 8 }} />
              ) : (
                <a href={m.fileUrl} target="_blank" rel="noopener noreferrer">{m.fileName}</a>
              )
            ) : (
              <div className="text">{m.text}</div>
            )}
            <div className="meta">
              <span className="time">
                {new Date(m.timestamp).toLocaleTimeString("he-IL", { hour: "2-digit", minute: "2-digit" })}
              </span>
              {m.fileDuration && (
                <span className="audio-length">{Math.floor(m.fileDuration / 60).toString().padStart(2, "0")}:{Math.floor(m.fileDuration % 60).toString().padStart(2, "0")}</span>
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
                <button
                  className="recordBtn recording"
                  onClick={handleRecordStop}
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
                <audio
                  src={URL.createObjectURL(recordedBlob)}
                  controls
                  style={{ height: 30 }}
                />
                <div>
                  משך הקלטה:{" "}
                  {String(Math.floor(timer / 60)).padStart(2, "0")}:
                  {String(timer % 60).padStart(2, "0")}
                </div>
                <button
                  className="send-btn"
                  onClick={handleSendRecording}
                  disabled={sending}
                >
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
                e.key === "Enter" &&
                !e.shiftKey &&
                (e.preventDefault(), sendMessage())
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
              <button
                className="attachBtn"
                onClick={handleAttach}
                disabled={sending}
                type="button"
              >
                📎
              </button>
              <button
                className={`recordBtn${
                  recording ? " recording" : ""
                }`}
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
