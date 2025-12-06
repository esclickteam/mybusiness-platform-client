import React, { useRef, useEffect, useState } from "react";
import "./ClientChatTab.css";

export default function ClientChatTab({ messages, onSendMessage, loading, userId }) {
  const [input, setInput] = useState("");
  const listRef = useRef(null);

  useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages]);

  const send = () => {
    if (!input.trim()) return;
    onSendMessage(input.trim());
    setInput("");
  };

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
            className={`message ${m.from === userId ? "mine" : "theirs"} ${
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
          placeholder="Type message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              send();
            }
          }}
        />

        <button onClick={send} className="sendButtonFlat">
          ◀
        </button>
      </div>
    </div>
  );
}
