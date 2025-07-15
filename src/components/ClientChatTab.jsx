import React, { useEffect, useRef, useState, useReducer } from "react";
import { v4 as uuidv4 } from "uuid";
import API from "../api"; // axios עם token מוגדר מראש
import { useSocket } from "../context/socketContext";
import "./ClientChatTab.css";

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
    if (playing) {
      audio.pause();
    } else {
      audio.play();
    }
    setPlaying(!playing);
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

function normalize(msg, userId) {
  return {
    ...msg,
    _id: String(msg._id),
    tempId: msg.tempId || null,
    timestamp: msg.createdAt || msg.timestamp || new Date().toISOString(),
    fileUrl: msg.fileUrl || msg.url || "",
    fileName: msg.fileName || msg.originalName || "",
    fileType: msg.fileType || msg.mimeType || "",
    fileDuration: msg.fileDuration || msg.duration || 0,
    text: msg.text || msg.content || "",
    role: String(msg.from) === String(userId) ? "client" : "business", // הוספת role
  };
}

function messagesReducer(state, action) {
  switch (action.type) {
    case "set": {
      const unique = [];
      action.payload.forEach((msg) => {
        if (
          !unique.some(
            (m) =>
              (m._id && (m._id === msg._id || m._id === msg.tempId)) ||
              (m.tempId && (m.tempId === msg._id || m.tempId === msg.tempId))
          )
        ) {
          unique.push(msg);
        }
      });
      console.log("[Reducer] set messages, total:", unique.length);
      return unique;
    }
    case "append": {
      const idx = state.findIndex(
        (m) =>
          (m._id && (m._id === action.payload._id || m._id === action.payload.tempId)) ||
          (m.tempId && (m.tempId === action.payload._id || m.tempId === action.payload.tempId))
      );
      if (idx !== -1) {
        const next = [...state];
        next[idx] = { ...next[idx], ...action.payload };
        console.log("[Reducer] append: updated existing message", action.payload._id);
        return next;
      }
      console.log("[Reducer] append: new message", action.payload._id);
      return [...state, action.payload];
    }
    case "updateStatus": {
      console.log("[Reducer] updateStatus for message id", action.payload.id);
      return state.map((m) =>
        m._id === action.payload.id || m.tempId === action.payload.id
          ? { ...m, ...action.payload.updates }
          : m
      );
    }
    default:
      return state;
  }
}

export default function ClientChatTab({
  socket,
  conversationId,
  setConversationId,
  businessId,
  userId,
  conversationType = "user-business",
}) {
  const [messages, dispatch] = useReducer(messagesReducer, []);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const messagesRef = useRef(messages);
  const listRef = useRef(null);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  // הצטרפות ל-room גלובלי ו-joinConversation + טעינת היסטוריה דרך API
  useEffect(() => {
    if (!socket || !conversationId || !userId) {
      dispatch({ type: "set", payload: [] });
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    socket.emit("joinRoom", `client-${userId}`);
    const isBizConv = conversationType === "business-business";
    socket.emit("joinConversation", conversationId, isBizConv);

    let cancelled = false;
    (async () => {
      try {
        const res = await API.get(`/messages/${conversationId}/history`, {
          params: { page: 0, limit: 50 },
        });
        if (cancelled) return;
        const msgs = (res.data.messages || []).map((msg) => normalize(msg, userId));
        dispatch({ type: "set", payload: msgs });
        setError("");
      } catch (err) {
        setError("שגיאה בטעינת ההיסטוריה: " + (err.message || err));
        dispatch({ type: "set", payload: [] });
      }
      setLoading(false);
    })();

    return () => {
      cancelled = true;
      socket.emit("leaveConversation", conversationId, isBizConv);
      socket.emit("leaveRoom", `client-${userId}`);
    };
  }, [socket, conversationId, userId, conversationType]);

  // מאזינים לאירועים
  useEffect(() => {
    if (!socket || !conversationId) return;

    const handleNewMessage = (msg) => {
      if (msg.conversationId !== conversationId) return;
      dispatch({ type: "append", payload: normalize(msg, userId) });
    };

    const handleMessageApproved = (msg) => {
      if (msg.conversationId !== conversationId) return;
      dispatch({
        type: "updateStatus",
        payload: {
          id: msg._id,
          updates: { status: "approved", ...msg },
        },
      });
    };

    socket.on("newMessage", handleNewMessage);
    socket.on("messageApproved", handleMessageApproved);

    return () => {
      socket.off("newMessage", handleNewMessage);
      socket.off("messageApproved", handleMessageApproved);
    };
  }, [socket, conversationId, userId]);

  // גלילה אוטומטית לתחתית
  useEffect(() => {
    if (!listRef.current) return;
    const el = listRef.current;
    const isNearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 100;
    if (isNearBottom) el.scrollTop = el.scrollHeight;
  }, [messages]);

  const sendMessage = () => {
    if (!businessId) {
      setError("businessId לא מוגדר");
      return;
    }
    if (!input.trim() || sending || !socket || !socket.connected) {
      if (!socket.connected) setError("Socket אינו מחובר");
      return;
    }

    setSending(true);
    setError("");
    const tempId = uuidv4();

    if (!conversationId) {
      socket.emit(
        "createConversationAndSendMessage",
        {
          from: userId,
          to: businessId,
          text: input.trim(),
          conversationType,
          tempId,
        },
        (ack) => {
          setSending(false);
          if (ack.ok && ack.conversationId && ack.message) {
            setConversationId && setConversationId(ack.conversationId);
            dispatch({ type: "set", payload: [normalize(ack.message, userId)] });
            setInput("");
          } else {
            setError("שגיאה ביצירת השיחה");
          }
        }
      );
    } else {
      const optimisticMsg = {
        _id: tempId,
        tempId,
        conversationId,
        from: userId,
        text: input.trim(),
        timestamp: new Date().toISOString(),
        sending: true,
      };
      dispatch({ type: "append", payload: optimisticMsg });
      setInput("");

      socket.emit(
        "sendMessage",
        {
          conversationId,
          from: userId,
          to: businessId,
          text: optimisticMsg.text,
          tempId,
          conversationType,
        },
        (ack) => {
          setSending(false);
          if (ack.ok && ack.message) {
            dispatch({
              type: "updateStatus",
              payload: {
                id: tempId,
                updates: { sending: false, ...normalize(ack.message, userId) },
              },
            });
          } else {
            setError("שגיאה בשליחת ההודעה: " + (ack.error || "לא ידוע"));
            dispatch({
              type: "updateStatus",
              payload: { id: tempId, updates: { sending: false, failed: true } },
            });
          }
        }
      );
    }
  };

  const sortedMessages = [...messages].sort(
    (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
  );

  return (
    <div className="chat-container client">
      <div className="message-list" ref={listRef}>
        {loading && <div className="loading">טוען...</div>}
        {!loading && sortedMessages.length === 0 && <div className="empty">עדיין אין הודעות</div>}
        {sortedMessages.map((m) => (
          <div
            key={m._id || m.tempId}
            className={`message${m.role === "client" ? " mine" : " theirs"}${m.sending ? " sending" : ""}${m.failed ? " failed" : ""}`}
          >
            {m.fileUrl ? (
              /\.(jpe?g|png|gif|bmp|webp|svg)$/i.test(m.fileUrl) ? (
                <img src={m.fileUrl} alt={m.fileName || "image"} style={{ maxWidth: 200, borderRadius: 8 }} />
              ) : m.fileType?.startsWith("audio") ? (
                <WhatsAppAudioPlayer src={m.fileUrl} duration={m.fileDuration} userAvatar={null} />
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
            </div>
          </div>
        ))}
      </div>

      <div className="inputBar">
        {error && <div className="error-alert">⚠ {error}</div>}

        <textarea
          className="inputField"
          placeholder="הקלד הודעה..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              sendMessage();
            }
          }}
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
      </div>
    </div>
  );
}
