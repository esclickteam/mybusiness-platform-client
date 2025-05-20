import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import "./ClientChatTab.css";

// פונקציה שמחזירה משך קובץ אודיו מ־Blob
function getAudioDuration(blob) {
  return new Promise((resolve, reject) => {
    const tempAudio = document.createElement("audio");
    tempAudio.preload = "metadata";
    tempAudio.src = URL.createObjectURL(blob);

    tempAudio.onloadedmetadata = function () {
      URL.revokeObjectURL(tempAudio.src);
      if (isFinite(tempAudio.duration)) resolve(tempAudio.duration);
      else reject("Invalid duration");
    };
    tempAudio.onerror = function () {
      reject("Failed to load audio");
    };
  });
}

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

    // טוען metadata מחדש (חשוב!)
    audio.load();

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
  const [localDuration, setLocalDuration] = useState(0);

  const socketRef = useRef(null);
  const messageListRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);
  const timerRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const recordedChunksRef = useRef([]);
  const mediaStreamRef = useRef(null);

  const getSupportedMimeType = () => {
    const preferred = "audio/webm";
    if (MediaRecorder.isTypeSupported(preferred)) {
      console.log("Using mimeType:", preferred);
      return preferred;
    }
    return "audio/webm";
  };

  useEffect(() => {
    if (!conversationId) return;
    setLoading(true);
    setError("");
    setIsBlocked(false);

    socketRef.current = io(import.meta.env.VITE_SOCKET_URL, {
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
        mediaStreamRef.current.getTracks().forEach((t) => t.stop());
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

  // ----------- הקלטה -----------
  const handleRecordStart = async () => {
    if (recording || isBlocked) return;
    setError("");
    setRecordedBlob(null);
    setLocalDuration(0);
    recordedChunksRef.current = [];
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((t) => t.stop());
      mediaStreamRef.current = null;
    }
    if (timerRef.current) clearInterval(timerRef.current);
    setTimer(0);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;
      const mimeType = getSupportedMimeType();
      console.log("Starting recording with mimeType:", mimeType);
      const recorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        console.log("Data available, size:", e.data.size);
        if (e.data.size > 0) recordedChunksRef.current.push(e.data);
      };

      recorder.onstop = async () => {
        const blob = new Blob(recordedChunksRef.current, { type: mimeType });
        console.log("Recording stopped, blob size:", blob.size);

        try {
          // --- נשלוף את משך ההקלטה כאן ---
          const duration = await getAudioDuration(blob);
          console.log("✅ duration from Blob:", duration);
          setLocalDuration(duration);
        } catch (err) {
          console.warn("Failed to get duration:", err);
          setLocalDuration(0);
        }

        setRecordedBlob(blob);
        setRecording(false);
        setTimer(0);

        if (mediaStreamRef.current) {
          mediaStreamRef.current.getTracks().forEach((t) => t.stop());
          mediaStreamRef.current = null;
        }
      };

      recorder.start();
      setRecording(true);
      timerRef.current = setInterval(() => setTimer((t) => t + 1), 1000);
    } catch (err) {
      console.error("Error during recording start:", err);
      setError("אין הרשאה להקלטה. בדוק הרשאות דפדפן.");
      setIsBlocked(true);
    }
  };

  const handleRecordStop = () => {
    if (!recording || !mediaRecorderRef.current) return;
    mediaRecorderRef.current.stop();
    setRecording(false);
    if (timerRef.current) clearInterval(timerRef.current);
    setTimer(0);
  };

  const handleDiscard = () => {
    setRecordedBlob(null);
    setTimer(0);
    setLocalDuration(0);
    setError("");
    setRecording(false);
    recordedChunksRef.current = [];
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((t) => t.stop());
      mediaStreamRef.current = null;
    }
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const handleSendRecording = () => {
    if (!recordedBlob) return;
    sendAudio(recordedBlob, localDuration);
    setRecordedBlob(null);
    setTimer(0);
    setLocalDuration(0);
  };

  // שליחת קובץ אודיו (שמור גם את ה־duration)
  const sendAudio = (blob, duration) => {
    if (!blob) return;
    setSending(true);
    setError("");

    socketRef.current.emit(
      "sendMessage",
      {
        conversationId,
        from: userId,
        to: businessId,
        role: "client",
        file: {
          name: `voice.${blob.type.split("/")[1]}`,
          type: blob.type,
          duration, // מוסיף משך הקלטה (שימושי להציג זמן בכל הודעה)
        },
      },
      blob,
      (ack) => {
        setSending(false);
        if (!ack?.ok) setError("שגיאה בשליחת הקלטה");
      }
    );
  };

  // ---------------------------------------

  const handleInputChange = (e) => {
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

  const handleAttach = () => fileInputRef.current.click();
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
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
    }
    e.target.value = null;
  };

  // --------- רנדר עיקרי ---------
  return (
    <div className="chat-container client">
      <div className="message-list" ref={messageListRef} onScroll={onScroll}>
        {loading && <div className="loading">טוען...</div>}
        {!loading && messages.length === 0 && (
          <div className="empty">עדיין אין הודעות</div>
        )}
        {messages.map((m, i) => (
          <div
            key={m._id || i}
            className={`message${m.from === userId ? " mine" : " theirs"}`}
          >
            {m.fileUrl ? (
              m.fileType?.startsWith("audio") ? (
                <WhatsAppAudioPlayer
                  src={m.fileUrl}
                  userAvatar={m.userAvatar}
                />
              ) : m.fileUrl.match(/\.(jpe?g|png|gif)$/i) ? (
                <img
                  src={m.fileUrl}
                  alt={m.fileName}
                  style={{ maxWidth: 200, borderRadius: 8 }}
                />
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
              {/* אם תוסיף m.file?.duration, תוכל להציג את הזמן גם בהודעות */}
              {m.file?.duration && (
                <span className="audio-length">
                  {Math.floor(m.file.duration / 60)}:
                  {Math.floor(m.file.duration % 60)
                    .toString()
                    .padStart(2, "0")}
                </span>
              )}
            </div>
          </div>
        ))}
        {isTyping && <div className="typing-indicator">העסק מקליד...</div>}
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
                  onLoadedMetadata={async (e) => {
                    // קריאת משך הקלטה אם לא הצלחת כבר להוציא
                    if (!localDuration) {
                      try {
                        const dur = await getAudioDuration(recordedBlob);
                        setLocalDuration(dur);
                      } catch { }
                    }
                  }}
                />
                {localDuration > 0 && (
                  <div>
                    משך הקלטה: {Math.floor(localDuration / 60)}:
                    {Math.floor(localDuration % 60)
                      .toString()
                      .padStart(2, "0")}
                  </div>
                )}
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
              ref={textareaRef}
              className="inputField"
              placeholder="הקלד הודעה..."
              value={input}
              onChange={handleInputChange}
              onFocus={() => setError("")}
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
