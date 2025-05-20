// src/components/ClientChatTab.jsx
import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import "./ClientChatTab.css";

export default function ClientChatTab({ conversationId, businessId, userId }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userScrolledUp, setUserScrolledUp] = useState(false);
  const [error, setError] = useState("");

  // recording states
  const [recording, setRecording] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState(null);
  const [isPaused, setIsPaused] = useState(false);
  const [timer, setTimer] = useState(0);

  const socketRef = useRef();
  const mediaRecorderRef = useRef();
  const recordedChunksRef = useRef([]);
  const messageListRef = useRef();
  const typingTimeout = useRef();
  const fileInputRef = useRef();
  const textareaRef = useRef();
  const timerRef = useRef();

  useEffect(() => {
    if (!conversationId) return;
    setLoading(true);
    setError("");
    const socketUrl = import.meta.env.VITE_SOCKET_URL;

    socketRef.current = io(socketUrl, {
      path: "/socket.io",
      query: { conversationId, userId, role: "client", businessName: "" },
    });

    socketRef.current.emit("getHistory", { conversationId }, (history) => {
      setMessages(Array.isArray(history) ? history : []);
      setLoading(false);
    });

    socketRef.current.on("newMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    socketRef.current.on("typing", ({ from }) => {
      if (from === businessId) {
        setIsTyping(true);
        clearTimeout(typingTimeout.current);
        typingTimeout.current = setTimeout(() => setIsTyping(false), 1500);
      }
    });

    return () => {
      socketRef.current.disconnect();
      clearTimeout(typingTimeout.current);
      messages.forEach((m) => {
        if (m.isLocal && m.fileUrl) URL.revokeObjectURL(m.fileUrl);
      });
    };
  }, [conversationId, businessId, userId]);

  useEffect(() => {
    if (!userScrolledUp && messageListRef.current) {
      messageListRef.current.scrollTo({
        top: messageListRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, isTyping, userScrolledUp]);

  const onScroll = () => {
    if (!messageListRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = messageListRef.current;
    setUserScrolledUp(scrollTop + clientHeight < scrollHeight - 20);
  };

  const resizeTextarea = () => {
    if (!textareaRef.current) return;
    textareaRef.current.style.height = "auto";
    textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
  };

  const sendMessage = () => {
    const text = input.trim();
    if (!text || sending) return;
    setSending(true);
    setError("");
    socketRef.current.emit(
      "sendMessage",
      { conversationId, from: userId, to: businessId, role: "client", text },
      (ack) => {
        setSending(false);
        if (ack?.ok) setInput("");
        else setError("שגיאה בשליחת ההודעה, נסה שוב");
      }
    );
  };

  const sendFile = (file) => {
    if (!file || !conversationId) return;
    setSending(true);
    setError("");
    const reader = new FileReader();
    reader.onload = () => {
      socketRef.current.emit(
        "sendMessage",
        {
          conversationId,
          from: userId,
          to: businessId,
          role: "client",
          file: { name: file.name, type: file.type, data: reader.result },
        },
        (ack) => {
          setSending(false);
          if (!ack?.ok) setError("שגיאה בשליחת קובץ");
        }
      );
    };
    reader.readAsDataURL(file);
  };

  // recording handlers
  const handleRecordStart = async () => {
    if (recording) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      recordedChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) recordedChunksRef.current.push(e.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, { type: "audio/webm" });
        setRecordedBlob(blob);
      };

      mediaRecorderRef.current.start();
      setRecording(true);
      setError("");
      setIsBlocked(false);
      setTimer(0);
      timerRef.current = setInterval(() => setTimer((t) => t + 1), 1000);
    } catch {
      setError("אין הרשאה להקלטה. בדוק הרשאות דפדפן.");
      setIsBlocked(true);
    }
  };

  const handleRecordStop = () => {
    if (!recording) return;
    mediaRecorderRef.current.stop();
    clearInterval(timerRef.current);
    setRecording(false);
  };

  const handleSendRecording = () => {
    if (!recordedBlob) return;
    sendAudio(recordedBlob);
    setRecordedBlob(null);
    setTimer(0);
  };

  const handleDiscard = () => {
    setRecordedBlob(null);
    setTimer(0);
  };

  const sendAudio = (blob) => {
    if (!conversationId) return;
    setSending(true);
    setError("");
    const reader = new FileReader();
    reader.onload = () => {
      socketRef.current.emit(
        "sendMessage",
        {
          conversationId,
          from: userId,
          to: businessId,
          role: "client",
          file: { name: "voice.webm", type: "audio/webm", data: reader.result },
        },
        (ack) => {
          setSending(false);
          if (!ack?.ok) setError("שגיאה בשליחת הקלטה");
        }
      );
    };
    reader.readAsDataURL(blob);
  };

  const handleInput = (e) => {
    setInput(e.target.value);
    resizeTextarea();
    if (socketRef.current && !sending) {
      socketRef.current.emit("typing", { conversationId, from: userId, to: businessId });
    }
  };

  const handleAttach = () => fileInputRef.current.click();
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) sendFile(file);
    e.target.value = null;
  };

  // Waveform component
  const Waveform = () => (
    <div className="waveform">
      {[...Array(5)].map((_, i) => (
        <span key={i} className="wave-dot"></span>
      ))}
    </div>
  );

  return (
    <div className="chat-container client">
      <div className="message-list" ref={messageListRef} onScroll={onScroll}>
        {loading && <div className="loading">טוען...</div>}
        {!loading && messages.length === 0 && <div className="empty">עדיין אין הודעות</div>}
        {messages.map((m, i) => (
          <div key={m._id || i} className={`message${m.from===userId?" mine":" theirs"}`}>
            {/* ... rendering messages ... */}
          </div>
        ))}
        {isTyping && <div className="typing-indicator">העסק מקליד...</div>}
      </div>

      <div className="inputBar">
        {error && <div className="error-alert">⚠ {error}</div>}

        {recordedBlob ? (
          <div className="recording-preview">
            <button className="preview-btn send" onClick={handleSendRecording}>◀</button>
            <button
              className={`preview-btn pause${isPaused?" paused":""}`}
              onClick={() => {
                mediaRecorderRef.current[isPaused?"resume":"pause"]();
                setIsPaused(p=>!p);
              }}
            >{isPaused?"▶":"❚❚"}</button>
            <Waveform />
            <span className="preview-timer">
              {String(Math.floor(timer/60)).padStart(2,'0')}:
              {String(timer%60).padStart(2,'0')}
            </span>
            <button className="preview-btn trash" onClick={handleDiscard}>🗑</button>
          </div>
        ) : (
          <>
            <button className="sendButtonFlat" onClick={sendMessage} disabled={sending||!input.trim()}>◀</button>
            <textarea
              ref={textareaRef}
              className="inputField"
              placeholder="הקלד הודעה..."
              value={input}
              onChange={handleInput}
              onKeyDown={e=>e.key==="Enter"&&!e.shiftKey&&(e.preventDefault(),sendMessage())}
              disabled={sending}
              rows={1}
            />
            <div className="inputBar-right">
              <button className="attachBtn" onClick={handleAttach} disabled={sending}>📎</button>
              <button
                className={`recordBtn${recording?" recording":""}`}
                onMouseDown={handleRecordStart}
                onMouseUp={handleRecordStop}
                onMouseLeave={handleRecordStop}
                onTouchStart={handleRecordStart}
                onTouchEnd={handleRecordStop}
                disabled={sending}
              >🎤</button>
              <input type="file" ref={fileInputRef} className="fileInput" onChange={handleFileChange} disabled={sending} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}