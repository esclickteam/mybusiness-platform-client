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

      <div className="time-display">
        {formatTime(progress)} / {formatTime(duration)}
      </div>

      <audio ref={audioRef} src={src} preload="metadata" />
    </div>
  );
}

/* -------------------------------------------------------------
   NORMALIZE
------------------------------------------------------------- */
function normalize(msg, userId, businessId) {
  const fromId = String(msg.fromId || msg.from || "");

  let role = "business";
  if (fromId === String(userId)) role = "client";
  if (fromId === String(businessId)) role = "business";

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

/* -------------------------------------------------------------
   REDUCER — no duplicates allowed
------------------------------------------------------------- */
function messagesReducer(state, action) {
  switch (action.type) {
    case "set": {
      const unique = [];
      action.payload.forEach((msg) => {
        if (
          !unique.some(
            (m) =>
              m._id === msg._id ||
              m.tempId === msg._id ||
              m._id === msg.tempId
          )
        ) {
          unique.push(msg);
        }
      });
      return unique;
    }

    case "append": {
      const exists = state.find(
        (m) =>
          m._id === action.payload._id ||
          m.tempId === action.payload._id ||
          m._id === action.payload.tempId
      );
      if (exists) return state;
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

/* -------------------------------------------------------------
   MAIN COMPONENT
------------------------------------------------------------- */
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

  const listRef = useRef(null);

  /* -------------------------------------------------------------
     LOAD HISTORY
------------------------------------------------------------- */
  useEffect(() => {
    if (!conversationId || !userId) return;

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
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [conversationId]);

  /* -------------------------------------------------------------
     SOCKET — FIXED, NO DUPLICATES
------------------------------------------------------------- */
  useEffect(() => {
    if (!socket || !conversationId) return;

    /* JOIN */
    const join = () => {
      socket.emit("joinConversation", conversationType, conversationId, false);
    };
    socket.on("connect", join);
    if (socket.connected) join();

    /* HANDLE INCOMING MESSAGE */
    const handleNewMessage = (msg) => {
      // ❌ אם ההודעה נשלחה ע"י הלקוח — לא להציג אותה שוב
      if (String(msg.fromId || msg.from) === String(userId)) return;

      if (msg.conversationId !== conversationId) return;
      dispatch({
        type: "append",
        payload: normalize(msg, userId, businessId),
      });
    };

    socket.on("newMessage", handleNewMessage);

    return () => {
      socket.off("connect", join);
      socket.off("newMessage", handleNewMessage);
      socket.emit("leaveConversation", conversationId);
    };
  }, [socket, conversationId, userId]);

  /* -------------------------------------------------------------
     SCROLL
------------------------------------------------------------- */
  useEffect(() => {
    if (!listRef.current) return;
    listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages]);

  /* -------------------------------------------------------------
     SEND MESSAGE — OPTIMISTIC UI
------------------------------------------------------------- */
  const sendMessage = () => {
    if (!input.trim() || sending) return;

    const tempId = uuidv4();
    setSending(true);
    const text = input.trim();

    // OPTIMISTIC
    dispatch({
      type: "append",
      payload: {
        _id: tempId,
        tempId,
        conversationId,
        fromId: userId,
        text,
        timestamp: new Date().toISOString(),
        sending: true,
        role: "client",
      },
    });

    setInput("");

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
            payload: {
              id: tempId,
              updates: { sending: false, failed: true },
            },
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
     UI
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
