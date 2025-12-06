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
  };
}

/* -------------------------------------------------------------
   REDUCER — מניעת כפילויות יציבה
------------------------------------------------------------- */
function messagesReducer(state, action) {
  switch (action.type) {
    case "set":
      return [
        ...new Map(action.payload.map(m => [m._id || m.tempId, m])).values(),
      ];

    case "append":
      if (
        state.some(
          m =>
            m._id === action.payload._id ||
            m.tempId === action.payload.tempId
        )
      ) {
        return state;
      }
      return [...state, action.payload];

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
     LOAD HISTORY FROM SERVER
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

    // חיבור אמיתי לחדר
    socket.emit("joinRoom", conversationId);
  }, [socket, conversationId, userId]);

  /* -------------------------------------------------------------
     SOCKET — REAL TIME
------------------------------------------------------------- */
  useEffect(() => {
    if (!socket) return;

    const handler = (msg) => {
      console.log("📩 NEW MESSAGE:", msg);
      dispatch({ type: "append", payload: normalize(msg, userId) });
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
     SEND MESSAGE — NO OPTIMISM!
------------------------------------------------------------- */
  const sendMessage = () => {
    if (!input.trim() || sending) return;

    const text = input.trim();
    const tempId = uuidv4();

    setSending(true);
    setInput("");

    socket.emit(
      "sendMessage",
      {
        conversationId,
        from: userId,
        to: businessId,
        text,
        tempId,
      },
      (ack) => {
        setSending(false);

        if (!ack.ok) {
          console.error("❌ Failed sending message:", ack.error);
        }
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
            className={`message ${m.role === "client" ? "mine" : "theirs"}`}
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
