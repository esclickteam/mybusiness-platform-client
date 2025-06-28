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

async function uploadFileToServer(file, conversationId, businessId, toId, message) {
  const formData = new FormData();
  formData.append("file", file);

  if (conversationId) formData.append("conversationId", conversationId);
  if (businessId) formData.append("businessId", businessId);
  if (toId) formData.append("toId", toId);
  formData.append("message", message || "");  // חובה לשים message (אפשר גם מחרוזת ריקה)
  
  const token = localStorage.getItem("token");

  const response = await fetch("/api/business/my/chat", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
    credentials: "include",
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error || "Upload failed");
  }

  const data = await response.json();
  return data.newMessage?.fileUrl || data.fileUrl || "";
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
  const [recording, setRecording] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState(null);
  const [timer, setTimer] = useState(0);

  const messageListRef = useRef(null);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);
  const timerRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const recordedChunksRef = useRef([]);
  const mediaStreamRef = useRef(null);

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
              setMessages(Array.isArray(response.messages) ? response.messages : []);
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

      const id = msg.isRecommendation
        ? `rec_${msg.recommendationId}`
        : msg._id
        ? `msg_${msg._id}`
        : msg.tempId
        ? `temp_${msg.tempId}`
        : null;

      const existsIdx = messagesRef.current.findIndex((m) => {
        const mid = m.isRecommendation
          ? `rec_${m.recommendationId}`
          : m._id
          ? `msg_${m._id}`
          : m.tempId
          ? `temp_${m.tempId}`
          : null;

        if (m.tempId && msg._id && m.tempId === msg.tempId) return true;
        return mid === id;
      });

      if (existsIdx !== -1) {
        setMessages((prev) => {
          const newMessages = [...prev];
          newMessages[existsIdx] = { ...newMessages[existsIdx], ...msg };
          return newMessages;
        });
        return;
      }

      setMessages((prev) => [...prev, msg]);
    };

    const handleMessageApproved = (msg) => {
      if (msg.conversationId !== conversationId) return;

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

  const handleAttach = () => {
    if (fileInputRef.current) fileInputRef.current.click();
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
            setMessages([ack.message]);
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
              prev.map((msg) => (msg.tempId === tempId && ack.message ? ack.message : msg))
            );
          } else {
            setError("שגיאה בשליחת ההודעה: " + (ack.error || "לא ידוע"));
            setMessages((prev) => prev.filter((msg) => msg.tempId !== tempId));
          }
        }
      );
    }
  };

  const getSupportedMimeType = () =>
    MediaRecorder.isTypeSupported("audio/webm") ? "audio/webm" : "audio/webm";

  const handleRecordStart = async () => {
    if (recording) return;
    recordedChunksRef.current = [];
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;
      const mimeType = getSupportedMimeType();
      const recorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) recordedChunksRef.current.push(e.data);
      };
      recorder.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, { type: mimeType });
        setRecordedBlob(blob);
        clearInterval(timerRef.current);
        setRecording(false);
      };

      recorder.start();
      setRecording(true);
      setTimer(0);
      timerRef.current = setInterval(() => setTimer((t) => t + 1), 1000);
    } catch {
      setError("אין הרשאה להקלטה");
    }
  };

  const handleRecordStop = () => {
    if (!recording || !mediaRecorderRef.current) return;
    mediaRecorderRef.current.stop();
  };

  const handleSendRecording = async () => {
    if (!recordedBlob) return;
    setSending(true);
    setError("");
    const tempId = uuidv4();

    try {
      const file = new File([recordedBlob], `recording_${Date.now()}.webm`, { type: recordedBlob.type });
      const uploadedUrl = await uploadFileToServer(file, conversationId, businessId, userId, input.trim());


      socket.emit(
        "sendMessage",
        {
          conversationId,
          from: userId,
          role: "client",
          fileUrl: uploadedUrl,
          fileName: file.name,
          fileType: file.type,
          fileDuration: timer,
          tempId,
          conversationType,
        },
        (ack) => {
          setSending(false);
          setRecordedBlob(null);
          setTimer(0);
          if (!ack.ok) setError("שגיאה בשליחת ההקלטה");
        }
      );
    } catch (error) {
      setSending(false);
      setError("שגיאה בהעלאת ההקלטה: " + error.message);
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSending(true);
    setError("");

    const tempId = uuidv4();
    const optimisticMsg = {
      _id: tempId,
      tempId,
      conversationId,
      from: userId,
      role: "client",
      fileName: file.name,
      fileType: file.type,
      fileUrl: URL.createObjectURL(file),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, optimisticMsg]);

    try {
      const uploadedUrl = await uploadFileToServer(file, conversationId, businessId, userId);

      socket.emit(
        "sendMessage",
        {
          conversationId,
          from: userId,
          role: "client",
          fileUrl: uploadedUrl,
          fileName: file.name,
          fileType: file.type,
          tempId,
          conversationType,
        },
        (ack) => {
          setSending(false);
          if (ack.ok && ack.message) {
            setMessages((prev) =>
              prev.map((msg) => (msg.tempId === tempId ? ack.message : msg))
            );
          } else {
            setError("שגיאה בשליחת הקובץ");
            setMessages((prev) => prev.filter((msg) => msg.tempId !== tempId));
          }
        }
      );
    } catch (error) {
      setSending(false);
      setError("שגיאה בהעלאת הקובץ: " + error.message);
      setMessages((prev) => prev.filter((msg) => msg.tempId !== tempId));
    }

    e.target.value = null;
  };

  return (
    <div className="chat-container client">
      <div className="message-list" ref={messageListRef}>
        {loading && <div className="loading">טוען...</div>}
        {!loading && messages.length === 0 && <div className="empty">עדיין אין הודעות</div>}
        {messages.map((m) => {
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
                {m.fileDuration && (
                  <span className="audio-length">
                    {String(Math.floor(m.fileDuration / 60)).padStart(2, "0")}:
                    {String(Math.floor(m.fileDuration % 60)).padStart(2, "0")}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="inputBar">
        {error && <div className="error-alert">⚠ {error}</div>}

        {(recording || recordedBlob) ? (
          <div className="audio-preview-row">
            {recording ? (
              <>
                <button className="recordBtn recording" onClick={handleRecordStop} type="button">
                  ⏹️
                </button>
                <span className="preview-timer">
                  {String(Math.floor(timer / 60)).padStart(2, "0")}:
                  {String(timer % 60).padStart(2, "0")}
                </span>
                <button
                  className="preview-btn trash"
                  onClick={() => {
                    setRecording(false);
                    setRecordedBlob(null);
                    setTimer(0);
                  }}
                  type="button"
                >
                  🗑️
                </button>
              </>
            ) : (
              <>
                <audio src={URL.createObjectURL(recordedBlob)} controls style={{ height: 30 }} />
                <div>
                  משך הקלטה:{" "}
                  {String(Math.floor(timer / 60)).padStart(2, "0")}:
                  {String(timer % 60).padStart(2, "0")}
                </div>
                <button className="send-btn" onClick={handleSendRecording} disabled={sending}>
                  שלח
                </button>
              </>
            )}
          </div>
        ) : (
          <>
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
            <div className="inputBar-right">
              <button className="attachBtn" onClick={handleAttach} disabled={sending} type="button">
                📎
              </button>
              <button
                className={`recordBtn${recording ? " recording" : ""}`}
                onClick={handleRecordStart}
                disabled={sending}
                type="button"
              >
                🎤
              </button>
              <input
                type="file"
                ref={fileInputRef}
                className="fileInput"
                onChange={handleFileChange}
                disabled={sending}
                style={{ display: "none" }}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
