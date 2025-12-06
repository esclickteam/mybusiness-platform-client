import React, { useEffect, useRef, useState, useReducer } from "react";
import { v4 as uuidv4 } from "uuid";
import API from "../api";
import { useSocket } from "../context/socketContext";
import { useNotifications } from "../context/NotificationsContext";
import "./BusinessChatTab.css";

/* ---------------------------------------------------
   NORMALIZE MESSAGE
--------------------------------------------------- */
function normalize(msg) {
  return {
    ...msg,
    _id: String(msg._id),
    tempId: msg.tempId || null,
    timestamp: msg.createdAt || msg.timestamp || new Date().toISOString(),
  };
}

/* ---------------------------------------------------
   WHATSAPP-STYLE AUDIO PLAYER
--------------------------------------------------- */
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

      <button onClick={togglePlay} className={`play-pause ${playing ? "playing" : ""}`}>
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

/* ---------------------------------------------------
   MESSAGES REDUCER
--------------------------------------------------- */
function messagesReducer(state, action) {
  switch (action.type) {
    case "set": {
      const unique = [];
      action.payload.forEach((msg) => {
        if (
          !unique.some(
            (m) =>
              m._id === msg._id ||
              m._id === msg.tempId ||
              m.tempId === msg._id
          )
        ) {
          unique.push(msg);
        }
      });
      return unique;
    }

    case "append": {
      const exists = state.some(
        (m) =>
          (m._id && action.payload._id && m._id === action.payload._id) ||
          (m.tempId && action.payload.tempId && m.tempId === action.payload.tempId)
      );
      if (exists) return state;
      return [...state, action.payload];
    }

    case "updateStatus": {
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

/* ---------------------------------------------------
   MAIN COMPONENT
--------------------------------------------------- */
export default function BusinessChatTab({
  conversationId,
  businessId,
  customerId,
  customerName,
  conversationType = "user-business",
}) {
  const socket = useSocket();
  const { addNotification } = useNotifications();

  const [messages, dispatch] = useReducer(messagesReducer, []);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const listRef = useRef(null);

  /* ---------------------------------------------------
     LOAD MESSAGE HISTORY
--------------------------------------------------- */
  useEffect(() => {
    if (!conversationId) {
      dispatch({ type: "set", payload: [] });
      return;
    }

    let cancelled = false;

    (async () => {
      try {
        const res = await API.get(`/messages/${conversationId}/history`, {
          params: { page: 0, limit: 50 },
        });
        if (cancelled) return;
        const msgs = res.data.messages.map(normalize);
        dispatch({ type: "set", payload: msgs });
      } catch (err) {
        console.error("Error loading history:", err);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [conversationId]);

  /* ---------------------------------------------------
     SOCKET REAL-TIME EVENTS (✅ FIXED)
--------------------------------------------------- */
  useEffect(() => {
    if (!socket || !conversationId) return;

    const isBizConv = conversationType === "business-business";

    const join = () => {
      socket.emit("joinConversation", conversationType, conversationId, isBizConv);
    };

    socket.on("connect", join);
    if (socket.connected) join();

    const handleMessage = (msg) => {
      const safe = normalize(msg);

      // 🧩 אל תוסיף הודעה שכבר קיימת לפי tempId או _id
      const alreadyExists = messages.some(
        (m) =>
          (m._id && safe._id && m._id === safe._id) ||
          (m.tempId && safe.tempId && m.tempId === safe.tempId)
      );
      if (alreadyExists) return;

      if (msg.conversationId === conversationId) {
        dispatch({ type: "append", payload: safe });
      }
    };

    const handleTyping = ({ from }) => {
      if (String(from) !== String(customerId)) return;
      setIsTyping(true);
      clearTimeout(handleTyping._t);
      handleTyping._t = setTimeout(() => setIsTyping(false), 1800);
    };

    socket.on("newMessage", handleMessage);
    socket.on("typing", handleTyping);

    return () => {
      socket.off("connect", join);
      socket.off("newMessage", handleMessage);
      socket.off("typing", handleTyping);
      clearTimeout(handleTyping._t);
      socket.emit("leaveConversation", conversationType, conversationId, isBizConv);
    };
  }, [socket, conversationId, conversationType, businessId, customerId, messages]);

  /* ---------------------------------------------------
     SCROLL TO BOTTOM ON UPDATE
--------------------------------------------------- */
  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

  /* ---------------------------------------------------
     SEND MESSAGE
--------------------------------------------------- */
  const sendMessage = () => {
    if (!input.trim() || sending) return;

    const tempId = uuidv4();
    const text = input.trim();

    setSending(true);

    dispatch({
      type: "append",
      payload: {
        _id: tempId,
        tempId,
        conversationId,
        from: businessId,
        to: customerId,
        text,
        timestamp: new Date().toISOString(),
        sending: true,
      },
    });

    setInput("");

    socket.emit(
      "sendMessage",
      {
        conversationId,
        from: businessId,
        to: customerId,
        text,
        tempId,
        conversationType,
      },
      (ack) => {
        setSending(false);
        dispatch({
          type: "updateStatus",
          payload: {
            id: tempId,
            updates: {
              sending: false,
              failed: !ack.ok,
              ...(ack.message || {}),
            },
          },
        });
      }
    );
  };

  /* ---------------------------------------------------
     RENDER
--------------------------------------------------- */
  if (!businessId) {
    return (
      <div className="chat-container business">
        <div className="loading">Loading chat...</div>
      </div>
    );
  }

  const sorted = [...messages].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

  const formatTime = (ts) =>
    new Date(ts).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="chat-container business">
      <div className="chat-header">
        <h3>{customerName}</h3>
      </div>

      <div className="message-list" ref={listRef}>
        {sorted.map((m, i) => (
          <div
            key={`${m._id}-${m.tempId}-${i}`}
            className={`message ${
              String(m.fromId || m.from) === String(businessId)
                ? "mine"
                : "theirs"
            } ${m.sending ? "sending" : ""} ${m.failed ? "failed" : ""}`}
          >
            {m.fileUrl ? (
              m.fileType?.startsWith("audio") ? (
                <WhatsAppAudioPlayer src={m.fileUrl} duration={m.fileDuration} />
              ) : m.fileType?.startsWith("image") ? (
                <img src={m.fileUrl} className="msg-image" alt="" />
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
            </div>
          </div>
        ))}

        {isTyping && <div className="typing-indicator">Client is typing...</div>}
      </div>

      <div className="inputBar">
        <textarea
          className="inputField"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            socket.emit("typing", { conversationId, from: businessId });
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              sendMessage();
            }
          }}
        />

        <button
          onClick={sendMessage}
          disabled={sending || !input.trim()}
          className="sendButtonFlat"
        >
          ◀
        </button>
      </div>
    </div>
  );
}
