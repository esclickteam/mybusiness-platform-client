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
    console.log("⌛ טוען מזהה העסק...");
    return <p>טוען זיהוי העסק…</p>;
  }

  // 1) גלילת המסך
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 2) יצירת חיבור Socket.IO
  useEffect(() => {
    if (!token || !role || !myBusinessId) {
      console.warn("אין token/role/ח.ז.עסק, לא מתחבר ל־socket");
      return;
    }

    console.log("🔌 Connecting socket with", { token, role, myBusinessId });
    const s = io(SOCKET_URL, {
      path: "/socket.io",
      auth: { token, role, businessId: myBusinessId, businessName: myBusinessName },
    });

    s.on("connect", () => console.log("✅ Socket connected:", s.id));
    s.on("disconnect", (reason) => console.log("❌ Socket disconnected:", reason));

    setSocket(s);
    return () => {
      console.log("🛑 Disconnecting socket");
      s.disconnect();
    };
  }, [token, role, myBusinessId, myBusinessName]);

  // 3) התחלת שיחה או שליפת היסטוריה
  useEffect(() => {
    if (!socket || !otherBusinessId) {
      console.warn("אין socket/otherBusinessId, לא מתחיל שיחה");
      return;
    }

    console.log("▶️ startConversation to", otherBusinessId);
    socket.emit(
      "startConversation",
      { otherUserId: otherBusinessId },
      (res) => {
        console.log("↩️ startConversation response:", res);
        if (!res.ok) return console.error("startConversation failed:", res.error);
        setConversationId(res.conversationId);
        socket.emit("joinConversation", res.conversationId, (ack) =>
          console.log("↩️ joinConversation ack:", ack)
        );
        socket.emit(
          "getHistory",
          { conversationId: res.conversationId },
          (h) => {
            console.log("↩️ getHistory:", h);
            if (h.ok) setMessages(h.messages);
          }
        );
      }
    );
  }, [socket, otherBusinessId]);

  // 4) הקשבה להודעות חדשות
  useEffect(() => {
    if (!socket || !conversationId) return;

    const handler = (msg) => {
      console.log("📥 newMessage:", msg);
      if (msg.conversationId === conversationId) {
        setMessages((prev) => [...prev, msg]);
      }
    };
    socket.on("newMessage", handler);
    return () => {
      socket.off("newMessage", handler);
    };
  }, [socket, conversationId]);

  // 5) שליחת הודעה
  const sendMessage = () => {
    console.log("▶️ sendMessage()", { conversationId, input, socket: !!socket });
    if (!input.trim() || !socket) {
      console.warn("אין מה לשלוח או שאין socket, abort");
      return;
    }

    const payload = {
      conversationId,
      from: myBusinessId,
      to: otherBusinessId,
      text: input.trim(),
    };

    const doSend = () => {
      console.log("🚀 emitting sendMessage", payload);
      socket.emit("sendMessage", payload, (ack) => {
        console.log("↩️ sendMessage ack:", ack);
        if (ack.ok) {
          setMessages((prev) => [...prev, ack.message]);
          setInput("");
        } else {
          console.error("❗️שליחה נכשלה:", ack.error);
          alert("שליחת הודעה נכשלה: " + ack.error);
        }
      });
    };

    if (!conversationId) {
      console.log("❓ עדיין בלי conversationId, מפתח שיחה קודם");
      socket.emit(
        "startConversation",
        { otherUserId: otherBusinessId },
        (res) => {
          console.log("↩️ startConversation (in send) =>", res);
          if (!res.ok) return alert("פתיחת שיחה נכשלה: " + res.error);
          setConversationId(res.conversationId);
          socket.emit("joinConversation", res.conversationId, (ack) => {
            console.log("↩️ joinConversation (in send) =>", ack);
            ack.ok ? doSend() : alert("Failed to join: " + ack.error);
          });
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
        onChange={(e) => {
          console.log("✏️ input changed:", e.target.value);
          setInput(e.target.value);
        }}
        placeholder="הקלד הודעה..."
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
          }
        }}
      />

      <Button
        variant="contained"
        onClick={() => {
          console.log("👆 Button clicked");
          sendMessage();
        }}
        sx={{ mt: 1, alignSelf: "flex-end" }}
      >
        שלח
      </Button>
    </div>
  );
}
