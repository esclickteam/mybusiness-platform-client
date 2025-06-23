import React, { useEffect, useState, useRef, useCallback } from "react";
import { io } from "socket.io-client";
import API from "../../../../api";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { useAuth } from "../../../../context/AuthContext";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "https://api.esclick.co.il";

/** עזר למציאת המשתתף השני בצ'אט */
function getOtherBusinessId(conversation, myBusinessId) {
  // אם קיים participantsInfo
  const info = conversation.participantsInfo?.find(
    ({ _id }) => _id.toString() !== myBusinessId.toString()
  );
  if (info) return info._id.toString();

  // אחרת מתוך participants
  const raw = conversation.participants.find((p) =>
    p.toString() !== myBusinessId.toString()
  );
  return raw?.toString() || "";
}

export default function CollabChat({ myBusinessId, myBusinessName, onClose }) {
  const socketRef = useRef(null);
  const socketInitializedRef = useRef(false);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const { refreshAccessToken: refreshAccessTokenOriginal, logout: logoutOriginal } = useAuth();
  const refreshAccessToken = useCallback(async () => {
    const token = await refreshAccessTokenOriginal();
    return token;
  }, [refreshAccessTokenOriginal]);
  const logout = useCallback(() => logoutOriginal(), [logoutOriginal]);

  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [isSending, setIsSending] = useState(false);

  /** מסנן כפילויות לפי _id/tempId/timestamp */
  const uniqueMessages = useCallback((msgs) => {
    const seen = new Set();
    return msgs.filter((m) => {
      const id = m._id?.toString() || m.tempId || m.timestamp;
      if (seen.has(id)) return false;
      seen.add(id);
      return true;
    });
  }, []);

  /** טוען את רשימת השיחות */
  const fetchConversations = useCallback(async () => {
    try {
      const token = await refreshAccessToken();
      if (!token) return;
      const res = await API.get("/business-chat/my-conversations", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const convsRaw = res.data.conversations || [];
      const convs = convsRaw.map((c) => ({
        ...c,
        messages: Array.isArray(c.messages) ? c.messages : [],
      }));
      setConversations(convs);
      if (!selectedConversation && convs.length) {
        setSelectedConversation(convs[0]);
      }
    } catch (err) {
      console.error("Error fetching conversations:", err);
      setError("לא הצלחנו לטעון שיחות");
    }
  }, [refreshAccessToken, selectedConversation]);

  /** גלילה לתחתית הרשימה */
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  /** חיבור לסוקט */
  useEffect(() => {
    if (!myBusinessId || socketInitializedRef.current) return;
    socketInitializedRef.current = true;

    async function setupSocket() {
      const token = await refreshAccessToken();
      if (!token) return;
      const sock = io(SOCKET_URL, {
        path: "/socket.io",
        auth: { token, role: "business", businessId: myBusinessId, businessName: myBusinessName },
        transports: ["websocket"],
      });
      socketRef.current = sock;

      sock.on("connect", () => fetchConversations());
      sock.on("connect_error", (err) => console.error("Socket error:", err.message));
      sock.on("tokenExpired", async () => {
        const newToken = await refreshAccessToken();
        if (!newToken) return logout();
        sock.auth.token = newToken;
        sock.disconnect();
        sock.connect();
      });
    }

    setupSocket();
    return () => {
      socketRef.current?.disconnect();
      socketInitializedRef.current = false;
      socketRef.current = null;
    };
  }, [myBusinessId, myBusinessName, refreshAccessToken, logout, fetchConversations]);

  /** טעינת הודעות כשבוחרים שיחה */
  useEffect(() => {
    const sock = socketRef.current;
    if (!sock || !selectedConversation) {
      setMessages([]);
      return;
    }
    const convId = selectedConversation._id;
    sock.emit("joinConversation", convId);

    (async () => {
      try {
        const token = await refreshAccessToken();
        if (!token) return;
        const res = await API.get(`/business-chat/${convId}/messages`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const norm = (res.data.messages || []).map((msg) => ({
          ...msg,
          fromBusinessId: msg.fromBusinessId || msg.from,
          toBusinessId: msg.toBusinessId || msg.to,
        }));
        setMessages(uniqueMessages(norm));
      } catch (err) {
        console.error("Error fetching messages:", err);
        setMessages([]);
      }
    })();

    return () => {
      sock.emit("leaveConversation", convId);
    };
  }, [selectedConversation, refreshAccessToken, uniqueMessages]);

  /** האזנה ל־newMessage */
  useEffect(() => {
    const sock = socketRef.current;
    if (!sock || !selectedConversation) return;
    const handler = (msg) => {
      const full = msg.fullMsg || msg;
      const m = {
        ...full,
        fromBusinessId: full.fromBusinessId || full.from,
        toBusinessId: full.toBusinessId || full.to,
      };
      if (m.conversationId === selectedConversation._id) {
        setMessages((prev) => uniqueMessages([...prev, m]));
      }
      setConversations((prev) =>
        prev.map((c) =>
          c._id === m.conversationId
            ? { ...c, messages: uniqueMessages([...(c.messages||[]), m]) }
            : c
        )
      );
    };
    sock.on("newMessage", handler);
    return () => sock.off("newMessage", handler);
  }, [selectedConversation, uniqueMessages]);

  /** גלילה אוטומטית */
  useEffect(scrollToBottom, [messages, scrollToBottom]);

  /** מוסיף הודעה אופטימית לשני הסטייטים */
  const appendOptimistic = useCallback((convId, msg) => {
    setMessages((prev) => uniqueMessages([...prev, msg]));
    setConversations((prev) =>
      prev.map((c) =>
        c._id === convId
          ? { ...c, messages: uniqueMessages([...(c.messages||[]), msg]) }
          : c
      )
    );
  }, [uniqueMessages]);

  /** שליחת טקסט */
  const sendMessage = () => {
    if (isSending || !input.trim() || !selectedConversation) return;
    setIsSending(true);

    const otherId = getOtherBusinessId(selectedConversation, myBusinessId);
    const payload = {
      conversationId: selectedConversation._id.toString(),
      from: myBusinessId.toString(),
      to: otherId,
      text: input.trim(),
    };
    const optimistic = {
      ...payload,
      _id: "pending-" + Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString(),
      fromBusinessId: payload.from,
      toBusinessId: payload.to,
      sending: true,
    };

    appendOptimistic(selectedConversation._id, optimistic);
    setInput("");

    socketRef.current.emit("sendMessage", payload, (ack) => {
      setIsSending(false);
      if (!ack.ok) {
        // הסרת האופטימית
        setMessages((prev) => prev.filter((m) => m._id !== optimistic._id));
        alert("שליחת הודעה נכשלה: " + ack.error);
      } else {
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

  /** טענת קובץ */
  const handleAttach = () => fileInputRef.current?.click();
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file || !selectedConversation) return;
    setIsSending(true);

    const tempId = "pending-" + Math.random().toString(36).substr(2, 9);
    const toBusinessId = getOtherBusinessId(selectedConversation, myBusinessId);
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

    appendOptimistic(selectedConversation._id, optimisticMsg);

    const reader = new FileReader();
    reader.onload = () => {
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
            setMessages((prev) => prev.filter((m) => m._id !== tempId));
            alert("שליחת קובץ נכשלה: " + (ack.error || "שגיאה"));
          }
        }
      );
    };
    reader.readAsArrayBuffer(file);
  };

  return (
    <Box sx={{ width: "100%", height: "70vh", display: "flex", background: "#f8f7ff", borderRadius: 2 }}>
      {/* שיחות */}
      <Box sx={{ width: 270, background: "#fff", borderLeft: "1px solid #eee", overflowY: "auto" }}>
        <Box sx={{ p: 2, fontWeight: 700, color: "#764ae6" }}>הודעות עסקיות</Box>
        {conversations.map((conv) => {
          const partnerName =
            conv.participantsInfo?.find(({ _id }) => _id.toString() !== myBusinessId.toString())
              ?.businessName || "עסק";
          const lastText = conv.messages?.slice(-1)[0]?.text || "אין הודעות";
          return (
            <Box
              key={conv._id}
              onClick={() => setSelectedConversation(conv)}
              sx={{
                p: 2,
                cursor: "pointer",
                background: selectedConversation?._id === conv._id ? "#f3f0fe" : "#fff",
                borderBottom: "1px solid #f3f0fa",
              }}
            >
              <Box sx={{ fontWeight: 600 }}>{partnerName}</Box>
              <Box sx={{ fontSize: 13, color: "#7c6ae6", overflow: "hidden", textOverflow: "ellipsis" }}>
                {lastText}
              </Box>
            </Box>
          );
        })}
      </Box>

      {/* הודעות */}
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column", position: "relative" }}>
        <Box sx={{ flex: 1, p: 2, overflowY: "auto" }}>
          {selectedConversation ? (
            messages.length ? (
              <>
                <Box sx={{ mb: 2, fontSize: 17, fontWeight: 600, color: "#6d4fc4" }}>
                  שיחה עם{" "}
                  {
                    selectedConversation.participantsInfo?.find(
                      ({ _id }) => _id.toString() !== myBusinessId.toString()
                    )?.businessName
                  }
                </Box>
                {messages.map((msg) => (
                  <Box
                    key={msg._id}
                    sx={{
                      mb: 1,
                      p: 1,
                      maxWidth: 340,
                      alignSelf: msg.fromBusinessId === myBusinessId ? "flex-end" : "flex-start",
                      background: msg.fromBusinessId === myBusinessId ? "#e6ddff" : "#fff",
                      borderRadius: 2,
                      boxShadow: 1,
                      wordBreak: "break-word",
                    }}
                  >
                    {msg.fileUrl ? (
                      msg.fileType.startsWith("image") ? (
                        <img src={msg.fileUrl} alt={msg.fileName} style={{ maxWidth: 200, borderRadius: 8 }} />
                      ) : msg.fileType.startsWith("audio") ? (
                        <audio controls src={msg.fileUrl} />
                      ) : (
                        <a href={msg.fileUrl} download>{msg.fileName}</a>
                      )
                    ) : (
                      msg.text
                    )}
                    <Box sx={{ fontSize: 11, color: "#888", mt: 0.5 }}>
                      {new Date(msg.timestamp).toLocaleTimeString("he-IL", { hour: "2-digit", minute: "2-digit" })}
                      {msg.sending && " ⏳"}
                    </Box>
                  </Box>
                ))}
                <div ref={messagesEndRef} />
              </>
            ) : (
              <Box sx={{ textAlign: "center", mt: 12, color: "#bbb" }}>
                {error || "אין הודעות בשיחה זו"}
              </Box>
            )
          ) : (
            <Box sx={{ textAlign: "center", mt: 12, color: "#bbb" }}>בחר/י שיחה מהצד</Box>
          )}
        </Box>

        {/* שורת כתיבה */}
        {selectedConversation && (
          <Box component="form" onSubmit={(e) => { e.preventDefault(); sendMessage(); }} sx={{ display: "flex", p: 2, gap: 1, background: "#fff", borderTop: "1px solid #eee" }}>
            <Button onClick={handleAttach} title="צרף קובץ">📎</Button>
            <TextField
              fullWidth
              placeholder="כתוב הודעה..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !isSending && sendMessage()}
            />
            <Button type="submit" variant="contained" disabled={!input.trim() || isSending}>שלח</Button>
            <input type="file" ref={fileInputRef} style={{ display: "none" }} onChange={handleFileChange} accept="image/*,audio/*,video/*,application/pdf" />
          </Box>
        )}

        {onClose && (
          <Button onClick={onClose} sx={{ position: "absolute", top: 8, left: 8 }}>✖</Button>
        )}
      </Box>
    </Box>
  );
}
