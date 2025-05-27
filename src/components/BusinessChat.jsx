// src/components/BusinessChat.jsx

import React, { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import Button from "@mui/material/Button";

const SOCKET_URL = "https://api.esclick.co.il";

export default function BusinessChat({
  token,
  role,
  myBusinessId,
  myBusinessName,
  otherBusinessId,
}) {
  const [socket, setSocket] = useState(null);
  const [conversationId, setConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  // 0) אם אין עדיין מזהה — הצג טוען
  if (!myBusinessId) {
    return <p>טוען זיהוי העסק…</p>;
  }

  // 1) גלילת המסך
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 2) יצירת חיבור Socket.IO (ברירת מחדל, בלי transports)
  useEffect(() => {
    if (!token || !role || !myBusinessId) return;

    const s = io(SOCKET_URL, {
      path: "/socket.io",
      auth: { token, role, businessId: myBusinessId, businessName: myBusinessName },
    });

    s.on("connect", () => console.log("Socket connected:", s.id));
    s.on("disconnect", (reason) => console.log("Socket disconnected:", reason));

    setSocket(s);
    return () => void s.disconnect();
  }, [token, role, myBusinessId, myBusinessName]);

  // 3) התחלת שיחה או שליפת היסטוריה
  useEffect(() => {
    if (!socket || !otherBusinessId) return;

    socket.emit(
      "startConversation",
      { otherUserId: otherBusinessId },
      (res) => {
        if (!res.ok) return console.error("startConversation failed:", res.error);
        setConversationId(res.conversationId);
        socket.emit("joinConversation", res.conversationId, () => {});
        socket.emit(
          "getHistory",
          { conversationId: res.conversationId },
          (h) => h.ok && setMessages(h.messages)
        );
      }
    );
  }, [socket, otherBusinessId]);

  // 4) הקשבה להודעות חדשות
  useEffect(() => {
    if (!socket || !conversationId) return;
    const handler = (msg) => {
      if (msg.conversationId === conversationId) {
        setMessages((prev) => [...prev, msg]);
      }
    };
    socket.on("newMessage", handler);
    return () => void socket.off("newMessage", handler);
  }, [socket, conversationId]);

  // 5) שליחת הודעה
  const sendMessage = () => {
    if (!input.trim() || !socket) return;

    const payload = {
      conversationId,
      from: myBusinessId,
      to: otherBusinessId,
      text: input.trim(),
    };

    const doSend = () =>
      socket.emit("sendMessage", payload, (ack) => {
        if (ack.ok) {
          setMessages((prev) => [...prev, ack.message]);
          setInput("");
        } else {
          alert("שליחת הודעה נכשלה: " + ack.error);
        }
      });

    if (!conversationId) {
      socket.emit(
        "startConversation",
        { otherUserId: otherBusinessId },
        (res) => {
          if (!res.ok) return alert("פתיחת שיחה נכשלה: " + res.error);
          setConversationId(res.conversationId);
          socket.emit("joinConversation", res.conversationId, (ack) =>
            ack.ok ? doSend() : alert("Failed to join: " + ack.error)
          );
        }
      );
    } else {
      doSend();
    }
  };

  return (
    <div
      style={{
        maxWidth: 600,
        margin: "auto",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <h3>צ'אט עסקי</h3>

      <div
        style={{
          border: "1px solid #ccc",
          padding: 10,
          height: 400,
          overflowY: "auto",
          marginBottom: 10,
          backgroundColor: "#f9f9f9",
        }}
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              marginBottom: 8,
              textAlign: msg.from === myBusinessId ? "right" : "left",
            }}
          >
            <b>{msg.from === myBusinessId ? "אני" : "הם"}</b>: {msg.text}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <textarea
        rows={3}
        style={{ width: "100%", resize: "none" }}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="הקלד הודעה..."
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
          }
        }}
      />

      <Button
        type="button"
        variant="contained"
        onClick={sendMessage}
        disabled={!input.trim()}
        sx={{
          mt: 1,
          alignSelf: "flex-end",
          // override הגלובלי index-Z0FAwCce.css:1
          "&:hover": {
            backgroundColor: "primary.dark",
          },
        }}
      >
        שלח
      </Button>
    </div>
  );
}
