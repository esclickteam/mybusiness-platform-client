import React, { useEffect, useState } from "react";
import socket from "../socket";

export default function BusinessChat({ conversationId }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    if (!conversationId) return;

    // הצטרפות לחדר השיחה
    socket.emit("joinConversation", conversationId, (res) => {
      if (!res.ok) {
        alert("Failed to join conversation: " + res.error);
      }
    });

    // קבלת הודעה חדשה
    socket.on("newMessage", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    // בקשת היסטוריית הודעות בתחילת הטעינה
    socket.emit("getHistory", { conversationId }, (res) => {
      if (res.ok) setMessages(res.messages);
    });

    // ניקוי אירועים בהורדת הקומפוננטה
    return () => {
      socket.off("newMessage");
    };
  }, [conversationId]);

  const handleSend = () => {
    if (!input.trim()) return;
    socket.emit("sendMessage", {
      conversationId,
      from: localStorage.getItem("businessId"),
      to: "other-business-id", // כאן צריך לדעת את העסק השני
      text: input,
    }, (res) => {
      if (!res.ok) alert("Failed to send message: " + res.error);
      else setInput("");
    });
  };

  return (
    <div>
      <div style={{ height: 400, overflowY: "scroll", border: "1px solid #ccc", padding: 10 }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ marginBottom: 8 }}>
            <b>{msg.businessName || msg.from}</b>: {msg.text || <i>{msg.fileName || "קובץ"}</i>}
          </div>
        ))}
      </div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => { if (e.key === "Enter") handleSend(); }}
        placeholder="הקלד הודעה..."
        style={{ width: "80%" }}
      />
      <button onClick={handleSend} style={{ width: "18%", marginLeft: "2%" }}>שלח</button>
    </div>
  );
}
