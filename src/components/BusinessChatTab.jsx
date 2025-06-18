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

  const messageListRef = useRef(null);
  const typingTimeout = useRef(null);
  const fileInputRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const recordedChunks = useRef([]);
  const timerRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const currentRoomRef = useRef(null); // Ref to track current joined conversation

  const handleReconnect = useCallback(async () => {
    console.log("[BusinessChatTab] Socket reconnected, fetching history...");
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
    console.log("[BusinessChatTab] newMessage received:", msg);
    if (msg.conversationId === conversationId) {
      setMessages((prev) => {
        if (msg.tempId && prev.some((m) => m.tempId === msg.tempId)) {
          return prev.map((m) =>
            m.tempId === msg.tempId ? { ...msg, sending: false } : m
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

    // מניעת הצטרפות כפולה לאותו חדר
    if (currentRoomRef.current === conversationId) {
      console.log("[BusinessChatTab] Already joined conversation:", conversationId);
      return;
    }

    // עזיבת חדר קודם במידת הצורך
    if (currentRoomRef.current) {
      console.log("[BusinessChatTab] Leaving previous conversation:", currentRoomRef.current);
      socket.emit("leaveConversation", currentRoomRef.current);
    }

    currentRoomRef.current = conversationId;

    setMessages([]);
    setLoading(true);

    socket.emit("joinConversation", conversationId, (res) => {
      console.log("[BusinessChatTab] joinConversation ack:", res);
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
      // עזיבת חדר בעת ניקוי הקומפוננטה
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
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  // --- שאר הפונקציות שלך לשיגור הודעות, הקלטות וכו' (אותן לא שיניתי) ---

  const handleInput = (e) => {
    setInput(e.target.value);
    socket?.emit("typing", { conversationId, from: businessId });
  };

  const sendMessage = () => {
    if (sending) return;

    const text = input.trim();
    if (!text || !socket) return;

    setSending(true);

    const tempId = uuidv4();
    const optimisticMsg = {
      _id: tempId,
      conversationId,
      from: businessId,
      to: customerId,
      text,
      timestamp: new Date().toISOString(),
      sending: true,
      tempId,
    };

    setMessages((prev) => [...prev, optimisticMsg]);
    setInput("");

    socket.emit(
      "sendMessage",
      { conversationId, from: businessId, to: customerId, text, tempId },
      (ack) => {
        setSending(false);
        if (ack.ok) {
          setMessages((prev) =>
            prev.map((m) =>
              m._id === tempId ? { ...ack.message, sending: false } : m
            )
          );
        } else {
          setMessages((prev) =>
            prev.map((m) =>
              m._id === tempId ? { ...m, sending: false, failed: true } : m
            )
          );
        }
      }
    );
  };




  // פתיחת בחירת קובץ
  const handleAttach = () => fileInputRef.current.click();

  // שליחת קובץ עם שליחה אופטימיסטית
  const handleFileChange = (e) => {
  const file = e.target.files[0];
  if (!file || !socket) return;

  const tempId = uuidv4();
  const optimisticMsg = {
    _id: tempId,
    conversationId,
    from: businessId,
    to: customerId,
    fileUrl: URL.createObjectURL(file),
    fileName: file.name,
    fileType: file.type,
    timestamp: new Date().toISOString(),
    sending: true,
    tempId, // 👈
  };

  setMessages((prev) => [...prev, optimisticMsg]);

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
        fileName: file.name,
        tempId, // 👈 שלח גם לשרת!
      },
      (ack) => {
        if (ack.ok) {
          setMessages((prev) =>
            prev.map((m) =>
              m._id === tempId ? { ...ack.message, sending: false } : m
            )
          );
        } else {
          setMessages((prev) =>
            prev.map((m) =>
              m._id === tempId ? { ...m, sending: false, failed: true } : m
            )
          );
        }
      }
    );
  };
  reader.readAsArrayBuffer(file);
};


  // קבלת פורמט מועדף להקלטה
  const getSupportedMimeType = () => {
    const pref = "audio/webm";
    return window.MediaRecorder?.isTypeSupported(pref) ? pref : pref;
  };

  // התחלת הקלטה
  const handleRecordStart = async () => {
    if (!navigator.mediaDevices || recording) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;
      recordedChunks.current = [];

      const recorder = new MediaRecorder(stream, { mimeType: getSupportedMimeType() });
      recorder.onstart = () => {};
      recorder.ondataavailable = (e) => recordedChunks.current.push(e.data);
      recorder.onstop = () => {
        const blob = new Blob(recordedChunks.current, { type: recorder.mimeType });
        setRecordedBlob(blob);
      };

      recorder.start();
      mediaRecorderRef.current = recorder;

      setRecording(true);
      setTimer(0);
      timerRef.current = setInterval(() => setTimer((t) => t + 1), 1000);
    } catch (err) {
      console.error("startRecording failed:", err);
    }
  };

  // עצירת הקלטה
  const handleRecordStop = () => {
    if (!mediaRecorderRef.current) return;

    mediaRecorderRef.current.stop();
    setRecording(false);
    clearInterval(timerRef.current);
  };

  // ביטול הקלטה
  const handleDiscard = () => setRecordedBlob(null);

  // שליחת הקלטה עם שליחה אופטימיסטית
  const handleSendRecording = () => {
  if (!recordedBlob || !socket) return;

  const tempId = uuidv4();
  const optimisticMsg = {
    _id: tempId,
    conversationId,
    from: businessId,
    to: customerId,
    fileUrl: URL.createObjectURL(recordedBlob),
    fileName: `audio.${recordedBlob.type.split("/")[1]}`,
    fileType: recordedBlob.type,
    fileDuration: timer,
    timestamp: new Date().toISOString(),
    sending: true,
    tempId, // 👈
  };

  setMessages((prev) => [...prev, optimisticMsg]);
  setRecordedBlob(null);

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
        tempId, // 👈 שלח גם לשרת!
      },
      (ack) => {
        if (ack.ok) {
          setMessages((prev) =>
            prev.map((m) =>
              m._id === tempId ? { ...ack.message, sending: false } : m
            )
          );
        } else {
          setMessages((prev) =>
            prev.map((m) =>
              m._id === tempId ? { ...m, sending: false, failed: true } : m
            )
          );
        }
      }
    );
  };
  reader.readAsArrayBuffer(recordedBlob);
};


  return (
    <div className="chat-container business">
      <div className="message-list" ref={messageListRef}>
        {loading && <div className="loading">טוען...</div>}
        {!loading && messages.length === 0 && (
          <div className="empty">עדיין אין הודעות</div>
        )}

        {messages.map((m, i) =>
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
              className={`message${m.from === businessId ? " mine" : " theirs"}${m.sending ? " sending" : ""}${m.failed ? " failed" : ""}`}
            >
              {m.fileUrl ? (
  m.fileType && m.fileType.startsWith("audio") ? (
    <WhatsAppAudioPlayer
      src={m.fileUrl}
      userAvatar={m.userAvatar}
      duration={m.fileDuration}
    />
  ) : (m.fileType && m.fileType.startsWith("image")) ||
    /\.(jpe?g|png|gif|bmp|webp|svg)$/i.test(m.fileUrl) ? (
    <img
      src={m.fileUrl}
      alt={m.fileName || "image"}
      style={{ maxWidth: 200, borderRadius: 8 }}
    />
  ) : (
    <a href={m.fileUrl} target="_blank" rel="noopener noreferrer" download>
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
