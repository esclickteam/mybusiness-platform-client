"use client";

import React, {
  useEffect,
  useReducer,
  useRef,
  useState,
} from "react";
import { v4 as uuidv4 } from "uuid";

import API from "../api";
import BizuplyLoader from "./ui/BizuplyLoader";
import { useSocket } from "../context/socketContext";
import { useNotifications } from "../context/NotificationsContext";

/* =====================================================
   TYPES
===================================================== */

type ConversationType = "user-business" | "business-business" | string;

type ChatMessage = {
  _id: string;
  tempId?: string | null;
  conversationId?: string;
  fromId?: string;
  toId?: string;
  from?: string;
  to?: string;
  text: string;
  content?: string;
  timestamp: string;
  createdAt?: string;
  sending?: boolean;
  failed?: boolean;
  [key: string]: unknown;
};

type RawMessage = Partial<ChatMessage> & {
  _id?: string;
  tempId?: string | null;
};

type MessagesAction =
  | {
      type: "set";
      payload: ChatMessage[];
    }
  | {
      type: "append";
      payload: ChatMessage;
    }
  | {
      type: "updateStatus";
      payload: {
        id: string;
        updates: Partial<ChatMessage>;
      };
    };

type BusinessChatTabProps = {
  conversationId: string;
  businessId: string;
  customerId: string;
  customerName: string;
  conversationType?: ConversationType;
};

type SendAck = {
  ok?: boolean;
  message?: Partial<ChatMessage>;
};

type TypingPayload = {
  from?: string;
};

/* =====================================================
   NORMALIZE MESSAGE
===================================================== */

function normalize(msg: RawMessage): ChatMessage {
  const fallbackId = msg.tempId || uuidv4();

  return {
    ...msg,
    _id: String(msg._id || fallbackId),
    tempId: msg.tempId || null,
    text: msg.text || msg.content || "",
    timestamp: msg.createdAt || msg.timestamp || new Date().toISOString(),
  };
}

/* =====================================================
   DEDUPE HELPER
===================================================== */

function isSameMessage(a: ChatMessage, b: ChatMessage) {
  return (
    a._id === b._id ||
    a.tempId === b.tempId ||
    a._id === b.tempId ||
    a.tempId === b._id
  );
}

/* =====================================================
   REDUCER
===================================================== */

function messagesReducer(
  state: ChatMessage[],
  action: MessagesAction
): ChatMessage[] {
  switch (action.type) {
    case "set": {
      const unique: ChatMessage[] = [];

      action.payload.forEach((msg) => {
        const exists = unique.some((item) => isSameMessage(item, msg));
        if (!exists) unique.push(msg);
      });

      return unique;
    }

    case "append": {
      const exists = state.some((item) => isSameMessage(item, action.payload));
      if (exists) return state;

      return [...state, action.payload];
    }

    case "updateStatus": {
      return state.map((msg) => {
        const match = msg._id === action.payload.id || msg.tempId === action.payload.id;

        if (!match) return msg;

        return {
          ...msg,
          ...action.payload.updates,
        };
      });
    }

    default:
      return state;
  }
}

/* =====================================================
   COMPONENT
===================================================== */

export default function BusinessChatTab({
  conversationId,
  businessId,
  customerId,
  customerName,
  conversationType = "user-business",
}: BusinessChatTabProps) {
  const socket = useSocket() as any;
  const { addNotification } = useNotifications() as any;

  const [messages, dispatch] = useReducer(messagesReducer, []);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [historyError, setHistoryError] = useState("");

  const listRef = useRef<HTMLDivElement | null>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* =====================================================
     LOAD HISTORY
  ===================================================== */

  useEffect(() => {
    if (!conversationId) {
      dispatch({ type: "set", payload: [] });
      return;
    }

    let cancelled = false;

    async function loadHistory() {
      try {
        setIsLoadingHistory(true);
        setHistoryError("");

        const res = await API.get(`/messages/${conversationId}/history`, {
          params: {
            page: 0,
            limit: 50,
          },
        });

        if (cancelled) return;

        const rawMessages: RawMessage[] = Array.isArray(res.data?.messages)
          ? res.data.messages
          : Array.isArray(res.data)
            ? res.data
            : [];

        dispatch({
          type: "set",
          payload: rawMessages.map(normalize),
        });
      } catch (err) {
        console.error("History load error:", err);

        if (!cancelled) {
          setHistoryError("Could not load messages");
        }
      } finally {
        if (!cancelled) {
          setIsLoadingHistory(false);
        }
      }
    }

    loadHistory();

    return () => {
      cancelled = true;
    };
  }, [conversationId]);

  /* =====================================================
     SOCKET EVENTS
  ===================================================== */

  useEffect(() => {
    if (!socket || !conversationId) return;

    const join = () => {
      socket.emit("joinRoom", conversationId);
    };

    socket.on("connect", join);

    if (socket.connected) {
      join();
    }

    const handleMessage = (msg: RawMessage) => {
      const safe = normalize(msg);
      dispatch({ type: "append", payload: safe });
    };

    const handleTyping = ({ from }: TypingPayload) => {
      if (String(from) !== String(customerId)) return;

      setIsTyping(true);

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      typingTimeoutRef.current = setTimeout(() => {
        setIsTyping(false);
      }, 1800);
    };

    socket.on("newMessage", handleMessage);
    socket.on("typing", handleTyping);

    return () => {
      socket.off("connect", join);
      socket.off("newMessage", handleMessage);
      socket.off("typing", handleTyping);

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      socket.emit("leaveRoom", conversationId);
    };
  }, [socket, conversationId, customerId]);

  /* =====================================================
     AUTO SCROLL
  ===================================================== */

  useEffect(() => {
    const el = listRef.current;
    if (!el) return;

    el.scrollTop = el.scrollHeight;
  }, [messages, isTyping]);

  /* =====================================================
     SEND MESSAGE
  ===================================================== */

  const sendMessage = () => {
    if (!input.trim() || sending || !socket) return;

    const tempId = uuidv4();
    const text = input.trim();

    setSending(true);

    dispatch({
      type: "append",
      payload: {
        _id: tempId,
        tempId,
        conversationId,
        fromId: businessId,
        toId: customerId,
        text,
        timestamp: new Date().toISOString(),
        sending: true,
      },
    });

    setInput("");

    socket.emit(
      "sendMessage",
      {
        conversationId,
        from: businessId,
        to: customerId,
        text,
        tempId,
        conversationType,
      },
      (ack: SendAck = {}) => {
        setSending(false);

        const ok = Boolean(ack.ok);

        dispatch({
          type: "updateStatus",
          payload: {
            id: tempId,
            updates: {
              sending: false,
              failed: !ok,
              ...(ack.message || {}),
            },
          },
        });

        if (!ok && addNotification) {
          addNotification({
            type: "error",
            title: "Message failed",
            message: "Could not send the message. Please try again.",
          });
        }
      }
    );
  };

  const handleInputChange = (value: string) => {
    setInput(value);

    if (!socket || !conversationId || !businessId) return;

    socket.emit("typing", {
      conversationId,
      from: businessId,
    });
  };

  const sorted = [...messages].sort((a, b) => {
    return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
  });

  const formatTime = (ts: string) => {
    const date = new Date(ts);

    if (Number.isNaN(date.getTime())) return "";

    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  /* =====================================================
     LOADING BUSINESS
  ===================================================== */

  if (!businessId) {
    return <BizuplyLoader fullScreen label="Loading chat..." />;
  }

  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <div className="flex h-full min-h-[72vh] flex-col bg-slate-50">
      {/* HEADER */}
      <header className="border-b border-slate-200 bg-white px-4 py-4 sm:px-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-blue-600 text-lg font-black text-white shadow-lg shadow-violet-500/20">
              {customerName?.charAt(0)?.toUpperCase() || "C"}
            </div>

            <div className="min-w-0">
              <h3 className="truncate text-lg font-black text-slate-950">
                {customerName || "Client"}
              </h3>

              <div className="mt-1 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                <p className="text-xs font-bold text-slate-500">
                  Client conversation
                </p>
              </div>
            </div>
          </div>

          <div className="hidden rounded-full bg-slate-100 px-3 py-1.5 text-xs font-black text-slate-500 sm:inline-flex">
            {conversationType}
          </div>
        </div>
      </header>

      {/* HISTORY ERROR */}
      {historyError && (
        <div className="border-b border-rose-100 bg-rose-50 px-4 py-3 text-sm font-bold text-rose-700 sm:px-6">
          {historyError}
        </div>
      )}

      {/* MESSAGES */}
      <div
        ref={listRef}
        className="min-h-0 flex-1 space-y-3 overflow-y-auto px-4 py-5 sm:px-6"
      >
        {isLoadingHistory ? (
          <div className="flex h-full min-h-[45vh] flex-col items-center justify-center text-center">
            <BizuplyLoader size="lg" label="Loading messages..." />
          </div>
        ) : sorted.length > 0 ? (
          sorted.map((message, index) => {
            const isMine =
              String(message.fromId || message.from) === String(businessId);

            return (
              <div
                key={`${message._id}-${message.tempId || "msg"}-${index}`}
                className={[
                  "flex w-full",
                  isMine ? "justify-end" : "justify-start",
                ].join(" ")}
              >
                <div
                  className={[
                    "max-w-[82%] rounded-[1.35rem] px-4 py-3 shadow-sm sm:max-w-[70%]",
                    isMine
                      ? "rounded-br-md bg-slate-950 text-white"
                      : "rounded-bl-md border border-slate-200 bg-white text-slate-900",
                    message.failed ? "border border-rose-300 bg-rose-50 text-rose-700" : "",
                    message.sending ? "opacity-75" : "",
                  ].join(" ")}
                >
                  <p className="whitespace-pre-wrap break-words text-sm font-medium leading-6">
                    {message.text}
                  </p>

                  <div
                    className={[
                      "mt-2 flex items-center justify-end gap-2 text-[11px] font-bold",
                      isMine ? "text-white/55" : "text-slate-400",
                      message.failed ? "text-rose-500" : "",
                    ].join(" ")}
                  >
                    {message.sending && <span>Sending...</span>}
                    {message.failed && <span>Failed</span>}
                    <span>{formatTime(message.timestamp)}</span>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex h-full min-h-[45vh] flex-col items-center justify-center px-6 text-center">
            <div className="relative">
              <div className="absolute inset-0 rounded-[2rem] bg-violet-300/30 blur-2xl" />
              <div className="relative flex h-20 w-20 items-center justify-center rounded-[2rem] bg-white text-4xl shadow-xl">
                💬
              </div>
            </div>

            <h3 className="mt-6 text-2xl font-black tracking-tight text-slate-950">
              No messages yet
            </h3>

            <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
              Start the conversation by sending your first message to the
              client.
            </p>
          </div>
        )}

        {isTyping && (
          <div className="flex justify-start">
            <div className="rounded-[1.35rem] rounded-bl-md border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-500 shadow-sm">
              Client is typing...
            </div>
          </div>
        )}
      </div>

      {/* INPUT */}
      <footer className="border-t border-slate-200 bg-white px-4 py-4 sm:px-6">
        <div className="flex items-end gap-3 rounded-[1.5rem] border border-slate-200 bg-slate-50 p-2 shadow-sm transition focus-within:border-violet-300 focus-within:ring-4 focus-within:ring-violet-100">
          <textarea
            value={input}
            placeholder="Type a message..."
            rows={1}
            onChange={(e) => handleInputChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
            className="max-h-32 min-h-11 flex-1 resize-none bg-transparent px-3 py-3 text-sm font-medium leading-5 text-slate-950 outline-none placeholder:text-slate-400"
          />

          <button
            type="button"
            onClick={sendMessage}
            disabled={sending || !input.trim()}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-lg font-black text-white shadow-lg shadow-slate-950/20 transition hover:-translate-y-0.5 hover:bg-violet-700 disabled:cursor-not-allowed disabled:translate-y-0 disabled:opacity-50"
            aria-label="Send message"
          >
            ➤
          </button>
        </div>

        <p className="mt-2 text-center text-[11px] font-bold text-slate-400">
          Press Enter to send · Shift + Enter for a new line
        </p>
      </footer>
    </div>
  );
}