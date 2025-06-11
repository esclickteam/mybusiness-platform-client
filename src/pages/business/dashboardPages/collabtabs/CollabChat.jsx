import React, { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import API from "../../../../api";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useAuth } from "../../../../context/AuthContext";

const SOCKET_URL = "https://api.esclick.co.il";

function ChatInput({
  onSendText,
  onSendFile,
  onSendAgreement,
  uploading,
  disabled,
}) {
  const [input, setInput] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);

  const openMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const closeMenu = () => {
    setAnchorEl(null);
  };

  const handleMenuClick = (option) => {
    closeMenu();
    if (option === "agreement") {
      onSendAgreement("collab");
    } else if (option === "package") {
      onSendAgreement("package");
    } else if (option === "file") {
      fileInputRef.current.click();
    } else if (option === "image") {
      imageInputRef.current.click();
    }
  };

  const onFileChange = (e) => {
    if (e.target.files.length > 0) {
      onSendFile(e.target.files[0]);
      e.target.value = null; // איפוס הקובץ שנבחר
    }
  };

  const handleSendClick = () => {
    if (input.trim() !== "") {
      onSendText(input.trim());
      setInput("");
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
        p: 2,
        borderTop: "1px solid #eee",
      }}
    >
      <Button onClick={openMenu} disabled={uploading || disabled}>
        +
      </Button>

      <TextField
        fullWidth
        size="small"
        placeholder="כתוב הודעה..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSendClick();
          }
        }}
        disabled={uploading || disabled}
      />

      <Button
        variant="contained"
        sx={{ fontWeight: 600 }}
        onClick={handleSendClick}
        disabled={input.trim() === "" || uploading || disabled}
      >
        שלח
      </Button>

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={closeMenu}>
        <MenuItem onClick={() => handleMenuClick("agreement")}>
          הסכם שיתופי פעולה
        </MenuItem>
        <MenuItem onClick={() => handleMenuClick("package")}>
          הסכם חבילה משותפת
        </MenuItem>
        <MenuItem onClick={() => handleMenuClick("file")}>קובץ</MenuItem>
        <MenuItem onClick={() => handleMenuClick("image")}>תמונה</MenuItem>
      </Menu>

      {/* קלטים מוסתרים לקבצים */}
      <input
        type="file"
        style={{ display: "none" }}
        ref={fileInputRef}
        onChange={onFileChange}
        accept="*/*"
        disabled={uploading || disabled}
      />
      <input
        type="file"
        style={{ display: "none" }}
        ref={imageInputRef}
        onChange={onFileChange}
        accept="image/*"
        disabled={uploading || disabled}
      />
    </Box>
  );
}

export default function CollabChat({ myBusinessId, myBusinessName, onClose }) {
  const socketRef = useRef(null);
  const selectedConversationRef = useRef(null);
  const messagesEndRef = useRef(null);

  const { refreshAccessToken, logout } = useAuth();

  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);

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

  // אתחול socket
  useEffect(() => {
    async function setupSocket() {
      const token = await refreshAccessToken();
      if (!token || !myBusinessId) return;

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
        socketRef.current.disconnect();
      }
    };
  }, [myBusinessId, myBusinessName, refreshAccessToken, logout]);

  // הקשבה להודעות חדשות
  useEffect(() => {
    if (!socketRef.current) return;

    const handler = (msg) => {
      const normalized = {
        ...msg,
        fromBusinessId: msg.fromBusinessId || msg.from,
        toBusinessId: msg.toBusinessId || msg.to,
      };

      if (normalized.conversationId === selectedConversationRef.current?._id) {
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
        const token = await refreshAccessToken();
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
  }, [selectedConversation, refreshAccessToken]);

  // גלילה אוטומטית להודעה חדשה
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // שליחת הודעה טקסטואלית
  const sendMessage = (text) => {
    if (!text || !selectedConversation || !socketRef.current) return;

    const otherId =
      selectedConversation.participants.find((id) => id !== myBusinessId);

    const payload = {
      conversationId: selectedConversation._id,
      from: myBusinessId,
      to: otherId,
      text,
    };

    const optimistic = {
      ...payload,
      timestamp: new Date().toISOString(),
      _id: "pending-" + Math.random().toString(36).substr(2, 9),
      fromBusinessId: payload.from,
      toBusinessId: payload.to,
    };

    setMessages((prev) => [...prev, optimistic]);

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

    API.post(
      `/business-chat/${selectedConversation._id}/message`,
      { text: payload.text },
      { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
    ).catch((err) => {
      console.error("שליחת הודעה ל־API נכשלה", err);
    });
  };

  // שליחת קובץ (כללי או תמונה)
  const sendFileMessage = async (file) => {
    if (!file || !selectedConversation || !socketRef.current) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("conversationId", selectedConversation._id);
      formData.append("from", myBusinessId);
      formData.append("to", selectedConversation.participants.find(id => id !== myBusinessId));

      const token = await refreshAccessToken();

      const res = await fetch(`${API.baseURL || ""}/business-chat/upload-file`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to upload file");

      const data = await res.json();

      const otherId = selectedConversation.participants.find(id => id !== myBusinessId);

      const payload = {
        conversationId: selectedConversation._id,
        from: myBusinessId,
        to: otherId,
        fileUrl: data.fileUrl,
        text: file.name,
        isFile: true,
      };

      socketRef.current.emit("sendMessage", payload);
    } catch (err) {
      alert("שגיאה בהעלאת הקובץ");
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  // שליחת הסכם קבוע (שיתוף פעולה או חבילה)
  const sendAgreement = (type) => {
    if (!selectedConversation || !socketRef.current) return;

    const url =
      type === "collab"
        ? "https://yourcdn.com/collab-agreement.pdf"
        : "https://yourcdn.com/package-agreement.pdf";

    const otherId = selectedConversation.participants.find(id => id !== myBusinessId);

    const payload = {
      conversationId: selectedConversation._id,
      from: myBusinessId,
      to: otherId,
      text:
        type === "collab"
          ? "הסכם שיתופי פעולה מצורף כאן:"
          : "הסכם חבילה משותפת מצורף כאן:",
      fileUrl: url,
      isFile: true,
    };

    socketRef.current.emit("sendMessage", payload);
  };

  // קבלת פרטי השותף בשיחה
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
                    wordBreak: "break-word",
                  }}
                >
                  {msg.isFile ? (
                    msg.fileUrl.match(/\.(jpeg|jpg|gif|png)$/i) ? (
                      <img
                        src={msg.fileUrl}
                        alt={msg.text || "קובץ"}
                        style={{ maxWidth: "100%", borderRadius: 8 }}
                      />
                    ) : (
                      <a href={msg.fileUrl} target="_blank" rel="noopener noreferrer">
                        {msg.text || "קובץ להורדה"}
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

        {/* אזור הזנת הודעה + כפתור + */}
        {selectedConversation && (
          <ChatInput
            onSendText={sendMessage}
            onSendFile={sendFileMessage}
            onSendAgreement={sendAgreement}
            uploading={uploading}
            disabled={false}
          />
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
