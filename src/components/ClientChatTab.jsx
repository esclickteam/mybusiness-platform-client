import React, { useEffect, useRef, useState, useReducer } from "react";
import { v4 as uuidv4 } from "uuid";
import API from "../api";
import "./ClientChatTab.css";

/* -------------------------------------------------------------
   AUDIO PLAYER
------------------------------------------------------------- */
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
          <img src={userAvatar} alt="" />
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

      <div className="time-display">{formatTime(progress)} / {formatTime(duration)}</div>

      <audio ref={audioRef} src={src} preload="metadata" />
    </div>
  );
}

/* -------------------------------------------------------------
   NORMALIZE MESSAGE
------------------------------------------------------------- */
function normalize(msg, userId, businessId) {
  const from = String(msg.fromId || msg.from || "");

  return {
    ...msg,
    _id: String(msg._id || msg.id || msg.tempId),
    tempId: msg.tempId || null,
    role: from === String(userId) ? "client" : "business",
    text: msg.text || "",
    fileUrl: msg.fileUrl || "",
    fileType: msg.fileType || "",
    fileName: msg.fileName || "",
    fileDuration: msg.fileDuration || 0,
    timestamp: msg.createdAt || msg.timestamp || new Date().toISOString(),
  };
}

/* -------------------------------------------------------------
   REDUCER — prevents duplicates 100%
------------------------------------------------------------- */
function messagesReducer(state, action) {
  switch (action.type) {
    case "set": {
      return [
        ...new Map(
          action.payload.map((m) => [m._id || m.tempId, m])
        ).values(),
      ];
    }

    case "append": {
      const exists = state.some(
        (m) =>
          m._id === action.payload._id ||
          m.tempId === action.payload._id ||
          m._id === action.payload.tempId
      );
      return exists ? state : [...state, action.payload];
    }

    case "updateStatus":
      return state.map((m) =>
        m._id === action.payload.id || m.tempId === action.payload.id
          ? { ...m, ...action.payload.updates }
          : m
      );

    default:
      return state;
  }
}

/* -------------------------------------------------------------
   MAIN COMPONENT
------------------------------------------------------------- */
export default function ClientChatTab({
  socket,
  conversationId,
  businessId,
  userId,
  conversationType = "user-business",
}) {
  const [messages, dispatch] = useReducer(messagesReducer, []);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const listRef = useRef(null);

  /* -------------------------------------------------------------
     LOAD HISTORY
------------------------------------------------------------- */
  useEffect(() => {
    if (!conversationId) return;

    let cancelled = false;

    (async () => {
      try {
        const res = await API.get(`/messages/${conversationId}/history`, {
          params: { page: 0, limit: 50 },
        });
        if (cancelled) return;

        const msgs = res.data.messages.map((msg) =>
          normalize(msg, userId, businessId)
        );

        dispatch({ type: "set", payload: msgs });
      } catch {}
      setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [conversationId]);

  /* -------------------------------------------------------------
     ❌ REMOVE REAL-TIME LISTENER — THIS FIXES DUPLICATIONS
------------------------------------------------------------- */
  // ❗️ DO NOT LISTEN TO newMessage HERE  
  // ClientChatSection ALREADY listens and adds messages.
  // If you listen here too → duplication.

  /* -------------------------------------------------------------
     AUTO SCROLL
------------------------------------------------------------- */
  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages]);

  /* -------------------------------------------------------------
     SEND MESSAGE
------------------------------------------------------------- */
  const sendMessage = () => {
    if (!input.trim() || sending) return;

    const tempId = uuidv4();
    const text = input.trim();

    // Locally add temporary message
    dispatch({
      type: "append",
      payload: {
        _id: tempId,
        tempId,
        conversationId,
        fromId: userId,
        role: "client",
        text,
        sending: true,
        timestamp: new Date().toISOString(),
      },
    });

    setInput("");
    setSending(true);

    socket.emit(
      "sendMessage",
      {
        conversationId,
        from: userId,
        to: businessId,
        text,
        tempId,
        conversationType,
      },
      (ack) => {
        setSending(false);

        if (!ack.ok) {
          dispatch({
            type: "updateStatus",
            payload: { id: tempId, updates: { failed: true, sending: false } },
          });
          return;
        }

        dispatch({
          type: "updateStatus",
          payload: {
            id: tempId,
            updates: normalize(ack.message, userId, businessId),
          },
        });
      }
    );
  };

  /* -------------------------------------------------------------
     RENDER
------------------------------------------------------------- */
  return (
    <div className="chat-container client">
      <div className="message-list" ref={listRef}>
        {loading && <div className="loading">Loading...</div>}

        {!loading && messages.length === 0 && (
          <div className="empty">No messages yet</div>
        )}

        {messages.map((m) => (
          <div
            key={m._id || m.tempId}
            className={`message ${m.role === "client" ? "mine" : "theirs"} ${
              m.sending ? "sending" : ""
            } ${m.failed ? "failed" : ""}`}
          >
            {m.fileUrl ? (
              m.fileType?.startsWith("audio") ? (
                <WhatsAppAudioPlayer src={m.fileUrl} duration={m.fileDuration} />
              ) : (
                <img src={m.fileUrl} className="msg-image" alt="" />
              )
            ) : (
              <div className="text">{m.text}</div>
            )}

            <div className="meta">
              {new Date(m.timestamp).toLocaleTimeString("en-GB", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="inputBar">
        <textarea
          className="inputField"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              sendMessage();
            }
          }}
        />

        <button className="sendButtonFlat" disabled={sending} onClick={sendMessage}>
          ◀
        </button>
      </div>
    </div>
  );
}
