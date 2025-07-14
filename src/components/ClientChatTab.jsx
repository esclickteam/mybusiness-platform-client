import React, { useState, useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import "./ClientChatTab.css";

function WhatsAppAudioPlayer({ src, userAvatar, duration }) {
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

// פונקציה לסינון כפילויות הודעות
function filterUniqueMessages(msgs) {
  const unique = [];
  return msgs.filter((msg) => {
    const exists = unique.some(
      (m) =>
        (m._id && (m._id === msg._id || m._id === msg.tempId)) ||
        (m.tempId && (m.tempId === msg._id || m.tempId === msg.tempId))
    );
    if (!exists) unique.push(msg);
    return !exists;
  });
}

// מוסיף role = "client" או "business" עם לוג
const addRole = (msg, userId) => {
  const fromIdDirect = msg.fromId;
  const fromField = msg.from;
  const fromId =
    fromIdDirect ||
    (typeof fromField === "object" ? fromField._id || fromField.id : fromField);

  const role = String(fromId) === String(userId) ? "client" : "business";

  console.log("Message fromId:", fromId, "userId:", userId, "assigned role:", role);
  
  msg.role = role;
  return msg;
};


const getMessageKey = (m) => {
  if (m.recommendationId) return `rec_${m.recommendationId}`;
  if (m._id) return `msg_${m._id}`;
  if (m.tempId) return `temp_${m.tempId}`;
  if (!m.__uniqueKey) m.__uniqueKey = uuidv4();
  return `uniq_${m.__uniqueKey}`;
};

function normalizeMessageFileFields(message) {
  if (message.file) {
    if (!message.fileUrl) message.fileUrl = message.file.url || "";
    if (!message.fileName) message.fileName = message.file.name || "";
    if (!message.fileType) message.fileType = message.file.type || "";
    if (!message.fileDuration) message.fileDuration = message.file.duration || 0;
  } else {
    if (!message.fileUrl && message.url) message.fileUrl = message.url;
    if (!message.fileName && message.originalName) message.fileName = message.originalName;
    if (!message.fileType && message.mimeType) message.fileType = message.mimeType;
  }
  return message;
}

export default function ClientChatTab({
  socket,
  conversationId,
  setConversationId,
  businessId,
  userId,
  messages,
  setMessages,
  userRole,
  conversationType = "user-business",
}) {
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const messageListRef = useRef(null);
  const textareaRef = useRef(null);

  // עדכון ref עם המערך ההכי עדכני
  const messagesRef = useRef(messages);
  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  // הצטרפות וטעינת היסטוריה
  useEffect(() => {
    if (!socket || !conversationId) {
      setLoading(false);
      setMessages([]);
      return;
    }

    setLoading(true);
    setError("");

    socket.emit(
      "joinConversation",
      conversationId,
      conversationType === "business-business",
      (ack) => {
        if (!ack.ok) {
          setError("כשל בהצטרפות לשיחה: " + (ack.error || ""));
          setLoading(false);
          return;
        }

        socket.emit(
          "getHistory",
          { conversationId, limit: 50, conversationType },
          (response) => {
            if (response.ok) {
              const normalizedMessages = filterUniqueMessages(
                (Array.isArray(response.messages) ? response.messages : [])
                  .map(normalizeMessageFileFields)
                  .map((m) => addRole(m, userId))
              );
              setMessages(normalizedMessages);
              setError("");
            } else {
              setError("שגיאה בטעינת ההיסטוריה: " + (response.error || ""));
              setMessages([]);
            }
            setLoading(false);
          }
        );
      }
    );

    return () => {
      if (conversationId) {
        socket.emit(
          "leaveConversation",
          conversationId,
          conversationType === "business-business"
        );
      }
    };
  }, [socket, conversationId, conversationType, setMessages, userId]);

  // קבלת הודעות נכנסות
  useEffect(() => {
    if (!socket || !conversationId) return;

    const handleIncomingMessage = (msg) => {
      if (msg.isRecommendation && msg.status === "pending") return;

      msg = addRole(normalizeMessageFileFields(msg), userId);

      setMessages((prev) => {
        const idx = prev.findIndex(
          (m) =>
            (m._id && msg._id && m._id === msg._id) ||
            (m.tempId && msg.tempId && m.tempId === msg.tempId)
        );
        if (idx !== -1) {
          const copy = [...prev];
          copy[idx] = { ...copy[idx], ...msg };
          return copy;
        }
        return [...prev, msg];
      });
    };

    const handleMessageApproved = (msg) => {
      if (msg.conversationId !== conversationId) return;
      msg = addRole(normalizeMessageFileFields(msg), userId);

      setMessages((prev) => {
        const idx = prev.findIndex(
          (m) =>
            m._id === msg._id ||
            (m.tempId && msg.tempId && m.tempId === msg.tempId) ||
            (m.isRecommendation &&
              msg.recommendationId &&
              m.recommendationId === msg.recommendationId)
        );
        if (idx !== -1) {
          const copy = [...prev];
          copy[idx] = { ...copy[idx], ...msg, status: "approved" };
          return copy;
        }
        return [...prev, msg];
      });
    };

    socket.on("newMessage", handleIncomingMessage);
    socket.on("messageApproved", handleMessageApproved);

    // join בלי סינון — מקבל את כל ההודעות
    socket.emit(
      "joinConversation",
      conversationId,
      conversationType === "business-business"
    );

    return () => {
      socket.off("newMessage", handleIncomingMessage);
      socket.off("messageApproved", handleMessageApproved);
      socket.emit(
        "leaveConversation",
        conversationId,
        conversationType === "business-business"
      );
    };
  }, [socket, conversationId, setMessages, conversationType, userId]);

  // גלילה אוטומטית לתחתית
  useEffect(() => {
    if (!messageListRef.current) return;
    const el = messageListRef.current;
    const isNearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 100;
    if (isNearBottom) el.scrollTop = el.scrollHeight;
  }, [messages]);

  // שינוי גובה של הטקסטאריאה
  const resizeTextarea = () => {
    if (!textareaRef.current) return;
    textareaRef.current.style.height = "auto";
    textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
  };

  const sendMessage = () => {
    if (!businessId) {
      setError("businessId לא מוגדר, לא ניתן לשלוח הודעה");
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
            setConversationId(ack.conversationId);
            setMessages([addRole(normalizeMessageFileFields(ack.message), userId)]);
            setInput("");
            socket.emit(
              "joinConversation",
              ack.conversationId,
              conversationType === "business-business"
            );
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
        role: "client",
        content: input.trim(),
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, optimisticMsg]);
      setInput("");

      socket.emit(
        "sendMessage",
        {
          conversationId,
          from: userId,
          to: businessId,
          role: "client",
          text: optimisticMsg.content,
          tempId,
          conversationType,
        },
        (ack) => {
          setSending(false);
          if (ack.ok && ack.message) {
            setMessages((prev) =>
              prev.map((msg) =>
                msg.tempId === tempId
                  ? addRole(normalizeMessageFileFields(ack.message), userId)
                  : msg
              )
            );
          } else {
            setError("שגיאה בשליחת ההודעה: " + (ack.error || "לא ידוע"));
            setMessages((prev) => prev.filter((msg) => msg.tempId !== tempId));
          }
        }
      );
    }
  };

  const sortedMessages = [...messages].sort(
    (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
  );

  return (
    <div className="chat-container client">
      <div className="message-list" ref={messageListRef}>
        {loading && <div className="loading">טוען...</div>}
        {!loading && messages.length === 0 && <div className="empty">עדיין אין הודעות</div>}
        {sortedMessages.map((m) => {
          const key = getMessageKey(m);
          if (!key) return null;

          return (
            <div
              key={key}
              className={`message${m.role === "client" ? " mine" : " theirs"}${m.isRecommendation ? " ai-recommendation" : ""}`}
            >
              {m.image ? (
                <img
                  src={m.image}
                  alt={m.fileName || "image"}
                  style={{ maxWidth: 200, borderRadius: 8 }}
                />
              ) : m.fileUrl ? (
                /\.(jpe?g|png|gif|bmp|webp|svg)$/i.test(m.fileUrl) ? (
                  <img
                    src={m.fileUrl}
                    alt={m.fileName || "image"}
                    style={{ maxWidth: 200, borderRadius: 8 }}
                  />
                ) : m.fileType?.startsWith("audio") ? (
                  <WhatsAppAudioPlayer
                    src={m.fileUrl}
                    userAvatar={m.userAvatar}
                    duration={m.fileDuration}
                  />
                ) : (
                  <a href={m.fileUrl} target="_blank" rel="noopener noreferrer" download>
                    {m.fileName || "קובץ להורדה"}
                  </a>
                )
              ) : (
                <div className="text">{m.isEdited && m.editedText ? m.editedText : m.content || m.text}</div>
              )}
              <div className="meta">
                <span className="time">
                  {new Date(m.createdAt).toLocaleTimeString("he-IL", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="inputBar">
        {error && <div className="error-alert">⚠ {error}</div>}

        <textarea
          ref={textareaRef}
          className="inputField"
          placeholder="הקלד הודעה..."
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            resizeTextarea();
          }}
          onKeyDown={(e) =>
            e.key === "Enter" && !e.shiftKey && (e.preventDefault(), sendMessage())
          }
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
