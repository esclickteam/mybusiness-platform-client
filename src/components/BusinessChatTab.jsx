import React, {
  useEffect,
  useRef,
  useState,
  useReducer
} from "react";
import { v4 as uuidv4 } from "uuid";
import API from "../api"; // axios עם token מוגדר מראש
import { useSocket } from "../context/socketContext";
import "./BusinessChatTab.css";

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

  const [unreadCounts, setUnreadCounts] = useState({});
  const unreadCount = unreadCounts[conversationId] || 0;

  const messagesRef = useRef(messages);
  const listRef = useRef(null);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  // הצטרפות לחדר הגלובלי של העסק
  useEffect(() => {
    if (!socket || !businessId) return;
    console.log("[Socket] מצטרף לחדר הגלובלי של העסק:", businessId);
    socket.emit(
      "joinConversation",
      "business-business",
      businessId,
      true,
      (ack) => {
        if (ack?.ok) {
          console.log("[Socket] הצטרפות לחדר הגלובלי הצליחה");
        } else {
          console.error("[Socket] failed to join global business room:", ack?.error);
        }
      }
    );
  }, [socket, businessId]);

  // מאזין גלובלי להודעות חדשות
  useEffect(() => {
    if (!socket || !businessId) return;

    const handleGlobalNewMessage = (msg) => {
      console.log("[Socket] הודעה גלובלית חדשה התקבלה:", msg);
      if (
        msg.conversationType === "user-business" &&
        String(msg.to || msg.toId) === String(businessId)
      ) {
        if (msg.conversationId !== conversationId) {
          console.log(`[Unread] הודעה מחוץ לשיחה הנוכחית, מעלה מונה עבור שיחה ${msg.conversationId}`);
          setUnreadCounts((prev) => ({
            ...prev,
            [msg.conversationId]: (prev[msg.conversationId] || 0) + 1,
          }));
        } else {
          console.log("[Unread] הודעה בתוך שיחה נוכחית - לא מעלה מונה");
        }
      }
    };

    socket.on("newMessage", handleGlobalNewMessage);
    return () => {
      socket.off("newMessage", handleGlobalNewMessage);
    };
  }, [socket, businessId, conversationId]);

  // איפוס ספירת הודעות שלא נקראו בשיחה הנוכחית
  useEffect(() => {
    if (!conversationId) return;
    console.log("[Unread] איפוס מונה הודעות לשיחה", conversationId);
    setUnreadCounts((prev) => ({
      ...prev,
      [conversationId]: 0,
    }));
  }, [conversationId]);

  // טעינת היסטוריית ההודעות בשיחה
  useEffect(() => {
    if (!conversationId) {
      dispatch({ type: "set", payload: [] });
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        console.log("[API] טוען היסטוריית הודעות לשיחה", conversationId);
        const res = await API.get(`/messages/${conversationId}/history`, {
          params: { page: 0, limit: 50 },
        });
        if (cancelled) return;
        const msgs = res.data.messages.map((m) => ({
          ...m,
          _id: String(m._id),
          tempId: m.tempId || null,
          timestamp: m.createdAt || new Date().toISOString(),
        }));
        console.log("[API] היסטוריית הודעות נטענה, מס'", msgs.length);
        dispatch({ type: "set", payload: msgs });
      } catch (err) {
        console.error("[API] שגיאה בטעינת היסטוריית הודעות:", err);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [conversationId]);

  // מאזינים ספציפיים לשיחה פתוחה (newMessage ו-typing)
  const handleNew = (msg) => {
    if (
      msg.conversationId !== conversationId ||
      msg.conversationType !== conversationType
    )
      return;
    const to = msg.to || msg.toId;
    if (String(to) !== String(businessId)) return;

    const safeMsg = {
      ...msg,
      _id: String(msg._id),
      tempId: msg.tempId || null,
      timestamp: msg.createdAt || new Date().toISOString(),
    };

    console.log("[Socket] הודעה חדשה בשיחה הנוכחית:", safeMsg);
    dispatch({ type: "append", payload: safeMsg });
  };

  const handleTyping = ({ from }) => {
    if (String(from) !== String(customerId)) return;
    setIsTyping(true);
    clearTimeout(handleTyping._t);
    handleTyping._t = setTimeout(() => setIsTyping(false), 1800);
  };

  useEffect(() => {
    if (!socket || !conversationId) return;
    socket.on("newMessage", handleNew);
    socket.on("typing", handleTyping);

    const isBiz = conversationType === "business-business";
    socket.emit(
      "joinConversation",
      conversationType,
      conversationId,
      isBiz,
      (ack) => {
        console.log("[Socket] joinConversation ACK:", ack);
      }
    );
    return () => {
      socket.off("newMessage", handleNew);
      socket.off("typing", handleTyping);
      socket.emit(
        "leaveConversation",
        conversationType,
        conversationId,
        isBiz,
        (ack) => {
          console.log("[Socket] leaveConversation ACK:", ack);
        }
      );
      clearTimeout(handleTyping._t);
    };
  }, [socket, conversationId, conversationType, businessId, customerId]);

  // גלילה אוטומטית לתחתית ההודעות
  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

  const handleInput = (e) => {
    setInput(e.target.value);
    socket?.emit("typing", { conversationId, from: businessId });
  };

  const sendMessage = () => {
    if (sending || !input.trim()) return;
    setSending(true);
    const tempId = uuidv4();
    const text = input.trim();
    console.log("[SendMessage] שולח הודעה עם tempId:", tempId, "טקסט:", text);
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
        if (ack?.ok) {
          console.log("[SendMessage] הודעה נשלחה בהצלחה, tempId:", tempId);
        } else {
          console.error("[SendMessage] הודעה נכשלה, tempId:", tempId, "Error:", ack?.error);
        }
        dispatch({
          type: "updateStatus",
          payload: {
            id: tempId,
            updates: { sending: false, failed: !ack.ok, ...(ack.message || {}) },
          },
        });
      }
    );
  };

  const sorted = [...messages].sort(
    (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
  );

  const formatTime = (ts) => {
    const d = new Date(ts);
    return isNaN(d)
      ? ""
      : d.toLocaleTimeString("he-IL", {
          hour: "2-digit",
          minute: "2-digit",
        });
  };

  return (
    <div className="chat-container business">
      <div className="chat-header">
        <h3>{customerName}</h3>
        {unreadCount > 0 && (
          <div className="unread-badge">{unreadCount}</div>
        )}
      </div>
      <div className="message-list" ref={listRef}>
        {sorted.length === 0 && (
          <div className="empty">עדיין אין הודעות</div>
        )}
        {sorted.map((m, i) => (
          <div
            key={`${m._id}-${m.tempId}-${i}`}
            className={`message${
              String(m.from || m.fromId) === String(businessId)
                ? " mine"
                : " theirs"
            }${m.sending ? " sending" : ""}${m.failed ? " failed" : ""}`}
          >
            {m.fileUrl ? (
              m.fileType?.startsWith("audio") ? (
                <WhatsAppAudioPlayer
                  src={m.fileUrl}
                  duration={m.fileDuration}
                  userAvatar={null}
                />
              ) : m.fileType?.startsWith("image") ? (
                <img
                  src={m.fileUrl}
                  alt={m.fileName}
                  className="msg-image"
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
                <span className="audio-length">{`${String(
                  Math.floor(m.fileDuration / 60)
                ).padStart(2, "0")}:${String(
                  Math.floor(m.fileDuration % 60)
                ).padStart(2, "0")}`}</span>
              )}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="typing-indicator">הלקוח מקליד…</div>
        )}
      </div>
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
          disabled={sending || !input.trim()}
          className="sendButtonFlat"
        >
          ◀
        </button>
      </div>
    </div>
  );
}
