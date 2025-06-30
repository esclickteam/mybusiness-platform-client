import React, { useEffect, useRef, useState, useReducer } from "react";
import { v4 as uuidv4 } from "uuid";
import API from "../api"; // axios עם token מוגדר מראש
import "./BusinessChatTab.css";

/**
 * קומפוננטת נגן אודיו בסגנון WhatsApp
 */
function WhatsAppAudioPlayer({ src, userAvatar, duration = 0 }) {
  if (!src) return null;

  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTime = () => setProgress(audio.currentTime);
    const onEnded = () => {
      setPlaying(false);
      setProgress(0);
    };

    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("ended", onEnded);
    return () => {
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("ended", onEnded);
    };
  }, [src]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    playing ? audio.pause() : audio.play();
    setPlaying((p) => !p);
  };

  const formatTime = (t) =>
    `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, "0")}`;

  const totalDots = 20;
  const activeDot = duration ? Math.floor((progress / duration) * totalDots) : 0;

  return (
    <div className={`custom-audio-player ${userAvatar ? "with-avatar" : "no-avatar"}`}>
      {userAvatar && (
        <div className="avatar-wrapper">
          <img src={userAvatar} alt="avatar" />
          <div className="mic-icon">🎤</div>
        </div>
      )}
      <button
        onClick={togglePlay}
        className={`play-pause ${playing ? "playing" : ""}`}
        aria-label={playing ? "Pause" : "Play"}
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

/**
 * קומפוננטת תצוגה וניהול URL זמני להקלטות
 */
function AudioPreview({ recordedBlob }) {
  const [blobUrl, setBlobUrl] = useState(null);

  useEffect(() => {
    if (!recordedBlob) {
      setBlobUrl(null);
      return;
    }
    const url = URL.createObjectURL(recordedBlob);
    setBlobUrl(url);
    return () => {
      URL.revokeObjectURL(url);
    };
  }, [recordedBlob]);

  if (!blobUrl) return null;

  return <audio src={blobUrl} controls />;
}

/**
 * reducer לניהול היסטוריית ההודעות
 */
function messagesReducer(state, action) {
  switch (action.type) {
    case "set":
      return action.payload;

    case "append": {
      const idx = state.findIndex(
        (m) =>
          (m._id && m._id === action.payload._id) ||
          (m.tempId && m.tempId === action.payload.tempId)
      );
      if (idx !== -1) {
        const next = [...state];
        next[idx] = { ...next[idx], ...action.payload };
        return next;
      }
      return [...state, action.payload];
    }
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
  customerName,
  socket,
  conversationType = "user-business",
}) {
  const [messages, dispatch] = useReducer(messagesReducer, []);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const fileInputRef = useRef(null);
  const blobUrlsRef = useRef({});

  const isBusinessConversation = conversationType === "business-business";

  // Ref להודעות בשביל בדיקת כפילויות
  const messagesRef = useRef(messages);
  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  /**
   * פונקציית עזר לפורמט שעה
   */
  const formatTime = (ts) => {
    if (!ts) return "";
    const d = new Date(ts);
    if (isNaN(d)) return "";
    return d.toLocaleTimeString("he-IL", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // טען היסטוריית הודעות מה-API עם axios שמכיל את הטוקן
  async function fetchMessagesByConversationId(conversationId, page = 0, limit = 50) {
    try {
      const res = await API.get(`/messages/${conversationId}/history`, {
        params: { page, limit }
      });
      return res.data.messages.map(m => ({
        ...m,
        _id: String(m._id),
        timestamp: m.createdAt || new Date().toISOString(),
        text: m.text || "",
        tempId: m.tempId || null,
      }));
    } catch (error) {
      console.error("Failed to fetch messages:", error);
      return [];
    }
  }

  // אפקט ראשי לטעינת היסטוריה מהשרת
  useEffect(() => {
    if (!conversationId) {
      dispatch({ type: "set", payload: [] });
      return;
    }

    let didCancel = false;

    async function loadMessages() {
      const msgs = await fetchMessagesByConversationId(conversationId);
      if (!didCancel) dispatch({ type: "set", payload: msgs });
    }

    loadMessages();

    return () => {
      didCancel = true;
    };
  }, [conversationId]);

  // מאזין להודעות חדשות עם דה-דופליקציה ושמירת IDs כמחרוזות
  useEffect(() => {
    if (!socket) return;

    const handleNew = (msg) => {
      if (msg.conversationId !== conversationId || msg.conversationType !== conversationType) return;

      msg._id = String(msg._id);

      const exists = messagesRef.current.some(
        (m) =>
          String(m._id) === msg._id ||
          (msg.tempId && m.tempId === msg.tempId) ||
          (m.tempId && msg._id && m.tempId === msg._id)
      );
      if (exists) return;

      const safeMsg = {
        ...msg,
        timestamp: msg.createdAt || new Date().toISOString(),
        text: (msg.text || msg.content || "") === "0" ? "" : (msg.text || msg.content || ""),
        fileUrl: msg.fileUrl || msg.file?.url || null,
        fileType: msg.fileType || msg.file?.mimeType || null,
        fileName: msg.fileName || msg.file?.name || "",
        fileDuration: msg.fileDuration ?? msg.file?.duration ?? 0,
        tempId: msg.tempId || null,
      };

      dispatch({ type: "append", payload: safeMsg });
    };

    const handleTyping = ({ from }) => {
      if (from !== customerId) return;
      setIsTyping(true);
      clearTimeout(handleTyping._t);
      handleTyping._t = setTimeout(() => {
        setIsTyping(false);
      }, 1800);
    };

    socket.on("newMessage", handleNew);
    socket.on("typing", handleTyping);

    return () => {
      socket.off("newMessage", handleNew);
      socket.off("typing", handleTyping);
      clearTimeout(handleTyping._t);
    };
  }, [socket, conversationId, customerId, conversationType]);

  // גלילה אוטומטית רק אם המשתמש קרוב לתחתית
  useEffect(() => {
    const el = listRef.current;
    if (!el) return;

    const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 100;
    if (nearBottom) {
      el.scrollTop = el.scrollHeight;
    }
  }, [messages, isTyping]);

  /**
   * Input change + emit typing
   */
  const handleInput = (e) => {
    setInput(e.target.value);
    socket?.emit("typing", { conversationId, from: businessId });
  };

  /**
   * שליחת הודעת טקסט
   */
  const sendMessage = () => {
    if (sending) return;
    const text = input.trim();
    if (!text || text === "0" || !socket) return;

    setSending(true);
    const tempId = uuidv4();
    const optimistic = {
      _id: tempId,
      conversationId,
      from: businessId,
      to: customerId,
      text,
      timestamp: new Date().toISOString(),
      sending: true,
      tempId,
    };
    dispatch({ type: "append", payload: optimistic });
    setInput("");

    socket.emit(
      "sendMessage",
      { conversationId, from: businessId, to: customerId, text, tempId, conversationType },
      (ack) => {
        setSending(false);

        dispatch({
          type: "updateStatus",
          payload: {
            id: tempId,
            updates: {
              ...(ack.message || {}),
              sending: false,
              failed: !ack.ok,
            },
          },
        });
      }
    );
  };

  /**
   * פתיחת דיאלוג בחירת קובץ
   */
  const handleAttach = () => {
    fileInputRef.current?.click();
  };

  /**
   * המשתמש בחר קובץ – טיפול בשליחה
   */
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file || !socket) return;
    const tempId = uuidv4();

    const blobUrl = URL.createObjectURL(file);
    blobUrlsRef.current[tempId] = blobUrl;

    const optimistic = {
      _id: tempId,
      conversationId,
      from: businessId,
      to: customerId,
      fileUrl: blobUrl,
      fileName: file.name,
      fileType: file.type,
      timestamp: new Date().toISOString(),
      sending: true,
      tempId,
    };
    dispatch({ type: "append", payload: optimistic });

    const reader = new FileReader();
    reader.onload = () => {
      socket.emit(
        "sendFile",
        {
          conversationId,
          from: businessId,
          to: customerId,
          fileName: file.name,
          fileType: file.type,
          buffer: reader.result,
          tempId,
          conversationType,
        },
        (ack) => {
          dispatch({
            type: "updateStatus",
            payload: {
              id: tempId,
              updates: {
                ...(ack.message || {}),
                sending: false,
                failed: !ack.ok,
              },
            },
          });
        }
      );
    };
    reader.readAsArrayBuffer(file);
  };

  // useEffect לשחרור זיכרון blob כשהכתובת מתחלפת
  useEffect(() => {
    Object.entries(blobUrlsRef.current).forEach(([tempId, blobUrl]) => {
      const msg = messages.find(
        (m) => (m.tempId === tempId || m._id === tempId) && m.fileUrl !== blobUrl
      );
      if (msg) {
        URL.revokeObjectURL(blobUrl);
        delete blobUrlsRef.current[tempId];
      }
    });
  }, [messages]);

  /** ----------------- הקלטת ושליחת הודעת קול ---------------- */
  const [recording, setRecording] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState(null);
  const [timer, setTimer] = useState(0);
  const mediaRecorderRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const recordedChunks = useRef([]);
  const timerRef = useRef(null);

  const startRecording = async () => {
    if (recording || !navigator.mediaDevices) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;
      recordedChunks.current = [];
      const recorder = new MediaRecorder(stream, { mimeType: "audio/webm" });
      recorder.ondataavailable = (e) => recordedChunks.current.push(e.data);
      recorder.onstop = () => {
        setRecordedBlob(new Blob(recordedChunks.current, { type: recorder.mimeType }));
      };
      recorder.start();
      mediaRecorderRef.current = recorder;
      setRecording(true);
      setTimer(0);
      timerRef.current = setInterval(() => setTimer((t) => t + 1), 1000);
    } catch (err) {
      console.error("Recording error:", err);
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    mediaStreamRef.current?.getTracks().forEach((t) => t.stop());
    setRecording(false);
    clearInterval(timerRef.current);
  };

  const discardRecording = () => {
    setRecordedBlob(null);
    setTimer(0);
  };

  const sendRecording = () => {
    if (!recordedBlob || !socket) return;
    const tempId = uuidv4();

    const blobUrl = URL.createObjectURL(recordedBlob);
    blobUrlsRef.current[tempId] = blobUrl;

    const optimistic = {
      _id: tempId,
      conversationId,
      from: businessId,
      to: customerId,
      fileUrl: blobUrl,
      fileName: `audio.${recordedBlob.type.split("/")[1]}`,
      fileType: recordedBlob.type,
      fileDuration: timer,
      timestamp: new Date().toISOString(),
      sending: true,
      tempId,
    };
    dispatch({ type: "append", payload: optimistic });
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
          conversationType,
        },
        (ack) => {
          dispatch({
            type: "updateStatus",
            payload: {
              id: tempId,
              updates: {
                ...(ack.message || {}),
                sending: false,
                failed: !ack.ok,
              },
            },
          });
        }
      );
    };
    reader.readAsArrayBuffer(recordedBlob);
  };

  const listRef = useRef(null);

  return (
    <div className="chat-container business">
      {/* Header */}
      <div className="chat-header">
        <h3>{customerName}</h3>
      </div>

      {/* רשימת הודעות */}
      <div className="message-list" ref={listRef}>
        {messages.length === 0 && <div className="empty">עדיין אין הודעות</div>}

        {messages.map((m, i) =>
          m.system ? (
            <div key={m._id || `sys-${i}`} className="system-message">
              {m.content}
            </div>
          ) : (
            <div
              key={`${m._id || m.tempId}-${m.fileUrl || ""}`}
              className={`message${m.from === businessId ? " mine" : " theirs"}${
                m.sending ? " sending" : ""
              }${m.failed ? " failed" : ""}`}
            >
              {/* תוכן ההודעה */}
              {m.fileUrl ? (
                m.fileType?.startsWith("audio") ? (
                  <WhatsAppAudioPlayer src={m.fileUrl} duration={m.fileDuration} />
                ) : m.fileType?.startsWith("image") ? (
                  <img
                    src={m.fileUrl}
                    alt={m.fileName}
                    style={{ maxWidth: 200, borderRadius: 8 }}
                    onError={() => console.error("[img] failed to load", m.fileUrl)}
                  />
                ) : (
                  <a href={m.fileUrl} download>
                    {m.fileName}
                  </a>
                )
              ) : (
                <div className="text">{m.text}</div>
              )}

              {/* מטאדאטה */}
              <div className="meta">
                <span className="time">{formatTime(m.timestamp)}</span>
                {m.fileDuration > 0 && (
                  <span className="audio-length">
                    {`${Math.floor(m.fileDuration / 60)
                      .toString()
                      .padStart(2, "0")}:${Math.floor(m.fileDuration % 60)
                      .toString()
                      .padStart(2, "0")}`}
                  </span>
                )}
                {m.sending && <span className="sending-indicator">⏳</span>}
                {m.failed && <span className="failed-indicator">❌</span>}
              </div>
            </div>
          )
        )}

        {isTyping && <div className="typing-indicator">הלקוח מקליד…</div>}
      </div>

      {/* סרגל קלט */}
      <div className="inputBar">
        {recording || recordedBlob ? (
          <div className="audio-preview-row">
            {recording ? (
              <>
                <button onClick={stopRecording} className="recordBtn recording">
                  ⏹️
                </button>
                <span className="preview-timer">{`${Math.floor(timer / 60)
                  .toString()
                  .padStart(2, "0")}:${(timer % 60).toString().padStart(2, "0")}`}</span>
                <button onClick={discardRecording} className="preview-btn trash">
                  🗑️
                </button>
              </>
            ) : (
              <>
                <AudioPreview recordedBlob={recordedBlob} />
                <div>{`משך: ${Math.floor(timer / 60)}:${(timer % 60)
                  .toString()
                  .padStart(2, "0")}`}</div>
                <button onClick={sendRecording} className="send-btn" disabled={sending}>
                  שלח
                </button>
                <button onClick={discardRecording} className="discard-btn">
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
              onChange={handleInput}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              rows={1}
              disabled={sending}
            />
            <button
              onClick={sendMessage}
              className="sendButtonFlat"
              disabled={sending || !input.trim()}
              title="שלח"
            >
              ◀
            </button>
            <div className="inputBar-right">
              <button onClick={handleAttach} className="attachBtn" disabled={sending} title="צרף קובץ">
                📎
              </button>
              <button
                onClick={recording ? stopRecording : startRecording}
                className={`recordBtn${recording ? " recording" : ""}`}
                disabled={sending}
                title={recording ? "עצור הקלטה" : "התחל הקלטה"}
              >
                🎤
              </button>
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: "none" }}
                accept="image/*,audio/*,video/*"
                onChange={handleFileChange}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
