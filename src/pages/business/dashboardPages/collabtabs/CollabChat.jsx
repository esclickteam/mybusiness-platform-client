// src/pages/business/dashboardPages/collabtabs/CollabChat.jsx

import React, { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import API from "../../../../api";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

import { isTokenExpired } from "../../../../utils/authHelpers";
import { refreshToken } from "../../../../utils/tokenHelpers";

const SOCKET_URL = "https://api.esclick.co.il";

export default function CollabChat({
  token: initialToken,
  myBusinessId,
  myBusinessName,
  onClose,
}) {
  const socketRef = useRef(null);
  const selectedConversationRef = useRef(null);

  const [token, setToken] = useState(initialToken);
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  // Sync selectedConversation to ref for use inside socket listener and for leave/join events
  useEffect(() => {
    selectedConversationRef.current = selectedConversation;
  }, [selectedConversation]);

  useEffect(() => {
    console.log("Input value changed:", JSON.stringify(input));
  }, [input]);

  // Load conversations from API
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

  // Connect to socket.io with token refresh logic
  useEffect(() => {
    if (!token || !myBusinessId) return;

    let isMounted = true;

    async function connectSocket() {
      let validToken = token;

      if (isTokenExpired(validToken)) {
        try {
          validToken = await refreshToken();
          if (isMounted) setToken(validToken);
        } catch (err) {
          console.error("Cannot refresh token, please login again");
          return;
        }
      }

      socketRef.current = io(SOCKET_URL, {
        path: "/socket.io",
        auth: {
          token: validToken,
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
        if (err.message === "jwt expired") {
          socketRef.current.disconnect();
          // אפשר להוסיף כאן רענון טוקן נוסף וניסיון חיבור מחדש אם תרצה
        }
      });

      fetchConversations();
    }

    connectSocket();

    return () => {
      isMounted = false;
      socketRef.current?.disconnect();
    };
  }, [token, myBusinessId, myBusinessName]);

  // Listen for new messages once
  useEffect(() => {
    if (!socketRef.current) return;

    const handler = (msg) => {
      console.log("Received newMessage event:", msg);

      const normalizedMsg = {
        ...msg,
        fromBusinessId: msg.fromBusinessId || msg.from,
        toBusinessId: msg.toBusinessId || msg.to,
      };

      // Update only if message belongs to the selected conversation (using ref)
      if (normalizedMsg.conversationId === selectedConversationRef.current?._id) {
        setMessages((prev) => {
          if (prev.some((m) => m._id === normalizedMsg._id)) return prev;
          return [...prev, normalizedMsg];
        });
      }

      // Update the conversation in the conversations list
      setConversations((prevConvs) =>
        prevConvs.map((conv) => {
          if (conv._id === normalizedMsg.conversationId) {
            const msgs = conv.messages || [];
            if (!msgs.some((m) => m._id === normalizedMsg._id)) {
              return { ...conv, messages: [...msgs, normalizedMsg] };
            }
          }
          return conv;
        })
      );
    };

    socketRef.current.on("newMessage", handler);

    return () => {
      socketRef.current.off("newMessage", handler);
    };
  }, []);

  // Load messages for selected conversation and manage socket rooms
  useEffect(() => {
    if (!socketRef.current) return;

    if (!selectedConversation) {
      setMessages([]);
      return;
    }

    const prevConvId = selectedConversationRef.current?._id;

    // Leave previous room if any
    if (prevConvId && prevConvId !== selectedConversation._id) {
      socketRef.current.emit("leaveConversation", prevConvId, (res) => {
        if (!res.ok) {
          console.warn("Failed to leave previous conversation room:", res.error);
        } else {
          console.log(`Left previous conversation room: ${prevConvId}`);
        }
      });
    }

    // Join new conversation room with acknowledgement
    socketRef.current.emit("joinConversation", selectedConversation._id, (res) => {
      if (!res.ok) {
        console.error("Failed to join conversation room:", res.error);
        return;
      }
      console.log("Joined conversation room:", selectedConversation._id);
    });

    async function fetchMsgs() {
      try {
        console.log("Fetching messages for conversation:", selectedConversation._id);
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
        console.error("Failed fetching messages:", err);
        setMessages([]);
      }
    }
    fetchMsgs();

    // Update ref to current selected conversation
    selectedConversationRef.current = selectedConversation;
  }, [selectedConversation, token]);

  // Auto scroll to last message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Send message through socket and API
  const sendMessage = async () => {
    if (!input.trim() || !selectedConversation) return;
    if (!socketRef.current) return;

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
    if (!otherBusinessId) return;

    const payload = {
      conversationId: selectedConversation._id,
      from: myBusinessId,
      to: otherBusinessId,
      text: input.trim(),
    };

    // Optimistic update
    const optimisticMsg = {
      ...payload,
      timestamp: new Date().toISOString(),
      _id: "pending-" + Math.random().toString(36).substr(2, 9),
      fromBusinessId: payload.from,
      toBusinessId: payload.to,
    };
    setMessages((prev) => [...prev, optimisticMsg]);
    setInput("");

    socketRef.current.emit("sendMessage", payload, (ack) => {
      if (!ack.ok) {
        alert("שליחת הודעה נכשלה: " + ack.error);
        setMessages((prev) => prev.filter((m) => m._id !== optimisticMsg._id));
      } else if (ack.message?._id) {
        setMessages((prev) => {
          const filtered = prev.filter(
            (m) => m._id !== optimisticMsg._id && m._id !== ack.message._id
          );
          const realMsg = {
            ...ack.message,
            fromBusinessId: ack.message.fromBusinessId || ack.message.from,
            toBusinessId: ack.message.toBusinessId || ack.message.to,
          };
          return [...filtered, realMsg];
        });
      }
    });

    try {
      await API.post(
        `/business-chat/${selectedConversation._id}/message`,
        { text: input.trim() },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      console.error("שליחת הודעה ל־API נכשלה", err);
    }
  };

  // Get partner business name
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
      {/* Conversations list */}
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

      {/* Chat area */}
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

        {/* Input area */}
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
                  if (input.trim()) {
                    sendMessage();
                  }
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
