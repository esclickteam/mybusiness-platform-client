import React, { useEffect, useRef, useState, useReducer } from "react";
import { v4 as uuidv4 } from "uuid";
import "./ClientChatTab.css";

/* -------------------------------------------------------------
   NORMALIZE MESSAGE
------------------------------------------------------------- */
function normalize(msg, userId) {
  return {
    _id: msg._id || msg.id || msg.tempId,
    tempId: msg.tempId || null,
    fromId: String(msg.fromId),
    toId: String(msg.toId),
    text: msg.text || msg.content || "",
    timestamp: msg.timestamp || msg.createdAt || new Date().toISOString(),
    role: String(msg.fromId) === String(userId) ? "client" : "business",
    sending: msg.sending || false,
    failed: msg.failed || false,
  };
}

/* -------------------------------------------------------------
   REDUCER — מניעת כפילויות יציבה
------------------------------------------------------------- */
function messagesReducer(state, action) {
  switch (action.type) {
    case "set":
      return [
        ...new Map(
          action.payload.map((m) => [m._id || m.tempId, m])
        ).values(),
      ];

    case "append":
      if (
        state.some(
          (m) =>
            (m._id && m._id === action.payload._id) ||
            (m.tempId && m.tempId === action.payload.tempId)
        )
      ) {
        return state; // skip duplicate
      }
      return [...state, action.payload];

    case "update":
      return state.map((msg) =>
        msg._id === action.payload.id || msg.tempId === action.payload.id
          ? { ...msg, ...action.payload.updates }
          : msg
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
}) {
  const [messages, dispatch] = useReducer(messagesReducer, []);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);

  const listRef = useRef(null);

  /* -------------------------------------------------------------
     LOAD HISTORY (FROM SOCKET ONLY)
------------------------------------------------------------- */
  useEffect(() => {
    if (!socket || !conversationId) return;

    console.log("📜 Loading history via socket:", conversationId);

    socket.emit("getHistory", { conversationId }, (res) => {
      if (res.ok) {
        const normalized = res.messages.map((m) => normalize(m, userId));
        dispatch({ type: "set", payload: normalized });
      }
    });

    // הצטרפות אמיתית לחדר
    socket.emit("joinRoom", conversationId);
  }, [socket, conversationId, userId]);

  /* -------------------------------------------------------------
     SOCKET — REAL TIME
------------------------------------------------------------- */
  useEffect(() => {
    if (!socket) return;

    const handler = (msg) => {
      console.log("📩 NEW MESSAGE:", msg);
      const normalized = normalize(msg, userId);
      dispatch({ type: "append", payload: normalized });
    };

    socket.on("newMessage", handler);

    return () => {
      socket.off("newMessage", handler);
    };
  }, [socket, userId]);

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

    const text = input.trim();
    const tempId = uuidv4();

    setSending(true);

    // הודעה אופטימית
    dispatch({
      type: "append",
      payload: normalize(
        {
          tempId,
          fromId: userId,
          toId: businessId,
          text,
          sending: true,
        },
        userId
      ),
    });

    setInput("");

    socket.emit(
      "sendMessage",
      {
        conversationId,
        from: userId,
        text,
        tempId,
      },
      (ack) => {
        setSending(false);

        if (!ack.ok) {
          dispatch({
            type: "update",
            payload: { id: tempId, updates: { sending: false, failed: true } },
          });
          return;
        }

        // החלפת ההודעה הזמנית בהודעה האמיתית
        dispatch({
          type: "update",
          payload: {
            id: tempId,
            updates: normalize(ack.message, userId),
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
        {messages.map((m) => (
          <div
            key={m._id || m.tempId}
            className={`message ${m.role === "client" ? "mine" : "theirs"} ${
              m.sending ? "sending" : ""
            } ${m.failed ? "failed" : ""}`}
          >
            <div className="text">{m.text}</div>
            <div className="meta">
              {new Date(m.timestamp).toLocaleTimeString("he-IL", {
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
