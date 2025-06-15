import React, { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import API from "../../../../api";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useAuth } from "../../../../context/AuthContext";

import CollabContractForm from "../CollabContractForm";
import CollabContractView from "../CollabContractView";

const SOCKET_URL = "https://api.esclick.co.il";

function ChatInput({
  onSendText,
  onSendFile,
  onOpenCollabForm,
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
    if (option === "collab") {
      onOpenCollabForm();
    } else if (option === "file") {
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
        <MenuItem onClick={() => handleMenuClick("collab")}>
          הסכם שיתוף פעולה
        </MenuItem>
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
  const [showCollabForm, setShowCollabForm] = useState(false);
  const [viewContract, setViewContract] = useState(null); // contract object לצפיה/חתימה

  // עדכון ref כששיחה נבחרת משתנה
  useEffect(() => {
    selectedConversationRef.current = selectedConversation;
    console.log("selectedConversationRef updated:", selectedConversation?._id);
  }, [selectedConversation]);

  // טען שיחות
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
  transports: ["websocket"],
  reconnection: true,           // אפשר חיבור מחדש אוטומטי
  reconnectionAttempts: 5,      // מקסימום ניסיונות חיבור מחדש
  reconnectionDelay: 1000,      // זמן המתנה בין ניסיון חיבור לחיבור
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
  }, [myBusinessId, myBusinessName, refreshAccessToken, logout]);

  // מאזין להודעות חדשות מהסוקט
  useEffect(() => {
  if (!socketRef.current) return;

  const handler = (msg) => {
    console.log("Received newMessage:", msg);

    const normalized = {
  ...msg,
  fromBusinessId: String(msg.fromBusinessId || msg.from),
  toBusinessId: String(msg.toBusinessId || msg.to),
  conversationId: String(msg.conversationId || msg.conversation?._id || ""),
};

const selectedConvId = selectedConversation?._id ? String(selectedConversation._id) : "";

const partnerBusinessId = getPartnerBusiness(selectedConversation)?.businessId
  ? String(getPartnerBusiness(selectedConversation).businessId)
  : "";

const isCurrentConversation = selectedConvId
  ? normalized.conversationId === selectedConvId
  : (
      (normalized.fromBusinessId === myBusinessId && normalized.toBusinessId === partnerBusinessId) ||
      (normalized.toBusinessId === myBusinessId && normalized.fromBusinessId === partnerBusinessId)
    );

    if (isCurrentConversation) {
      setMessages((prev) => {
        if (prev.some((m) => m._id === normalized._id)) {
          return prev;
        }

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

      console.log("Message added to messages state");
    } else {
      console.log("Message ignored - different conversation");
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
}, [selectedConversation, myBusinessId]);



  // טעינת הודעות לפי שיחה נבחרת
  useEffect(() => {
    const sock = socketRef.current;
    if (!sock || !selectedConversation) {
      setMessages([]);
      return;
    }

    const prevId = selectedConversationRef.current?._id;
    if (prevId && prevId !== selectedConversation._id) {
      console.log("Leaving previous conversation:", prevId);
      sock.emit("leaveConversation", prevId);
    }

    console.log("Joining conversation:", selectedConversation._id);
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

  // שדרוג sendMessage לתמיכה גם בשליחת אובייקט הסכם ולא רק טקסט
  const sendMessage = (content) => {
  if (!content || !selectedConversation || !socketRef.current) return;

  // וודא ש־otherId הוא מזהה בלבד (string)
  let otherId = selectedConversation.participants.find(id => id !== myBusinessId);
  if (typeof otherId === "object" && otherId !== null) {
    otherId = otherId._id || otherId.toString();
  }

  let payload;
  if (typeof content === "string") {
    payload = {
      conversationId: selectedConversation._id,
      from: myBusinessId,
      to: otherId, // מזהה בלבד
      text: content,
    };
  } else if (content.type === "contract") {
    payload = {
      conversationId: selectedConversation._id,
      from: myBusinessId,
      to: otherId,
      text: content.text || "הסכם שיתוף פעולה",
      type: "contract",
      contractData: content.contractData,
    };
  } else if (content.type === "info") {
    payload = {
      conversationId: selectedConversation._id,
      from: myBusinessId,
      to: otherId,
      text: content.text,
      type: "info",
    };
  } else {
    return;
  }

    const optimistic = {
      ...payload,
      timestamp: new Date().toISOString(),
      _id: "pending-" + Math.random().toString(36).substr(2, 9),
      fromBusinessId: payload.from,
      toBusinessId: payload.to,
    };

    setMessages((prev) => [...prev, optimistic]);
    console.log("[Client] Sending message payload:", payload);
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

  const openCollabForm = () => {
    setShowCollabForm(true);
  };

  const closeCollabForm = () => {
    setShowCollabForm(false);
  };

  // עדכון שליחת טופס ההסכם - עכשיו שולח את ההסכם כאובייקט הודעה
  const handleCollabSubmit = async (formData) => {
    try {
      const token = await refreshAccessToken();

      console.log("Sending contract data:", formData); // לוג לפני שליחה

      const res = await API.post(
        "/collab-contracts",
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("Response from server:", res); // לוג אחרי שליחה

      if (!res.data || !res.data.contractId) {
        alert("התרחשה שגיאה ביצירת ההסכם");
        return;
      }

      // שלח את ההסכם כאובייקט הודעה
      sendMessage({
        type: "contract",
        text: `הסכם שיתוף פעולה נוצר: ${window.location.origin}/business/collab-contracts/${res.data.contractId}`,
        contractData: res.data,
      });

      setShowCollabForm(false);
    } catch (err) {
      console.error("שגיאה ביצירת ההסכם:", err);
      alert("שגיאה ביצירת ההסכם, נסה שנית.");
    }
  };

  // פתיחת הצגה / חתימה על הסכם
  const openContractView = (contract) => {
    setViewContract(contract);
  };

  // סגירת הצגת הסכם
  const closeContractView = () => {
    setViewContract(null);
  };

  // אישור הסכם (חתימה שנייה)
  const handleApproveContract = async (update) => {
    try {
      const token = await refreshAccessToken();
      // שלח עדכון חתימה לשרת (עדכן את הAPI שלך בהתאם)
      const res = await API.put(
        `/collab-contracts/${update._id}`,
        update,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!res.data) throw new Error("Update failed");

      // עדכן את ההודעה בצ'אט עם סטטוס וחתימה חדשים
      setMessages((prev) =>
        prev.map((msg) =>
          msg.contractData?._id === update._id
            ? { ...msg, contractData: { ...msg.contractData, ...update } }
            : msg
        )
      );
      closeContractView();

      // שלח הודעת מידע לצ'אט שמסמנת אישור חתימה
      const approvalMessage = {
        conversationId: selectedConversation._id,
        from: myBusinessId,
        to: selectedConversation.participants.find(id => id !== myBusinessId),
        text: `ההסכם עם ID ${update._id} אושר על ידי ${myBusinessName}`,
        type: "info",
      };
      socketRef.current.emit("sendMessage", approvalMessage);
    } catch (err) {
      alert("שגיאה באישור ההסכם, נסה שנית.");
      console.error(err);
    }
  };

  const getPartnerBusiness = (conv) => {
  const idx = conv.participants.findIndex((id) => id !== myBusinessId);
  return {
    businessId: conv.participants[idx],
    ...conv.participantsInfo?.[idx],
  } || { businessName: "עסק", businessId: null };
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
              {messages.map((msg, i) => {
                if (msg.type === "contract" && msg.contractData) {
                  return (
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
                        cursor: "pointer",
                      }}
                      onClick={() => openContractView(msg.contractData)}
                      title="לחץ לצפייה / חתימה על ההסכם"
                    >
                      📄 {msg.text || "הסכם שיתוף פעולה"}
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
                  );
                }

                return (
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
                        <a
                          href={msg.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
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
                );
              })}
              <div ref={messagesEndRef} />
            </>
          ) : (
            <Box sx={{ color: "#bbb", textAlign: "center", mt: 12 }}>
              בחרי שיחה עסקית מהעמודה הימנית
            </Box>
          )}
        </Box>

        {selectedConversation && !showCollabForm && !viewContract && (
          <ChatInput
            onSendText={sendMessage}
            onSendFile={sendFileMessage}
            onOpenCollabForm={openCollabForm}
            uploading={uploading}
            disabled={false}
          />
        )}

        {showCollabForm && (
          <CollabContractForm
            currentUser={{ businessName: myBusinessName }}
            partnerBusiness={getPartnerBusiness(selectedConversation)}
            onSubmit={handleCollabSubmit}
            onClose={closeCollabForm}
          />
        )}

        {viewContract && (
          <CollabContractView
            contract={viewContract}
            currentUser={{ businessName: myBusinessName }}
            onApprove={handleApproveContract}
            onClose={closeContractView}
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
