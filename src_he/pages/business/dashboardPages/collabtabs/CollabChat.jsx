import React, { useEffect, useState, useRef, useCallback, useReducer } from "react";
import { io } from "socket.io-client";
import API from "../../../../api";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { useAuth } from "../../../../context/AuthContext";

function getOtherBusinessId(conv, myBusinessId) {
  if (!conv || !myBusinessId) {
    console.warn("getOtherBusinessId: missing conv or myBusinessId");
    return "";
  }
  if (Array.isArray(conv.participantsInfo)) {
    const info = conv.participantsInfo.find(
      (b) => b._id.toString() !== myBusinessId.toString()
    );
    if (info) return info._id.toString();
  }
  if (Array.isArray(conv.participants)) {
    const raw = conv.participants.find(
      (id) => id.toString() !== myBusinessId.toString()
    );
    if (raw) return raw.toString();
  }
  return "";
}

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "https://api.esclick.co.il";

function messagesReducer(state, action) {
  switch (action.type) {
    case "set":
      console.log("[messagesReducer] set", action.payload.length, "messages");
      return action.payload;
    case "append": {
      const exists = state.some((m) => m._id === action.payload._id);
      if (exists) {
        console.log("[messagesReducer] append skipped, message exists:", action.payload._id);
        return state;
      }
      console.log("[messagesReducer] append message:", action.payload._id);
      return [...state, action.payload];
    }
    case "replace":
      console.log("[messagesReducer] replace message:", action.payload._id);
      return state.map((m) =>
        m._id === action.payload._id || m._id === action.payload.tempId
          ? action.payload
          : m
      );
    case "remove":
      console.log("[messagesReducer] remove message:", action.payload);
      return state.filter((m) => m._id !== action.payload);
    default:
      return state;
  }
}

export default function CollabChat({ myBusinessId, myBusinessName, onClose }) {
  const socketRef = useRef(null);
  const socketInitializedRef = useRef(false);
  const messagesEndRef = useRef(null);

  const { refreshAccessToken: refreshAccessTokenOriginal, logout: logoutOriginal } = useAuth();

  const refreshAccessToken = useCallback(async () => {
    const token = await refreshAccessTokenOriginal();
    console.log("[refreshAccessToken] token refreshed");
    return token;
  }, [refreshAccessTokenOriginal]);

  const logout = useCallback(() => {
    console.log("[logout] logging out user");
    logoutOriginal();
  }, [logoutOriginal]);

  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, dispatchMessages] = useReducer(messagesReducer, []);
  const [input, setInput] = useState("");
  const [error, setError] = useState("");

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
      if (!token) return;
      console.log("[fetchConversations] fetching conversations...");
      const res = await API.get("/business-chat/my-conversations", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const convsRaw = res.data.conversations || [];
      console.log("[fetchConversations] received", convsRaw.length, "conversations");
      const convs = convsRaw.map((c) => ({
        ...c,
        messages: Array.isArray(c.messages) ? c.messages : [],
        conversationType: c.conversationType || "user-business",
      }));
      setConversations(convs);
      if (!selectedConversation && convs.length > 0) {
        setSelectedConversation(convs[0]);
        console.log("[fetchConversations] set selectedConversation to first conversation", convs[0]._id);
      }
    } catch (err) {
      setConversations([]);
      setError("We could not load the conversations");
      console.error("[fetchConversations] error:", err);
    }
  }, [refreshAccessToken, selectedConversation]);

  useEffect(() => {
    if (!myBusinessId) return;
    if (socketInitializedRef.current) return;
    socketInitializedRef.current = true;

    async function setupSocket() {
      const token = await refreshAccessToken();
      if (!token) return;

      console.log("[setupSocket] connecting socket...");
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
        console.log("[socket] connected", sock.id);
        fetchConversations();
      });

      sock.on("connect_error", (err) => {
        console.error("[socket] connection error:", err.message);
      });

      sock.on("tokenExpired", async () => {
        console.log("[socket] tokenExpired event");
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
        console.log("[cleanup] disconnecting socket");
        socketRef.current.disconnect();
        socketRef.current = null;
        socketInitializedRef.current = false;
      }
    };
  }, [myBusinessId, myBusinessName, refreshAccessToken, logout, fetchConversations]);

  useEffect(() => {
    if (!socketRef.current) return;
    console.log("[joinRooms] joining rooms for conversations:", conversations.map(c => c._id));
    conversations.forEach((conv) => {
      const isBusinessConversation = conv.conversationType === "business-business";
      socketRef.current.emit("joinConversation", conv._id, isBusinessConversation);
      console.log(`[joinRooms] joined room ${conv._id} as business? ${isBusinessConversation}`);
    });
  }, [conversations]);

  useEffect(() => {
    if (!socketRef.current || !selectedConversation) {
      dispatchMessages({ type: "set", payload: [] });
      return;
    }
    const convId = selectedConversation._id;

    const joinHandler = () => {
      const isBusinessConversation = selectedConversation.conversationType === "business-business";
      console.log(`[joinHandler] joining conversation ${convId}, isBiz=${isBusinessConversation}`);
      socketRef.current.emit("joinConversation", convId, isBusinessConversation);
    };

    socketRef.current.on("connect", joinHandler);
    joinHandler();

    (async () => {
      try {
        const token = await refreshAccessToken();
        if (!token) return;
        console.log(`[fetchMessages] fetching messages for conversation ${convId}`);
        const res = await API.get(`/business-chat/${convId}/messages`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const normMsgs = (res.data.messages || []).map((msg) => ({
          ...msg,
          text: typeof msg.text === "string" ? msg.text : "",
          fromBusinessId: msg.fromBusinessId || msg.from,
          toBusinessId: msg.toBusinessId || msg.to,
        }));
        dispatchMessages({ type: "set", payload: uniqueMessages(normMsgs) });
      } catch (err) {
        dispatchMessages({ type: "set", payload: [] });
        console.error("[fetchMessages] error:", err);
      }
    })();

    return () => {
      const isBusinessConversation = selectedConversation.conversationType === "business-business";
      console.log(`[cleanup] leaving conversation ${convId}, isBiz=${isBusinessConversation}`);
      socketRef.current.emit("leaveConversation", convId, isBusinessConversation);
      socketRef.current.off("connect", joinHandler);
    };
  }, [selectedConversation, refreshAccessToken, uniqueMessages]);

  const handleNewMessage = useCallback(
    (msg) => {
      console.log("[handleNewMessage] received message:", msg);
      const fullMsg = msg.fullMsg || msg;
      if (!fullMsg) return;

      const normalized = {
        ...fullMsg,
        text: typeof fullMsg.text === "string" ? fullMsg.text : "",
        fromBusinessId: fullMsg.fromBusinessId || fullMsg.from,
        toBusinessId: fullMsg.toBusinessId || fullMsg.to,
        conversationId: fullMsg.conversationId || fullMsg.conversation || fullMsg.chatId,
      };

      console.log("[handleNewMessage] normalized:", normalized);

      if (!selectedConversation) {
        console.log("[handleNewMessage] no selected conversation, ignoring message");
        return;
      }
      if (normalized.conversationId !== selectedConversation._id) {
        console.log("[handleNewMessage] message conversationId does not match selectedConversation._id");
        console.log("message conversationId:", normalized.conversationId, "selectedConversation._id:", selectedConversation._id);
        return;
      }

      dispatchMessages((prevMessages) => {
        const exists = prevMessages.some((m) => m._id === normalized._id);
        if (exists) {
          console.log("[handleNewMessage] message already exists in state, ignoring");
          return prevMessages;
        }
        console.log("[handleNewMessage] adding message to state:", normalized._id);
        return [...prevMessages, normalized];
      });

      setSelectedConversation((prev) => {
        if (prev && prev._id === normalized.conversationId) {
          return {
            ...prev,
            messages: uniqueMessages([...(prev.messages || []), normalized]),
          };
        }
        return prev;
      });

      setConversations((prev) =>
        prev.map((conv) =>
          conv._id === normalized.conversationId
            ? { ...conv, messages: uniqueMessages([...(conv.messages || []), normalized]) }
            : conv
        )
      );
    },
    [selectedConversation, uniqueMessages]
  );

  useEffect(() => {
    if (!socketRef.current) return;
    socketRef.current.on("newMessage", handleNewMessage);
    return () => {
      socketRef.current.off("newMessage", handleNewMessage);
    };
  }, [handleNewMessage]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim() || !selectedConversation || !socketRef.current) return;

    const otherIdRaw = getOtherBusinessId(selectedConversation, myBusinessId);
    if (!otherIdRaw) {
      console.warn("[sendMessage] could not find other business id");
      return;
    }
    const otherId =
      typeof otherIdRaw === "string"
        ? otherIdRaw
        : otherIdRaw._id
        ? otherIdRaw._id.toString()
        : otherIdRaw.toString();

    const tempId = "pending-" + Math.random().toString(36).substr(2, 9);

    const payload = {
      conversationId: selectedConversation._id.toString(),
      from: myBusinessId.toString(),
      to: otherId,
      text: input.trim(),
    };

    console.log("[sendMessage] sending message payload:", payload);

    const optimistic = {
      ...payload,
      timestamp: new Date().toISOString(),
      _id: tempId,
      fromBusinessId: payload.from,
      toBusinessId: payload.to,
      sending: true,
    };

    dispatchMessages({ type: "append", payload: optimistic });
    setInput("");

    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 50);

    let ackReceived = false;

    const timeoutId = setTimeout(() => {
      if (!ackReceived) {
        dispatchMessages({ type: "replace", payload: { ...optimistic, sending: false, failed: true } });
        alert("Sending the message took too long. Please try again.");
      }
    }, 10000);

    socketRef.current.emit("sendMessage", payload, (ack) => {
      ackReceived = true;
      clearTimeout(timeoutId);
      console.log("[sendMessage] ack:", ack);

      if (!ack) {
        alert("We received an empty response from the server. Please try again.");
        dispatchMessages({ type: "replace", payload: { ...optimistic, sending: false, failed: true } });
        return;
      }

      if (!ack.ok) {
        alert("Message sending failed: " + (ack.error || "Unknown error"));
        dispatchMessages({ type: "remove", payload: tempId });
        return;
      }

      if (ack.message?._id) {
        const real = {
          ...ack.message,
          fromBusinessId: ack.message.fromBusinessId || ack.message.from,
          toBusinessId: ack.message.toBusinessId || ack.message.to,
          tempId, // for replacing the temporary message
          sending: false,
          failed: false,
        };
        dispatchMessages({
          type: "replace",
          payload: real,
        });
      }
    });
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
          Business Messages
        </Box>
        {conversations.length === 0 && (
          <Box sx={{ p: 3, color: "#bbb", textAlign: "center" }}>
            No business conversations
          </Box>
        )}
        {conversations
          .filter((conv) => conv && Array.isArray(conv.messages))
          .map((conv) => {
            const otherId = getOtherBusinessId(conv, myBusinessId);
            const partner =
              conv.participantsInfo?.find((b) => b._id.toString() === otherId) || {
                businessName: "Business",
              };
            const lastMsg = conv.messages?.[conv.messages.length - 1]?.text || "";

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
                  console.log("[conversation clicked] setting selectedConversation:", conv._id);
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
                  {lastMsg || "No messages"}
                </Box>
              </Box>
            );
          })}
      </Box>

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
                  Conversation with{" "}
                  {selectedConversation.participantsInfo?.find(
                    (b) => b._id.toString() !== myBusinessId.toString()
                  )?.businessName || "Business"}
                </Box>
                {messages.map((msg, i) => {
                  const fromId = msg.fromBusinessId || msg.from || msg.fromId;
                  const isMine = fromId?.toString() === myBusinessId?.toString();

                  console.log(`[renderMessage] #${i} fromId: ${fromId}, isMine: ${isMine}`);

                  return (
                    <Box
                      key={msg?._id ? msg._id.toString() : `pending-${i}`}
                      sx={{
                        display: "flex",
                        justifyContent: isMine ? "flex-end" : "flex-start",
                        mb: 1,
                      }}
                    >
                      <Box
                        sx={{
                          background: isMine ? "#e6ddff" : "#fff",
                          p: 1.2,
                          borderRadius: 2,
                          maxWidth: 340,
                          boxShadow: 1,
                          wordBreak: "break-word",
                          color: isMine ? "black" : "#333",
                          borderTopLeftRadius: isMine ? 16 : 2,
                          borderTopRightRadius: isMine ? 2 : 16,
                          borderBottomLeftRadius: 16,
                          borderBottomRightRadius: 16,
                        }}
                      >
                        <Box>{msg?.text ?? "[No text to display]"}</Box>
                        <Box
                          sx={{
                            fontSize: 11,
                            color: "#888",
                            mt: 0.5,
                            textAlign: isMine ? "right" : "left",
                          }}
                        >
                          {(msg.timestamp || msg.createdAt) &&
                            new Date(msg.timestamp || msg.createdAt).toLocaleTimeString("he-IL", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          {msg.sending && <span> ⏳</span>}
                          {msg.failed && <span> ❌</span>}
                        </Box>
                      </Box>
                    </Box>
                  );
                })}

                <div ref={messagesEndRef} />
              </>
            ) : (
              <Box sx={{ color: "#bbb", textAlign: "center", mt: 12 }}>
                {error || "No messages in this conversation"}
              </Box>
            )
          ) : (
            <Box sx={{ color: "#bbb", textAlign: "center", mt: 12 }}>
              Select a business conversation from the right column
            </Box>
          )}
        </Box>

        {selectedConversation && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage();
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
            <TextField
              fullWidth
              size="medium"
              placeholder="Type a message..."
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
              disabled={!input.trim()}
            >
              Send
            </Button>
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
