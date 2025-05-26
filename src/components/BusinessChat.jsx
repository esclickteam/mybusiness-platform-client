import React, { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";

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

  // גלילת המסך להודעה האחרונה
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  // יצירת חיבור Socket.IO עם אימות (רק פעם אחת)
  useEffect(() => {
    if (!token || !role || !myBusinessId) return;

    const s = io(SOCKET_URL, {
      auth: {
        token,
        role,
        businessId: myBusinessId,
        businessName: myBusinessName,
      },
      path: "/socket.io",
      transports: ["websocket", "polling"],
    });

    s.on("connect", () => {
      console.log("Socket connected:", s.id);
    });

    s.on("disconnect", (reason) => {
      console.log("Socket disconnected:", reason);
    });

    setSocket(s);

    return () => {
      s.disconnect();
    };
  }, [token, role, myBusinessId, myBusinessName]);

  // פתיחת שיחה (או קבלת שיחה קיימת) עם העסק השני
  useEffect(() => {
    if (!socket || !otherBusinessId || !myBusinessId) return;

    socket.emit(
      "startConversation",
      { otherUserId: otherBusinessId },
      (res) => {
        if (res.ok) {
          setConversationId(res.conversationId);

          // הצטרפות ל-room
          socket.emit("joinConversation", res.conversationId, (ack) => {
            if (!ack.ok) {
              console.error("Failed to join conversation:", ack.error);
            }
          });

          // טעינת היסטוריית הודעות
          socket.emit("getHistory", { conversationId: res.conversationId }, (res2) => {
            if (res2.ok) setMessages(res2.messages);
          });
        } else {
          console.error("Failed to start conversation:", res.error);
        }
      }
    );
  }, [socket, otherBusinessId, myBusinessId]);

  // האזנה להודעות חדשות רק לשיחה הנוכחית
  useEffect(() => {
    if (!socket || !conversationId) return;

    const handler = (msg) => {
      if (msg.conversationId === conversationId) {
        setMessages((prev) => [...prev, msg]);
      }
    };

    socket.on("newMessage", handler);
    return () => {
      socket.off("newMessage", handler);
    };
  }, [socket, conversationId]);

  // שליחת הודעה
  const sendMessage = () => {
    console.log("sendMessage triggered");
    if (!input.trim() || !conversationId || !socket) return;

    socket.emit(
      "sendMessage",
      {
        conversationId,
        from: myBusinessId,
        to: otherBusinessId,
        text: input.trim(),
      },
      (ack) => {
        if (ack.ok) {
          setMessages((prev) => [...prev, ack.message]);
          setInput("");
        } else {
          alert("Failed to send message: " + ack.error);
        }
      }
    );
  };

  return (
    <div style={{ maxWidth: 600, margin: "auto" }}>
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
      <button
        onClick={sendMessage}
        disabled={!input.trim() || !conversationId}
        style={{ marginTop: 8, padding: "8px 16px" }}
      >
        שלח
      </button>
    </div>
  );
}
