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
  // ... (שמור כמו בקוד שלך)
}

export default function CollabChat({ myBusinessId, myBusinessName, onClose }) {
  const socketRef = useRef(null);
  const selectedConversationRef = useRef(null);
  const messagesEndRef = useRef(null);

  const { refreshAccessToken, logout } = useAuth();

  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [showCollabForm, setShowCollabForm] = useState(false);
  const [viewContract, setViewContract] = useState(null);

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
  }, [myBusinessId, myBusinessName, refreshAccessToken, logout]);

  useEffect(() => {
    if (!socketRef.current) return;

    const handler = (msg) => {
      console.log("Received newMessage:", msg);

      const normalized = {
        ...msg,
        fromBusinessId: msg.fromBusinessId || msg.from,
        toBusinessId: msg.toBusinessId || msg.to,
      };

      console.log("Selected conversation ID:", selectedConversation?._id);

      // עדכון השיחה במערך השיחות והאם זו השיחה הנבחרת - עדכן את השיחה והודעותיה
      setConversations((prev) => {
        const updated = prev.map((conv) => {
          if (conv._id === normalized.conversationId) {
            const messages = conv.messages || [];
            // הוסף רק אם לא קיים כבר
            if (!messages.some((m) => m._id === normalized._id)) {
              return { ...conv, messages: [...messages, normalized] };
            }
            return conv;
          }
          return conv;
        });
        return updated;
      });

      if (selectedConversation?._id === normalized.conversationId) {
        setSelectedConversation((prev) => {
          if (!prev) return prev;
          const messages = prev.messages || [];
          if (messages.some((m) => m._id === normalized._id)) {
            return prev;
          }
          return { ...prev, messages: [...messages, normalized] };
        });
      }
    };

    socketRef.current.on("newMessage", handler);

    return () => {
      socketRef.current.off("newMessage", handler);
    };
  }, [selectedConversation]);

  useEffect(() => {
    const sock = socketRef.current;
    if (!sock || !selectedConversation) {
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
        // עדכן את השיחה הנבחרת עם ההודעות
        setSelectedConversation((prev) => (prev ? { ...prev, messages: normMsgs } : prev));
        setConversations((prev) =>
          prev.map((conv) =>
            conv._id === selectedConversation._id ? { ...conv, messages: normMsgs } : conv
          )
        );
        console.log("Loaded messages for conversation:", selectedConversation._id);
      } catch (err) {
        console.error("Fetch messages failed:", err);
        setSelectedConversation((prev) => (prev ? { ...prev, messages: [] } : prev));
      }
    })();

    selectedConversationRef.current = selectedConversation;
  }, [selectedConversation, refreshAccessToken]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedConversation?.messages]);

  // שאר פונקציות כמו sendMessage, sendFileMessage וכו' - יש לעדכן את setMessages ל setSelectedConversation בהתאם
  const sendMessage = (content) => {
    if (!content || !selectedConversation || !socketRef.current) return;

    const otherId = selectedConversation.participants.find((id) => id !== myBusinessId);

    let payload;
    if (typeof content === "string") {
      payload = {
        conversationId: selectedConversation._id,
        from: myBusinessId,
        to: otherId,
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

    // עדכון השיחה הנבחרת עם הודעה אופטימית
    setSelectedConversation((prev) => {
      if (!prev) return prev;
      const messages = prev.messages || [];
      return { ...prev, messages: [...messages, optimistic] };
    });

    socketRef.current.emit("sendMessage", payload, (ack) => {
      if (!ack.ok) {
        alert("שליחת הודעה נכשלה: " + ack.error);
        // הסר הודעה אופטימית מהשיחה הנבחרת
        setSelectedConversation((prev) => {
          if (!prev) return prev;
          const messages = prev.messages || [];
          return { ...prev, messages: messages.filter((m) => m._id !== optimistic._id) };
        });
      } else if (ack.message?._id) {
        const real = {
          ...ack.message,
          fromBusinessId: ack.message.fromBusinessId || ack.message.from,
          toBusinessId: ack.message.toBusinessId || ack.message.to,
        };
        setSelectedConversation((prev) => {
          if (!prev) return prev;
          const messages = prev.messages || [];
          return {
            ...prev,
            messages: [...messages.filter((m) => m._id !== optimistic._id), real],
          };
        });
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

  // שאר הפונקציות ששולחות הודעות צריכות להתעדכן באותו אופן, לדוגמה sendFileMessage

  // שאר הקוד נשאר כפי שהיית

  // ברינדור ההודעות - השתמש ב:
  // selectedConversation?.messages?.map(msg => ...)

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
              {selectedConversation?.messages?.map((msg, i) => {
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
