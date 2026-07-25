import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Headphones, RefreshCw, Send } from "lucide-react";

import API from "../../api";
import { useAuth } from "../../context/AuthContext";
import AdminHeader from "./AdminsHeader";

type SupportConversation = {
  _id: string;
  name?: string;
  email?: string;
  status: "bot" | "waiting" | "active" | "closed";
  mode: "bot" | "human";
  lastMessageAt?: string;
  lastMessagePreview?: string;
  unreadByAgent?: number;
  assignedTo?: { _id?: string; name?: string } | string | null;
};

type SupportMessage = {
  _id: string;
  senderType: "visitor" | "bot" | "agent" | "system";
  senderName?: string;
  text: string;
  createdAt?: string;
};

function statusLabel(status: string) {
  switch (status) {
    case "waiting":
      return "ממתינה לנציג";
    case "active":
      return "פעילה";
    case "bot":
      return "בוט";
    case "closed":
      return "נסגרה";
    default:
      return status;
  }
}

function statusTone(status: string) {
  switch (status) {
    case "waiting":
      return "bg-amber-100 text-amber-900";
    case "active":
      return "bg-emerald-100 text-emerald-900";
    case "closed":
      return "bg-slate-100 text-slate-600";
    default:
      return "bg-violet-100 text-violet-900";
  }
}

function formatTime(value?: string) {
  if (!value) return "";
  try {
    return new Intl.DateTimeFormat("he-IL", {
      hour: "2-digit",
      minute: "2-digit",
      day: "2-digit",
      month: "2-digit",
    }).format(new Date(value));
  } catch {
    return "";
  }
}

export default function AdminSupportChat() {
  const { user, socket } = useAuth() as {
    user: { name?: string; _id?: string; userId?: string } | null;
    socket: any;
  };

  const [conversations, setConversations] = useState<SupportConversation[]>([]);
  const [onlineAgents, setOnlineAgents] = useState<any[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [messages, setMessages] = useState<SupportMessage[]>([]);
  const [input, setInput] = useState("");
  const [loadingList, setLoadingList] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [filter, setFilter] = useState<"open" | "all" | "waiting" | "active">(
    "open"
  );
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const selected = useMemo(
    () => conversations.find((c) => c._id === selectedId) || null,
    [conversations, selectedId]
  );

  const loadConversations = useCallback(async () => {
    setLoadingList(true);
    setError("");
    try {
      const statusParam =
        filter === "open" ? "all" : filter === "all" ? "all" : filter;
      const { data } = await API.get("/support-chat/admin/conversations", {
        params: { status: statusParam },
      });
      let list: SupportConversation[] = data.conversations || [];
      if (filter === "open") {
        list = list.filter((c) =>
          ["waiting", "active", "bot"].includes(c.status)
        );
      }
      setConversations(list);
      setOnlineAgents(data.onlineAgents || []);
    } catch (err: any) {
      setError(err?.response?.data?.error || "שגיאה בטעינת השיחות");
    } finally {
      setLoadingList(false);
    }
  }, [filter]);

  const loadMessages = useCallback(async (id: string) => {
    setLoadingMessages(true);
    try {
      const { data } = await API.get(`/support-chat/${id}/messages`);
      setMessages(data.messages || []);
      await API.post(`/support-chat/admin/${id}/read`).catch(() => {});
      setConversations((prev) =>
        prev.map((c) => (c._id === id ? { ...c, unreadByAgent: 0 } : c))
      );
    } catch (err: any) {
      setError(err?.response?.data?.error || "שגיאה בטעינת הודעות");
    } finally {
      setLoadingMessages(false);
    }
  }, []);

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  useEffect(() => {
    if (selectedId) loadMessages(selectedId);
  }, [selectedId, loadMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!socket) return;

    const upsertConversation = (conversation: SupportConversation) => {
      if (!conversation?._id) return;
      setConversations((prev) => {
        const rest = prev.filter((c) => c._id !== conversation._id);
        return [conversation, ...rest];
      });
    };

    const onNewMessage = (payload: any) => {
      const conversation = payload?.conversation;
      const message = payload?.message;
      if (conversation) upsertConversation(conversation);
      if (message && String(conversation?._id) === String(selectedId)) {
        setMessages((prev) => {
          if (prev.some((m) => m._id === message._id)) return prev;
          return [...prev, message];
        });
      }
    };

    const onUpdated = (payload: any) => {
      if (payload?.conversation) upsertConversation(payload.conversation);
      if (
        payload?.systemMessage &&
        String(payload.conversation?._id) === String(selectedId)
      ) {
        setMessages((prev) => {
          if (prev.some((m) => m._id === payload.systemMessage._id)) return prev;
          return [...prev, payload.systemMessage];
        });
      }
    };

    const onAgents = (payload: any) => {
      setOnlineAgents(payload?.agents || []);
    };

    socket.emit("joinRoom", "admin-support");
    socket.on("support:newMessage", onNewMessage);
    socket.on("support:conversationUpdated", onUpdated);
    socket.on("support:conversationAssigned", onUpdated);
    socket.on("support:waiting", onUpdated);
    socket.on("support:agentsOnline", onAgents);

    return () => {
      socket.off("support:newMessage", onNewMessage);
      socket.off("support:conversationUpdated", onUpdated);
      socket.off("support:conversationAssigned", onUpdated);
      socket.off("support:waiting", onUpdated);
      socket.off("support:agentsOnline", onAgents);
    };
  }, [socket, selectedId]);

  async function claimConversation(id: string) {
    try {
      const { data } = await API.post(`/support-chat/admin/${id}/claim`);
      if (data.conversation) {
        setConversations((prev) =>
          prev.map((c) => (c._id === id ? data.conversation : c))
        );
      }
      if (data.systemMessage) {
        setMessages((prev) => [...prev, data.systemMessage]);
      }
    } catch (err: any) {
      setError(err?.response?.data?.error || "לא ניתן לקבל את השיחה");
    }
  }

  async function closeConversation(id: string) {
    try {
      const { data } = await API.post(`/support-chat/admin/${id}/close`);
      if (data.conversation) {
        setConversations((prev) =>
          prev.map((c) => (c._id === id ? data.conversation : c))
        );
      }
      if (data.systemMessage) {
        setMessages((prev) => [...prev, data.systemMessage]);
      }
    } catch (err: any) {
      setError(err?.response?.data?.error || "לא ניתן לסגור את השיחה");
    }
  }

  async function sendMessage() {
    const text = input.trim();
    if (!text || !selectedId || sending) return;
    setSending(true);
    setInput("");

    try {
      if (socket?.connected) {
        await new Promise<void>((resolve, reject) => {
          socket.emit(
            "support:sendMessage",
            { conversationId: selectedId, text },
            (ack: any) => {
              if (!ack?.ok) {
                reject(new Error(ack?.error || "send failed"));
                return;
              }
              if (ack.message) {
                setMessages((prev) => {
                  if (prev.some((m) => m._id === ack.message._id)) return prev;
                  return [...prev, ack.message];
                });
              }
              if (ack.conversation) {
                setConversations((prev) =>
                  prev.map((c) =>
                    c._id === selectedId ? ack.conversation : c
                  )
                );
              }
              resolve();
            }
          );
        });
      } else {
        const { data } = await API.post(
          `/support-chat/${selectedId}/messages`,
          { text }
        );
        if (data.message) setMessages((prev) => [...prev, data.message]);
        if (data.conversation) {
          setConversations((prev) =>
            prev.map((c) => (c._id === selectedId ? data.conversation : c))
          );
        }
      }
    } catch (err: any) {
      setError(err?.message || "שליחת ההודעה נכשלה");
      setInput(text);
    } finally {
      setSending(false);
    }
  }

  const waitingCount = conversations.filter((c) => c.status === "waiting").length;

  return (
    <div dir="rtl" className="min-h-screen bg-[#f6f3fb] text-slate-900">
      <AdminHeader />

      <main className="mx-auto max-w-[1480px] px-4 py-6 md:px-8">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="flex items-center gap-2 text-2xl font-black">
              <Headphones className="text-violet-700" size={26} />
              צ׳אט שירות לקוחות
            </h1>
            <p className="mt-1 text-sm font-medium text-slate-500">
              שיחות בזמן אמת מהאתר — כרגע מועברות לאדמין המחובר
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
              נציגים מחוברים: {onlineAgents.length || (socket?.connected ? 1 : 0)}
            </span>
            {waitingCount > 0 && (
              <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-900">
                ממתינות: {waitingCount}
              </span>
            )}
            <button
              type="button"
              onClick={loadConversations}
              className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 shadow-sm"
            >
              <RefreshCw size={14} />
              רענון
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
            {error}
          </div>
        )}

        <div className="grid min-h-[70vh] grid-cols-1 overflow-hidden rounded-[28px] border border-violet-100 bg-white shadow-xl lg:grid-cols-[340px_1fr]">
          <aside className="border-b border-violet-50 lg:border-b-0 lg:border-l">
            <div className="flex gap-1 border-b border-violet-50 p-3">
              {(
                [
                  ["open", "פתוחות"],
                  ["waiting", "ממתינות"],
                  ["active", "פעילות"],
                  ["all", "הכל"],
                ] as const
              ).map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setFilter(key)}
                  className={`rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                    filter === key
                      ? "bg-violet-700 text-white"
                      : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="max-h-[60vh] overflow-y-auto lg:max-h-[calc(70vh-52px)]">
              {loadingList ? (
                <p className="p-4 text-sm text-slate-500">טוען שיחות...</p>
              ) : conversations.length === 0 ? (
                <p className="p-4 text-sm text-slate-500">אין שיחות להצגה</p>
              ) : (
                conversations.map((c) => (
                  <button
                    key={c._id}
                    type="button"
                    onClick={() => setSelectedId(c._id)}
                    className={`w-full border-b border-slate-50 px-4 py-3 text-right transition ${
                      selectedId === c._id
                        ? "bg-violet-50"
                        : "hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-black text-slate-900">
                          {c.name || "אורח"}
                        </p>
                        <p className="text-[11px] font-medium text-slate-500">
                          {c.email || "ללא אימייל"}
                        </p>
                      </div>
                      <div className="text-left">
                        <span
                          className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-bold ${statusTone(
                            c.status
                          )}`}
                        >
                          {statusLabel(c.status)}
                        </span>
                        {!!c.unreadByAgent && (
                          <span className="mt-1 block text-[10px] font-black text-rose-600">
                            {c.unreadByAgent} חדשות
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="mt-2 line-clamp-2 text-xs text-slate-600">
                      {c.lastMessagePreview || "—"}
                    </p>
                    <p className="mt-1 text-[10px] text-slate-400">
                      {formatTime(c.lastMessageAt)}
                    </p>
                  </button>
                ))
              )}
            </div>
          </aside>

          <section className="flex min-h-[60vh] flex-col">
            {!selected ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-2 p-8 text-center text-slate-500">
                <Headphones size={36} className="text-violet-300" />
                <p className="text-sm font-bold">בחרו שיחה מהרשימה</p>
                <p className="text-xs">
                שלום {user?.name || "מנהל"} — שיחות חדשות יופיעו כאן בזמן אמת
                </p>
              </div>
            ) : (
              <>
                <header className="flex flex-wrap items-center justify-between gap-3 border-b border-violet-50 px-5 py-4">
                  <div>
                    <h2 className="text-lg font-black">
                      {selected.name || "אורח"}
                    </h2>
                    <p className="text-xs font-medium text-slate-500">
                      {selected.email || "—"} · {statusLabel(selected.status)}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selected.status === "waiting" && (
                      <button
                        type="button"
                        onClick={() => claimConversation(selected._id)}
                        className="rounded-xl bg-emerald-600 px-3 py-2 text-xs font-bold text-white"
                      >
                        קבל שיחה
                      </button>
                    )}
                    {selected.status !== "closed" && (
                      <button
                        type="button"
                        onClick={() => closeConversation(selected._id)}
                        className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700"
                      >
                        סגור שיחה
                      </button>
                    )}
                  </div>
                </header>

                <div className="min-h-0 flex-1 space-y-3 overflow-y-auto bg-[#faf8ff] px-5 py-4">
                  {loadingMessages ? (
                    <p className="text-sm text-slate-500">טוען הודעות...</p>
                  ) : (
                    messages.map((msg) => {
                      if (msg.senderType === "system") {
                        return (
                          <div
                            key={msg._id}
                            className="text-center text-[11px] font-medium text-slate-500"
                          >
                            {msg.text}
                          </div>
                        );
                      }

                      const mine = msg.senderType === "agent";
                      return (
                        <div
                          key={msg._id}
                          className={`flex ${mine ? "justify-start" : "justify-end"}`}
                        >
                          <div
                            className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm ${
                              mine
                                ? "rounded-br-sm bg-violet-700 text-white"
                                : msg.senderType === "bot"
                                  ? "rounded-bl-sm border border-slate-200 bg-white text-slate-800"
                                  : "rounded-bl-sm border border-emerald-100 bg-emerald-50 text-slate-800"
                            }`}
                          >
                            <p className="mb-1 text-[10px] font-bold opacity-80">
                              {msg.senderType === "visitor"
                                ? selected.name || "לקוח"
                                : msg.senderType === "bot"
                                  ? "בוט"
                                  : msg.senderName || "נציג"}
                            </p>
                            <p className="whitespace-pre-wrap break-words">
                              {msg.text}
                            </p>
                            <p className="mt-1 text-[10px] opacity-70">
                              {formatTime(msg.createdAt)}
                            </p>
                          </div>
                        </div>
                      );
                    })
                  )}
                  <div ref={messagesEndRef} />
                </div>

                <footer className="border-t border-violet-50 bg-white px-4 py-3">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={input}
                      disabled={selected.status === "closed" || sending}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                      placeholder={
                        selected.status === "closed"
                          ? "השיחה סגורה"
                          : "כתבו תשובה ללקוח..."
                      }
                      className="h-11 flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none focus:border-violet-300 focus:ring-2 focus:ring-violet-100 disabled:opacity-50"
                    />
                    <button
                      type="button"
                      onClick={sendMessage}
                      disabled={
                        !input.trim() ||
                        selected.status === "closed" ||
                        sending
                      }
                      className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-700 text-white transition hover:bg-violet-800 disabled:opacity-40"
                      aria-label="שליחה"
                    >
                      <Send size={16} className="-scale-x-100" />
                    </button>
                  </div>
                </footer>
              </>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
