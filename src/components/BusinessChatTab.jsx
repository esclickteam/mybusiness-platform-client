import React, { useEffect, useRef, useState, useReducer } from "react";
import { v4 as uuidv4 } from "uuid";
import API from "../api";
import { useSocket } from "../context/socketContext";
import { useNotifications } from "../context/NotificationsContext";
import "./BusinessChatTab.css";

/* ---------------------------------------------------
   NORMALIZE MESSAGE
--------------------------------------------------- */
function normalize(msg) {
  return {
    ...msg,
    _id: String(msg._id || msg.tempId),
    tempId: msg.tempId || null,
    text: msg.text || msg.content || "",
    timestamp:
      msg.createdAt || msg.timestamp || new Date().toISOString(),
  };
}

/* ---------------------------------------------------
   REDUCER — GUARANTEED NO DUPLICATES
--------------------------------------------------- */
function messagesReducer(state, action) {
  switch (action.type) {
    case "set": {
      const unique = [];
      action.payload.forEach((msg) => {
        if (
          !unique.some(
            (m) =>
              m._id === msg._id ||
              m.tempId === msg.tempId ||
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
      const exists = state.some(
        (m) =>
          m._id === action.payload._id ||
          m.tempId === action.payload.tempId ||
          m._id === action.payload.tempId ||
          m.tempId === action.payload._id
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

/* ---------------------------------------------------
   MAIN COMPONENT
--------------------------------------------------- */
export default function BusinessChatTab({
  conversationId,
  businessId,
  customerId,
  customerName,
  conversationType = "user-business",
  onBack, // ⬅️ הוספה
}) {

  const socket = useSocket();
  const { addNotification } = useNotifications();

  const [messages, dispatch] = useReducer(messagesReducer, []);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const listRef = useRef(null);

  /* ---------------------------------------------------
     LOAD HISTORY
--------------------------------------------------- */
  useEffect(() => {
    if (!conversationId) {
      dispatch({ type: "set", payload: [] });
      return;
    }

    let cancelled = false;

    (async () => {
      try {
        const res = await API.get(
          `/messages/${conversationId}/history`,
          { params: { page: 0, limit: 50 } }
        );
        if (cancelled) return;

        dispatch({
          type: "set",
          payload: res.data.messages.map(normalize),
        });
      } catch (err) {
        console.error("History load error:", err);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [conversationId]);

  /* ---------------------------------------------------
     SOCKET EVENTS — NO DUPLICATES
--------------------------------------------------- */
  useEffect(() => {
    if (!socket || !conversationId) return;

    const join = () => {
      socket.emit("joinRoom", conversationId);
    };

    socket.on("connect", join);
    if (socket.connected) join();

    const handleMessage = (msg) => {
      const safe = normalize(msg);
      dispatch({ type: "append", payload: safe });
    };

    const handleTyping = ({ from }) => {
      if (String(from) !== String(customerId)) return;
      setIsTyping(true);
      clearTimeout(handleTyping._t);
      handleTyping._t = setTimeout(() => setIsTyping(false), 1800);
    };

    socket.on("newMessage", handleMessage);
    socket.on("typing", handleTyping);

    return () => {
      socket.off("connect", join);
      socket.off("newMessage", handleMessage);
      socket.off("typing", handleTyping);
      clearTimeout(handleTyping._t);
      socket.emit("leaveRoom", conversationId);
    };
  }, [socket, conversationId, customerId]);

  /* ---------------------------------------------------
     AUTO SCROLL
--------------------------------------------------- */
  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

  /* ---------------------------------------------------
     SEND MESSAGE
--------------------------------------------------- */
  const sendMessage = () => {
    if (!input.trim() || sending) return;

    const tempId = uuidv4();
    const text = input.trim();

    setSending(true);

    dispatch({
      type: "append",
      payload: {
        _id: tempId,
        tempId,
        conversationId,
        fromId: businessId,
        toId: customerId,
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
            updates: {
              sending: false,
              failed: !ack.ok,
              ...(ack.message || {}),
            },
          },
        });
      }
    );
  };

  /* ---------------------------------------------------
     RENDER
--------------------------------------------------- */
  if (!businessId) {
    return (
      <div className="chat-container business">
        <div className="loading">Loading chat...</div>
      </div>
    );
  }

  const sorted = [...messages].sort(
    (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
  );

  const formatTime = (ts) =>
    new Date(ts).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <div className="chat-container business">
      <div className="chat-header">
  {onBack && (
    <button
      className="backBtn"
      onClick={onBack}
      aria-label="Back to chats"
    >
      ←
    </button>
  )}

  <h3>{customerName}</h3>
</div>


      <div className="message-list" ref={listRef}>
        {sorted.map((m, i) => (
          <div
            key={`${m._id}-${m.tempId}-${i}`}
            className={`message ${
              String(m.fromId) === String(businessId)
                ? "mine"
                : "theirs"
            } ${m.sending ? "sending" : ""} ${
              m.failed ? "failed" : ""
            }`}
          >
            <div className="text">{m.text}</div>

            <div className="meta">
              <span className="time">{formatTime(m.timestamp)}</span>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="typing-indicator">Client is typing...</div>
        )}
      </div>

      <div className="inputBar">
        <textarea
          className="inputField"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            socket.emit("typing", {
              conversationId,
              from: businessId,
            });
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              sendMessage();
            }
          }}
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
