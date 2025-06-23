import React, { useEffect, useState, useRef, useCallback } from "react";
import { io } from "socket.io-client";
import API from "../../../../api";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { useAuth } from "../../../../context/AuthContext";

// פונקציה כללית למציאת מזהה העסק השני מתוך conversation
function getOtherBusinessId(conv, myBusinessId) {
  if (!conv || !myBusinessId) {
    console.warn("getOtherBusinessId: missing conv or myBusinessId");
    return "";
  }

  if (Array.isArray(conv.participantsInfo)) {
    console.log("getOtherBusinessId: checking participantsInfo array");
    const info = conv.participantsInfo.find(
      (b) => {
        const bIdStr = b._id.toString();
        const myIdStr = myBusinessId.toString();
        console.log(`Comparing participantsInfo id: ${bIdStr} !== ${myIdStr}`);
        return bIdStr !== myIdStr;
      }
    );
    if (info) {
      const idStr = info._id.toString();
      console.log("getOtherBusinessId: found id in participantsInfo:", idStr);
      return idStr;
    }
  }

  if (Array.isArray(conv.participants)) {
    console.log("getOtherBusinessId: checking participants array");
    const raw = conv.participants.find(
      (id) => {
        const idStr = id.toString();
        const myIdStr = myBusinessId.toString();
        console.log(`Comparing participants id: ${idStr} !== ${myIdStr}`);
        return idStr !== myIdStr;
      }
    );
    if (raw) {
      const rawStr = raw.toString();
      console.log("getOtherBusinessId: found id in participants:", rawStr);
      return rawStr;
    }
  }

  console.warn("getOtherBusinessId: no other participant found");
  return "";
}


const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "https://api.esclick.co.il";

export default function CollabChat({ myBusinessId, myBusinessName, onClose }) {
  const socketRef = useRef(null);
  const socketInitializedRef = useRef(false);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const { refreshAccessToken: refreshAccessTokenOriginal, logout: logoutOriginal } = useAuth();

  const refreshAccessToken = useCallback(async () => {
    const token = await refreshAccessTokenOriginal();
    console.log("Refreshed access token:", token);
    return token;
  }, [refreshAccessTokenOriginal]);

  const logout = useCallback(() => {
    console.log("Logging out user");
    logoutOriginal();
  }, [logoutOriginal]);

  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [isSending, setIsSending] = useState(false);

  const uniqueMessages = useCallback((msgs) => {
    const seen = new Set();
    return msgs.filter((m) => {
      const id = m._id?.toString() || m.tempId || m.timestamp;
      if (seen.has(id)) return false;
      seen.add(id);
      return true;
    });
  }, []);

  const fetchConversations = useCallback(async () => {
    try {
      const token = await refreshAccessToken();
      if (!token) {
        console.warn("No token available for fetchConversations");
        return;
      }
      console.log("Fetching conversations with token:", token);
      const res = await API.get("/business-chat/my-conversations", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const convsRaw = res.data.conversations || [];
      const convs = convsRaw.map((c) => ({
        ...c,
        messages: Array.isArray(c.messages) ? c.messages : [],
      }));
      setConversations(convs);
      if (!selectedConversation && convs.length > 0) {
        setSelectedConversation(convs[0]);
      }
    } catch (err) {
      console.error("Error fetching conversations:", err);
      setConversations([]);
      setError("לא הצלחנו לטעון שיחות");
    }
  }, [refreshAccessToken, selectedConversation]);

  useEffect(() => {
    if (!myBusinessId) {
      console.warn("No myBusinessId provided, skipping socket setup");
      return;
    }
    if (socketInitializedRef.current) {
      console.log("Socket already initialized, skipping setup");
      return;
    }
    socketInitializedRef.current = true;

    async function setupSocket() {
      const token = await refreshAccessToken();
      if (!token) {
        console.warn("No token available for socket connection");
        return;
      }
      console.log("Setting up socket connection with token:", token);

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
        console.log("Socket connected:", sock.id);
        fetchConversations();
      });

      sock.on("connect_error", (err) => {
        console.error("Socket connection error:", err.message);
      });

      sock.on("tokenExpired", async () => {
        console.log("Socket token expired, refreshing...");
        const newToken = await refreshAccessToken();
        if (!newToken) {
          console.warn("Failed to refresh token, logging out");
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
  }, [myBusinessId, myBusinessName, refreshAccessToken, logout, fetchConversations]);

  useEffect(() => {
    if (!socketRef.current || !selectedConversation) {
      setMessages([]);
      return;
    }
    const convId = selectedConversation._id;
    console.log("Joining conversation room:", convId);
    socketRef.current.emit("joinConversation", convId);

    (async () => {
      try {
        const token = await refreshAccessToken();
        if (!token) {
          console.warn("No token available for fetch messages");
          return;
        }
        console.log(`Fetching messages for conversation ${convId} with token`, token);
        const res = await API.get(`/business-chat/${convId}/messages`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const normMsgs = (res.data.messages || []).map((msg) => ({
          ...msg,
          fromBusinessId: msg.fromBusinessId || msg.from,
          toBusinessId: msg.toBusinessId || msg.to,
        }));
        setMessages(uniqueMessages(normMsgs));
      } catch (err) {
        console.error("Error fetching messages:", err);
        setMessages([]);
      }
    })();

    return () => {
      console.log("Leaving conversation room:", convId);
      socketRef.current.emit("leaveConversation", convId);
    };
  }, [selectedConversation, refreshAccessToken, uniqueMessages]);

  useEffect(() => {
    if (!socketRef.current || !selectedConversation) return;

    const handler = (msg) => {
      console.log("Received newMessage:", msg);
      const fullMsg = msg.fullMsg || msg;
      const normalized = {
        ...fullMsg,
        fromBusinessId: fullMsg.fromBusinessId || fullMsg.from,
        toBusinessId: fullMsg.toBusinessId || fullMsg.to,
      };

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
      socketRef.current.off("newMessage", handler);
    };
  }, [selectedConversation, uniqueMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (isSending) {
      console.warn("Already sending message, aborting.");
      return;
    }
    if (!input.trim() || !selectedConversation || !socketRef.current) {
      console.warn("Cannot send message: missing input, conversation, or socket");
      return;
    }

    const otherIdRaw = getOtherBusinessId(selectedConversation, myBusinessId);
    console.log("Raw otherId from getOtherBusinessId:", otherIdRaw);

if (!otherIdRaw) {
  console.warn("לא נמצא מזהה הנמען");
  return;
}
const otherId =
  typeof otherIdRaw === "string"
    ? otherIdRaw
    : otherIdRaw._id
    ? otherIdRaw._id.toString()
    : otherIdRaw.toString();

    console.log("Converted otherId to string:", otherId);


const payload = {
  conversationId: selectedConversation._id.toString(),
  from: myBusinessId.toString(),
  to: otherId,
  text: input.trim(),
};

console.log("Payload to send:", payload);

    const optimistic = {
      ...payload,
      timestamp: new Date().toISOString(),
      _id: "pending-" + Math.random().toString(36).substr(2, 9),
      fromBusinessId: payload.from,
      toBusinessId: payload.to,
      sending: true,
    };

    console.log("Sending message:", payload);
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
        setMessages((prev) =>
          uniqueMessages([...prev.filter((m) => m._id !== optimistic._id), real])
        );
      }
    });
  };

  const handleAttach = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file || !socketRef.current || !selectedConversation) return;

    const toRaw = getOtherBusinessId(selectedConversation, myBusinessId);
    if (!toRaw) {
      console.warn("לא נמצא מזהה הנמען בקובץ");
      return;
    }
    const toBusinessId =
      typeof toRaw === "string"
        ? toRaw
        : toRaw._id
        ? toRaw._id.toString()
        : toRaw.toString();

    setIsSending(true);

    const tempId = "pending-" + Math.random().toString(36).substr(2, 9);

    const optimisticMsg = {
      _id: tempId,
      conversationId: selectedConversation._id,
      fromBusinessId: myBusinessId,
      toBusinessId,
      fileUrl: URL.createObjectURL(file),
      fileName: file.name,
      fileType: file.type,
      timestamp: new Date().toISOString(),
      sending: true,
    };

    setMessages((prev) => uniqueMessages([...prev, optimisticMsg]));

    setConversations((prevConvs) =>
      prevConvs.map((conv) => {
        if (conv._id === selectedConversation._id) {
          const msgs = Array.isArray(conv.messages) ? conv.messages : [];
          return {
            ...conv,
            messages: uniqueMessages([...msgs, optimisticMsg]),
          };
        }
        return conv;
      })
    );

    const reader = new FileReader();
    reader.onload = () => {
      console.log("Uploading file:", file.name);
      socketRef.current.emit(
        "sendFile",
        {
          conversationId: selectedConversation._id,
          from: myBusinessId,
          to: toBusinessId,
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
            setConversations((prevConvs) =>
              prevConvs.map((conv) => {
                if (conv._id === selectedConversation._id) {
                  const msgs = Array.isArray(conv.messages)
                    ? conv.messages.filter((m) => m._id !== tempId)
                    : [];
                  return { ...conv, messages: msgs };
                }
                return conv;
              })
            );
          } else if (ack.message?._id) {
            const realMsg = {
              ...ack.message,
              fromBusinessId: ack.message.fromBusinessId || ack.message.from,
              toBusinessId: ack.message.toBusinessId || ack.message.to,
            };
            setMessages((prev) =>
              uniqueMessages([...prev.filter((m) => m._id !== tempId), realMsg])
            );
            setConversations((prevConvs) =>
              prevConvs.map((conv) => {
                if (conv._id === selectedConversation._id) {
                  const msgs = Array.isArray(conv.messages)
                    ? conv.messages.filter((m) => m._id !== tempId)
                    : [];
                  return {
                    ...conv,
                    messages: uniqueMessages([...msgs, realMsg]),
                  };
                }
                return conv;
              })
            );
          }
        }
      );
    };
    reader.readAsArrayBuffer(file);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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
        {conversations
          .filter((conv) => conv && Array.isArray(conv.messages))
          .map((conv) => {
            const otherId = getOtherBusinessId(conv, myBusinessId);
            const partner =
              conv.participantsInfo?.find((b) => b._id.toString() === otherId) || {
                businessName: "עסק",
              };
            const lastMsg =
              conv.messages.length > 0
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
                onClick={() => {
                  setSelectedConversation(conv);
                }}
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
            Array.isArray(messages) && messages.length > 0 ? (
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
                    (b) => b._id.toString() !== myBusinessId.toString()
                  )?.businessName || "עסק"}
                </Box>
                {messages.map((msg, i) => (
                  <Box
                    key={msg._id ? msg._id.toString() : `pending-${i}`}
                    sx={{
                      background:
                        msg.fromBusinessId === myBusinessId ? "#e6ddff" : "#fff",
                      alignSelf:
                        msg.fromBusinessId === myBusinessId ? "flex-end" : "flex-start",
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
                {error || "אין הודעות בשיחה זו"}
              </Box>
            )
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
              backgroundColor: "#fff",
              boxShadow: "0 -2px 8px rgba(0,0,0,0.1)",
              borderRadius: "0 0 18px 18px",
            }}
          >
            <Button
              type="button"
              onClick={handleAttach}
              sx={{
                minWidth: 40,
                minHeight: 40,
                fontSize: "1.6rem",
                borderRadius: "50%",
                backgroundColor: "#e3dffc",
                color: "#7153dd",
                boxShadow: "0 6px 15px rgba(111, 94, 203, 0.4)",
                "&:hover": {
                  backgroundColor: "#c7bcf8",
                  boxShadow: "0 8px 20px rgba(111, 94, 203, 0.7)",
                },
              }}
              title="צרף קובץ"
            >
              📎
            </Button>

            <TextField
              fullWidth
              size="medium"
              placeholder="כתוב הודעה..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              autoComplete="off"
              sx={{
                backgroundColor: "#f0efff",
                borderRadius: "20px",
                "& .MuiOutlinedInput-root": {
                  borderRadius: "20px",
                  "& fieldset": { borderColor: "#bbb" },
                  "&:hover fieldset": { borderColor: "#7153dd" },
                  "&.Mui-focused fieldset": {
                    borderColor: "#7153dd",
                    boxShadow: "0 0 6px rgba(113, 83, 221, 0.5)",
                  },
                },
                input: { padding: "14px 16px", fontSize: "1rem" },
                height: 40,
              }}
            />

            <Button
              type="submit"
              variant="contained"
              sx={{
                minWidth: 80,
                minHeight: 40,
                fontWeight: 700,
                borderRadius: "20px",
                padding: "0 24px",
                fontSize: "1.15rem",
                boxShadow: "0 6px 15px rgba(113, 83, 221, 0.6)",
                textTransform: "none",
                "&:hover": {
                  backgroundColor: "#5d3dc7",
                  boxShadow: "0 8px 20px rgba(92, 62, 199, 0.8)",
                },
              }}
              disabled={!input.trim() || isSending}
            >
              שלח
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
