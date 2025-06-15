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

function ChatInput({ onSendText, onSendFile, uploading, disabled }) {
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
    if (option === "file") {
      fileInputRef.current.click();
    } else if (option === "image") {
      imageInputRef.current.click();
    }
  };

  const onFileChange = (e) => {
    if (e.target.files.length > 0) {
      onSendFile(e.target.files[0]);
      e.target.value = null;
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
      <Button
        onClick={openMenu}
        disabled={uploading || disabled}
        sx={{
          minWidth: 40,
          fontSize: 26,
          fontWeight: "bold",
          color: "#764ae6",
          borderRadius: "50%",
          border: "2px solid #764ae6",
          padding: "4px 0",
          lineHeight: 1,
          "&:hover": {
            backgroundColor: "#764ae6",
            color: "#fff",
          },
        }}
      >
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
        <MenuItem onClick={() => handleMenuClick("file")}>קובץ</MenuItem>
        <MenuItem onClick={() => handleMenuClick("image")}>תמונה</MenuItem>
      </Menu>

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

  const myBusinessIdStr = myBusinessId ? String(myBusinessId) : null;

  useEffect(() => {
    selectedConversationRef.current = selectedConversation;
    console.log("selectedConversationRef updated:", selectedConversation?._id);
  }, [selectedConversation]);

  const fetchConversations = async (token) => {
    try {
      const res = await API.get("/business-chat/my-conversations", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const convs = res.data.conversations || [];
      setConversations(convs);
      if (!selectedConversation && convs.length > 0) {
        setSelectedConversation(convs[0]);
        console.log("Default selectedConversation set to:", convs[0]._id);
      }
    } catch (err) {
      console.error("Failed fetching conversations:", err);
      setConversations([]);
      setError("לא הצלחנו לטעון שיחות");
    }
  };

  useEffect(() => {
    async function setupSocket() {
      const token = await refreshAccessToken();
      if (!token || !myBusinessIdStr) return;

      const sock = io(SOCKET_URL, {
        path: "/socket.io",
        auth: {
          token,
          role: "business",
          businessId: myBusinessIdStr,
          businessName: myBusinessName,
        },
        transports: ["websocket"],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
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
  }, [myBusinessIdStr, myBusinessName, refreshAccessToken, logout]);

  useEffect(() => {
    if (!socketRef.current) return;

    const handler = (msg) => {
      console.log("Received newMessage raw:", msg);

      const normalized = {
        ...msg,
        fromBusinessId: msg.fromBusinessId
          ? String(msg.fromBusinessId)
          : typeof msg.from === "object" && msg.from !== null
          ? String(msg.from._id || msg.from.id || "")
          : String(msg.from || ""),
        toBusinessId: msg.toBusinessId
          ? String(msg.toBusinessId)
          : typeof msg.to === "object" && msg.to !== null
          ? String(msg.to._id || msg.to.id || "")
          : String(msg.to || ""),
        conversationId:
          msg.conversationId && msg.conversationId !== "" ? String(msg.conversationId) : null,
        _id: msg._id ? String(msg._id) : "",
      };

      const selectedConvId = selectedConversationRef.current?._id
        ? String(selectedConversationRef.current._id)
        : "";

      const partnerBusinessId =
        getPartnerBusiness(selectedConversationRef.current)?.businessId || "";

      const isCurrentConversation =
        (normalized.conversationId && normalized.conversationId === selectedConvId) ||
        (!normalized.conversationId &&
          ((normalized.fromBusinessId === myBusinessIdStr && normalized.toBusinessId === partnerBusinessId) ||
            (normalized.toBusinessId === myBusinessIdStr && normalized.fromBusinessId === partnerBusinessId)));

      if (isCurrentConversation) {
        setMessages((prev) => {
          if (prev.some((m) => m._id === normalized._id)) return prev;
          const pendingIndex = prev.findIndex(
            (m) =>
              m._id?.startsWith("pending-") &&
              m.text === normalized.text &&
              m.fromBusinessId === normalized.fromBusinessId
          );
          if (pendingIndex !== -1) {
            const newArr = [...prev];
            newArr[pendingIndex] = normalized;
            return newArr;
          }
          return [...prev, normalized];
        });
      }

      setConversations((prev) =>
        prev.map((conv) => {
          if (String(conv._id) === normalized.conversationId) {
            const exists = (conv.messages || []).some((m) => m._id === normalized._id);
            if (!exists) {
              return { ...conv, messages: [...(conv.messages || []), normalized] };
            }
          }
          return conv;
        })
      );
    };

    socketRef.current.on("receive_message", handler);

    return () => {
      socketRef.current.off("receive_message", handler);
    };
  }, [myBusinessIdStr]);

  useEffect(() => {
    const sock = socketRef.current;
    if (!sock || !selectedConversation) {
      setMessages([]);
      return;
    }

    const prevId = selectedConversationRef.current?._id;
    if (prevId && prevId !== selectedConversation._id) {
      sock.emit("leave_conversation", prevId);
    }

    console.log("Joining conversation:", selectedConversation._id);
    sock.emit("join_conversation", selectedConversation._id);

    (async () => {
      try {
        const token = await refreshAccessToken();
        const res = await API.get(`/business-chat/${selectedConversation._id}/messages`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const normMsgs = (res.data.messages || []).map((msg) => ({
          ...msg,
          fromBusinessId: msg.fromBusinessId ? String(msg.fromBusinessId) : msg.from,
          toBusinessId: msg.toBusinessId ? String(msg.toBusinessId) : msg.to,
        }));
        setMessages(normMsgs);
        console.log("Loaded messages for conversation:", selectedConversation._id);
      } catch (err) {
        console.error("Fetch messages failed:", err);
        setMessages([]);
      }
    })();

    selectedConversationRef.current = selectedConversation;
  }, [selectedConversation, refreshAccessToken]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = (content) => {
    if (!content || !selectedConversation || !socketRef.current) return;

    let otherId = selectedConversation.participants.find((id) => {
      if (typeof id === "string") return id !== myBusinessIdStr;
      if (typeof id === "object" && id !== null) return (id._id || id.id || "") !== myBusinessIdStr;
      return false;
    });

    if (typeof otherId === "object" && otherId !== null) {
      otherId = otherId._id || otherId.id || "";
    }
    otherId = String(otherId);

    let payload;
    if (typeof content === "string") {
      payload = { conversationId: selectedConversation._id, from: myBusinessIdStr, to: otherId, text: content };
    } else if (content.type === "info") {
      payload = { conversationId: selectedConversation._id, from: myBusinessIdStr, to: otherId, text: content.text, type: "info" };
    } else return;

    const optimistic = { ...payload, timestamp: new Date().toISOString(), _id: "pending-" + Math.random().toString(36).substr(2, 9), fromBusinessId: payload.from, toBusinessId: payload.to };
    setMessages((prev) => [...prev, optimistic]);
    console.log("[Client] Sending message payload:", payload);
    socketRef.current.emit("send_message", payload, (ack) => {
      if (!ack.ok) {
        alert("שליחה נכשלה: " + ack.error);
        setMessages((prev) => prev.filter((m) => m._id !== optimistic._id));
      } else if (ack.message?._id) {
        const real = { ...ack.message, fromBusinessId: ack.message.fromBusinessId ? String(ack.message.fromBusinessId) : ack.message.from, toBusinessId: ack.message.toBusinessId ? String(ack.message.toBusinessId) : ack.message.to };
        setMessages((prev) => [...prev.filter((m) => m._id !== optimistic._id), real]);
      }
    });

    API.post(
      `/business-chat/${selectedConversation._id}/message`,
      { text: payload.text },
      { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
    ).catch((err) => console.error("API post failed", err));
  };

  const sendFileMessage = async (file) => {
    if (!file || !selectedConversation || !socketRef.current) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("conversationId", selectedConversation._id);
      formData.append("from", myBusinessIdStr);

      let otherId = selectedConversation.participants.find((id) => {
        if (typeof id === "string") return id !== myBusinessIdStr;
        if (typeof id === "object" && id !== null) return (id._id || id.id || "") !== myBusinessIdStr;
        return false;
      });
      if (typeof otherId === "object" && otherId !== null) otherId = otherId._id || otherId.id || "";
      otherId = String(otherId);

      formData.append("to", otherId);
      const token = await refreshAccessToken();
      const res = await fetch(`${API.baseURL || ""}/business-chat/upload-file`, { method: "POST", headers: { Authorization: `Bearer ${token}` }, body: formData });
      if (!res.ok) throw new Error("Failed to upload file");
      const data = await res.json();
      const payload = { conversationId: selectedConversation._id, from: myBusinessIdStr, to: otherId, fileUrl: data.fileUrl, text: file.name, isFile: true };
      socketRef.current.emit("send_message", payload);
    } catch (err) {
      alert("שגיאה בהעלאת הקובץ");
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const getPartnerBusiness = (conv) => {
    if (!conv) return { businessName: "עסק", businessId: null };
    let partnerId = conv.participants.find((id) => String(id) !== myBusinessIdStr) || conv.participants[0] || null;
    if (!partnerId) return { businessName: "עסק", businessId: null };
    if (typeof partnerId === "object") partnerId = partnerId._id || partnerId.toString();
    else partnerId = String(partnerId);
    const partnerName = conv.participantsInfo?.find((p) => String(p.businessId) === partnerId)?.businessName || "עסק";
    return { businessId: partnerId, businessName: partnerName };
  };

  return (
    <Box sx={{ width: "100%", minHeight: 540, height: "70vh", background: "#f8f7ff", borderRadius: "18px", boxShadow: 2, display: "flex", overflow: "hidden" }}>
      {/* שיחות */}
      <Box sx={{ width: 270, borderLeft: "1px solid #eee", background: "#fff", overflowY: "auto" }}>
        <Box sx={{ fontWeight: 700, color: "#764ae6", fontSize: 19, px: 2.5, py: 2 }}>הודעות עסקיות</Box>
        {conversations.length === 0 && <Box sx={{ p: 3, color: "#bbb", textAlign: "center" }}>אין שיחות עסקיות</Box>}
        {conversations.map((conv) => {
          const partner = getPartnerBusiness(conv);
          const lastMsg = conv.messages?.slice(-1)[0]?.text || "";
          return (
            <Box key={conv._id} sx={{ px: 2.5, py: 1.5, cursor: "pointer", borderBottom: "1px solid #f3f0fa", background: selectedConversation?._id === conv._id ? "#f3f0fe" : "#fff" }} onClick={() => setSelectedConversation(conv)}>
              <Box sx={{ fontWeight: 600 }}>{partner.businessName}</Box>
              <Box sx={{ color: "#7c6ae6", fontSize: 13, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{lastMsg || "אין הודעות"}</Box>
            </Box>
          );
        })}
      </Box>

      {/* צ'אט */}
      <Box sx={{ flex: 1, position: "relative", background: "#f8f7ff", display: "flex", flexDirection: "column" }}>
        <Box sx={{ flex: 1, px: 2, pt: 2, overflowY: "auto" }}>
          {selectedConversation ? (
            <>
              <Box sx={{ mb: 2, color: "#6d4fc4", fontWeight: 600, fontSize: 17 }}>שיחה עם {getPartnerBusiness(selectedConversation).businessName}</Box>
              {messages.map((msg, i) => (
                <Box key={msg._id || i} sx={{ background: msg.fromBusinessId === myBusinessIdStr ? "#e6ddff" : "#fff", alignSelf: msg.fromBusinessId === myBusinessIdStr ? "flex-end" : "flex-start", p: 1.2, borderRadius: 2, mb: 1, maxWidth: 340, boxShadow: 1, wordBreak: "break-word" }}>
                  {msg.isFile ? (
                    msg.fileUrl.match(/\.(jpeg|jpg|gif|png)$/i) ? (
                      <img src={msg.fileUrl} alt={msg.text || "קובץ"} style={{ maxWidth: "100%", borderRadius: 8 }} />
                    ) : (
                      <a href={msg.fileUrl} target="_blank" rel="noopener noreferrer">{msg.text || "קובץ להורדה"}</a>
                    )
                  ) : (
                    <Box>{msg.text}</Box>
                  )}
                  <Box sx={{ fontSize: 11, color: "#888", mt: 0.5, textAlign: "left" }}>
                    {msg.timestamp && new Date(msg.timestamp).toLocaleTimeString("he-IL", { hour: "2-digit", minute: "2-digit" })}
                  </Box>
                </Box>
              ))}
              <div ref={messagesEndRef} />
            </>
          ) : (
            <Box sx={{ color: "#bbb", textAlign: "center", mt: 12 }}>בחרי שיחה עסקית מהעמודה הימנית</Box>
          )}
        </Box>

        {selectedConversation && <ChatInput onSendText={sendMessage} onSendFile={sendFileMessage} uploading={uploading} disabled={false} />}
        {onClose && <Button sx={{ position: "absolute", top: 13, left: 18 }} onClick={onClose}>✖</Button>}
      </Box>
    </Box>
  );
}
