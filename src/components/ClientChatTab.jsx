import React, { useEffect, useRef, useState, useReducer } from "react";
import { v4 as uuidv4 } from "uuid";
import API from "../api";
import "./ClientChatTab.css";

/* ------------------------------------------------------------------
   AUDIO PLAYER
------------------------------------------------------------------ */
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

/* ------------------------------------------------------------------
   NORMALIZE
------------------------------------------------------------------ */
function normalize(msg, userId, businessId) {
  const fromId = String(msg.fromId || msg.from || "");

  let role = "business";

  if (msg.client && String(msg.client) === String(userId)) role = "client";
  else if (msg.business && String(msg.business) === String(businessId)) role = "business";
  else if (fromId === String(userId)) role = "client";
  else if (fromId === String(businessId)) role = "business";

  return {
    ...msg,
    _id: String(msg._id),
    tempId: msg.tempId || null,
    timestamp: msg.createdAt || msg.timestamp || new Date().toISOString(),
    text: msg.text || "",
    fileUrl: msg.fileUrl || "",
    fileName: msg.fileName || "",
    fileType: msg.fileType || "",
    fileDuration: msg.fileDuration || 0,
    role,
  };
}

/* ------------------------------------------------------------------
   REDUCER
------------------------------------------------------------------ */
function messagesReducer(state, action) {
  switch (action.type) {
    case "set": {
      const unique = [];
      action.payload.forEach((msg) => {
        if (
          !unique.some(
            (m) =>
              m._id === msg._id ||
              m._id === msg.tempId ||
              m.tempId === msg._id
          )
        ) {
          unique.push(msg);
        }
      });
      return unique;
    }

    case "append": {
      const idx = state.findIndex(
        (m) =>
          m._id === action.payload._id ||
          m._id === action.payload.tempId ||
          m.tempId === action.payload._id
      );
      if (idx !== -1) {
        const updated = [...state];
        updated[idx] = { ...updated[idx], ...action.payload };
        return updated;
      }
      return [...state, action.payload];
    }

    case "updateStatus": {
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

/* ------------------------------------------------------------------
   MAIN COMPONENT
------------------------------------------------------------------ */
export default function ClientChatTab({
  socket,
  conversationId,
  setConversationId,
  businessId,
  userId,
  conversationType = "user-business",
}) {
  const [messages, dispatch] = useReducer(messagesReducer, []);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const listRef = useRef(null);

  /* ------------------------------------------------------------------
     JOIN ROOMS — FIXED REAL-TIME LOGIC
  ------------------------------------------------------------------ */
  useEffect(() => {
    if (!socket || !conversationId || !userId) {
      dispatch({ type: "set", payload: [] });
      return;
    }

    const isBizConv = conversationType === "business-business";

    const join = () => {
      console.log("⚡ Client connected — joining rooms...");
      socket.emit("joinRoom", `client-${userId}`);
      socket.emit("joinConversation", conversationType, conversationId, isBizConv);
    };

    socket.on("connect", join);

    if (socket.connected) join();

    let cancelled = false;

    (async () => {
      try {
        const res = await API.get(`/messages/${conversationId}/history`, {
          params: { page: 0, limit: 50 },
        });

        if (cancelled) return;

        const msgs = (res.data.messages || []).map((msg) =>
          normalize(msg, userId, businessId)
        );

        dispatch({ type: "set", payload: msgs });
        setLoading(false);
      } catch (err) {
        setError("Error loading history");
        setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
      socket.off("connect", join);
      socket.emit("leaveConversation", conversationId, isBizConv);
      socket.emit("leaveRoom", `client-${userId}`);
    };
  }, [socket, conversationId, userId, conversationType, businessId]);

  /* ------------------------------------------------------------------
     SOCKET LISTENERS
  ------------------------------------------------------------------ */
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (msg) => {
      if (msg.conversationId !== conversationId) return;
      dispatch({ type: "append", payload: normalize(msg, userId, businessId) });
    };

    socket.on("newMessage", handleNewMessage);

    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, [socket, conversationId]);

  /* ------------------------------------------------------------------
     AUTO SCROLL
  ------------------------------------------------------------------ */
  useEffect(() => {
    if (!listRef.current) return;
    listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages]);

  /* ------------------------------------------------------------------
     SEND MESSAGE
  ------------------------------------------------------------------ */
  const sendMessage = () => {
    if (!input.trim() || sending) return;

    setSending(true);
    const tempId = uuidv4();

    // Optimistic UI
    dispatch({
      type: "append",
      payload: {
        _id: tempId,
        tempId,
        conversationId,
        from: userId,
        text: input,
        timestamp: new Date().toISOString(),
        sending: true,
        role: "client",
      },
    });

    const payload = {
      conversationId,
      from: userId,
      to: businessId,
      text: input.trim(),
      tempId,
      conversationType,
    };

    setInput("");

    socket.emit("sendMessage", payload, (ack) => {
      setSending(false);

      if (ack.ok && ack.message) {
        dispatch({
          type: "updateStatus",
          payload: {
            id: tempId,
            updates: normalize(ack.message, userId, businessId),
          },
        });
      } else {
        dispatch({
          type: "updateStatus",
          payload: {
            id: tempId,
            updates: { sending: false, failed: true },
          },
        });
      }
    });
  };

  /* ------------------------------------------------------------------
     UI
  ------------------------------------------------------------------ */
  return (
    <div className="chat-container client">
      <div className="message-list" ref={listRef}>
        {loading && <div className="loading">Loading...</div>}

        {!loading && messages.length === 0 && <div className="empty">No messages yet</div>}

        {messages.map((m) => (
          <div
            key={m._id || m.tempId}
            className={`message ${m.role === "client" ? "mine" : "theirs"} ${
              m.sending ? "sending" : ""
            } ${m.failed ? "failed" : ""}`}
          >
            {m.fileUrl ? (
              m.fileType?.startsWith("audio") ? (
                <WhatsAppAudioPlayer
                  src={m.fileUrl}
                  duration={m.fileDuration}
                />
              ) : (
                <img
                  src={m.fileUrl}
                  alt="file"
                  className="msg-image"
                />
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
        {error && <div className="error-alert">⚠ {error}</div>}

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

        <button
          className="sendButtonFlat"
          onClick={sendMessage}
          disabled={!input.trim() || sending}
        >
          ◀
        </button>
      </div>
    </div>
  );
}
