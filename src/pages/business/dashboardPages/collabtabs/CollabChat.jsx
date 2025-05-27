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
  const socketRef = useRef(null);
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  // טען שיחות מ-API
  const fetchConversations = async () => {
    try {
      console.log("Fetching conversations...");
      const res = await API.get("/business-chat/my-conversations", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Fetched conversations:", res.data.conversations);
      setConversations(res.data.conversations || []);
      if (
        !selectedConversation &&
        res.data.conversations &&
        res.data.conversations.length > 0
      ) {
        setSelectedConversation(res.data.conversations[0]);
      }
    } catch (err) {
      console.error("Failed fetching conversations:", err);
      setConversations([]);
    }
  };

  // התחברות ל-socket.io פעם אחת
  useEffect(() => {
    if (!token || !myBusinessId) return;

    console.log("Connecting to socket...");
    socketRef.current = io(SOCKET_URL, {
      path: "/socket.io",
      auth: {
        token,
        role: "business",
        businessId: myBusinessId,
        businessName: myBusinessName,
      },
    });

    socketRef.current.on("connect", () => {
      console.log("Socket connected with id:", socketRef.current.id);
    });

    socketRef.current.on("connect_error", (err) => {
      console.error("Socket connection error:", err);
    });

    fetchConversations();

    return () => {
      console.log("Disconnecting socket...");
      socketRef.current.disconnect();
    };
    // eslint-disable-next-line
  }, [token, myBusinessId, myBusinessName]);

  // מאזין להודעות חדשות
  useEffect(() => {
    if (!socketRef.current) return;

    const handler = (msg) => {
      console.log("Received newMessage event:", msg);

      // אם ההודעה שייכת לשיחה הנבחרת - עדכן את ההודעות
      if (msg.conversationId === selectedConversation?._id) {
        console.log("Appending new message to messages state");
        setMessages((prev) => [...prev, msg]);
      }

      // עדכן את רשימת השיחות עם ההודעה החדשה כדי לשמור סנכרון
      setConversations((prevConvs) =>
        prevConvs.map((conv) => {
          if (conv._id === msg.conversationId) {
            const updatedMessages = conv.messages ? [...conv.messages, msg] : [msg];
            console.log(`Updating conversation ${conv._id} messages count:`, updatedMessages.length);
            return { ...conv, messages: updatedMessages };
          }
          return conv;
        })
      );
    };

    socketRef.current.on("newMessage", handler);

    return () => {
      socketRef.current.off("newMessage", handler);
    };
  }, [selectedConversation]);

  // טעינת הודעות בשיחה נבחרת ויצירת חדר ב-socket
  useEffect(() => {
    if (!socketRef.current) return;

    if (!selectedConversation) {
      setMessages([]);
      return;
    }

    console.log("Leaving previous conversation room and joining new one:", selectedConversation._id);
    socketRef.current.emit("leaveConversation");
    socketRef.current.emit("joinConversation", selectedConversation._id);

    async function fetchMsgs() {
      try {
        console.log("Fetching messages for conversation:", selectedConversation._id);
        const res = await API.get(
          `/business-chat/${selectedConversation._id}/messages`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log("Fetched messages:", res.data.messages.length);
        setMessages(res.data.messages || []);
      } catch (err) {
        console.error("Failed fetching messages:", err);
        setMessages([]);
      }
    }
    fetchMsgs();
    // eslint-disable-next-line
  }, [selectedConversation]);

  // גלילה אוטומטית להודעה האחרונה
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // שליחת הודעה דרך ה-socket
  const sendMessage = () => {
    if (!input.trim() || !selectedConversation) {
      console.log("SendMessage aborted: input empty or no conversation selected");
      return;
    }
    if (!socketRef.current) {
      console.log("SendMessage aborted: socket not connected");
      return;
    }

    let otherBusinessId;
    if (selectedConversation.participantsInfo?.length) {
      const otherBiz = selectedConversation.participantsInfo.find(
        (b) => b._id.toString() !== myBusinessId.toString()
      );
      otherBusinessId = otherBiz?._id;
    } else {
      otherBusinessId = selectedConversation.participants.find(
        (id) => id.toString() !== myBusinessId.toString()
      );
    }
    if (!otherBusinessId) {
      console.log("SendMessage aborted: could not determine otherBusinessId");
      return;
    }

    const payload = {
      conversationId: selectedConversation._id,
      from: myBusinessId,
      to: otherBusinessId,
      text: input.trim(),
    };

    console.log("Sending message payload:", payload);
    socketRef.current.emit("sendMessage", payload, (ack) => {
      if (!ack.ok) {
        alert("שליחת הודעה נכשלה: " + ack.error);
        console.error("SendMessage failed:", ack.error);
      } else {
        console.log("Message sent successfully, updating local messages state");
        const newMsg = {
          conversationId: payload.conversationId,
          fromBusinessId: payload.from,
          toBusinessId: payload.to,
          text: payload.text,
          timestamp: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, newMsg]);
        setInput("");
      }
    });
  };

  // הצגת שם העסק הנגדי בשיחה
  const getPartnerBusiness = (conv) => {
    if (!conv || !conv.participants || !conv.participantsInfo)
      return { businessName: "עסק" };
    const idx = conv.participants.findIndex(
      (id) => id.toString() !== myBusinessId.toString()
    );
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
          const lastMsg = conv.messages?.length
            ? conv.messages[conv.messages.length - 1].text
            : "";
          return (
            <Box
              key={conv._id}
              sx={{
                px: 2.5,
                py: 1.5,
                cursor: "pointer",
                borderBottom: "1px solid #f3f0fa",
                background:
                  selectedConversation?._id === conv._id ? "#f3f0fe" : "#fff",
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
                    background:
                      msg.fromBusinessId?.toString() === myBusinessId.toString()
                        ? "#e6ddff"
                        : "#fff",
                    alignSelf:
                      msg.fromBusinessId?.toString() === myBusinessId.toString()
                        ? "flex-end"
                        : "flex-start",
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

        {/* אינפוט להקלדת הודעה */}
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
