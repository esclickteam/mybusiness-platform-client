import React, { useEffect, useRef, useState, useReducer } from "react";
import { v4 as uuidv4 } from "uuid";
import API from "../api"; // axios עם token מוגדר מראש
import { useSocket } from "../context/socketContext";
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
  conversationType = "user-business",
}) {
  const socket = useSocket();
  const [messages, dispatch] = useReducer(messagesReducer, []);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesRef = useRef(messages);
  const listRef = useRef(null);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  const formatTime = (ts) => {
    if (!ts) return "";
    const d = new Date(ts);
    if (isNaN(d)) return "";
    return d.toLocaleTimeString("he-IL", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // fetch message history
  async function fetchMessagesByConversationId(conversationId, page = 0, limit = 50) {
    try {
      const res = await API.get(`/messages/${conversationId}/history`, {
        params: { page, limit },
      });
      let msgs = res.data.messages.map((m) => ({
        ...m,
        _id: String(m._id),
        timestamp: m.createdAt || new Date().toISOString(),
        text: m.text || "",
        tempId: m.tempId || null,
        from: m.from,
      }));

      // סינון הודעות ב-client-business tab: רק הודעות שהן לא מהעסק (user-business)
      if (conversationType === "user-business") {
        msgs = msgs.filter((m) => String(m.from) !== String(businessId));
      }

      return msgs;
    } catch (error) {
      console.error("Failed to fetch messages:", error);
      return [];
    }
  }

  // load on conversation change
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
  }, [conversationId, conversationType, businessId]);

  // real-time socket handlers
  useEffect(() => {
    if (!socket) return;

    const handleNew = (msg) => {
      if (
        msg.conversationId !== conversationId ||
        msg.conversationType !== conversationType
      )
        return;

      // סינון הודעות מהעסק בזמן שצופים בשיחות מסוג user-business
      if (
        conversationType === "user-business" &&
        String(msg.from) === String(businessId)
      ) {
        return;
      }

      const safeMsg = {
        ...msg,
        _id: String(msg._id),
        timestamp: msg.createdAt || new Date().toISOString(),
        text: msg.text || "",
        fileUrl: msg.fileUrl || null,
        fileType: msg.fileType || null,
        fileName: msg.fileName || "",
        fileDuration: msg.fileDuration || 0,
        tempId: msg.tempId || null,
      };

      const exists = messagesRef.current.some(
        (m) =>
          String(m._id) === safeMsg._id ||
          (safeMsg.tempId && m.tempId === safeMsg.tempId)
      );
      if (exists) return;

      dispatch({ type: "append", payload: safeMsg });
    };

    const handleTyping = ({ from }) => {
      if (String(from) !== String(customerId)) return;
      setIsTyping(true);
      clearTimeout(handleTyping._t);
      handleTyping._t = setTimeout(() => setIsTyping(false), 1800);
    };

    socket.on("newMessage", handleNew);
    socket.on("typing", handleTyping);
    return () => {
      socket.off("newMessage", handleNew);
      socket.off("typing", handleTyping);
      clearTimeout(handleTyping._t);
    };
  }, [socket, conversationId, customerId, conversationType, businessId]);

  // auto-scroll
  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 100;
    if (nearBottom) el.scrollTop = el.scrollHeight;
  }, [messages, isTyping]);

  // input handlers
  const handleInput = (e) => {
    setInput(e.target.value);
    socket?.emit("typing", { conversationId, from: businessId });
  };

  const sendMessage = () => {
    if (sending) return;
    const text = input.trim();
    if (!text) return;
    if (!socket) return;

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

  return (
    <div className="chat-container business">
      {/* Header */}
      <div className="chat-header">
        <h3>{customerName}</h3>
      </div>

      {/* Message list */}
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
              className={`message${String(m.from) === String(businessId) ? " mine" : " theirs"}${
                m.sending ? " sending" : ""
              }${m.failed ? " failed" : ""}`}
            >
              {m.fileUrl ? (
                m.fileType?.startsWith("audio") ? (
                  <WhatsAppAudioPlayer src={m.fileUrl} duration={m.fileDuration} userAvatar={null} />
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

      {/* Input bar */}
      <div className="inputBar">
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
      </div>
    </div>
  );
}
