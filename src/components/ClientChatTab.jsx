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

const getMessageKey = (m) => {
  if (m.recommendationId) return `rec_${m.recommendationId}`;
  if (m._id) return `msg_${m._id}`;
  if (m.tempId) return `temp_${m.tempId}`;
  if (!m.__uniqueKey) {
    m.__uniqueKey = uuidv4();
  }
  return `uniq_${m.__uniqueKey}`;
};

function normalizeMessageFileFields(message) {
  if (message.file) {
    if (!message.fileUrl) message.fileUrl = message.file.url || "";
    if (!message.fileName) message.fileName = message.file.name || "";
    if (!message.fileType) message.fileType = message.file.type || "";
    if (!message.fileDuration) message.fileDuration = message.file.duration || 0;
  } else {
    if (!message.fileUrl && message.url) {
      message.fileUrl = message.url;
    }
    if (!message.fileName && message.originalName) {
      message.fileName = message.originalName;
    }
    if (!message.fileType && message.mimeType) {
      message.fileType = message.mimeType;
    }
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

  const messagesRef = useRef(messages);
  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

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
          { conversationId, limit: 50, conversationType, businessId },
          (response) => {
            if (response.ok) {
              const normalizedMessages = (Array.isArray(response.messages)
                ? response.messages
                : []
              ).map(normalizeMessageFileFields);
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
        socket.emit("leaveConversation", conversationId, conversationType === "business-business");
      }
    };
  }, [socket, conversationId, conversationType, setMessages, businessId]);

  useEffect(() => {
    if (!socket || !conversationId) return;

    const handleIncomingMessage = (msg) => {
      if (msg.isRecommendation && msg.status === "pending") return;

      msg = normalizeMessageFileFields(msg);

      setMessages((prev) => {
        const idx = prev.findIndex(
          (m) =>
            (m._id && msg._id && m._id === msg._id) ||
            (m.tempId && msg.tempId && m.tempId === msg.tempId)
        );
        if (idx !== -1) {
          const newMessages = [...prev];
          newMessages[idx] = { ...newMessages[idx], ...msg };
          return newMessages;
        }
        return [...prev, msg];
      });
    };

    const handleMessageApproved = (msg) => {
      if (msg.conversationId !== conversationId) return;

      msg = normalizeMessageFileFields(msg);

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
          const newMessages = [...prev];
          newMessages[idx] = { ...newMessages[idx], ...msg, status: "approved" };
          return newMessages;
        }
        return [...prev, msg];
      });
    };

    socket.on("newMessage", handleIncomingMessage);
    socket.on("messageApproved", handleMessageApproved);

    socket.emit("joinConversation", conversationId, conversationType === "business-business");

    return () => {
      socket.off("newMessage", handleIncomingMessage);
      socket.off("messageApproved", handleMessageApproved);
      socket.emit("leaveConversation", conversationId, conversationType === "business-business");
    };
  }, [socket, conversationId, setMessages, conversationType]);

  useEffect(() => {
    if (!messageListRef.current) return;
    const el = messageListRef.current;
    const isNearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 100;
    if (isNearBottom) {
      el.scrollTop = el.scrollHeight;
    }
  }, [messages]);

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

    if (!input.trim() || sending || !socket) return;
    if (!socket.connected) {
      setError("Socket אינו מחובר, נסה להתחבר מחדש");
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
          if (ack?.ok && ack.conversationId && ack.message) {
            setConversationId(ack.conversationId);
            setMessages([normalizeMessageFileFields(ack.message)]);
            setInput("");
            socket.emit("joinConversation", ack.conversationId, conversationType === "business-business");
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
        text: input.trim(),
        timestamp: new Date(),
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
          text: optimisticMsg.text,
          tempId,
          conversationType,
        },
        (ack) => {
          setSending(false);
          if (ack?.ok) {
            setMessages((prev) =>
              prev.map((msg) =>
                msg.tempId === tempId && ack.message ? normalizeMessageFileFields(ack.message) : msg
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

  // מיון ההודעות לפי תאריך יצירה לפני הצגה
  const sortedMessages = [...messages].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

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
              className={`message${m.role === "client" ? " mine" : " theirs"}${
                m.isRecommendation ? " ai-recommendation" : ""
              }`}
            >
              {m.image ? (
                <img
                  src={m.image}
                  alt={m.fileName || "image"}
                  style={{ maxWidth: 200, borderRadius: 8 }}
                />
              ) : m.fileUrl ? (
                m.fileType && m.fileType.startsWith("audio") ? (
                  <WhatsAppAudioPlayer
                    src={m.fileUrl}
                    userAvatar={m.userAvatar}
                    duration={m.fileDuration}
                  />
                ) : /\.(jpe?g|png|gif|bmp|webp|svg)$/i.test(m.fileUrl) ? (
                  <img
                    src={m.fileUrl}
                    alt={m.fileName || "image"}
                    style={{ maxWidth: 200, borderRadius: 8 }}
                  />
                ) : (
                  <a
                    href={m.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    download
                  >
                    {m.fileName || "קובץ להורדה"}
                  </a>
                )
              ) : (
                <div className="text">{m.isEdited && m.editedText ? m.editedText : (m.content || m.text)}</div>
              )}
              {m.isEdited && userRole === "business" && (
                <div className="edited-label" style={{ fontSize: "0.8em", color: "#888" }}>
                  (נערך)
                </div>
              )}
              <div className="meta">
                <span className="time">
                  {(() => {
                    const date = new Date(m.createdAt);
                    if (isNaN(date)) return "";
                    return date.toLocaleTimeString("he-IL", {
                      hour: "2-digit",
                      minute: "2-digit",
                    });
                  })()}
                </span>
                {/* הסרנו את הצגת זמן האודיו */}
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
