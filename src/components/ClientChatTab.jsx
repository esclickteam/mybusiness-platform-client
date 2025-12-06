import React, { useEffect, useRef, useState, useReducer } from "react";
import { v4 as uuidv4 } from "uuid";
import API from "../api";
import "./ClientChatTab.css";

/* -------------------------------------------------------------
   NORMALIZE MESSAGE
------------------------------------------------------------- */
function normalize(msg, userId, businessId) {
  const fromId = String(msg.fromId || msg.from || "");
  const role = fromId === String(userId) ? "client" : "business";

  return {
    ...msg,
    _id: String(msg._id || msg.id || msg.tempId),
    tempId: msg.tempId || null,
    timestamp: msg.createdAt || msg.timestamp || new Date().toISOString(),
    text: msg.text || "",
    role,
  };
}

/* -------------------------------------------------------------
   REDUCER — מניעת כפילויות
------------------------------------------------------------- */
function messagesReducer(state, action) {
  switch (action.type) {
    case "set":
      return [
        ...new Map(action.payload.map((m) => [m._id || m.tempId, m])).values(),
      ];

    case "append":
      if (
        state.some(
          (m) =>
            m._id === action.payload._id ||
            m.tempId === action.payload._id ||
            m._id === action.payload.tempId
        )
      ) {
        return state;
      }
      return [...state, action.payload];

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
     LOAD HISTORY FROM API
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
      } catch {
        setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [conversationId, userId, businessId]);

  /* -------------------------------------------------------------
     SOCKET — REAL TIME MESSAGES (עם מניעת כפילויות)
  ------------------------------------------------------------- */
  useEffect(() => {
    if (!socket || !conversationId) return;

    // ניקוי מאזינים ישנים כדי למנוע כפילויות
    socket.off("newMessage");

    const handleNewMessage = (msg) => {
      // לא נוסיף הודעה שכבר קיימת
      dispatch({
        type: "append",
        payload: normalize(msg, userId, businessId),
      });
    };

    socket.on("newMessage", handleNewMessage);

    // הצטרפות לחדר
    socket.emit("joinConversation", conversationType, conversationId, false);

    return () => {
      socket.emit("leaveConversation", conversationType, conversationId, false);
      socket.off("newMessage", handleNewMessage);
    };
  }, [socket, conversationId, userId, businessId, conversationType]);

  /* -------------------------------------------------------------
     AUTO SCROLL
  ------------------------------------------------------------- */
  useEffect(() => {
    if (!listRef.current) return;
    listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages]);

  /* -------------------------------------------------------------
     SEND MESSAGE
  ------------------------------------------------------------- */
  const sendMessage = () => {
    if (!input.trim() || sending) return;

    const tempId = uuidv4();
    const text = input.trim();
    setSending(true);

    // הודעה זמנית (אופטימית)
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

    // שליחה לשרת
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
            payload: { id: tempId, updates: { sending: false, failed: true } },
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
            <div className="text">{m.text}</div>
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
