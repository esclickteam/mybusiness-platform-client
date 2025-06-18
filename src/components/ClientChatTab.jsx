import React, { useState, useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import "./ClientChatTab.css";
import { Buffer } from "buffer";
import API from "../api";
import WhatsAppAudioPlayer from "./WhatsAppAudioPlayer";

export default function ClientChatTab({ socket, conversationId, businessId, userId }) {
  const [messages, setMessages] = useState([]);
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

  const getMessageId = (msg) => msg._id || msg.recommendationId || msg.tempId;

  useEffect(() => {
    if (!conversationId) return;
    setLoading(true);
    setError("");
    API.get("/conversations/history", { params: { conversationId } })
      .then((res) => {
        const filtered = res.data.filter(
          (msg) => !(msg.isRecommendation && msg.status === "pending")
        );
        setMessages(filtered);
        setLoading(false);
      })
      .catch(() => {
        setMessages([]);
        setError("שגיאה בטעינת היסטוריית ההודעות");
        setLoading(false);
      });
  }, [conversationId]);

  useEffect(() => {
    if (!socket) return;

    const handleIncomingMessage = (msg) => {
      const id = getMessageId(msg);
      if (msg.status === "pending" && msg.recommendationId) return;

      setMessages((prev) => {
        const map = new Map();
        prev.forEach((m) => map.set(getMessageId(m), m));
        map.set(id, { ...map.get(id), ...msg });
        return Array.from(map.values());
      });
    };

    const handleMessageApproved = (msg) => {
      if (msg.conversationId !== conversationId) return;
      const id = getMessageId(msg);
      if (!id) return;

      setMessages((prev) => {
        const idx = prev.findIndex((m) => getMessageId(m) === id);
        if (idx !== -1) {
          const newMessages = [...prev];
          newMessages[idx] = { ...newMessages[idx], ...msg };
          return newMessages;
        }
        return [...prev, msg];
      });
    };

    socket.on("newMessage", handleIncomingMessage);
    socket.on("newAiSuggestion", handleIncomingMessage);
    socket.on("messageApproved", handleMessageApproved);
    socket.emit("joinConversation", conversationId);
    socket.emit("joinRoom", businessId);

    return () => {
      socket.off("newMessage", handleIncomingMessage);
      socket.off("newAiSuggestion", handleIncomingMessage);
      socket.off("messageApproved", handleMessageApproved);
      socket.emit("leaveConversation", conversationId);
    };
  }, [socket, conversationId, businessId]);

  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [messages]);

  const resizeTextarea = () => {
    if (!textareaRef.current) return;
    textareaRef.current.style.height = "auto";
    textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
  };

  const sendMessage = () => {
    if (!input.trim() || sending || !socket) return;
    if (!socket.connected) {
      setError("Socket אינו מחובר, נסה להתחבר מחדש");
      return;
    }

    setSending(true);
    setError("");
    const tempId = uuidv4();

    const optimisticMsg = {
      _id: tempId,
      tempId,
      conversationId,
      from: userId,
      to: businessId,
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
      },
      (ack) => {
        setSending(false);
        if (ack?.ok) {
          setMessages((prev) =>
            prev.map((msg) => (msg.tempId === tempId && ack.message ? ack.message : msg))
          );
        } else {
          setError("שגיאה בשליחת ההודעה");
          setMessages((prev) => prev.filter((msg) => msg.tempId !== tempId));
        }
      }
    );
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
    if (!recordedBlob || !socket) return;
    setSending(true);
    try {
      const arrayBuffer = await recordedBlob.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      socket.emit(
        "sendAudio",
        {
          conversationId,
          from: userId,
          to: businessId,
          role: "client",
          buffer,
          fileType: recordedBlob.type,
          duration: timer,
        },
        (ack) => {
          setSending(false);
          setRecordedBlob(null);
          setTimer(0);
          if (!ack.ok) setError("שגיאה בשליחת ההקלטה");
        }
      );
    } catch {
      setSending(false);
      setError("שגיאה בהכנת הקובץ למשלוח");
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file || !socket) return;
    setSending(true);

    const reader = new FileReader();
    reader.onload = () => {
      socket.emit(
        "sendFile",
        {
          conversationId,
          from: userId,
          to: businessId,
          role: "client",
          buffer: Buffer.from(reader.result.split(",")[1], "base64"),
          fileType: file.type,
          fileName: file.name,
        },
        (ack) => {
          setSending(false);
          if (!ack.ok) setError("שגיאה בשליחת הקובץ");
        }
      );
    };
    reader.onerror = () => {
      setSending(false);
      setError("שגיאה בהמרת הקובץ");
    };

    reader.readAsDataURL(file);
    e.target.value = null;
  };

  return (
    <div className="chat-container client">
      <div className="message-list" ref={messageListRef}>
        {loading && <div className="loading">טוען...</div>}
        {!loading && messages.length === 0 && <div className="empty">עדיין אין הודעות</div>}
        {messages.map((m) => (
          <div
            key={getMessageId(m) ? `msg_${getMessageId(m)}` : `unknown_${uuidv4()}`}
            className={`message${m.role === "client" ? " mine" : " theirs"}${m.isRecommendation ? " ai-recommendation" : ""}`}
          >
            {m.image ? (
              <img src={m.image} alt={m.fileName || "image"} style={{ maxWidth: 200, borderRadius: 8 }} />
            ) : m.fileUrl || m.file?.data ? (
              m.fileType?.startsWith("audio") ? (
                <WhatsAppAudioPlayer
                  src={m.fileUrl || m.file.data}
                  userAvatar={m.userAvatar}
                  duration={m.fileDuration}
                />
              ) : /\.(jpe?g|png|gif|bmp|webp|svg)$/i.test(m.fileUrl || "") ? (
                <img src={m.fileUrl || m.file.data} alt={m.fileName || "image"} style={{ maxWidth: 200, borderRadius: 8 }} />
              ) : (
                <a href={m.fileUrl || m.file?.data} target="_blank" rel="noopener noreferrer" download>
                  {m.fileName || "קובץ להורדה"}
                </a>
              )
            ) : (
              <div className="text">{m.text}</div>
            )}
            <div className="meta">
              <span className="time">
                {(() => {
                  const date = new Date(m.timestamp);
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
        ))}
      </div>

      <div className="inputBar">
        {error && <div className="error-alert">⚠ {error}</div>}

        {(recording || recordedBlob) ? (
          <div className="audio-preview-row">
            {recording ? (
              <>
                <button className="recordBtn recording" onClick={handleRecordStop} type="button">⏹️</button>
                <span className="preview-timer">
                  {String(Math.floor(timer / 60)).padStart(2, "0")}:
                  {String(timer % 60).padStart(2, "0")}
                </span>
                <button className="preview-btn trash" onClick={() => {
                  setRecording(false);
                  setRecordedBlob(null);
                  setTimer(0);
                }} type="button">🗑️</button>
              </>
            ) : (
              <>
                <audio src={URL.createObjectURL(recordedBlob)} controls style={{ height: 30 }} />
                <div>משך הקלטה: {String(Math.floor(timer / 60)).padStart(2, "0")}:{String(timer % 60).padStart(2, "0")}</div>
                <button className="send-btn" onClick={handleSendRecording} disabled={sending}>שלח</button>
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
