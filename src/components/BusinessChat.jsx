// src/components/BusinessChat.jsx

import React, { useEffect, useState, useRef, useCallback } from "react";
import { io } from "socket.io-client";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

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

  // גלילת המסך לתחתית בהודעות
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // אתחול או טעינת שיחה
  const initConversation = useCallback(() => {
    if (!socket || !otherBusinessId) return;
    console.log("▶️ initConversation to", otherBusinessId);

    socket.emit(
      "startConversation",
      { otherUserId: otherBusinessId },
      (res) => {
        console.log("↩️ startConversation response:", res);
        if (!res.ok) return console.error(res.error);
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

  // הקמת חיבור Socket.IO — רץ פעם אחת בלבד
  useEffect(() => {
    if (!token || !role || !myBusinessId) {
      console.warn("🚫 missing token/role/myBusinessId — skipping socket connect");
      return;
    }

    console.log("🔌 Connecting socket with:", { role, myBusinessId });
    const s = io(SOCKET_URL, {
      path: "/socket.io",
      auth: { token, role, businessId: myBusinessId, businessName: myBusinessName },
    });

    s.on("connect", () => {
      console.log("✅ Socket connected:", s.id);
      // הפעל initConversation אחרי חיבור
      initConversation();
    });

    s.on("disconnect", (reason) => {
      console.log("❌ Socket disconnected:", reason);
    });

    setSocket(s);
    return () => {
      console.log("🛑 Disconnecting socket");
      s.disconnect();
    };
  }, [token, role, myBusinessId, myBusinessName]); // הסרנו initConversation מהרשימה

  // חיבור מאזין להודעות חדשות
  useEffect(() => {
    if (!socket) return;
    const handler = (msg) => {
      console.log("📥 newMessage:", msg);
      if (msg.conversationId === conversationId) {
        setMessages((prev) => [...prev, msg]);
      }
    };
    socket.on("newMessage", handler);
    return () => socket.off("newMessage", handler);
  }, [socket, conversationId]);

  // אתחול שיחה במקרה ש-otherBusinessId משתנה אחרי החיבור
  useEffect(() => {
    if (socket?.connected && otherBusinessId) {
      initConversation();
    }
  }, [otherBusinessId, socket, initConversation]);

  // שליחת הודעה
  const sendMessage = () => {
    console.log("▶️ sendMessage()", { conversationId, text: input });
    if (!input.trim() || !socket) {
      console.warn("🚫 Abort send (empty or no socket)");
      return;
    }

    const payload = {
      conversationId,
      from: myBusinessId,
      to: otherBusinessId,
      text: input.trim(),
    };
    console.log("🚀 Emitting sendMessage:", payload);

    socket.emit("sendMessage", payload, (ack) => {
      console.log("↩️ sendMessage ack:", ack);
      if (ack.ok) {
        setMessages((prev) => [...prev, ack.message]);
        setInput("");
      } else {
        console.error("❗️ sendMessage failed:", ack.error);
        alert("שליחת הודעה נכשלה: " + ack.error);
      }
    });
  };

  // UI
  return (
    <div style={{ maxWidth: 600, margin: "auto", display: "flex", flexDirection: "column" }}>
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
            style={{ marginBottom: 8, textAlign: msg.from === myBusinessId ? "right" : "left" }}
          >
            <b>{msg.from === myBusinessId ? "אני" : "הם"}</b>: {msg.text}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <TextField
        fullWidth
        multiline
        maxRows={4}
        placeholder="הקלד הודעה..."
        value={input}
        onChange={(e) => {
          console.log("✏️ input:", e.target.value);
          setInput(e.target.value);
        }}
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
        disabled={!input.trim()}
        sx={{ mt: 1, alignSelf: "flex-end" }}
      >
        שלח
      </Button>
    </div>
  );
}
