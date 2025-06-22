import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useReducer,
} from "react";
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

// reducer לניהול מצב ההודעות
function messagesReducer(state, action) {
  switch (action.type) {
    case "set":
      return action.payload;
    case "add":
      // הוספת הודעות ישנות בפגינציה לפני הרשימה הקיימת
      return [...action.payload, ...state];
    case "append":
      // הוספת הודעה חדשה או עדכון הודעה קיימת
      const existingIndex = state.findIndex(
        (m) => m._id === action.payload._id || (m.tempId && m.tempId === action.payload.tempId)
      );
      if (existingIndex !== -1) {
        const newState = [...state];
        newState[existingIndex] = { ...newState[existingIndex], ...action.payload };
        return newState;
      }
      return [...state, action.payload];
    case "updateStatus":
      return state.map((m) =>
        m._id === action.payload.id || m.tempId === action.payload.id
          ? { ...m, ...action.payload.updates }
          : m
      );
    default:
      return state;
  }
}

export default function BusinessChatTab({
  conversationId,
  businessId,
  customerId,
  businessName,
  socket,
}) {
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [recording, setRecording] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState(null);
  const [timer, setTimer] = useState(0);

  const [messages, dispatchMessages] = useReducer(messagesReducer, []);

  const messageListRef = useRef(null);
  const typingTimeout = useRef(null);
  const fileInputRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const recordedChunks = useRef([]);
  const timerRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const currentRoomRef = useRef(null);

  // --- פונקציה למשיכת הודעות עם פגינציה ---
  const fetchMessagesPage = useCallback(
  async (pageNum = 0) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `/api/conversations/${conversationId}/history?page=${pageNum}&limit=20`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!response.ok) throw new Error("Failed to fetch messages");
      const data = await response.json();
      return Array.isArray(data.messages) ? data.messages : [];
    } catch (err) {
      console.error("Fetch messages failed:", err);
      return [];
    }
  },
  [conversationId]
);




  // --- טעינת הודעות ראשונית והגדרת הפגינציה ---
  useEffect(() => {
    if (!conversationId) return;

    setLoading(true);
    setPage(0);
    setHasMore(true);

    fetchMessagesPage(0).then((msgs) => {
      dispatchMessages({ type: "set", payload: msgs });
      setLoading(false);
      setHasMore(msgs.length === 20);

      setTimeout(() => {
        if (messageListRef.current) {
          messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
        }
      }, 0);
    });
  }, [conversationId, fetchMessagesPage]);

  // --- טיפול בהודעות חדשות מהסוקט ---
  const handleNew = useCallback(
    (msg) => {
      if (msg.conversationId === conversationId) {
        dispatchMessages({ type: "append", payload: msg });
        setTimeout(() => {
          if (messageListRef.current) {
            messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
          }
        }, 50);
      }
    },
    [conversationId]
  );

  // --- טיפול בהקלדה של הלקוח ---
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

  // --- הצטרפות לחדר וצירוף מאזינים לסוקט ---
  useEffect(() => {
    if (!socket || !conversationId) return;

    if (currentRoomRef.current === conversationId) {
      return;
    }

    if (currentRoomRef.current) {
      socket.emit("leaveConversation", currentRoomRef.current);
    }

    currentRoomRef.current = conversationId;

    socket.emit("joinConversation", conversationId);

    socket.on("newMessage", handleNew);
    socket.on("typing", handleTyping);

    return () => {
      socket.off("newMessage", handleNew);
      socket.off("typing", handleTyping);
      clearTimeout(typingTimeout.current);
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((t) => t.stop());
        mediaStreamRef.current = null;
      }
      if (currentRoomRef.current === conversationId) {
        socket.emit("leaveConversation", conversationId);
        currentRoomRef.current = null;
      }
    };
  }, [socket, conversationId, handleNew, handleTyping]);

  // --- טעינת הודעות נוספות בגלילה למעלה ---
  const handleScroll = useCallback(() => {
    const el = messageListRef.current;
    if (!el || loading || !hasMore) return;

    if (el.scrollTop === 0) {
      setLoading(true);
      fetchMessagesPage(page + 1).then((msgs) => {
        if (msgs.length === 0) {
          setHasMore(false);
        } else {
          dispatchMessages({ type: "add", payload: msgs });
          setPage((p) => p + 1);

          setTimeout(() => {
            if (el) {
              // מיקום גלילה לשמירת מיקום נכון לאחר טעינה
              el.scrollTop = 1;
            }
          }, 0);
        }
        setLoading(false);
      });
    }
  }, [fetchMessagesPage, hasMore, loading, page]);

  useEffect(() => {
    const el = messageListRef.current;
    if (!el) return;
    el.addEventListener("scroll", handleScroll);
    return () => el.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // --- גלילה אוטומטית לתחתית כאשר מגיעות הודעות חדשות או הלקוח מקליד ---
  useEffect(() => {
    const el = messageListRef.current;
    if (!el) return;

    const isNearBottom =
      el.scrollHeight - el.scrollTop - el.clientHeight < 100;
    if (isNearBottom) {
      el.scrollTop = el.scrollHeight;
    }
  }, [messages, isTyping]);

  // --- ניהול שדה הקלט והשליחה ---
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

    dispatchMessages({ type: "append", payload: optimisticMsg });
    setInput("");

    socket.emit(
      "sendMessage",
      { conversationId, from: businessId, to: customerId, text, tempId },
      (ack) => {
        setSending(false);
        if (ack.ok) {
          dispatchMessages({
            type: "updateStatus",
            payload: { id: tempId, updates: { ...ack.message, sending: false } },
          });
        } else {
          dispatchMessages({
            type: "updateStatus",
            payload: { id: tempId, updates: { sending: false, failed: true } },
          });
        }
      }
    );
  };

  // --- פתיחת בחירת קובץ ---
  const handleAttach = () => fileInputRef.current.click();

  // --- שליחת קובץ עם שליחה אופטימיסטית ---
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
      tempId,
    };

    dispatchMessages({ type: "append", payload: optimisticMsg });

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
          tempId,
        },
        (ack) => {
          if (ack.ok) {
            dispatchMessages({
              type: "updateStatus",
              payload: { id: tempId, updates: { ...ack.message, sending: false } },
            });
          } else {
            dispatchMessages({
              type: "updateStatus",
              payload: { id: tempId, updates: { sending: false, failed: true } },
            });
          }
        }
      );
    };
    reader.readAsArrayBuffer(file);
  };

  // --- קבלת פורמט מועדף להקלטה ---
  const getSupportedMimeType = () => {
    const pref = "audio/webm";
    return window.MediaRecorder?.isTypeSupported(pref) ? pref : pref;
  };

  // --- התחלת הקלטה ---
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

  // --- עצירת הקלטה ---
  const handleRecordStop = () => {
    if (!mediaRecorderRef.current) return;

    mediaRecorderRef.current.stop();
    setRecording(false);
    clearInterval(timerRef.current);
  };

  // --- ביטול הקלטה ---
  const handleDiscard = () => setRecordedBlob(null);

  // --- שליחת הקלטה עם שליחה אופטימיסטית ---
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
      tempId,
    };

    dispatchMessages({ type: "append", payload: optimisticMsg });
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
          tempId,
        },
        (ack) => {
          if (ack.ok) {
            dispatchMessages({
              type: "updateStatus",
              payload: { id: tempId, updates: { ...ack.message, sending: false } },
            });
          } else {
            dispatchMessages({
              type: "updateStatus",
              payload: { id: tempId, updates: { sending: false, failed: true } },
            });
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
              className={`message${
                m.from === businessId ? " mine" : " theirs"
              }${m.sending ? " sending" : ""}${m.failed ? " failed" : ""}`}
            >
              {m.fileUrl ? (
                m.fileType && m.fileType.startsWith("audio") ? (
                  <WhatsAppAudioPlayer
                    src={m.fileUrl}
                    userAvatar={m.userAvatar}
                    duration={m.fileDuration}
                  />
                ) : m.fileType && m.fileType.startsWith("image") ||
                  /\.(jpe?g|png|gif|bmp|webp|svg)$/i.test(m.fileUrl) ? (
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
                onClick={() => {
                  if (recording) {
                    handleRecordStop();
                  } else {
                    handleRecordStart();
                  }
                }}
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
