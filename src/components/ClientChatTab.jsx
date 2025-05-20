// src/components/ClientChatTab.jsx
import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import "./ClientChatTab.css";

function WhatsAppAudioPlayer({ src, userAvatar }) {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => setProgress(audio.currentTime);
    const onLoadedMetadata = () => setDuration(audio.duration);
    const onEnded = () => {
      setPlaying(false);
      setProgress(0);
    };

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("loadedmetadata", onLoadedMetadata);
    audio.addEventListener("ended", onEnded);

    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
      audio.removeEventListener("ended", onEnded);
    };
  }, [src]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) audio.pause();
    else audio.play();
    setPlaying(!playing);
  };

  const formatTime = (time) => {
    const m = Math.floor(time / 60);
    const s = Math.floor(time % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const totalDots = 20;
  const activeDot = duration ? Math.floor((progress / duration) * totalDots) : 0;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        background: "#e5e5e5",
        borderRadius: 20,
        padding: "6px 12px",
        maxWidth: 320,
        gap: 10,
        userSelect: "none",
      }}
    >
      {userAvatar && (
        <div style={{ position: "relative" }}>
          <img
            src={userAvatar}
            alt="avatar"
            style={{ width: 40, height: 40, borderRadius: "50%" }}
          />
          <div
            style={{
              position: "absolute",
              bottom: 0,
              right: 0,
              background: "#25D366",
              borderRadius: "50%",
              width: 16,
              height: 16,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              color: "white",
              fontSize: 12,
              border: "2px solid white",
              boxSizing: "content-box",
            }}
          >
            🎤
          </div>
        </div>
      )}

      <button
        onClick={togglePlay}
        aria-label={playing ? "Pause audio" : "Play audio"}
        style={{
          borderRadius: "50%",
          border: "none",
          backgroundColor: playing ? "#25D366" : "#888",
          color: "white",
          width: 36,
          height: 36,
          fontSize: 18,
          cursor: "pointer",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          userSelect: "none",
        }}
      >
        {playing ? "❚❚" : "▶"}
      </button>

      <div style={{ display: "flex", gap: 3, flexGrow: 1 }}>
        {[...Array(totalDots)].map((_, i) => (
          <div
            key={i}
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              backgroundColor: i <= activeDot ? "#25D366" : "#ccc",
              opacity: i === activeDot ? 1 : 0.5,
              transition: "background-color 0.2s, opacity 0.2s",
            }}
          />
        ))}
      </div>

      <div style={{ fontSize: 12, color: "#555", minWidth: 50, textAlign: "right" }}>
        {formatTime(progress)} / {formatTime(duration)}
      </div>

      <audio ref={audioRef} src={src} preload="metadata" />
    </div>
  );
}

export default function ClientChatTab({ conversationId, businessId, userId }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userScrolledUp, setUserScrolledUp] = useState(false);
  const [error, setError] = useState("");
  const [recording, setRecording] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState(null);
  const [timer, setTimer] = useState(0);
  const [isBlocked, setIsBlocked] = useState(false);

  const socketRef = useRef(null);
  const messageListRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);
  const timerRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const recordedChunksRef = useRef([]);
  const mediaStreamRef = useRef(null);

  const getSupportedMimeType = () => {
    const types = [
      "audio/webm;codecs=opus",
      "audio/webm",
      "audio/mp4",
      "audio/mpeg",
      "audio/wav",
    ];
    return types.find((type) => MediaRecorder.isTypeSupported(type)) || "audio/webm";
  };

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
      if (timerRef.current) clearInterval(timerRef.current);
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
        mediaStreamRef.current = null;
      }
    };
  }, [conversationId, businessId, userId]);

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

  const resizeTextarea = () => {
    if (!textareaRef.current) return;
    textareaRef.current.style.height = "auto";
    textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
  };

  const handleRecordStart = async () => {
    if (recording || isBlocked) return;
    setError("");
    setRecordedBlob(null);
    setIsBlocked(false);
    recordedChunksRef.current = [];

    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    if (timerRef.current) clearInterval(timerRef.current);
    setTimer(0);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      const mimeType = getSupportedMimeType();
      const recorder = new window.MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = recorder;
      recordedChunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) recordedChunksRef.current.push(e.data);
      };
      recorder.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, { type: mimeType });
        setRecordedBlob(blob);
        setRecording(false);
        setTimer(0);
        if (mediaStreamRef.current) {
          mediaStreamRef.current.getTracks().forEach((track) => track.stop());
          mediaStreamRef.current = null;
        }
      };

      recorder.start();
      setRecording(true);
      timerRef.current = setInterval(() => setTimer((t) => t + 1), 1000);
    } catch {
      setError("אין הרשאה להקלטה. בדוק הרשאות דפדפן.");
      setIsBlocked(true);
      setRecording(false);
    }
  };

  const handleRecordStop = () => {
    if (!recording || !mediaRecorderRef.current) return;
    mediaRecorderRef.current.stop();
    setRecording(false);
    if (timerRef.current) clearInterval(timerRef.current);
    setTimer(0);

    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
  };

  const handleSendRecording = () => {
    if (!recordedBlob) return;
    sendAudio(recordedBlob);
    setRecordedBlob(null);
    setTimer(0);
  };

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
          file: { name: "voice." + blob.type.split("/")[1], type: blob.type, data: reader.result },
        },
        (ack) => {
          setSending(false);
          if (!ack?.ok) setError("שגיאה בשליחת הקלטה");
        }
      );
    };
    reader.readAsDataURL(blob);
  };

  const handleDiscard = () => {
    setRecordedBlob(null);
    setTimer(0);
    setError("");
    setIsBlocked(false);
    setRecording(false);
    recordedChunksRef.current = [];
    if (timerRef.current) clearInterval(timerRef.current);
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
  };

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

  const sendMessage = async () => {
    const text = input.trim();
    if ((!text && !recordedBlob) || sending) return;

    setSending(true);
    setError("");

    if (recordedBlob) {
      handleSendRecording();
      setSending(false);
      return;
    }

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

  const Waveform = () => (
    <div className="waveform">
      {[...Array(5)].map((_, i) => (
        <span key={i} className="wave-dot" />
      ))}
    </div>
  );

  return (
    <div className="chat-container client">
      <div className="message-list" ref={messageListRef} onScroll={onScroll}>
        {loading && <div className="loading">טוען...</div>}
        {!loading && messages.length === 0 && <div className="empty">עדיין אין הודעות</div>}
        {messages.map((m, i) => (
          <div key={m._id || i} className={`message${m.from === userId ? " mine" : " theirs"}`}>
            {m.fileUrl ? (
              m.fileType?.startsWith("audio") ? (
                <WhatsAppAudioPlayer
                  src={m.fileUrl}
                  userAvatar={m.userAvatar || "/default-avatar.png"}
                />
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
        {error && <div className="error-alert">⚠ {error}</div>}

        {recording || recordedBlob ? (
          <div className="audio-preview-row">
            {recording && (
              <>
                <button
                  className="recordBtn recording"
                  onClick={handleRecordStop}
                  title="עצור הקלטה"
                  type="button"
                  aria-label="עצור הקלטה"
                >
                  ⏹️
                </button>
                <Waveform />
                <span className="preview-timer">
                  {String(Math.floor(timer / 60)).padStart(2, "0")}:
                  {String(timer % 60).padStart(2, "0")}
                </span>
                <button
                  className="preview-btn trash"
                  onClick={handleDiscard}
                  title="בטל הקלטה"
                  type="button"
                  aria-label="בטל הקלטה"
                >
                  🗑️
                </button>
              </>
            )}
            {recordedBlob && (
              <>
                <audio src={URL.createObjectURL(recordedBlob)} controls style={{ height: 30 }} />
                <button className="send-btn" onClick={handleSendRecording} disabled={sending}>
                  שלח
                </button>
                <button className="discard-btn" onClick={handleDiscard}>
                  מחק
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
              onChange={handleInputChange}
              onFocus={() => setError("")}
              onKeyDown={(e) =>
                e.key === "Enter" && !e.shiftKey && (e.preventDefault(), sendMessage())
              }
              disabled={sending}
              rows={1}
              aria-label="שדה טקסט להקלדת הודעה"
            />
            <button
              className="sendButtonFlat"
              onClick={sendMessage}
              disabled={sending || !input.trim()}
              type="button"
              aria-label="שלח הודעה"
            >
              ◀
            </button>
            <div className="inputBar-right">
              <button
                className="attachBtn"
                onClick={handleAttach}
                disabled={sending}
                type="button"
                aria-label="הוספת קובץ מצורף"
              >
                📎
              </button>
              <button
                className={`recordBtn${recording ? " recording" : ""}`}
                onClick={handleRecordStart}
                disabled={sending}
                title="התחל הקלטה"
                type="button"
                aria-label="הקלט קול"
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
