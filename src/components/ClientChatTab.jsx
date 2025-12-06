import React, { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import "./ClientChatTab.css";

export default function ClientChatTab({
  socket,
  messages,
  setMessages,
  conversationId,
  businessId,
  userId,
}) {
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const listRef = useRef(null);

  /* -------------------------------------------------------------
     AUTO SCROLL
  ------------------------------------------------------------- */
  useEffect(() => {
    if (!listRef.current) return;
    listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages]);

  /* -------------------------------------------------------------
     SEND MESSAGE — Section will update state
  ------------------------------------------------------------- */
  const sendMessage = () => {
    if (!input.trim() || sending) return;

    const tempId = uuidv4();
    const text = input.trim();

    // שליחה אופטימית → אבל state מנוהל ב-Section
    setMessages((prev) => [
      ...prev,
      {
        _id: tempId,
        tempId,
        conversationId,
        fromId: userId,
        text,
        timestamp: new Date().toISOString(),
        role: "client",
        sending: true,
      },
    ]);

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
        conversationType: "user-business",
      },
      (ack) => {
        setSending(false);

        if (!ack.ok) {
          // כישלון שליחה
          setMessages((prev) =>
            prev.map((m) =>
              m.tempId === tempId ? { ...m, sending: false, failed: true } : m
            )
          );
          return;
        }

        // ACK מוצלח → מחליף את ההודעה האופטימית
        setMessages((prev) =>
          prev.map((m) =>
            m.tempId === tempId
              ? {
                  ...m,
                  ...ack.message,
                  sending: false,
                  failed: false,
                }
              : m
          )
        );
      }
    );
  };

  /* -------------------------------------------------------------
     UI DISPLAY ONLY
  ------------------------------------------------------------- */
  return (
    <div className="chat-container client">
      <div className="message-list" ref={listRef}>
        {messages.map((m) => (
          <div
            key={m._id || m.tempId}
            className={`message ${m.fromId === userId ? "mine" : "theirs"} ${
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
