import React, { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import Button from "@mui/material/Button";  // הוסף

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

  // אם עדיין אין מזהה עסק — מוציא הודעה זמנית
  if (!myBusinessId) {
    return <p>טוען זיהוי העסק…</p>;
  }

  // גלילה להודעה האחרונה
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(scrollToBottom, [messages]);

  // 1) יצירת חיבור socket רק אחרי שיש כל התלויות
  useEffect(() => {
    if (!token || !role || !myBusinessId) return;

    const s = io(SOCKET_URL, {
      path: "/socket.io",
      auth: {
        token,
        role,
        businessId: myBusinessId,
        businessName: myBusinessName
      }
    });

    s.on("connect", () => console.log("Socket connected:", s.id));
    s.on("disconnect", (reason) => console.log("Socket disconnected:", reason));

    setSocket(s);
    return () => {
      s.disconnect();
    };
  }, [token, role, myBusinessId, myBusinessName]);

  // 2) פתיחה או שליפת שיחה קיימת
  useEffect(() => {
    if (!socket || !otherBusinessId) return;

    console.log("Starting conversation with", otherBusinessId);
    socket.emit(
      "startConversation",
      { otherUserId: otherBusinessId },
      (res) => {
        if (res.ok) {
          setConversationId(res.conversationId);

          socket.emit("joinConversation", res.conversationId, (ack) => {
            if (!ack.ok) console.error("joinConversation failed:", ack.error);
          });

          socket.emit(
            "getHistory",
            { conversationId: res.conversationId },
            (res2) => {
              if (res2.ok) setMessages(res2.messages);
            }
          );
        } else {
          console.error("startConversation failed:", res.error);
        }
      }
    );
  }, [socket, otherBusinessId]);

  // 3) הקשבה להודעות חדשות
  useEffect(() => {
    if (!socket || !conversationId) return;

    const handleNew = (msg) => {
      if (msg.conversationId === conversationId) {
        console.log("Received new message", msg);
        setMessages((prev) => [...prev, msg]);
      }
    };

    socket.on("newMessage", handleNew);
    return () => {
      socket.off("newMessage", handleNew);
    };
  }, [socket, conversationId]);

  // 4) פונקציית שליחת הודעה
  const sendMessage = () => {
    if (!input.trim() || !socket) return;

    const payload = {
      conversationId,
      from: myBusinessId,
      to: otherBusinessId,
      text: input.trim(),
    };

    const emitSend = () => {
      socket.emit("sendMessage", payload, (ack) => {
        if (ack.ok) {
          setMessages((prev) => [...prev, ack.message]);
          setInput("");
        } else {
          alert("שליחת הודעה נכשלה: " + ack.error);
        }
      });
    };

    if (!conversationId) {
      // אם אין שיחה — פותחים קודם
      socket.emit(
        "startConversation",
        { otherUserId: otherBusinessId },
        (res) => {
          if (res.ok) {
            setConversationId(res.conversationId);
            socket.emit("joinConversation", res.conversationId, (ack) => {
              if (!ack.ok) {
                alert("לא הצלחנו להצטרף לשיחה: " + ack.error);
                return;
              }
              emitSend();
            });
          } else {
            alert("פתיחת שיחה נכשלה: " + res.error);
          }
        }
      );
    } else {
      emitSend();
    }
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
      {/* החלפת כפתור HTML רגיל ב־MUI Button */}
      <Button
        type="button"
        variant="contained"
        onClick={sendMessage}
        disabled={!input.trim()}
        sx={{ mt: 1, alignSelf: "flex-end" }}
      >
        שלח
      </Button>
    </div>
  );
}
