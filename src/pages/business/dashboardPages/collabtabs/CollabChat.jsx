// src/pages/business/dashboardPages/collabtabs/CollabChat.jsx

import React, { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import API from "../../../../api";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

const SOCKET_URL = "https://api.esclick.co.il";

export default function CollabChat({
  token,
  myBusinessId,
  myBusinessName,
  onClose,
}) {
  const [socket, setSocket] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  // טען שיחות ב־REST API בלבד
  const fetchConversations = async () => {
    try {
      const res = await API.get("/business-chat/my-conversations", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setConversations(res.data.conversations || []);
      // בחר שיחה ראשונה אם אין נבחרת
      if (
        !selectedConversation &&
        res.data.conversations &&
        res.data.conversations.length > 0
      ) {
        setSelectedConversation(res.data.conversations[0]);
      }
    } catch {
      setConversations([]);
    }
  };

  // התחברות ל־socket.io
  useEffect(() => {
    if (!token || !myBusinessId) return;
    const s = io(SOCKET_URL, {
      path: "/socket.io",
      auth: {
        token,
        role: "business",
        businessId: myBusinessId,
        businessName: myBusinessName,
      },
    });
    setSocket(s);
    fetchConversations();
    return () => s.disconnect();
    // eslint-disable-next-line
  }, [token, myBusinessId, myBusinessName]);

  // טעינת הודעות של שיחה נבחרת
  useEffect(() => {
    if (!selectedConversation) {
      setMessages([]);
      return;
    }
    async function fetchMsgs() {
      const res = await API.get(
        `/business-chat/${selectedConversation._id}/messages`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMessages(res.data.messages || []);
    }
    fetchMsgs();
    // הצטרף לחדר socket.io
    socket?.emit("joinConversation", selectedConversation._id);
    // eslint-disable-next-line
  }, [selectedConversation]);

  // מאזין להודעות חדשות בזמן אמת
  useEffect(() => {
    if (!socket) return;
    const handler = (msg) => {
      if (msg.conversationId === selectedConversation?._id) {
        setMessages((prev) => [...prev, msg]);
      }
      // רענון רשימת השיחות תמיד, כדי ששיחה תופיע מיד בצד השני
      fetchConversations();
    };
    socket.on("newMessage", handler);
    return () => socket.off("newMessage", handler);
    // eslint-disable-next-line
  }, [socket, selectedConversation]);

  // גלילה אוטומטית למטה
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // שליחת הודעה
  const sendMessage = async () => {
    console.log("sendMessage called", { input, selectedConversation });
    if (!input.trim() || !selectedConversation) {
      console.warn("sendMessage aborted: empty input or no selected conversation");
      return;
    }
    const otherBusinessId = selectedConversation.participants.find(
      (id) => id !== myBusinessId
    );
    console.log("Emitting sendMessage event", {
      conversationId: selectedConversation._id,
      from: myBusinessId,
      to: otherBusinessId,
      text: input.trim(),
    });
    socket.emit(
      "sendMessage",
      {
        conversationId: selectedConversation._id,
        from: myBusinessId,
        to: otherBusinessId,
        text: input.trim(),
      },
      (ack) => {
        if (!ack.ok) {
          console.error("SendMessage failed:", ack.error);
          alert("שליחת הודעה נכשלה: " + ack.error);
        } else {
          setInput("");
        }
      }
    );
  };

  // הצגת שם העסק הנגדי
  const getPartnerBusiness = (conv) => {
    if (!conv || !conv.participants || !conv.participantsInfo)
      return { businessName: "עסק" };
    const idx = conv.participants.findIndex((id) => id !== myBusinessId);
    return conv.participantsInfo[idx] || { businessName: "עסק" };
  };

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: 540,
        height: "70vh",
        background: "#f8f7ff",
        borderRadius: "18px",
        boxShadow: 2,
        display: "flex",
        overflow: "hidden",
      }}
    >
      {/* רשימת שיחות */}
      <Box
        sx={{
          width: 270,
          borderLeft: "1px solid #eee",
          background: "#fff",
          overflowY: "auto",
        }}
      >
        <Box
          sx={{
            fontWeight: 700,
            color: "#764ae6",
            fontSize: 19,
            px: 2.5,
            py: 2,
          }}
        >
          הודעות עסקיות
        </Box>
        {conversations.length === 0 && (
          <Box sx={{ p: 3, color: "#bbb", textAlign: "center" }}>
            אין שיחות עסקיות
          </Box>
        )}
        {conversations.map((conv) => {
          const partner = getPartnerBusiness(conv);
          const lastMsg = conv.messages?.length ? conv.messages[conv.messages.length - 1].text : "";
          return (
            <Box
              key={conv._id}
              sx={{
                px: 2.5,
                py: 1.5,
                cursor: "pointer",
                borderBottom: "1px solid #f3f0fa",
                background: selectedConversation?._id === conv._id ? "#f3f0fe" : "#fff",
              }}
              onClick={() => setSelectedConversation(conv)}
            >
              <Box sx={{ fontWeight: 600 }}>{partner.businessName}</Box>
              <Box
                sx={{
                  color: "#7c6ae6",
                  fontSize: 13,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {lastMsg || "אין הודעות"}
              </Box>
            </Box>
          );
        })}
      </Box>
      {/* צ'אט */}
      <Box
        sx={{
          flex: 1,
          position: "relative",
          background: "#f8f7ff",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box sx={{ flex: 1, px: 2, pt: 2, overflowY: "auto" }}>
          {selectedConversation ? (
            <>
              <Box
                sx={{
                  mb: 2,
                  color: "#6d4fc4",
                  fontWeight: 600,
                  fontSize: 17,
                }}
              >
                שיחה עם {getPartnerBusiness(selectedConversation).businessName}
              </Box>
              {messages.map((msg, i) => (
                <Box
                  key={i}
                  sx={{
                    background: msg.fromBusinessId === myBusinessId ? "#e6ddff" : "#fff",
                    alignSelf: msg.fromBusinessId === myBusinessId ? "flex-end" : "flex-start",
                    p: 1.2,
                    borderRadius: 2,
                    mb: 1,
                    maxWidth: 340,
                    boxShadow: 1,
                  }}
                >
                  <Box>{msg.text}</Box>
                  <Box
                    sx={{
                      fontSize: 11,
                      color: "#888",
                      mt: 0.5,
                      textAlign: "left",
                    }}
                  >
                    {msg.timestamp &&
                      new Date(msg.timestamp).toLocaleTimeString("he-IL", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                  </Box>
                </Box>
              ))}
              <div ref={messagesEndRef} />
            </>
          ) : (
            <Box sx={{ color: "#bbb", textAlign: "center", mt: 12 }}>
              בחרי שיחה עסקית מהעמודה הימנית
            </Box>
          )}
        </Box>
        {/* אינפוט */}
        {selectedConversation && (
          <Box
            sx={{
              p: 2,
              borderTop: "1px solid #eee",
              display: "flex",
              gap: 1,
            }}
          >
            <TextField
              fullWidth
              size="small"
              placeholder="כתוב הודעה..."
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
              sx={{ fontWeight: 600 }}
              onClick={sendMessage}
              disabled={!input.trim()}
            >
              שלח
            </Button>
          </Box>
        )}
        {onClose && (
          <Button
            sx={{ position: "absolute", top: 13, left: 18 }}
            onClick={onClose}
          >
            ✖
          </Button>
        )}
      </Box>
    </Box>
  );
}
