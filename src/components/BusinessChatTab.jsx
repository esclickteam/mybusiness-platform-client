import React, { useEffect, useRef, useState, useReducer } from "react";
import { v4 as uuidv4 } from "uuid";
import "./BusinessChatTab.css";

// קומפוננטת נגינת אודיו
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

// Reducer לניהול הודעות
function messagesReducer(state, action) {
  switch (action.type) {
    case "set":
      return typeof action.payload === "function" ? action.payload(state) : action.payload;
    case "append": {
      const idx = state.findIndex(
        (m) => m._id === action.payload._id || m.tempId === action.payload.tempId
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
    case "updateReadBy":
      return state.map((m) =>
        m._id === action.payload.messageId
          ? { ...m, readBy: action.payload.readBy }
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
}) {
  const [messages, dispatch] = useReducer(messagesReducer, []);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  // States להקלטת אודיו
  const [recording, setRecording] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState(null);
  const [timer, setTimer] = useState(0);

  const fileInputRef = useRef(null);
  const listRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const recordedChunks = useRef([]);
  const timerRef = useRef(null);

  // פונקציה לעיצוב זמן
  const formatTime = (ts) => {
    if (!ts) return "";
    const d = new Date(ts);
    if (isNaN(d)) return "";
    return d.toLocaleTimeString("he-IL", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // התחברות, טעינת היסטוריה וסימון קריאה
  useEffect(() => {
    if (!socket || !conversationId) {
      dispatch({ type: "set", payload: [] });
      return;
    }

    socket.emit("joinConversation", conversationId, (ack) => {
      if (!ack.ok) console.error("joinConversation failed");
    });

    socket.emit("markMessagesRead", conversationId, (resp) => {
      if (!resp.ok) console.error("markMessagesRead failed");
    });

    socket.emit("getHistory", { conversationId }, (res) => {
      if (res.ok) {
        const msgs = (res.messages || []).map((m) => ({
          ...m,
          timestamp: m.createdAt || new Date().toISOString(),
          text: m.content || "",
          fileUrl: m.fileUrl || null,
          fileType: m.fileType || null,
          fileName: m.fileName || "",
          fileDuration: m.fileDuration || 0,
          readBy: m.readBy || [],
        }));
        dispatch({ type: "set", payload: msgs });
      } else {
        console.error("getHistory failed");
        dispatch({ type: "set", payload: [] });
      }
    });

    return () => {
      socket.emit("leaveConversation", conversationId);
    };
  }, [socket, conversationId]);

  // מאזינים להודעות חדשות, הקלדה ועדכון סטטוס קריאה
  useEffect(() => {
    if (!socket) return;

    const handleNew = (msg) => {
      if (msg.conversationId === conversationId) {
        const safeMsg = {
          ...msg,
          timestamp: msg.createdAt || new Date().toISOString(),
          text: msg.content || "",
          fileUrl: msg.fileUrl || null,
          fileType: msg.fileType || null,
          fileName: msg.fileName || "",
          fileDuration: msg.fileDuration || 0,
          readBy: msg.readBy || [],
        };
        dispatch({ type: "append", payload: safeMsg });
      }
    };

    const handleTyping = ({ from }) => {
      if (from === customerId) {
        setIsTyping(true);
        clearTimeout(handleTyping._t);
        handleTyping._t = setTimeout(() => setIsTyping(false), 1800);
      }
    };

    const handleReadReceipt = ({ messageId, userId: readerId, readBy }) => {
  setMessages((prev) =>
    prev.map((msg) => {
      if (msg._id === messageId) {
        // עדכון עם מערך readBy שמגיע מהשרת, או השארת הקיים אם לא קיים
        return { ...msg, readBy: readBy || msg.readBy || [] };
      }
      return msg;
    })
  );
};


    socket.on("newMessage", handleNew);
    socket.on("typing", handleTyping);
    socket.on("messageRead", handleReadReceipt);

    return () => {
      socket.off("newMessage", handleNew);
      socket.off("typing", handleTyping);
      socket.off("messageRead", handleReadReceipt);
      clearTimeout(handleTyping._t);
    };
  }, [socket, conversationId, customerId]);

  // גלילה אוטומטית לתחתית כשמתווספות הודעות או הקלדה
  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 100;
    if (nearBottom) el.scrollTop = el.scrollHeight;
  }, [messages, isTyping]);

  // סימון קריאה אוטומטי כאשר הודעות מוצגות ללקוח
  useEffect(() => {
    if (!socket || !messages.length) return;

    const unreadMessages = messages.filter(
      (m) =>
        m.from !== businessId &&
        (!m.readBy || !m.readBy.some((id) => id.toString() === businessId.toString()))
    );

    unreadMessages.forEach((msg) => {
      socket.emit("markMessageRead", {
        conversationId,
        messageId: msg._id,
      });
    });
  }, [messages, socket, conversationId, businessId]);

  // Handlers להקלדה ושליחה
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
    const optimistic = {
      _id: tempId,
      conversationId,
      from: businessId,
      to: customerId,
      text,
      timestamp: new Date().toISOString(),
      sending: true,
      tempId,
      readBy: [],
    };
    dispatch({ type: "append", payload: optimistic });
    setInput("");
    socket.emit(
      "sendMessage",
      { conversationId, from: businessId, to: customerId, text, tempId },
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

  // --- פונקציות הקלטת אודיו ---
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
      console.error("[startRecording] Recording error:", err);
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
    const optimistic = {
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
      readBy: [],
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

  // טיפול בקבצים מצורפים
  const handleAttach = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file || !socket) return;
    const tempId = uuidv4();

    const optimistic = {
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
      readBy: [],
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
        },
        (ack) => {
          dispatch({
            type: "updateStatus",
            payload: {
              id: tempId,
              updates: {
                fileUrl: ack.message?.fileUrl || null,
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

  return (
    <div className="chat-container business">
      <div className="chat-header">
        <h3>{customerName}</h3>
      </div>

      <div className="message-list" ref={listRef}>
        {messages.length === 0 && <div className="empty">עדיין אין הודעות</div>}
        {messages.map((m, i) =>
          m.system ? (
            <div key={m._id || `sys-${i}`} className="system-message">
              {m.content}
            </div>
          ) : (
            <div
              key={m._id || m.tempId}
              className={`message${m.from === businessId ? " mine" : " theirs"}${
                m.sending ? " sending" : ""
              }${m.failed ? " failed" : ""}`}
            >
              {m.fileUrl ? (
                m.fileType?.startsWith("audio") ? (
                  <WhatsAppAudioPlayer src={m.fileUrl} duration={m.fileDuration} />
                ) : m.fileType?.startsWith("image") ? (
                  <img src={m.fileUrl} alt={m.fileName} style={{ maxWidth: 200, borderRadius: 8 }} />
                ) : (
                  <a href={m.fileUrl} download>
                    {m.fileName}
                  </a>
                )
              ) : (
                <div className="text">{m.text}</div>
              )}

              <div className="meta">
                <span className="time">{formatTime(m.timestamp)}</span>

                {/* סימון קריאה */}
                {m.from === businessId && m.readBy && m.readBy.some(id => id.toString() === customerId.toString()) && (
                  <span className="read-indicator" title="נקראה">
                    ✔✔
                  </span>
                )}

                {m.fileDuration && (
                  <span className="audio-length">{`${Math.floor(m.fileDuration / 60)
                    .toString()
                    .padStart(2, "0")}:${Math.floor(m.fileDuration % 60)
                    .toString()
                    .padStart(2, "0")}`}</span>
                )}

                {m.sending && <span className="sending-indicator">⏳</span>}
                {m.failed && <span className="failed-indicator">❌</span>}
              </div>
            </div>
          )
        )}
        {isTyping && <div className="typing-indicator">הלקוח מקליד…</div>}
      </div>

      <div className="inputBar">
        {(recording || recordedBlob) ? (
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
                <audio src={URL.createObjectURL(recordedBlob)} controls />
                <div>{`משך: ${Math.floor(timer / 60)}:${(timer % 60).toString().padStart(2, "0")}`}</div>
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
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), sendMessage())}
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
