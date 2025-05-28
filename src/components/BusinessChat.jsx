// src/components/BusinessChat.jsx
import React, { useEffect, useState, useRef, useCallback } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { useAuth } from "../context/AuthContext";
import { createSocket } from "../socket";

export default function BusinessChat({ otherBusinessId }) {
  const { initialized, refreshToken } = useAuth();
  const myBusinessId = getBusinessId();
  const myBusinessName = useAuth().user?.businessName;

  const socketRef = useRef(null);
  const [conversationId, setConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);
  const prevOtherRef = useRef(null);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 1. Initialize socket once
  useEffect(() => {
    if (!initialized || !otherBusinessId || !myBusinessId) return;
    let sock;
    (async () => {
      try {
        const token = await ensureValidToken();
        sock = createSocket();
        sock.auth = {
          token,
          role: "business",
          businessId: myBusinessId,
          businessName: myBusinessName
        };
        sock.connect();
        socketRef.current = sock;
      } catch (e) {
        console.error("Socket init failed:", e);
      }
    })();
    return () => sock?.disconnect();
  }, [initialized, otherBusinessId, myBusinessId, myBusinessName, refreshToken]);

  // 2. init or switch conversation when otherBusinessId changes
  const initConv = useCallback(() => {
    const sock = socketRef.current;
    if (!sock) return;
    sock.emit("startConversation", { otherBusinessId }, (res) => {
      if (!res.ok) return console.error(res.error);
      const convId = res.conversationId;
      sock.emit("joinConversation", convId, (ack) => {
        if (!ack.ok) return console.error(ack.error);
        setConversationId(convId);
        sock.emit("getHistory", { conversationId: convId }, (h) => {
          if (h.ok) setMessages(h.messages);
        });
      });
    });
  }, [otherBusinessId]);

  useEffect(() => {
    const sock = socketRef.current;
    if (!sock?.connected || !otherBusinessId) return;
    if (prevOtherRef.current !== otherBusinessId) {
      prevOtherRef.current = otherBusinessId;
      initConv();
    }
  }, [socketRef.current?.connected, otherBusinessId, initConv]);

  // 3. Listen for new messages
  useEffect(() => {
    const sock = socketRef.current;
    if (!sock || !conversationId) return;
    const handler = (msg) => {
      if (msg.conversationId === conversationId) {
        setMessages((prev) => [...prev, msg]);
      }
    };
    sock.on("newMessage", handler);
    return () => sock.off("newMessage", handler);
  }, [conversationId]);

  // 4. Send message
  const sendMessage = () => {
    const sock = socketRef.current;
    if (!input.trim() || !sock || !conversationId) return;
    const payload = {
      conversationId,
      from: myBusinessId,
      to: otherBusinessId,
      text: input.trim()
    };
    sock.emit("sendMessage", payload, (ack) => {
      if (ack.ok) {
        setMessages((prev) => [...prev, ack.message]);
        setInput("");
      } else {
        console.error("sendMessage failed:", ack.error);
        alert("שליחת הודעה נכשלה: " + ack.error);
      }
    });
  };

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
          backgroundColor: "#f9f9f9"
        }}
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              marginBottom: 8,
              textAlign: msg.from === myBusinessId ? "right" : "left"
            }}
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
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) =>
          e.key === "Enter" && !e.shiftKey && (e.preventDefault(), sendMessage())
        }
      />
      <Button
        variant="contained"
        onClick={sendMessage}
        disabled={!input.trim() || !conversationId}
        sx={{ mt: 1, alignSelf: "flex-end" }}
      >
        שלח
      </Button>
    </div>
  );
}
