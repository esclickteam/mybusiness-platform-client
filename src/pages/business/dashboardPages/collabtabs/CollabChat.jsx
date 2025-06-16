import React, { useEffect, useState, useRef, useCallback } from "react";
import { io } from "socket.io-client";
import API from "../../../../api";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { useAuth } from "../../../../context/AuthContext";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "https://api.esclick.co.il";

export default function CollabChat({ myBusinessId, myBusinessName, onClose }) {
  const socketRef = useRef(null);
  const socketInitializedRef = useRef(false);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const { refreshAccessToken: refreshAccessTokenOriginal, logout: logoutOriginal } = useAuth();

  const refreshAccessToken = useCallback(async () => {
    return await refreshAccessTokenOriginal();
  }, [refreshAccessTokenOriginal]);

  const logout = useCallback(() => {
    logoutOriginal();
  }, [logoutOriginal]);

  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [isSending, setIsSending] = useState(false);

  const uniqueMessages = (msgs) => {
    const seen = new Set();
    return msgs.filter((m) => {
      const id = m._id?.toString() || m.tempId || m.timestamp;
      if (seen.has(id)) return false;
      seen.add(id);
      return true;
    });
  };

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

  useEffect(() => {
    if (!myBusinessId) return;

    if (socketInitializedRef.current) {
      console.log("Socket already initialized, skipping setup");
      return;
    }
    socketInitializedRef.current = true;

    async function setupSocket() {
      const token = await refreshAccessToken();
      if (!token) {
        console.warn("No token, aborting socket setup");
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
        transports: ["websocket"],
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
        socketInitializedRef.current = false;
      }
    };
  }, [myBusinessId, myBusinessName, refreshAccessToken, logout]);

  useEffect(() => {
    const sock = socketRef.current;
    if (!sock || !selectedConversation) {
      setMessages([]);
      return;
    }

    const convId = selectedConversation._id;
    console.log("Joining conversation:", convId);
    sock.emit("joinConversation", convId);

    (async () => {
      try {
        const token = await refreshAccessToken();
        const res = await API.get(`/business-chat/${convId}/messages`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const normMsgs = (res.data.messages || []).map((msg) => ({
          ...msg,
          fromBusinessId: msg.fromBusinessId || msg.from,
          toBusinessId: msg.toBusinessId || msg.to,
        }));
        console.log(`Fetched ${normMsgs.length} messages for conversation ${convId}`);
        setMessages(uniqueMessages(normMsgs));
      } catch (err) {
        console.error("Fetch messages failed:", err);
        setMessages([]);
      }
    })();

    return () => {
      console.log("Leaving conversation:", convId);
      sock.emit("leaveConversation", convId);
    };
  }, [selectedConversation, refreshAccessToken]);

  useEffect(() => {
    if (!socketRef.current) return;
    if (!selectedConversation) return;

    const handler = (msg) => {
      const fullMsg = msg.fullMsg || msg;

      const normalized = {
        ...fullMsg,
        fromBusinessId: fullMsg.fromBusinessId || fullMsg.from,
        toBusinessId: fullMsg.toBusinessId || fullMsg.to,
      };

      console.log("Received newMessage event:", {
        id: fullMsg._id,
        text: normalized.text,
        time: new Date().toISOString(),
        fullMsg,
      });

      if (normalized.conversationId === selectedConversation._id) {
        setMessages((prev) => uniqueMessages([...prev, normalized]));
      }

      setConversations((prev) =>
        prev.map((conv) =>
          conv._id === normalized.conversationId
            ? { ...conv, messages: uniqueMessages([...(conv.messages || []), normalized]) }
            : conv
        )
      );
    };

    socketRef.current.off("newMessage", handler);
    socketRef.current.on("newMessage", handler);

    return () => {
      console.log("Removing newMessage listener");
      socketRef.current.off("newMessage", handler);
    };
  }, [selectedConversation]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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

    setMessages((prev) => uniqueMessages([...prev, optimistic]));
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
        setMessages((prev) => uniqueMessages([...prev.filter((m) => m._id !== optimistic._id), real]));
      }
    });
  };

  // צרף קובץ - פותח חלון בחירת קובץ
  const handleAttach = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = null; // איפוס בחירה קודמת
      fileInputRef.current.click();
    }
  };

  // טיפול בבחירת קובץ ושליחתו דרך socket
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file || !socketRef.current || !selectedConversation) return;

    setIsSending(true);

    const tempId = "pending-" + Math.random().toString(36).substr(2, 9);
    const optimisticMsg = {
      _id: tempId,
      conversationId: selectedConversation._id,
      fromBusinessId: myBusinessId,
      toBusinessId: selectedConversation.participants.find(id => id !== myBusinessId),
      fileUrl: URL.createObjectURL(file),
      fileName: file.name,
      fileType: file.type,
      timestamp: new Date().toISOString(),
      sending: true,
      tempId,
    };

    setMessages((prev) => uniqueMessages([...prev, optimisticMsg]));

    const reader = new FileReader();
    reader.onload = () => {
      socketRef.current.emit(
        "sendFile",
        {
          conversationId: selectedConversation._id,
          from: myBusinessId,
          to: optimisticMsg.toBusinessId,
          fileType: file.type,
          buffer: reader.result,
          fileName: file.name,
          tempId,
        },
        (ack) => {
          setIsSending(false);
          if (!ack.ok) {
            alert("שליחת קובץ נכשלה: " + (ack.error || "שגיאה לא ידועה"));
            setMessages((prev) => prev.filter((m) => m._id !== tempId));
          } else if (ack.message?._id) {
            setMessages((prev) =>
              uniqueMessages([
                ...prev.filter((m) => m._id !== tempId),
                {
                  ...ack.message,
                  fromBusinessId: ack.message.fromBusinessId || ack.message.from,
                  toBusinessId: ack.message.toBusinessId || ack.message.to,
                },
              ])
            );
          }
        }
      );
    };
    reader.readAsArrayBuffer(file);
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
      {/* עמודת שיחות */}
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
  const idx = conv.participants.findIndex((id) => id !== myBusinessId);
  const partner = conv.participantsInfo?.[idx] || { businessName: "עסק" };
  // בדיקה אם messages הוא מערך לא ריק לפני שימוש
  const lastMsg = Array.isArray(conv.messages) && conv.messages.length > 0
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

      {/* עמודת הודעות */}
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
                {selectedConversation.participantsInfo?.find(
                  (b) => b._id !== myBusinessId
                )?.businessName || "עסק"}
              </Box>
              {messages.map((msg, i) => (
                <Box
                  key={msg._id ? msg._id.toString() : `pending-${i}`}
                  sx={{
                    background: msg.fromBusinessId === myBusinessId ? "#e6ddff" : "#fff",
                    alignSelf: msg.fromBusinessId === myBusinessId ? "flex-end" : "flex-start",
                    p: 1.2,
                    borderRadius: 2,
                    mb: 1,
                    maxWidth: 340,
                    boxShadow: 1,
                    wordBreak: "break-word",
                  }}
                >
                  {msg.fileUrl ? (
                    msg.fileType && msg.fileType.startsWith("audio") ? (
                      <audio controls src={msg.fileUrl} />
                    ) : msg.fileType && msg.fileType.startsWith("image") ? (
                      <img
                        src={msg.fileUrl}
                        alt={msg.fileName || "image"}
                        style={{ maxWidth: 200, borderRadius: 8 }}
                      />
                    ) : (
                      <a
                        href={msg.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        download
                      >
                        {msg.fileName || "קובץ להורדה"}
                      </a>
                    )
                  ) : (
                    <Box>{msg.text}</Box>
                  )}
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
                    {msg.sending && <span> ⏳</span>}
                    {msg.failed && <span> ❌</span>}
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
              alignItems: "center",
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

            <Button
              type="button"
              onClick={handleAttach}
              sx={{ ml: 1 }}
              title="צרף קובץ"
            >
              📎
            </Button>
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleFileChange}
              accept="image/*,audio/*,video/*,application/pdf"
            />
          </form>
        )}

        {onClose && (
          <Button sx={{ position: "absolute", top: 13, left: 18 }} onClick={onClose}>
            ✖
          </Button>
        )}
      </Box>
    </Box>
  );
}
