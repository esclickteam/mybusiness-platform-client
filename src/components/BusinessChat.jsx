import React, { useEffect, useState, useRef, useCallback } from "react";
import { io } from "socket.io-client";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { useAuth } from "../context/AuthContext";

import { getSocketUrl } from "../config/runtimeUrls";

const SOCKET_URL = getSocketUrl();

export default function BusinessChat({
  token,
  role,
  myBusinessId,
  myBusinessName,
  otherBusinessId,
  getValidAccessToken,
  onLogout,
}) {
  const { refreshAccessToken } = useAuth();
  const [socket, setSocket] = useState(null);
  const [conversationId, setConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [firstMessageSent, setFirstMessageSent] = useState(false);
  const messagesEndRef = useRef(null);

  const previousOtherBusinessId = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const initConversation = useCallback(() => {
    if (!socket || !otherBusinessId) return;
    console.log("▶️ initConversation to", otherBusinessId);

    socket.emit("startConversation", { otherUserId: otherBusinessId }, (res) => {
      if (typeof res !== "object" || res === null) {
        console.warn("Invalid startConversation response:", res);
        return;
      }
      console.log("↩️ startConversation response:", res);
      if (!res.ok) return console.error(res.error);

      socket.emit("joinConversation", res.conversationId, (ack) => {
        if (typeof ack !== "object" || ack === null) {
          console.warn("Invalid joinConversation ack:", ack);
          return;
        }
        console.log("↩️ joinConversation ack:", ack);
        if (!ack.ok) {
          console.error("Failed to join conversation:", ack.error);
          return;
        }
        setConversationId(res.conversationId);

        socket.emit("getHistory", { conversationId: res.conversationId }, (h) => {
          if (typeof h !== "object" || h === null) {
            console.warn("Invalid getHistory response:", h);
            return;
          }
          console.log("↩️ getHistory:", h);
          if (h.ok) {
            setMessages(h.messages);
            // ✅ אם ההיסטוריה מכילה הודעה אחת בלבד — זו ההודעה הראשונה שכבר נשלחה
            if (h.messages.length === 1) setFirstMessageSent(true);
          }

          // Mark messages as read
          socket.emit("markMessagesRead", res.conversationId, (ackMark) => {
            if (!ackMark?.ok) {
              console.warn("Failed to mark messages as read:", ackMark?.error);
            } else {
              console.log("Marked messages as read");
            }
          });
        });
      });
    });
  }, [socket, otherBusinessId]);

  useEffect(() => {
    if (!socket || !socket.connected || !otherBusinessId) return;

    if (previousOtherBusinessId.current !== otherBusinessId) {
      previousOtherBusinessId.current = otherBusinessId;
      initConversation();
    }
  }, [socket, otherBusinessId, initConversation]);

  useEffect(() => {
    if (!token || !role || !myBusinessId) {
      console.warn("🚫 missing token/role/myBusinessId — skipping socket connect");
      return;
    }

    console.log("🔌 Connecting socket with:", { role, myBusinessId });
    const s = io(SOCKET_URL, {
      path: "/socket.io",
      auth: { token, role, businessId: myBusinessId, businessName: myBusinessName },
      transports: ["websocket"],
    });

    s.on("connect", () => {
      console.log("✅ Socket connected:", s.id);
    });

    s.on("disconnect", (reason) => {
      console.log("❌ Socket disconnected:", reason);
    });

    s.on("tokenExpired", async () => {
      console.log("🚨 Token expired, refreshing...");
      const refreshFn = getValidAccessToken || refreshAccessToken;
      if (!refreshFn) {
        console.error("No refresh token function available");
        if (onLogout) onLogout();
        return;
      }
      const newToken = await refreshFn();
      if (!newToken) {
        if (onLogout) onLogout();
        return;
      }
      s.auth.token = newToken;
      s.disconnect();
      s.connect();
    });

    s.on("connect_error", (err) => {
      console.error("❌ Socket connect error:", err.message);
    });

    setSocket(s);

    return () => {
      console.log("🛑 Disconnecting socket");
      s.disconnect();
    };
  }, [token, role, myBusinessId, myBusinessName, getValidAccessToken, refreshAccessToken, onLogout]);

  // Listener for new messages
  useEffect(() => {
    if (!socket || !conversationId) return;

    socket.emit("joinConversation", conversationId, (ack) => {
      if (!ack?.ok) {
        console.error("Failed to join conversation:", ack?.error);
      } else {
        console.log(`Joined conversation room ${conversationId}`);
      }
    });

    const handler = (msg) => {
      console.log("📥 newMessage:", msg);
      if (msg.conversationId === conversationId) {
        setMessages((prev) => [...prev, msg]);
        socket.emit("markMessagesRead", conversationId);
      }
    };

    socket.on("newMessage", handler);
    return () => socket.off("newMessage", handler);
  }, [socket, conversationId]);

  /* ===========================================================
     SEND MESSAGE (כולל מניעת כפילויות)
  ============================================================ */
  const sendMessage = () => {
    console.log("▶️ sendMessage()", { conversationId, text: input });
    if (!input.trim() || !socket || !conversationId) {
      console.warn("🚫 Abort send (empty or no socket or no conversationId)");
      return;
    }

    // 🧩 מניעת כפילות בהודעה הראשונה
    if (firstMessageSent && messages.length === 1 && messages[0].text === input.trim()) {
      console.log("⏩ Skipped duplicate first message:", input);
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
      if (typeof ack !== "object" || ack === null) {
        console.warn("Invalid sendMessage ack:", ack);
        return;
      }
      console.log("↩️ sendMessage ack:", ack);
      if (ack.ok) {
        setMessages((prev) => [...prev, ack.message]);
        setInput("");
        setFirstMessageSent(true); // ✅ מסמן שההודעה הראשונה נשלחה
      } else {
        console.error("❗️ sendMessage failed:", ack.error);
        alert("Message sending failed: " + ack.error);
      }
    });
  };

  return (
    <div style={{ maxWidth: 600, margin: "auto", display: "flex", flexDirection: "column" }}>
      <h3>Business Chat</h3>

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
            <b>{msg.from === myBusinessId ? "Me" : "Them"}</b>: {msg.text}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <TextField
        fullWidth
        multiline
        maxRows={4}
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

      <Button
        variant="contained"
        onClick={sendMessage}
        disabled={!input.trim() || !conversationId}
        sx={{ mt: 1, alignSelf: "flex-end" }}
      >
        Send
      </Button>
    </div>
  );
}
