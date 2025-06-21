import React, { useEffect, useRef, useState, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import "./BusinessChatTab.css";

function WhatsAppAudioPlayer({ src, userAvatar, duration }) {
  // ... (השארתי את הרכיב הזה ללא שינוי)
}

export default function BusinessChatTab({
  conversationId,
  businessId,
  customerId,
  businessName,
  socket,
  messages,
  setMessages,
}) {
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [loading, setLoading] = useState(true);
  const [recording, setRecording] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState(null);
  const [timer, setTimer] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const messageListRef = useRef(null);
  const typingTimeout = useRef(null);
  const fileInputRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const recordedChunks = useRef([]);
  const timerRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const currentRoomRef = useRef(null);

  const PAGE_SIZE = 20;

  const loadMessages = useCallback(
  async (beforeTimestamp) => {
    if (!conversationId || loadingMore || !hasMore) return;
    setLoadingMore(true);

    const el = messageListRef.current;
    const prevScrollHeight = el ? el.scrollHeight : 0;

    try {
      const token = localStorage.getItem("token");
      const params = new URLSearchParams({ limit: PAGE_SIZE.toString() });
if (beforeTimestamp) params.append("before", beforeTimestamp);
params.append("conversationId", conversationId);

const res = await fetch(`/api/conversations/history?${params.toString()}`, {
  headers: { Authorization: `Bearer ${token}` },
});
      if (!res.ok) throw new Error("Failed to load messages");
      const data = await res.json();

      if (data.length < PAGE_SIZE) setHasMore(false);

      setMessages((prev) => [...data, ...prev]);

      // שמירת מיקום גלילה למנוע קפיצה
      setTimeout(() => {
        if (el) {
          const newScrollHeight = el.scrollHeight;
          el.scrollTop = newScrollHeight - prevScrollHeight + el.scrollTop;
        }
      }, 0);
    } catch (e) {
      console.error("Load messages error:", e);
    } finally {
      setLoadingMore(false);
    }
  },
  [conversationId, hasMore, loadingMore, setMessages]
);


  useEffect(() => {
    if (!socket || !conversationId) return;

    if (currentRoomRef.current === conversationId) return;
    if (currentRoomRef.current) socket.emit("leaveConversation", currentRoomRef.current);
    currentRoomRef.current = conversationId;

    setMessages([]);
    setHasMore(true);
    setLoading(true);

    socket.emit("joinConversation", conversationId, (res) => {
      const history = Array.isArray(res?.messages) ? res.messages : [];
      setMessages(history);
      setLoading(false);
      if (!history.length) loadMessages();
    });

    socket.on("newMessage", handleNewMessage);
    socket.on("typing", handleTyping);
    socket.on("reconnect", handleReconnect);

    return () => {
      socket.off("newMessage", handleNewMessage);
      socket.off("typing", handleTyping);
      socket.off("reconnect", handleReconnect);
      clearTimeout(typingTimeout.current);
      if (timerRef.current) clearInterval(timerRef.current);
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((t) => t.stop());
        mediaStreamRef.current = null;
      }
      if (currentRoomRef.current === conversationId) {
        socket.emit("leaveConversation", conversationId);
        currentRoomRef.current = null;
      }
    };
  }, [socket, conversationId, loadMessages]);

  // גלילה חכמה למטה
  useEffect(() => {
    if (!messageListRef.current) return;
    const el = messageListRef.current;
    const isNearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 150;
    if (isNearBottom) el.scrollTop = el.scrollHeight;
  }, [messages, isTyping]);

  // מאזין לגלילה למעלה לטעינת הודעות נוספות עם שמירת מיקום גלילה
  useEffect(() => {
    const el = messageListRef.current;
    if (!el) return;
    const onScroll = () => {
      if (el.scrollTop < 100 && hasMore && !loadingMore) {
        const oldestMsg = messages[0];
        if (oldestMsg?.timestamp) {
          loadMessages(oldestMsg.timestamp);
        }
      }
    };
    el.addEventListener("scroll", onScroll);
    return () => el.removeEventListener("scroll", onScroll);
  }, [messages, hasMore, loadingMore, loadMessages]);

  // --- Handlers ---

  const handleNewMessage = useCallback(
    (msg) => {
      if (msg.conversationId === conversationId) {
        setMessages((prev) => {
          if (msg.tempId && prev.some((m) => m.tempId === msg.tempId)) {
            return prev.map((m) =>
              m.tempId === msg.tempId ? { ...msg, sending: false } : m
            );
          }
          if (prev.some((m) => m._id === msg._id)) return prev;
          return [...prev, msg];
        });
      }
    },
    [conversationId]
  );

  const handleTyping = useCallback(
    ({ from }) => {
      if (from === customerId) {
        setIsTyping(true);
        clearTimeout(typingTimeout.current);
        typingTimeout.current = setTimeout(() => setIsTyping(false), 1800);
      }
    },
    [customerId]
  );

  const handleReconnect = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `/api/conversations/history?conversationId=${conversationId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!response.ok) throw new Error("Failed to fetch history on reconnect");
      const data = await response.json();
      setMessages(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Fetch history on reconnect failed:", err);
    }
  }, [conversationId]);

  // --- פונקציות לשליחת הודעות ---

  const handleInput = (e) => {
    setInput(e.target.value);
    socket?.emit("typing", { conversationId, from: businessId });
  };

  const sendMessage = () => {
    if (sending) return;

    const text = input.trim();
    if (!text || !socket) return;

    setSending(true);

    const tempId = uuidv4();
    const optimisticMsg = {
      _id: tempId,
      conversationId,
      from: businessId,
      to: customerId,
      text,
      timestamp: new Date().toISOString(),
      sending: true,
      tempId,
    };

    setMessages((prev) => [...prev, optimisticMsg]);
    setInput("");

    socket.emit(
      "sendMessage",
      { conversationId, from: businessId, to: customerId, text, tempId },
      (ack) => {
        setSending(false);
        if (ack.ok) {
          setMessages((prev) =>
            prev.map((m) =>
              m._id === tempId ? { ...ack.message, sending: false } : m
            )
          );
        } else {
          setMessages((prev) =>
            prev.map((m) =>
              m._id === tempId ? { ...m, sending: false, failed: true } : m
            )
          );
        }
      }
    );
  };

  // פתיחת בחירת קובץ
  const handleAttach = () => fileInputRef.current.click();

  // שליחת קובץ
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file || !socket) return;

    const tempId = uuidv4();
    const optimisticMsg = {
      _id: tempId,
      conversationId,
      from: businessId,
      to: customerId,
      fileUrl: URL.createObjectURL(file),
      fileName: file.name,
      fileType: file.type,
      timestamp: new Date().toISOString(),
      sending: true,
      tempId,
    };

    setMessages((prev) => [...prev, optimisticMsg]);

    const reader = new FileReader();
    reader.onload = () => {
      socket.emit(
        "sendFile",
        {
          conversationId,
          from: businessId,
          to: customerId,
          fileType: file.type,
          buffer: reader.result,
          fileName: file.name,
          tempId,
        },
        (ack) => {
          if (ack.ok) {
            setMessages((prev) =>
              prev.map((m) =>
                m._id === tempId ? { ...ack.message, sending: false } : m
              )
            );
          } else {
            setMessages((prev) =>
              prev.map((m) =>
                m._id === tempId ? { ...m, sending: false, failed: true } : m
              )
            );
          }
        }
      );
    };
    reader.readAsArrayBuffer(file);
  };

  // קבלת פורמט הקלטה מועדף
  const getSupportedMimeType = () => {
    const pref = "audio/webm";
    return window.MediaRecorder?.isTypeSupported(pref) ? pref : pref;
  };

  // התחלת הקלטה
  const handleRecordStart = async () => {
    if (!navigator.mediaDevices || recording) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;
      recordedChunks.current = [];

      const recorder = new MediaRecorder(stream, { mimeType: getSupportedMimeType() });
      recorder.ondataavailable = (e) => recordedChunks.current.push(e.data);
      recorder.onstop = () => {
        const blob = new Blob(recordedChunks.current, { type: recorder.mimeType });
        setRecordedBlob(blob);
      };

      recorder.start();
      mediaRecorderRef.current = recorder;

      setRecording(true);
      setTimer(0);
      timerRef.current = setInterval(() => setTimer((t) => t + 1), 1000);
    } catch (err) {
      console.error("startRecording failed:", err);
    }
  };

  // עצירת הקלטה
  const handleRecordStop = () => {
    if (!mediaRecorderRef.current) return;

    mediaRecorderRef.current.stop();
    setRecording(false);
    clearInterval(timerRef.current);
  };

  // ביטול הקלטה
  const handleDiscard = () => setRecordedBlob(null);

  // שליחת הקלטה
  const handleSendRecording = () => {
    if (!recordedBlob || !socket) return;

    const tempId = uuidv4();
    const optimisticMsg = {
      _id: tempId,
      conversationId,
      from: businessId,
      to: customerId,
      fileUrl: URL.createObjectURL(recordedBlob),
      fileName: `audio.${recordedBlob.type.split("/")[1]}`,
      fileType: recordedBlob.type,
      fileDuration: timer,
      timestamp: new Date().toISOString(),
      sending: true,
      tempId,
    };

    setMessages((prev) => [...prev, optimisticMsg]);
    setRecordedBlob(null);

    const reader = new FileReader();
    reader.onload = () => {
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
        },
        (ack) => {
          if (ack.ok) {
            setMessages((prev) =>
              prev.map((m) =>
                m._id === tempId ? { ...ack.message, sending: false } : m
              )
            );
          } else {
            setMessages((prev) =>
              prev.map((m) =>
                m._id === tempId ? { ...m, sending: false, failed: true } : m
              )
            );
          }
        }
      );
    };
    reader.readAsArrayBuffer(recordedBlob);
  };

  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  return (
    <div className="chat-container business">
      <div className="message-list" ref={messageListRef}>
        {loading && <div className="loading">טוען...</div>}
        {!loading && messages.length === 0 && <div className="empty">עדיין אין הודעות</div>}

        {messages.map((m, i) =>
  m.system ? (
    <div
      key={
        m._id
          ? `${m._id.toString()}-system`
          : m.timestamp
          ? `system-${m.timestamp.toString()}`
          : `system-${i}`
      }
      className="system-message"
    >
      {m.text}
    </div>
  ) : (
    <div
      key={
        m._id
          ? `${m._id.toString()}${m.sending ? "-sending" : ""}${m.failed ? "-failed" : ""}`
          : m.tempId
          ? `${m.tempId}-${i}`
          : `msg-${i}`
      }
      className={`message${m.from === businessId ? " mine" : " theirs"}${
        m.sending ? " sending" : ""
      }${m.failed ? " failed" : ""}`}
    >
              {m.fileUrl ? (
                m.fileType && m.fileType.startsWith("audio") ? (
                  <WhatsAppAudioPlayer
                    src={m.fileUrl}
                    userAvatar={m.userAvatar}
                    duration={m.fileDuration}
                  />
                ) : (m.fileType && m.fileType.startsWith("image")) ||
                  /\.(jpe?g|png|gif|bmp|webp|svg)$/i.test(m.fileUrl) ? (
                  <img
                    src={m.fileUrl}
                    alt={m.fileName || "image"}
                    style={{ maxWidth: 200, borderRadius: 8 }}
                  />
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
                {m.fileDuration && (
                  <span className="audio-length">
                    {String(Math.floor(m.fileDuration / 60)).padStart(2, "0")}:
                    {String(Math.floor(m.fileDuration % 60)).padStart(2, "0")}
                  </span>
                )}
                {m.sending && <span className="sending-indicator">⏳</span>}
                {m.failed && <span className="failed-indicator">❌</span>}
              </div>
            </div>
          )
        )}

        {isTyping && <div className="typing-indicator">הלקוח מקליד...</div>}
        {loadingMore && <div className="loading-more">טוען הודעות נוספות…</div>}
      </div>

      <div className="inputBar">
        {(recording || recordedBlob) ? (
          <div className="audio-preview-row">
            {recording ? (
              <>
                <button
                  className="recordBtn recording"
                  onClick={handleRecordStop}
                  title="עצור הקלטה"
                  type="button"
                >
                  ⏹️
                </button>
                <span className="preview-timer">
                  {String(Math.floor(timer / 60)).padStart(2, "0")}:
                  {String(timer % 60).padStart(2, "0")}
                </span>
                <button
                  className="preview-btn trash"
                  onClick={handleDiscard}
                  type="button"
                >
                  🗑️
                </button>
              </>
            ) : (
              <>
                <audio
                  src={URL.createObjectURL(recordedBlob)}
                  controls
                  style={{ height: 30 }}
                />
                <div>
                  משך הקלטה: {Math.floor(timer / 60)}:
                  {Math.floor(timer % 60).toString().padStart(2, "0")}
                </div>
                <button
                  className="send-btn"
                  onClick={handleSendRecording}
                  disabled={sending}
                >
                  שלח
                </button>
                <button
                  className="discard-btn"
                  onClick={handleDiscard}
                  type="button"
                >
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
              disabled={sending}
              onChange={handleInput}
              onKeyDown={(e) =>
                e.key === "Enter" && !e.shiftKey && (e.preventDefault(), sendMessage())
              }
              rows={1}
            />
            <button
              className="sendButtonFlat"
              onClick={sendMessage}
              disabled={sending || !input.trim()}
              title="שלח"
            >
              ◀
            </button>
            <div className="inputBar-right">
              <button
                type="button"
                className="attachBtn"
                onClick={handleAttach}
                disabled={sending}
                title="צרף קובץ"
              >
                📎
              </button>
              <button
                type="button"
                className={`recordBtn${recording ? " recording" : ""}`}
                onClick={recording ? handleRecordStop : handleRecordStart}
                disabled={sending}
                title={recording ? "עצור הקלטה" : "התחל הקלטה"}
              >
                🎤
              </button>
              <input
                type="file"
                ref={fileInputRef}
                className="fileInput"
                onChange={handleFileChange}
                accept="image/*,audio/*,video/*"
                style={{ display: "none" }}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
