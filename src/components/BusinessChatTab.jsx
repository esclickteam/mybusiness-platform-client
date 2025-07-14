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

// נגן אודיו, כמו בקוד שלך (ללא שינוי)

function WhatsAppAudioPlayer({ src, userAvatar, duration = 0 }) {
  // ... (כמו בקוד שלך)
}

// Reducer להודעות (כמו בקוד שלך)
function messagesReducer(state, action) {
  switch (action.type) {
    case "set": { /* ... */ }
    case "append": { /* ... */ }
    case "updateStatus": { /* ... */ }
    default: return state;
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

  // ספירת הודעות לא נקראו לכל שיחה (object, לפי conversationId)
  const [unreadCounts, setUnreadCounts] = useState({});
  // ספירת הודעות לא נקראו לשיחה הנוכחית בלבד
  const unreadCount = unreadCounts[conversationId] || 0;

  const messagesRef = useRef(messages);
  const listRef = useRef(null);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  // 🚩 1. התחברות לחדר גלובלי של העסק לקבלת כל ההתראות
  useEffect(() => {
    if (!socket || !businessId) return;
    socket.emit(
      "joinConversation",
      "business-business",
      businessId,
      true,
      (ack) => {
        if (!ack?.ok) {
          console.error("חיבור לחדר הגלובלי נכשל:", ack?.error);
        }
      }
    );
    // אין צורך ב-off - לא עוזבים את החדר הגלובלי אף פעם
  }, [socket, businessId]);

  // 🚩 2. מאזין גלובלי ל־newMessage עבור כל השיחות של העסק
  useEffect(() => {
    if (!socket || !businessId) return;

    // מגדיל את מונה ההודעות הלא נקראו לכל שיחה
    const handleGlobalNewMessage = (msg) => {
      if (
        msg.conversationType === "user-business" &&
        String(msg.to || msg.toId) === String(businessId)
      ) {
        // אם זו לא השיחה הנוכחית – העלה מונה
        if (msg.conversationId !== conversationId) {
          setUnreadCounts((prev) => ({
            ...prev,
            [msg.conversationId]: (prev[msg.conversationId] || 0) + 1
          }));
        }
      }
    };

    socket.on("newMessage", handleGlobalNewMessage);
    return () => {
      socket.off("newMessage", handleGlobalNewMessage);
    };
  }, [socket, businessId, conversationId]);

  // 🚩 3. איפוס ספירת הודעות לא נקראו כאשר נכנסים לשיחה
  useEffect(() => {
    setUnreadCounts((prev) => ({
      ...prev,
      [conversationId]: 0
    }));
  }, [conversationId]);

  // 🚩 4. טען היסטוריית הודעות בשיחה הנבחרת
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
        const msgs = res.data.messages.map((m) => ({
          ...m,
          _id: String(m._id),
          tempId: m.tempId || null,
          timestamp: m.createdAt || new Date().toISOString(),
        }));
        dispatch({ type: "set", payload: msgs });
      } catch (err) {
        console.error(err);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [conversationId]);

  // 🚩 5. מאזינים לאירועים ספציפיים לשיחה פתוחה (כולל newMessage, typing)
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
        // console.log("joinConversation ACK:", ack);
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
          // console.log("leaveConversation ACK:", ack);
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

  // ניהול שדה הקלט ושליחת הודעה
  const handleInput = (e) => {
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
            updates: { sending: false, failed: !ack.ok, ...(ack.message || {}) },
          },
        });
      }
    );
  };

  // רינדור ההודעות והרכיב
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

  // --- UI ראשי ---
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
