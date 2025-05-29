import React, { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import "./BusinessChatTab.css";

// קומפוננטת נגן אודיו (כמו בקוד המקורי)
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

  // טעינת היסטוריה והאזנה לסוקט
  useEffect(() => {
  if (!conversationId || !socket) return;

  console.log("[BusinessChatTab] joinConversation:", conversationId);

  // עזיבת החדר הקודם אם קיים
  if (socket._currentRoom && socket._currentRoom !== conversationId) {
    console.log("[BusinessChatTab] leaving previous room:", socket._currentRoom);
    socket.emit("leaveConversation", socket._currentRoom);
  }

  socket._currentRoom = conversationId;

  setMessages([]);
  setLoading(true);

  socket.emit("joinConversation", conversationId, (res) => {
    console.log("[BusinessChatTab] joinConversation ack:", res);
    const history = Array.isArray(res?.messages) ? res.messages : [];
    setMessages(history);
    setLoading(false);

    if (!history.length) {
      fetch(`/api/conversations/history?conversationId=${conversationId}`, {
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

  const handleNew = (msg) => {
  if (msg.conversationId === conversationId) {
    setMessages((prev) => {
      // אם כבר קיימת הודעה עם אותו _id, לא נוסיף שנית
      if (prev.some((m) => m._id === msg._id)) {
        return prev;
      }
      return [...prev, msg];
    });
  }
};


  const handleTyping = ({ from }) => {
    if (from === customerId) {
      setIsTyping(true);
      clearTimeout(typingTimeout.current);
      typingTimeout.current = setTimeout(() => setIsTyping(false), 1800);
    }
  };

  // קודם להסיר לפני הוספה למניעת ריבוי מאזינים
  socket.off("newMessage", handleNew);
  socket.off("typing", handleTyping);

  socket.on("newMessage", handleNew);
  socket.on("typing", handleTyping);

  return () => {
    console.log("[BusinessChatTab] cleanup listeners");
    socket.off("newMessage", handleNew);
    socket.off("typing", handleTyping);
    clearTimeout(typingTimeout.current);
    if (timerRef.current) clearInterval(timerRef.current);
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((t) => t.stop());
      mediaStreamRef.current = null;
    }
  };
}, [socket, conversationId, customerId, setMessages]);


  // גלילה אוטומטית
  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  // טיפוס בהקלדה
  const handleInput = (e) => {
  setInput(e.target.value);
  console.log("Input changed:", e.target.value);
  socket?.emit("typing", { conversationId, from: businessId });
};


  // שליחת הודעת טקסט אופטימיסטית עם uuid
  const sendMessage = () => {
  if (sending) return; // חסימת שליחה כפולה

  const text = input.trim();
  console.log("Sending message:", text);
  if (!text || !socket) {
    console.warn("No text or socket connection, aborting sendMessage");
    return;
  }

  console.log("Sending message:", text);
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
  };

  setMessages((prev) => [...prev, optimisticMsg]);
  setInput("");

  socket.emit(
    "sendMessage",
    { conversationId, from: businessId, to: customerId, text },
    (ack) => {
      console.log("Acknowledgment received:", ack);
      setSending(false);
      if (ack.ok) {
        setMessages((prev) =>
          prev.map((m) =>
            m._id === tempId ? { ...ack.message, sending: false } : m
          )
        );
      } else {
        console.error("sendMessage error:", ack.error);
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
        },
        (ack) => {
          if (ack.ok) {
            setMessages((prev) =>
              prev.map((m) =>
                m._id === tempId ? { ...m, sending: false } : m
              )
            );
          } else {
            console.error("sendFile error:", ack.error);
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
        },
        (ack) => {
          if (ack.ok) {
            setMessages((prev) =>
              prev.map((m) =>
                m._id === tempId ? { ...m, sending: false } : m
              )
            );
          } else {
            console.error("sendAudio error:", ack.error);
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
      m.clientId
        ? `system-${m.clientId}`  // ייחודי לאופטימיות
        : m._id
        ? `system-${m._id.toString()}`
        : m.timestamp
        ? `system-${m.timestamp.toString()}`
        : `system-${i}`
    }
    className="system-message"
  >
    {m.text}
  </div>
) : (
  <div
    key={
      m.clientId
        ? m.clientId  // עבור אופטימיות - תמיד ייחודי
        : m._id
        ? m._id.toString()
        : m.timestamp
        ? `msg-${m.timestamp.toString()}`
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
