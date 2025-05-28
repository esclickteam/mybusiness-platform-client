import React, { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import API from "../../../../api";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

const SOCKET_URL = "https://api.esclick.co.il"; // כתובת השרת שלך

export default function CollabChat({
  myBusinessId,
  myBusinessName,
  onClose,
}) {
  const socketRef = useRef(null);
  const selectedConversationRef = useRef(null);
  const messagesEndRef = useRef(null);

  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [error, setError] = useState("");

  // טען שיחות עסקיות
  const fetchConversations = async (token) => {
    try {
      const res = await API.get("/business-chat/my-conversations", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const convs = res.data.conversations || [];
      setConversations(convs);
      if (!selectedConversation && convs.length > 0) {
        setSelectedConversation(convs[0]);
      }
    } catch (err) {
      console.error("Failed fetching conversations:", err);
      setConversations([]);
      setError("לא הצלחנו לטעון שיחות");
    }
  };

  // אתחול חיבור לסוקט וטעינת שיחות
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token || !myBusinessId) return;

    const sock = io(SOCKET_URL, {
      path: "/socket.io",
      auth: {
        token,
        role: "business", // תפקיד של עסק
        businessId: myBusinessId,
        businessName: myBusinessName,
      },
    });

    socketRef.current = sock;

    sock.on("connect", () => {
      console.log("Socket connected with id:", sock.id);
      fetchConversations(token);
    });

    sock.on("connect_error", (err) => {
      console.error("Socket connection error:", err);
    });

    return () => {
      sock.disconnect();
    };
  }, [myBusinessId, myBusinessName]);

  // הקשבה להודעות חדשות
  useEffect(() => {
    if (!socketRef.current) return;

    const handler = (msg) => {
      const normalized = {
        ...msg,
        fromBusinessId: msg.fromBusinessId || msg.from,
        toBusinessId: msg.toBusinessId || msg.to,
      };

      // עדכון הודעות בשיחה הנבחרת
      if (normalized.conversationId === selectedConversationRef.current?._id) {
        setMessages((prev) =>
          prev.some((m) => m._id === normalized._id) ? prev : [...prev, normalized]
        );
      }

      // עדכון תצוגת שיחה
      setConversations((prev) =>
        prev.map((conv) =>
          conv._id === normalized.conversationId
            ? { ...conv, messages: [...(conv.messages || []), normalized] }
            : conv
        )
      );
    };

    socketRef.current.on("newMessage", handler);

    return () => {
      socketRef.current.off("newMessage", handler);
    };
  }, []);

  // הצטרפות/עזיבת שיחות וטעינת היסטוריית הודעות
  useEffect(() => {
    const sock = socketRef.current;
    if (!sock || !selectedConversation) {
      setMessages([]);
      return;
    }

    const prevId = selectedConversationRef.current?._id;
    if (prevId && prevId !== selectedConversation._id) {
      sock.emit("leaveConversation", prevId);
    }

    sock.emit("joinConversation", selectedConversation._id);

    (async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await API.get(
          `/business-chat/${selectedConversation._id}/messages`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const normMsgs = (res.data.messages || []).map((msg) => ({
          ...msg,
          fromBusinessId: msg.fromBusinessId || msg.from,
          toBusinessId: msg.toBusinessId || msg.to,
        }));
        setMessages(normMsgs);
      } catch (err) {
        console.error("Fetch messages failed:", err);
        setMessages([]);
      }
    })();

    selectedConversationRef.current = selectedConversation;
  }, [selectedConversation]);

  // גלילה אוטומטית על הודעה חדשה
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // שליחת הודעה
  const sendMessage = () => {
    if (!input.trim() || !selectedConversation || !socketRef.current) return;

    const otherId =
      selectedConversation.participantsInfo?.find((b) => b._id !== myBusinessId)?._id ||
      selectedConversation.participants.find((id) => id !== myBusinessId);

    const payload = {
      conversationId: selectedConversation._id,
      from: myBusinessId,
      to: otherId,
      text: input.trim(),
    };

    const optimistic = {
      ...payload,
      timestamp: new Date().toISOString(),
      _id: "pending-" + Math.random().toString(36).substr(2, 9),
      fromBusinessId: payload.from,
      toBusinessId: payload.to,
    };

    setMessages((prev) => [...prev, optimistic]);
    setInput("");

    socketRef.current.emit("sendMessage", payload, (ack) => {
      if (!ack.ok) {
        alert("שליחת הודעה נכשלה: " + ack.error);
        setMessages((prev) => prev.filter((m) => m._id !== optimistic._id));
      } else if (ack.message?._id) {
        const real = {
          ...ack.message,
          fromBusinessId: ack.message.fromBusinessId || ack.message.from,
          toBusinessId: ack.message.toBusinessId || ack.message.to,
        };
        setMessages((prev) => [
          ...prev.filter((m) => m._id !== optimistic._id),
          real,
        ]);
      }
    });

    // גם שלח ל-API לשמירה
    API.post(
      `/business-chat/${selectedConversation._id}/message`,
      { text: optimistic.text },
      { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
    ).catch((err) => {
      console.error("שליחת הודעה ל־API נכשלה", err);
    });
  };

  // עזרה להוצאת פרטי השותף בשיחה
  const getPartnerBusiness = (conv) => {
    const idx = conv.participants.findIndex((id) => id !== myBusinessId);
    return conv.participantsInfo?.[idx] || { businessName: "עסק" };
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
          const lastMsg = conv.messages?.slice(-1)[0]?.text || "";
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

      {/* אזור צ'אט */}
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
                שיחה עם{" "}
                {getPartnerBusiness(selectedConversation).businessName}
              </Box>
              {messages.map((msg, i) => (
                <Box
                  key={msg._id || i}
                  sx={{
                    background:
                      msg.fromBusinessId === myBusinessId
                        ? "#e6ddff"
                        : "#fff",
                    alignSelf:
                      msg.fromBusinessId === myBusinessId
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

        {/* אזור הזנת הודעה */}
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
