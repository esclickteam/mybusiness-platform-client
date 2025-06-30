import React, {
  useEffect,
  useRef,
  useState,
  useReducer
} from "react";
import { v4 as uuidv4 } from "uuid";
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
    <div
      className={`custom-audio-player ${userAvatar ? "with-avatar" : "no-avatar"}`}
    >
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
 * reducer לניהול היסטוריית ההודעות
 */
function messagesReducer(state, action) {
  switch (action.type) {
    case "set":
      console.log("[messagesReducer] set messages", action.payload);
      return action.payload;

    /**
     * append – מוסיף הודעה או מעדכן קיימת לפי _id/ tempId
     */
    case "append": {
      console.log("[messagesReducer] append message", action.payload);
      const idx = state.findIndex(
        (m) =>
          (m._id && m._id === action.payload._id) ||
          (m.tempId && m.tempId === action.payload.tempId)
      );
      if (idx !== -1) {
        const next = [...state];
        next[idx] = { ...next[idx], ...action.payload };
        console.log("[messagesReducer] updated existing message at index", idx);
        return next;
      }
      return [...state, action.payload];
    }
    case "updateStatus":
      console.log("[messagesReducer] updateStatus", action.payload);
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

  /*** ---------------------- הקלטת אודיו ----------------------- ***/
  const [recording, setRecording] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState(null);
  const [timer, setTimer] = useState(0);
  const mediaRecorderRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const recordedChunks = useRef([]);
  const timerRef = useRef(null);
  /*** --------------------------------------------------------- ***/

  const listRef = useRef(null);

  /**
   * טוען היסטוריה בפעם הראשונה ומצטרף לשיחה
   */
  useEffect(() => {
    if (!socket || !conversationId) {
      console.log("[useEffect] No socket or conversationId, clearing messages");
      dispatch({ type: "set", payload: [] });
      return;
    }

    console.log("[useEffect] joining conversation", conversationId);
    socket.emit("joinConversation", conversationId, isBusinessConversation, (ack) => {
      if (!ack.ok) console.error("joinConversation failed:", ack.error);
      else console.log("joinConversation success");
    });

    socket.emit("markMessagesRead", conversationId, (resp) => {
      if (!resp.ok) console.error("markMessagesRead failed");
      else console.log("markMessagesRead success");
    });

    socket.emit(
      "getHistory",
      { conversationId, conversationType },
      (res) => {
        if (res.ok) {
          console.log("[getHistory] received messages count:", res.messages.length);
          const msgs = (res.messages || []).map((m) => {
            let text = m.text || m.content || "";
            if (text === "0") text = ""; // למנוע הצגת "0"
            return {
              ...m,
              timestamp: m.createdAt || new Date().toISOString(),
              text,
              fileUrl: m.fileUrl || m.file?.url || null,
              fileType: m.fileType || m.file?.mimeType || null,
              fileName: m.fileName || m.file?.name || "",
              fileDuration: m.fileDuration ?? m.file?.duration ?? 0,
              tempId: m.tempId || null,
            };
          });
          dispatch({ type: "set", payload: msgs });
        } else {
          console.error("getHistory failed:", res.error);
          dispatch({ type: "set", payload: [] });
        }
      }
    );

    return () => {
      console.log("[useEffect] leaving conversation", conversationId);
      socket.emit("leaveConversation", conversationId, isBusinessConversation);
    };
  }, [socket, conversationId, isBusinessConversation, conversationType]);

  /**
   * מאזין להודעות נכנסות והקלדה
   */
  useEffect(() => {
    if (!socket) return;

    const handleNew = (msg) => {
      console.log("[socket] newMessage received:", msg);
      if (msg.conversationId !== conversationId || msg.conversationType !== conversationType) {
        return;
      }

      const exists = messagesRef.current.some(
        (m) =>
          m._id === msg._id ||
          (msg.tempId && m.tempId === msg.tempId) ||
          // התאמה צולבת: tempId ←→ _id
          (m.tempId && msg._id && m.tempId === msg._id)
      );
      if (exists) {
        console.log("[socket] message already exists, ignoring");
        return;
      }

      const raw = msg.text || msg.content || "";
      const text = raw === "0" ? "" : raw;

      const safeMsg = {
        ...msg,
        timestamp: msg.createdAt || new Date().toISOString(),
        text,
        fileUrl: msg.fileUrl || msg.file?.url || null,
        fileType: msg.fileType || msg.file?.mimeType || null,
        fileName: msg.fileName || msg.file?.name || "",
        fileDuration: msg.fileDuration ?? msg.file?.duration ?? 0,
        tempId: msg.tempId || null,
      };

      console.log("[socket] dispatching append for new message");
      dispatch({ type: "append", payload: safeMsg });
    };

    const handleTyping = ({ from }) => {
      if (from !== customerId) return;
      console.log("[socket] typing event from customer");
      setIsTyping(true);
      clearTimeout(handleTyping._t);
      handleTyping._t = setTimeout(() => {
        setIsTyping(false);
        console.log("[socket] typing timeout cleared");
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

  /**
   * גלילה אוטומטית כאשר מגיעה הודעה חדשה
   */
  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 100;
    if (nearBottom) {
      console.log("[scroll] scrolling to bottom");
      el.scrollTop = el.scrollHeight;
    }
  }, [messages, isTyping]);

  /**
   * Input change + emit typing
   */
  const handleInput = (e) => {
    setInput(e.target.value);
    socket?.emit("typing", { conversationId, from: businessId });
    console.log("[handleInput] typing emitted");
  };

  /**
   * שליחת הודעת טקסט
   */
  const sendMessage = () => {
    if (sending) {
      console.log("[sendMessage] already sending, ignoring");
      return;
    }
    const text = input.trim();
    if (!text || text === "0" || !socket) {
      console.log("[sendMessage] invalid text or no socket", { text });
      return;
    }

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
    console.log("[sendMessage] dispatching optimistic message", optimistic);
    dispatch({ type: "append", payload: optimistic });
    setInput("");

    socket.emit(
      "sendMessage",
      { conversationId, from: businessId, to: customerId, text, tempId, conversationType },
      (ack) => {
        setSending(false);
        console.log("[sendMessage] ack received", ack);

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
    console.log("[handleAttach] opening file dialog");
    fileInputRef.current?.click();
  };

  /**
   * המשתמש בחר קובץ – טיפול בשליחה
   */
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file || !socket) {
      console.log("[handleFileChange] no file or no socket");
      return;
    }
    const tempId = uuidv4();

    const blobUrl = URL.createObjectURL(file);

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
    console.log("[handleFileChange] dispatching optimistic file message", optimistic);
    dispatch({ type: "append", payload: optimistic });

    const reader = new FileReader();
    reader.onload = () => {
      console.log("[handleFileChange] emitting sendFile");
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
          console.log("[sendFile] ack received:", ack);

          // ביטול כתובת blob כדי לשחרר זיכרון
          if (blobUrl.startsWith("blob:")) {
            URL.revokeObjectURL(blobUrl);
          }

          dispatch({
            type: "updateStatus",
            payload: {
              id: tempId,
              updates: {
                ...(ack.message || {}), // כולל _id, fileUrl קבוע ועוד
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

  /** ----------------- הקלטת ושליחת הודעת קול ---------------- */
  const startRecording = async () => {
    if (recording || !navigator.mediaDevices) {
      console.log("[startRecording] already recording or no mediaDevices");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;
      recordedChunks.current = [];
      const recorder = new MediaRecorder(stream, { mimeType: "audio/webm" });
      recorder.ondataavailable = (e) => recordedChunks.current.push(e.data);
      recorder.onstop = () => {
        setRecordedBlob(new Blob(recordedChunks.current, { type: recorder.mimeType }));
        console.log("[startRecording] recorder stopped, blob ready");
      };
      recorder.start();
      mediaRecorderRef.current = recorder;
      setRecording(true);
      setTimer(0);
      timerRef.current = setInterval(() => setTimer((t) => t + 1), 1000);
      console.log("[startRecording] Recording started");
    } catch (err) {
      console.error("[startRecording] Recording error:", err);
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    mediaStreamRef.current?.getTracks().forEach((t) => t.stop());
    setRecording(false);
    clearInterval(timerRef.current);
    console.log("[stopRecording] Recording stopped");
  };

  const discardRecording = () => {
    setRecordedBlob(null);
    setTimer(0);
    console.log("[discardRecording] Recording discarded");
  };

  const sendRecording = () => {
    if (!recordedBlob || !socket) {
      console.log("[sendRecording] no recording or no socket");
      return;
    }
    const tempId = uuidv4();
    console.log("[sendRecording] Sending audio message:", tempId);

    const blobUrl = URL.createObjectURL(recordedBlob);

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
      console.log("[sendRecording] emitting sendAudio");
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
          console.log("[sendAudio] Ack received:", ack);

          if (blobUrl.startsWith("blob:")) URL.revokeObjectURL(blobUrl);

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
  /** --------------------------------------------------------- */

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
                m.sending ? " sending" : ""}${m.failed ? " failed" : ""}`}
            >
              {/* תוכן ההודעה */}
              {m.fileUrl ? (
                m.fileType?.startsWith("audio") ? (
                  <WhatsAppAudioPlayer src={m.fileUrl} duration={m.fileDuration} />
                ) : m.fileType?.startsWith("image") ? (
                  <>
                    <img
                      src={m.fileUrl}
                      alt={m.fileName}
                      style={{ maxWidth: 200, borderRadius: 8 }}
                      onError={() => console.error("[img] failed to load", m.fileUrl)}
                    />
                    <div style={{ fontSize: 10, color: "#888" }}>URL: {m.fileUrl}</div>
                  </>
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
                <audio src={blobUrl} controls />
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
