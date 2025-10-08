```javascript
import React, {
  useEffect,
  useRef,
  useState,
  useReducer,
} from "react";
import { v4 as uuidv4 } from "uuid";
import API from "../api"; // axios with predefined token
import { useSocket } from "../context/socketContext";
import { useNotifications } from "../context/NotificationsContext"; // import the notifications context
import "./BusinessChatTab.css";

// Helper to normalize messages
function normalize(msg) {
  return {
    ...msg,
    _id: String(msg._id),
    tempId: msg.tempId || null,
    timestamp: msg.createdAt || new Date().toISOString(),
  };
}

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
    if (playing) audio.pause();
    else audio.play();
    setPlaying(p => !p);
  };

  const formatTime = t =>
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

function messagesReducer(state, action) {
  switch (action.type) {
    case "set": {
      const unique = [];
      action.payload.forEach(msg => {
        if (
          !unique.some(
            m =>
              (m._id && (m._id === msg._id || m._id === msg.tempId)) ||
              (m.tempId && (m.tempId === msg._id || m.tempId === msg.tempId))
          )
        ) {
          unique.push(msg);
        }
      });
      return unique;
    }
    case "append": {
      const idx = state.findIndex(
        m =>
          (m._id && (m._id === action.payload._id || m._id === action.payload.tempId)) ||
          (m.tempId && (m.tempId === action.payload._id || m.tempId === action.payload.tempId))
      );
      if (idx !== -1) {
        const next = [...state];
        next[idx] = { ...next[idx], ...action.payload };
        return next;
      }
      return [...state, action.payload];
    }
    case "updateStatus": {
      return state.map(m =>
        m._id === action.payload.id || m.tempId === action.payload.id
          ? { ...m, ...action.payload.updates }
          : m
      );
    }
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
  const { addNotification } = useNotifications(); // using the notifications context

  const [messages, dispatch] = useReducer(messagesReducer, []);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [firstMessageAlert, setFirstMessageAlert] = useState(null);

  const [unreadCounts, setUnreadCounts] = useState({});
  const unreadCount = unreadCounts[conversationId] || 0;

  const messagesRef = useRef(messages);
  const listRef = useRef(null);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  const openConversation = async id => {
    try {
      const res = await API.post(`/api/conversations/${id}/mark-read`);
      if (res.data.unreadCount !== undefined) {
        setUnreadCounts(prev => ({ ...prev, [id]: 0 }));
      }
    } catch (err) {
      console.error("Failed to mark messages read", err);
    }
  };

  useEffect(() => {
    if (!socket || !businessId) return;
    socket.emit("joinBusinessRoom", businessId);
  }, [socket, businessId]);

  useEffect(() => {
    if (!conversationId) {
      dispatch({ type: "set", payload: [] });
      return;
    }
    openConversation(conversationId);
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

  useEffect(() => {
    if (!socket || !businessId) return;

    const handleMessage = msg => {
      const safeMsg = normalize(msg);
      const convId = msg.conversationId;

      if (convId === conversationId) {
        dispatch({ type: "append", payload: safeMsg });
      } else {
        dispatch({ type: "append", payload: safeMsg });
        setUnreadCounts(prev => {
          const prevCount = prev[convId] || 0;
          const newCount = prevCount + 1;
          if (prevCount === 0) {
            setFirstMessageAlert({
              conversationId: convId,
              text: msg.text,
              timestamp: msg.timestamp,
            });
          }
          return { ...prev, [convId]: newCount };
        });
      }
    };

    const handleFirstClientMessage = ({ conversationId: convId, text, timestamp }) => {
      setFirstMessageAlert({ conversationId: convId, text, timestamp });
      setUnreadCounts(prev => ({ ...prev, [convId]: (prev[convId] || 0) + 1 }));
    };

    const handleTyping = ({ from }) => {
      if (String(from) !== String(customerId)) return;
      setIsTyping(true);
      clearTimeout(handleTyping._t);
      handleTyping._t = setTimeout(() => setIsTyping(false), 1800);
    };

    const handleNewNotification = notification => {
      addNotification(notification); // update through Context instead of local state
      console.log("New notification received:", notification);
    };

    const handleConnect = () => {
      const isBizConv = conversationType === "business-business";
      socket.emit("joinConversation", "user-business", businessId, false);
      socket.emit("joinConversation", conversationType, conversationId, isBizConv);
    };

    socket.on("connect", handleConnect);
    socket.on("firstClientMessage", handleFirstClientMessage);
    socket.on("newMessage", handleMessage);
    socket.on("typing", handleTyping);
    socket.on("newNotification", handleNewNotification);
    socket.on("newRecommendationNotification", handleNewNotification);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("firstClientMessage", handleFirstClientMessage);
      socket.off("newMessage", handleMessage);
      socket.off("typing", handleTyping);
      socket.off("newNotification", handleNewNotification);
      socket.off("newRecommendationNotification", handleNewNotification);
      clearTimeout(handleTyping._t);
      socket.emit("leaveConversation", "user-business", businessId);
      socket.emit("leaveConversation", conversationType, conversationId, conversationType === "business-business");
    };
  }, [socket, businessId, conversationId, conversationType, customerId, addNotification]);

  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

  const handleInput = e => {
    setInput(e.target.value);
    socket?.emit("typing", { conversationId, from: businessId });
  };

  const sendMessage = () => {
    if (sending || !input.trim()) return;
    setSending(true);
    const tempId = uuidv4();
    const text = input.trim();

    dispatch({
      type: "append",
      payload: { _id: tempId, tempId, conversationId, from: businessId, to: customerId, text, timestamp: new Date().toISOString(), sending: true },
    });
    setInput("");

    socket.emit("sendMessage", { conversationId, from: businessId, to: customerId, text, tempId }, ack => {
      setSending(false);
      dispatch({
        type: "updateStatus",
        payload: { id: tempId, updates: { sending: false, failed: !ack.ok, ...(ack.message || {}) } },
      });
      if (!ack.ok) console.error("[SendMessage] failed", ack.error);
    });
  };

  const sorted = [...messages].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

  const formatTime = ts => {
    const d = new Date(ts);
    return isNaN(d) ? "" : d.toLocaleTimeString("he-IL", { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="chat-container business">
      <div className="chat-header">
        <h3>{customerName}</h3>
        {unreadCount > 0 && <div className="unread-badge">{unreadCount}</div>}
      </div>
      <div className="message-list" ref={listRef}>
        {sorted.length === 0 && <div className="empty">No messages yet</div>}
        {sorted.map((m, i) => (
          <div
            key={`${m._id}-${m.tempId}-${i}`}
            className={`message${String(m.from) === String(businessId) ? " mine" : " theirs"}${m.sending ? " sending" : ""}${m.failed ? " failed" : ""}`}
          >
            {m.fileUrl ? (
              m.fileType?.startsWith("audio") ? (
                <WhatsAppAudioPlayer src={m.fileUrl} duration={m.fileDuration} userAvatar={null} />
              ) : m.fileType?.startsWith("image") ? (
                <img src={m.fileUrl} alt={m.fileName} className="msg-image" />
              ) : (
                <a href={m.fileUrl} download>{m.fileName}</a>
              )
            ) : (
              <div className="text">{m.text}</div>
            )}
            <div className="meta">
              <span className="time">{formatTime(m.timestamp)}</span>
              {m.fileDuration > 0 && (
                <span className="audio-length">{`${String(Math.floor(m.fileDuration / 60)).padStart(2, "0")} : ${String(Math.floor(m.fileDuration % 60)).padStart(2, "0")}`}</span>
              )}
            </div>
          </div>
        ))}
        {isTyping && <div className="typing-indicator">The customer is typing…</div>}
      </div>
      {firstMessageAlert && (
        <div className="first-message-alert">
          New first message: "{firstMessageAlert.text}"
          <button onClick={() => setFirstMessageAlert(null)}>×</button>
        </div>
      )}

      <div className="inputBar">
        <textarea
          className="inputField"
          placeholder="Type a message..."
          value={input}
          onChange={handleInput}
          onKeyDown={e => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              sendMessage();
            }
          }}
          rows={1}
          disabled={sending}
        />
        <button onClick={sendMessage} disabled={sending || !input.trim()} className="sendButtonFlat">
          ◀
        </button>
      </div>
    </div>
  );
}
```