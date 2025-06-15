import React, { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import API from "../../../../api";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { useAuth } from "../../../../context/AuthContext";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "https://api.esclick.co.il";

export default function CollabChat({ myBusinessId, myBusinessName, onClose }) {
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  const { refreshAccessToken, logout } = useAuth();

  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [isSending, setIsSending] = useState(false);

  // טען שיחות עסקיות
  const fetchConversations = async (token) => {
    try {
      const res = await API.get("/business-chat/my-conversations", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const convs = res.data.conversations || [];
      console.log("Fetched conversations:", convs.length);
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

  // אתחול חיבור לסוקט וטעינת שיחות - עם מניעת התחברות כפולה
  useEffect(() => {
    if (socketRef.current) {
      console.log("Socket already initialized, skipping setup");
      return;
    }
    console.log("Setting up socket connection");

    async function setupSocket() {
      const token = await refreshAccessToken();
      if (!token || !myBusinessId) {
        console.warn("No token or businessId, aborting socket setup");
        return;
      }

      const sock = io(SOCKET_URL, {
        path: "/socket.io",
        auth: {
          token,
          role: "business",
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

      sock.on("tokenExpired", async () => {
        console.log("Token expired, refreshing...");
        const newToken = await refreshAccessToken();
        if (!newToken) {
          logout();
          return;
        }
        sock.auth.token = newToken;
        sock.disconnect();
        sock.connect();
      });
    }

    setupSocket();

    return () => {
      if (socketRef.current) {
        console.log("Disconnecting socket");
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [myBusinessId, myBusinessName, refreshAccessToken, logout]);

  // הצטרפות/עזיבת שיחות וטעינת היסטוריית הודעות
  useEffect(() => {
    const sock = socketRef.current;
    if (!sock || !selectedConversation) {
      setMessages([]);
      return;
    }

    const prevId = selectedConversation?._id;
    console.log("Joining conversation:", prevId);
    sock.emit("joinConversation", prevId);

    (async () => {
      try {
        const token = await refreshAccessToken();
        const res = await API.get(`/business-chat/${prevId}/messages`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const normMsgs = (res.data.messages || []).map((msg) => ({
          ...msg,
          fromBusinessId: msg.fromBusinessId || msg.from,
          toBusinessId: msg.toBusinessId || msg.to,
        }));
        console.log(`Fetched ${normMsgs.length} messages for conversation ${prevId}`);
        setMessages(normMsgs);
      } catch (err) {
        console.error("Fetch messages failed:", err);
        setMessages([]);
      }
    })();

    return () => {
      console.log("Leaving conversation:", prevId);
      sock.emit("leaveConversation", prevId);
    };
  }, [selectedConversation, refreshAccessToken]);

  // הקשבה להודעות חדשות - מאזינים ומתעדכנים בהתאם לשיחה הנבחרת
  useEffect(() => {
    if (!socketRef.current) return;
    if (!selectedConversation) return;

    const handler = (msg) => {
      console.log("Received newMessage event:", msg._id, msg.text);

      const normalized = {
        ...msg,
        fromBusinessId: msg.fromBusinessId || msg.from,
        toBusinessId: msg.toBusinessId || msg.to,
      };

      if (normalized.conversationId === selectedConversation._id) {
        setMessages((prev) =>
          prev.some((m) => m._id === normalized._id) ? prev : [...prev, normalized]
        );
      }

      setConversations((prev) =>
        prev.map((conv) =>
          conv._id === normalized.conversationId
            ? { ...conv, messages: [...(conv.messages || []), normalized] }
            : conv
        )
      );
    };

    console.log("Registering newMessage listener");
    socketRef.current.on("newMessage", handler);

    return () => {
      console.log("Removing newMessage listener");
      socketRef.current.off("newMessage", handler);
    };
  }, [selectedConversation]);

  // גלילה אוטומטית על הודעה חדשה
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // שליחת הודעה עם מניעת שידור כפול
  const sendMessage = () => {
    console.log("sendMessage triggered", { input, isSending });
    if (isSending) {
      console.warn("sendMessage ignored, already sending");
      return;
    }
    if (!input.trim() || !selectedConversation || !socketRef.current) {
      console.warn("sendMessage aborted, missing input or selectedConversation or socket");
      return;
    }

    setIsSending(true);

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
      setIsSending(false);
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
  };

  // הוצאת שם השותף בשיחה
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

      {/* אזור הצ'אט */}
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
                  key={msg._id || i}
                  sx={{
                    background:
                      msg.fromBusinessId === myBusinessId ? "#e6ddff" : "#fff",
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

        {/* אזור הזנת הודעה - כטופס */}
        {selectedConversation && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!isSending && input.trim()) {
                sendMessage();
              }
            }}
            style={{
              display: "flex",
              gap: 8,
              padding: 16,
              borderTop: "1px solid #eee",
            }}
          >
            <TextField
              fullWidth
              size="small"
              placeholder="כתוב הודעה..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              autoComplete="off"
            />
            <Button
              type="submit"
              variant="contained"
              sx={{ fontWeight: 600 }}
              disabled={!input.trim() || isSending}
            >
              שלח
            </Button>
          </form>
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
