import React, { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

// ----------- הגדרות ----------- //
const SOCKET_URL = "https://api.esclick.co.il";

// ---------- קומפוננטת צ'אט מרכזית ----------- //
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

  // 1. חיבור ל־socket.io והבאת כל השיחות העסקיות שלי
  useEffect(() => {
    if (!token || !myBusinessId) return;
    const s = io(SOCKET_URL, {
      path: "/socket.io",
      auth: { token, role: "business", businessId: myBusinessId, businessName: myBusinessName },
    });
    setSocket(s);

    // הבאת שיחות עסקיות מהרגע שיש socket
    s.emit("getBusinessConversations", {}, (res) => {
      if (res.ok && Array.isArray(res.conversations)) {
        setConversations(res.conversations);
        if (res.conversations.length > 0) setSelectedConversation(res.conversations[0]);
      } else {
        setConversations([]);
      }
    });

    return () => {
      s.disconnect();
    };
  }, [token, myBusinessId, myBusinessName]);

  // 2. כל פעם שנבחרה שיחה – נביא את ההודעות של אותה שיחה
  useEffect(() => {
    if (!socket || !selectedConversation) return;
    socket.emit("getHistory", { conversationId: selectedConversation._id }, (res) => {
      if (res.ok) setMessages(res.messages);
      else setMessages([]);
    });
    // הצטרפות לחדר (socket room)
    socket.emit("joinConversation", selectedConversation._id, () => {});
  }, [socket, selectedConversation]);

  // 3. מאזין להודעות חדשות בזמן אמת
  useEffect(() => {
    if (!socket) return;
    const handler = (msg) => {
      if (msg.conversationId === selectedConversation?._id) {
        setMessages((prev) => [...prev, msg]);
      }
    };
    socket.on("newMessage", handler);
    return () => socket.off("newMessage", handler);
  }, [socket, selectedConversation]);

  // גלילה אוטומטית למטה
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // שליחת הודעה
  const sendMessage = () => {
    if (!input.trim() || !selectedConversation) return;
    const otherBusinessId = selectedConversation.participants.find(
      (id) => id !== myBusinessId
    );
    socket.emit(
      "sendMessage",
      {
        conversationId: selectedConversation._id,
        from: myBusinessId,
        to: otherBusinessId,
        text: input.trim(),
      },
      (ack) => {
        if (!ack.ok) alert("שליחת הודעה נכשלה: " + ack.error);
        setInput("");
      }
    );
  };

  // חישוב פרטי העסק שמולו משוחחים
  const getPartnerBusiness = (conv) => {
    if (!conv || !conv.participantsInfo) return { businessName: "עסק" };
    const partner = conv.participantsInfo.find(
      (b) => b._id !== myBusinessId
    );
    return partner || { businessName: "עסק" };
  };

  return (
    <Box sx={{
      width: "100%",
      minHeight: 540,
      height: "70vh",
      background: "#f8f7ff",
      borderRadius: "18px",
      boxShadow: 2,
      display: "flex",
      overflow: "hidden"
    }}>
      {/* רשימת שיחות (ימין) */}
      <Box sx={{
        width: 270,
        borderLeft: "1px solid #eee",
        background: "#fff",
        overflowY: "auto"
      }}>
        <Box sx={{
          fontWeight: 700,
          color: "#764ae6",
          fontSize: 19,
          px: 2.5,
          py: 2
        }}>
          הודעות עסקיות
        </Box>
        {conversations.length === 0 && (
          <Box sx={{ p: 3, color: "#bbb", textAlign: "center" }}>
            אין שיחות עסקיות
          </Box>
        )}
        {conversations.map((conv) => {
          const partner = getPartnerBusiness(conv);
          const lastMsg = conv.messages?.length ? conv.messages[conv.messages.length-1].text : "";
          return (
            <Box
              key={conv._id}
              sx={{
                px: 2.5, py: 1.5,
                cursor: "pointer",
                borderBottom: "1px solid #f3f0fa",
                background: selectedConversation?._id === conv._id ? "#f3f0fe" : "#fff"
              }}
              onClick={() => setSelectedConversation(conv)}
            >
              <Box sx={{ fontWeight: 600 }}>{partner.businessName}</Box>
              <Box sx={{ color: "#7c6ae6", fontSize: 13, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {lastMsg || "אין הודעות"}
              </Box>
            </Box>
          );
        })}
      </Box>
      {/* צ'אט */}
      <Box sx={{
        flex: 1,
        position: "relative",
        background: "#f8f7ff",
        display: "flex",
        flexDirection: "column"
      }}>
        <Box sx={{ flex: 1, px: 2, pt: 2, overflowY: "auto" }}>
          {selectedConversation ? (
            <>
              <Box sx={{ mb: 2, color: "#6d4fc4", fontWeight: 600, fontSize: 17 }}>
                שיחה עם {getPartnerBusiness(selectedConversation).businessName}
              </Box>
              {messages.map((msg, i) => (
                <Box key={i}
                  sx={{
                    background: msg.fromBusinessId === myBusinessId ? "#e6ddff" : "#fff",
                    alignSelf: msg.fromBusinessId === myBusinessId ? "flex-end" : "flex-start",
                    p: 1.2,
                    borderRadius: 2,
                    mb: 1,
                    maxWidth: 340,
                    boxShadow: 1
                  }}>
                  <Box>{msg.text}</Box>
                  <Box sx={{ fontSize: 11, color: "#888", mt: 0.5, textAlign: "left" }}>
                    {msg.timestamp && new Date(msg.timestamp).toLocaleTimeString("he-IL", { hour: "2-digit", minute: "2-digit" })}
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
          <Box sx={{ p: 2, borderTop: "1px solid #eee", display: "flex", gap: 1 }}>
            <TextField
              fullWidth
              size="small"
              placeholder="כתוב הודעה..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => {
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
            >שלח</Button>
          </Box>
        )}
        {onClose && (
          <Button sx={{ position: "absolute", top: 13, left: 18 }} onClick={onClose}>✖</Button>
        )}
      </Box>
    </Box>
  );
}
