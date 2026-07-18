import React, {
  FormEvent,
  useCallback,
  useEffect,
  useReducer,
  useRef,
  useState,
} from "react";
import { io, Socket } from "socket.io-client";
import {
  Building2,
  CheckCircle2,
  Loader2,
  MessageCircle,
  Search,
  Send,
  Sparkles,
  Wifi,
  WifiOff,
  X,
} from "lucide-react";
import { useLocation } from "react-router-dom";

import API from "../../../../api";
import { useAuth } from "../../../../context/AuthContext";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "https://api.bizuply.com";

/* =========================================================
   DEBUG LOGS
   כשתסיימי לבדוק אפשר לשנות ל-false
========================================================= */
const CHAT_DEBUG = false;

function chatLog(label: string, data?: unknown) {
  if (!CHAT_DEBUG) return;

  if (data !== undefined) {
    console.log(`🟣 [CollabChat] ${label}`, data);
  } else {
    console.log(`🟣 [CollabChat] ${label}`);
  }
}

function chatWarn(label: string, data?: unknown) {
  if (!CHAT_DEBUG) return;

  if (data !== undefined) {
    console.warn(`🟠 [CollabChat] ${label}`, data);
  } else {
    console.warn(`🟠 [CollabChat] ${label}`);
  }
}

function chatError(label: string, data?: unknown) {
  if (!CHAT_DEBUG) return;

  if (data !== undefined) {
    console.error(`🔴 [CollabChat] ${label}`, data);
  } else {
    console.error(`🔴 [CollabChat] ${label}`);
  }
}

type BusinessInfo = {
  _id: string;
  businessName?: string;
};

type ChatMessage = {
  _id?: string;
  tempId?: string;
  conversationId?: string;
  conversation?: string;
  chatId?: string;
  conversationType?: string;
  from?: string;
  to?: string;
  fromId?: string;
  toId?: string;
  fromBusinessId?: string;
  toBusinessId?: string;
  text?: string;
  timestamp?: string;
  createdAt?: string;
  sending?: boolean;
  failed?: boolean;
};

type Conversation = {
  _id: string;
  participants?: string[];
  participantsInfo?: BusinessInfo[];
  messages?: ChatMessage[];
  conversationType?: string;
};

type CollabChatProps = {
  token?: string;
  myBusinessId: string;
  myBusinessName: string;
  onClose?: () => void;
  initialConversationId?: string | null;
};

type MessagesAction =
  | { type: "set"; payload: ChatMessage[] }
  | { type: "append"; payload: ChatMessage }
  | { type: "replace"; payload: ChatMessage }
  | { type: "remove"; payload: string };

type AuthValue = {
  refreshAccessToken: () => Promise<string | null>;
  logout: () => void;
};

type SocketAck = {
  ok?: boolean;
  error?: string;
  message?: ChatMessage;
  conversationId?: string;
  conversationType?: string;
};

function getMessageRealId(message: ChatMessage) {
  const id = message._id?.toString?.() || "";
  if (!id) return "";

  if (id.startsWith("pending-")) return "";

  return id;
}

function getMessageTempId(message: ChatMessage) {
  return message.tempId?.toString?.() || "";
}

function getMessageConversationId(message: ChatMessage) {
  return (
    message.conversationId ||
    message.conversation ||
    message.chatId ||
    ""
  ).toString();
}

function getMessageFromId(message: ChatMessage) {
  return (
    message.fromBusinessId ||
    message.from ||
    message.fromId ||
    ""
  ).toString();
}

function getMessageToId(message: ChatMessage) {
  return (
    message.toBusinessId ||
    message.to ||
    message.toId ||
    ""
  ).toString();
}

function getMessageText(message: ChatMessage) {
  return (message.text || "").trim();
}

function getMessageTimeValue(message: ChatMessage) {
  const value = message.timestamp || message.createdAt || "";

  if (!value) return 0;

  const time = new Date(value).getTime();

  return Number.isNaN(time) ? 0 : time;
}

function areSameMessage(a: ChatMessage, b: ChatMessage) {
  const aRealId = getMessageRealId(a);
  const bRealId = getMessageRealId(b);

  if (aRealId && bRealId && aRealId === bRealId) return true;

  const aTempId = getMessageTempId(a);
  const bTempId = getMessageTempId(b);

  if (aTempId && bTempId && aTempId === bTempId) return true;

  if (aTempId && bRealId && aTempId === bRealId) return true;
  if (aRealId && bTempId && aRealId === bTempId) return true;

  const sameConversation =
    getMessageConversationId(a) &&
    getMessageConversationId(a) === getMessageConversationId(b);

  const sameFrom =
    getMessageFromId(a) && getMessageFromId(a) === getMessageFromId(b);

  const sameTo =
    getMessageToId(a) && getMessageToId(a) === getMessageToId(b);

  const sameText =
    getMessageText(a) && getMessageText(a) === getMessageText(b);

  const aTime = getMessageTimeValue(a);
  const bTime = getMessageTimeValue(b);

  const closeTime = aTime && bTime && Math.abs(aTime - bTime) <= 7000;

  return Boolean(sameConversation && sameFrom && sameTo && sameText && closeTime);
}

function dedupeMessages(items: ChatMessage[]) {
  const result: ChatMessage[] = [];

  for (const message of items) {
    const duplicateIndex = result.findIndex((existing) =>
      areSameMessage(existing, message)
    );

    if (duplicateIndex === -1) {
      result.push(message);
      continue;
    }

    const existing = result[duplicateIndex];

    const existingRealId = getMessageRealId(existing);
    const incomingRealId = getMessageRealId(message);

    const shouldReplace =
      (!existingRealId && incomingRealId) ||
      existing.sending === true ||
      existing.failed === true;

    if (shouldReplace) {
      result[duplicateIndex] = {
        ...existing,
        ...message,
        sending: message.sending ?? false,
        failed: message.failed ?? false,
      };
    }
  }

  return result;
}

function getOtherBusinessId(
  conversation: Conversation | null,
  myBusinessId: string
) {
  if (!conversation || !myBusinessId) return "";

  if (Array.isArray(conversation.participantsInfo)) {
    const info = conversation.participantsInfo.find(
      (business) => business._id?.toString() !== myBusinessId.toString()
    );

    if (info?._id) return info._id.toString();
  }

  if (Array.isArray(conversation.participants)) {
    const raw = conversation.participants.find(
      (id) => id?.toString() !== myBusinessId.toString()
    );

    if (raw) return raw.toString();
  }

  if (Array.isArray(conversation.messages)) {
    for (const message of conversation.messages) {
      const fromId = getMessageFromId(message);
      const toId = getMessageToId(message);

      if (fromId && fromId !== myBusinessId.toString()) return fromId;
      if (toId && toId !== myBusinessId.toString()) return toId;
    }
  }

  return "";
}

function messagesReducer(state: ChatMessage[], action: MessagesAction) {
  switch (action.type) {
    case "set": {
      const clean = dedupeMessages(action.payload);

      chatLog("messagesReducer:set", {
        before: action.payload.length,
        after: clean.length,
      });

      return clean;
    }

    case "append": {
      const incoming = action.payload;

      const exists = state.some((message) => areSameMessage(message, incoming));

      if (exists) {
        chatWarn("messagesReducer:append duplicate ignored", {
          realId: getMessageRealId(incoming),
          tempId: getMessageTempId(incoming),
          text: incoming.text,
        });

        return state;
      }

      chatLog("messagesReducer:append", {
        realId: getMessageRealId(incoming),
        tempId: getMessageTempId(incoming),
        text: incoming.text,
      });

      return dedupeMessages([...state, incoming]);
    }

    case "replace": {
      const incoming = action.payload;

      const next = state.map((message) => {
        if (areSameMessage(message, incoming)) {
          return {
            ...message,
            ...incoming,
            sending: incoming.sending ?? false,
            failed: incoming.failed ?? false,
          };
        }

        return message;
      });

      const wasReplaced = next.some((message) =>
        areSameMessage(message, incoming)
      );

      if (!wasReplaced) {
        next.push(incoming);
      }

      const clean = dedupeMessages(next);

      chatLog("messagesReducer:replace", {
        realId: getMessageRealId(incoming),
        tempId: getMessageTempId(incoming),
        before: state.length,
        after: clean.length,
      });

      return clean;
    }

    case "remove":
      chatWarn("messagesReducer:remove", {
        id: action.payload,
      });

      return state.filter(
        (message) =>
          message._id !== action.payload && message.tempId !== action.payload
      );

    default:
      return state;
  }
}

export default function CollabChat({
  myBusinessId,
  myBusinessName,
  onClose,
  initialConversationId,
}: CollabChatProps) {
  const socketRef = useRef<Socket | null>(null);
  const socketInitializedRef = useRef(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const {
    refreshAccessToken: refreshAccessTokenOriginal,
    logout: logoutOriginal,
  } = useAuth() as AuthValue;

  const location = useLocation();

  const conversationIdFromNav =
    initialConversationId ||
    (location.state as { conversationId?: string } | null)?.conversationId ||
    null;

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);

  const [messages, dispatchMessages] = useReducer(messagesReducer, []);
  const [input, setInput] = useState("");
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [connected, setConnected] = useState(false);
  const [loadingConversations, setLoadingConversations] = useState(true);

  const refreshAccessToken = useCallback(async (options) => {
    chatLog("refreshAccessToken:start", { force: Boolean(options?.force) });

    const newToken = await refreshAccessTokenOriginal(options);

    chatLog("refreshAccessToken:done", {
      hasToken: Boolean(newToken),
      tokenLength: newToken?.length || 0,
    });

    return newToken;
  }, [refreshAccessTokenOriginal]);

  const logout = useCallback(() => {
    chatWarn("logout called");
    logoutOriginal();
  }, [logoutOriginal]);

  const normalizeMessages = useCallback((items: ChatMessage[]) => {
    const normalized = items.map((message) => ({
      ...message,
      text: typeof message.text === "string" ? message.text : "",
      fromBusinessId:
        message.fromBusinessId || message.from || message.fromId || "",
      toBusinessId: message.toBusinessId || message.to || message.toId || "",
      conversationId:
        message.conversationId || message.conversation || message.chatId,
      sending: message.sending ?? false,
      failed: message.failed ?? false,
    }));

    const clean = dedupeMessages(normalized);

    chatLog("normalizeMessages", {
      before: items.length,
      normalized: normalized.length,
      afterDedupe: clean.length,
    });

    return clean;
  }, []);

  const mergeConversationMessage = useCallback(
    (conversation: Conversation, message: ChatMessage) => {
      return {
        ...conversation,
        messages: dedupeMessages([...(conversation.messages || []), message]),
      };
    },
    []
  );

  const openConversationById = useCallback(
    async (conversationId: string) => {
      if (!conversationId) return;

      chatLog("openConversationById:start", {
        conversationId,
      });

      const minimalConversation: Conversation = {
        _id: conversationId,
        conversationType: "business-business",
        messages: [],
      };

      setSelectedConversation((prev) => {
        if (prev?._id?.toString() === conversationId.toString()) {
          return prev;
        }

        return minimalConversation;
      });

      try {
        const accessToken = await refreshAccessToken();

        if (!accessToken) {
          chatError("openConversationById:no access token");
          return;
        }

        const res = await API.get(`/business-chat/${conversationId}/messages`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        const unique = normalizeMessages(res.data.messages || []);

        dispatchMessages({
          type: "set",
          payload: unique,
        });

        setSelectedConversation((prev) => {
          if (!prev || prev._id?.toString() !== conversationId.toString()) {
            return {
              ...minimalConversation,
              messages: unique,
            };
          }

          return {
            ...prev,
            messages: unique,
          };
        });

        setConversations((prev) => {
          const exists = prev.some(
            (conversation) =>
              conversation._id?.toString() === conversationId.toString()
          );

          if (exists) {
            return prev.map((conversation) =>
              conversation._id?.toString() === conversationId.toString()
                ? {
                    ...conversation,
                    messages: unique,
                    conversationType:
                      conversation.conversationType || "business-business",
                  }
                : conversation
            );
          }

          return [
            {
              ...minimalConversation,
              messages: unique,
            },
            ...prev,
          ];
        });
      } catch (err: any) {
        chatError("openConversationById:failed", {
          message: err?.message,
          response: err?.response?.data,
          status: err?.response?.status,
        });
      }
    },
    [normalizeMessages, refreshAccessToken]
  );

  const fetchConversations = useCallback(async () => {
    try {
      setLoadingConversations(true);
      setError("");

      const accessToken = await refreshAccessToken();

      if (!accessToken) {
        chatError("fetchConversations:no access token");
        return;
      }

      const res = await API.get("/business-chat/my-conversations", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      const rawConversations = res.data.conversations || [];

      const normalizedConversations: Conversation[] = rawConversations.map(
        (conversation: Conversation) => ({
          ...conversation,
          messages: Array.isArray(conversation.messages)
            ? normalizeMessages(conversation.messages)
            : [],
          conversationType:
            conversation.conversationType || "business-business",
        })
      );

      setConversations(normalizedConversations);

      if (conversationIdFromNav) {
        const target = normalizedConversations.find(
          (conversation) =>
            conversation._id.toString() === conversationIdFromNav.toString()
        );

        if (target) {
          setSelectedConversation(target);
          return;
        }

        await openConversationById(conversationIdFromNav);
        return;
      }

      if (!conversationIdFromNav && normalizedConversations.length > 0) {
        setSelectedConversation((prev) => {
          if (prev) {
            const stillExists = normalizedConversations.find(
              (conversation) =>
                conversation._id?.toString() === prev._id?.toString()
            );

            return stillExists || normalizedConversations[0];
          }

          return normalizedConversations[0];
        });
      }

      if (!conversationIdFromNav && normalizedConversations.length === 0) {
        setSelectedConversation(null);
        dispatchMessages({ type: "set", payload: [] });
      }
    } catch (err: any) {
      chatError("fetchConversations:failed", {
        message: err?.message,
        status: err?.response?.status,
        response: err?.response?.data,
      });

      setConversations([]);
      setError("שגיאה בטעינת השיחות");

      if (conversationIdFromNav) {
        await openConversationById(conversationIdFromNav);
      }
    } finally {
      setLoadingConversations(false);
    }
  }, [
    refreshAccessToken,
    conversationIdFromNav,
    normalizeMessages,
    openConversationById,
  ]);

  useEffect(() => {
    if (!myBusinessId) return;

    fetchConversations();
  }, [myBusinessId, conversationIdFromNav, fetchConversations]);

  useEffect(() => {
    if (!myBusinessId) {
      chatWarn("setupSocket skipped:no myBusinessId");
      return;
    }

    if (socketInitializedRef.current) {
      chatWarn("setupSocket skipped:already initialized");
      return;
    }

    socketInitializedRef.current = true;

    async function setupSocket() {
      const accessToken = await refreshAccessToken();

      if (!accessToken) {
        chatError("setupSocket:no access token");
        socketInitializedRef.current = false;
        return;
      }

      const socket = io(SOCKET_URL, {
        path: "/socket.io",
        auth: {
          token: accessToken,
          role: "business",
          businessId: myBusinessId,
          businessName: myBusinessName,
        },
        transports: ["websocket"],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        timeout: 10000,
      });

      socketRef.current = socket;

      socket.on("connect", () => {
        setConnected(true);
        fetchConversations();
      });

      socket.on("disconnect", () => {
        setConnected(false);
      });

      socket.on("connect_error", (err: any) => {
        chatError("socket:connect_error", {
          message: err?.message,
          description: err?.description,
          context: err?.context,
          data: err?.data,
          socketUrl: SOCKET_URL,
        });

        setConnected(false);
      });

      socket.io.on("reconnect", () => {
        setConnected(true);
        fetchConversations();
      });

      socket.io.on("reconnect_failed", () => {
        setConnected(false);
      });

      socket.on("tokenExpired", async () => {
        const newToken = await refreshAccessToken({ force: true });

        if (!newToken) {
          logout();
          return;
        }

        socket.auth = {
          ...socket.auth,
          token: newToken,
        };

        socket.disconnect();
        socket.connect();
      });

      socket.on("businessChatUpdated", () => {
        fetchConversations();
      });

      socket.on("businessUpdates", (payload) => {
        if (payload?.type === "businessChatUpdated") {
          fetchConversations();
        }
      });
    }

    setupSocket();

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        socketInitializedRef.current = false;
      }
    };
  }, [
    myBusinessId,
    myBusinessName,
    refreshAccessToken,
    logout,
    fetchConversations,
  ]);

  useEffect(() => {
    if (!socketRef.current) return;

    conversations.forEach((conversation) => {
      const isBusinessConversation =
        conversation.conversationType === "business-business";

      socketRef.current?.emit(
        "joinConversation",
        conversation._id,
        isBusinessConversation
      );
    });
  }, [conversations]);

  useEffect(() => {
    if (!socketRef.current || !selectedConversation) {
      dispatchMessages({ type: "set", payload: [] });
      return;
    }

    const conversationId = selectedConversation._id;

    const joinHandler = () => {
      const isBusinessConversation =
        selectedConversation.conversationType === "business-business";

      socketRef.current?.emit(
        "joinConversation",
        conversationId,
        isBusinessConversation
      );
    };

    socketRef.current.on("connect", joinHandler);
    joinHandler();

    async function fetchMessages() {
      try {
        const accessToken = await refreshAccessToken();

        if (!accessToken) {
          chatError("fetchMessages:no access token");
          return;
        }

        const res = await API.get(`/business-chat/${conversationId}/messages`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        const unique = normalizeMessages(res.data.messages || []);

        dispatchMessages({
          type: "set",
          payload: unique,
        });

        setSelectedConversation((prev) => {
          if (!prev || prev._id?.toString() !== conversationId.toString()) {
            return prev;
          }

          return {
            ...prev,
            messages: unique,
          };
        });

        setConversations((prev) =>
          prev.map((conversation) =>
            conversation._id?.toString() === conversationId.toString()
              ? {
                  ...conversation,
                  messages: unique,
                }
              : conversation
          )
        );
      } catch (err: any) {
        chatError("fetchMessages:failed", {
          message: err?.message,
          status: err?.response?.status,
          response: err?.response?.data,
        });

        dispatchMessages({ type: "set", payload: [] });
      }
    }

    fetchMessages();

    return () => {
      const isBusinessConversation =
        selectedConversation.conversationType === "business-business";

      socketRef.current?.emit(
        "leaveConversation",
        conversationId,
        isBusinessConversation
      );

      socketRef.current?.off("connect", joinHandler);
    };
  }, [
    selectedConversation?._id,
    selectedConversation?.conversationType,
    refreshAccessToken,
    normalizeMessages,
  ]);

  const handleNewMessage = useCallback(
    (
      messagePayload: ChatMessage & {
        fullMsg?: ChatMessage;
        message?: ChatMessage;
      }
    ) => {
      const fullMessage =
        messagePayload.fullMsg || messagePayload.message || messagePayload;

      if (!fullMessage) return;

      const normalized: ChatMessage = {
        ...fullMessage,
        text: typeof fullMessage.text === "string" ? fullMessage.text : "",
        fromBusinessId:
          fullMessage.fromBusinessId || fullMessage.from || fullMessage.fromId || "",
        toBusinessId:
          fullMessage.toBusinessId || fullMessage.to || fullMessage.toId || "",
        conversationId:
          fullMessage.conversationId ||
          fullMessage.conversation ||
          fullMessage.chatId ||
          messagePayload.conversationId,
        sending: false,
        failed: false,
      };

      const incomingConversationId = getMessageConversationId(normalized);

      if (!incomingConversationId) return;

      setConversations((prev) => {
        const exists = prev.some(
          (conversation) =>
            conversation._id?.toString() === incomingConversationId
        );

        if (!exists) {
          return [
            {
              _id: incomingConversationId,
              conversationType: "business-business",
              messages: [normalized],
            },
            ...prev,
          ];
        }

        return prev.map((conversation) => {
          if (conversation._id?.toString() === incomingConversationId) {
            return mergeConversationMessage(conversation, normalized);
          }

          return conversation;
        });
      });

      setSelectedConversation((prev) => {
        if (prev && prev._id?.toString() === incomingConversationId) {
          return mergeConversationMessage(prev, normalized);
        }

        return prev;
      });

      if (selectedConversation?._id?.toString() === incomingConversationId) {
        dispatchMessages({
          type: "append",
          payload: normalized,
        });
      }
    },
    [mergeConversationMessage, selectedConversation?._id]
  );

  useEffect(() => {
    if (!socketRef.current) return;

    socketRef.current.off("newMessage", handleNewMessage);
    socketRef.current.on("newMessage", handleNewMessage);

    return () => {
      socketRef.current?.off("newMessage", handleNewMessage);
    };
  }, [handleNewMessage]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim() || !selectedConversation || !socketRef.current) {
      return;
    }

    if (!socketRef.current.connected) {
      alert("החיבור לצ׳אט לא פעיל כרגע. נסה לרענן את העמוד.");
      return;
    }

    const otherId = getOtherBusinessId(selectedConversation, myBusinessId);

    if (!otherId) {
      alert("לא ניתן לזהות את העסק השני בשיחה. נסה לרענן את הצ׳אט.");
      return;
    }

    const tempId = `pending-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 11)}`;

    const payload: ChatMessage = {
      conversationId: selectedConversation._id.toString(),
      conversationType: "business-business",
      from: myBusinessId.toString(),
      to: otherId,
      text: input.trim(),
      tempId,
    };

    const optimisticMessage: ChatMessage = {
      ...payload,
      timestamp: new Date().toISOString(),
      _id: tempId,
      tempId,
      fromBusinessId: payload.from,
      toBusinessId: payload.to,
      sending: true,
      failed: false,
    };

    dispatchMessages({ type: "append", payload: optimisticMessage });
    setInput("");

    setSelectedConversation((prev) => {
      if (!prev) return prev;

      return mergeConversationMessage(prev, optimisticMessage);
    });

    setConversations((prev) =>
      prev.map((conversation) =>
        conversation._id?.toString() === selectedConversation._id?.toString()
          ? mergeConversationMessage(conversation, optimisticMessage)
          : conversation
      )
    );

    window.setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 50);

    let ackReceived = false;

    const timeoutId = window.setTimeout(() => {
      if (!ackReceived) {
        dispatchMessages({
          type: "replace",
          payload: {
            ...optimisticMessage,
            sending: false,
            failed: true,
          },
        });

        alert("שליחת ההודעה לוקחת יותר מדי זמן. נסה שוב.");
      }
    }, 15000);

    socketRef.current.emit("sendMessage", payload, (ack: SocketAck) => {
      ackReceived = true;
      window.clearTimeout(timeoutId);

      if (!ack) {
        alert("לא התקבלה תגובה מהשרת. נסה שוב.");

        dispatchMessages({
          type: "replace",
          payload: {
            ...optimisticMessage,
            sending: false,
            failed: true,
          },
        });

        return;
      }

      if (!ack.ok) {
        alert(`שליחת ההודעה נכשלה: ${ack.error || "שגיאה לא ידועה"}`);
        dispatchMessages({ type: "remove", payload: tempId });
        return;
      }

      if (!ack.message) {
        dispatchMessages({
          type: "replace",
          payload: {
            ...optimisticMessage,
            sending: false,
            failed: false,
          },
        });

        fetchConversations();
        return;
      }

      const realMessage: ChatMessage = {
        ...ack.message,
        conversationId:
          ack.message.conversationId ||
          ack.conversationId ||
          selectedConversation._id.toString(),
        conversationType:
          ack.message.conversationType ||
          ack.conversationType ||
          "business-business",
        fromBusinessId:
          ack.message.fromBusinessId || ack.message.from || ack.message.fromId,
        toBusinessId:
          ack.message.toBusinessId || ack.message.to || ack.message.toId,
        tempId,
        sending: false,
        failed: false,
      };

      dispatchMessages({ type: "replace", payload: realMessage });

      setSelectedConversation((prev) => {
        if (!prev) return prev;

        return {
          ...prev,
          messages: dedupeMessages(
            (prev.messages || []).map((message) =>
              areSameMessage(message, optimisticMessage) ||
              areSameMessage(message, realMessage)
                ? realMessage
                : message
            )
          ),
        };
      });

      setConversations((prev) =>
        prev.map((conversation) =>
          conversation._id?.toString() === selectedConversation._id?.toString()
            ? {
                ...conversation,
                messages: dedupeMessages(
                  (conversation.messages || []).map((message) =>
                    areSameMessage(message, optimisticMessage) ||
                    areSameMessage(message, realMessage)
                      ? realMessage
                      : message
                  )
                ),
              }
            : conversation
        )
      );
    });
  };

  const filteredConversations = conversations
    .filter((conversation) => conversation)
    .filter((conversation) => {
      const partner = getConversationPartner(conversation, myBusinessId);
      const lastMessage =
        conversation.messages?.[conversation.messages.length - 1]?.text || "";

      const query = search.trim().toLowerCase();

      if (!query) return true;

      return (
        partner.businessName.toLowerCase().includes(query) ||
        lastMessage.toLowerCase().includes(query)
      );
    });

  const selectedPartner = selectedConversation
    ? getConversationPartner(selectedConversation, myBusinessId)
    : null;

  return (
    <section
      dir="rtl"
      className="flex h-[72vh] min-h-[560px] w-full overflow-hidden rounded-[2rem] border border-slate-100 bg-white text-right shadow-[0_24px_80px_rgba(15,23,42,0.10)]"
    >
      <aside className="hidden w-[340px] shrink-0 border-l border-slate-100 bg-gradient-to-b from-white via-sky-50/40 to-violet-50/40 md:flex md:flex-col">
        <div className="border-b border-slate-100 bg-white/90 p-5 backdrop-blur">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-violet-100 bg-violet-50 px-3 py-1.5 text-[11px] font-black text-violet-700">
                <Sparkles className="h-3.5 w-3.5" />
                צ׳אט שיתופי פעולה
              </div>

              <h2 className="mt-3 text-xl font-black text-slate-950">
                הודעות עסקיות
              </h2>

              <p className="mt-1 text-xs font-semibold text-slate-500">
                {conversations.length} שיחות
              </p>
            </div>

            <ConnectionBadge connected={connected} />
          </div>

          <div className="relative mt-4">
            <Search className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="חיפוש שיחות..."
              className="h-11 w-full rounded-2xl border border-slate-200 bg-slate-50 pr-11 pl-4 text-sm font-semibold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-300 focus:bg-white focus:ring-4 focus:ring-violet-100"
            />
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-3">
          {loadingConversations ? (
            <ConversationSkeleton />
          ) : filteredConversations.length === 0 ? (
            <EmptySidebar onRefresh={fetchConversations} />
          ) : (
            <div className="space-y-2">
              {filteredConversations.map((conversation) => {
                const partner = getConversationPartner(
                  conversation,
                  myBusinessId
                );

                const lastMessage =
                  conversation.messages?.[conversation.messages.length - 1]
                    ?.text || "אין הודעות";

                const isActive =
                  selectedConversation?._id?.toString() ===
                  conversation._id?.toString();

                return (
                  <button
                    key={conversation._id}
                    type="button"
                    onClick={() => setSelectedConversation(conversation)}
                    className={[
                      "w-full rounded-2xl border p-3 text-right transition hover:-translate-y-0.5",
                      isActive
                        ? "border-violet-200 bg-white text-slate-950 shadow-[0_16px_45px_rgba(124,58,237,0.16)] ring-2 ring-violet-100"
                        : "border-white bg-white/80 text-slate-800 shadow-sm hover:border-sky-100 hover:bg-white hover:shadow-md",
                    ].join(" ")}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={[
                          "flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-sm font-black shadow-sm",
                          isActive
                            ? "bg-gradient-to-br from-violet-600 to-fuchsia-500 text-white"
                            : "bg-sky-50 text-sky-700",
                        ].join(" ")}
                      >
                        {getInitials(partner.businessName)}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className="truncate text-sm font-black">
                            {partner.businessName}
                          </p>

                          {isActive && (
                            <span className="shrink-0 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-black text-emerald-700">
                              פתוח
                            </span>
                          )}
                        </div>

                        <p className="mt-0.5 truncate text-xs font-semibold text-slate-500">
                          {lastMessage}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </aside>

      <main className="flex min-w-0 flex-1 flex-col bg-[radial-gradient(circle_at_top_left,#f0f9ff_0%,#f8fafc_38%,#ffffff_100%)]">
        <header className="flex items-center justify-between gap-4 border-b border-slate-100 bg-white/90 px-4 py-4 backdrop-blur sm:px-5">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-100 to-violet-100 text-violet-700 shadow-sm">
              <Building2 className="h-5 w-5" />
            </div>

            <div className="min-w-0">
              <h3 className="truncate text-base font-black text-slate-950">
                {selectedPartner
                  ? `שיחה עם ${selectedPartner.businessName}`
                  : "בחר שיחה עסקית"}
              </h3>

              <p className="mt-0.5 flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                {connected ? (
                  <>
                    <Wifi className="h-3.5 w-3.5 text-emerald-600" />
                    מחובר
                  </>
                ) : (
                  <>
                    <WifiOff className="h-3.5 w-3.5 text-rose-600" />
                    לא מחובר
                  </>
                )}
              </p>
            </div>
          </div>

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-100 bg-white text-slate-600 shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-50"
              aria-label="סגירת צ׳אט"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-5 sm:px-6">
          {selectedConversation ? (
            messages.length > 0 ? (
              <div className="space-y-3">
                {messages.map((message, index) => {
                  const fromId =
                    message.fromBusinessId || message.from || message.fromId;

                  const isMine =
                    fromId?.toString() === myBusinessId?.toString();

                  return (
                    <MessageBubble
                      key={
                        getMessageRealId(message) ||
                        getMessageTempId(message) ||
                        `${getMessageConversationId(message)}-${getMessageFromId(
                          message
                        )}-${getMessageTimeValue(message)}-${index}`
                      }
                      message={message}
                      isMine={isMine}
                    />
                  );
                })}

                <div ref={messagesEndRef} />
              </div>
            ) : (
              <EmptyChat text={error || "אין הודעות בשיחה הזו"} />
            )
          ) : (
            <EmptyChat text="בחר שיחה עסקית מהרשימה" />
          )}
        </div>

        {selectedConversation && (
          <form
            onSubmit={(event: FormEvent<HTMLFormElement>) => {
              event.preventDefault();
              sendMessage();
            }}
            className="border-t border-slate-100 bg-white/95 p-4 backdrop-blur"
          >
            <div className="flex items-center gap-3">
              <input
                placeholder="הקלד הודעה..."
                value={input}
                onChange={(event) => setInput(event.target.value)}
                autoComplete="off"
                className="h-12 min-w-0 flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-300 focus:bg-white focus:ring-4 focus:ring-violet-100"
              />

              <button
                type="submit"
                disabled={!input.trim()}
                className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-700 to-fuchsia-600 px-5 text-sm font-black text-white shadow-[0_14px_30px_rgba(124,58,237,0.22)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Send className="h-5 w-5" />
                <span className="hidden sm:inline">שליחה</span>
              </button>
            </div>
          </form>
        )}
      </main>
    </section>
  );
}

function getConversationPartner(
  conversation: Conversation,
  myBusinessId: string
) {
  const otherId = getOtherBusinessId(conversation, myBusinessId);

  const partner =
    conversation.participantsInfo?.find(
      (business) => business._id?.toString() === otherId
    ) || null;

  return {
    _id: otherId,
    businessName: partner?.businessName || "עסק",
  };
}

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function formatMessageTime(message: ChatMessage) {
  const value = message.timestamp || message.createdAt;

  if (!value) return "";

  return new Date(value).toLocaleTimeString("he-IL", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function MessageBubble({
  message,
  isMine,
}: {
  message: ChatMessage;
  isMine: boolean;
}) {
  return (
    <div className={["flex", isMine ? "justify-start" : "justify-end"].join(" ")}>
      <div
        className={[
          "max-w-[78%] rounded-[1.4rem] px-4 py-3 shadow-sm",
          isMine
            ? "rounded-tl-md bg-gradient-to-br from-violet-700 to-fuchsia-600 text-white shadow-[0_12px_30px_rgba(124,58,237,0.20)]"
            : "rounded-tr-md border border-slate-100 bg-white text-slate-900 shadow-[0_10px_28px_rgba(15,23,42,0.05)]",
        ].join(" ")}
      >
        <p className="whitespace-pre-wrap break-words text-sm font-semibold leading-6">
          {message.text || "[אין טקסט]"}
        </p>

        <div
          className={[
            "mt-2 flex items-center gap-1.5 text-[11px] font-bold",
            isMine ? "justify-end text-white/75" : "text-slate-400",
          ].join(" ")}
        >
          <span>{formatMessageTime(message)}</span>

          {message.sending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
          {message.failed && <span className="text-rose-500">נכשל</span>}

          {!message.sending && !message.failed && isMine && (
            <CheckCircle2 className="h-3.5 w-3.5" />
          )}
        </div>
      </div>
    </div>
  );
}

function ConnectionBadge({ connected }: { connected: boolean }) {
  return (
    <div
      className={[
        "flex h-9 w-9 items-center justify-center rounded-xl shadow-sm",
        connected
          ? "bg-emerald-50 text-emerald-600 ring-1 ring-emerald-100"
          : "bg-rose-50 text-rose-600 ring-1 ring-rose-100",
      ].join(" ")}
      title={connected ? "מחובר" : "לא מחובר"}
    >
      {connected ? <Wifi className="h-4 w-4" /> : <WifiOff className="h-4 w-4" />}
    </div>
  );
}

function ConversationSkeleton() {
  return (
    <div className="space-y-2">
      {Array.from({ length: 5 }).map((_, index) => (
        <div
          key={index}
          className="flex animate-pulse gap-3 rounded-2xl border border-white bg-white/80 p-3 shadow-sm"
        >
          <div className="h-11 w-11 rounded-2xl bg-slate-100" />

          <div className="flex-1 space-y-2">
            <div className="h-3 w-28 rounded-full bg-slate-100" />
            <div className="h-3 w-40 rounded-full bg-slate-100" />
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptySidebar({ onRefresh }: { onRefresh: () => void }) {
  return (
    <div className="rounded-2xl border border-dashed border-sky-200 bg-white/80 p-6 text-center shadow-sm">
      <MessageCircle className="mx-auto h-8 w-8 text-sky-300" />

      <p className="mt-3 text-sm font-black text-slate-600">
        אין שיחות
      </p>

      <p className="mt-1 text-xs font-semibold text-slate-400">
        הודעות עסקיות חדשות יופיעו כאן.
      </p>

      <button
        type="button"
        onClick={onRefresh}
        className="mt-4 rounded-xl bg-violet-50 px-4 py-2 text-xs font-black text-violet-700 transition hover:bg-violet-100"
      >
        רענון
      </button>
    </div>
  );
}

function EmptyChat({ text }: { text: string }) {
  return (
    <div className="flex h-full min-h-[340px] items-center justify-center">
      <div className="max-w-sm rounded-[2rem] border border-dashed border-sky-200 bg-white/85 p-8 text-center shadow-[0_16px_45px_rgba(15,23,42,0.06)] backdrop-blur">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-100 to-violet-100 text-violet-700">
          <MessageCircle className="h-7 w-7" />
        </div>

        <h3 className="mt-4 text-lg font-black text-slate-950">
          אין שיחה פעילה
        </h3>

        <p className="mt-2 text-sm font-semibold leading-6 text-slate-500">
          {text}
        </p>
      </div>
    </div>
  );
}