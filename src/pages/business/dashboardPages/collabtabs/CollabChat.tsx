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
  Wifi,
  WifiOff,
  X,
} from "lucide-react";
import { useLocation } from "react-router-dom";

import API from "../../../../api";
import { useAuth } from "../../../../context/AuthContext";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "https://api.bizuply.com";

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
};

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

  return "";
}

function messagesReducer(state: ChatMessage[], action: MessagesAction) {
  switch (action.type) {
    case "set":
      return action.payload;

    case "append": {
      const incomingId = action.payload._id || action.payload.tempId;

      const exists = state.some((message) => {
        const currentId = message._id || message.tempId;
        return currentId && incomingId && currentId === incomingId;
      });

      if (exists) return state;

      return [...state, action.payload];
    }

    case "replace":
      return state.map((message) =>
        message._id === action.payload._id ||
        message._id === action.payload.tempId ||
        message.tempId === action.payload.tempId
          ? action.payload
          : message
      );

    case "remove":
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
}: CollabChatProps) {
  const socketRef = useRef<Socket | null>(null);
  const socketInitializedRef = useRef(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const { refreshAccessToken: refreshAccessTokenOriginal, logout: logoutOriginal } =
    useAuth() as AuthValue;

  const location = useLocation();
  const conversationIdFromNav =
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

  const refreshAccessToken = useCallback(async () => {
    const newToken = await refreshAccessTokenOriginal();
    return newToken;
  }, [refreshAccessTokenOriginal]);

  const logout = useCallback(() => {
    logoutOriginal();
  }, [logoutOriginal]);

  const uniqueMessages = useCallback((items: ChatMessage[]) => {
    const seen = new Set<string>();

    return items.filter((message) => {
      const id =
        message._id?.toString() ||
        message.tempId ||
        message.timestamp ||
        message.createdAt ||
        message.text ||
        "";

      if (!id) return true;
      if (seen.has(id)) return false;

      seen.add(id);
      return true;
    });
  }, []);

  const fetchConversations = useCallback(async () => {
    try {
      setLoadingConversations(true);
      setError("");

      const accessToken = await refreshAccessToken();
      if (!accessToken) return;

      const res = await API.get("/business-chat/my-conversations", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      const rawConversations = res.data.conversations || [];

      const normalizedConversations: Conversation[] = rawConversations.map(
        (conversation: Conversation) => ({
          ...conversation,
          messages: Array.isArray(conversation.messages)
            ? conversation.messages
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
      }

      if (!conversationIdFromNav && normalizedConversations.length > 0) {
        setSelectedConversation((prev) => prev || normalizedConversations[0]);
      }
    } catch (err) {
      console.error("Failed to load conversations:", err);
      setConversations([]);
      setError("Failed to load conversations");
    } finally {
      setLoadingConversations(false);
    }
  }, [refreshAccessToken, conversationIdFromNav]);

  useEffect(() => {
    if (!myBusinessId) return;
    if (socketInitializedRef.current) return;

    socketInitializedRef.current = true;

    async function setupSocket() {
      const accessToken = await refreshAccessToken();
      if (!accessToken) return;

      const socket = io(SOCKET_URL, {
        path: "/socket.io",
        auth: {
          token: accessToken,
          role: "business",
          businessId: myBusinessId,
          businessName: myBusinessName,
        },
        transports: ["websocket"],
      });

      socketRef.current = socket;

      socket.on("connect", () => {
        setConnected(true);
        fetchConversations();
      });

      socket.on("disconnect", () => {
        setConnected(false);
      });

      socket.on("connect_error", (err) => {
        console.error("Socket connection error:", err.message);
        setConnected(false);
      });

      socket.on("tokenExpired", async () => {
        const newToken = await refreshAccessToken();

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
        if (!accessToken) return;

        const res = await API.get(`/business-chat/${conversationId}/messages`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        const normalizedMessages: ChatMessage[] = (res.data.messages || []).map(
          (message: ChatMessage) => ({
            ...message,
            text: typeof message.text === "string" ? message.text : "",
            fromBusinessId: message.fromBusinessId || message.from,
            toBusinessId: message.toBusinessId || message.to,
          })
        );

        dispatchMessages({
          type: "set",
          payload: uniqueMessages(normalizedMessages),
        });
      } catch (err) {
        console.error("Failed to fetch messages:", err);
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
  }, [selectedConversation, refreshAccessToken, uniqueMessages]);

  const handleNewMessage = useCallback(
    (messagePayload: ChatMessage & { fullMsg?: ChatMessage }) => {
      const fullMessage = messagePayload.fullMsg || messagePayload;
      if (!fullMessage || !selectedConversation) return;

      const normalized: ChatMessage = {
        ...fullMessage,
        text: typeof fullMessage.text === "string" ? fullMessage.text : "",
        fromBusinessId: fullMessage.fromBusinessId || fullMessage.from,
        toBusinessId: fullMessage.toBusinessId || fullMessage.to,
        conversationId:
          fullMessage.conversationId ||
          fullMessage.conversation ||
          fullMessage.chatId,
      };

      const incomingConversationId = normalized.conversationId?.toString();
      const selectedConversationId = selectedConversation._id?.toString();

      if (
        !incomingConversationId ||
        incomingConversationId !== selectedConversationId
      ) {
        return;
      }

      dispatchMessages({
        type: "append",
        payload: normalized,
      });

      setSelectedConversation((prev) => {
        if (
          prev &&
          prev._id?.toString() === normalized.conversationId?.toString()
        ) {
          return {
            ...prev,
            messages: uniqueMessages([...(prev.messages || []), normalized]),
          };
        }

        return prev;
      });

      setConversations((prev) =>
        prev.map((conversation) => {
          if (
            conversation._id?.toString() ===
            normalized.conversationId?.toString()
          ) {
            return {
              ...conversation,
              messages: uniqueMessages([
                ...(conversation.messages || []),
                normalized,
              ]),
            };
          }

          return conversation;
        })
      );
    },
    [selectedConversation, uniqueMessages]
  );

  useEffect(() => {
    if (!socketRef.current) return;

    socketRef.current.on("newMessage", handleNewMessage);

    return () => {
      socketRef.current?.off("newMessage", handleNewMessage);
    };
  }, [handleNewMessage]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim() || !selectedConversation || !socketRef.current) return;

    const otherId = getOtherBusinessId(selectedConversation, myBusinessId);

    if (!otherId) {
      console.warn("Could not find other business id");
      return;
    }

    const tempId = `pending-${Math.random().toString(36).slice(2, 11)}`;

    const payload: ChatMessage = {
      conversationId: selectedConversation._id.toString(),
      conversationType: "business-business",
      from: myBusinessId.toString(),
      to: otherId,
      text: input.trim(),
    };

    const optimisticMessage: ChatMessage = {
      ...payload,
      timestamp: new Date().toISOString(),
      _id: tempId,
      tempId,
      fromBusinessId: payload.from,
      toBusinessId: payload.to,
      sending: true,
    };

    dispatchMessages({ type: "append", payload: optimisticMessage });
    setInput("");

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

        alert("Message sending took too long. Please try again.");
      }
    }, 10000);

    socketRef.current.emit("sendMessage", payload, (ack: SocketAck) => {
      ackReceived = true;
      window.clearTimeout(timeoutId);

      if (!ack) {
        alert("Empty server response. Please try again.");

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
        alert(`Failed to send message: ${ack.error || "Unknown error"}`);
        dispatchMessages({ type: "remove", payload: tempId });
        return;
      }

      if (ack.message?._id) {
        const realMessage: ChatMessage = {
          ...ack.message,
          fromBusinessId: ack.message.fromBusinessId || ack.message.from,
          toBusinessId: ack.message.toBusinessId || ack.message.to,
          tempId,
          sending: false,
          failed: false,
        };

        dispatchMessages({ type: "replace", payload: realMessage });
      }
    });
  };

  const filteredConversations = conversations
    .filter((conversation) => conversation && Array.isArray(conversation.messages))
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
    <section className="flex h-[72vh] min-h-[560px] w-full overflow-hidden rounded-[2rem] border border-slate-100 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.14)]">
      <aside className="hidden w-[320px] shrink-0 border-r border-slate-100 bg-slate-50/60 md:flex md:flex-col">
        <div className="border-b border-slate-100 bg-white p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-sky-50 px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.16em] text-sky-900">
                <MessageCircle className="h-3.5 w-3.5" />
                Collab Chat
              </div>

              <h2 className="mt-3 text-xl font-black text-slate-950">
                Business Messages
              </h2>

              <p className="mt-1 text-xs font-semibold text-slate-500">
                {conversations.length} conversations
              </p>
            </div>

            <ConnectionBadge connected={connected} />
          </div>

          <div className="relative mt-4">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search chats..."
              className="h-11 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm font-semibold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-300 focus:bg-white focus:ring-4 focus:ring-sky-100"
            />
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-3">
          {loadingConversations ? (
            <ConversationSkeleton />
          ) : filteredConversations.length === 0 ? (
            <EmptySidebar />
          ) : (
            <div className="space-y-2">
              {filteredConversations.map((conversation) => {
                const partner = getConversationPartner(
                  conversation,
                  myBusinessId
                );

                const lastMessage =
                  conversation.messages?.[conversation.messages.length - 1]
                    ?.text || "No messages";

                const isActive =
                  selectedConversation?._id?.toString() ===
                  conversation._id?.toString();

                return (
                  <button
                    key={conversation._id}
                    type="button"
                    onClick={() => setSelectedConversation(conversation)}
                    className={[
                      "w-full rounded-2xl p-3 text-left transition",
                      isActive
                        ? "bg-slate-950 text-white shadow-lg shadow-slate-200"
                        : "bg-white text-slate-800 hover:bg-sky-50",
                    ].join(" ")}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={[
                          "flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-sm font-black",
                          isActive
                            ? "bg-white/15 text-white"
                            : "bg-sky-50 text-sky-900",
                        ].join(" ")}
                      >
                        {getInitials(partner.businessName)}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-black">
                          {partner.businessName}
                        </p>
                        <p
                          className={[
                            "mt-0.5 truncate text-xs font-semibold",
                            isActive ? "text-slate-300" : "text-slate-500",
                          ].join(" ")}
                        >
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

      <main className="flex min-w-0 flex-1 flex-col bg-[radial-gradient(circle_at_top_left,#f0f9ff_0%,#f8fafc_35%,#ffffff_100%)]">
        <header className="flex items-center justify-between gap-4 border-b border-slate-100 bg-white/90 px-4 py-4 backdrop-blur sm:px-5">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-sky-50 text-sky-900">
              <Building2 className="h-5 w-5" />
            </div>

            <div className="min-w-0">
              <h3 className="truncate text-base font-black text-slate-950">
                {selectedPartner
                  ? `Chat with ${selectedPartner.businessName}`
                  : "Select a business chat"}
              </h3>

              <p className="mt-0.5 flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                {connected ? (
                  <>
                    <Wifi className="h-3.5 w-3.5 text-emerald-600" />
                    Connected
                  </>
                ) : (
                  <>
                    <WifiOff className="h-3.5 w-3.5 text-rose-600" />
                    Offline
                  </>
                )}
              </p>
            </div>
          </div>

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-600 transition hover:bg-slate-200"
              aria-label="Close chat"
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
                        message._id
                          ? message._id.toString()
                          : `pending-${index}`
                      }
                      message={message}
                      isMine={isMine}
                    />
                  );
                })}

                <div ref={messagesEndRef} />
              </div>
            ) : (
              <EmptyChat text={error || "No messages in this chat"} />
            )
          ) : (
            <EmptyChat text="Select a business chat from the left panel" />
          )}
        </div>

        {selectedConversation && (
          <form
            onSubmit={(event: FormEvent<HTMLFormElement>) => {
              event.preventDefault();
              sendMessage();
            }}
            className="border-t border-slate-100 bg-white p-4"
          >
            <div className="flex items-center gap-3">
              <input
                placeholder="Type a message..."
                value={input}
                onChange={(event) => setInput(event.target.value)}
                autoComplete="off"
                className="h-12 min-w-0 flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-300 focus:bg-white focus:ring-4 focus:ring-sky-100"
              />

              <button
                type="submit"
                disabled={!input.trim()}
                className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 text-sm font-black text-white shadow-lg shadow-slate-300 transition hover:-translate-y-0.5 hover:bg-sky-950 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Send className="h-5 w-5" />
                <span className="hidden sm:inline">Send</span>
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
    businessName: partner?.businessName || "Business",
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

  return new Date(value).toLocaleTimeString("en-US", {
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
    <div className={["flex", isMine ? "justify-end" : "justify-start"].join(" ")}>
      <div
        className={[
          "max-w-[78%] rounded-[1.4rem] px-4 py-3 shadow-sm",
          isMine
            ? "rounded-tr-md bg-slate-950 text-white"
            : "rounded-tl-md border border-slate-100 bg-white text-slate-900",
        ].join(" ")}
      >
        <p className="whitespace-pre-wrap break-words text-sm font-semibold leading-6">
          {message.text || "[No text]"}
        </p>

        <div
          className={[
            "mt-2 flex items-center gap-1.5 text-[11px] font-bold",
            isMine ? "justify-end text-slate-300" : "text-slate-400",
          ].join(" ")}
        >
          <span>{formatMessageTime(message)}</span>

          {message.sending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
          {message.failed && <span className="text-rose-500">Failed</span>}
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
        "flex h-9 w-9 items-center justify-center rounded-xl",
        connected ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600",
      ].join(" ")}
      title={connected ? "Connected" : "Offline"}
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
          className="flex animate-pulse gap-3 rounded-2xl bg-white p-3"
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

function EmptySidebar() {
  return (
    <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-6 text-center">
      <MessageCircle className="mx-auto h-8 w-8 text-slate-300" />
      <p className="mt-3 text-sm font-black text-slate-500">
        No conversations
      </p>
      <p className="mt-1 text-xs font-semibold text-slate-400">
        New business messages will appear here.
      </p>
    </div>
  );
}

function EmptyChat({ text }: { text: string }) {
  return (
    <div className="flex h-full min-h-[340px] items-center justify-center">
      <div className="max-w-sm rounded-[2rem] border border-dashed border-slate-200 bg-white/80 p-8 text-center shadow-sm">
        <MessageCircle className="mx-auto h-10 w-10 text-slate-300" />
        <h3 className="mt-4 text-lg font-black text-slate-950">
          No active conversation
        </h3>
        <p className="mt-2 text-sm font-semibold leading-6 text-slate-500">
          {text}
        </p>
      </div>
    </div>
  );
}